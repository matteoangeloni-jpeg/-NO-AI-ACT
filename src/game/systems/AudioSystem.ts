import { StateManager } from './StateManager';
import { buildTheme, type ThemeHandle } from './musicThemes';
import { AudioBank } from './audioBank';
import { MUSIC_TRIM, SFX_TRIM, type MusicRole, type SfxCue } from './audioAssets';

/**
 * Livelli della catena audio. Esportati perché lo smoke audio renda i temi
 * con gli STESSI guadagni del gioco: misurare la saturazione su una catena
 * inventata direbbe poco, e ricopiare qui i numeri li farebbe divergere il
 * giorno che cambiano.
 */
export const MASTER_VOLUME = 0.5;
export const THEME_VOLUME = 0.9;

/** Durata dell'incrocio fra due tracce musicali, in secondi. */
export const CROSSFADE_SECONDS = 1.6;

/**
 * Catena audio del gioco.
 *
 *   effetti (campione o sintesi) → sfxGain   ┐
 *   musica  (campione o sintesi) → musicGain ┴→ master → destination
 *
 * Il mute globale agisce sul master e taglia tutto; musicGain e sfxGain
 * hanno un volume e un interruttore propri.
 *
 * DUE MONDI, UNA INTERFACCIA. Il gioco è nato senza file: musica ed effetti
 * erano generati dalla Web Audio API. Ora può suonare campioni registrati,
 * ma la sintesi non è stata tolta — è diventata il ripiego. Chi chiama non
 * sa quale dei due sta sentendo: chiede un RUOLO musicale o un GESTO, e
 * questo oggetto usa il campione se c'è e la sintesi se non c'è. Un file
 * mancante degrada il suono, non lo spegne, e questo vale anche in
 * produzione.
 */
class AudioSystemImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentTheme: { id: string; handle: ThemeHandle } | null = null;
  /** Traccia campionata in corso, se il ruolo corrente ne ha una. */
  private currentTrack: { role: MusicRole; src: AudioBufferSourceNode; gain: GainNode } | null = null;
  /** Ultimo ruolo chiesto e tema di ripiego, per riprovare a fine caricamento. */
  private pendingRole: { role: MusicRole; fallbackThemeId?: string } | null = null;

  /** Da chiamare dopo il primo gesto utente (policy autoplay dei browser). */
  init(): void {
    if (this.ctx) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = StateManager.audioMuted ? 0 : MASTER_VOLUME;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = StateManager.musicEnabled ? StateManager.musicVolume : 0;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = StateManager.sfxEnabled ? StateManager.sfxVolume : 0;
    this.sfxGain.connect(this.master);
    StateManager.on('audio-muted-changed', (muted: boolean) => {
      if (this.master && this.ctx) {
        this.master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_VOLUME, this.ctx.currentTime + 0.1);
      }
    });

    /**
     * I campioni si scaricano solo ora. Prima del primo gesto non si
     * potrebbero comunque suonare (policy di autoplay), e chi apre la
     * pagina per leggere e se ne va non deve pagare il download.
     * Al termine, se nel frattempo è stato chiesto un ruolo musicale,
     * si riparte con il campione al posto della sintesi.
     */
    void AudioBank.load(this.ctx).then(() => {
      if (this.pendingRole) this.applyRole(this.pendingRole, true);
    });
  }

  toggleMute(): boolean {
    const next = !StateManager.audioMuted;
    StateManager.setAudioMuted(next);
    return next;
  }

  /** Volume musica 0..1, persistito nelle preferenze. */
  setMusicVolume(volume: number): void {
    const v = Math.max(0, Math.min(1, volume));
    StateManager.setMusicVolume(v);
    this.applyMusicGain();
  }

  /** Volume effetti 0..1, indipendente dalla musica. */
  setSfxVolume(volume: number): void {
    StateManager.setSfxVolume(Math.max(0, Math.min(1, volume)));
    this.applySfxGain();
  }

  /**
   * Musica accesa o spenta. Spenta non è "volume a zero": la traccia viene
   * fermata davvero, così non gira muta consumando corrente per niente.
   * Riaccendendola riparte il ruolo corrente, non quello di quando è stata
   * spenta.
   */
  setMusicEnabled(enabled: boolean): void {
    StateManager.setMusicEnabled(enabled);
    this.applyMusicGain();
    if (!enabled) {
      this.stopTrack(0.3);
      this.disposeTheme(0.3);
    } else if (this.pendingRole) {
      this.applyRole(this.pendingRole, true);
    }
  }

  setSfxEnabled(enabled: boolean): void {
    StateManager.setSfxEnabled(enabled);
    this.applySfxGain();
  }

  private applyMusicGain(): void {
    if (!this.musicGain || !this.ctx) return;
    const target = StateManager.musicEnabled ? StateManager.musicVolume : 0;
    this.musicGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.15);
  }

  private applySfxGain(): void {
    if (!this.sfxGain || !this.ctx) return;
    const target = StateManager.sfxEnabled ? StateManager.sfxVolume : 0;
    this.sfxGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.15);
  }

  // ---------------------------------------------------------------- musica

  /**
   * LA SOLA COSA CHE UNA SCENA DEVE CHIAMARE per la musica.
   *
   * Si dichiara il MOMENTO DEL PROCEDIMENTO — sto leggendo un fascicolo,
   * sto decidendo, sto ricevendo il giudizio — non un file e non un brano.
   * Se il campione di quel ruolo è stato caricato, suona quello in loop con
   * un incrocio morbido sulla traccia precedente. Se non c'è, suona il tema
   * sintetizzato del caso: è il comportamento che il gioco ha sempre avuto
   * e resta identico.
   *
   * `fallbackThemeId` è il tema procedurale da usare senza campione
   * (l'id del caso, o 'city' per la mappa). Va passato dalla scena perché
   * è la scena a sapere di che caso si tratta.
   */
  setMusicRole(role: MusicRole, fallbackThemeId?: string): void {
    this.pendingRole = { role, fallbackThemeId };
    this.applyRole(this.pendingRole, false);
  }

  private applyRole(req: { role: MusicRole; fallbackThemeId?: string }, force: boolean): void {
    if (!this.ctx || !this.musicGain) return;
    if (!StateManager.musicEnabled) return;
    const buffer = AudioBank.music(req.role);
    if (!buffer) {
      // Nessun campione: il mondo procedurale di sempre. Senza nemmeno un
      // tema di ripiego il ruolo è muto per costruzione (il menu lo era
      // anche prima) e allora va ZITTITO ciò che suonava: lasciar correre
      // la traccia della schermata precedente sarebbe peggio del silenzio.
      if (req.fallbackThemeId) this.crossfadeToTheme(req.fallbackThemeId);
      else this.disposeTheme(0.8);
      this.stopTrack(0.8);
      return;
    }
    if (!force && this.currentTrack?.role === req.role) return;
    // un campione ha vinto: il tema sintetizzato si ritira nello stesso tempo
    this.disposeTheme(CROSSFADE_SECONDS);
    this.stopTrack(CROSSFADE_SECONDS);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(MUSIC_TRIM[req.role], this.ctx.currentTime + CROSSFADE_SECONDS);
    gain.connect(this.musicGain);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(gain);
    src.start();
    this.currentTrack = { role: req.role, src, gain };
  }

  /** Ruolo musicale in corso, per i controlli. */
  get currentMusicRole(): MusicRole | null {
    return this.currentTrack?.role ?? this.pendingRole?.role ?? null;
  }

  /** Vero quando quello che si sente è un campione, non la sintesi. */
  get playingSample(): boolean {
    return this.currentTrack !== null;
  }

  private stopTrack(fadeSeconds: number): void {
    if (!this.currentTrack || !this.ctx) return;
    const { src, gain } = this.currentTrack;
    this.currentTrack = null;
    const t = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(0.0001, t + fadeSeconds);
    // fermare la sorgente solo a dissolvenza finita: fermarla subito
    // produrrebbe il click che l'incrocio serve a evitare
    setTimeout(() => {
      try {
        src.stop();
      } catch {
        /* già ferma */
      }
      src.disconnect();
      gain.disconnect();
    }, fadeSeconds * 1000 + 120);
  }

  /**
   * Silenzio deliberato. Dopo una decisione grave il vuoto dice più di
   * qualunque effetto; `setMusicRole` fa ripartire la musica quando la
   * scena successiva dichiara il proprio ruolo.
   */
  silence(fadeSeconds = 0.6): void {
    this.pendingRole = null;
    this.stopTrack(fadeSeconds);
    this.disposeTheme(fadeSeconds);
  }

  /** Avvia il tema del caso (o 'city' per la mappa). No-op se già attivo. */
  playLevelTheme(themeId: string): void {
    if (!this.ctx || !this.musicGain) return;
    if (this.currentTheme?.id === themeId) return;
    this.disposeTheme(0.1);
    const handle = buildTheme(this.ctx, this.musicGain, themeId);
    handle.gain.gain.linearRampToValueAtTime(THEME_VOLUME, this.ctx.currentTime + 1.2);
    this.currentTheme = { id: themeId, handle };
  }

  /** Crossfade morbido dal tema corrente a quello richiesto. */
  crossfadeToTheme(themeId: string): void {
    if (!this.ctx || !this.musicGain) return;
    if (this.currentTheme?.id === themeId) return;
    this.disposeTheme(1.0);
    const handle = buildTheme(this.ctx, this.musicGain, themeId);
    handle.gain.gain.linearRampToValueAtTime(THEME_VOLUME, this.ctx.currentTime + 1.4);
    this.currentTheme = { id: themeId, handle };
  }

  stopLevelTheme(): void {
    this.disposeTheme(0.8);
  }

  get currentThemeId(): string | null {
    return this.currentTheme?.id ?? null;
  }

  /** Alias storici usati dalle scene della v0.1. */
  startDrone(): void {
    this.playLevelTheme('city');
  }

  stopDrone(): void {
    this.stopLevelTheme();
  }

  private disposeTheme(fadeSeconds: number): void {
    if (!this.currentTheme || !this.ctx) return;
    const { handle } = this.currentTheme;
    this.currentTheme = null;
    handle.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    handle.gain.gain.setValueAtTime(handle.gain.gain.value, this.ctx.currentTime);
    handle.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + fadeSeconds);
    setTimeout(() => handle.dispose(), fadeSeconds * 1000 + 100);
  }

  // ------------------------------------------------------------------ sfx

  /**
   * UN GESTO, UN SUONO. Ogni voce qui sotto prende il campione se c'è e
   * ricade sulla sintesi se non c'è, quindi chi chiama non deve mai
   * chiedersi quale dei due mondi è attivo.
   *
   * I ripieghi non sono scelti a caso: sono il suono che quel gesto aveva
   * prima che esistessero i campioni. Dove il gesto è nuovo — citare un
   * reperto, poter procedere — il ripiego è il segnale esistente più
   * vicino di significato, mai un silenzio.
   */

  /** Click UI: impulso breve e secco. */
  click(): void {
    if (this.sample('uiClick')) return;
    this.blip(880, 0.04, 'square', 0.12);
  }

  /** Hover o fuoco su un pulsante: deve quasi non sentirsi. */
  hover(): void {
    if (this.sample('uiHover')) return;
    this.blip(1400, 0.02, 'sine', 0.025);
  }

  /** Conferma: due note ascendenti. */
  confirm(): void {
    this.blip(523, 0.07, 'triangle', 0.2);
    this.blipAt(784, 0.09, 'triangle', 0.2, 0.08);
  }

  /** Errore: bicordo dissonante discendente. */
  error(): void {
    this.blip(220, 0.18, 'sawtooth', 0.18);
    this.blipAt(208, 0.22, 'sawtooth', 0.14, 0.02);
  }

  /** Alert istituzionale: tono ribattuto. */
  alert(): void {
    this.blip(660, 0.1, 'square', 0.15);
    this.blipAt(660, 0.1, 'square', 0.15, 0.16);
  }

  /** Sblocco carta norma: arpeggio. */
  unlock(): void {
    if (this.sample('openLegalArchive')) return;
    [523, 659, 784, 1047].forEach((f, i) => this.blipAt(f, 0.12, 'triangle', 0.18, i * 0.09));
  }

  /** Apertura di un fascicolo. */
  openCase(): void {
    if (this.sample('openCase')) return;
    this.blip(330, 0.09, 'triangle', 0.16);
    this.blipAt(440, 0.11, 'triangle', 0.14, 0.07);
  }

  /** Consultazione dell'archivio delle norme. */
  openLegalArchive(): void {
    if (this.sample('openLegalArchive')) return;
    this.blip(392, 0.1, 'triangle', 0.15);
    this.blipAt(587, 0.12, 'triangle', 0.13, 0.08);
  }

  /** Citazione di un reperto: il gesto centrale del gioco. */
  citeEvidence(): void {
    if (this.sample('citeEvidence')) return;
    this.blip(147, 0.06, 'square', 0.22);
    this.blipAt(98, 0.1, 'triangle', 0.18, 0.01);
  }

  /** Decisione registrata, passaggio fra i quattro punti del rapporto. */
  registerDecision(): void {
    if (this.sample('registerDecision')) return;
    this.blip(262, 0.07, 'square', 0.18);
    this.blipAt(196, 0.12, 'triangle', 0.15, 0.05);
  }

  /** Requisiti minimi raggiunti: da qui si può procedere. */
  canProceed(): void {
    if (this.sample('canProceed')) return;
    this.blip(659, 0.08, 'triangle', 0.16);
    this.blipAt(880, 0.12, 'triangle', 0.16, 0.09);
  }

  /** Esito conforme: il timbro. */
  stampConforme(): void {
    if (this.sample('stampConforme')) return;
    this.confirm();
  }

  /** Esito contestabile o scelta errata. */
  errorContestable(): void {
    if (this.sample('errorContestable')) return;
    this.error();
  }

  /** Sistema opaco, contraddizione, anomalia. */
  glitchOpacity(): void {
    if (this.sample('glitchOpacity')) return;
    this.blip(90 + Math.random() * 40, 0.05, 'sawtooth', 0.16);
    this.blipAt(1500 + Math.random() * 900, 0.02, 'square', 0.1, 0.04);
    this.blipAt(70, 0.14, 'sawtooth', 0.12, 0.07);
  }

  /**
   * Suona un campione, se c'è. Restituisce false quando non c'è, così chi
   * chiama può ripiegare sulla sintesi con un `if` e una riga sola.
   */
  private sample(cue: SfxCue): boolean {
    if (!this.ctx || !this.sfxGain) return false;
    if (!StateManager.sfxEnabled) return true; // spento: niente suono, e nessun ripiego
    const buffer = AudioBank.sfx(cue);
    if (!buffer) return false;
    const gain = this.ctx.createGain();
    gain.gain.value = SFX_TRIM[cue];
    gain.connect(this.sfxGain);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(gain);
    // Gli effetti si sovrappongono fra loro e alla musica: ogni chiamata
    // crea la propria sorgente e la smonta da sé a fine riproduzione.
    src.onended = () => {
      src.disconnect();
      gain.disconnect();
    };
    src.start();
    return true;
  }

  /** Ticchettio da terminale per il typewriter. */
  terminal(): void {
    this.blip(1200 + Math.random() * 600, 0.012, 'square', 0.03);
  }

  private blip(freq: number, dur: number, type: OscillatorType, vol: number): void {
    this.blipAt(freq, dur, type, vol, 0);
  }

  private blipAt(freq: number, dur: number, type: OscillatorType, vol: number, delay: number): void {
    if (!this.ctx || !this.master) return;
    // Anche la sintesi passa dal bus degli effetti: altrimenti il cursore
    // "volume effetti" governerebbe solo metà dei suoni, e quale metà
    // dipenderebbe da quali file sono stati copiati.
    const bus = this.sfxGain ?? this.master;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
}

export const AudioSystem = new AudioSystemImpl();

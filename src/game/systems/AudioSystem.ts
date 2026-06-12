import { StateManager } from './StateManager';
import { buildTheme, type ThemeHandle } from './musicThemes';

const MASTER_VOLUME = 0.5;
const THEME_VOLUME = 0.9;

/**
 * Audio interamente procedurale via Web Audio API (nessun file esterno).
 * Catena: sorgenti SFX → master → destination
 *         temi musicali → musicGain (volume musica) → master → destination
 * Il mute globale agisce sul master; il volume musica solo sui temi.
 */
class AudioSystemImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private currentTheme: { id: string; handle: ThemeHandle } | null = null;

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
    this.musicGain.gain.value = StateManager.musicVolume;
    this.musicGain.connect(this.master);
    StateManager.on('audio-muted-changed', (muted: boolean) => {
      if (this.master && this.ctx) {
        this.master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_VOLUME, this.ctx.currentTime + 0.1);
      }
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
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.15);
    }
  }

  // ---------------------------------------------------------------- musica

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

  /** Click UI: impulso breve e secco. */
  click(): void {
    this.blip(880, 0.04, 'square', 0.12);
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
    [523, 659, 784, 1047].forEach((f, i) => this.blipAt(f, 0.12, 'triangle', 0.18, i * 0.09));
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
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
}

export const AudioSystem = new AudioSystemImpl();

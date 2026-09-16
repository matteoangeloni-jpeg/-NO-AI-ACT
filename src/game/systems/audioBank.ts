import {
  SFX_CUES,
  musicPath,
  sfxPath,
  type MusicRole,
  type SfxCue
} from './audioAssets';

/**
 * BANCO DEI CAMPIONI.
 *
 * Scarica e decodifica una volta sola i file dichiarati nel manifesto, e
 * risponde a una domanda soltanto: «ce l'hai questo suono?».
 *
 * Il punto delicato è cosa fare quando la risposta è no. Qui un file
 * mancante NON è un errore: è la condizione normale di un progetto che per
 * tutta la sua vita ha generato l'audio con la Web Audio API e che i
 * campioni li ha aggiunti dopo.
 *
 * Un campione non consegnato non viene nemmeno CHIESTO: il manifesto sa
 * già, da quando si è compilato, quali file esistono, e per gli altri non
 * restituisce un indirizzo. Così la console resta pulita davvero, invece
 * che pulita per modo di dire — un 404 previsto che finisce in console è
 * rumore che nasconde i 404 veri. Resta il caso del file che c'è ma non si
 * lascia leggere (troncato, formato non gestito da quel browser): anche
 * quello finisce fra gli assenti, in silenzio.
 *
 * Il caricamento parte DOPO il primo gesto dell'utente: la policy di
 * autoplay non permette comunque di suonare prima, e chi apre la pagina per
 * leggere e se ne va non deve pagare il download.
 *
 * E non si scarica tutto. Gli EFFETTI sì, subito: sono dieci file per circa
 * 270 KB in tutto, servono entro il primo secondo di gioco e aspettarli
 * significherebbe un click muto. Le MUSICHE no: sono sette loop da un
 * minuto, 1,4 MB l'uno, e una sessione ne attraversa due o tre. Scaricarle
 * tutte al primo clic sono quasi 10 MB — su una connessione scolastica da
 * 4 Mbps, venti secondi di attesa per roba che in buona parte non verrà mai
 * ascoltata. Ogni musica arriva quando la sua fase comincia; nel frattempo
 * suona il tema sintetizzato, quindi l'attesa non è mai silenzio.
 */

type BankKey = `music:${MusicRole}` | `sfx:${SfxCue}`;

const buffers = new Map<BankKey, AudioBuffer>();
const missing = new Set<BankKey>();
let loading: Promise<void> | null = null;
/** Una promessa per ogni musica già chiesta: niente doppi download. */
const musicLoads = new Map<BankKey, Promise<void>>();

async function fetchOne(ctx: AudioContext, key: BankKey, url: string | null): Promise<void> {
  // Nessun indirizzo: quel campione non è stato consegnato. Non si chiede
  // niente a nessuno e non si scrive niente da nessuna parte.
  if (!url) {
    missing.add(key);
    return;
  }
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) {
      missing.add(key);
      return;
    }
    const bytes = await res.arrayBuffer();
    // Un file presente ma illeggibile (troncato, formato non supportato dal
    // browser) è indistinguibile da uno assente dal punto di vista di chi
    // ascolta: in entrambi i casi si ripiega sul suono procedurale.
    buffers.set(key, await ctx.decodeAudioData(bytes));
  } catch {
    missing.add(key);
  }
}

export const AudioBank = {
  /**
   * Carica gli EFFETTI, tutti. Si può chiamare più volte: la seconda
   * restituisce la promessa della prima invece di riscaricare.
   */
  load(ctx: AudioContext): Promise<void> {
    if (loading) return loading;
    const jobs = SFX_CUES.map((cue) => fetchOne(ctx, `sfx:${cue}`, sfxPath(cue)));
    loading = Promise.all(jobs).then(() => undefined);
    return loading;
  },

  /**
   * Scarica la musica di UN ruolo, la prima volta che quella fase comincia.
   * Chiamarla di nuovo per lo stesso ruolo non riscarica niente: restituisce
   * la promessa già in volo, o una già risolta se il file è in memoria.
   */
  ensureMusic(ctx: AudioContext, role: MusicRole): Promise<void> {
    const key: BankKey = `music:${role}`;
    const pending = musicLoads.get(key);
    if (pending) return pending;
    const job = fetchOne(ctx, key, musicPath(role));
    musicLoads.set(key, job);
    return job;
  },

  music(role: MusicRole): AudioBuffer | null {
    return buffers.get(`music:${role}`) ?? null;
  },

  sfx(cue: SfxCue): AudioBuffer | null {
    return buffers.get(`sfx:${cue}`) ?? null;
  },

  /** Quanti campioni sono davvero disponibili. Serve ai controlli. */
  get loadedCount(): number {
    return buffers.size;
  },

  /** Che cosa non è stato trovato. Serve ai controlli e alla diagnosi. */
  get missingKeys(): string[] {
    return [...missing].sort();
  },

  /** Azzera il banco. Solo per i test: il gioco non scarica mai due volte. */
  reset(): void {
    buffers.clear();
    missing.clear();
    musicLoads.clear();
    loading = null;
  }
};

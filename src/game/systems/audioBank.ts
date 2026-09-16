import {
  MUSIC_ROLES,
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
 * Il caricamento parte DOPO il primo gesto dell'utente, insieme al resto
 * dell'audio, per due ragioni: la policy di autoplay dei browser non
 * permette comunque di suonare prima, e chi apre la pagina e legge senza
 * toccare niente non deve scaricare qualche megabyte che non ascolterà.
 */

type BankKey = `music:${MusicRole}` | `sfx:${SfxCue}`;

const buffers = new Map<BankKey, AudioBuffer>();
const missing = new Set<BankKey>();
let loading: Promise<void> | null = null;

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
   * Carica tutto. Si può chiamare più volte: la seconda restituisce la
   * promessa della prima invece di riscaricare.
   */
  load(ctx: AudioContext): Promise<void> {
    if (loading) return loading;
    const jobs: Promise<void>[] = [];
    for (const role of MUSIC_ROLES) jobs.push(fetchOne(ctx, `music:${role}`, musicPath(role)));
    for (const cue of SFX_CUES) jobs.push(fetchOne(ctx, `sfx:${cue}`, sfxPath(cue)));
    loading = Promise.all(jobs).then(() => undefined);
    return loading;
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
    loading = null;
  }
};

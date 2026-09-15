import type { AudienceId, DifficultyMode, GameModeId, OutcomeQuality, SessionMinutes } from './types';
import { PLAYABLE_CASES, getCase } from './cases';
import { SESSION_WARMUP_MINUTES, estimateMinutes, getAudience, planSession } from './audiences';

/**
 * MODALITÀ DI GIOCO.
 *
 * Il pubblico (AudienceId) dice *per chi* è la sessione. Questo modulo dice
 * *come* si gioca, ed è la scelta che si fa premendo NUOVA PARTITA.
 *
 * Nessuna modalità inventa contenuto: tutte compongono i tredici casi che
 * esistono già, in ordini diversi e con regole diverse su chi sceglie il
 * prossimo fascicolo. Cambia il modo di stare davanti alla stessa materia,
 * non la materia.
 *
 * Il tempo resta un BUDGET DICHIARATO, mai un timer: serve a decidere
 * quanti fascicoli proporre, e il gioco non misura né limita il tempo reale
 * di nessuno.
 */
export type { GameModeId };

export interface GameModeData {
  id: GameModeId;
  /** Il profilo (PA, scuola, HR, per conto mio) entra nella composizione. */
  usesAudience: boolean;
  /**
   * true: si parte dalla mappa e si sceglie liberamente, e il piano serve
   * solo a marcare i fascicoli consigliati.
   * false: si parte dal primo fascicolo del piano, in sequenza.
   */
  freeMap: boolean;
  /**
   * Difficoltà che la modalità impone quando la sessione parte; null = la
   * decide il piano a partire da profilo e durata. Resta comunque
   * modificabile dalle impostazioni a partita avviata: è una scelta del
   * giocatore, non un vincolo che il gioco difende.
   */
  forcedDifficulty: DifficultyMode | null;
}

export const GAME_MODES: GameModeData[] = [
  // Il turno di servizio è la modalità storica del gioco: un percorso
  // composto per il profilo scelto, giocato in sequenza.
  { id: 'turno', usesAudience: true, freeMap: false, forcedDifficulty: null },
  // Indagine libera: la città è aperta, la durata dice solo quanti
  // fascicoli conviene chiudere in una seduta.
  { id: 'libera', usesAudience: true, freeMap: true, forcedDifficulty: null },
  // Ispezione a sorpresa: i fascicoli arrivano in ordine estratto, senza
  // riguardo per il profilo, e senza sconti sulla difficoltà.
  { id: 'sorpresa', usesAudience: false, freeMap: false, forcedDifficulty: 'expert' },
  // Ripasso: solo i fascicoli già chiusi male. Esiste soltanto se ce ne
  // sono, e lo dichiara invece di proporre una sessione vuota.
  { id: 'ripasso', usesAudience: false, freeMap: false, forcedDifficulty: null }
];

export const GAME_MODE_IDS: GameModeId[] = GAME_MODES.map((m) => m.id);
export const DEFAULT_GAME_MODE: GameModeId = 'turno';

export function getGameMode(id: GameModeId): GameModeData {
  const m = GAME_MODES.find((x) => x.id === id);
  if (!m) throw new Error(`Modalità sconosciuta: ${id}`);
  return m;
}

/** Perché una modalità non è giocabile adesso. null = è giocabile. */
export type ModeUnavailable = 'nothingToReview';

export interface GamePlan {
  mode: GameModeId;
  audience: AudienceId;
  requestedMinutes: SessionMinutes;
  /** Fascicoli proposti, nell'ordine. Vuoto solo se `unavailable` è valorizzato. */
  caseIds: string[];
  estimatedMinutes: number;
  difficulty: DifficultyMode;
  /** Il budget non basta nemmeno per il primo fascicolo, proposto comunque. */
  overBudget: boolean;
  /** Si parte dalla mappa invece che dal primo fascicolo. */
  freeMap: boolean;
  unavailable: ModeUnavailable | null;
}

/**
 * Prende dai casi in ordine finché la stima resta dentro il budget. Se
 * nemmeno il primo ci sta lo propone lo stesso: meglio un fascicolo intero e
 * un'avvertenza onesta che mezzo fascicolo o una lista vuota.
 */
function fillBudget(ordered: string[], minutes: number): { caseIds: string[]; overBudget: boolean } {
  const caseIds: string[] = [];
  for (const id of ordered) {
    if (estimateMinutes([...caseIds, id]) > minutes) break;
    caseIds.push(id);
  }
  if (caseIds.length === 0 && ordered.length > 0) return { caseIds: [ordered[0]], overBudget: true };
  return { caseIds, overBudget: false };
}

const playableIds = (): string[] => PLAYABLE_CASES.map((c) => c.id);

/**
 * Mescolamento deterministico: lo stesso seme dà sempre la stessa ispezione.
 * Serve perché la riga di riepilogo nel pannello non può cambiare a ogni
 * ridisegno — chi legge "4 fascicoli" deve poi riceverne quattro.
 */
function shuffled(ids: string[], seed: number): string[] {
  const out = [...ids];
  let a = seed | 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface PlanInput {
  mode: GameModeId;
  audience: AudienceId;
  minutes: SessionMinutes;
  /** Esiti già registrati: serve al ripasso, ignorato dalle altre modalità. */
  completed: Record<string, OutcomeQuality>;
  /** Seme dell'ispezione a sorpresa. */
  seed: number;
}

export function planGame({ mode, audience, minutes, completed, seed }: PlanInput): GamePlan {
  const data = getGameMode(mode);
  const base: Omit<GamePlan, 'caseIds' | 'estimatedMinutes' | 'difficulty' | 'overBudget' | 'unavailable'> = {
    mode,
    audience,
    requestedMinutes: minutes,
    freeMap: data.freeMap
  };

  if (mode === 'turno') {
    const p = planSession(audience, minutes);
    return { ...base, caseIds: p.caseIds, estimatedMinutes: p.estimatedMinutes, difficulty: p.difficulty, overBudget: p.overBudget, unavailable: null };
  }

  if (mode === 'ripasso') {
    // Solo i fascicoli chiusi male, nell'ordine in cui la città li presenta:
    // ripassare non è rigiocare la stessa sequenza di prima.
    const toReview = playableIds().filter((id) => completed[id] === 'wrong' || completed[id] === 'partial');
    if (toReview.length === 0) {
      return { ...base, caseIds: [], estimatedMinutes: 0, difficulty: planSession(audience, minutes).difficulty, overBudget: false, unavailable: 'nothingToReview' };
    }
    const { caseIds, overBudget } = fillBudget(toReview, minutes);
    return { ...base, caseIds, estimatedMinutes: estimateMinutes(caseIds), difficulty: planSession(audience, minutes).difficulty, overBudget, unavailable: null };
  }

  const ordered =
    mode === 'sorpresa'
      ? shuffled(playableIds(), seed)
      : // 'libera': i casi del profilo per primi, poi tutti gli altri — la
        // mappa resta aperta, il piano dice solo da dove conviene partire.
        [...getAudience(audience).orderedCaseIds.filter((id) => playableIds().includes(id)),
         ...playableIds().filter((id) => !getAudience(audience).orderedCaseIds.includes(id))];

  const { caseIds, overBudget } = fillBudget(ordered, minutes);
  const difficulty = data.forcedDifficulty ?? planSession(audience, minutes).difficulty;
  return { ...base, caseIds, estimatedMinutes: estimateMinutes(caseIds), difficulty, overBudget, unavailable: null };
}

/** Minuti del solo primo fascicolo, presa di confidenza compresa. */
export function firstCaseMinutes(caseIds: string[]): number {
  return caseIds.length === 0 ? 0 : SESSION_WARMUP_MINUTES + getCase(caseIds[0]).estimatedMinutes;
}

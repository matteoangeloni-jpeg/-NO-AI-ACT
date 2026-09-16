import type { CaseReport, ErrorType, OutcomeQuality, ReportOutcome } from '../data/types';
import type { GamePlan } from '../data/gameModes';
import { getCase } from '../data/cases';

/**
 * CRUSCOTTO DI FINE TURNO.
 *
 * Una sessione composta in NUOVA PARTITA ha una fine dichiarata — l'ultimo
 * fascicolo del piano — e fino a ora quella fine non esisteva: chiuso
 * l'ultimo caso si tornava sulla mappa come dopo qualunque altro. I due
 * rapporti che il gioco già produce (apprendimento e debrief docente) si
 * raggiungono soltanto dal finale, che chiede molti più casi di quanti ne
 * contenga una sessione da mezz'ora. Chi giocava un turno intero non vedeva
 * mai niente di riepilogativo.
 *
 * Modulo PURO: riceve piano, esiti e rapporti, non tocca lo stato né Phaser.
 * Non calcola punteggi nuovi e non inventa metriche: conta ciò che il gioco
 * ha già deciso caso per caso.
 */

/** Numero di volte oltre il quale un errore smette di essere un caso isolato. */
export const RECURRENCE_THRESHOLD = 2;

export interface SessionCaseLine {
  caseId: string;
  /** Esito registrato, o null se il fascicolo è rimasto aperto. */
  quality: OutcomeQuality | null;
  /**
   * Verdetto formale archiviato nel rapporto del caso. È quello che il
   * giocatore ha visto stampato sul fascicolo, quindi è quello che deve
   * rileggere qui. Resta null per i salvataggi vecchi, chiusi prima che i
   * rapporti venissero archiviati.
   */
  outcome: ReportOutcome | null;
  /** Errore prevalente riconosciuto dal gioco, se ce n'è uno. */
  dominantError: ErrorType | null;
  /** Articolo toccato dal fascicolo. */
  normId: string;
}

export interface RecurringError {
  type: ErrorType;
  times: number;
}

export interface SessionSummaryData {
  /** Fascicoli che il piano proponeva, nell'ordine. */
  lines: SessionCaseLine[];
  /** Quanti ne sono stati chiusi davvero. */
  closed: number;
  counts: Record<OutcomeQuality, number>;
  /**
   * Errore che si ripete. È null sotto la soglia: da un caso solo non si
   * ricava una tendenza, e dichiararla sarebbe inventare una misura.
   */
  recurringError: RecurringError | null;
  /** Articoli toccati dai fascicoli chiusi, senza ripetizioni. */
  normIds: string[];
  /** true quando ogni fascicolo del piano è stato chiuso. */
  complete: boolean;
}

export function buildSessionSummary(
  plan: GamePlan,
  completedCases: Record<string, OutcomeQuality>,
  caseReports: Record<string, CaseReport>
): SessionSummaryData {
  const lines: SessionCaseLine[] = plan.caseIds.map((caseId) => ({
    caseId,
    quality: completedCases[caseId] ?? null,
    outcome: caseReports[caseId]?.outcome ?? null,
    dominantError: caseReports[caseId]?.dominantError ?? null,
    normId: getCase(caseId).normId
  }));

  const counts: Record<OutcomeQuality, number> = { correct: 0, partial: 0, wrong: 0 };
  for (const l of lines) if (l.quality) counts[l.quality] += 1;

  // Il nome ovvio per questa mappa farebbe scattare la guardia privacy, che
  // cerca ogni traccia del servizio di moduli esterni rimosso e non
  // distingue la parola inglese dal nome del prodotto. La guardia resta
  // larga com'è: è una variabile locale a doversi spostare, non un
  // controllo sulla privacy ad allentarsi.
  const occurrences = new Map<ErrorType, number>();
  for (const l of lines) {
    if (!l.quality || !l.dominantError) continue;
    occurrences.set(l.dominantError, (occurrences.get(l.dominantError) ?? 0) + 1);
  }
  let recurringError: RecurringError | null = null;
  for (const [type, times] of occurrences) {
    if (times < RECURRENCE_THRESHOLD) continue;
    if (!recurringError || times > recurringError.times) recurringError = { type, times };
  }

  const closed = lines.filter((l) => l.quality !== null).length;
  const normIds = [...new Set(lines.filter((l) => l.quality !== null).map((l) => l.normId))];

  return { lines, closed, counts, recurringError, normIds, complete: closed === lines.length && lines.length > 0 };
}

/**
 * Il turno è finito quando il piano aveva una sequenza e non resta più
 * niente da aprire. L'indagine libera non finisce mai per definizione: la
 * città resta aperta, e un cruscotto che compare a sorpresa direbbe al
 * giocatore che ha finito una cosa che non aveva cominciato.
 */
export function sessionIsOver(plan: GamePlan, completedCases: Record<string, OutcomeQuality>): boolean {
  if (plan.freeMap || plan.caseIds.length === 0) return false;
  return plan.caseIds.every((id) => id in completedCases);
}

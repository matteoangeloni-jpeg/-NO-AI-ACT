import type { Classification, ConfidenceLevel, Measure, ResponsibleSubject } from '../data/types';

/**
 * BOZZA DI UN FASCICOLO (U01 / U07).
 *
 * Finché un rapporto non è firmato, il lavoro fatto su un fascicolo —
 * reperti aperti, reperti citati, scelte prese — viveva solo nella memoria
 * della scena. Chiudere la scheda, ricaricare o passare a un altro caso lo
 * cancellava senza avvisare. Chi giocava in due sessioni, o su un computer
 * di scuola, ricominciava da capo.
 *
 * Qui la bozza è un dato, e questo modulo è puro: nessun Phaser, nessun
 * localStorage. Le regole che contano sono verificabili da sole.
 *
 * Tre invarianti, e sono tutte e tre difese dai test:
 *
 *  1. una bozza non tocca MAI un rapporto già firmato. Firmare chiude il
 *     fascicolo e cancella la sua bozza; un caso completato non si riprende;
 *  2. una bozza scritta da una versione diversa dello schema viene scartata,
 *     non interpretata a caso — ma scartarla non deve portarsi via nient'altro;
 *  3. una bozza illeggibile o incoerente vale come assente: il gioco riparte
 *     dal fascicolo pulito, non si rifiuta di aprirlo.
 */

/**
 * Versione dello schema della bozza. Va alzata quando cambia la FORMA dei
 * campi qui sotto, non quando ne cambia il contenuto: alzarla significa che
 * le bozze in corso degli altri verranno buttate, ed è accettabile solo se
 * interpretarle sarebbe peggio.
 */
export const DRAFT_SCHEMA = 1;

/** Fasi in cui può trovarsi un fascicolo aperto, nell'ordine in cui si attraversano. */
export const DRAFT_STEPS = ['evidence', 'classification', 'measure', 'subject', 'motivation', 'summary'] as const;
export type DraftStep = (typeof DRAFT_STEPS)[number];

export interface CaseDraft {
  schema: number;
  caseId: string;
  step: DraftStep;
  /** Indici dei reperti aperti e di quelli citati. */
  revealedClues: number[];
  citedClues: number[];
  classification: Classification | null;
  measure: Measure | null;
  subject: ResponsibleSubject | null;
  motivation: number | null;
  confidence: ConfidenceLevel | null;
  /** Ora locale dell'ultimo aggiornamento. Non è un dato personale. */
  updatedAt: number;
}

export function emptyDraft(caseId: string, now: number): CaseDraft {
  return {
    schema: DRAFT_SCHEMA,
    caseId,
    step: 'evidence',
    revealedClues: [],
    citedClues: [],
    classification: null,
    measure: null,
    subject: null,
    motivation: null,
    confidence: null,
    updatedAt: now
  };
}

/** true se l'oggetto ha la forma attesa dallo schema corrente. */
export function isWellFormed(value: unknown): value is CaseDraft {
  if (typeof value !== 'object' || value === null) return false;
  const d = value as Record<string, unknown>;
  if (d.schema !== DRAFT_SCHEMA) return false;
  if (typeof d.caseId !== 'string' || d.caseId === '') return false;
  if (!DRAFT_STEPS.includes(d.step as DraftStep)) return false;
  for (const k of ['revealedClues', 'citedClues']) {
    const arr = d[k];
    if (!Array.isArray(arr) || arr.some((n) => typeof n !== 'number' || !Number.isInteger(n) || n < 0)) return false;
  }
  if (typeof d.updatedAt !== 'number' || !Number.isFinite(d.updatedAt)) return false;
  return true;
}

/**
 * Una bozza è ripresa solo se è ben formata E il caso non è già chiuso.
 * L'ordine conta: un salvataggio può contenere entrambe le cose se una
 * versione precedente ha firmato senza ripulire, e in quel caso vince il
 * rapporto firmato — è il dato che il giocatore ha consegnato.
 */
export function isResumable(draft: unknown, completedCaseIds: readonly string[]): draft is CaseDraft {
  return isWellFormed(draft) && !completedCaseIds.includes(draft.caseId);
}

/**
 * Ripulisce la mappa delle bozze letta da un salvataggio. Tiene solo quelle
 * riprendibili e butta il resto in silenzio: una bozza è lavoro non ancora
 * consegnato, non un dato che valga la pena recuperare a metà.
 *
 * Non guarda e non tocca nient'altro del salvataggio: scartare una bozza
 * incompatibile non deve mai costare un caso completato o un rapporto.
 */
export function sanitizeDrafts(raw: unknown, completedCaseIds: readonly string[]): Record<string, CaseDraft> {
  if (typeof raw !== 'object' || raw === null) return {};
  const out: Record<string, CaseDraft> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isResumable(value, completedCaseIds)) continue;
    // una bozza archiviata sotto una chiave diversa dal proprio caso è
    // incoerente: aprirebbe il fascicolo sbagliato con le scelte di un altro
    if (value.caseId !== key) continue;
    out[key] = value;
  }
  return out;
}

/** Quante scelte sono già state prese: serve a dire "a che punto eri". */
export function draftProgress(draft: CaseDraft): { taken: number; total: number } {
  const choices = [draft.classification, draft.measure, draft.subject, draft.motivation];
  return { taken: choices.filter((c) => c !== null).length, total: choices.length };
}

/** true se la bozza contiene qualcosa che valga la pena riprendere. */
export function hasProgress(draft: CaseDraft): boolean {
  return (
    draft.revealedClues.length > 0 ||
    draft.citedClues.length > 0 ||
    draftProgress(draft).taken > 0
  );
}

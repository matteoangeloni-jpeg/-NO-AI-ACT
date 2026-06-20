import type { ReportResult } from './ReportSystem';
import type { ErrorType, ReportOutcome } from '../data/types';

/**
 * Tassonomia delle fragilità decisionali (v0.5 — Investigation & Learning Layer).
 *
 * Non sostituisce l'esito (conforme/parziale/contestabile/non conforme): lo
 * SPIEGA, indicando QUALE fragilità lo ha prodotto. È derivata interamente
 * dalla logica di valutazione già esistente (ReportResult) — nessun nuovo dato,
 * nessun invio remoto, nessun dato personale.
 */
export type DecisionIssueType =
  | 'wrong_classification'
  | 'insufficient_measure'
  | 'excessive_measure'
  | 'wrong_responsible_subject'
  | 'weak_motivation'
  | 'weak_evidence'
  | 'formal_human_oversight'
  | 'missing_transparency'
  | 'context_misread'
  | 'proportionality_problem';

/** Mappa i rilievi storici (ErrorType) sulla tassonomia v0.5. */
const ERROR_TO_ISSUE: Record<ErrorType, DecisionIssueType> = {
  classificazione: 'wrong_classification',
  misura_insufficiente: 'insufficient_measure',
  eccesso_cautela: 'excessive_measure',
  soggetto: 'wrong_responsible_subject',
  motivazione: 'weak_motivation',
  prove: 'weak_evidence',
  trasparenza: 'missing_transparency'
};

export function issueForError(error: ErrorType): DecisionIssueType {
  return ERROR_TO_ISSUE[error];
}

export interface DecisionIssues {
  /** Fragilità principale (null solo per un atto pienamente conforme). */
  primary: DecisionIssueType | null;
  /** Fino a due fragilità secondarie. */
  secondary: DecisionIssueType[];
}

/**
 * Deriva le fragilità da un rapporto valutato. La fragilità principale segue il
 * rilievo dominante; l'eccesso di cautela è anche un problema di proporzionalità
 * (rilievo secondario), utile in chiave didattica.
 */
export function decisionIssues(result: ReportResult): DecisionIssues {
  const primary = result.dominantError ? issueForError(result.dominantError) : null;
  const secondary: DecisionIssueType[] = result.secondaryErrors.map(issueForError);
  // l'eccesso di cautela è una decisione corretta ma sproporzionata: rendiamo
  // esplicito il problema di proporzionalità senza alterare l'esito.
  if (result.overcaution && primary !== 'proportionality_problem' && !secondary.includes('proportionality_problem')) {
    secondary.push('proportionality_problem');
  }
  return { primary, secondary: secondary.slice(0, 2) };
}

/**
 * Chiave dell'analisi sintetica della decisione (FASE 3). L'esito dà la frase
 * base; la fragilità principale, se presente, ne specifica il punto debole.
 */
export interface DecisionAnalysisKeys {
  outcome: ReportOutcome;
  issue: DecisionIssueType | null;
}

export function decisionAnalysisKeys(result: ReportResult): DecisionAnalysisKeys {
  return { outcome: result.outcome, issue: decisionIssues(result).primary };
}

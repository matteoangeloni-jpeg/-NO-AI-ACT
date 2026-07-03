import { L } from '../i18n';
import { PLAYABLE_CASES } from './cases';

/**
 * Schede didattiche per caso (v0.5 — Investigation & Learning Layer).
 * I testi vivono in i18n sotto caseLearning[caseId]; qui c'è solo l'accesso
 * tipato. Non cambiano la soluzione dei casi: servono al debrief docente.
 */
export interface CaseLearningCard {
  /** Sintesi breve da portare a casa (mostrata nel debrief della decisione, v1.1). */
  takeaway: string;
  /** Cosa insegna il caso. */
  teaches: string;
  /** Errore tipico del giocatore. */
  typicalMistake: string;
  /** Domanda di discussione per l'aula. */
  discussionQuestion: string;
  /** Concetti AI Act toccati. */
  aiActConcepts: string[];
  /** Segnale che il concetto è stato compreso. */
  understandingSignal: string;
  /** Suggerimento d'uso in aula. */
  classroomUse: string;
  /** Minuti stimati di debrief. */
  estimatedDebriefMinutes: number;
}

export function caseLearning(caseId: string): CaseLearningCard {
  const card = (L().caseLearning as Record<string, CaseLearningCard>)[caseId];
  if (!card) throw new Error(`Scheda didattica mancante per il caso: ${caseId}`);
  return card;
}

/** Tutte le schede dei casi giocabili, nell'ordine della mappa. */
export function allCaseLearning(): { caseId: string; card: CaseLearningCard }[] {
  return PLAYABLE_CASES.map((c) => ({ caseId: c.id, card: caseLearning(c.id) }));
}

/** Concetti AI Act emersi nei casi completati, deduplicati e in ordine. */
export function conceptsForCases(caseIds: string[]): string[] {
  const seen = new Set<string>();
  for (const id of caseIds) {
    for (const concept of caseLearning(id).aiActConcepts) seen.add(concept);
  }
  return [...seen];
}

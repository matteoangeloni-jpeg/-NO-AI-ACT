import { PLAYABLE_CASES } from './cases';
import type { ObjectiveId } from './learningModel';
import type { OutcomeQuality } from './types';

/**
 * Capitoli concettuali 2.0 (mission §10.2): raggruppano gli 11 casi esistenti
 * in quattro percorsi tematici SENZA bloccare nulla — ogni caso resta apribile
 * liberamente dalla mappa (modalità docente/selezione libera preservata).
 * Testi (titolo, introduzione, debrief) in i18n `learningLayer.chapters.defs`.
 */

export type ChapterId = 'prohibited' | 'high_risk' | 'transparency' | 'governance';

export interface ChapterData {
  id: ChapterId;
  /** Ordine consigliato di gioco del capitolo (1-based). */
  order: number;
  /** Casi del capitolo, nell'ordine consigliato. */
  caseIds: string[];
  /** Obiettivi di apprendimento del capitolo. */
  objectives: ObjectiveId[];
  /** Durata stimata in minuti (tutti i casi del capitolo, ritmo classe). */
  estimatedMinutes: number;
}

export const CHAPTERS: ChapterData[] = [
  {
    id: 'prohibited',
    order: 1,
    caseIds: ['case_scoring', 'case_scuola', 'case_biometria', 'case_credito', 'case_predpol'],
    objectives: ['obj_prohibited_boundary', 'obj_context_dependence', 'obj_decisive_evidence'],
    estimatedMinutes: 75
  },
  {
    id: 'high_risk',
    order: 2,
    caseIds: ['case_lavoro', 'case_ospedale', 'case_edtech', 'case_frodi'],
    objectives: ['obj_risk_classification', 'obj_human_oversight', 'obj_proportionate_measures'],
    estimatedMinutes: 65
  },
  {
    id: 'transparency',
    order: 3,
    caseIds: ['case_media', 'case_chatbot'],
    objectives: ['obj_transparency_duties', 'obj_actor_responsibility'],
    estimatedMinutes: 30
  },
  {
    id: 'governance',
    order: 4,
    caseIds: ['case_procurement', 'case_gpai'],
    objectives: ['obj_actor_responsibility', 'obj_gpai_downstream'],
    estimatedMinutes: 35
  }
];

export function getChapter(id: ChapterId): ChapterData {
  const c = CHAPTERS.find((x) => x.id === id);
  if (!c) throw new Error(`Capitolo sconosciuto: ${id}`);
  return c;
}

export function chapterForCase(caseId: string): ChapterData {
  const c = CHAPTERS.find((x) => x.caseIds.includes(caseId));
  if (!c) throw new Error(`Nessun capitolo per il caso: ${caseId}`);
  return c;
}

export interface ChapterProgress {
  chapter: ChapterData;
  done: number;
  total: number;
  complete: boolean;
}

/** Stato di completamento di ogni capitolo dato l'elenco dei casi completati. */
export function chapterProgress(completedCases: Record<string, OutcomeQuality>): ChapterProgress[] {
  return CHAPTERS.map((chapter) => {
    const done = chapter.caseIds.filter((id) => id in completedCases).length;
    return { chapter, done, total: chapter.caseIds.length, complete: done === chapter.caseIds.length };
  });
}

/** Guardia strutturale: i capitoli coprono tutti i casi giocabili, una volta sola. */
export function chaptersCoverAllCases(): boolean {
  const all = CHAPTERS.flatMap((c) => c.caseIds);
  return all.length === PLAYABLE_CASES.length && new Set(all).size === all.length;
}

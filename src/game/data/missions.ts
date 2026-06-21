import type { DifficultyMode, MissionId } from './types';

/**
 * Percorsi didattici (v0.4). Non bloccano i casi: la mappa li evidenzia come
 * "consigliati". Default sicuro = 'full' (comportamento storico: tutti i casi).
 * Tutti i testi (nome, durata, obiettivo) vivono in i18n sotto ui.missions.modes.
 */
export interface MissionData {
  id: MissionId;
  /** Casi consigliati (evidenziati sulla mappa). Vuoto = tutti. */
  recommendedCaseIds: string[];
  /** Difficoltà suggerita per la missione (non vincolante). */
  suggestedDifficulty: DifficultyMode;
}

export const MISSIONS: MissionData[] = [
  {
    id: 'demo',
    recommendedCaseIds: ['case_scoring'],
    suggestedDifficulty: 'base'
  },
  {
    id: 'lab',
    recommendedCaseIds: ['case_scoring', 'case_lavoro', 'case_media'],
    suggestedDifficulty: 'standard'
  },
  {
    id: 'full',
    recommendedCaseIds: [
      'case_scoring',
      'case_lavoro',
      'case_media',
      'case_scuola',
      'case_ospedale',
      'case_biometria'
    ],
    suggestedDifficulty: 'standard'
  },
  {
    id: 'advanced',
    recommendedCaseIds: [
      'case_scoring',
      'case_lavoro',
      'case_media',
      'case_scuola',
      'case_ospedale',
      'case_biometria',
      'case_credito'
    ],
    suggestedDifficulty: 'expert'
  },
  {
    // Advanced Case Pack (v0.6): casi più ambigui (~75–90 min).
    id: 'pack',
    recommendedCaseIds: [
      'case_credito',
      'case_chatbot',
      'case_procurement',
      'case_edtech',
      'case_gpai'
    ],
    suggestedDifficulty: 'expert'
  }
];

export const MISSION_IDS: MissionId[] = MISSIONS.map((m) => m.id);

export const DEFAULT_MISSION: MissionId = 'full';
export const DEFAULT_DIFFICULTY: DifficultyMode = 'standard';

export function getMission(id: MissionId): MissionData {
  const m = MISSIONS.find((x) => x.id === id);
  if (!m) throw new Error(`Missione sconosciuta: ${id}`);
  return m;
}

/** true se il caso è tra i consigliati della missione (per evidenziare la mappa). */
export function isRecommended(missionId: MissionId, caseId: string): boolean {
  return getMission(missionId).recommendedCaseIds.includes(caseId);
}

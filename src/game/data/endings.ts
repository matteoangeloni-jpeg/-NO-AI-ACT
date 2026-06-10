import type { EndingData, IndicatorState } from './types';

export const FINAL_MESSAGE =
  "L'AI Act non elimina il rischio. Rende il rischio visibile, documentabile, " +
  'contestabile e governabile.';

export const ENDINGS: EndingData[] = [
  {
    id: 'ending_opaca',
    title: 'FINALE 1 — CITTÀ OPACA',
    text:
      'La città è efficiente, ma i cittadini non riescono più a capire, ' +
      'contestare o correggere le decisioni automatizzate. Le code scorrono, i ' +
      'punteggi si aggiornano, le notifiche arrivano puntuali. Nessuno firma ' +
      'più nulla. Nessuno risponde più di nulla.'
  },
  {
    id: 'ending_fragile',
    title: 'FINALE 2 — GOVERNANCE FRAGILE',
    text:
      'Alcune garanzie sono state introdotte, ma la città resta vulnerabile a ' +
      'opacità, discriminazione e automazione irresponsabile. Le regole esistono ' +
      'a macchia: dove l\'ispettorato è passato, i sistemi rispondono; altrove, ' +
      'decidono ancora da soli.'
  },
  {
    id: 'ending_governata',
    title: 'FINALE 3 — INNOVAZIONE GOVERNATA',
    text:
      'L\'IA non viene bloccata, ma resa visibile, documentabile, contestabile e ' +
      'supervisionabile. La città è ancora automatizzata — ma ogni sistema ha un ' +
      'responsabile, un registro e una porta a cui bussare.'
  }
];

/**
 * Regole dei finali:
 *  - Città opaca: diritti < 40 oppure fiducia < 40;
 *  - Innovazione governata: diritti >= 60 e fiducia >= 60;
 *  - Governance fragile: tutti gli altri casi.
 */
export function computeEnding(ind: IndicatorState): EndingData {
  if (ind.diritti < 40 || ind.fiducia < 40) return ENDINGS[0];
  if (ind.diritti >= 60 && ind.fiducia >= 60) return ENDINGS[2];
  return ENDINGS[1];
}

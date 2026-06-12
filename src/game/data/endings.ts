import type { EndingId, IndicatorState } from './types';

export const ENDING_IDS: EndingId[] = ['ending_opaca', 'ending_fragile', 'ending_governata'];

/**
 * Regole dei finali (testi in i18n sotto endings[id]):
 *  - Città opaca: diritti < 40 oppure fiducia < 40;
 *  - Innovazione governata: diritti >= 60 e fiducia >= 60;
 *  - Governance fragile: tutti gli altri casi.
 */
export function computeEnding(ind: IndicatorState): EndingId {
  if (ind.diritti < 40 || ind.fiducia < 40) return 'ending_opaca';
  if (ind.diritti >= 60 && ind.fiducia >= 60) return 'ending_governata';
  return 'ending_fragile';
}

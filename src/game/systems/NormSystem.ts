import { NORMS, getNorm } from '../data/norms';
import type { NormCardData, NormView } from '../data/types';
import { normText } from '../i18n';
import { StateManager } from './StateManager';

/** Accesso alle carte norma (struttura + testi localizzati) e al loro sblocco. */
export const NormSystem = {
  all(): NormCardData[] {
    return NORMS;
  },

  unlocked(): NormCardData[] {
    return NORMS.filter((n) => StateManager.isNormUnlocked(n.id));
  },

  /** Vista completa nella lingua corrente. */
  view(id: string): NormView {
    return { ...getNorm(id), ...normText(id) };
  },

  isUnlocked(id: string): boolean {
    return StateManager.isNormUnlocked(id);
  }
};

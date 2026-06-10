import { NORMS, getNorm } from '../data/norms';
import type { NormCardData } from '../data/types';
import { StateManager } from './StateManager';

/** Accesso alle carte norma e al loro stato di sblocco. */
export const NormSystem = {
  all(): NormCardData[] {
    return NORMS;
  },

  unlocked(): NormCardData[] {
    return NORMS.filter((n) => StateManager.isNormUnlocked(n.id));
  },

  get(id: string): NormCardData {
    return getNorm(id);
  },

  isUnlocked(id: string): boolean {
    return StateManager.isNormUnlocked(id);
  }
};

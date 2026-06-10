import { INITIAL_INDICATORS } from '../data/indicators';
import type { SaveData } from '../data/types';

const KEY = 'no-ai-act-save-v1';

export function defaultSave(): SaveData {
  return {
    version: 1,
    indicators: { ...INITIAL_INDICATORS },
    completedCases: {},
    unlockedNorms: [],
    audioMuted: false,
    reducedMotion: false,
    endingId: null,
    briefingSeen: false
  };
}

export const SaveSystem = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultSave();
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed.version !== 1) return defaultSave();
      return { ...defaultSave(), ...parsed, indicators: { ...INITIAL_INDICATORS, ...parsed.indicators } };
    } catch {
      return defaultSave();
    }
  },

  save(data: SaveData): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // storage pieno o non disponibile: il gioco continua senza persistenza
    }
  },

  reset(): SaveData {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignora */
    }
    return defaultSave();
  },

  hasSave(): boolean {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as SaveData;
      return Object.keys(parsed.completedCases ?? {}).length > 0 || parsed.briefingSeen;
    } catch {
      return false;
    }
  }
};

import { INITIAL_INDICATORS } from '../data/indicators';
import type { SaveData } from '../data/types';

/**
 * Persistenza locale (schema v2, mission §10.8).
 *
 * Chiave corrente: `no-ai-act-save-v2`. I salvataggi 1.x (chiave
 * `no-ai-act-save-v1`) vengono MIGRATI in modo esplicito e non distruttivo:
 * la chiave v1 NON viene cancellata (funge da snapshot per un eventuale
 * downgrade a un client 1.x) e nessun salvataggio valido viene mai scartato
 * in silenzio. Un salvataggio con versione futura produce un warning e i
 * default in memoria, senza toccare lo storage.
 */
const KEY = 'no-ai-act-save-v2';
const LEGACY_KEY = 'no-ai-act-save-v1';
export const CURRENT_SAVE_VERSION = 2;

export function defaultSave(): SaveData {
  return {
    version: CURRENT_SAVE_VERSION,
    indicators: { ...INITIAL_INDICATORS },
    completedCases: {},
    unlockedNorms: [],
    audioMuted: false,
    musicVolume: 1,
    reducedMotion: false,
    crtOverlay: true,
    language: 'it',
    endingId: null,
    briefingSeen: false,
    caseReports: {},
    teacherMode: false,
    startedAt: null,
    difficulty: 'standard',
    mission: 'full',
    caseMeta: {},
    selfCheck: { pre: null, post: null }
  };
}

/**
 * Migrazione esplicita v1 → v2: preserva OGNI campo esistente (inclusi campi
 * futuri sconosciuti, per forward-compatibility) e aggiunge i campi 2.0 con i
 * default. Nessuna perdita di casi completati o impostazioni.
 */
export function migrateV1toV2(v1: Record<string, unknown>): SaveData {
  const base = defaultSave();
  return {
    ...base,
    ...v1,
    version: CURRENT_SAVE_VERSION,
    indicators: { ...INITIAL_INDICATORS, ...(v1.indicators as object | undefined) },
    caseMeta: { ...base.caseMeta, ...(v1.caseMeta as object | undefined) },
    selfCheck: { ...base.selfCheck, ...(v1.selfCheck as object | undefined) }
  } as SaveData;
}

/** Merge non distruttivo di un v2 (anche parziale) sui default. */
function hydrateV2(parsed: Record<string, unknown>): SaveData {
  const base = defaultSave();
  return {
    ...base,
    ...parsed,
    indicators: { ...INITIAL_INDICATORS, ...(parsed.indicators as object | undefined) },
    caseMeta: { ...base.caseMeta, ...(parsed.caseMeta as object | undefined) },
    selfCheck: { ...base.selfCheck, ...(parsed.selfCheck as object | undefined) }
  } as SaveData;
}

export const SaveSystem = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (typeof parsed.version === 'number' && parsed.version > CURRENT_SAVE_VERSION) {
          // salvataggio di una versione futura: avvisa e NON sovrascrivere
          console.warn(
            `NO AI ACT: save schema v${parsed.version} is newer than v${CURRENT_SAVE_VERSION}; loading defaults without touching storage.`
          );
          return defaultSave();
        }
        return hydrateV2(parsed);
      }
      // nessun v2: migra un eventuale v1 (senza cancellarlo — snapshot downgrade)
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const migrated = migrateV1toV2(JSON.parse(legacy) as Record<string, unknown>);
        this.save(migrated);
        return migrated;
      }
      return defaultSave();
    } catch {
      // JSON corrotto o storage inaccessibile: recovery sui default, senza wipe
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
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignora */
    }
    return defaultSave();
  },

  hasSave(): boolean {
    const data = this.load();
    return Object.keys(data.completedCases).length > 0 || data.briefingSeen;
  }
};

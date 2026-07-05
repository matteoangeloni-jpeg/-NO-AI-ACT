import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SaveSystem, defaultSave } from '../src/game/systems/SaveSystem';

/**
 * SAVE COMPATIBILITY CONTRACT (v1.x) — do not break in v1.2.
 *
 *  1. The localStorage key is exactly `no-ai-act-save-v1` and does not change.
 *  2. SaveData has a stable set of keys (below); `version` stays 1.
 *  3. A v1.1 save loads unchanged (all known fields preserved).
 *  4. A save MISSING optional/newer fields loads with those fields filled
 *     from defaultSave() — the game must not crash.
 *  5. A save with ADDITIVE unknown future fields loads without loss or crash
 *     (forward-compatible: unknown keys are preserved by the spread merge).
 *  6. There is NO destructive migration: an unknown `version` yields the
 *     defaults WITHOUT wiping storage or throwing.
 *
 * If a change to the save format is ever required, a new key
 * (`no-ai-act-save-v2`) + an explicit, tested migration must be introduced —
 * never a silent, lossy rewrite of the v1 key.
 */

const KEY = 'no-ai-act-save-v1';

class MemoryStorage {
  store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}
const storage = new MemoryStorage();
(globalThis as Record<string, unknown>).localStorage = storage;

/** The exact shape a v1.1 client writes (all known fields populated). */
function v11Save() {
  return {
    version: 1,
    indicators: { efficienza: 61, controllo: 52, diritti: 74, fiducia: 66 },
    completedCases: { case_scoring: 'correct', case_lavoro: 'partial', case_media: 'wrong', case_ospedale: 'correct' },
    unlockedNorms: ['norm_social_scoring', 'norm_lavoro_alto_rischio'],
    audioMuted: true,
    musicVolume: 0.5,
    reducedMotion: true,
    crtOverlay: false,
    language: 'en',
    endingId: null,
    briefingSeen: true,
    caseReports: {
      case_scoring: { outcome: 'conforme', dominantError: null, classification: 'vietata', measure: 'blocco', subject: 'autorita', motivationIndex: 1, citedClues: [0, 1] }
    },
    teacherMode: true,
    startedAt: 1_700_000_000_000,
    difficulty: 'expert',
    mission: 'full'
  };
}

describe('save compatibility — the v1 contract holds', () => {
  beforeEach(() => storage.clear());

  it('the storage key literal is exactly no-ai-act-save-v1', () => {
    const src = readFileSync(resolve(__dirname, '../src/game/systems/SaveSystem.ts'), 'utf8');
    expect(src).toContain("const KEY = 'no-ai-act-save-v1'");
    // and functionally: save writes to that key
    SaveSystem.save(defaultSave() as never);
    expect(storage.getItem(KEY)).not.toBeNull();
  });

  it('SaveData keeps its stable shape (key set + version 1)', () => {
    const keys = Object.keys(defaultSave()).sort();
    expect(keys).toEqual([
      'audioMuted', 'briefingSeen', 'caseReports', 'completedCases', 'crtOverlay',
      'difficulty', 'endingId', 'indicators', 'language', 'mission', 'musicVolume',
      'reducedMotion', 'startedAt', 'teacherMode', 'unlockedNorms', 'version'
    ]);
    expect(defaultSave().version).toBe(1);
  });

  it('a full v1.1 save loads with every field preserved', () => {
    const saved = v11Save();
    storage.setItem(KEY, JSON.stringify(saved));
    const loaded = SaveSystem.load() as unknown as Record<string, unknown>;
    for (const [k, v] of Object.entries(saved)) {
      expect(loaded[k], `field ${k}`).toEqual(v);
    }
    expect(SaveSystem.hasSave()).toBe(true);
  });

  it('a save missing newer optional fields loads with defaults (no crash)', () => {
    const partial = v11Save() as Record<string, unknown>;
    delete partial.caseReports;
    delete partial.teacherMode;
    delete partial.difficulty;
    delete partial.mission;
    delete partial.reducedMotion;
    storage.setItem(KEY, JSON.stringify(partial));
    const loaded = SaveSystem.load();
    expect(loaded.caseReports).toEqual({});
    expect(loaded.teacherMode).toBe(false);
    expect(loaded.difficulty).toBe('standard');
    expect(loaded.mission).toBe('full');
    expect(loaded.reducedMotion).toBe(false);
    // known fields still intact
    expect(loaded.language).toBe('en');
    expect(loaded.completedCases).toHaveProperty('case_scoring', 'correct');
  });

  it('additive unknown future fields survive a load (forward-compatible)', () => {
    const withFuture = { ...v11Save(), selfCheckScore: 7, printKitOpened: true } as Record<string, unknown>;
    storage.setItem(KEY, JSON.stringify(withFuture));
    const loaded = SaveSystem.load() as unknown as Record<string, unknown>;
    expect(loaded.selfCheckScore).toBe(7);
    expect(loaded.printKitOpened).toBe(true);
    expect(loaded.language).toBe('en'); // known fields untouched
  });

  it('an unknown version returns defaults with NO destructive migration', () => {
    const foreign = { ...v11Save(), version: 2, briefingSeen: true };
    storage.setItem(KEY, JSON.stringify(foreign));
    expect(SaveSystem.load()).toEqual(defaultSave());
    // storage is NOT wiped by a load (non-destructive read)
    expect(storage.getItem(KEY)).not.toBeNull();
  });

  it('partial indicators are merged onto the design defaults (no NaN holes)', () => {
    storage.setItem(KEY, JSON.stringify({ version: 1, indicators: { diritti: 90 } }));
    const ind = SaveSystem.load().indicators;
    expect(ind.diritti).toBe(90);
    expect(ind.efficienza).toBe(70); // filled from INITIAL_INDICATORS
    expect(Number.isFinite(ind.controllo)).toBe(true);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SaveSystem, defaultSave, migrateV1toV2, CURRENT_SAVE_VERSION } from '../src/game/systems/SaveSystem';

/**
 * SAVE COMPATIBILITY CONTRACT (2.0 — schema v2).
 *
 * The v1 contract required that any format change come as "a new key
 * (`no-ai-act-save-v2`) + an explicit, tested migration … never a silent,
 * lossy rewrite of the v1 key". This is that migration. The v2 contract:
 *
 *  1. The current key is exactly `no-ai-act-save-v2`; schema version is 2.
 *  2. A 1.x save under `no-ai-act-save-v1` is migrated on load with NO loss of
 *     completed cases, reports or settings; the v1 key is NOT deleted (it
 *     stays as a downgrade snapshot for 1.x clients).
 *  3. New v2 fields (caseMeta, selfCheck) default to empty on migration.
 *  4. Additive unknown future fields survive a load (forward-compatible).
 *  5. A save with a FUTURE version yields the defaults with a console warning
 *     and WITHOUT touching storage (non-destructive read).
 *  6. Corrupted JSON yields the defaults without throwing and without a wipe.
 *  7. reset() removes BOTH keys (user-controlled deletion of everything,
 *     including self-check results).
 */

const KEY = 'no-ai-act-save-v2';
const LEGACY_KEY = 'no-ai-act-save-v1';

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

describe('save schema v2 — key, shape, version', () => {
  beforeEach(() => storage.clear());

  it('the storage key literal is exactly no-ai-act-save-v2 and version is 2', () => {
    const src = readFileSync(resolve(__dirname, '../src/game/systems/SaveSystem.ts'), 'utf8');
    expect(src).toContain("const KEY = 'no-ai-act-save-v2'");
    expect(src).toContain("const LEGACY_KEY = 'no-ai-act-save-v1'");
    expect(CURRENT_SAVE_VERSION).toBe(2);
    SaveSystem.save(defaultSave());
    expect(storage.getItem(KEY)).not.toBeNull();
  });

  it('SaveData keeps a stable v2 key set (v1 keys + caseMeta, selfCheck, audience, sessionMinutes, caseDrafts)', () => {
    const keys = Object.keys(defaultSave()).sort();
    expect(keys).toEqual([
      'audience', 'audioMuted', 'briefingSeen', 'caseDrafts', 'caseMeta', 'caseReports',
      'completedCases', 'crtOverlay', 'difficulty', 'endingId', 'indicators', 'language', 'mission',
      'musicVolume', 'reducedMotion', 'selfCheck', 'sessionMinutes', 'startedAt', 'teacherMode',
      'unlockedNorms', 'version'
    ]);
    expect(defaultSave().version).toBe(2);
    expect(defaultSave().caseMeta).toEqual({});
    expect(defaultSave().selfCheck).toEqual({ pre: null, post: null });
  });

  /**
   * I campi 2.2 (audience, sessionMinutes) sono stati aggiunti a v2 SENZA
   * cambiare versione. È lecito solo perché sono additivi in entrambe le
   * direzioni: un salvataggio v2 che non li ha prende i default senza
   * perdere nulla, e un client più vecchio li conserva passandoli avanti.
   * Se un giorno un campo nuovo non soddisfa questa condizione, quel giorno
   * la versione va alzata — e questo test è il posto in cui accorgersene.
   */
  it('un salvataggio v2 anteriore a 2.2 si apre senza perdite e prende i default', () => {
    const { audience: _a, sessionMinutes: _s, caseDrafts: _d, ...preexisting } = defaultSave();
    const older = { ...preexisting, difficulty: 'expert' as const, mission: 'pack' as const, briefingSeen: true };
    storage.setItem(KEY, JSON.stringify(older));

    const loaded = SaveSystem.load();
    expect(loaded.audience, 'il default sicuro è il percorso per conto proprio').toBe('casual');
    expect(loaded.sessionMinutes).toBe(30);
    expect(loaded.caseDrafts, 'un salvataggio senza bozze non ne inventa').toEqual({});
    for (const [k, v] of Object.entries(older)) {
      expect((loaded as unknown as Record<string, unknown>)[k], `campo preesistente ${k}`).toEqual(v);
    }
    expect(loaded.version, 'aggiungere campi additivi non alza la versione').toBe(2);
  });
});

describe('le bozze sono l\'unico campo che il caricamento non prende così com\'è', () => {
  beforeEach(() => storage.clear());

  const goodDraft = (caseId: string) => ({
    schema: 1, caseId, step: 'measure', revealedClues: [0, 1], citedClues: [1],
    classification: 'vietata', measure: null, subject: null, motivation: null,
    confidence: null, updatedAt: 1_700_000_000_000
  });

  it('una bozza valida sopravvive al giro salva → carica', () => {
    storage.setItem(KEY, JSON.stringify({ ...defaultSave(), caseDrafts: { case_scoring: goodDraft('case_scoring') } }));
    expect(SaveSystem.load().caseDrafts.case_scoring?.classification).toBe('vietata');
  });

  it('una bozza di un caso già chiuso non torna su: ha vinto il rapporto firmato', () => {
    storage.setItem(KEY, JSON.stringify({
      ...defaultSave(),
      completedCases: { case_scoring: 'correct' },
      caseDrafts: { case_scoring: goodDraft('case_scoring') }
    }));
    const loaded = SaveSystem.load();
    expect(loaded.caseDrafts).toEqual({});
    expect(loaded.completedCases, 'scartare una bozza non tocca i casi chiusi').toEqual({ case_scoring: 'correct' });
  });

  it('una bozza di uno schema futuro viene scartata senza portarsi via il resto', () => {
    storage.setItem(KEY, JSON.stringify({
      ...defaultSave(),
      language: 'en',
      caseReports: { case_media: { outcome: 'conforme' } },
      caseDrafts: { case_scoring: { ...goodDraft('case_scoring'), schema: 99 }, case_lavoro: goodDraft('case_lavoro') }
    }));
    const loaded = SaveSystem.load();
    expect(Object.keys(loaded.caseDrafts)).toEqual(['case_lavoro']);
    expect(loaded.language).toBe('en');
    expect(loaded.caseReports).toHaveProperty('case_media');
  });

  it('un contenitore di bozze corrotto non impedisce di caricare la partita', () => {
    storage.setItem(KEY, JSON.stringify({ ...defaultSave(), completedCases: { case_media: 'correct' }, caseDrafts: 'rotto' }));
    const loaded = SaveSystem.load();
    expect(loaded.caseDrafts).toEqual({});
    expect(loaded.completedCases).toEqual({ case_media: 'correct' });
  });

  it('una migrazione da 1.x non inventa bozze', () => {
    storage.setItem(LEGACY_KEY, JSON.stringify(v11Save()));
    expect(SaveSystem.load().caseDrafts).toEqual({});
  });
});

describe('explicit v1 → v2 migration — no valid save is ever discarded', () => {
  beforeEach(() => storage.clear());

  it('a full v1.1 save under the legacy key migrates with every field preserved', () => {
    storage.setItem(LEGACY_KEY, JSON.stringify(v11Save()));
    const loaded = SaveSystem.load() as unknown as Record<string, unknown>;
    const { version: _v, ...v1Fields } = v11Save();
    for (const [k, v] of Object.entries(v1Fields)) {
      expect(loaded[k], `field ${k}`).toEqual(v);
    }
    expect(loaded.version).toBe(2);
    expect(loaded.caseMeta).toEqual({});
    expect(loaded.selfCheck).toEqual({ pre: null, post: null });
    expect(SaveSystem.hasSave()).toBe(true);
  });

  it('migration writes the v2 key and keeps the v1 key as a downgrade snapshot', () => {
    storage.setItem(LEGACY_KEY, JSON.stringify(v11Save()));
    SaveSystem.load();
    expect(storage.getItem(KEY)).not.toBeNull();
    expect(storage.getItem(LEGACY_KEY)).not.toBeNull(); // NOT deleted
    // and the migrated copy is preferred on the next load
    const second = SaveSystem.load();
    expect(second.language).toBe('en');
    expect(second.version).toBe(2);
  });

  it('migrateV1toV2 preserves unknown future fields (forward-compatible)', () => {
    const migrated = migrateV1toV2({ ...v11Save(), somePluginFlag: true }) as unknown as Record<string, unknown>;
    expect(migrated.somePluginFlag).toBe(true);
    expect(migrated.version).toBe(2);
  });

  it('a v1 save missing optional fields migrates with defaults (no crash)', () => {
    const partial = v11Save() as Record<string, unknown>;
    delete partial.caseReports;
    delete partial.difficulty;
    delete partial.mission;
    storage.setItem(LEGACY_KEY, JSON.stringify(partial));
    const loaded = SaveSystem.load();
    expect(loaded.caseReports).toEqual({});
    expect(loaded.difficulty).toBe('standard');
    expect(loaded.mission).toBe('full');
    expect(loaded.completedCases).toHaveProperty('case_scoring', 'correct');
  });
});

describe('v2 load semantics — recovery, future versions, deletion', () => {
  beforeEach(() => storage.clear());

  it('additive unknown future fields on the v2 key survive a load', () => {
    storage.setItem(KEY, JSON.stringify({ ...defaultSave(), printKitOpened: true, language: 'en' }));
    const loaded = SaveSystem.load() as unknown as Record<string, unknown>;
    expect(loaded.printKitOpened).toBe(true);
    expect(loaded.language).toBe('en');
  });

  it('a FUTURE schema version yields defaults without touching storage (downgrade-safe)', () => {
    const future = JSON.stringify({ ...defaultSave(), version: 3, briefingSeen: true });
    storage.setItem(KEY, future);
    expect(SaveSystem.load()).toEqual(defaultSave());
    expect(storage.getItem(KEY)).toBe(future); // untouched
  });

  it('corrupted JSON yields defaults without throwing and without a wipe', () => {
    storage.setItem(KEY, '{broken###');
    expect(SaveSystem.load()).toEqual(defaultSave());
    expect(storage.getItem(KEY)).toBe('{broken###');
  });

  it('partial indicators are merged onto the design defaults (no NaN holes)', () => {
    storage.setItem(KEY, JSON.stringify({ version: 2, indicators: { diritti: 90 } }));
    const ind = SaveSystem.load().indicators;
    expect(ind.diritti).toBe(90);
    expect(ind.efficienza).toBe(70);
    expect(Number.isFinite(ind.controllo)).toBe(true);
  });

  it('reset() deletes BOTH keys — user-controlled deletion incl. self-check', () => {
    storage.setItem(KEY, JSON.stringify(defaultSave()));
    storage.setItem(LEGACY_KEY, JSON.stringify(v11Save()));
    SaveSystem.reset();
    expect(storage.getItem(KEY)).toBeNull();
    expect(storage.getItem(LEGACY_KEY)).toBeNull();
  });
});

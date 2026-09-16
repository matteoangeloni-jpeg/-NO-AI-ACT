import { beforeEach, describe, expect, it } from 'vitest';
import { SaveSystem, defaultSave } from '../src/game/systems/SaveSystem';
import { INITIAL_INDICATORS } from '../src/game/data/indicators';

/** Stub minimale di localStorage per l'ambiente Node. */
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

const storage = new MemoryStorage();
(globalThis as Record<string, unknown>).localStorage = storage;

const KEY = 'no-ai-act-save-v2';

describe('SaveSystem', () => {
  beforeEach(() => storage.clear());

  it('senza salvataggio restituisce i default e hasSave è false', () => {
    expect(SaveSystem.load()).toEqual(defaultSave());
    expect(SaveSystem.hasSave()).toBe(false);
  });

  it('roundtrip save/load preserva lo stato', () => {
    const data = defaultSave();
    data.completedCases['case_scoring'] = 'correct';
    data.unlockedNorms.push('norm_social_scoring');
    data.indicators.diritti = 80;
    data.briefingSeen = true;
    SaveSystem.save(data);
    const loaded = SaveSystem.load();
    expect(loaded.completedCases).toEqual({ case_scoring: 'correct' });
    expect(loaded.unlockedNorms).toEqual(['norm_social_scoring']);
    expect(loaded.indicators.diritti).toBe(80);
    expect(SaveSystem.hasSave()).toBe(true);
  });

  it('JSON corrotto → default senza eccezioni', () => {
    storage.setItem(KEY, '{not-json###');
    expect(SaveSystem.load()).toEqual(defaultSave());
    expect(SaveSystem.hasSave()).toBe(false);
  });

  it('versione futura → default con warning (nessuna migrazione implicita)', () => {
    storage.setItem(KEY, JSON.stringify({ ...defaultSave(), version: 99, briefingSeen: true }));
    expect(SaveSystem.load()).toEqual(defaultSave());
  });

  it('un salvataggio a cui manca QUALUNQUE campo riceve il default di quel campo', () => {
    /**
     * I valori attesi si LEGGONO da defaultSave invece di essere ricopiati:
     * la versione precedente fissava `musicVolume` a 1 e diventava rossa il
     * giorno che il default cambiava, pur non essendoci nessun difetto.
     * E toglieva tre campi scelti a mano, quindi non avrebbe mai visto un
     * campo nuovo dimenticato dalla migrazione — che è il difetto vero.
     * Qui si tolgono TUTTI i campi, uno alla volta.
     */
    const reference = defaultSave() as unknown as Record<string, unknown>;
    for (const field of Object.keys(reference)) {
      if (field === 'version') continue; // senza versione il salvataggio non è più v2
      const partial = { ...reference };
      delete partial[field];
      storage.setItem(KEY, JSON.stringify(partial));
      const loaded = SaveSystem.load() as unknown as Record<string, unknown>;
      expect(loaded[field], `il campo "${field}" non riceve il proprio default`).toEqual(reference[field]);
    }
  });

  it('lingua e preferenze audio sopravvivono al roundtrip save/load', () => {
    const data = defaultSave();
    data.language = 'en';
    data.musicVolume = 0.5;
    data.audioMuted = true;
    SaveSystem.save(data);
    const loaded = SaveSystem.load();
    expect(loaded.language).toBe('en');
    expect(loaded.musicVolume).toBe(0.5);
    expect(loaded.audioMuted).toBe(true);
  });

  it('reset cancella e restituisce i default', () => {
    const data = defaultSave();
    data.briefingSeen = true;
    SaveSystem.save(data);
    const after = SaveSystem.reset();
    expect(after).toEqual(defaultSave());
    expect(storage.getItem(KEY)).toBeNull();
  });

  it('i default partono dagli indicatori iniziali di design', () => {
    expect(defaultSave().indicators).toEqual(INITIAL_INDICATORS);
  });
});

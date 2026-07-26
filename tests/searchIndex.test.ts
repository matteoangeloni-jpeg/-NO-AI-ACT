import { describe, expect, it, afterAll } from 'vitest';
import { searchArchive } from '../src/game/systems/SearchIndex';
import { setLanguage } from '../src/game/i18n';
import { NORMS } from '../src/game/data/norms';

/**
 * ARCHIVE SEARCH ENGINE GUARD (roadmap 2.1, Phase 2 §6 — Her Story).
 * Pure, local, language-aware. No network, no storage.
 */
afterAll(() => setLanguage('it'));

describe('searchArchive', () => {
  it('empty query returns every norm card (no filter) and nothing else', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      const hits = searchArchive('');
      expect(hits).toHaveLength(NORMS.length);
      expect(hits.every((h) => h.kind === 'norm')).toBe(true);
    }
  });

  it('finds norms, glossary entries and cases by keyword in both languages', () => {
    setLanguage('it');
    const it1 = searchArchive('biometria');
    expect(it1.some((h) => h.kind === 'norm' && h.id === 'norm_biometria')).toBe(true);
    expect(it1.some((h) => h.kind === 'glossary')).toBe(true);
    setLanguage('en');
    const en1 = searchArchive('deployer');
    expect(en1.some((h) => h.kind === 'glossary' && h.id === 'deployer')).toBe(true);
  });

  it('is accent-insensitive and ranks by matched terms', () => {
    setLanguage('it');
    const hits = searchArchive('trasparenza cittadino');
    expect(hits.length).toBeGreaterThan(0);
    for (let i = 1; i < hits.length; i++) expect(hits[i - 1].score).toBeGreaterThanOrEqual(hits[i].score);
    expect(searchArchive('TRASPARENZA')).toEqual(searchArchive('trasparenza'));
  });

  it('no-match query returns empty; short tokens (<2) are ignored', () => {
    setLanguage('it');
    expect(searchArchive('xyzzynope')).toEqual([]);
    expect(searchArchive('a')).toHaveLength(NORMS.length); // ignored → unfiltered norms
  });
});

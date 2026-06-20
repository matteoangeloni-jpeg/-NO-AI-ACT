import { describe, expect, it } from 'vitest';
import { setLanguage } from '../src/game/i18n';
import { GLOSSARY, glossaryViews, glossaryEntry } from '../src/game/data/glossary';
import { PLAYABLE_CASES } from '../src/game/data/cases';

const REQUIRED_TERMS = [
  'prohibited_practice',
  'high_risk',
  'transparency',
  'challengeable',
  'provider',
  'deployer',
  'human_oversight',
  'social_scoring',
  'biometrics',
  'emotion_recognition',
  'deepfake',
  'credit_welfare',
  'gpai'
];

describe('v0.5 — glossario operativo', () => {
  it('contiene tutte le voci minime richieste', () => {
    const ids = GLOSSARY.map((e) => e.id);
    for (const term of REQUIRED_TERMS) expect(ids).toContain(term);
  });

  it('ogni voce ha termine, definizione, perché conta e cautela (IT/EN)', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      for (const v of glossaryViews()) {
        expect(v.term.trim().length).toBeGreaterThan(0);
        expect(v.definition.trim().length).toBeGreaterThan(10);
        expect(v.whyItMatters.trim().length).toBeGreaterThan(5);
        expect(v.caution.trim().length).toBeGreaterThan(5);
      }
    }
    setLanguage('it');
  });

  it('almeno alcune voci hanno casi collegati e i casi esistono', () => {
    const withCases = glossaryViews().filter((v) => v.relatedCases.length > 0);
    expect(withCases.length).toBeGreaterThanOrEqual(5);
    const validIds = new Set(PLAYABLE_CASES.map((c) => c.id));
    for (const v of glossaryViews()) {
      for (const cid of v.relatedCases) expect(validIds.has(cid)).toBe(true);
    }
  });

  it('la voce "contestabile" spiega che corretto non basta', () => {
    setLanguage('it');
    expect(glossaryEntry('challengeable').definition.toLowerCase()).toContain('corretta');
    setLanguage('en');
    expect(glossaryEntry('challengeable').definition.toLowerCase()).toContain('correct');
    setLanguage('it');
  });
});

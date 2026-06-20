import { describe, expect, it } from 'vitest';
import { setLanguage } from '../src/game/i18n';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { allCaseLearning, caseLearning, conceptsForCases } from '../src/game/data/learning';

describe('v0.5 — schede didattiche per caso', () => {
  it('ogni caso giocabile ha una scheda', () => {
    expect(allCaseLearning()).toHaveLength(PLAYABLE_CASES.length);
    expect(PLAYABLE_CASES.length).toBe(7);
  });

  it('ogni scheda ha cosa insegna, errore tipico e domanda di discussione', () => {
    for (const { card } of allCaseLearning()) {
      expect(card.teaches.trim().length).toBeGreaterThan(10);
      expect(card.typicalMistake.trim().length).toBeGreaterThan(10);
      expect(card.discussionQuestion.trim().length).toBeGreaterThan(10);
      expect(card.aiActConcepts.length).toBeGreaterThanOrEqual(1);
      expect(card.understandingSignal.trim().length).toBeGreaterThan(10);
      expect(card.estimatedDebriefMinutes).toBeGreaterThan(0);
    }
  });

  it('la scheda esiste in IT e in EN', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      const card = caseLearning('case_credito');
      expect(card.teaches.trim().length).toBeGreaterThan(0);
      expect(card.aiActConcepts.length).toBeGreaterThanOrEqual(1);
    }
    setLanguage('it');
  });

  it('il caso credito insegna a distinguere social scoring e alto rischio', () => {
    setLanguage('it');
    const card = caseLearning('case_credito');
    expect(card.understandingSignal.toLowerCase()).toContain('social scoring');
    expect(card.aiActConcepts.join(' ').toLowerCase()).toContain('alto rischio');
  });

  it('i concetti dei casi sono deduplicati', () => {
    const concepts = conceptsForCases(['case_scoring', 'case_scoring']);
    expect(new Set(concepts).size).toBe(concepts.length);
  });
});

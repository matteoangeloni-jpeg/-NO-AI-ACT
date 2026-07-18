import { describe, expect, it } from 'vitest';
import { CASES, PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import { getNorm } from '../src/game/data/norms';
import { caseLearning } from '../src/game/data/learning';
import { GLOSSARY, glossaryViews } from '../src/game/data/glossary';
import { MISSIONS, getMission } from '../src/game/data/missions';
import { evaluateReport, type ReportInput } from '../src/game/systems/ReportSystem';
import { decisionIssues } from '../src/game/systems/DecisionIssues';
import { it as itLocale } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import { setLanguage, caseText, normText } from '../src/game/i18n';

const NEW_CASES = ['case_chatbot', 'case_procurement', 'case_edtech', 'case_gpai'];
const BASE_CASES = ['case_scoring', 'case_lavoro', 'case_media', 'case_scuola', 'case_ospedale', 'case_biometria', 'case_credito'];

function correctInput(caseId: string): ReportInput {
  const c = getCase(caseId);
  return {
    caseData: c,
    citedClues: c.relevantClues,
    classification: c.correctClassification,
    measure: c.correctMeasures[0],
    subject: c.responsibleSubjectCorrect,
    motivationIndex: c.correctMotivation
  };
}

describe('v0.6 — Advanced Case Pack: struttura', () => {
  it('ci sono 13 casi giocabili: 7 base + 4 del pack v0.6 + 2 del pack 2.0, id stabili', () => {
    expect(CASES).toHaveLength(13);
    expect(PLAYABLE_CASES).toHaveLength(13);
    for (const id of BASE_CASES) expect(CASES.some((c) => c.id === id)).toBe(true);
    for (const id of NEW_CASES) expect(getCase(id).playable).toBe(true);
  });

  it('ogni nuovo caso ha 5–7 reperti, prove decisive, norma, soluzione', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      for (const id of NEW_CASES) {
        const c = getCase(id);
        const texts = caseText(id);
        expect(texts.clues.length).toBeGreaterThanOrEqual(5);
        expect(texts.clues.length).toBeLessThanOrEqual(7);
        expect(texts.clueSources?.length).toBe(texts.clues.length);
        expect(c.clueStances?.length).toBe(texts.clues.length);
        expect(c.relevantClues.length).toBeGreaterThanOrEqual(2);
        expect(c.correctMeasures.length).toBeGreaterThan(0);
        expect(() => getNorm(c.normId)).not.toThrow();
        // norma localizzata con "Non significa che…"
        expect(normText(c.normId).notMeaning.length).toBeGreaterThan(20);
      }
    }
    setLanguage('it');
  });

  it('ogni nuovo caso ha una learning card completa (IT/EN)', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      for (const id of NEW_CASES) {
        const card = caseLearning(id);
        expect(card.teaches.length).toBeGreaterThan(10);
        expect(card.typicalMistake.length).toBeGreaterThan(10);
        expect(card.discussionQuestion.length).toBeGreaterThan(10);
        expect(card.aiActConcepts.length).toBeGreaterThanOrEqual(3);
      }
    }
    setLanguage('it');
  });

  it('il pacchetto avanzato include i nuovi casi e il credito', () => {
    const pack = getMission('pack');
    expect(pack.recommendedCaseIds).toContain('case_credito');
    for (const id of NEW_CASES) expect(pack.recommendedCaseIds).toContain(id);
    // i percorsi base restano invariati (7 o meno casi consigliati)
    expect(getMission('full').recommendedCaseIds).toHaveLength(6);
    expect(MISSIONS.map((m) => m.id)).toContain('pack');
  });
});

describe('v0.6 — report ed esiti dei nuovi casi', () => {
  it('la decisione corretta produce CONFORME per ogni nuovo caso', () => {
    for (const id of NEW_CASES) {
      const r = evaluateReport(correctInput(id), 'standard');
      expect(r.outcome, `${id} dovrebbe essere conforme`).toBe('conforme');
    }
  });

  it('soggetto errato rende contestabile con fragilità coerente', () => {
    // chatbot: corretto deployer → scegliamo provider (errato)
    const r = evaluateReport({ ...correctInput('case_chatbot'), subject: 'provider' }, 'standard');
    expect(r.outcome).toBe('contestabile');
    expect(decisionIssues(r).primary).toBe('wrong_responsible_subject');
  });

  it('negare il problema rende non conforme', () => {
    const r = evaluateReport({ ...correctInput('case_procurement'), classification: 'non_rilevante', measure: 'nessuna' }, 'standard');
    expect(r.outcome).toBe('non_conforme');
  });

  it('il chatbot è trasparenza, non un divieto; GPAI/edtech/procurement sono alto rischio', () => {
    expect(getCase('case_chatbot').correctClassification).toBe('trasparenza');
    expect(getCase('case_procurement').correctClassification).toBe('alto_rischio');
    expect(getCase('case_edtech').correctClassification).toBe('alto_rischio');
    expect(getCase('case_gpai').correctClassification).toBe('alto_rischio');
  });
});

describe('v0.6 — glossario e messaggi giuridici', () => {
  it('le nuove voci di glossario esistono e puntano a casi validi', () => {
    const ids = GLOSSARY.map((e) => e.id);
    for (const t of ['public_chatbot', 'procurement_ai', 'generative_model', 'data_governance', 'lock_in', 'adaptive_edtech', 'human_escalation', 'technical_documentation']) {
      expect(ids).toContain(t);
    }
    const validCaseIds = new Set(CASES.map((c) => c.id));
    for (const v of glossaryViews()) {
      for (const cid of v.relatedCases) expect(validCaseIds.has(cid)).toBe(true);
    }
  });

  it('non comunica messaggi sbagliati: chatbot/GPAI/EdTech non "vietati", GPAI non "automaticamente alto rischio"', () => {
    for (const locale of [itLocale, en]) {
      expect(locale.norms.norm_chatbot.notMeaning.toLowerCase()).toMatch(/non significa che|this does not mean that/);
      expect(locale.norms.norm_gpai.notMeaning.toLowerCase()).toMatch(/non significa che|this does not mean that/);
      expect(locale.norms.norm_edtech.notMeaning.toLowerCase()).toMatch(/non significa che|this does not mean that/);
      // GPAI: il regime dipende dall'uso, non è automatico
      expect(locale.caseLearning.case_gpai.teaches.length).toBeGreaterThan(10);
    }
  });
});

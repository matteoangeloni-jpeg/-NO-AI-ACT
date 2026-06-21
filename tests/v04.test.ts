import { describe, expect, it } from 'vitest';
import { getCase } from '../src/game/data/cases';
import { getNorm } from '../src/game/data/norms';
import { MISSIONS, MISSION_IDS, DEFAULT_MISSION, DEFAULT_DIFFICULTY, getMission, isRecommended } from '../src/game/data/missions';
import { defaultSave } from '../src/game/systems/SaveSystem';
import { evaluateReport, type ReportInput } from '../src/game/systems/ReportSystem';
import { shouldShowMobileGuard } from '../src/mobileGuard';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

// ---------------------------------------------------------------- difficoltà
describe('difficoltà', () => {
  it('default sicuro = standard', () => {
    expect(defaultSave().difficulty).toBe('standard');
    expect(DEFAULT_DIFFICULTY).toBe('standard');
  });

  it('label e descrizioni esistono per base/standard/expert in IT ed EN', () => {
    for (const locale of [itLocale, enLocale]) {
      for (const mode of ['base', 'standard', 'expert'] as const) {
        expect(locale.ui.difficulty.modes[mode].name.length).toBeGreaterThan(0);
        expect(locale.ui.difficulty.modes[mode].desc.length).toBeGreaterThan(0);
      }
    }
  });

  const scoring = getCase('case_scoring');
  const perfect = (): ReportInput => ({
    caseData: scoring,
    citedClues: scoring.relevantClues,
    classification: scoring.correctClassification,
    measure: scoring.correctMeasures[0],
    subject: scoring.responsibleSubjectCorrect,
    motivationIndex: scoring.correctMotivation
  });

  it('base è più indulgente: nucleo corretto + motivazione debole resta CONFORME', () => {
    const input = { ...perfect(), motivationIndex: scoring.weakMotivation };
    expect(evaluateReport(input, 'base').outcome).toBe('conforme');
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
    expect(evaluateReport(input, 'expert').outcome).toBe('contestabile');
  });

  it('base perdona anche prove non pertinenti su nucleo corretto', () => {
    const input = { ...perfect(), citedClues: [0, 2] }; // manca un reperto portante
    expect(evaluateReport(input, 'base').outcome).toBe('conforme');
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
  });

  it('un vizio GRAVE (soggetto errato) resta contestabile anche in base', () => {
    const input = { ...perfect(), subject: 'responsabile_umano' as const };
    expect(evaluateReport(input, 'base').outcome).toBe('contestabile');
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
  });

  it('atto conforme: nessun rilievo (in base i vizi lievi sono perdonati)', () => {
    const r = evaluateReport({ ...perfect(), motivationIndex: scoring.weakMotivation }, 'base');
    expect(r.outcome).toBe('conforme');
    expect(r.dominantError).toBeNull();
  });
});

// ----------------------------------------------------------------- missioni
describe('missioni', () => {
  it('esistono le missioni previste con default sicuro', () => {
    expect(MISSION_IDS).toEqual(['demo', 'lab', 'full', 'advanced', 'pack']);
    expect(DEFAULT_MISSION).toBe('full');
    expect(defaultSave().mission).toBe('full');
  });

  it('ogni missione referenzia casi esistenti', () => {
    for (const m of MISSIONS) {
      for (const cid of m.recommendedCaseIds) {
        expect(() => getCase(cid)).not.toThrow();
      }
    }
  });

  it('demo = 1 caso, lab = 2–3, full = 6, advanced include il credito civico', () => {
    expect(getMission('demo').recommendedCaseIds).toHaveLength(1);
    expect(getMission('lab').recommendedCaseIds.length).toBeGreaterThanOrEqual(2);
    expect(getMission('lab').recommendedCaseIds.length).toBeLessThanOrEqual(3);
    expect(getMission('full').recommendedCaseIds).toHaveLength(6);
    expect(getMission('advanced').recommendedCaseIds).toContain('case_credito');
  });

  it('isRecommended riflette i casi della missione', () => {
    expect(isRecommended('demo', 'case_scoring')).toBe(true);
    expect(isRecommended('demo', 'case_credito')).toBe(false);
    expect(isRecommended('advanced', 'case_credito')).toBe(true);
  });

  it('nomi/durata/obiettivo localizzati IT ed EN per ogni missione', () => {
    for (const locale of [itLocale, enLocale]) {
      for (const id of MISSION_IDS) {
        const m = locale.ui.missions.modes[id];
        expect(m.name.length).toBeGreaterThan(0);
        expect(m.duration).toMatch(/min/);
        expect(m.goal.length).toBeGreaterThan(0);
      }
    }
  });
});

// --------------------------------------------------- nuovo caso credito/welfare
describe('caso 7 — credito civico', () => {
  const c = getCase('case_credito');

  it('è presente, giocabile e classificato come pratica vietata', () => {
    expect(c.playable).toBe(true);
    expect(c.correctClassification).toBe('vietata');
    expect(c.correctMeasures).toContain('blocco');
  });

  it('ha ≥4 reperti, ≥2 rilevanti, con fonti, in IT ed EN', () => {
    for (const locale of [itLocale, enLocale]) {
      const texts = locale.cases.case_credito;
      expect(texts.clues.length).toBeGreaterThanOrEqual(4);
      expect(texts.clueSources?.length).toBe(texts.clues.length);
    }
    expect(c.relevantClues.length).toBeGreaterThanOrEqual(2);
  });

  it('norma presente con "Non significa che…" / "This does not mean that…"', () => {
    expect(() => getNorm('norm_credito')).not.toThrow();
    expect(itLocale.norms.norm_credito.notMeaning).toMatch(/Non significa che/i);
    expect(enLocale.norms.norm_credito.notMeaning).toMatch(/this does not mean that/i);
  });

  it('non generalizza: distingue divieto e alto rischio, niente assoluti fuorvianti', () => {
    const expl = itLocale.norms.norm_credito.explanation.toLowerCase();
    expect(expl).toContain('alto rischio');
    expect(expl).toContain('social scoring');
    // nessuna affermazione assoluta del tipo "ogni/tutto … è vietato"
    expect(itLocale.norms.norm_credito.notMeaning.toLowerCase()).toContain('non significa che ogni');
  });

  it('classificazione/misura/soggetto/motivazione coerenti e valide', () => {
    expect(c.responsibleSubjectCorrect).toBe('autorita');
    expect(c.correctMotivation).toBeGreaterThanOrEqual(0);
    expect(c.correctMotivation).toBeLessThan(3);
    expect(c.correctMotivation).not.toBe(c.weakMotivation);
    // la motivazione corretta nomina il social scoring / dati non pertinenti
    const correct = itLocale.cases.case_credito.motivations[c.correctMotivation].toLowerCase();
    expect(correct).toContain('social scoring');
  });

  it('un reperto vendor rassicurante ma debole è presente (fonte vendor)', () => {
    expect(itLocale.cases.case_credito.clueSources).toContain('vendor');
  });

  it('CONFORME se tutto corretto (caso giocabile end-to-end)', () => {
    const r = evaluateReport({
      caseData: c,
      citedClues: c.relevantClues,
      classification: 'vietata',
      measure: 'blocco',
      subject: 'autorita',
      motivationIndex: c.correctMotivation
    });
    expect(r.outcome).toBe('conforme');
    // banalizzare come efficienza amministrativa (motivazione 0) → contestabile
    const trivialize = evaluateReport({
      caseData: c, citedClues: c.relevantClues, classification: 'vietata', measure: 'blocco',
      subject: 'autorita', motivationIndex: 0
    });
    expect(trivialize.outcome).not.toBe('conforme');
  });
});

// --------------------------------------------------------------- mobile guard
describe('mobile guard (logica)', () => {
  it('mostra in portrait su schermo stretto, nasconde su desktop/tablet landscape', () => {
    expect(shouldShowMobileGuard(390, 844)).toBe(true); // telefono portrait
    expect(shouldShowMobileGuard(1280, 720)).toBe(false); // desktop
    expect(shouldShowMobileGuard(1024, 768)).toBe(false); // tablet landscape
    expect(shouldShowMobileGuard(844, 390)).toBe(false); // telefono landscape largo → gioco visibile
  });

  it('il messaggio del guard è localizzato IT ed EN', () => {
    expect(itLocale.ui.mobileGuard.message).toMatch(/desktop|tablet/i);
    expect(enLocale.ui.mobileGuard.message).toMatch(/desktop|tablet/i);
  });
});

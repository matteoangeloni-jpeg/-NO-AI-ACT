import { describe, expect, it } from 'vitest';
import { setLanguage, caseText } from '../src/game/i18n';
import { CASES } from '../src/game/data/cases';
import { buildTeacherReport, teacherReportToText, type TeacherReportInput } from '../src/game/systems/TeacherReportSystem';

const sample: TeacherReportInput = {
  caseReports: {
    case_scoring: {
      outcome: 'conforme', dominantError: null, classification: 'vietata', measure: 'blocco',
      subject: 'autorita', motivationIndex: 1, citedClues: [0, 1]
    },
    case_credito: {
      outcome: 'contestabile', dominantError: 'soggetto', classification: 'vietata', measure: 'blocco',
      subject: 'deployer', motivationIndex: 1, citedClues: [3, 4]
    }
  },
  indicators: { efficienza: 60, controllo: 30, diritti: 84, fiducia: 78 },
  unlockedNorms: ['norm_social_scoring', 'norm_credito'],
  endingId: null,
  startedAt: 0,
  mission: 'advanced',
  difficulty: 'expert',
  now: 30 * 60000
};

describe('v0.5 — export docente arricchito', () => {
  it('il report include concetti AI Act e fascicolo città', () => {
    setLanguage('it');
    const r = buildTeacherReport(sample);
    expect(r.concepts.length).toBeGreaterThan(0);
    expect(r.cityDossier).toHaveLength(5);
    expect(r.cityDossier.every((l) => l.indicator.length > 0 && l.trend.length > 0)).toBe(true);
  });

  it('ogni riga riporta la fragilità quando presente', () => {
    setLanguage('it');
    const r = buildTeacherReport(sample);
    const credito = r.cases.find((c) => c.caseId === 'case_credito');
    const scoring = r.cases.find((c) => c.caseId === 'case_scoring');
    expect(credito?.fragility).toBeTruthy();
    expect(scoring?.fragility).toBeNull();
  });

  it('il testo esportato include fascicolo città e concetti', () => {
    setLanguage('it');
    const txt = teacherReportToText(buildTeacherReport(sample));
    expect(txt).toContain('FASCICOLO CITTÀ');
    expect(txt).toContain('CONCETTI AI ACT EMERSI');
  });

  it('il JSON resta privo di dati personali', () => {
    const serialized = JSON.stringify(buildTeacherReport(sample)).toLowerCase();
    for (const forbidden of ['email', 'scuola', 'classe ', 'school', 'useragent']) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).not.toContain('@');
  });
});

describe('v0.5 — reperti più investigativi', () => {
  it('almeno tre casi hanno la funzione investigativa dei reperti', () => {
    const withStances = CASES.filter((c) => c.clueStances && c.clueStances.length > 0);
    expect(withStances.length).toBeGreaterThanOrEqual(3);
  });

  it('le funzioni dei reperti combaciano coi reperti dichiarati', () => {
    setLanguage('it');
    for (const c of CASES) {
      if (!c.clueStances) continue;
      expect(c.clueStances.length).toBe(caseText(c.id).clues.length);
      // i reperti "prova decisiva" coincidono con i reperti rilevanti
      const decisive = c.clueStances
        .map((s, i) => (s === 'decisive' ? i : -1))
        .filter((i) => i >= 0)
        .sort();
      expect(decisive).toEqual([...c.relevantClues].sort());
    }
  });

  it('il caso credito resta il più investigativo (più funzioni distinte)', () => {
    const credito = CASES.find((c) => c.id === 'case_credito');
    const distinct = new Set(credito?.clueStances ?? []);
    expect(distinct.size).toBeGreaterThanOrEqual(3);
  });
});

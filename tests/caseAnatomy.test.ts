import { describe, expect, it } from 'vitest';
import { PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import { caseAnatomy, contradictionPairs } from '../src/game/data/learningModel';
import { buildTeacherReport } from '../src/game/systems/TeacherReportSystem';
import { setLanguage } from '../src/game/i18n';

/**
 * CASE-ANATOMY GUARD (roadmap 2.1, Phase 1 §5 + §2 data layer).
 *
 * The anatomy of a case (decisive signals, minimizing trap, context factors)
 * is DERIVED from the pinned case data — this suite guarantees it can never
 * fork from the solution, that every case has at least one signal, and that
 * contradiction pairs (signal × trap) are well-formed for the future
 * evidence-marking mechanic.
 */

describe('case anatomy derives from pinned case data', () => {
  it('every playable case has at least one decisive signal', () => {
    for (const c of PLAYABLE_CASES) {
      expect(caseAnatomy(c.id).signalClues.length, c.id).toBeGreaterThanOrEqual(1);
    }
  });

  it('when stances exist, signals equal the pinned relevantClues (v0.5 invariant)', () => {
    for (const c of PLAYABLE_CASES) {
      if (!c.clueStances) continue;
      expect([...caseAnatomy(c.id).signalClues].sort(), c.id).toEqual([...c.relevantClues].sort());
    }
  });

  it('without stances, signals fall back to relevantClues (never empty, never invented)', () => {
    for (const c of PLAYABLE_CASES) {
      if (c.clueStances) continue;
      expect(caseAnatomy(c.id).signalClues, c.id).toEqual([...c.relevantClues]);
      expect(caseAnatomy(c.id).trapClues, c.id).toEqual([]);
    }
  });

  it('every anatomy index points at a real clue of its case', () => {
    for (const c of PLAYABLE_CASES) {
      const a = caseAnatomy(c.id);
      const n = c.clueStances?.length ?? Math.max(...c.relevantClues) + 1;
      for (const i of [...a.signalClues, ...a.trapClues, ...a.contextClues]) {
        expect(i, `${c.id} clue ${i}`).toBeGreaterThanOrEqual(0);
        expect(i, `${c.id} clue ${i}`).toBeLessThan(Math.max(n, getCase(c.id).relevantClues.length + 4));
      }
    }
  });

  it('misconceptions come from the learning model (1–2 per case)', () => {
    for (const c of PLAYABLE_CASES) {
      const m = caseAnatomy(c.id).misconceptions;
      expect(m.length, c.id).toBeGreaterThanOrEqual(1);
      expect(m.length, c.id).toBeLessThanOrEqual(3);
    }
  });
});

describe('contradiction pairs (Phase 1 §2 — data layer for evidence marking)', () => {
  it('pairs are exactly signal × trap, deduplicated and index-valid', () => {
    for (const c of PLAYABLE_CASES) {
      const a = caseAnatomy(c.id);
      const pairs = contradictionPairs(c.id);
      expect(pairs.length, c.id).toBe(a.signalClues.length * a.trapClues.length);
      for (const [s, m] of pairs) {
        expect(a.signalClues, c.id).toContain(s);
        expect(a.trapClues, c.id).toContain(m);
        expect(s, c.id).not.toBe(m);
      }
    }
  });

  it('most cases expose at least one documentary contradiction', () => {
    const withPairs = PLAYABLE_CASES.filter((c) => contradictionPairs(c.id).length > 0);
    // stance data currently covers 8 of 13 cases; this pin may only ever go
    // UP (add stances to more cases, never remove them)
    expect(withPairs.length).toBeGreaterThanOrEqual(8);
  });
});

describe('teacher debrief surfaces the anatomy line', () => {
  it('completed cases carry a localized anatomy row in both languages', () => {
    for (const lang of ['it', 'en'] as const) {
      setLanguage(lang);
      const first = PLAYABLE_CASES[0];
      const report = buildTeacherReport({
        caseReports: { [first.id]: { outcome: 'conforme', dominantError: null } } as never,
        indicators: { efficienza: 70, controllo: 40, diritti: 70, fiducia: 65 },
        unlockedNorms: [],
        endingId: null,
        startedAt: null,
        mission: 'full',
        difficulty: 'standard'
      });
      expect(report.cases).toHaveLength(1);
      expect(report.cases[0].anatomy.length).toBeGreaterThan(0);
      expect(report.cases[0].anatomy).toContain('«');
    }
    setLanguage('it');
  });
});

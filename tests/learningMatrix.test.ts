import { describe, expect, it } from 'vitest';
import { CASES, PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import { NORMS } from '../src/game/data/norms';
import {
  CASE_OBJECTIVES, LEGAL_MATRIX, MISCONCEPTIONS, OBJECTIVES,
  SELF_CHECK_QUESTIONS, allCaseObjectives, caseObjectives
} from '../src/game/data/learningModel';
import { CHAPTERS, chapterForCase, chapterProgress, chaptersCoverAllCases } from '../src/game/data/chapters';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

/**
 * LEARNING MODEL + LEGAL MATRIX GUARD (2.0 — mission §10.1/§10.2).
 *
 * The learning model must stay consistent with the executable case data (the
 * single source of truth for solutions), the norm cards, the chapters and the
 * i18n texts in BOTH languages. It must never contradict a case's solution.
 */

const objectiveIds = new Set(OBJECTIVES.map((o) => o.id));
const provisionIds = new Set(LEGAL_MATRIX.map((r) => r.provision));
const normIds = new Set(NORMS.map((n) => n.id));
const playableIds = PLAYABLE_CASES.map((c) => c.id);

describe('case → objective mapping', () => {
  it('every playable case is mapped exactly once', () => {
    const mapped = CASE_OBJECTIVES.map((m) => m.caseId);
    expect(new Set(mapped).size).toBe(mapped.length);
    expect([...mapped].sort()).toEqual([...playableIds].sort());
  });

  for (const map of CASE_OBJECTIVES) {
    it(`${map.caseId}: one primary, ≤3 secondary, valid ids, no overlap`, () => {
      expect(objectiveIds.has(map.primaryObjective)).toBe(true);
      expect(map.secondaryObjectives.length).toBeGreaterThanOrEqual(1);
      expect(map.secondaryObjectives.length).toBeLessThanOrEqual(3);
      for (const o of map.secondaryObjectives) expect(objectiveIds.has(o), o).toBe(true);
      expect(map.secondaryObjectives).not.toContain(map.primaryObjective);
      expect(map.provisions.length).toBeGreaterThanOrEqual(1);
      for (const p of map.provisions) expect(provisionIds.has(p), p).toBe(true);
      expect(map.misconceptions.length).toBeGreaterThanOrEqual(1);
      for (const m of map.misconceptions) expect(MISCONCEPTIONS).toContain(m);
    });
  }

  it('the view derives solution facts from cases.ts without contradiction', () => {
    for (const view of allCaseObjectives()) {
      const c = getCase(view.caseId);
      expect(view.decisiveClues).toEqual(c.relevantClues);
      expect(view.responsibleActor).toBe(c.responsibleSubjectCorrect);
      expect(view.correctiveMeasures).toEqual(c.correctMeasures);
    }
  });

  it('every objective is used by at least one case', () => {
    const used = new Set(CASE_OBJECTIVES.flatMap((m) => [m.primaryObjective, ...m.secondaryObjectives]));
    for (const o of objectiveIds) expect(used.has(o), o).toBe(true);
  });

  it('unknown case throws (no silent fallback)', () => {
    expect(() => caseObjectives('case_nope')).toThrow();
  });
});

describe('legal matrix — machine-readable and anchored to real game data', () => {
  it('every norm and case referenced by the matrix exists', () => {
    for (const row of LEGAL_MATRIX) {
      for (const n of row.normIds) expect(normIds.has(n), n).toBe(true);
      for (const c of row.caseIds) expect(playableIds, c).toContain(c);
      expect(row.articleRef).toContain('2024/1689');
    }
  });

  it('every case provision listed in the mapping appears with that case in the matrix', () => {
    for (const map of CASE_OBJECTIVES) {
      for (const p of map.provisions) {
        const row = LEGAL_MATRIX.find((r) => r.provision === p)!;
        expect(row.caseIds, `${map.caseId} in ${p}`).toContain(map.caseId);
      }
    }
  });

  it("every case's own norm belongs to at least one of its mapped provisions", () => {
    for (const map of CASE_OBJECTIVES) {
      const c = getCase(map.caseId);
      const norms = map.provisions.flatMap((p) => LEGAL_MATRIX.find((r) => r.provision === p)!.normIds);
      expect(norms, `${map.caseId} → ${c.normId}`).toContain(c.normId);
    }
  });
});

describe('chapters — coherent grouping without locks', () => {
  it('the four chapters cover all playable cases exactly once', () => {
    expect(chaptersCoverAllCases()).toBe(true);
    expect(CHAPTERS.map((c) => c.order)).toEqual([1, 2, 3, 4]);
  });

  it('chapterForCase resolves every playable case; durations are positive', () => {
    for (const id of playableIds) expect(chapterForCase(id)).toBeDefined();
    for (const c of CHAPTERS) {
      expect(c.estimatedMinutes).toBeGreaterThan(0);
      for (const o of c.objectives) expect(objectiveIds.has(o), o).toBe(true);
    }
  });

  it('chapterProgress counts completion correctly', () => {
    const done = { case_scoring: 'correct', case_scuola: 'partial', case_biometria: 'correct', case_credito: 'correct' } as const;
    const progress = chapterProgress(done as never);
    const prohibited = progress.find((p) => p.chapter.id === 'prohibited')!;
    expect(prohibited.done).toBe(4);
    expect(prohibited.complete).toBe(true);
    expect(progress.find((p) => p.chapter.id === 'transparency')!.done).toBe(0);
  });

  it('chapters do not lock cases: no chapter data is consulted by the map gating', () => {
    // structural guarantee: only playable+completed decide clickability
    const src = require('node:fs').readFileSync(require('node:path').resolve(__dirname, '../src/game/scenes/CityMapScene.ts'), 'utf8');
    expect(src).not.toMatch(/chapter[\s\S]{0,80}(lock|disable|playable)/i);
  });
});

describe('i18n coverage — both languages carry every learning-layer text', () => {
  const locales = { it: itLocale, en: enLocale } as const;
  for (const [lang, locale] of Object.entries(locales)) {
    it(`${lang}: chapters, objectives, self-check questions and options exist`, () => {
      const ll = (locale as typeof itLocale).learningLayer;
      for (const c of CHAPTERS) {
        const def = (ll.chapters.defs as Record<string, { title: string; intro: string; debrief: string }>)[c.id];
        expect(def, c.id).toBeDefined();
        for (const field of ['title', 'intro', 'debrief'] as const) {
          expect(def[field].length, `${lang}.${c.id}.${field}`).toBeGreaterThan(8);
        }
      }
      const objLabels = ll.objectives as Record<string, string>;
      for (const o of objectiveIds) expect(objLabels[o], `${lang}.${o}`).toBeTruthy();
      for (const q of SELF_CHECK_QUESTIONS) {
        const texts = (ll.selfCheck.questions as Record<string, { q: string; options: string[] }>)[q.id];
        expect(texts, q.id).toBeDefined();
        expect(texts.options).toHaveLength(3);
        expect(objectiveIds.has(q.objectiveId), q.id).toBe(true);
        expect([0, 1, 2]).toContain(q.correctIndex);
      }
    });
  }

  it('self-check questions cover at least 5 distinct objectives (not trivia)', () => {
    expect(new Set(SELF_CHECK_QUESTIONS.map((q) => q.objectiveId)).size).toBeGreaterThanOrEqual(5);
  });
});

describe('privacy of the metacognitive layer', () => {
  it('SelfCheckOverlay makes no network calls and stores counts only', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const src: string = fs.readFileSync(path.resolve(__dirname, '../src/game/ui/SelfCheckOverlay.ts'), 'utf8');
    for (const bad of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'navigator.send']) {
      expect(src, bad).not.toContain(bad);
    }
    expect(src).toContain("recordSelfCheck(this.phase, { correct: this.correct, total, answeredAt: Date.now() })");
    // skippable + formative by contract
    expect(src).toContain('t.skip');
    expect(src).toContain('t.formative');
  });

  it('confidence and reflection never reach the scoring system', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const report: string = fs.readFileSync(path.resolve(__dirname, '../src/game/systems/ReportSystem.ts'), 'utf8');
    for (const term of ['confidence', 'reflection', 'caseMeta', 'selfCheck']) {
      expect(report.toLowerCase(), `ReportSystem must not read ${term}`).not.toContain(term.toLowerCase());
    }
  });

  it('scoring is untouched by the learning layer (module has no scoring imports)', () => {
    const fs = require('node:fs');
    const path = require('node:path');
    const model: string = fs.readFileSync(path.resolve(__dirname, '../src/game/data/learningModel.ts'), 'utf8');
    expect(model).not.toContain('ReportSystem');
    expect(model).not.toContain('evaluateReport');
  });
});

describe('sanity: model does not drift from case inventory size', () => {
  it('11 playable cases, 4 chapters, 9 objectives', () => {
    expect(playableIds.length).toBe(CASES.filter((c) => c.playable).length);
    expect(CASE_OBJECTIVES.length).toBe(playableIds.length);
    expect(CHAPTERS.length).toBe(4);
    expect(OBJECTIVES.length).toBe(9);
  });
});

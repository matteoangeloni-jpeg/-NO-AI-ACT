import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildNotebook } from '../src/game/systems/InvestigationNotebook';
import { CHAPTERS } from '../src/game/data/chapters';
import { NORMS } from '../src/game/data/norms';
import { caseAnatomy } from '../src/game/data/learningModel';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import type { CaseReport } from '../src/game/data/types';

/**
 * INVESTIGATION NOTEBOOK GUARD (roadmap 2.1, Phase 2 §7 + §10).
 *
 * The notebook is external cognition: everything it shows is DERIVED from
 * already-saved data (case reports, metacognitive notes, unlocked norms).
 * It must never require a new save key, never alter scoring, and its
 * deferred chapter verification must only confirm on genuinely clean runs.
 */

const report = (over: Partial<CaseReport> = {}): CaseReport => ({
  outcome: 'conforme',
  dominantError: null,
  classification: 'vietata',
  measure: 'divieto',
  subject: 'autorita',
  motivationIndex: 0,
  citedClues: [],
  ...over
});

describe('notebook facts', () => {
  it('is empty and safe with no progress at all', () => {
    const nb = buildNotebook({}, {}, []);
    expect(nb.facts).toEqual([]);
    expect(nb.actors).toEqual([]);
    expect(nb.openQuestions).toEqual([]);
    expect(nb.normsUnlocked).toBe(0);
    expect(nb.normsTotal).toBe(NORMS.length);
    expect(nb.patterns).toHaveLength(CHAPTERS.length);
    expect(nb.patterns.every((p) => !p.confirmed)).toBe(true);
  });

  it('counts decisive evidence actually cited, against the case anatomy', () => {
    const anatomy = caseAnatomy('case_scoring');
    const nb = buildNotebook(
      { case_scoring: report({ citedClues: [anatomy.signalClues[0]] }) },
      {},
      []
    );
    expect(nb.facts).toHaveLength(1);
    expect(nb.facts[0].decisiveTotal).toBe(anatomy.signalClues.length);
    expect(nb.facts[0].decisiveCited).toBe(1);
  });

  it('flags when the player also cited the minimizing account', () => {
    const withTrap = CHAPTERS.flatMap((c) => c.caseIds).find((id) => caseAnatomy(id).trapClues.length > 0)!;
    const a = caseAnatomy(withTrap);
    const spotted = buildNotebook({ [withTrap]: report({ citedClues: [a.signalClues[0], a.trapClues[0]] }) }, {}, []);
    const missed = buildNotebook({ [withTrap]: report({ citedClues: [a.signalClues[0]] }) }, {}, []);
    expect(spotted.facts[0].spottedTrap).toBe(true);
    expect(missed.facts[0].spottedTrap).toBe(false);
  });
});

describe('recurring actors', () => {
  it('aggregates the responsible subject chosen per case, most frequent first', () => {
    const nb = buildNotebook(
      {
        case_scoring: report({ subject: 'autorita' }),
        case_lavoro: report({ subject: 'deployer' }),
        case_media: report({ subject: 'deployer' })
      },
      {},
      []
    );
    expect(nb.actors[0]).toEqual({ subject: 'deployer', timesChosen: 2 });
    expect(nb.actors[1]).toEqual({ subject: 'autorita', timesChosen: 1 });
  });
});

describe('open questions', () => {
  it('records reflections left unsure or to revise', () => {
    const nb = buildNotebook(
      { case_scoring: report(), case_lavoro: report() },
      { case_scoring: { reflection: 'unsure' }, case_lavoro: { reflection: 'revise' } },
      []
    );
    expect(nb.openQuestions).toEqual([
      { caseId: 'case_scoring', reason: 'unsure' },
      { caseId: 'case_lavoro', reason: 'revise' }
    ]);
  });

  it('flags miscalibration: high confidence with a dominant error', () => {
    const nb = buildNotebook(
      { case_scoring: report({ dominantError: 'classification' }) },
      { case_scoring: { confidence: 3 } },
      []
    );
    expect(nb.openQuestions).toEqual([{ caseId: 'case_scoring', reason: 'miscalibrated' }]);
  });

  it('a confident, clean case raises nothing', () => {
    const nb = buildNotebook({ case_scoring: report() }, { case_scoring: { confidence: 3, reflection: 'holds' } }, []);
    expect(nb.openQuestions).toEqual([]);
  });
});

describe('deferred verification by chapter (§10)', () => {
  const chapter = CHAPTERS[0];

  it('does not confirm a partially played chapter', () => {
    const reports = Object.fromEntries(chapter.caseIds.slice(0, -1).map((id) => [id, report()]));
    const nb = buildNotebook(reports, {}, []);
    const p = nb.patterns.find((x) => x.chapterId === chapter.id)!;
    expect(p.done).toBe(chapter.caseIds.length - 1);
    expect(p.confirmed).toBe(false);
  });

  it('confirms only when every case of the chapter closed without a dominant error', () => {
    const clean = Object.fromEntries(chapter.caseIds.map((id) => [id, report()]));
    expect(buildNotebook(clean, {}, []).patterns.find((x) => x.chapterId === chapter.id)!.confirmed).toBe(true);

    const flawed = { ...clean, [chapter.caseIds[0]]: report({ dominantError: 'subject' }) };
    expect(buildNotebook(flawed, {}, []).patterns.find((x) => x.chapterId === chapter.id)!.confirmed).toBe(false);
  });
});

describe('wiring and i18n', () => {
  const root = resolve(__dirname, '..');
  const overlay = readFileSync(resolve(root, 'src/game/ui/NotebookOverlay.ts'), 'utf8');
  const map = readFileSync(resolve(root, 'src/game/scenes/CityMapScene.ts'), 'utf8');

  it('is read-only: the overlay never writes state', () => {
    expect(overlay).not.toMatch(/StateManager\.(save|set|reset|apply|complete)/);
    expect(overlay).toContain('buildNotebook(StateManager.caseReports');
  });

  it('is reachable from the map by pointer and by keyboard', () => {
    expect(map).toContain('new NotebookOverlay(this)');
    expect(map).toContain("keydown-N");
  });

  it('announces itself through the reading layer', () => {
    expect(overlay).toMatch(/ReadingLayer\.announce\(/);
  });

  it('has the full key set in both languages', () => {
    for (const d of [itDict, en]) {
      const n = d.learningLayer.notebook;
      for (const k of ['button', 'title', 'intro', 'factsLabel', 'actorsLabel', 'patternsLabel', 'openLabel', 'close'] as const) {
        expect(n[k].length, k).toBeGreaterThan(0);
      }
      for (const r of ['unsure', 'revise', 'miscalibrated'] as const) {
        expect(n.openReasons[r].length, r).toBeGreaterThan(0);
      }
      expect(n.factsLabel).toContain('{n}');
      expect(n.evidenceLine).toContain('{cited}');
      expect(n.patternProgress).toContain('{done}');
    }
  });
});

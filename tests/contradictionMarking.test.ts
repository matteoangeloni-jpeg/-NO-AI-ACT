import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { contradictionPairs } from '../src/game/data/learningModel';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * CONTRADICTION-MARKING GUARD (roadmap 2.1, Phase 1 §2 — mechanic layer).
 *
 * The player can declare that the cited exhibits contradict each other; the
 * game confirms only when the derived (decisive × minimizing) pair really
 * exists. Non-scored by design: this suite pins the wiring, the i18n and the
 * fact that the mechanic never touches the evaluation path.
 */

const root = resolve(__dirname, '..');
const scene = readFileSync(resolve(root, 'src/game/scenes/EvidenceScene.ts'), 'utf8');

describe('evidence scene wiring', () => {
  it('uses the derived contradiction pairs (single source of truth)', () => {
    expect(scene).toContain("import { contradictionPairs } from '../data/learningModel'");
    expect(scene).toContain('contradictionPairs(this.caseData.id)');
  });

  it('is keyboard-accessible (C key) and announced via the reading layer', () => {
    expect(scene).toContain("keydown-C");
    expect(scene).toMatch(/ReadingLayer\.announce\(.*contradiction/i);
  });

  it('never feeds the marking into scoring: proceed() passes only citedClues', () => {
    const proceed = scene.slice(scene.indexOf('private proceed()'), scene.indexOf('private syncReadingLayer'));
    expect(proceed).toContain('citedClues: cited');
    expect(proceed).not.toMatch(/contradiction/i);
  });
});

describe('stance coverage after the 2.1 review', () => {
  it('every playable case now declares clue stances', () => {
    for (const c of PLAYABLE_CASES) {
      expect(c.clueStances, c.id).toBeDefined();
      expect(c.clueStances!.length, c.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('contradiction coverage floor stays at 8/13 (only ever goes up)', () => {
    const withPairs = PLAYABLE_CASES.filter((c) => contradictionPairs(c.id).length > 0);
    expect(withPairs.length).toBeGreaterThanOrEqual(8);
  });
});

describe('marking i18n exists in both languages', () => {
  it('button, found and none strings with {a}/{b} placeholders', () => {
    for (const d of [itDict, en]) {
      expect(d.ui.evidence.contradictionButton).toContain('[C]');
      expect(d.ui.evidence.contradictionFound).toContain('{a}');
      expect(d.ui.evidence.contradictionFound).toContain('{b}');
      expect(d.ui.evidence.contradictionNone.length).toBeGreaterThan(20);
    }
  });
});

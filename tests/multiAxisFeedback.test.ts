import { describe, expect, it } from 'vitest';
import { multiAxisFeedback } from '../src/game/systems/MultiAxisFeedback';
import { OUTCOME_DELTAS } from '../src/game/data/indicators';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * MULTI-AXIS FEEDBACK GUARD (roadmap 2.1, Phase 1 §4).
 *
 * The three-axis reading (legal validity / rights impact / public trust) is
 * DERIVED from the pinned OUTCOME_DELTAS — it must never fork from them, and
 * it must never influence scoring (it is a pure function of the outcome).
 */

describe('multiAxisFeedback derives from the pinned outcome deltas', () => {
  it('legal axis mirrors the outcome quality', () => {
    for (const q of ['correct', 'partial', 'wrong'] as const) {
      expect(multiAxisFeedback(q).legal).toBe(q);
    }
  });

  it('rights and institution axes follow the sign of the pinned deltas', () => {
    for (const q of ['correct', 'partial', 'wrong'] as const) {
      const d = OUTCOME_DELTAS[q];
      const ax = multiAxisFeedback(q);
      expect(ax.rights).toBe(d.diritti > 0 ? 'strengthened' : d.diritti < 0 ? 'weakened' : 'mixed');
      expect(ax.institution).toBe(d.fiducia > 0 ? 'strengthened' : d.fiducia < 0 ? 'weakened' : 'mixed');
    }
  });

  it('current pinned balance: correct strengthens, wrong weakens', () => {
    expect(multiAxisFeedback('correct')).toEqual({ legal: 'correct', rights: 'strengthened', institution: 'strengthened' });
    expect(multiAxisFeedback('wrong')).toEqual({ legal: 'wrong', rights: 'weakened', institution: 'weakened' });
  });
});

describe('axes texts exist in both languages with the full key set', () => {
  it('IT and EN expose label + all judgment texts', () => {
    for (const dict of [itDict, en]) {
      const axes = dict.ui.decisionDebrief.axes;
      expect(axes.label.length).toBeGreaterThan(0);
      for (const q of ['correct', 'partial', 'wrong'] as const) expect(axes.legal[q].length).toBeGreaterThan(0);
      for (const j of ['strengthened', 'mixed', 'weakened'] as const) {
        expect(axes.rights[j].length).toBeGreaterThan(0);
        expect(axes.institution[j].length).toBeGreaterThan(0);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import { CASES, PLAYABLE_CASES, CASES_REQUIRED_FOR_FINALE, MIN_CITED_CLUES } from '../src/game/data/cases';
import { INITIAL_INDICATORS, OUTCOME_DELTAS, applyOutcome, clampIndicator } from '../src/game/data/indicators';
import { computeEnding, ENDING_IDS } from '../src/game/data/endings';

/**
 * GAMEPLAY INVARIANTS (v1.x) — pinned so v1.2 feature work cannot silently
 * change what the game teaches or how it scores.
 *
 * Precise assertions on the source-of-truth data, NOT fragile snapshots:
 *  - each case's correct classification / measures / responsible subject /
 *    motivation index / relevant clues (the "case solution");
 *  - the starting indicators and the per-outcome deltas (scoring);
 *  - the three endings and their thresholds.
 *
 * Changing any value here must be a deliberate, reviewed decision (and, for
 * case solutions, requires AI Act / policy review).
 */

// caseId -> [classification, measures, subject, motivationIndex, relevantClues]
const SOLUTIONS: Record<string, [string, string[], string, number, number[]]> = {
  case_scoring: ['vietata', ['blocco'], 'autorita', 1, [0, 1]],
  case_lavoro: ['alto_rischio', ['audit', 'oversight', 'dati_logging'], 'deployer', 2, [1, 2]],
  case_media: ['trasparenza', ['etichettare', 'informare'], 'autorita', 0, [0, 1]],
  case_scuola: ['vietata', ['blocco'], 'deployer', 1, [0, 2]],
  case_ospedale: ['alto_rischio', ['audit', 'dati_logging', 'oversight'], 'deployer', 0, [1, 2]],
  case_biometria: ['vietata', ['blocco'], 'autorita', 2, [1, 2]],
  case_credito: ['vietata', ['blocco'], 'autorita', 1, [3, 4]],
  case_chatbot: ['trasparenza', ['informare', 'etichettare'], 'deployer', 1, [1, 4]],
  case_procurement: ['alto_rischio', ['audit', 'dati_logging', 'oversight'], 'autorita', 0, [2, 4]],
  case_edtech: ['alto_rischio', ['oversight', 'audit', 'dati_logging'], 'deployer', 2, [0, 3]],
  case_gpai: ['alto_rischio', ['oversight', 'audit', 'dati_logging'], 'deployer', 1, [2, 4]]
};

describe('case solutions are pinned', () => {
  it('exactly the 11 known cases exist and are playable', () => {
    expect(CASES.map((c) => c.id).sort()).toEqual(Object.keys(SOLUTIONS).sort());
    expect(PLAYABLE_CASES.length).toBe(11);
  });

  it('each case keeps its exact solution (classification, measures, subject, motivation, clues)', () => {
    for (const c of CASES) {
      const [cls, meas, subj, mot, clues] = SOLUTIONS[c.id];
      expect(c.correctClassification, `${c.id} classification`).toBe(cls);
      expect(c.correctMeasures, `${c.id} measures`).toEqual(meas);
      expect(c.responsibleSubjectCorrect, `${c.id} subject`).toBe(subj);
      expect(c.correctMotivation, `${c.id} motivation`).toBe(mot);
      expect(c.relevantClues, `${c.id} clues`).toEqual(clues);
    }
  });

  it('progression constants are unchanged', () => {
    expect(CASES_REQUIRED_FOR_FINALE).toBe(4);
    expect(MIN_CITED_CLUES).toBe(2);
  });
});

describe('scoring (indicator) logic is pinned', () => {
  it('starting indicators are the design values', () => {
    expect(INITIAL_INDICATORS).toEqual({ efficienza: 70, controllo: 40, diritti: 70, fiducia: 65 });
  });

  it('per-outcome deltas are unchanged', () => {
    expect(OUTCOME_DELTAS.correct).toEqual({ efficienza: -3, controllo: -6, diritti: 10, fiducia: 8 });
    expect(OUTCOME_DELTAS.partial).toEqual({ efficienza: 0, controllo: -2, diritti: 4, fiducia: 2 });
    expect(OUTCOME_DELTAS.wrong).toEqual({ efficienza: 6, controllo: 10, diritti: -10, fiducia: -8 });
  });

  it('applyOutcome clamps to 0..100 and rounds', () => {
    expect(clampIndicator(-5)).toBe(0);
    expect(clampIndicator(105)).toBe(100);
    expect(clampIndicator(50.6)).toBe(51);
    const r = applyOutcome({ efficienza: 70, controllo: 40, diritti: 70, fiducia: 65 }, 'correct');
    expect(r).toEqual({ efficienza: 67, controllo: 34, diritti: 80, fiducia: 73 });
  });
});

describe('endings and their thresholds are pinned', () => {
  it('the three endings exist in order', () => {
    expect(ENDING_IDS).toEqual(['ending_opaca', 'ending_fragile', 'ending_governata']);
  });

  it('thresholds behave exactly at the boundaries', () => {
    const at = (diritti: number, fiducia: number) => computeEnding({ efficienza: 50, controllo: 50, diritti, fiducia });
    // opaca: diritti < 40 OR fiducia < 40
    expect(at(39, 80)).toBe('ending_opaca');
    expect(at(80, 39)).toBe('ending_opaca');
    // governata: diritti >= 60 AND fiducia >= 60
    expect(at(60, 60)).toBe('ending_governata');
    expect(at(100, 100)).toBe('ending_governata');
    // fragile: everything else
    expect(at(40, 40)).toBe('ending_fragile');
    expect(at(59, 90)).toBe('ending_fragile');
  });
});

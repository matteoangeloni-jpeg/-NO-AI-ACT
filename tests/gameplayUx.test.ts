import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('phaser', () => ({ default: { Events: { EventEmitter } } }));
import { StateManager } from '../src/game/systems/StateManager';
import { SaveSystem } from '../src/game/systems/SaveSystem';
import { InvestigationGuide, guideEligible } from '../src/game/systems/InvestigationGuide';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { LOCALES } from '../src/game/i18n';
import type { CaseReport } from '../src/game/data/types';

const storage = new Map<string, string>();
beforeEach(() => {
  vi.stubGlobal('localStorage', { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) });
  vi.stubGlobal('document', { body: { classList: { toggle: vi.fn() } } });
  StateManager.endReview();
  StateManager.newGame();
  StateManager.setGameMode('turno');
});

describe('review keeps signed originals and the v2 save', () => {
  it('does not start an empty review', () => {
    const before = SaveSystem.load();
    expect(StateManager.beginReview()).toBeNull();
    expect(StateManager.isReviewing).toBe(false);
    expect(SaveSystem.load()).toEqual(before);
  });
  it('freezes the existing review itinerary and restores every original on exit', () => {
    for (const c of PLAYABLE_CASES.slice(0, 3)) StateManager.resolveCase(c.id, c.normId, 'wrong');
    const before = SaveSystem.load();
    const first = StateManager.beginReview();
    expect(first).toBeTruthy();
    const plan = StateManager.gamePlan;
    for (const id of plan.caseIds) {
      const c = PLAYABLE_CASES.find(c => c.id === id)!;
      StateManager.resolveCase(id, c.normId, 'correct');
    }
    expect(StateManager.nextInPlan()).toBeNull();
    expect(StateManager.gamePlan).toEqual(plan);
    expect(SaveSystem.load()).toEqual(before);
    StateManager.endReview();
    expect(StateManager.completedCases).toEqual(before.completedCases);
    expect(StateManager.indicators).toEqual(before.indicators);
    expect(StateManager.caseReports).toEqual(before.caseReports);
    expect(SaveSystem.load()).toEqual(before);
  });
  it('preserves original reports through repeated signing and draft writes', () => {
    const c = PLAYABLE_CASES[0];
    StateManager.resolveCase(c.id, c.normId, 'partial');
    const report: CaseReport = { outcome: 'parziale', dominantError: 'misura_insufficiente', classification: 'vietata', measure: 'blocco', subject: 'provider', motivationIndex: 0, citedClues: [0, 1] };
    StateManager.saveCaseReport(c.id, report);
    const before = SaveSystem.load();
    StateManager.beginReview();
    StateManager.saveDraft(c.id, { citedClues: [1, 2] });
    StateManager.resolveCase(c.id, c.normId, 'correct');
    StateManager.saveCaseReport(c.id, { ...report, outcome: 'conforme' });
    expect(SaveSystem.load()).toEqual(before);
    StateManager.endReview();
    expect(StateManager.caseReports).toEqual(before.caseReports);
  });
});

describe('optional procedural guide', () => {
  it('is contextual to the first file of a shift, not free play or review', () => {
    expect(guideEligible('turno', 0, 'a', 'a')).toBe(true);
    for (const mode of ['libera', 'sorpresa', 'ripasso']) expect(guideEligible(mode, 0, 'a', 'a')).toBe(false);
    expect(guideEligible('turno', 1, 'a', 'a')).toBe(false);
    expect(guideEligible('turno', 0, 'a', 'b')).toBe(false);
  });
  it('can be skipped and recalled without changing the save or score', () => {
    StateManager.markStarted();
    const id = StateManager.gamePlan.caseIds[0];
    const before = SaveSystem.load();
    InvestigationGuide.begin(id);
    InvestigationGuide.skip(id);
    expect(InvestigationGuide.active(id)).toBe(false);
    InvestigationGuide.recall(id);
    expect(InvestigationGuide.active(id)).toBe(true);
    expect(SaveSystem.load()).toEqual(before);
  });
  it('progresses from inspection to citing and comparison', () => {
    expect(InvestigationGuide.evidenceStep(0, 0)).toBe(0);
    expect(InvestigationGuide.evidenceStep(1, 1)).toBe(1);
    InvestigationGuide.compare();
    expect(InvestigationGuide.evidenceStep(3, 2)).toBe(3);
  });
  it('does not count a review signature as the first completed case', () => {
    const c = PLAYABLE_CASES[0];
    StateManager.resolveCase(c.id, c.normId, 'wrong');
    StateManager.beginReview();
    const listener = vi.fn();
    StateManager.on('gameplay-ux', listener);
    InvestigationGuide.complete(c.id);
    expect(listener).not.toHaveBeenCalled();
    StateManager.off('gameplay-ux', listener);
  });
  it('has all five procedural steps, mode descriptions and support levels in three languages', () => {
    for (const locale of Object.values(LOCALES)) {
      expect(locale.gameplay.steps).toHaveLength(5);
      expect(Object.keys(locale.gameplay.modes)).toHaveLength(4);
      expect(Object.keys(locale.gameplay.assistance)).toHaveLength(3);
      expect(locale.gameplay.steps.every(s => s.length > 30)).toBe(true);
    }
  });
});

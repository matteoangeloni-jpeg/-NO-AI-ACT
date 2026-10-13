import { StateManager } from './StateManager';

export type GameplayUxEvent = 'tutorial_started' | 'tutorial_skipped' | 'tutorial_completed'
  | 'first_case_completed' | 'help_requested' | 'citation_error' | 'debrief_opened' | 'review_started';

/** Internal bus only. No AnalyticsSystem subscription or remote transport. */
export function emitGameplayUx(event: GameplayUxEvent, caseId?: string): void {
  StateManager.emit('gameplay-ux', { event, ...(caseId ? { caseId } : {}) });
}

export function guideEligible(mode: string, completed: number, first: string | undefined, caseId: string): boolean {
  return mode === 'turno' && completed === 0 && first === caseId;
}

let session: number | null | undefined;
let skipped = false;
let started = false;
let compared = false;

export const InvestigationGuide = {
  eligible(caseId: string): boolean {
    if (session !== StateManager.startedAt) {
      session = StateManager.startedAt;
      skipped = false;
      started = false;
      compared = false;
    }
    return guideEligible(StateManager.gameMode, StateManager.completedCount(), StateManager.gamePlan.caseIds[0], caseId);
  },
  active(caseId: string): boolean {
    return this.eligible(caseId) && !skipped;
  },
  begin(caseId: string): void {
    if (this.active(caseId) && !started) { started = true; emitGameplayUx('tutorial_started', caseId); }
  },
  skip(caseId: string): void { skipped = true; emitGameplayUx('tutorial_skipped', caseId); },
  recall(caseId: string): void { this.eligible(caseId); skipped = false; this.begin(caseId); emitGameplayUx('help_requested', caseId); },
  compare(): void { compared = true; },
  evidenceStep(opened: number, cited: number): number { return opened === 0 ? 0 : cited < 2 ? 1 : compared ? 3 : 2; },
  complete(caseId: string): void {
    if (StateManager.isReviewing) return;
    if (this.active(caseId) && started) emitGameplayUx('tutorial_completed', caseId);
    if (StateManager.completedCount() === 0) emitGameplayUx('first_case_completed', caseId);
  }
};

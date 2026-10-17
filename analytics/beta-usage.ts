import type { AnalyticsPayload } from '../src/game/systems/analyticsSchema';
import { validateBatch, type Batch } from './aggregation';

const events: Record<string, AnalyticsPayload['event']> = {
  game_opened: 'game_opened', game_started: 'game_started', game_resumed: 'game_resumed',
  case_started: 'case_started', case_completed: 'usage_case_completed',
  case_abandoned: 'usage_case_left', session_completed: 'usage_session_completed', pageview: 'pageview'
};
const allowed = new Set(Object.values(events));
export function usagePayload(payload: AnalyticsPayload): AnalyticsPayload | undefined {
  const event = events[payload.event];
  if (!event) return;
  const { language, mode, phase, caseId } = payload.properties;
  return { schemaVersion: payload.schemaVersion, gameVersion: payload.gameVersion, event,
    properties: { language, mode, phase, ...(caseId ? { caseId } : {}) } };
}
export function validateUsageBatch(value: unknown): value is Batch {
  return validateBatch(value) && value.cells.every(cell => allowed.has(cell.event)
    && Object.keys(cell.properties).every(key => ['language', 'mode', 'phase', 'caseId'].includes(key)));
}

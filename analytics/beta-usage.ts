import type { AnalyticsPayload } from '../src/game/systems/analyticsSchema';
import { validateBatch, type Batch } from './aggregation';

const events: Record<string, AnalyticsPayload['event']> = {
  game_opened: 'game_opened', game_started: 'game_started', game_resumed: 'game_resumed',
  case_started: 'case_started', case_completed: 'usage_case_completed',
  case_abandoned: 'usage_case_left', session_completed: 'usage_session_completed', pageview: 'pageview',
  case_quality_assessed: 'case_quality_assessed', decision_revised: 'decision_revised',
  accessibility_used: 'accessibility_used', interface_error: 'interface_error'
};
const allowed = new Set(Object.values(events));
export function usagePayload(payload: AnalyticsPayload): AnalyticsPayload | undefined {
  const event = events[payload.event];
  if (!event) return;
  const { language, mode, phase, caseId } = payload.properties;
  const safe = payload.event === 'case_quality_assessed' || payload.event === 'decision_revised'
    ? Object.fromEntries(Object.entries(payload.properties).filter(([key]) => [
      'selectedClassification', 'referenceClassification', 'classificationMatch', 'selectedMeasure', 'selectedActor',
      'evidenceQuality', 'decisionQuality', 'reasoningQuality', 'viewedEvidenceBand', 'citedEvidenceBand',
      'omittedRelevantBand', 'contradictoryEvidenceRecognized', 'revisionOccurred', 'revisionCountBand', 'revisionDirection'
    ].includes(key)))
    : payload.event === 'accessibility_used' ? { accessibilitySetting: payload.properties.accessibilitySetting }
      : payload.event === 'interface_error' ? { errorCode: payload.properties.errorCode } : {};
  return { schemaVersion: payload.schemaVersion, gameVersion: payload.gameVersion, event,
    properties: { language, mode, phase, ...(caseId ? { caseId } : {}), ...safe } } as AnalyticsPayload;
}
export function validateUsageBatch(value: unknown): value is Batch {
  return validateBatch(value) && value.cells.every(cell => allowed.has(cell.event)
    && Object.keys(cell.properties).every(key => ['language', 'mode', 'phase', 'caseId',
      'selectedClassification', 'referenceClassification', 'classificationMatch', 'selectedMeasure', 'selectedActor',
      'evidenceQuality', 'decisionQuality', 'reasoningQuality', 'viewedEvidenceBand', 'citedEvidenceBand',
      'omittedRelevantBand', 'contradictoryEvidenceRecognized', 'revisionOccurred', 'revisionCountBand',
      'revisionDirection', 'accessibilitySetting', 'errorCode'].includes(key)));
}

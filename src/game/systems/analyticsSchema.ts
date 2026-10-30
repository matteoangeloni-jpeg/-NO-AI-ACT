import { PLAYABLE_CASES } from '../data/cases';
import { en } from '../i18n/en';
import type { Classification, Measure, ResponsibleSubject } from '../data/types';

export const ANALYTICS_SCHEMA_VERSION = 2 as const;
export const ANALYTICS_SCHEMA_VERSIONS = Object.freeze([1, ANALYTICS_SCHEMA_VERSION] as const);
export const ANALYTICS_GAME_VERSION = '4.0.0' as const;
export const ANALYTICS_GAME_VERSIONS = Object.freeze(['4.0-candidate', ANALYTICS_GAME_VERSION] as const);
export const TUTORIAL_VERSION = 'investigation-v1' as const;
export const ANALYTICS_LIMITS = Object.freeze({ cells: 512, count: 1_000_000 });
export const LANGUAGES = Object.freeze(['it', 'en', 'fr'] as const);
export const MODES = Object.freeze(['turno', 'libera', 'sorpresa', 'ripasso'] as const);
export const PHASES = Object.freeze(['menu', 'briefing', 'map', 'case', 'evidence', 'incident', 'decision', 'report',
  'consequence', 'norm', 'archive', 'glossary', 'session_end', 'finale', 'learning', 'credits'] as const);
export const RESULTS = Object.freeze(['correct', 'partial', 'wrong'] as const);
export const DURATION_BUCKETS = Object.freeze(['under_1m', '1_to_5m', '5_to_15m', '15_to_30m', '30m_plus'] as const);
export const CLASSIFICATIONS = Object.freeze(['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'] as const satisfies readonly Classification[]);
export const MEASURES = Object.freeze(['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'] as const satisfies readonly Measure[]);
export const RESPONSIBLE_SUBJECTS = Object.freeze(['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'] as const satisfies readonly ResponsibleSubject[]);
export const QUALITY_BANDS = Object.freeze(['low', 'medium', 'high'] as const);
export const COUNT_BANDS = Object.freeze(['none', 'one', 'two', 'three_plus'] as const);
export const REVISION_DIRECTIONS = Object.freeze(['none', 'toward_reference', 'away_from_reference', 'lateral'] as const);
export const ACCESSIBILITY_SETTINGS = Object.freeze(['reading_layer', 'reduced_motion', 'instant_text', 'keyboard_navigation'] as const);
export const ERROR_CODES = Object.freeze(['render', 'audio', 'storage', 'analytics_transport', 'unexpected'] as const);
export const ANALYTICS_EVENTS = Object.freeze([
  'game_opened', 'game_started', 'game_resumed', 'usage_case_completed', 'usage_case_left', 'usage_session_completed', 'game_session_ended', 'language_selected', 'mode_selected',
  'case_started', 'case_completed', 'case_abandoned', 'session_completed',
  'case_quality_assessed', 'decision_revised', 'accessibility_used', 'interface_error',
  'evidence_opened', 'evidence_cited', 'citation_error', 'hint_requested', 'decision_submitted', 'report_signed',
  'tutorial_started', 'tutorial_skipped', 'tutorial_completed', 'debrief_opened', 'review_started',
  'clues_selected', 'classification_selected', 'measure_selected', 'case_result', 'norm_unlocked',
  'archive_opened', 'ending_reached', 'game_completed', 'credits_opened', 'reset_game', 'pageview'
] as const);
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[number];
export type AnalyticsPhase = typeof PHASES[number];
export type AnalyticsResult = typeof RESULTS[number];
export interface AnalyticsContext { language: typeof LANGUAGES[number]; mode: typeof MODES[number] }
export interface AnalyticsProperties extends AnalyticsContext {
  phase: AnalyticsPhase;
  caseId?: string;
  result?: AnalyticsResult;
  hintUsed?: boolean;
  durationBucket?: typeof DURATION_BUCKETS[number];
  tutorialVersion?: typeof TUTORIAL_VERSION;
  selectedClassification?: typeof CLASSIFICATIONS[number];
  referenceClassification?: typeof CLASSIFICATIONS[number];
  classificationMatch?: boolean;
  selectedMeasure?: typeof MEASURES[number];
  selectedActor?: typeof RESPONSIBLE_SUBJECTS[number];
  evidenceQuality?: typeof QUALITY_BANDS[number];
  decisionQuality?: typeof QUALITY_BANDS[number];
  reasoningQuality?: AnalyticsResult;
  viewedEvidenceBand?: typeof COUNT_BANDS[number];
  citedEvidenceBand?: typeof COUNT_BANDS[number];
  omittedRelevantBand?: typeof COUNT_BANDS[number];
  contradictoryEvidenceRecognized?: boolean;
  revisionOccurred?: boolean;
  revisionCountBand?: typeof COUNT_BANDS[number];
  revisionDirection?: typeof REVISION_DIRECTIONS[number];
  abandonmentPhase?: AnalyticsPhase;
  accessibilitySetting?: typeof ACCESSIBILITY_SETTINGS[number];
  errorCode?: typeof ERROR_CODES[number];
}
export interface AnalyticsPayload {
  schemaVersion: typeof ANALYTICS_SCHEMA_VERSIONS[number];
  gameVersion: typeof ANALYTICS_GAME_VERSIONS[number];
  event: AnalyticsEvent;
  properties: AnalyticsProperties;
}
export interface AnalyticsAggregate extends AnalyticsPayload { count: number }
export const ALLOWED_PROPERTIES = ['language', 'mode', 'phase', 'caseId', 'result', 'hintUsed', 'durationBucket', 'tutorialVersion',
  'selectedClassification', 'referenceClassification', 'classificationMatch', 'selectedMeasure', 'selectedActor',
  'evidenceQuality', 'decisionQuality', 'reasoningQuality', 'viewedEvidenceBand', 'citedEvidenceBand',
  'omittedRelevantBand', 'contradictoryEvidenceRecognized', 'revisionOccurred', 'revisionCountBand',
  'revisionDirection', 'abandonmentPhase', 'accessibilitySetting', 'errorCode'] as const;
export type AllowedProperty = typeof ALLOWED_PROPERTIES[number];
type Rule = { readonly required: readonly AllowedProperty[]; readonly optional: readonly AllowedProperty[]; readonly once: 'document' | 'session' | 'case' | 'action' };
const rule = (required: readonly AllowedProperty[] = [], optional: readonly AllowedProperty[] = [], once: Rule['once'] = 'action'): Rule => Object.freeze({ required: Object.freeze([...required]), optional: Object.freeze([...optional]), once });
export const EVENT_CATALOG: Readonly<Record<AnalyticsEvent, Rule>> = Object.freeze({
  game_opened: rule([], [], 'document'),
  usage_case_completed: rule(['caseId'], [], 'case'),
  usage_case_left: rule(['caseId'], [], 'case'),
  usage_session_completed: rule([], [], 'session'),
  game_started: rule([], [], 'session'), game_resumed: rule([], [], 'session'),
  game_session_ended: rule(['durationBucket'], [], 'session'),
  language_selected: rule(), mode_selected: rule(), case_started: rule(['caseId'], [], 'case'),
  case_completed: rule(['caseId', 'result', 'durationBucket', 'hintUsed'], [], 'case'),
  case_abandoned: rule(['caseId', 'durationBucket', 'hintUsed'], ['abandonmentPhase'], 'case'),
  case_quality_assessed: rule(['caseId', 'selectedClassification', 'referenceClassification', 'classificationMatch',
    'selectedMeasure', 'selectedActor', 'evidenceQuality', 'decisionQuality', 'reasoningQuality', 'viewedEvidenceBand',
    'citedEvidenceBand', 'omittedRelevantBand', 'contradictoryEvidenceRecognized', 'revisionOccurred',
    'revisionCountBand', 'revisionDirection'], [], 'case'),
  decision_revised: rule(['caseId', 'revisionCountBand', 'revisionDirection'], [], 'case'),
  accessibility_used: rule(['accessibilitySetting'], [], 'session'),
  interface_error: rule(['errorCode'], ['caseId'], 'action'),
  session_completed: rule(['durationBucket'], [], 'session'),
  evidence_opened: rule(['caseId']), evidence_cited: rule(['caseId']),
  citation_error: rule(['caseId'], [], 'case'), hint_requested: rule(['caseId']),
  decision_submitted: rule(['caseId'], ['hintUsed'], 'case'),
  report_signed: rule(['caseId', 'result'], ['hintUsed'], 'case'),
  tutorial_started: rule(['caseId', 'tutorialVersion'], [], 'case'),
  tutorial_skipped: rule(['caseId', 'tutorialVersion'], [], 'case'),
  tutorial_completed: rule(['caseId', 'tutorialVersion'], [], 'case'),
  debrief_opened: rule(['caseId', 'result'], [], 'case'), review_started: rule([], [], 'session'),
  clues_selected: rule(['caseId'], [], 'case'), classification_selected: rule(['caseId'], [], 'case'),
  measure_selected: rule(['caseId'], [], 'case'), case_result: rule(['caseId', 'result'], [], 'case'),
  norm_unlocked: rule([], ['caseId'], 'case'), archive_opened: rule(),
  ending_reached: rule([], [], 'session'), game_completed: rule([], [], 'session'),
  credits_opened: rule(), reset_game: rule(), pageview: rule()
});
const cases = new Map(PLAYABLE_CASES.map(c => [c.id, c]));
const evidenceCounts = new Map(PLAYABLE_CASES.map(c => [c.id, en.cases[c.id as keyof typeof en.cases].clues.length]));
export function isCaseId(value: unknown): value is string { return typeof value === 'string' && cases.has(value); }
export function isEvidenceIndex(caseId: string, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < (evidenceCounts.get(caseId) ?? 0);
}
function member(values: readonly string[], value: unknown): boolean { return typeof value === 'string' && values.includes(value); }
export function validProperty(key: AllowedProperty, value: unknown): boolean {
  switch (key) {
    case 'language': return member(LANGUAGES, value);
    case 'mode': return member(MODES, value);
    case 'phase': return member(PHASES, value);
    case 'caseId': return isCaseId(value);
    case 'result': return member(RESULTS, value);
    case 'hintUsed': return typeof value === 'boolean';
    case 'durationBucket': return member(DURATION_BUCKETS, value);
    case 'tutorialVersion': return value === TUTORIAL_VERSION;
    case 'selectedClassification': case 'referenceClassification': return member(CLASSIFICATIONS, value);
    case 'selectedMeasure': return member(MEASURES, value);
    case 'selectedActor': return member(RESPONSIBLE_SUBJECTS, value);
    case 'evidenceQuality': case 'decisionQuality': return member(QUALITY_BANDS, value);
    case 'reasoningQuality': return member(RESULTS, value);
    case 'viewedEvidenceBand': case 'citedEvidenceBand': case 'omittedRelevantBand': case 'revisionCountBand': return member(COUNT_BANDS, value);
    case 'classificationMatch': case 'contradictoryEvidenceRecognized': case 'revisionOccurred': return typeof value === 'boolean';
    case 'revisionDirection': return member(REVISION_DIRECTIONS, value);
    case 'abandonmentPhase': return member(PHASES, value);
    case 'accessibilitySetting': return member(ACCESSIBILITY_SETTINGS, value);
    case 'errorCode': return member(ERROR_CODES, value);
  }
}
export function sanitizeProperties(props: Record<string, unknown> | undefined): Partial<AnalyticsProperties> {
  const clean: Record<string, unknown> = {};
  for (const key of ALLOWED_PROPERTIES) if (props && validProperty(key, props[key])) clean[key] = props[key];
  return clean as Partial<AnalyticsProperties>;
}
export function validatePayload(value: unknown): value is AnalyticsPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  if (!['schemaVersion', 'gameVersion', 'event', 'properties'].every(k => Object.prototype.hasOwnProperty.call(p,k))) return false;
  if (Object.keys(p).some(k => !['schemaVersion', 'gameVersion', 'event', 'properties'].includes(k))) return false;
  if (!ANALYTICS_SCHEMA_VERSIONS.includes(p.schemaVersion as 1 | 2) || !member(ANALYTICS_GAME_VERSIONS, p.gameVersion) || !member(ANALYTICS_EVENTS, p.event)) return false;
  if (!p.properties || typeof p.properties !== 'object' || Array.isArray(p.properties)) return false;
  const props = p.properties as Record<string, unknown>;
  if (p.schemaVersion === 1) {
    const legacyEvents = ANALYTICS_EVENTS.filter(event => !['case_quality_assessed', 'decision_revised', 'accessibility_used', 'interface_error'].includes(event));
    const legacyProperties = ['language', 'mode', 'phase', 'caseId', 'result', 'hintUsed', 'durationBucket', 'tutorialVersion'];
    if (!legacyEvents.includes(p.event as AnalyticsEvent) || Object.keys(props).some(key => !legacyProperties.includes(key))) return false;
  }
  const r = EVENT_CATALOG[p.event as AnalyticsEvent];
  const keys = ['language', 'mode', 'phase', ...r.required, ...r.optional];
  return Object.keys(props).every(k => keys.includes(k) && validProperty(k as AllowedProperty, props[k]))
    && ['language', 'mode', 'phase', ...r.required].every(k => Object.prototype.hasOwnProperty.call(props, k));
}
export function durationBucket(milliseconds: number): AnalyticsProperties['durationBucket'] {
  const seconds = (Number.isFinite(milliseconds) ? Math.max(0, milliseconds) : 0) / 1000;
  return seconds < 60 ? 'under_1m' : seconds < 300 ? '1_to_5m' : seconds < 900 ? '5_to_15m' : seconds < 1800 ? '15_to_30m' : '30m_plus';
}
export function validateAggregate(value: unknown): value is AnalyticsAggregate {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  if (!Object.prototype.hasOwnProperty.call(value,'count')) return false;
  const { count, ...payload } = value as Record<string, unknown>;
  return typeof count === 'number' && Number.isInteger(count) && count > 0 && count <= ANALYTICS_LIMITS.count && validatePayload(payload);
}

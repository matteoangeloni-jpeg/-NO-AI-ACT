import { ANALYTICS_EVENTS, ANALYTICS_GAME_VERSIONS, LANGUAGES, MODES, PHASES, isCaseId } from '../src/game/systems/analyticsSchema';

export const JOURNAL_POLICY = 'session-journal-2026-11-22';
export const JOURNAL_RETENTION_DAYS = 90;
export const JOURNAL_ACTIVE_HOURS = 24;
export const JOURNAL_MAX_EVENTS = 10000;
export const JOURNAL_BATCH_BYTES = 30000;
export const JOURNAL_EVENT_TYPES: readonly string[] = [...ANALYTICS_EVENTS, 'ui_action', 'draft_changed', 'heartbeat',
  'recording_started', 'recording_resumed', 'evidence_interaction', 'evidence_compared', 'inquiry_started', 'hypothesis_saved', 'hypothesis_revised',
  'relation_added', 'relation_removed', 'argument_submitted', 'reflection_saved', 'writing_saved', 'recording_stopped', 'self_check_submitted', 'report_saved'];
export const JOURNAL_PROPERTY_KEYS = ['caseId','result','durationBucket','hintUsed','tutorialVersion','selectedClassification',
  'referenceClassification','classificationMatch','selectedMeasure','selectedActor','evidenceQuality','decisionQuality',
  'reasoningQuality','viewedEvidenceBand','citedEvidenceBand','omittedRelevantBand','contradictoryEvidenceRecognized',
  'revisionOccurred','revisionCountBand','revisionDirection','accessibilitySetting','errorCode','abandonmentPhase',
  'scene','action','difficulty','mission','audience','sessionMinutes','classification','measure','subject','motivation',
  'revealedClues','citedClues','confidence','left','right','relation','revisionCount','field','stage','activeMs','visible',
  'opened','cited','evidenceIndex','dominantError','outcome','incidentChoice','filledFields','relationCount','sourceCount','recognized','reflection','correct','total'] as const;
export type JournalProperties = Record<string, string | number | boolean | number[]>;
export interface JournalContext { language: string; mode: string; phase: string; caseId?: string; }
export interface JournalEvent extends JournalContext {
  id: string; seq: number; type: string; at: number; elapsedMs: number; attemptId?: string;
  properties: JournalProperties; writing?: Record<string,string>;
}
export interface JournalStart {
  policyVersion: string; adultConfirmed: true; qualitative: boolean; gameVersion: string;
  language: string; mode: string; difficulty: string; mission: string; audience: string;
}
export const journalUuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
export const journalToken = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
const object = (v: unknown): v is Record<string,unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export function exactJournalKeys(value: Record<string,unknown>, allowed: readonly string[]): boolean {
  return Object.keys(value).every(k => allowed.includes(k));
}
export function journalProperties(value: unknown): value is JournalProperties {
  if (!object(value) || !exactJournalKeys(value,JOURNAL_PROPERTY_KEYS)) return false;
  return Object.values(value).every(v => typeof v === 'boolean' || typeof v === 'string' && v.length <= 180
    || typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= 86400000
    || Array.isArray(v) && v.length <= 32 && v.every(n => Number.isInteger(n) && n >= 0 && n <= 32));
}
export function journalWriting(value: unknown): value is Record<string,string> {
  return object(value) && Object.keys(value).length === 1 && Object.entries(value).every(([k,v]) =>
    /^(initialHypothesis|hypothesis|evidence|alternative|uncertainty|reasoning|revisionReason|reflection|feedbackUse|transferPlan|source_[0-5]|relationReason)$/.test(k)
    && typeof v === 'string' && v.length <= 1200);
}
export function validJournalStart(value: unknown): value is JournalStart {
  if (!object(value) || !exactJournalKeys(value,['policyVersion','adultConfirmed','qualitative','gameVersion','language','mode','difficulty','mission','audience'])) return false;
  return value.policyVersion === JOURNAL_POLICY && value.adultConfirmed === true && typeof value.qualitative === 'boolean'
    && ANALYTICS_GAME_VERSIONS.includes(String(value.gameVersion)) && LANGUAGES.includes(value.language as typeof LANGUAGES[number])
    && MODES.includes(value.mode as typeof MODES[number]) && ['base','standard','expert'].includes(String(value.difficulty))
    && [value.mission,value.audience].every(v => typeof v === 'string' && /^[a-z_]{1,32}$/.test(v));
}
export function validJournalEvent(value: unknown): value is JournalEvent {
  if (!object(value) || !exactJournalKeys(value,['id','seq','type','at','elapsedMs','attemptId','language','mode','phase','caseId','properties','writing'])) return false;
  return journalUuid(value.id) && Number.isInteger(value.seq) && Number(value.seq) > 0 && Number(value.seq) <= JOURNAL_MAX_EVENTS
    && JOURNAL_EVENT_TYPES.includes(String(value.type)) && Number.isSafeInteger(value.at) && Number(value.at) > 0
    && Number.isInteger(value.elapsedMs) && Number(value.elapsedMs) >= 0 && Number(value.elapsedMs) <= 86400000
    && (value.attemptId === undefined || journalUuid(value.attemptId)) && (value.caseId === undefined || isCaseId(value.caseId))
    && LANGUAGES.includes(value.language as typeof LANGUAGES[number]) && MODES.includes(value.mode as typeof MODES[number])
    && PHASES.includes(value.phase as typeof PHASES[number]) && journalProperties(value.properties)
    && (value.writing === undefined || value.type === 'writing_saved' && journalWriting(value.writing));
}
export function cleanJournalProperties(value: Record<string,unknown> = {}): JournalProperties {
  const result: JournalProperties = {};
  for (const [key,v] of Object.entries(value)) {
    if (!(JOURNAL_PROPERTY_KEYS as readonly string[]).includes(key) || v === undefined || v === null) continue;
    const safe = typeof v === 'string' ? v.slice(0,180) : v;
    if (journalProperties({[key]:safe})) result[key] = safe as JournalProperties[string];
  }
  return result;
}

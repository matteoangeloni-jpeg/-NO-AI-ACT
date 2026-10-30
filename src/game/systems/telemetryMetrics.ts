import type { CaseData, Classification, Measure, ResponsibleSubject } from '../data/types';
import type { ReportResult } from './ReportSystem';
import type { AnalyticsProperties } from './analyticsSchema';

export interface CaseTelemetryInput {
  caseData: CaseData;
  openedEvidence: readonly number[];
  citedEvidence: readonly number[];
  classification: Classification;
  measure: Measure;
  subject: ResponsibleSubject;
  result: ReportResult;
  initialClassification?: Classification;
  classificationRevisions?: number;
}

function countBand(value: number): NonNullable<AnalyticsProperties['viewedEvidenceBand']> {
  return value <= 0 ? 'none' : value === 1 ? 'one' : value === 2 ? 'two' : 'three_plus';
}

function qualityBand(score: number, maximum: number): NonNullable<AnalyticsProperties['evidenceQuality']> {
  const ratio = maximum > 0 ? score / maximum : 0;
  return ratio >= 0.75 ? 'high' : ratio >= 0.4 ? 'medium' : 'low';
}

function classificationDistance(a: Classification, b: Classification): number {
  const order: Classification[] = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
  return Math.abs(order.indexOf(a) - order.indexOf(b));
}

/** Derives only bounded categorical indicators. No raw interaction sequence is returned. */
export function deriveCaseTelemetry(input: CaseTelemetryInput): Partial<AnalyticsProperties> {
  const relevant = new Set(input.caseData.relevantClues);
  const opened = new Set(input.openedEvidence);
  const cited = new Set(input.citedEvidence);
  const relevantCited = [...relevant].filter(index => cited.has(index)).length;
  const omitted = Math.max(0, relevant.size - relevantCited);
  const contradictoryRecognized = (input.caseData.clueStances ?? []).some((stance, index) =>
    opened.has(index) && ['minimizes_risk', 'ambiguous'].includes(stance));
  const evidenceScore = relevantCited + (input.result.cluesOk ? 1 : 0) + (contradictoryRecognized ? 1 : 0);
  const decisionScore = (input.classification === input.caseData.correctClassification ? 2 : 0)
    + (input.result.coreGrade === 'correct' ? 2 : input.result.coreGrade === 'partial' ? 1 : 0)
    + (input.result.subjectGrade === 'full' ? 1 : 0);
  const revisions = Math.max(0, Math.floor(input.classificationRevisions ?? 0));
  const initial = input.initialClassification ?? input.classification;
  const before = classificationDistance(initial, input.caseData.correctClassification);
  const after = classificationDistance(input.classification, input.caseData.correctClassification);
  const revisionDirection = revisions === 0 ? 'none' : after < before ? 'toward_reference' : after > before ? 'away_from_reference' : 'lateral';

  return {
    selectedClassification: input.classification,
    referenceClassification: input.caseData.correctClassification,
    classificationMatch: input.classification === input.caseData.correctClassification,
    selectedMeasure: input.measure,
    selectedActor: input.subject,
    evidenceQuality: qualityBand(evidenceScore, relevant.size + 2),
    decisionQuality: qualityBand(decisionScore, 5),
    reasoningQuality: input.result.motivationGrade === 'correct' ? 'correct' : input.result.motivationGrade === 'weak' ? 'partial' : 'wrong',
    viewedEvidenceBand: countBand(opened.size),
    citedEvidenceBand: countBand(cited.size),
    omittedRelevantBand: countBand(omitted),
    contradictoryEvidenceRecognized: contradictoryRecognized,
    revisionOccurred: revisions > 0,
    revisionCountBand: countBand(revisions),
    revisionDirection
  };
}

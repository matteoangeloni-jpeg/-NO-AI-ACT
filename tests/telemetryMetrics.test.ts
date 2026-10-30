import { describe, expect, it } from 'vitest';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { evaluateReport } from '../src/game/systems/ReportSystem';
import { deriveCaseTelemetry } from '../src/game/systems/telemetryMetrics';

describe('telemetry v2 local derivation', () => {
  const caseData = PLAYABLE_CASES[0];

  it('derives bounded quality categories without raw evidence sequences', () => {
    const result = evaluateReport({ caseData, citedClues: caseData.relevantClues,
      classification: caseData.correctClassification, measure: caseData.correctMeasures[0],
      subject: caseData.responsibleSubjectCorrect, motivationIndex: caseData.correctMotivation });
    const metrics = deriveCaseTelemetry({ caseData, openedEvidence: [0, 1, 2], citedEvidence: caseData.relevantClues,
      classification: caseData.correctClassification, measure: caseData.correctMeasures[0],
      subject: caseData.responsibleSubjectCorrect, result });
    expect(metrics).toMatchObject({ classificationMatch: true, evidenceQuality: 'high', decisionQuality: 'high',
      reasoningQuality: 'correct', revisionOccurred: false, revisionDirection: 'none' });
    expect(metrics).not.toHaveProperty('openedEvidence');
    expect(metrics).not.toHaveProperty('citedEvidence');
  });

  it('describes a revision toward the reference without retaining the path', () => {
    const result = evaluateReport({ caseData, citedClues: caseData.relevantClues,
      classification: caseData.correctClassification, measure: caseData.correctMeasures[0],
      subject: caseData.responsibleSubjectCorrect, motivationIndex: caseData.correctMotivation });
    const metrics = deriveCaseTelemetry({ caseData, openedEvidence: caseData.relevantClues, citedEvidence: caseData.relevantClues,
      classification: caseData.correctClassification, measure: caseData.correctMeasures[0],
      subject: caseData.responsibleSubjectCorrect, result, initialClassification: 'non_rilevante', classificationRevisions: 2 });
    expect(metrics).toMatchObject({ revisionOccurred: true, revisionCountBand: 'two', revisionDirection: 'toward_reference' });
  });
});

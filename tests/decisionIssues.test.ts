import { describe, expect, it } from 'vitest';
import { getCase } from '../src/game/data/cases';
import { evaluateReport, type ReportInput } from '../src/game/systems/ReportSystem';
import { decisionIssues, issueForError, decisionAnalysisKeys } from '../src/game/systems/DecisionIssues';

/** Costruisce un input di rapporto a partire dal caso e da override mirati. */
function input(caseId: string, over: Partial<ReportInput>): ReportInput {
  const caseData = getCase(caseId);
  return {
    caseData,
    citedClues: caseData.relevantClues,
    classification: caseData.correctClassification,
    measure: caseData.correctMeasures[0],
    subject: caseData.responsibleSubjectCorrect,
    motivationIndex: caseData.correctMotivation,
    ...over
  };
}

describe('v0.5 — tassonomia delle fragilità decisionali', () => {
  it('mappa ogni ErrorType su una fragilità', () => {
    expect(issueForError('soggetto')).toBe('wrong_responsible_subject');
    expect(issueForError('motivazione')).toBe('weak_motivation');
    expect(issueForError('prove')).toBe('weak_evidence');
    expect(issueForError('eccesso_cautela')).toBe('excessive_measure');
    expect(issueForError('classificazione')).toBe('wrong_classification');
    expect(issueForError('misura_insufficiente')).toBe('insufficient_measure');
    expect(issueForError('trasparenza')).toBe('missing_transparency');
  });

  it('un atto conforme non ha fragilità', () => {
    const r = evaluateReport(input('case_scoring', {}));
    expect(r.outcome).toBe('conforme');
    expect(decisionIssues(r).primary).toBeNull();
  });

  it('soggetto errato produce wrong_responsible_subject', () => {
    const r = evaluateReport(input('case_scoring', { subject: 'deployer' }));
    expect(r.outcome).toBe('contestabile');
    expect(decisionIssues(r).primary).toBe('wrong_responsible_subject');
  });

  it('motivazione debole produce weak_motivation', () => {
    const scoring = getCase('case_scoring');
    const r = evaluateReport(input('case_scoring', { motivationIndex: scoring.weakMotivation }));
    expect(decisionIssues(r).primary).toBe('weak_motivation');
  });

  it('prove non pertinenti producono weak_evidence', () => {
    // cita un reperto fuori dai rilevanti, omettendone uno portante
    const r = evaluateReport(input('case_scoring', { citedClues: [0, 2] }));
    expect(decisionIssues(r).primary).toBe('weak_evidence');
  });

  it('misura eccessiva produce excessive_measure e segnala la proporzionalità', () => {
    // bloccare un sistema correttamente classificato come alto rischio
    const r = evaluateReport(input('case_lavoro', { measure: 'blocco' }));
    const issues = decisionIssues(r);
    expect(issues.primary).toBe('excessive_measure');
    expect(issues.secondary).toContain('proportionality_problem');
  });

  it('le chiavi di analisi seguono esito e fragilità', () => {
    const r = evaluateReport(input('case_scoring', { subject: 'deployer' }));
    const keys = decisionAnalysisKeys(r);
    expect(keys.outcome).toBe('contestabile');
    expect(keys.issue).toBe('wrong_responsible_subject');
  });
});

export interface InquiryNotes {
  initialHypothesis: string;
  hypothesis: string;
  evidence: string;
  alternative: string;
  uncertainty: string;
  reflection: string;
  reasoning: string;
  revisionReason: string;
  feedbackUse: string;
  transferPlan: string;
}

export type ArgumentField = 'hypothesis' | 'evidence' | 'alternative' | 'uncertainty' | 'reasoning' | 'revisionReason';
export type PostFeedbackField = 'reflection' | 'feedbackUse' | 'transferPlan';
export type SourceRelation = 'supports' | 'challenges' | 'uncertain';
export interface EvidenceRelation {
  left: number;
  right: number;
  relation: SourceRelation;
  reason: string;
}
export interface HypothesisRevision { hypothesis: string; reason: string }
export type ArgumentSnapshot = Readonly<Pick<InquiryNotes, ArgumentField>> & {
  readonly sources: Readonly<Record<number, string>>;
  readonly relations: readonly Readonly<EvidenceRelation>[];
  readonly revisions: readonly Readonly<HypothesisRevision>[];
};

interface InquiryEntry {
  notes: InquiryNotes;
  introductionFinished?: boolean;
  submitted?: ArgumentSnapshot;
  sources: Record<number, string>;
  relations: EvidenceRelation[];
  revisions: HypothesisRevision[];
  decisionSupportSeen: boolean;
}

/** Session-only writing aid. Deliberately independent of saves and analytics. */
export class GuidedInquirySession {
  private sessionId: number | null | undefined;
  private readonly entries = new Map<string, InquiryEntry>();
  sessionReflection = '';
  sessionTransferPlan = '';

  resetFor(sessionId: number | null): void {
    if (sessionId === this.sessionId) return;
    this.sessionId = sessionId;
    this.entries.clear();
    this.sessionReflection = '';
    this.sessionTransferPlan = '';
  }

  start(caseId: string): void {
    if (this.entries.has(caseId)) return;
    this.entries.set(caseId, { notes: {
      initialHypothesis: '', hypothesis: '', evidence: '', alternative: '', uncertainty: '', reflection: '',
      reasoning: '', revisionReason: '', feedbackUse: '', transferPlan: ''
    }, sources: {}, relations: [], revisions: [], decisionSupportSeen: false });
  }

  active(caseId: string): boolean {
    return this.entries.has(caseId);
  }

  read(caseId: string): InquiryNotes | undefined {
    const notes = this.entries.get(caseId)?.notes;
    return notes ? { ...notes } : undefined;
  }

  write(caseId: string, field: ArgumentField | PostFeedbackField, value: string): void {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted && !['reflection', 'feedbackUse', 'transferPlan'].includes(field)) return;
    entry.notes[field] = value.slice(0, 1200);
  }

  caseIds(): string[] {
    return [...this.entries.keys()];
  }

  needsDecisionSupport(caseId: string): boolean {
    const entry = this.entries.get(caseId);
    return !!entry && !entry.decisionSupportSeen;
  }

  acknowledgeDecisionSupport(caseId: string): void {
    const entry = this.entries.get(caseId);
    if (entry) entry.decisionSupportSeen = true;
  }

  sourceNotes(caseId: string): Record<number, string> {
    return { ...this.entries.get(caseId)?.sources };
  }

  writeSource(caseId: string, index: number, value: string): void {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted || !Number.isInteger(index) || index < 0 || index >= 6) return;
    entry.sources[index] = value.slice(0, 1200);
  }

  relations(caseId: string): EvidenceRelation[] {
    return (this.entries.get(caseId)?.relations ?? []).map(relation => ({ ...relation }));
  }

  relate(caseId: string, relation: EvidenceRelation): boolean {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted || relation.left === relation.right || !relation.reason.trim()
      || ![relation.left, relation.right].every(index => Number.isInteger(index) && index >= 0 && index < 6)
      || !['supports', 'challenges', 'uncertain'].includes(relation.relation)) return false;
    const stored = { ...relation, reason: relation.reason.slice(0, 1200) };
    const index = entry.relations.findIndex(row => row.left === relation.left && row.right === relation.right);
    if (index >= 0) entry.relations[index] = stored;
    else if (entry.relations.length < 30) entry.relations.push(stored);
    return true;
  }

  removeRelation(caseId: string, index: number): void {
    const entry = this.entries.get(caseId);
    if (entry && !entry.submitted && Number.isInteger(index) && index >= 0) entry.relations.splice(index, 1);
  }

  revisions(caseId: string): HypothesisRevision[] {
    return (this.entries.get(caseId)?.revisions ?? []).map(revision => ({ ...revision }));
  }

  recordRevision(caseId: string): boolean {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted || !entry.notes.hypothesis.trim() || !entry.notes.revisionReason.trim()) return false;
    const revision = { hypothesis: entry.notes.hypothesis, reason: entry.notes.revisionReason };
    const last = entry.revisions[entry.revisions.length - 1];
    if (last?.hypothesis === revision.hypothesis && last.reason === revision.reason) return true;
    if (entry.revisions.length >= 32) return false;
    entry.revisions.push(revision);
    return true;
  }

  finishIntroduction(caseId: string): void {
    const entry = this.entries.get(caseId);
    if (entry && !entry.submitted && !entry.introductionFinished) {
      entry.notes.initialHypothesis = entry.notes.hypothesis;
      entry.introductionFinished = true;
    }
  }

  submit(caseId: string): void {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted) return;
    const { hypothesis, evidence, alternative, uncertainty, reasoning, revisionReason } = entry.notes;
    entry.submitted = Object.freeze({
      hypothesis, evidence, alternative, uncertainty, reasoning, revisionReason,
      sources: Object.freeze({ ...entry.sources }),
      relations: Object.freeze(entry.relations.map(relation => Object.freeze({ ...relation }))),
      revisions: Object.freeze(entry.revisions.map(revision => Object.freeze({ ...revision })))
    });
  }

  submitted(caseId: string): ArgumentSnapshot | undefined {
    const snapshot = this.entries.get(caseId)?.submitted;
    return snapshot ? { ...snapshot, sources: { ...snapshot.sources },
      relations: snapshot.relations.map(relation => ({ ...relation })),
      revisions: snapshot.revisions.map(revision => ({ ...revision })) } : undefined;
  }
}

export const GuidedInquiry = new GuidedInquirySession();

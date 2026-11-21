export interface InquiryNotes {
  initialHypothesis: string;
  hypothesis: string;
  evidence: string;
  alternative: string;
  uncertainty: string;
  reflection: string;
}

export type ArgumentField = 'hypothesis' | 'evidence' | 'alternative' | 'uncertainty';
export type ArgumentSnapshot = Readonly<Pick<InquiryNotes, ArgumentField>>;

interface InquiryEntry {
  notes: InquiryNotes;
  introductionFinished?: boolean;
  submitted?: ArgumentSnapshot;
}

/** Session-only writing aid. Deliberately independent of saves and analytics. */
export class GuidedInquirySession {
  private sessionId: number | null | undefined;
  private readonly entries = new Map<string, InquiryEntry>();

  resetFor(sessionId: number | null): void {
    if (sessionId === this.sessionId) return;
    this.sessionId = sessionId;
    this.entries.clear();
  }

  start(caseId: string): void {
    if (this.entries.has(caseId)) return;
    this.entries.set(caseId, { notes: {
      initialHypothesis: '', hypothesis: '', evidence: '', alternative: '', uncertainty: '', reflection: ''
    } });
  }

  active(caseId: string): boolean {
    return this.entries.has(caseId);
  }

  read(caseId: string): InquiryNotes | undefined {
    const notes = this.entries.get(caseId)?.notes;
    return notes ? { ...notes } : undefined;
  }

  write(caseId: string, field: ArgumentField | 'reflection', value: string): void {
    const entry = this.entries.get(caseId);
    if (!entry || entry.submitted && field !== 'reflection') return;
    entry.notes[field] = value.slice(0, 1200);
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
    const { hypothesis, evidence, alternative, uncertainty } = entry.notes;
    entry.submitted = Object.freeze({ hypothesis, evidence, alternative, uncertainty });
  }

  submitted(caseId: string): ArgumentSnapshot | undefined {
    const snapshot = this.entries.get(caseId)?.submitted;
    return snapshot ? { ...snapshot } : undefined;
  }
}

export const GuidedInquiry = new GuidedInquirySession();

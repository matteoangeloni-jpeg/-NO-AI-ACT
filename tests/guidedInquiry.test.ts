import { describe, expect, it } from 'vitest';
import { GuidedInquirySession } from '../src/game/systems/GuidedInquiry';
import { GUIDED_COPY } from '../src/game/i18n/guidedInquiry';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { INQUIRY_CASES, INQUIRY_CASE_IDS } from '../src/game/i18n/inquiryCases';
import { LANGUAGE_CODES } from '../src/game/i18n';

describe('guided inquiry separates pre-feedback writing from reflection', () => {
  it('keeps the first hypothesis and the submitted argument while allowing later reflection', () => {
    const session = new GuidedInquirySession();
    session.resetFor(1);
    session.start('case_scoring');
    session.write('case_scoring', 'hypothesis', 'Initial interpretation');
    session.finishIntroduction('case_scoring');
    session.write('case_scoring', 'hypothesis', 'Revised after reading');
    session.write('case_scoring', 'evidence', 'The log challenges the statement');
    session.submit('case_scoring');
    session.write('case_scoring', 'hypothesis', 'Copied from feedback');
    session.write('case_scoring', 'reflection', 'I now need a different check');
    expect(session.read('case_scoring')?.initialHypothesis).toBe('Initial interpretation');
    expect(session.submitted('case_scoring')?.hypothesis).toBe('Revised after reading');
    expect(session.read('case_scoring')?.reflection).toBe('I now need a different check');
    const snapshot = session.submitted('case_scoring')!;
    Object.assign(snapshot, { evidence: 'Attempted mutation' });
    expect(session.submitted('case_scoring')?.evidence).toBe('The log challenges the statement');
  });

  it('isolates cases and clears all temporary notes for a new session', () => {
    const session = new GuidedInquirySession();
    session.resetFor(1);
    for (const data of PLAYABLE_CASES) {
      session.start(data.id);
      session.write(data.id, 'hypothesis', data.id);
      expect(session.read(data.id)?.hypothesis).toBe(data.id);
    }
    session.resetFor(1);
    expect(session.active('case_scoring')).toBe(true);
    session.resetFor(2);
    expect(session.active('case_scoring')).toBe(false);
    expect(new GuidedInquirySession().read('case_scoring')).toBeUndefined();
  });

  it('allows empty notes without awarding a score and bounds free text', () => {
    const session = new GuidedInquirySession();
    session.start('case_scoring');
    session.submit('case_scoring');
    expect(session.submitted('case_scoring')?.hypothesis).toBe('');
    session.start('case_lavoro');
    session.write('case_lavoro', 'evidence', 'x'.repeat(2000));
    expect(session.read('case_lavoro')?.evidence).toHaveLength(1200);
    expect(Object.keys(session.read('case_lavoro')!)).not.toContain('score');
  });

  it('provides every label in every playable language', () => {
    for (const language of LANGUAGE_CODES) {
      expect(Object.keys(GUIDED_COPY[language])).toEqual(Object.keys(GUIDED_COPY.it));
      for (const value of Object.values(GUIDED_COPY[language])) expect(value.length).toBeGreaterThan(5);
    }
  });

  it('keeps source assessments, proposed relations and explained revisions sealed before feedback', () => {
    const session = new GuidedInquirySession();
    session.start('case_lavoro');
    session.write('case_lavoro', 'hypothesis', 'Human review may be ineffective');
    session.finishIntroduction('case_lavoro');
    session.writeSource('case_lavoro', 1, 'Provider promise, not evidence of actual review');
    expect(session.relate('case_lavoro', { left: 1, right: 2, relation: 'challenges', reason: 'The log records no access to inputs' })).toBe(true);
    session.write('case_lavoro', 'revisionReason', 'The operating log narrows my hypothesis');
    expect(session.recordRevision('case_lavoro')).toBe(true);
    session.submit('case_lavoro');
    const snapshot = session.submitted('case_lavoro')!;
    (snapshot.sources as Record<number, string>)[1] = 'changed outside';
    (snapshot.relations[0] as { reason: string }).reason = 'changed outside';
    session.writeSource('case_lavoro', 1, 'copied from feedback');
    session.removeRelation('case_lavoro', 0);
    session.write('case_lavoro', 'reasoning', 'copied from feedback');
    expect(session.recordRevision('case_lavoro')).toBe(false);
    const sealed = session.submitted('case_lavoro')!;
    expect(sealed.sources[1]).toBe('Provider promise, not evidence of actual review');
    expect(sealed.relations[0].reason).toBe('The log records no access to inputs');
    expect(sealed.revisions).toHaveLength(1);
    expect(sealed.reasoning).toBe('');
    session.write('case_lavoro', 'feedbackUse', 'Checked the norm against the log');
    session.write('case_lavoro', 'transferPlan', 'Check who can override an outcome');
    expect(session.read('case_lavoro')?.feedbackUse).toContain('log');
    expect(session.read('case_lavoro')?.initialHypothesis).toBe('Human review may be ineffective');
  });

  it('requires distinct existing source indices and a human explanation without judging its correctness', () => {
    const session = new GuidedInquirySession(); session.start('case_scoring');
    for (const relation of [
      { left: 0, right: 0, relation: 'supports' as const, reason: 'same source' },
      { left: -1, right: 2, relation: 'supports' as const, reason: 'invalid' },
      { left: 0, right: 6, relation: 'supports' as const, reason: 'invalid' },
      { left: 0, right: 1, relation: 'supports' as const, reason: '   ' }
    ]) expect(session.relate('case_scoring', relation)).toBe(false);
    expect(session.recordRevision('case_scoring')).toBe(false);
    expect(session.relate('case_scoring', { left: 0, right: 1, relation: 'uncertain', reason: 'I cannot yet establish a connection' })).toBe(true);
    expect(session.relations('case_scoring')[0]).not.toHaveProperty('correct');
    expect(session.relations('case_scoring')[0]).not.toHaveProperty('score');
    session.writeSource('case_scoring', 0, 'x'.repeat(2000));
    expect(session.sourceNotes('case_scoring')[0]).toHaveLength(1200);
    expect(session.needsDecisionSupport('case_scoring')).toBe(true);
    session.acknowledgeDecisionSupport('case_scoring');
    expect(session.needsDecisionSupport('case_scoring')).toBe(false);
    session.sessionReflection = 'synthesis'; session.sessionTransferPlan = 'new strategy';
    session.resetFor(3);
    expect(session.caseIds()).toEqual([]);
    expect(session.sessionReflection).toBe(''); expect(session.sessionTransferPlan).toBe('');
  });

  it('covers the complete catalog with contextual mediation in all playable languages', () => {
    expect([...INQUIRY_CASE_IDS].sort()).toEqual(PLAYABLE_CASES.map(data => data.id).sort());
    for (const language of LANGUAGE_CODES) {
      expect(Object.keys(INQUIRY_CASES[language]).sort()).toEqual([...INQUIRY_CASE_IDS].sort());
      const openings = new Set<string>();
      for (const id of INQUIRY_CASE_IDS) {
        const card = INQUIRY_CASES[language][id];
        expect(Object.keys(card)).toEqual(['opening', 'source', 'relation', 'uncertainty', 'debrief']);
        for (const text of Object.values(card)) expect(text.length).toBeGreaterThan(25);
        openings.add(card.opening);
      }
      expect(openings.size).toBe(14);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { GuidedInquirySession } from '../src/game/systems/GuidedInquiry';
import { GUIDED_COPY } from '../src/game/i18n/guidedInquiry';
import { PLAYABLE_CASES } from '../src/game/data/cases';

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

  it('provides every label in all three playable languages', () => {
    for (const language of ['it', 'en', 'fr'] as const) {
      expect(Object.keys(GUIDED_COPY[language])).toEqual(Object.keys(GUIDED_COPY.it));
      for (const value of Object.values(GUIDED_COPY[language])) expect(value.length).toBeGreaterThan(5);
    }
  });
});

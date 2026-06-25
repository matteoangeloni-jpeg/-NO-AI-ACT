import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  TALLY_PRE_GAME_IT_FORM_ID,
  TALLY_PRE_GAME_EN_URL,
  TALLY_POST_GAME_IT_URL,
  TALLY_POST_GAME_EN_URL,
  postGameFeedbackUrl
} from '../src/game/config/tally';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('Tally forms — configuration (per language / moment)', () => {
  it('exposes the three new per-moment URLs and the existing IT pre-game id', () => {
    expect(TALLY_PRE_GAME_IT_FORM_ID).toBe('44ENVA');
    expect(TALLY_PRE_GAME_EN_URL).toBe('https://tally.so/r/5BryXb');
    expect(TALLY_POST_GAME_IT_URL).toBe('https://tally.so/r/dWgB5y');
    expect(TALLY_POST_GAME_EN_URL).toBe('https://tally.so/r/ZjWp9A');
  });

  it('maps the post-game language to the correct form', () => {
    expect(postGameFeedbackUrl('it')).toBe('https://tally.so/r/dWgB5y');
    expect(postGameFeedbackUrl('en')).toBe('https://tally.so/r/ZjWp9A');
  });

  it('every Tally URL is a bare link — no query string or gameplay payload', () => {
    const urls = [TALLY_PRE_GAME_EN_URL, TALLY_POST_GAME_IT_URL, TALLY_POST_GAME_EN_URL];
    // no score, caseId, report, decision, progress, answers, results or lang-derived payload
    const forbidden = /\?|=|&|score|case_?id|report|decision|progress|answer|result/i;
    for (const u of urls) {
      expect(u).toMatch(/^https:\/\/tally\.so\/r\/[A-Za-z0-9]+$/);
      expect(u).not.toMatch(forbidden);
    }
  });
});

describe('Tally forms — post-game CTA copy (i18n, IT/EN)', () => {
  it('IT finale feedback copy matches the agreed wording', () => {
    expect(itLocale.ui.finale.feedback.title).toBe('Aiutami a migliorare NO AI ACT');
    expect(itLocale.ui.finale.feedback.text).toBe(
      'Hai completato almeno un caso? Lascia un feedback anonimo di 30 secondi su chiarezza, qualità didattica e usabilità.'
    );
    expect(itLocale.ui.finale.feedback.button).toBe('Lascia feedback');
  });

  it('EN finale feedback copy matches the agreed wording', () => {
    expect(enLocale.ui.finale.feedback.title).toBe('Help improve NO AI ACT');
    expect(enLocale.ui.finale.feedback.text).toBe(
      'Completed at least one case? Leave a 30-second anonymous feedback on clarity, learning quality and usability.'
    );
    expect(enLocale.ui.finale.feedback.button).toBe('Leave feedback');
  });
});

describe('Tally forms — FinaleScene wiring (structural)', () => {
  const src = read('src/game/scenes/FinaleScene.ts');

  it('renders the optional feedback CTA from i18n', () => {
    expect(src).toContain('L().ui.finale.feedback');
    expect(src).toContain('feedback.button');
    expect(src).toContain('feedback.title');
    expect(src).toContain('feedback.text');
  });

  it('opens the per-language post-game form in a new tab, no opener/referrer', () => {
    expect(src).toContain("import { postGameFeedbackUrl } from '../config/tally'");
    expect(src).toMatch(
      /window\.open\(\s*postGameFeedbackUrl\(StateManager\.language\),\s*'_blank',\s*'noopener,noreferrer'\s*\)/
    );
  });

  it('builds no query string and passes no gameplay data onto the URL', () => {
    // the handler must not concatenate anything onto the returned URL
    expect(src).not.toMatch(/postGameFeedbackUrl\([^)]*\)\s*\+/);
    expect(src).not.toMatch(/tally\.so[^'"\n]*\?/);
    // the finale must not forward score/answers/report/decisions to the form
    expect(src).not.toMatch(/postGameFeedbackUrl[^\n]*(score|answer|report|decision|progress|caseId)/i);
  });
});

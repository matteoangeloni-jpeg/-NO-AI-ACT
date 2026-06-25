import type { LanguageCode } from '../data/types';

/**
 * Tally feedback form links.
 *
 * IMPORTANT — privacy contract:
 *  - These are BARE links. No gameplay data is ever appended: no answers,
 *    scores, decisions, reports, progress, case ids or any dynamic payload.
 *  - They are opened as-is (the post-game ones via window.open in a new tab).
 *  - No custom event tracking is attached to them.
 *
 * Pre-game forms:
 *  - IT pre-game is embedded as a Tally popup on the IT landing
 *    (index.html, data-tally-open="44ENVA") and is intentionally LEFT
 *    UNTOUCHED. Its form id is recorded here for reference only.
 *  - EN pre-game is the EN landing playtest CTA (en/index.html).
 *
 * Post-game forms:
 *  - Shown as an optional feedback CTA on the end-of-game FinaleScene,
 *    one per language. Never required to keep playing.
 */

/** IT pre-game form id, embedded on the IT landing. Source of truth: index.html. */
export const TALLY_PRE_GAME_IT_FORM_ID = '44ENVA';

export const TALLY_PRE_GAME_EN_URL = 'https://tally.so/r/5BryXb';
export const TALLY_POST_GAME_IT_URL = 'https://tally.so/r/dWgB5y';
export const TALLY_POST_GAME_EN_URL = 'https://tally.so/r/ZjWp9A';

/** Post-game feedback link for the given language (defaults to IT). */
export function postGameFeedbackUrl(language: LanguageCode): string {
  return language === 'en' ? TALLY_POST_GAME_EN_URL : TALLY_POST_GAME_IT_URL;
}

import { describe, expect, it as test } from 'vitest';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import { NOTE_BOX, estimateWrappedHeight, noteFitsBox } from '../src/game/scenes/consequenceLayout';

/** Longest investigative note (correct/partial/wrong) across all cases of a locale. */
function maxNoteLength(locale: typeof it): number {
  const cases = Object.values(locale.cases) as Array<{
    noteCorrect: string;
    notePartial: string;
    noteWrong: string;
  }>;
  return Math.max(
    ...cases.flatMap((c) => [c.noteCorrect, c.notePartial, c.noteWrong].map((s) => (s ?? '').length))
  );
}

describe('Consequence investigative note — no overflow', () => {
  test('the worst-case note fits the dedicated box in both languages', () => {
    for (const [lang, locale] of [['it', it], ['en', en]] as const) {
      const longest = maxNoteLength(locale);
      expect(noteFitsBox(longest), `longest ${lang} note (${longest} chars) must fit NOTE_BOX`).toBe(true);
    }
  });

  test('the box keeps headroom over the worst-case note height', () => {
    const longest = Math.max(maxNoteLength(it), maxNoteLength(en));
    const needed = estimateWrappedHeight(longest, NOTE_BOX.wrapWidth, NOTE_BOX.fontSize, NOTE_BOX.lineSpacing);
    const inner = NOTE_BOX.height - NOTE_BOX.paddingY;
    expect(needed).toBeLessThanOrEqual(inner);
  });

  test('a clearly-too-long note would be flagged (guard is meaningful, not vacuous)', () => {
    // a 2000-char note must NOT fit — proves the invariant can actually fail
    expect(noteFitsBox(2000)).toBe(false);
  });
});

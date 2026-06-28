/**
 * Pure layout constants + helpers for the Consequence "investigative note" box.
 *
 * Kept Phaser-free on purpose: the fit invariant (the localized note text must
 * never overflow its dedicated box) can then be unit-tested without a canvas.
 * Consumed by ConsequenceScene; covered by tests/consequenceLayout.test.ts.
 *
 * The note shown is one of CaseTexts.noteCorrect / notePartial / noteWrong; the
 * longest across all cases/languages is ~6 wrapped lines, which is what the box
 * height is sized for (with margin).
 */
export const NOTE_BOX = {
  /** Outer box size (matches the Panel drawn in ConsequenceScene). */
  width: 620,
  height: 180,
  /** Wrap width for the note text (< inner width to keep side padding). */
  wrapWidth: 580,
  fontSize: 13,
  lineSpacing: 5,
  /** Combined top+bottom vertical padding inside the box. */
  paddingY: 36
} as const;

/** Conservative average glyph advance (px) for the monospace UI font. */
export function avgCharWidth(fontSize: number): number {
  return fontSize * 0.62;
}

/** Estimated rendered height (px) of wrapped text at the given style. */
export function estimateWrappedHeight(
  charCount: number,
  wrapWidth: number,
  fontSize: number,
  lineSpacing: number
): number {
  const charsPerLine = Math.max(1, Math.floor(wrapWidth / avgCharWidth(fontSize)));
  const lines = Math.max(1, Math.ceil(charCount / charsPerLine));
  return lines * (fontSize + lineSpacing + 4);
}

/** True when a note of `charCount` characters fits inside NOTE_BOX without overflow. */
export function noteFitsBox(charCount: number): boolean {
  const inner = NOTE_BOX.height - NOTE_BOX.paddingY;
  return estimateWrappedHeight(charCount, NOTE_BOX.wrapWidth, NOTE_BOX.fontSize, NOTE_BOX.lineSpacing) <= inner;
}

import { GAME_HEIGHT, GAME_WIDTH } from './theme';

/**
 * Shared safe-area / layout helpers for canvas scenes.
 *
 * The game renders in a fixed logical 1280×720 space (Phaser `Scale.FIT` +
 * `CENTER_BOTH`), so the whole logical area is always shown but its edge sits at
 * the physical screen edge on most viewports. Bottom- and side-anchored UI must
 * therefore stay inside a reserved safe margin, and stacked buttons must be
 * *computed* to fit — never placed at hardcoded y values that can collide with a
 * footer or crowd the bottom edge (as happened on the title and briefing
 * screens when a saved game added the CONTINUA / RESET rows).
 */

/** Reserved margins (logical px) kept clear at each canvas edge. */
export const SAFE_MARGIN = { top: 16, right: 16, bottom: 40, left: 16 } as const;

export interface SafeBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

/** Usable bounds inside the safe area of the logical canvas. */
export function safeBounds(): SafeBounds {
  const top = SAFE_MARGIN.top;
  const bottom = GAME_HEIGHT - SAFE_MARGIN.bottom;
  const left = SAFE_MARGIN.left;
  const right = GAME_WIDTH - SAFE_MARGIN.right;
  return {
    top,
    right,
    bottom,
    left,
    cx: GAME_WIDTH / 2,
    cy: GAME_HEIGHT / 2,
    width: right - left,
    height: bottom - top
  };
}

/**
 * Center-Y for a single-line footer/disclaimer anchored to the bottom safe
 * area. Sits in the middle of the reserved bottom band so a ~12–14px line stays
 * comfortably inside the canvas and clear of any stack laid out above it.
 */
export function footerBaselineY(): number {
  return GAME_HEIGHT - Math.round(SAFE_MARGIN.bottom / 2) - 2;
}

export interface VStackOptions {
  /** Heights (logical px) of each item, top-to-bottom. */
  heights: number[];
  /** Top edge of the band the stack must live in. */
  top: number;
  /** Bottom edge of the band the stack must live in. */
  bottom: number;
  /** Ideal gap between items; used when there is room to spare. */
  preferredGap?: number;
  /** Smallest gap the stack may shrink to before it simply centers. */
  minGap?: number;
  /** Vertical alignment of the whole block within the band. */
  align?: 'center' | 'top';
}

/**
 * Lay out a vertical stack of items with the given `heights` inside
 * `[top, bottom]`. Uses `preferredGap`, shrinking down to `minGap` so the stack
 * fits the band; the block is centered (default) or top-aligned. Returns the
 * **center-Y** of each item, in order.
 *
 * The band must be able to hold `sum(heights) + minGap*(n-1)`; callers size the
 * band (via `footerBaselineY()` / `safeBounds()`) so the largest configuration
 * fits, which keeps the result fully inside the safe area.
 */
export function layoutVStack(opts: VStackOptions): number[] {
  const { heights, top, bottom } = opts;
  const preferredGap = opts.preferredGap ?? 14;
  const minGap = opts.minGap ?? 6;
  const n = heights.length;
  if (n === 0) return [];

  const sumH = heights.reduce((a, b) => a + b, 0);
  const avail = bottom - top;

  let gap = preferredGap;
  if (n > 1) {
    const maxGap = (avail - sumH) / (n - 1);
    gap = Math.max(minGap, Math.min(preferredGap, maxGap));
  }

  const totalH = sumH + gap * Math.max(0, n - 1);
  const align = opts.align ?? 'center';
  const start = align === 'center' ? top + Math.max(0, (avail - totalH) / 2) : top;

  const ys: number[] = [];
  let cursor = start;
  for (const h of heights) {
    ys.push(cursor + h / 2);
    cursor += h + gap;
  }
  return ys;
}

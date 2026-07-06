import { describe, expect, it } from 'vitest';
import { footerBaselineY, layoutVStack, safeBounds, SAFE_MARGIN } from '../src/game/ui/layout';
import { GAME_HEIGHT, GAME_WIDTH } from '../src/game/ui/theme';

/**
 * LAYOUT / SAFE-AREA GUARD.
 *
 * Pins the math behind the responsive hotfix: the TitleScene menu stack and the
 * bottom disclaimer must never overlap or leave the safe area, in every save
 * state (with/without CONTINUA, with/without RESET). Because the game renders in
 * a fixed 1280×720 logical space (Scale.FIT), verifying the logical geometry
 * here guarantees the on-screen result at every viewport.
 */

const spans = (centers: number[], heights: number[]) =>
  centers.map((c, i) => ({ top: c - heights[i] / 2, bottom: c + heights[i] / 2 }));

describe('safeBounds / footerBaselineY', () => {
  it('safe bounds sit inside the canvas with the reserved margins', () => {
    const b = safeBounds();
    expect(b.top).toBe(SAFE_MARGIN.top);
    expect(b.left).toBe(SAFE_MARGIN.left);
    expect(b.right).toBe(GAME_WIDTH - SAFE_MARGIN.right);
    expect(b.bottom).toBe(GAME_HEIGHT - SAFE_MARGIN.bottom);
    expect(b.cx).toBe(GAME_WIDTH / 2);
  });

  it('footer baseline leaves a full disclaimer line inside the canvas', () => {
    const y = footerBaselineY();
    // a ~14px line centered on the baseline stays clear of the bottom edge
    expect(y + 7).toBeLessThan(GAME_HEIGHT);
    expect(GAME_HEIGHT - (y + 7)).toBeGreaterThanOrEqual(10); // ≥10px clearance
    expect(y).toBeGreaterThan(GAME_HEIGHT - SAFE_MARGIN.bottom); // within the bottom band
  });
});

describe('layoutVStack — fits the band and never overlaps', () => {
  it('returns centers in order that fit within [top, bottom]', () => {
    const heights = [48, 48, 48, 48, 48, 40];
    const top = 352;
    const bottom = footerBaselineY() - 22;
    const ys = layoutVStack({ heights, top, bottom, preferredGap: 14, minGap: 6 });
    expect(ys).toHaveLength(heights.length);
    const s = spans(ys, heights);
    expect(s[0].top).toBeGreaterThanOrEqual(top - 0.01);
    expect(s[s.length - 1].bottom).toBeLessThanOrEqual(bottom + 0.01);
    // strictly increasing, no overlap between consecutive items
    for (let i = 1; i < s.length; i++) {
      expect(s[i].top).toBeGreaterThanOrEqual(s[i - 1].bottom - 0.01);
    }
  });

  it('empty input yields no positions', () => {
    expect(layoutVStack({ heights: [], top: 0, bottom: 100 })).toEqual([]);
  });

  it('uses the preferred gap when there is ample room', () => {
    const ys = layoutVStack({ heights: [48, 48], top: 0, bottom: 1000, preferredGap: 14, minGap: 6, align: 'top' });
    expect(ys[1] - ys[0]).toBeCloseTo(48 + 14, 5); // pitch = height + preferredGap
  });

  it('shrinks the gap (never below minGap) to make a tight stack fit', () => {
    const heights = [48, 48, 48, 48, 48, 40];
    const top = 352;
    const bottom = footerBaselineY() - 22;
    const ys = layoutVStack({ heights, top, bottom, preferredGap: 14, minGap: 6 });
    const gap = ys[1] - ys[0] - 48; // pitch - height
    expect(gap).toBeGreaterThanOrEqual(6 - 0.01);
    expect(gap).toBeLessThan(14); // it had to shrink below preferred
  });
});

describe('TitleScene menu configurations never collide with the footer', () => {
  const top = 352;
  const footerY = footerBaselineY();
  const bottom = footerY - 22;
  const footerTop = footerY - 7; // ~14px disclaimer line

  const configs: Record<string, number[]> = {
    'no save (4 items)': [48, 48, 48, 48],
    'save, no progress (+RESET, 5 items)': [48, 48, 48, 48, 40],
    'save with progress (+CONTINUA +RESET, 6 items)': [48, 48, 48, 48, 48, 40]
  };

  for (const [name, heights] of Object.entries(configs)) {
    it(`${name}: last row clears the disclaimer and stays on-canvas`, () => {
      const ys = layoutVStack({ heights, top, bottom, preferredGap: 14, minGap: 6 });
      const last = ys[ys.length - 1] + heights[heights.length - 1] / 2;
      expect(last).toBeLessThanOrEqual(bottom + 0.01); // above the reserved footer band
      expect(last).toBeLessThan(footerTop); // no overlap with the disclaimer
      expect(last).toBeLessThan(GAME_HEIGHT - 4); // not jammed against the bottom edge
    });
  }
});

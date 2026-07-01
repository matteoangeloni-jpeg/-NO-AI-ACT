import { describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NORMS } from '../src/game/data/norms';
import { TALLY_PRE_GAME_IT_FORM_ID, TALLY_PRE_GAME_EN_URL, TALLY_POST_GAME_IT_URL, TALLY_POST_GAME_EN_URL } from '../src/game/config/tally';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('visual bug pass — ArchiveScene grid overflow (BLOCKER fix)', () => {
  const src = read('src/game/scenes/ArchiveScene.ts');

  test('all norms are placed inside a scrollable/masked container, not directly on the scene', () => {
    expect(src).toContain('gridContainer');
    expect(src).toContain('setMask');
    expect(src).toContain('createGeometryMask');
  });

  test('scroll is clamped between 0 and the actual overflow amount', () => {
    expect(src).toContain('maxScroll');
    expect(src).toMatch(/Phaser\.Math\.Clamp\(.*0.*maxScroll\)/);
  });

  test('NORMS has more entries than fit in two rows of 3, which is exactly why this bug existed', () => {
    // guards against silently "fixing" this by trimming NORMS instead of the layout
    expect(NORMS.length).toBeGreaterThan(6);
  });

  test('scroll controls only appear when content actually overflows', () => {
    expect(src).toContain('if (this.maxScroll > 0)');
  });
});

describe('visual bug pass — background buttons hidden while a read-only overlay is open', () => {
  for (const [scene, path] of [
    ['EvidenceScene', 'src/game/scenes/EvidenceScene.ts'],
    ['DecisionScene', 'src/game/scenes/DecisionScene.ts']
  ] as const) {
    const src = read(path);

    test(`${scene} defines an update() loop that syncs nav button visibility to overlay state`, () => {
      expect(src).toMatch(/update\(\)\s*:\s*void\s*\{/);
      expect(src).toContain('.isOpen');
      expect(src).toMatch(/setVisible\(!hideNav\)/);
    });
  }

  test('DecisionScene hides all three overlay-adjacent buttons plus the step-1 back button', () => {
    const src = read('src/game/scenes/DecisionScene.ts');
    expect(src).toContain('this.contextOverlay.isOpen || this.caseNormOverlay.isOpen || !!this.overlay');
    for (const btn of ['contextBtn', 'normsBtn', 'caseNormBtn', 'backBtn']) {
      expect(src, `must sync ${btn} visibility`).toMatch(new RegExp(`${btn}\\?\\.setVisible`));
    }
  });
});

describe('visual bug pass — EvidenceScene toast no longer covers the header', () => {
  const scene = read('src/game/scenes/EvidenceScene.ts');
  const toast = read('src/game/ui/AlertToast.ts');

  test('showToast accepts an optional topOffset, defaulting to the original position (36)', () => {
    expect(toast).toMatch(/topOffset\s*=\s*36/);
    expect(toast).toContain('const targetY = topOffset;');
  });

  test('EvidenceScene passes a topOffset that clears its header (not the default)', () => {
    expect(scene).toContain("showToast(this, L().ui.evidence.allRevealedToast, 'info', 20);");
  });

  test('other showToast call sites are unchanged (no new positional argument)', () => {
    for (const path of ['src/game/scenes/CityMapScene.ts', 'src/game/scenes/TitleScene.ts']) {
      const src = read(path);
      const calls = [...src.matchAll(/showToast\(([^)]*)\)/g)];
      for (const [, args] of calls) {
        expect(args.split(',').length, `${path}: ${args}`).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe('visual bug pass — IncidentScene panel contains all response options', () => {
  const src = read('src/game/scenes/IncidentScene.ts');

  test('the panel is tall enough for the 3rd option button (y=536, height 48 -> bottom edge 560)', () => {
    const m = src.match(/new Panel\(this, cx, (\d+), 860, (\d+)\)/);
    expect(m, 'Panel call not found with expected signature').not.toBeNull();
    const [, centerYStr, heightStr] = m!;
    const centerY = Number(centerYStr);
    const height = Number(heightStr);
    const panelBottom = centerY + height / 2;
    const lastButtonBottom = 536 + 48 / 2; // y=420+2*58, default Button height 48
    expect(panelBottom).toBeGreaterThanOrEqual(lastButtonBottom + 10);
  });
});

describe('visual bug pass — no gameplay, scoring, save or content changes', () => {
  // DecisionScene legitimately owns scoring (evaluateReport/StateManager.resolveCase in
  // its pre-existing resolve()) — that's not part of this bugfix pass, so it's excluded
  // from the blanket check below and covered separately.
  const files = [
    'src/game/scenes/ArchiveScene.ts',
    'src/game/scenes/EvidenceScene.ts',
    'src/game/scenes/IncidentScene.ts',
    'src/game/ui/AlertToast.ts'
  ];

  for (const path of files) {
    test(`${path} does not touch scoring, save/export or analytics config`, () => {
      const src = stripComments(read(path));
      for (const forbidden of ['evaluateReport', 'SaveSystem', 'ReportSystem', 'AnalyticsSystem.track(\'reset', 'TALLY_']) {
        expect(src, `${path} must not reference ${forbidden}`).not.toContain(forbidden);
      }
    });
  }

  test('DecisionScene: the new update() nav-visibility loop touches nothing but Button visibility', () => {
    const src = stripComments(read('src/game/scenes/DecisionScene.ts'));
    const m = src.match(/update\(\)\s*:\s*void\s*\{([\s\S]*?)\n  \}/);
    expect(m, 'update() method not found').not.toBeNull();
    const body = m![1];
    for (const forbidden of ['evaluateReport', 'SaveSystem', 'StateManager', 'AnalyticsSystem']) {
      expect(body, `update() must not reference ${forbidden}`).not.toContain(forbidden);
    }
  });

  test('ArchiveScene still shows every unlocked/locked norm (no norm removed to dodge the overflow)', () => {
    const src = read('src/game/scenes/ArchiveScene.ts');
    expect(src).toContain('NORMS.forEach((norm, i) =>');
    expect(src).not.toContain('.slice(');
  });
});

describe('visual bug pass — Tally and landing untouched', () => {
  test('Tally config constants are unchanged', () => {
    expect(TALLY_PRE_GAME_IT_FORM_ID).toBe('44ENVA');
    expect(TALLY_PRE_GAME_EN_URL).toBe('https://tally.so/r/5BryXb');
    expect(TALLY_POST_GAME_IT_URL).toBe('https://tally.so/r/dWgB5y');
    expect(TALLY_POST_GAME_EN_URL).toBe('https://tally.so/r/ZjWp9A');
  });

  test('index.html and en/index.html were not touched by this bugfix pass', () => {
    expect(read('index.html')).toContain('data-tally-open="44ENVA"');
    expect(read('en/index.html')).toContain('https://tally.so/r/5BryXb');
  });
});

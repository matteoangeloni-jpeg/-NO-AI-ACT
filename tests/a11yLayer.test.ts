import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { shouldShowMobileGuard, savedLanguage } from '../src/mobileGuard';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

/**
 * ACCESSIBILITY LAYER GUARD (2.0 — mission §11).
 *
 * Pins: the semantic reading layer in the play shell (sr-only + aria-live +
 * user-selectable visible mode), its privacy (no network, no state writes),
 * keyboard coverage of the core flow, the dismissable mobile-guard fallback,
 * and honesty (no WCAG-conformance claim anywhere).
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('play shell — semantic layer markup', () => {
  const shell = read('play/index.html');

  it('ships the reading layer, the aria-live announcer and the toggle', () => {
    expect(shell).toContain('id="reading-layer"');
    expect(shell).toMatch(/<section id="reading-layer" class="sr-only"[^>]*aria-label=/);
    expect(shell).toMatch(/<div id="sr-announcer" class="sr-only" role="status" aria-live="polite">/);
    expect(shell).toMatch(/<button id="reading-toggle"[^>]*aria-pressed="false"[^>]*aria-controls="reading-layer">/);
  });

  it('the mobile guard has the continue-anyway fallback button', () => {
    expect(shell).toContain('class="mg-continue"');
  });

  it('adds no scripts beyond main.ts and the pre-existing beacon', () => {
    const srcs = [...shell.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s);
    expect(srcs.sort()).toEqual(['/src/main.ts', 'https://static.cloudflareinsights.com/beacon.min.js']);
  });
});

describe('global.css — sr-only, visible reading mode, guard fallback', () => {
  const css = read('src/styles/global.css');
  it('defines .sr-only and the visible reading panel', () => {
    expect(css).toContain('.sr-only');
    expect(css).toContain('body.reading-visible #reading-layer');
    expect(css).toContain('#reading-toggle');
    expect(css).toContain('.mg-continue');
    expect(css).toContain(':focus-visible');
  });
});

describe('ReadingLayer — read-only, local, no duplicated interaction', () => {
  const src = read('src/game/systems/ReadingLayer.ts');

  it('makes no network calls and never writes game state', () => {
    for (const bad of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'localStorage.setItem', 'SaveSystem', 'saveCaseMeta', 'AnalyticsSystem']) {
      expect(src, bad).not.toContain(bad);
    }
  });

  it('escapes injected text and adds no event listeners inside the layer content', () => {
    expect(src).toContain("replace(/&/g, '&amp;')");
    expect(src).not.toMatch(/layer\.addEventListener|<a |<button/);
  });

  it('synchronises the lang attribute with the game language', () => {
    expect(src).toContain("layer.setAttribute('lang', StateManager.language)");
  });
});

describe('reading layer — scenes publish on every transition', () => {
  const SCENES = ['BriefingScene', 'CityMapScene', 'CaseScene', 'EvidenceScene', 'DecisionScene', 'ReportScene', 'FinaleScene'];
  for (const scene of SCENES) {
    it(`${scene} publishes to the reading layer`, () => {
      const src = read(`src/game/scenes/${scene}.ts`);
      expect(src).toMatch(/ReadingLayer\.setScene\(/);
    });
  }
  it('the report outcome is announced via aria-live', () => {
    expect(read('src/game/scenes/ReportScene.ts')).toContain('ReadingLayer.announce(');
  });
});

describe('keyboard coverage (§11.2) — core flow without a pointer', () => {
  it('CityMap: arrows cycle open cases and ENTER opens the selection', () => {
    const src = read('src/game/scenes/CityMapScene.ts');
    expect(src).toContain("['RIGHT', 'DOWN']");
    expect(src).toContain("['LEFT', 'UP']");
    expect(src).toContain('keydown-ENTER');
    expect(src).toContain('setupKeyboardSelection');
  });

  it('Case and Briefing: ENTER proceeds once the CTA is visible', () => {
    expect(read('src/game/scenes/CaseScene.ts')).toContain("keydown-ENTER");
    expect(read('src/game/scenes/BriefingScene.ts')).toContain("keydown-ENTER");
  });

  it('Evidence: number keys drive the same activate() path as the pointer', () => {
    const scene = read('src/game/scenes/EvidenceScene.ts');
    expect(scene).toContain('.activate()');
    expect(scene).toContain('keydown-ENTER');
    const card = read('src/game/ui/DossierCard.ts');
    expect(card).toContain("on('pointerdown', () => this.activate())");
  });

  it('a committed keyboard smoke drives a full case end-to-end', () => {
    const smoke = read('scripts/smoke/keyboard-smoke.mjs');
    for (const marker of ['ArrowRight', "press('Enter'", 'reading-layer', 'sr-announcer', 'caseMeta']) {
      expect(smoke, marker).toContain(marker);
    }
  });
});

describe('mobile guard — v2-aware language and declared fallback (§11.4)', () => {
  it('shouldShowMobileGuard keeps the same thresholds', () => {
    expect(shouldShowMobileGuard(390, 844)).toBe(true);   // portrait phone
    expect(shouldShowMobileGuard(360, 800)).toBe(true);
    expect(shouldShowMobileGuard(800, 390)).toBe(false);  // landscape phone-ish
    expect(shouldShowMobileGuard(1280, 720)).toBe(false); // desktop
  });

  it('savedLanguage reads the v2 key first, then the v1 snapshot', () => {
    const store = new Map<string, string>();
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k)
    };
    store.set('no-ai-act-save-v1', JSON.stringify({ language: 'it' }));
    store.set('no-ai-act-save-v2', JSON.stringify({ language: 'en' }));
    expect(savedLanguage()).toBe('en');
    store.delete('no-ai-act-save-v2');
    expect(savedLanguage()).toBe('it');
  });

  it('the guard is dismissable (continue-anyway), never a hard block', () => {
    const src = read('src/mobileGuard.ts');
    expect(src).toContain('mg-continue');
    expect(src).toContain('dismissed = true');
  });

  it('the layout smoke tests the fallback at 360×800 and 390×844', () => {
    const smoke = read('scripts/smoke/layout-smoke.mjs');
    expect(smoke).toContain('{ w: 390, h: 844 }');
    expect(smoke).toContain('{ w: 360, h: 800 }');
    expect(smoke).toContain('continue-anyway');
    expect(smoke).toContain('{ w: 1920, h: 1080 }');
  });
});

describe('honesty — no WCAG conformance claim', () => {
  it('neither the reading layer nor the i18n claims WCAG conformance', () => {
    for (const p of ['src/game/systems/ReadingLayer.ts', 'src/game/i18n/it.ts', 'src/game/i18n/en.ts', 'play/index.html']) {
      expect(read(p).toLowerCase()).not.toMatch(/wcag[ -]?2[^\n]{0,20}(conform|complian)/);
    }
  });

  it('both locales carry the full a11y block', () => {
    for (const locale of [itLocale, enLocale]) {
      const a = (locale as typeof itLocale).a11y;
      for (const k of ['readingShow', 'readingHide', 'readingNote', 'mobileContinue', 'mapHint', 'evidenceHint', 'outcomeAnnounced'] as const) {
        expect(a[k], k).toBeTruthy();
      }
    }
  });
});

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveProvider } from '../src/game/systems/AnalyticsSystem';
import {
  TALLY_PRE_GAME_IT_FORM_ID, TALLY_PRE_GAME_EN_URL,
  TALLY_POST_GAME_IT_URL, TALLY_POST_GAME_EN_URL
} from '../src/game/config/tally';

/**
 * PRIVACY / TELEMETRY GUARDRAILS (v1.x) — must hold through v1.2.
 *
 * The game sends nothing: no analytics in production, no direct network
 * primitives in game code (the single approved abstraction is
 * AnalyticsSystem, which resolves to `off` in production), and the only
 * external boundary is the voluntary, user-initiated Tally playtest form.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(resolve(root, dir))) {
    const p = join(dir, e);
    if (statSync(resolve(root, p)).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}
const GAME_FILES = walk('src/game');

describe('analytics resolves OFF in production by default', () => {
  it('no provider env + not dev → off', () => {
    expect(resolveProvider({ dev: false })).toBe('off');
    expect(resolveProvider({ dev: false, provider: undefined })).toBe('off');
  });
  it('Do Not Track always forces off', () => {
    expect(resolveProvider({ dev: false, doNotTrack: true })).toBe('off');
    expect(resolveProvider({ dev: true, doNotTrack: true })).toBe('off');
    expect(resolveProvider({ dev: false, provider: 'plausible', plausibleDomain: 'x', doNotTrack: true })).toBe('off');
  });
  it('a remote provider without configuration stays off (never sends by accident)', () => {
    expect(resolveProvider({ dev: false, provider: 'plausible' })).toBe('off');
    expect(resolveProvider({ dev: false, provider: 'umami' })).toBe('off');
  });
});

describe('no network primitives in game code outside the analytics abstraction', () => {
  it('no fetch / XHR / sendBeacon / WebSocket / EventSource in src/game (except AnalyticsSystem transport)', () => {
    const banned = /\bfetch\s*\(|XMLHttpRequest|sendBeacon|new WebSocket|new EventSource|navigator\.sendBeacon/;
    const offenders = GAME_FILES
      .filter((f) => !f.endsWith('systems/AnalyticsSystem.ts'))
      .filter((f) => banned.test(read(f)));
    expect(offenders, `network primitives found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('AnalyticsSystem is the only file that may contain a transport, and it is gated', () => {
    const src = read('src/game/systems/AnalyticsSystem.ts');
    expect(src).toMatch(/\bfetch\s*\(/); // the one approved transport
    // it only dispatches when enabled AND provider != off
    expect(src).toContain('if (!this.isEnabled()) return;');
  });

  it('no game code references a non-allowlisted external host', () => {
    const allowed = /schema\.org|eur-lex\.europa\.eu|digital-strategy\.ec\.europa\.eu|no-ai-act\.eu|github\.com|tally\.so|plausible\.io|umami|cloudflareinsights/;
    const offenders: string[] = [];
    for (const f of GAME_FILES) {
      for (const m of read(f).matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
        if (!allowed.test(m[0])) offenders.push(`${f}: ${m[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('Tally boundary is unchanged and confined to config + landings', () => {
  it('the four Tally IDs are exactly the approved ones', () => {
    expect(TALLY_PRE_GAME_IT_FORM_ID).toBe('44ENVA');
    expect(TALLY_PRE_GAME_EN_URL).toBe('https://tally.so/r/5BryXb');
    expect(TALLY_POST_GAME_IT_URL).toBe('https://tally.so/r/dWgB5y');
    expect(TALLY_POST_GAME_EN_URL).toBe('https://tally.so/r/ZjWp9A');
  });

  it('Tally only appears in the game config and on the two landings', () => {
    // in game code, Tally URLs live solely in config/tally.ts
    const tallyGameFiles = GAME_FILES.filter((f) => /tally\.so|44ENVA|5BryXb|dWgB5y|ZjWp9A/.test(read(f)));
    expect(tallyGameFiles).toEqual(['src/game/config/tally.ts']);
    // public pages: only the two landings embed the pre-game form
    expect(read('index.html')).toContain('data-tally-open="44ENVA"');
    expect(read('en/index.html')).toContain('https://tally.so/r/5BryXb');
  });
});

describe('/play/ SEO + privacy policy stays intact', () => {
  const play = read('play/index.html');
  it('/play/ is noindex, follow with a self canonical', () => {
    expect(play).toContain('content="noindex, follow"');
    expect(play).toContain('rel="canonical" href="https://www.no-ai-act.eu/play/"');
  });
  it('/play/ has social metadata but no telemetry beyond the shared CF beacon', () => {
    expect(play).toContain('property="og:title"');
    expect(play).toContain('name="twitter:card"');
    const srcs = [...play.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s);
    const external = srcs.filter((s) => /^https?:\/\//.test(s));
    expect(external).toEqual(['https://static.cloudflareinsights.com/beacon.min.js']);
  });
  it('/play/ is excluded from the sitemap, which stays at 42 public URLs', () => {
    const sm = read('public/sitemap.xml');
    expect(sm).not.toContain('/play/');
    expect((sm.match(/<loc>/g) ?? []).length).toBe(42);
  });
});

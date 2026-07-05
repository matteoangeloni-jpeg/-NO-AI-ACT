import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * SITEMAP / GOOGLE SEARCH CONSOLE READINESS GUARD.
 *
 * The plain "42 locs, no /play/" checks are not enough for Search Console: the
 * sitemap must be valid, well-formed XML of only canonical, absolute-HTTPS,
 * self-consistent public URLs — each backed by a real static page whose
 * canonical matches the sitemap entry — and robots.txt must advertise it.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SITE = 'https://www.no-ai-act.eu/';
const SITEMAP = read('public/sitemap.xml');
const LOCS = [...SITEMAP.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, l]) => l);

describe('sitemap — valid, well-formed XML', () => {
  it('has the XML declaration and the sitemaps.org 0.9 urlset root', () => {
    expect(SITEMAP.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(SITEMAP).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(SITEMAP.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('is well-formed: matching url/loc tags, no stray unescaped ampersands', () => {
    const count = (re: RegExp) => (SITEMAP.match(re) ?? []).length;
    expect(count(/<url>/g)).toBe(count(/<\/url>/g));
    expect(count(/<loc>/g)).toBe(count(/<\/loc>/g));
    expect(count(/<url>/g)).toBe(LOCS.length);
    expect(count(/<urlset\b/g)).toBe(1);
    // any '&' must be an entity (&amp; &lt; ...) — none expected in these URLs
    expect(/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(SITEMAP)).toBe(false);
  });
});

describe('sitemap — only canonical public HTTPS URLs', () => {
  it('contains exactly 42 URLs', () => {
    expect(LOCS.length).toBe(42);
  });

  it('every URL is absolute https on the production domain, no leaks', () => {
    for (const l of LOCS) {
      expect(l.startsWith(SITE), l).toBe(true);
      expect(l).not.toMatch(/^http:\/\//);
      expect(l).not.toMatch(/localhost|127\.0\.0\.1|github\.io|\.pages\.dev|:\d{2,5}\//);
    }
  });

  it('no query strings, no hash fragments, no empty locs', () => {
    for (const l of LOCS) {
      expect(l).not.toContain('?');
      expect(l).not.toContain('#');
      expect(l.trim().length).toBeGreaterThan(SITE.length - 1);
    }
  });

  it('no duplicate locs', () => {
    expect(new Set(LOCS).size).toBe(LOCS.length);
  });

  it('excludes /play/, /en/play/ and any noindex-only route', () => {
    expect(SITEMAP).not.toContain('/play/');
    expect(SITEMAP).not.toContain('/en/play/');
  });

  it('contains no asset / image / social / JS / CSS URLs', () => {
    for (const l of LOCS) {
      expect(l).not.toMatch(/\.(png|jpe?g|webp|svg|gif|ico|js|mjs|css|xml|txt|json|map)$/i);
      expect(l).not.toContain('/assets/');
      expect(l).not.toContain('no_ai_act_cover');
    }
  });
});

/** Map a sitemap URL to its repo file path. */
function fileForLoc(loc: string): string {
  const path = loc.slice(SITE.length); // '', 'en/', 'guida-ai-act/', ...
  return path === '' ? 'index.html' : `${path}index.html`;
}

describe('sitemap — URL ↔ file ↔ canonical consistency', () => {
  it('every sitemap URL maps to an existing static page', () => {
    const missing = LOCS.filter((l) => !existsSync(resolve(root, fileForLoc(l))));
    expect(missing, `missing pages: ${missing.join(', ')}`).toEqual([]);
  });

  it('root and EN landing resolve to their landings', () => {
    expect(fileForLoc(`${SITE}`)).toBe('index.html');
    expect(fileForLoc(`${SITE}en/`)).toBe('en/index.html');
    expect(existsSync(resolve(root, 'index.html'))).toBe(true);
    expect(existsSync(resolve(root, 'en/index.html'))).toBe(true);
  });

  it('each page has a self canonical exactly equal to its sitemap URL', () => {
    for (const l of LOCS) {
      const html = read(fileForLoc(l));
      const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      expect(canon, `${l}: canonical present`).toBeTruthy();
      expect(canon, `${l}: canonical == sitemap loc`).toBe(l);
      expect(canon).toMatch(/^https:\/\/www\.no-ai-act\.eu\//);
      expect(canon).not.toContain('?');
      expect(canon).not.toContain('#');
      // indexable (not noindex)
      expect(html).toMatch(/<meta name="robots" content="index, follow"/);
    }
  });

  it('no sitemap URL points at the /play/ shell', () => {
    for (const l of LOCS) expect(l.endsWith('/play/')).toBe(false);
  });
});

describe('robots.txt advertises the sitemap and does not block public pages', () => {
  const robots = read('public/robots.txt');
  it('exists with the exact Sitemap directive', () => {
    expect(robots).toMatch(/^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap\.xml\s*$/m);
  });
  it('does not disallow "/" or any public page', () => {
    const disallows = [...robots.matchAll(/^Disallow:\s*(.*)$/gim)].map(([, v]) => v.trim()).filter(Boolean);
    expect(disallows).toEqual([]); // the project allows all; /play/ is gated by meta noindex, not robots
    expect(robots).toMatch(/^Allow:\s*\/\s*$/m);
  });
});

describe('/play/ policy stays separate from sitemap inclusion', () => {
  const play = read('play/index.html');
  it('/play/ is noindex, follow (kept out of the index by meta, not robots)', () => {
    expect(play).toContain('content="noindex, follow"');
  });
  it('/play/ may carry social metadata but is never in the sitemap', () => {
    expect(play).toContain('property="og:title"');
    expect(SITEMAP).not.toContain('/play/');
  });
});

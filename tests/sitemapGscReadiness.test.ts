import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * SITEMAP / GOOGLE SEARCH CONSOLE READINESS GUARD.
 *
 * `/sitemap.xml` is a **sitemap index** pointing to two language child
 * sitemaps (`/sitemap-it.xml`, `/sitemap-en.xml`) — a pragmatic Search Console
 * compatibility structure. The combined children must still be exactly the 56
 * canonical, absolute-HTTPS public URLs (no `/play/`, no leaks), each backed by
 * a real page whose canonical matches its sitemap entry; robots.txt must
 * advertise only the index.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SITE = 'https://www.no-ai-act.eu/';

const INDEX = read('public/sitemap.xml');
const IT = read('public/sitemap-it.xml');
const EN = read('public/sitemap-en.xml');

const locsOf = (xml: string) => [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, l]) => l);
const CHILD_LOCS = locsOf(INDEX); // the two child-sitemap URLs
const IT_LOCS = locsOf(IT);
const EN_LOCS = locsOf(EN);
const ALL_LOCS = [...IT_LOCS, ...EN_LOCS];

describe('sitemap.xml — a valid sitemap index', () => {
  it('has the XML declaration first and a sitemapindex 0.9 root', () => {
    expect(INDEX.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(INDEX).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(INDEX.trimEnd().endsWith('</sitemapindex>')).toBe(true);
    // it is an index, not a direct urlset
    expect(INDEX).not.toContain('<urlset');
    expect(INDEX).not.toContain('<url>');
  });

  it('lists exactly the two language child sitemaps, each with a lastmod', () => {
    const entries = [...INDEX.matchAll(/<sitemap>/g)];
    expect(entries).toHaveLength(2);
    expect(CHILD_LOCS).toEqual([`${SITE}sitemap-it.xml`, `${SITE}sitemap-en.xml`]);
    expect([...INDEX.matchAll(/<lastmod>[^<]+<\/lastmod>/g)]).toHaveLength(2);
  });

  it('child sitemap URLs are absolute https on the www host — no http:// or apex', () => {
    // the only legitimate http:// in the file is the sitemaps.org namespace URI
    expect((INDEX.match(/http:\/\//g) ?? []).length).toBe(1);
    for (const l of CHILD_LOCS) {
      expect(l.startsWith('https://www.no-ai-act.eu/'), l).toBe(true);
      expect(l).not.toContain('http://');
      expect(l).not.toContain('https://no-ai-act.eu');
    }
  });
});

describe('child sitemaps — valid, well-formed urlsets', () => {
  it('both child files exist', () => {
    expect(existsSync(resolve(root, 'public/sitemap-it.xml'))).toBe(true);
    expect(existsSync(resolve(root, 'public/sitemap-en.xml'))).toBe(true);
  });

  it('each is a valid urlset (declaration, 0.9 namespace, matching tags)', () => {
    for (const xml of [IT, EN]) {
      expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
      const count = (re: RegExp) => (xml.match(re) ?? []).length;
      expect(count(/<url>/g)).toBe(count(/<\/url>/g));
      expect(count(/<loc>/g)).toBe(count(/<\/loc>/g));
      expect(count(/<url>/g)).toBe(locsOf(xml).length);
      expect(/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(xml)).toBe(false);
      expect((xml.match(/http:\/\//g) ?? []).length).toBe(1); // namespace only
    }
  });
});

describe('child sitemaps — the 56 canonical public URLs, split by language', () => {
  it('combined child URLs are exactly 56', () => {
    expect(ALL_LOCS.length).toBe(56);
  });

  it('no URL is duplicated within or across the child sitemaps', () => {
    expect(new Set(ALL_LOCS).size).toBe(56);
    expect(new Set(IT_LOCS).size).toBe(IT_LOCS.length);
    expect(new Set(EN_LOCS).size).toBe(EN_LOCS.length);
  });

  it('sitemap-it.xml holds the root + IT pages only (no /en/)', () => {
    expect(IT_LOCS).toContain(SITE);
    for (const l of IT_LOCS) expect(l.startsWith(`${SITE}en/`), l).toBe(false);
  });

  it('sitemap-en.xml holds the /en/ pages only', () => {
    expect(EN_LOCS).toContain(`${SITE}en/`);
    for (const l of EN_LOCS) expect(l.startsWith(`${SITE}en/`), l).toBe(true);
  });

  it('every URL is absolute https on the www host, no leaks', () => {
    for (const l of ALL_LOCS) {
      expect(l.startsWith(SITE), l).toBe(true);
      expect(l).not.toMatch(/^http:\/\//);
      expect(l).not.toMatch(/^https:\/\/no-ai-act\.eu\//);
      expect(l).not.toMatch(/localhost|127\.0\.0\.1|github\.io|\.pages\.dev|:\d{2,5}\//);
    }
  });

  it('no query strings, hashes, assets, or /play/ routes', () => {
    for (const l of ALL_LOCS) {
      expect(l).not.toContain('?');
      expect(l).not.toContain('#');
      expect(l).not.toMatch(/\.(png|jpe?g|webp|svg|gif|ico|js|mjs|css|xml|txt|json|map)$/i);
      expect(l).not.toContain('/assets/');
      expect(l).not.toContain('no_ai_act_cover');
    }
    for (const xml of [INDEX, IT, EN]) {
      expect(xml).not.toContain('/play/');
      expect(xml).not.toContain('/en/play/');
    }
  });
});

/** Map a sitemap URL to its repo file path. */
function fileForLoc(loc: string): string {
  const path = loc.slice(SITE.length); // '', 'en/', 'guida-ai-act/', ...
  return path === '' ? 'index.html' : `${path}index.html`;
}

describe('child sitemaps — URL ↔ file ↔ canonical consistency', () => {
  it('every URL maps to an existing static page', () => {
    const missing = ALL_LOCS.filter((l) => !existsSync(resolve(root, fileForLoc(l))));
    expect(missing, `missing pages: ${missing.join(', ')}`).toEqual([]);
  });

  it('each page has a self canonical exactly equal to its sitemap URL and is indexable', () => {
    for (const l of ALL_LOCS) {
      const html = read(fileForLoc(l));
      const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      expect(canon, `${l}: canonical present`).toBeTruthy();
      expect(canon, `${l}: canonical == sitemap loc`).toBe(l);
      expect(canon).not.toContain('?');
      expect(canon).not.toContain('#');
      expect(html).toMatch(/<meta name="robots" content="index, follow"/);
    }
  });
});

describe('robots.txt advertises the two language sitemaps directly', () => {
  const robots = read('public/robots.txt');
  it('advertises exactly the two child sitemaps (GSC reads these reliably)', () => {
    const directives = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(([, v]) => v);
    expect(directives).toEqual([
      'https://www.no-ai-act.eu/sitemap-it.xml',
      'https://www.no-ai-act.eu/sitemap-en.xml'
    ]);
  });
  it('no longer advertises the /sitemap.xml index, nor any http:// or apex variant', () => {
    // the index file may still exist, but robots must not point at it.
    expect(robots).not.toMatch(/^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap\.xml\s*$/im);
    expect(robots).not.toContain('Sitemap: http://');
    expect(robots).not.toMatch(/^Sitemap:\s*https:\/\/no-ai-act\.eu\//im);
  });
  it('every advertised sitemap is an absolute https www URL', () => {
    const directives = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(([, v]) => v);
    for (const d of directives) expect(d.startsWith('https://www.no-ai-act.eu/'), d).toBe(true);
  });
  it('does not disallow "/" or any public page', () => {
    const disallows = [...robots.matchAll(/^Disallow:\s*(.*)$/gim)].map(([, v]) => v.trim()).filter(Boolean);
    expect(disallows).toEqual([]);
    expect(robots).toMatch(/^Allow:\s*\/\s*$/m);
  });
});

describe('/play/ policy stays separate from sitemap inclusion', () => {
  const play = read('play/index.html');
  it('/play/ is noindex, follow and never appears in any sitemap', () => {
    expect(play).toContain('content="noindex, follow"');
    for (const xml of [INDEX, IT, EN]) expect(xml).not.toContain('/play/');
  });
});

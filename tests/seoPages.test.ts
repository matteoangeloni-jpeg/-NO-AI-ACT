import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const SITE = 'https://www.no-ai-act.eu/';

/** The educational page cluster added by the SEO growth sprint. */
const PAGES = [
  { file: 'come-funziona/index.html', lang: 'it', canonical: `${SITE}come-funziona/`, alt: `${SITE}en/how-it-works/`, h1: 'Come funziona NO AI ACT' },
  { file: 'per-docenti/index.html', lang: 'it', canonical: `${SITE}per-docenti/`, alt: `${SITE}en/for-educators/`, h1: 'NO AI ACT per docenti e formatori' },
  { file: 'ai-act-serious-game/index.html', lang: 'it', canonical: `${SITE}ai-act-serious-game/`, alt: `${SITE}en/ai-act-serious-game/`, h1: "Un serious game sull'AI Act" },
  { file: 'privacy-by-design/index.html', lang: 'it', canonical: `${SITE}privacy-by-design/`, alt: `${SITE}en/privacy-by-design/`, h1: 'Privacy by design' },
  { file: 'en/how-it-works/index.html', lang: 'en', canonical: `${SITE}en/how-it-works/`, alt: `${SITE}come-funziona/`, h1: 'How NO AI ACT works' },
  { file: 'en/for-educators/index.html', lang: 'en', canonical: `${SITE}en/for-educators/`, alt: `${SITE}per-docenti/`, h1: 'NO AI ACT for educators' },
  { file: 'en/ai-act-serious-game/index.html', lang: 'en', canonical: `${SITE}en/ai-act-serious-game/`, alt: `${SITE}ai-act-serious-game/`, h1: 'A serious game about the EU AI Act' },
  { file: 'en/privacy-by-design/index.html', lang: 'en', canonical: `${SITE}en/privacy-by-design/`, alt: `${SITE}privacy-by-design/`, h1: 'Privacy by design' }
] as const;

describe('SEO pages — existence and build wiring', () => {
  it('all 8 educational pages exist', () => {
    for (const p of PAGES) {
      expect(existsSync(resolve(root, p.file)), p.file).toBe(true);
    }
  });

  it('vite builds every educational page (rollup inputs)', () => {
    const cfg = read('vite.config.ts');
    for (const p of PAGES) {
      expect(cfg, `vite input missing for ${p.file}`).toContain(`'${p.file}'`);
    }
  });
});

describe('SEO pages — head/meta requirements', () => {
  for (const p of PAGES) {
    const html = read(p.file);

    it(`${p.file} is indexable with correct lang, canonical and hreflang pair`, () => {
      expect(html).toContain(`<html lang="${p.lang}">`);
      expect(html).toContain('name="robots" content="index, follow"');
      expect(html).toContain(`<link rel="canonical" href="${p.canonical}"`);
      // hreflang pair: itself + counterpart + x-default
      expect(html).toContain(`hreflang="${p.lang}" href="${p.canonical}"`);
      expect(html).toContain(`href="${p.alt}"`);
      expect(html).toContain('hreflang="x-default"');
    });

    it(`${p.file} has title, description, OG and a single H1`, () => {
      expect(html).toMatch(/<title>[^<]{20,}<\/title>/);
      expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain(`property="og:url" content="${p.canonical}"`);
      const h1s = [...html.matchAll(/<h1[^>]*>/g)];
      expect(h1s.length, 'exactly one H1').toBe(1);
      expect(html).toContain(p.h1);
    });

    it(`${p.file} carries valid JSON-LD without review/rating schema`, () => {
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      for (const [, body] of blocks) {
        expect(() => JSON.parse(body)).not.toThrow();
      }
      expect(html).not.toContain('"AggregateRating"');
      expect(html).not.toContain('"Review"');
      expect(html).not.toContain('aggregateRating');
    });

    it(`${p.file} has a CTA to play, the disclaimer and no forbidden claims`, () => {
      expect(html).toMatch(/href="[^"]*play\/\?lang=(it|en)"/);
      expect(html.toLowerCase()).toMatch(/non consulenza legale|not legal advice/);
      const lower = html.toLowerCase();
      for (const forbidden of ['certified', 'certificato ufficiale', 'official ai act training', 'validated learning', 'proven to teach', 'compliance-ready']) {
        expect(lower, `must not claim: ${forbidden}`).not.toContain(forbidden);
      }
    });

    it(`${p.file} adds no forms, no new trackers and keeps Tally IDs out`, () => {
      expect(html).not.toContain('<form');
      expect(html).not.toContain('data-tally-open');
      expect(html).not.toMatch(/googletagmanager\.com|google-analytics\.com|gtag\(|dataLayer|facebook\.com\/tr/);
    });
  }
});

describe('SEO pages — internal linking (no orphans, cluster wiring)', () => {
  it('IT landing links to all 4 IT pages', () => {
    const html = read('index.html');
    for (const path of ['./come-funziona/', './per-docenti/', './ai-act-serious-game/', './privacy-by-design/']) {
      expect(html).toContain(`href="${path}"`);
    }
  });

  it('EN landing links to all 4 EN pages', () => {
    const html = read('en/index.html');
    for (const path of ['./how-it-works/', './for-educators/', './ai-act-serious-game/', './privacy-by-design/']) {
      expect(html).toContain(`href="${path}"`);
    }
  });

  it('every educational page links back to its home and to at least 2 sibling pages', () => {
    for (const p of PAGES) {
      const html = read(p.file);
      expect(html, `${p.file} must link home`).toMatch(/href="\.\.\/"|href="\.\.\/\.\.\/"/);
      const siblings = p.lang === 'it'
        ? ['come-funziona/', 'per-docenti/', 'ai-act-serious-game/', 'privacy-by-design/']
        : ['how-it-works/', 'for-educators/', 'ai-act-serious-game/', 'privacy-by-design/'];
      const linked = siblings.filter((s) => !p.file.startsWith(s.replace(/\/$/, '')) && !p.file.includes(`/${s}`) && html.includes(`${s}"`));
      expect(linked.length, `${p.file} links to siblings: ${linked.join(', ')}`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('SEO pages — game and play routing untouched', () => {
  it('/play/ keeps its noindex meta', () => {
    expect(read('play/index.html')).toContain('name="robots" content="noindex, follow"');
  });

  it('landing Tally setup unchanged', () => {
    expect(read('index.html')).toContain('data-tally-open="44ENVA"');
    expect(read('en/index.html')).toContain('data-tally-open="5BryXb"');
  });

  it('llms.txt lists the new educational pages', () => {
    const llms = read('public/llms.txt');
    for (const url of [`${SITE}come-funziona/`, `${SITE}per-docenti/`, `${SITE}ai-act-serious-game/`, `${SITE}privacy-by-design/`, `${SITE}en/how-it-works/`, `${SITE}en/for-educators/`]) {
      expect(llms).toContain(url);
    }
  });
});

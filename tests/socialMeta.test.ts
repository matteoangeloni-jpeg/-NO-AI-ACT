import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const CFG = JSON.parse(read('scripts/social/meta.config.json'));
const SITE = 'https://www.no-ai-act.eu/';

/** All 42 public dirs ('' = IT landing) + the /play/ shell key 'play'. */
const PUBLIC = Object.keys(CFG.pageCategory).filter((d: string) => d !== 'play');
const ALL = Object.keys(CFG.pageCategory); // includes 'play'
const fileOf = (d: string) => (d === 'play' ? 'play/index.html' : d === '' ? 'index.html' : `${d}/index.html`);

const meta = (html: string, prop: string, attr: 'property' | 'name') => {
  const m = html.match(new RegExp(`<meta ${attr}="${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" content="([^"]*)"`));
  return m ? m[1] : null;
};

/** Read width/height from a PNG's IHDR (big-endian uint32 at offsets 16 and 20). */
function pngSize(path: string): { w: number; h: number } {
  const b = readFileSync(path);
  expect(b.subarray(0, 8).toString('hex'), 'PNG signature').toBe('89504e470d0a1a0a');
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

describe('social images — assets exist, correct size, reasonable weight', () => {
  it('every category image is a 1200×630 PNG committed under public/assets/social', () => {
    for (const cat of Object.values<any>(CFG.categories)) {
      const p = resolve(root, 'public/assets/social', cat.file);
      expect(existsSync(p), cat.file).toBe(true);
      const { w, h } = pngSize(p);
      expect({ w, h }, cat.file).toEqual({ w: CFG.imageWidth, h: CFG.imageHeight });
      // reasonable weight for a social card (< 400 KB)
      expect(readFileSync(p).length, `${cat.file} size`).toBeLessThan(400 * 1024);
    }
  });

  it('the generator and config are committed (reproducible)', () => {
    expect(existsSync(resolve(root, 'scripts/social/generate-og-images.mjs'))).toBe(true);
    expect(existsSync(resolve(root, 'scripts/social/inject-meta.py'))).toBe(true);
  });
});

describe('Open Graph — complete on every page + the play shell', () => {
  const REQ = ['og:type', 'og:site_name', 'og:locale', 'og:locale:alternate', 'og:title', 'og:description',
    'og:url', 'og:image', 'og:image:secure_url', 'og:image:width', 'og:image:height', 'og:image:alt'];
  it('all required OG tags present, single-valued (except locale:alternate)', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      for (const t of REQ) {
        const count = (html.match(new RegExp(`property="${t}"`, 'g')) ?? []).length;
        if (t === 'og:locale:alternate') expect(count, `${d}: ${t}`).toBeGreaterThanOrEqual(1);
        else expect(count, `${d}: ${t} count`).toBe(1);
      }
      expect(meta(html, 'og:type', 'property'), `${d}: og:type`).toBe('website');
      expect(meta(html, 'og:site_name', 'property')).toBe('NO AI ACT');
      expect(meta(html, 'og:image:width', 'property')).toBe(String(CFG.imageWidth));
      expect(meta(html, 'og:image:height', 'property')).toBe(String(CFG.imageHeight));
    }
  });

  it('og:url equals the page canonical (play canonical is self)', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
      expect(canon, `${d}: canonical`).toBeTruthy();
      expect(meta(html, 'og:url', 'property'), `${d}: og:url==canonical`).toBe(canon);
    }
  });

  it('locale is it_IT / en_GB with the opposite as alternate', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      const en = d.startsWith('en/') || d === 'en';
      // play shell is the it_IT locale (lang="it")
      const expLocale = en ? 'en_GB' : 'it_IT';
      const expAlt = en ? 'it_IT' : 'en_GB';
      expect(meta(html, 'og:locale', 'property'), `${d}: locale`).toBe(expLocale);
      expect(html, `${d}: alternate`).toContain(`<meta property="og:locale:alternate" content="${expAlt}" />`);
    }
  });
});

describe('Twitter card — complete on every page + the play shell', () => {
  const REQ = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'];
  it('summary_large_image with all required fields, no fake handles', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      for (const t of REQ) {
        expect((html.match(new RegExp(`name="${t}"`, 'g')) ?? []).length, `${d}: ${t}`).toBe(1);
      }
      expect(meta(html, 'twitter:card', 'name'), `${d}`).toBe('summary_large_image');
      // no invented social handles
      expect(html).not.toContain('twitter:site');
      expect(html).not.toContain('twitter:creator');
    }
  });
});

describe('images are absolute HTTPS + match the category mapping', () => {
  it('og/twitter images are absolute https on the production domain', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      for (const val of [meta(html, 'og:image', 'property'), meta(html, 'og:image:secure_url', 'property'), meta(html, 'twitter:image', 'name')]) {
        expect(val?.startsWith('https://www.no-ai-act.eu/assets/social/'), `${d}: ${val}`).toBe(true);
      }
    }
  });

  it('each page uses the image assigned to its category', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      const cat = CFG.pageCategory[d];
      const expected = SITE + 'assets/social/' + CFG.categories[cat].file;
      expect(meta(html, 'og:image', 'property'), `${d} -> ${cat}`).toBe(expected);
      expect(meta(html, 'twitter:image', 'name'), `${d} -> ${cat}`).toBe(expected);
    }
  });

  it('key pages use their intended image group', () => {
    const expect_ = (d: string, file: string) =>
      expect(meta(read(fileOf(d)), 'og:image', 'property')).toBe(SITE + 'assets/social/' + file);
    expect_('', 'no-ai-act-og.png');
    expect_('en', 'no-ai-act-en-og.png');
    expect_('play', 'no-ai-act-play-og.png');
    expect_('educazione', 'no-ai-act-education-og.png');
    expect_('en/ai-act-for-teachers', 'no-ai-act-education-og.png');
    expect_('guida-ai-act', 'no-ai-act-guide-og.png');
    expect_('en/eu-ai-act-guide', 'no-ai-act-guide-og.png');
    expect_('glossario', 'no-ai-act-glossary-og.png');
    expect_('en/glossary', 'no-ai-act-glossary-og.png');
  });
});

describe('no URL leaks, no stale references, no fake/forbidden content', () => {
  it('no localhost / 127.0.0.1 / github.io / preview-port in any page metadata', () => {
    for (const d of ALL) {
      const head = read(fileOf(d)).split('</head>')[0];
      expect(head, `${d}`).not.toMatch(/localhost|127\.0\.0\.1|github\.io|:41\d\d/);
    }
  });

  it('image alt text does not claim official EU tool or legal advice', () => {
    for (const cat of Object.values<any>(CFG.categories)) {
      for (const alt of [cat.altIt, cat.altEn]) {
        expect(alt.toLowerCase()).not.toMatch(/official eu|ufficiale ue|strumento ufficiale|legal advice|consulenza legale/);
      }
    }
  });

  it('no forbidden schema and no new external script hosts introduced', () => {
    for (const d of ALL) {
      const html = read(fileOf(d));
      for (const bad of ['"Review"', '"AggregateRating"', '"Product"', '"Course"']) {
        expect(html.includes(bad), `${d}: ${bad}`).toBe(false);
      }
      // only the pre-existing hosts may appear: the CF beacon (all pages) and
      // the Tally playtest embed (landings only). No NEW external host.
      const allowed = ['static.cloudflareinsights.com', 'tally.so'];
      const external = [...html.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s).filter((s) => /^https?:\/\//.test(s));
      for (const s of external) {
        expect(allowed.some((h) => s.includes(h)), `${d}: unexpected external script ${s}`).toBe(true);
      }
    }
  });
});

describe('SEO / policy invariants preserved', () => {
  it('every public page has a unique title and description', () => {
    const titles = new Set<string>(), descs = new Set<string>();
    for (const d of PUBLIC) {
      const html = read(fileOf(d));
      const t = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
      const m = meta(html, 'description', 'name') ?? '';
      expect(titles.has(t), `dup title ${d}: ${t}`).toBe(false);
      expect(descs.has(m), `dup desc ${d}`).toBe(false);
      titles.add(t); descs.add(m);
    }
  });

  it('/play/ keeps noindex, follow, has a self canonical, stays out of sitemap', () => {
    const play = read('play/index.html');
    expect(play).toContain('content="noindex, follow"');
    expect(play).toContain('rel="canonical" href="https://www.no-ai-act.eu/play/"');
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).not.toContain('/play/');
    expect((sitemap.match(/<loc>/g) ?? []).length).toBe(42);
  });

  it('Tally IDs unchanged', () => {
    expect(read('index.html')).toContain('data-tally-open="44ENVA"');
    expect(read('en/index.html')).toContain('https://tally.so/r/5BryXb');
    const t = read('src/game/config/tally.ts');
    for (const id of ['44ENVA', '5BryXb', 'dWgB5y', 'ZjWp9A']) expect(t).toContain(id);
  });

  it('config covers exactly the 42 public pages + the play shell', () => {
    expect(PUBLIC.length).toBe(42);
    expect(ALL.length).toBe(43);
  });
});

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** All 56 indexable public pages (dirs relative to root; '' = IT landing). */
const IT = ['', 'come-funziona', 'per-docenti', 'ai-act-serious-game', 'privacy-by-design',
  'educazione', 'ai-act-per-docenti', 'alfabetizzazione-ai', 'guida-ai-act',
  'categorie-rischio-ai-act', 'pratiche-vietate-ai-act', 'sistemi-ai-ad-alto-rischio',
  'obblighi-trasparenza-ai-act', 'ai-generativa-e-gpai', 'apprendimento-privacy-consapevole',
  'serious-game-regolazione-ai', 'attivita-didattiche', 'lezione-introduzione-ai-act', 'glossario',
  'come-citare', 'ricerca-e-metodologia', 'press-kit',
  'tempi-applicazione-ai-act', 'deepfake-e-trasparenza', 'ai-nel-lavoro-e-selezione',
  'laboratorio-ai-act-in-classe'];
const EN = ['en', 'en/how-it-works', 'en/for-educators', 'en/ai-act-serious-game', 'en/privacy-by-design',
  'en/education', 'en/ai-act-for-teachers', 'en/ai-literacy', 'en/eu-ai-act-guide',
  'en/ai-act-risk-categories', 'en/prohibited-ai-practices', 'en/high-risk-ai-systems',
  'en/transparency-obligations', 'en/general-purpose-ai', 'en/privacy-conscious-learning',
  'en/serious-games-for-ai-regulation', 'en/digital-citizenship-ai-regulation',
  'en/classroom-activities', 'en/lesson-plan-introduction-to-the-ai-act',
  'en/lesson-plan-risk-based-approach', 'en/lesson-plan-transparency-and-users',
  'en/glossary', 'en/faq', 'en/how-to-cite', 'en/research-and-methodology', 'en/press-kit',
  'en/ai-act-application-timeline', 'en/deepfakes-and-transparency',
  'en/ai-in-recruitment-and-employment', 'en/ai-act-classroom-lab'];
const ALL_PUBLIC = [...IT, ...EN];

const file = (dir: string) => (dir === '' ? 'index.html' : `${dir}/index.html`);
const isEn = (dir: string) => dir === 'en' || dir.startsWith('en/');

/** Resolve a relative/absolute href from a page dir to a repo file path, or null to skip. */
function resolveHref(dir: string, hrefRaw: string): string | null {
  if (/^(https?:|mailto:|tel:)/.test(hrefRaw)) return null;
  const href = hrefRaw.split('#')[0].split('?')[0];
  if (href === '') return null; // pure anchor / query
  let path: string;
  if (href.startsWith('/')) {
    path = href.slice(1);
  } else {
    const parts = dir === '' ? [] : dir.split('/');
    for (const seg of href.split('/')) {
      if (seg === '..') parts.pop();
      else if (seg === '.' || seg === '') continue;
      else parts.push(seg);
    }
    path = parts.join('/');
  }
  const lastSeg = path.split('/').pop() ?? '';
  const looksLikeDir = href.endsWith('/') || path === '' || !lastSeg.includes('.');
  return looksLikeDir ? (path === '' ? 'index.html' : `${path}/index.html`) : path;
}

/** Resolve an href to a public-page dir key (in ALL_PUBLIC), or null. */
function resolveToDir(dir: string, href: string): string | null {
  const p = resolveHref(dir, href);
  if (!p || !p.endsWith('index.html')) return null;
  return p === 'index.html' ? '' : p.slice(0, -'/index.html'.length);
}

function hrefs(dir: string): string[] {
  const html = read(file(dir));
  return [...html.matchAll(/href="([^"]+)"/g)].map(([, h]) => h);
}

// ============================ global navigation ============================

describe('global navigation — presence and content', () => {
  it('every public page carries the global site-nav with a language toggle', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      expect(html, `${d}: site-nav`).toContain('class="site-nav"');
      expect(html, `${d}: nav-lang toggle`).toContain('class="nav-lang"');
      expect(html, `${d}: nav aria-label`).toMatch(/aria-label="(Navigazione principale|Primary navigation)"/);
    }
  });

  it('nav includes the required top-level groups (structured menu)', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      const nav = html.slice(html.indexOf('class="site-nav"'), html.indexOf('</nav>'));
      const top = isEn(d)
        ? ['>Play<', '>Education<', '>Teachers<', '>AI Act<', '>Glossary<', '>Privacy<']
        : ['>Gioca<', '>Risorse<', '>Docenti<', '>AI Act<', '>Glossario<', '>Privacy<'];
      for (const t of top) expect(nav, `${d}: ${t}`).toContain(t);
      // descriptive submenu items are present too
      const subs = isEn(d)
        ? ['>Education hub<', '>AI Act for teachers<', '>EU AI Act guide<']
        : ['>Hub educativo<', '>AI Act per docenti<', '>Guida AI Act<'];
      for (const s of subs) expect(nav, `${d}: ${s}`).toContain(s);
    }
  });

  it('the game is reachable from every public page (nav links to /play/)', () => {
    for (const d of ALL_PUBLIC) {
      const linksPlay = hrefs(d).some((h) => resolveHref(d, h) === 'play/index.html');
      expect(linksPlay, `${d} must link to /play/`).toBe(true);
    }
  });

  it('the education hub is reachable from every public page', () => {
    for (const d of ALL_PUBLIC) {
      const dirs = hrefs(d).map((h) => resolveToDir(d, h));
      const reachesHub = dirs.includes('educazione') || dirs.includes('en/education');
      expect(reachesHub, `${d} must link to an education hub`).toBe(true);
    }
  });
});

// ============================ reachability / links ============================

describe('information architecture — no orphans, no broken links', () => {
  it('every internal link on every public page resolves to an existing file', () => {
    const broken: string[] = [];
    for (const d of ALL_PUBLIC) {
      for (const h of hrefs(d)) {
        const p = resolveHref(d, h);
        if (!p) continue;
        // public/* is copied to the dist root at build time, so /assets/... etc.
        // are served from the site root even though they live under public/.
        if (!existsSync(resolve(root, p)) && !existsSync(resolve(root, 'public', p))) {
          broken.push(`${d || '/'} -> ${h} (${p})`);
        }
      }
    }
    expect(broken, `broken internal links:\n${broken.join('\n')}`).toEqual([]);
  });

  it('no public page is orphaned (each is linked from at least one other page)', () => {
    const linkedFrom = new Map<string, Set<string>>();
    for (const d of ALL_PUBLIC) {
      for (const h of hrefs(d)) {
        const t = resolveToDir(d, h);
        if (t !== null && t !== d && ALL_PUBLIC.includes(t)) {
          (linkedFrom.get(t) ?? linkedFrom.set(t, new Set()).get(t)!).add(d);
        }
      }
    }
    for (const d of ALL_PUBLIC) {
      expect((linkedFrom.get(d)?.size ?? 0) > 0, `${d || '/'} is orphaned`).toBe(true);
    }
  });

  it('every public page is reachable within 2 clicks from its landing', () => {
    const linkDirs = (d: string) => hrefs(d).map((h) => resolveToDir(d, h)).filter((t): t is string => t !== null && ALL_PUBLIC.includes(t));
    for (const [landing, universe] of [['', IT], ['en', EN]] as const) {
      const l1 = new Set(linkDirs(landing));
      const reach = new Set(l1);
      for (const a of l1) for (const b of linkDirs(a)) reach.add(b);
      for (const target of universe) {
        if (target === landing) continue;
        expect(reach.has(target), `${target} not reachable within 2 clicks from /${landing}`).toBe(true);
      }
    }
  });
});

// ============================ start-here + in-brief ============================

describe('entry-point UX — Start here and In brief', () => {
  it('Start here sections exist on both landings and both education hubs', () => {
    for (const d of ['', 'en', 'educazione', 'en/education']) {
      const html = read(file(d));
      expect(html, `${d}: starthere`).toContain('class="starthere"');
      expect(html, `${d}: start-title`).toContain('id="start-title"');
      // must guide play, teachers, guide, glossary, privacy audiences
      const start = html.slice(html.indexOf('class="starthere"'), html.indexOf('</section>', html.indexOf('class="starthere"')));
      expect([...start.matchAll(/<li>/g)].length, `${d}: >=6 start options`).toBeGreaterThanOrEqual(6);
    }
  });

  it('pillar pages include an "In brief" / "In breve" block', () => {
    const pillars = ['en/education', 'educazione', 'en/eu-ai-act-guide', 'guida-ai-act',
      'en/ai-act-for-teachers', 'ai-act-per-docenti', 'en/ai-literacy', 'alfabetizzazione-ai',
      'en/privacy-conscious-learning', 'apprendimento-privacy-consapevole'];
    for (const d of pillars) {
      const html = read(file(d));
      expect(html, `${d}: inbrief`).toContain('class="inbrief"');
      expect(html, `${d}: inbrief label`).toMatch(/inbrief-label">(In brief|In breve)</);
    }
  });

  it('education hubs act as a real index (grouped resource map)', () => {
    for (const d of ['educazione', 'en/education']) {
      const html = read(file(d));
      expect(html, `${d}: hub-map`).toContain('class="grid hub-map"');
    }
  });
});

// ============================ SEO / safeguards ============================

describe('SEO and privacy safeguards preserved', () => {
  it('/play/ stays noindex, follow and out of the sitemap', () => {
    expect(read('play/index.html')).toContain('content="noindex, follow"');
    // /sitemap.xml is a sitemap index → the public URLs live in the language children.
    const it = read('public/sitemap-it.xml');
    const en = read('public/sitemap-en.xml');
    for (const sm of [read('public/sitemap.xml'), it, en]) expect(sm).not.toContain('/play/');
    const locs = [it, en].flatMap((sm) => [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));
    expect(locs.length).toBe(ALL_PUBLIC.length);
    for (const l of locs) expect(l).not.toContain('?');
  });

  it('every public page keeps a self-referencing canonical', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      const url = d === '' ? 'https://www.no-ai-act.eu/' : `https://www.no-ai-act.eu/${d}/`;
      expect(html, `${d}: canonical`).toContain(`rel="canonical" href="${url}"`);
    }
  });

  it('titles and meta descriptions remain unique across public pages', () => {
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      const t = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
      const m = html.match(/name="description" content="([^"]+)"/)?.[1] ?? '';
      expect(titles.has(t), `duplicate title on ${d}: ${t}`).toBe(false);
      expect(descs.has(m), `duplicate description on ${d}`).toBe(false);
      titles.add(t); descs.add(m);
    }
  });

  it('no forbidden structured-data types anywhere', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      for (const bad of ['"Review"', '"AggregateRating"', '"Product"', '"Course"']) {
        expect(html.includes(bad), `${d} must not contain ${bad}`).toBe(false);
      }
    }
  });

  it('all JSON-LD blocks parse as valid JSON', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      for (const [, block] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        expect(() => JSON.parse(block), `${d}: invalid JSON-LD`).not.toThrow();
      }
    }
  });

  it('no Tally / external form reference anywhere on the landings', () => {
    for (const p of ['index.html', 'en/index.html']) {
      const html = read(p);
      expect(html).not.toContain('tally.so');
      expect(html).not.toMatch(/data-tally/i);
    }
  });

  it('no new telemetry: the game shell has only main.ts and the Cloudflare beacon', () => {
    const shell = read('play/index.html');
    const srcs = [...shell.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s);
    expect(srcs.sort()).toEqual(['/src/main.ts', 'https://static.cloudflareinsights.com/beacon.min.js']);
    expect(shell).not.toMatch(/plausible|umami|google-analytics|gtag|mixpanel|segment/i);
  });
});

// ============================ mobile nav / accessibility ============================

describe('navigation CSS — responsive, accessible', () => {
  const css = read('src/styles/landing.css');

  it('nav wraps and provides a mobile drawer to avoid horizontal overflow', () => {
    expect(css).toMatch(/\.nav-menu\s*\{[^}]*flex-wrap:\s*wrap/s);
    expect(css).toContain('@media (max-width: 640px)');
    // mobile drawer + toggle shown only under has-js
    expect(css).toContain('.has-js .nav-toggle');
    expect(css).toContain('.has-js .site-nav.open .nav-menu');
  });

  it('focus-visible styling and skip link exist', () => {
    expect(css).toContain(':focus-visible');
    expect(css).toContain('.skip-link');
    for (const d of ALL_PUBLIC) {
      expect(read(file(d)), `${d}: skip link`).toContain('class="skip-link"');
    }
  });

  it('aria-current marks the active section in nav where applicable', () => {
    // a section page marks its own nav item
    expect(read('glossario/index.html')).toMatch(/aria-current="page">Glossario</);
    expect(read('en/glossary/index.html')).toMatch(/aria-current="page">Glossary</);
  });
});

// ============================ game-to-site nav ============================

describe('game-to-site navigation', () => {
  it('the game shell has a persistent internal back-to-site link', () => {
    const shell = read('play/index.html');
    expect(shell).toContain('id="site-return"');
    expect(shell).toMatch(/id="site-return"[^>]*href="\.\.\/"/);
    expect(shell).toContain('aria-label=');
  });

  it('the title screen wires the site-resources overlay', () => {
    const title = read('src/game/scenes/TitleScene.ts');
    expect(title).toContain('SiteResourcesOverlay');
    expect(title).toContain('ui.siteLinks.button');
  });

  it('SiteResourcesOverlay opens only internal pages, with noopener', () => {
    const src = read('src/game/ui/SiteResourcesOverlay.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(src).not.toMatch(/https?:\/\//);
    for (const call of src.match(/window\.open\([^)]*\)/g) ?? []) {
      expect(call).toContain('noopener');
    }
    expect(src).not.toContain('fetch(');
    expect(src).not.toContain('AnalyticsSystem');
  });

  it('SITE_LINKS are internal same-origin paths for both languages', () => {
    const concepts = read('src/game/data/concepts.ts');
    for (const p of ['../educazione/', '../glossario/', '../ai-act-per-docenti/', '../privacy-by-design/',
      '../en/education/', '../en/glossary/', '../en/ai-act-for-teachers/', '../en/privacy-by-design/']) {
      expect(concepts, `SITE_LINKS ${p}`).toContain(`'${p}'`);
    }
  });
});

// ============================ version consistency ============================

describe('version display consistency', () => {
  it('every public footer shows v1.1.0 and none shows v1.0.0', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      expect(html, `${d} still shows v1.0.0`).not.toContain('v1.0.0');
      expect(html, `${d} missing v1.1.0`).toContain('v1.1.0');
    }
  });

  it('package.json version matches', () => {
    expect(JSON.parse(read('package.json')).version).toBe('1.1.0');
  });
});

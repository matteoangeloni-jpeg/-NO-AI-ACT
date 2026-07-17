import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

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
const file = (d: string) => (d === '' ? 'index.html' : `${d}/index.html`);

function resolveHref(dir: string, hrefRaw: string): string | null {
  if (/^(https?:|mailto:|tel:)/.test(hrefRaw)) return null;
  const href = hrefRaw.split('#')[0].split('?')[0];
  if (href === '') return null;
  let path: string;
  if (href.startsWith('/')) path = href.slice(1);
  else {
    const parts = dir === '' ? [] : dir.split('/');
    for (const seg of href.split('/')) {
      if (seg === '..') parts.pop();
      else if (seg === '.' || seg === '') continue;
      else parts.push(seg);
    }
    path = parts.join('/');
  }
  const last = path.split('/').pop() ?? '';
  const isDir = href.endsWith('/') || path === '' || !last.includes('.');
  return isDir ? (path === '' ? 'index.html' : `${path}/index.html`) : path;
}

// ============================ structured desktop nav ============================

describe('structured navigation — markup & a11y', () => {
  it('every public page has a semantic nav with a labelled mobile toggle', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      expect(html, `${d}: <nav class="site-nav">`).toMatch(/<nav class="site-nav" aria-label="[^"]+"/);
      expect(html, `${d}: toggle button`).toMatch(/<button class="nav-toggle"[^>]*aria-label="[^"]+"/);
      expect(html, `${d}: toggle controls menu`).toMatch(/class="nav-toggle"[^>]*aria-controls="site-menu"/);
      expect(html, `${d}: menu list`).toContain('<ul class="nav-menu" id="site-menu">');
    }
  });

  it('every submenu button has aria-expanded + aria-controls pointing to its list', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      const btns = [...html.matchAll(/<button class="nav-sub-btn[^"]*" type="button" aria-expanded="false" aria-controls="([^"]+)">/g)].map(([, id]) => id);
      expect(btns.length, `${d}: three groups`).toBe(3);
      for (const id of btns) {
        expect(html, `${d}: <ul id=${id}>`).toContain(`<ul class="nav-sub" id="${id}">`);
      }
    }
  });

  it('has-js progressive-enhancement script and nav module are present', () => {
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      expect(html, `${d}: has-js`).toContain("document.documentElement.classList.add('has-js')");
      expect(html, `${d}: nav module`).toContain('src="/src/scripts/nav.ts"');
    }
  });

  it('every submenu link resolves to an existing page or a landing anchor', () => {
    const broken: string[] = [];
    for (const d of ALL_PUBLIC) {
      const html = read(file(d));
      const subHtml = html.match(/<ul class="nav-menu"[\s\S]*?<\/ul>\s*<\/nav>/)?.[0] ?? '';
      for (const [, href] of subHtml.matchAll(/<a href="([^"]+)"/g)) {
        if (href.startsWith('#')) {
          const id = href.slice(1);
          if (!html.includes(`id="${id}"`)) broken.push(`${d || '/'} anchor ${href}`);
          continue;
        }
        const p = resolveHref(d, href);
        if (p && !existsSync(resolve(root, p))) broken.push(`${d || '/'} -> ${href} (${p})`);
      }
    }
    expect(broken, `broken nav links:\n${broken.join('\n')}`).toEqual([]);
  });

  it('nav.ts handles Escape, drawer toggle and close-on-select', () => {
    const src = read('src/scripts/nav.ts');
    expect(src).toContain("e.key !== 'Escape'");
    expect(src).toContain("classList.toggle('open')");
    expect(src).toContain("aria-expanded");
    expect(src).toContain("closeDrawer");
    // no telemetry / storage / network in the nav module
    for (const bad of ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'document.cookie', 'AnalyticsSystem', 'gtag']) {
      expect(src, `nav.ts must not use ${bad}`).not.toContain(bad);
    }
  });
});

// ============================ table of contents ============================

describe('in-page table of contents', () => {
  const TOC_PAGES = ['', 'en', 'educazione', 'en/education', 'guida-ai-act', 'en/eu-ai-act-guide',
    'glossario', 'en/glossary', 'ai-act-per-docenti', 'en/ai-act-for-teachers'];

  it('TOC exists on all required long pages with an accessible label', () => {
    for (const d of TOC_PAGES) {
      const html = read(file(d));
      expect(html, `${d}: page-toc`).toMatch(/<nav class="page-toc" aria-label="(In questa pagina|In this page)"/);
      // the label is a <p>, not a heading (avoids duplicate headings)
      expect(html, `${d}: toc-label is not a heading`).toContain('<p class="toc-label">');
    }
  });

  it('every TOC link points to an existing section id on the same page', () => {
    const broken: string[] = [];
    for (const d of TOC_PAGES) {
      const html = read(file(d));
      const toc = html.match(/<nav class="page-toc"[\s\S]*?<\/nav>/)?.[0] ?? '';
      for (const [, id] of toc.matchAll(/href="#([^"]+)"/g)) {
        if (!html.includes(`id="${id}"`)) broken.push(`${d || '/'} -> #${id}`);
      }
      expect(toc.match(/href="#/g)?.length ?? 0, `${d}: has TOC items`).toBeGreaterThanOrEqual(2);
    }
    expect(broken, `TOC anchors missing:\n${broken.join('\n')}`).toEqual([]);
  });

  it('short pages do not get a TOC', () => {
    for (const d of ['ai-act-serious-game', 'en/faq', 'apprendimento-privacy-consapevole']) {
      expect(read(file(d)), `${d} should have no TOC`).not.toContain('class="page-toc"');
    }
  });
});

// ============================ visible breadcrumbs ============================

describe('visible breadcrumbs', () => {
  const CRUMB_PAGES = ['educazione', 'guida-ai-act', 'categorie-rischio-ai-act', 'pratiche-vietate-ai-act',
    'sistemi-ai-ad-alto-rischio', 'obblighi-trasparenza-ai-act', 'ai-generativa-e-gpai', 'glossario',
    'lezione-introduzione-ai-act', 'attivita-didattiche',
    'en/education', 'en/eu-ai-act-guide', 'en/ai-act-risk-categories', 'en/prohibited-ai-practices',
    'en/high-risk-ai-systems', 'en/transparency-obligations', 'en/general-purpose-ai', 'en/glossary',
    'en/lesson-plan-introduction-to-the-ai-act', 'en/lesson-plan-risk-based-approach',
    'en/lesson-plan-transparency-and-users', 'en/classroom-activities'];

  it('required page types have a visible breadcrumb nav (distinct from main nav)', () => {
    for (const d of CRUMB_PAGES) {
      const html = read(file(d));
      expect(html, `${d}: breadcrumbs`).toContain('<nav class="breadcrumbs" aria-label="Breadcrumb">');
      // last crumb marks the current page
      const bc = html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0] ?? '';
      expect(bc, `${d}: aria-current crumb`).toContain('aria-current="page"');
      // starts from the home crumb
      expect(bc, `${d}: home crumb`).toContain('>NO AI ACT<');
    }
  });

  it('visible breadcrumb trail length matches the BreadcrumbList JSON-LD', () => {
    for (const d of CRUMB_PAGES) {
      const html = read(file(d));
      const bc = html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0] ?? '';
      const visibleCount = (bc.match(/<li/g) ?? []).length;
      const ld = html.match(/"@type": "BreadcrumbList",\s*"itemListElement": (\[[\s\S]*?\])\s*\}/)?.[1] ?? '[]';
      const items = JSON.parse(ld);
      expect(items.length, `${d}: JSON-LD parses`).toBeGreaterThanOrEqual(2);
      expect(visibleCount, `${d}: visible == JSON-LD length`).toBe(items.length);
      // every JSON-LD item is a valid absolute URL on the site
      for (const it of items) expect(it.item.startsWith('https://www.no-ai-act.eu/')).toBe(true);
    }
  });

  it('breadcrumb links (non-current) resolve to existing pages', () => {
    const broken: string[] = [];
    for (const d of CRUMB_PAGES) {
      const html = read(file(d));
      const bc = html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0] ?? '';
      for (const [, href] of bc.matchAll(/<a href="([^"]+)"/g)) {
        const p = resolveHref(d, href);
        if (p && !existsSync(resolve(root, p))) broken.push(`${d} -> ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });
});

// ============================ game overlay grouping ============================

describe('game "Site & resources" overlay grouping', () => {
  it('SITE_LINKS covers Play/Education/Teachers/AI Act/Glossary/Privacy internally', () => {
    const concepts = read('src/game/data/concepts.ts');
    for (const p of ['../come-funziona/', '../educazione/', '../ai-act-per-docenti/', '../guida-ai-act/',
      '../glossario/', '../privacy-by-design/',
      '../en/how-it-works/', '../en/education/', '../en/ai-act-for-teachers/', '../en/eu-ai-act-guide/',
      '../en/glossary/', '../en/privacy-by-design/']) {
      expect(concepts, `SITE_LINKS ${p}`).toContain(`'${p}'`);
    }
    // no external URL in SITE_LINKS
    const block = concepts.slice(concepts.indexOf('SITE_LINKS'));
    expect(block).not.toMatch(/https?:\/\//);
  });

  it('overlay renders the grouped resources and stays internal + noopener', () => {
    const src = read('src/game/ui/SiteResourcesOverlay.ts').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    for (const key of ['ui.play', 'ui.hub', 'ui.teacher', 'ui.guide', 'ui.glossary', 'ui.privacy', 'ui.backToSite']) {
      expect(src, `overlay uses ${key}`).toContain(key);
    }
    expect(src).not.toMatch(/https?:\/\//);
    for (const call of src.match(/window\.open\([^)]*\)/g) ?? []) expect(call).toContain('noopener');
    expect(src).not.toContain('fetch(');
    expect(src).not.toContain('AnalyticsSystem');
  });

  it('i18n siteLinks block is complete in both languages', () => {
    for (const lang of ['it', 'en'] as const) {
      const src = read(`src/game/i18n/${lang}.ts`);
      const block = src.slice(src.indexOf('siteLinks: {'), src.indexOf('siteLinks: {') + 800);
      for (const k of ['button', 'title', 'intro', 'play', 'hub', 'teacher', 'guide', 'glossary', 'privacy', 'backToSite', 'close']) {
        expect(block, `${lang}.siteLinks.${k}`).toContain(`${k}:`);
      }
    }
  });
});

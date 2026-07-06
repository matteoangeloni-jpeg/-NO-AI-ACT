import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SITE = 'https://www.no-ai-act.eu/';

/** The 32 education-hub URLs added by the authority hub sprint. */
const IT_HUB = [
  'educazione', 'ai-act-per-docenti', 'alfabetizzazione-ai', 'guida-ai-act',
  'categorie-rischio-ai-act', 'pratiche-vietate-ai-act', 'sistemi-ai-ad-alto-rischio',
  'obblighi-trasparenza-ai-act', 'ai-generativa-e-gpai', 'apprendimento-privacy-consapevole',
  'serious-game-regolazione-ai', 'attivita-didattiche', 'lezione-introduzione-ai-act', 'glossario'
] as const;
const EN_HUB = [
  'en/education', 'en/ai-act-for-teachers', 'en/ai-literacy', 'en/eu-ai-act-guide',
  'en/ai-act-risk-categories', 'en/prohibited-ai-practices', 'en/high-risk-ai-systems',
  'en/transparency-obligations', 'en/general-purpose-ai', 'en/privacy-conscious-learning',
  'en/serious-games-for-ai-regulation', 'en/digital-citizenship-ai-regulation',
  'en/classroom-activities', 'en/lesson-plan-introduction-to-the-ai-act',
  'en/lesson-plan-risk-based-approach', 'en/lesson-plan-transparency-and-users',
  'en/glossary', 'en/faq'
] as const;
const HUB = [...IT_HUB, ...EN_HUB];

/** hreflang pairs (IT dir ⇄ EN dir); EN-only pages are self-referencing. */
const PAIRS: Record<string, string> = {
  'educazione': 'en/education',
  'ai-act-per-docenti': 'en/ai-act-for-teachers',
  'alfabetizzazione-ai': 'en/ai-literacy',
  'guida-ai-act': 'en/eu-ai-act-guide',
  'categorie-rischio-ai-act': 'en/ai-act-risk-categories',
  'pratiche-vietate-ai-act': 'en/prohibited-ai-practices',
  'sistemi-ai-ad-alto-rischio': 'en/high-risk-ai-systems',
  'obblighi-trasparenza-ai-act': 'en/transparency-obligations',
  'ai-generativa-e-gpai': 'en/general-purpose-ai',
  'apprendimento-privacy-consapevole': 'en/privacy-conscious-learning',
  'serious-game-regolazione-ai': 'en/serious-games-for-ai-regulation',
  'attivita-didattiche': 'en/classroom-activities',
  'lezione-introduzione-ai-act': 'en/lesson-plan-introduction-to-the-ai-act',
  'glossario': 'en/glossary'
};

/** All indexable public pages (dirs relative to root; '' = IT landing). */
const ALL_PUBLIC = ['', 'en',
  'come-funziona', 'per-docenti', 'ai-act-serious-game', 'privacy-by-design',
  'en/how-it-works', 'en/for-educators', 'en/ai-act-serious-game', 'en/privacy-by-design',
  ...HUB];

const file = (dir: string) => (dir === '' ? 'index.html' : `${dir}/index.html`);
const url = (dir: string) => (dir === '' ? SITE : `${SITE}${dir}/`);

describe('education hub — architecture', () => {
  it('at least 24 new public URLs exist (32 delivered)', () => {
    expect(HUB.length).toBeGreaterThanOrEqual(24);
    for (const d of HUB) expect(existsSync(resolve(root, file(d))), d).toBe(true);
  });

  it('every hub page is a vite build input', () => {
    const cfg = read('vite.config.ts');
    for (const d of HUB) expect(cfg, d).toContain(`'${d}/index.html'`);
  });

  it('child sitemaps contain exactly the public pages, /play/ and query strings excluded', () => {
    // /sitemap.xml is a sitemap index → the public URLs live in the language children.
    const it = read('public/sitemap-it.xml');
    const en = read('public/sitemap-en.xml');
    const locs = [it, en].flatMap((sm) => [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));
    expect(locs.length).toBe(ALL_PUBLIC.length);
    for (const d of ALL_PUBLIC) expect(locs, d).toContain(url(d));
    for (const sm of [read('public/sitemap.xml'), it, en]) expect(sm).not.toContain('/play/');
    for (const l of locs) {
      expect(l).not.toContain('?');
      expect(l.startsWith(SITE)).toBe(true);
    }
  });

  it('every public page is reachable within 2 clicks from its landing', () => {
    const links = (dir: string): string[] => {
      const html = read(file(dir));
      const out: string[] = [];
      for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
        if (href.startsWith('http') || href.startsWith('mailto')) continue;
        // resolve relative href against the page dir
        const base = dir === '' ? [] : dir.split('/');
        const parts = [...base];
        for (const seg of href.split('/')) {
          if (seg === '..') parts.pop();
          else if (seg === '.' || seg === '') continue;
          else parts.push(seg);
        }
        const target = parts.join('/');
        if (ALL_PUBLIC.includes(target as (typeof ALL_PUBLIC)[number])) out.push(target);
      }
      return out;
    };
    for (const [landing, universe] of [['', [...IT_HUB]], ['en', [...EN_HUB]]] as const) {
      const level1 = new Set(links(landing));
      const reach = new Set(level1);
      for (const l1 of level1) for (const l2 of links(l1)) reach.add(l2);
      for (const target of universe) {
        expect(reach.has(target), `${target} must be ≤2 clicks from /${landing}`).toBe(true);
      }
    }
  });

  it('no broken internal links anywhere in the public pages', () => {
    for (const dir of ALL_PUBLIC) {
      const html = read(file(dir));
      for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
        if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('/')) continue;
        const clean = href.split('?')[0];
        if (!clean.endsWith('/') && !clean.endsWith('.svg')) continue;
        const base = dir === '' ? [] : dir.split('/');
        const parts = [...base];
        for (const seg of clean.split('/')) {
          if (seg === '..') parts.pop();
          else if (seg === '.' || seg === '') continue;
          else parts.push(seg);
        }
        const target = parts.join('/');
        const candidate = target === '' ? 'index.html'
          : target.endsWith('.svg') ? target : `${target}/index.html`;
        expect(existsSync(resolve(root, candidate)), `${dir || '/'} -> ${href}`).toBe(true);
      }
    }
  });
});

describe('education hub — metadata', () => {
  for (const d of HUB) {
    it(`${d} has title, description, single H1, canonical, index robots`, () => {
      const html = read(file(d));
      expect(html).toMatch(/<title>[^<]{25,}<\/title>/);
      expect(html).toMatch(/<meta name="description" content="[^"]{60,}"/);
      expect([...html.matchAll(/<h1[^>]*>/g)].length).toBe(1);
      expect(html).toContain(`<link rel="canonical" href="${url(d)}"`);
      expect(html).toContain('name="robots" content="index, follow"');
    });
  }

  it('hreflang pairs cross-reference correctly', () => {
    for (const [it_, en] of Object.entries(PAIRS)) {
      const ith = read(file(it_));
      const enh = read(file(en));
      expect(ith).toContain(`hreflang="en" href="${url(en)}"`);
      expect(ith).toContain(`hreflang="it" href="${url(it_)}"`);
      expect(enh).toContain(`hreflang="it" href="${url(it_)}"`);
      expect(enh).toContain(`hreflang="en" href="${url(en)}"`);
      expect(ith).toContain('hreflang="x-default"');
    }
  });

  it('titles and H1 are unique across the hub', () => {
    const titles = new Set<string>();
    const h1s = new Set<string>();
    for (const d of HUB) {
      const html = read(file(d));
      const t = html.match(/<title>([^<]+)<\/title>/)![1];
      const h = html.match(/<h1[^>]*>([^<]+)<\/h1>/)![1];
      expect(titles.has(t), `duplicate title: ${t}`).toBe(false);
      expect(h1s.has(h), `duplicate h1: ${h}`).toBe(false);
      titles.add(t); h1s.add(h);
    }
  });
});

describe('education hub — content requirements', () => {
  it('glossaries contain all 27 required terms', () => {
    const requiredEn = ['AI Act', 'AI system', 'Artificial intelligence', 'Risk-based approach',
      'Prohibited AI practices', 'High-risk AI system', 'Transparency obligation',
      'General-purpose AI', 'Generative AI', 'AI literacy', 'Serious game', 'Privacy by design',
      'Human oversight', 'Data governance', 'Conformity assessment', 'Fundamental rights',
      'Fundamental rights impact', 'Accountability', 'Documentation', 'Risk management',
      'Provider', 'Deployer', 'User', 'Biometric identification', 'Emotion recognition',
      'Recommender system', 'Automated decision-making'];
    const en = read('en/glossary/index.html');
    for (const t of requiredEn) expect(en, t).toContain(`<dt><strong>${t}`);
    const it_ = read('glossario/index.html');
    expect([...it_.matchAll(/<dt>/g)].length).toBeGreaterThanOrEqual(27);
    for (const t of ['Deployer', 'Supervisione umana', 'IA generativa', 'Diritti fondamentali']) {
      expect(it_, t).toContain(t);
    }
  });

  it('the EN FAQ contains every required question', () => {
    const html = read('en/faq/index.html');
    for (const q of ['Is this an official EU tool?', 'Is this legal advice?', 'Is the game free?',
      'Can teachers use it in class?', 'Does it require registration?', 'Does it track players?',
      'What languages are available?', 'Does it cover the entire AI Act?',
      'Can it be used for compliance training?', 'Can it be used in university teaching?',
      'What should teachers do after students play?', 'How should the game be cited or shared?']) {
      expect(html, q).toContain(q);
    }
    // conservative answers: independence and no-compliance-tool stance
    expect(html).toContain('not affiliated with');
    expect(html).toContain('not a compliance tool');
  });

  it('lesson plans contain objectives, duration, flow and reflection', () => {
    for (const d of ['en/lesson-plan-introduction-to-the-ai-act', 'en/lesson-plan-risk-based-approach',
      'en/lesson-plan-transparency-and-users']) {
      const html = read(file(d));
      expect(html, d).toContain('Objectives');
      expect(html, d).toContain('Duration');
      expect(html, d).toContain('Lesson flow');
      expect(html, d).toMatch(/reflection/i);
    }
    const it_ = read('lezione-introduzione-ai-act/index.html');
    expect(it_).toContain('Obiettivi');
    expect(it_).toContain('Durata');
    expect(it_).toContain('Svolgimento');
    expect(it_).toMatch(/riflessione/i);
  });

  it('activity pages contain 5 activities with timing and teacher instructions', () => {
    for (const [d, marker, tmark] of [
      ['en/classroom-activities', 'Teacher instructions:', 'Time:'],
      ['attivita-didattiche', 'Istruzioni per il docente:', 'Tempo:']
    ] as const) {
      const html = read(file(d));
      expect([...html.matchAll(new RegExp(marker, 'g'))].length, d).toBeGreaterThanOrEqual(5);
      expect([...html.matchAll(new RegExp(tmark, 'g'))].length, d).toBeGreaterThanOrEqual(5);
    }
  });

  it('AI Act guides carry an explicit educational/non-legal disclaimer', () => {
    expect(read('en/eu-ai-act-guide/index.html')).toContain('Educational disclaimer');
    expect(read('guida-ai-act/index.html')).toContain('Avvertenza didattica');
  });

  it('no page claims to be an official EU tool or certified training', () => {
    for (const d of HUB) {
      const html = read(file(d)).toLowerCase();
      for (const bad of ['certified ai act', 'official ai act training', 'endorsed by the european',
        'officially recognised', 'compliance-ready', 'validated learning product', 'proven to teach']) {
        expect(html, `${d}: ${bad}`).not.toContain(bad);
      }
    }
  });

  it('section numbering is sequential on every hub page', () => {
    for (const d of HUB) {
      const nums = [...read(file(d)).matchAll(/class="num">(\d+)</g)].map(([, n]) => Number(n));
      expect(nums, d).toEqual(Array.from({ length: nums.length }, (_, i) => i + 1));
    }
  });
});

describe('education hub — structured data', () => {
  for (const d of HUB) {
    it(`${d} JSON-LD parses and uses no forbidden schema`, () => {
      const html = read(file(d));
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      for (const [, b] of blocks) expect(() => JSON.parse(b)).not.toThrow();
      for (const bad of ['"Review"', '"AggregateRating"', '"Product"', '"Course"', 'aggregateRating']) {
        expect(html, `${d}: ${bad}`).not.toContain(bad);
      }
    });
  }

  it('FAQPage schema exists only where a visible FAQ exists, and glossaries use DefinedTermSet', () => {
    expect(read('en/faq/index.html')).toContain('"FAQPage"');
    expect(read('en/glossary/index.html')).toContain('"DefinedTermSet"');
    expect(read('glossario/index.html')).toContain('"DefinedTermSet"');
    for (const d of ['en/education', 'educazione', 'en/eu-ai-act-guide', 'guida-ai-act']) {
      expect(read(file(d)), d).not.toContain('"FAQPage"');
    }
  });
});

describe('education hub — safeguards', () => {
  for (const d of HUB) {
    it(`${d} has no forms, no Tally embeds, no extra trackers`, () => {
      const html = read(file(d));
      expect(html).not.toContain('<form');
      expect(html).not.toContain('data-tally-open');
      expect(html).not.toContain('tally.so');
      expect(html).not.toMatch(/googletagmanager|google-analytics|gtag\(|dataLayer|facebook\.com\/tr|hotjar|plausible\.io|umami/);
      // the only CROSS-ORIGIN script is the pre-existing beacon; first-party
      // module scripts (e.g. the nav enhancement) are bundled by vite and allowed
      const srcs = [...html.matchAll(/<script[^>]*src=['"]([^'"]+)['"]/g)].map(([, s]) => s);
      const external = srcs.filter((s) => /^https?:\/\//.test(s));
      expect(external).toEqual(['https://static.cloudflareinsights.com/beacon.min.js']);
      for (const s of srcs) {
        if (!/^https?:\/\//.test(s)) expect(s.startsWith('/src/') || s.startsWith('/assets/'), s).toBe(true);
      }
    });
  }

  it('landings link to the six required hub pages prominently', () => {
    const it_ = read('index.html');
    for (const p of ['./educazione/', './ai-act-per-docenti/', './alfabetizzazione-ai/', './guida-ai-act/', './attivita-didattiche/', './glossario/']) {
      expect(it_, p).toContain(`href="${p}"`);
    }
    const en = read('en/index.html');
    for (const p of ['./education/', './ai-act-for-teachers/', './ai-literacy/', './eu-ai-act-guide/', './classroom-activities/', './glossary/']) {
      expect(en, p).toContain(`href="${p}"`);
    }
  });

  it('every pre-existing cluster page links to at least 3 hub pages', () => {
    const checks: Array<[string, string[]]> = [
      ['come-funziona/index.html', ['../educazione/', '../guida-ai-act/', '../attivita-didattiche/']],
      ['en/how-it-works/index.html', ['../education/', '../eu-ai-act-guide/', '../classroom-activities/']],
      ['per-docenti/index.html', ['../lezione-introduzione-ai-act/', '../attivita-didattiche/', '../ai-act-per-docenti/', '../glossario/']],
      ['en/for-educators/index.html', ['../lesson-plan-introduction-to-the-ai-act/', '../classroom-activities/', '../ai-act-for-teachers/', '../glossary/']],
      ['ai-act-serious-game/index.html', ['../serious-game-regolazione-ai/', '../categorie-rischio-ai-act/', '../guida-ai-act/']],
      ['en/ai-act-serious-game/index.html', ['../serious-games-for-ai-regulation/', '../ai-act-risk-categories/', '../eu-ai-act-guide/']],
      ['privacy-by-design/index.html', ['../apprendimento-privacy-consapevole/', '../educazione/', '../glossario/']],
      ['en/privacy-by-design/index.html', ['../privacy-conscious-learning/', '../education/', '../glossary/']]
    ];
    for (const [f, targets] of checks) {
      const html = read(f);
      for (const t of targets) expect(html, `${f} -> ${t}`).toContain(`href="${t}"`);
    }
  });

  it('llms.txt lists the hub grouped by intent with explicit limitations', () => {
    const llms = read('public/llms.txt');
    for (const heading of ['## Play', '## For teachers', '## AI literacy and method',
      '## EU AI Act guide', '## Classroom activities and lesson plans', '## Privacy', '## Glossary and FAQ']) {
      expect(llms).toContain(heading);
    }
    for (const line of ['NOT an official EU tool', 'NOT legal advice', 'NOT a compliance tool',
      'no account, no registration', 'No gameplay telemetry']) {
      expect(llms).toContain(line);
    }
    for (const d of ['en/education/', 'educazione/', 'en/glossary/', 'glossario/', 'en/faq/']) {
      expect(llms).toContain(SITE + d);
    }
  });
});

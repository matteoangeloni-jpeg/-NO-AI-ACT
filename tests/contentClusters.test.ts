import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * ORGANIC CONTENT CLUSTER GUARD (2.0 sprint).
 *
 * Four new IT⇄EN topic pairs (timeline, deepfakes, employment, classroom lab).
 * Pins: brief-before-page (docs/CONTENT_BRIEFS_2_0.md), the §9.6 credibility
 * block on every page (responsibility, first-published/last-reviewed dates,
 * official sources, disclaimer, related cases, teacher resources), factual
 * anchors (the real Art. 113 dates), the honest-validation statement on the
 * teacher-facing lab, and the absence of unsupported claims.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const PAIRS: Array<[string, string]> = [
  ['tempi-applicazione-ai-act', 'en/ai-act-application-timeline'],
  ['deepfake-e-trasparenza', 'en/deepfakes-and-transparency'],
  ['ai-nel-lavoro-e-selezione', 'en/ai-in-recruitment-and-employment'],
  ['laboratorio-ai-act-in-classe', 'en/ai-act-classroom-lab']
];
const ALL = PAIRS.flat();

describe('briefs exist before pages (mission §9.8)', () => {
  it('docs/CONTENT_BRIEFS_2_0.md covers all four topics with intent and cannibalization', () => {
    const briefs = read('docs/CONTENT_BRIEFS_2_0.md');
    for (const marker of ['/tempi-applicazione-ai-act/', '/deepfake-e-trasparenza/',
      '/ai-nel-lavoro-e-selezione/', '/laboratorio-ai-act-in-classe/',
      'User intent', 'Cannibalization', 'Official sources', 'Exclusions']) {
      expect(briefs, marker).toContain(marker);
    }
    // rejected candidates are documented, not silently dropped
    expect(briefs).toContain('Rejected for this release');
  });
});

describe('credibility block (§9.6) on every cluster page', () => {
  for (const d of ALL) {
    it(`${d} carries responsibility, dates, sources, disclaimer, cases, teacher links`, () => {
      const html = read(`${d}/index.html`);
      const en = d.startsWith('en/');
      expect(html).toContain(en ? 'Content responsibility' : 'Responsabilità del contenuto');
      expect(html).toContain(en ? 'First published' : 'Prima pubblicazione');
      expect(html).toContain(en ? 'Last reviewed' : 'Ultima revisione');
      expect(html).toContain('https://eur-lex.europa.eu/eli/reg/2024/1689/oj');
      expect(html).toContain('digital-strategy.ec.europa.eu');
      expect(html).toContain(en ? 'Related game cases' : 'Casi del gioco collegati');
      expect(html).toContain(en ? 'Related teacher resources' : 'Risorse per docenti collegate');
      expect(html.toLowerCase()).toMatch(/not legal advice|non è consulenza legale/);
      // no third-party legal review is claimed
      expect(html).toContain(en ? 'no third-party legal review' : 'senza revisione giuridica terza');
    });
  }
});

describe('factual anchors — law vs dates vs interpretation kept honest', () => {
  it('timeline pages carry the real Art. 113 staged dates', () => {
    const it_ = read('tempi-applicazione-ai-act/index.html');
    const en = read('en/ai-act-application-timeline/index.html');
    for (const [html, dates] of [
      [it_, ['1 agosto 2024', '2 febbraio 2025', '2 agosto 2025', '2 agosto 2026', '2 agosto 2027']],
      [en, ['1 August 2024', '2 February 2025', '2 August 2025', '2 August 2026', '2 August 2027']]
    ] as const) {
      for (const dt of dates) expect(html, dt).toContain(dt);
    }
    // application vs entry into force distinction is explicit
    expect(it_).toContain('Entrata in vigore ≠ applicazione');
    expect(en).toContain('Entry into force ≠ application');
    // review date is anchored, not an evergreen claim
    expect(it_).toContain('luglio 2026');
    expect(en).toContain('July 2026');
  });

  it('deepfake pages say the AI Act does NOT ban deepfakes and cite Art. 50', () => {
    expect(read('deepfake-e-trasparenza/index.html')).toContain('non vieta i deepfake');
    expect(read('en/deepfakes-and-transparency/index.html')).toContain('does not ban deepfakes');
    for (const d of ['deepfake-e-trasparenza', 'en/deepfakes-and-transparency']) {
      expect(read(`${d}/index.html`)).toMatch(/art(icolo|\.) 50|Article 50|Art\. 50/);
    }
  });

  it('employment pages separate prohibited from high-risk and name both actors', () => {
    const it_ = read('ai-nel-lavoro-e-selezione/index.html');
    const en = read('en/ai-in-recruitment-and-employment/index.html');
    expect(it_).toContain('Allegato III');
    expect(en).toContain('Annex III');
    for (const html of [it_, en]) {
      expect(html.toLowerCase()).toContain('provider');
      expect(html.toLowerCase()).toContain('deployer');
    }
  });

  it('the lab guide repeats the honest-validation statement and offers 30/60/90 paths', () => {
    const it_ = read('laboratorio-ai-act-in-classe/index.html');
    const en = read('en/ai-act-classroom-lab/index.html');
    expect(it_).toContain('non è ancora stata validata empiricamente');
    expect(en).toContain('has not yet been empirically validated');
    for (const [html, labels] of [
      [it_, ['30 minuti', '60 minuti', '90 minuti']],
      [en, ['30-minute', '60-minute', '90-minute']]
    ] as const) {
      for (const l of labels) expect(html, l).toContain(l);
    }
  });
});

describe('wiring and safeguards', () => {
  it('pages exist, are vite inputs, sitemap members and in the route config', () => {
    const vite = read('vite.config.ts');
    const routes = read('scripts/seo/routes.config.json');
    const sitemaps = read('public/sitemap-it.xml') + read('public/sitemap-en.xml');
    for (const d of ALL) {
      expect(existsSync(resolve(root, `${d}/index.html`)), d).toBe(true);
      expect(vite, d).toContain(`'${d}/index.html'`);
      expect(routes, d).toContain(`"${d}"`);
      expect(sitemaps, d).toContain(`https://www.no-ai-act.eu/${d}/</loc>`);
    }
  });

  it('no unsupported statistics or inflated claims', () => {
    for (const d of ALL) {
      const lower = read(`${d}/index.html`).toLowerCase();
      for (const bad of ['studies show', 'gli studi dimostrano', 'proven to teach', 'efficacia dimostrata',
        'award-winning', 'leader europeo', 'unique in europe', '% of students', '% degli studenti']) {
        expect(lower, `${d}: ${bad}`).not.toContain(bad);
      }
      expect(lower).not.toContain('<form');
      expect(lower).not.toContain('tally');
    }
  });

  it('IT/EN parity: same number of sections per pair', () => {
    for (const [it_, en] of PAIRS) {
      const c = (p: string) => (read(`${p}/index.html`).match(/class="num"/g) ?? []).length;
      expect(c(it_), `${it_} vs ${en}`).toBe(c(en));
    }
  });
});

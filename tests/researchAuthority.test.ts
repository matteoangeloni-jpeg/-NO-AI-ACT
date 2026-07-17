import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CASES } from '../src/game/data/cases';

/**
 * RESEARCH-AUTHORITY PACK GUARD.
 *
 * Pins the citation infrastructure (CITATION.cff + /come-citare/ + /en/how-to-cite/),
 * the research pages, the press kit and the printable teacher assets:
 *  - citation formats carry the CURRENT package.json version (no drift);
 *  - the honest validation statement ("not yet empirically validated") stays on
 *    every page that could be quoted by press or researchers;
 *  - no inflated/unverifiable claims sneak in;
 *  - the outreach docs stay owner-action-only and invent no contact data.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));
const SITE = 'https://www.no-ai-act.eu/';

const PAIRS: Array<[string, string]> = [
  ['come-citare', 'en/how-to-cite'],
  ['ricerca-e-metodologia', 'en/research-and-methodology'],
  ['press-kit', 'en/press-kit']
];
const ALL_NEW = PAIRS.flat();

describe('CITATION.cff — valid, honest, in sync', () => {
  const cff = read('CITATION.cff');

  it('carries the required CFF keys', () => {
    for (const key of ['cff-version:', 'message:', 'type: software', 'title:', 'abstract:',
      'authors:', 'version:', 'date-released:', 'repository-code:', 'url:', 'license: MIT', 'keywords:']) {
      expect(cff, key).toContain(key);
    }
    expect(cff).toContain('family-names: Angeloni');
    expect(cff).toContain('given-names: Matteo');
  });

  it('version equals package.json and the date is ISO-formatted', () => {
    expect(cff).toContain(`version: ${pkg.version}`);
    expect(cff).toMatch(/date-released: "\d{4}-\d{2}-\d{2}"/);
  });

  it('does not invent an ORCID or a DOI before one exists', () => {
    expect(cff).not.toContain('orcid');
    expect(cff).not.toMatch(/^doi:/m);
    expect(cff).not.toContain('10.5281/'); // Zenodo DOI prefix must not appear before archive
  });

  it('abstract states the honest validation status', () => {
    expect(cff).toContain('not yet been');
    expect(cff).toContain('empirically validated');
  });

  it('no .zenodo.json is committed (CITATION.cff is the single Zenodo metadata source)', () => {
    expect(existsSync(resolve(root, '.zenodo.json'))).toBe(false);
  });
});

describe('citation pages — formats present and version-synced', () => {
  const it_ = read('come-citare/index.html');
  const en = read('en/how-to-cite/index.html');

  it('APA citation carries the current version on both pages', () => {
    expect(it_).toContain(`(Versione ${pkg.version}) [Software]`);
    expect(en).toContain(`(Version ${pkg.version}) [Software]`);
  });

  it('BibTeX block present with the current version', () => {
    for (const html of [it_, en]) {
      expect(html).toContain('@software{angeloni_no_ai_act');
      expect(html).toContain(`version = {${pkg.version}}`);
    }
  });

  it('DOI is described as pending, never shown as existing', () => {
    expect(it_).toContain('non è ancora disponibile');
    expect(en).toContain('not yet available');
    for (const html of [it_, en]) expect(html).not.toContain('10.5281/');
  });

  it('links to CITATION.cff, releases and licences', () => {
    for (const html of [it_, en]) {
      expect(html).toContain('blob/main/CITATION.cff');
      expect(html).toContain('/releases');
      expect(html).toContain('blob/main/LICENSE');
    }
  });
});

describe('research pages — honest validation status and required content', () => {
  const it_ = read('ricerca-e-metodologia/index.html');
  const en = read('en/research-and-methodology/index.html');

  it('state that effectiveness is NOT yet empirically validated', () => {
    expect(it_).toContain('non è ancora stata validata empiricamente');
    expect(en).toContain('has not yet been empirically validated');
  });

  it('separate usability/engagement from learning', () => {
    expect(it_.toLowerCase()).toContain('usabilità');
    expect(it_.toLowerCase()).toContain('engagement');
    expect(en.toLowerCase()).toContain('usability');
    expect(en.toLowerCase()).toContain('engagement');
  });

  it('carry the legal-source matrix pointing to EUR-Lex', () => {
    for (const html of [it_, en]) {
      expect(html).toContain('table');
      expect(html).toContain('https://eur-lex.europa.eu/eli/reg/2024/1689/oj');
    }
  });

  it('offer a contact route without any embedded form', () => {
    for (const html of [it_, en]) {
      expect(html).toContain('github.com/matteoangeloni-jpeg/-NO-AI-ACT/issues');
      expect(html).not.toContain('<form');
      expect(html).not.toContain('mailto:');
    }
  });

  it('link the research validation framework in the repository', () => {
    for (const html of [it_, en]) {
      expect(html).toContain('docs/RESEARCH_VALIDATION_FRAMEWORK.md');
    }
  });
});

describe('press kit — accurate, versioned, no inflated claims', () => {
  const it_ = read('press-kit/index.html');
  const en = read('en/press-kit/index.html');

  it('factsheet shows the current version and the real case count', () => {
    for (const html of [it_, en]) {
      expect(html).toContain(`<td>v${pkg.version}</td>`);
      expect(html).toContain(`<td>${CASES.length}</td>`);
    }
  });

  it('image assets referenced by the press kit exist in the repo', () => {
    for (const html of [it_, en]) {
      for (const [, href] of html.matchAll(/href="(\/assets\/social\/[^"]+|\/favicon\.svg)"/g)) {
        const p = href === '/favicon.svg' ? 'favicon.svg' : `public${href}`;
        expect(existsSync(resolve(root, p)), href).toBe(true);
      }
      expect(html).toContain('/assets/social/no-ai-act-og.png');
    }
  });

  it('press kit repeats the honest validation status', () => {
    expect(it_).toContain('non è ancora stata validata empiricamente');
    expect(en).toContain('has not yet been empirically validated');
  });
});

describe('all six authority pages — wiring and safeguards', () => {
  it('exist, are vite build inputs and sitemap members', () => {
    const cfg = read('vite.config.ts');
    const sitemaps = read('public/sitemap-it.xml') + read('public/sitemap-en.xml');
    for (const d of ALL_NEW) {
      expect(existsSync(resolve(root, `${d}/index.html`)), d).toBe(true);
      expect(cfg, `vite input ${d}`).toContain(`'${d}/index.html'`);
      expect(sitemaps, `sitemap ${d}`).toContain(`<loc>${SITE}${d}/</loc>`);
    }
  });

  it('IT/EN pairs cross-reference via reciprocal hreflang + x-default', () => {
    for (const [itDir, enDir] of PAIRS) {
      const ith = read(`${itDir}/index.html`);
      const enh = read(`${enDir}/index.html`);
      expect(ith).toContain(`hreflang="it" href="${SITE}${itDir}/"`);
      expect(ith).toContain(`hreflang="en" href="${SITE}${enDir}/"`);
      expect(ith).toContain(`hreflang="x-default" href="${SITE}${itDir}/"`);
      expect(enh).toContain(`hreflang="it" href="${SITE}${itDir}/"`);
      expect(enh).toContain(`hreflang="en" href="${SITE}${enDir}/"`);
      expect(enh).toContain(`hreflang="x-default" href="${SITE}${itDir}/"`);
    }
  });

  it('social meta config covers every new page', () => {
    const cfg = JSON.parse(read('scripts/social/meta.config.json'));
    for (const d of ALL_NEW) expect(cfg.pageCategory[d], d).toBeDefined();
  });

  it('no inflated or unverifiable claims anywhere in the pack', () => {
    const docs = [...ALL_NEW.map((d) => read(`${d}/index.html`)),
      read('docs/DISTRIBUTION_SUBMISSION_PACK.md'), read('docs/OUTREACH_TARGETS.csv')];
    for (const text of docs) {
      const lower = text.toLowerCase();
      for (const bad of ['award-winning', 'pluripremiato', 'leader europeo', 'leading european',
        'unique in europe', 'unico in europa', 'proven to teach', 'efficacia dimostrata',
        'endorsed by', 'in partnership with', 'certified']) {
        expect(lower, `must not claim: ${bad}`).not.toContain(bad);
      }
    }
  });
});

describe('linkable teacher assets — printable worksheet, rubric, print CSS', () => {
  it('worksheet and rubric are on the classroom-activity pages in both languages', () => {
    const it_ = read('attivita-didattiche/index.html');
    const en = read('en/classroom-activities/index.html');
    expect(it_).toContain('Scheda di classificazione del rischio');
    expect(it_).toContain('Rubrica di discussione');
    expect(en).toContain('Risk-classification worksheet');
    expect(en).toContain('Discussion rubric');
  });

  it('landing.css ships an ink-friendly print stylesheet', () => {
    const css = read('src/styles/landing.css');
    expect(css).toContain('@media print');
    expect(css).toMatch(/@media print[\s\S]*\.topbar[\s\S]*display: none/);
  });
});

describe('outreach docs — owner-only actions, no invented contacts', () => {
  it('submission pack marks every platform as NOT submitted (until the owner acts)', () => {
    const pack = read('docs/DISTRIBUTION_SUBMISSION_PACK.md');
    expect(pack).toContain('manual OWNER');
    const statuses = [...pack.matchAll(/\*\*Status:\*\* ([^\n]+)/g)].map(([, s]) => s);
    expect(statuses.length).toBeGreaterThanOrEqual(5);
    for (const s of statuses) expect(s).toMatch(/NOT (submitted|archived)/);
  });

  it('outreach CSV contains no email addresses (none may be invented)', () => {
    const csv = read('docs/OUTREACH_TARGETS.csv');
    expect(csv).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
    // every populated row is still "not contacted"
    const rows = csv.trim().split('\n').slice(1);
    for (const row of rows) expect(row.toLowerCase()).toContain('not contacted');
  });
});

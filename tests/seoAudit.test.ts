import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
// Importing the audit module runs the full route analysis at collection time.
// @ts-expect-error — plain ESM script without type declarations
import { result, toCsv } from '../scripts/seo/audit-routes.mjs';

/**
 * SEO INDEXABILITY SYSTEM GUARD.
 *
 * scripts/seo/routes.config.json is the single source of truth for IT⇄EN route
 * pairs; scripts/seo/audit-routes.mjs derives the full indexability matrix from
 * it. This suite makes the audit a merge gate and pins the config to the real
 * sitemap inventory, so a route can never be added in one place only.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('scripts/seo/routes.config.json'));
const SITE = cfg.site as string;
const urlOf = (d: string) => (d === '' ? SITE : `${SITE}${d}/`);

describe('route audit — no critical indexability defects', () => {
  it('the audit reports zero critical defects', () => {
    expect(result.critical, result.critical.join('\n')).toEqual([]);
  });

  it('audits the full public universe (matches both sitemaps exactly)', () => {
    const locs = [read('public/sitemap-it.xml'), read('public/sitemap-en.xml')]
      .flatMap((sm) => [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));
    const audited = result.rows.map((r: { route: string }) => r.route);
    expect(new Set(audited)).toEqual(new Set(locs));
    expect(audited.length).toBe(locs.length);
  });

  it('every route row is indexable with a self canonical and one sitemap', () => {
    for (const r of result.rows) {
      expect(r.indexable, r.route).toBe('yes');
      expect(r.canonical, r.route).toBe('self');
      expect(r.sitemap, r.route).toMatch(/^sitemap-(it|en)$/);
      expect(r.brokenLinks, r.route).toBe(0);
    }
  });
});

describe('routes.config.json — the pair source of truth stays coherent', () => {
  it('every pair member exists and pair dirs are unique', () => {
    const dirs = [...cfg.pairs.flatMap((p: { it: string; en: string }) => [p.it, p.en]), ...cfg.enOnly];
    expect(new Set(dirs).size).toBe(dirs.length);
    for (const d of dirs) {
      const f = d === '' ? 'index.html' : `${d}/index.html`;
      expect(existsSync(resolve(root, f)), f).toBe(true);
    }
  });

  it('IT members are IT routes and EN members live under /en/', () => {
    for (const p of cfg.pairs) {
      expect(p.it === '' || !p.it.startsWith('en'), p.it).toBe(true);
      expect(p.en === 'en' || p.en.startsWith('en/'), p.en).toBe(true);
    }
    for (const d of cfg.enOnly) expect(d.startsWith('en/'), d).toBe(true);
  });

  it('x-default always points at the IT member (or self for en-only)', () => {
    for (const p of cfg.pairs) {
      for (const d of [p.it, p.en]) {
        const html = read(d === '' ? 'index.html' : `${d}/index.html`);
        expect(html, d).toContain(`hreflang="x-default" href="${urlOf(p.it)}"`);
      }
    }
    for (const d of cfg.enOnly) {
      const html = read(`${d}/index.html`);
      expect(html, d).toContain(`hreflang="x-default" href="${urlOf(d)}"`);
    }
  });

  it('no mixed-language navigation: the nav language toggle is the only cross-language nav link', () => {
    for (const p of cfg.pairs) {
      for (const [d, other] of [[p.it, p.en], [p.en, p.it]] as const) {
        const html = read(d === '' ? 'index.html' : `${d}/index.html`);
        const nav = html.slice(html.indexOf('class="site-nav"'), html.indexOf('</nav>'));
        const langLinks = [...nav.matchAll(/class="nav-lang"[^>]*hreflang="(it|en)"/g)];
        expect(langLinks.length, `${d}: one language toggle`).toBe(1);
        const expectLang = d === p.it ? 'en' : 'it';
        expect(langLinks[0][1], `${d}: toggle points to ${other}`).toBe(expectLang);
      }
    }
  });
});

describe('committed inventory CSV stays in sync with the audit', () => {
  it('docs/SEO_ROUTE_INVENTORY.csv matches a fresh audit (regenerate with npm run audit:seo -- --write)', () => {
    const committed = read('docs/SEO_ROUTE_INVENTORY.csv');
    // lastUpdate (git dates) naturally moves with commits — compare the stable columns.
    const stable = (csv: string) => csv.trim().split('\n')
      .map((line) => line.split(',').slice(0, 7).join(','));
    expect(stable(committed)).toEqual(stable(toCsv()));
  });
});

describe('CI wiring — the audit is a real merge gate', () => {
  it('package.json exposes audit:seo and the deploy workflow runs it', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts['audit:seo']).toBe('node scripts/seo/audit-routes.mjs');
    expect(read('.github/workflows/deploy.yml')).toContain('npm run audit:seo');
  });
});

describe('structured data hygiene (site-wide)', () => {
  it('no shipped page references the nonexistent /assets/logo.svg', () => {
    for (const r of result.rows) {
      const d = r.route.slice(SITE.length).replace(/\/$/, '');
      const html = read(d === '' ? 'index.html' : `${d}/index.html`);
      expect(html, r.route).not.toContain('assets/logo.svg');
    }
    expect(existsSync(resolve(root, 'favicon.svg'))).toBe(true);
  });
});

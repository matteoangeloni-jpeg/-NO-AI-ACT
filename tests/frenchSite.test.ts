import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, serialize } from 'parse5';
// @ts-expect-error Local ESM build helper.
import { translations, translatedPages } from '../scripts/site/fr-translations.mjs';
// @ts-expect-error Local ESM build helper.
import { walk, sourceMain, translateMain } from '../scripts/site/translation-blocks.mjs';
import { LOCALES } from '../src/game/i18n';
import { INVENTORY_DIRS } from './lib-inventory';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('scripts/seo/routes.config.json'));
const french = INVENTORY_DIRS.filter(d => d === 'fr' || d.startsWith('fr/'));
const attr = (n: any, name: string) => n.attrs?.find((a: any) => a.name === name)?.value;
const nodes = (html: string) => { const out: any[] = []; walk(parse(html), (n: any) => out.push(n)); return out; };

describe('French publication candidate', () => {
  it('covers all 37 English routes, including four without an Italian counterpart', () => {
    expect(french).toHaveLength(37);
    expect(new Set(INVENTORY_DIRS).size).toBe(107);
    expect(translations).toHaveLength(24);
    expect(Object.keys(cfg.frForEn).sort()).toEqual([...cfg.enOnly].sort());
  });

  it('preserves every source block and rejects stale translations', () => {
    const generated = translatedPages(cfg);
    expect(generated).toHaveLength(24);
    for (const p of generated) {
      const actual = read(`fr/${p.slug}/index.html`);
      expect(serialize(sourceMain(actual))).toBe(serialize(sourceMain(p.main)));
      const source = read(`${p.en}index.html`);
      expect(() => translateMain(source, { ...p, sourceHash: 'stale' }, (s: string) => s)).toThrow('Source changed');
      expect(() => translateMain(source, { ...p, blocks: [] }, (s: string) => s)).toThrow('Missing blocks');
    }
  });

  it('keeps headings, lists, tables, images and source references', () => {
    for (const p of translatedPages(cfg)) {
      const src = nodes(`<body>${serialize(sourceMain(read(`${p.en}index.html`)))}</body>`);
      const dst = nodes(p.main);
      for (const tag of ['h1', 'h2', 'h3', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'img']) {
        expect(dst.filter(n => n.tagName === tag).length, `${p.en}: ${tag}`).toBe(src.filter(n => n.tagName === tag).length);
      }
      for (const n of src.filter(n => n.tagName === 'a' && /^https?:/.test(attr(n, 'href')))) {
        const url = attr(n, 'href').replace('/oj/eng', '/oj/fra');
        expect(dst.some(n => attr(n, 'href') === url), `${p.en}: reference ${url}`).toBe(true);
      }
    }
  });

  it('has reciprocal alternates for all language groups', () => {
    for (const group of [...cfg.pairs, ...cfg.enOnly.map((en: string) => ({ en, fr: cfg.frForEn[en] }))]) {
      for (const dir of Object.values(group) as string[]) {
        const all = nodes(read(dir ? `${dir}/index.html` : 'index.html'));
        for (const [lang, altDir] of Object.entries(group)) {
          const url = `${cfg.site}${altDir ? `${altDir}/` : ''}`;
          expect(all.some(n => n.tagName === 'link' && attr(n, 'hreflang') === lang && attr(n, 'href') === url), `${dir} -> ${lang}`).toBe(true);
        }
      }
    }
  });

  it('has no involuntary language exit, broken internal link, anchor or asset', () => {
    for (const dir of french) {
      const all = nodes(read(`${dir}/index.html`));
      for (const n of all.filter(n => ['a', 'img'].includes(n.tagName))) {
        const href = attr(n, n.tagName === 'a' ? 'href' : 'src');
        if (!href || /^(mailto:|tel:|data:)/.test(href)) continue;
        const url = new URL(href, `${cfg.site}${dir}/`);
        if (url.origin !== new URL(cfg.site).origin) continue;
        const path = decodeURIComponent(url.pathname).slice(1);
        if (n.tagName === 'a' && !attr(n, 'hreflang') && (path.endsWith('/') || !path.includes('.'))) {
          expect(path === 'fr/' || path.startsWith('fr/') || path === 'play/', `${dir}: language exit ${href}`).toBe(true);
          if (path === 'play/') expect(url.searchParams.get('lang'), `${dir}: ${href}`).toBe('fr');
        }
        const file = path.endsWith('/') ? `${path}index.html` : path;
        expect(existsSync(resolve(root, file)) || existsSync(resolve(root, 'public', file)), `${dir}: missing ${href}`).toBe(true);
        if (url.hash && file.endsWith('.html')) {
          const targets = nodes(read(file));
          expect(targets.some(t => attr(t, 'id') === decodeURIComponent(url.hash.slice(1))), `${dir}: anchor ${href}`).toBe(true);
        }
      }
    }
  });
});

function leaves(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') return { [path]: value };
  return Object.assign({}, ...Object.entries(value as object).map(([k, v]) => leaves(v, `${path}.${k}`)));
}
describe('French game dictionary', () => {
  it('matches every Italian leaf and interpolation, including array entries', () => {
    const source = leaves(LOCALES.it);
    const target = leaves(LOCALES.fr);
    expect(Object.keys(target).sort()).toEqual(Object.keys(source).sort());
    expect(Object.keys(target)).toHaveLength(1408);
    for (const [key, text] of Object.entries(target)) {
      expect(text.trim(), key).not.toBe('');
      expect((text.match(/\{\w+\}/g) ?? []).sort(), key).toEqual((source[key].match(/\{\w+\}/g) ?? []).sort());
    }
  });
});

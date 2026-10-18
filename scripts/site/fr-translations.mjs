import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { translateMain } from './translation-blocks.mjs';

const root = new URL('../../', import.meta.url);
export const translations = readdirSync(new URL('src/site/fr/', root)).filter(f => f.endsWith('.json')).sort()
  .map(f => JSON.parse(readFileSync(new URL(`src/site/fr/${f}`, root), 'utf8')));

export function translatedPages(cfg) {
  const mapping = new Map();
  for (const p of cfg.pairs) if (p.fr) for (const dir of [p.it, p.en]) mapping.set(dir, p.fr);
  for (const [en, fr] of Object.entries(cfg.frForEn ?? {})) mapping.set(en, fr);
  return translations.map(t => {
    const pair = cfg.pairs.find(p => p.en === t.en);
    const rewrite = value => {
      if (/^(#|mailto:|tel:|data:)/.test(value)) return value;
      const url = new URL(value, `${cfg.site}${t.en}/`);
      if (url.origin !== new URL(cfg.site).origin) {
        return value.replace(/(eur-lex\.europa\.eu\/eli\/reg\/[^?#]+\/oj)\/eng/, '$1/fra');
      }
      const dir = url.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (mapping.has(dir)) url.pathname = `/${mapping.get(dir)}/`;
      if (dir === 'play') url.searchParams.set('lang', 'fr');
      return `${url.pathname}${url.search}${url.hash}`;
    };
    return {
      ...t, it: pair ? (pair.it ? `${pair.it}/` : '') : null, en: `${t.en}/`,
      ogTitle: t.title, ogDescription: t.description,
      breadcrumb: t.title.replace(/\s*\| NO AI ACT$/, ''),
      main: translateMain(readFileSync(fileURLToPath(new URL(`${t.en}/index.html`, root)), 'utf8'), t, rewrite)
    };
  });
}

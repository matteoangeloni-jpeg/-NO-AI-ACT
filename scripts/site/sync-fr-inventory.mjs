import { readFileSync, writeFileSync } from 'node:fs';
import { translations } from './fr-translations.mjs';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const save = (path, value) => writeFileSync(new URL(path, root), value);
const cfg = JSON.parse(read('scripts/seo/routes.config.json'));
const social = JSON.parse(read('scripts/social/meta.config.json'));
cfg.frForEn = {};
cfg.$comment = 'Public routes. pairs contains IT/EN/FR groups; enOnly has no IT counterpart, with optional French counterpart in frForEn. English is x-default for those groups. /play/ is noindex.';
for (const t of translations) {
  const pair = cfg.pairs.find(p => p.en === t.en);
  const fr = `fr/${t.slug}`;
  if (pair) pair.fr = fr;
  else if (cfg.enOnly.includes(t.en)) cfg.frForEn[t.en] = fr;
  else throw new Error(`Unknown source route ${t.en}`);
  social.pageCategory[fr] = social.pageCategory[t.en];
  if (!social.pageCategory[fr]) throw new Error(`Missing social category ${t.en}`);
}
save('scripts/seo/routes.config.json', JSON.stringify(cfg, null, 2) + '\n');
save('scripts/social/meta.config.json', JSON.stringify(social, null, 2) + '\n');
// Insert only the new alternate in existing source pages; leave editorial HTML untouched.
for (const group of [...cfg.pairs, ...cfg.enOnly.map(en => ({ en, fr: cfg.frForEn[en] }))]) {
  if (!group.fr) continue;
  for (const dir of [group.it, group.en].filter(d => d !== undefined)) {
    const path = dir ? `${dir}/index.html` : 'index.html';
    let html = read(path);
    if (!/<link[^>]+hreflang="fr"/.test(html)) {
      html = html.replace(/(\s*<link rel="alternate" hreflang="x-default")/, `\n  <link rel="alternate" hreflang="fr" href="${cfg.site}${group.fr}/" />$1`);
      save(path, html);
    }
  }
}
const french = [...cfg.pairs.map(p => p.fr).filter(Boolean), ...Object.values(cfg.frForEn)];
const previous = read('public/sitemap-fr.xml');
const dates = new Map([...previous.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(m => [m[1], m[2]]));
const today = new Date().toISOString().slice(0, 10);
save('public/sitemap-fr.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${french.map(d => {const url = `${cfg.site}${d}/`; return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${dates.get(url) ?? today}</lastmod>\n  </url>`;}).join('\n')}\n</urlset>\n`);
const release = JSON.parse(read('release.config.json'));
release.languages = ['it', 'en', 'fr'];
release.publicUrls.fr = french.length;
release.publicUrls.total = release.publicUrls.it + release.publicUrls.en + french.length;
save('release.config.json', JSON.stringify(release, null, 2) + '\n');
console.log(`Inventory synchronized: ${french.length} FR pages.`);

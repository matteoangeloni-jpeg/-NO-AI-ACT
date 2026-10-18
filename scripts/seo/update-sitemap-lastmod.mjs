/**
 * Stamp truthful <lastmod> dates on every sitemap URL.
 *
 * Google uses lastmod for crawl scheduling only when it is consistently
 * accurate, so the date is DERIVED, never invented: for each sitemap URL the
 * value is the last git commit date of the page's source file (or today when
 * the file has uncommitted changes, i.e. this run is part of a change being
 * committed). The sitemap index's <lastmod> becomes the max of each child's
 * dates. Run whenever shipped pages change:
 *
 *   node scripts/seo/update-sitemap-lastmod.mjs
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { publishedLanguages } from '../../src/site/route-inventory.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://www.no-ai-act.eu/';
const today = new Date().toISOString().slice(0, 10);

const fileOf = (loc) => `${loc.slice(SITE.length)}index.html`;

const lastmodOf = (file) => {
  const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: root }).toString().trim();
  if (dirty) return today;
  const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root }).toString().trim();
  return d || today;
};

const stamp = (sitemapPath) => {
  let xml = readFileSync(resolve(root, sitemapPath), 'utf8');
  let max = '0000-00-00';
  xml = xml.replace(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>[^<]*<\/lastmod>)?\s*<\/url>/g, (_, loc) => {
    const d = lastmodOf(fileOf(loc));
    if (d > max) max = d;
    return `<url>\n    <loc>${loc}</loc>\n    <lastmod>${d}</lastmod>\n  </url>`;
  });
  writeFileSync(resolve(root, sitemapPath), xml);
  return max;
};

const cfg = JSON.parse(readFileSync(resolve(root, 'scripts/seo/routes.config.json'), 'utf8'));
const stamps = publishedLanguages(cfg).map(lang => [lang, stamp(`public/sitemap-${lang}.xml`)]);
const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${stamps.map(([lang, date]) => `  <sitemap>\n    <loc>${SITE}sitemap-${lang}.xml</loc>\n    <lastmod>${date}</lastmod>\n  </sitemap>`).join('\n')}\n</sitemapindex>\n`;
writeFileSync(resolve(root, 'public/sitemap.xml'), index);
console.log(`sitemap lastmod stamped: ${stamps.map(([lang, date]) => `${lang}: ${date}`).join(', ')}`);

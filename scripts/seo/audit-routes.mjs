/**
 * SEO indexability audit — builds a full matrix of every public route and
 * fails (exit 1) on critical defects. Run locally or in CI:
 *
 *   npm run audit:seo            # audit + print summary, exit 1 on defects
 *   npm run audit:seo -- --write # also (re)generate docs/SEO_ROUTE_INVENTORY.csv
 *
 * The route universe comes from scripts/seo/routes.config.json (single source
 * of truth for IT⇄EN pairs). For every route the matrix reports: language,
 * existence, indexability, robots meta, canonical, alternate URL, hreflang,
 * x-default, sitemap membership, title, meta description, H1 count, word
 * count, structured-data types, inbound/outbound internal links, orphan
 * status, broken links, image alt coverage and last meaningful update
 * (git commit date of the page file, when git is available).
 *
 * CRITICAL (fails CI): missing page, noindex/missing robots on a public page,
 * canonical missing or != sitemap URL, hreflang trio broken or non-reciprocal,
 * wrong/missing sitemap membership, duplicate title/description, H1 count != 1,
 * broken internal link, orphan page, unparsable JSON-LD, forbidden schema
 * types, /play/ leaking into sitemaps or becoming indexable.
 * WARNING ONLY (never fails CI): short word count — some pages are
 * intentionally brief when their purpose requires it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('scripts/seo/routes.config.json'));
const SITE = cfg.site;

const FORBIDDEN_SCHEMA = ['Review', 'AggregateRating', 'Product', 'Course'];

const routes = [];
for (const { it, en } of cfg.pairs) {
  routes.push({ dir: it, lang: 'it', alt: en, xDefault: it });
  routes.push({ dir: en, lang: 'en', alt: it, xDefault: it });
}
for (const dir of cfg.enOnly) {
  routes.push({ dir, lang: 'en', alt: null, xDefault: dir });
}

const fileOf = (dir) => (dir === '' ? 'index.html' : `${dir}/index.html`);
const urlOf = (dir) => (dir === '' ? SITE : `${SITE}${dir}/`);
const dirSet = new Set(routes.map((r) => r.dir));

// --- sitemap membership -----------------------------------------------------
const smIt = read('public/sitemap-it.xml');
const smEn = read('public/sitemap-en.xml');
const locsIt = new Set([...smIt.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));
const locsEn = new Set([...smEn.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));

// --- helpers ----------------------------------------------------------------
function resolveHref(dir, hrefRaw) {
  if (/^(https?:|mailto:|tel:|#)/.test(hrefRaw)) return null;
  const href = hrefRaw.split('#')[0].split('?')[0];
  if (href === '') return null;
  let path;
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
const toDir = (p) => (p === 'index.html' ? '' : p?.endsWith('/index.html') ? p.slice(0, -'/index.html'.length) : null);

function gitDate(file) {
  try {
    return execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim() || 'n/a';
  } catch { return 'n/a'; }
}

// --- per-route analysis -----------------------------------------------------
const critical = [];
const warnings = [];

// every sitemap URL must carry a plausible lastmod (Google uses it for crawl
// scheduling only when consistently accurate — see update-sitemap-lastmod.mjs)
for (const [name, xml, locs] of [['sitemap-it', smIt, locsIt], ['sitemap-en', smEn, locsEn]]) {
  const stamped = (xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length;
  if (stamped !== locs.size) {
    critical.push(`${name}.xml: ${stamped}/${locs.size} URLs have a valid <lastmod> (run scripts/seo/update-sitemap-lastmod.mjs)`);
  }
}
const rows = [];
const inbound = new Map(); // dir -> Set(sources)
const titles = new Map();
const descs = new Map();

const pages = new Map();
for (const r of routes) {
  if (!existsSync(resolve(root, fileOf(r.dir)))) { critical.push(`${r.dir || '/'}: page file missing`); continue; }
  pages.set(r.dir, read(fileOf(r.dir)));
}

// inbound links (within the public universe)
for (const [dir, html] of pages) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const t = toDir(resolveHref(dir, href));
    if (t !== null && t !== dir && dirSet.has(t)) {
      (inbound.get(t) ?? inbound.set(t, new Set()).get(t)).add(dir);
    }
  }
}

for (const r of routes) {
  const html = pages.get(r.dir);
  if (!html) continue;
  const label = r.dir || '/';
  const url = urlOf(r.dir);

  // language + robots + canonical
  const langAttr = html.match(/<html lang="([a-z]{2})">/)?.[1] ?? '';
  if (langAttr !== r.lang) critical.push(`${label}: <html lang> is "${langAttr}", expected "${r.lang}"`);
  const indexable = html.includes('name="robots" content="index, follow, max-image-preview:large"');
  if (!indexable) critical.push(`${label}: missing "index, follow, max-image-preview:large" robots meta`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  if (canonical !== url) critical.push(`${label}: canonical "${canonical}" != "${url}"`);

  // hreflang trio (reciprocity is guaranteed by deriving both sides from cfg)
  const itUrl = r.alt === null ? url : urlOf(r.lang === 'it' ? r.dir : r.alt);
  const enUrl = r.alt === null ? url : urlOf(r.lang === 'en' ? r.dir : r.alt);
  const xUrl = urlOf(r.xDefault);
  const hasIt = r.alt === null ? true : html.includes(`hreflang="it" href="${itUrl}"`);
  const hasEn = html.includes(`hreflang="en" href="${enUrl}"`);
  const hasX = html.includes(`hreflang="x-default" href="${xUrl}"`);
  if (!hasIt) critical.push(`${label}: missing hreflang="it" -> ${itUrl}`);
  if (!hasEn) critical.push(`${label}: missing hreflang="en" -> ${enUrl}`);
  if (!hasX) critical.push(`${label}: missing hreflang="x-default" -> ${xUrl}`);
  if (r.alt !== null && !existsSync(resolve(root, fileOf(r.alt)))) {
    critical.push(`${label}: alternate ${r.alt || '/'} does not exist`);
  }

  // sitemap membership: exactly one, the right one
  const inIt = locsIt.has(url);
  const inEn = locsEn.has(url);
  if (r.lang === 'it' && (!inIt || inEn)) critical.push(`${label}: must be in sitemap-it only (it:${inIt} en:${inEn})`);
  if (r.lang === 'en' && (!inEn || inIt)) critical.push(`${label}: must be in sitemap-en only (it:${inIt} en:${inEn})`);

  // head content
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
  const desc = html.match(/name="description" content="([^"]+)"/)?.[1] ?? '';
  if (title.length < 15) critical.push(`${label}: missing/short <title>`);
  if (title.length > 65) critical.push(`${label}: <title> ${title.length}ch (Google truncates ~60; keep <=65)`);
  if (desc.length < 50) critical.push(`${label}: missing/short meta description`);
  if (desc.length > 165) critical.push(`${label}: meta description ${desc.length}ch (SERP truncates ~155; keep <=165)`);
  if (titles.has(title)) critical.push(`${label}: duplicate title with ${titles.get(title)}`);
  if (descs.has(desc)) critical.push(`${label}: duplicate description with ${descs.get(desc)}`);
  titles.set(title, label); descs.set(desc, label);

  // body structure
  const h1Count = (html.match(/<h1[^>]*>/g) ?? []).length;
  if (h1Count !== 1) critical.push(`${label}: ${h1Count} H1 elements (want 1)`);
  const bodyText = (html.split(/<body[^>]*>/)[1] ?? '')
    .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').length : 0;
  if (wordCount < 150) warnings.push(`${label}: only ${wordCount} words (intentional brevity is allowed)`);

  // structured data
  const ldTypes = [];
  for (const [, block] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(block);
      ldTypes.push(...(Array.isArray(parsed) ? parsed : [parsed]).map((d) => d['@type']).filter(Boolean));
    } catch { critical.push(`${label}: unparsable JSON-LD block`); }
  }
  for (const t of ldTypes) if (FORBIDDEN_SCHEMA.includes(t)) critical.push(`${label}: forbidden schema type ${t}`);

  // links
  let outbound = 0;
  const broken = [];
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const p = resolveHref(r.dir, href);
    if (!p) continue;
    const t = toDir(p);
    if (t !== null && dirSet.has(t) && t !== r.dir) outbound++;
    // public/* is served from the site root in the built output
    if (!existsSync(resolve(root, p)) && !existsSync(resolve(root, 'public', p))) {
      broken.push(href);
    }
  }
  for (const b of broken) critical.push(`${label}: broken internal link ${b}`);

  // orphan: landings are entry points, everything else needs >=1 inbound link
  const inboundCount = inbound.get(r.dir)?.size ?? 0;
  const isLanding = r.dir === '' || r.dir === 'en';
  if (!isLanding && inboundCount === 0) critical.push(`${label}: orphan page (no inbound internal links)`);

  // images
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(([m]) => m);
  const imgsWithAlt = imgs.filter((m) => /\balt="/.test(m)).length;
  if (imgs.length > imgsWithAlt) critical.push(`${label}: ${imgs.length - imgsWithAlt} images without alt`);

  rows.push({
    route: url, lang: r.lang, pair: r.alt === null ? '(en-only)' : urlOf(r.alt),
    indexable: indexable ? 'yes' : 'NO', canonical: canonical === url ? 'self' : canonical,
    hreflang: `${hasIt ? 'it' : '-'}/${hasEn ? 'en' : '-'}/${hasX ? 'x' : '-'}`,
    sitemap: inIt ? 'sitemap-it' : inEn ? 'sitemap-en' : 'MISSING',
    titleLen: title.length, descLen: desc.length, h1: h1Count, words: wordCount,
    ldTypes: ldTypes.join('+') || '-', inbound: inboundCount, outbound,
    brokenLinks: broken.length, images: imgs.length, imagesWithAlt: imgsWithAlt,
    lastUpdate: gitDate(fileOf(r.dir))
  });
}

// --- global guards ----------------------------------------------------------
const play = read('play/index.html');
if (!play.includes('content="noindex, follow"')) critical.push('/play/: lost its noindex, follow');
for (const [name, sm] of [['sitemap.xml', read('public/sitemap.xml')], ['sitemap-it.xml', smIt], ['sitemap-en.xml', smEn]]) {
  if (sm.includes('/play/')) critical.push(`${name}: contains /play/`);
}
const expected = new Set(routes.map((r) => urlOf(r.dir)));
for (const l of [...locsIt, ...locsEn]) {
  if (!expected.has(l)) critical.push(`sitemap contains unknown route ${l} (add it to routes.config.json or remove it)`);
}
if (locsIt.size + locsEn.size !== routes.length) {
  critical.push(`sitemap total ${locsIt.size + locsEn.size} != ${routes.length} configured routes`);
}

// --- output -----------------------------------------------------------------
const HEADERS = ['route', 'lang', 'pair', 'indexable', 'canonical', 'hreflang', 'sitemap',
  'titleLen', 'descLen', 'h1', 'words', 'ldTypes', 'inbound', 'outbound',
  'brokenLinks', 'images', 'imagesWithAlt', 'lastUpdate'];
export function toCsv() {
  const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [HEADERS.join(','), ...rows.map((r) => HEADERS.map((h) => esc(r[h])).join(','))].join('\n') + '\n';
}
export const result = { rows, critical, warnings };

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  console.log(`--- SEO route audit: ${rows.length} routes (${rows.filter((r) => r.lang === 'it').length} IT + ${rows.filter((r) => r.lang === 'en').length} EN) ---`);
  if (process.argv.includes('--write')) {
    writeFileSync(resolve(root, 'docs/SEO_ROUTE_INVENTORY.csv'), toCsv());
    console.log('wrote docs/SEO_ROUTE_INVENTORY.csv');
  }
  for (const w of warnings) console.log(`  warn: ${w}`);
  if (critical.length) {
    console.error(`\nFAIL — ${critical.length} critical defect(s):`);
    for (const c of critical) console.error(`  ✗ ${c}`);
    process.exit(1);
  }
  console.log(`\nPASS — no critical indexability defects (${warnings.length} warnings).`);
}

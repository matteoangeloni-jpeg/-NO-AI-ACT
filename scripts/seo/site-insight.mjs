/**
 * Site insight report — what you can know about your own site WITHOUT tracking
 * a single visitor.
 *
 * `audit:seo` already computes the internal link graph, content depth and
 * orphan status, but it is a pass/fail gate: when everything is green it
 * prints "PASS" and throws all of that away. This script surfaces the same
 * structural facts as a readable report, so the questions you would otherwise
 * try to answer with a third-party analytics SDK ("which pages are weakly
 * supported?", "where does link equity actually flow?", "which pages are
 * thin?") get answered from the repository itself.
 *
 * Complements — never replaces — the two visitor-side sources already in
 * place: Cloudflare Web Analytics (cookie-free, aggregate) and Google Search
 * Console. See docs/SITE_INSIGHT.md for how to read the three together.
 *
 * Adds nothing to the shipped site: no host, no script, no cookie.
 *
 *   node scripts/seo/site-insight.mjs
 *   node scripts/seo/site-insight.mjs --json     # machine-readable
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('scripts/seo/routes.config.json'));
const asJson = process.argv.includes('--json');

const routes = [];
for (const { it, en } of cfg.pairs) {
  routes.push({ dir: it, lang: 'it', alt: en });
  routes.push({ dir: en, lang: 'en', alt: it });
}
for (const dir of cfg.enOnly) routes.push({ dir, lang: 'en', alt: null });

const fileOf = (dir) => (dir === '' ? 'index.html' : `${dir}/index.html`);
const dirSet = new Set(routes.map((r) => r.dir));

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

// --- build the graph --------------------------------------------------------
const pages = new Map();
for (const r of routes) pages.set(r.dir, read(fileOf(r.dir)));

const inbound = new Map();
const outbound = new Map();
for (const [dir, html] of pages) {
  const targets = new Set();
  // nav/footer links appear on every page: count them once, and separately
  // from links inside <main>, which are the editorial ones that carry intent
  const main = html.split('<main')[1]?.split('</main>')[0] ?? '';
  const editorial = new Set();
  for (const [, href] of main.matchAll(/href="([^"]+)"/g)) {
    const t = toDir(resolveHref(dir, href));
    if (t !== null && t !== dir && dirSet.has(t)) editorial.add(t);
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const t = toDir(resolveHref(dir, href));
    if (t !== null && t !== dir && dirSet.has(t)) targets.add(t);
  }
  outbound.set(dir, { all: targets, editorial });
  for (const t of editorial) {
    if (!inbound.has(t)) inbound.set(t, new Set());
    inbound.get(t).add(dir);
  }
}

const stats = routes.map((r) => {
  const html = pages.get(r.dir);
  const body = (html.split(/<body[^>]*>/)[1] ?? '')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    dir: r.dir,
    label: r.dir || '/',
    lang: r.lang,
    hasCounterpart: r.alt !== null,
    words: body ? body.split(' ').length : 0,
    editorialIn: inbound.get(r.dir)?.size ?? 0,
    editorialOut: outbound.get(r.dir).editorial.size,
    title: html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  };
});

if (asJson) {
  console.log(JSON.stringify({ generated: new Date().toISOString().slice(0, 10), pages: stats }, null, 2));
  process.exit(0);
}

// --- report -----------------------------------------------------------------
const row = (s) => `  ${String(s.editorialIn).padStart(2)} in · ${String(s.editorialOut).padStart(2)} out · ${String(s.words).padStart(4)}w  ${s.label}`;
const LANDINGS = new Set(['', 'en']);

console.log('\n=== SITE INSIGHT — structural, no visitor tracking involved ===\n');
console.log(`Pages analysed: ${stats.length} (${stats.filter((s) => s.lang === 'it').length} IT + ${stats.filter((s) => s.lang === 'en').length} EN)`);
console.log('"in/out" counts EDITORIAL links only — those inside <main>, excluding the global nav and footer.\n');

const supported = [...stats].sort((a, b) => b.editorialIn - a.editorialIn);
console.log('--- Best supported pages (most editorial links pointing at them) ---');
for (const s of supported.slice(0, 8)) console.log(row(s));

const fragile = supported.filter((s) => !LANDINGS.has(s.dir) && s.editorialIn <= 1);
console.log(`\n--- Fragile: reachable from the nav, but with <=1 editorial link (${fragile.length}) ---`);
if (fragile.length === 0) console.log('  none — every page is supported by at least two editorial links');
else for (const s of fragile) console.log(row(s));

const thin = [...stats].filter((s) => s.words < 600).sort((a, b) => a.words - b.words);
console.log(`\n--- Thinnest content (under 600 words) (${thin.length}) ---`);
if (thin.length === 0) console.log('  none');
else for (const s of thin.slice(0, 10)) console.log(row(s));

const deadEnds = stats.filter((s) => s.editorialOut === 0);
console.log(`\n--- Dead ends: no editorial link out, the reader's journey stops here (${deadEnds.length}) ---`);
if (deadEnds.length === 0) console.log('  none');
else for (const s of deadEnds) console.log(row(s));

const enOnly = stats.filter((s) => !s.hasCounterpart);
console.log(`\n--- Single-language pages (no counterpart in the other language) (${enOnly.length}) ---`);
for (const s of enOnly) console.log(`  [${s.lang}] ${s.label}`);

const totalWords = stats.reduce((n, s) => n + s.words, 0);
console.log('\n--- Totals ---');
console.log(`  editorial links: ${[...outbound.values()].reduce((n, o) => n + o.editorial.size, 0)}`);
console.log(`  words published: ${totalWords.toLocaleString('en-US')} (median ${[...stats].sort((a, b) => a.words - b.words)[Math.floor(stats.length / 2)].words}/page)`);
console.log('\nVisitor-side data lives in Cloudflare Web Analytics and Search Console.');
console.log('How to read all three together: docs/SITE_INSIGHT.md\n');

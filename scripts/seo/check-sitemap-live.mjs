/**
 * Live Search-Console readiness check for the deployed sitemaps.
 *
 * `robots.txt` now advertises the two language sitemaps directly
 * (`/sitemap-it.xml`, `/sitemap-en.xml`) — Google Search Console reads those
 * reliably. The `/sitemap.xml` index file is kept for compatibility but is no
 * longer the advertised entry point; this script drives off whatever robots.txt
 * advertises, understands both `urlset` and `sitemapindex` children, and still
 * inspects `/sitemap.xml` when present.
 *
 * Opt-in (NOT in CI — the CI sandbox may have no external egress). Run it
 * AFTER a deploy + Cloudflare purge, from a machine that can reach the site.
 *
 * Usage:
 *   node scripts/seo/check-sitemap-live.mjs
 *   node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu
 *
 * Prints per-file counts (19 IT + 23 EN = 42), a robots.txt diagnostic block,
 * a compatibility check of /sitemap.xml, Googlebot-UA parity, http/non-www/
 * query/`/play/` violations, and sampled page canonical/noindex checks.
 */
const BASE = (process.argv[2] || 'https://www.no-ai-act.eu').replace(/\/$/, '');
const SAMPLE = 6;
const EXPECTED_TOTAL = 42;
const EXPECTED_SITEMAPS = [`${BASE}/sitemap-it.xml`, `${BASE}/sitemap-en.xml`];
const GOOGLEBOT_UA =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const yn = (b) => (b ? 'yes' : 'no');

async function get(url, ua = 'no-ai-act-sitemap-check') {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': ua } });
  const body = await res.text();
  return { res, body, finalUrl: res.url, status: res.status, ctype: (res.headers.get('content-type') || '').toLowerCase() };
}

const looksLikeChallenge = (b) => /just a moment|cf-browser-verification|challenge-platform|attention required/i.test(b);
const looksLikeGh404 = (b) => /<title>\s*Site not found|There isn't a GitHub Pages site here/i.test(b);
const looksLikeHtmlDoc = (b) => /^\s*<!doctype html|^\s*<html[\s>]/i.test(b);
const startsWithXmlDecl = (b) => /^﻿?\s*<\?xml\s+version="1\.0"\s+encoding="UTF-8"\?>/i.test(b);
const locsOf = (b) => [...b.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const isIndex = (b) => /<sitemapindex[\s>]/i.test(b);

console.log(`Checking ${BASE} …\n`);

// ---- robots.txt — the advertised entry point(s) ----
let advertised = [];
try {
  const { status, body } = await get(`${BASE}/robots.txt`);
  advertised = [...body.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((m) => m[1]);
  const hasIndexDirective = advertised.some((s) => /\/sitemap\.xml$/.test(s));
  const hasHttp = advertised.some((s) => s.startsWith('http://'));
  const hasApex = advertised.some((s) => /^https?:\/\/no-ai-act\.eu\//i.test(s));

  console.log('  --- /robots.txt diagnostics ---');
  console.log(`  HTTP status ............. ${status}`);
  console.log(`  Sitemap: directives ..... ${advertised.length}`);
  for (const s of advertised) console.log(`    • ${s}`);
  console.log(`  advertises /sitemap.xml . ${yn(hasIndexDirective)} (expected: no)`);
  console.log(`  http:// directive ....... ${yn(hasHttp)}`);
  console.log(`  apex (non-www) directive  ${yn(hasApex)}`);

  ok(status === 200, `robots status ${status} (want 200)`);
  ok(advertised.length === 2, `robots advertises ${advertised.length} sitemaps (want 2 child sitemaps)`);
  ok(EXPECTED_SITEMAPS.every((s) => advertised.includes(s)), `robots must advertise ${EXPECTED_SITEMAPS.join(' and ')}`);
  ok(!hasIndexDirective, 'robots still advertises the /sitemap.xml index (should point at the child sitemaps)');
  ok(!hasHttp, 'robots advertises an http:// sitemap');
  ok(!hasApex, 'robots advertises an apex (non-www) sitemap');
} catch (e) {
  fails.push(`robots fetch failed: ${e.message}`);
}

// ---- fetch each advertised sitemap (urlset or index), collect page URLs ----
async function collectUrls(sitemapUrl) {
  const { status, body, ctype } = await get(sitemapUrl);
  ok(status === 200, `${sitemapUrl} → ${status}`);
  ok(/xml/.test(ctype), `${sitemapUrl} content-type "${ctype}" is not XML`);
  ok(startsWithXmlDecl(body), `${sitemapUrl} missing XML declaration`);
  if (isIndex(body)) {
    // an advertised sitemap that is itself an index → follow its children
    const urls = [];
    for (const child of locsOf(body)) urls.push(...(await collectUrls(child)));
    return urls;
  }
  ok(/<urlset[\s>]/i.test(body), `${sitemapUrl} is neither urlset nor sitemapindex`);
  return locsOf(body);
}

let pageUrls = [];
const perFile = {};
console.log('\n  --- advertised sitemaps ---');
for (const s of advertised.length ? advertised : EXPECTED_SITEMAPS) {
  try {
    const urls = await collectUrls(s);
    perFile[s] = urls.length;
    pageUrls.push(...urls);
    console.log(`  ${s} → ${urls.length} URLs`);
  } catch (e) {
    fails.push(`${s} fetch failed: ${e.message}`);
  }
}
const itCount = perFile[`${BASE}/sitemap-it.xml`];
const enCount = perFile[`${BASE}/sitemap-en.xml`];
if (itCount != null && enCount != null) {
  console.log(`  totals .................. ${itCount} IT + ${enCount} EN = ${itCount + enCount}`);
}

// ---- compatibility: inspect /sitemap.xml if it still exists ----
try {
  const { status, body } = await get(`${BASE}/sitemap.xml`);
  if (status === 200) {
    const rootType = isIndex(body) ? 'sitemapindex' : (/<urlset[\s>]/i.test(body) ? 'urlset' : 'unknown');
    console.log(`\n  --- /sitemap.xml (compatibility, not advertised) ---`);
    console.log(`  present ................. yes (root: ${rootType}, ${locsOf(body).length} <loc>)`);
  } else {
    console.log(`\n  --- /sitemap.xml (compatibility) ---`);
    console.log(`  present ................. no (${status})`);
  }
} catch {
  console.log('\n  --- /sitemap.xml (compatibility) --- present ................. fetch failed');
}

// ---- aggregate validation of page URLs ----
const httpUrls = pageUrls.filter((l) => l.startsWith('http://'));
const nonWwwUrls = pageUrls.filter((l) => /^https?:\/\/no-ai-act\.eu\//i.test(l));
const queryOrHash = pageUrls.filter((l) => /[?#]/.test(l));
const playUrls = pageUrls.filter((l) => /\/(en\/)?play\//.test(l));

console.log('\n  --- combined page URLs ---');
console.log(`  total ................... ${pageUrls.length} (want ${EXPECTED_TOTAL})`);
console.log(`  unique .................. ${new Set(pageUrls).size}`);
console.log(`  http:// ................. ${httpUrls.length}`);
console.log(`  non-www ................. ${nonWwwUrls.length}`);
console.log(`  query/# ................. ${queryOrHash.length}`);
console.log(`  /play/ .................. ${playUrls.length}`);

ok(pageUrls.length === EXPECTED_TOTAL, `total page URLs ${pageUrls.length} (want ${EXPECTED_TOTAL})`);
ok(new Set(pageUrls).size === pageUrls.length, 'duplicate page URLs across sitemaps');
ok(httpUrls.length === 0, `${httpUrls.length} http:// URL(s)`);
ok(nonWwwUrls.length === 0, `${nonWwwUrls.length} non-www URL(s)`);
ok(queryOrHash.length === 0, `${queryOrHash.length} URL(s) with query/hash`);
ok(playUrls.length === 0, `${playUrls.length} /play/ URL(s)`);

// ---- Googlebot-UA parity on the first advertised sitemap ----
if (advertised.length) {
  try {
    const normal = await get(advertised[0]);
    const bot = await get(advertised[0], GOOGLEBOT_UA);
    const same = bot.status === 200 && startsWithXmlDecl(bot.body) &&
      !looksLikeChallenge(bot.body) && locsOf(bot.body).length === locsOf(normal.body).length;
    console.log(`\n  Googlebot same XML (${advertised[0]}) … ${yn(same)}`);
    ok(same, `Googlebot-like UA did NOT get the same XML for ${advertised[0]} (possible bot challenge)`);
  } catch (e) {
    fails.push(`Googlebot parity check failed: ${e.message}`);
  }
}

// ---- sample of page URLs ----
const sample = pageUrls.length ? [pageUrls[0], ...pageUrls.slice(1).filter((_, i) => i % Math.ceil(pageUrls.length / SAMPLE) === 0)].slice(0, SAMPLE) : [];
for (const url of sample) {
  try {
    const { status, body, finalUrl } = await get(url);
    ok(status === 200, `${url} → ${status}`);
    ok(finalUrl.replace(/\/$/, '') === url.replace(/\/$/, ''), `${url} redirected to ${finalUrl}`);
    ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(body), `${url} is noindex`);
    ok(new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(body), `${url} missing self-canonical`);
  } catch (e) {
    fails.push(`${url} fetch failed: ${e.message}`);
  }
}
console.log(`  sampled ${sample.length} page URLs\n`);

if (fails.length === 0) {
  console.log('PASS — language sitemaps are live, XML, canonical-consistent and GSC-ready.');
  process.exit(0);
} else {
  console.log(`FAIL — ${fails.length} problem(s):`);
  for (const f of fails) console.log('  ✗', f);
  process.exit(1);
}

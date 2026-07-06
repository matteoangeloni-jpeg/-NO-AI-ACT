/**
 * Live Search-Console readiness check for the deployed sitemap.
 *
 * `/sitemap.xml` is a **sitemap index** pointing to language child sitemaps
 * (`/sitemap-it.xml`, `/sitemap-en.xml`); this script understands both a
 * `sitemapindex` root (fetches the children) and a plain `urlset`.
 *
 * Opt-in (NOT in CI — the CI sandbox may have no external egress). Run it
 * AFTER a deploy + Cloudflare purge, from a machine that can reach the site.
 *
 * Usage:
 *   node scripts/seo/check-sitemap-live.mjs
 *   node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu
 *
 * It prints a diagnostic block for /sitemap.xml (status, final URL, content-type,
 * root type, XML-declaration presence, child-sitemap count, total URL count,
 * http/non-www/query/fragment/play violations, Googlebot-UA parity, HTML /
 * Cloudflare-challenge / GitHub-404 detection), checks /robots.txt (200 + the
 * exact HTTPS www index directive, no stale http:// variant), and samples a few
 * page URLs (200, not noindex, self-canonical). Prints PASS or the failing checks.
 */
const BASE = (process.argv[2] || 'https://www.no-ai-act.eu').replace(/\/$/, '');
const SAMPLE = 6;
const EXPECTED_TOTAL = 42;
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

// ---- /sitemap.xml (index or urlset) ----
let pageUrls = [];
try {
  const { status, body, finalUrl, ctype } = await get(`${BASE}/sitemap.xml`);
  const hasDecl = startsWithXmlDecl(body);
  const index = isIndex(body);
  const rootType = index ? 'sitemapindex' : (/<urlset[\s>]/i.test(body) ? 'urlset' : 'unknown');
  const childSitemaps = index ? locsOf(body) : [];

  // collect the page URLs — from the children (index) or inline (urlset)
  if (index) {
    for (const child of childSitemaps) {
      try {
        const c = await get(child);
        ok(c.status === 200, `child sitemap ${child} → ${c.status}`);
        ok(/xml/.test(c.ctype), `child sitemap ${child} content-type "${c.ctype}" not XML`);
        ok(startsWithXmlDecl(c.body), `child sitemap ${child} missing XML declaration`);
        ok(/<urlset[\s>]/i.test(c.body), `child sitemap ${child} has no <urlset>`);
        pageUrls.push(...locsOf(c.body));
      } catch (e) {
        fails.push(`child sitemap ${child} fetch failed: ${e.message}`);
      }
    }
  } else {
    pageUrls = locsOf(body);
  }

  const httpUrls = pageUrls.filter((l) => l.startsWith('http://'));
  const nonWwwUrls = pageUrls.filter((l) => /^https?:\/\/no-ai-act\.eu\//i.test(l));
  const queryOrHash = pageUrls.filter((l) => /[?#]/.test(l));
  const playUrls = pageUrls.filter((l) => /\/(en\/)?play\//.test(l));

  // Googlebot-parity: does a crawler-like UA get the same index XML?
  let botSameXml = false;
  try {
    const bot = await get(`${BASE}/sitemap.xml`, GOOGLEBOT_UA);
    botSameXml = bot.status === 200 && startsWithXmlDecl(bot.body) &&
      !looksLikeChallenge(bot.body) && isIndex(bot.body) === index;
  } catch { /* reported below */ }

  console.log('  --- /sitemap.xml diagnostics ---');
  console.log(`  HTTP status ............. ${status}`);
  console.log(`  final URL ............... ${finalUrl}`);
  console.log(`  content-type ............ ${ctype || '(none)'}`);
  console.log(`  root type ............... ${rootType}`);
  console.log(`  starts with XML decl .... ${yn(hasDecl)}`);
  console.log(`  child sitemaps .......... ${childSitemaps.length}${childSitemaps.length ? ' (' + childSitemaps.join(', ') + ')' : ''}`);
  console.log(`  total page URLs ......... ${pageUrls.length} (want ${EXPECTED_TOTAL})`);
  console.log(`  http:// URLs ............ ${httpUrls.length}`);
  console.log(`  non-www URLs ............ ${nonWwwUrls.length}`);
  console.log(`  query/# URLs ............ ${queryOrHash.length}`);
  console.log(`  /play/ URLs ............. ${playUrls.length}`);
  console.log(`  Googlebot same XML ...... ${yn(botSameXml)}`);
  console.log(`  looks like HTML doc ..... ${yn(looksLikeHtmlDoc(body))}`);
  console.log(`  looks like CF challenge . ${yn(looksLikeChallenge(body))}`);
  console.log(`  looks like GH 404 ....... ${yn(looksLikeGh404(body))}`);

  ok(status === 200, `sitemap status ${status} (want 200)`);
  ok(finalUrl.replace(/\/$/, '').endsWith('/sitemap.xml'), `sitemap redirected to ${finalUrl}`);
  ok(!looksLikeChallenge(body), 'sitemap looks like a Cloudflare challenge page');
  ok(!looksLikeGh404(body), 'sitemap looks like a GitHub Pages 404 page');
  ok(!looksLikeHtmlDoc(body), 'sitemap is an HTML document, not XML');
  ok(hasDecl, 'sitemap body does not start with the XML declaration');
  ok(rootType !== 'unknown', 'sitemap root is neither <sitemapindex> nor <urlset>');
  ok(/xml/.test(ctype), `sitemap content-type "${ctype}" is not XML-compatible`);
  if (index) ok(childSitemaps.length === 2, `sitemap index has ${childSitemaps.length} children (want 2)`);
  ok(pageUrls.length === EXPECTED_TOTAL, `total page URLs ${pageUrls.length} (want ${EXPECTED_TOTAL})`);
  ok(new Set(pageUrls).size === pageUrls.length, 'duplicate page URLs across sitemaps');
  ok(httpUrls.length === 0, `${httpUrls.length} http:// URL(s)`);
  ok(nonWwwUrls.length === 0, `${nonWwwUrls.length} non-www URL(s)`);
  ok(queryOrHash.length === 0, `${queryOrHash.length} URL(s) with query/hash`);
  ok(playUrls.length === 0, `${playUrls.length} /play/ URL(s)`);
  ok(botSameXml, 'Googlebot-like user-agent did NOT get the same XML (possible bot challenge)');
} catch (e) {
  fails.push(`sitemap fetch failed: ${e.message}`);
}

// ---- robots.txt ----
try {
  const { status, body } = await get(`${BASE}/robots.txt`);
  const httpsDirective = /^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap\.xml\s*$/im.test(body);
  const hasHttpVariant = /^Sitemap:\s*http:\/\/www\.no-ai-act\.eu\/sitemap\.xml/im.test(body);
  const directiveCount = (body.match(/^Sitemap:/gim) ?? []).length;
  console.log('\n  --- /robots.txt diagnostics ---');
  console.log(`  HTTP status ............. ${status}`);
  console.log(`  Sitemap: directives ..... ${directiveCount}`);
  console.log(`  HTTPS www index ......... ${yn(httpsDirective)}`);
  console.log(`  stale http:// variant ... ${yn(hasHttpVariant)}`);
  ok(status === 200, `robots status ${status} (want 200)`);
  ok(httpsDirective, 'robots.txt missing exact "Sitemap: https://www.no-ai-act.eu/sitemap.xml"');
  ok(!hasHttpVariant, 'robots.txt still advertises the stale http:// sitemap variant');
  ok(directiveCount === 1, `robots.txt has ${directiveCount} Sitemap directives (want 1: the index)`);
} catch (e) {
  fails.push(`robots fetch failed: ${e.message}`);
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
console.log(`\n  sampled ${sample.length} page URLs\n`);

if (fails.length === 0) {
  console.log('PASS — sitemap index + children are live, XML, canonical-consistent and GSC-ready.');
  process.exit(0);
} else {
  console.log(`FAIL — ${fails.length} problem(s):`);
  for (const f of fails) console.log('  ✗', f);
  process.exit(1);
}

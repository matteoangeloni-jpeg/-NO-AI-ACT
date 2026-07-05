/**
 * Live Search-Console readiness check for the deployed sitemap.
 *
 * Opt-in (NOT in CI — the CI sandbox may have no external egress). Run it
 * AFTER a deploy + Cloudflare purge, from a machine that can reach the site.
 *
 * Usage:
 *   node scripts/seo/check-sitemap-live.mjs
 *   node scripts/seo/check-sitemap-live.mjs https://www.no-ai-act.eu
 *
 * It prints a clear diagnostic block for /sitemap.xml:
 *   HTTP status · final URL (redirect target) · content-type · whether the
 *   body starts with the XML declaration · whether <urlset> is present · the
 *   number of <loc> entries · whether any http:// or non-www <loc> appears ·
 *   whether a Googlebot-like user-agent gets the same XML · whether the body
 *   looks like HTML / a Cloudflare challenge / a GitHub Pages 404.
 * Then it checks /robots.txt (200 + the exact HTTPS www Sitemap directive, and
 * no stale http:// variant) and samples a few sitemap URLs (200, not noindex,
 * self-canonical). Prints PASS or the failing checks; exits non-zero on fail.
 */
const BASE = (process.argv[2] || 'https://www.no-ai-act.eu').replace(/\/$/, '');
const SAMPLE = 6;
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

console.log(`Checking ${BASE} …\n`);

// ---- sitemap.xml ----
let locs = [];
try {
  const { status, body, finalUrl, ctype } = await get(`${BASE}/sitemap.xml`);
  locs = locsOf(body);
  const hasDecl = startsWithXmlDecl(body);
  const hasUrlset = /<urlset[\s>]/i.test(body);
  const httpLocs = locs.filter((l) => l.startsWith('http://'));
  const nonWwwLocs = locs.filter((l) => /^https?:\/\/no-ai-act\.eu\//i.test(l));
  const isChallenge = looksLikeChallenge(body);
  const isGh404 = looksLikeGh404(body);
  const isHtml = looksLikeHtmlDoc(body);

  // Googlebot-parity: does a crawler-like UA get the same XML (not a challenge)?
  let botSameXml = false;
  try {
    const bot = await get(`${BASE}/sitemap.xml`, GOOGLEBOT_UA);
    botSameXml = bot.status === 200 && startsWithXmlDecl(bot.body) &&
      !looksLikeChallenge(bot.body) && locsOf(bot.body).length === locs.length;
  } catch { /* reported via the check below */ }

  console.log('  --- /sitemap.xml diagnostics ---');
  console.log(`  HTTP status ............. ${status}`);
  console.log(`  final URL ............... ${finalUrl}`);
  console.log(`  content-type ............ ${ctype || '(none)'}`);
  console.log(`  starts with XML decl .... ${yn(hasDecl)}`);
  console.log(`  <urlset> present ........ ${yn(hasUrlset)}`);
  console.log(`  <loc> count ............. ${locs.length} (want 42)`);
  console.log(`  http:// URLs ............ ${httpLocs.length}`);
  console.log(`  non-www URLs ............ ${nonWwwLocs.length}`);
  console.log(`  Googlebot gets same XML . ${yn(botSameXml)}`);
  console.log(`  looks like HTML doc ..... ${yn(isHtml)}`);
  console.log(`  looks like CF challenge . ${yn(isChallenge)}`);
  console.log(`  looks like GH 404 ....... ${yn(isGh404)}`);

  ok(status === 200, `sitemap status ${status} (want 200)`);
  ok(finalUrl.replace(/\/$/, '').endsWith('/sitemap.xml'), `sitemap redirected to ${finalUrl}`);
  ok(!isChallenge, 'sitemap looks like a Cloudflare challenge page');
  ok(!isGh404, 'sitemap looks like a GitHub Pages 404 page');
  ok(!isHtml, 'sitemap is an HTML document, not XML');
  ok(hasDecl, 'sitemap body does not start with <?xml version="1.0" encoding="UTF-8"?>');
  ok(hasUrlset, 'sitemap has no <urlset> root');
  ok(/xml/.test(ctype), `sitemap content-type "${ctype}" is not XML-compatible`);
  ok(locs.length === 42, `sitemap has ${locs.length} <loc> (want 42)`);
  ok(httpLocs.length === 0, `sitemap has ${httpLocs.length} http:// URL(s)`);
  ok(nonWwwLocs.length === 0, `sitemap has ${nonWwwLocs.length} non-www URL(s)`);
  ok(botSameXml, 'Googlebot-like user-agent did NOT get the same XML (possible bot challenge)');
  ok(!body.includes('/play/'), 'sitemap contains /play/');
} catch (e) {
  fails.push(`sitemap fetch failed: ${e.message}`);
}

// ---- robots.txt ----
try {
  const { status, body } = await get(`${BASE}/robots.txt`);
  const httpsDirective = /^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap\.xml\s*$/im.test(body);
  const hasHttpVariant = /^Sitemap:\s*http:\/\/www\.no-ai-act\.eu\/sitemap\.xml/im.test(body);
  console.log('\n  --- /robots.txt diagnostics ---');
  console.log(`  HTTP status ............. ${status}`);
  console.log(`  HTTPS www Sitemap: ...... ${yn(httpsDirective)}`);
  console.log(`  stale http:// Sitemap: .. ${yn(hasHttpVariant)}`);
  ok(status === 200, `robots status ${status} (want 200)`);
  ok(httpsDirective, 'robots.txt missing exact "Sitemap: https://www.no-ai-act.eu/sitemap.xml"');
  ok(!hasHttpVariant, 'robots.txt still advertises the stale http:// sitemap variant');
} catch (e) {
  fails.push(`robots fetch failed: ${e.message}`);
}

// ---- sample of sitemap URLs ----
const sample = locs.length ? [locs[0], ...locs.slice(1).filter((_, i) => i % Math.ceil(locs.length / SAMPLE) === 0)].slice(0, SAMPLE) : [];
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
console.log(`\n  sampled ${sample.length} sitemap URLs\n`);

if (fails.length === 0) {
  console.log('PASS — sitemap is live, XML, canonical-consistent and GSC-ready.');
  process.exit(0);
} else {
  console.log(`FAIL — ${fails.length} problem(s):`);
  for (const f of fails) console.log('  ✗', f);
  process.exit(1);
}

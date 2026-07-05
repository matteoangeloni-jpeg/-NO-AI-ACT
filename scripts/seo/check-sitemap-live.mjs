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
 * Checks: /sitemap.xml is 200, not redirected, real XML (not a Cloudflare
 * challenge / GitHub 404 / generic HTML), acceptable content-type; /robots.txt
 * is 200 and advertises the sitemap; a sample of sitemap URLs return 200, are
 * not noindex, and carry a self-canonical. Prints PASS or the failing checks.
 */
const BASE = (process.argv[2] || 'https://www.no-ai-act.eu').replace(/\/$/, '');
const SAMPLE = 6;
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

async function get(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'no-ai-act-sitemap-check' } });
  const body = await res.text();
  return { res, body, finalUrl: res.url, status: res.status, ctype: (res.headers.get('content-type') || '').toLowerCase() };
}

const looksLikeChallenge = (b) => /just a moment|cf-browser-verification|challenge-platform|attention required/i.test(b);
const looksLikeGh404 = (b) => /<title>\s*Site not found|There isn't a GitHub Pages site here/i.test(b);
const looksLikeHtmlDoc = (b) => /^\s*<!doctype html|^\s*<html[\s>]/i.test(b);

console.log(`Checking ${BASE} …\n`);

// ---- sitemap.xml ----
let locs = [];
try {
  const { status, body, finalUrl, ctype } = await get(`${BASE}/sitemap.xml`);
  ok(status === 200, `sitemap status ${status} (want 200)`);
  ok(finalUrl.replace(/\/$/, '').endsWith('/sitemap.xml'), `sitemap redirected to ${finalUrl}`);
  ok(!looksLikeChallenge(body), 'sitemap looks like a Cloudflare challenge page');
  ok(!looksLikeGh404(body), 'sitemap looks like a GitHub Pages 404 page');
  ok(!looksLikeHtmlDoc(body), 'sitemap is an HTML document, not XML');
  ok(/^\s*<\?xml|<urlset/i.test(body), 'sitemap body does not start like XML / has no <urlset');
  ok(/xml/.test(ctype), `sitemap content-type "${ctype}" is not XML-compatible`);
  locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(locs.length === 42, `sitemap has ${locs.length} <loc> (want 42)`);
  ok(!body.includes('/play/'), 'sitemap contains /play/');
  console.log(`  sitemap: ${status}, ctype="${ctype}", ${locs.length} URLs`);
} catch (e) {
  fails.push(`sitemap fetch failed: ${e.message}`);
}

// ---- robots.txt ----
try {
  const { status, body } = await get(`${BASE}/robots.txt`);
  ok(status === 200, `robots status ${status} (want 200)`);
  ok(/^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap\.xml/im.test(body), 'robots.txt missing exact Sitemap: directive');
  console.log(`  robots.txt: ${status}, sitemap directive ${/Sitemap:/i.test(body) ? 'present' : 'MISSING'}`);
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
console.log(`  sampled ${sample.length} sitemap URLs\n`);

if (fails.length === 0) {
  console.log('PASS — sitemap is live, XML, canonical-consistent and GSC-ready.');
  process.exit(0);
} else {
  console.log(`FAIL — ${fails.length} problem(s):`);
  for (const f of fails) console.log('  ✗', f);
  process.exit(1);
}

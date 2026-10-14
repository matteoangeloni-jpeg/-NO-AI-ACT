import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';

const base = process.env.BASE ?? 'http://localhost:4212';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Local preview only');
const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const routes = cfg.pairs.flatMap(p => Object.entries(p).filter(([lang]) => ['it', 'en', 'fr'].includes(lang)).map(([lang, dir]) => ({ lang, dir })));
for (const dir of cfg.enOnly) {
  routes.push({ lang: 'en', dir });
  if (cfg.frForEn[dir]) routes.push({ lang: 'fr', dir: cfg.frForEn[dir] });
}
const results = [], images = new Set();
for (const { lang, dir } of routes) {
  const path = dir ? `/${dir}/` : '/';
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.equal(html, readFileSync(`dist/${dir ? `${dir}/` : ''}index.html`, 'utf8'), `${path}: exact built route, not fallback`);
  let language, canonical, social;
  const visit = n => {
    const attrs = Object.fromEntries((n.attrs ?? []).map(a => [a.name, a.value]));
    if (n.tagName === 'html') language = attrs.lang;
    if (n.tagName === 'link' && attrs.rel === 'canonical') canonical = attrs.href;
    if (n.tagName === 'meta' && attrs.property === 'og:image') social = attrs.content;
    for (const child of n.childNodes ?? []) visit(child);
  };
  visit(parse(html));
  assert.equal(language, lang, path);
  assert.equal(canonical, cfg.site + (dir ? `${dir}/` : ''), path);
  assert(social, `${path}: social image`);
  const url = new URL(social, cfg.site);
  assert.equal(url.origin, new URL(cfg.site).origin, 'Unexpected external social asset');
  images.add(url.pathname);
  results.push({ path, lang, status: 200, canonical, exactBuiltPage: true });
}
for (const path of images) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('content-type'), /^image\//, `${path}: no HTML fallback`);
  assert((await response.arrayBuffer()).byteLength > 0);
}
mkdirSync('scripts/smoke/out/final-qa', { recursive: true });
writeFileSync('scripts/smoke/out/final-qa/routes-results.json', JSON.stringify({ results, socialAssets: [...images], productionRequests: false }, null, 2));
console.log(`Final routes PASS: ${results.length} exact built public routes, languages/canonical and ${images.size} social assets via local HTTP.`);

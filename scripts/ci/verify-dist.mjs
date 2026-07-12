/**
 * Deploy-gate: verify the built `dist/` is complete and shippable BEFORE the
 * Pages artifact is uploaded. Runs in CI (build job) after `npm run build`, and
 * can be run locally with `npm run verify:dist`.
 *
 * Fails loudly (exit 1) if a deploy-critical file is missing, the sitemap
 * children don't total 42, or any shipped HTML contains mojibake — so a broken
 * build never reaches production.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const dist = resolve(root, 'dist');
const fail = [];

let sha = process.env.GITHUB_SHA || '';
if (!sha) { try { sha = execSync('git rev-parse HEAD').toString().trim(); } catch { /* not a repo */ } }

console.log('--- verify-dist ---');
console.log('node   :', process.version);
console.log('sha    :', sha || '(unknown)');

if (!existsSync(dist)) {
  console.error('FAIL: dist/ does not exist — run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const files = walk(dist);
console.log('files  :', files.length);

// --- deploy-critical files ---
const required = [
  'index.html',
  'en/index.html',
  'play/index.html',
  'robots.txt',
  'sitemap.xml',
  'sitemap-it.xml',
  'sitemap-en.xml'
];
for (const rel of required) {
  const ok = existsSync(join(dist, rel));
  console.log(`  ${ok ? '✓' : '✗'} dist/${rel}`);
  if (!ok) fail.push(`missing dist/${rel}`);
}

// --- sitemap children total exactly 42 ---
try {
  const count = (p) => (readFileSync(join(dist, p), 'utf8').match(/<loc>/g) ?? []).length;
  const it = count('sitemap-it.xml');
  const en = count('sitemap-en.xml');
  console.log(`  sitemap children: ${it} IT + ${en} EN = ${it + en}`);
  if (it + en !== 42) fail.push(`sitemap children total ${it + en} (want 42)`);
} catch (e) {
  fail.push(`sitemap child read failed: ${e.message}`);
}

// --- robots must advertise the two child sitemaps, /play/ must stay noindex ---
try {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  if (!/^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap-it\.xml\s*$/m.test(robots)) fail.push('robots.txt missing sitemap-it.xml directive');
  if (!/^Sitemap:\s*https:\/\/www\.no-ai-act\.eu\/sitemap-en\.xml\s*$/m.test(robots)) fail.push('robots.txt missing sitemap-en.xml directive');
  const play = readFileSync(join(dist, 'play/index.html'), 'utf8');
  if (!play.includes('content="noindex, follow"')) fail.push('/play/ lost its noindex meta');
} catch (e) {
  fail.push(`robots/play check failed: ${e.message}`);
}

// --- mojibake guard: never ship double-encoded / botched-dash text ---
const MOJIBAKE = /Ã[\x80-\xbf]|â€|Â[\x80-\xbf]|"”|�/;
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const corrupt = htmlFiles.filter((f) => MOJIBAKE.test(readFileSync(f, 'utf8')));
console.log(`  mojibake-free HTML: ${htmlFiles.length - corrupt.length}/${htmlFiles.length}`);
if (corrupt.length) fail.push(`mojibake in dist HTML: ${corrupt.map((f) => relative(dist, f)).slice(0, 5).join(', ')}${corrupt.length > 5 ? ' …' : ''}`);

// --- no external forms: Tally (and any form provider) must never ship ---
const FORMS = /tally\.so|data-tally|44ENVA|5BryXb|dWgB5y|ZjWp9A|typeform\.com|jotform\.com|forms\.gle/i;
const textFiles = files.filter((f) => /\.(html|js|css|txt|xml|json)$/.test(f));
const withForms = textFiles.filter((f) => FORMS.test(readFileSync(f, 'utf8')));
console.log(`  external-form-free files: ${textFiles.length - withForms.length}/${textFiles.length}`);
if (withForms.length) fail.push(`external form reference in dist: ${withForms.map((f) => relative(dist, f)).slice(0, 5).join(', ')}`);

if (fail.length) {
  console.error('\nFAIL — deploy-critical checks:');
  for (const f of fail) console.error('  ✗', f);
  process.exit(1);
}
console.log('\nPASS — dist is complete and deploy-ready.');

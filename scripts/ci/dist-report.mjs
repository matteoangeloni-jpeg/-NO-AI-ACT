/**
 * Dist size report + soft performance budget (traffic-spike readiness).
 *
 * Prints total size, file count, the largest files, and the initial-load
 * weight of the two entry routes; fails (exit 1) only on the hard budget —
 * a runaway build should not reach GitHub Pages unnoticed.
 *
 * Run after `npm run build`:  node scripts/ci/dist-report.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = resolve(process.cwd(), 'dist');
if (!existsSync(dist)) {
  console.error('FAIL: dist/ does not exist — run `npm run build` first.');
  process.exit(1);
}

// Hard budgets — generous on purpose: they catch runaway regressions
// (a doubled bundle, an accidental 50 MB asset), not normal growth.
const BUDGET = {
  totalMB: 20,          // whole dist
  gameGzipKB: 900,      // main game bundle, gzipped
  landingGzipKB: 60     // IT landing HTML, gzipped
};

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const files = walk(dist).map((p) => ({ p: relative(dist, p), size: statSync(p).size }));
const total = files.reduce((a, f) => a + f.size, 0);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const fails = [];

console.log('--- dist report ---');
console.log(`files  : ${files.length}`);
console.log(`total  : ${(total / 1024 / 1024).toFixed(2)} MB (budget ${BUDGET.totalMB} MB)`);
console.log('largest:');
for (const f of [...files].sort((a, b) => b.size - a.size).slice(0, 8)) {
  console.log(`  ${kb(f.size).padStart(9)}  ${f.p}`);
}

// initial-load weight of the two entry routes (gzipped, as served)
const gz = (p) => gzipSync(readFileSync(join(dist, p))).length;
const gameJs = files.find((f) => /^assets\/play-.*\.js$/.test(f.p));
const landingGz = gz('index.html');
const gameGz = gameJs ? gz(gameJs.p) : 0;
console.log(`landing / ........ ${kb(landingGz)} gzipped HTML (budget ${BUDGET.landingGzipKB} KB)`);
console.log(`game bundle ...... ${gameJs ? `${kb(gameGz)} gzipped (${gameJs.p}, budget ${BUDGET.gameGzipKB} KB)` : 'NOT FOUND'}`);

// content-hashed assets → safe for immutable CDN caching
const unhashed = files.filter((f) => f.p.startsWith('assets/') && !f.p.startsWith('assets/social/') && !/-[A-Za-z0-9_-]{8}\./.test(f.p));
console.log(`hashed assets .... ${unhashed.length === 0 ? 'all content-hashed ✓' : `UNHASHED: ${unhashed.map((f) => f.p).join(', ')}`}`);

if (total > BUDGET.totalMB * 1024 * 1024) fails.push(`dist total ${(total / 1048576).toFixed(1)} MB > ${BUDGET.totalMB} MB`);
if (!gameJs) fails.push('game bundle assets/play-*.js not found');
if (gameGz > BUDGET.gameGzipKB * 1024) fails.push(`game bundle ${kb(gameGz)} gz > ${BUDGET.gameGzipKB} KB`);
if (landingGz > BUDGET.landingGzipKB * 1024) fails.push(`landing ${kb(landingGz)} gz > ${BUDGET.landingGzipKB} KB`);

if (fails.length) {
  console.error('\nFAIL — performance budget:');
  for (const f of fails) console.error('  ✗', f);
  process.exit(1);
}
console.log('\nPASS — within the performance budget.');

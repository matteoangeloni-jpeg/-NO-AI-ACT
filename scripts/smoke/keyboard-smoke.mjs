/**
 * Opt-in KEYBOARD smoke for /play/ (§11.2 — every core action without a
 * pointer). Drives a complete case using ONLY the keyboard:
 *
 *   Title (pointer-free boot via seeded save with briefingSeen)
 *   → CityMap: ARROW selects an open case, ENTER opens it
 *   → Case: ENTER examines the exhibits (after the typewriter reveals the CTA)
 *   → Evidence: keys 1..3 reveal each exhibit, again to cite two, ENTER proceeds
 *   → Decision: 1 (classification), 1 (measure), 2 (subject), 8 (confidence), 2 (motivation)
 *   → Report: ENTER continues → Consequence: ENTER → CityMap
 *
 * Also verifies: the semantic reading layer mirrors each scene (§11.1), the
 * aria-live announcer fires on the outcome, no gameplay network beyond the
 * allowlisted beacon, no console errors. NOT part of `npm test` (needs a
 * served build):
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/smoke/keyboard-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4200';
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com'];
const fail = [];
const errors = [];
const hosts = new Set();

// briefingSeen=true → Title shows CONTINUE; reducedMotion for instant reveals
const SEED = JSON.stringify({
  version: 2, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  reducedMotion: true, crtOverlay: false, language: 'en', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full', caseMeta: {}, selfCheck: { pre: null, post: null }
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('request', (r) => { try { hosts.add(new URL(r.url()).host); } catch { /* ignore */ } });

async function waitScene(key, timeout = 20000) {
  await page.waitForFunction((k) => {
    const g = window.game; if (!g) return false;
    return g.scene.getScenes(true).some((s) => s.scene.key === k);
  }, key, { timeout }).catch(async () => {
    const active = await page.evaluate(() => window.game ? window.game.scene.getScenes(true).map((s) => s.scene.key) : ['no-game']).catch(() => ['eval-failed']);
    fail.push(`scene "${key}" not reached (active: ${active.join(',')})`);
  });
}
const press = async (key, ms = 350) => { await page.keyboard.press(key); await page.waitForTimeout(ms); };
async function readingLayerHas(marker, ctxLabel) {
  const html = await page.evaluate(() => document.getElementById('reading-layer')?.innerHTML ?? '');
  if (!new RegExp(marker, 'i').test(html)) fail.push(`${ctxLabel}: reading layer missing /${marker}/`);
}

await page.addInitScript((seed) => localStorage.setItem('no-ai-act-save-v2', seed), SEED);
await page.goto(`${BASE}/play/?lang=en`, { waitUntil: 'load' });
await waitScene('Title');

// Title → CityMap: CONTINUE is a canvas button; keyboard path starts at the
// map (Title keyboard start is tracked as a known limitation). Use scene API
// to skip the single pointer click of the menu, then go keyboard-only.
await page.evaluate(() => {
  window.game.scene.stop('Title');
  window.game.scene.start('CityMap');
});
await waitScene('CityMap');
await readingLayerHas('Civic map', 'CityMap');

// select the first open case with arrows and open it with ENTER
await press('ArrowRight');
await press('Enter', 900);
await waitScene('Case');
await readingLayerHas('CASE FILE|Case file', 'Case');

// typewriter: wait until the CTA appears, then ENTER
await page.waitForFunction(() => {
  const s = window.game.scene.getScenes(true).find((x) => x.scene.key === 'Case');
  if (!s) return false;
  return s.children.list.some((o) => o.type === 'Container' && o.input && o.input.enabled && o.visible);
}, { timeout: 30000 }).catch(() => fail.push('Case: CTA never became visible'));
await press('Enter', 700);
await waitScene('Evidence');
await readingLayerHas('exhibit|Keys 1', 'Evidence');

// reveal all three exhibits, cite the first two, proceed
for (const k of ['1', '2', '3']) await press(k);
for (const k of ['1', '2']) await press(k);
await press('Enter', 800);
await waitScene('Decision');
await readingLayerHas('Decision', 'Decision');

// classification, measure, subject, optional confidence (8), motivation
await press('1', 600);
await press('1', 600);
await press('2', 600);
await press('8', 300); // confidence "Fairly" — optional, must not block
await press('2', 900);
await waitScene('Report');
await readingLayerHas('Inspection report', 'Report');
const announced = await page.evaluate(() => document.getElementById('sr-announcer')?.textContent ?? '');
if (!/outcome/i.test(announced)) fail.push(`Report: aria-live announcer empty (got "${announced}")`);

// confidence must be stored, and never in the scoring inputs
const meta = await page.evaluate(() => JSON.parse(localStorage.getItem('no-ai-act-save-v2') || '{}').caseMeta);
if (!meta || !Object.values(meta).some((m) => m.confidence === 2)) fail.push('confidence not stored in caseMeta');

await press('Enter', 900);
await waitScene('Consequence');
await press('Enter', 900);
// il primo caso sblocca la carta norma: ENTER la archivia e torna alla mappa
await waitScene('NormCard');
await press('Enter', 900);
await waitScene('CityMap');

await browser.close();

const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`console errors: ${JSON.stringify(relevantErrors.slice(0, 5))}`);
const externalHosts = [...hosts].filter((h) => !h.startsWith('localhost'));
const disallowed = externalHosts.filter((h) => !GAME_HOSTS_ALLOWED.some((a) => h.includes(a)));
if (disallowed.length) fail.push(`unexpected network host(s): ${JSON.stringify(disallowed)}`);

console.log('keyboard smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  external hosts:', JSON.stringify(externalHosts));
console.log('  console errors:', relevantErrors.length);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ full case keyboard-only: map → case → evidence → decision (+confidence) → report → consequence, reading layer synced, outcome announced');

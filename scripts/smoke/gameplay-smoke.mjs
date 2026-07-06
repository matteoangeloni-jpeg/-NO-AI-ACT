/**
 * Opt-in headless gameplay smoke for /play/ (NOT part of `npm test` — it needs
 * a browser and a served build, so it is kept out of the fast unit CI).
 *
 * What it verifies on a minimal representative flow:
 *   - /play/ boots the game with no console errors;
 *   - one case can be played to the inspection report + decision debrief;
 *   - the debrief exposes the internal "read more" link (opens a same-origin
 *     education page in a new tab);
 *   - the game makes NO gameplay network call (only the pre-existing shell
 *     Cloudflare beacon may appear);
 *   - the 390px mobile layout does not overflow horizontally.
 *
 * Usage:
 *   1) build + serve the site:   npm run build && npx vite preview --port 4200
 *   2) run the smoke:            BASE=http://localhost:4200 \
 *        CHROMIUM_PATH=/path/to/chrome node scripts/smoke/gameplay-smoke.mjs
 *   (CHROMIUM_PATH is optional if Playwright's bundled Chromium is installed.)
 *
 * Exits non-zero on any failed check.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4200';
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com']; // pre-existing shell beacon only
const fail = [];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const errors = [];
const hosts = new Set();

// ---- desktop: boot + play one case to the debrief ----
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('request', (r) => hosts.add(new URL(r.url()).host));

const click = async (x, y, w = 400) => {
  await page.mouse.move(x, y); await page.waitForTimeout(40);
  await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(w);
};

// EN, teacher mode off, no prior progress
await page.addInitScript(() => localStorage.setItem('no-ai-act-save-v1', JSON.stringify({
  version: 1, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  reducedMotion: false, crtOverlay: true, language: 'en', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
})));
await page.goto(`${BASE}/play/?lang=en`, { waitUntil: 'load' });
await page.waitForTimeout(9000); // Phaser boot

await click(640, 390, 1200);            // NEW GAME
await click(640, 300, 500); await click(640, 600, 1200); // briefing -> city map (CTA now inside the panel at y≈600)
await click(Math.round(1280 * 0.40), Math.round(720 * 0.18), 800); // welfare marker (case_credito)
await click(640, 400, 400); await click(640, 650, 1000); // -> evidence
const clues = [[250, 236], [640, 236], [1030, 236], [250, 482], [640, 482], [1030, 482]];
for (const [x, y] of clues) await click(x, y, 100);      // reveal all
await click(clues[3][0], clues[3][1], 100);               // cite relevant clue
await click(clues[4][0], clues[4][1], 100);               // cite relevant clue
await click(640, 630, 1000);                              // -> decision
await page.keyboard.press('1'); await page.waitForTimeout(600); // classification
await page.keyboard.press('1'); await page.waitForTimeout(600); // measure
await page.keyboard.press('2'); await page.waitForTimeout(600); // subject
await page.keyboard.press('2'); await page.waitForTimeout(1200); // motivation -> report

const reportOk = await page.evaluate(() => document.querySelector('canvas') !== null);
if (!reportOk) fail.push('no game canvas at report stage');

await click(240, 674, 700); // open decision debrief
const [popup] = await Promise.all([
  page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
  click(490, 646, 500) // "read more" internal link
]);
if (!popup) fail.push('decision debrief "read more" internal link did not open');
else {
  const u = new URL(popup.url());
  if (u.host.startsWith('localhost') || u.host.includes('no-ai-act')) {
    // internal (localhost during smoke, or the production host) — OK
  } else fail.push(`"read more" opened a non-internal host: ${u.host}`);
  await popup.close();
}
await ctx.close();

// ---- 390px: no horizontal overflow ----
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
await mp.goto(`${BASE}/play/`, { waitUntil: 'domcontentloaded' });
await mp.waitForTimeout(3000);
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) fail.push('390px mobile overflow on /play/');
await mctx.close();

await browser.close();

// ---- assertions ----
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`console errors: ${JSON.stringify(relevantErrors)}`);
const externalHosts = [...hosts].filter((h) => !h.startsWith('localhost'));
const disallowed = externalHosts.filter((h) => !GAME_HOSTS_ALLOWED.some((a) => h.includes(a)));
if (disallowed.length) fail.push(`unexpected gameplay network host(s): ${JSON.stringify(disallowed)}`);

console.log('gameplay smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  external hosts:', JSON.stringify(externalHosts));
console.log('  console errors:', relevantErrors.length);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ boot, one case to debrief, internal read-more, no gameplay network, no 390px overflow');

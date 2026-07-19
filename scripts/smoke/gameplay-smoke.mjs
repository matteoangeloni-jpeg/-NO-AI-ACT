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
// Hermetic run: abort the pre-existing shell beacon so the smoke never depends
// on third-party network availability (on a networked runner the loaded beacon
// would phone home to a second host and skew the host observation).
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('request', (r) => hosts.add(new URL(r.url()).host));

const click = async (x, y, w = 400) => {
  await page.mouse.move(x, y); await page.waitForTimeout(40);
  await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(w);
};

// Click a canvas Button by its label (logical coords == screen coords at 1280×720).
// Robust to title-menu layout changes: reads the live scene via window.game.
const clickButton = async (labelRe, w = 400) => {
  const pos = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const scenes = window.game.scene.getScenes(true);
    const s = scenes[scenes.length - 1];
    let found = null;
    const visit = (o) => { // recursive: overlay buttons live inside containers
      if (found || !o || o.visible === false) return;
      if (o.type === 'Container' && o.input && o.input.enabled) {
        const t = (o.list || []).find((ch) => typeof ch.text === 'string');
        if (t && re.test(t.text)) { const b = o.getBounds(); found = { x: b.centerX, y: b.centerY }; return; }
      }
      for (const ch of (o.list || [])) visit(ch);
    };
    for (const o of s.children.list) visit(o);
    return found;
  }, labelRe.source);
  if (!pos) { fail.push(`button not found: ${labelRe}`); return; }
  await click(Math.round(pos.x), Math.round(pos.y), w);
};

// Scene transitions use 300ms camera fades that complete on their own clock;
// fixed sleeps are timing-fragile on slow/CI machines (a click can land one
// scene behind). Wait for the actual scene key instead of guessing durations.
const waitScene = async (key, timeout = 15000) => {
  const ok = await page.waitForFunction((k) => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true);
    return a.length > 0 && a[a.length - 1].scene.key === k;
  }, key, { timeout }).then(() => true).catch(() => false);
  if (!ok) {
    const now = await page.evaluate(() => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'no game');
    fail.push(`scene "${key}" never became active (stuck on: ${now})`);
  }
  return ok;
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
await waitScene('Title', 30000); // Phaser boot

await clickButton(/NEW GAME/, 300);      // primary action on the simplified title
await waitScene('Briefing');
await click(640, 300, 400);              // pointerdown skips the typewriter
await clickButton(/ACCESS THE CIVIC MAP/, 300);
await waitScene('CityMap');
await click(Math.round(1280 * 0.40), Math.round(720 * 0.18), 300); // welfare marker (case_credito)
await waitScene('Case');
await click(640, 400, 300);              // reveal case context
await clickButton(/EXAMINE THE EXHIBITS/, 300);
await waitScene('Evidence');
const clues = [[250, 236], [640, 236], [1030, 236], [250, 482], [640, 482], [1030, 482]];
for (const [x, y] of clues) await click(x, y, 100);      // reveal all
await click(clues[3][0], clues[3][1], 100);               // cite relevant clue
await click(clues[4][0], clues[4][1], 100);               // cite relevant clue
await clickButton(/PROCEED TO CLASSIFICATION/, 300);
await waitScene('Decision');
await page.keyboard.press('1'); await page.waitForTimeout(600); // classification
await page.keyboard.press('1'); await page.waitForTimeout(600); // measure
await page.keyboard.press('2'); await page.waitForTimeout(600); // subject
await page.keyboard.press('2');                                 // motivation -> report
await waitScene('Report');
await page.waitForTimeout(800); // let the report body render

const reportOk = await page.evaluate(() => document.querySelector('canvas') !== null);
if (!reportOk) fail.push('no game canvas at report stage');

await clickButton(/Decision debrief/, 700); // open decision debrief overlay
// The link opens with rel=noopener, so newer Playwright does not emit it as a
// 'popup' of the opener page — listen for any new page in the context instead.
const [popup] = await Promise.all([
  ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null),
  clickButton(/Read more on the site/, 500) // "read more" internal link
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
await mctx.route(/cloudflareinsights\.com/, (r) => r.abort());
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

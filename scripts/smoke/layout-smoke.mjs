/**
 * Opt-in responsive layout smoke for /play/ (NOT part of `npm test` — needs a
 * browser + served build). Verifies the safe-area hotfix: on TitleScene and
 * BriefingScene no interactive button is clipped by the canvas edge and no
 * button overlaps a standalone text (disclaimer / onboarding line), across
 * desktop, tablet and mobile viewports, in IT and EN.
 *
 * Buttons/labels are drawn on the Phaser canvas (not the DOM), so geometry is
 * read from the live game via `window.game`. Because the game uses Scale.FIT in
 * a fixed 1280×720 logical space, these logical bounds map 1:1 to what is shown
 * (letterboxed) at every viewport.
 *
 * Usage:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/smoke/layout-smoke.mjs
 *
 * Exits non-zero on any failed check. Screenshots go to scripts/smoke/out/.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4200';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), 'out');
mkdirSync(OUT, { recursive: true });
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com'];
const EDGE = 4; // logical px an element must stay clear of each canvas edge
const fail = [];

// Landscape / wide-enough viewports where the mobile guard is hidden and the
// canvas UI is the active surface.
const CANVAS_VIEWPORTS = [
  { w: 1792, h: 930 }, { w: 1440, h: 900 }, { w: 1366, h: 768 },
  { w: 1280, h: 720 }, { w: 1024, h: 768 }, { w: 768, h: 1024 }
];

const SEED_WITH_PROGRESS = JSON.stringify({
  version: 1, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: { case_credito: 'correct' }, unlockedNorms: [], audioMuted: true,
  musicVolume: 0, reducedMotion: true, crtOverlay: false, language: 'it', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const errors = [];
const hosts = new Set();

/** Snapshot of the active scene's top-level display objects, in logical coords. */
const sceneReportFn = () => {
  const g = window.game;
  if (!g) return null;
  const active = g.scene.getScenes(true);
  const scene = active[active.length - 1];
  if (!scene) return null;
  const items = [];
  for (const o of scene.children.list) {
    if (!o || typeof o.getBounds !== 'function') continue;
    const b = o.getBounds();
    let text = typeof o.text === 'string' ? o.text : null;
    if (text == null && Array.isArray(o.list)) {
      const t = o.list.find((c) => typeof c.text === 'string');
      text = t ? t.text : null;
    }
    items.push({
      type: o.type,
      interactive: !!(o.input && o.input.enabled),
      visible: o.visible !== false,
      alpha: o.alpha ?? 1,
      text,
      x: b.x, y: b.y, w: b.width, h: b.height
    });
  }
  return { key: scene.scene.key, W: scene.scale.width, H: scene.scale.height, items };
};

const intersects = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function assertSceneLayout(report, ctx, expectedKey) {
  if (!report) { fail.push(`${ctx}: no window.game / scene report`); return; }
  const { key, W, H, items } = report;
  if (expectedKey && key !== expectedKey) {
    fail.push(`${ctx}: active scene is "${key}", expected "${expectedKey}"`);
    return;
  }
  const buttons = items.filter((i) => i.type === 'Container' && i.interactive && i.visible);
  // standalone texts (exclude full-bleed backgrounds); only those actually shown
  const texts = items.filter((i) => i.type === 'Text' && i.w < 1100 && i.visible && i.alpha > 0.05);

  if (buttons.length === 0) fail.push(`${ctx} [${key}]: no interactive buttons found`);

  for (const el of [...buttons, ...texts]) {
    const label = el.text ? `"${String(el.text).slice(0, 24)}"` : el.type;
    if (el.y < EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at top (y=${el.y.toFixed(0)})`);
    if (el.y + el.h > H - EDGE) fail.push(`${ctx} [${key}]: ${label} clipped/below bottom (bottom=${(el.y + el.h).toFixed(0)} > ${H - EDGE})`);
    if (el.x < EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at left (x=${el.x.toFixed(0)})`);
    if (el.x + el.w > W - EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at right (right=${(el.x + el.w).toFixed(0)} > ${W - EDGE})`);
  }
  for (const btn of buttons) {
    for (const txt of texts) {
      if (intersects(btn, txt)) {
        fail.push(`${ctx} [${key}]: button "${String(btn.text).slice(0, 20)}" overlaps text "${String(txt.text).slice(0, 24)}"`);
      }
    }
  }
}

async function bootTitle(page, lang) {
  await page.addInitScript((seed) => localStorage.setItem('no-ai-act-save-v1', seed), SEED_WITH_PROGRESS);
  await page.goto(`${BASE}/play/?lang=${lang}`, { waitUntil: 'load' });
  await page.waitForTimeout(9000); // Phaser boot
  await page.waitForFunction(() => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true);
    return a.length && a[a.length - 1].scene.key === 'Title';
  }, { timeout: 15000 }).catch(() => {});
}

async function gotoBriefing(page) {
  // reducedMotion is seeded, so BriefingScene reveals the CTA + onboarding line
  // synchronously on create — no canvas click needed (a click risks hitting the
  // CTA and advancing to CityMap). Just start it and wait for the CTA to show.
  await page.evaluate(() => window.game.scene.start('Briefing'));
  await page.waitForFunction(() => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true); const s = a[a.length - 1];
    if (!s || s.scene.key !== 'Briefing') return false;
    return s.children.list.some((o) => o.type === 'Container' && o.input && o.input.enabled && o.visible);
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(200);
}

// ---- canvas viewports: Title + Briefing geometry (IT everywhere, EN once) ----
for (const vp of CANVAS_VIEWPORTS) {
  for (const lang of vp.w === 1792 ? ['it', 'en'] : ['it']) {
    const ctx = `${vp.w}x${vp.h} ${lang}`;
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`[${ctx}] ${String(e)}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${ctx}] ${m.text()}`); });
    page.on('request', (r) => { try { hosts.add(new URL(r.url()).host); } catch { /* ignore */ } });

    await bootTitle(page, lang);
    assertSceneLayout(await page.evaluate(sceneReportFn), `${ctx} Title`, 'Title');
    await page.screenshot({ path: `${OUT}/title-${vp.w}x${vp.h}-${lang}.png` });

    await gotoBriefing(page);
    assertSceneLayout(await page.evaluate(sceneReportFn), `${ctx} Briefing`, 'Briefing');
    await page.screenshot({ path: `${OUT}/briefing-${vp.w}x${vp.h}-${lang}.png` });

    await context.close();
  }
}

// ---- 390×844 portrait: mobile guard + no horizontal overflow ----
{
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  mp.on('console', (m) => { if (m.type() === 'error') errors.push(`[390x844] ${m.text()}`); });
  await mp.goto(`${BASE}/play/?lang=it`, { waitUntil: 'domcontentloaded' });
  await mp.waitForTimeout(2500);
  const guardShown = await mp.evaluate(() => {
    const el = document.getElementById('mobile-guard');
    return !!el && getComputedStyle(el).display !== 'none';
  });
  if (!guardShown) fail.push('390x844: mobile guard not shown in portrait');
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail.push('390x844: horizontal overflow on /play/');
  await mp.screenshot({ path: `${OUT}/mobile-390x844.png` });
  await mctx.close();
}

await browser.close();

// ---- privacy / stability assertions (shared with gameplay smoke) ----
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`console errors: ${JSON.stringify(relevantErrors.slice(0, 6))}`);
const externalHosts = [...hosts].filter((h) => !h.startsWith('localhost'));
const disallowed = externalHosts.filter((h) => !GAME_HOSTS_ALLOWED.some((a) => h.includes(a)));
if (disallowed.length) fail.push(`unexpected network host(s): ${JSON.stringify(disallowed)}`);

console.log('layout smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  external hosts:', JSON.stringify(externalHosts));
console.log('  console errors:', relevantErrors.length);
console.log('  screenshots:', OUT);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ Title + Briefing safe-area clean across desktop/tablet/mobile, IT + EN');

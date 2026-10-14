import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const routes = [...cfg.pairs.map(p => p.fr), ...Object.values(cfg.frForEn)].filter(Boolean);
const port = 4211;
const base = `http://localhost:${port}`;
const out = 'artifacts/french-localization';
mkdirSync(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
let browser;
const failures = [];
const results = [];
try {
  let up = false;
  for (let n = 0; n < 100 && !up; n++) {
    if (server.exitCode !== null) throw new Error('Preview server exited');
    try { up = (await fetch(base)).ok; } catch { /* wait for preview */ }
    if (!up) await new Promise(r => setTimeout(r, 200));
  }
  assert(up, 'Preview unavailable');
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  const context = await browser.newContext();
  await context.route(/cloudflareinsights\.com/, r => r.abort());
  const page = await context.newPage();
  page.on('pageerror', e => failures.push(String(e)));
  page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) failures.push(`${r.status()}: ${r.url()}`); });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(`${base}/${route}/`);
      await page.evaluate(async () => {
        await Promise.all([...document.images].map(async image => {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }));
      });
      const status = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        images: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)
      }));
      assert.equal(status.lang, 'fr', route);
      assert.equal(status.h1, 1, route);
      assert(!status.overflow, `${route}: overflow at ${viewport.width}`);
      assert.deepEqual(status.images, [], `${route}: broken images`);
      for (const dimensions of await page.locator('.press-gallery img').evaluateAll(images => images.map(img => ({ width: img.clientWidth, height: img.clientHeight })))) {
        assert(Math.abs(dimensions.height - dimensions.width * 9 / 16) < 2, `${route}: distorted press image at ${viewport.width}`);
      }
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.textContent);
      assert.match(focused ?? '', /Aller au contenu/, `${route}: skip link`);
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => location.hash), '#main');
      results.push({ route, width: viewport.width, ...status });
      if (['fr', 'fr/dossier-de-presse', 'fr/activites-pedagogiques', 'fr/sanctions-ai-act'].includes(route)) {
        await page.goto(`${base}/${route}/`);
        await page.locator('img').evaluateAll(async images => {
          await Promise.all(images.map(async img => { img.loading = 'eager'; await img.decode(); }));
        });
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${out}/${route.replaceAll('/', '-')}-${viewport.width}.png`, fullPage: true });
      }
    }
    await page.goto(`${base}/fr/`);
    if (viewport.width < 600) await page.locator('.nav-toggle').click();
    const btn = page.locator('.nav-sub-btn').filter({ hasText: /^Projet$/ });
    await btn.focus();
    await page.keyboard.press('Enter');
    assert.equal(await btn.getAttribute('aria-expanded'), 'true');
    await page.getByRole('link', { name: /Dossier de presse/ }).first().click();
    assert.match(page.url(), /\/fr\/dossier-de-presse\//);
  }
  for (const viewport of process.env.FR_SITE_ONLY ? [] : [{ width: 1920, height: 1080 }, { width: 3840, height: 2160 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/play/?lang=fr`);
    await page.waitForFunction(() => window.game?.scene?.getScenes(true).some(s => s.scene.key === 'Title'),undefined,{timeout:60000});
    await page.waitForTimeout(600);
    const language = await page.evaluate(() => JSON.parse(localStorage.getItem('no-ai-act-save-v2')).language);
    assert.equal(language, 'fr');
    await page.goto(`${base}/play/`);
    await page.waitForFunction(() => window.game?.scene?.getScenes(true).some(s => s.scene.key === 'Title'),undefined,{timeout:60000});
    const state = await page.evaluate(() => {
      const scene = window.game.scene.getScene('Title');
      const texts = [];
      function visit(o) { if (o.visible === false) return; if (typeof o.text === 'string') texts.push(o.text); for (const c of o.list ?? []) visit(c); }
      for (const o of scene.children.list) visit(o);
      const canvas = document.querySelector('canvas');
      return { texts, width: canvas.width, height: canvas.height, saved: JSON.parse(localStorage.getItem('no-ai-act-save-v2')).language };
    });
    assert.equal(state.saved, 'fr');
    assert(state.texts.some(t => /NOUVELLE PARTIE/.test(t)), 'French menu after queryless reload');
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    assert.equal(await page.locator('#reading-toggle').textContent(), "Texte de l'écran");
    if (viewport.width < 560) {
      assert(await page.locator('body').evaluate(b => b.classList.contains('mobile-presentation')));
      assert.equal(await page.locator('#mobile-guard').isVisible(), false, 'No legacy mobile blocker');
      assert.equal(await page.locator('#reading-toggle').isVisible(), false, 'Compact reading is always visible');
      assert(await page.locator('#reading-layer').isVisible(), 'French mobile text must be directly readable');
      assert(await page.getByRole('button', { name: 'NOUVELLE PARTIE', exact: true }).isVisible());
      assert.equal(await page.evaluate(() => document.getElementById('app').scrollWidth <= innerWidth + 1), true);
    } else {
      await page.locator('#reading-toggle').click();
      assert.equal(await page.locator('#reading-toggle').getAttribute('aria-pressed'), 'true');
      await page.locator('#reading-toggle').click();
    }
    assert.equal(await page.locator('#reading-layer').getAttribute('lang'), 'fr');
    await page.screenshot({ path: `${out}/game-menu-${viewport.width}.png` });
    results.push({ game: 'Title', viewport, ...state });
  }
  assert.deepEqual(failures, []);
  writeFileSync(`${out}/results.json`, JSON.stringify({ results, failures, siteOnly: Boolean(process.env.FR_SITE_ONLY) }, null, 2));
  console.log(process.env.FR_SITE_ONLY
    ? `PASS: ${routes.length} French routes at desktop/mobile and keyboard site navigation; game resolution/persistence profiles not run.`
    : `PASS: ${routes.length} French routes at desktop/mobile, keyboard navigation, FR persistence and 3 game resolutions.`);
} finally {
  await browser?.close();
  server.kill();
}

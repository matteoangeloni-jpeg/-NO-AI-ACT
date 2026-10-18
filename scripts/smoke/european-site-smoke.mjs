import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { publicRoutes, languageCode } from '../../src/site/route-inventory.mjs';

const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const routes = publicRoutes(cfg).filter(r => ['de', 'es', 'pt'].includes(r.lang));
const base = process.env.BASE ?? 'http://localhost:4218';
const out = 'artifacts/european-localization';
mkdirSync(out, { recursive: true });
const server = process.env.BASE ? null : spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4218', '--strictPort'], { stdio: 'ignore' });
let browser;
const results = [];
const errors = [];
try {
  let ready = false;
  for (let i = 0; i < 100 && !ready; i++) {
    if (server && server.exitCode !== null) throw new Error('Preview port unavailable');
    try { ready = (await fetch(base)).ok; } catch { /* preview startup */ }
    if (!ready) await new Promise(r => setTimeout(r, 200));
  }
  assert(ready, 'Preview unavailable');
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  const context = await browser.newContext();
  await context.route(/cloudflareinsights\.com/, r => r.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(`${base}/${route.dir}/`);
      await page.locator('img').evaluateAll(async images => {
        await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
      });
      await page.locator('h1').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
      assert(await page.locator('h1').evaluate(el => Number(getComputedStyle(el).opacity) > 0.95), `${route.dir}: hidden heading`);
      const state = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        h1: document.querySelectorAll('h1').length,
        missingImages: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)
      }));
      assert.equal(state.lang, languageCode(route.lang));
      assert.equal(state.h1, 1);
      assert(!state.overflow, `${route.dir}: overflow at ${width}`);
      assert.deepEqual(state.missingImages, []);
      await page.keyboard.press('Tab');
      assert(await page.locator('.skip-link').evaluate(el => el === document.activeElement));
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => location.hash), '#main');
      if (width < 600) await page.locator('.nav-toggle').click();
      const menu = page.locator('.nav-sub-btn');
      await menu.focus();
      await page.keyboard.press('Enter');
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${route.dir}: open menu overflow at ${width}`);
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      if (width < 600) await page.keyboard.press('Escape');
      if (route.dir === route.lang) {
        const track = page.locator('.press-track');
        await track.scrollIntoViewIfNeeded();
        await page.locator('[data-press-next]').click();
        await page.waitForTimeout(500);
        assert(await track.evaluate(el => el.scrollLeft > 0), `${route.dir}: carousel did not move`);
        await page.goto(`${base}/${route.dir}/`);
        await page.screenshot({ path: `${out}/${route.lang}-${width}.png`, fullPage: true, animations: 'disabled' });
      }
      results.push({ route: route.dir, width, ...state });
    }
  }
  // Brand/intent edits must also keep the established IT/EN/FR heroes readable.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ['it', 'en', 'fr', 'de', 'es', 'pt']) {
      await page.goto(`${base}/${lang === 'it' ? '' : `${lang}/`}`);
      await page.locator('h1').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
      const state = await page.evaluate(() => {
        const heading = document.querySelector('h1');
        const lead = document.querySelector('.hero .lead');
        const h = heading.getBoundingClientRect(), p = lead.getBoundingClientRect();
        return { title: heading.textContent, overflow: document.documentElement.scrollWidth > innerWidth + 1,
          overlap: h.bottom > p.top + 1, outside: h.left < 0 || h.right > innerWidth + 1 };
      });
      assert(state.title.includes('NO AI ACT'), `${lang}: product identity`);
      assert(!state.overflow && !state.overlap && !state.outside, `${lang}: hero layout at ${width}`);
      assert.equal(await page.locator('.locale-links a').count(), 6);
      await page.screenshot({ path: `${out}/home-${lang}-${width}.png`, animations: 'disabled' });
    }
  }
  // The fallback is usable without scripts, not a JS-only language router.
  const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plain = await fallback.newPage();
  for (const lang of ['de', 'es', 'pt']) {
    await plain.goto(`${base}/${lang}/`);
    assert.equal(await plain.locator('.locale-links a').count(), 6);
    assert(await plain.locator('#eu-topics').isVisible());
    assert(!await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${lang}: no-JS overflow`);
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/results.json`, JSON.stringify({ generated: new Date().toISOString(), pass: true, results }, null, 2));
  console.log(`PASS: ${results.length} route/viewport checks, 12 six-language home layouts, menus, carousel and no-JS navigation.`);
} finally {
  await browser?.close();
  server?.kill();
}

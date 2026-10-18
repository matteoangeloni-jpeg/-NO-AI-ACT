import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const base = 'http://localhost:4217';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4217', '--strictPort'], { stdio: 'ignore' });
const out = 'scripts/smoke/out/usage-notice';
mkdirSync(out, { recursive: true });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60 && server.exitCode === null; i++) {
    try { ready = (await fetch(base)).ok; } catch { /* preview starting */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, 'preview must start');
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 720 } });
    await context.route(/cloudflareinsights\.com/, route => route.abort());
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${base}/play/?lang=it`);
    const bar = page.locator('#game-usage'); const reopen = page.locator('#usage-reopen');
    await bar.waitFor();
    await bar.waitFor({ state: 'hidden', timeout: 12000 });
    assert(await reopen.isVisible());
    assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue('--usage-bar-height')), '0px');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 1280) {
      const lost = await page.evaluate(() => innerHeight - document.querySelector('canvas').getBoundingClientRect().height);
      assert(lost <= 40, `collapsed notice must return game space: ${lost}`);
    }
    await page.screenshot({ path: `${out}/collapsed-${width}.png` });
    await reopen.click();
    await page.waitForTimeout(9000);
    assert(await bar.isVisible(), 'keyboard focus must prevent timed dismissal');
    await page.locator('#usage-close').press('Escape');
    assert(!(await bar.isVisible()));
    assert(await reopen.evaluate(element => element === document.activeElement));
    await reopen.click(); await page.locator('#usage-close').click();
    assert(!(await bar.isVisible()));
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`PASS ${width}px: auto-hide, reclaimed game space, shield, close, Escape and focus`);
  }
} finally {
  await browser?.close();
  server.kill();
}

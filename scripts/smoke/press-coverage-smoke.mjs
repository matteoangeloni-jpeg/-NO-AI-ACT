import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { preview } from 'vite';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const out = resolve('scripts/smoke/out/press-coverage');
mkdirSync(out, { recursive: true });
const server = process.env.BASE ? undefined : await preview({ preview: { host: '127.0.0.1', port: 0 } });
const base = process.env.BASE ?? `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
try {
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await context.route(/cloudflareinsights\.com/, route => route.abort());
    for (const [lang, path] of [['it', '/'], ['en', '/en/']]) {
      const page = await context.newPage();
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      const section = page.locator('section[aria-labelledby="press-title"]');
      for (const href of [
        'https://www.fixgamingchannel.com/fix-stories-no-ai-act-matteo-angeloni/',
        'https://www.youtube.com/watch?v=BJO6aiElmrY',
        'https://www.absolutegamer.it/no-ai-act-serious-game-gratuito-ai-act-europeo/'
      ]) assert.equal(await section.locator(`a[href="${href}"]`).count(), 1);
      assert.equal(await section.locator('time[datetime="2026-10-16"]').count(), 1);
      assert.equal(await section.locator('time[datetime="2026-10-03"]').count(), 1);
      assert.match(await section.innerText(), lang === 'it' ? /non una recensione indipendente/ : /not an independent review/);
      assert.match(await section.innerText(), lang === 'it' ? /prima della nuova beta/ : /before the new beta/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      const track = section.locator('.press-track');
      await section.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.press-media img')].every(img => img.complete && img.naturalWidth > 0));
      assert.equal(await section.locator('.press-media img').count(), 3);
      assert.equal(await section.locator('.press-controls svg').count(), 2);
      assert.equal(await section.locator('[data-press-prev]').isDisabled(), true);
      await section.locator('[data-press-next]').click();
      await page.waitForFunction(() => document.getElementById('press-track').scrollLeft > 20);
      await track.focus(); await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelector('[data-press-next]').disabled);
      const last = section.locator('.press-item').last();
      assert(await last.evaluate(el => el.getBoundingClientRect().right <= el.parentElement.getBoundingClientRect().right + 3));
      await section.screenshot({ path: resolve(out, `${lang}-${width}-last.png`) });
      await page.keyboard.press('Home');
      await page.waitForFunction(() => document.querySelector('[data-press-prev]').disabled);
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.getElementById('press-track').scrollLeft > 20);
      await section.locator('[data-press-prev]').click();
      await page.waitForFunction(() => document.getElementById('press-track').scrollLeft <= 3);
      assert(await section.locator('.press-copy').evaluateAll(elements => elements.every(el => el.scrollWidth <= el.clientWidth + 1)));
      await section.screenshot({ path: resolve(out, `${lang}-${width}.png`) });
      console.log(`PASS ${lang} ${width}px: three local images, dates, attribution, arrows, keyboard, boundaries, no overflow`);
      await page.close();
    }
    await context.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
  const fallback = await noJS.newPage(); await fallback.goto(base);
  assert.equal(await fallback.locator('.press-controls').isVisible(), false);
  assert.equal(await fallback.locator('.press-track a').count(), 3);
  assert(await fallback.locator('.press-track').evaluate(el => el.scrollWidth > el.clientWidth));
  await noJS.close();
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.httpServer.close(resolve));
}

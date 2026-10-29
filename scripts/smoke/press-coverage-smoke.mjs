import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { preview } from 'vite';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { PRESS_ITEMS } from '../../src/site/press-coverage.mjs';

// Le frasi che devono sopravvivere alla traduzione: l'avvertenza che
// distingue un racconto dell'autore da una recensione indipendente, e la
// nota che la partita e' anteriore alla nuova beta. Una traduzione che le
// perde cambia cosa il sito attribuisce a una testata.
const INDIPENDENTE = { it: /non una recensione indipendente/, en: /not an independent review/, fr: /pas une critique indépendante/ };
const BETA = { it: /prima della nuova beta/, en: /before the new beta/, fr: /avant la nouvelle bêta/ };

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
    for (const [lang, path] of [['it', '/'], ['en', '/en/'], ['fr', '/fr/']]) {
      const page = await context.newPage();
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      const section = page.locator('section[aria-labelledby="press-title"]');
      // Gli indirizzi e le date si DERIVANO da src/site/press-coverage.mjs:
      // erano tre URL copiati qui, cioe' una quinta copia degli stessi fatti,
      // e una uscita nuova li avrebbe lasciati indietro senza rompere niente.
      for (const item of PRESS_ITEMS) {
        assert.equal(await section.locator(`a[href="${item.url}"]`).count(), 1, `${lang}: ${item.id}`);
        assert.equal(await section.locator(`time[datetime="${item.date}"]`).count(), 1, `${lang}: data di ${item.id}`);
      }
      assert.match(await section.innerText(), INDIPENDENTE[lang]);
      assert.match(await section.innerText(), BETA[lang]);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      const track = section.locator('.press-track');
      await section.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.press-media img')].every(img => img.complete && img.naturalWidth > 0));
      assert.equal(await section.locator('.press-media img').count(), PRESS_ITEMS.length);
      assert(await section.locator('.press-media img').evaluateAll(imgs => imgs.every(img => {
        const url = new URL(img.currentSrc); return url.origin === location.origin && url.pathname.startsWith('/assets/press/');
      })));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
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
      console.log(`PASS ${lang} ${width}px: ${PRESS_ITEMS.length} local images, dates, attribution, arrows, keyboard, boundaries, no overflow`);
      await page.close();
    }
    await context.close();
  }
  const animated = await browser.newContext({ viewport: { width: 390, height: 1000 }, reducedMotion: 'no-preference' });
  const rapid = await animated.newPage(); await rapid.goto(base);
  await rapid.locator('[data-press-next]').dblclick({ delay: 30 });
  await rapid.waitForFunction(() => document.querySelector('[data-press-next]').disabled);
  await rapid.locator('[data-press-prev]').dblclick({ delay: 30 });
  await rapid.waitForFunction(() => document.querySelector('[data-press-prev]').disabled);
  await rapid.locator('.press-track').focus();
  await rapid.keyboard.press('ArrowRight'); await rapid.keyboard.press('ArrowRight');
  await rapid.waitForFunction(() => document.querySelector('[data-press-next]').disabled);
  await animated.close();
  console.log('PASS rapid repeated navigation with smooth motion');
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
  const fallback = await noJS.newPage(); await fallback.goto(base);
  assert.equal(await fallback.locator('.press-controls').isVisible(), false);
  assert.equal(await fallback.locator('.press-track a').count(), PRESS_ITEMS.length);
  assert(await fallback.locator('.press-track').evaluate(el => el.scrollWidth > el.clientWidth));
  await noJS.close();
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.httpServer.close(resolve));
}

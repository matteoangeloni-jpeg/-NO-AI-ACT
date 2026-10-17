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
  for (const width of [390, 1440]) {
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
      await section.screenshot({ path: resolve(out, `${lang}-${width}.png`) });
      console.log(`PASS ${lang} ${width}px: three sources, dates, attribution, no overflow`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.httpServer.close(resolve));
}

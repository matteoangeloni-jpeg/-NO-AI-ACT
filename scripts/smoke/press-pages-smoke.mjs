/**
 * Visual smoke for the v2.3 SEO guides and press kit at desktop and mobile
 * widths. It catches horizontal overflow, missing primary content and broken
 * press imagery, while preserving screenshots for human review.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(root, 'scripts/smoke/out/press-pages');
mkdirSync(out, { recursive: true });

const pages = [
  ['provider-deployer', '/provider-deployer-ai-act/'],
  ['public-administration', '/ai-act-pubblica-amministrazione/'],
  ['fria', '/fria-ai-act-valutazione-diritti-fondamentali/'],
  ['press-kit', '/press-kit/'],
  ['provider-deployer-en', '/en/provider-deployer-ai-act/'],
  ['public-administration-en', '/en/ai-act-public-administration/'],
  ['fria-en', '/en/fria-ai-act-fundamental-rights-impact-assessment/'],
  ['press-kit-en', '/en/press-kit/']
];
const viewports = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }]
];
const failures = [];

const browser = await chromium.launch(smokeBrowserLaunchOptions());
for (const [viewportName, viewport] of viewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  await context.route(/cloudflareinsights\.com/, (route) => route.abort());

  for (const [name, route] of pages) {
    // A fresh page avoids stale composited layers from sticky navigation after
    // long press-gallery scrolls, keeping the saved screenshots trustworthy.
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => {
      if (message.type() === 'error' && !/ERR_FAILED|cloudflareinsights/.test(message.text())) {
        errors.push(message.text());
      }
    });
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const state = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: document.documentElement.scrollWidth
    }));
    if (!state.title || !state.h1) failures.push(`${viewportName}/${name}: title o h1 mancante`);
    if (state.contentWidth > state.viewportWidth + 1) {
      failures.push(`${viewportName}/${name}: overflow orizzontale ${state.contentWidth}px > ${state.viewportWidth}px`);
    }

    if (name.startsWith('press-kit')) {
      const galleryImages = page.locator('.press-gallery img');
      for (let index = 0; index < await galleryImages.count(); index += 1) {
        const image = galleryImages.nth(index);
        await image.scrollIntoViewIfNeeded();
        const handle = await image.elementHandle();
        await page.waitForFunction(
          (element) => element?.complete && element.naturalWidth > 0,
          handle,
          { timeout: 5000 }
        );
      }
      const broken = await galleryImages.evaluateAll((images) => images
        .filter((image) => !image.complete || image.naturalWidth !== 1920 || image.naturalHeight !== 1080)
        .map((image) => image.getAttribute('src')));
      if (broken.length) failures.push(`${viewportName}/${name}: immagini press non valide ${JSON.stringify(broken)}`);
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    if (!name.endsWith('-en')) {
      await page.screenshot({ path: resolve(out, `${viewportName}-${name}.png`), fullPage: false });
    }
    if (errors.length) failures.push(`${viewportName}/${name}: errori console ${JSON.stringify(errors)}`);
    await page.close();
  }

  await context.close();
}
await browser.close();

if (failures.length) {
  console.error('press pages smoke — FAIL');
  for (const failure of failures) console.error(`  x ${failure}`);
  process.exit(1);
}
console.log('press pages smoke — PASS');
console.log(`  screenshots: ${out}`);
console.log('  ok 8 pagine IT/EN, desktop/mobile, zero overflow e 10 immagini Full HD valide');

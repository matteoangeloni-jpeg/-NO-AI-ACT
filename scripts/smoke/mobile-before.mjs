import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
const out = 'scripts/smoke/out/mobile-ux';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(smokeBrowserLaunchOptions());
try {
  for (const [width, height] of [[390, 844], [844, 390], [768, 1024]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.route(/cloudflareinsights/, r => r.abort());
    await page.addInitScript(() => localStorage.setItem('no-ai-act-save-v2', JSON.stringify({ version: 2, briefingSeen: true, reducedMotion: true, audioMuted: true })));
    await page.goto('http://localhost:4212/play/?lang=it');
    await page.waitForFunction(() => window.game?.scene.isActive('Title'));
    if (await page.locator('.mg-continue').isVisible()) await page.locator('.mg-continue').click();
    await page.evaluate(() => { window.game.scene.stop('Title'); window.game.scene.start('Case', { caseId: 'case_scoring' }); });
    await page.waitForFunction(() => window.game.scene.isActive('Case'));
    await page.screenshot({ path: `${out}/before-${width}-case.png` });
    console.log(`before ${width}: captured`);
    await page.close();
  }
} finally { await browser.close(); }

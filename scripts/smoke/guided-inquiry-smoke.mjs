import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const port = Number(process.env.INQUIRY_PORT || 4245);
const base = 'http://127.0.0.1:' + port;
const out = 'scripts/smoke/out/guided-inquiry';
mkdirSync(out, { recursive: true });
const server = await createServer({
  server: { host: '127.0.0.1', port, strictPort: true, watch: { ignored: ['**/graphify-out/**'] } },
  mode: 'test',
  define: { 'import.meta.env.VITE_ANALYTICS_PROVIDER': JSON.stringify('console') }
});
await server.listen();
let browser;
const results = [];
const errors = [];
let current;
async function scene(page, name) {
  await page.waitForFunction(key => window.game?.scene.isActive(key), name, { timeout: 90000 });
  await page.waitForTimeout(250);
}
async function activate(page, label) {
  const button = page.getByRole('button', { name: label, exact: true });
  await button.focus();
  await page.keyboard.press('Enter');
  await page.evaluate(() => {
    if (!document.querySelector('.guided-inquiry')) document.activeElement?.blur();
  });
}
async function copy(page) {
  return page.evaluate(async () => {
    const { StateManager } = await import('/src/game/systems/StateManager.ts');
    return (await import('/src/game/i18n/guidedInquiry.ts')).GUIDED_COPY[StateManager.language];
  });
}
async function openCase(page) {
  await page.evaluate(() => {
    for (const active of window.game.scene.getScenes(true)) active.scene.stop();
    window.game.scene.start('Case', { caseId: 'case_scoring' });
  });
  await scene(page, 'Case');
}
try {
  for (const [language, width, height] of [
    ['it', 1920, 1080], ['en', 390, 844], ['fr', 390, 844],
    ['it', 320, 800], ['fr', 3840, 2160], ['en', 640, 360]
  ]) {
    if (process.env.INQUIRY_ONLY && process.env.INQUIRY_ONLY !== language + '-' + width) continue;
    // Separate browser processes release software-WebGL resources between profiles.
    browser = await chromium.launch(smokeBrowserLaunchOptions());
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const requests = [];
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin !== base) {
        requests.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    await context.addInitScript(lang => localStorage.setItem('no-ai-act-save-v2', JSON.stringify({
      version: 2, language: lang, briefingSeen: true, reducedMotion: true, audioMuted: true,
      gameMode: 'turno', sessionMinutes: 15
    })), language);
    const page = await context.newPage();
    current = page;
    page.on('pageerror', e => errors.push(String(e)));
    page.setDefaultTimeout(30000);
    await page.goto(base + '/play/?lang=' + language, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await scene(page, 'Title');
    // Use the real new-game menu, then select a fixed dossier for reproducibility.
    const newGame = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.menu.newGame);
    await activate(page, newGame);
    const start = page.getByRole('button', { name: /^(INIZIA|START|COMMENCER)/ }).first();
    await start.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => ['Case', 'Briefing', 'CityMap'].some(key => window.game.scene.isActive(key)));
    await openCase(page);
    const ui = await copy(page);
    await activate(page, ui.entry);
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.equal(await dialog.getAttribute('lang'), language);
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => !!document.activeElement?.closest('dialog')), 'focus left dialog');
    }
    assert(await dialog.innerText().then(text => text.includes(ui.purpose)));
    const marker = 'PRIVATE_' + language + '_' + width;
    await dialog.locator('textarea[name=hypothesis]').fill(marker + ' initial');
    // Escape must return to the case without consuming a scene shortcut.
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await scene(page, 'Case');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), ui.entry);
    await activate(page, ui.entry);
    assert.equal(await page.locator('textarea[name=hypothesis]').inputValue(), marker + ' initial');
    const overflow = await dialog.evaluate(el => el.scrollWidth > el.clientWidth + 2);
    assert.equal(overflow, false, language + width + ': dialog overflow');
    await page.screenshot({ path: out + '/' + language + '-' + width + '-intro.png' });
    await activate(page, ui.continue);
    await scene(page, 'Evidence');
    await activate(page, ui.notebook);
    assert(await dialog.innerText().then(text => text.includes(marker + ' initial')));
    await dialog.locator('textarea[name=hypothesis]').fill(marker + ' revised');
    await dialog.locator('textarea[name=evidence]').fill(marker + ' evidence relation');
    await dialog.locator('textarea[name=alternative]').fill(marker + ' alternative');
    await dialog.locator('textarea[name=uncertainty]').fill(marker + ' missing information');
    await activate(page, ui.close);
    await prepareEvidenceWithKeyboard(page, { citeIndices: [0, 1], settleMs: 80 });
    const proceedLabel = await page.evaluate(async () =>
      (await import('/src/game/i18n/index.ts')).L().ui.evidence.proceedButton);
    await activate(page, proceedLabel);
    await scene(page, 'Decision');
    await completeDecisionWithKeyboard(page, ['1', '1', '3', '2']);
    const signLabel = await page.evaluate(async () =>
      (await import('/src/game/i18n/index.ts')).L().ui.decision.sign);
    await activate(page, signLabel);
    await dialog.waitFor();
    assert.equal(await page.evaluate(() => window.game.scene.isActive('Report')), false);
    assert.equal(await dialog.locator('textarea[name=hypothesis]').inputValue(), marker + ' revised');
    // Enter in the writing surface must never sign.
    await dialog.locator('textarea[name=evidence]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => window.game.scene.isActive('Report')), false);
    await activate(page, ui.confirm);
    await scene(page, 'Report');
    await activate(page, ui.debrief);
    assert.equal(await dialog.locator('textarea[name=hypothesis]').count(), 0);
    assert(await dialog.innerText().then(text => text.includes(marker + ' revised')));
    await dialog.locator('textarea[name=reflection]').fill(marker + ' feedback reflection');
    await page.screenshot({ path: out + '/' + language + '-' + width + '-reflection.png' });
    await activate(page, ui.close);
    await activate(page, ui.debrief);
    assert.equal(await dialog.locator('textarea[name=reflection]').inputValue(), marker + ' feedback reflection');
    await activate(page, ui.close);
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    const telemetry = await page.evaluate(() => JSON.stringify(window.playerTelemetry.snapshot()));
    assert(!stored.includes(marker), 'free text in save');
    assert(!telemetry.includes(marker), 'free text in telemetry');
    const continueLabel = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.report.continueButton);
    await activate(page, continueLabel);
    await scene(page, 'Consequence');
    await page.keyboard.press('Enter');
    await scene(page, 'NormCard');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => ['CityMap', 'SessionEnd'].some(key => window.game.scene.isActive(key)));
    // A fixed session-end fixture tests the real final-debrief action.
    await page.evaluate(() => {
      if (window.game.scene.isActive('SessionEnd')) return;
      for (const active of window.game.scene.getScenes(true)) active.scene.stop();
      window.game.scene.start('SessionEnd');
    });
    await scene(page, 'SessionEnd');
    await activate(page, ui.finalDebrief);
    assert(await dialog.innerText().then(text => text.includes(marker + ' feedback reflection')));
    await activate(page, ui.close);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await scene(page, 'Title');
    const cleared = await page.evaluate(async () =>
      !(await import('/src/game/systems/GuidedInquiry.ts')).GuidedInquiry.active('case_scoring'));
    assert(cleared, 'reload must clear ephemeral notes');
    assert.deepEqual(requests, []);
    results.push({ language, width, height, path: 'PASS', privateText: 'memory only', externalRequests: 0 });
    writeFileSync(out + '/progress.json', JSON.stringify({ results, errors }, null, 2));
    console.log(language + '-' + width + ': guided investigation, argument, reflection, final debrief PASS');
    await context.close();
    await browser.close();
    browser = undefined;
  }
  assert.deepEqual(errors, []);
  assert.equal(results.length, process.env.INQUIRY_ONLY ? 1 : 6, 'expected profile coverage');
  writeFileSync(out + '/results.json', JSON.stringify({ results, errors, humanValidation: false }, null, 2));
} catch (error) {
  console.error('Page errors:', errors);
  console.error(await current?.evaluate(() => ({
    scenes: window.game?.scene.getScenes(true).map(s => s.scene.key),
    reading: document.querySelector('#reading-layer')?.textContent
  })).catch(() => null));
  await current?.screenshot({ path: out + '/failure.png', timeout: 60000 }).catch(() => {});
  throw error;
} finally {
  await browser?.close();
  await server.close();
}

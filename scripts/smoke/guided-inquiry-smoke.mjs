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
  server: { host: '127.0.0.1', port, strictPort: true, watch: { ignored: ['**/graphify-out/**', '**/scripts/smoke/out/**'] } },
  mode: 'test', define: { 'import.meta.env.VITE_ANALYTICS_PROVIDER': JSON.stringify('console') }
});
await server.listen();
let browser; let current;
const results = []; const errors = [];
async function scene(page, name) {
  await page.waitForFunction(key => window.game?.scene.isActive(key), name, { timeout: 90000 });
  await page.waitForTimeout(180);
}
async function activate(page, label) {
  const control = page.getByRole('button', { name: label, exact: true });
  await control.focus(); await page.keyboard.press('Enter');
  await page.evaluate(() => { if (!document.querySelector('.guided-inquiry')) document.activeElement?.blur(); });
}
async function openCase(page, caseId) {
  await page.evaluate(id => {
    for (const active of window.game.scene.getScenes(true)) active.scene.stop();
    window.game.scene.start('Case', { caseId: id });
  }, caseId);
  await scene(page, 'Case');
}
const profiles = [
  ['it', 1920, 1080, true], ['en', 390, 844, true], ['fr', 390, 844, true],
  ['it', 320, 800, false], ['fr', 3840, 2160, false], ['en', 640, 360, false]
];
try {
  for (const [language, width, height, catalog] of profiles) {
    if (process.env.INQUIRY_ONLY && process.env.INQUIRY_ONLY !== language + '-' + width) continue;
    const launch = smokeBrowserLaunchOptions();
    if (width >= 3000 && process.env.INQUIRY_4K_GPU === 'd3d11') launch.args = ['--use-gl=angle', '--use-angle=d3d11'];
    browser = await chromium.launch(launch);
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 800 });
    const requests = [];
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin !== base || route.request().method() === 'POST') {
        requests.push(route.request().url()); return route.abort();
      }
      return route.continue();
    });
    await context.addInitScript(lang => {
      if (!localStorage.getItem('no-ai-act-save-v2')) localStorage.setItem('no-ai-act-save-v2', JSON.stringify({
        version: 2, language: lang, briefingSeen: true, reducedMotion: true, audioMuted: true,
        gameMode: 'libera', sessionMinutes: 15
      }));
    }, language);
    const page = await context.newPage(); current = page;
    page.on('pageerror', e => errors.push(String(e))); page.setDefaultTimeout(30000);
    await page.goto(base + '/play/?lang=' + language, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await scene(page, 'Title');
    const renderer = await page.evaluate(() => {
      const gl = window.game.renderer.gl;
      if (!gl) return 'Canvas';
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    });
    const newGame = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.menu.newGame);
    await activate(page, newGame);
    const start = page.getByRole('button', { name: /^(INIZIA|START|COMMENCER)/ }).first();
    await start.focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => ['Case', 'Briefing', 'CityMap'].some(key => window.game.scene.isActive(key)));
    const ui = await page.evaluate(async () => {
      const { StateManager } = await import('/src/game/systems/StateManager.ts');
      return (await import('/src/game/i18n/guidedInquiry.ts')).GUIDED_COPY[StateManager.language];
    });
    const cases = await page.evaluate(async () => (await import('/src/game/data/cases.ts')).PLAYABLE_CASES);
    const selected = process.env.INQUIRY_CASE ? cases.filter(data => data.id === process.env.INQUIRY_CASE)
      : catalog ? cases : cases.filter(data => data.id === 'case_scoring');
    for (const data of selected) {
      const caseId = data.id; const marker = `PRIVATE_${language}_${width}_${caseId}`;
      await openCase(page, caseId); await activate(page, ui.entry);
      const dialog = page.getByRole('dialog'); await dialog.waitFor();
      assert.equal(await dialog.getAttribute('lang'), language);
      const scaffold = await page.evaluate(async id => {
        const { StateManager } = await import('/src/game/systems/StateManager.ts');
        return (await import('/src/game/i18n/inquiryCases.ts')).caseInquiry(id, StateManager.language);
      }, caseId);
      assert((await dialog.innerText()).includes(scaffold.opening));
      for (let i = 0; i < 8; i += 1) {
        await page.keyboard.press('Tab');
        assert(await page.evaluate(() => !!document.activeElement?.closest('dialog')), 'focus left dialog');
      }
      await activate(page, ui.next); assert((await dialog.innerText()).includes(scaffold.source));
      await activate(page, ui.next);
      await dialog.locator('textarea[name=hypothesis]').fill(marker + ' initial');
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
      await scene(page, 'Case');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), ui.entry);
      await activate(page, ui.entry); await activate(page, ui.next); await activate(page, ui.next);
      assert.equal(await dialog.locator('textarea[name=hypothesis]').inputValue(), marker + ' initial');
      assert.equal(await dialog.evaluate(el => el.scrollWidth > el.clientWidth + 2), false, 'dialog overflow');
      if (caseId === 'case_scoring') await page.screenshot({ path: `${out}/${language}-${width}-intro.png` });
      await activate(page, ui.continue); await scene(page, 'Evidence');
      await prepareEvidenceWithKeyboard(page, { citeIndices: [...data.relevantClues], settleMs: 40 });
      await activate(page, ui.notebook);
      assert((await dialog.innerText()).includes(marker + ' initial'));
      const source = dialog.locator('details').filter({ has: page.locator('textarea[name="source-0"]') });
      await source.locator('summary').click();
      await dialog.locator('textarea[name="source-0"]').fill(marker + ' provenance and limits');
      await dialog.locator('textarea[name=hypothesis]').fill(marker + ' revised once');
      await dialog.locator('textarea[name=revisionReason]').fill(marker + ' a new source');
      await activate(page, ui.recordRevision);
      await dialog.locator('textarea[name=hypothesis]').fill(marker + ' revised twice');
      await dialog.locator('textarea[name=revisionReason]').fill(marker + ' contrasting evidence');
      await activate(page, ui.recordRevision);
      await dialog.locator('textarea[name="relation-reason"]').fill(marker + ' operational evidence versus promise');
      await dialog.locator('select[name="relation-kind"]').selectOption('challenges');
      await activate(page, ui.addRelation);
      for (const key of ['evidence', 'reasoning', 'alternative', 'uncertainty']) await dialog.locator(`textarea[name=${key}]`).fill(marker + ' ' + key);
      await activate(page, ui.close);
      assert.deepEqual(await page.evaluate(() => window.game.scene.getScene('Evidence').cards
        .flatMap((card, index) => card.isCited ? [index] : [])), [...data.relevantClues],
      'pointer and keyboard interaction inside the notebook changed the evidence selection');
      const proceed = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.evidence.proceedButton);
      await activate(page, proceed);
      if (data.hasIncident) { await scene(page, 'Incident'); await page.keyboard.press('1'); }
      await scene(page, 'Decision');
      await dialog.waitFor(); assert.equal(await dialog.getAttribute('data-stage'), 'method');
      assert((await dialog.innerText()).includes(scaffold.uncertainty)); await activate(page, ui.close);
      const keys = [
        ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'].indexOf(data.correctClassification) + 1,
        ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'].indexOf(data.correctMeasures[0]) + 1,
        ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'].indexOf(data.responsibleSubjectCorrect) + 1,
        data.correctMotivation + 1
      ].map(String);
      await completeDecisionWithKeyboard(page, keys);
      const sign = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.decision.sign);
      await activate(page, sign); await dialog.waitFor();
      assert.equal(await page.evaluate(() => window.game.scene.isActive('Report')), false);
      assert.equal(await dialog.locator('textarea[name=hypothesis]').inputValue(), marker + ' revised twice');
      await dialog.locator('textarea[name=evidence]').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => window.game.scene.isActive('Report')), false);
      await activate(page, ui.confirm); await scene(page, 'Report');
      const sealed = await page.evaluate(async id => {
        const { GuidedInquiry } = await import('/src/game/systems/GuidedInquiry.ts');
        const snapshot = GuidedInquiry.submitted(id);
        GuidedInquiry.write(id, 'reasoning', 'after feedback mutation');
        GuidedInquiry.writeSource(id, 0, 'after feedback mutation');
        return { snapshot, after: GuidedInquiry.submitted(id), quality: window.game.scene.getScene('Report').params.result.quality };
      }, caseId);
      assert.equal(sealed.quality, 'correct'); assert.deepEqual(sealed.snapshot, sealed.after);
      assert.equal(sealed.snapshot.revisions.length, 2); assert.equal(sealed.snapshot.relations.length, 1);
      assert.equal(sealed.snapshot.sources[0], marker + ' provenance and limits');
      await activate(page, ui.debrief); assert.equal(await dialog.locator('textarea[name=hypothesis]').count(), 0);
      assert((await dialog.innerText()).includes(scaffold.debrief));
      const preFeedback = dialog.locator('details').first(); await preFeedback.locator('summary').first().click();
      assert((await preFeedback.innerText()).includes(marker + ' revised twice'));
      for (const key of ['reflection', 'feedbackUse', 'transferPlan']) await dialog.locator(`textarea[name=${key}]`).fill(marker + ' ' + key);
      if (caseId === 'case_scoring') await page.screenshot({ path: `${out}/${language}-${width}-reflection.png` });
      await activate(page, ui.close); await activate(page, ui.debrief);
      assert.equal(await dialog.locator('textarea[name=reflection]').inputValue(), marker + ' reflection');
      await activate(page, ui.close);
      const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
      const telemetry = await page.evaluate(() => JSON.stringify(window.playerTelemetry.snapshot()));
      assert(!stored.includes('PRIVATE_'), 'free text in save'); assert(!telemetry.includes('PRIVATE_'), 'free text in telemetry');
      const continueLabel = await page.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.report.continueButton);
      await activate(page, continueLabel); await scene(page, 'Consequence'); await page.keyboard.press('Enter');
      await scene(page, 'NormCard'); await page.keyboard.press('Enter');
      await page.waitForFunction(() => ['CityMap', 'SessionEnd'].some(key => window.game.scene.isActive(key)));
      results.push({ language, width, height, renderer, caseId, path: 'PASS', relations: 1, revisions: 2, privateText: 'memory only' });
      writeFileSync(out + '/progress.json', JSON.stringify({ results, errors }, null, 2));
      console.log(`${language}-${width} ${caseId}: complete guided cycle PASS`);
    }
    await page.evaluate(() => {
      if (window.game.scene.isActive('SessionEnd')) return;
      for (const active of window.game.scene.getScenes(true)) active.scene.stop();
      window.game.scene.start('SessionEnd');
    });
    await scene(page, 'SessionEnd'); await activate(page, ui.finalDebrief);
    const dialog = page.getByRole('dialog');
    assert.equal(await dialog.locator(':scope > div:first-of-type > details').count(), selected.length);
    await dialog.locator('textarea[name=sessionReflection]').fill('PRIVATE_session_synthesis');
    await dialog.locator('textarea[name=sessionTransferPlan]').fill('PRIVATE_next_strategy');
    await activate(page, ui.close);
    await page.reload({ waitUntil: 'domcontentloaded' }); await scene(page, 'Title');
    assert(await page.evaluate(async () => (await import('/src/game/systems/GuidedInquiry.ts')).GuidedInquiry.caseIds().length === 0));
    assert.deepEqual(requests, []); await context.close(); await browser.close(); browser = undefined;
  }
  assert.deepEqual(errors, []);
  const expected = process.env.INQUIRY_CASE ? (process.env.INQUIRY_ONLY ? 1 : 6)
    : process.env.INQUIRY_ONLY ? (profiles.find(p => p[0] + '-' + p[1] === process.env.INQUIRY_ONLY)?.[3] ? 14 : 1) : 45;
  assert.equal(results.length, expected, 'expected complete catalog and profile coverage');
  writeFileSync(out + '/results.json', JSON.stringify({ results, errors, externalRequests: 0, humanValidation: false }, null, 2));
} catch (error) {
  console.error('Page errors:', errors);
  console.error(await current?.evaluate(() => ({ scenes: window.game?.scene.getScenes(true).map(s => s.scene.key),
    dialog: document.querySelector('dialog')?.dataset.stage, reading: document.querySelector('#reading-layer')?.textContent })).catch(() => null));
  await current?.screenshot({ path: out + '/failure.png', timeout: 60000 }).catch(() => {}); throw error;
} finally { await browser?.close(); await server.close(); }

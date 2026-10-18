import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';

const base = process.env.BASE || 'http://localhost:4212';
const out = 'scripts/smoke/out/gameplay-ux';
mkdirSync(out, { recursive: true });
// Case data has type-only imports. Read the actual catalog, not a second case list.
const compiled = ts.transpileModule(readFileSync('src/game/data/cases.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} };
vm.runInNewContext(compiled, sandbox);
const cases = sandbox.exports.PLAYABLE_CASES;
assert.equal(cases.length, 14);
const browser = await chromium.launch(smokeBrowserLaunchOptions());
const results = [];
const errors = [];
const guideName = /GUIDA INDAGINE|INVESTIGATION GUIDE|GUIDE D'ENQUÊTE/;
const closeGuide = /TORNA AL FASCICOLO|BACK TO THE FILE|REVENIR AU DOSSIER/;
const skipGuide = /PROSEGUI SENZA GUIDA|CONTINUE WITHOUT GUIDE|POURSUIVRE SANS GUIDE/;
const debriefName = /DEBRIEF.*DECISION|DECISION DEBRIEF|DÉBRIEF.*DÉCISION/;
const detailsName = /NORMA E RIFLESSIONE|RULE AND REFLECTION|NORME ET RÉFLEXION/;
const reviewName = /RIPASSA GLI ERRORI|REVIEW ERRORS|REVOIR LES ERREURS/;

async function activate(page, name, touch = false) {
  const button = page.getByRole('button', { name });
  await button.waitFor({ state: 'visible' });
  if (touch) {
    if (await page.locator('body').evaluate(b => b.classList.contains('mobile-presentation'))) await button.tap();
    else {
      const b = await button.boundingBox();
      await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    }
  } else {
    await button.focus();
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(150);
  await page.evaluate(() => document.activeElement?.blur());
}

async function scene(page, name) {
  await page.waitForFunction(key => window.game?.scene.getScenes(true).some(s => s.scene.key === key), name);
  await page.waitForTimeout(180);
}
async function openCase(page, id) {
  await page.evaluate(caseId => {
    for (const s of window.game.scene.getScenes(true)) s.scene.stop();
    window.game.scene.start('Case', { caseId });
  }, id);
  await scene(page, 'Case');
}
async function shot(page, tag) {
  await page.screenshot({ path: `${out}/${tag}.png`, timeout: 60000 });
  const overflow = await page.evaluate(() => {
    const s = window.game.scene.getScenes(true).at(-1);
    const found = [];
    function visit(o, visible = true) {
      if (!visible || o.visible === false || o.alpha === 0) return;
      if (o.type === 'Text' && o.text) {
        const b = o.getBounds();
        if (b.x < -2 || b.y < -2 || b.right > 1282 || b.bottom > 722) found.push(o.text.slice(0, 80));
      }
      for (const c of o.list ?? []) visit(c);
    }
    s.children.list.forEach(o => visit(o));
    return found;
  });
  assert.deepEqual(overflow, [], `${tag}: clipped text`);
}
async function makePage(language, width, height, touch = false) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
  await context.route(/cloudflareinsights\.com/, route => route.abort());
  await context.addInitScript(lang => {
    if (!localStorage.getItem('no-ai-act-save-v2')) localStorage.setItem('no-ai-act-save-v2', JSON.stringify({ version: 2, language: lang, briefingSeen: true, reducedMotion: true, audioMuted: true, startedAt: 1, gameMode: 'turno' }));
  }, language);
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${base}/play/?lang=${language}`);
  await scene(page, 'Title');
  if (await page.locator('.mg-continue').isVisible()) await page.locator('.mg-continue').click();
  return { context, page };
}
async function decide(page, data, correct = true) {
  await page.keyboard.press('Enter');
  await scene(page, 'Evidence');
  await prepareEvidenceWithKeyboard(page, { citeIndices: correct ? [...data.relevantClues] : [0, 1], settleMs: 40 });
  await page.keyboard.press('Enter');
  if (data.hasIncident) { await scene(page, 'Incident'); await page.keyboard.press('1'); }
  await scene(page, 'Decision');
  const cls = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
  const measures = ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'];
  const subjects = ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'];
  await completeDecisionWithKeyboard(page, correct ? [
    String(cls.indexOf(data.correctClassification) + 1), String(measures.indexOf(data.correctMeasures[0]) + 1),
    String(subjects.indexOf(data.responsibleSubjectCorrect) + 1), String(data.correctMotivation + 1)
  ] : ['5', '7', '4', '1']);
}

try {
  for (const [lang, width, height] of [['it', 1920, 1080], ['en', 1920, 1080], ['fr', 390, 844], ['fr', 3840, 2160]]) {
    const { context, page } = await makePage(lang, width, height, width === 390);
    const tag = `${lang}-${width}`;
    await activate(page, /NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/, width === 390);
    for (const mode of ['turno', 'libera', 'sorpresa', 'ripasso']) {
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('no-ai-act-save-v2')).gameMode), mode);
      await shot(page, `${tag}-mode-${mode}`);
      if (mode === 'ripasso') assert(await page.getByRole('button', { name: /^(INIZIA|START|COMMENCER)/ }).isDisabled());
      await activate(page, /^(MODALITÀ:|MODE\s*:)/, width === 390);
    }
    await page.keyboard.press('Escape');
    await page.evaluate(() => document.activeElement?.blur());
    await openCase(page, 'case_scoring');
    await activate(page, guideName, width === 390);
    await shot(page, `${tag}-tutorial`);
    assert.match(await page.locator('#reading-layer').innerText(), /PROTOCO|PROTOCOL/);
    await page.keyboard.press('1');
    assert.equal(await page.evaluate(() => window.game.scene.getScenes(true).at(-1).scene.key), 'Case');
    await activate(page, skipGuide, width === 390);
    await activate(page, guideName, width === 390);
    await activate(page, closeGuide, width === 390);
    await decide(page, cases[0], false);
    await shot(page, `${tag}-summary`);
    assert.match(await page.locator('#reading-layer').innerText(), /valutazione|Assessment|évaluation/);
    await page.keyboard.press('Enter');
    await scene(page, 'Report');
    const original = await page.evaluate(() => localStorage.getItem('no-ai-act-save-v2'));
    await activate(page, debriefName, width === 390);
    await shot(page, `${tag}-debrief`);
    await activate(page, detailsName, width === 390);
    await shot(page, `${tag}-debrief-details`);
    await activate(page, reviewName, width === 390);
    await scene(page, 'Case');
    await shot(page, `${tag}-review`);
    assert.equal(await page.evaluate(() => localStorage.getItem('no-ai-act-save-v2')), original);
    if (lang === 'it') {
      await decide(page, cases[0]);
      await page.keyboard.press('Enter');
      await scene(page, 'Report');
      await page.keyboard.press('Enter');
      await scene(page, 'Consequence');
      await page.keyboard.press('Enter');
      await scene(page, 'NormCard');
      await page.keyboard.press('Enter');
      await scene(page, 'SessionEnd');
      await shot(page, `${tag}-review-completed`);
      await page.keyboard.press('Enter');
    } else await page.keyboard.press('Escape');
    await scene(page, 'CityMap');
    assert.equal(await page.evaluate(() => localStorage.getItem('no-ai-act-save-v2')), original);
    await context.close();
    results.push({ language: lang, width, guide: 'pass', reviewPreserved: true });
    console.log(`${tag}: tutorial, summary, debrief, review PASS`);
  }

  const { context, page } = await makePage('it', 1280, 720);
  for (const data of cases) {
    await openCase(page, data.id);
    await decide(page, data);
    await page.keyboard.press('Enter');
    await scene(page, 'Report');
    assert.equal(await page.evaluate(() => window.game.scene.getScene('Report').params.result.quality), 'correct', data.id);
    await page.keyboard.press('Enter');
    await scene(page, 'Consequence');
    assert.match(await page.locator('#reading-layer').innerText(), /Prima.*Dopo.*Variazione/s);
    if (data.id === 'case_scoring') await shot(page, 'it-1280-consequences');
    await page.keyboard.press('Enter');
    await scene(page, 'NormCard');
    results.push({ caseId: data.id, quality: 'correct', reached: 'NormCard' });
    console.log(`${data.id}: complete PASS`);
  }
  await context.close();
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/results.json`, JSON.stringify({ results, errors }, null, 2));
  console.log('gameplay UX smoke PASS');
} finally { await browser.close(); }

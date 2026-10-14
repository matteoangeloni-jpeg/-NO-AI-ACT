import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';
import { selectMapCaseWithKeyboard } from './lib-map.mjs';

const base = 'http://127.0.0.1:4219';
const out = 'scripts/smoke/out/final-qa';
mkdirSync(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4219', '--strictPort'], {
  stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, VITE_ANALYTICS_PROVIDER: 'off' }
});
let browser, current;
const results = [], errors = [], external = [];
const scene = async (p, name) => {
  await p.waitForFunction(k => window.game?.scene.isActive(k), name, { timeout: 60000 });
  await p.evaluate(() => new Promise(r => window.game.events.once('poststep', () => window.game.events.once('poststep', r))));
};
const state = p => p.evaluate(async () => {
  const { StateManager: s } = await import('/src/game/systems/StateManager.ts');
  // Compare the persisted JSON contract: optional undefined fields are omitted on save.
  return { plan: s.gamePlan, completed: s.completedCases, reports: JSON.parse(JSON.stringify(s.caseReports)), reviewing: s.isReviewing, difficulty: s.difficulty };
});
const activate = async (p, name) => {
  await p.getByRole('button', { name, exact: typeof name === 'string' }).first().tap();
  await p.evaluate(() => document.activeElement?.blur());
};
const normAction = async (p, key) => activate(p, await p.evaluate(async k => (await import('/src/game/i18n/index.ts')).L().ui.normCard[k], key));
const sign = async (p, quality) => {
  await scene(p, 'Case');
  const data = await p.evaluate(() => window.game.scene.getScene('Case').caseData);
  await activate(p, /ESAMINA I REPERTI|EXAMINE.*EXHIBITS|EXAMINER LES PIÈCES/);
  await scene(p, 'Evidence');
  await prepareEvidenceWithKeyboard(p, { citeIndices: data.relevantClues, settleMs: 60 });
  await p.keyboard.press('Enter');
  if (data.hasIncident) { await scene(p, 'Incident'); await p.keyboard.press('1'); }
  await scene(p, 'Decision');
  const classifications = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
  const measures = ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'];
  const cls = classifications.indexOf(data.correctClassification);
  const partial = data.partialMeasures?.[0];
  const expected = quality === 'partial' && !partial ? 'wrong' : quality;
  const keys = [expected === 'wrong' ? (cls + 1) % classifications.length + 1 : cls + 1,
    measures.indexOf(expected === 'wrong' ? measures.find(m => !data.correctMeasures.includes(m)) : expected === 'partial' ? partial : data.correctMeasures[0]) + 1,
    ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'].indexOf(data.responsibleSubjectCorrect) + 1,
    data.correctMotivation + 1].map(String);
  await completeDecisionWithKeyboard(p, keys);
  await p.keyboard.press('Enter'); await scene(p, 'Report');
  assert.equal(await p.evaluate(() => window.game.scene.getScene('Report').params.result.quality), expected);
  await activate(p, /DEBRIEF.*DECISION|DECISION DEBRIEF|DÉBRIEF.*DÉCISION/);
  assert((await p.locator('#reading-layer').innerText()).length > 100);
  await activate(p, await p.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().ui.decisionDebrief.close));
  await activate(p, /^PROSEGUI|^CONTINUE|^POURSUIVRE|^CONTINUER/);
  await scene(p, 'Consequence');
  await p.keyboard.press('Enter'); await scene(p, 'NormCard');
  return { caseId: data.id, quality: expected };
};
try {
  const deadline = Date.now() + 30000;
  while (true) { try { if ((await fetch(base)).ok) break; } catch {} if (Date.now() > deadline) throw Error('Preview unavailable'); await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const language of ['it', 'en', 'fr']) {
    let reviewSave;
    for (const mode of process.env.PROBE ? ['sorpresa'] : ['turno', 'libera', 'sorpresa', 'ripasso']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
      await context.route('**/*', r => {
        if (new URL(r.request().url()).origin !== base) { external.push(r.request().url()); return r.abort(); }
        return r.continue();
      });
      await context.addInitScript(({ language, mode, reviewSave }) => {
        if (!localStorage.getItem('no-ai-act-save-v2')) localStorage.setItem('no-ai-act-save-v2', JSON.stringify({
          ...(reviewSave ? JSON.parse(reviewSave) : { version: 2, briefingSeen: true }),
          language, gameMode: mode, sessionMinutes: 30, reducedMotion: true, audioMuted: true
        }));
      }, { language, mode, reviewSave });
      const p = await context.newPage(); current = p; p.on('pageerror', e => errors.push(String(e)));
      await p.goto(`${base}/play/?lang=${language}`); await scene(p, 'Title');
      await activate(p, /NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/);
      const preview = (await state(p)).plan;
      const original = await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2'));
      await activate(p, /^(INIZIA|START|COMMENCER)/);
      await p.waitForFunction(() => ['Case', 'CityMap', 'Briefing'].some(k => window.game.scene.isActive(k)), undefined, { timeout: 60000 });
      const started = await state(p);
      if (mode === 'sorpresa') {
        const diagnostic = { language, preview: preview.caseIds, activePlan: started.plan.caseIds };
        if (process.env.PROBE) { writeFileSync(`${out}/surprise-before.json`, JSON.stringify(diagnostic, null, 2)); }
        assert.deepEqual(started.plan.caseIds, preview.caseIds, 'Sorpresa must preserve its displayed itinerary on start');
        assert.equal(started.difficulty, 'expert');
      }
      if (await p.evaluate(() => window.game.scene.isActive('Briefing'))) {
        await scene(p, 'Briefing');
        await activate(p, await p.evaluate(async freeMap => {
          const { L } = await import('/src/game/i18n/index.ts');
          return freeMap ? L().briefing.cta : L().briefing.ctaFirstCase;
        }, started.plan.freeMap));
      }
      if (mode === 'libera') {
        await scene(p, 'CityMap');
        const outside = await p.evaluate(async recommended => (await import('/src/game/data/cases.ts')).PLAYABLE_CASES.find(c => !recommended.includes(c.id)).id, preview.caseIds);
        await selectMapCaseWithKeyboard(p, outside);
        const signed = await sign(p, 'correct'); assert.equal(signed.caseId, outside);
        await normAction(p, 'backToMap'); await scene(p, 'CityMap');
        await p.reload(); await scene(p, 'Title');
        assert.equal((await state(p)).completed[outside], 'correct');
        results.push({ language, mode, signed: [signed], outsideRecommendation: true, reload: true });
      } else {
        const signed = [];
        for (let index = 0; index < started.plan.caseIds.length; index++) {
          await scene(p, 'Case');
          assert.equal(await p.evaluate(() => window.game.scene.getScene('Case').caseData.id), started.plan.caseIds[index]);
          if (mode === 'sorpresa') {
            const guide = await p.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().gameplay.guide);
            assert.equal(await p.getByRole('button', { name: guide, exact: true }).count(), 0, 'Expert surprise has no contextual shift guide');
          }
          signed.push(await sign(p, mode === 'turno' ? (index === 0 ? 'wrong' : index === 1 ? 'partial' : 'correct') : 'correct'));
          await normAction(p, index + 1 === started.plan.caseIds.length ? 'endOfShift' : 'nextCase');
        }
        await scene(p, 'SessionEnd');
        await p.screenshot({ path: `${out}/${language}-${mode}-session.png` });
        if (mode === 'turno') reviewSave = await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2'));
        if (mode === 'ripasso') {
          assert.deepEqual(started.plan.caseIds.sort(), Object.entries(JSON.parse(original).completedCases).filter(([, v]) => v !== 'correct').map(([id]) => id).sort());
          assert.equal(await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2')), original, 'Review must never rewrite original saves');
          await activate(p, await p.evaluate(async () => (await import('/src/game/i18n/index.ts')).L().gameplay.exitReview));
          await scene(p, 'CityMap');
          const restored = await state(p);
          assert.equal(restored.reviewing, false);
          assert.deepEqual(restored.completed, JSON.parse(original).completedCases);
          assert.deepEqual(restored.reports, JSON.parse(original).caseReports);
          assert.equal(await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2')), original);
        }
        if (mode === 'turno') {
          const originalState = await state(p);
          await p.reload(); await scene(p, 'Title');
          assert.deepEqual((await state(p)).completed, originalState.completed);
          assert.deepEqual((await state(p)).reports, originalState.reports);
        }
        results.push({ language, mode, signed, sessionEnd: true, originalSavePreserved: mode === 'ripasso' });
      }
      console.log(`Final QA ${language}/${mode}: PASS`);
      writeFileSync(`${out}/modes-progress.json`, JSON.stringify({ results, errors, external }, null, 2));
      await context.close();
    }
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  writeFileSync(`${out}/modes-results.json`, JSON.stringify({ results, errors, external, limitations: ['Automated mobile Chromium; no human participant or physical device'] }, null, 2));
} catch (error) {
  if (current && !current.isClosed()) await current.screenshot({ path: `${out}/modes-failure.png` }).catch(() => {});
  throw error;
} finally {
  await browser?.close(); server.kill();
  if (server.exitCode === null) await new Promise(r => server.once('exit', r));
}

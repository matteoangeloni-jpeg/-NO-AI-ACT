import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';
import { pagesDevOptions } from '../beta/local-pages.mjs';

const base = 'http://127.0.0.1:4221', out = 'scripts/smoke/out/beta';
mkdirSync(out, { recursive: true });
const config = pagesDevOptions(4221);
const server = spawn(config.command, config.args, { ...config.options, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '', browser, current;
server.stdout.on('data', x => { logs += x; }); server.stderr.on('data', x => { logs += x; });
const results = [], errors = [], external = [];
const scene = async (p, key) => {
  await p.waitForFunction(k => window.game?.scene.isActive(k), key, { timeout: 60000 });
  await p.evaluate(() => new Promise(r => window.game.events.once('poststep', () => window.game.events.once('poststep', r))));
};
const tap = async (p, name) => { await p.getByRole('button', { name }).first().tap(); await p.evaluate(() => document.activeElement?.blur()); };
try {
  const deadline = Date.now() + 45000;
  while (true) { try { if ((await fetch(base)).ok) break; } catch {} if (Date.now() > deadline || server.exitCode !== null) throw Error(`Local Pages unavailable: ${logs}`); await new Promise(r => setTimeout(r, 100)); }
  const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
  const paths = [...cfg.pairs.flatMap(p => Object.values(p)), ...cfg.enOnly, ...Object.values(cfg.frForEn), 'play'];
  for (const path of paths) {
    const response = await fetch(`${base}/${path ? `${path}/` : ''}`);
    assert.equal(response.status, 200, path); assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
    const html = await response.text(); let robots = false, canonical = false, beacon = false;
    const visit = n => {
      const a = Object.fromEntries((n.attrs ?? []).map(x => [x.name, x.value]));
      if (n.tagName === 'meta' && a.name === 'robots') robots = a.content.includes('noindex');
      if (n.tagName === 'link' && ['canonical', 'alternate'].includes(a.rel)) canonical = true;
      if (n.tagName === 'script' && ('data-cf-beacon' in a || /cloudflareinsights/.test(a.src ?? ''))) beacon = true;
      for (const child of n.childNodes ?? []) visit(child);
    };
    visit(parse(html)); assert(robots); assert.equal(canonical, false); assert.equal(beacon, false);
  }
  assert.match(await (await fetch(`${base}/robots.txt`)).text(), /Disallow: \//);
  assert.equal((await fetch(`${base}/missing-beta-page`)).status, 404);
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const language of ['it', 'en', 'fr']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce', acceptDownloads: true });
    await context.route('**/*', r => { if (new URL(r.request().url()).origin !== base) { external.push(r.request().url()); return r.abort(); } return r.continue(); });
    const sentinel = JSON.stringify({ version: 2, language: 'en', completedCases: { case_scoring: 'correct' } });
    await context.addInitScript(s => { if (!localStorage.getItem('no-ai-act-save-v2')) localStorage.setItem('no-ai-act-save-v2', s); }, sentinel);
    const p = await context.newPage(); current = p; p.on('pageerror', e => errors.push(String(e)));
    await p.goto(`${base}/${language === 'it' ? '' : `${language}/`}`);
    assert.match(await p.locator('#beta-banner').innerText(), /BETA 4.0/);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await p.goto(`${base}/play/?lang=${language}`); await scene(p, 'Title');
    assert.equal(await p.locator('#beta-banner').getAttribute('lang'), language);
    await p.locator('#beta-banner button').focus(); await p.keyboard.press('Enter');
    await p.getByRole('textbox').focus(); await p.keyboard.type('1 2 3 - UI feedback test');
    assert.equal(await p.getByRole('textbox').inputValue(), '1 2 3 - UI feedback test');
    assert(await p.locator('#beta-feedback').evaluate(d => d.open));
    assert(await p.locator('#app').evaluate(el => el.inert));
    const pending = p.waitForEvent('download'); await p.locator('#beta-feedback button[type="submit"]').tap();
    const download = await pending; const feedback = JSON.parse(readFileSync(await download.path(), 'utf8'));
    assert.deepEqual(feedback, { version: '4.0-beta', language, feedback: '1 2 3 - UI feedback test' });
    await p.waitForFunction(() => !document.getElementById('app').inert);
    await tap(p, /NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/); await tap(p, /^(INIZIA|START|COMMENCER)/);
    await p.waitForFunction(() => window.game.scene.isActive('Case') || window.game.scene.isActive('Briefing'));
    if (await p.evaluate(() => window.game.scene.isActive('Briefing'))) await tap(p, /APRI IL PRIMO FASCICOLO|OPEN THE FIRST FILE|OUVRIR LE PREMIER DOSSIER/);
    await scene(p, 'Case'); const data = await p.evaluate(() => window.game.scene.getScene('Case').caseData);
    assert.equal(data.id, 'case_scoring');
    await tap(p, /ESAMINA I REPERTI|EXAMINE.*EXHIBITS|EXAMINER LES PIÈCES/); await scene(p, 'Evidence');
    await prepareEvidenceWithKeyboard(p, { citeIndices: data.relevantClues, settleMs: 60 });
    await p.keyboard.press('Enter'); await scene(p, 'Decision');
    const keys = [['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'].indexOf(data.correctClassification) + 1,
      ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'].indexOf(data.correctMeasures[0]) + 1,
      ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'].indexOf(data.responsibleSubjectCorrect) + 1, data.correctMotivation + 1].map(String);
    await completeDecisionWithKeyboard(p, keys); await p.keyboard.press('Enter'); await scene(p, 'Report');
    assert.equal(await p.evaluate(() => window.game.scene.getScene('Report').params.result.quality), 'correct');
    assert.equal(await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2')), sentinel);
    const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('no-ai-act-beta-save-v2')));
    assert.equal(saved.completedCases.case_scoring, 'correct'); assert.equal(saved.language, language);
    await p.screenshot({ path: `${out}/${language}-report-390.png` });
    await p.reload(); await scene(p, 'Title'); assert.equal(await p.locator('html').getAttribute('lang'), language);
    results.push({ language, signed: true, savedBetaOnly: true, feedbackLocal: true, resumedLanguage: true }); await context.close();
  }
  const layout = [];
  for (const [width, height] of [[360, 800], [390, 844], [412, 915], [768, 1024], [1280, 720], [1920, 1080], [3840, 2160]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.addInitScript(() => localStorage.setItem('no-ai-act-beta-save-v2', JSON.stringify({ version: 2, language: 'fr', reducedMotion: true, audioMuted: true })));
    const p = await context.newPage(); current = p; await p.goto(`${base}/play/?lang=fr`); await scene(p, 'Title');
    const metrics = await p.evaluate(() => {
      const banner = document.getElementById('beta-banner').getBoundingClientRect();
      const mobile = document.body.classList.contains('mobile-presentation');
      const content = document.querySelector(mobile ? '#reading-layer' : 'canvas').getBoundingClientRect();
      return { mobile, bannerBottom: banner.bottom, contentTop: content.top, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    assert.equal(metrics.overflow, false); assert(metrics.contentTop >= metrics.bannerBottom - 1, `${width}: banner covers gameplay`);
    if ([360, 1280, 3840].includes(width)) await p.screenshot({ path: `${out}/fr-title-${width}.png` });
    layout.push({ width, height, ...metrics }); await context.close();
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  writeFileSync(`${out}/results.json`, JSON.stringify({ routes: paths.length, results, layout, errors, external, provider: 'local Pages', telemetry: 'off' }, null, 2));
  console.log(`Beta PASS: ${paths.length} noindex routes with real Pages headers, IT/EN/FR signing, storage isolation and local feedback.`);
} catch (error) { if (current && !current.isClosed()) await current.screenshot({ path: `${out}/failure.png` }).catch(() => {}); throw error; }
finally { await browser?.close(); server.kill(); if (server.exitCode === null) await new Promise(r => server.once('exit', r)); }

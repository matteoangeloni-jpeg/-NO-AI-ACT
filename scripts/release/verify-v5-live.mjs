/** Read-only publication check. Run with node --import tsx; use --browser for UI. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { chromium } from 'playwright';
import { publicRoutes, languageCode } from '../../src/site/route-inventory.mjs';
import { LOCALES } from '../../src/game/i18n/index.ts';
import { GUIDED_COPY } from '../../src/game/i18n/guidedInquiry.ts';
import { PLAYABLE_CASES } from '../../src/game/data/cases.ts';
import { smokeBrowserLaunchOptions } from '../smoke/lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from '../smoke/lib-evidence.mjs';
import { completeDecisionWithKeyboard } from '../smoke/lib-decision.mjs';

const cfg = JSON.parse(readFileSync('release.config.json', 'utf8'));
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
const canonicalBase = cfg.domain;
const base = (process.env.V5_VERIFY_BASE || canonicalBase).replace(/\/$/, '');
const out = resolve(process.env.V5_VERIFY_OUT || 'scripts/smoke/out/v5-live');
mkdirSync(out, { recursive: true });
const report = { version, base, checkedAt: new Date().toISOString(), pages: [], assets: [], sitemaps: [], browser: [], failures: [] };
const assets = new Set();
const href = dir => canonicalBase + '/' + (dir ? dir + '/' : '');
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
function nodes(root) { return [root, ...(root.childNodes || []).flatMap(nodes)]; }
function text(node) { return node?.nodeName === '#text' ? node.value : (node?.childNodes || []).map(text).join(''); }
async function response(path) {
  const r = await fetch(base + path, { signal: AbortSignal.timeout(30000) });
  assert.equal(r.status, 200, `${path}: HTTP ${r.status}`); return r;
}
async function pool(items, task) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      try { await task(item); } catch (error) { report.failures.push({ item: typeof item === 'string' ? item : item.dir, error: String(error) }); }
    }
  }));
}
let browser;
try {
  await pool(publicRoutes(JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'))), async route => {
    const path = '/' + (route.dir ? route.dir + '/' : '');
    const html = await (await response(path)).text(); const list = nodes(parse(html));
    assert.equal(attr(list.find(n => n.tagName === 'html'), 'lang'), languageCode(route.lang));
    assert.equal(attr(list.find(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical'), 'href'), href(route.dir));
    const alternates = list.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'alternate');
    for (const [lang, dir] of Object.entries(route.group)) {
      assert(alternates.some(n => attr(n, 'hreflang') === languageCode(lang) && attr(n, 'href') === href(dir)), `Missing alternate ${lang}: ${path}`);
    }
    const credit = list.find(n => n.tagName === 'p' && attr(n, 'class')?.split(/\s+/).includes('credit'));
    assert(text(credit).includes('v' + version), `${path}: version footer is stale`);
    for (const node of list) {
      const src = node.tagName === 'img' ? attr(node, 'src') : node.tagName === 'a' && /\.zip$/.test(attr(node, 'href') || '') ? attr(node, 'href') : null;
      if (!src) continue;
      const url = new URL(src, href(route.dir));
      if (url.origin === canonicalBase) assets.add(url.pathname);
    }
    report.pages.push({ path, language: route.lang, canonical: 'PASS', alternates: 'PASS', version });
  });
  await pool([...assets], async path => {
    const r = await response(path); const bytes = Buffer.from(await r.arrayBuffer()); assert(bytes.length > 0);
    report.assets.push({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  });
  for (const lang of cfg.siteLanguages) {
    const xml = await (await response(`/sitemap-${lang}.xml`)).text();
    const count = [...xml.matchAll(/<loc>/g)].length; assert.equal(count, cfg.publicUrls[lang]);
    report.sitemaps.push({ language: lang, urls: count });
  }
  const index = await (await response('/sitemap.xml')).text();
  assert.equal([...index.matchAll(/<loc>/g)].length, cfg.siteLanguages.length);
  const shell = await (await response('/play/')).text();
  const scripts = nodes(parse(shell)).filter(n => n.tagName === 'script' && attr(n, 'type') === 'module' && attr(n, 'src'));
  const script = new URL(attr(scripts[0], 'src'), canonicalBase + '/play/');
  const game = Buffer.from(await (await response(script.pathname)).arrayBuffer());
  assert(game.includes(Buffer.from(version))); assert(game.includes(Buffer.from('guided-inquiry')));
  report.game = { script: script.pathname, sha256: createHash('sha256').update(game).digest('hex'), version, guidedInquiryPresent: true };
  assert.equal(report.pages.length, cfg.publicUrls.total);
  assert.deepEqual(report.failures, []);

  if (process.argv.includes('--browser')) {
    browser = await chromium.launch(smokeBrowserLaunchOptions());
    for (const language of ['it', 'en', 'fr']) {
      const ui = GUIDED_COPY[language], locale = LOCALES[language];
      const context = await browser.newContext({ viewport: language === 'it' ? { width: 1280, height: 720 } : { width: 390, height: 844 }, hasTouch: language !== 'it', reducedMotion: 'reduce' });
      const errors = [], posts = [];
      await context.route('**/*', route => {
        if (route.request().method() === 'POST') { posts.push(route.request().url()); return route.abort(); }
        if (new URL(route.request().url()).origin !== new URL(base).origin) return route.abort();
        return route.continue();
      });
      await context.addInitScript(lang => {
        Object.defineProperty(navigator, 'doNotTrack', { get: () => '1', configurable: true });
        Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true, configurable: true });
        localStorage.setItem('no-ai-act-save-v2', JSON.stringify({ version: 2, language: lang, briefingSeen: true, reducedMotion: true, audioMuted: true, gameMode: 'turno', sessionMinutes: 15 }));
      }, language);
      const page = await context.newPage(); page.on('pageerror', error => errors.push(String(error)));
      page.setDefaultTimeout(30000);
      const scene = name => page.waitForFunction(key => window.game?.scene.isActive(key), name, { timeout: 90000 });
      async function activate(label) {
        await page.getByRole('button', { name: label, exact: true }).focus(); await page.keyboard.press('Enter');
        await page.evaluate(() => { if (!document.querySelector('.guided-inquiry')) document.activeElement?.blur(); });
      }
      await page.goto(base + '/play/?lang=' + language, { waitUntil: 'domcontentloaded' }); await scene('Title');
      assert((await page.locator('#reading-layer').innerText()).includes('v' + version));
      await activate(locale.ui.menu.newGame);
      await page.getByRole('button', { name: /^(INIZIA|START|COMMENCER)/ }).first().focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => ['Case', 'CityMap', 'Briefing'].some(key => window.game.scene.isActive(key)));
      // Fixed case selection only; all subsequent actions use real UI controls.
      await page.evaluate(() => { for (const active of window.game.scene.getScenes(true)) active.scene.stop(); window.game.scene.start('Case', { caseId: 'case_scoring' }); });
      await scene('Case'); await activate(ui.entry); await activate(ui.next); await activate(ui.next);
      const marker = `V5_PUBLIC_SYNTHETIC_${language}`;
      await page.locator('textarea[name=hypothesis]').fill(marker);
      await page.screenshot({ path: resolve(out, `${language}-guided.png`) });
      await activate(ui.continue); await scene('Evidence');
      await prepareEvidenceWithKeyboard(page, { citeIndices: [0, 1], settleMs: 80 });
      await activate(ui.notebook);
      await page.locator('textarea[name=reasoning]').fill(marker + ' explanation');
      await activate(ui.close); await activate(locale.ui.evidence.proceedButton); await scene('Decision');
      await page.getByRole('dialog').waitFor(); await activate(ui.close);
      const data = PLAYABLE_CASES.find(item => item.id === 'case_scoring');
      await completeDecisionWithKeyboard(page, [
        ['vietata','alto_rischio','trasparenza','basso_rischio','non_rilevante'].indexOf(data.correctClassification)+1,
        ['blocco','oversight','audit','informare','etichettare','dati_logging','nessuna'].indexOf(data.correctMeasures[0])+1,
        ['provider','deployer','autorita','responsabile_umano','fornitore_esterno'].indexOf(data.responsibleSubjectCorrect)+1,
        data.correctMotivation+1
      ].map(String));
      await activate(locale.ui.decision.sign);
      assert.equal(await page.evaluate(() => window.game.scene.isActive('Report')), false);
      assert.equal(await page.locator('textarea[name=hypothesis]').inputValue(), marker);
      await activate(ui.confirm); await scene('Report'); await activate(ui.debrief);
      assert.equal(await page.locator('textarea[name=hypothesis]').count(), 0);
      await page.locator('textarea[name=reflection]').fill(marker + ' reflection');
      assert(!(await page.evaluate(() => JSON.stringify({ ...localStorage }))).includes(marker));
      await page.screenshot({ path: resolve(out, `${language}-debrief.png`) });
      await activate(ui.close);
      assert.deepEqual(errors, []); assert.deepEqual(posts, []);
      report.browser.push({ language, version, guidedCycle: 'PASS', preFeedbackArgument: 'PASS', reflection: 'PASS', rawTextInSave: false, testPosts: 0, selection: 'fixed dossier; real UI' });
      await context.close();
    }
  }
  report.completed = true;
  console.log(`V5 publication verified: ${report.pages.length} pages, ${report.assets.length} assets, ${report.sitemaps.length} sitemaps, ${report.browser.length} browser languages.`);
} catch (error) { report.failures.push({ error: String(error) }); throw error; }
finally { await browser?.close(); writeFileSync(resolve(out, 'results.json'), JSON.stringify(report, null, 2)); }

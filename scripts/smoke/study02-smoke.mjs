import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { startStudy02Server } from '../study02-lab.mjs';
import { COPY } from '../../research/study02/materials.mjs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const server = await startStudy02Server(0);
const base = `http://127.0.0.1:${server.address().port}`;
const out = 'scripts/smoke/out/study02'; mkdirSync(out, { recursive: true });
const results = []; const errors = []; const external = [];
let browser;
try {
  assert.equal((await fetch(base + '/', { method: 'POST', body: 'SYNTHETIC' })).status, 405);
  assert.equal((await fetch(base + '/missing')).status, 404);
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const language of ['it', 'en', 'fr']) for (const form of ['A', 'B']) for (const occasion of ['pre', 'post']) {
    const ui = COPY[language]; const width = language === 'it' ? 1440 : language === 'fr' ? 320 : 390;
    const context = await browser.newContext({ viewport: { width, height: 844 }, hasTouch: width < 800 });
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin !== base) { external.push(route.request().url()); return route.abort(); }
      return route.continue();
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(String(error)));
    page.on('dialog', dialog => dialog.accept());
    await page.goto(base);
    await page.locator('select[name=language]').selectOption(language);
    await page.locator('select[name=form]').selectOption(form);
    await page.locator('select[name=occasion]').selectOption(occasion);
    assert.equal(await page.locator('html').getAttribute('lang'), language);
    assert.equal(await page.locator('#participant .source').count(), 4);
    assert.equal(await page.locator('#participant input[type=radio]').count(), 0);
    assert.equal(await page.locator('#participant select').count(), 0);
    await page.getByRole('button', { name: ui.observer, exact: true }).click();
    assert(await page.getByRole('button', { name: ui.release, exact: true }).isDisabled());
    assert.equal(await page.locator('#observer textarea[name^=observed-]').count(), 7);
    assert.equal(await page.locator('#observer select[name^=code-]').count(), 6);
    await page.locator('textarea[name=context]').fill('SYNTHETIC device and mediation context');
    await page.locator('textarea[name=observed-0]').fill('SYNTHETIC reread and verbal explanation');
    await page.locator('select[name=code-0]').selectOption('0');
    await page.locator('textarea[name=rationale-0]').fill('SYNTHETIC claim absent in this task');
    await page.getByRole('button', { name: ui.participant, exact: true }).click();
    const essay = page.locator('textarea[name=argument]');
    const marker = `SYNTHETIC_${language}_${form}_${occasion}: sources, alternative and uncertainty`;
    await essay.fill(marker);
    await page.getByRole('button', { name: ui.seal, exact: true }).click();
    assert.equal(await essay.isEditable(), false);
    assert(await page.locator('select[name=form]').isDisabled());
    assert((await page.locator('#participant').innerText()).includes(ui.sealed));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, 'horizontal overflow');
    await page.getByRole('button', { name: ui.observer, exact: true }).click();
    await page.getByRole('button', { name: ui.release, exact: true }).click();
    assert((await page.locator('#observer').innerText()).includes(ui.debrief));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: ui.download, exact: true }).click();
    const download = await downloadPromise;
    const file = `${out}/${language}-${form}-${occasion}.json`; await download.saveAs(file);
    const data = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(data.submittedArgument, marker); assert.equal(data.humanRubric[0].code, 0);
    assert.equal(data.humanRubric[1].code, null); assert(!('score' in data)); assert(!('participantId' in data));
    const privacy = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie }));
    assert.deepEqual(privacy, { local: {}, session: {}, cookies: '' });
    if (form === 'A' && occasion === 'post') await page.screenshot({ path: `${out}/${language}-observer.png`, fullPage: true });
    await page.reload(); assert.equal(await page.locator('textarea[name=argument]').inputValue(), '');
    results.push({ language, form, occasion, width, independentTask: 'PASS', manualRubric: 'PASS', noPersistence: true });
    console.log(`Study02 ${language} ${form} ${occasion}: PASS`); await context.close();
  }
  // An ordinary production build must not distribute the held-out materials.
  const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path + '/' + entry.name) : [path + '/' + entry.name]);
  const built = walk('dist');
  assert(!built.some(path => /study02|\/research\//i.test(path)), 'research tool in production output');
  for (const file of built.filter(path => /\.(js|html)$/.test(path))) {
    assert(!readFileSync(file, 'utf8').includes('The civic archive workshops'), 'held-out task in public bundle');
  }
  assert.equal(results.length, 12); assert.deepEqual(errors, []); assert.deepEqual(external, []);
  writeFileSync(out + '/results.json', JSON.stringify({ results, errors, external, postRejected: true, productionExcluded: true, humanValidation: false }, null, 2));
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }

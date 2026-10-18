import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
const out = 'scripts/smoke/out/mobile-ux';
mkdirSync(out, { recursive: true });
let browser;
const errors = [], results = [];
const base = process.env.BASE || 'http://localhost:4212';
const reducedMotion = process.env.MOTION !== 'full';
const deviceScaleFactor = process.env.QUICK ? 3 : 1;
const matrix = [[320,800],[360,800],[390,844],[412,915],[768,1024],[800,360],[844,390],[915,412],[1024,768],[1280,720],[1920,1080],[3840,2160]];
// Procedural boot at 4K is slower on software WebGL; gameplay keeps a strict limit.
const scene = (p, name) => p.waitForFunction(k => window.game?.scene.isActive(k), name, { timeout: name === 'Title' ? 60000 : 15000 });
async function closeProfile() {
  await browser?.close();
  browser = undefined;
  await new Promise(resolve => setTimeout(resolve,1000));
}
async function tap(p, name) {
  const b = p.getByRole('button', { name: new RegExp(name.source, 'i') }).first();
  await b.waitFor({ state: 'visible' });
  await b.scrollIntoViewIfNeeded();
  await b.tap();
  await p.waitForTimeout(120);
}
async function check(p, tag, screenshot = true) {
  const metrics = await p.evaluate(() => {
    const app = document.getElementById('app');
    const buttons = [...document.querySelectorAll('.action-btn:not([hidden])')].filter(b => b.getBoundingClientRect().height);
    return { overflow: app.scrollWidth > app.clientWidth + 1,
      small: buttons.filter(b => b.getBoundingClientRect().height < 44 || parseFloat(getComputedStyle(b).fontSize) < 16).map(b => b.textContent),
      text: parseFloat(getComputedStyle(document.getElementById('reading-layer')).fontSize) };
  });
  assert.equal(metrics.overflow, false, `${tag}: overflow`);
  assert.deepEqual(metrics.small, [], `${tag}: small targets`);
  assert(metrics.text >= 16, `${tag}: text too small`);
  if (screenshot) await p.screenshot({ path: `${out}/after-${tag}.png`, timeout: 60000 });
}
try {
  for (const lang of ['it','en','fr']) for (const [width,height] of matrix) {
    if (process.env.ONLY && process.env.ONLY !== `${lang}-${width}`) continue;
    if (process.env.QUICK && !(lang === 'it' && width === 390)) continue;
    console.log(`profile: ${lang} ${width}x${height}`);
    // Release software-WebGL resources between independent devices, not mid-journey.
    browser = await chromium.launch(smokeBrowserLaunchOptions());
    const ctx = await browser.newContext({ viewport: {width,height}, deviceScaleFactor, isMobile: !!process.env.QUICK, hasTouch: true, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
    await ctx.route(/cloudflareinsights/, r => r.abort());
    await ctx.addInitScript(({language,reducedMotion}) => localStorage.setItem('no-ai-act-save-v2', JSON.stringify({version:2,language,briefingSeen:true,reducedMotion,audioMuted:true})),{language:lang,reducedMotion});
    const p = await ctx.newPage();
    p.setDefaultTimeout(15000);
    p.on('pageerror', e => errors.push(String(e)));
    await p.goto(`${base}/play/?lang=${lang}`);
    await scene(p,'Title');
    const mobile = width <= 1024 || (height <= 520 && width <= 1200);
    if (!mobile) {
      assert.equal(await p.locator('body').evaluate(b => b.classList.contains('mobile-presentation')),false);
      await p.screenshot({path:`${out}/after-${lang}-${width}-desktop.png`,timeout:60000});
      results.push({lang,width,height,desktop:true}); await closeProfile(); continue;
    }
    const tag = `${lang}-${width}${deviceScaleFactor > 1 ? '-dpr3' : ''}`;
    await check(p,`${tag}-title`);
    await tap(p,/NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/);
    await check(p,`${tag}-modes`);
    // Cycle through all four existing modes, including disabled empty review.
    for (let i=0;i<4;i++) {
      if(i===3) assert(await p.getByRole('button',{name:/^(INIZIA|START|COMMENCER)/}).isDisabled());
      await tap(p,/^(MODALITÀ:|MODE\s*:)/);
    }
    await tap(p,/^(INIZIA|START|COMMENCER)/);
    await p.waitForFunction(() => window.game.scene.isActive('Case') || window.game.scene.isActive('Briefing'));
    if(await p.evaluate(() => window.game.scene.isActive('Briefing'))) await tap(p,/APRI IL PRIMO FASCICOLO|OPEN THE FIRST FILE|OUVRIR LE PREMIER DOSSIER/);
    await scene(p,'Case');
    await check(p,`${tag}-case`);
    await tap(p,/GUIDA INDAGINE|INVESTIGATION GUIDE|GUIDE D'ENQUÊTE/);
    await check(p,`${tag}-tutorial`);
    const modalButtons = p.locator('.action-btn:not([hidden])');
    await modalButtons.last().focus();
    await p.keyboard.press('Tab');
    assert(await modalButtons.first().evaluate(b => b === document.activeElement), 'modal focus must wrap');
    await tap(p,/PROSEGUI SENZA GUIDA|CONTINUE WITHOUT GUIDE|POURSUIVRE SANS GUIDE/);
    await tap(p,/ESAMINA I REPERTI|EXAMINE.*EXHIBITS|EXAMINER LES PIÈCES/);
    await scene(p,'Evidence');
    const slots = p.locator('#reading-layer [data-action-slot]');
    const n = await slots.count();
    assert(n>=3);
    for(let i=0;i<n;i++) {
      await slots.nth(i).getByRole('button').tap();
      await p.waitForTimeout(100);
      if(i<2) { await slots.nth(i).getByRole('button').tap(); await p.waitForTimeout(100); }
    }
    await check(p,`${tag}-evidence`);
    if(width === 390) {
      const original = await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2'));
      await p.setViewportSize({width:844,height:390});
      await check(p,`${tag}-rotated`);
      await p.setViewportSize({width,height});
      await p.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await check(p,`${tag}-text-200`);
      await p.evaluate(() => { document.documentElement.style.fontSize = ''; });
      assert.equal(await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2')),original);
      writeFileSync(`${out}/${tag}-semantics.txt`, await p.locator('#app').ariaSnapshot());
    }
    await tap(p,/^CONFRONTA|^COMPARE|^COMPARER/);
    await check(p,`${tag}-compare`);
    await tap(p,/TORNA AI REPERTI|BACK TO EXHIBITS|REVENIR AUX PIÈCES/);
    await tap(p,/CLASSIFICA|CLASSIFY|CLASSER|CLASSIFICATION/);
    await scene(p,'Decision');
    if(width === 390) {
      const text = await p.locator('#reading-layer').innerText();
      await tap(p,/^TERMINI$|^TERMS$|^TERMES$/);
      await check(p,`${tag}-terms`);
      await tap(p,/^Chiudi$|^Close$|^Fermer$/);
      assert.equal(await p.locator('#reading-layer').innerText(),text);
      await tap(p,/^ARCHIVIO$|^ARCHIVE$|^ARCHIVES$/);
      await tap(p,/^Chiudi$|^Close$|^Fermer$/);
      assert.equal(await p.locator('#reading-layer').innerText(),text);
    }
    for(let i=0;i<4;i++) {
      await tap(p,i === 0 ? /^5\./ : /^1\./);
    }
    await check(p,`${tag}-summary`);
    await tap(p,/FIRMA|SIGN|SIGNER/);
    await scene(p,'Report');
    const reportParams = await p.evaluate(() => window.game.scene.getScene('Report').params);
    await check(p,`${tag}-report`);
    await tap(p,/DEBRIEF.*DECISION|DECISION DEBRIEF|DÉBRIEF.*DÉCISION/);
    await check(p,`${tag}-debrief`);
    await tap(p,/NORMA E RIFLESSIONE|RULE AND REFLECTION|NORME ET RÉFLEXION/);
    await check(p,`${tag}-details`);
    const original = await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2'));
    await tap(p,/RIPASSA GLI ERRORI|REVIEW ERRORS|REVOIR LES ERREURS/);
    await scene(p,'Case');
    await check(p,`${tag}-review`);
    await tap(p,/MAPPA|MAP|CARTE/);
    await scene(p,'CityMap');
    assert.equal(await p.locator('#reading-layer section').nth(2).locator('li').count(),4,'map must expose all four city indicators');
    assert.equal(await p.locator('#reading-layer ul:visible').count(),1,'map must not duplicate the file buttons as a second list');
    await check(p,`${tag}-map`);
    assert.equal(await p.evaluate(() => localStorage.getItem('no-ai-act-save-v2')),original,'review must preserve original save');
    // Restore the signed report fixture only to inspect consequences independently
    // after the real review-return flow. No application state is rewritten.
    await p.evaluate(params => { window.game.scene.stop('CityMap'); window.game.scene.start('Report',params); },reportParams);
    await scene(p,'Report');
    await tap(p,/^PROSEGUI|^CONTINUE|^CONTINUER|^POURSUIVRE/);
    await scene(p,'Consequence');
    await check(p,`${tag}-consequences`);
    if(width === 390) {
      await tap(p,/CONSULTA COMUNQUE|CONSULT THE NORM|CONSULTER QUAND/);
      await scene(p,'NormCard');
      await tap(p,/MAPPA|MAP|CARTE/);
      await scene(p,'CityMap');
      await tap(p,/ARCHIVIO|ARCHIVE/);
      await scene(p,'Archive');
      await p.getByRole('searchbox').fill('AI');
      await check(p,`${tag}-archive`);
      const firstNorm = p.locator('#action-layer .action-btn:not([hidden])').first();
      await firstNorm.tap();
      await check(p,`${tag}-norm-detail`);
      await tap(p,/^Chiudi$|^Close$|^Fermer$/);
      assert.equal(await p.getByRole('searchbox').inputValue(), 'AI', 'archive query must survive detail close');
      assert.match(await p.locator('[data-reading-status="archive-search"]').innerText(), /AI/);
    }
    results.push({lang,width,height,deviceScaleFactor,flow:'pass'});
    console.log(`${tag}: PASS`);
    await closeProfile();
  }
  assert.deepEqual(errors,[]);
  const resultName = process.env.QUICK ? `results-quick-${reducedMotion ? 'reduced' : 'full'}` : process.env.ONLY ? `results-${process.env.ONLY}` : 'results';
  writeFileSync(`${out}/${resultName}.json`,JSON.stringify({results,errors,reducedMotion},null,2));
} catch (error) {
  console.error('Page exceptions:', JSON.stringify(errors));
  throw error;
} finally { await browser?.close(); }

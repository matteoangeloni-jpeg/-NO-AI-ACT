import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
const out='scripts/smoke/out/release-candidate';mkdirSync(out,{recursive:true});
const browser=await chromium.launch(smokeBrowserLaunchOptions());const results=[];
try {
  for(const lang of ['it','en','fr']) {
    const context=await browser.newContext({viewport:{width:1280,height:720},hasTouch:true,reducedMotion:'reduce'});
    await context.route(/cloudflareinsights/,r=>r.abort());
    await context.addInitScript(language=>localStorage.setItem('no-ai-act-save-v2',JSON.stringify({version:2,language,briefingSeen:true,reducedMotion:true,audioMuted:true})),lang);
    const p=await context.newPage();await p.goto(`${process.env.BASE??'http://localhost:4212'}/play/?lang=${lang}`);
    const scene=async name=>{await p.waitForFunction(k=>window.game?.scene.isActive(k),name,{timeout:30000});await p.evaluate(()=>new Promise(r=>window.game.events.once('poststep',r)));};
    await scene('Title');
    await p.evaluate(()=>{for(const s of window.game.scene.getScenes(true))s.scene.stop();window.game.scene.start('Archive',{from:'Title'});});await scene('Archive');
    await p.locator('#reading-layer input').focus();
    const searchVisible=await p.locator('body').evaluate(b=>b.classList.contains('reading-visible'));
    if(!process.env.AUDIT_ONLY)assert(searchVisible,`${lang}: search focus must reveal reading surface`);
    await p.evaluate(()=>document.body.classList.remove('reading-visible'));
    await p.setViewportSize({width:390,height:844});
    await p.evaluate(()=>{for(const s of window.game.scene.getScenes(true))s.scene.stop();window.game.scene.start('Case',{caseId:'case_scoring'});});await scene('Case');
    await p.getByRole('button',{name:/GUIDA INDAGINE|INVESTIGATION GUIDE|GUIDE D'ENQUÊTE/}).tap();
    await p.waitForFunction(()=>document.querySelector('#app')?.getAttribute('aria-modal')==='true');
    await p.setViewportSize({width:1280,height:720});await p.waitForFunction(()=>!document.body.classList.contains('mobile-presentation'));
    await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.body.classList.contains('mobile-presentation'));
    const modal=await p.evaluate(()=>({role:document.querySelector('#app').getAttribute('role'),modal:document.querySelector('#app').getAttribute('aria-modal'),label:document.querySelector('#app').getAttribute('aria-label'),backInert:document.querySelector('#site-return').inert}));
    if(!process.env.AUDIT_ONLY){assert.equal(modal.role,'dialog');assert.equal(modal.modal,'true');assert(modal.label);assert(modal.backInert);}
    await p.screenshot({path:`${out}/${process.env.AUDIT_ONLY?'before':'after'}-${lang}-modal-breakpoint.png`});
    const buttons=p.locator('.action-btn:not([hidden])');await buttons.last().focus();await p.keyboard.press('Tab');
    const trapped=await buttons.first().evaluate(el=>el===document.activeElement);if(!process.env.AUDIT_ONLY)assert(trapped);
    results.push({lang,searchVisible,modal,trapped,screenReader:'not manually tested'});await context.close();
  }
  writeFileSync(`${out}/a11y-${process.env.AUDIT_ONLY?'before':'after'}.json`,JSON.stringify(results,null,2));
  console.log(`RC targeted accessibility ${process.env.AUDIT_ONLY?'BASELINE RECORDED':'PASS'}: ${results.length} languages, search focus and modal breakpoint restore.`);
}finally{await browser.close();}

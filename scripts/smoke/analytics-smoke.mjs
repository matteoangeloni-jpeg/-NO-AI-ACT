import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const port = Number(process.env.ANALYTICS_TEST_PORT || 4213);
const base = `http://127.0.0.1:${port}`;
const out = 'scripts/smoke/out/analytics';
mkdirSync(out,{recursive:true});
const server = spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{
  stdio:['ignore','ignore','inherit'],env:{...process.env,VITE_ANALYTICS_PROVIDER:'console'}
});
let browser;
let currentPage;
const errors=[], results=[];
const stop = () => { if(server.exitCode===null) server.kill(); };
process.on('exit',stop);
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{stop();process.exit(130);});
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
const scene = (p,key) => p.waitForFunction(k=>window.game?.scene.isActive(k),key,{timeout:30000});
async function tap(p,name) {
  const b=p.getByRole('button',{name}).first();
  await b.tap();
}
async function words(p) {
  return p.evaluate(async()=>{
    const {L,LANGUAGE_LABELS}=await import('/src/game/i18n/index.ts');
    const t=L(); return {settings:t.ui.menu.settings,newGame:t.ui.menu.newGame,continue:t.ui.menu.continue,
      languages:LANGUAGE_LABELS,guide:t.gameplay.guide,skip:t.gameplay.skip,closeGuide:t.gameplay.close,
      examine:t.ui.case.examineButton,sign:t.ui.decision.sign,debrief:t.ui.decisionDebrief.button,
      close:t.ui.decisionDebrief.close,toMap:t.ui.sessionEnd.toMap,menu:t.ui.map.menuButton,endShift:t.ui.normCard.endOfShift};
  });
}
async function snapshot(p) { return p.evaluate(()=>window.playerTelemetry.snapshot()); }
function count(rows,event) { return rows.filter(r=>r.event===event).reduce((sum,r)=>sum+r.count,0); }
async function eventCount(p,event,n) {
  await p.waitForFunction(({event,n})=>window.playerTelemetry.snapshot().filter(r=>r.event===event).reduce((s,r)=>s+r.count,0)===n,{event,n});
}
async function newGame(p) {
  const ui=await words(p); await tap(p,ui.newGame);
  for(let i=0;i<4;i++) await tap(p,/^(MODALITÀ:|MODE\s*:)/);
  await tap(p,/^(INIZIA|START|COMMENCER)/);
  await p.waitForFunction(()=>window.game?.scene.isActive('Case') || window.game?.scene.isActive('Briefing'));
  if(await p.evaluate(()=>window.game.scene.isActive('Briefing'))) await tap(p,/APRI IL PRIMO FASCICOLO|OPEN THE FIRST FILE|OUVRIR LE PREMIER DOSSIER/);
  await scene(p,'Case');
  assert.equal(await p.evaluate(async()=> (await import('/src/game/systems/StateManager.ts')).StateManager.gamePlan.caseIds.length),1);
}
async function evidence(p,exerciseRecitation=false) {
  await tap(p,(await words(p)).examine); await scene(p,'Evidence');
  const slots=p.locator('#reading-layer [data-action-slot]'); assert.equal(await slots.count(),3);
  for(let i=0;i<3;i++) {
    await slots.nth(i).getByRole('button').tap();
    if(i!==1) {
      await slots.nth(i).getByRole('button').tap();
      if(i===0 && exerciseRecitation) {
        await slots.nth(i).getByRole('button').tap(); await slots.nth(i).getByRole('button').tap();
      }
    }
  }
  await tap(p,/CLASSIFICA|CLASSIFY|CLASSER|CLASSIFICATION/); await scene(p,'Decision');
  for(const key of [5,7,4,1]) {
    const previous=await p.locator('#reading-layer h2').innerText();
    await tap(p,new RegExp(`^${key}\\.`));
    await p.waitForFunction(old=>document.querySelector('#reading-layer h2')?.textContent!==old,previous);
  }
  await p.getByRole('button',{name:(await words(p)).sign}).evaluate(el=>window.previousSignature=el);
  await tap(p,(await words(p)).sign); await scene(p,'Report');
  await p.evaluate(()=>window.previousSignature.click());
}
async function makePage(lang,dnt=false) {
  const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
  const outbound=[];
  ctx.on('request',r=>{
    const u=new URL(r.url());
    if(u.origin!==base || r.method()==='POST' || /\/(collect|track|event|api\/send|cdn-cgi\/rum)(\/|$)/.test(u.pathname)) outbound.push({url:r.url(),method:r.method()});
  });
  await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  await ctx.addInitScript(({lang,dnt})=>{
    if(dnt) Object.defineProperty(navigator,'doNotTrack',{get:()=> '1',configurable:true});
    localStorage.setItem('no-ai-act-save-v2',JSON.stringify({version:2,language:lang,briefingSeen:true,
      sessionMinutes:15,reducedMotion:true,audioMuted:true,musicEnabled:false,sfxEnabled:false}));
  },{lang,dnt});
  const p=await ctx.newPage(); p.setDefaultTimeout(20000); p.on('pageerror',e=>errors.push(String(e)));
  currentPage=p;
  await p.goto(`${base}/play/?lang=${lang}`); await scene(p,'Title');
  return {ctx,p,outbound};
}

try {
  const deadline=Date.now()+30000; let ready=false;
  while(Date.now()<deadline && server.exitCode===null) {
    try {ready=(await fetch(`${base}/play/`,{signal:AbortSignal.timeout(1000)})).ok;} catch { /* starting */ }
    if(ready) break; await sleep(200);
  }
  assert(ready,'isolated local dev server did not start');
  browser=await chromium.launch(smokeBrowserLaunchOptions());
  for(const lang of ['it','en','fr']) {
    const {ctx,p,outbound}=await makePage(lang);
    let ui=await words(p); const other=lang==='en'?'it':'en';
    await tap(p,ui.settings); await tap(p,ui.languages[other]);
    await p.waitForFunction(l=>document.documentElement.lang===l,other);
    ui=await words(p); await tap(p,ui.settings); await tap(p,ui.languages[lang]);
    await p.waitForFunction(l=>document.documentElement.lang===l,lang);
    await newGame(p); ui=await words(p);
    await tap(p,ui.guide); await tap(p,ui.skip);
    await tap(p,ui.guide); await tap(p,ui.closeGuide);
    if(lang==='fr') await ctx.setOffline(true);
    await evidence(p,true); await eventCount(p,'case_completed',1);
    let rows=await snapshot(p);
    for(const event of ['game_started','case_started','citation_error','decision_submitted','report_signed',
      'case_completed','tutorial_started','tutorial_skipped','tutorial_completed']) assert.equal(count(rows,event),1,`${lang}: ${event}`);
    assert.equal(count(rows,'evidence_opened'),3); assert.equal(count(rows,'evidence_cited'),2);
    assert.equal(count(rows,'case_result'),0); assert.equal(count(rows,'language_selected'),2);
    assert.equal(count(rows,'mode_selected'),4); assert.equal(count(rows,'hint_requested'),2);
    assert(rows.find(r=>r.event==='case_completed').properties.hintUsed);
    await tap(p,ui.debrief); await tap(p,ui.close); await tap(p,ui.debrief); await tap(p,ui.close);
    await eventCount(p,'debrief_opened',1);
    await tap(p,/^PROSEGUI|^CONTINUE|^POURSUIVRE|^CONTINUER/); await scene(p,'Consequence');
    await tap(p,/CONSULTA COMUNQUE|CONSULT THE NORM|CONSULTER QUAND/); await scene(p,'NormCard');
    await tap(p,ui.endShift); await scene(p,'SessionEnd'); await eventCount(p,'session_completed',1);
    await tap(p,ui.toMap); await scene(p,'CityMap'); await tap(p,ui.menu); await scene(p,'Title');
    await tap(p,ui.continue); await scene(p,'CityMap'); await eventCount(p,'game_resumed',1);
    await tap(p,ui.menu); await scene(p,'Title');
    await tap(p,ui.newGame); for(let i=0;i<3;i++) await tap(p,/^(MODALITÀ:|MODE\s*:)/);
    const original=await p.evaluate(()=>localStorage.getItem('no-ai-act-save-v2'));
    await tap(p,/^(INIZIA|START|COMMENCER)/); await scene(p,'Case'); await eventCount(p,'review_started',1);
    await tap(p,/MAPPA|MAP|CARTE/); await scene(p,'CityMap'); await eventCount(p,'case_abandoned',1);
    assert.equal(await p.evaluate(()=>localStorage.getItem('no-ai-act-save-v2')),original,'review must preserve the save');
    assert(await p.evaluate(async()=>{
      const {validateAggregate}=await import('/src/game/systems/analyticsSchema.ts');
      return window.playerTelemetry.snapshot().every(validateAggregate);
    }));
    assert.deepEqual(outbound,[],`${lang}: telemetry network attempts`);
    await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));
    rows=await snapshot(p);
    assert(count(rows,'game_session_ended')>=1);
    assert.deepEqual(outbound,[]);
    results.push({lang,offline:lang==='fr',events:rows,networkAttempts:outbound});
    console.log(`${lang}: actual UI, signatures, tutorial, review and offline counters PASS`);
    await ctx.close();
  }
  const {ctx,p,outbound}=await makePage('it',true); await newGame(p); await evidence(p);
  assert.deepEqual(await snapshot(p),[],'DNT must suppress local collection as well');
  assert.deepEqual(outbound,[]); await ctx.close();
  assert.deepEqual(errors,[]);
  writeFileSync(`${out}/results.json`,JSON.stringify({results,dnt:'pass',errors},null,2));
  console.log('analytics smoke PASS: IT/EN/FR, offline, DNT, zero telemetry requests');
} catch(error) {
  if(currentPage && !currentPage.isClosed()) {
    console.error(await currentPage.evaluate(()=>({scenes:window.game?.scene.getScenes(true).map(s=>s.scene.key),buttons:[...document.querySelectorAll('.action-btn:not([hidden])')].map(b=>b.textContent)})));
    await currentPage.screenshot({path:`${out}/failure.png`}).catch(()=>{});
  }
  console.error('Page exceptions:',errors); throw error;
} finally {
  await browser?.close(); stop(); process.removeListener('exit',stop);
}

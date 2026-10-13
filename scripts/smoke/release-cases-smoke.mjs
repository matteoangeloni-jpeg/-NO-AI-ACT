import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';

const compiled=ts.transpileModule(readFileSync('src/game/data/cases.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{}};vm.runInNewContext(compiled,sandbox);const cases=sandbox.exports.PLAYABLE_CASES;assert.equal(cases.length,14);
const port=4217, base=`http://127.0.0.1:${port}`, out='scripts/smoke/out/release-candidate';mkdirSync(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:['ignore','ignore','inherit'],env:{...process.env,VITE_ANALYTICS_PROVIDER:'console'}});
let browser, current;const errors=[], results=[], telemetry=[], requests=[];
const scene=async(p,name)=>{
  await p.waitForFunction(key=>window.game?.scene.isActive(key),name,{timeout:30000});
  await p.evaluate(()=>new Promise(resolve=>window.game.events.once('poststep',()=>window.game.events.once('poststep',resolve))));
};
const activate=async(p,name)=>{const b=p.getByRole('button',{name}).first();await b.waitFor({state:'visible'});
  if(await p.locator('body').evaluate(el=>el.classList.contains('mobile-presentation')))await b.tap();
  else {await b.focus();await p.keyboard.press('Enter');}
  await p.evaluate(()=>document.activeElement?.blur());
};
try {
  const deadline=Date.now()+30000;
  while(true){try{if((await fetch(base)).ok)break;}catch{}if(Date.now()>deadline)throw new Error('RC dev preview unavailable');await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch(smokeBrowserLaunchOptions());
  for(const language of ['it','en','fr']) {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==base || r.request().method()==='POST'){requests.push({language,url:r.request().url()});return r.abort();}return r.continue();});
    await context.addInitScript(lang=>{if(!localStorage.getItem('no-ai-act-save-v2'))localStorage.setItem('no-ai-act-save-v2',JSON.stringify({version:2,language:lang,briefingSeen:true,reducedMotion:true,audioMuted:true,musicEnabled:false,sfxEnabled:false,gameMode:'libera'}));},language);
    const p=await context.newPage();current=p;p.on('pageerror',e=>errors.push(String(e)));p.setDefaultTimeout(30000);
    await p.goto(`${base}/play/?lang=${language}`);await scene(p,'Title');
    await activate(p,/NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/);await activate(p,/^(INIZIA|START|COMMENCER)/);
    await p.waitForFunction(()=>window.game.scene.isActive('CityMap')||window.game.scene.isActive('Case')||window.game.scene.isActive('Briefing'));
    await p.waitForFunction(()=>window.playerTelemetry.snapshot().some(r=>r.event==='pageview'&&['map','case','briefing'].includes(r.properties.phase)));
    // Fixture selection isolates each catalog entry. No mutation of its solution, report or evaluation.
    for(const data of cases) {
      await p.evaluate(id=>{for(const s of window.game.scene.getScenes(true))s.scene.stop();window.game.scene.start('Case',{caseId:id});},data.id);
      await scene(p,'Case');await p.keyboard.press('Enter');await scene(p,'Evidence');
      await prepareEvidenceWithKeyboard(p,{citeIndices:[...data.relevantClues],settleMs:40});await p.keyboard.press('Enter');
      if(data.hasIncident){await scene(p,'Incident');await p.keyboard.press('1');}
      await scene(p,'Decision');
      const keys=[['vietata','alto_rischio','trasparenza','basso_rischio','non_rilevante'].indexOf(data.correctClassification)+1,
        ['blocco','oversight','audit','informare','etichettare','dati_logging','nessuna'].indexOf(data.correctMeasures[0])+1,
        ['provider','deployer','autorita','responsabile_umano','fornitore_esterno'].indexOf(data.responsibleSubjectCorrect)+1,data.correctMotivation+1].map(String);
      await completeDecisionWithKeyboard(p,keys);await p.keyboard.press('Enter');await scene(p,'Report');
      const report=await p.evaluate(async id=>{
        const {StateManager}=await import('/src/game/systems/StateManager.ts');
        const s=window.game.scene.getScene('Report');return {quality:s.params.result.quality,saved:StateManager.completedCases[id],report:StateManager.caseReports[id]};
      },data.id);
      assert.equal(report.quality,'correct',`${language} ${data.id}: evaluation`);assert.equal(report.saved,'correct',`${language} ${data.id}: saved outcome`);assert(report.report);
      await activate(p,/DEBRIEF.*DECISION|DECISION DEBRIEF|DÉBRIEF.*DÉCISION/);
      assert((await p.locator('#reading-layer').innerText()).length>100);
      const closeName=await p.evaluate(async()=>(await import('/src/game/i18n/index.ts')).L().ui.decisionDebrief.close);
      await activate(p,closeName);
      if(data.id==='case_media'||data.id==='case_biometria')await p.screenshot({path:`${out}/${language}-${data.id}-report.png`});
      await activate(p,/^PROSEGUI|^CONTINUE|^POURSUIVRE|^CONTINUER/);await scene(p,'Consequence');
      assert.match(await p.locator('#reading-layer').innerText(),language==='it'?/Prima.*Dopo.*Variazione/s:language==='en'?/Before.*After.*Change/s:/Avant.*Après.*Variation/s);
      await p.keyboard.press('Enter');await scene(p,'NormCard');
      const norm=await p.evaluate(async id=>(await import('/src/game/systems/StateManager.ts')).StateManager.unlockedNorms.includes(id),data.normId);assert(norm);
      const backName=await p.evaluate(async()=>(await import('/src/game/i18n/index.ts')).L().ui.normCard.backToMap);
      await activate(p,backName);await scene(p,'CityMap');
      results.push({language,caseId:data.id,quality:'correct',signed:true,saved:true,debrief:true,consequences:true,norm:true,selection:'fixture; decisions via real UI'});
      console.log(`RC ${language} ${data.id}: signed, saved, debrief, consequence, norm PASS`);
      writeFileSync(`${out}/cases-progress.json`,JSON.stringify({results,events:await p.evaluate(()=>window.playerTelemetry.snapshot()),diagnostics:await p.evaluate(()=>window.playerTelemetry.diagnostics())},null,2));
    }
    const events=await p.evaluate(()=>window.playerTelemetry.snapshot());
    for(const event of ['case_completed','report_signed'])assert.equal(events.filter(r=>r.event===event).reduce((n,r)=>n+r.count,0),14,`${language}: ${event}`);
    telemetry.push({language,events});
    const original=await p.evaluate(()=>localStorage.getItem('no-ai-act-save-v2'));
    await p.reload();await scene(p,'Title');
    const restored=await p.evaluate(async()=>{const {StateManager}=await import('/src/game/systems/StateManager.ts');return {completed:Object.keys(StateManager.completedCases).length,reports:Object.keys(StateManager.caseReports).length};});
    assert.equal(restored.completed,14);assert.equal(restored.reports,14);
    // Reload is intentionally a new observation; persist gameplay, not analytics history.
    const first=JSON.parse(original);const saved=JSON.parse(await p.evaluate(()=>localStorage.getItem('no-ai-act-save-v2')));assert.deepEqual(saved.completedCases,first.completedCases);assert.deepEqual(saved.caseReports,first.caseReports);
    await context.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  writeFileSync(`${out}/cases-results.json`,JSON.stringify({results,errors,requests,telemetry,limitations:['Catalog entries selected by fixture, not 42 independent human map journeys','Automation is not a human playtest']},null,2));
  console.log('RC 42 case/language journeys PASS; saved reports restore in all languages.');
}catch(error){if(current&&!current.isClosed())await current.screenshot({path:`${out}/cases-failure.png`}).catch(()=>{});throw error;}
finally{await browser?.close();server.kill();if(server.exitCode===null)await new Promise(r=>server.once('exit',r));}

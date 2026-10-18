import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';
const browser=await chromium.launch(smokeBrowserLaunchOptions());const results=[];
try {
  for(const language of ['it','en','fr']) {
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
    await context.route(/cloudflareinsights/,r=>r.abort());
    await context.addInitScript(lang=>{if(!localStorage.getItem('no-ai-act-save-v2'))localStorage.setItem('no-ai-act-save-v2',JSON.stringify({version:2,language:lang,gameMode:'sorpresa',sessionMinutes:15,briefingSeen:true,reducedMotion:true,audioMuted:true}));},language);
    const p=await context.newPage();await p.goto(`${process.env.BASE??'http://localhost:4212'}/play/?lang=${language}`);
    const scene=async name=>{await p.waitForFunction(k=>window.game?.scene.isActive(k),name,{timeout:30000});await p.evaluate(()=>new Promise(r=>window.game.events.once('poststep',r)));};
    await scene('Title');await p.getByRole('button',{name:/NUOVA PARTITA|NEW GAME|NOUVELLE PARTIE/}).tap();
    await p.getByRole('button',{name:/^(INIZIA|START|COMMENCER)/}).tap();
    await p.waitForFunction(()=>window.game.scene.isActive('Case')||window.game.scene.isActive('Briefing'),undefined,{timeout:30000});
    if(await p.evaluate(()=>window.game.scene.isActive('Briefing')))await p.getByRole('button',{name:/APRI IL PRIMO FASCICOLO|OPEN THE FIRST FILE|OUVRIR LE PREMIER DOSSIER/}).tap();
    await scene('Case');
    const settings=await p.evaluate(()=>JSON.parse(localStorage.getItem('no-ai-act-save-v2')));
    assert.equal(settings.gameMode,'sorpresa');assert.equal(settings.difficulty,'expert');
    const data=await p.evaluate(()=>window.game.scene.getScene('Case').caseData);
    await p.getByRole('button',{name:/ESAMINA I REPERTI|EXAMINE.*EXHIBITS|EXAMINER LES PIÈCES/}).tap();await scene('Evidence');
    await prepareEvidenceWithKeyboard(p,{citeIndices:data.relevantClues,settleMs:60});
    await p.keyboard.press('Enter');if(data.hasIncident){await scene('Incident');await p.keyboard.press('1');}await scene('Decision');
    const keys=[['vietata','alto_rischio','trasparenza','basso_rischio','non_rilevante'].indexOf(data.correctClassification)+1,
      ['blocco','oversight','audit','informare','etichettare','dati_logging','nessuna'].indexOf(data.correctMeasures[0])+1,
      ['provider','deployer','autorita','responsabile_umano','fornitore_esterno'].indexOf(data.responsibleSubjectCorrect)+1,data.correctMotivation+1].map(String);
    await completeDecisionWithKeyboard(p,keys);await p.keyboard.press('Enter');await scene('Report');
    assert.equal(await p.evaluate(()=>window.game.scene.getScene('Report').params.result.quality),'correct');
    await p.getByRole('button',{name:/^PROSEGUI|^CONTINUE|^POURSUIVRE|^CONTINUER/}).tap();await scene('Consequence');
    await p.keyboard.press('Enter');await scene('NormCard');
    results.push({language,mode:'sorpresa',caseId:data.id,quality:'correct',reached:'NormCard',selection:'real random plan; one-case session'});await context.close();
  }
  writeFileSync('scripts/smoke/out/release-candidate/surprise-results.json',JSON.stringify(results,null,2));console.log('RC Sorpresa PASS: three languages, actual random plan, one signed case and consequences each.');
}finally{await browser.close();}

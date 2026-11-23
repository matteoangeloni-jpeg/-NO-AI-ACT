import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {smokeBrowserLaunchOptions} from './lib-browser.mjs';
import {PLAYABLE_LANGUAGES,languageCode} from '../../src/site/route-inventory.mjs';
const out='scripts/smoke/out/localization-audit';mkdirSync(out,{recursive:true});
const server=await createServer({mode:'test',server:{host:'127.0.0.1',port:4251,strictPort:true},define:{'import.meta.env.VITE_ANALYTICS_PROVIDER':JSON.stringify('console')}});await server.listen();
const base='http://127.0.0.1:4251',results=[],errors=[],blocked=[];let browser,current;
const scene=async(page,name)=>{await page.waitForFunction(key=>window.game?.scene.isActive(key),name,{timeout:60000});await page.evaluate(()=>new Promise(resolve=>window.game.events.once('poststep',()=>window.game.events.once('poststep',resolve))));};
async function state(page){return page.evaluate(async()=>{const {StateManager}=await import('/src/game/systems/StateManager.ts');return {language:StateManager.language,documentLanguage:document.documentElement.lang,saved:JSON.parse(localStorage.getItem('no-ai-act-save-v2'))};});}
try{
 browser=await chromium.launch(smokeBrowserLaunchOptions());
 for(const language of PLAYABLE_LANGUAGES){
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await context.route('**/*',route=>{const request=route.request();if(new URL(request.url()).origin!==base||request.method()==='POST'){blocked.push({language,method:request.method(),url:request.url()});return route.abort();}return route.continue();});
  await context.addInitScript(()=>{if(!localStorage.getItem('no-ai-act-save-v2')&&!localStorage.getItem('no-ai-act-save-v1'))localStorage.setItem('no-ai-act-save-v1',JSON.stringify({language:'it',briefingSeen:true,reducedMotion:true,audioMuted:true}));});
  const page=await context.newPage();current=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(String(error)));
  const portal=language==='it'?'/':`/${language}/`;await page.goto(base+portal,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),languageCode(language));
  const links=page.locator(`a[href$="play/?lang=${language}"]`);assert(await links.count()>0,`${language}: portal handoff missing`);
  await links.first().click();await scene(page,'Title');let actual=await state(page);
  assert.equal(actual.language,language);assert.equal(actual.documentLanguage,languageCode(language));assert.equal(actual.saved.version,2);assert.equal(actual.saved.language,language);
  await page.screenshot({path:`${out}/${language}-title-desktop.png`});
  // Change language through a real keyboard-activated selector, then reload
  // without a URL override to prove persistence and document accessibility.
  const next=PLAYABLE_LANGUAGES[(PLAYABLE_LANGUAGES.indexOf(language)+1)%PLAYABLE_LANGUAGES.length];
  const settingsLabel=await page.evaluate(async()=>(await import('/src/game/i18n/index.ts')).L().ui.menu.settings);
  await page.getByRole('button',{name:settingsLabel,exact:true}).focus();await page.keyboard.press('Enter');
  const label=await page.evaluate(async code=>(await import('/src/game/i18n/index.ts')).LANGUAGE_LABELS[code],next);
  const control=page.getByRole('button',{name:label,exact:true});await control.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(async code=>(await import('/src/game/systems/StateManager.ts')).StateManager.language===code,next);
  await page.goto(base+'/play/');await scene(page,'Title');actual=await state(page);
  assert.equal(actual.language,next);assert.equal(actual.documentLanguage,languageCode(next));
  await page.goto(base+`/play/?lang=${language}`);await scene(page,'Title');
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.body.classList.contains('mobile-presentation'));
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${language}: mobile overflow`);
  const controls=await page.getByRole('button').evaluateAll(elements=>elements.filter(el=>el.getClientRects().length).map(el=>({name:el.getAttribute('aria-label')||el.textContent?.trim(),width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})));
  assert(controls.length>0&&controls.every(control=>control.name),`${language}: unnamed visible control`);
  const locale=await page.evaluate(async()=>(await import('/src/game/i18n/index.ts')).L());
  await page.getByRole('button',{name:locale.ui.menu.newGame,exact:true}).click();
  const start=page.getByRole('button',{name:locale.ui.newGamePanel.start,exact:true});await start.focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>['Case','Briefing','CityMap'].some(key=>window.game.scene.isActive(key)));
  results.push({language,documentTag:languageCode(language),portal:true,queryPriority:true,migratedV1:true,keyboardSelection:next,persistedWithoutQuery:true,mobile:true,namedControls:controls.length,newGame:true});
  writeFileSync(`${out}/progress.json`,JSON.stringify({results,errors,blocked},null,2));console.log(`${language}: portal, v1 migration, selector, reload, mobile and keyboard start PASS`);
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.equal(results.length,PLAYABLE_LANGUAGES.length);
 assert.equal(blocked.filter(request=>request.method==='POST').length,0,'unexpected collection attempt');
 writeFileSync(`${out}/results.json`,JSON.stringify({results,errors,externalTransmissions:0,blockedRequests:blocked},null,2));
}catch(error){await current?.screenshot({path:`${out}/failure.png`}).catch(()=>{});throw error;}
finally{await browser?.close();await server.close();}

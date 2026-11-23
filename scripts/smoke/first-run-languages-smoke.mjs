import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {smokeBrowserLaunchOptions} from './lib-browser.mjs';
import {PLAYABLE_LANGUAGES,languageCode} from '../../src/site/route-inventory.mjs';
const out='scripts/smoke/out/first-run-languages';mkdirSync(out,{recursive:true});
const server=await createServer({mode:'test',server:{host:'127.0.0.1',port:4255,strictPort:true},define:{'import.meta.env.VITE_ANALYTICS_PROVIDER':JSON.stringify('console')}});await server.listen();
const base='http://127.0.0.1:4255',results=[],errors=[],requests=[];let browser,current;
const normalize=text=>text.replace(/\s+/g,' ').trim();
const scene=async(page,name)=>{await page.waitForFunction(key=>window.game?.scene.isActive(key),name,{timeout:60000});await page.evaluate(()=>new Promise(r=>window.game.events.once('poststep',r)));};
const activate=async(page,label)=>{const button=page.getByRole('button',{name:label,exact:true});await button.focus();await page.keyboard.press('Enter');await page.evaluate(()=>document.activeElement?.blur());};
try{
 const launch=smokeBrowserLaunchOptions();launch.args.push('--mute-audio');browser=await chromium.launch(launch);
 for(const language of PLAYABLE_LANGUAGES){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
  await context.route('**/*',route=>{const request=route.request();if(new URL(request.url()).origin!==base||request.method()==='POST'){requests.push(request.url());return route.abort();}return route.continue();});
  const page=await context.newPage();current=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(String(error)));
  await page.goto(`${base}/play/?lang=${language}`);await scene(page,'Title');
  const locale=await page.evaluate(async()=>(await import('/src/game/i18n/index.ts')).L());
  assert.equal(await page.evaluate(async()=>(await import('/src/game/systems/StateManager.ts')).StateManager.briefingSeen),false);
  await activate(page,locale.ui.menu.newGame);await activate(page,locale.ui.newGamePanel.start);await scene(page,'Briefing');
  const reading=normalize(await page.locator('#reading-layer').textContent());assert(reading.includes(normalize(locale.briefing.body)));assert(reading.includes(normalize(locale.briefing.how)));
  await page.keyboard.press('Space');
  const start=page.getByRole('button',{name:locale.briefing.ctaFirstCase,exact:true});await start.waitFor({state:'visible'});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${language}: briefing overflow`);
  await page.screenshot({path:`${out}/${language}-briefing-mobile.png`});await activate(page,locale.briefing.ctaFirstCase);await scene(page,'Case');
  await activate(page,locale.gameplay.guide);
  const tutorial=normalize(await page.locator('#reading-layer').textContent());for(const step of locale.gameplay.steps)assert(tutorial.includes(normalize(step)),`${language}: missing tutorial step`);
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${language}: tutorial overflow`);
  await page.screenshot({path:`${out}/${language}-tutorial-mobile.png`});await activate(page,locale.gameplay.close);
  assert.equal(await page.locator('html').getAttribute('lang'),languageCode(language));
  assert.equal(await page.evaluate(async()=>(await import('/src/game/systems/StateManager.ts')).StateManager.briefingSeen),true);
  if(language==='pt'){await page.goto(`${base}/play/?lang=pt-PT`);await scene(page,'Title');assert.equal(await page.evaluate(async()=>(await import('/src/game/systems/StateManager.ts')).StateManager.language),'pt');}
  results.push({language,freshContext:true,briefing:true,firstCase:true,guideSteps:locale.gameplay.steps.length,keyboard:true,mobile:true,briefingSaved:true,portugueseAlias:language==='pt'?true:undefined});
  writeFileSync(`${out}/progress.json`,JSON.stringify({results,errors,requests},null,2));console.log(`${language}: fresh briefing, first case and complete procedural guide PASS`);await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.equal(results.length,PLAYABLE_LANGUAGES.length);writeFileSync(`${out}/results.json`,JSON.stringify({results,errors,requests,externalTransmissions:0},null,2));
}catch(error){await current?.screenshot({path:`${out}/failure.png`}).catch(()=>{});throw error;}
finally{await browser?.close();await server.close();}

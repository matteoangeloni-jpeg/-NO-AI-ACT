import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const port=4215, url=`http://127.0.0.1:${port}`, password=randomBytes(24).toString('base64url');
const output=new URL('./out/player-insights/',import.meta.url);
await mkdir(output,{recursive:true});
const server=spawn(process.execPath,['--import','tsx','analytics/local-server.ts'],{cwd:process.cwd(),env:{...process.env,INSIGHTS_PORT:String(port),INSIGHTS_TEST_PASSWORD:password},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',chunk=>logs+=chunk);server.stderr.on('data',chunk=>logs+=chunk);
let browser;
const errors=[],external=[];const results=[];
try {
  const deadline=Date.now()+30000;
  while(true) { try { if((await fetch(url)).status===200)break; }catch{} if(Date.now()>deadline)throw new Error(`Server unavailable: ${logs}`);await new Promise(resolve=>setTimeout(resolve,100)); }
  assert.match(await(await fetch(url)).text(),/Password locale/);
  for(const path of ['/dashboard.js','/forecast.js','/dashboard.css','/api/stats','/api/export.csv'])assert.equal((await fetch(url+path)).status,401);
  assert.equal((await fetch(url+'/collect',{method:'POST'})).status,503);
  browser=await chromium.launch();
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin!==url){external.push(route.request().url());return route.abort();}return route.continue();});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);await page.locator('#password').fill(password);await page.getByRole('button',{name:'Accedi',exact:true}).click();await page.locator('#status').filter({hasText:'Aggiornato'}).waitFor();
  assert.match(await page.locator('#classification').innerText(),/SINTETICI/);
  const auth={Authorization:`Basic ${Buffer.from(`reviewer:${password}`).toString('base64')}`};
  const source=await (await fetch(url+'/api/stats',{headers:auth})).json();
  const sum=event=>source.rows.filter(r=>r.event===event).reduce((n,r)=>n+r.count,0);
  const metrics=await page.locator('#kpis .metric strong').allTextContents();
  assert.equal(Number(metrics[0].replace(/\./g,'')),sum('game_started')+sum('game_resumed'));
  assert.equal(Number(metrics[1].replace(/\./g,'')),sum('game_started'));
  assert.equal(Number(metrics[2].replace(/\./g,'')),sum('session_completed'));
  for(const viewport of [{width:360,height:800},{width:390,height:844},{width:768,height:1024},{width:1280,height:720},{width:1920,height:1080},{width:3840,height:2160}]) {
    await page.setViewportSize(viewport);
    for(const view of ['overview','gameplay','compare','lab','source']) {
      await page.locator(`[data-view="${view}"]`).click();await page.locator(`#${view}`).waitFor({state:'visible'});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${view} overflow ${viewport.width}`);
      if((viewport.width===390 && view==='overview') || (viewport.width===1280 && view!=='source'))await page.screenshot({path:fileURLToPath(new URL(`${view}-${viewport.width}.png`,output)),fullPage:true});
    }
    results.push({...viewport,views:5,overflow:false});
  }
  await page.setViewportSize({width:1280,height:720});await page.locator('[data-view="compare"]').click();
  await page.locator('[data-view="lab"]').click();
  assert.equal(await page.locator('#lab-models tbody tr').count(),5);
  await page.locator('#lab-horizon').selectOption('14');assert.equal(await page.locator('#lab-forecast tbody tr').count(),14);
  await page.locator('#lab-horizon').selectOption('1');assert.equal(await page.locator('#lab-forecast tbody tr').count(),1);
  await page.locator('[data-view="compare"]').click();
  await page.locator('#compare-dimension').selectOption('mode');assert.equal(await page.locator('#comparison tbody tr').count(),4);
  await page.locator('#compare-dimension').selectOption('version');assert.match(await page.locator('#comparison caption').innerText(),/Una sola versione/);
  await page.locator('[data-view="source"]').click();await page.locator('#export-dimension').selectOption('language');
  const csvURL=await page.locator('#export').getAttribute('href');
  const exported=await fetch(url+csvURL,{headers:auth});assert.equal(exported.status,200);const text=await exported.text();assert.match(text,/classification,day_utc,game_version/);assert.match(text,/'?"synthetic"/);
  const sourceRows=await page.locator('#source-rows tbody tr').count();assert.equal(text.trim().split('\r\n').length-1,sourceRows);
  const appliedFrom=await page.locator('input[name=from]').inputValue();
  const appliedTo=await page.locator('input[name=to]').inputValue();
  const alternate=new Date(Date.parse(appliedFrom)+86400000).toISOString().slice(0,10);
  await page.locator('input[name=from]').fill(alternate);await page.locator('#export-dimension').selectOption('mode');
  assert.equal(await page.locator('#export').getAttribute('href'),null,'unapplied dates must not export different rows');
  await page.locator('input[name=from]').fill(appliedFrom);await page.locator('#export-dimension').selectOption('language');
  assert.match(await page.locator('#export').getAttribute('href'),new RegExp(`from=${appliedFrom}`));
  // Retention clipping must not present a partial baseline as an equal-duration comparison.
  const boundary=new Date(Date.now()-89*86400000).toISOString().slice(0,10);
  await page.locator('input[name=from]').fill(new Date(Date.parse(boundary)+3*86400000).toISOString().slice(0,10));
  await page.locator('input[name=to]').fill(new Date(Date.parse(boundary)+16*86400000).toISOString().slice(0,10));
  await page.locator('button[type=submit]').click();await page.locator('#status').filter({hasText:'Aggiornato'}).waitFor();
  await page.locator('[data-view="compare"]').click();assert.match(await page.locator('#period').innerText(),/non comparabile/);
  assert.match(await page.locator('#period caption').innerText(),/3 giorni conservati/);
  await page.locator('input[name=from]').fill(appliedFrom);await page.locator('input[name=to]').fill(appliedTo);
  // Empty historical periods must be unavailable, not zero-player observations.
  await page.locator('input[name=from]').fill('2025-01-01');await page.locator('input[name=to]').fill('2025-01-14');await page.locator('button[type=submit]').click();
  await page.locator('#status').filter({hasText:'2025-01-01'}).waitFor();
  assert.equal(await page.locator('#kpis .metric strong').first().innerText(),'n.d.');
  await page.route('**/api/stats?**',route=>route.abort());await page.locator('button[type=submit]').click();await page.locator('#status.error').waitFor();assert.equal(await page.locator('#export').getAttribute('href'),null);
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  await writeFile(new URL('results.json',output),JSON.stringify({classification:'synthetic',results,unauthorized:'denied',collection:'disabled',reconciled:true,csvRows:sourceRows,networkFailure:'visible',externalRequests:0},null,2));
  console.log(`Player Insights PASS: ${results.length} viewports, 30 views, login, predictive models, auth, metrics, CSV, empty state and network failure.`);
} finally {
  await browser?.close();server.kill();
  if(server.exitCode===null)await new Promise(resolve=>server.once('exit',resolve));
}

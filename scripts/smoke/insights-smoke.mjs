import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

const port=4215,url=`http://127.0.0.1:${port}`,password=randomBytes(24).toString('base64url');
const output=new URL('./out/player-insights/',import.meta.url);await mkdir(output,{recursive:true});
const server=spawn(process.execPath,['--import','tsx','analytics/local-server.ts'],{cwd:process.cwd(),env:{...process.env,INSIGHTS_PORT:String(port),INSIGHTS_TEST_PASSWORD:password},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',c=>logs+=c);server.stderr.on('data',c=>logs+=c);let browser;
const errors=[],external=[];
try{
  const deadline=Date.now()+30000;while(true){try{if((await fetch(url)).status===200)break}catch{}if(Date.now()>deadline)throw new Error(`Server unavailable: ${logs}`);await new Promise(r=>setTimeout(r,100))}
  for(const path of ['/dashboard.js','/dashboard.css','/api/stats','/api/export.csv'])assert.equal((await fetch(url+path)).status,401);
  browser=await chromium.launch();const context=await browser.newContext({reducedMotion:'reduce'});
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin!==url){external.push(route.request().url());return route.abort()}return route.continue()});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  await page.locator('#password').fill(password);await page.getByRole('button',{name:'Accedi',exact:true}).click();
  await page.locator('#status').filter({hasText:'Aggiornato'}).waitFor();assert.match(await page.locator('#classification').innerText(),/SINTETICI/);
  const auth={Authorization:`Basic ${Buffer.from(`reviewer:${password}`).toString('base64')}`};
  const source=await(await fetch(url+'/api/stats',{headers:auth})).json();const sum=e=>source.rows.filter(r=>r.event===e).reduce((n,r)=>n+r.count,0);
  const metrics=await page.locator('#overview-kpis .metric strong').allTextContents();
  assert.equal(Number(metrics[0].replace(/\./g,'')),sum('game_started'));assert.equal(Number(metrics[1].replace(/\./g,'')),sum('game_resumed'));
  for(const id of ['overview','case-performance','decision-quality','educational-insights','technical-quality'])assert.equal(await page.locator(`#${id}`).count(),1);
  assert.ok(await page.locator('#evidence-quality .bar-row').count()>0,'schema v2 evidence distribution missing');
  assert.ok(await page.locator('#classification-pair .bar-row').count()>0,'schema v2 classification matrix missing');
  for(const viewport of [{width:360,height:800},{width:390,height:844},{width:768,height:1024},{width:1280,height:720},{width:1920,height:1080}]){
    await page.setViewportSize(viewport);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${viewport.width}`);
  }
  const cases=await page.locator('select[name=caseId] option').allTextContents();assert.ok(cases.length>2);await page.locator('select[name=caseId]').selectOption({index:1});
  await page.locator('#filters button[type=submit]').click();await page.locator('#status').filter({hasText:'Aggiornato'}).waitFor();assert.ok(await page.locator('#evidence-quality .bar-row').count()>0);
  const csvURL=await page.locator('#export').getAttribute('href');const exported=await fetch(url+csvURL,{headers:auth});assert.equal(exported.status,200);assert.match(await exported.text(),/classification,day_utc,game_version/);
  const from=await page.locator('input[name=from]').inputValue(),to=await page.locator('input[name=to]').inputValue();
  const rich=await fetch(url+`/api/export/decision-evidence.csv?from=${from}&to=${to}`,{headers:auth});assert.equal(rich.status,200);assert.match(await rich.text(),/telemetry_schema_version/);
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  await writeFile(new URL('results.json',output),JSON.stringify({classification:'synthetic',sections:5,viewports:5,externalRequests:0,schema:2},null,2));
  console.log('Player Insights v2 PASS: login, five sections, filters, aggregate + scientific CSV, responsive layout and no external requests.');
}finally{await browser?.close();server.kill();if(server.exitCode===null)await new Promise(r=>server.once('exit',r))}

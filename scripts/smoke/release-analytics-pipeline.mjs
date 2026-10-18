import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { randomBytes } from 'node:crypto';
import { validateAggregate } from '../../src/game/systems/analyticsSchema.ts';

const path='scripts/smoke/out/release-candidate';
const source=JSON.parse(readFileSync(`${path}/cases-results.json`,'utf8'));
assert.equal(source.results.length,42);assert.equal(source.telemetry.length,3);
const compiled=await build({entryPoints:['analytics/worker.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false});
const password=randomBytes(24).toString('base64url');
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'rc',modules:true,script:compiled.outputFiles[0].text,compatibilityDate:'2026-10-01',d1Databases:['DB'],
  bindings:{COLLECTION_ENABLED:'true',ALLOWED_ORIGIN:'https://www.no-ai-act.eu',LOCAL_TEST:'true',LOCAL_PASSWORD:password,DATA_CLASSIFICATION:'synthetic'},
  ratelimits:{INGEST_LIMITER:{namespace_id:'41001',simple:{limit:60,period:60}},ADMIN_LIMITER:{namespace_id:'41002',simple:{limit:120,period:60}}}
}]}));
const expected=new Map();const key=row=>JSON.stringify([row.day,row.version,row.event,row.dimension,row.value]);
const day=new Date().toISOString().slice(0,10);let batches=0;
try {
  const db=await mf.getD1Database('DB');
  for(const name of readdirSync('analytics/migrations').filter(f=>f.endsWith('.sql')).sort())await db.prepare(readFileSync(`analytics/migrations/${name}`,'utf8')).run();
  for(const fixture of source.telemetry) {
    assert(fixture.events.every(validateAggregate));
    for(const c of fixture.events) {
      // Independent recomputation: do not call the backend's project() helper.
      for(const [dimension,value] of [['all','*'],...Object.entries(c.properties)]) {
        const row={day,version:c.gameVersion,event:c.event,dimension,value:String(value)};
        const k=key(row);expected.set(k,(expected.get(k)??0)+c.count);
      }
    }
    for(let offset=0;offset<fixture.events.length;offset+=32) {
      const payload={batchId:crypto.randomUUID(),cells:fixture.events.slice(offset,offset+32)};
      const send=()=>mf.dispatchFetch('http://localhost/collect',{method:'POST',headers:{Origin:'https://www.no-ai-act.eu','Content-Type':'application/json'},body:JSON.stringify(payload)});
      assert.equal((await send()).status,202);assert.equal((await send()).status,202);batches++;
    }
  }
  const stored=await db.prepare('SELECT * FROM counters').all();
  assert.equal(stored.results.length,expected.size);
  for(const row of stored.results)assert.equal(row.count,expected.get(key(row)),`Mismatch ${key(row)}`);
  const signature=stored.results.filter(r=>r.dimension==='all' && r.event==='report_signed');assert.equal(signature[0].count,42);
  assert.equal((await mf.dispatchFetch('http://localhost/api/stats')).status,401);
  const headers={Authorization:`Basic ${Buffer.from(`reviewer:${password}`).toString('base64')}`};
  for(const dimension of ['all','language','mode','caseId','phase','result','durationBucket','hintUsed','tutorialVersion']) {
    const response=await mf.dispatchFetch(`http://localhost/api/stats?from=${day}&to=${day}&dimension=${dimension}`,{headers});assert.equal(response.status,200);
    const actual=await response.json();const visible=stored.results.filter(r=>r.dimension===dimension && r.count>=10);
    assert.equal(actual.rows.length,visible.length);for(const row of actual.rows)assert.equal(row.count,expected.get(key(row)));
  }
  writeFileSync(`${path}/analytics-pipeline-results.json`,JSON.stringify({classification:'synthetic test ingestion of locally observed automated gameplay',journeys:42,batches,transportAttempts:batches*2,rawCells:source.telemetry.reduce((n,t)=>n+t.events.length,0),storedMarginalCells:stored.results.length,signedReports:42,dedup:'PASS',independentReconciliation:'PASS',threshold:'PASS',anonymousRead:'DENIED',productionTransmission:false},null,2));
  console.log(`RC analytics pipeline PASS: 42 real UI signatures, ${batches} batches sent twice, ${stored.results.length} independently reconciled marginal counters; no production traffic.`);
}finally{await mf.dispose();}

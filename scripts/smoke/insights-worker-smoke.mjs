import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { build } from 'esbuild';
import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

process.env.WRANGLER_SEND_METRICS='false';
const bundled=await build({entryPoints:['analytics/worker.ts'],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false});
const password=randomBytes(24).toString('base64url');
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'insights',modules:true,script:bundled.outputFiles[0].text,compatibilityDate:'2026-10-01',d1Databases:['DB'],
  bindings:{LOCAL_TEST:'true',LOCAL_PASSWORD:password,COLLECTION_ENABLED:'true',ALLOWED_ORIGIN:'https://www.no-ai-act.eu',DATA_CLASSIFICATION:'synthetic'},
  ratelimits:{INGEST_LIMITER:{namespace_id:'41001',simple:{limit:60,period:60}},ADMIN_LIMITER:{namespace_id:'41002',simple:{limit:120,period:60}}}
}]}));
try {
  const db=await mf.getD1Database('DB');
  for(const file of (await readdir('analytics/migrations')).filter(f=>f.endsWith('.sql')).sort()) await db.prepare(await readFile(`analytics/migrations/${file}`,'utf8')).run();
  const headers={Origin:'https://www.no-ai-act.eu','Content-Type':'application/json'};
  const payload={batchId:crypto.randomUUID(),cells:[{schemaVersion:1,gameVersion:'4.0-candidate',event:'game_started',properties:{language:'fr',mode:'libera',phase:'menu'},count:12}]};
  const collect=()=>mf.dispatchFetch('http://localhost/collect',{method:'POST',headers,body:JSON.stringify(payload)});
  assert.equal((await collect()).status,202);assert.equal((await collect()).status,202);
  assert.ok((await Promise.all(Array.from({length:8},collect))).every(r=>r.status===202));
  const count=await db.prepare("SELECT count FROM counters WHERE dimension='all'").first();assert.equal(count.count,12);
  assert.equal((await mf.dispatchFetch('http://localhost/api/stats')).status,401);
  const admin={Authorization:`Basic ${Buffer.from(`reviewer:${password}`).toString('base64')}`};
  const response=await mf.dispatchFetch('http://localhost/api/stats',{headers:admin});assert.equal(response.status,200);
  const stats=await response.json();assert.equal(stats.rows[0].count,12);assert.equal(stats.classification,'synthetic');
  assert.equal((await mf.dispatchFetch('http://localhost/api/stats?language=fr&mode=libera',{headers:admin})).status,400);
  await db.prepare('UPDATE daily_quota SET count=100000').run();payload.batchId=crypto.randomUUID();assert.equal((await collect()).status,429);
  assert.equal((await db.prepare("SELECT count FROM counters WHERE dimension='all'").first()).count,12);
  const old='2000-01-01';await db.prepare("INSERT INTO counters VALUES(?, '4.0-candidate','game_started','all','*',10)").bind(old).run();
  // Real scheduled Worker handler, not the Node/SQLite substitute.
  const worker=await mf.getWorker();await worker.scheduled({cron:'15 3 * * *'});assert.equal((await db.prepare('SELECT count(*) n FROM counters WHERE day=?').bind(old).first()).n,0);
  console.log('Player Insights Worker PASS: actual workerd + D1, SQL migration, transaction dedupe/rollback, auth, projection guard and scheduled retention.');
} finally { await mf.dispose(); }

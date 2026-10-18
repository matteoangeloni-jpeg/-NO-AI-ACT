import { afterEach, describe, expect, it, vi } from 'vitest';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { readFileSync } from 'node:fs';
import { LocalDatabase } from '../analytics/local-db';
import { csv, ingest, LIMITS, parseQuery, project, purge, readCells, retentionWindow, validateBatch, type Batch } from '../analytics/aggregation';
import { authorized } from '../analytics/auth';
import { handle } from '../analytics/worker';
import type { Env } from '../analytics/types';
import { ANALYTICS_GAME_VERSION, ANALYTICS_SCHEMA_VERSION, type AnalyticsAggregate } from '../src/game/systems/analyticsSchema';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { prepareDelivery } from '../analytics/client-bridge';

const databases: LocalDatabase[] = [];
const database = () => { const d = new LocalDatabase(); databases.push(d); return d; };
afterEach(() => { databases.splice(0).forEach(d => d.close()); vi.restoreAllMocks(); });
const password = 'a-local-only-secret-at-least-24-characters';
const auth = `Basic ${btoa(`reviewer:${password}`)}`;
const base: AnalyticsAggregate = { schemaVersion: ANALYTICS_SCHEMA_VERSION, gameVersion: ANALYTICS_GAME_VERSION, event: 'game_started',
  properties: { language: 'it', mode: 'turno', phase: 'menu' }, count: 10 };
const batch = (cells = [base]): Batch => ({ batchId: crypto.randomUUID(), cells });
const allowed = { async limit() { return { success: true }; } };
function env(db = database()): Env { return { DB: db, COLLECTION_ENABLED: 'true', ALLOWED_ORIGIN: 'https://www.no-ai-act.eu', LOCAL_TEST: 'true', LOCAL_PASSWORD: password, INGEST_LIMITER: allowed, ADMIN_LIMITER: allowed }; }
function collect(body: unknown, headers: Record<string,string> = {}) {
  return new Request('https://insights.invalid/collect', { method: 'POST', headers: { Origin: 'https://www.no-ai-act.eu', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
function admin(path = '/api/stats', credential = auth) { return new Request(`http://127.0.0.1:4214${path}`, { headers: { Authorization: credential } }); }

describe('Sprint B closed ingestion envelope', () => {
  it('keeps the unused client bridge disabled by default and preserves the batch ID on an explicit retry', async () => {
    const send=vi.fn<typeof fetch>().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(Response.json({accepted:true},{status:202}));
    expect(await prepareDelivery([base],{enabled:false,approvedEndpoint:'https://insights.invalid/collect'},send).retry()).toBe('disabled');
    expect(send).not.toHaveBeenCalled();
    const delivery=prepareDelivery([base],{enabled:true,approvedEndpoint:'https://insights.invalid/collect'},send);
    expect(await delivery.retry()).toBe('failed');expect(await delivery.retry()).toBe('sent');expect(await delivery.retry()).toBe('sent');
    expect(send).toHaveBeenCalledTimes(2);expect(send.mock.calls[0][1]?.body).toBe(send.mock.calls[1][1]?.body);
    expect(send.mock.calls[1][1]?.credentials).toBe('omit');expect(send.mock.calls[1][1]?.referrerPolicy).toBe('no-referrer');
  });
  it('never sends expired deliveries, invalid cells, unsafe endpoints or a privacy-rejected acknowledgement', async () => {
    const send=vi.fn<typeof fetch>().mockResolvedValue(Response.json({accepted:false}));
    const cfg={enabled:true,approvedEndpoint:'https://insights.invalid/collect'};let now=0;
    const delivery=prepareDelivery([base],cfg,send,()=>now);now=23*3600000;expect(await delivery.retry()).toBe('expired');expect(send).not.toHaveBeenCalled();
    expect(await prepareDelivery([{...base,count:101}],cfg,send).retry()).toBe('disabled');
    expect(await prepareDelivery([base],{...cfg,approvedEndpoint:'http://insights.invalid/collect'},send).retry()).toBe('disabled');
    expect(await prepareDelivery([base],cfg,send).retry()).toBe('failed');
  });
  it('reuses the Sprint A catalog and validates all three languages', () => {
    for (const language of ['it','en','fr'] as const) expect(validateBatch(batch([{ ...base, properties: { ...base.properties, language } }]))).toBe(true);
  });
  it.each(['email','ip','playerId','text','timestamp'])('rejects unauthorized %s', key => {
    expect(validateBatch({ ...batch(), [key]: 'anything' })).toBe(false);
    expect(validateBatch(batch([{ ...base, properties: { ...base.properties, [key]: 'anything' } }]))).toBe(false);
  });
  it.each([0, -1, NaN, Infinity, 1.5, 101, 1000000])('rejects count %s', count => expect(validateBatch(batch([{ ...base, count }]))).toBe(false));
  it('rejects invalid version, category, ID, duplicate cell, oversized batch and legacy alias', () => {
    for (const patch of [{ gameVersion:'bogus' }, { schemaVersion:2 }, { event:'private' }, { properties:{ ...base.properties, mode:'custom' } }]) expect(validateBatch({ ...batch(), cells:[{ ...base, ...patch }] })).toBe(false);
    expect(validateBatch({ ...batch(), batchId:'permanent-user' })).toBe(false);
    expect(validateBatch({ ...batch(), batchId:crypto.randomUUID()+'\n' })).toBe(false);
    expect(validateBatch(batch([base,base]))).toBe(false);
    expect(validateBatch(batch(Array.from({length:33},()=>base)))).toBe(false);
    expect(validateBatch(batch([{ ...base, event:'case_result', properties:{ ...base.properties, caseId:PLAYABLE_CASES[0].id, result:'correct' } }]))).toBe(false);
  });
  it('rejects equivalent property order duplicates and excessive total weights', () => {
    expect(validateBatch(batch([base, { ...base, properties: { phase:'menu', mode:'turno',language:'it' } }]))).toBe(false);
    const cells = Array.from({length:12},(_,i)=>({ ...base, count:100, properties:{ ...base.properties, language:['it','en','fr'][i%3],mode:['turno','libera','sorpresa','ripasso'][Math.floor(i/3)] } }));
    expect(validateBatch({ ...batch(), cells })).toBe(false);
  });
});
describe('transactional aggregation without individual histories', () => {
  it('reports when a nominal fourteen-day baseline retains only three days', () => {
    const window=retentionWindow({from:'2026-07-06',to:'2026-07-19',dimension:'all'},Date.parse('2026-10-14T12:00:00Z'));
    expect(window).toEqual({retainedFrom:'2026-07-17',clipped:true,availableDays:3});
    expect(retentionWindow({from:'2026-07-01',to:'2026-07-10',dimension:'all'},Date.parse('2026-10-14T12:00:00Z')).availableDays).toBe(0);
  });
  it('projects independent dimensions, not a cross product', () => {
    const rows=project(batch(), '2026-10-14');
    expect(rows.map(r=>r.dimension)).toEqual(['all','language','mode','phase']);
    expect(rows.every(r=>Object.keys(r).sort().join() === 'count,day,dimension,event,value,version')).toBe(true);
  });
  it('counts once on retry and across receipt day boundaries, but a new batch counts', async () => {
    const d=database(); const b=batch(); const now=Date.parse('2026-10-14T23:59:00Z');
    await ingest(d,b,now); await ingest(d,b,now+120000); await ingest(d,b,now+120001);
    const rows = d.sqlite.prepare("SELECT * FROM counters WHERE dimension='all'").all();
    expect(rows).toHaveLength(1); expect(rows[0].count).toBe(10);
    await ingest(d,batch(),now); expect(d.sqlite.prepare("SELECT count FROM counters WHERE dimension='all'").get()?.count).toBe(20);
    const receipt = d.sqlite.prepare('SELECT * FROM receipts').get();
    expect(Object.keys(receipt ?? {}).sort()).toEqual(['expires','hash']);
    expect(receipt?.hash).not.toBe(b.batchId);
  });
  it('normalizes UUID case for deduplication', async () => { const d=database();const b=batch();await ingest(d,b);await ingest(d,{...b,batchId:b.batchId.toUpperCase()});expect(d.sqlite.prepare("SELECT count FROM counters WHERE dimension='all'").get()?.count).toBe(10); });
  it('rolls back all projections and receipt when the database quota rejects the write', async () => {
    const d=database(); const now=Date.now(); const day=new Date(now).toISOString().slice(0,10);
    d.sqlite.prepare('INSERT INTO daily_quota VALUES(?,?)').run(day,LIMITS.dailyCount);
    await expect(ingest(d,batch(),now)).rejects.toThrow();
    expect(d.sqlite.prepare('SELECT count(*) n FROM counters').get()?.n).toBe(0);
    expect(d.sqlite.prepare('SELECT count(*) n FROM receipts').get()?.n).toBe(0);
  });
  it('suppresses cells below 10 before period sums and deletes older than 90 days', async () => {
    const d=database(); const now=Date.parse('2026-10-14T12:00:00Z');
    await ingest(d,batch([{ ...base,count:9 }]),now);
    await ingest(d,batch([{ ...base,count:9 }]),now-86400000);
    await ingest(d,batch(),now-91*86400000);
    expect(await readCells(d,{from:'2026-10-13',to:'2026-10-14',dimension:'all'})).toHaveLength(0);
    await ingest(d,batch([{...base,count:1}]),now);
    expect(await readCells(d,{from:'2026-10-13',to:'2026-10-14',dimension:'all'})).toHaveLength(1);
    await purge(d,now);expect(d.sqlite.prepare("SELECT count(*) n FROM counters WHERE day<'2026-07-16'").get()?.n).toBe(0);
    expect(d.sqlite.prepare('SELECT count(*) n FROM receipts WHERE expires<=?').get(now)?.n).toBe(0);
  });
  it('keeps dimensions and version totals independent and protects CSV formulas', async () => {
    const d=database(); await ingest(d,batch());
    const day=new Date().toISOString().slice(0,10);
    const rows=await readCells(d,{from:day,to:day,dimension:'language',version:ANALYTICS_GAME_VERSION});
    expect(rows[0].count).toBe(10);expect(rows[0].value).toBe('it');
    expect(csv([{...rows[0],value:'=formula'}],'synthetic')).toContain("'=formula");
    expect(csv(rows,'synthetic').split('\r\n')[0]).toBe('classification,day_utc,game_version,event,dimension,value,event_count,requested_from_utc,requested_to_utc,retained_from_utc,retention_clipped');
  });
});
describe('private endpoints, fail-closed configuration, bounded public ingestion', () => {
  it.each(['/','/dashboard.js','/dashboard.css','/api/stats','/api/export.csv'])('denies unauthenticated %s', async path => {
    expect((await handle(admin(path,''),env())).status).toBe(401);
  });
  it('allows a valid local credential but never uses local auth on remote/https hosts', async () => {
    const e=env();expect(await authorized(admin(),e)).toBe(true);
    expect(await authorized(new Request('https://127.0.0.1:4214/',{headers:{Authorization:auth}}),e)).toBe(false);
    expect(await authorized(new Request('http://evil.example/',{headers:{Authorization:auth}}),e)).toBe(false);
    expect(await authorized(admin(),{...e,LOCAL_PASSWORD:'short'})).toBe(false);
    expect(await authorized(admin(),{...e,LOCAL_TEST:undefined})).toBe(false);
    expect(await authorized(new Request('https://insights.invalid/',{headers:{'Cf-Access-Authenticated-User-Email':'admin@example.com','Cf-Access-Jwt-Assertion':'fake'}}),{...e,LOCAL_TEST:undefined,ACCESS_TEAM:'example',ACCESS_AUD:'aud',ADMIN_EMAILS:'admin@example.com'})).toBe(false);
  });
  it('verifies real RS256 JWT signature, issuer, audience, expiry and email authorization without a Cloudflare account', async () => {
    const { privateKey, publicKey }=await generateKeyPair('RS256');
    const jwk={...await exportJWK(publicKey),kid:'fixture-key',alg:'RS256',use:'sig'};
    const fetch=vi.spyOn(globalThis,'fetch').mockImplementation(async () => Response.json({keys:[jwk]}));
    const e={...env(),LOCAL_TEST:undefined,ACCESS_TEAM:'local-unit-fixture',ACCESS_AUD:'fixture-audience',ADMIN_EMAILS:'reviewer@example.test'};
    const token=async(email='reviewer@example.test',aud='fixture-audience',issuer='https://local-unit-fixture.cloudflareaccess.com',expiry='1h')=>new SignJWT({email})
      .setProtectedHeader({alg:'RS256',kid:'fixture-key'}).setIssuedAt().setIssuer(issuer).setAudience(aud).setExpirationTime(expiry).sign(privateKey);
    const request=(t:string)=>new Request('https://insights.invalid/api/stats',{headers:{'Cf-Access-Jwt-Assertion':t}});
    expect(await authorized(request(await token()),e)).toBe(true);
    expect(await authorized(request(await token('unauthorized@example.test')),e)).toBe(false);
    expect(await authorized(request(await token('reviewer@example.test','wrong-audience')),e)).toBe(false);
    expect(await authorized(request(await token('reviewer@example.test','fixture-audience','https://wrong-issuer.invalid')),e)).toBe(false);
    expect(await authorized(request(await token('reviewer@example.test','fixture-audience','https://local-unit-fixture.cloudflareaccess.com','-1h')),e)).toBe(false);
    const signed=await token();expect(await authorized(request(signed.slice(0,-12)+'invalidtoken'),e)).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('returns approved aggregates with no-store and no permissive read CORS', async () => {
    const e=env(); await ingest(e.DB,batch());
    const r=await handle(admin(),e);expect(r.status).toBe(200);expect(r.headers.get('Cache-Control')).toBe('no-store');expect(r.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const body=await r.json();expect(body.classification).toBe('observed');expect(body.rows[0].count).toBe(10);
  });
  it('collection defaults disabled even with valid data', async () => expect((await handle(collect(batch()),{...env(),COLLECTION_ENABLED:undefined})).status).toBe(503));
  it('denies origin spoofing opportunities, missing origin, wrong method and limiter failure', async () => {
    const e=env();expect((await handle(collect(batch(),{Origin:'https://evil.invalid'}),e)).status).toBe(403);
    const noOrigin=collect(batch());noOrigin.headers.delete('Origin');expect((await handle(noOrigin,e)).status).toBe(403);
    expect((await handle(new Request('https://insights.invalid/collect',{headers:{Origin:e.ALLOWED_ORIGIN!}}),e)).status).toBe(405);
    expect((await handle(collect(batch()),{...e,INGEST_LIMITER:undefined})).status).toBe(503);
    expect((await handle(collect(batch()),{...e,INGEST_LIMITER:{async limit(){return {success:false};}}})).status).toBe(429);
  });
  it('enforces media type, byte bound even without Content-Length, malformed JSON and strict envelope', async () => {
    const e=env();expect((await handle(collect(batch(),{'Content-Type':'text/plain'}),e)).status).toBe(415);
    expect((await handle(collect(batch(),{'Content-Encoding':'gzip'}),e)).status).toBe(415);
    const oversized=new Request('https://insights.invalid/collect',{method:'POST',headers:{Origin:e.ALLOWED_ORIGIN!,'Content-Type':'application/json'},body:' '.repeat(32769)});
    expect((await handle(oversized,e)).status).toBe(413);
    expect((await handle(collect({ bad:'anything' }),e)).status).toBe(400);
  });
  it('acknowledges permitted batches without double counts and respects privacy preference headers', async () => {
    const e=env();const b=batch();expect((await handle(collect(b),e)).status).toBe(202);expect((await handle(collect(b),e)).status).toBe(202);
    const body=await (await handle(admin(),e)).json();expect(body.rows[0].count).toBe(10);
    for (const flag of ['DNT','Sec-GPC']) expect(await (await handle(collect(batch(),{[flag]:'1'}),e)).json()).toEqual({accepted:false});
    expect((await (await handle(admin(),e)).json()).rows[0].count).toBe(10);
  });
  it('does not disclose SQL, errors or received payloads when database fails', async () => {
    const e=env();e.DB.batch=async()=>{throw new Error('SQL private details');};
    const r=await handle(collect(batch()),e);expect(r.status).toBe(503);expect(await r.text()).not.toContain('SQL');
  });
  it.each(['?language=it&mode=turno','?dimension=language&dimension=mode','?dimension=ip','?version=unapproved','?from=2026-02-30&to=2026-03-01','?from=2025-01-01&to=2026-01-01'])('rejects granular or invalid query %s', async search => {
    expect(parseQuery(new URL(`https://insights.invalid/api/stats${search}`))).toBeNull();
    expect((await handle(admin(`/api/stats${search}`),env())).status).toBe(400);
  });
  it('protects exports, unknown admin mutations and missing admin limiter', async () => {
    const e=env();expect((await handle(admin('/api/export.csv','wrong'),e)).status).toBe(401);
    expect((await handle(admin('/api/delete'),e)).status).toBe(404);
    expect((await handle(admin(),{...e,ADMIN_LIMITER:undefined})).status).toBe(429);
  });
  it('ships no active telemetry, no bypassed static assets and no embedded admin secrets', () => {
    const configuration=readFileSync(new URL('../analytics/wrangler.jsonc',import.meta.url),'utf8');
    expect(configuration).toContain('"COLLECTION_ENABLED": "false"');expect(configuration).toContain('"run_worker_first": true');expect(configuration).toContain('"workers_dev": false');
    expect(configuration).not.toContain('LOCAL_PASSWORD');expect(configuration).toContain('"observability": { "enabled": false }');
  });
});

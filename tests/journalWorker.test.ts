import {afterEach,describe,expect,it,vi} from 'vitest';
import {LocalDatabase} from '../analytics/local-db';
import {handleJournalCollector,handleJournalAdmin,purgeJournal} from '../analytics/journal-worker';
import {handle} from '../analytics/worker';
import type {Env} from '../analytics/types';
import {JOURNAL_POLICY,validJournalEvent,type JournalEvent} from '../analytics/journal-schema';
import {ANALYTICS_GAME_VERSION} from '../src/game/systems/analyticsSchema';
import {SessionJournal} from '../src/game/systems/SessionJournal';
import {PLAYABLE_CASES} from '../src/game/data/cases';
import {LANGUAGE_CODES} from '../src/game/i18n';
const NOW=Date.UTC(2026,10,22,10),DAY=86400000,databases:LocalDatabase[]=[];
afterEach(()=>{for(const db of databases.splice(0))db.close();vi.restoreAllMocks();});
const password='only-local-tests-private-at-least-24-characters',authorization=`Basic ${btoa(`reviewer:${password}`)}`;
function fixture(){const db=new LocalDatabase();databases.push(db);const limiter={async limit(){return {success:true};}};
 const env:Env={DB:db,JOURNAL_ENABLED:'true',JOURNAL_TEXT_KEY:'a'.repeat(64),INGEST_LIMITER:limiter,ADMIN_LIMITER:limiter,LOCAL_TEST:'true',LOCAL_PASSWORD:password};return {db,env};}
function request(op:string,body:unknown,origin='https://www.no-ai-act.eu',headers:Record<string,string>={}){return new Request(`https://beta.no-ai-act.eu/collect/v3/${op}`,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...headers},body:JSON.stringify(body)});}
const consent={policyVersion:JOURNAL_POLICY,adultConfirmed:true,qualitative:false,gameVersion:ANALYTICS_GAME_VERSION,language:'it',mode:'turno',difficulty:'standard',mission:'full',audience:'casual'};
async function start(env:Env,qualitative=false,origin='https://www.no-ai-act.eu'){const response=await handleJournalCollector(request('start',{...consent,qualitative},origin),env,NOW);expect(response.status).toBe(201);return response.json() as Promise<{sessionId:string;token:string;expiresAt:number}>;}
const event=(seq=1,patch:Partial<JournalEvent>={}):JournalEvent=>({id:crypto.randomUUID(),seq,type:'draft_changed',at:NOW+1000,elapsedMs:1000,caseId:'case_scoring',attemptId:crypto.randomUUID(),language:'it',mode:'turno',phase:'evidence',properties:{classification:'alto_rischio',citedClues:[0,2]},...patch});
const count=(db:LocalDatabase,table:string)=>Number((db.sqlite.prepare(`SELECT count(*) AS n FROM ${table}`).get() as {n:number}).n);
const admin=(path:string,auth=authorization)=>new Request(`http://127.0.0.1:4214${path}`,{headers:{Authorization:auth}});
describe('closed public journal contract and consent',()=>{
 it('returns a retryable private failure with CORS and no SQL or credentials if the database fails asynchronously',async()=>{
  const {env,db}=fixture();db.batch=async()=>{throw new Error('private SQL and credentials');};
  const response=await handle(request('start',consent),env);expect(response.status).toBe(503);expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://www.no-ai-act.eu');
  expect(await response.json()).toEqual({error:'temporarily_unavailable'});
 });
 it('does not create rows without valid adult consent and rejects unapproved origins, policies and identifiers',async()=>{
  const {env,db}=fixture();for(const value of [{...consent,adultConfirmed:false},{...consent,policyVersion:'old'},{...consent,playerId:'name'},{...consent,language:'xx'}])expect((await handleJournalCollector(request('start',value),env,NOW)).status).toBe(400);
  expect((await handleJournalCollector(request('start',consent,'https://other.invalid'),env,NOW)).status).toBe(403);expect(count(db,'journal_sessions')).toBe(0);
 });
 it('fails closed for DNT/GPC, a disabled feature, a missing limiter or an unavailable writing key',async()=>{
  const {env,db}=fixture();for(const flag of ['DNT','Sec-GPC'])expect((await handleJournalCollector(request('start',consent,undefined,{[flag]:'1'}),env,NOW)).status).toBe(403);
  expect((await handleJournalCollector(request('start',consent),{...env,JOURNAL_ENABLED:'false'},NOW)).status).toBe(503);
  expect((await handleJournalCollector(request('start',consent),{...env,INGEST_LIMITER:undefined},NOW)).status).toBe(429);
  expect((await handleJournalCollector(request('start',{...consent,qualitative:true}),{...env,JOURNAL_TEXT_KEY:undefined},NOW)).status).toBe(503);expect(count(db,'journal_sessions')).toBe(0);
 });
 it('returns CORS preflight without creating a session and validates methods and byte limits',async()=>{
  const {env,db}=fixture(),url='https://beta.no-ai-act.eu/collect/v3/start';const preflight=await handleJournalCollector(new Request(url,{method:'OPTIONS',headers:{Origin:'https://www.no-ai-act.eu'}}),env,NOW);
  expect(preflight.status).toBe(204);expect(preflight.headers.get('Access-Control-Allow-Origin')).toBe('https://www.no-ai-act.eu');expect(count(db,'journal_sessions')).toBe(0);
  expect((await handleJournalCollector(new Request(url,{headers:{Origin:'https://www.no-ai-act.eu'}}),env,NOW)).status).toBe(405);
  expect((await handleJournalCollector(new Request(url,{method:'POST',headers:{Origin:'https://www.no-ai-act.eu','Content-Type':'application/json'},body:' '.repeat(30001)}),env,NOW)).status).toBe(400);
 });
 it('accepts exact choices with one received event, before any aggregate threshold is met',async()=>{
  const {env,db}=fixture(),grant=await start(env),e=event();expect((await handleJournalCollector(request('events',{sessionId:grant.sessionId,token:grant.token,events:[e]}),env,NOW)).status).toBe(202);
  const row=db.sqlite.prepare('SELECT * FROM journal_events').get() as Record<string,unknown>;expect(JSON.parse(String(row.properties_json))).toEqual(e.properties);expect(row.attempt_id).toBe(e.attemptId);
  expect(count(db,'counters')).toBe(0);const result=await handleJournalAdmin(admin('/api/journal/sessions'),env,NOW);expect((await result!.json()).sessions).toHaveLength(1);
 });
 it('rejects unsanctioned text and unknown event properties without partial writes',async()=>{
  const {env,db}=fixture(),grant=await start(env);const e=event(1,{type:'writing_saved',writing:{hypothesis:'not consented'}});
  expect((await handleJournalCollector(request('events',{sessionId:grant.sessionId,token:grant.token,events:[e]}),env,NOW)).status).toBe(403);
  const invalid={...event(),properties:{email:'private'}};expect(validJournalEvent(invalid)).toBe(false);
  expect((await handleJournalCollector(request('events',{sessionId:grant.sessionId,token:grant.token,events:[invalid]}),env,NOW)).status).toBe(400);expect(count(db,'journal_events')).toBe(0);
 });
});
describe('idempotence, erasure, encryption and private access',()=>{
 it('acknowledges retries without duplicating or overwriting events and rejects conflicting sequences',async()=>{
  const {env,db}=fixture(),g=await start(env),e=event(),send=(events:JournalEvent[])=>handleJournalCollector(request('events',{sessionId:g.sessionId,token:g.token,events}),env,NOW);
  expect((await send([e])).status).toBe(202);expect((await send([e])).status).toBe(202);expect((await send([{...e,seq:2}])).status).toBe(409);expect((await send([event()])).status).toBe(409);
  expect((await send([e,event(2)])).status).toBe(202);expect(count(db,'journal_events')).toBe(2);
  expect((db.sqlite.prepare('SELECT events,sessions FROM journal_daily_limits').get())).toMatchObject({events:2,sessions:1});
 });
 it('encrypts opted-in writing at rest; only the private admin or the session credential can export it',async()=>{
  const {env,db}=fixture(),g=await start(env,true),credentials={sessionId:g.sessionId,token:g.token},e=event(1,{type:'writing_saved',writing:{hypothesis:'UNIQUE PRIVATE ARGUMENT'}});
  expect((await handleJournalCollector(request('events',{...credentials,events:[e]}),env,NOW)).status).toBe(202);
  const stored=JSON.stringify(db.sqlite.prepare('SELECT * FROM journal_events').all());expect(stored).not.toContain('UNIQUE PRIVATE ARGUMENT');expect(stored).toContain('v1:');
  expect((await handle(admin(`/api/journal/session?id=${g.sessionId}`,''),env)).status).toBe(401);
  const own=await (await handleJournalCollector(request('export',credentials),env,NOW)).json();expect(own.events[0].writing.hypothesis).toBe('UNIQUE PRIVATE ARGUMENT');expect(JSON.stringify(own)).not.toContain('token_hash');
  const owner=await (await handleJournalAdmin(admin(`/api/journal/session?id=${g.sessionId}`),env,NOW))!.json();expect(owner.events[0].writing).toEqual(e.writing);expect(owner.session).not.toHaveProperty('token_hash');
  expect((await handleJournalCollector(request('export',{...credentials,token:'b'.repeat(64)}),env,NOW)).status).toBe(404);
 });
 it('erases the entire session, retains only a minimal tombstone and cannot resurrect it via retries',async()=>{
  const {env,db}=fixture(),g=await start(env,true),credentials={sessionId:g.sessionId,token:g.token},e=event();await handleJournalCollector(request('events',{...credentials,events:[e]}),env,NOW);
  expect((await handleJournalCollector(request('revoke',credentials),env,NOW)).status).toBe(200);expect(count(db,'journal_sessions')).toBe(0);expect(count(db,'journal_events')).toBe(0);
  const tombstone=db.sqlite.prepare('SELECT * FROM journal_revocations').get() as Record<string,unknown>;expect(Object.keys(tombstone).sort()).toEqual(['id','token_hash','revoked_at','expires_at'].sort());
  expect((await handleJournalCollector(request('events',{...credentials,events:[e]}),env,NOW)).status).toBe(410);
  expect((await handleJournalCollector(request('revoke',credentials),{...env,JOURNAL_ENABLED:'false'},NOW)).status).toBe(200);
  expect((await handleJournalAdmin(admin(`/api/journal/session?id=${g.sessionId}`),env,NOW))!.status).toBe(404);
 });
 it('prevents an ingestion transaction racing behind a deletion from restoring any events',async()=>{
  const {env,db}=fixture(),g=await start(env),credentials={sessionId:g.sessionId,token:g.token};const original=db.batch.bind(db);let deleting=false;
  db.batch=async statements=>{if(!deleting){deleting=true;await handleJournalCollector(request('revoke',credentials),env,NOW);}return original(statements);};
  const result=await handleJournalCollector(request('events',{...credentials,events:[event()]}),env,NOW);expect(result.status).toBe(410);expect(count(db,'journal_events')).toBe(0);
 });
 it('preserves rights while recording is disabled and purges all expired records and tombstones',async()=>{
  const {env,db}=fixture(),g=await start(env),credentials={sessionId:g.sessionId,token:g.token},disabled={...env,JOURNAL_ENABLED:'false'};
  expect((await handleJournalCollector(request('export',credentials),disabled,NOW+DAY)).status).toBe(200);
  expect((await handleJournalCollector(request('events',{...credentials,events:[event()]}),env,NOW+DAY)).status).toBe(410);
  expect((await handleJournalCollector(request('revoke',credentials),disabled,NOW+DAY)).status).toBe(200);await purgeJournal(db,NOW+90*DAY);
  expect(count(db,'journal_sessions')).toBe(0);expect(count(db,'journal_events')).toBe(0);expect(count(db,'journal_revocations')).toBe(0);
 });
 it('enforces daily event limits atomically and does not acknowledge data that was not stored',async()=>{
  const {env,db}=fixture(),g=await start(env),credentials={sessionId:g.sessionId,token:g.token};db.sqlite.exec('UPDATE journal_daily_limits SET events=49999');
  expect((await handleJournalCollector(request('events',{...credentials,events:[event(),event(2)]}),env,NOW)).status).toBe(429);expect(count(db,'journal_events')).toBe(0);
  const e=event();expect((await handleJournalCollector(request('events',{...credentials,events:[e]}),env,NOW)).status).toBe(202);expect((await handleJournalCollector(request('events',{...credentials,events:[e]}),env,NOW)).status).toBe(202);
  expect(db.sqlite.prepare('SELECT events FROM journal_daily_limits').get()).toMatchObject({events:50000});
 });
 it('exports quoted CSV and reports a missing decryption key without exposing encrypted content',async()=>{
  const {env}=fixture(),g=await start(env,true),credentials={sessionId:g.sessionId,token:g.token};await handleJournalCollector(request('events',{...credentials,events:[event(1,{type:'writing_saved',writing:{hypothesis:'=2+2\n"quoted"'}})]}),env,NOW);
  const csv=(await handleJournalAdmin(admin(`/api/journal/session?id=${g.sessionId}&format=csv`),env,NOW))!;expect(csv.headers.get('Content-Type')).toContain('text/csv');expect(await csv.text()).toContain('session_id,event_id');
  const missing=await (await handleJournalAdmin(admin(`/api/journal/session?id=${g.sessionId}`),{...env,JOURNAL_TEXT_KEY:undefined},NOW))!.json();expect(missing.events[0].writingStatus).toBe('encrypted_unavailable');expect(missing.events[0]).not.toHaveProperty('writing_cipher');
 });
});
describe('all playable languages and cases traverse the actual client/server boundary',()=>{
 it('records all 14 case IDs in seven languages with version, channel and case filters, without thresholds',async()=>{
  const {env,db}=fixture();
  for(const language of LANGUAGE_CODES){const origin=language==='it'?'https://www.no-ai-act.eu':'https://beta.no-ai-act.eu';
   const journal=new SessionJournal({enabled:true,endpoint:'https://beta.no-ai-act.eu/collect/v3',now:()=>NOW,fetch:(async(input,init)=>handleJournalCollector(new Request(String(input),{...init,headers:{'Content-Type':'application/json',Origin:origin}}),env,NOW)) as typeof fetch});
   journal.setContextProvider(()=>({language,mode:'turno',phase:'evidence',difficulty:'standard',mission:'full',audience:'casual'}));expect(await journal.start(true,false)).toBe(true);
   for(const c of PLAYABLE_CASES)journal.record('evidence_interaction',{evidenceIndex:0,opened:true,cited:false},{caseId:c.id});expect(await journal.flush()).toBe(true);
  }
  expect(count(db,'journal_sessions')).toBe(LANGUAGE_CODES.length);expect(count(db,'journal_events')).toBe(LANGUAGE_CODES.length*15);
  const result=await (await handleJournalAdmin(admin(`/api/journal/sessions?caseId=case_bias&language=de&version=${ANALYTICS_GAME_VERSION}&channel=beta`),env,NOW))!.json();expect(result.sessions).toHaveLength(1);expect(result.sessions[0].language).toBe('de');expect(result.sessions[0].event_count).toBe(15);
  expect((await handleJournalAdmin(admin('/api/journal/sessions?caseId=bad'),env,NOW))!.status).toBe(400);
  expect((await handleJournalAdmin(admin('/api/journal/sessions?from=2026-02-30&to=2026-03-01'),env,NOW))!.status).toBe(400);
 });
});

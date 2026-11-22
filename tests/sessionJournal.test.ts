import {describe,it,expect,vi} from 'vitest';
import {SessionJournal,phaseForScene,type JournalStorage} from '../src/game/systems/SessionJournal';
import {JOURNAL_POLICY,validJournalEvent,type JournalEvent} from '../analytics/journal-schema';
import {Analytics} from '../src/game/systems/AnalyticsSystem';
import {ANALYTICS_GAME_VERSION} from '../src/game/systems/analyticsSchema';
import {JOURNAL_COPY} from '../src/game/i18n/journal';
import {LANGUAGE_CODES} from '../src/game/i18n';
const NOW=Date.UTC(2026,10,22,10);
function fixture(){
 let now=NOW,blocked=false,fail=false,partial=false;
 const map=new Map<string,string>(),storage:JournalStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);},removeItem:k=>{map.delete(k);}};
 const grant={sessionId:crypto.randomUUID(),token:'a'.repeat(64),policyVersion:JOURNAL_POLICY,qualitative:false,createdAt:NOW,activeUntil:NOW+86400000,expiresAt:NOW+90*86400000};
 const calls:Array<{operation:string;body:Record<string,unknown>}>=[];
 const send=vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{
  const operation=String(input).split('/').slice(-1)[0],body=JSON.parse(String(init?.body));calls.push({operation,body});
  if(fail)throw new Error('offline');
  if(operation==='start')return Response.json({...grant,qualitative:body.qualitative},{status:201});
  if(operation==='events'){const ids=(body.events as JournalEvent[]).map(e=>e.id);return Response.json({acceptedIds:partial?ids.slice(0,1):ids},{status:202});}
  if(operation==='revoke')return Response.json({deleted:true});
  return Response.json({session:{id:grant.sessionId},events:[]});
 });
 const config={enabled:true,endpoint:'https://beta.no-ai-act.eu/collect/v3',storage,fetch:send as typeof fetch,now:()=>now,privacyBlocked:()=>blocked};
 const create=()=>{const j=new SessionJournal(config);j.setContextProvider(()=>({language:'it',mode:'turno',phase:'evidence',caseId:'case_scoring',difficulty:'standard',mission:'full',audience:'casual'}));return j;};
 return {journal:create(),create,grant,calls,storage,map,send,advance:(n:number)=>{now+=n;},block:()=>{blocked=true;},fail:(v=true)=>{fail=v;},partial:()=>{partial=true;}};
}
const sent=(f:ReturnType<typeof fixture>)=>f.calls.filter(c=>c.operation==='events').flatMap(c=>c.body.events as JournalEvent[]);
describe('explicit adult session consent and independent writing consent',()=>{
 it('sends nothing before consent, on refusal, or when a privacy signal blocks recording',async()=>{
  const f=fixture();f.journal.record('game_started');expect(await f.journal.flush()).toBe(false);expect(await f.journal.start(false,true)).toBe(false);expect(f.calls).toEqual([]);
  f.block();expect(await f.journal.start(true,true)).toBe(false);expect(f.calls).toEqual([]);expect(f.journal.status).toBe('blocked');
 });
 it('creates a session only after the grant and never adds writing without the separate permission',async()=>{
  const f=fixture();expect(await f.journal.start(true,false)).toBe(true);f.journal.recordWriting('case_scoring','argument',{hypothesis:'PRIVATE NOTE'});
  f.journal.record('draft_changed',{classification:'alto_rischio',email:'private@example.invalid',citedClues:[0,2]});expect(await f.journal.flush()).toBe(true);
  expect(sent(f).some(e=>e.type==='draft_changed'&&e.properties.classification==='alto_rischio')).toBe(true);expect(JSON.stringify(sent(f))).not.toMatch(/PRIVATE NOTE|email|example.invalid/);
  expect(f.calls[0].body).toMatchObject({adultConfirmed:true,qualitative:false,policyVersion:JOURNAL_POLICY,gameVersion:ANALYTICS_GAME_VERSION});
 });
 it('shares bounded field snapshots rather than keystrokes and carries the event context',async()=>{
  const f=fixture();await f.journal.start(true,true);f.journal.recordWriting('case_scoring','before_feedback',{hypothesis:'x'.repeat(2000),uncertainty:'Missing log',email:'never'});await f.journal.flush();
  const events=sent(f).filter(e=>e.type==='writing_saved');expect(events).toHaveLength(2);expect(events[0].writing?.hypothesis).toHaveLength(1200);
  expect(events.every(e=>validJournalEvent(e)&&e.caseId==='case_scoring'&&e.attemptId&&e.properties.stage==='before_feedback')).toBe(true);
  expect(events[1].writing).toEqual({uncertainty:'Missing log'});
 });
 it('accepts the complete copy contract in all six game languages',()=>{
  expect(Object.keys(JOURNAL_COPY)).toEqual(LANGUAGE_CODES);const keys=Object.keys(JOURNAL_COPY.it).sort();
  for(const lang of LANGUAGE_CODES){const copy=JOURNAL_COPY[lang];expect(Object.keys(copy).sort()).toEqual(keys);
   for(const value of Object.values(copy))if(typeof value==='string')expect(value.length).toBeGreaterThan(5);
   expect(copy.purpose).toContain('24');expect(copy.scope).toContain('90');expect(copy.adult).toContain('18');expect(copy.writing.length).toBeGreaterThan(100);
   expect(Object.keys(copy.status).sort()).toEqual(Object.keys(JOURNAL_COPY.it.status).sort());}
 });
});
describe('durable per-tab queue, acknowledgement and access rights',()=>{
 it('honours refusal while consent creation is still in flight and retains a late grant until erasure is confirmed',async()=>{
  const f=fixture();let release!:(response:Response)=>void;f.send.mockImplementationOnce(()=>new Promise<Response>(resolve=>{release=resolve;}));
  const pending=f.journal.start(true,false);f.journal.cancelPendingStart();f.fail();release(Response.json(f.grant,{status:201}));expect(await pending).toBe(false);
  expect(f.journal.active).toBe(false);expect(f.journal.status).toBe('revoking');expect(f.journal.pendingCount).toBe(0);expect(f.journal.sessionId).toBe(f.grant.sessionId);
  f.fail(false);expect(await f.journal.flush()).toBe(true);expect(f.journal.status).toBe('deleted');
 });
 it('restores a granted tab and retries the identical immutable IDs after an ambiguous network failure',async()=>{
  const f=fixture();await f.journal.start(true,false);f.journal.record('evidence_interaction',{evidenceIndex:2,opened:true,cited:false});f.fail();expect(await f.journal.flush()).toBe(false);
  const before=sent(f).map(e=>e.id),restored=f.create();restored.restore();expect(restored.active).toBe(true);f.fail(false);expect(await restored.flush()).toBe(true);
  expect(sent(f).slice(before.length).map(e=>e.id)).toEqual([...before,expect.any(String)]);expect(restored.pendingCount).toBe(0);expect(restored.sessionId).toBe(f.grant.sessionId);
 });
 it('drops only acknowledged events and leaves unacknowledged records queued',async()=>{
  const f=fixture();await f.journal.start(true,false);for(let i=0;i<8;i++)f.journal.record('ui_action',{action:`action_${i}`});f.partial();
  expect(await f.journal.flush()).toBe(false);expect(f.journal.pendingCount).toBe(5);expect(new Set(sent(f).map(e=>e.id)).size).toBe(9);
  expect(f.journal.status).toBe('pending');
 });
 it('keeps a pending deletion through offline reload, stops capture immediately and confirms deletion only after server acknowledgement',async()=>{
  const f=fixture();await f.journal.start(true,true);f.fail();expect(await f.journal.revoke()).toBe(false);expect(f.journal.active).toBe(false);expect(f.journal.status).toBe('revoking');
  f.journal.record('game_started');expect(f.journal.pendingCount).toBe(0);const recovered=f.create();recovered.restore();expect(recovered.status).toBe('revoking');
  f.fail(false);expect(await recovered.flush()).toBe(true);expect(recovered.status).toBe('deleted');expect(recovered.sessionId).toBeUndefined();expect(f.map.size).toBe(0);
 });
 it('privacy signals stop capture and request deletion even when the delivery queue is not empty',async()=>{
  const f=fixture();await f.journal.start(true,false);f.block();f.fail();expect(await f.journal.flush()).toBe(false);expect(f.journal.active).toBe(false);expect(f.journal.status).toBe('revoking');
  expect(f.calls[f.calls.length-1]?.operation).toBe('revoke');expect(f.journal.pendingCount).toBe(0);
 });
 it('exports server records together with clearly labelled pending local events',async()=>{
  const f=fixture();await f.journal.start(true,false);const data=await f.journal.exportData() as {localPendingEvents:JournalEvent[];coverage:{pending:number}};
  expect(data.coverage.pending).toBe(1);expect(data.localPendingEvents[0].type).toBe('recording_started');
 });
 it('restores an access receipt without restarting capture and rejects foreign endpoints',async()=>{
  const f=fixture();await f.journal.start(true,false);const receipt=f.journal.privateReceipt() as Record<string,unknown>,fresh=f.create();
  expect(fresh.recoverReceipt({...receipt,endpoint:'https://other.invalid'})).toBe(false);expect(fresh.recoverReceipt(receipt)).toBe(true);expect(fresh.active).toBe(false);
  expect(fresh.status).toBe('expired');expect(fresh.sessionId).toBe(f.grant.sessionId);expect(await fresh.revoke()).toBe(true);
 });
 it('ends capture at 24 hours, preserves export rights and starts without an old save or previous queue',async()=>{
  const f=fixture();await f.journal.start(true,false);f.advance(86400000);expect(f.journal.active).toBe(false);expect(f.journal.status).toBe('expired');const recovered=f.create();recovered.restore();expect(recovered.status).toBe('expired');
  expect(await recovered.exportData()).toHaveProperty('events');const other=fixture();expect(other.journal.sessionId).toBeUndefined();
  f.advance(90*86400000);await recovered.flush();expect(recovered.sessionId).toBeUndefined();expect(recovered.pendingCount).toBe(0);expect(f.map.size).toBe(0);
 });
 it('rejects corrupted persisted consent and excludes idle or background time from heartbeats',async()=>{
  const f=fixture();await f.journal.start(true,false);f.advance(10000);f.journal.heartbeat(false,true);f.journal.heartbeat(true,false);f.advance(61000);f.journal.heartbeat(true,true);
  f.journal.noteActivity();f.advance(10000);f.journal.heartbeat(true,true);await f.journal.flush();expect(sent(f).filter(e=>e.type==='heartbeat').map(e=>e.properties.activeMs)).toEqual([10000]);
  const [key,value]=[...f.map.entries()][0];const data=JSON.parse(value);data.grant.token='invalid';f.storage.setItem(key,JSON.stringify(data));const restored=f.create();restored.restore();expect(restored.sessionId).toBeUndefined();
 });
 it('preserves attempt identity on resume and creates a new attempt when the same case is replayed',async()=>{
  const f=fixture();await f.journal.start(true,false);f.journal.record('case_started',{}, {caseId:'case_scoring'});
  const payload={schemaVersion:2 as const,gameVersion:ANALYTICS_GAME_VERSION,event:'game_resumed' as const,properties:{language:'it' as const,mode:'turno' as const,phase:'menu' as const}};
  f.journal.observe(payload);f.journal.record('evidence_interaction',{}, {caseId:'case_scoring'});f.journal.observe({...payload,event:'case_completed',properties:{...payload.properties,caseId:'case_scoring'}});
  f.journal.observe({...payload,event:'case_started',properties:{...payload.properties,caseId:'case_scoring'}});await f.journal.flush();
  const events=sent(f).filter(e=>e.caseId==='case_scoring');expect(events[0].attemptId).toBe(events[2].attemptId);expect(events[events.length-1]?.attemptId).not.toBe(events[0].attemptId);
 });
});
describe('the raw observer precedes legacy aggregate minimisation',()=>{
 it('retains case result, hints and duration while leaving the aggregate protocol unchanged',async()=>{
  const f=fixture();await f.journal.start(true,false);
  const bodies:Record<string,unknown>[]=[];const analytics=new Analytics({dev:false,provider:'first-party',origin:'https://www.no-ai-act.eu',releaseChannel:'production',remoteApproved:true,approvedEndpoints:['https://beta.no-ai-act.eu/collect'],collectionMode:'automatic'},async(_url,body)=>{bodies.push(body);},()=>120000);
  analytics.setRawObserver(p=>f.journal.observe(p));analytics.startCase('case_scoring');analytics.track('hint_requested',{caseId:'case_scoring'});analytics.track('case_completed',{caseId:'case_scoring',result:'partial'});
  await analytics.flush();await f.journal.flush();const full=sent(f).find(e=>e.type==='case_completed')!;expect(full.properties).toMatchObject({result:'partial',hintUsed:true,durationBucket:'under_1m'});
  expect(JSON.stringify(bodies)).toContain('usage_case_completed');expect(JSON.stringify(bodies)).not.toContain('partial');expect(phaseForScene('Evidence')).toBe('evidence');
 });
});

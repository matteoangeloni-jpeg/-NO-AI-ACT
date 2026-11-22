import type { Database, Env } from './types';
import { JOURNAL_POLICY, JOURNAL_RETENTION_DAYS, JOURNAL_ACTIVE_HOURS, JOURNAL_MAX_EVENTS, JOURNAL_BATCH_BYTES,
  exactJournalKeys, journalToken, journalUuid, validJournalEvent, validJournalStart, type JournalEvent } from './journal-schema';

const DAY=86400000;
const baseHeaders={'Cache-Control':'no-store','Content-Type':'application/json','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const json=(value:unknown,status=200,extra:Record<string,string>={})=>new Response(JSON.stringify(value),{status,headers:{...baseHeaders,...extra}});
const hex=(bytes:Uint8Array)=>[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
const unhex=(value:string)=>Uint8Array.from(value.match(/../g)??[],v=>parseInt(v,16));
async function digest(value:string):Promise<string>{return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))));}
const equal=(a:string,b:string)=>a.length===b.length&&[...a].reduce((n,c,i)=>n|(c.charCodeAt(0)^b.charCodeAt(i)),0)===0;
interface SessionRow {
 id:string;token_hash:string;policy_version:string;adult_confirmed:number;qualitative:number;game_version:string;channel:string;
 language:string;mode:string;context_json:string;created_at:number;last_seen_at:number;active_until:number;expires_at:number;
 revoked_at:number|null;event_count:number;
}
interface EventRow {event_id:string;seq:number;event_type:string;case_id:string|null;attempt_id:string|null;language:string;mode:string;
 phase:string;client_at:number;elapsed_ms:number;received_at:number;properties_json:string;writing_cipher:string|null;}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
async function body(request:Request):Promise<Record<string,unknown>>{
 if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('Content-Type')??'')||request.headers.has('Content-Encoding'))throw new Error('content_type');
 if(!request.body)throw new Error('body');
 const reader=request.body.getReader();let size=0;const chunks:Uint8Array[]=[];
 const deadline=Date.now()+5000;
 try{while(true){let timer:ReturnType<typeof setTimeout>|undefined;
  const timeout=new Promise<never>((_,reject)=>{timer=setTimeout(()=>{void reader.cancel();reject(new Error('timeout'));},Math.max(1,deadline-Date.now()));});
  const next=await Promise.race([reader.read(),timeout]).finally(()=>clearTimeout(timer));if(next.done)break;
  size+=next.value.length;if(size>JOURNAL_BATCH_BYTES){await reader.cancel();throw new Error('size');}chunks.push(next.value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!object(value))throw new Error('body');return value;
}
async function key(secret:string):Promise<CryptoKey>{
 if(!journalToken(secret))throw new Error('text_key_unavailable');
 return crypto.subtle.importKey('raw',unhex(secret),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
async function encryptWriting(value:Record<string,string>,secret:string):Promise<string>{
 const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(secret),new TextEncoder().encode(JSON.stringify(value)));
 return `v1:${hex(iv)}:${hex(new Uint8Array(cipher))}`;
}
async function decryptWriting(value:string,secret:string):Promise<Record<string,string>>{
 const [version,iv,cipher]=value.split(':');if(version!=='v1'||!iv||!cipher)throw new Error('cipher');
 return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unhex(iv)},await key(secret),unhex(cipher)))) as Record<string,string>;
}
function publicSession(row:SessionRow):Record<string,unknown>{
 const {token_hash:ignored,...safe}=row;void ignored;return {...safe,context:JSON.parse(row.context_json) as unknown,context_json:undefined};
}
async function authenticatedSession(db:Database,value:Record<string,unknown>,now:number):Promise<SessionRow|null>{
 if(!journalUuid(value.sessionId)||!journalToken(value.token))return null;
 const found=await db.prepare('SELECT * FROM journal_sessions WHERE id=? AND expires_at>?').bind(value.sessionId,now).all<SessionRow>();
 const row=found.results[0];if(!row||!equal(row.token_hash,await digest(value.token)))return null;return row;
}
async function eventsFor(db:Database,id:string,secret?:string):Promise<unknown[]>{
 const output:unknown[]=[];
 for(let offset=0;offset<10000;offset+=500){
 const result=await db.prepare('SELECT event_id,seq,event_type,case_id,attempt_id,language,mode,phase,client_at,elapsed_ms,received_at,properties_json,writing_cipher FROM journal_events WHERE session_id=? ORDER BY seq LIMIT 500 OFFSET ?').bind(id,offset).all<EventRow>();
 output.push(...await Promise.all(result.results.map(async row=>{
  const {writing_cipher,properties_json,...safe}=row;
  if(!writing_cipher)return {...safe,properties:JSON.parse(properties_json) as unknown};
  try{return {...safe,properties:JSON.parse(properties_json) as unknown,writing:await decryptWriting(writing_cipher,secret??''),writingStatus:'shared'};}
  catch{return {...safe,properties:JSON.parse(properties_json) as unknown,writingStatus:'encrypted_unavailable'};}
 })));
 if(result.results.length<500)break;
 }
 return output;
}
export async function handleJournalCollector(request:Request,env:Env,now=Date.now()):Promise<Response>{
 const url=new URL(request.url),origin=request.headers.get('Origin');
 if(!origin||!['https://www.no-ai-act.eu','https://beta.no-ai-act.eu',...(env.LOCAL_TEST==='true'?[env.ALLOWED_ORIGIN??'']:[])].includes(origin)||url.search)return json({error:'forbidden'},403);
 const cors={'Access-Control-Allow-Origin':origin,'Vary':'Origin'};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...baseHeaders,...cors,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
 if(request.method!=='POST')return json({error:'method'},405,cors);
 const operation=url.pathname.split('/').pop();
 if(env.JOURNAL_ENABLED!=='true'&&operation!=='revoke'&&operation!=='export')return json({error:'journal_disabled'},503,cors);
 let value:Record<string,unknown>;try{value=await body(request);}catch{return json({error:'invalid_body'},400,cors);}
 if(operation==='start'){
  if(request.headers.get('DNT')==='1'||request.headers.get('Sec-GPC')==='1')return json({error:'privacy_signal'},403,cors);
  if(!validJournalStart(value))return json({error:'invalid_consent_or_context'},400,cors);
  if(value.qualitative&&!journalToken(env.JOURNAL_TEXT_KEY))return json({error:'writing_unavailable'},503,cors);
  if(!env.INGEST_LIMITER||!(await env.INGEST_LIMITER.limit({key:`journal:start:${origin}`})).success)return json({error:'rate_limited'},429,{...cors,'Retry-After':'60'});
  const id=crypto.randomUUID(),token=hex(crypto.getRandomValues(new Uint8Array(32))),day=new Date(now).toISOString().slice(0,10);
  const channel=origin==='https://www.no-ai-act.eu'?'production':'beta';
  const context=JSON.stringify({difficulty:value.difficulty,mission:value.mission,audience:value.audience});
  await env.DB.batch([
   env.DB.prepare('INSERT INTO journal_daily_limits(day,sessions,events) VALUES(?,0,0) ON CONFLICT(day) DO NOTHING').bind(day),
   env.DB.prepare(`INSERT INTO journal_sessions(id,token_hash,policy_version,adult_confirmed,qualitative,game_version,channel,language,mode,context_json,created_at,last_seen_at,active_until,expires_at)
     SELECT ?,?,?,1,?,?,?,?,?,?,?,?,?,? WHERE (SELECT sessions FROM journal_daily_limits WHERE day=?)<5000`)
    .bind(id,await digest(token),JOURNAL_POLICY,value.qualitative?1:0,value.gameVersion,channel,value.language,value.mode,context,now,now,now+JOURNAL_ACTIVE_HOURS*3600000,now+JOURNAL_RETENTION_DAYS*DAY,day),
   env.DB.prepare('UPDATE journal_daily_limits SET sessions=sessions+changes() WHERE day=?').bind(day)
  ]);
  const created=await env.DB.prepare('SELECT id FROM journal_sessions WHERE id=?').bind(id).all<{id:string}>();
  if(!created.results.length)return json({error:'daily_quota'},429,{...cors,'Retry-After':'3600'});
  return json({sessionId:id,token,policyVersion:JOURNAL_POLICY,qualitative:value.qualitative,createdAt:now,activeUntil:now+JOURNAL_ACTIVE_HOURS*3600000,expiresAt:now+JOURNAL_RETENTION_DAYS*DAY},201,cors);
 }
 if(!['events','export','revoke'].includes(operation??'')||!exactJournalKeys(value,operation==='events'?['sessionId','token','events']:['sessionId','token']))return json({error:'invalid_request'},400,cors);
 const session=await authenticatedSession(env.DB,value,now);
 if(!session){
  if(journalUuid(value.sessionId)&&journalToken(value.token)){
   const revoked=await env.DB.prepare('SELECT token_hash FROM journal_revocations WHERE id=? AND expires_at>?').bind(value.sessionId,now).all<{token_hash:string}>();
   if(revoked.results[0]&&equal(revoked.results[0].token_hash,await digest(value.token)))return operation==='revoke'?json({revoked:true,deleted:true},200,cors):json({error:'revoked'},410,cors);
  }
  return json({error:'not_found'},404,cors);
 }
 if(operation==='revoke'){
  await env.DB.batch([
   env.DB.prepare('INSERT INTO journal_revocations(id,token_hash,revoked_at,expires_at) VALUES(?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(session.id,session.token_hash,now,session.expires_at),
   env.DB.prepare('DELETE FROM journal_events WHERE session_id=?').bind(session.id),env.DB.prepare('DELETE FROM journal_sessions WHERE id=?').bind(session.id)]);
  return json({revoked:true,deleted:true},200,cors);
 }
 if(session.revoked_at!==null)return json({error:'revoked'},410,cors);
 if(operation==='export')return json({session:publicSession(session),events:await eventsFor(env.DB,session.id,env.JOURNAL_TEXT_KEY)},200,cors);
 if(request.headers.get('DNT')==='1'||request.headers.get('Sec-GPC')==='1')return json({error:'privacy_signal'},403,cors);
 if(session.active_until<=now)return json({error:'session_expired'},410,cors);
 if(!Array.isArray(value.events)||!value.events.length||value.events.length>40||!value.events.every(validJournalEvent))return json({error:'invalid_events'},400,cors);
 const events=value.events as JournalEvent[];
 if(new Set(events.map(e=>e.id)).size!==events.length||new Set(events.map(e=>e.seq)).size!==events.length)return json({error:'duplicate_batch_keys'},400,cors);
 if(events.some(e=>e.writing&&!session.qualitative))return json({error:'writing_not_authorized'},403,cors);
 if(!env.INGEST_LIMITER||!(await env.INGEST_LIMITER.limit({key:`journal:${session.id}`})).success)return json({error:'rate_limited'},429,{...cors,'Retry-After':'60'});
 const existing=await env.DB.prepare(`SELECT event_id,seq FROM journal_events WHERE session_id=? AND event_id IN (${events.map(()=>'?').join(',')})`).bind(session.id,...events.map(e=>e.id)).all<{event_id:string;seq:number}>();
 if(existing.results.some(row=>events.find(e=>e.id===row.event_id)?.seq!==row.seq))return json({error:'event_conflict'},409,cors);
 const newCount=events.length-existing.results.length;
 if(!newCount)return json({acceptedIds:events.map(e=>e.id)},202,cors);
 if(session.event_count+newCount>JOURNAL_MAX_EVENTS)return json({error:'session_limit'},429,{...cors,'Retry-After':'3600'});
 const stored=await Promise.all(events.map(async e=>({...e,properties:undefined,writing:undefined,props:JSON.stringify(e.properties),cipher:e.writing?await encryptWriting(e.writing,env.JOURNAL_TEXT_KEY??''):null})));
 const day=new Date(now).toISOString().slice(0,10);
 try{await env.DB.batch([
  env.DB.prepare('INSERT INTO journal_daily_limits(day,sessions,events) VALUES(?,0,0) ON CONFLICT(day) DO NOTHING').bind(day),
  env.DB.prepare(`INSERT INTO journal_events(session_id,event_id,seq,event_type,case_id,attempt_id,language,mode,phase,client_at,elapsed_ms,received_at,properties_json,writing_cipher)
   SELECT ?,json_extract(value,'$.id'),json_extract(value,'$.seq'),json_extract(value,'$.type'),json_extract(value,'$.caseId'),json_extract(value,'$.attemptId'),json_extract(value,'$.language'),json_extract(value,'$.mode'),json_extract(value,'$.phase'),json_extract(value,'$.at'),json_extract(value,'$.elapsedMs'),?,json_extract(value,'$.props'),json_extract(value,'$.cipher') FROM json_each(?)
   WHERE EXISTS(SELECT 1 FROM journal_sessions WHERE id=? AND revoked_at IS NULL AND active_until>? AND event_count+?<=10000)
   AND (SELECT events FROM journal_daily_limits WHERE day=?) + ? <= 50000
   ON CONFLICT(session_id,event_id) DO NOTHING`).bind(session.id,now,JSON.stringify(stored),session.id,now,newCount,day,newCount),
  env.DB.prepare('UPDATE journal_daily_limits SET events=events+changes() WHERE day=?').bind(day),
  env.DB.prepare('UPDATE journal_sessions SET event_count=(SELECT count(*) FROM journal_events WHERE session_id=?),last_seen_at=? WHERE id=? AND revoked_at IS NULL').bind(session.id,now,session.id)
 ]);}catch{return json({error:'event_conflict'},409,cors);}
 const after=await authenticatedSession(env.DB,value,now);if(!after||after.revoked_at!==null)return json({error:'revoked'},410,cors);
 const ack=await env.DB.prepare(`SELECT event_id FROM journal_events WHERE session_id=? AND event_id IN (${events.map(()=>'?').join(',')})`).bind(session.id,...events.map(e=>e.id)).all<{event_id:string}>();
 if(ack.results.length!==events.length)return json({error:'daily_quota'},429,{...cors,'Retry-After':'3600'});
 return json({acceptedIds:ack.results.map(e=>e.event_id)},202,cors);
}
export async function handleJournalAdmin(request:Request,env:Env,now=Date.now()):Promise<Response|null>{
 const url=new URL(request.url);if(!url.pathname.startsWith('/api/journal/'))return null;
 if(env.JOURNAL_ENABLED!=='true')return json({error:'journal_disabled'},503);
 if(url.pathname==='/api/journal/session'){
  const id=url.searchParams.get('id');if(!journalUuid(id)||[...url.searchParams.keys()].some(k=>!['id','format'].includes(k)))return json({error:'invalid_query'},400);
  const rows=await env.DB.prepare('SELECT * FROM journal_sessions WHERE id=? AND revoked_at IS NULL AND expires_at>?').bind(id,now).all<SessionRow>();
  const session=rows.results[0];if(!session)return json({error:'not_found'},404);
  const events=await eventsFor(env.DB,id,env.JOURNAL_TEXT_KEY);
  if(url.searchParams.get('format')==='csv'){
   const escape=(v:unknown)=>'"'+String(v??'').replace(/^\s*[=+\-@\t\r]/,"'$&").replace(/"/g,'""')+'"';
   const lines=['session_id,event_id,seq,event_type,case_id,attempt_id,language,mode,phase,client_at,elapsed_ms,received_at,properties,writing'];
   for(const row of events as Record<string,unknown>[])lines.push([id,...['event_id','seq','event_type','case_id','attempt_id','language','mode','phase','client_at','elapsed_ms','received_at'].map(k=>row[k]),JSON.stringify(row.properties),row.writing?JSON.stringify(row.writing):''].map(escape).join(','));
   return new Response(lines.join('\r\n'),{headers:{...baseHeaders,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="session-${id}.csv"`}});
  }
  return json({session:publicSession(session),events});
 }
 if(url.pathname!=='/api/journal/sessions')return json({error:'not_found'},404);
 const allowed=['from','to','language','mode','channel','version','caseId','cursor'];
 if([...url.searchParams.keys()].some(k=>!allowed.includes(k))||allowed.some(k=>url.searchParams.getAll(k).length>1))return json({error:'invalid_query'},400);
 const from=url.searchParams.get('from')??new Date(now-13*DAY).toISOString().slice(0,10),to=url.searchParams.get('to')??new Date(now).toISOString().slice(0,10);
 const validDay=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().startsWith(v);
 if(!validDay(from)||!validDay(to)||from>to||Date.parse(to)-Date.parse(from)>89*DAY)return json({error:'invalid_dates'},400);
 const clauses=['s.revoked_at IS NULL','s.expires_at>?','s.created_at>=?','s.created_at<?'],args:unknown[]=[now,Date.parse(from),Date.parse(to)+DAY];
 for(const [param,column] of [['language','language'],['mode','mode'],['channel','channel'],['version','game_version']] as const){const v=url.searchParams.get(param);if(v){if(v.length>32)return json({error:'invalid_filter'},400);clauses.push(`s.${column}=?`);args.push(v);}}
 const caseId=url.searchParams.get('caseId');if(caseId){if(!/^case_[a-z_]{1,24}$/.test(caseId))return json({error:'invalid_case'},400);clauses.push('EXISTS(SELECT 1 FROM journal_events e WHERE e.session_id=s.id AND e.case_id=?)');args.push(caseId);}
 const cursor=url.searchParams.get('cursor');if(cursor){const [at,id]=cursor.split(':');if(!/^\d{13}$/.test(at)||!journalUuid(id))return json({error:'invalid_cursor'},400);clauses.push('(s.created_at<? OR (s.created_at=? AND s.id<?))');args.push(Number(at),Number(at),id);}
 const found=await env.DB.prepare(`SELECT s.* FROM journal_sessions s WHERE ${clauses.join(' AND ')} ORDER BY s.created_at DESC,s.id DESC LIMIT 51`).bind(...args).all<SessionRow>();
 const sessions=found.results.slice(0,50),last=sessions[sessions.length-1];
 return json({sessions:sessions.map(publicSession),nextCursor:found.results.length>50&&last?`${last.created_at}:${last.id}`:null,
  policyVersion:JOURNAL_POLICY,retentionDays:JOURNAL_RETENTION_DAYS,population:'Voluntary adult sessions; not all visitors',generatedAt:now});
}
export async function purgeJournal(db:Database,now=Date.now()):Promise<void>{
 await db.batch([db.prepare('DELETE FROM journal_events WHERE session_id IN (SELECT id FROM journal_sessions WHERE expires_at<=?)').bind(now),
 db.prepare('DELETE FROM journal_sessions WHERE expires_at<=?').bind(now),db.prepare('DELETE FROM journal_revocations WHERE expires_at<=?').bind(now),
 db.prepare('DELETE FROM journal_daily_limits WHERE day<?').bind(new Date(now-90*DAY).toISOString().slice(0,10))]);
}

import { cleanJournalProperties, JOURNAL_ACTIVE_HOURS, JOURNAL_BATCH_BYTES, JOURNAL_MAX_EVENTS, JOURNAL_POLICY,
  JOURNAL_RETENTION_DAYS, JOURNAL_EVENT_TYPES, journalUuid, journalToken, journalWriting, validJournalEvent,
  type JournalContext, type JournalEvent, type JournalStart } from '../../../analytics/journal-schema';
import { isCaseId, type AnalyticsPayload } from './analyticsSchema';
import packageMetadata from '../../../package.json';
import {PRODUCTION_JOURNAL_ENDPOINT,LEGACY_JOURNAL_ENDPOINT,LEGACY_COLLECTOR_ORIGIN} from '../../../analytics/endpoints';

export interface JournalStorage { getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void; }
export interface JournalMetadata extends JournalContext { difficulty:string;mission:string;audience:string;sessionMinutes?:number; }
interface Grant {sessionId:string;token:string;policyVersion:string;qualitative:boolean;createdAt:number;activeUntil:number;expiresAt:number;}
interface Persisted {grant:Grant;queue:JournalEvent[];seq:number;revoking:boolean;attempts:Record<string,string>;closed:string[];}
export interface JournalConfig {
 enabled:boolean;endpoint:string;receiptEndpoints?:readonly string[];storage?:JournalStorage;storageKey?:string;privacyBlocked?:()=>boolean;
 now?:()=>number;uuid?:()=>string;fetch?:typeof fetch;notify?:()=>void;
}
export type JournalStatus='off'|'ready'|'recording'|'pending'|'retry'|'revoking'|'deleted'|'expired'|'limit'|'blocked';
const bytes=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).length;
export class SessionJournal {
 private grant:Grant|null=null;
 private queue:JournalEvent[]=[];
 private seq=0;
 private revoking=false;
 private flushing=false;
 private starting=false;
 private deleting=false;
 private generation=0;
 private attempts:Record<string,string>={};
 private closed=new Set<string>();
 private state:JournalStatus='ready';
 private error='';
 private lastActivity=0;
 private heartbeatAt=0;
 private context:()=>JournalMetadata=()=>({language:'it',mode:'turno',phase:'menu',difficulty:'standard',mission:'full',audience:'casual'});
 private readonly clock:()=>number;
 private readonly uuid:()=>string;
 private readonly send:typeof fetch;
 private readonly storageKey:string;
 constructor(private readonly config:JournalConfig){
  this.clock=config.now??Date.now;this.uuid=config.uuid??(()=>crypto.randomUUID());this.send=config.fetch??fetch;
  this.storageKey=config.storageKey??'no-ai-act-session-journal-v3';
  this.state=config.enabled?'ready':'off';
 }
 setContextProvider(provider:()=>JournalMetadata):void{this.context=provider;}
 get supported():boolean{return this.config.enabled;}
 get status():JournalStatus{return this.revoking?'revoking':this.blocked?'blocked':this.grant&&this.grant.activeUntil<=this.clock()?'expired':this.seq>=JOURNAL_MAX_EVENTS?'limit':this.state;}
 get lastError():string{return this.error;}
 get pendingCount():number{return this.queue.length;}
 get sessionId():string|undefined{return this.grant?.sessionId;}
 get qualitative():boolean{return this.active&&this.grant?.qualitative===true;}
 get active():boolean{return !!this.grant&&!this.revoking&&!this.blocked&&this.grant.activeUntil>this.clock()&&this.config.enabled;}
 private get blocked():boolean{try{return this.config.privacyBlocked?.()===true;}catch{return true;}}
 private change(state:JournalStatus,error=''):void{this.state=state;this.error=error;try{this.config.notify?.();}catch{/* presentation cannot interrupt play */}}
 private persist():void{
  try{if(!this.grant){this.config.storage?.removeItem(this.storageKey);return;}
   this.config.storage?.setItem(this.storageKey,JSON.stringify({grant:this.grant,queue:this.queue,seq:this.seq,revoking:this.revoking,attempts:this.attempts,closed:[...this.closed]}));
  }catch{this.error='storage_unavailable';}
 }
 restore():void{
  if(!this.supported)return;
  try{
   const raw=this.config.storage?.getItem(this.storageKey);if(!raw)return;
   if(raw.length>1800000)throw new Error('size');
   const data=JSON.parse(raw) as Persisted;
   if(!data.grant||!journalUuid(data.grant.sessionId)||!journalToken(data.grant.token)||data.grant.policyVersion!==JOURNAL_POLICY
    ||typeof data.grant.qualitative!=='boolean'||!Number.isFinite(data.grant.createdAt)||!Number.isFinite(data.grant.activeUntil)
    ||!Number.isFinite(data.grant.expiresAt)||data.grant.expiresAt<=this.clock()||!Number.isInteger(data.seq)||data.seq<0||data.seq>JOURNAL_MAX_EVENTS
    ||!Array.isArray(data.queue)||!data.queue.every(validJournalEvent))throw new Error('invalid_state');
   this.grant=data.grant;this.queue=data.queue;this.seq=data.seq;this.revoking=data.revoking===true;
   this.attempts=Object.fromEntries(Object.entries(data.attempts??{}).filter(([id,value])=>isCaseId(id)&&journalUuid(value)));
   this.closed=new Set((data.closed??[]).filter(isCaseId));this.heartbeatAt=this.clock();this.lastActivity=this.clock();
   if(this.revoking){this.change('revoking');return;}
   if(this.blocked){this.queue=[];this.revoking=true;this.persist();this.change('revoking');return;}
   if(!this.active){this.change('expired');return;}
   this.change(this.queue.length?'pending':'recording');this.record('recording_resumed');
  }catch{try{this.config.storage?.removeItem(this.storageKey);}catch{/* no access */}this.grant=null;this.queue=[];this.seq=0;this.change('ready');}
 }
 private async request(operation:string,value:unknown):Promise<{status:number;value:Record<string,unknown>}>{
  const response=await this.send(`${this.config.endpoint}/${operation}`,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify(value),credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',redirect:'error',keepalive:true,signal:AbortSignal.timeout(5000)});
  const result:unknown=await response.json();return {status:response.status,value:result&&typeof result==='object'?result as Record<string,unknown>:{}};
 }
 async start(adultConfirmed:boolean,qualitative:boolean):Promise<boolean>{
  if(!this.supported||this.blocked||!adultConfirmed||this.starting||this.active||this.revoking)return false;
  this.starting=true;const generation=++this.generation;
  try{
   const metadata=this.context();
   const body:JournalStart={policyVersion:JOURNAL_POLICY,adultConfirmed:true,qualitative,gameVersion:packageMetadata.version,
    language:metadata.language,mode:metadata.mode,difficulty:metadata.difficulty,mission:metadata.mission,audience:metadata.audience};
   const response=await this.request('start',body),grant=response.value as unknown as Grant;
   if(response.status!==201||!journalUuid(grant.sessionId)||!journalToken(grant.token)||grant.policyVersion!==JOURNAL_POLICY
    ||typeof grant.qualitative!=='boolean'||!Number.isFinite(grant.activeUntil)||!Number.isFinite(grant.expiresAt))throw new Error(String(response.value.error??'start_failed'));
   if(generation!==this.generation||this.blocked){this.grant=grant;this.queue=[];this.revoking=true;this.persist();await this.revoke();return false;}
   this.grant=grant;this.seq=0;this.queue=[];this.attempts={};this.closed.clear();this.revoking=false;
   this.lastActivity=this.clock();this.heartbeatAt=this.clock();this.change('recording');this.record('recording_started');this.persist();return true;
  }catch(error){this.change('retry',error instanceof Error?error.message:'network');return false;}
  finally{this.starting=false;}
 }
 cancelPendingStart():void{if(this.starting){this.generation++;this.change('ready');}}
 record(type:string,properties:Record<string,unknown>={},override:Partial<JournalContext>={},writing?:Record<string,string>):void{
  if(!this.active||!JOURNAL_EVENT_TYPES.includes(type))return;
  try{
   if(this.seq>=JOURNAL_MAX_EVENTS){this.change('limit','event_limit');return;}
   const current={...this.context(),...override};
   const caseId=isCaseId(override.caseId)?override.caseId:isCaseId(properties.caseId)?String(properties.caseId):isCaseId(current.caseId)?current.caseId:undefined;
   if(caseId&&!this.attempts[caseId])this.attempts[caseId]=this.uuid();
   const event:JournalEvent={id:this.uuid(),seq:this.seq+1,type,at:this.clock(),elapsedMs:Math.max(0,Math.min(86400000,Math.floor(this.clock()-this.grant!.createdAt))),
    language:current.language,mode:current.mode,phase:current.phase,...(caseId?{caseId,attemptId:this.attempts[caseId]}:{}),
    properties:cleanJournalProperties({difficulty:current.difficulty,mission:current.mission,audience:current.audience,sessionMinutes:current.sessionMinutes,...properties})};
   if(writing&&this.qualitative&&journalWriting(writing))event.writing={...writing};
   if(!validJournalEvent(event)||bytes(event)>JOURNAL_BATCH_BYTES-512)return;
   if(bytes(this.queue)+bytes(event)>1400000){this.change('limit','queue_limit');return;}
   this.seq++;this.queue.push(event);this.persist();this.change('pending',this.error);
  }catch{this.change('retry','storage_or_event');}
 }
 observe(payload:AnalyticsPayload):void{
  if(!this.active)return;
  const id=payload.properties.caseId;
  if(payload.event==='game_started'){this.attempts={};this.closed.clear();}
  if(payload.event==='case_started'&&id&&this.closed.has(id)){this.attempts[id]=this.uuid();this.closed.delete(id);}
  this.record(payload.event,payload.properties as unknown as Record<string,unknown>,{
   language:payload.properties.language,mode:payload.properties.mode,phase:payload.properties.phase,...(id?{caseId:id}:{})});
  if(payload.event==='case_completed'&&id)this.closed.add(id);
 }
 recordWriting(caseId:string,stage:string,writing:Record<string,string>):void{
  if(!this.qualitative)return;
  const fields=Object.fromEntries(Object.entries(writing).filter(([,value])=>value.trim()).map(([field,value])=>[field,value.slice(0,1200)]));
  // One field per immutable event keeps retry batches under the byte budget.
  for(const [field,value] of Object.entries(fields))if(journalWriting({[field]:value}))this.record('writing_saved',{caseId,stage,field},{caseId},{[field]:value});
 }
 noteActivity():void{if(this.active)this.lastActivity=this.clock();}
 heartbeat(visible:boolean,focused:boolean):void{
  const now=this.clock(),elapsed=Math.max(0,Math.min(30000,now-this.heartbeatAt));this.heartbeatAt=now;
  if(!this.active)return;
  if(visible&&focused&&now-this.lastActivity<60000)this.record('heartbeat',{activeMs:elapsed,visible:true});
 }
 async flush():Promise<boolean>{
  if(this.revoking)return this.revoke();
  if(this.blocked&&this.grant){this.queue=[];this.revoking=true;this.persist();return this.revoke();}
  if(this.grant&&this.grant.expiresAt<=this.clock()){this.grant=null;this.queue=[];this.seq=0;this.persist();this.change('expired');return false;}
  if(this.grant&&!this.active){if(this.state!=='expired')this.change('expired');return false;}
  if(!this.active||this.flushing)return false;
  if(!this.queue.length){this.change('recording');return true;}
  this.flushing=true;const generation=this.generation;
  try{
   for(let turn=0;turn<4&&this.queue.length&&this.active;turn++){
    const events:JournalEvent[]=[];
    for(const event of this.queue.slice(0,40)){if(bytes({sessionId:this.grant!.sessionId,token:this.grant!.token,events:[...events,event]})>JOURNAL_BATCH_BYTES)break;events.push(event);}
    if(!events.length){this.change('limit','event_size');return false;}
    const response=await this.request('events',{sessionId:this.grant!.sessionId,token:this.grant!.token,events});
    if(generation!==this.generation)return false;
    if(response.status===410){this.queue=[];this.grant!.activeUntil=0;this.persist();this.change('expired',String(response.value.error));return false;}
    if(response.status!==202||!Array.isArray(response.value.acceptedIds)){this.change('retry',String(response.value.error??'delivery_failed'));return false;}
    const acknowledged=new Set(response.value.acceptedIds.filter((id):id is string=>typeof id==='string'&&events.some(e=>e.id===id)));
    if(!acknowledged.size){this.change('retry','no_acknowledgement');return false;}
    this.queue=this.queue.filter(event=>!acknowledged.has(event.id));this.persist();
   }
   this.change(this.queue.length?'pending':'recording');return !this.queue.length;
  }catch{this.change('retry','network');return false;}
  finally{this.flushing=false;}
 }
 async revoke():Promise<boolean>{
  if(this.deleting)return false;
  this.generation++;this.queue=[];this.revoking=!!this.grant;this.persist();
  if(!this.grant){this.change('deleted');return true;}
  this.deleting=true;this.change('revoking');
  try{
   const response=await this.request('revoke',{sessionId:this.grant.sessionId,token:this.grant.token});
   if(response.status!==200||response.value.deleted!==true){this.change('revoking',String(response.value.error??'deletion_pending'));return false;}
   this.grant=null;this.revoking=false;this.attempts={};this.closed.clear();this.persist();this.change('deleted');return true;
  }catch{this.change('revoking','network');return false;}
  finally{this.deleting=false;}
 }
 /** A downloaded receipt restores access rights only, never recording consent. */
 recoverReceipt(value:unknown):boolean{
  if(this.active||this.revoking||!value||typeof value!=='object')return false;
  const receipt=value as Record<string,unknown>;
  if(receipt.privateReceipt!==true||(receipt.endpoint!==this.config.endpoint&&!this.config.receiptEndpoints?.includes(String(receipt.endpoint)))||!journalUuid(receipt.sessionId)||!journalToken(receipt.token)
   ||receipt.policyVersion!==JOURNAL_POLICY||typeof receipt.expiresAt!=='number'||receipt.expiresAt<=this.clock())return false;
  this.grant={sessionId:receipt.sessionId,token:receipt.token,expiresAt:receipt.expiresAt,createdAt:0,activeUntil:0,qualitative:false,policyVersion:JOURNAL_POLICY};
  this.queue=[];this.seq=0;this.persist();this.change('expired');return true;
 }
 async exportData():Promise<unknown>{
  if(!this.grant)throw new Error('no_session');
  const result=await this.request('export',{sessionId:this.grant.sessionId,token:this.grant.token});
  if(result.status!==200)throw new Error(String(result.value.error??'export_failed'));
  return {...result.value,localPendingEvents:this.queue.map(event=>({...event})),coverage:{pending:this.queue.length,lastSequence:this.seq}};
 }
 privateReceipt():unknown{
  if(!this.grant)return null;
  return {privateReceipt:true,warning:'Keep private. This credential permits access and deletion of this session.',
   endpoint:this.config.endpoint,sessionId:this.grant.sessionId,token:this.grant.token,expiresAt:this.grant.expiresAt,policyVersion:JOURNAL_POLICY};
 }
}
export function phaseForScene(scene:string):string{
 const phases:Record<string,string>={Title:'menu',Briefing:'briefing',CityMap:'map',Case:'case',Evidence:'evidence',Incident:'incident',Decision:'decision',
  Report:'report',Consequence:'consequence',Norm:'norm',Archive:'archive',Glossary:'glossary',SessionEnd:'session_end',Finale:'finale',LearningReport:'learning',Credits:'credits'};
 return phases[scene]??'menu';
}
function defaultConfig():JournalConfig{
 const env=import.meta.env??{},origin=typeof location==='undefined'?'':location.origin;
 const endpoint=PRODUCTION_JOURNAL_ENDPOINT;
 const enabled=env.VITE_SESSION_JOURNAL==='true'&&((env.VITE_RELEASE_CHANNEL==='production'&&origin==='https://www.no-ai-act.eu')
  ||(env.VITE_RELEASE_CHANNEL==='beta'&&origin===LEGACY_COLLECTOR_ORIGIN));
 let storage:JournalStorage|undefined;try{if(typeof sessionStorage!=='undefined')storage=sessionStorage;}catch{/* browser storage denied */}
 return {enabled,endpoint,receiptEndpoints:[LEGACY_JOURNAL_ENDPOINT],storage,storageKey:`no-ai-act-${String(env.VITE_RELEASE_CHANNEL)}-session-journal-v3`,
  privacyBlocked:()=>typeof navigator!=='undefined'&&(navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl===true),
  notify:()=>{if(typeof document!=='undefined')document.dispatchEvent(new CustomEvent('session-journal-status'));}};
}
export const sessionJournal=new SessionJournal(defaultConfig());
export { JOURNAL_RETENTION_DAYS, JOURNAL_ACTIVE_HOURS };

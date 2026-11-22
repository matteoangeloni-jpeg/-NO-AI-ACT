import { sessionJournal } from '../systems/SessionJournal';
import { JOURNAL_COPY } from '../i18n/journal';
import { StateManager } from '../systems/StateManager';
import type { Analytics } from '../systems/AnalyticsSystem';
import './sessionJournal.css';

function download(value:unknown,name:string):void{
 const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function initSessionJournalNotice(analytics:Analytics,pauseInput:()=>()=>void):void{
 if(!sessionJournal.supported)return;
 const button=document.createElement('button');button.id='journal-open';button.type='button';
 const bar=document.querySelector('#game-usage');if(!bar)return;bar.insertBefore(button,document.querySelector('#usage-close'));
 let current:HTMLDialogElement|undefined;
 const update=()=>{const copy=JOURNAL_COPY[StateManager.language];button.textContent=`${copy.button}: ${copy.status[sessionJournal.status]}`;};
 const open=()=>{
  if(current)return;
  const copy=JOURNAL_COPY[StateManager.language],returnFocus=document.activeElement,resume=pauseInput();
  const dialog=document.createElement('dialog');current=dialog;dialog.className='session-journal';dialog.lang=StateManager.language==='pt'?'pt-PT':StateManager.language;
  dialog.setAttribute('aria-labelledby','journal-title');
  const heading=document.createElement('h2');heading.id='journal-title';heading.textContent=copy.title;heading.tabIndex=-1;dialog.append(heading);
  for(const text of [copy.purpose,copy.scope,copy.rights]){const p=document.createElement('p');p.textContent=text;dialog.append(p);}
  const policy=document.createElement('a');policy.textContent=copy.policy;policy.href=`/game-statistics.html#${StateManager.language}`;policy.target='_blank';policy.rel='noopener noreferrer';dialog.append(policy);
  const status=document.createElement('p');status.setAttribute('role','status');dialog.append(status);
  const consent=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=copy.button;consent.append(legend);
  function check(text:string):HTMLInputElement{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=false;label.append(input,document.createTextNode(text));consent.append(label);return input;}
  const adult=check(copy.adult),writing=check(copy.writing);dialog.append(consent);
  const actions=document.createElement('div');actions.className='journal-actions';dialog.append(actions);
  let busy=false,operationError=false;
  const close=()=>{sessionJournal.cancelPendingStart();dialog.close();dialog.remove();current=undefined;resume();document.removeEventListener('session-journal-status',refresh);try{sessionStorage.setItem('no-ai-act-journal-choice-seen','1');}catch{/* optional preference */}if(returnFocus instanceof HTMLElement&&returnFocus.isConnected)returnFocus.focus();};
  const control=(label:string,action:()=>void|Promise<void>)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>{void action();});actions.append(b);return b;};
  const accept=control(copy.accept,async()=>{if(busy||!adult.checked)return;busy=true;refresh();const ok=await sessionJournal.start(true,writing.checked);busy=false;
   if(ok){analytics.enable();void sessionJournal.flush();close();}else{refresh();status.textContent+=` — ${copy.failure}`;}});
  const decline=control(copy.decline,close);
  const erase=control(copy.erase,async()=>{if(busy)return;busy=true;refresh();await sessionJournal.revoke();busy=false;refresh();});
  const exportButton=control(copy.export,async()=>{if(busy)return;busy=true;operationError=false;refresh();try{await sessionJournal.flush();download(await sessionJournal.exportData(),`no-ai-act-session-${sessionJournal.sessionId}.json`);}catch{operationError=true;}finally{busy=false;refresh();}});
  const receipt=control(copy.receipt,()=>{const value=sessionJournal.privateReceipt();if(value)download(value,`no-ai-act-private-receipt-${sessionJournal.sessionId}.json`);});
  const recover=document.createElement('label');recover.className='journal-recover';recover.textContent=copy.recover;const file=document.createElement('input');file.type='file';file.accept='application/json,.json';recover.append(file);dialog.append(recover);
  file.addEventListener('change',async()=>{const selected=file.files?.[0];if(!selected||selected.size>4096)return;try{if(!sessionJournal.recoverReceipt(JSON.parse(await selected.text())))throw new Error();refresh();}catch{status.textContent=copy.failure;}file.value='';});
  const warning=document.createElement('p');warning.textContent=copy.privateWarning;dialog.append(warning);
  function refresh():void{
   const has=!!sessionJournal.sessionId,active=sessionJournal.active,pendingDelete=sessionJournal.status==='revoking';
   status.textContent=`${copy.status[sessionJournal.status]}${has?` · ${sessionJournal.sessionId}`:''}${sessionJournal.pendingCount?` · ${copy.pending}: ${sessionJournal.pendingCount}`:''}${operationError?` — ${copy.failure}`:''}`;
   consent.hidden=active||pendingDelete;accept.hidden=active||pendingDelete;accept.disabled=busy||!adult.checked||sessionJournal.status==='blocked';
   adult.disabled=busy;writing.disabled=busy;
   decline.textContent=has?copy.close:copy.decline;erase.hidden=!has;exportButton.hidden=!has;receipt.hidden=!has;
   erase.disabled=busy;exportButton.disabled=busy||pendingDelete;receipt.disabled=busy;file.disabled=busy||active||pendingDelete;update();
  }
  adult.addEventListener('change',refresh);document.addEventListener('session-journal-status',refresh);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  for(const event of ['keydown','keyup','pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click'])dialog.addEventListener(event,e=>e.stopPropagation());
  document.body.append(dialog);refresh();dialog.showModal();heading.focus();
 };
 button.addEventListener('click',open);document.addEventListener('session-journal-status',update);
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});update();
 // A single invitation per tab; refusal does not affect play or future visits.
 try{if(!sessionStorage.getItem('no-ai-act-journal-choice-seen')&&!sessionJournal.sessionId&&sessionJournal.status!=='blocked')window.setTimeout(open,1200);}catch{/* the visible button remains available */}
}

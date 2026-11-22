const root=document.getElementById('session-records'),form=document.getElementById('journal-filters'),status=document.getElementById('journal-status'),list=document.getElementById('journal-list'),detail=document.getElementById('journal-detail'),more=document.getElementById('journal-more');
const day=date=>date.toISOString().slice(0,10),today=new Date();
form.elements.from.value=day(new Date(+today-13*86400000));form.elements.to.value=day(today);
let cursor=null,query='',busy=false,rows=[],selected;
const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const date=timestamp=>`${new Date(timestamp).toLocaleString('it-IT')} (${new Date(timestamp).toISOString()})`;
async function read(url){const response=await fetch(url,{cache:'no-store',credentials:'same-origin'});if(response.status===401||response.status===403)throw new Error('Accesso scaduto: accedi nuovamente.');const data=await response.json();if(!response.ok)throw new Error(`Registro non disponibile (${data.error??response.status}).`);return data;}
function table(headers){const t=node('table'),head=node('thead'),tr=node('tr');for(const text of headers){const th=node('th',text);th.scope='col';tr.append(th);}head.append(tr);const body=node('tbody');t.append(head,body);return {t,body};}
function save(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function render(){
 list.replaceChildren();if(!rows.length){list.append(node('p','Nessuna sessione consensuale ricevuta nel periodo selezionato. Questo non equivale a nessun giocatore.'));return;}
 const {t,body}=table(['Inizio','Sessione','Versione / canale','Lingua / modalità','Eventi ricevuti','Testi autorizzati']);
 for(const session of rows){const tr=node('tr');tr.append(node('td',date(session.created_at)));const cell=node('td'),open=node('button',session.id);open.type='button';open.addEventListener('click',()=>{void inspect(session.id);});cell.append(open);tr.append(cell,node('td',`${session.game_version} / ${session.channel}`),node('td',`${session.language} / ${session.mode}`),node('td',String(session.event_count)),node('td',session.qualitative?'Sì':'No'));body.append(tr);}list.append(t);
}
async function load(append=false){
 if(busy)return;busy=true;more.disabled=true;status.textContent='Lettura delle singole sessioni…';
 try{status.className='';if(!append){rows=[];cursor=null;list.replaceChildren();const q=new URLSearchParams();for(const [key,value] of new FormData(form))if(String(value))q.set(key,String(value));query=q.toString();}
  const data=await read(`/api/journal/sessions?${query}${append&&cursor?`&cursor=${encodeURIComponent(cursor)}`:''}`);
  rows.push(...data.sessions);cursor=data.nextCursor;render();more.hidden=!cursor;
  status.textContent=`${rows.length} sessioni visualizzate${cursor?' (altre disponibili)':''}. Solo maggiorenni consenzienti; conservazione ${data.retentionDays} giorni. Nessuna soppressione per soglia in questo registro privato.`;
 }catch(error){status.textContent=error.message;status.className='error';}finally{busy=false;more.disabled=false;}
}
async function inspect(id){
 selected=id;detail.replaceChildren(node('p','Caricamento del percorso…'));
 try{const data=await read(`/api/journal/session?id=${encodeURIComponent(id)}`);if(selected!==id)return;
  detail.replaceChildren();const s=data.session,events=data.events;detail.append(node('h3',`Sessione ${s.id}`));
  const end=events.some(e=>e.event_type==='session_completed')?'Chiusura del percorso osservata':'Chiusura del percorso non osservata';
  const sequences=new Set(events.map(e=>e.seq)),last=events.at(-1)?.seq??0;
  const gaps=last-sequences.size,active=events.filter(e=>e.event_type==='heartbeat').reduce((sum,e)=>sum+Number(e.properties.activeMs??0),0);
  detail.append(node('p',`${end}. Inizio consenso: ${date(s.created_at)}. Ultimo invio: ${date(s.last_seen_at)}. Scadenza: ${date(s.expires_at)}.`));
  detail.append(node('p',`${events.length} eventi ricevuti; ultima sequenza ${last}; ${gaps} numeri mancanti prima dell’ultima sequenza. Eventuali eventi finali non ricevuti non sono rilevabili dal server. Attività stimata: ${(active/60000).toFixed(1)} min, non tempo di lettura o apprendimento misurato.`));
  detail.append(node('p',`Contesto iniziale: ${JSON.stringify(s.context)}. Le lingue e modalità dei singoli eventi possono cambiare durante la sessione.`));
  const json=node('button','Scarica sessione JSON');json.type='button';json.addEventListener('click',()=>save(data,`no-ai-act-session-${id}.json`));
  const csv=node('a','Scarica eventi CSV');csv.href=`/api/journal/session?id=${encodeURIComponent(id)}&format=csv`;detail.append(json,document.createTextNode(' · '),csv);
  const {t,body}=table(['Seq. / tempo','Evento / fase','Caso / tentativo','Dettagli']);
  const scroll=node('div');scroll.className='scroll';scroll.append(t);detail.append(scroll);let shown=0;
  const next=node('button','Mostra altri 200 eventi');next.type='button';detail.append(next);
  function display(){for(const event of events.slice(shown,shown+200)){const tr=node('tr');tr.append(node('td',`${event.seq} · ${(event.elapsed_ms/1000).toFixed(1)} s`),node('td',`${event.event_type} / ${event.phase}`),node('td',`${event.case_id??'Sessione'}${event.attempt_id?` / ${event.attempt_id}`:''}`));
    const td=node('td'),details=node('details'),summary=node('summary',`${event.language} / ${event.mode} · ${date(event.received_at)}`);details.append(summary,node('pre',JSON.stringify({clientTime:event.client_at,properties:event.properties,...(event.writing?{writing:event.writing}:{}),...(event.writingStatus?{writingStatus:event.writingStatus}:{})},null,2)));td.append(details);tr.append(td);body.append(tr);}
   shown=Math.min(shown+200,events.length);next.hidden=shown>=events.length;}
  next.addEventListener('click',display);display();detail.tabIndex=-1;detail.focus();
 }catch(error){detail.replaceChildren(node('p',error.message));}
}
form.addEventListener('submit',event=>{event.preventDefault();void load();});more.addEventListener('click',()=>{void load(true);});
if(root)void load();

import { experiment } from './forecast.js';
const $ = id => document.getElementById(id);
const format = n => new Intl.NumberFormat('it-IT').format(n);
const form = $('filters');
const today = new Date();
const iso = date => date.toISOString().slice(0, 10);
form.elements.to.value = iso(today);
form.elements.from.value = iso(new Date(today.valueOf() - 13 * 86400000));
let data = {}; let prior = []; let provenance; let previousProvenance; let applied; let loading = false; let failed = false;
const labels = { it:'Italiano', en:'Inglese', fr:'Francese', turno:'Turno', libera:'Libera', sorpresa:'Sorpresa', ripasso:'Ripasso', correct:'Corretti', partial:'Parziali', wrong:'Errati', under_1m:'Meno di 1 min', '1_to_5m':'1–5 min', '5_to_15m':'5–15 min', '15_to_30m':'15–30 min', '30m_plus':'30 min o più' };
function node(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
function sum(rows, event, value) { return rows.filter(r => r.event === event && (value === undefined || r.value === value)).reduce((n,r) => n + r.count, 0); }
function rate(n, d) { return d ? `${(100*n/d).toFixed(1)}%` : 'n.d.'; }
function observed(rows,event,value) { return rows.some(r=>r.event===event && (value===undefined || r.value===value)) ? format(sum(rows,event,value)) : 'n.d.'; }
function metric(target, title, value, definition) {
  const box = node('div', undefined, 'metric'); box.append(node('div', title), node('strong', value), node('small', definition)); target.append(box);
}
function table(target, titles, rows, caption) {
  target.replaceChildren(); const t = node('table'); if (caption) t.append(node('caption', caption));
  const head = node('thead'); const tr = node('tr'); titles.forEach(title => { const th = node('th', title); th.scope = 'col'; tr.append(th); }); head.append(tr); t.append(head);
  const body = node('tbody'); rows.forEach(row => { const tr = node('tr'); row.forEach(value => tr.append(node('td', value))); body.append(tr); }); t.append(body); target.append(t);
  if (!rows.length) target.append(node('p', 'Nessuna cella disponibile per questo periodo o filtro. Non equivale a zero attività.'));
}
function bars(target, rows, event) {
  target.replaceChildren(); const values = [...new Set(rows.filter(r => r.event === event).map(r => r.value))].map(v => [v, sum(rows,event,v)]);
  const maximum = Math.max(1, ...values.map(v => v[1]));
  if (event==='case_completed' && rows[0]?.dimension==='durationBucket') {
    const order=['under_1m','1_to_5m','5_to_15m','15_to_30m','30m_plus'];values.sort((a,b)=>order.indexOf(a[0])-order.indexOf(b[0]));
  }
  values.forEach(([value,count]) => { const row = node('div', undefined, 'bar-row'); const track = node('div', undefined, 'bar-track'); const bar = node('div', undefined, 'bar'); bar.style.width = `${100*count/maximum}%`; track.append(bar); row.append(node('span', labels[value] ?? value), track, node('strong', format(count))); target.append(row); });
  if (!values.length) target.append(node('p', 'Dati non disponibili.'));
}
function scope() { return {from:form.elements.from.value,to:form.elements.to.value,version:form.elements.version.value}; }
function dirty() { const draft=scope();return !applied || ['from','to','version'].some(key=>draft[key]!==applied[key]); }
function query(dimension, filters=applied) {
  const q = new URLSearchParams({ from:filters.from, to:filters.to, dimension }); if (filters.version) q.set('version', filters.version); return q;
}
async function fetchStats(dimension, filters) {
  const response = await fetch(`/api/stats?${query(dimension,filters)}`, { cache:'no-store' });
  if(response.status===401 || response.status===403){$('sign-in').hidden=false;$('collection-status').textContent='Accesso scaduto o negato. I dati gia mostrati non sono aggiornati.';}
  if (!response.ok) throw new Error(response.status === 401 ? 'Accesso scaduto o non autorizzato.' : 'Statistiche non disponibili. Riprova tra poco.');
  return response.json();
}
function render() {
  const totals = data.all ?? []; const starts = sum(totals,'game_started'); const resumed = sum(totals,'game_resumed'); const sessions = starts+resumed; const completed = sum(totals,'session_completed');
  $('kpis').replaceChildren();
  metric($('kpis'),'Sessioni osservate',sessions ? format(sessions) : 'n.d.','Avvii + riprese; non giocatori unici');
  metric($('kpis'),'Avvii',observed(totals,'game_started'),'Conferme di un nuovo piano');
  metric($('kpis'),'Completamenti del piano',observed(totals,'session_completed'),'Primo termine naturale del piano');
  metric($('kpis'),'Rapporto di completamento',completed ? rate(completed,sessions) : 'n.d.',`${observed(totals,'session_completed')} completamenti / ${sessions ? format(sessions) : 'n.d.'} avvii e riprese`);
  const dates = [];
  for (let date=Date.parse(applied.from); date<=Date.parse(applied.to); date+=86400000) dates.push(iso(new Date(date)));
  const latest=totals.map(r=>r.day).sort().at(-1);
  const available=new Set(totals.map(r=>r.day)).size;
  $('collection-status').textContent=`Raccolta ${provenance.collectionEnabled?'ABILITATA sul backend':'DISATTIVATA sul backend'} · Ultimo giorno con celle disponibili nel filtro: ${latest ?? 'n.d.'} · ${available}/${dates.length} giorni con almeno una cella. La presenza di celle non dimostra copertura completa; non e l'ora dell'ultimo evento ricevuto.${provenance.retentionWindow.clipped?' Intervallo parzialmente conservato.':''}`;
  $('logout').hidden=!provenance.localEnvironment;
  $('sign-in').hidden=true;
  let chart=$('activity-chart');if(!chart){chart=node('div');chart.id='activity-chart';$('trend').before(chart);}
  drawChart(chart,dates,[{name:'Avvii',values:dates.map(day=>totals.some(r=>r.day===day&&r.event==='game_started')?sum(totals.filter(r=>r.day===day),'game_started'):null)},{name:'Completamenti',values:dates.map(day=>totals.some(r=>r.day===day&&r.event==='session_completed')?sum(totals.filter(r=>r.day===day),'session_completed'):null)}]);
  table($('trend'), ['Giorno UTC','Avvii','Riprese','Completamenti'], dates.map(day => {
    const rows = totals.filter(r => r.day===day);
    const count = event => rows.some(r => r.event===event) ? format(sum(rows,event)) : 'n.d.';
    return [day, count('game_started'), count('game_resumed'), count('session_completed')];
  }), 'n.d. = nessuna cella disponibile o soglia non raggiunta; non uno zero osservato.');
  bars($('languages'),data.language,'game_started'); bars($('modes'),data.mode,'game_started');
  bars($('outcomes'),data.result,'case_completed'); bars($('durations'),data.durationBucket,'case_completed');
  const cases = [...new Set(data.caseId.map(r => r.value))].sort();
  table($('cases'),['Caso','Avvii','Completamenti','Complet. / avvii','Errori citazione','Errori / avvii','Richieste aiuto','Debrief'], cases.map(id => {
    const start = sum(data.caseId,'case_started',id), done = sum(data.caseId,'case_completed',id), errors = sum(data.caseId,'citation_error',id);
    return [id,observed(data.caseId,'case_started',id),observed(data.caseId,'case_completed',id),done ? rate(done,start) : 'n.d.',observed(data.caseId,'citation_error',id),errors ? rate(errors,start) : 'n.d.',observed(data.caseId,'hint_requested',id),observed(data.caseId,'debrief_opened',id)];
  }), 'Conteggi separati: non è possibile attribuire un errore a un esito o a una singola sessione.');
  $('learning').replaceChildren();
  [['tutorial_started','Tutorial avviati'],['tutorial_completed','Tutorial completati'],['tutorial_skipped','Tutorial saltati'],['review_started','Ripassi avviati'],['debrief_opened','Debrief consultati']].forEach(([event,title])=>metric($('learning'),title,observed(totals,event),'Eventi osservati, non persone o apprendimento'));
  renderComparison(); updateExport(); renderLab();
  const previousSessions = sum(prior,'game_started')+sum(prior,'game_resumed');
  const clipped=provenance.retentionWindow.clipped || previousProvenance.retentionWindow.clipped;
  table($('period'),['Periodo','Avvii + riprese','Completamenti','Complet. / sessioni'], [['Selezionato',sessions ? format(sessions) : 'n.d.',observed(totals,'session_completed'),completed ? rate(completed,sessions) : 'n.d.'],
    clipped ? ['Precedente — non comparabile','n.d.','n.d.','n.d.'] : ['Precedente',previousSessions ? format(previousSessions) : 'n.d.',observed(prior,'session_completed'),sum(prior,'session_completed') ? rate(sum(prior,'session_completed'),previousSessions) : 'n.d.']],
    clipped ? `Confronto non disponibile: conservazione dal ${provenance.retentionWindow.retainedFrom}; ${previousProvenance.retentionWindow.availableDays} giorni conservati nel periodo precedente. La presenza di celle non prova copertura completa.` : 'Stessa durata nominale. Un periodo precedente senza celle è indisponibile, non una baseline pari a zero.');
  $('provenance').replaceChildren();
  [['Classificazione',provenance.classification === 'synthetic' ? 'Dati sintetici di test, non giocatori reali' : 'Eventi osservati'],['Intervallo',`${provenance.query.from} — ${provenance.query.to}`],['Origine','Contatori aggregati del backend; catalogo Sprint A, schema 1'],['Aggiornamento',provenance.generatedAt],['Soglia',`${provenance.threshold} eventi / cella giornaliera`],['Versioni disponibili',[...new Set(totals.map(r=>r.version))].join(', ') || 'Nessuna']].forEach(([k,v])=>$('provenance').append(node('dt',k),node('dd',v)));
}
function renderComparison() {
  const dimension = $('compare-dimension').value; const rows = dimension==='version' ? data.all : data[dimension];
  const values = [...new Set(rows.map(r=>dimension==='version'?r.version:r.value))].sort();
  table($('comparison'),[dimension==='version'?'Versione':dimension==='mode'?'Modalità':'Lingua','Avvii + riprese','Completamenti','Complet. / sessioni'],values.map(v=>{
    const subset = rows.filter(r=>(dimension==='version'?r.version:r.value)===v);
    const sessions = sum(subset,'game_started')+sum(subset,'game_resumed'); const completed = sum(subset,'session_completed');
    return [labels[v]??v,sessions ? format(sessions) : 'n.d.',observed(subset,'session_completed'),completed ? rate(completed,sessions) : 'n.d.'];
  }), dimension==='version' && values.length<2 ? 'Una sola versione disponibile: confronto tra release non ancora possibile. Il backend non inventa versioni aggiuntive.' : 'Rapporti di conteggi indipendenti; nessuna inferenza causale.');
}
function renderLab() {
  if(!applied)return;
  const result=experiment(data.all ?? [],$('lab-event').value,applied.from,applied.to,Number($('lab-horizon').value));
  $('lab-status').textContent=result.blocked ? 'Stima non disponibile: servono almeno 14 giorni consecutivi con celle disponibili. Assenze e soppressioni non sono zeri.' : `${provenance.classification==='synthetic'?'ESPERIMENTO SU DATI SINTETICI':'ESPERIMENTO SU CONTATORI PUBBLICABILI'} · ${result.values.length} giorni · ${result.scores[0].tests} verifiche temporali. Nessuna previsione di giocatori unici.`;
  let chart=$('prediction-chart');if(!chart){chart=node('div');chart.id='prediction-chart';$('lab-forecast').before(chart);}
  if(result.blocked){$('lab-models').replaceChildren();$('lab-forecast').replaceChildren();chart.replaceChildren();return;}
  const future=result.forecasts[0].points.map((_,i)=>iso(new Date(Date.parse(applied.to)+(i+1)*86400000)));
  drawChart(chart,[...result.days,...future],[{name:'Conteggi disponibili',values:[...result.values,...future.map(()=>null)]},...result.forecasts.map(s=>({name:s.name,values:[...result.values.map(()=>null),...s.points],forecast:true}))]);
  table($('lab-models'),['Modello','MAE (eventi/giorno)','Giorni di verifica'],result.scores.map(s=>[s.name,s.mae.toFixed(2),s.tests]),'Verifica a origine mobile: ogni previsione usa solo giorni precedenti. MAE piu basso = minore errore nel campione, non garanzia futura.');
  table($('lab-forecast'),['Giorno UTC',...result.forecasts.map(s=>s.name)],result.forecasts[0].points.map((_,i)=>[iso(new Date(Date.parse(applied.to)+(i+1)*86400000)),...result.forecasts.map(s=>s.points[i].toFixed(1))]),'Proiezioni puntuali esplorative, senza intervalli di confidenza calibrati. La valutazione e a un giorno; non valida automaticamente gli orizzonti piu lunghi.');
}
function drawChart(target,days,series){
  target.replaceChildren();const colors=['#acc5ed','#f1ce69','#75dba2','#ff928b','#c1a7ef','#edf1f7'];
  const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 800 240');svg.setAttribute('role','img');svg.setAttribute('aria-label','Conteggi giornalieri; valori esatti nella tabella seguente. Interruzioni indicano dati mancanti.');
  const max=Math.max(1,...series.flatMap(s=>s.values.filter(v=>v!==null)));
  for(const [i,s]of series.entries()){
    let d='';let open=false;
    s.values.forEach((v,j)=>{if(v===null){open=false;return;}const x=60+j*720/Math.max(1,days.length-1),y=200-v*170/max;d+=`${open?'L':'M'}${x},${y} `;open=true;const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',String(x));dot.setAttribute('cy',String(y));dot.setAttribute('r','3');dot.setAttribute('fill',colors[i%colors.length]);svg.append(dot);});
    const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke',colors[i%colors.length]);path.setAttribute('stroke-width','2');if(s.forecast)path.setAttribute('stroke-dasharray','6 4');svg.append(path);
  }
  for(const [x,y,label]of [[5,35,Math.ceil(max)],[20,200,0],[60,230,days[0]],[670,230,days.at(-1)]]){const text=document.createElementNS(ns,'text');text.setAttribute('x',String(x));text.setAttribute('y',String(y));text.setAttribute('fill','#e7ecf5');text.textContent=String(label);svg.append(text);}
  const legend=node('p',series.map(s=>`${s.name}${s.forecast?' (proiezione tratteggiata)':''}`).join(' · '));target.append(svg,legend);
}
function updateExport() {
  const dimension = $('export-dimension').value;
  if(loading || failed || dirty()) $('export').removeAttribute('href');
  else $('export').href = `/api/export.csv?${query(dimension)}`;
  table($('source-rows'),['Giorno UTC','Versione','Evento','Dimensione','Valore','Conteggio'],(data[dimension]??[]).map(r=>[r.day,r.version,r.event,r.dimension,r.value,format(r.count)]),'CSV e tabella: stesso periodo, versione, dimensione e soglia.');
}
async function refresh() {
  if (loading) return; const filters=Object.freeze(scope()); loading=true; failed=false;
  for(const control of form.elements)control.disabled=true;
  $('export').removeAttribute('href'); $('status').className=''; $('status').textContent='Aggiornamento…';
  try {
    const dimensions=['all','language','mode','caseId','phase','result','durationBucket','hintUsed','tutorialVersion']; const next = {}; let nextProvenance;
    for (const dimension of dimensions) { const result = await fetchStats(dimension,filters); next[dimension]=result.rows; if(dimension==='all') nextProvenance=result; }
    const days = (Date.parse(filters.to)-Date.parse(filters.from))/86400000+1;
    const previousTo = Date.parse(filters.from)-86400000; const previousFrom=previousTo-(days-1)*86400000;
    const previous=await fetchStats('all',{...filters,from:iso(new Date(previousFrom)),to:iso(new Date(previousTo))});
    data=next;provenance=nextProvenance;previousProvenance=previous;prior=previous.rows;applied=filters;
    const versions = [...new Set(data.all.map(r=>r.version))]; const selected=filters.version;
    form.elements.version.replaceChildren(new Option('Tutte',''),...versions.map(v=>new Option(v,v))); form.elements.version.value=selected;
    $('classification').textContent=provenance.classification==='synthetic'?'DATI SINTETICI · TEST':'DATI OSSERVATI';
    render(); $('status').textContent=`Aggiornato · ${provenance.query.from} / ${provenance.query.to} · UTC${provenance.retentionWindow.clipped?' · Intervallo parzialmente conservato':''}`;
  } catch(error) { failed=true;$('status').className='error'; $('status').textContent=error.message; }
  finally { loading=false;for(const control of form.elements)control.disabled=false;if(provenance)updateExport(); }
}
for(const control of form.elements)if(control.name)control.addEventListener('input',()=>{
  if(dirty()){ $('export').removeAttribute('href');$('status').textContent='Modifiche non applicate: i dati mostrati restano quelli dell’ultimo aggiornamento.'; }
  else if(provenance)updateExport();
});
form.addEventListener('submit',event=>{event.preventDefault();refresh();});
$('compare-dimension').addEventListener('change',()=>{if(provenance)renderComparison();});
$('export-dimension').addEventListener('change',()=>{if(provenance)updateExport();});
for(const id of ['lab-event','lab-horizon'])$(id).addEventListener('change',renderLab);
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>{b.removeAttribute('aria-current');$(b.dataset.view).hidden=true;});button.setAttribute('aria-current','page');$(button.dataset.view).hidden=false;}));
refresh();

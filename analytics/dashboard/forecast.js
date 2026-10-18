export const models = ['Ultimo valore', 'Media mobile (7 giorni)', 'Media esponenziale', 'Trend lineare', 'Stagionale settimanale'];
export function predict(values, model, horizon = 1) {
  const n = values.length;
  if (!n) return null;
  let value;
  if (model === 0) value = values[n - 1];
  else if (model === 1) { const tail = values.slice(-7); value = tail.reduce((a,b)=>a+b,0)/tail.length; }
  else if (model === 2) value = values.reduce((level,y)=>0.3*y+0.7*level,values[0]);
  else if (model === 3) {
    if (n < 2) return null;
    const mean = values.reduce((a,b)=>a+b,0)/n, x = (n-1)/2;
    const slope = values.reduce((s,y,i)=>s+(i-x)*(y-mean),0)/values.reduce((s,_,i)=>s+(i-x)**2,0);
    value = mean+slope*(n-1+horizon-x);
  } else if (model === 4) { if(n<7)return null; value=values[n-7+(horizon-1)%7]; }
  else return null;
  return Number.isFinite(value) ? Math.max(0,value) : null;
}
export function experiment(rows, event, from, to, horizon = 7) {
  const values = [], days = [];
  for(let day=Date.parse(from);day<=Date.parse(to);day+=86400000) {
    const date = new Date(day).toISOString().slice(0,10);
    const cells = rows.filter(r=>r.day===date && r.event===event);
    days.push(date);
    values.push(cells.length ? cells.reduce((s,r)=>s+r.count,0) : null);
  }
  // Missing or suppressed cells cannot be imputed as zero activity.
  if(values.length<14 || values.some(v=>v===null || !Number.isFinite(v) || v<0))return {blocked:true,days,values};
  const start = Math.max(7,values.length-7);
  const scores=models.map((name,model)=>{
    const errors=[];
    for(let i=start;i<values.length;i++)errors.push(Math.abs(predict(values.slice(0,i),model)-values[i]));
    return {name,model,mae:errors.reduce((a,b)=>a+b,0)/errors.length,tests:errors.length};
  }).sort((a,b)=>a.mae-b.mae);
  const forecasts=scores.map(s=>({...s,points:Array.from({length:horizon},(_,i)=>predict(values,s.model,i+1))}));
  return {blocked:false,days,values,scores,forecasts};
}

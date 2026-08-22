import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const out = '/tmp/claude-0/-home-user--NO-AI-ACT/0f712395-e9c3-5248-8bc1-c1734e8d048f/scratchpad';
const fail = [];
for (const [name, url, w, h] of [
  ['desktop-it','http://localhost:4200/',1440,900],
  ['desktop-en','http://localhost:4200/en/',1440,900],
  ['mobile-it','http://localhost:4200/',390,844],
  ['mobile-en','http://localhost:4200/en/',390,844],
]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: false });
  // overflow orizzontale?
  const of = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  // titolo visibile above the fold?
  const h1 = await p.evaluate(() => { const e=document.querySelector('h1'); const r=e.getBoundingClientRect(); return r.top < window.innerHeight && r.height > 0; });
  const cta = await p.evaluate(() => { const e=document.querySelector('.btn-primary'); const r=e.getBoundingClientRect(); return r.top < window.innerHeight; });
  const cards = await p.evaluate(() => document.querySelectorAll('.case-card').length);
  console.log(`${name.padEnd(12)} overflow:${of?'SÌ ⚠':'no '} h1-visibile:${h1} cta-above-fold:${cta} card:${cards} errori:${errs.length}`);
  if (of || !h1 || !cta || cards !== 13 || errs.length) fail.push(name + ' ' + errs.join('|'));
  await ctx.close();
}
await b.close();
if (fail.length) { console.error('FAIL:', fail); process.exit(1); }
console.log('tutte le viste OK');

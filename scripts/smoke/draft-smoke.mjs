/**
 * BOZZA PERSISTENTE — verifica di fine a fine (U01 / U07).
 *
 * I test unitari coprono il modello e le regole di scarto, ma la domanda a
 * cui rispondono non è quella del giocatore. La sua è: "se chiudo la scheda
 * a metà fascicolo e riapro, ritrovo quello che avevo fatto?". Quella si
 * risponde solo ricaricando davvero una pagina.
 *
 * Il percorso: apre un caso, scopre e cita due reperti, prende due
 * decisioni, RICARICA, e verifica che reperti e scelte tornino — e che
 * riaprendo si finisca sul primo passo senza risposta, non all'inizio.
 * Poi firma, ricarica ancora, e verifica che la bozza sia sparita: un
 * rapporto consegnato non è più lavoro in corso.
 *
 * Usage:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome node scripts/smoke/draft-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4200';
const CASE = 'case_scoring';
const KEY = 'no-ai-act-save-v2';
const fail = [];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
await context.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

// Il seme va messo SOLO se non c'è già niente: addInitScript gira a ogni
// navigazione, e riscriverlo a ogni ricaricamento cancellerebbe la bozza che
// questo smoke esiste per verificare. (Ci sono cascato scrivendolo.)
await page.addInitScript((key) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      version: 2, briefingSeen: true, difficulty: 'standard', reducedMotion: true, language: 'it'
    }));
  }
}, KEY);

const boot = async () => {
  await page.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.game?.scene?.getScenes(true)?.length > 0, null, { timeout: 30000 });
  await page.waitForTimeout(9000);
};

const activeScene = () => page.evaluate(() => {
  const a = window.game.scene.getScenes(true);
  return a.length ? a[a.length - 1].scene.key : null;
});

const startEvidence = async () => {
  await page.evaluate((id) => window.game.scene.start('Evidence', { caseId: id }), CASE);
  await page.waitForFunction(() => {
    const a = window.game?.scene?.getScenes(true);
    return a && a.length && a[a.length - 1].scene.key === 'Evidence';
  }, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(700);
};

const draft = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').caseDrafts, KEY);

// --- 1. apre il fascicolo, scopre e cita due reperti -------------------------
await boot();
await startEvidence();
for (const k of ['1', '1', '2', '2']) { // apri+cita reperto 1, apri+cita reperto 2
  await page.keyboard.press(k);
  await page.waitForTimeout(350);
}
const afterEvidence = await draft();
const d1 = afterEvidence?.[CASE];
if (!d1) fail.push('nessuna bozza salvata dopo aver citato i reperti');
else {
  if (!d1.revealedClues.includes(0) || !d1.revealedClues.includes(1)) fail.push(`reperti aperti non salvati: ${JSON.stringify(d1.revealedClues)}`);
  if (!d1.citedClues.includes(0) || !d1.citedClues.includes(1)) fail.push(`reperti citati non salvati: ${JSON.stringify(d1.citedClues)}`);
}

// --- 2. due decisioni su cinque ---------------------------------------------
await page.evaluate((id) => window.game.scene.start('Decision', { caseId: id, citedClues: [0, 1] }), CASE);
await page.waitForTimeout(900);
await page.keyboard.press('1'); await page.waitForTimeout(700); // classificazione
await page.keyboard.press('1'); await page.waitForTimeout(700); // misura
const d2 = (await draft())?.[CASE];
if (!d2 || d2.classification === null || d2.measure === null) fail.push(`scelte non salvate: ${JSON.stringify(d2)}`);
if (d2 && d2.subject !== null) fail.push('salvata una scelta mai presa');
if (d2 && d2.step !== 'subject') fail.push(`la bozza dichiara la fase "${d2?.step}", attesa "subject"`);

// --- 3. RICARICA: è qui che prima si perdeva tutto ---------------------------
await boot();
const restored = (await draft())?.[CASE];
if (!restored) fail.push('la bozza non è sopravvissuta al ricaricamento');
else {
  if (restored.classification !== d2.classification) fail.push('classificazione persa nel ricaricamento');
  if (restored.measure !== d2.measure) fail.push('misura persa nel ricaricamento');
  if (!restored.citedClues.includes(0)) fail.push('reperti citati persi nel ricaricamento');
}

// riaprendo la decisione si riparte dal primo passo SENZA risposta
await page.evaluate((id) => window.game.scene.start('Decision', { caseId: id }), CASE);
await page.waitForTimeout(1200);
const stepText = await page.evaluate(() => {
  const a = window.game.scene.getScenes(true); const s = a[a.length - 1];
  return s.children.list.map((o) => (typeof o.text === 'string' ? o.text : '')).join(' | ');
});
if (!/DECISIONE 3 DI 5/.test(stepText)) fail.push(`ripresa sul passo sbagliato (atteso il 3): ${stepText.slice(0, 120)}`);

// i reperti citati devono essere tornati con le scelte, non azzerati
await startEvidence();
// Lo stato si legge dallo strato semantico, non dai campi della scena: nel
// bundle di produzione i nomi privati sono minificati, e leggerli funziona
// solo in sviluppo — cioè proprio dove il difetto non si manifesta. Il
// reading layer è testo vero, ed è anche ciò che sente chi usa uno screen
// reader: se il ripristino sbagliasse, sbaglierebbe anche lì.
const layer = await page.evaluate(() => document.getElementById('reading-layer')?.textContent ?? '');
const citedInLayer = (layer.match(/citato nel rapporto/gi) ?? []).length;
const sealedInLayer = (layer.match(/SIGILLATO/gi) ?? []).length;
if (citedInLayer < 2) fail.push(`dopo il ricaricamento lo strato di lettura dichiara ${citedInLayer} reperti citati, attesi 2`);
if (sealedInLayer > 4) fail.push(`dopo il ricaricamento risultano ${sealedInLayer} reperti ancora sigillati: il ripristino non ha aperto nulla`);

// --- 4. firma: la bozza deve sparire ----------------------------------------
await page.evaluate((id) => window.game.scene.start('Decision', { caseId: id }), CASE);
await page.waitForTimeout(1000);
await page.keyboard.press('2'); await page.waitForTimeout(700);  // soggetto
await page.keyboard.press('2'); await page.waitForTimeout(700);  // motivazione → riepilogo
await page.keyboard.press('Enter'); await page.waitForTimeout(1200); // firma
const scene = await activeScene();
if (scene !== 'Report') fail.push(`dopo la firma la scena è "${scene}", atteso "Report"`);
const afterSign = await draft();
if (afterSign && afterSign[CASE]) fail.push('la bozza è sopravvissuta alla firma');

await boot();
const afterReload = await draft();
if (afterReload && afterReload[CASE]) fail.push('la bozza è tornata dopo un ricaricamento successivo alla firma');
const completed = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').completedCases, KEY);
if (!completed || !completed[CASE]) fail.push('il caso firmato non risulta completato');

await browser.close();

// Il beacon di Cloudflare lo abortiamo noi qui sopra: il suo ERR_FAILED non è
// un errore del gioco. Stesso filtro degli altri smoke.
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`errori in console: ${JSON.stringify(relevantErrors)}`);
if (fail.length) {
  console.error('draft smoke — FAIL');
  for (const f of fail) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('draft smoke — PASS');
console.log(`  console errors: ${relevantErrors.length}`);
console.log('  ✓ reperti e scelte sopravvivono a un ricaricamento, la ripresa cade sul passo giusto,');
console.log('    la firma cancella la bozza e non la fa tornare');

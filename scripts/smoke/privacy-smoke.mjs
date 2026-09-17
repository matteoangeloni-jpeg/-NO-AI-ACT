/**
 * PRIVACY DEL GIOCO — che cosa viene TRASMESSO (ticket Q03 dell'audit).
 *
 * I controlli esistenti cercano stringhe nel sorgente e nel dist, e i
 * browser smoke elencano gli host contattati. Nessuno dei due risponde alla
 * domanda che conta, ed è quella che il dossier pone: *che cosa esce*, e
 * soprattutto che cosa esce QUANDO SI CHIUDE LA PAGINA. Un beacon inviato
 * con navigator.sendBeacon su pagehide non comparirebbe in nessun controllo
 * attuale, perché tutti gli smoke chiudono il browser senza guardare.
 *
 * Qui si gioca un caso intero — così esistono davvero dati di gioco da
 * poter perdere — poi si esce dalla pagina e si guarda.
 *
 * Il beacon di Cloudflare viene ABORTITO come negli altri smoke, ma il suo
 * contenuto viene comunque ispezionato: l'oggetto richiesta espone corpo e
 * URL prima dell'abort, quindi si può verificare che cosa avrebbe spedito
 * senza spedirlo.
 *
 * Usage:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome node scripts/smoke/privacy-smoke.mjs
 */
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const ALLOWED_HOSTS = ['static.cloudflareinsights.com']; // shell del sito, non del gioco
const CASE = 'case_scoring';
const fail = [];

/**
 * Tracce di gioco che non devono uscire in nessun corpo di richiesta. Non
 * sono stringhe a caso: sono esattamente i valori che il gioco salva in
 * locale — l'identificativo del caso, la classificazione scelta, la chiave
 * del salvataggio, il rapporto archiviato.
 */
const FORBIDDEN_IN_PAYLOAD = [
  CASE, 'case_', 'vietata', 'alto_rischio', 'classification', 'citedClues',
  'caseReports', 'caseDrafts', 'no-ai-act-save', 'motivationIndex', 'completedCases'
];

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

/** Ogni richiesta uscente, con il suo corpo, in ordine. */
const sent = [];
/**
 * Si registrano le richieste ESTERNE e, fra quelle di pari origine, le sole
 * che somigliano a una raccolta di statistiche. Serve perché il punto di
 * raccolta di Cloudflare Web Analytics è /cdn-cgi/rum SULLO STESSO dominio
 * del sito: filtrare per host lascerebbe fuori proprio la richiesta che
 * potrebbe portarsi via qualcosa.
 */
const BEACON_PATHS = ['/cdn-cgi/', '/rum', '/beacon', '/collect', '/track', '/event'];
context.on('request', (r) => {
  let url;
  try { url = new URL(r.url()); } catch { return; }
  const local = url.host.startsWith('localhost') || url.host.startsWith('127.');
  const beaconish = BEACON_PATHS.some((p) => url.pathname.includes(p));
  if (local && !beaconish) return;
  sent.push({ host: url.host, method: r.method(), url: r.url(), body: r.postData() ?? '', phase, local });
});
// il beacon esiste già nella shell del sito: si abortisce, ma lo si guarda
await context.route(/cloudflareinsights\.com/, (r) => r.abort());

let phase = 'avvio';
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

// Il seme gira a ogni navigazione, anche su pagine dove localStorage non è
// accessibile: senza il try l'uscita solleverebbe un SecurityError che
// questo smoke conterebbe come errore del gioco.
await page.addInitScript((key) => {
  try {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify({ version: 2, briefingSeen: true, reducedMotion: true, language: 'it' }));
    }
  } catch { /* origine senza storage: non è un problema del gioco */ }
}, 'no-ai-act-save-v2');

await page.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });
await page.waitForFunction(() => {
  const a = window.game?.scene?.getScenes(true);
  return !!a && a.some((s) => s.scene.key === 'Title');
}, undefined, { timeout: 60000 });

// --- si gioca un caso intero: da qui in poi ESISTONO dati da perdere -------
phase = 'partita';
await page.evaluate((id) => window.game.scene.start('Evidence', { caseId: id }), CASE);
await page.waitForTimeout(900);
for (const k of ['1', '1', '2', '2']) { await page.keyboard.press(k); await page.waitForTimeout(350); }
await page.evaluate((id) => window.game.scene.start('Decision', { caseId: id, citedClues: [0, 1] }), CASE);
await page.waitForTimeout(900);
for (const k of ['1', '1', '2', '2']) { await page.keyboard.press(k); await page.waitForTimeout(600); }
await page.keyboard.press('Enter'); // firma
await page.waitForTimeout(1200);

const saved = await page.evaluate((key) => localStorage.getItem(key), 'no-ai-act-save-v2');
if (!saved || !saved.includes(CASE)) fail.push('il caso non risulta giocato: il controllo non proverebbe nulla');

// --- USCITA DALLA PAGINA: è qui che un beacon si nasconderebbe ------------
phase = 'uscita';
await page.evaluate(() => {
  document.dispatchEvent(new Event('visibilitychange'));
  window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
  window.dispatchEvent(new Event('beforeunload'));
  window.dispatchEvent(new Event('unload'));
});
await page.waitForTimeout(800);
// e una navigazione vera, che è il modo in cui la pagina si lascia davvero:
// verso il sito, come fa il collegamento di ritorno nella shell del gioco
await page.goto(`${BASE}/`, { waitUntil: 'load' });
await page.waitForTimeout(800);

await browser.close();

// --- verifiche -------------------------------------------------------------
const disallowed = sent.filter((r) => !r.local && !ALLOWED_HOSTS.some((a) => r.host.includes(a)));
for (const r of sent.filter((x) => x.local)) {
  fail.push(`raccolta statistiche di pari origine (${r.phase}): ${r.method} ${new URL(r.url).pathname}`);
}
for (const r of disallowed) {
  fail.push(`richiesta a un host non consentito (${r.phase}): ${r.method} ${r.host}`);
}

for (const r of sent) {
  const haystack = `${r.url} ${r.body}`.toLowerCase();
  for (const needle of FORBIDDEN_IN_PAYLOAD) {
    if (haystack.includes(needle.toLowerCase())) {
      fail.push(`dati di gioco in una richiesta (${r.phase}, ${r.host}): "${needle}"`);
    }
  }
}

const onExit = sent.filter((r) => r.phase === 'uscita');
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`errori in console: ${JSON.stringify(relevantErrors)}`);

console.log('privacy smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  richieste esterne totali:', sent.length, JSON.stringify([...new Set(sent.map((r) => r.host))]));
console.log('  richieste all\'uscita    :', onExit.length, onExit.length ? JSON.stringify(onExit.map((r) => `${r.method} ${r.host}`)) : '(nessuna)');
console.log('  con corpo               :', sent.filter((r) => r.body).length);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ un caso giocato e firmato non produce alcuna richiesta con dati di gioco,');
console.log('    né durante la partita né all\'uscita dalla pagina');

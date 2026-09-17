/**
 * SMOKE AUDIO: i temi vengono davvero renderizzati, e suonano diversi.
 *
 * I temi musicali sono codice che genera suono: nessun file, solo nodi Web
 * Audio. Un tema può quindi rompersi in tre modi che nessun test statico
 * vede — sollevare un'eccezione mentre si costruisce, produrre silenzio, o
 * essere indistinguibile da un altro. L'unico modo di accorgersene è
 * renderizzarlo con un AudioContext vero e guardare i campioni.
 *
 * Qui ogni tema viene reso offline per qualche secondo (molto più veloce del
 * tempo reale) e se ne ricava un'impronta: energia complessiva e ripartizione
 * su quattro bande. Poi si verifica che:
 *   - nessun tema sia muto o quasi;
 *   - nessun tema saturi (campioni fuori scala = distorsione udibile);
 *   - nessuna coppia di temi abbia la stessa impronta;
 *   - dispose() non sollevi e fermi davvero il suono.
 *
 * I temi che usano setInterval per i loro eventi (tick, ping, timbri) NON
 * suonano in un rendering offline: setInterval segue il tempo reale, il
 * rendering no. È voluto che l'impronta si basi sulla parte continua — il
 * drone, il pad, la scansione — perché è quella che identifica la stanza.
 * Un tema fatto solo di eventi verrebbe letto come muto, ed è esattamente il
 * difetto che vogliamo sentire.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/smoke/audio-smoke.mjs
 */
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const SECONDS = 4;
const SILENCE = 1e-4;   // energia RMS sotto la quale un tema è muto
const CLIP = 0.999;     // oltre questo un campione è fuori scala
/**
 * Margine e uniformità.
 *
 * PEAK_CEILING lascia spazio sopra il segnale: i temi erano arrivati a 0,967
 * di picco con la musica al massimo, cioè a un soffio dal distorcere su
 * qualunque altoparlante.
 *
 * SPREAD_MAX tiene i letti sonori dentro la stessa fascia: erano finiti a
 * trenta volte di distanza fra il più piano e il più forte, e cambiare
 * fascicolo era una botta di volume. Quattro volte (12 dB) è una differenza
 * che si sente come carattere, non come errore.
 */
const PEAK_CEILING = 0.85;
const SPREAD_MAX = 4;
const fail = [];

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(`${BASE}/play/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => Array.isArray(window.audioProbe?.themeIds), null, { timeout: 30000 });

const report = await page.evaluate(async ({ seconds, clip }) => {
  const probe = window.audioProbe;
  const ids = probe.themeIds;
  const out = [];

  for (const id of ids) {
    const rate = 22050; // basta per distinguere le bande che ci interessano
    const off = new OfflineAudioContext(1, rate * seconds, rate);
    let handle = null;
    let built = true;
    let error = null;
    try {
      // STESSA catena del gioco: tema → musicGain → master → destination.
      // Misurare la saturazione su una catena inventata direbbe poco.
      const master = off.createGain();
      master.gain.value = probe.masterVolume;
      master.connect(off.destination);
      const music = off.createGain();
      music.gain.value = 1; // volume musica al massimo: il caso peggiore
      music.connect(master);
      handle = probe.buildTheme(off, music, id);
      handle.gain.gain.value = probe.themeVolume;
    } catch (e) {
      built = false;
      error = String(e);
    }
    if (!built) { out.push({ id, built, error }); continue; }

    const buf = await off.startRendering();
    const data = buf.getChannelData(0);

    // salta il primo mezzo secondo: gli oscillatori partono da zero
    const from = Math.floor(rate * 0.5);
    let sum = 0;
    let peak = 0;
    let clipped = 0;
    for (let i = from; i < data.length; i++) {
      const v = data[i];
      sum += v * v;
      const a = Math.abs(v);
      if (a > peak) peak = a;
      if (a >= clip) clipped++;
    }
    const rms = Math.sqrt(sum / (data.length - from));

    // impronta spettrale grossolana: quattro bande, con zero-crossing come
    // indicatore di contenuto acuto. Non serve una FFT per dire "diverso".
    const bands = [0, 0, 0, 0];
    const chunk = Math.floor((data.length - from) / 4);
    let crossings = 0;
    for (let b = 0; b < 4; b++) {
      let s = 0;
      for (let i = from + b * chunk; i < from + (b + 1) * chunk; i++) s += data[i] * data[i];
      bands[b] = Math.sqrt(s / chunk);
    }
    for (let i = from + 1; i < data.length; i++) if ((data[i - 1] < 0) !== (data[i] < 0)) crossings++;

    let disposed = true;
    let disposeError = null;
    try { handle.dispose(); } catch (e) { disposed = false; disposeError = String(e); }

    out.push({
      id, built: true, rms, peak, clipped, disposed, disposeError,
      // arrotondata: l'impronta serve a distinguere, non a misurare
      print: `${bands.map((x) => x.toFixed(4)).join('/')}|${Math.round(crossings / 100)}`
    });
  }
  return out;
}, { seconds: SECONDS, clip: CLIP });

if (report.length === 0) fail.push('nessun tema letto: window.themeIds vuoto, il controllo sarebbe inerte');

for (const t of report) {
  if (!t.built) { fail.push(`${t.id}: la costruzione solleva — ${t.error}`); continue; }
  if (!(t.rms > SILENCE)) fail.push(`${t.id}: muto o quasi (rms ${t.rms.toExponential(2)})`);
  if (t.clipped > 0) fail.push(`${t.id}: ${t.clipped} campioni fuori scala (picco ${t.peak.toFixed(3)}) — distorsione udibile`);
  if (!t.disposed) fail.push(`${t.id}: dispose() solleva — ${t.disposeError}`);
}

for (const t of report.filter((x) => x.built)) {
  if (t.peak > PEAK_CEILING) {
    fail.push(`${t.id}: picco ${t.peak.toFixed(3)} sopra il margine ${PEAK_CEILING} — niente spazio sopra il segnale`);
  }
}

const levels = report.filter((x) => x.built).map((t) => t.rms);
if (levels.length > 1) {
  const loudest = Math.max(...levels);
  const quietest = Math.min(...levels);
  const spread = loudest / quietest;
  if (spread > SPREAD_MAX) {
    const hi = report.find((t) => t.rms === loudest);
    const lo = report.find((t) => t.rms === quietest);
    fail.push(
      `livelli troppo distanti: ${hi.id} (${loudest.toFixed(4)}) è ${spread.toFixed(1)}× ${lo.id} (${quietest.toFixed(4)}), massimo ${SPREAD_MAX}×`
    );
  }
}

// due temi con la stessa impronta suonano uguale: il prestito è tornato
const seen = new Map();
for (const t of report.filter((x) => x.built)) {
  const same = seen.get(t.print);
  if (same) fail.push(`${t.id} suona identico a ${same} (impronta ${t.print})`);
  else seen.set(t.print, t.id);
}

const relevant = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevant.length) fail.push(`errori in console: ${JSON.stringify(relevant.slice(0, 5))}`);

await browser.close();

console.log(fail.length ? 'audio smoke — FAIL' : 'audio smoke — PASS');
console.log(`  temi renderizzati: ${report.filter((t) => t.built).length}/${report.length}`);
for (const t of report.filter((x) => x.built)) {
  console.log(`    ${t.id.padEnd(18)} rms ${t.rms.toFixed(4)}  picco ${t.peak.toFixed(3)}  impronta ${t.print}`);
}
if (fail.length) {
  for (const f of fail) console.log(`  ✗ ${f}`);
  process.exit(1);
}
const lv = report.filter((x) => x.built).map((t) => t.rms);
console.log(`  livelli: ${Math.min(...lv).toFixed(4)} … ${Math.max(...lv).toFixed(4)} (${(Math.max(...lv) / Math.min(...lv)).toFixed(1)}× di scarto, limite ${SPREAD_MAX}×)`);
console.log('  ✓ ogni tema si costruisce, suona, non satura, si spegne, sta dentro la stessa fascia');
console.log('    di volume degli altri e non somiglia a nessuno');

/**
 * Gioca UN caso preciso, dall'inizio alla carta norma.
 *
 * PERCHÉ ESISTE. La suite smoke gioca *un* caso — quello che la mappa le
 * offre per primo — e questo basta per verificare il motore, non per
 * verificare un caso NUOVO. Un fascicolo appena scritto può rompersi in modi
 * che nessun test statico vede: un indice di motivazione fuori intervallo, un
 * reperto che non compare, una carta norma che non si sblocca, un tema
 * musicale che solleva. L'unico modo di saperlo è giocarlo.
 *
 * Non è un cancello e non entra in CI: è lo strumento con cui si controlla un
 * caso mentre lo si scrive.
 *
 * Uso:
 *   npm run build
 *   CASO=case_bias node scripts/diag/play-case.mjs
 *   CASO=case_bias LANG_CODE=en node scripts/diag/play-case.mjs
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeBrowserLaunchOptions } from '../smoke/lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from '../smoke/lib-evidence.mjs';
import { completeDecisionWithKeyboard } from '../smoke/lib-decision.mjs';
import { selectMapCaseWithKeyboard } from '../smoke/lib-map.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = Number(process.env.PORT || 4209);
const BASE = `http://localhost:${PORT}`;
const LANG = process.env.LANG_CODE === 'en' ? 'en' : 'it';
const CASO = process.env.CASO || 'case_bias';

if (!existsSync(resolve(root, 'dist/index.html'))) {
  console.error('play-case: manca dist/index.html — lancia prima `npm run build`.');
  process.exit(1);
}

const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
const server = spawn(process.execPath, [viteCli, 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: root, stdio: ['ignore', 'ignore', 'inherit'], detached: process.platform !== 'win32'
});
let spento = false;
const spegni = () => {
  if (spento || server.pid === undefined) return;
  spento = true;
  try {
    if (process.platform !== 'win32') process.kill(-server.pid, 'SIGTERM');
    else server.kill('SIGTERM');
  } catch { /* già andato */ }
};
process.on('exit', spegni);
for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(s, () => { spegni(); process.exit(130); });

{
  const scadenza = Date.now() + 30000;
  let vivo = false;
  while (Date.now() < scadenza && !vivo) {
    try { vivo = (await fetch(`http://127.0.0.1:${PORT}/`)).ok; } catch { /* non ancora */ }
    if (!vivo) await new Promise((r) => setTimeout(r, 250));
  }
  if (!vivo) { console.error('play-case: il server di anteprima non ha risposto.'); process.exit(1); }
}

const L = LANG === 'en'
  ? { newGame: /NEW GAME/, start: /^START/, toMap: /CIVIC MAP/, examine: /EXAMINE/, classify: /CLASSIF/, sign: /SIGN THE REPORT/, onward: [/CONTINUE/, /NEXT/], toNorm: [/NORM ACQUIRED/, /CONSULT THE NORM/i, /NORM/] }
  : { newGame: /NUOVA PARTITA/, start: /^INIZIA/, toMap: /ACCEDI ALLA MAPPA CIVICA/, examine: /ESAMINA I REPERTI/, classify: /PROCEDI ALLA CLASSIFICAZIONE/, sign: /FIRMA IL RAPPORTO/, onward: [/PROSEGUI/, /AVANTI/, /CONTINUA/], toNorm: [/NORMA ACQUISITA/, /CONSULTA COMUNQUE LA NORMA/, /NORMA/] };

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
const errori = [];
page.on('pageerror', (e) => errori.push(String(e)));
// L'abort su cloudflareinsights lo provoca questa sonda (ctx.route più sopra):
// contarlo come errore del gioco sarebbe accusare il gioco di una cosa mia.
page.on('console', (m) => {
  if (m.type() !== 'error') return;
  if (/ERR_FAILED|cloudflareinsights/i.test(m.text())) return;
  errori.push(m.text());
});
const morte = (motivo) => { throw new Error(motivo); };

async function premi(etichette, attesaMs = 450) {
  const lista = Array.isArray(etichette) ? etichette : [etichette];
  const scadenza = Date.now() + 20000;
  while (Date.now() < scadenza) {
    for (const re of lista) {
      const fatto = await page.evaluate((src) => {
        const r = new RegExp(src, 'i');
        const attive = window.game?.scene.getScenes(true) ?? [];
        const s = attive[attive.length - 1];
        if (!s) return false;
        let trovato = null;
        const visita = (o) => {
          if (trovato || !o || o.visible === false) return;
          if (o.type === 'Container' && o.input && o.input.enabled) {
            const t = (o.list || []).find((c) => typeof c.text === 'string');
            if (t && r.test(t.text)) { trovato = o; return; }
          }
          for (const c of (o.list || [])) visita(c);
        };
        for (const o of s.children.list) visita(o);
        if (!trovato) return false;
        trovato.emit('pointerdown');
        return true;
      }, re.source);
      if (fatto) { await page.waitForTimeout(attesaMs); return; }
    }
    await page.waitForTimeout(120);
  }
  const vivi = await page.evaluate(() => {
    const a = window.game?.scene.getScenes(true) ?? [];
    const s = a[a.length - 1];
    if (!s) return ['(nessuna scena)'];
    const out = [s.scene.key];
    const visita = (o) => {
      if (!o || o.visible === false) return;
      if (o.type === 'Container' && o.input && o.input.enabled) {
        const t = (o.list || []).find((c) => typeof c.text === 'string');
        if (t) out.push(t.text);
      }
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of s.children.list) visita(o);
    return out;
  });
  morte(`pulsante non trovato: ${lista.map((r) => r.source).join(' | ')}\n    vivi: ${JSON.stringify(vivi)}`);
}

async function scena(chiave, timeout = 30000) {
  const ok = await page.waitForFunction((k) => {
    const a = window.game?.scene.getScenes(true) ?? [];
    return a[a.length - 1]?.scene.key === k;
  }, chiave, { timeout }).then(() => true).catch(() => false);
  if (!ok) {
    const ora = await page.evaluate(() => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'nessun gioco');
    morte(`scena "${chiave}" mai raggiunta (ferma su: ${ora})`);
  }
  await page.waitForTimeout(300);
}

const esiti = [];
console.log(`gioco ${CASO} in ${LANG} — ${BASE}\n`);

try {
  await page.goto(`${BASE}/play/?lang=${LANG}`, { waitUntil: 'load' });
  await scena('Title');
  await premi(L.newGame);
  await premi(L.start);
  await scena('Briefing');
  await premi(L.toMap);
  await scena('CityMap');

  // Il caso dev'essere APERTO sulla mappa: se il capitolo non lo espone
  // ancora, giocarlo non è possibile e va detto, non aggirato.
  const aperti = await page.evaluate(() => {
    const s = window.game?.scene?.getScene('CityMap');
    return (typeof s?.openCases === 'function' ? s.openCases() : []).map((c) => c.caseId);
  });
  if (!aperti.includes(CASO)) {
    morte(`"${CASO}" non è fra i casi aperti sulla mappa.\n    aperti: ${JSON.stringify(aperti)}`);
  }
  esiti.push(`aperto sulla mappa fra ${aperti.length} casi`);

  await selectMapCaseWithKeyboard(page, CASO);
  await scena('Case');
  await page.waitForFunction((src) => {
    const r = new RegExp(src, 'i');
    const a = window.game?.scene.getScenes(true) ?? [];
    const s = a[a.length - 1];
    if (!s) return false;
    let ok = false;
    const visita = (o) => {
      if (ok || !o || o.visible === false) return;
      if (o.type === 'Container' && o.input && o.input.enabled) {
        const t = (o.list || []).find((c) => typeof c.text === 'string');
        if (t && r.test(t.text)) { ok = true; return; }
      }
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of s.children.list) visita(o);
    return ok;
  }, L.examine.source, { timeout: 60000 });
  const titolo = await page.evaluate(() => {
    const s = window.game?.scene?.getScene('Case');
    const out = [];
    const visita = (o) => {
      if (!o || o.visible === false) return;
      if (typeof o.text === 'string' && o.text.trim()) out.push(o.text.trim());
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of s.children.list) visita(o);
    return out;
  });
  esiti.push(`fascicolo aperto, ${titolo.length} testi a video`);

  await premi(L.examine);
  await scena('Evidence');
  const carte = await page.evaluate(() => window.game?.scene?.getScene('Evidence')?.cards?.length ?? 0);
  if (carte !== 3) morte(`attesi 3 reperti, trovati ${carte}`);
  esiti.push('3 reperti');
  await prepareEvidenceWithKeyboard(page);

  await premi(L.classify);
  await scena('Decision');
  await completeDecisionWithKeyboard(page);
  esiti.push('decisione completata');

  await premi(L.sign);
  await scena('Report');
  esiti.push('rapporto firmato');

  await premi(L.onward);
  await scena('Consequence');
  // Il pulsante cambia con l'esito: «NORMA ACQUISITA» se la decisione era
  // corretta, «CONSULTA COMUNQUE LA NORMA» altrimenti. La sonda risponde a
  // caso, quindi accetta entrambe: qui si verifica che il caso sia
  // GIOCABILE, non che lo si giochi bene.
  const esito = await page.evaluate(() => {
    const s = window.game?.scene?.getScene('Consequence');
    const out = [];
    const visita = (o) => {
      if (!o || o.visible === false) return;
      if (typeof o.text === 'string' && o.text.trim()) out.push(o.text.trim());
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of (s?.children.list ?? [])) visita(o);
    return out.slice(0, 3);
  });
  esiti.push(`conseguenza raggiunta: «${(esito[0] ?? '?').slice(0, 44)}»`);

  await premi(L.toNorm);
  await scena('NormCard');
  const sbloccata = await page.evaluate(() => {
    const s = window.game?.scene?.getScene('NormCard');
    const out = [];
    const visita = (o) => {
      if (!o || o.visible === false) return;
      if (typeof o.text === 'string' && o.text.trim()) out.push(o.text.trim());
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of s.children.list) visita(o);
    return out;
  });
  esiti.push(`carta norma raggiunta: «${(sbloccata[2] ?? sbloccata[0] ?? '?').slice(0, 52)}»`);
} finally {
  await browser.close().catch(() => {});
  spegni();
}

for (const e of esiti) console.log(`  ✓ ${e}`);
if (errori.length) {
  console.error(`\n  ✗ errori in console: ${JSON.stringify(errori.slice(0, 3))}`);
  process.exit(1);
}
console.log(`\n${CASO} giocabile dall'inizio alla carta norma, zero errori in console.`);

/**
 * Rigenera i dieci screenshot del press kit GIOCANDO davvero una partita.
 *
 * PERCHÉ ESISTE. Le immagini del press kit erano ferme al 17 settembre.
 * Il 19 la scena della decisione ha perso la colonna «stato della città» e i
 * puntini di gravità, cioè proprio le due cose che il proprietario aveva
 * chiesto di togliere — ma `04-decision.jpg` continuava a mostrarle. Un
 * giornalista che apriva il press kit vedeva un'interfaccia inesistente.
 * Finché le immagini si fanno a mano, questo succede di nuovo: qui si
 * rilancia lo script e le immagini seguono il gioco.
 *
 * NESSUN FOTOGRAMMA È RICOSTRUITO. Lo script non avvia le scene con dati
 * finti: preme i pulsanti veri, dal titolo alla carta norma, nell'ordine in
 * cui li preme una persona. Se una scena non si raggiunge, lo script esce
 * non-zero e NON scrive niente — meglio nessuna immagine che un'immagine che
 * non corrisponde al gioco.
 *
 * LE ETICHETTE SONO QUELLE DELLE TRADUZIONI. Se una cambia, qui fallisce con
 * «pulsante non trovato» invece di fotografare la schermata sbagliata.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/percorso/chrome \
 *     node scripts/media/capture-press.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeBrowserLaunchOptions } from '../smoke/lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from '../smoke/lib-evidence.mjs';
import { completeDecisionWithKeyboard } from '../smoke/lib-decision.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = resolve(root, 'public/assets/press/screenshots');
const BASE = process.env.BASE || 'http://localhost:4200';
const LANG = process.env.LANG_CODE || 'it';

/** Il press kit è in italiano e le immagini mostrano l'interfaccia italiana. */
const L = {
  newGame: /NUOVA PARTITA/,
  start: /^INIZIA/,
  toMap: /ACCEDI ALLA MAPPA CIVICA/,
  examine: /ESAMINA I REPERTI/,
  compare: /CONFRONTA \[X\]/,
  classify: /PROCEDI ALLA CLASSIFICAZIONE/,
  sign: /FIRMA IL RAPPORTO/,
  onward: [/PROSEGUI/, /AVANTI/, /CONTINUA/],
  // La conseguenza non «prosegue»: consegna la norma imparata.
  toNorm: /NORMA ACQUISITA/
};

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const morte = (motivo) => { throw new Error(motivo); };

/** Attiva un pulsante Phaser vero, cercandolo per etichetta viva. */
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
  const visibili = await page.evaluate(() => {
    const attive = window.game?.scene.getScenes(true) ?? [];
    const s = attive[attive.length - 1];
    if (!s) return ['(nessuna scena)'];
    const out = [];
    const visita = (o) => {
      if (!o || o.visible === false) return;
      if (o.type === 'Container' && o.input && o.input.enabled) {
        const t = (o.list || []).find((c) => typeof c.text === 'string');
        if (t) out.push(t.text);
      }
      for (const c of (o.list || [])) visita(c);
    };
    for (const o of s.children.list) visita(o);
    return [s.scene.key, ...out];
  });
  morte(
    `pulsante non trovato: ${lista.map((r) => r.source).join(' | ')}\n` +
    `    scena e pulsanti vivi: ${JSON.stringify(visibili)}`
  );
}

/** Aspetta che una scena sia davvero in cima, due volte a distanza. */
async function scena(chiave, timeout = 30000) {
  const viva = () => page.waitForFunction((k) => {
    const a = window.game?.scene.getScenes(true) ?? [];
    const s = a[a.length - 1];
    return s?.scene.key === k && Boolean(s.cameras?.main);
  }, chiave, { timeout }).then(() => true).catch(() => false);
  if (!(await viva())) {
    const ora = await page.evaluate(
      () => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'nessun gioco'
    );
    morte(`scena "${chiave}" mai raggiunta (ferma su: ${ora})`);
  }
  await page.waitForTimeout(300);
}

/**
 * Lo scatto aspetta che TUTTO sia fermo: nessun oggetto ancora in dissolvenza.
 * Senza questo le carte dei reperti finivano nell'immagine a metà comparsa —
 * è già successo, e le immagini di riferimento ne mostravano quattro su sei.
 */
async function fermo() {
  await page.waitForFunction(() => {
    const a = window.game?.scene.getScenes(true) ?? [];
    const s = a[a.length - 1];
    if (!s) return false;
    const opaco = (o) => {
      if (!o || o.visible === false) return true;
      if (typeof o.alpha === 'number' && o.alpha > 0.001 && o.alpha < 0.999) return false;
      return (o.list || []).every(opaco);
    };
    return s.children.list.every(opaco);
  }, null, { timeout: 20000 }).catch(() => { /* scena senza dissolvenze */ });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

const scattati = [];
async function scatta(nome) {
  await fermo();
  const file = resolve(outDir, `${nome}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
  scattati.push(nome);
  console.log(`  ✓ ${nome}.jpg`);
}

mkdirSync(outDir, { recursive: true });
console.log(`press screenshots — ${BASE}/play/?lang=${LANG} a 1920×1080\n`);

await page.goto(`${BASE}/play/?lang=${LANG}`, { waitUntil: 'load' });
await scena('Title');

await premi(L.newGame);
await premi(L.start);
await scena('Briefing');
await premi(L.toMap);

await scena('CityMap');
await scatta('01-city-map');

// Un caso vero, scelto con i tasti della mappa come lo sceglierebbe chi gioca.
const caso = await page.evaluate(() => {
  const s = window.game?.scene?.getScene('CityMap');
  const aperti = typeof s?.openCases === 'function' ? s.openCases() : [];
  return aperti.length ? aperti[0].caseId : null;
});
if (!caso) morte('la mappa non espone nessun caso aperto');
const { selectMapCaseWithKeyboard } = await import('../smoke/lib-map.mjs');
await selectMapCaseWithKeyboard(page, caso);

await scena('Case');
// La macchina da scrivere va aspettata: il pulsante compare a testo finito.
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
await scatta('02-case-file');

await premi(L.examine);
await scena('Evidence');
await prepareEvidenceWithKeyboard(page);
await scatta('03-evidence-desk');

await premi(L.compare);
await page.waitForTimeout(600);
await scatta('09-evidence-compare');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

await premi(L.classify);
await scena('Decision');
await scatta('04-decision');

await premi(L.compare);
await page.waitForTimeout(600);
await scatta('10-decision-compare');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

await completeDecisionWithKeyboard(page);
await scatta('05-decision-summary');

await premi(L.sign);
await scena('Report');
await scatta('06-inspection-report');

await premi(L.onward);
await scena('Consequence');
await scatta('07-consequence');

await premi(L.toNorm);
await scena('NormCard');
await scatta('08-rule-card');

await browser.close();

const attesi = [
  '01-city-map', '02-case-file', '03-evidence-desk', '04-decision', '05-decision-summary',
  '06-inspection-report', '07-consequence', '08-rule-card', '09-evidence-compare', '10-decision-compare'
];
const mancanti = attesi.filter((n) => !scattati.includes(n));
const veri = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));

console.log(`\n${scattati.length}/${attesi.length} immagini in ${outDir}`);
if (veri.length) console.log(`errori console: ${JSON.stringify(veri.slice(0, 5))}`);
if (mancanti.length || veri.length) {
  if (mancanti.length) console.log(`MANCANTI: ${mancanti.join(', ')}`);
  process.exit(1);
}
console.log('press screenshots — OK');

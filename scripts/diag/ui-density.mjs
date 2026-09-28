/**
 * Diagnosi misurabile della densità dell'interfaccia di gioco.
 *
 * PERCHÉ ESISTE. Chloé Pété (Media & Learning Association) ha riferito che
 * l'interfaccia può risultare *crowded* e che alcune schermate non sono sempre
 * immediatamente leggibili — voce MLA-01 di `docs/EXTERNAL_FEEDBACK_LEDGER.md`,
 * il primo e a oggi unico riscontro d'uso da una persona esterna. Nessuno dei
 * 1211 test automatici poteva produrre quella frase: verificano che le cose
 * funzionino, non che si capiscano.
 *
 * Questo script non corregge niente. Misura, perché «crowded» da solo non dice
 * QUALI schermate né QUANTO, e senza numeri una correzione è un gusto personale
 * che sostituisce un altro gusto personale. Il rischio concreto è tradurre
 * «crowded» in «togliamo funzioni», e la profondità investigativa è il valore
 * del gioco.
 *
 * COSA MISURA, E PERCHÉ PROPRIO QUESTO
 *
 *   blocchi di prosa       testi da 40+ caratteri visibili insieme. È la metrica
 *                          più vicina a «crowded»: le etichette non affaticano,
 *                          i paragrafi che competono sì.
 *   caratteri a video      somma dei caratteri visibili. Quanto c'è da leggere
 *                          prima di poter decidere.
 *   oggetti di testo       quanti Text visibili in tutto, etichette comprese.
 *   azioni disponibili     contenitori interattivi visibili, cioè quante cose
 *                          si possono premere in quel momento. Una decisione
 *                          primaria per volta è l'obiettivo; qui si vede quante
 *                          ce ne sono davvero.
 *   copertura              percentuale della superficie logica occupata da
 *                          CONTENUTO — testi e cose premibili — contata su una
 *                          griglia 128×72 e non sommando i rettangoli,
 *                          altrimenti le sovrapposizioni gonfiano il totale
 *                          oltre il 100%.
 *
 *                          La prima stesura contava qualunque oggetto e dava
 *                          100% su tutte e undici le schermate: marcava lo
 *                          sfondo a pieno schermo, che c'è sempre. Undici
 *                          numeri identici erano il campanello — una misura che
 *                          non distingue niente non è una misura. Ora gli
 *                          oggetti che coprono oltre il 90% in entrambe le
 *                          dimensioni sono esclusi per quello che sono: fondali.
 *   testi sovrapposti      coppie di testi DELLA STESSA SCENA i cui rettangoli
 *                          si intersecano. È il difetto che ha morso davvero:
 *                          il riepilogo laterale finiva sotto la scheda della
 *                          motivazione, cinquanta pixel dentro, e si è visto
 *                          solo da uno screenshot del proprietario.
 *
 *                          «Della stessa scena» non è un dettaglio: contando
 *                          fra scene diverse, un modale sopra la scena che
 *                          oscura risultava dodici sovrapposizioni, che è
 *                          esattamente come DEVE funzionare un modale. Quel
 *                          caso ora si conta a parte.
 *   corpo minimo           altezza in pixel logici del testo più piccolo
 *                          visibile. Da qui si ricava la dimensione reale a
 *                          ogni risoluzione.
 *
 * LA DENSITÀ NON CAMBIA CON LA RISOLUZIONE, E VA DETTO
 *
 * Il mondo logico è fisso a 1280×720 e la camera lo porta ai pixel veri dello
 * schermo. Ne segue che tutte le misure qui sopra sono IDENTICHE a 1920×1080 e
 * in 4K: cambia quanto è grande la stessa schermata, non quanto è piena. La
 * domanda «quanto è densa in 4K» non ha una risposta diversa da «quanto è densa
 * a 1080p»; quella che cambia è la LEGGIBILITÀ, cioè quanti pixel fisici tocca
 * il testo più piccolo. Per questo lo script gira a una risoluzione sola e poi
 * calcola il corpo minimo alle altre, invece di rifare dieci volte la stessa
 * misura e presentarla come se fossero dieci risultati.
 *
 * Uso:
 *   npm run build && node scripts/diag/ui-density.mjs
 *   (avvia e spegne da sé il server di anteprima, come smoke:all)
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokeBrowserLaunchOptions } from '../smoke/lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from '../smoke/lib-evidence.mjs';
import { completeDecisionWithKeyboard } from '../smoke/lib-decision.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = 4207;
const BASE = `http://localhost:${PORT}`;
const LANG = process.env.LANG_CODE === 'en' ? 'en' : 'it';
/** Il mondo logico del gioco. Non è la risoluzione di uscita. */
const MONDO = { w: 1280, h: 720 };
/** Un testo sotto questa soglia è un'etichetta, sopra è qualcosa da leggere. */
const SOGLIA_PROSA = 40;

if (!existsSync(resolve(root, 'dist/index.html'))) {
  console.error('ui-density: dist/index.html non c\'è — lancia prima `npm run build`.');
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

// Il server risponde prima di aprire il browser, o si aspetta invano.
{
  const scadenza = Date.now() + 30000;
  let vivo = false;
  while (Date.now() < scadenza && !vivo) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/`);
      vivo = r.ok;
    } catch { /* non ancora */ }
    if (!vivo) await new Promise((r) => setTimeout(r, 250));
  }
  if (!vivo) { console.error('ui-density: il server di anteprima non ha risposto.'); process.exit(1); }
}

const L = LANG === 'en'
  ? { newGame: /NEW GAME/, start: /^START/, toMap: /CIVIC MAP/, examine: /EXAMINE/, compare: /COMPARE \[X\]/, classify: /CLASSIF/, sign: /SIGN THE REPORT/, toNorm: /NORM ACQUIRED/ }
  : { newGame: /NUOVA PARTITA/, start: /^INIZIA/, toMap: /ACCEDI ALLA MAPPA CIVICA/, examine: /ESAMINA I REPERTI/, compare: /CONFRONTA \[X\]/, classify: /PROCEDI ALLA CLASSIFICAZIONE/, sign: /FIRMA IL RAPPORTO/, toNorm: /NORMA ACQUISITA/ };

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
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
  const vivi = await page.evaluate(() => {
    const attive = window.game?.scene.getScenes(true) ?? [];
    const s = attive[attive.length - 1];
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
    const s = a[a.length - 1];
    return s?.scene.key === k && Boolean(s.cameras?.main);
  }, chiave, { timeout }).then(() => true).catch(() => false);
  if (!ok) {
    const ora = await page.evaluate(() => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'nessun gioco');
    morte(`scena "${chiave}" mai raggiunta (ferma su: ${ora})`);
  }
  await page.waitForTimeout(350);
}

/**
 * La misura, dentro la pagina.
 *
 * Attraversa TUTTE le scene attive, non solo quella in cima: chi guarda lo
 * schermo vede la sovrapposizione, e una modale sopra una scena piena è
 * esattamente il caso in cui la densità conta. La copertura si conta su una
 * griglia invece di sommare le aree, perché sommando due pannelli sovrapposti
 * si arriva sopra il 100% e il numero smette di voler dire qualcosa.
 */
const misura = () => page.evaluate(({ MONDO, SOGLIA_PROSA }) => {
  const scene = (window.game?.scene.getScenes(true) ?? []);
  const COLONNE = 128, RIGHE = 72;
  const griglia = new Uint8Array(COLONNE * RIGHE);
  const testi = [];
  let azioni = 0, fondaliEsclusi = 0;

  const dentro = (v, min, max) => Math.max(min, Math.min(max, v));
  /** Un oggetto che copre quasi tutto in entrambe le dimensioni è un fondale. */
  const fondale = (b) => b.width >= MONDO.w * 0.9 && b.height >= MONDO.h * 0.9;
  /**
   * Ordine di disegno, e il velo del modale.
   *
   * Phaser disegna nell'ordine della lista, e i contenitori in ordine: il
   * contatore che cresce durante la visita È l'ordine di sovrapposizione. Serve
   * perché un modale nel gioco non è una scena a parte — è disegnato DENTRO la
   * scena dei reperti, sopra un velo che oscura quello che c'è sotto. Senza
   * questo, il testo velato veniva contato fra i caratteri a video e le sue
   * intersezioni col modale fra i difetti: dodici, su una schermata che a
   * occhio è pulita.
   */
  let ordine = 0;
  let veloA = -1; // ordine dell'ultimo velo trovato; -1 = nessuno
  const segna = (b) => {
    if (fondale(b)) { fondaliEsclusi++; return; }
    const c0 = Math.floor(dentro(b.x, 0, MONDO.w) / MONDO.w * COLONNE);
    const c1 = Math.ceil(dentro(b.x + b.width, 0, MONDO.w) / MONDO.w * COLONNE);
    const r0 = Math.floor(dentro(b.y, 0, MONDO.h) / MONDO.h * RIGHE);
    const r1 = Math.ceil(dentro(b.y + b.height, 0, MONDO.h) / MONDO.h * RIGHE);
    for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) griglia[r * COLONNE + c] = 1;
  };

  const visita = (o, scena) => {
    if (!o || o.visible === false || (typeof o.alpha === 'number' && o.alpha <= 0.02)) return;
    ordine++;
    const premibile = o.type === 'Container' && o.input && o.input.enabled;
    if (premibile) {
      azioni++;
      let b = null;
      try { b = o.getBounds(); } catch { b = null; }
      if (b && b.width > 1 && b.height > 1) segna(b);
    }
    if (typeof o.text === 'string' && o.text.trim() !== '') {
      let b = null;
      try { b = o.getBounds(); } catch { b = null; }
      if (b && b.width > 0 && b.height > 0) {
        testi.push({
          scena, ordine,
          testo: o.text.replace(/\s+/g, ' ').trim(),
          caratteri: o.text.replace(/\s+/g, ' ').trim().length,
          corpo: Number(String(o.style?.fontSize ?? '0').replace(/[^0-9.]/g, '')) || 0,
          x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height)
        });
        segna(b);
      }
      return;
    }
    // Un rettangolo quasi a pieno schermo e abbastanza opaco è il velo di un
    // modale: tutto ciò che è stato disegnato prima è coperto.
    if (!(o.list && o.list.length) && typeof o.getBounds === 'function') {
      let b = null;
      try { b = o.getBounds(); } catch { b = null; }
      if (b && fondale(b) && typeof o.alpha === 'number' && o.alpha >= 0.45) veloA = ordine;
    }
    for (const c of (o.list || [])) visita(c, scena);
  };

  for (const s of scene) for (const o of s.children.list) visita(o, s.scene.key);

  // Il testo sotto il velo non è a video: non si conta e non si accusa.
  const velati = testi.filter((t) => veloA >= 0 && t.ordine < veloA);
  const visibili = testi.filter((t) => !(veloA >= 0 && t.ordine < veloA));

  // Due TESTI della stessa scena sovrapposti sono sempre un difetto. Fra scene
  // diverse è un modale che oscura quella sotto, cioè il comportamento voluto:
  // si conta a parte e non si somma.
  let sovrapposti = 0, traScene = 0;
  const esempi = [];
  for (let i = 0; i < visibili.length; i++) {
    for (let j = i + 1; j < visibili.length; j++) {
      const a = visibili[i], b = visibili[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox <= 1 || oy <= 1) continue;
      if (a.scena !== b.scena) { traScene++; continue; }
      sovrapposti++;
      if (esempi.length < 4) esempi.push(`${a.testo.slice(0, 26)} ✕ ${b.testo.slice(0, 26)} (${ox}×${oy}px, ${a.scena})`);
    }
  }

  let celle = 0;
  for (const v of griglia) celle += v;
  const prosa = visibili.filter((t) => t.caratteri >= SOGLIA_PROSA);
  const corpi = visibili.map((t) => t.corpo).filter((n) => n > 0);

  return {
    scene: scene.map((s) => s.scene.key),
    oggettiTesto: visibili.length,
    testiVelati: velati.length,
    caratteriVelati: velati.reduce((n, t) => n + t.caratteri, 0),
    blocchiProsa: prosa.length,
    caratteri: visibili.reduce((n, t) => n + t.caratteri, 0),
    caratteriProsa: prosa.reduce((n, t) => n + t.caratteri, 0),
    azioni,
    copertura: Math.round(celle / griglia.length * 1000) / 10,
    fondaliEsclusi,
    testiSovrapposti: sovrapposti,
    sovrapposizioniTraScene: traScene,
    esempiSovrapposizione: esempi,
    corpoMinimo: corpi.length ? Math.min(...corpi) : 0,
    prosaPiuLunga: prosa.length ? Math.max(...prosa.map((t) => t.caratteri)) : 0,
    // L'inventario serve per NOMINARE il difetto: «troppo denso» non si
    // corregge, «questi sette blocchi competono» sì.
    inventarioProsa: prosa.map((t) => ({ corpo: t.corpo, caratteri: t.caratteri, inizio: t.testo.slice(0, 54) })),
    testiPiccoli: visibili.filter((t) => t.corpo > 0 && t.corpo <= 10)
      .map((t) => ({ corpo: t.corpo, caratteri: t.caratteri, inizio: t.testo.slice(0, 54) }))
  };
}, { MONDO, SOGLIA_PROSA });

const rilievi = [];
async function rileva(nome, nota = '') {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const m = await misura();
  rilievi.push({ nome, nota, ...m });
  console.log(
    `  ${nome.padEnd(26)} prosa ${String(m.blocchiProsa).padStart(2)} · car ${String(m.caratteri).padStart(5)}` +
    ` · azioni ${String(m.azioni).padStart(2)} · copertura ${String(m.copertura).padStart(5)}%` +
    ` · sovrapp ${String(m.testiSovrapposti).padStart(2)}` +
    ` · corpo min ${m.corpoMinimo}px${m.testiVelati ? ` · ${m.testiVelati} testi sotto velo (${m.caratteriVelati} car)` : ''}`
  );
}

console.log(`densità UI — ${BASE}/play/?lang=${LANG}, mondo logico ${MONDO.w}×${MONDO.h}\n`);

try {
  await page.goto(`${BASE}/play/?lang=${LANG}`, { waitUntil: 'load' });
  await scena('Title');
  await rileva('Title');

  await premi(L.newGame);
  await premi(L.start);
  await scena('Briefing');
  await rileva('Briefing');

  await premi(L.toMap);
  await scena('CityMap');
  await rileva('CityMap');

  const caso = await page.evaluate(() => {
    const s = window.game?.scene?.getScene('CityMap');
    const aperti = typeof s?.openCases === 'function' ? s.openCases() : [];
    return aperti.length ? aperti[0].caseId : null;
  });
  if (!caso) morte('la mappa non espone nessun caso aperto');
  const { selectMapCaseWithKeyboard } = await import('../smoke/lib-map.mjs');
  await selectMapCaseWithKeyboard(page, caso);

  await scena('Case');
  // La macchina da scrivere va aspettata: il pulsante compare a testo finito,
  // e misurare prima darebbe una schermata più vuota di quella che si vede.
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
  await rileva('Case (fascicolo)', 'a macchina da scrivere finita');

  await premi(L.examine);
  await scena('Evidence');
  await page.waitForFunction(() => {
    const c = window.game?.scene?.getScene('Evidence')?.cards ?? null;
    return Boolean(c && c.length && c.every((x) => x.alpha >= 0.999));
  }, null, { timeout: 20000 });
  await rileva('Evidence (carte chiuse)');
  await prepareEvidenceWithKeyboard(page);
  await rileva('Evidence (aperte, citate)');

  await premi(L.compare);
  await page.waitForTimeout(700);
  await rileva('Evidence + confronto', 'modale sopra la scena');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  await premi(L.classify);
  await scena('Decision');
  await rileva('Decision (primo passo)');

  await premi(L.compare);
  await page.waitForTimeout(700);
  await rileva('Decision + confronto', 'modale sopra la scena');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  await completeDecisionWithKeyboard(page);
  await rileva('Decision (riepilogo)');

  await premi(L.sign);
  await scena('Report');
  await rileva('Report');
} finally {
  await browser.close().catch(() => {});
  spegni();
}

// --- referto ------------------------------------------------------------
const peggio = (chiave) => [...rilievi].sort((a, b) => b[chiave] - a[chiave])[0];
const corpoMin = Math.min(...rilievi.map((r) => r.corpoMinimo).filter((n) => n > 0));

console.log('\n--- dove si concentra il carico ---');
console.log(`  più blocchi di prosa insieme   ${peggio('blocchiProsa').nome} (${peggio('blocchiProsa').blocchiProsa})`);
console.log(`  più caratteri a video          ${peggio('caratteri').nome} (${peggio('caratteri').caratteri})`);
console.log(`  più azioni disponibili         ${peggio('azioni').nome} (${peggio('azioni').azioni})`);
console.log(`  più superficie occupata        ${peggio('copertura').nome} (${peggio('copertura').copertura}%)`);
const sovr = peggio('testiSovrapposti');
console.log(`  più testi sovrapposti          ${sovr.nome} (${sovr.testiSovrapposti})`);
for (const e of sovr.esempiSovrapposizione) console.log(`      ${e}`);

console.log('\n--- leggibilità: la densità è la stessa a ogni risoluzione, il corpo no ---');
console.log(`  corpo minimo nel mondo logico: ${corpoMin}px su ${MONDO.h}px di altezza`);
for (const [nome, w, h, dpr] of [['1366×768', 1366, 768, 1], ['Full HD', 1920, 1080, 1], ['2560×1440', 2560, 1440, 1], ['4K', 3840, 2160, 1], ['MacBook @2x', 1440, 900, 2]]) {
  // FIT uniforme: la scala è il minore dei due rapporti, come fa Phaser.
  const s = Math.min(w / MONDO.w, h / MONDO.h);
  console.log(`  ${nome.padEnd(12)} scala ${s.toFixed(2)}× → ${(corpoMin * s).toFixed(1)}px CSS, ${(corpoMin * s * dpr).toFixed(1)}px fisici`);
}

const fuori = resolve(root, '.diag');
mkdirSync(fuori, { recursive: true });
const file = resolve(fuori, `ui-density-${LANG}.json`);
writeFileSync(file, JSON.stringify({ mondo: MONDO, sogliaProsa: SOGLIA_PROSA, lingua: LANG, rilievi }, null, 2));
console.log(`\nmisure complete in ${file.replace(root + '/', '')}`);

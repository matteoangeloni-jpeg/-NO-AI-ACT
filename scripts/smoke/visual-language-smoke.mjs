/**
 * VERIFICA A SCHERMO del linguaggio visivo (stati, identità normative,
 * carte, sigillo) — su due lingue, due impostazioni di movimento e tre
 * risoluzioni, compresa una ad alta densità.
 *
 * Perché esiste. Il resto del sistema è coperto da controlli che leggono il
 * sorgente: nomi, colori, misure dichiarate. Nessuno di quelli vede le tre
 * cose che si rompono davvero a schermo:
 *
 *   1. un GLIFO che il font non ha, e che esce come rettangolo vuoto —
 *      cioè uno dei tre segnali dello stato che sparisce in silenzio;
 *   2. un TESTO che esce dalla carta o che finisce addosso a un altro,
 *      perché due altezze fisse sono state decise in due punti diversi;
 *   3. un canvas renderizzato a meno pixel di quelli dello schermo.
 *
 * Tutte e tre sono capitate: la nota di contesto sotto «STATO DELLA CITTÀ»,
 * l'analisi del rapporto addosso alla calibrazione, e il canvas a 1280×720
 * scalato a schermo intero.
 *
 * Uso:
 *   BASE=http://localhost:4200 CHROMIUM_PATH=... node scripts/smoke/visual-language-smoke.mjs
 *
 * Le immagini finiscono in scripts/smoke/out/visual/ e non sono committate:
 * servono a chi guarda, non alla guardia.
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as pathResolve } from 'node:path';
import { worldToPageFn } from './lib-canvas-coords.mjs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceVisualState } from './lib-evidence.mjs';
import { selectMapCaseWithKeyboard } from './lib-map.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const root = pathResolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = pathResolve(root, 'scripts/smoke/out/visual');
mkdirSync(OUT, { recursive: true });
const fail = [];

/**
 * I glifi si LEGGONO dal sorgente del linguaggio, non si ricopiano qui:
 * un simbolo nuovo entra nella verifica il giorno che nasce.
 */
const readGlyphs = (file, re) => {
  const src = readFileSync(pathResolve(root, file), 'utf8');
  return [...src.matchAll(re)].map((m) => ({ nome: m[1], glifo: m[2] }));
};
const GLYPHS = [
  ...readGlyphs('src/game/assets/procedural/visualStates.ts', /^\s{2}(\w+):\s*\{\s*glyph:\s*'(.)'/gm),
  ...readGlyphs('src/game/assets/procedural/normIdentity.ts', /^\s{2}(\w+):\s*\{\s*glyph:\s*'(.)'/gm)
];
if (GLYPHS.length < 12) fail.push(`lettura dei glifi dal sorgente fallita: ${GLYPHS.length} trovati`);

const save = (v) => JSON.stringify({
  version: 1, indicators: { efficienza: 74, controllo: 50, diritti: 62, fiducia: 57 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  reducedMotion: v.reducedMotion, crtOverlay: false, language: v.lang, endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
});

const browser = await chromium.launch(smokeBrowserLaunchOptions());

/** Un giro completo: mappa → caso → reperti → decisione → rapporto → conseguenza. */
async function giro({ lang, reducedMotion, width, height, dpr, tag }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
  await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const screenshot = (suffix) => page.screenshot({ path: `${OUT}/${tag}-${suffix}.png`, timeout: 90000 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // la richiesta al beacon la interrompiamo noi, per non dipendere dalla
  // rete: il suo ERR_FAILED non è un errore del gioco
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/ERR_FAILED|cloudflareinsights/.test(t)) return;
    errors.push(t);
  });
  await page.addInitScript((s) => localStorage.setItem('no-ai-act-save-v1', s), save({ lang, reducedMotion }));
  await page.goto(`${BASE}/play/?lang=${lang}`, { waitUntil: 'load' });

  const toPage = (lx, ly) => page.evaluate(worldToPageFn, { x: lx, y: ly });
  const click = async (lx, ly, w = 260) => {
    const { x, y } = await toPage(lx, ly);
    await page.mouse.move(x, y); await page.waitForTimeout(30);
    await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(w);
  };
  const clickButton = async (reSrc, w = 300) => {
    const pos = await page.evaluate((src) => {
      const re = new RegExp(src, 'i');
      const scenes = window.game.scene.getScenes(true);
      const s = scenes[scenes.length - 1];
      let found = null;
      const visit = (o) => {
        if (found || !o || o.visible === false) return;
        if (o.type === 'Container' && o.input && o.input.enabled) {
          const t = (o.list || []).find((ch) => typeof ch.text === 'string');
          if (t && re.test(t.text)) { const b = o.getBounds(); found = { x: b.centerX, y: b.centerY }; return; }
        }
        for (const ch of (o.list || [])) visit(ch);
      };
      for (const o of s.children.list) visit(o);
      return found;
    }, reSrc);
    if (!pos) { fail.push(`[${tag}] pulsante non trovato: ${reSrc}`); return false; }
    await click(Math.round(pos.x), Math.round(pos.y), w);
    return true;
  };
  const waitScene = async (key, timeout = 25000) => {
    const ok = await page.waitForFunction((k) => {
      const g = window.game; if (!g) return false;
      const a = g.scene.getScenes(true);
      return a.length > 0 && a[a.length - 1].scene.key === k;
    }, key, { timeout }).then(() => true).catch(() => false);
    if (!ok) {
      const now = await page.evaluate(() => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'no game');
      fail.push(`[${tag}] la scena "${key}" non è mai diventata attiva (ferma su: ${now})`);
    }
    return ok;
  };

  /** Riquadri di tutti i testi della scena viva, in coordinate logiche. */
  const textBoxes = () => page.evaluate(() => {
    const scenes = window.game.scene.getScenes(true);
    const s = scenes[scenes.length - 1];
    const out = [];
    const visit = (o, depth) => {
      if (!o || o.visible === false) return;
      if (typeof o.text === 'string' && o.text.trim() !== '' && typeof o.getBounds === 'function') {
        const b = o.getBounds();
        out.push({ text: o.text.slice(0, 60), x: b.x, y: b.y, w: b.width, h: b.height, depth });
      }
      for (const ch of (o.list || [])) visit(ch, depth + 1);
    };
    for (const o of s.children.list) visit(o, 0);
    return out;
  });

  if (!(await waitScene('Title', 40000))) { await ctx.close(); return; }

  // --- 1. i glifi esistono davvero nel font del gioco
  /**
   * SI CONFRONTANO I PIXEL, NON LE LARGHEZZE.
   *
   * Il primo tentativo misurava `measureText(glifo).width` contro quella di
   * U+FFFF, che non è assegnato. In un font a larghezza fissa — e il gioco
   * usa solo monospace — OGNI carattere ha la stessa larghezza
   * d'avanzamento, compreso il rettangolo vuoto: il controllo dichiarava
   * introvabili tutti e quindici i glifi mentre gli screenshot li mostravano
   * disegnati. Una guardia che non può distinguere niente è peggio di
   * nessuna guardia, perché la si spegne.
   *
   * Qui si disegna il glifo su un canvas e si confronta l'IMMAGINE con
   * quella di U+FFFF e con il vuoto. Due glifi diversi che producono gli
   * stessi pixel sono lo stesso disegno, e un glifo che non produce pixel
   * non c'è.
   */
  const glifi = await page.evaluate((lista) => {
    const cv = document.createElement('canvas');
    cv.width = 48; cv.height = 48;
    const c = cv.getContext('2d', { willReadFrequently: true });
    const famiglia = getComputedStyle(document.body).fontFamily || 'monospace';
    const impronta = (ch) => {
      c.clearRect(0, 0, 48, 48);
      c.fillStyle = '#fff';
      c.font = `32px ${famiglia}`;
      c.textBaseline = 'middle';
      c.textAlign = 'center';
      c.fillText(ch, 24, 24);
      const d = c.getImageData(0, 0, 48, 48).data;
      let h = 2166136261, acceso = 0;
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] > 12) acceso += 1;
        h ^= d[i]; h = Math.imul(h, 16777619);
      }
      return { h: h >>> 0, acceso };
    };
    const notdef = impronta('\uFFFF');
    return lista.map((g) => {
      const imp = impronta(g.glifo);
      return { nome: g.nome, vuoto: imp.acceso < 8, comeNotdef: imp.h === notdef.h && notdef.acceso > 0, impronta: imp.h };
    });
  }, GLYPHS);

  const mancanti = glifi.filter((g) => g.vuoto || g.comeNotdef).map((g) => g.nome);
  if (mancanti.length > 0) fail.push(`[${tag}] glifi che il font non disegna: ${mancanti.join(', ')}`);

  // due glifi con la stessa immagine sono lo stesso segnale, anche se i
  // codepoint sono diversi: è il caso in cui il font sostituisce entrambi
  const perImmagine = new Map();
  for (const g of glifi) {
    if (g.vuoto) continue;
    const gemello = perImmagine.get(g.impronta);
    if (gemello) fail.push(`[${tag}] "${g.nome}" e "${gemello}" escono con lo stesso disegno`);
    else perImmagine.set(g.impronta, g.nome);
  }

  // --- 2. il canvas ha i pixel dello schermo
  const scala = await page.evaluate(() => {
    const cv = document.querySelector('canvas');
    const r = cv.getBoundingClientRect();
    return { back: cv.width, cssW: Math.round(r.width), dpr: window.devicePixelRatio };
  });
  const attesi = scala.cssW * scala.dpr;
  if (scala.back < attesi * 0.98) {
    fail.push(`[${tag}] canvas a ${scala.back}px per ${attesi}px di schermo: l'immagine viene ingrandita`);
  }

  await clickButton(lang === 'it' ? 'NUOVA PARTITA' : 'NEW GAME');
  await clickButton(lang === 'it' ? '^INIZIA' : '^START');
  await waitScene('Briefing');
  await click(640, 300, 300);
  await clickButton(lang === 'it' ? 'MAPPA CIVICA' : 'CIVIC MAP');
  if (!(await waitScene('CityMap'))) { await ctx.close(); return; }
  await screenshot('01-map');

  await selectMapCaseWithKeyboard(page, 'case_credito');
  if (!(await waitScene('Case'))) { await ctx.close(); return; }
  await click(640, 400, 300);
  await screenshot('02-case');

  await clickButton(lang === 'it' ? 'ESAMINA I REPERTI' : 'EXAMINE THE EXHIBITS');
  if (!(await waitScene('Evidence'))) { await ctx.close(); return; }
  await prepareEvidenceVisualState(page, [0, 1]);
  await screenshot('03-evidence');

  /**
   * FRA I REPERTI E LA DECISIONE C'È UN BIVIO.
   *
   * Alcuni casi hanno un evento imprevisto: `proceed()` manda a `Incident`
   * invece che a `Decision`. Questo giro apre sempre `case_credito`, che non
   * ne ha — e proprio per questo il controllo aspettava `Decision` e basta.
   *
   * In CI, e in un solo giro su sei (quello a densità doppia, dove il
   * disegno software è più lento), si è fermato su `Incident`: il caso
   * aperto non era quello atteso. Non so ancora perché, e una guardia che
   * assume il ramo felice non me lo dirà mai: accetta il bivio, lo
   * attraversa, e se fallisce dice QUALE caso stava giocando.
   */
  await clickButton(lang === 'it' ? 'PASSA ALLA CLASSIFICAZIONE|CLASSIFICA' : 'PROCEED TO CLASSIFICATION');
  const arrivo = await page.waitForFunction(() => {
    const attive = window.game?.scene.getScenes(true) ?? [];
    const k = attive.length ? attive[attive.length - 1].scene.key : '';
    return k === 'Decision' || k === 'Incident' ? k : false;
  }, undefined, { timeout: 25000 }).then((h) => h.jsonValue()).catch(() => null);

  if (arrivo === 'Incident') {
    // l'evento si chiude scegliendo: tasti 1..n, come i passi della decisione
    await page.keyboard.press('1');
  }
  if (!(await waitScene('Decision'))) {
    const caso = await page.evaluate(() => {
      const attive = window.game?.scene.getScenes(true) ?? [];
      const s = attive[attive.length - 1];
      return s?.caseData?.id ?? s?.caseData?.fileCode ?? 'ignoto';
    });
    fail.push(`[${tag}] bloccato prima della decisione, caso in gioco: ${caso}`);
    await ctx.close();
    return;
  }
  await page.waitForTimeout(400);
  await screenshot('04-decision');

  // --- 3. nella decisione, la nota di contesto non entra nella colonna della città
  const boxes = await textBoxes();
  const collisioni = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      // solo testi "di pari livello": un'etichetta dentro un pulsante sta
      // sopra il suo sfondo per costruzione, e non è una collisione
      if (a.depth !== b.depth) continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 6 && oy > 6) collisioni.push(`«${a.text}» × «${b.text}»`);
    }
  }
  if (collisioni.length > 0) fail.push(`[${tag}] testi sovrapposti nella decisione:\n    ${collisioni.join('\n    ')}`);

  await completeDecisionWithKeyboard(page);
  await page.waitForTimeout(300);
  await screenshot('05-summary');
  await page.keyboard.press('Enter');
  if (!(await waitScene('Report'))) { await ctx.close(); return; }
  await page.waitForTimeout(900);
  await screenshot('06-report');

  // --- 4. nel rapporto nessun testo esce dal bordo basso della carta
  const PAPER_BOTTOM = 640;
  const fuori = (await textBoxes()).filter((b) => b.y > 480 && b.y + b.h > PAPER_BOTTOM + 4 && b.y < PAPER_BOTTOM);
  if (fuori.length > 0) {
    fail.push(`[${tag}] testo oltre il bordo basso della carta (y=${PAPER_BOTTOM}):\n    ` +
      fuori.map((b) => `«${b.text}» finisce a y=${Math.round(b.y + b.h)}`).join('\n    '));
  }
  const rapporto = await textBoxes();
  const coll2 = [];
  for (let i = 0; i < rapporto.length; i++) {
    for (let j = i + 1; j < rapporto.length; j++) {
      const a = rapporto[i], b = rapporto[j];
      if (a.depth !== b.depth) continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 6 && oy > 6) coll2.push(`«${a.text}» × «${b.text}»`);
    }
  }
  if (coll2.length > 0) fail.push(`[${tag}] testi sovrapposti nel rapporto:\n    ${coll2.join('\n    ')}`);

  await clickButton(lang === 'it' ? 'PROSEGUI' : 'CONTINUE');
  if (await waitScene('Consequence')) {
    await page.waitForTimeout(1400);
    await screenshot('07-consequence');
    // la carta norma è l'unico posto in cui si vede l'identità normativa:
    // senza questo passo il distintivo delle categorie non lo guarda nessuno
    await click(640, 300, 200);
    await clickButton(lang === 'it' ? 'NORMA' : 'NORM', 500);
    if (await waitScene('NormCard', 12000)) {
      await page.waitForTimeout(900);
      await screenshot('08-normcard');
      const cartaNorma = await textBoxes();
      const scontri = [];
      for (let i = 0; i < cartaNorma.length; i++) {
        for (let j = i + 1; j < cartaNorma.length; j++) {
          const a = cartaNorma[i], b = cartaNorma[j];
          if (a.depth !== b.depth) continue;
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ox > 6 && oy > 6) scontri.push(`«${a.text}» × «${b.text}»`);
        }
      }
      if (scontri.length > 0) fail.push(`[${tag}] testi sovrapposti sulla carta norma:\n    ${scontri.join('\n    ')}`);
    }
  }

  if (errors.length > 0) fail.push(`[${tag}] errori in console: ${errors.slice(0, 3).join(' | ')}`);
  await ctx.close();
}

const MATRICE = [
  { tag: 'it-720',     lang: 'it', reducedMotion: false, width: 1280, height: 720, dpr: 1 },
  { tag: 'it-1080',    lang: 'it', reducedMotion: false, width: 1920, height: 1080, dpr: 1 },
  { tag: 'it-hidpi',   lang: 'it', reducedMotion: false, width: 1920, height: 1080, dpr: 2 },
  { tag: 'it-ridotto', lang: 'it', reducedMotion: true,  width: 1920, height: 1080, dpr: 1 },
  { tag: 'en-1080',    lang: 'en', reducedMotion: false, width: 1920, height: 1080, dpr: 1 },
  { tag: 'en-ridotto', lang: 'en', reducedMotion: true,  width: 1280, height: 720, dpr: 1 }
];

/** `ONLY=it-720` gira un solo caso: serve quando si sta correggendo una scena. */
const solo = process.env.ONLY ? process.env.ONLY.split(',') : null;
for (const v of MATRICE.filter((m) => !solo || solo.includes(m.tag))) {
  process.stdout.write(`  ${v.tag} (${v.width}×${v.height} @${v.dpr}x, ${v.lang}, movimento ${v.reducedMotion ? 'ridotto' : 'pieno'})\n`);
  await giro(v);
}

await browser.close();

if (fail.length > 0) {
  console.error('\nvisual language smoke — FAIL');
  for (const f of fail) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nvisual language smoke — PASS');
console.log(`  ${(solo ?? MATRICE).length} giri, immagini in ${OUT}`);

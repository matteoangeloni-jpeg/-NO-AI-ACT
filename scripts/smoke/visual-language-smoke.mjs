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

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

/** Un giro completo: mappa → caso → reperti → decisione → rapporto → conseguenza. */
async function giro({ lang, reducedMotion, width, height, dpr, tag }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
  await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
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
  const tofu = await page.evaluate((glifi) => {
    const c = document.createElement('canvas').getContext('2d');
    const famiglia = getComputedStyle(document.body).fontFamily || 'monospace';
    c.font = `20px ${famiglia}`;
    // U+FFFF non è assegnato: la sua larghezza È quella del rettangolo vuoto
    const notdef = c.measureText('￿').width;
    return glifi.filter((g) => Math.abs(c.measureText(g.glifo).width - notdef) < 0.01).map((g) => g.nome);
  }, GLYPHS);
  if (tofu.length > 0) fail.push(`[${tag}] glifi non disegnabili (escono come rettangolo vuoto): ${tofu.join(', ')}`);

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
  await page.screenshot({ path: `${OUT}/${tag}-01-map.png` });

  await click(Math.round(1280 * 0.40), Math.round(720 * 0.18), 300);
  if (!(await waitScene('Case'))) { await ctx.close(); return; }
  await click(640, 400, 300);
  await page.screenshot({ path: `${OUT}/${tag}-02-case.png` });

  await clickButton(lang === 'it' ? 'ESAMINA I REPERTI' : 'EXAMINE THE EXHIBITS');
  if (!(await waitScene('Evidence'))) { await ctx.close(); return; }
  const clues = [[250, 236], [640, 236], [1030, 236], [250, 482], [640, 482], [1030, 482]];
  for (const [x, y] of clues) await click(x, y, 80);
  await click(clues[3][0], clues[3][1], 80);
  await click(clues[4][0], clues[4][1], 80);
  await page.screenshot({ path: `${OUT}/${tag}-03-evidence.png` });

  await clickButton(lang === 'it' ? 'PASSA ALLA CLASSIFICAZIONE|CLASSIFICA' : 'PROCEED TO CLASSIFICATION');
  if (!(await waitScene('Decision'))) { await ctx.close(); return; }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${tag}-04-decision.png` });

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

  for (const k of ['1', '1', '2', '2']) { await page.keyboard.press(k); await page.waitForTimeout(500); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-05-summary.png` });
  await page.keyboard.press('Enter');
  if (!(await waitScene('Report'))) { await ctx.close(); return; }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${tag}-06-report.png` });

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
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${tag}-07-consequence.png` });
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

for (const v of MATRICE) {
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
console.log(`  ${MATRICE.length} giri, immagini in ${OUT}`);

/**
 * Cattura i fotogrammi REALI del ciclo di gioco per la homepage.
 *
 * La homepage descriveva il gioco invece di mostrarlo: una sola immagine
 * statica della mappa. Questo script gioca davvero un caso e fotografa i
 * quattro momenti del ciclo — fascicolo, reperti, classificazione, rapporto —
 * in italiano e in inglese. Nessun fotogramma è ricostruito o simulato: se il
 * gioco cambia, si rilancia lo script e le immagini seguono.
 *
 * Uso:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/media/capture-gameplay.mjs
 *
 * Esce non-zero se un fotogramma non è catturabile: meglio nessuna immagine
 * che un'immagine che non corrisponde al gioco.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = resolve(root, 'public/screenshots');
const BASE = process.env.BASE || 'http://localhost:4200';

/**
 * Etichette dei pulsanti per lingua. Se una cambia, lo script fallisce
 * rumorosamente ("button not found") invece di produrre l'immagine sbagliata.
 */
const LABELS = {
  it: { newGame: /NUOVA PARTITA/, toMap: /ACCEDI ALLA MAPPA CIVICA/, examine: /ESAMINA I REPERTI/, classify: /PROCEDI ALLA CLASSIFICAZIONE/ },
  en: { newGame: /NEW GAME/, toMap: /ACCESS THE CIVIC MAP/, examine: /EXAMINE THE EXHIBITS/, classify: /PROCEED TO CLASSIFICATION/ }
};

const fail = [];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
mkdirSync(outDir, { recursive: true });

for (const lang of ['it', 'en']) {
  const T = LABELS[lang];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  const page = await ctx.newPage();

  const click = async (x, y, w = 400) => {
    await page.mouse.move(x, y); await page.waitForTimeout(40);
    await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(w);
  };

  const clickButton = async (labelRe, w = 400) => {
    const pos = await page.evaluate((reSrc) => {
      const re = new RegExp(reSrc, 'i');
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
    }, labelRe.source);
    if (!pos) { fail.push(`${lang}: button not found ${labelRe}`); return false; }
    await click(Math.round(pos.x), Math.round(pos.y), w);
    return true;
  };

  const waitScene = async (key, timeout = 20000) => {
    const ok = await page.waitForFunction((k) => {
      const g = window.game; if (!g) return false;
      const a = g.scene.getScenes(true);
      return a.length > 0 && a[a.length - 1].scene.key === k;
    }, key, { timeout }).then(() => true).catch(() => false);
    if (!ok) fail.push(`${lang}: scene "${key}" mai attiva`);
    return ok;
  };

  /** Salva il fotogramma in JPEG e in WebP. Chromium è l'encoder: niente nuove dipendenze. */
  const shot = async (name) => {
    // Fuori dall'inquadratura la cornice del sito (link di ritorno, toggle di
    // lettura): appartiene alla pagina, non al gioco, e in una vetrina del
    // gameplay è rumore. Il canvas resta intatto.
    await page.addStyleTag({ content: '#site-return,#reading-toggle{visibility:hidden!important}' });
    // Gli avvisi di gioco si dissolvono da soli: aspettarli evita di
    // fotografare un toast tagliato dal bordo superiore.
    await page.waitForTimeout(2600);
    const png = await page.locator('canvas').screenshot();
    const b64 = png.toString('base64');
    const encoded = await page.evaluate(async ([data, q]) => {
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = `data:image/png;base64,${data}`; });
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return { webp: c.toDataURL('image/webp', q), jpg: c.toDataURL('image/jpeg', q) };
    }, [b64, 0.82]);
    for (const [ext, url] of Object.entries(encoded)) {
      if (!url.startsWith(`data:image/${ext === 'jpg' ? 'jpeg' : 'webp'}`)) {
        fail.push(`${lang}/${name}: codifica ${ext} non supportata dal browser`);
        continue;
      }
      writeFileSync(resolve(outDir, `${name}-${lang}.${ext}`), Buffer.from(url.split(',')[1], 'base64'));
    }
  };

  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${BASE}/play/?lang=${lang}`, { waitUntil: 'load' });
  if (!(await waitScene('Title', 30000))) { await ctx.close(); continue; }

  await clickButton(T.newGame, 300);
  await waitScene('Briefing');
  await click(640, 300, 500);            // salta la macchina da scrivere
  await clickButton(T.toMap, 300);       // la mappa: seconda opzione del briefing
  await waitScene('CityMap');
  // la mappa è già nell'hero: qui interessano le quattro fasi del ciclo

  await click(Math.round(1280 * 0.40), Math.round(720 * 0.18), 300); // caso welfare
  await waitScene('Case');
  await click(640, 400, 500);            // rivela il contesto del caso
  await shot('loop-2-file');

  await clickButton(T.examine, 300);
  await waitScene('Evidence');
  const clues = [[250, 236], [640, 236], [1030, 236], [250, 482], [640, 482], [1030, 482]];
  for (const [x, y] of clues) await click(x, y, 90);
  await click(clues[3][0], clues[3][1], 90);
  await click(clues[4][0], clues[4][1], 200);
  await shot('loop-3-evidence');

  await clickButton(T.classify, 300);
  await waitScene('Decision');
  await page.waitForTimeout(400);
  await shot('loop-4-decision');

  await page.keyboard.press('1'); await page.waitForTimeout(600);
  await page.keyboard.press('1'); await page.waitForTimeout(600);
  await page.keyboard.press('2'); await page.waitForTimeout(600);
  await page.keyboard.press('2');
  await waitScene('Report');
  await page.waitForTimeout(1200);
  await shot('loop-5-report');

  await ctx.close();
}
await browser.close();

if (fail.length) { console.error('CATTURA FALLITA:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log(`fotogrammi salvati in ${outDir}`);

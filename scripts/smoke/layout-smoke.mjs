/**
 * Opt-in responsive layout smoke for /play/ (NOT part of `npm test` — needs a
 * browser + served build). Verifies the safe-area hotfix: on TitleScene and
 * BriefingScene no interactive button is clipped by the canvas edge and no
 * button overlaps a standalone text (disclaimer / onboarding line), across
 * desktop, tablet and mobile viewports, in IT and EN.
 *
 * Buttons/labels are drawn on the Phaser canvas (not the DOM), so geometry is
 * read from the live game via `window.game`. Because the game uses Scale.FIT in
 * a fixed 1280×720 logical space, these logical bounds map 1:1 to what is shown
 * (letterboxed) at every viewport.
 *
 * Usage:
 *   npm run build && npx vite preview --port 4200
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/smoke/layout-smoke.mjs
 *
 * Exits non-zero on any failed check. Screenshots go to scripts/smoke/out/.
 */
import { chromium } from 'playwright';
import { boundsToPageSrc } from './lib-canvas-coords.mjs';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4200';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), 'out');
mkdirSync(OUT, { recursive: true });
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com'];
const EDGE = 4; // logical px an element must stay clear of each canvas edge
const fail = [];

// Landscape / wide-enough viewports where the mobile guard is hidden and the
// canvas UI is the active surface.
const CANVAS_VIEWPORTS = [
  { w: 1920, h: 1080 }, { w: 1792, h: 930 }, { w: 1440, h: 900 }, { w: 1366, h: 768 },
  { w: 1280, h: 720 }, { w: 1024, h: 768 }, { w: 768, h: 1024 }
];

/**
 * Turno concluso: il piano predefinito (turno di servizio, profilo "per
 * conto mio", 30 minuti) propone tre fascicoli, e qui sono tutti chiusi con
 * esiti diversi e lo stesso errore due volte — così il cruscotto ha da
 * mostrare tre righe, tre verdetti distinti e una tendenza.
 *
 * I tre identificativi NON sono scelti a caso: sono quelli che planGame
 * compone per quella combinazione, ed è la stessa che il gioco usa per
 * difetto. Se un giorno il piano cambia, il cruscotto mostrerà fascicoli
 * aperti e il controllo sulla completezza qui sotto lo dirà.
 */
const SEED_SHIFT_DONE = JSON.stringify({
  version: 2, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: { case_scoring: 'wrong', case_media: 'partial', case_biometria: 'correct' },
  caseReports: {
    case_scoring: { outcome: 'non_conforme', dominantError: 'prove', classification: 'alto_rischio', measure: 'audit', subject: 'deployer', motivationIndex: 0, citedClues: [] },
    case_media: { outcome: 'parziale', dominantError: 'prove', classification: 'trasparenza', measure: 'etichettare', subject: 'provider', motivationIndex: 1, citedClues: [] },
    case_biometria: { outcome: 'conforme', dominantError: null, classification: 'vietato', measure: 'blocco', subject: 'provider', motivationIndex: 0, citedClues: [] }
  },
  unlockedNorms: [], audioMuted: true, musicVolume: 0, reducedMotion: true, crtOverlay: false,
  language: 'it', endingId: null, briefingSeen: true, teacherMode: false, startedAt: 1,
  difficulty: 'base', mission: 'full', audience: 'casual', sessionMinutes: 30, gameMode: 'turno',
  caseDrafts: {}, caseMeta: {}, selfCheck: { pre: null, post: null }
});

const SEED_WITH_PROGRESS = JSON.stringify({
  version: 1, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: { case_credito: 'correct' }, unlockedNorms: [], audioMuted: true,
  musicVolume: 0, reducedMotion: true, crtOverlay: false, language: 'it', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const errors = [];
const hosts = new Set();

/** Snapshot of the active scene's top-level display objects, in logical coords. */
const sceneReportFn = () => {
  const g = window.game;
  if (!g) return null;
  const active = g.scene.getScenes(true);
  const scene = active[active.length - 1];
  if (!scene) return null;
  const items = [];
  for (const o of scene.children.list) {
    if (!o || typeof o.getBounds !== 'function') continue;
    const b = o.getBounds();
    let text = typeof o.text === 'string' ? o.text : null;
    if (text == null && Array.isArray(o.list)) {
      const t = o.list.find((c) => typeof c.text === 'string');
      text = t ? t.text : null;
    }
    items.push({
      type: o.type,
      interactive: !!(o.input && o.input.enabled),
      visible: o.visible !== false,
      alpha: o.alpha ?? 1,
      text,
      x: b.x, y: b.y, w: b.width, h: b.height
    });
  }
  // Il canvas è più grande del mondo (vedi RENDER_SCALE): i bounds degli
  // oggetti sono in unità di mondo, quindi il riquadro da rispettare è il
  // viewport della camera diviso il suo zoom, non la dimensione del canvas.
  const cam = scene.cameras.main;
  return { key: scene.scene.key, W: cam.width / cam.zoom, H: cam.height / cam.zoom, items };
};

const intersects = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * Il pannello "per chi giochi" è un Container: sceneReportFn guarda solo i
 * figli di primo livello della scena, quindi lo vedrebbe come un blocco
 * unico e non accorgerebbe di nulla al suo interno. Questo reporter scende
 * dentro il pannello aperto e restituisce i suoi elementi, che è dove
 * un'etichetta più lunga in una lingua può uscire dal bordo o finire sopra
 * il bottone successivo.
 */
const panelReportFn = () => {
  const g = window.game;
  if (!g) return null;
  const a = g.scene.getScenes(true);
  const scene = a[a.length - 1];
  if (!scene) return null;
  // Il pannello è l'ULTIMO container di primo livello: tutto ciò che sta
  // dietro appartiene al titolo e va ignorato, altrimenti ogni voce di menu
  // coperta dal pannello verrebbe segnalata come sovrapposizione.
  const top = scene.children.list;
  let panel = null;
  for (let i = top.length - 1; i >= 0; i--) {
    const o = top[i];
    if (Array.isArray(o?.list) && o.list.length > 2 && !(o.input && o.input.enabled)) { panel = o; break; }
  }
  const cam = scene.cameras.main;
  const VW = cam.width / cam.zoom;
  const VH = cam.height / cam.zoom;
  if (!panel) return { W: VW, H: VH, items: [] };

  const items = [];
  // Un elemento nascosto non si sovrappone a niente: il pannello ne tiene
  // di proposito (il profilo sparisce nelle modalità che non lo usano, il
  // riestrai esiste solo nell'ispezione a sorpresa). Senza questa
  // condizione il controllo segnalava incroci fra cose che nessuno vede —
  // e, peggio, avrebbe potuto dichiarare "pieno" un pannello vuoto.
  const walk = (list, shown) => {
    for (const o of list) {
      if (!o || typeof o.getBounds !== 'function') continue;
      const visible = shown && o.visible !== false && (o.alpha === undefined || o.alpha > 0.05);
      const b = o.getBounds();
      let text = typeof o.text === 'string' ? o.text : null;
      const interactive = !!(o.input && o.input.enabled);
      if (text == null && Array.isArray(o.list)) {
        const t = o.list.find((c) => typeof c.text === 'string');
        text = t ? t.text : null;
      }
      if (text != null && text.trim() !== '') {
        items.push({ text, interactive, visible, x: b.x, y: b.y, w: b.width, h: b.height });
      }
      if (Array.isArray(o.list) && !interactive) walk(o.list, visible);
    }
  };
  walk(panel.list, panel.visible !== false);
  return { W: VW, H: VH, items };
};

/** Apre un pannello del titolo cliccandone la voce di menu sul canvas. */
const openTitlePanel = (labelRe) => {
  const g = window.game;
  const a = g.scene.getScenes(true);
  const scene = a[a.length - 1];
  for (const o of scene.children.list) {
    const t = Array.isArray(o.list) ? o.list.find((c) => typeof c.text === 'string') : null;
    if (t && new RegExp(labelRe, 'i').test(t.text) && o.input && o.input.enabled) {
      o.emit('pointerdown');
      o.emit('pointerup');
      return t.text;
    }
  }
  return null;
};

/**
 * Il pannello scelto: niente fuori dal canvas, nessuna sovrapposizione fra i
 * suoi elementi. Il fondale a tutto schermo e il titolo che sta dietro sono
 * esclusi: coprono per definizione tutto il resto.
 */
function assertPanelLayout(report, ctx, mustContain) {
  if (!report) { fail.push(`${ctx}: no panel report`); return; }
  const { W, H, items } = report;
  const own = items.filter((i) => i.w < W * 0.9 && i.visible);
  if (own.length < 6) { fail.push(`${ctx}: panel looks empty (${own.length} items)`); return; }
  for (const needle of mustContain) {
    if (!own.some((i) => i.text.includes(needle))) fail.push(`${ctx}: missing "${needle}"`);
  }
  for (const el of own) {
    const label = `"${el.text.slice(0, 28)}"`;
    if (el.x < EDGE) fail.push(`${ctx}: ${label} clipped at left (x=${el.x.toFixed(0)})`);
    if (el.y < EDGE) fail.push(`${ctx}: ${label} clipped at top (y=${el.y.toFixed(0)})`);
    if (el.x + el.w > W - EDGE) fail.push(`${ctx}: ${label} clipped at right (${(el.x + el.w).toFixed(0)} > ${W - EDGE})`);
    if (el.y + el.h > H - EDGE) fail.push(`${ctx}: ${label} below bottom (${(el.y + el.h).toFixed(0)} > ${H - EDGE})`);
  }
  for (let i = 0; i < own.length; i++) {
    for (let j = i + 1; j < own.length; j++) {
      if (intersects(own[i], own[j])) {
        fail.push(`${ctx}: "${own[i].text.slice(0, 20)}" overlaps "${own[j].text.slice(0, 20)}"`);
      }
    }
  }
}

function assertSceneLayout(report, ctx, expectedKey) {
  if (!report) { fail.push(`${ctx}: no window.game / scene report`); return; }
  const { key, W, H, items } = report;
  if (expectedKey && key !== expectedKey) {
    fail.push(`${ctx}: active scene is "${key}", expected "${expectedKey}"`);
    return;
  }
  const buttons = items.filter((i) => i.type === 'Container' && i.interactive && i.visible);
  // standalone texts (exclude full-bleed backgrounds); only those actually shown
  const texts = items.filter((i) => i.type === 'Text' && i.w < 1100 && i.visible && i.alpha > 0.05);

  if (buttons.length === 0) fail.push(`${ctx} [${key}]: no interactive buttons found`);

  for (const el of [...buttons, ...texts]) {
    const label = el.text ? `"${String(el.text).slice(0, 24)}"` : el.type;
    if (el.y < EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at top (y=${el.y.toFixed(0)})`);
    if (el.y + el.h > H - EDGE) fail.push(`${ctx} [${key}]: ${label} clipped/below bottom (bottom=${(el.y + el.h).toFixed(0)} > ${H - EDGE})`);
    if (el.x < EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at left (x=${el.x.toFixed(0)})`);
    if (el.x + el.w > W - EDGE) fail.push(`${ctx} [${key}]: ${label} clipped at right (right=${(el.x + el.w).toFixed(0)} > ${W - EDGE})`);
  }
  for (const btn of buttons) {
    for (const txt of texts) {
      if (intersects(btn, txt)) {
        fail.push(`${ctx} [${key}]: button "${String(btn.text).slice(0, 20)}" overlaps text "${String(txt.text).slice(0, 24)}"`);
      }
    }
  }
  // Due bottoni sovrapposti: uno dei due è inarrivabile, e il controllo
  // sopra non poteva vederlo perché confronta solo bottoni con testi. È
  // successo davvero aggiungendo un terzo bottone alla colonna in alto a
  // destra della decisione, dove ce n'erano già due impilati.
  for (let i = 0; i < buttons.length; i++) {
    for (let j = i + 1; j < buttons.length; j++) {
      if (intersects(buttons[i], buttons[j])) {
        fail.push(
          `${ctx} [${key}]: button "${String(buttons[i].text).slice(0, 20)}" overlaps button "${String(buttons[j].text).slice(0, 20)}"`
        );
      }
    }
  }
}



/**
 * Porta il gioco su una scena FERMANDO quelle attive.
 *
 * `scene.start` da fuori avvia la scena chiesta ma non spegne quella che sta
 * già girando: restano due scene attive e chi legge "l'ultima attiva" trova
 * quella sbagliata. Succedeva qui: i controlli sulla decisione leggevano il
 * titolo e passavano annunciando una scena che non stavano guardando.
 */
async function switchScene(page, key, data) {
  await page.evaluate(({ key, data }) => {
    const g = window.game;
    for (const s of g.scene.scenes) if (s.scene.isActive() && s.scene.key !== 'Boot') s.scene.stop();
    g.scene.start(key, data);
  }, { key, data });
  await page.waitForFunction((key) => {
    const a = window.game?.scene?.getScenes(true) ?? [];
    return a.length > 0 && a[a.length - 1].scene.key === key;
  }, key, { timeout: 8000 });
  await page.waitForTimeout(400);
}

/**
 * CONTORNO DELLA PAGINA CONTRO PULSANTI DEL CANVAS.
 *
 * Il link di ritorno al sito e il pulsante del testo schermata sono elementi
 * del documento, fissi agli angoli, disegnati SOPRA il canvas. Il canvas è
 * centrato e scalato: dove cadono i suoi angoli dipende dalla finestra.
 * Quando le proporzioni della finestra coincidono con quelle del gioco i due
 * si toccano, e nella scena della decisione "Rivedi contesto" finiva
 * letteralmente sotto "↩ no-ai-act.eu" — un pulsante coperto da un link.
 *
 * Nessun controllo in unità logiche poteva vederlo: i due sistemi di
 * coordinate sono diversi. Qui si confrontano in pixel della pagina, che è
 * l'unico posto dove i due esistono insieme. Il 1280×720 dell'elenco dei
 * viewport è il caso che fallisce per primo, perché è quello in cui il
 * canvas riempie la finestra.
 */
function chromeOverlapFn() {
  /* eslint-disable no-undef */
  const g = window.game;
  const s = g?.scene?.scenes?.find((x) => x.scene.isActive() && x.scene.key !== 'Boot');
  if (!s) return null;
  // La conversione mondo→pagina è quella di lib-canvas-coords.mjs, iniettata
  // qui come sorgente: `page.evaluate` non può chiudere su un import.
  const toPage = boundsToPage;

  const buttons = [];
  const walk = (list) => {
    for (const o of list) {
      if (o.type !== 'Container') continue;
      if (o.input && o.visible) buttons.push({ label: String(o.list?.find((k) => k.type === 'Text')?.text ?? '?').slice(0, 24), ...toPage(o) });
      else if (o.list) walk(o.list);
    }
  };
  walk(s.children.list);

  const chrome = [];
  for (const sel of ['#site-return', '#reading-toggle']) {
    const el = document.querySelector(sel);
    if (!el) continue;
    // offsetParent è null per definizione su un elemento position:fixed:
    // la presenza a schermo si legge dal rettangolo e dalla visibilità.
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    if (getComputedStyle(el).visibility === 'hidden') continue;
    chrome.push({ sel, x: b.left, y: b.top, w: b.width, h: b.height });
  }

  const hits = [];
  for (const b of buttons) {
    for (const ch of chrome) {
      if (b.x < ch.x + ch.w && ch.x < b.x + b.w && b.y < ch.y + ch.h && ch.y < b.y + b.h) {
        hits.push(`"${b.label}" sotto ${ch.sel}`);
      }
    }
  }
  return { scene: s.scene.key, buttons: buttons.length, chrome: chrome.length, hits };
}

/**
 * `page.evaluate` serializza la funzione e la esegue in un contesto che non
 * conosce i nostri import: la conversione mondo→pagina va portata dentro
 * come sorgente. Si compone qui una volta sola.
 */
const chromeOverlapSrc = `(() => { ${boundsToPageSrc}\n return (${chromeOverlapFn.toString()})(); })()`;

function assertNoChromeOverlap(report, ctx) {
  if (!report) { fail.push(`${ctx}: nessun report di sovrapposizione col contorno`); return; }
  if (report.buttons === 0) { fail.push(`${ctx} [${report.scene}]: nessun pulsante letto, il controllo sarebbe inerte`); return; }
  if (report.chrome === 0) { fail.push(`${ctx} [${report.scene}]: contorno della pagina non trovato, il controllo sarebbe inerte`); return; }
  for (const h of report.hits) fail.push(`${ctx} [${report.scene}]: ${h}`);
}

/**
 * Porta la decisione fino al riepilogo (passo 5) e restituisce la geometria
 * della scena. È l'unica schermata del gioco costruita da una sequenza di
 * scelte, quindi l'unico modo di guardarla è giocarla: qui si è già
 * sovrapposto l'avviso sulla firma alla fila della fiducia dichiarata, in
 * entrambe le lingue, e nessun controllo statico poteva accorgersene.
 */
async function gotoDecisionSummary(page) {
  await page.evaluate(() => window.game.scene.start('Decision', { caseId: 'case_scoring', citedClues: [0, 1] }));
  await page.waitForFunction(() => {
    const a = window.game?.scene?.getScenes(true);
    return a && a.length && a[a.length - 1].scene.key === 'Decision';
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  return page;
}

/** Avanza di quattro scelte, dal primo passo al riepilogo. */
async function advanceToSummary(page) {
  for (const k of ['1', '1', '2', '2']) {
    await page.keyboard.press(k);
    await page.waitForTimeout(650);
  }
  await page.waitForTimeout(400);
}

/**
 * Porta il gioco alla schermata del titolo.
 *
 * Aspettava nove secondi fissi prima di controllare, e il controllo che
 * seguiva inghiottiva il proprio scadere con un .catch vuoto: se il titolo
 * non fosse mai arrivato, le verifiche sarebbero girate su una schermata
 * qualsiasi dichiarando PASS. Ora attende la condizione — più veloce, perché
 * il preload dura molto meno di nove secondi, e soprattutto onesto, perché
 * se non arriva lo dice invece di proseguire al buio.
 */
async function bootTitle(page, lang, ctx) {
  await page.addInitScript((seed) => localStorage.setItem('no-ai-act-save-v1', seed), SEED_WITH_PROGRESS);
  await page.goto(`${BASE}/play/?lang=${lang}`, { waitUntil: 'load' });
  try {
    await page.waitForFunction(() => {
      const g = window.game; if (!g) return false;
      const a = g.scene.getScenes(true);
      return a.some((s) => s.scene.key === 'Title');
    }, { timeout: 40000 });
  } catch {
    fail.push(`${ctx}: la schermata del titolo non è mai arrivata`);
    return false;
  }
  await page.waitForTimeout(300);
  return true;
}

async function gotoBriefing(page) {
  // reducedMotion is seeded, so BriefingScene reveals the CTA + onboarding line
  // synchronously on create — no canvas click needed (a click risks hitting the
  // CTA and advancing to CityMap). Just start it and wait for the CTA to show.
  await page.evaluate(() => window.game.scene.start('Briefing'));
  await page.waitForFunction(() => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true); const s = a[a.length - 1];
    if (!s || s.scene.key !== 'Briefing') return false;
    return s.children.list.some((o) => o.type === 'Container' && o.input && o.input.enabled && o.visible);
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(200);
}

// ---- canvas viewports: Title + Briefing geometry (IT everywhere, EN once) ----
for (const vp of CANVAS_VIEWPORTS) {
  for (const lang of vp.w === 1792 ? ['it', 'en'] : ['it']) {
    const ctx = `${vp.w}x${vp.h} ${lang}`;
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    // Hermetic run: abort the pre-existing shell beacon (see gameplay-smoke.mjs).
    await context.route(/cloudflareinsights\.com/, (r) => r.abort());
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`[${ctx}] ${String(e)}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${ctx}] ${m.text()}`); });
    page.on('request', (r) => { try { hosts.add(new URL(r.url()).host); } catch { /* ignore */ } });

    const booted = await bootTitle(page, lang, ctx);
    if (!booted) {
      await context.close();
      continue;
    }
    assertSceneLayout(await page.evaluate(sceneReportFn), `${ctx} Title`, 'Title');
    assertNoChromeOverlap(await page.evaluate(chromeOverlapSrc), `${ctx} Title`);
    await page.screenshot({ path: `${OUT}/title-${vp.w}x${vp.h}-${lang}.png` });

    // La decisione va guardata a OGNI viewport, non solo in quello dei
    // controlli profondi: la sovrapposizione col contorno della pagina
    // dipende dalle proporzioni della finestra, e compare per prima dove il
    // canvas la riempie tutta (1280×720). Costa una sola start di scena.
    await switchScene(page, 'Decision', { caseId: 'case_scoring', citedClues: [0, 1] });
    assertNoChromeOverlap(await page.evaluate(chromeOverlapSrc), `${ctx} Decision`);
    await switchScene(page, 'Title');

    // Pannello e riepilogo si controllano su UN solo viewport per lingua.
    // Il gioco disegna in uno spazio logico fisso 1280×720 con Scale.FIT: la
    // geometria della scena è identica a ogni dimensione di finestra, e ciò
    // che cambia col viewport — il fit del canvas — è già coperto dai
    // controlli su Title e Briefing qui sopra. Ripeterli otto volte
    // allungherebbe il gate di minuti senza verificare nulla di nuovo.
    const deepChecks = vp.w === 1792;

    // pannello NUOVA PARTITA: modalità, profilo, durata e riga di riepilogo
    const opened = deepChecks ? await page.evaluate(openTitlePanel, 'NUOVA PARTITA|NEW GAME') : 'skipped';
    if (!opened) {
      fail.push(`${ctx}: new-game entry not found on Title`);
    } else if (opened !== 'skipped') {
      await page.waitForTimeout(400);
      assertPanelLayout(
        await page.evaluate(panelReportFn),
        `${ctx} New game`,
        lang === 'en' ? ['MODE:', 'PROFILE:', 'LENGTH:', 'case file'] : ['MODALITÀ:', 'PROFILO:', 'DURATA:', 'fascicol']
      );
      await page.screenshot({ path: `${OUT}/newgame-${vp.w}x${vp.h}-${lang}.png` });
      await page.evaluate(() => window.game.scene.start('Title'));
      await page.waitForTimeout(300);
    }

    await gotoBriefing(page);
    assertSceneLayout(await page.evaluate(sceneReportFn), `${ctx} Briefing`, 'Briefing');
    await page.screenshot({ path: `${OUT}/briefing-${vp.w}x${vp.h}-${lang}.png` });

    if (deepChecks) {
      // Primo passo della decisione: qui vivono i tre bottoni impilati in alto
      // a destra (norme, norma del caso, termini). Il terzo è finito sul
      // secondo appena aggiunto, in entrambe le lingue, e nulla se ne accorse.
      await gotoDecisionSummary(page);
      const step1 = await page.evaluate(sceneReportFn);
      assertSceneLayout(step1, `${ctx} Decision step 1`, 'Decision');

      /**
       * Riepilogo laterale: i reperti citati e le scelte già prese devono
       * essere leggibili SENZA lasciare la decisione. Prima bisognava
       * tenerli a mente, e i reperti erano a una scena di distanza.
       * I titoli non sono trascritti qui: si chiedono al gioco.
       */
      const headings = lang === 'en' ? ['CITED EXHIBITS', 'DECISION SO FAR'] : ['REPERTI CITATI', 'DECISIONE FINORA'];
      for (const h of headings) {
        if (!(step1?.items ?? []).some((i) => String(i.text || '').includes(h))) {
          fail.push(`${ctx} Decision step 1: manca "${h}" nel riepilogo laterale`);
        }
      }

      // riepilogo e firma: unica schermata che esiste solo dopo quattro scelte
      await advanceToSummary(page);
      const summary = await page.evaluate(sceneReportFn);
      const signed = lang === 'en' ? 'SIGN THE REPORT' : 'FIRMA IL RAPPORTO';
      if (!summary || !summary.items.some((i) => String(i.text || '').includes(signed))) {
        fail.push(`${ctx} Decision summary: passo di firma non raggiunto`);
      } else {
        assertSceneLayout(summary, `${ctx} Decision summary`, 'Decision');
        /**
         * Nel riepilogo finale la colonna laterale NON si ripete: sarebbe la
         * stessa cosa scritta due volte sulla stessa schermata.
         *
         * Il termine da cercare è "DECISIONE FINORA", non "REPERTI CITATI":
         * quest'ultimo è anche l'etichetta di una riga del riepilogo finale
         * stesso, e cercarlo faceva scattare il controllo su una schermata
         * corretta. Una guardia che grida sul comportamento giusto è peggio
         * di nessuna guardia.
         */
        const sidebarOnly = lang === 'en' ? 'DECISION SO FAR' : 'DECISIONE FINORA';
        if (summary.items.some((i) => String(i.text || '').includes(sidebarOnly))) {
          fail.push(`${ctx} Decision summary: il riepilogo laterale è ripetuto sopra il riepilogo finale`);
        }
        await page.screenshot({ path: `${OUT}/decision-summary-${vp.w}x${vp.h}-${lang}.png` });
      }
    }

    await context.close();
  }
}

// ---- portrait phones: mobile guard + dismissable fallback + no overflow ----
for (const vp of [{ w: 390, h: 844 }, { w: 360, h: 800 }]) {
  const tag = `${vp.w}x${vp.h}`;
  const mctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  await mctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  const mp = await mctx.newPage();
  mp.on('console', (m) => { if (m.type() === 'error') errors.push(`[${tag}] ${m.text()}`); });
  await mp.goto(`${BASE}/play/?lang=it`, { waitUntil: 'domcontentloaded' });
  await mp.waitForTimeout(2500);
  const guardShown = await mp.evaluate(() => {
    const el = document.getElementById('mobile-guard');
    return !!el && getComputedStyle(el).display !== 'none';
  });
  if (!guardShown) fail.push(`${tag}: mobile guard not shown in portrait`);
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail.push(`${tag}: horizontal overflow on /play/`);
  // clear, tested fallback (§11.4): "continue anyway" hides the guard and the
  // scaled canvas remains usable underneath
  const dismissed = await mp.evaluate(() => {
    const btn = document.querySelector('#mobile-guard .mg-continue');
    if (!btn) return false;
    btn.click();
    const el = document.getElementById('mobile-guard');
    return getComputedStyle(el).display === 'none' && !!document.querySelector('#game-container canvas');
  });
  if (!dismissed) fail.push(`${tag}: mobile-guard continue-anyway fallback broken`);
  await mp.screenshot({ path: `${OUT}/mobile-${tag}.png` });
  await mctx.close();
}

// ---- fine turno: il cruscotto si adatta al numero di fascicoli ----
//
// L'altezza del pannello e il passo delle righe NON sono fissi: con tre
// fascicoli il riquadro è basso, con otto arriva quasi ai pulsanti, e i
// riferimenti agli articoli vanno a capo di lunghezza diversa nelle due
// lingue. È proprio dove un passo costante faceva finire una riga sopra
// l'altra, quindi va guardato in due lingue e a due proporzioni di finestra.
for (const vp of [{ w: 1792, h: 930 }, { w: 1280, h: 720 }]) {
  for (const lang of vp.w === 1792 ? ['it', 'en'] : ['it']) {
    const ctx = `${vp.w}x${vp.h} ${lang} SessionEnd`;
    const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    await context.route(/cloudflareinsights\.com/, (r) => r.abort());
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`[${ctx}] ${String(e)}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${ctx}] ${m.text()}`); });
    page.on('request', (r) => { try { hosts.add(new URL(r.url()).host); } catch { /* ignore */ } });

    await page.addInitScript((seed) => localStorage.setItem('no-ai-act-save-v2', seed), SEED_SHIFT_DONE);
    await page.goto(`${BASE}/play/?lang=${lang}`, { waitUntil: 'load' });
    try {
      await page.waitForFunction(() => window.game?.scene?.getScenes(true).some((s) => s.scene.key === 'Title'), null, { timeout: 40000 });
    } catch {
      fail.push(`${ctx}: la schermata del titolo non è mai arrivata`);
      await context.close();
      continue;
    }
    await switchScene(page, 'SessionEnd');

    assertSceneLayout(await page.evaluate(sceneReportFn), ctx, 'SessionEnd');
    assertNoChromeOverlap(await page.evaluate(chromeOverlapSrc), ctx);

    /**
     * Il contenuto del cruscotto vive dentro un contenitore — è così che
     * viene centrato — e sceneReportFn guarda solo i figli di primo livello
     * della scena: da lì il cruscotto è un blocco unico e ogni controllo
     * sulle righe sarebbe cieco. panelReportFn scende dentro, ed è la stessa
     * lettura che serve per ritagli e sovrapposizioni riga per riga.
     */
    const inner = await page.evaluate(panelReportFn);
    assertPanelLayout(
      inner,
      ctx,
      lang === 'en' ? ['closed well', 'Articles touched'] : ['chiuso bene', 'Articoli toccati']
    );

    // il cruscotto deve dire qualcosa: tre righe di fascicolo e una tendenza
    const texts = (inner?.items ?? []).map((i) => String(i.text || ''));
    const expectedClosed = lang === 'en'
      ? ['COMPLIANT', 'PARTIALLY COMPLIANT', 'NON-COMPLIANT']
      : ['CONFORME', 'PARZIALMENTE CONFORME', 'NON CONFORME'];
    for (const verdict of expectedClosed) {
      if (!texts.some((t) => t.toUpperCase().includes(verdict))) {
        fail.push(`${ctx}: manca il verdetto "${verdict}" — il piano non è più quello atteso, o le righe non si disegnano`);
      }
    }
    const trend = lang === 'en' ? /same slip 2 times/i : /stesso scivolone 2 volte/i;
    if (!texts.some((t) => trend.test(t))) {
      fail.push(`${ctx}: la tendenza ricorrente non compare`);
    }
    // e non deve dichiarare fascicoli aperti: il turno è finito
    const openLine = lang === 'en' ? /left open/i : /rimast[oi] apert/i;
    if (texts.some((t) => openLine.test(t))) {
      fail.push(`${ctx}: dichiara fascicoli aperti su un turno che è concluso`);
    }

    await page.screenshot({ path: `${OUT}/session-end-${vp.w}x${vp.h}-${lang}.png` });
    await context.close();
  }
}

await browser.close();

// ---- privacy / stability assertions (shared with gameplay smoke) ----
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`console errors: ${JSON.stringify(relevantErrors.slice(0, 6))}`);
const externalHosts = [...hosts].filter((h) => !h.startsWith('localhost'));
const disallowed = externalHosts.filter((h) => !GAME_HOSTS_ALLOWED.some((a) => h.includes(a)));
if (disallowed.length) fail.push(`unexpected network host(s): ${JSON.stringify(disallowed)}`);

console.log('layout smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  external hosts:', JSON.stringify(externalHosts));
console.log('  console errors:', relevantErrors.length);
console.log('  screenshots:', OUT);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ Title + Briefing + new-game panel + decision (step 1 + summary) + fine turno\n    safe-area clean, desktop/tablet/mobile, IT + EN');

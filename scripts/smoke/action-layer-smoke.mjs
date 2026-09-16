/**
 * STRATO DELLE AZIONI — controllo del browser.
 *
 * Il gioco disegna i pulsanti sul canvas. Ogni pulsante disegnato espone
 * anche un <button> vero del documento, così il TAB, il fuoco visibile e gli
 * strumenti assistivi trovano qualcosa da premere. Questo controllo verifica
 * le tre cose che possono rompersi senza che nulla si veda a schermo.
 *
 *   1. ESPOSIZIONE — ogni pulsante disegnato e visibile ha il suo elemento,
 *      con la stessa etichetta e sopra lo stesso riquadro.
 *   2. INERZIA — con un pannello aperto, i pulsanti che stanno sotto non sono
 *      raggiungibili col TAB: il fuoco non deve uscire dal pannello.
 *   3. ATTIVAZIONE SINGOLA — un INVIO su un pulsante a fuoco compie UNA sola
 *      azione. Phaser ascolta la tastiera sulla finestra: senza fermare la
 *      propagazione, lo stesso tasto attivava il pulsante E il gestore
 *      globale della scena, che non sempre fa la stessa cosa (sulla carta
 *      norma partivano CityMap e Case insieme).
 *
 * L'elenco dei pulsanti NON è trascritto qui: si enumerano i contenitori che
 * il lato disegnato contrassegna (`uiButton`). Chiederlo allo strato delle
 * azioni renderebbe il controllo cieco proprio al difetto che cerca — un
 * pulsante che non si registra sparirebbe da entrambi i lati.
 *
 * Fuori da `npm test` (serve una build servita):
 *   BASE=http://localhost:4200 CHROMIUM_PATH=/path/to/chrome \
 *     node scripts/smoke/action-layer-smoke.mjs
 */
import { chromium } from 'playwright';
import { boundsToPageSrc } from './lib-canvas-coords.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
/** Tolleranza fra riquadro disegnato ed elemento, in pixel di pagina. */
const ALIGN_TOLERANCE_PX = 6;
const fail = [];
const errors = [];

const SEED = JSON.stringify({
  version: 2, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  reducedMotion: true, crtOverlay: false, language: 'it', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full', caseMeta: {}, selfCheck: { pre: null, post: null }
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

/**
 * I pulsanti disegnati della scena in cima, con etichetta, riquadro in pixel
 * di pagina e profondità efficace — la stessa che decide che cosa sta sopra
 * un pannello. Ricavata risalendo i contenitori, non dichiarata.
 */
const DRAWN_SRC = `${boundsToPageSrc}
  const visibleInTree = (o) => {
    if (!o.visible) return false;
    let n = o.parentContainer;
    while (n) { if (!n.visible) return false; n = n.parentContainer; }
    return true;
  };
  const effectiveDepth = (o) => {
    let best = o.depth; let n = o.parentContainer;
    while (n) { if (n.depth > best) best = n.depth; n = n.parentContainer; }
    return best;
  };
  const drawnButtons = () => {
    const out = [];
    const walk = (list) => {
      for (const o of list) {
        if (o.type === 'Container') {
          if (o.getData && o.getData('uiButton') && o.active && visibleInTree(o)) {
            const label = (o.list || []).find((k) => k.type === 'Text');
            out.push({ label: label ? label.text : '', rect: boundsToPage(o), depth: effectiveDepth(o) });
          }
          walk(o.list || []);
        }
      }
    };
    for (const s of window.game.scene.getScenes(true)) walk(s.children.list);
    return out;
  };
`;

/** Pulsanti del documento raggiungibili adesso. */
const exposed = () => page.evaluate(() => [...document.querySelectorAll('#action-layer .action-btn')]
  .filter((b) => !b.hidden)
  .map((b) => {
    const r = b.getBoundingClientRect();
    return { label: b.textContent ?? '', rect: { x: r.x, y: r.y, w: r.width, h: r.height }, disabled: b.disabled };
  }));

const drawn = () => page.evaluate(`(() => { ${DRAWN_SRC} return drawnButtons(); })()`);

async function waitScene(key, timeout = 20000) {
  await page.waitForFunction((k) => window.game?.scene.getScenes(true).some((s) => s.scene.key === k), key, { timeout })
    .catch(() => fail.push(`scena "${key}" non raggiunta`));
}

/** 1. ESPOSIZIONE: disegnato in cima ⊆ esposto, stessa etichetta, stesso posto. */
async function checkExposure(where) {
  const [d, e] = [await drawn(), await exposed()];
  const top = d.length ? Math.max(...d.map((b) => b.depth)) : 0;
  const front = d.filter((b) => b.depth >= top);
  for (const b of front) {
    const match = e.find((x) => x.label === b.label);
    if (!match) {
      fail.push(`${where}: il pulsante disegnato "${b.label}" non è esposto (esposti: ${JSON.stringify(e.map((x) => x.label))})`);
      continue;
    }
    const dx = Math.abs(match.rect.x - b.rect.x);
    const dy = Math.abs(match.rect.y - b.rect.y);
    const dw = Math.abs(match.rect.w - b.rect.w);
    const dh = Math.abs(match.rect.h - b.rect.h);
    if (Math.max(dx, dy, dw, dh) > ALIGN_TOLERANCE_PX) {
      fail.push(`${where}: "${b.label}" — l'anello di fuoco non sta sul pulsante (scarto ${Math.round(Math.max(dx, dy, dw, dh))}px)`);
    }
  }
  return { drawn: d, exposed: e, front };
}

await page.addInitScript((seed) => localStorage.setItem('no-ai-act-save-v2', seed), SEED);
await page.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });
await waitScene('Title', 40000);
await page.waitForTimeout(700);

const title = await checkExposure('titolo');
if (title.front.length === 0) fail.push('titolo: nessun pulsante disegnato trovato — il contrassegno del lato disegnato non arriva');

/** 2. INERZIA: aperto il pannello, dietro non resta niente da raggiungere. */
const behind = title.front.map((b) => b.label);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('#action-layer .action-btn')].filter((b) => !b.hidden);
  const start = btns.find((b) => /NUOVA PARTITA/i.test(b.textContent ?? ''));
  if (start) start.click();
});
await page.waitForTimeout(900);
const panel = await checkExposure('pannello nuova partita');
const leaked = (await exposed()).map((x) => x.label).filter((l) => behind.includes(l));
if (leaked.length) fail.push(`pannello: il TAB raggiunge ancora ciò che sta dietro: ${JSON.stringify(leaked)}`);
if (panel.front.length < 2) fail.push('pannello: nessun pulsante in primo piano — il confronto sull\'inerzia non prova niente');

// il TAB deve girare dentro il pannello e mai su un'etichetta di sfondo
const visited = [];
for (let i = 0; i < panel.front.length + 2; i++) {
  await page.keyboard.press('Tab');
  visited.push(await page.evaluate(() => document.activeElement?.textContent ?? ''));
}
const escaped = visited.filter((l) => behind.includes(l));
if (escaped.length) fail.push(`pannello: il fuoco è uscito dal pannello su ${JSON.stringify(escaped)}`);

/**
 * 4. NESSUN FANTASMA. Un pulsante distrutto deve sparire anche dal
 * documento. Si cancella da solo con l'evento DESTROY, che però è un
 * ascoltatore come gli altri: `removeAllListeners`, chiamato quando un
 * pulsante viene spento, lo portava via insieme a quelli del puntatore, e
 * il pulsante restava nel documento per sempre. Il conto degli elementi
 * dopo qualche apertura e chiusura del pannello lo rende visibile.
 */
const countEls = () => page.evaluate(() => document.querySelectorAll('#action-layer .action-btn').length);
const clickByLabel = async (re) => {
  await page.evaluate((r) => {
    const b = [...document.querySelectorAll('#action-layer .action-btn')]
      .filter((x) => !x.hidden)
      .find((x) => new RegExp(r, 'i').test(x.textContent ?? ''));
    if (b) b.click();
  }, re);
  await page.waitForTimeout(600);
};
await clickByLabel('CHIUDI');
const baseline = await countEls();
for (let round = 0; round < 3; round++) {
  await clickByLabel('NUOVA PARTITA');
  // scorrere le modalità: il ripasso può SPEGNERE il pulsante di avvio, ed è
  // proprio lo spegnimento a portarsi via l'ascoltatore di DESTROY
  for (let k = 0; k < 4; k++) await clickByLabel('MODALIT');
  await clickByLabel('CHIUDI');
}
const after = await countEls();
if (after > baseline) {
  fail.push(`fantasmi: da ${baseline} a ${after} elementi dopo tre aperture del pannello — un pulsante distrutto non si cancella dal documento`);
}

/** 3. ATTIVAZIONE SINGOLA su una schermata dove pulsante e INVIO globale
 *  fanno cose DIVERSE: la carta norma. Un solo INVIO, una sola transizione. */
await page.evaluate(() => {
  const g = window.game;
  for (const s of g.scene.scenes) if (s.scene.isActive() && s.scene.key !== 'Boot') s.scene.stop();
  // un id inesistente qui non passa inosservato: NormSystem solleva
  g.scene.start('NormCard', { normId: 'norm_social_scoring', quality: 'correct' });
});
await waitScene('NormCard');
await page.waitForTimeout(900);
await checkExposure('carta norma');

// conto le transizioni di scena da un unico punto (il piano della scena),
// così una sola azione conta una sola volta
await page.evaluate(() => {
  window.__starts = [];
  const proto = Object.getPrototypeOf(window.game.scene.getScenes(true)[0].scene);
  if (!proto.__wrapped) {
    const orig = proto.start;
    proto.start = function (key, data) { window.__starts.push(key ?? this.key); return orig.call(this, key, data); };
    proto.__wrapped = true;
  }
});
const normButtons = (await exposed()).map((b) => b.label);
if (normButtons.length < 2) {
  fail.push(`carta norma: servono due pulsanti con azioni diverse per provare l'attivazione singola, trovati ${JSON.stringify(normButtons)}`);
} else {
  // il secondo pulsante NON è quello dell'INVIO globale: se entrambi partono
  // si vedono due transizioni
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('#action-layer .action-btn')].filter((x) => !x.hidden)[1];
    b.focus();
  });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);
  const starts = await page.evaluate(() => window.__starts);
  const active = await page.evaluate(() => window.game.scene.getScenes(true).map((s) => s.scene.key));
  if (starts.length !== 1) fail.push(`carta norma: un solo INVIO ha avviato ${starts.length} scene (${JSON.stringify(starts)}) — il tasto arriva sia al pulsante sia al gestore globale`);
  if (active.length !== 1) fail.push(`carta norma: dopo un solo INVIO restano ${active.length} scene vive (${JSON.stringify(active)})`);
}

await browser.close();

const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`errori in console: ${JSON.stringify(relevantErrors.slice(0, 5))}`);

console.log('action layer smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  pulsanti esposti sul titolo:', JSON.stringify(title.front.map((b) => b.label)));
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ ogni pulsante disegnato è un pulsante vero, allineato al suo riquadro');
console.log('  ✓ con un pannello aperto il TAB non esce su ciò che sta dietro');
console.log('  ✓ un INVIO su un pulsante a fuoco compie una sola azione');

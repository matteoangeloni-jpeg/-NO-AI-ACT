/**
 * Opt-in headless gameplay smoke for /play/ (NOT part of `npm test` — it needs
 * a browser and a served build, so it is kept out of the fast unit CI).
 *
 * What it verifies on a minimal representative flow:
 *   - /play/ boots the game with no console errors;
 *   - one case can be played to the inspection report + decision debrief;
 *   - the debrief exposes the internal "read more" link (opens a same-origin
 *     education page in a new tab);
 *   - the game makes NO gameplay network call (only the pre-existing shell
 *     Cloudflare beacon may appear);
 *   - su telefono (390px) e tablet verticale (768px) un caso si COMPLETA,
 *     senza overflow e senza elementi fuori dal canvas.
 *
 * Usage:
 *   1) build + serve the site:   npm run build && npx vite preview --port 4200
 *   2) run the smoke:            BASE=http://localhost:4200 \
 *        CHROMIUM_PATH=/path/to/chrome node scripts/smoke/gameplay-smoke.mjs
 *   (CHROMIUM_PATH is optional if Playwright's bundled Chromium is installed.)
 *
 * Exits non-zero on any failed check.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as pathResolve } from 'node:path';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { selectMapCaseWithKeyboard } from './lib-map.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com']; // pre-existing shell beacon only
const fail = [];

/**
 * I micro-tag dei reperti, letti dal dizionario del gioco invece che
 * trascritti: un tag nuovo entra nel controllo il giorno che nasce.
 */
const EVIDENCE_STANCES = (() => {
  const src = readFileSync(pathResolve(dirname(fileURLToPath(import.meta.url)), '../../src/game/i18n/it.ts'), 'utf8');
  const blocco = (chiave) => {
    const i = src.indexOf(`${chiave}: {`);
    return i < 0 ? '' : src.slice(i, src.indexOf('}', i));
  };
  const voci = (chiave) =>
    Object.fromEntries([...blocco(chiave).matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]));

  /**
   * DUE VOCABOLARI, NON UNO.
   *
   * «Prova decisiva» non è più una sfumatura come «minimizza» o
   * «contesto»: è uno STATO del reperto, e la scheda lo dice con il
   * distintivo del linguaggio comune — glifo, cornice e parola in
   * maiuscolo. Cercare solo la vecchia dicitura minuscola ha fatto fallire
   * questo controllo, che è esattamente quello che doveva fare: la parola
   * a schermo era cambiata.
   *
   * Si leggono entrambi gli elenchi dal dizionario e si confronta senza
   * distinguere maiuscole, così il controllo resta sul SIGNIFICATO
   * (il micro-tag è nascosto sulla busta chiusa e compare una volta aperta)
   * e non sulla forma tipografica di una singola etichetta.
   */
  const stances = voci('stances');
  const stati = voci('states');
  if (stati.prova_decisiva) stances.decisive_state = stati.prova_decisiva;
  return stances;
})();
/**
 * Quanto può durare, a orologio vero, il passaggio da un pulsante alla
 * schermata successiva.
 *
 * Il numero non è scelto a sentimento: con la rete di sicurezza la
 * transizione misura ~2,0 s nel caso peggiore di questo ambiente (canvas
 * 2880×1620, disegno software); senza, la dissolvenza guidata dai fotogrammi
 * ne chiede oltre cinque. 3,5 s sta in mezzo con margine da entrambe le
 * parti — e un primo tentativo a 6 s non distingueva niente, cioè era una
 * guardia che non poteva fallire.
 */
const TRANSITION_BUDGET_MS = 3500;

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const errors = [];
const hosts = new Set();

// ---- desktop: boot + play one case to the debrief ----
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
// Hermetic run: abort the pre-existing shell beacon so the smoke never depends
// on third-party network availability (on a networked runner the loaded beacon
// would phone home to a second host and skew the host observation).
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('request', (r) => hosts.add(new URL(r.url()).host));

// Activate a real Phaser Button by its live label. The mobile/tablet block
// below covers physical pointer coordinates; this desktop flow verifies the
// complete callback path without sampling a camera during scene swaps.
const clickButton = async (labelRe, w = 400) => {
  let activated = false;
  const deadline = Date.now() + 5000;
  while (!activated && Date.now() < deadline) {
    activated = await page.evaluate((reSrc) => {
      const re = new RegExp(reSrc, 'i');
      const scenes = window.game?.scene.getScenes(true) ?? [];
      const s = scenes[scenes.length - 1];
      if (!s) return false;
      let found = null;
      const visit = (o) => { // recursive: overlay buttons live inside containers
        if (found || !o || o.visible === false) return;
        if (o.type === 'Container' && o.input && o.input.enabled) {
          const t = (o.list || []).find((ch) => typeof ch.text === 'string');
          if (t && re.test(t.text)) { found = o; return; }
        }
        for (const ch of (o.list || [])) visit(ch);
      };
      for (const o of s.children.list) visit(o);
      if (!found) return false;
      found.emit('pointerdown');
      return true;
    }, labelRe.source);
    if (!activated) await page.waitForTimeout(100);
  }
  if (!activated) { fail.push(`button not found: ${labelRe}`); return; }
  await page.waitForTimeout(w);
};

// Scene transitions use 300ms camera fades that complete on their own clock;
// fixed sleeps are timing-fragile on slow/CI machines (a click can land one
// scene behind). Wait for the actual scene key instead of guessing durations.
const waitScene = async (key, timeout = 15000) => {
  const active = () => page.waitForFunction((k) => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true);
    const scene = a[a.length - 1];
    return scene?.scene.key === k && Boolean(scene.cameras?.main);
  }, key, { timeout }).then(() => true).catch(() => false);
  // A Phaser start/stop queue can expose the target for a single frame while
  // another transition is still being committed. Require it twice, with a
  // short real-time gap, before the smoke sends input to that scene.
  let ok = await active();
  if (ok) {
    await page.waitForTimeout(250);
    ok = await active();
  }
  if (!ok) {
    const now = await page.evaluate(() => window.game?.scene.getScenes(true).map((s) => s.scene.key).join(',') ?? 'no game');
    fail.push(`scene "${key}" never became active (stuck on: ${now})`);
  }
  return ok;
};

// EN, teacher mode off, no prior progress
await page.addInitScript(() => localStorage.setItem('no-ai-act-save-v1', JSON.stringify({
  version: 1, indicators: { efficienza: 50, controllo: 50, diritti: 50, fiducia: 50 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  // This block verifies the full functional path. Motion timing has its own
  // high-density budget test below, so keep transitions deterministic here.
  reducedMotion: true, crtOverlay: true, language: 'en', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
})));
await page.goto(`${BASE}/play/?lang=en`, { waitUntil: 'load' });
await waitScene('Title', 30000); // Phaser boot

// NUOVA PARTITA non avvia più al primo clic: apre la composizione della
// sessione (modalità, profilo, durata) e INIZIA fa partire il piano scelto.
// Due clic invece di uno, ed è il punto: la durata scelta adesso conta.
await clickButton(/NEW GAME/, 400);
await clickButton(/^START/, 400);
await waitScene('Briefing');
await clickButton(/ACCESS THE CIVIC MAP/, 300);
await waitScene('CityMap');
// Select welfare through the map's real keyboard navigation. Each move waits
// for the scene state, avoiding dropped arrows on slower software renderers.
await selectMapCaseWithKeyboard(page, 'case_credito');
await page.waitForTimeout(300);
await waitScene('Case');
await clickButton(/EXAMINE THE EXHIBITS/, 300);
await waitScene('Evidence');
await prepareEvidenceWithKeyboard(page, { citeIndices: [0, 1] });
await clickButton(/PROCEED TO CLASSIFICATION/, 300);
await waitScene('Decision');
await page.keyboard.press('1'); await page.waitForTimeout(600); // classification
await page.keyboard.press('1'); await page.waitForTimeout(600); // measure
await page.keyboard.press('2'); await page.waitForTimeout(600); // subject
await page.keyboard.press('2'); await page.waitForTimeout(600); // motivation -> summary
await page.keyboard.press('Enter');                             // sign -> report
await waitScene('Report');
await page.waitForTimeout(800); // let the report body render

const reportOk = await page.evaluate(() => document.querySelector('canvas') !== null);
if (!reportOk) fail.push('no game canvas at report stage');

await clickButton(/DECISION DEBRIEF/, 700); // open decision debrief overlay
await clickButton(/RULE AND REFLECTION/, 300);
// The link opens with rel=noopener, so newer Playwright does not emit it as a
// 'popup' of the opener page — listen for any new page in the context instead.
const [popup] = await Promise.all([
  ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null),
  clickButton(/Read more on the site/, 500) // "read more" internal link
]);
if (!popup) fail.push('decision debrief "read more" internal link did not open');
else {
  const u = new URL(popup.url());
  if (u.host.startsWith('localhost') || u.host.includes('no-ai-act')) {
    // internal (localhost during smoke, or the production host) — OK
  } else fail.push(`"read more" opened a non-internal host: ${u.host}`);
  await popup.close();
}
await ctx.close();

// Touch completion moved to mobile-ux-smoke.mjs: native responsive controls,
// three languages, all phone sizes, review, rotation and enlarged text.

// ---- la transizione fra schermate non può far sembrare il gioco bloccato ----
//
// Le dissolvenze di Phaser avanzano per FOTOGRAMMI, non a orologio: sono
// diciotto passi da 16,67 ms nominali. Su una macchina che ne disegna tre al
// secondo quei 300 ms diventano sei secondi reali, durante i quali la
// schermata resta ferma e il pulsante appena premuto sembra non aver fatto
// niente. Misurato qui: prima della rete di sicurezza, INIZIA a 1440×900 con
// densità 2 non arrivava MAI al briefing entro tre secondi; ora ci arriva.
//
// Il controllo gira a densità 2, dove il canvas è il più grande e questo
// ambiente il più lento: è il caso peggiore, ed è quello che deve reggere.
{
  const hi = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await hi.route(/cloudflareinsights\.com/, (r) => r.abort());
  const hp = await hi.newPage();
  hp.on('pageerror', (e) => errors.push(`[transizione] ${String(e)}`));
  await hp.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });
  await hp.waitForFunction(() => window.game?.scene?.getScene('Title')?.scene?.isActive?.(), null, { timeout: 40000 });

  const press = (labelRe) => hp.evaluate((src) => {
    const g = window.game, re = new RegExp(src, 'i');
    const scenes = g.scene.getScenes(true);
    const s = scenes[scenes.length - 1];
    let found = null;
    const visit = (o) => {
      if (found || !o || o.visible === false) return;
      if (o.type === 'Container' && o.input && o.input.enabled) {
        const t = (o.list || []).find((c) => typeof c.text === 'string');
        if (t && re.test(t.text)) { found = o; return; }
      }
      for (const c of (o.list || [])) visit(c);
    };
    for (const o of s.children.list) visit(o);
    if (!found) return false;
    found.emit('pointerdown');
    return true;
  }, labelRe.source);

  if (!(await press(/NUOVA PARTITA/))) fail.push('transizione: NUOVA PARTITA non trovato');
  await hp.waitForTimeout(600);
  const started = Date.now();
  if (!(await press(/^INIZIA/))) fail.push('transizione: INIZIA non trovato (o spento su una partita nuova)');
  try {
    // Le opzioni di waitForFunction vanno nel TERZO argomento: il secondo è
    // l'argomento passato alla funzione. Scritte al posto del secondo
    // vengono prese per un dato qualunque e il timeout resta quello
    // predefinito — trenta secondi — cioè il controllo smette di
    // controllare senza dirlo. È successo proprio qui: misurava 7,7 s e
    // dichiarava PASS con un limite di 3,5.
    await hp.waitForFunction(() => window.game.scene.getScenes(true).some((s) => s.scene.key === 'Briefing'), null, { timeout: TRANSITION_BUDGET_MS });
    const took = Date.now() - started;
    console.log(`  transizione INIZIA → briefing: ${took} ms (limite ${TRANSITION_BUDGET_MS} ms, canvas ${await hp.evaluate(() => `${window.game.canvas.width}x${window.game.canvas.height}`)})`);
  } catch {
    fail.push(`transizione: da INIZIA il briefing non arriva entro ${TRANSITION_BUDGET_MS} ms — la schermata sembra bloccata`);
  }
  await hi.close();
}

// ---- un reperto sigillato non anticipa il proprio contenuto (anti-spoiler) ----
//
// Le schede dei reperti portano tre informazioni: il codice, la FONTE e un
// micro-tag che dice che funzione ha il reperto rispetto al rischio —
// "prova decisiva", "minimizza", "effetto concreto". La fonte è visibile da
// subito di proposito: l'attendibilità di chi parla è materia di
// ragionamento. Il micro-tag no: era visibile anche sulle buste chiuse, e
// bastava citare le due carte marcate "prova decisiva" senza leggere una
// riga. Era la risposta stampata sulla busta.
//
// I termini NON sono trascritti qui: si leggono dal dizionario del gioco,
// così un tag nuovo è coperto il giorno che nasce.
{
  const ev = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await ev.route(/cloudflareinsights\.com/, (r) => r.abort());
  const ep = await ev.newPage();
  ep.on('pageerror', (e) => errors.push(`[reperti] ${String(e)}`));
  await ep.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });
  await ep.waitForFunction(() => window.game?.scene?.getScene('Title')?.scene?.isActive?.(), null, { timeout: 40000 });
  await ep.evaluate(() => {
    const g = window.game;
    for (const s of g.scene.scenes) if (s.scene.isActive() && s.scene.key !== 'Boot') s.scene.stop();
    g.scene.start('Evidence', { caseId: 'case_scoring' });
  });
  await ep.waitForFunction(() => window.game.scene.getScenes(true).some((s) => s.scene.key === 'Evidence'), null, { timeout: 20000 });
  await ep.waitForTimeout(1200);

  const seen = await ep.evaluate(() => {
    const g = window.game;
    const s = g.scene.getScenes(true).slice(-1)[0];
    const stances = Object.values(window.gameStances || {});
    /**
     * SOLO I TESTI DENTRO LE SCHEDE.
     *
     * Guardare tutta la scena sembrava più severo ed era più fragile: il
     * micro-tag «contesto» è anche dentro il pulsante «RIVEDI CONTESTO», e
     * il controllo accusava la scheda di aver rivelato una cosa che stava
     * scritta altrove. La domanda è se la BUSTA CHIUSA anticipa il proprio
     * contenuto, quindi si guardano le buste.
     */
    const texts = [];
    const walk = (list, shown) => {
      for (const o of list) {
        const vis = shown && o.visible !== false && (o.alpha === undefined || o.alpha > 0.05);
        if (typeof o.text === 'string' && o.text.trim() && vis) texts.push(o.text);
        if (Array.isArray(o.list)) walk(o.list, vis);
      }
    };
    const schede = s.children.list.filter((o) => o.type === 'Container' && typeof o.activate === 'function');
    walk(schede, true);
    return { texts, stances, schede: schede.length };
  });
  const stanceLabels = Object.values(EVIDENCE_STANCES);
  if (stanceLabels.length < 3) fail.push('reperti: nessun micro-tag letto dal dizionario, il controllo sarebbe inerte');
  if (!seen.schede) fail.push('reperti: nessuna scheda trovata nella scena, il controllo sarebbe inerte');
  const contiene = (testi, label) => testi.some((t) => t.toLowerCase().includes(label.toLowerCase()));
  const leaked = stanceLabels.filter((label) => contiene(seen.texts, label));
  if (leaked.length) {
    fail.push(`reperti sigillati: il micro-tag è già visibile (${leaked.join(', ')}) — la risposta è stampata sulla busta`);
  }
  // e dopo l'apertura deve invece comparire: nasconderlo per sempre sarebbe
  // l'altro difetto, e questo controllo lo distingue
  await ep.evaluate(() => {
    const s = window.game.scene.getScenes(true).slice(-1)[0];
    const card = s.children.list.find((o) => o.type === 'Container' && typeof o.activate === 'function');
    card?.activate();
  });
  await ep.waitForTimeout(600);
  const afterOpen = await ep.evaluate(() => {
    const s = window.game.scene.getScenes(true).slice(-1)[0];
    const texts = [];
    const walk = (list, shown) => {
      for (const o of list) {
        const vis = shown && o.visible !== false && (o.alpha === undefined || o.alpha > 0.05);
        if (typeof o.text === 'string' && o.text.trim() && vis) texts.push(o.text);
        if (Array.isArray(o.list)) walk(o.list, vis);
      }
    };
    walk(s.children.list.filter((o) => o.type === 'Container' && typeof o.activate === 'function'), true);
    return texts;
  });
  if (!stanceLabels.some((label) => contiene(afterOpen, label))) {
    fail.push('reperti aperti: il micro-tag non compare nemmeno dopo aver esaminato — nascosto, non rivelato');
  }
  await ev.close();
}

await browser.close();

// ---- assertions ----
const relevantErrors = errors.filter((e) => !/cloudflareinsights|Failed to load resource|ERR_/.test(e));
if (relevantErrors.length) fail.push(`console errors: ${JSON.stringify(relevantErrors)}`);
const externalHosts = [...hosts].filter((h) => !h.startsWith('localhost'));
const disallowed = externalHosts.filter((h) => !GAME_HOSTS_ALLOWED.some((a) => h.includes(a)));
if (disallowed.length) fail.push(`unexpected gameplay network host(s): ${JSON.stringify(disallowed)}`);

console.log('gameplay smoke —', fail.length ? 'FAIL' : 'PASS');
console.log('  external hosts:', JSON.stringify(externalHosts));
console.log('  console errors:', relevantErrors.length);
if (fail.length) { for (const f of fail) console.log('  ✗', f); process.exit(1); }
console.log('  ✓ boot, one case to debrief, internal read-more, no gameplay network; touch flow is covered by smoke:mobile-ux');

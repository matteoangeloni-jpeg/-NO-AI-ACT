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

const BASE = process.env.BASE || 'http://localhost:4200';
const OUT_MOBILE = new URL('./out', import.meta.url).pathname;
const GAME_HOSTS_ALLOWED = ['static.cloudflareinsights.com']; // pre-existing shell beacon only
const fail = [];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
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

const click = async (x, y, w = 400) => {
  await page.mouse.move(x, y); await page.waitForTimeout(40);
  await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(w);
};

// Click a canvas Button by its label (logical coords == screen coords at 1280×720).
// Robust to title-menu layout changes: reads the live scene via window.game.
const clickButton = async (labelRe, w = 400) => {
  const pos = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const scenes = window.game.scene.getScenes(true);
    const s = scenes[scenes.length - 1];
    let found = null;
    const visit = (o) => { // recursive: overlay buttons live inside containers
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
  if (!pos) { fail.push(`button not found: ${labelRe}`); return; }
  await click(Math.round(pos.x), Math.round(pos.y), w);
};

// Scene transitions use 300ms camera fades that complete on their own clock;
// fixed sleeps are timing-fragile on slow/CI machines (a click can land one
// scene behind). Wait for the actual scene key instead of guessing durations.
const waitScene = async (key, timeout = 15000) => {
  const ok = await page.waitForFunction((k) => {
    const g = window.game; if (!g) return false;
    const a = g.scene.getScenes(true);
    return a.length > 0 && a[a.length - 1].scene.key === k;
  }, key, { timeout }).then(() => true).catch(() => false);
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
  reducedMotion: false, crtOverlay: true, language: 'en', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
})));
await page.goto(`${BASE}/play/?lang=en`, { waitUntil: 'load' });
await waitScene('Title', 30000); // Phaser boot

await clickButton(/NEW GAME/, 300);      // primary action on the simplified title
await waitScene('Briefing');
await click(640, 300, 400);              // pointerdown skips the typewriter
await clickButton(/ACCESS THE CIVIC MAP/, 300);
await waitScene('CityMap');
await click(Math.round(1280 * 0.40), Math.round(720 * 0.18), 300); // welfare marker (case_credito)
await waitScene('Case');
await click(640, 400, 300);              // reveal case context
await clickButton(/EXAMINE THE EXHIBITS/, 300);
await waitScene('Evidence');
const clues = [[250, 236], [640, 236], [1030, 236], [250, 482], [640, 482], [1030, 482]];
for (const [x, y] of clues) await click(x, y, 100);      // reveal all
await click(clues[3][0], clues[3][1], 100);               // cite relevant clue
await click(clues[4][0], clues[4][1], 100);               // cite relevant clue
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

await clickButton(/Decision debrief/, 700); // open decision debrief overlay
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

// ---- schermi piccoli: non basta che il menu si apra (ticket Q08) ----
//
// Qui si controllava solo che a 390px la pagina non sbordasse. Ma la
// domanda dell'audit è un'altra: un caso si può COMPLETARE? Un tablet in
// verticale (768px) non vede nemmeno l'avviso — per il gioco è un desktop
// stretto — quindi se lì qualcosa non entrasse nel canvas, nessuno se ne
// accorgerebbe: nessun controllo arrivava oltre la schermata iniziale.
for (const vp of [{ w: 390, h: 844, name: 'telefono' }, { w: 768, h: 1024, name: 'tablet verticale' }]) {
  const mctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: true, isMobile: true });
  await mctx.route(/cloudflareinsights\.com/, (r) => r.abort());
  const mp = await mctx.newPage();
  await mp.addInitScript((seed) => {
    try { localStorage.setItem('no-ai-act-save-v2', seed); } catch { /* ignora */ }
  }, JSON.stringify({ version: 2, briefingSeen: true, reducedMotion: true, language: 'it' }));
  await mp.goto(`${BASE}/play/`, { waitUntil: 'domcontentloaded' });
  await mp.waitForFunction(() => {
    const a = window.game?.scene?.getScenes(true);
    return !!a && a.some((s) => s.scene.key === 'Title');
  }, { timeout: 40000 }).catch(() => fail.push(`${vp.name}: il gioco non è mai arrivato al titolo`));

  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) fail.push(`${vp.name} (${vp.w}px): overflow orizzontale su /play/`);

  /**
   * Tocca un elemento interattivo cercandolo per etichetta.
   *
   * Non si usa la tastiera: su un telefono non c'è, e verificare il percorso
   * da tastiera direbbe solo che la LOGICA funziona, non che il gioco si
   * possa giocare con un dito. Le coordinate del mondo (1280×720 logici)
   * vengono riportate sui pixel della pagina attraverso il rettangolo del
   * canvas, che Scale.FIT ridimensiona.
   */
  const tap = async (pattern) => {
    const point = await mp.evaluate((re) => {
      const a = window.game.scene.getScenes(true); const s = a[a.length - 1];
      const cam = s.cameras.main;
      const find = (list) => {
        for (const o of list) {
          const t = Array.isArray(o.list) ? o.list.find((c) => typeof c.text === 'string') : null;
          if (t && new RegExp(re, 'i').test(t.text) && o.input && o.input.enabled && o.visible) return o;
          if (Array.isArray(o.list)) { const f = find(o.list); if (f) return f; }
        }
        return null;
      };
      const btn = find(s.children.list);
      if (!btn) return null;
      const b = btn.getBounds();
      const canvas = document.querySelector('#game-container canvas');
      const r = canvas.getBoundingClientRect();
      const scale = r.width / (cam.width / cam.zoom);
      return { x: r.left + (b.x + b.width / 2) * scale, y: r.top + (b.y + b.height / 2) * scale };
    }, pattern);
    if (!point) return false;
    await mp.touchscreen.tap(point.x, point.y);
    await mp.waitForTimeout(550);
    return true;
  };

  // un caso intero A TOCCO, dai reperti alla firma
  await mp.evaluate(() => window.game.scene.start('Evidence', { caseId: 'case_scoring' }));
  await mp.waitForTimeout(900);
  // due reperti: un tocco li apre, il secondo li cita
  for (const n of [0, 1]) {
    const opened = await mp.evaluate((i) => {
      const a = window.game.scene.getScenes(true); const s = a[a.length - 1];
      const cam = s.cameras.main;
      const cards = s.children.list.filter((o) => o.input && o.input.enabled && typeof o.getBounds === 'function' && o.getBounds().height > 90);
      const c = cards[i];
      if (!c) return null;
      const b = c.getBounds();
      const canvas = document.querySelector('#game-container canvas');
      const r = canvas.getBoundingClientRect();
      const scale = r.width / (cam.width / cam.zoom);
      return { x: r.left + (b.x + b.width / 2) * scale, y: r.top + (b.y + b.height / 2) * scale };
    }, n);
    if (!opened) { fail.push(`${vp.name}: reperto ${n + 1} non raggiungibile a tocco`); continue; }
    await mp.touchscreen.tap(opened.x, opened.y);
    await mp.waitForTimeout(350);
    await mp.touchscreen.tap(opened.x, opened.y);
    await mp.waitForTimeout(350);
  }
  await mp.evaluate(() => window.game.scene.start('Decision', { caseId: 'case_scoring', citedClues: [0, 1] }));
  await mp.waitForTimeout(900);
  /**
   * Tocca l'ennesimo elemento interattivo alto almeno `minH`.
   *
   * Serve al passo della motivazione: lì i bottoni hanno ETICHETTA VUOTA e
   * il testo è un oggetto sovrapposto, quindi cercarli per etichetta non
   * funziona. Un dito però li trova benissimo — la superficie toccabile c'è.
   * Questo è un limite della sonda, non del gioco, ed è il motivo per cui
   * qui si va per geometria invece che per testo.
   */
  const tapNth = async (index, minH) => {
    const point = await mp.evaluate(([i, h]) => {
      const a = window.game.scene.getScenes(true); const s = a[a.length - 1];
      const cam = s.cameras.main;
      const hits = s.children.list.filter(
        (o) => o.input && o.input.enabled && o.visible && typeof o.getBounds === 'function' && o.getBounds().height >= h
      );
      const c = hits[i];
      if (!c) return null;
      const b = c.getBounds();
      const canvas = document.querySelector('#game-container canvas');
      const r = canvas.getBoundingClientRect();
      const scale = r.width / (cam.width / cam.zoom);
      return { x: r.left + (b.x + b.width / 2) * scale, y: r.top + (b.y + b.height / 2) * scale };
    }, [index, minH]);
    if (!point) return false;
    await mp.touchscreen.tap(point.x, point.y);
    await mp.waitForTimeout(550);
    return true;
  };

  for (const label of ['PRATICA VIETATA|1\\.', 'BLOCCARE|1\\.', 'DEPLOYER|2\\.']) {
    if (!(await tap(label))) fail.push(`${vp.name}: nessun bottone toccabile per "${label}"`);
  }
  // motivazione: bottoni senza etichetta, si toccano per posizione
  if (!(await tapNth(1, 80))) fail.push(`${vp.name}: nessuna motivazione toccabile`);

  // il riepilogo è la schermata più densa del gioco: se qualcosa non entra
  // nel canvas a questa larghezza, è qui che si vede
  const geo = await mp.evaluate(() => {
    const a = window.game.scene.getScenes(true); const s = a[a.length - 1];
    const cam = s.cameras.main; const W = cam.width / cam.zoom; const H = cam.height / cam.zoom;
    const out = [];
    for (const o of s.children.list) {
      if (!o || typeof o.getBounds !== 'function') continue;
      const b = o.getBounds();
      let t = typeof o.text === 'string' ? o.text : null;
      if (t == null && Array.isArray(o.list)) { const c = o.list.find((x) => typeof x.text === 'string'); t = c ? c.text : null; }
      if (t && b.width < W * 0.95) out.push({ t: t.slice(0, 40), x: b.x, y: b.y, w: b.width, h: b.height });
    }
    return { W, H, out };
  });
  for (const el of geo.out) {
    if (el.x < 0 || el.y < 0 || el.x + el.w > geo.W + 1 || el.y + el.h > geo.H + 1) {
      fail.push(`${vp.name}: "${el.t}" esce dal canvas`);
    }
  }

  if (!(await tap('FIRMA IL RAPPORTO|SIGN THE REPORT'))) fail.push(`${vp.name}: il bottone di firma non è toccabile`);
  await mp.waitForTimeout(900);
  const done = await mp.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('no-ai-act-save-v2') || '{}');
    return !!(saved.completedCases && saved.completedCases.case_scoring);
  });
  if (!done) fail.push(`${vp.name} (${vp.w}px): il caso non si riesce a completare`);

  await mp.screenshot({ path: `${OUT_MOBILE}/play-${vp.w}x${vp.h}.png` }).catch(() => {});
  await mctx.close();
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
console.log('  ✓ boot, one case to debrief, internal read-more, no gameplay network,\n    e un caso completabile A TOCCO su telefono e tablet verticale');

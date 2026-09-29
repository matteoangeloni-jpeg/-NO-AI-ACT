/**
 * Full-HD smoke della postazione ispettiva: apre il confronto fra reperti
 * nell'esame e nella decisione, verifica il focus modale e salva le immagini.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { worldToPageFn } from './lib-canvas-coords.mjs';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceVisualState } from './lib-evidence.mjs';
import { selectMapCaseWithKeyboard } from './lib-map.mjs';

const BASE = process.env.BASE || 'http://localhost:4200';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(root, 'scripts/smoke/out/inspector-desk');
mkdirSync(out, { recursive: true });
const fail = [];

const save = JSON.stringify({
  version: 1,
  indicators: { efficienza: 74, controllo: 50, diritti: 62, fiducia: 57 },
  completedCases: {}, unlockedNorms: [], audioMuted: true, musicVolume: 0,
  reducedMotion: true, crtOverlay: false, language: 'it', endingId: null,
  briefingSeen: true, caseReports: {}, teacherMode: false, startedAt: 1,
  difficulty: 'standard', mission: 'full'
});

const browser = await chromium.launch(smokeBrowserLaunchOptions());
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
await context.route(/cloudflareinsights\.com/, (route) => route.abort());
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const text = message.text();
  if (!/ERR_FAILED|cloudflareinsights/.test(text)) errors.push(text);
});
await page.addInitScript((payload) => localStorage.setItem('no-ai-act-save-v1', payload), save);
await page.goto(`${BASE}/play/?lang=it`, { waitUntil: 'load' });

const toPage = (x, y) => page.evaluate(worldToPageFn, { x, y });
const click = async (x, y, wait = 250) => {
  const point = await toPage(x, y);
  await page.mouse.click(point.x, point.y);
  await page.waitForTimeout(wait);
};
const waitScene = (key, timeout = 25000) => page.waitForFunction((wanted) => {
  const scenes = window.game?.scene.getScenes(true) ?? [];
  return scenes.at(-1)?.scene.key === wanted;
}, key, { timeout });
const clickButton = async (source, wait = 300) => {
  const position = await page.evaluate((pattern) => {
    const re = new RegExp(pattern, 'i');
    const scene = window.game?.scene.getScenes(true).at(-1);
    let found = null;
    const visit = (object) => {
      if (found || !object || object.visible === false) return;
      if (object.type === 'Container' && object.input?.enabled) {
        const label = (object.list ?? []).find((child) => typeof child.text === 'string');
        if (label && re.test(label.text)) {
          const bounds = object.getBounds();
          found = { x: bounds.centerX, y: bounds.centerY };
          return;
        }
      }
      for (const child of object.list ?? []) visit(child);
    };
    for (const object of scene?.children.list ?? []) visit(object);
    return found;
  }, source);
  if (!position) {
    fail.push(`pulsante non trovato: ${source}`);
    return false;
  }
  await click(position.x, position.y, wait);
  return true;
};
const sceneTexts = () => page.evaluate(() => {
  const scene = window.game?.scene.getScenes(true).at(-1);
  const values = [];
  const visit = (object) => {
    if (!object || object.visible === false) return;
    if (typeof object.text === 'string' && object.text.trim()) values.push(object.text);
    for (const child of object.list ?? []) visit(child);
  };
  for (const object of scene?.children.list ?? []) visit(object);
  return values;
});
const assertComparison = async (stage) => {
  await page.waitForFunction(() => {
    const scene = window.game?.scene.getScenes(true).at(-1);
    const texts = [];
    const visit = (object) => {
      if (!object || object.visible === false) return;
      if (typeof object.text === 'string') texts.push(object.text);
      for (const child of object.list ?? []) visit(child);
    };
    for (const object of scene?.children.list ?? []) visit(object);
    return texts.includes('CONFRONTO REPERTI');
  }, null, { timeout: 5000 }).catch(() => fail.push(`${stage}: confronto non aperto`));
  await page.waitForFunction(() => {
    const labels = [...document.querySelectorAll('#action-layer button:not([hidden])')]
      .map((button) => button.textContent?.trim() ?? '');
    const hasClose = labels.some((label) => /Torna ai reperti|Torna alla decisione/i.test(label));
    const hasPairNavigation = labels.some((label) => label.includes('COPPIA PRECEDENTE'))
      && labels.some((label) => label.includes('COPPIA SUCCESSIVA'));
    const exposesDesk = labels.some((label) => /^FASCICOLO$|^ARCHIVIO$|^TACCUINO$/i.test(label));
    return hasClose && hasPairNavigation && !exposesDesk;
  }, undefined, { timeout: 5000 }).catch(() => fail.push(`${stage}: livello azioni non sincronizzato col confronto`));
  const texts = await sceneTexts();
  for (const required of ['CONFRONTO REPERTI', 'COPPIA 3 DI 3', 'REPERTO 04', 'REPERTO 05', 'FONTE', 'FUNZIONE']) {
    if (!texts.some((text) => text.includes(required))) fail.push(`${stage}: manca "${required}"`);
  }
  const visibleActions = await page.locator('#action-layer button:not([hidden])').allTextContents();
  if (!visibleActions.some((label) => /Torna ai reperti|Torna alla decisione/i.test(label))) {
    fail.push(`${stage}: il focus non resta nel confronto (${JSON.stringify(visibleActions)})`);
  }
  for (const pairAction of ['COPPIA PRECEDENTE', 'COPPIA SUCCESSIVA']) {
    if (!visibleActions.some((label) => label.includes(pairAction))) fail.push(`${stage}: manca ${pairAction}`);
  }
  if (visibleActions.some((label) => /^FASCICOLO$|^ARCHIVIO$|^TACCUINO$/i.test(label))) {
    fail.push(`${stage}: uno strumento della scrivania resta raggiungibile dietro il confronto`);
  }
  await page.screenshot({ path: resolve(out, `${stage}.png`) });
};

await waitScene('Title', 40000);
await clickButton('NUOVA PARTITA');
await clickButton('^INIZIA');
await waitScene('Briefing');
await click(640, 300);
await clickButton('MAPPA CIVICA');
await waitScene('CityMap');
await selectMapCaseWithKeyboard(page, 'case_credito');
await waitScene('Case');
await click(640, 400);
await clickButton('ESAMINA I REPERTI');
await waitScene('Evidence');

// Keyboard-only evidence handling has its own full-flow smoke. This check is
// about the Inspector Desk itself, so prepare the cards through their real
// activation method and keep slow software-rendered CI runs deterministic.
/**
 * LE DUE ISTRUZIONI PRIMA E DOPO IL COMPITO.
 *
 * La schermata dei reperti è la più carica del giro — sette blocchi di prosa
 * per 1119 caratteri, misurati in docs/UI_DENSITY_DIAGNOSIS.md — e due dei
 * sette sono istruzioni su un compito già svolto. Ora si ritirano quando tutti
 * i reperti sono aperti e ne sono citati almeno due.
 *
 * Il controllo pretende ENTRAMBE le facce, perché una sola non basterebbe:
 * pretendere solo l'assenza dopo sarebbe verde anche se le righe non fossero
 * mai esistite, e pretendere solo la presenza prima non direbbe niente sul
 * ritiro. Provato rosso a `RITIRA_ISTRUZIONI_A_COMPITO_SVOLTO = false`.
 */
const righeIstruzione = () => page.evaluate(() => {
  const s = window.game?.scene?.getScene('Evidence');
  if (!s?.scene?.isActive?.()) return null;
  const vive = [];
  const visita = (o) => {
    if (!o || o.visible === false) return;
    if (typeof o.text === 'string' && o.text.trim() !== '' && (o.alpha ?? 1) > 0.05) vive.push(o.text.replace(/\s+/g, ' ').trim());
    for (const c of (o.list || [])) visita(c);
  };
  for (const o of s.children.list) visita(o);
  return vive;
});
const contiene = (righe, frammento) => (righe ?? []).some((r) => r.includes(frammento));
// Frammenti presi dalle traduzioni: se una cambia, qui si fallisce invece di
// approvare una schermata che non è più quella.
const FRAMMENTO_ISTRUZIONE = 'Esaminare tutti i reperti';
const FRAMMENTO_NOTA = 'Citare un reperto lo aggiunge al rapporto';

const primaDelCompito = await righeIstruzione();
if (!contiene(primaDelCompito, FRAMMENTO_ISTRUZIONE)) fail.push("all'ingresso manca l'istruzione sui reperti: la schermata si apre muta");
if (!contiene(primaDelCompito, FRAMMENTO_NOTA)) fail.push("all'ingresso manca la nota sulla citazione");

await prepareEvidenceVisualState(page, [2, 3, 4]);
// La dissolvenza dura 260ms: si aspetta che finisca, non si indovina.
await page.waitForTimeout(600);
const dopoIlCompito = await righeIstruzione();
if (contiene(dopoIlCompito, FRAMMENTO_ISTRUZIONE)) fail.push("a compito svolto l'istruzione sui reperti è ancora a video");
if (contiene(dopoIlCompito, FRAMMENTO_NOTA)) fail.push('a compito svolto la nota sulla citazione è ancora a video');

await page.keyboard.press('x');
await assertComparison('01-evidence-compare');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
await page.keyboard.press('Enter');
await waitScene('Decision');
await page.keyboard.press('x');
await assertComparison('02-decision-compare');

if (errors.length > 0) fail.push(`errori console: ${JSON.stringify(errors)}`);
await browser.close();

if (fail.length > 0) {
  console.error('inspector desk smoke — FAIL');
  for (const item of fail) console.error(`  ✗ ${item}`);
  process.exit(1);
}
console.log('inspector desk smoke — PASS');
console.log(`  screenshots: ${out}`);
console.log('  ✓ confronto disponibile in reperti e decisione, focus modale isolato, zero errori console');

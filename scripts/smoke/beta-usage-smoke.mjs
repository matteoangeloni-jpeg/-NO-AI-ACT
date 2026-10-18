import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from './lib-browser.mjs';
import { prepareEvidenceWithKeyboard } from './lib-evidence.mjs';
import { completeDecisionWithKeyboard } from './lib-decision.mjs';

const production = process.env.USAGE_TEST_CHANNEL === 'production';
const origin = production ? 'https://www.no-ai-act.eu' : 'https://beta.no-ai-act.eu';
const root = resolve(production ? 'dist' : 'dist-beta'); const out = resolve(`scripts/smoke/out/${production ? 'public' : 'beta'}-usage`);
mkdirSync(out, { recursive: true });
const server = createServer((req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    const file = resolve(root, `.${path.endsWith('/') ? `${path}index.html` : path}`);
    assert(file.startsWith(root + sep));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.png': 'image/png', '.json': 'application/json' };
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream'); res.end(readFileSync(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const local = `http://127.0.0.1:${server.address().port}`;
const compiled = await build({ entryPoints: ['analytics/usage-worker.ts'], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', write: false });
const mf = new Miniflare(convertV4MiniflareOptions({ workers: [{ name: 'usage-test', modules: true,
  script: compiled.outputFiles[0].text, compatibilityDate: '2026-10-01', d1Databases: ['DB'],
  bindings: { COLLECTION_ENABLED: 'true', USAGE_ONLY: 'true', ALLOWED_ORIGIN: 'https://beta.no-ai-act.eu', COLLECTION_HOST: 'beta.no-ai-act.eu', ADMIN_HOST: 'insights.no-ai-act.eu' },
  ratelimits: { INGEST_LIMITER: { namespace_id: '41001', simple: { limit: 60, period: 60 } } }
}] }));
let browser;
const payloads = []; const errors = []; const forbidden = [];
const scene = async (p, key) => p.waitForFunction(k => window.game?.scene.isActive(k), key, { timeout: 60000 });
async function context(options) {
  const c = await browser.newContext({ reducedMotion: 'reduce', ...options });
  await c.route('**/*', async route => {
    const req = route.request(); const url = new URL(req.url());
    if (url.pathname !== '/collect' && url.origin !== origin) {
      if (url.hostname === 'static.cloudflareinsights.com') return route.abort();
      forbidden.push(url.origin); return route.abort();
    }
    if (url.pathname === '/collect') {
      assert.equal(url.origin, 'https://beta.no-ai-act.eu');
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
      assert.equal(req.method(), 'POST'); assert.equal(req.headers().cookie, undefined);
      assert.equal(req.headers().referer, undefined);
      const body = req.postData(); const data = JSON.parse(body); payloads.push(data);
      for (const cell of data.cells) {
        assert(!['result','hintUsed','durationBucket','sessionId','email','name'].some(k => k in cell.properties));
        assert(!['report_signed','decision_submitted','case_completed'].includes(cell.event));
      }
      const send = () => mf.dispatchFetch(url.href, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body });
      const result = await send(); assert.equal(result.status, 202); assert.equal((await send()).status, 202);
      return route.fulfill({ status: 202, headers: { 'Access-Control-Allow-Origin': origin }, contentType: 'application/json', body: await result.text() });
    }
    const response = await fetch(`${local}${url.pathname}`);
    return route.fulfill({ status: response.status, contentType: response.headers.get('content-type'), body: Buffer.from(await response.arrayBuffer()) });
  });
  return c;
}
try {
  const db = await mf.getD1Database('DB');
  for (const file of readdirSync('analytics/migrations').filter(f => f.endsWith('.sql')).sort()) await db.prepare(readFileSync(`analytics/migrations/${file}`, 'utf8')).run();
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  for (const width of [390, 1440]) {
    const c = await context({ viewport: { width, height: width === 390 ? 844 : 1000 }, hasTouch: width === 390 });
    const p = await c.newPage(); p.on('pageerror', e => errors.push(String(e)));
    const before = payloads.length;
    await p.goto(`${origin}/play/?lang=it`); await scene(p, 'Title');
    const choice = p.locator('#usage-toggle'); await choice.waitFor();
    assert.equal(await p.locator('#beta-usage-opt-in').count(), 0);
    assert.equal(await choice.isEnabled(), true);
    await p.waitForTimeout(11000); assert(payloads.length > before);
    assert.equal(await p.locator('#game-usage').isVisible(), false, 'notice must disappear without changing collection');
    assert.equal(await p.locator('#usage-reopen').isVisible(), true);
    assert.equal(await p.evaluate(() => document.documentElement.style.getPropertyValue('--usage-bar-height')), '0px');
    await p.locator('#usage-reopen').click();
    assert.equal(await p.locator('#game-usage').isVisible(), true);
    await p.locator('#usage-close').press('Escape');
    assert.equal(await p.locator('#game-usage').isVisible(), false);
    assert.equal(await p.locator('#usage-reopen').evaluate(el => el === document.activeElement), true);
    const activate = async name => {
      const button = p.getByRole('button', { name }).first();
      await button.focus(); await p.keyboard.press('Enter');
      await p.evaluate(() => document.activeElement?.blur());
    };
    await activate(/NUOVA PARTITA/);
    await activate(/^INIZIA/);
    await p.waitForFunction(() => window.game.scene.isActive('Case') || window.game.scene.isActive('Briefing'));
    if (await p.evaluate(() => window.game.scene.isActive('Briefing'))) await activate(/APRI IL PRIMO FASCICOLO/);
    await scene(p, 'Case');
    const data = await p.evaluate(() => window.game.scene.getScene('Case').caseData);
    await activate(/ESAMINA I REPERTI/); await scene(p, 'Evidence');
    await prepareEvidenceWithKeyboard(p, { citeIndices: data.relevantClues, settleMs: 60 });
    await p.keyboard.press('Enter'); await scene(p, 'Decision');
    const keys = [['vietata','alto_rischio','trasparenza','basso_rischio','non_rilevante'].indexOf(data.correctClassification)+1,
      ['blocco','oversight','audit','informare','etichettare','dati_logging','nessuna'].indexOf(data.correctMeasures[0])+1,
      ['provider','deployer','autorita','responsabile_umano','fornitore_esterno'].indexOf(data.responsibleSubjectCorrect)+1,data.correctMotivation+1].map(String);
    await completeDecisionWithKeyboard(p, keys); await p.keyboard.press('Enter'); await scene(p, 'Report');
    await p.waitForTimeout(12000);
    assert(payloads.slice(before).some(b => b.cells.some(cell => cell.event === 'usage_case_completed')));
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await p.screenshot({ path: `${out}/consented-${width}.png` });
    await p.evaluate(() => window.scrollTo(0, 0));
    const bounds = await p.evaluate(() => ({ banner: document.getElementById('game-usage').getBoundingClientRect().bottom,
      content: document.querySelector(document.body.classList.contains('mobile-presentation') ? '#reading-layer' : 'canvas').getBoundingClientRect().top }));
    assert(bounds.content >= bounds.banner - 1, JSON.stringify({ width, ...bounds }));
    await p.locator('#usage-reopen').click();
    await p.locator('#usage-close').click();
    assert.equal(await p.locator('#game-usage').isVisible(), false);
    await p.locator('#usage-reopen').click();
    await choice.click(); const after = payloads.length;
    await p.waitForTimeout(11000); assert.equal(payloads.length, after);
    await p.reload(); await scene(p, 'Title'); assert.equal(await choice.innerText(), 'Disattiva');
    await c.close();
  }
  for (const flag of ['doNotTrack', 'globalPrivacyControl']) {
    const c = await context({ viewport: { width: 390, height: 844 } });
    await c.addInitScript(key => Object.defineProperty(navigator, key, { get: () => key === 'doNotTrack' ? '1' : true }), flag);
    const p = await c.newPage(); await p.goto(`${origin}/play/?lang=it`); await scene(p, 'Title');
    assert.equal(await p.locator('#usage-toggle').isEnabled(), false);
    const before = payloads.length; await p.waitForTimeout(11000); assert.equal(payloads.length, before); await c.close();
  }
  const rows = (await db.prepare('SELECT * FROM counters').all()).results;
  assert.equal(rows.find(r => r.dimension === 'all' && r.event === 'game_started').count, 2);
  assert.equal(rows.find(r => r.dimension === 'all' && r.event === 'usage_case_completed').count, 2);
  assert(!rows.some(r => ['result','hintUsed','durationBucket'].includes(r.dimension)));
  assert.equal((await mf.dispatchFetch('https://beta.no-ai-act.eu/api/stats')).status, 404);
  assert.equal((await mf.dispatchFetch('https://insights.no-ai-act.eu/api/stats')).status, 404);
  assert.deepEqual(errors, []); assert.deepEqual(forbidden, []);
  writeFileSync(`${out}/results.json`, JSON.stringify({ classification: 'local automated test only', origin, widths: [390,1440], automatic: true, revoked: 'no further sends', reload: 'automatic again as disclosed', browserPrivacy: 'DNT/GPC respected', started: 2, completed: 2, duplicateDelivery: 'deduplicated', dimensions: [...new Set(rows.map(r=>r.dimension))], liveWrites: false }, null, 2));
  console.log('PASS automatic counters + actual UI cases + local Worker/D1 + dedupe + opt-out + DNT/GPC; zero live writes.');
} finally { await browser?.close(); await mf.dispose(); await new Promise(r => server.close(r)); }

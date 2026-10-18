import { spawnSync, spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { smokeBrowserLaunchOptions } from '../smoke/lib-browser.mjs';

const fingerprint = dir => {
  const hash = createHash('sha256');
  const walk = path => { for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = join(path, entry.name); if (entry.isDirectory()) walk(file); else { hash.update(file); hash.update(readFileSync(file)); }
  } }; walk(dir); return hash.digest('hex');
};
const original = fingerprint('dist');
const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--mode', 'production', '--outDir', '.infrastructure/stable-check'], {
  stdio: 'inherit', env: { ...process.env, VITE_RELEASE_CHANNEL: 'production', VITE_ANALYTICS_PROVIDER: 'off' }
});
assert.equal(build.status, 0); assert.equal(fingerprint('dist'), original, 'Existing production artifact must remain untouched');
const html = readFileSync('.infrastructure/stable-check/play/index.html', 'utf8');
assert(!html.includes('beta-shell')); assert.match(html, /https:\/\/www\.no-ai-act\.eu\/play\//);
const base = 'http://127.0.0.1:4222';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--outDir', '.infrastructure/stable-check', '--host', '127.0.0.1', '--port', '4222', '--strictPort'], { stdio: 'ignore' });
let browser;
try {
  const deadline = Date.now() + 30000;
  while (true) { try { if ((await fetch(base)).ok) break; } catch {} if (Date.now() > deadline) throw Error('Stable-check preview unavailable'); await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch(smokeBrowserLaunchOptions());
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  const beta = JSON.stringify({ version: 2, language: 'en', completedCases: { case_scoring: 'correct' } });
  await context.addInitScript(value => localStorage.setItem('no-ai-act-beta-save-v2', value), beta);
  const p = await context.newPage(); await p.goto(`${base}/play/?lang=fr`);
  await p.waitForFunction(() => window.game?.scene.isActive('Title'), undefined, { timeout: 60000 });
  assert.equal(await p.locator('#beta-banner').count(), 0);
  const state = await p.evaluate(() => ({ production: JSON.parse(localStorage.getItem('no-ai-act-save-v2')), beta: localStorage.getItem('no-ai-act-beta-save-v2') }));
  assert.equal(state.production.language, 'fr'); assert.deepEqual(state.production.completedCases, {}); assert.equal(state.beta, beta);
  assert.equal(fingerprint('dist'), original);
  mkdirSync('scripts/smoke/out/beta', { recursive: true });
  writeFileSync('scripts/smoke/out/beta/stable-check.json', JSON.stringify({ productionDistUntouched: true, distSha256: original, productionKeysUnchanged: true, noBetaBanner: true, betaSaveUntouched: true }, null, 2));
  console.log('Stable regression PASS: separate production-mode build, original dist unchanged, production saves unchanged and beta data never imported.');
} finally { await browser?.close(); server.kill(); if (server.exitCode === null) await new Promise(r => server.once('exit', r)); }

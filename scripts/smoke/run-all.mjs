/**
 * Browser-smoke orchestrator (`npm run smoke:all`).
 *
 * Runs the three committed Playwright smokes (gameplay, keyboard, layout)
 * against an already-built `dist/`, managing the preview server so the gate is
 * reproducible from a clean clone on both local machines and Linux CI:
 *
 *   1. requires `dist/index.html` (fails fast with instructions otherwise);
 *   2. starts `vite preview` on a fixed port (4200, strict);
 *   3. waits until http://127.0.0.1:4200 actually responds;
 *   4. runs the three smokes sequentially, each with BASE set;
 *   5. exits with the FIRST non-zero smoke exit status (all three always run,
 *      so one failure does not hide another);
 *   6. always tears the preview server down — success, failure, or Ctrl-C —
 *      by killing its whole process group (no orphaned servers).
 *
 * Node standard library only; the only external runtime is Playwright itself,
 * which the smokes import (a committed devDependency).
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = 4200;
const PROBE = `http://127.0.0.1:${PORT}/`;
const BASE = `http://localhost:${PORT}`; // smokes' host allowlists expect "localhost"
const SMOKES = ['gameplay-smoke.mjs', 'keyboard-smoke.mjs', 'layout-smoke.mjs'];

if (!existsSync(resolve(root, 'dist/index.html'))) {
  console.error('smoke:all: dist/index.html not found — run `npm run build` first.');
  process.exit(1);
}

// Start the preview server in its own process group so the whole tree
// (npx → vite → esbuild helpers) can be terminated in one signal.
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: root, stdio: ['ignore', 'ignore', 'inherit'], detached: process.platform !== 'win32'
});

let serverExited = false;
server.on('exit', () => { serverExited = true; });

function stopServer() {
  if (serverExited || server.pid === undefined) return;
  try {
    if (process.platform !== 'win32') process.kill(-server.pid, 'SIGTERM');
    else server.kill('SIGTERM');
  } catch { /* already gone */ }
}

for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => { stopServer(); process.exit(130); });
}
process.on('exit', stopServer);

// Wait until the preview server answers (or give up).
const DEADLINE = Date.now() + 30_000;
let up = false;
while (Date.now() < DEADLINE) {
  if (serverExited) break; // e.g. port already in use (--strictPort)
  try {
    const res = await fetch(PROBE, { signal: AbortSignal.timeout(2000) });
    if (res.ok) { up = true; break; }
  } catch { /* not up yet */ }
  await new Promise((r) => setTimeout(r, 300));
}
if (!up) {
  console.error(`smoke:all: preview server did not become reachable at ${PROBE}.`);
  stopServer();
  process.exit(1);
}

let firstFailure = 0;
for (const smoke of SMOKES) {
  console.log(`\nsmoke:all → ${smoke}`);
  const { status } = spawnSync(process.execPath, [resolve(root, 'scripts/smoke', smoke)], {
    cwd: root, stdio: 'inherit', env: { ...process.env, BASE }
  });
  const code = status ?? 1;
  if (code !== 0) {
    console.error(`smoke:all: ${smoke} FAILED (exit ${code})`);
    if (firstFailure === 0) firstFailure = code;
  }
}

stopServer();
console.log(firstFailure === 0 ? '\nsmoke:all: all browser smokes PASSED' : '\nsmoke:all: FAILED');
process.exit(firstFailure);

import { spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { prepareBeta } from './prepare.mjs';

const usage = process.env.BETA_USAGE_COLLECTION === 'true';
const env = { ...process.env, VITE_RELEASE_CHANNEL: 'beta', VITE_ANALYTICS_PROVIDER: usage ? 'first-party' : 'off' };
for (const args of [['node_modules/typescript/bin/tsc', '--noEmit'],
  ['node_modules/vite/bin/vite.js', 'build', '--mode', 'beta', '--outDir', 'dist-beta']]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
for (const name of ['THIRD_PARTY_LICENSES.md', 'LICENSE', 'CREDITS.md', 'LICENSES/GPL-3.0.txt']) {
  mkdirSync(dirname(`dist-beta/${name}`), { recursive: true }); copyFileSync(name, `dist-beta/${name}`);
}
const pages = prepareBeta('dist-beta', { usage });
writeFileSync('dist-beta/beta-release.json', JSON.stringify({ channel: 'beta', gameVersion: '4.0-candidate',
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()),
  builtAt: new Date().toISOString(), pages, analytics: usage ? 'first-party-opt-in' : 'off', saveKey: 'no-ai-act-beta-save-v2' }, null, 2));
console.log(`Beta build: ${pages} HTML pages, noindex, usage ${usage ? 'OPT-IN' : 'OFF'}, isolated saves. No upload performed.`);

import { mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function pagesDevOptions(port) {
  const cwd = resolve('.infrastructure/pages'); mkdirSync(cwd, { recursive: true });
  // Pages requires the conventional filename in its working directory.
  copyFileSync('deploy/cloudflare/beta.pages.jsonc', `${cwd}/wrangler.jsonc`);
  return { command: process.execPath,
    args: [resolve('node_modules/wrangler/bin/wrangler.js'), 'pages', 'dev', resolve('dist-beta'), '--ip', '127.0.0.1', '--port', String(port)],
    options: { cwd, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } } };
}

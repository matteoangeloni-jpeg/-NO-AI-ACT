import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'deploy', '--dry-run',
  '--config', 'deploy/cloudflare/insights.jsonc', '--outdir', '.infrastructure/worker-build'], {
  stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }
});
process.exitCode = result.status ?? 1;

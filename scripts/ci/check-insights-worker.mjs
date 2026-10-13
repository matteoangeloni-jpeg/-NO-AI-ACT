import { spawn } from 'node:child_process';

const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--dry-run','--config','analytics/wrangler.jsonc','--outdir','.player-insights/worker-build'],
  {stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
child.on('error',()=>{process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});

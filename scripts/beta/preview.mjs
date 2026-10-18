import { spawn } from 'node:child_process';
import { pagesDevOptions } from './local-pages.mjs';
const config = pagesDevOptions(process.env.BETA_PORT ?? '4220');
const child = spawn(config.command, config.args, { ...config.options, stdio: 'inherit' });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill());

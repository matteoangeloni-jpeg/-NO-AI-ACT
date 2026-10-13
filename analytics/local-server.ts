import { createServer } from 'node:http';
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { LocalDatabase } from './local-db';
import { seedSynthetic } from './seed';
import { handle } from './worker';
import type { Env, Limiter } from './types';

const root = new URL('../.player-insights/', import.meta.url);
mkdirSync(root, { recursive: true });
const credentials = new URL('credentials.local', root);
let password: string;
if (process.env.INSIGHTS_TEST_PASSWORD) password = process.env.INSIGHTS_TEST_PASSWORD;
else {
  if (!existsSync(credentials)) writeFileSync(credentials, `Username: reviewer\nPassword: ${randomBytes(24).toString('base64url')}\n`, { mode: 0o600 });
  password = readFileSync(credentials, 'utf8').split('Password: ')[1]?.trim();
  if (!password || password.length < 24) throw new Error('Invalid local credential file');
}
const port = Number(process.env.INSIGHTS_PORT ?? 4214);
const db = new LocalDatabase(fileURLToPath(new URL(`synthetic-${port}.sqlite`, root)));
await seedSynthetic(db);
class LocalLimiter implements Limiter {
  private window = 0; private count = 0;
  constructor(private maximum: number) {}
  async limit(): Promise<{ success: boolean }> {
    const window = Math.floor(Date.now() / 60000);
    if (this.window !== window) { this.window = window; this.count = 0; }
    return { success: ++this.count <= this.maximum };
  }
}
const env: Env = { DB: db, LOCAL_TEST: 'true', LOCAL_PASSWORD: password, COLLECTION_ENABLED: 'false', DATA_CLASSIFICATION: 'synthetic',
  INGEST_LIMITER: new LocalLimiter(60), ADMIN_LIMITER: new LocalLimiter(1000),
  ASSETS: { async fetch(request) {
    const path = new URL(request.url).pathname;
    const names: Record<string, string> = { '/': 'index.html', '/dashboard.js': 'dashboard.js', '/dashboard.css': 'dashboard.css' };
    const name = names[path]; if (!name) return new Response('Not found', { status: 404 });
    return new Response(readFileSync(new URL(`./dashboard/${name}`, import.meta.url)), { headers: { 'Content-Type': name.endsWith('.html') ? 'text/html; charset=utf-8' : name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8' } });
  } }
};
const server = createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host;
    if (!host || ![`127.0.0.1:${port}`, `localhost:${port}`].includes(host)) { outgoing.writeHead(403).end(); return; }
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
    const result = await handle(new Request(`http://${host}${incoming.url}`, { method: incoming.method, headers }), env);
    outgoing.writeHead(result.status, Object.fromEntries(result.headers));
    outgoing.end(Buffer.from(await result.arrayBuffer()));
  } catch { outgoing.writeHead(503).end('Unavailable'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Player Insights: http://127.0.0.1:${port}/ (synthetic only). Credentials: .player-insights/credentials.local`));
function close() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGTERM', close); process.on('SIGINT', close);

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
const sessions = new Map<string, number>();
const loginPage = `<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Player Insights - Accesso locale</title><style>body{font:16px system-ui;background:#10151b;color:#fff;margin:0;padding:32px}main{max-width:440px;margin:8vh auto}label,input,button{display:block;width:100%;box-sizing:border-box;margin:16px 0}input,button{padding:14px;font:inherit}a{color:#9ed6ff}</style><main><h1>Player Insights</h1><p>Ambiente locale. Dati sintetici.</p><form method="post" action="/local-login"><label for="password">Password locale</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button>Accedi</button></form><p>La password si trova nel file <code>.player-insights/credentials.local</code> del progetto.</p></main></html>`;
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
    const names: Record<string, string> = { '/': 'index.html', '/dashboard.js': 'dashboard.js', '/forecast.js': 'forecast.js', '/dashboard.css': 'dashboard.css' };
    const name = names[path]; if (!name) return new Response('Not found', { status: 404 });
    return new Response(readFileSync(new URL(`./dashboard/${name}`, import.meta.url)), { headers: { 'Content-Type': name.endsWith('.html') ? 'text/html; charset=utf-8' : name.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/javascript; charset=utf-8' } });
  } }
};
const server = createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host;
    if (!host || ![`127.0.0.1:${port}`, `localhost:${port}`].includes(host)) { outgoing.writeHead(403).end(); return; }
    const path = new URL(incoming.url ?? '/', `http://${host}`).pathname;
    if (path === '/local-login' && incoming.method === 'POST') {
      if (incoming.headers.origin !== `http://${host}`) { outgoing.writeHead(403).end(); return; }
      let body = ''; for await (const chunk of incoming) { body += chunk; if (body.length > 2048) { outgoing.writeHead(413).end(); return; } }
      const submitted = new URLSearchParams(body).get('password') ?? '';
      const { authorized } = await import('./auth');
      if (!await authorized(new Request(`http://${host}/`, { headers: { Authorization: `Basic ${btoa(`reviewer:${submitted}`)}` } }), env)) {
        outgoing.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(loginPage.replace('<form', '<p role="alert">Password non corretta.</p><form')); return;
      }
      const now = Date.now(); for (const [key, expiry] of sessions) if (expiry <= now) sessions.delete(key);
      const session = randomBytes(32).toString('hex'); sessions.set(session, now + 3600000);
      outgoing.writeHead(303, { Location: '/', 'Set-Cookie': `insights_local=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`, 'Cache-Control': 'no-store' }).end(); return;
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
    const session = /(?:^|;\s*)insights_local=([a-f0-9]{64})(?:;|$)/.exec(incoming.headers.cookie ?? '')?.[1];
    if (session && (sessions.get(session) ?? 0) > Date.now()) headers.set('Authorization', `Basic ${btoa(`reviewer:${password}`)}`);
    const result = await handle(new Request(`http://${host}${incoming.url}`, { method: incoming.method, headers }), env);
    if (path === '/' && incoming.method === 'GET' && result.status === 401) {
      outgoing.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(loginPage); return;
    }
    outgoing.writeHead(result.status, Object.fromEntries(result.headers));
    outgoing.end(Buffer.from(await result.arrayBuffer()));
  } catch { outgoing.writeHead(503).end('Unavailable'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Player Insights: http://127.0.0.1:${port}/ (synthetic only). Credentials: .player-insights/credentials.local`));
function close() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGTERM', close); process.on('SIGINT', close);

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { shell, style } from '../research/study02/shell.mjs';

/** Loopback-only, GET-only, no body handler, logging, cookies or data endpoint. */
export async function startStudy02Server(port = 4262) {
  const assets = new Map([
    ['/', ['text/html; charset=utf-8', shell]], ['/style.css', ['text/css; charset=utf-8', style]]
  ]);
  for (const file of ['app.mjs', 'model.mjs', 'materials.mjs', 'materials.locales.mjs']) {
    assets.set('/' + file, ['text/javascript; charset=utf-8', await readFile(new URL('../research/study02/' + file, import.meta.url), 'utf8')]);
  }
  const server = createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; img-src data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    const asset = assets.get(new URL(req.url, 'http://localhost').pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    if (!asset) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', asset[0]); res.end(req.method === 'HEAD' ? undefined : asset[1]);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await startStudy02Server(Number(process.env.STUDY02_PORT || 4262));
  process.stdout.write(`Study 02 locale: http://127.0.0.1:${server.address().port}/\n`);
}

import { authorized } from './auth';
import { csv, ingest, LIMITS, parseQuery, purge, readCells, retentionWindow, validateBatch } from './aggregation';
import type { Env } from './types';

const headers = {
  'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
function response(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json', ...extra } });
}
async function boundedJSON(request: Request): Promise<unknown> {
  if (!request.body) throw new Error('body');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  const deadline = Date.now() + 5000;
  try {
    while (true) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => { void reader.cancel(); reject(new Error('timeout')); }, Math.max(1, deadline - Date.now())); });
      const part = await Promise.race([reader.read(), timeout]).finally(() => clearTimeout(timer));
      const { done, value } = part; if (done) break;
      size += value.byteLength; if (size > LIMITS.bytes) { await reader.cancel(); throw new Error('size'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const c of chunks) { bytes.set(c, offset); offset += c.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
export async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  try {
    // The same Worker can serve Insights and only /collect on the beta host.
    if (url.pathname === '/collect' && env.COLLECTION_HOST && url.hostname !== env.COLLECTION_HOST) return response({ error: 'not_found' }, 404);
    if (url.pathname !== '/collect' && env.ADMIN_HOST && url.hostname !== env.ADMIN_HOST) return response({ error: 'not_found' }, 404);
    if (url.pathname === '/collect') {
      if (env.COLLECTION_ENABLED !== 'true') return response({ error: 'collection_disabled' }, 503);
      if (!env.ALLOWED_ORIGIN || request.headers.get('Origin') !== env.ALLOWED_ORIGIN || url.search) return response({ error: 'forbidden' }, 403);
      const cors = { 'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN, 'Vary': 'Origin' };
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
      if (request.method !== 'POST') return response({ error: 'method' }, 405, cors);
      if (!env.INGEST_LIMITER) return response({ error: 'limiter_unavailable' }, 503, cors);
      // Global key: no IP, UA, user identifier or fingerprint enters application storage.
      if (!(await env.INGEST_LIMITER.limit({ key: 'collect-global' })).success) return response({ error: 'rate_limited' }, 429, { ...cors, 'Retry-After': '60' });
      if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return response({ accepted: false }, 200, cors);
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('Content-Type') ?? '') || request.headers.has('Content-Encoding')) return response({ error: 'content_type' }, 415, cors);
      if (Number(request.headers.get('Content-Length') ?? 0) > LIMITS.bytes) return response({ error: 'payload_limit' }, 413, cors);
      let body: unknown;
      try { body = await boundedJSON(request); } catch (e) { return response({ error: 'invalid_body' }, e instanceof Error && e.message === 'size' ? 413 : 400, cors); }
      if (!validateBatch(body)) return response({ error: 'invalid_payload' }, 400, cors);
      await ingest(env.DB, body);
      return response({ accepted: true }, 202, cors);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return response({ error: 'method' }, 405);
    if (!await authorized(request, env)) return response({ error: 'authentication_required' }, 401,
      env.LOCAL_TEST === 'true' ? { 'WWW-Authenticate': 'Basic realm="Player Insights local test", charset="UTF-8"' } : {});
    if (!env.ADMIN_LIMITER || !(await env.ADMIN_LIMITER.limit({ key: 'admin-global' })).success) return response({ error: 'admin_rate_limited' }, 429);
    if (url.pathname === '/api/stats' || url.pathname === '/api/export.csv') {
      const query = parseQuery(url); if (!query) return response({ error: 'invalid_query' }, 400);
      const now = Date.now(); const coverage = retentionWindow(query, now);
      const rows = await readCells(env.DB, query, now);
      const classification = env.DATA_CLASSIFICATION === 'synthetic' ? 'synthetic' : 'observed';
      if (url.pathname.endsWith('.csv')) return new Response(csv(rows, classification, query, now), { headers: { ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="player-insights-aggregates.csv"',
        'X-Retention-From': coverage.retainedFrom, 'X-Retention-Clipped': String(coverage.clipped) } });
      return response({ classification, collectionEnabled: env.COLLECTION_ENABLED === 'true', localEnvironment: env.LOCAL_TEST === 'true', query, threshold: LIMITS.threshold, rows, generatedAt: new Date(now).toISOString(), dayBasis: 'UTC receipt day', retentionDays: LIMITS.retentionDays, retentionWindow: coverage });
    }
    if (url.pathname.startsWith('/api/') || !['/', '/dashboard.js', '/forecast.js', '/dashboard.css'].includes(url.pathname)) return response({ error: 'not_found' }, 404);
    if (!env.ASSETS) return response({ error: 'assets_unavailable' }, 503);
    const asset = await env.ASSETS.fetch(request);
    const result = new Response(request.method === 'HEAD' ? null : asset.body, asset);
    for (const [key, value] of Object.entries(headers)) result.headers.set(key, value);
    return result;
  } catch {
    // Deliberately do not log incoming bodies, credentials or exception SQL.
    return response({ error: 'temporarily_unavailable' }, 503);
  }
}
export default {
  fetch: handle,
  async scheduled(_event: unknown, env: Env): Promise<void> { await purge(env.DB); }
};

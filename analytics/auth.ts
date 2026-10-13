import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Env } from './types';
const keys = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function authorized(request: Request, env: Env): Promise<boolean> {
  if (env.LOCAL_TEST === 'true') {
    const url = new URL(request.url);
    if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(url.hostname) || !env.LOCAL_PASSWORD || env.LOCAL_PASSWORD.length < 24) return false;
    const expected = `Basic ${btoa(`reviewer:${env.LOCAL_PASSWORD}`)}`;
    const supplied = request.headers.get('Authorization') ?? '';
    // Fixed-size digests prevent an early-return password comparison.
    const digest = (s: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    const a = new Uint8Array(await digest(expected)); const b = new Uint8Array(await digest(supplied));
    return a.reduce((n, v, i) => n | (v ^ b[i]), 0) === 0;
  }
  if (!env.ACCESS_TEAM || !/^[a-z0-9-]+$/.test(env.ACCESS_TEAM) || !env.ACCESS_AUD || !env.ADMIN_EMAILS) return false;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token || token.length > 8192) return false;
  const issuer = `https://${env.ACCESS_TEAM}.cloudflareaccess.com`;
  try {
    let jwks = keys.get(issuer);
    if (!jwks) { jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`), { timeoutDuration: 3000 }); keys.set(issuer, jwks); }
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: env.ACCESS_AUD, algorithms: ['RS256'], requiredClaims: ['exp','iat','email'], maxTokenAge: '24h' });
    return typeof payload.email === 'string' && env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()).includes(payload.email.toLowerCase());
  } catch { return false; }
}

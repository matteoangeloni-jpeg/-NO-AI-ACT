import { handle } from './worker';
import type { Env } from './types';
import { PRODUCTION_COLLECTOR_ORIGIN,LEGACY_COLLECTOR_ORIGIN } from './endpoints';

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    if (![new URL(PRODUCTION_COLLECTOR_ORIGIN).hostname,new URL(LEGACY_COLLECTOR_ORIGIN).hostname].includes(url.hostname) || (url.pathname !== '/collect' && !url.pathname.startsWith('/collect/v3/'))) {
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    const origin = request.headers.get('Origin');
    if (!['https://beta.no-ai-act.eu', 'https://www.no-ai-act.eu'].includes(origin ?? '')) {
      return new Response(null, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }
    return handle(request, { ...env, COLLECTION_HOST: url.hostname, ALLOWED_ORIGIN: origin! });
  }
};

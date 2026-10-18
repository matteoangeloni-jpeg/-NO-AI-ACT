import { handle } from './worker';
import type { Env } from './types';

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.hostname !== 'beta.no-ai-act.eu' || url.pathname !== '/collect') {
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    const origin = request.headers.get('Origin');
    if (!['https://beta.no-ai-act.eu', 'https://www.no-ai-act.eu'].includes(origin ?? '')) {
      return new Response(null, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }
    return handle(request, { ...env, COLLECTION_HOST: url.hostname, ALLOWED_ORIGIN: origin! });
  }
};

import { handle } from './worker';
import type { Env } from './types';

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.hostname !== 'beta.no-ai-act.eu' || url.pathname !== '/collect') {
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    return handle(request, env);
  }
};

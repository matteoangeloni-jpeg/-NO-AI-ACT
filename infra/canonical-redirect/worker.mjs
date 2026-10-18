export default {
  fetch(request) {
    const target = new URL(request.url);
    if (target.hostname !== 'no-ai-act.eu') return new Response('Not found', { status: 404 });
    target.protocol = 'https:';
    target.hostname = 'www.no-ai-act.eu';
    target.port = '';
    // Do not fetch the origin: the canonical redirect must precede its TLS error.
    return Response.redirect(target.href, ['GET', 'HEAD'].includes(request.method) ? 301 : 308);
  }
};

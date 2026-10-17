import { parse, parseFragment, serialize } from 'parse5';
import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

export function prepareBeta(directory, { usage = false } = {}) {
  const root = resolve(directory);
  assert.equal(root, resolve('dist-beta'), 'Only the isolated beta artifact may be rewritten');
  const files = [];
  const walk = dir => { for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name); if (entry.isDirectory()) walk(path); else if (entry.name.endsWith('.html')) files.push(path);
  } };
  walk(root);
  for (const file of files) {
    const document = parse(readFileSync(file, 'utf8')); let head;
    const visit = node => {
      if (node.tagName === 'head') head = node;
      node.childNodes = (node.childNodes ?? []).filter(child => {
        const a = Object.fromEntries((child.attrs ?? []).map(x => [x.name, x.value]));
        return !((child.tagName === 'link' && ['canonical', 'alternate'].includes(a.rel))
          || (child.tagName === 'meta' && (['robots', 'googlebot', 'bingbot'].includes(a.name) || a.property === 'og:url'))
          || (child.tagName === 'script' && (a.type === 'application/ld+json' || 'data-cf-beacon' in a || /cloudflareinsights\.com/.test(a.src ?? ''))));
      });
      for (const a of node.attrs ?? []) {
        if (['href', 'src', 'content'].includes(a.name) && a.value.startsWith('https://www.no-ai-act.eu/')) {
          const url = new URL(a.value); a.value = `${url.pathname}${url.search}${url.hash}`;
        }
      }
      for (const child of node.childNodes) visit(child);
    };
    visit(document); assert(head);
    const fragment = parseFragment('<meta name="robots" content="noindex, nofollow, noarchive"><meta name="googlebot" content="noindex, nofollow, noarchive"><meta name="no-ai-act-channel" content="beta"><link rel="stylesheet" href="/beta-shell.css"><script defer src="/beta-shell.js"></script>');
    for (const node of fragment.childNodes) { node.parentNode = head; head.childNodes.push(node); }
    if (usage) {
      const marker = parseFragment('<meta name="no-ai-act-usage" content="opt-in">').childNodes[0];
      marker.parentNode = head; head.childNodes.push(marker);
    }
    writeFileSync(file, serialize(document));
  }
  for (const name of ['sitemap.xml', 'sitemap-it.xml', 'sitemap-en.xml', 'sitemap-fr.xml', 'CNAME', 'llms.txt', 'llms-full.txt']) {
    const file = join(root, name); if (existsSync(file)) unlinkSync(file);
  }
  copyFileSync('src/beta/shell.js', join(root, 'beta-shell.js'));
  copyFileSync('src/beta/shell.css', join(root, 'beta-shell.css'));
  copyFileSync('src/beta/statistics.html', join(root, 'beta-statistics.html'));
  writeFileSync(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  writeFileSync(join(root, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n');
  writeFileSync(join(root, '404.html'), '<!doctype html><html lang="it"><head><meta name="robots" content="noindex,nofollow"><meta charset="utf-8"><title>NO AI ACT Beta - 404</title><link rel="stylesheet" href="/beta-shell.css"><script defer src="/beta-shell.js"></script></head><body><main><h1>404</h1><a href="/">NO AI ACT Beta</a></main></body></html>');
  return files.length + 2;
}

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * ENCODING GUARD — prevent mojibake regressions from reaching a deploy.
 *
 * A recent "encoding fix" commit double-encoded UTF-8 (à → Ã<nbsp>, è → Ã¨) and
 * mangled em-dashes (— → a stray `"”`), which produced garbled copy AND invalid
 * JSON-LD on the landings — failing tests and blocking the Pages deploy. This
 * guard runs in `npm test` (which gates the build/deploy) so the same class of
 * corruption is caught before merge, not in production.
 */

const root = resolve(__dirname, '..');
const SKIP = new Set(['node_modules', 'dist', '.git', '.github']);

function walk(dir: string, ext: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(resolve(root, dir))) {
    if (SKIP.has(e)) continue;
    const rel = join(dir, e);
    const abs = resolve(root, rel);
    if (statSync(abs).isDirectory()) out.push(...walk(rel, ext));
    else if (rel.endsWith(ext)) out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

const HTML_FILES = walk('.', '.html');
// Telltales of UTF-8→CP1252→UTF-8 double-encoding, and the botched em-dash.
const MOJIBAKE = /Ã[\x80-\xbf]|â€|Â[\x80-\xbf]|"”|�/;

describe('encoding — no mojibake in source HTML', () => {
  it('finds HTML pages to scan', () => {
    expect(HTML_FILES.length).toBeGreaterThan(40);
  });

  it('every tracked .html page is free of double-encoding / botched-dash mojibake', () => {
    const bad = HTML_FILES.filter((f) => MOJIBAKE.test(readFileSync(resolve(root, f), 'utf8')));
    expect(bad, `mojibake in: ${bad.join(', ')}`).toEqual([]);
  });

  it('landing structured data (JSON-LD) stays valid — corruption breaks it first', () => {
    for (const f of ['index.html', 'en/index.html']) {
      const html = readFileSync(resolve(root, f), 'utf8');
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocks.length).toBeGreaterThan(0);
      for (const [, body] of blocks) {
        expect(() => JSON.parse(body), `${f}: JSON-LD must parse`).not.toThrow();
      }
    }
  });
});

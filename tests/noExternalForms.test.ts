import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * NO-EXTERNAL-FORMS GUARD (replaces the old tally.test.ts).
 *
 * Tally was removed from the public product: the game and the website must
 * ship ZERO third-party form scripts, embeds, links or IDs. The project is
 * fully self-contained — no feedback collection, no survey handoff, no
 * replacement provider. This guard keeps it that way.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const SKIP = new Set(['node_modules', 'dist', '.git', '.github', 'no-ai-act-audit']);
const SHIPPED_EXT = /\.(html|ts|mjs|js|css|txt|json|xml)$/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(resolve(root, dir))) {
    if (SKIP.has(e)) continue;
    const rel = dir === '.' ? e : join(dir, e);
    if (statSync(resolve(root, rel)).isDirectory()) out.push(...walk(rel));
    else if (SHIPPED_EXT.test(rel)) out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

// Everything that can reach the shipped product or drive it.
const SHIPPED_DIRS = ['src', 'public', 'play', 'scripts', 'en'];
const SHIPPED_FILES = ['index.html', 'package.json', 'vite.config.ts'];
const TALLY_IDS = ['44ENVA', '5BryXb', 'dWgB5y', 'ZjWp9A'];
const FORM_HOSTS = /tally\.so|typeform\.com|jotform\.com|forms\.gle|docs\.google\.com\/forms|surveymonkey/i;
// Guard files may name the forbidden patterns in their own detection logic.
const GUARD_FILES = new Set(['scripts/ci/verify-dist.mjs']);

function shippedSources(): string[] {
  const files: string[] = [];
  for (const d of SHIPPED_DIRS) if (existsSync(resolve(root, d))) files.push(...walk(d));
  for (const f of SHIPPED_FILES) if (existsSync(resolve(root, f))) files.push(f);
  // all public HTML pages at the repo root (educational pages live in subdirs
  // already covered? no — cover every tracked html)
  return files;
}

// every HTML page in the repo (site pages live in many top-level dirs)
function allHtml(): string[] {
  return walk('.').filter((f) => f.endsWith('.html'));
}

describe('zero Tally / external-form references in shipped sources', () => {
  it('no tally.so or form-provider host anywhere in shipped code and pages', () => {
    const offenders = [...new Set([...shippedSources(), ...allHtml()])]
      .filter((f) => !GUARD_FILES.has(f) && FORM_HOSTS.test(read(f)));
    expect(offenders, `form hosts found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('no known Tally form ID anywhere in shipped code and pages', () => {
    const offenders: string[] = [];
    for (const f of [...new Set([...shippedSources(), ...allHtml()])]) {
      if (GUARD_FILES.has(f)) continue;
      const t = read(f);
      for (const id of TALLY_IDS) if (t.includes(id)) offenders.push(`${f}: ${id}`);
    }
    expect(offenders).toEqual([]);
  });

  it('no data-tally attribute, Tally embed script or form iframe in any HTML page', () => {
    const offenders = allHtml().filter((f) => {
      const t = read(f);
      return /data-tally/i.test(t) || /widgets\/embed\.js/.test(t) || /<iframe[^>]+(tally|typeform|jotform|forms\.gle)/i.test(t);
    });
    expect(offenders).toEqual([]);
  });

  it('the old Tally config module is gone', () => {
    expect(existsSync(resolve(root, 'src/game/config/tally.ts'))).toBe(false);
  });
});

describe('no replacement data-collection mechanism was added', () => {
  it('game code opens no external URLs via window.open', () => {
    const gameFiles = walk('src').filter((f) => f.endsWith('.ts'));
    const offenders = gameFiles.filter((f) => /window\.open\(\s*['"`]?https?:/.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it('the finale privacy note is static copy, present in both languages', () => {
    for (const lang of ['it', 'en']) {
      const t = read(`src/game/i18n/${lang}.ts`);
      expect(t).toContain('privacyNote');
      expect(t).not.toMatch(/tally/i);
    }
  });

  it('llms.txt states the no-external-forms posture', () => {
    const llms = read('public/llms.txt');
    expect(llms).not.toMatch(/tally/i);
    expect(llms.toLowerCase()).toContain('no external forms');
  });
});

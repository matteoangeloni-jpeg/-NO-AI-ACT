import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * SITE-INSIGHT GUARD.
 *
 * The insight report exists so that structural questions can be answered
 * WITHOUT adding a third-party analytics SDK. This suite pins both halves of
 * that promise: the script must work, and it must remain a local, read-only
 * tool that never touches the shipped site.
 */

const root = resolve(__dirname, '..');
const script = readFileSync(resolve(root, 'scripts/seo/site-insight.mjs'), 'utf8');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

describe('the insight tool stays local and read-only', () => {
  it('is wired as an npm script', () => {
    expect(pkg.scripts.insight).toContain('scripts/seo/site-insight.mjs');
  });

  it('never writes files and never performs network calls', () => {
    expect(script).not.toMatch(/writeFileSync|createWriteStream|appendFileSync/);
    expect(script).not.toMatch(/\bfetch\(|https?:\/\/(?!www\.no-ai-act)/);
  });

  it('does not introduce any analytics SDK into the repository', () => {
    expect(script).not.toMatch(/posthog|plausible|umami|gtag|googletagmanager/i);
  });
});

describe('the report runs and answers the structural questions', () => {
  const out = execFileSync('node', [resolve(root, 'scripts/seo/site-insight.mjs')], { cwd: root }).toString();

  it('covers the full public inventory', () => {
    const cfg = JSON.parse(readFileSync(resolve(root, 'release.config.json'), 'utf8'));
    expect(out).toContain(`Pages analysed: ${cfg.publicUrls.total}`);
    expect(out).toContain(`${cfg.publicUrls.it} IT + ${cfg.publicUrls.en} EN`);
  });

  it('reports every section a weekly review needs', () => {
    for (const section of ['Best supported pages', 'Fragile', 'Thinnest content', 'Dead ends', 'Single-language pages']) {
      expect(out, section).toContain(section);
    }
  });

  it('counts editorial links only, excluding the global nav', () => {
    // the nav links to ~12 pages from all 56 pages; counting it would put every
    // navigated page far above any editorial figure and make the report useless
    expect(out).toContain('EDITORIAL links only');
    // first data row after the section header (the header itself ends with ---)
    const after = out.split('Best supported pages')[1].split('---\n')[1];
    const top = Number(after.trim().split(/\s+/)[0]);
    expect(Number.isFinite(top), `parsed "${after.split('\n')[0]}"`).toBe(true);
    expect(top).toBeLessThan(56);
  });

  it('emits valid JSON with --json', () => {
    const json = execFileSync('node', [resolve(root, 'scripts/seo/site-insight.mjs'), '--json'], { cwd: root }).toString();
    const data = JSON.parse(json);
    expect(Array.isArray(data.pages)).toBe(true);
    expect(data.pages.length).toBeGreaterThan(50);
    for (const p of data.pages) {
      expect(typeof p.words).toBe('number');
      expect(typeof p.editorialIn).toBe('number');
    }
  });
});

import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const pages = ['press-kit', 'en/press-kit', 'fr/dossier-de-presse'];
describe('public press kit freshness', () => {
  for (const route of pages) it(`${route} describes the public release without stale privacy claims`, () => {
    const html = readFileSync(`${route}/index.html`, 'utf8');
    expect(html).toContain('2026-10-22');
    expect(html).toContain('id="release-title"');
    expect(html).toContain('id="coverage-title"');
    expect(html).toContain('/game-statistics.html#');
    expect(html).toContain('Global Privacy Control');
    expect(html).not.toMatch(/press candidate|candidate presse|Candidature presse|nessuna telemetria|no gameplay telemetry|ni télémétrie/);
    expect(html).toContain('/assets/press/no-ai-act-v4.0.0-press-screenshots.zip');
    const images = [...html.matchAll(/<img[^>]+src="(\/assets\/press\/screenshots-v4\/[^"]+)"/g)];
    expect(images).toHaveLength(10);
    for (const [, src] of images) expect(existsSync(`public${src}`)).toBe(true);
    expect(existsSync('public/assets/press/no-ai-act-v3.0-press-screenshots.zip')).toBe(true);
  });
});

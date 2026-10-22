import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

const pages = ['press-kit', 'en/press-kit', 'fr/dossier-de-presse', 'de/pressemappe', 'es/kit-de-prensa', 'pt/kit-de-imprensa'];
describe('public press kit freshness', () => {
  for (const route of pages) it(`${route} describes the public release without stale privacy claims`, () => {
    const html = readFileSync(`${route}/index.html`, 'utf8');
    if (pages.indexOf(route) < 3) {
      expect(html).toContain('2026-10-22');
      expect(html).toContain('id="release-title"');
      expect(html).toContain('id="coverage-title"');
    } else expect(html).toContain('section-11');
    expect(html).toContain('/game-statistics.html#');
    expect(html).toContain('Global Privacy Control');
    expect(html).not.toMatch(/press candidate|candidate presse|Candidature presse|nessuna telemetria|no gameplay telemetry|ni télémétrie/);
    expect(html).toContain('/assets/press/no-ai-act-v4.0.0-press-screenshots.zip');
    const images = [...html.matchAll(/<img[^>]+src="(\/assets\/press\/screenshots-v4\/[^"]+)"/g)];
    expect(images).toHaveLength(10);
    for (const [, src] of images) expect(existsSync(`public${src}`)).toBe(true);
    expect(existsSync('public/assets/press/no-ai-act-v3.0-press-screenshots.zip')).toBe(true);
  });
  it('all six counterparts are linked and image language is disclosed', () => {
    for (const route of pages) {
      const html = readFileSync(`${route}/index.html`, 'utf8');
      for (const target of pages) expect(html).toContain(`https://www.no-ai-act.eu/${target}/`);
      expect(html).toMatch(/interfaccia italiana|Italian interface|interface italienne|italienischen Benutzeroberfläche|interfaz italiana|interface italiana/);
    }
  });
  it('the public logo is copied into the deployment and guarded', () => {
    expect(readFileSync('scripts/copy-notices.mjs', 'utf8')).toContain("'favicon.svg'");
    expect(readFileSync('scripts/ci/verify-dist.mjs', 'utf8')).toContain("'favicon.svg'");
  });
});

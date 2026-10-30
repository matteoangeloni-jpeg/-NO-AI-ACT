import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'parse5';
// @ts-expect-error Shared editorial source.
import { PRESS_COVERAGE, renderPressCoverage, renderPressReferences } from '../src/site/press-coverage.mjs';

const attr = (n: any, key: string) => n.attrs?.find((a: any) => a.name === key)?.value;
const nodes = (n: any): any[] => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const routes = [
  ['it', 'index.html', 'press-kit/index.html'],
  ['en', 'en/index.html', 'en/press-kit/index.html'],
  ['fr', 'fr/index.html', 'fr/dossier-de-presse/index.html'],
  ['de', 'de/index.html', 'de/pressemappe/index.html'],
  ['es', 'es/index.html', 'es/kit-de-prensa/index.html'],
  ['pt', 'pt/index.html', 'pt/kit-de-imprensa/index.html']
];

describe('verified media coverage in six languages', () => {
  it('keeps six distinct original sources with local credited assets and verified dates', () => {
    expect(PRESS_COVERAGE).toHaveLength(6);
    expect(new Set(PRESS_COVERAGE.map((p: any) => p.href)).size).toBe(6);
    expect(PRESS_COVERAGE.slice(0, 3).map((p: any) => p.date)).toEqual(['2026-10-30', '2026-10-26', '2026-10-26']);
    expect(PRESS_COVERAGE.find((p: any) => p.id === 'media-learning').type).toBe('contribution');
    expect(PRESS_COVERAGE.find((p: any) => p.id === 'smartphonology').type).toBe('article');
    expect(PRESS_COVERAGE.find((p: any) => p.id === 'interview').type).toBe('interview');
    for (const p of PRESS_COVERAGE) expect(existsSync(`public/assets/press/${p.image}`)).toBe(true);
  });

  for (const [lang, home, kit] of routes) {
    it(`${lang}: consistent carousel and press-kit links, without embeds or trackers`, () => {
      const html = readFileSync(home, 'utf8');
      const all = nodes(parse(html));
      const section = all.find(n => n.tagName === 'section' && attr(n, 'aria-labelledby') === 'press-title');
      expect(section).toBeTruthy();
      const rendered = nodes(parse(renderPressCoverage(lang, ['it', 'en'].includes(lang) ? '04' : undefined)));
      expect(nodes(section).filter(n => n.tagName === 'li')).toHaveLength(6);
      for (const source of PRESS_COVERAGE) {
        for (const content of [nodes(section), nodes(parse(readFileSync(kit, 'utf8'))), rendered]) {
          const links = content.filter(n => n.tagName === 'a' && attr(n, 'href') === source.href);
          expect(links, `${home}: ${source.href}`).toHaveLength(1);
          expect(attr(links[0], 'hreflang')).toBe(source.language);
        }
      }
      expect(nodes(section).filter(n => n.tagName === 'iframe')).toHaveLength(0);
      for (const img of nodes(section).filter(n => n.tagName === 'img')) {
        expect(attr(img, 'src')).toMatch(/^\/assets\/press\//);
        expect(Number(attr(img, 'width'))).toBeGreaterThan(0);
        expect(Number(attr(img, 'height'))).toBeGreaterThan(0);
      }
      expect(html).toContain('/src/scripts/press-carousel.ts');
      expect(renderPressReferences(lang)).toContain('2026-10-30');
    });
  }
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { LANGUAGE_CODES } from '../src/game/i18n';
import { INVENTORY_DIRS, SITE_LANGUAGE_CODES } from './lib-inventory';
// @ts-expect-error Shared editorial source.
import { TOPICS, topicDir } from '../src/site/eu-topics.mjs';
// @ts-expect-error Shared inventory helper.
import { publicRoutes, languageCode } from '../src/site/route-inventory.mjs';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const config = JSON.parse(read('scripts/seo/routes.config.json'));
const attr = (n: any, name: string) => n.attrs?.find((a: any) => a.name === name)?.value;
function nodes(n: any): any[] { return [n, ...(n.childNodes ?? []).flatMap(nodes)]; }

describe('European website localization, separate from gameplay', () => {
  it('has exactly 13 introductory pages per new language and no phantom translations', () => {
    expect(SITE_LANGUAGE_CODES).toEqual(['it', 'en', 'fr', 'de', 'es', 'pt']);
    expect(LANGUAGE_CODES).toEqual(['it', 'en', 'fr']);
    expect(INVENTORY_DIRS).toHaveLength(146);
    for (const lang of ['de', 'es', 'pt']) {
      const dirs = INVENTORY_DIRS.filter(d => d === lang || d.startsWith(`${lang}/`));
      expect(new Set(dirs)).toEqual(new Set(TOPICS.map((t: any) => topicDir(t, lang))));
      expect(dirs).toHaveLength(13);
    }
  });

  for (const route of publicRoutes(config).filter((r: any) => ['de', 'es', 'pt'].includes(r.lang))) {
    it(`${route.dir}: localized document, readable content and honest game links`, () => {
      const html = read(`${route.dir}/index.html`);
      const all = nodes(parse(html));
      expect(attr(all.find(n => n.tagName === 'html'), 'lang')).toBe(languageCode(route.lang));
      expect(all.filter(n => n.tagName === 'h1')).toHaveLength(1);
      expect(all.filter(n => n.tagName === 'h2').length).toBeGreaterThanOrEqual(6);
      const main = html.split('<main')[1].split('</main>')[0];
      expect(main.replace(/<[^>]+>/g, ' ').split(/\s+/).length).toBeGreaterThan(180);
      const play = all.filter(n => n.tagName === 'a' && attr(n, 'href')?.startsWith('/play/'));
      expect(play.map(n => attr(n, 'href'))).toEqual(['/play/?lang=it', '/play/?lang=en', '/play/?lang=fr']);
      expect(html).not.toMatch(/<script[^>]+src="https?:/);
      expect(html).not.toContain('<form');
      expect(html).not.toContain('TBD');
      expect(html).not.toMatch(/\{(?:FR|EN|DE|ES|PT)\}/);
      expect(html).toContain('https://eur-lex.europa.eu/eli/reg/2024/1689/oj/');
      for (const link of all.filter(n => n.tagName === 'a' && attr(n, 'href')?.startsWith('/en/'))) {
        expect(attr(link, 'hreflang')).toBe('en');
      }
    });
  }

  it('language selectors expose only real counterparts, including self', () => {
    for (const route of publicRoutes(config)) {
      const all = nodes(parse(read(route.dir ? `${route.dir}/index.html` : 'index.html')));
      const selector = all.find(n => n.tagName === 'nav' && attr(n, 'class') === 'locale-links');
      expect(selector, route.dir).toBeTruthy();
      const links = nodes(selector).filter(n => n.tagName === 'a');
      expect(links).toHaveLength(Object.keys(route.group).length);
      for (const [lang, dir] of Object.entries(route.group)) {
        const link = links.find(n => attr(n, 'hreflang') === languageCode(lang));
        const flag = nodes(link).find(n => n.tagName === 'img');
        expect(attr(flag, 'src')).toBe(`/assets/flags/${lang === 'en' ? 'gb' : lang}.png`);
        expect(attr(flag, 'alt')).toBe('');
        expect(attr(link, 'href')).toBe(dir ? `/${dir}/` : '/');
        expect(attr(link, 'aria-current')).toBe(lang === route.lang ? 'page' : undefined);
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
// @ts-expect-error Shared editorial data.
import { PRACTICAL_PAGES } from '../src/site/eu-practical-content.mjs';
// @ts-expect-error Shared public route ownership.
import { TOPICS, topicDir } from '../src/site/eu-topics.mjs';
// @ts-expect-error Shared public inventory.
import { routeGroups } from '../src/site/route-inventory.mjs';

const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const attr = (node: any, key: string) => node.attrs?.find((a: any) => a.name === key)?.value;
const nodes = (node: any): any[] => [node, ...(node.childNodes ?? []).flatMap(nodes)];

describe('Published practical resources, not keyword doorway pages', () => {
  for (const [lang, pages] of Object.entries(PRACTICAL_PAGES) as [string, any][]) {
    for (const [id, page] of Object.entries(pages) as [string, any][]) {
      it(`${lang}/${id}: complete authored resource with real counterparts`, () => {
        const topic = TOPICS.find((t: any) => t[0] === id);
        const dir = topicDir(topic, lang);
        const group = routeGroups(cfg).find((g: any) => g.en === topic[1]);
        expect(Object.keys(group)).toHaveLength(6);
        expect(page.sections).toHaveLength(7);
        expect(page.sections.map((s: string[]) => s[1]).join(' ').split(/\s+/).length).toBeGreaterThan(400);
        expect(page.title.length).toBeLessThanOrEqual(60);
        expect(page.description.length).toBeGreaterThanOrEqual(120);
        expect(page.description.length).toBeLessThanOrEqual(160);
        const html = readFileSync(`${dir}/index.html`, 'utf8');
        const all = nodes(parse(html));
        expect(all.filter(n => n.tagName === 'h1')).toHaveLength(1);
        expect(html).not.toContain('<form');
        expect(html).not.toContain('/play/?lang=de');
        expect(html).not.toContain('/play/?lang=es');
        expect(html).not.toContain('/play/?lang=pt');
        const image = all.find(n => n.tagName === 'img' && attr(n, 'src')?.includes('03-evidence-desk'));
        expect(attr(image, 'width')).toBe('1920');
        expect(attr(image, 'height')).toBe('1080');
        expect(attr(image, 'alt')).toMatch(/3/);
        if (id === 'employment') {
          expect(html).toContain('02024R1689-20260727');
          expect(html).toMatch(/fiktiv|fictici|fictíci/i);
        }
        const hub = readFileSync(`${lang}/${({ de: 'bildung', es: 'educacion', pt: 'educacao' } as Record<string, string>)[lang]}/index.html`, 'utf8');
        expect(hub).toContain(`href="/${dir}/"`);
      });
    }
  }
  it('connects all six education hubs to existing workshop and recruitment owners', () => {
    const groups = routeGroups(cfg);
    for (const lang of ['it', 'en', 'fr', 'de', 'es', 'pt']) {
      const hub = groups.find((g: any) => g.en === 'en/education')[lang];
      const html = readFileSync(`${hub}/index.html`, 'utf8');
      for (const en of ['en/ai-act-classroom-lab', 'en/ai-in-recruitment-and-employment']) {
        const dir = groups.find((g: any) => g.en === en)[lang];
        expect(html).toContain(`${dir.split('/').at(-1)}/`);
      }
    }
  });
});

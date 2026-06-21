import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const itHtml = read('index.html');
const enHtml = read('en/index.html');
const playHtml = read('play/index.html');

const SITE = 'https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/';

describe('public landing — page structure', () => {
  it('the three pages exist', () => {
    expect(existsSync(resolve(root, 'index.html'))).toBe(true);
    expect(existsSync(resolve(root, 'en/index.html'))).toBe(true);
    expect(existsSync(resolve(root, 'play/index.html'))).toBe(true);
  });

  it('vite is configured for the three entry points', () => {
    const cfg = read('vite.config.ts');
    expect(cfg).toContain("'index.html'");
    expect(cfg).toContain("'en/index.html'");
    expect(cfg).toContain("'play/index.html'");
  });

  it('the landings declare the correct lang', () => {
    expect(itHtml).toContain('<html lang="it">');
    expect(enHtml).toContain('<html lang="en">');
  });

  it('the play page keeps the game shell and is not indexed', () => {
    expect(playHtml).toContain('id="game-container"');
    expect(playHtml).toContain('id="mobile-guard"');
    expect(playHtml).toContain('src="/src/main.ts"');
    expect(playHtml).toContain('name="robots" content="noindex"');
  });

  it('the play page does not load the Tally widget', () => {
    expect(playHtml).not.toContain('tally.so');
    expect(playHtml).not.toContain('data-tally-open');
  });
});

describe('public landing — SEO', () => {
  for (const [name, html, canonical] of [
    ['IT', itHtml, SITE],
    ['EN', enHtml, `${SITE}en/`]
  ] as const) {
    it(`${name} has title, description and canonical`, () => {
      expect(html).toMatch(/<title>[^<]*NO AI ACT[^<]*<\/title>/);
      expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(html).toContain(`<link rel="canonical" href="${canonical}"`);
    });

    it(`${name} declares hreflang it/en/x-default`, () => {
      expect(html).toContain(`hreflang="it" href="${SITE}"`);
      expect(html).toContain(`hreflang="en" href="${SITE}en/"`);
      expect(html).toContain(`hreflang="x-default" href="${SITE}"`);
    });

    it(`${name} is marked indexable`, () => {
      expect(html).toContain('name="robots" content="index, follow"');
    });
  }
});

describe('public landing — structured data (JSON-LD)', () => {
  for (const [name, html] of [['IT', itHtml], ['EN', enHtml]] as const) {
    it(`${name} includes the four schema.org types`, () => {
      expect(html).toContain('"@type": "WebSite"');
      expect(html).toContain('"@type": "SoftwareApplication"');
      expect(html).toContain('"@type": "LearningResource"');
      expect(html).toContain('"@type": "FAQPage"');
    });

    it(`${name} JSON-LD blocks are valid JSON`, () => {
      const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
      const blocks = [...html.matchAll(re)];
      expect(blocks.length).toBe(4);
      for (const [, body] of blocks) {
        expect(() => JSON.parse(body)).not.toThrow();
      }
    });

    it(`${name} FAQPage has at least 6 questions`, () => {
      const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
      const faq = [...html.matchAll(re)]
        .map(([, b]) => JSON.parse(b))
        .find((d) => d['@type'] === 'FAQPage');
      expect(faq).toBeDefined();
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
    });
  }
});

describe('public landing — Tally playtest popup', () => {
  for (const [name, html, source] of [
    ['IT', itHtml, 'landing-it'],
    ['EN', enHtml, 'landing-en']
  ] as const) {
    it(`${name} loads the Tally embed script`, () => {
      expect(html).toContain('src="https://tally.so/widgets/embed.js"');
    });

    it(`${name} has a modal popup button for form 44ENVA`, () => {
      expect(html).toContain('data-tally-open="44ENVA"');
      expect(html).toContain('data-tally-layout="modal"');
      expect(html).toContain('data-tally-width="526"');
      expect(html).toContain('data-tally-align-left="1"');
      expect(html).toContain(`data-source="${source}"`);
    });

    it(`${name} passes no personal data to Tally`, () => {
      expect(html).not.toContain('data-email');
      expect(html).not.toContain('data-name=');
      expect(html).not.toMatch(/data-tally-hidden/i);
      expect(html).not.toMatch(/utm_/i);
    });
  }
});

describe('public landing — accessibility & content', () => {
  for (const [name, html] of [['IT', itHtml], ['EN', enHtml]] as const) {
    it(`${name} has a skip link, main landmark and footer`, () => {
      expect(html).toContain('class="skip-link"');
      expect(html).toContain('id="main"');
      expect(html).toContain('<main');
      expect(html).toContain('<footer');
    });

    it(`${name} lists all 11 cases`, () => {
      const items = [...html.matchAll(/<li><span class="file-id">/g)];
      expect(items.length).toBe(11);
    });

    it(`${name} renders 6+ FAQ details in the page body`, () => {
      const details = [...html.matchAll(/<details>/g)];
      expect(details.length).toBeGreaterThanOrEqual(6);
    });

    it(`${name} carries the "not legal advice" disclaimer`, () => {
      expect(html.toLowerCase()).toMatch(/non consulenza legale|not legal advice/);
    });
  }
});

describe('public static files', () => {
  it('robots.txt allows crawling and points to the sitemap', () => {
    const robots = read('public/robots.txt');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain(`Sitemap: ${SITE}sitemap.xml`);
  });

  it('sitemap.xml lists both landing URLs', () => {
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).toContain(`<loc>${SITE}</loc>`);
    expect(sitemap).toContain(`<loc>${SITE}en/</loc>`);
  });

  it('llms.txt exists and references the play URL', () => {
    const llms = read('public/llms.txt');
    expect(llms).toContain('# NO AI ACT');
    expect(llms).toContain(`${SITE}play/`);
  });

  it('the GEO docs exist', () => {
    expect(existsSync(resolve(root, 'docs/NO_AI_ACT_PROJECT_BRIEF.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/TEACHER_QUICK_START.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/LEGAL_DISCLAIMER.md'))).toBe(true);
  });
});

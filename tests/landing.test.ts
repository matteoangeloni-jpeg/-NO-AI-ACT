import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { languageFromQuery } from '../src/game/i18n';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const itHtml = read('index.html');
const enHtml = read('en/index.html');
const playHtml = read('play/index.html');
const landingCss = read('src/styles/landing.css');

const SITE = 'https://www.no-ai-act.eu/';

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
    // noindex keeps the game canvas out of the index, but "follow" lets crawlers
    // traverse its links — and robots.txt must stay crawlable for this to be read.
    expect(playHtml).toContain('name="robots" content="noindex, follow"');
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
    it(`${name} includes five schema.org types (Organization, WebSite, SoftwareApplication, LearningResource, FAQPage)`, () => {
      expect(html).toContain('"@type": "Organization"');
      expect(html).toContain('"@type": "WebSite"');
      expect(html).toContain('"@type": "SoftwareApplication"');
      expect(html).toContain('"@type": "LearningResource"');
      expect(html).toContain('"@type": "FAQPage"');
    });

    it(`${name} JSON-LD blocks are valid JSON`, () => {
      const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
      const blocks = [...html.matchAll(re)];
      expect(blocks.length).toBe(5);
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

describe('public landing — Tally playtest popup (pre-game)', () => {
  it('both landings load the Tally embed script', () => {
    expect(itHtml).toContain('src="https://tally.so/widgets/embed.js"');
    expect(enHtml).toContain('src="https://tally.so/widgets/embed.js"');
  });

  it('IT landing keeps the existing IT pre-game form (44ENVA), unchanged', () => {
    expect(itHtml).toContain('data-tally-open="44ENVA"');
    expect(itHtml).toContain('data-tally-layout="modal"');
    expect(itHtml).toContain('data-tally-width="526"');
    expect(itHtml).toContain('data-source="landing-it"');
  });

  it('EN landing uses the EN pre-game form (5BryXb) with its full URL', () => {
    expect(enHtml).toContain('https://tally.so/r/5BryXb');
    expect(enHtml).toContain('data-tally-open="5BryXb"');
    expect(enHtml).toContain('data-tally-layout="modal"');
    expect(enHtml).toContain('data-source="landing-en"');
    // the EN landing must NOT reuse the IT pre-game form id
    expect(enHtml).not.toContain('44ENVA');
  });

  for (const [name, html] of [['IT', itHtml], ['EN', enHtml]] as const) {
    it(`${name} passes no personal data to Tally`, () => {
      expect(html).not.toContain('data-email');
      expect(html).not.toContain('data-name=');
      expect(html).not.toContain('data-school');
      expect(html).not.toContain('data-class');
      expect(html).not.toMatch(/data-tally-hidden/i);
      expect(html).not.toMatch(/utm_/i);
    });

    it(`${name} Tally URLs carry no query string / gameplay data`, () => {
      const tallyUrls = [...html.matchAll(/https:\/\/tally\.so\/[^\s"']+/g)].map(([u]) => u);
      for (const u of tallyUrls) {
        expect(u).not.toContain('?');
      }
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
  it('robots.txt allows crawling, points to the sitemap and does not block /play/', () => {
    const robots = read('public/robots.txt');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    // robots advertises the two language sitemaps directly (GSC reads them reliably).
    expect(robots).toContain(`Sitemap: ${SITE}sitemap-it.xml`);
    expect(robots).toContain(`Sitemap: ${SITE}sitemap-en.xml`);
    // /play/ must stay crawlable so its noindex meta can be read.
    expect(robots).not.toMatch(/^\s*Disallow:\s*\/play\//m);
    // robots must hold robots directives only — no stray sitemap-xml leakage.
    expect(robots).not.toMatch(/monthly\s+[\d.]/);
    expect(robots).not.toContain('<urlset');
    expect(robots).not.toContain('<loc>');
  });

  it('sitemap.xml is a valid sitemap index pointing at the two language child sitemaps', () => {
    const sitemap = read('public/sitemap.xml');
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    // it is now a sitemap index, not a direct urlset (GSC compatibility).
    expect(sitemap).toContain('<sitemapindex');
    expect(sitemap).toContain('</sitemapindex>');
    expect(sitemap).not.toContain('<urlset');
    expect(sitemap).not.toContain('/play/');
    const children = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l);
    expect(children).toEqual([`${SITE}sitemap-it.xml`, `${SITE}sitemap-en.xml`]);
  });

  it('the child sitemaps list exactly the 42 indexable public pages, nothing else', () => {
    const it = read('public/sitemap-it.xml');
    const en = read('public/sitemap-en.xml');
    for (const child of [it, en]) {
      expect(child).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(child).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(child).toContain('<urlset');
      expect(child).toContain('</urlset>');
      expect(child).not.toContain('/play/');
      expect(child).not.toMatch(/localhost|127\.0\.0\.1|example\.com/);
      // kept deliberately minimal — no hreflang alternates, changefreq or priority.
      expect(child).not.toContain('xhtml:link');
      expect(child).not.toContain('changefreq');
      expect(child).not.toContain('priority');
    }
    const locs = [it, en].flatMap((child) => [...child.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l));
    // same set as the original 42-URL sitemap, split by language (order may differ).
    expect(new Set(locs)).toEqual(new Set([
      SITE, `${SITE}en/`, `${SITE}come-funziona/`, `${SITE}per-docenti/`,
      `${SITE}ai-act-serious-game/`, `${SITE}privacy-by-design/`, `${SITE}en/how-it-works/`,
      `${SITE}en/for-educators/`, `${SITE}en/ai-act-serious-game/`, `${SITE}en/privacy-by-design/`,
      `${SITE}educazione/`, `${SITE}ai-act-per-docenti/`, `${SITE}alfabetizzazione-ai/`,
      `${SITE}guida-ai-act/`, `${SITE}categorie-rischio-ai-act/`, `${SITE}pratiche-vietate-ai-act/`,
      `${SITE}sistemi-ai-ad-alto-rischio/`, `${SITE}obblighi-trasparenza-ai-act/`,
      `${SITE}ai-generativa-e-gpai/`, `${SITE}apprendimento-privacy-consapevole/`,
      `${SITE}serious-game-regolazione-ai/`, `${SITE}attivita-didattiche/`,
      `${SITE}lezione-introduzione-ai-act/`, `${SITE}glossario/`, `${SITE}en/education/`,
      `${SITE}en/ai-act-for-teachers/`, `${SITE}en/ai-literacy/`, `${SITE}en/eu-ai-act-guide/`,
      `${SITE}en/ai-act-risk-categories/`, `${SITE}en/prohibited-ai-practices/`,
      `${SITE}en/high-risk-ai-systems/`, `${SITE}en/transparency-obligations/`,
      `${SITE}en/general-purpose-ai/`, `${SITE}en/privacy-conscious-learning/`,
      `${SITE}en/serious-games-for-ai-regulation/`, `${SITE}en/digital-citizenship-ai-regulation/`,
      `${SITE}en/classroom-activities/`, `${SITE}en/lesson-plan-introduction-to-the-ai-act/`,
      `${SITE}en/lesson-plan-risk-based-approach/`, `${SITE}en/lesson-plan-transparency-and-users/`,
      `${SITE}en/glossary/`, `${SITE}en/faq/`
    ]));
    expect(locs).toHaveLength(42);
    for (const loc of locs) {
      expect(loc.startsWith(SITE)).toBe(true);
      expect(loc).not.toContain('?');
      expect(loc.endsWith('/')).toBe(true);
    }
  });

  it('llms.txt is complete: version, scope, privacy and reachable links', () => {
    const llms = read('public/llms.txt');
    const lower = llms.toLowerCase();
    expect(llms).toContain('# NO AI ACT');
    expect(llms).toContain('v1.0.0');
    expect(llms).toContain('11 playable cases');
    expect(lower).toContain('not legal advice');
    expect(lower).toContain('no backend');
    expect(lower).toContain('no account');
    expect(lower).toContain('no personal data collection');
    expect(llms).toContain('Tally');
    expect(llms).toContain(`${SITE}play/`);
    expect(llms).toContain(`${SITE}en/`);
    expect(llms).toContain('github.com/matteoangeloni-jpeg/-NO-AI-ACT');
    expect(llms).toContain('releases/tag/v1.0.0');
  });

  it('the GEO docs exist', () => {
    expect(existsSync(resolve(root, 'docs/NO_AI_ACT_PROJECT_BRIEF.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/TEACHER_QUICK_START.md'))).toBe(true);
    expect(existsSync(resolve(root, 'docs/LEGAL_DISCLAIMER.md'))).toBe(true);
  });
});

describe('public landing — language handoff to the game', () => {
  it('the IT landing links to /play/?lang=it', () => {
    expect(itHtml).toContain('href="./play/?lang=it"');
  });

  it('the EN landing links to /play/?lang=en', () => {
    expect(enHtml).toContain('href="../play/?lang=en"');
  });

  it('languageFromQuery honours only known codes', () => {
    expect(languageFromQuery('?lang=en')).toBe('en');
    expect(languageFromQuery('?lang=it')).toBe('it');
    expect(languageFromQuery('?lang=fr')).toBeNull();
    expect(languageFromQuery('?lang=')).toBeNull();
    expect(languageFromQuery('?foo=bar')).toBeNull();
    expect(languageFromQuery('')).toBeNull();
  });
});

describe('public landing — footer author credit', () => {
  it('the IT footer credits Matteo Angeloni', () => {
    expect(itHtml).toContain('Matteo Angeloni');
    expect(itHtml).toContain('Ideato e sviluppato da Matteo Angeloni');
  });

  it('the EN footer credits Matteo Angeloni', () => {
    expect(enHtml).toContain('Matteo Angeloni');
    expect(enHtml).toContain('Designed and developed by Matteo Angeloni');
  });
});

describe('public landing — accessible motion', () => {
  it('the CSS respects prefers-reduced-motion (both directions)', () => {
    expect(landingCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(landingCss).toContain('@media (prefers-reduced-motion: no-preference)');

    // the reduce block must actually neutralise motion, not merely exist
    const reduceIndex = landingCss.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(reduceIndex).toBeGreaterThan(-1);
    const reduceSlice = landingCss.slice(reduceIndex, reduceIndex + 500);
    expect(reduceSlice).toMatch(/animation:\s*none/);
    expect(reduceSlice).toMatch(/transition:\s*none/);
  });

  it('the disclaimer stamp is not rotated/skewed', () => {
    // inspect just the .stamp rule (up to its closing brace), robust to reformatting
    const start = landingCss.indexOf('.stamp {');
    const stampBlock = landingCss.slice(start, landingCss.indexOf('}', start));
    expect(stampBlock).not.toMatch(/transform:\s*(rotate|skew)/);
  });
});

const CF_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
const CF_TOKEN = '7c85578fc8ad4488a54c6bc670a10dcf';

describe('public pages — Cloudflare Web Analytics', () => {
  for (const [name, html] of [['IT', itHtml], ['EN', enHtml], ['play', playHtml]] as const) {
    it(`${name} loads the Cloudflare beacon with the configured token, before </body>`, () => {
      expect(html).toContain(CF_SRC);
      expect(html).toContain(CF_TOKEN);
      expect(html.indexOf(CF_SRC)).toBeGreaterThan(-1);
      expect(html.indexOf(CF_SRC)).toBeLessThan(html.indexOf('</body>'));
    });

    it(`${name} ships no Google Analytics, ad pixels or personal-data attributes`, () => {
      expect(html).not.toMatch(/googletagmanager\.com|google-analytics\.com|gtag\(|dataLayer/);
      expect(html).not.toMatch(/connect\.facebook\.net|facebook\.com\/tr|fbq\(|doubleclick\.net/);
      expect(html).not.toMatch(/data-email|data-name=|data-school|data-class/);
    });
  }

  it('the play page beacon is a plain page view, outside the Phaser module', () => {
    expect(playHtml).toContain(CF_SRC);
    // standalone tag, not imported by the game entrypoint, and no custom events
    expect(playHtml).not.toMatch(/import[^;]*cloudflareinsights/);
    expect(playHtml).not.toMatch(/trackEvent|"event"\s*:/);
  });
});

describe('public landing — analytics privacy wording', () => {
  it('the IT privacy text cites Cloudflare and separates page stats from game data', () => {
    expect(itHtml).toContain('Cloudflare Web Analytics');
    expect(itHtml).toMatch(/statistiche aggregate/i);
    expect(itHtml).toMatch(/non invia risultati, risposte o report/i);
  });

  it('the EN privacy text cites Cloudflare and separates page stats from game data', () => {
    expect(enHtml).toContain('Cloudflare Web Analytics');
    expect(enHtml).toMatch(/aggregate, privacy-friendly statistics/i);
    expect(enHtml).toMatch(/does not send results, answers or inspection reports/i);
  });

  it('llms.txt mentions Cloudflare Web Analytics without false "no analytics" claims', () => {
    const llms = read('public/llms.txt');
    expect(llms).toContain('Cloudflare Web Analytics');
    expect(llms).not.toMatch(/no remote analytics/i);
  });
});

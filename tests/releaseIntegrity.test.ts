import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * RELEASE INTEGRITY GUARD (v2 repair).
 *
 * Born from a real production audit: current pages claimed 11 and 13 cases at
 * the same time, release metadata claimed a tag that did not exist, and the
 * Organization JSON-LD carried an unverifiable LinkedIn profile and an
 * unsupported publication date. This suite makes each of those regressions
 * impossible to reintroduce silently:
 *   1. current case-count claims must equal release.config.json playableCases
 *      on every shipped page (source AND dist when built);
 *   2. visible FAQs and FAQPage JSON-LD must give the same answers;
 *   3. description / og:description / twitter:description must agree on counts;
 *   4. sameAs entries are allowlisted (repository only);
 *   5. structured-data dates must be evidenced (no datePublished; dateModified
 *      pinned to the documented content revision);
 *   6. no release tag is claimed before it exists (planned vs last tagged).
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('release.config.json'));
const N: number = cfg.playableCases;

/** Legacy dirs that are tracked but never built or shipped (no vite input). */
const UNSHIPPED = ['about-us', 'en/about-us', 'en/changelog', 'en/research-methodology', 'it'];

function shippedHtml(base: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const e of readdirSync(resolve(root, dir))) {
      const rel = join(dir, e);
      if (['node_modules', 'dist', '.git', 'scripts', 'tests', 'docs', 'src', 'public'].includes(rel)) continue;
      if (base === '.' && UNSHIPPED.some((u) => rel === u || rel.startsWith(`${u}/`))) continue;
      const abs = resolve(root, rel);
      if (statSync(abs).isDirectory()) walk(rel);
      else if (e.endsWith('.html')) out.push(rel);
    }
  };
  walk(base);
  return out;
}

/** Current-state 11-claims (any language/spelling) near a case/system noun. */
const FORBIDDEN = /\b(11|undici|eleven)\b[^<.\n]{0,40}\b(cases|casi|case files|systems|sistemi|fascicoli)\b/i;

describe('case-count consistency — source tree', () => {
  const pages = shippedHtml('.');

  it('scans a meaningful shipped-page set', () => {
    expect(pages.length).toBeGreaterThanOrEqual(57); // 56 public pages + play shell
  });

  it(`no shipped page presents 11 as the current case count (authoritative: ${N})`, () => {
    const offenders: string[] = [];
    for (const p of pages) {
      const m = read(p).match(FORBIDDEN);
      if (m) offenders.push(`${p}: "${m[0]}"`);
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('llms.txt states the authoritative count and no 11-claim', () => {
    const llms = read('public/llms.txt');
    expect(llms).toContain(`${N} playable cases`);
    expect(llms).not.toMatch(FORBIDDEN);
  });

  it('both landings state the authoritative count in body, meta and JSON-LD', () => {
    for (const [p, words] of [['index.html', [`${N} casi`, 'Tredici casi']], ['en/index.html', [`${N} cases`, 'Thirteen cases']]] as const) {
      const html = read(p);
      for (const w of words) expect(html, `${p}: ${w}`).toContain(w);
    }
  });

  it('README may keep 7/11 only in explicitly historical (v0.x/v1.0) context', () => {
    for (const line of read('README.md').split('\n')) {
      if (FORBIDDEN.test(line)) {
        expect(/v0\.\d|v1\.0|storico|historical/i.test(line), `README non-historical 11-claim: ${line.trim()}`).toBe(true);
      }
    }
  });
});

describe('case-count consistency — built dist (when present)', () => {
  const hasDist = existsSync(resolve(root, 'dist/index.html'));
  it.skipIf(!hasDist)('no built page presents 11 as the current case count', () => {
    const offenders: string[] = [];
    const walk = (dir: string): void => {
      for (const e of readdirSync(resolve(root, dir))) {
        const rel = join(dir, e);
        if (statSync(resolve(root, rel)).isDirectory()) walk(rel);
        else if (e.endsWith('.html')) {
          const m = read(rel).match(FORBIDDEN);
          if (m) offenders.push(`${rel}: "${m[0]}"`);
        }
      }
    };
    walk('dist');
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

describe('FAQ integrity — JSON-LD answers equal the visible answers', () => {
  const FAQ_PAGES = ['index.html', 'en/index.html', 'per-docenti/index.html',
    'en/for-educators/index.html', 'privacy-by-design/index.html', 'en/privacy-by-design/index.html', 'en/faq/index.html'];
  const norm = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  for (const p of FAQ_PAGES) {
    it(`${p}: every schema Q/A pair matches a visible <details> pair`, () => {
      const html = read(p);
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, b]) => JSON.parse(b));
      const faq = blocks.find((d) => d['@type'] === 'FAQPage');
      expect(faq, 'FAQPage present').toBeDefined();
      const visible = [...html.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="answer">([\s\S]*?)<\/div>/g)]
        .map(([, q, a]) => [norm(q), norm(a)] as const);
      expect(faq.mainEntity.length).toBe(visible.length);
      for (const q of faq.mainEntity) {
        const match = visible.find(([vq]) => vq === norm(q.name));
        expect(match, `visible question for "${q.name}"`).toBeDefined();
        // schema and visible answers must be the SAME text (tags stripped):
        // schema must never say something the page does not show, or vice versa
        expect(norm(q.acceptedAnswer.text), `answer for "${q.name}"`).toBe(match![1]);
      }
    });
  }
});

describe('meta agreement — description, og:description, twitter:description', () => {
  const countIn = (text: string | null): number[] =>
    text ? [...text.matchAll(/\b(\d+)\s+(?:[a-zà-ù-]+\s+){0,3}?(?:casi|cases|sistemi|systems|case files|fascicoli)/gi)].map(([, n]) => Number(n)) : [];

  it('every shipped page: any case count mentioned in any description equals playableCases', () => {
    const offenders: string[] = [];
    for (const p of shippedHtml('.')) {
      const html = read(p);
      const fields = [
        html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null,
        html.match(/<meta property="og:description" content="([^"]*)"/)?.[1] ?? null,
        html.match(/<meta name="twitter:description" content="([^"]*)"/)?.[1] ?? null
      ];
      for (const f of fields) {
        for (const n of countIn(f)) if (n !== N) offenders.push(`${p}: "${f}"`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('landings: the three description fields all mention the SAME count', () => {
    for (const p of ['index.html', 'en/index.html']) {
      const html = read(p);
      const nums = [
        countIn(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null),
        countIn(html.match(/<meta property="og:description" content="([^"]*)"/)?.[1] ?? null),
        countIn(html.match(/<meta name="twitter:description" content="([^"]*)"/)?.[1] ?? null)
      ];
      for (const list of nums) {
        expect(list.length, `${p}: each description states the count`).toBeGreaterThanOrEqual(1);
        for (const n of list) expect(n, p).toBe(N);
      }
    }
  });
});

describe('structured-data integrity — sameAs allowlist and evidenced dates', () => {
  const SAME_AS_ALLOWED = [cfg.repository];

  it('every sameAs entry on every shipped page is allowlisted (repository only)', () => {
    const offenders: string[] = [];
    for (const p of shippedHtml('.')) {
      const html = read(p);
      for (const [, block] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        const data = JSON.parse(block);
        const docs = Array.isArray(data) ? data : [data];
        for (const d of docs) {
          for (const url of d.sameAs ?? []) {
            if (!SAME_AS_ALLOWED.includes(url)) offenders.push(`${p}: ${url}`);
          }
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('no unverified social profiles anywhere in shipped HTML', () => {
    for (const p of shippedHtml('.')) {
      expect(read(p), p).not.toMatch(/linkedin\.com|twitter\.com\/[a-z]|facebook\.com\/(?!tr)[a-z]|instagram\.com/i);
    }
  });

  it('no datePublished (unsupported: repo history begins 2026-06-10); dateModified pinned to the documented revision', () => {
    for (const p of shippedHtml('.')) {
      const html = read(p);
      expect(html, `${p}: datePublished must not be claimed without evidence`).not.toContain('datePublished');
      for (const [, d] of html.matchAll(/"dateModified": "([^"]+)"/g)) {
        expect(d.startsWith(cfg.contentLastReviewed), `${p}: dateModified ${d} != contentLastReviewed ${cfg.contentLastReviewed}`).toBe(true);
      }
    }
  });
});

describe('README current-state truthfulness (release closure)', () => {
  const readme = read('README.md');
  const lines = readme.split('\n');
  const HISTORICAL = /v0\.\d|v1\.0|storico|historical/i;

  it('no stale case-count claim outside explicitly historical context', () => {
    const STALE = [/\b(7|seven)\s+playable\s+cases\b/i, /\b11\s+playable\s+cases\b/i, /\b11\s+casi\s+giocabili\b/i];
    const offenders: string[] = [];
    for (const line of lines) {
      for (const re of STALE) {
        if (re.test(line) && !HISTORICAL.test(line)) offenders.push(line.trim());
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('no "verso la 2.0" roadmap language: 2.0 code is complete on main', () => {
    expect(readme).not.toMatch(/verso la 2\.0/i);
  });

  it('every "latest tagged release" statement names the real one', () => {
    for (const line of lines) {
      if (/ultima release (?:effettivamente )?taggata|last(?:\s+actually)?\s+tagged release/i.test(line)) {
        expect(line, line.trim()).toContain(cfg.lastTaggedRelease);
      }
    }
    // and the statement must exist in the current-state section
    expect(readme).toContain(`**Ultima release effettivamente taggata**: \`${cfg.lastTaggedRelease}\``);
  });

  it('v1.0.0 is never presented as the latest tagged release', () => {
    expect(readme).not.toMatch(/v1\.0\.0[^\n]*ultima release taggata/i);
    expect(readme).not.toMatch(/ultima release taggata[^\n]*v1\.0\.0/i);
  });

  it('the Stato release section references the current release notes, not v1.0.0', () => {
    const m = readme.match(/## <a name="stato-release"><\/a>Stato release([\s\S]*?)(?=\n## |$)/);
    expect(m, 'Stato release section present').toBeTruthy();
    expect(m![1]).toContain(`RELEASE_NOTES_${cfg.plannedReleaseTag}.md`);
    expect(m![1]).not.toContain('RELEASE_NOTES_v1.0.0.md');
    expect(m![1]).toContain('OWNER_ACTIONS_2_0.md');
  });

  it('v2.0.0 is never stated as already tagged, released, published or live', () => {
    const offenders: string[] = [];
    for (const line of lines) {
      if (/v2\.0\.0/.test(line) && /\b(taggat\w+|rilasciat\w+|pubblicat\w+|tagged|released|published|live)\b/i.test(line)) {
        if (!/non ancora|not yet|previsto|planned|pending|nessun tag/i.test(line)) offenders.push(line.trim());
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('the current-state list derives from release.config.json', () => {
    expect(readme).toContain(`**Tag pianificato**: \`${cfg.plannedReleaseTag}\` — **non ancora pubblicato**`);
    expect(readme).toContain(`**Casi giocabili**: ${N}`);
    expect(readme).toContain(`**URL pubblici**: ${cfg.publicUrls.total} (${cfg.publicUrls.it} IT + ${cfg.publicUrls.en} EN)`);
    expect(readme).toContain('**DOI**: non ancora disponibile');
    expect(readme).toContain('**Efficacia didattica**: non ancora validata empiricamente');
    expect(readme).toContain(`${N} playable cases`); // English summary
  });
});

describe('release/tag truthfulness — planned vs actually tagged', () => {
  it('config separates package version, planned tag and last actually tagged release', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(cfg.plannedReleaseTag).toBe(`v${pkg.version}`);
    expect(cfg.lastTaggedRelease).toBeTruthy();
    expect(cfg.lastTaggedRelease).not.toBe(cfg.plannedReleaseTag);
  });

  it('while the planned tag is unpublished, no doc links it as an existing release', () => {
    for (const p of ['public/llms.txt', 'README.md']) {
      expect(read(p), `${p} must not claim releases/tag/${cfg.plannedReleaseTag}`)
        .not.toContain(`releases/tag/${cfg.plannedReleaseTag}`);
    }
    expect(read('public/llms.txt')).toContain(`releases/tag/${cfg.lastTaggedRelease}`);
  });

  it('owner actions no longer hardcode the superseded tag target 9905338', () => {
    const doc = read('docs/OWNER_ACTIONS_2_0.md');
    expect(doc).not.toMatch(/target = commit `9905338`/);
    expect(doc).toContain('Do NOT tag `9905338`');
    expect(doc).toContain('fix/v2-release-integrity');
  });
});

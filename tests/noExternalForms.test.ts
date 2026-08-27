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
  it('the only external URLs in game code are the declared institutional ones', () => {
    // Prima questo test vietava qualunque URL esterno scritto dentro
    // window.open(). Il divieto era cieco in due modi: passava un URL messo in
    // una variabile, e non diceva quali destinazioni fossero accettabili.
    // Ora ogni indirizzo assoluto presente nel codice di gioco deve comparire
    // nell'allowlist di release.config.json — variabili comprese.
    const allow: string[] = JSON.parse(read('release.config.json')).externalLinkAllowlist ?? [];
    const own = /^https?:\/\/(www\.)?no-ai-act\.eu/;
    const found = new Set<string>();
    for (const f of walk('src').filter((x) => x.endsWith('.ts'))) {
      for (const [url] of read(f).matchAll(/https?:\/\/[^\s'"`)]+/g)) {
        const clean = url.replace(/[.,;]+$/, '');
        // I template letterali non sono indirizzi: contengono un'espressione.
        if (clean.includes('${')) continue;
        if (!own.test(clean)) found.add(clean);
      }
    }
    // Gli endpoint dei provider opzionali sono dichiarati a parte: non sono link
    // che il gioco apre, sono capacita' disattivate. Vanno elencati, non nascosti.
    const analytics: string[] = Object.values(
      JSON.parse(read('release.config.json')).optionalAnalyticsEndpoints ?? {}
    ).filter((v): v is string => typeof v === 'string' && v.startsWith('http'));
    const declared = [...allow, ...analytics];
    const unlisted = [...found].filter((u) => !declared.includes(u));
    expect(unlisted, 'indirizzo esterno non dichiarato in externalLinkAllowlist').toEqual([]);
  });

  it('every allowlisted external URL is actually reachable from the game', () => {
    // L'allowlist non deve diventare un elenco di permessi dimenticati:
    // ciò che non è più usato va tolto.
    const allow: string[] = JSON.parse(read('release.config.json')).externalLinkAllowlist ?? [];
    const src = walk('src').filter((f) => f.endsWith('.ts')).map(read).join('\n');
    const unused = allow.filter((u) => !src.includes(u));
    expect(unused, "voce dell'allowlist non più usata dal gioco").toEqual([]);
  });

  it('with no configuration the production build sends nothing anywhere', () => {
    // La protezione vera non e' vietare la stringa: e' che il provider di
    // default in produzione sia off. Gli endpoint dichiarati in
    // optionalAnalyticsEndpoints restano codice morto finche' nessuno li
    // configura, e il workflow di deploy non imposta alcuna VITE_.
    const src = read('src/game/systems/AnalyticsSystem.ts');
    expect(src).toContain("return config.dev ? 'console' : 'off';");
    const wf = walk('.github/workflows').map(read).join('\n');
    expect(wf, 'il deploy non deve configurare provider di analytics').not.toMatch(/VITE_ANALYTICS_PROVIDER|VITE_PLAUSIBLE|VITE_UMAMI/);
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

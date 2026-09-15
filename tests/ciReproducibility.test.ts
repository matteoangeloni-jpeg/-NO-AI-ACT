import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * CI-REPRODUCIBILITY GUARD.
 *
 * The browser smokes once depended on an uncommitted `npm install --no-save
 * playwright`, and the Pages workflow never executed them — so "green CI"
 * did not actually cover the browser gates. This suite pins the repair:
 * Playwright is a committed devDependency, the smoke npm scripts exist, and
 * the deploy workflow installs Chromium and runs smoke:all BEFORE the Pages
 * artifact is uploaded (a smoke failure must block deployment).
 *
 * Checks are substring/structure based on purpose — not coupled to
 * formatting or whitespace of the workflow file.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));
const workflow = read('.github/workflows/deploy.yml');

describe('browser smokes are reproducible from a clean clone', () => {
  it('playwright is a committed devDependency (no --no-save install needed)', () => {
    expect(pkg.devDependencies.playwright).toBeTruthy();
  });

  /**
   * L'elenco degli smoke si LEGGE dall'orchestratore invece di essere
   * ricopiato qui: prima era trascritto, e aggiungerne uno lasciava il
   * controllo fermo ai tre di prima senza che nulla diventasse rosso.
   */
  const orchestrator = read('scripts/smoke/run-all.mjs');
  const declaredSmokes = [...orchestrator.matchAll(/'([a-z-]+-smoke\.mjs)'/g)].map((m) => m[1]);

  it('l\'orchestratore dichiara almeno gli smoke storici', () => {
    expect(declaredSmokes.length, 'nessuno smoke dichiarato in run-all.mjs?').toBeGreaterThanOrEqual(3);
    for (const smoke of ['gameplay-smoke.mjs', 'keyboard-smoke.mjs', 'layout-smoke.mjs']) {
      expect(declaredSmokes, `l'orchestratore non esegue più ${smoke}`).toContain(smoke);
    }
  });

  it('ogni smoke dichiarato è un file committato e ha il suo script npm', () => {
    for (const smoke of declaredSmokes) {
      expect(existsSync(resolve(root, 'scripts/smoke', smoke)), `${smoke} non è nel repository`).toBe(true);
      const name = `smoke:${smoke.replace('-smoke.mjs', '')}`;
      expect(pkg.scripts[name], `manca lo script npm ${name}`).toContain(`scripts/smoke/${smoke}`);
    }
  });

  it('smoke:all punta all\'orchestratore committato', () => {
    expect(pkg.scripts['smoke:all']).toContain('scripts/smoke/run-all.mjs');
  });
});

describe('the Pages workflow actually enforces the browser smokes', () => {
  it('installs the Playwright Chromium browser after npm ci', () => {
    expect(workflow).toMatch(/playwright install[^\n]*chromium/);
    expect(workflow.indexOf('npm ci')).toBeLessThan(workflow.search(/playwright install[^\n]*chromium/));
  });

  it('runs smoke:all after the build + dist verification', () => {
    expect(workflow).toContain('npm run smoke:all');
    expect(workflow.indexOf('npm run build')).toBeLessThan(workflow.indexOf('npm run smoke:all'));
    expect(workflow.indexOf('npm run verify:dist')).toBeLessThan(workflow.indexOf('npm run smoke:all'));
  });

  it('smokes run BEFORE the Pages artifact upload, so a failure blocks deploy', () => {
    const upload = workflow.indexOf('upload-pages-artifact');
    expect(upload).toBeGreaterThan(-1);
    expect(workflow.indexOf('npm run smoke:all')).toBeLessThan(upload);
    expect(workflow.search(/playwright install[^\n]*chromium/)).toBeLessThan(upload);
  });
});

/**
 * NODE-VERSION GUARD.
 *
 * The deploy workflow picks its Node from `.nvmrc` (node-version-file), so
 * `.nvmrc` is the single place that decides which interpreter builds and
 * tests the site. Nothing tied it to what the toolchain actually requires:
 * when vitest moved to a major that needs Node >= 22.12, an `.nvmrc` still
 * saying 20 would have failed only in CI, at install time, with an error
 * about a package nobody had touched.
 *
 * This reads the `engines.node` ranges the installed tools declare and
 * checks `.nvmrc` against them, so the requirement is derived from the
 * dependencies instead of transcribed next to them.
 */
describe('the Node version in .nvmrc satisfies the toolchain', () => {
  const nvmrc = read('.nvmrc').trim();
  const [nvmMajor, nvmMinor] = nvmrc.split('.').map(Number);

  /**
   * True when the `.nvmrc` line satisfies `range`.
   *
   * Accetta le versioni parziali che npm ammette (`^24`, `>=26`, `22.12`):
   * la prima stesura pretendeva major.minor.patch e scartava in silenzio
   * ogni alternativa scritta diversamente, il che avrebbe potuto far
   * fallire il guard su un .nvmrc in realtà valido. Un'alternativa che non
   * si riesce a leggere non viene ignorata: fa fallire il test, con il
   * testo che non è stato capito.
   */
  const satisfies = (range: string): boolean =>
    range.split('||').some((alt) => {
      const m = alt.trim().match(/^([\^>=~]*)\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?$/);
      expect(m, `alternativa engines.node non riconosciuta: "${alt.trim()}"`).not.toBeNull();
      const op = m![1];
      const floorMajor = Number(m![2]);
      const floorMinor = Number(m![3] ?? 0);
      // ">=X.Y.Z" è aperto verso l'alto; "^X.Y.Z" e "~X.Y.Z" restano sul major X.
      if (op.includes('>')) {
        if (nvmMajor > floorMajor) return true;
        return nvmMajor === floorMajor && (nvmMinor === undefined || nvmMinor >= floorMinor);
      }
      if (nvmMajor !== floorMajor) return false;
      return nvmMinor === undefined || nvmMinor >= floorMinor;
    });

  const engines = (name: string): string =>
    JSON.parse(read(`node_modules/${name}/package.json`)).engines?.node ?? '';

  it('.nvmrc holds a plain version the workflow can resolve', () => {
    expect(nvmrc, '.nvmrc must be a version like "22" or "22.12", not a range or an alias').toMatch(
      /^\d+(\.\d+){0,2}$/
    );
  });

  for (const tool of ['vite', 'vitest']) {
    it(`Node ${nvmrc} satisfies the engines range of ${tool}`, () => {
      const range = engines(tool);
      expect(range, `${tool} declares no engines.node`).not.toBe('');
      expect(satisfies(range), `.nvmrc says ${nvmrc}, ${tool} wants ${range}`).toBe(true);
    });
  }

  it('the deploy workflow reads its Node from .nvmrc, not from a literal', () => {
    expect(workflow).toContain('node-version-file: .nvmrc');
    expect(workflow, 'a hardcoded node-version would silently outrank .nvmrc').not.toMatch(
      /node-version:\s*['"]?\d/
    );
  });
});

/**
 * AUDIT DEI METADATI PUBBLICI (ticket Q14).
 *
 * La suite release-integrity impedisce che un conteggio di casi sbagliato
 * ricompaia in una pagina, in un README o nel bundle. Non poteva vedere
 * l'unico posto in cui "11 casi" è sopravvissuto per mesi: la descrizione
 * del repository su GitHub, che non è un file.
 *
 * Il controllo di rete non può stare nel gate di build — né la build né i
 * test devono dipendere da una chiamata a GitHub — quindi qui si verifica
 * che lo strumento esista, sia invocabile e ricavi i valori attesi dal
 * repository invece di ripeterli.
 */
describe('esiste uno strumento per i metadati che nessun file può guardare', () => {
  const script = read('scripts/ci/audit-metadata.mjs');

  it('è committato e ha il suo script npm', () => {
    expect(pkg.scripts['audit:metadata']).toContain('scripts/ci/audit-metadata.mjs');
  });

  it('resta FUORI dal gate di build: fa rete, e la build non deve dipenderne', () => {
    const workflow = read('.github/workflows/deploy.yml');
    expect(workflow, 'un gate che chiama GitHub fallisce quando GitHub è lento').not.toContain('audit:metadata');
  });

  it('senza token non fallisce: tace ed esce pulito', () => {
    expect(script).toContain('SALTATO');
    expect(script).toMatch(/process\.exit\(0\)/);
  });

  it('il conteggio atteso è LETTO da release.config.json, non ricopiato', () => {
    expect(script).toContain('cfg.playableCases');
    expect(script, 'un numero scritto qui sarebbe la stessa trappola di prima').not.toMatch(/=== 13|!== 13/);
  });

  it('segnala i refusi nei topic senza vietare un topic nuovo', () => {
    expect(script, 'un elenco chiuso fallirebbe al primo topic legittimo aggiunto').toContain('distance(t, k) <= 2');
  });

  it('confronta anche la licenza che GitHub riconosce con quella dichiarata', () => {
    expect(script).toContain('meta.license');
    expect(script).toContain('cfg.licenses?.code');
  });
});

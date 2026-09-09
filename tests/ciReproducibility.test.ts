import { readFileSync } from 'node:fs';
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

  it('all four smoke npm scripts exist and run the committed files', () => {
    expect(pkg.scripts['smoke:gameplay']).toContain('scripts/smoke/gameplay-smoke.mjs');
    expect(pkg.scripts['smoke:keyboard']).toContain('scripts/smoke/keyboard-smoke.mjs');
    expect(pkg.scripts['smoke:layout']).toContain('scripts/smoke/layout-smoke.mjs');
    expect(pkg.scripts['smoke:all']).toContain('scripts/smoke/run-all.mjs');
  });

  it('the orchestrator the scripts point at is committed', () => {
    const orchestrator = read('scripts/smoke/run-all.mjs');
    for (const smoke of ['gameplay-smoke.mjs', 'keyboard-smoke.mjs', 'layout-smoke.mjs']) {
      expect(orchestrator, `orchestrator runs ${smoke}`).toContain(smoke);
    }
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

  /** True when a bare `.nvmrc` major (latest of that line) satisfies `range`. */
  const satisfies = (range: string): boolean =>
    range.split('||').some((alt) => {
      const m = alt.trim().match(/^([\^>=~]*)\s*(\d+)\.(\d+)\.(\d+)$/);
      if (!m) return false;
      const [, op, maj, min] = m;
      const floorMajor = Number(maj);
      const floorMinor = Number(min);
      // ">=X.Y.Z" is open above; "^X.Y.Z" and "~X.Y.Z" stay on major X.
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

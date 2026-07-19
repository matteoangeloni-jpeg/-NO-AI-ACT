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

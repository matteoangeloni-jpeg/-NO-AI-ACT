import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CASES } from '../src/game/data/cases';

/**
 * RELEASE-METADATA CONSISTENCY GUARD.
 *
 * `release.config.json` is the machine-readable source of truth for release
 * facts (the VERSION source of truth is package.json). Documentation must not
 * drift from the executable source again (the README once claimed v1.0.0 and
 * "274 test" while the code was far ahead). This suite pins:
 *   executable source ⇄ release.config.json ⇄ README / llms.txt.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');
const cfg = JSON.parse(read('release.config.json'));
const pkg = JSON.parse(read('package.json'));
const readme = read('README.md');
const llms = read('public/llms.txt');

describe('release.config.json agrees with the executable source', () => {
  it('playableCases equals the real CASES data', () => {
    expect(cfg.playableCases).toBe(CASES.length);
  });

  it('public URL counts equal the real sitemaps', () => {
    const count = (p: string) => (read(p).match(/<loc>/g) ?? []).length;
    expect(cfg.publicUrls.it).toBe(count('public/sitemap-it.xml'));
    expect(cfg.publicUrls.en).toBe(count('public/sitemap-en.xml'));
    expect(cfg.publicUrls.total).toBe(cfg.publicUrls.it + cfg.publicUrls.en);
  });

  it('save schema matches SaveSystem (key, version, migration source)', () => {
    const save = read('src/game/systems/SaveSystem.ts');
    expect(save).toContain(`const KEY = '${cfg.saveSchema.storageKey}'`);
    expect(save).toContain(`CURRENT_SAVE_VERSION = ${cfg.saveSchema.version}`);
    for (const legacy of cfg.saveSchema.migratesFrom) {
      expect(save).toContain(`'${legacy}'`);
    }
  });

  it('runtime host allowlist matches what the shipped shell references', () => {
    // the play shell may reference only allowlisted external script hosts
    const play = read('play/index.html');
    const hosts = [...play.matchAll(/<script[^>]*src=['"]https?:\/\/([^/'"]+)/g)].map(([, h]) => h);
    for (const h of hosts) expect(cfg.runtimeHostAllowlist, `unlisted host ${h}`).toContain(h);
  });

  it('privacy posture flags are all still true', () => {
    expect(cfg.privacy.backend).toBe(false);
    expect(cfg.privacy.externalForms).toBe(false);
    expect(cfg.privacy.gameplayNetworkCalls).toBe(false);
  });
});

describe('documentation derives from the source of truth (no drift)', () => {
  it('README version badge and Stato release match package.json', () => {
    expect(readme).toContain(`stato-v${pkg.version.replace(/-/g, '--')}`); // shields badge
    expect(readme).toContain(`**Versione**: v${pkg.version}`);
  });

  it('README does not present an obsolete test count as current', () => {
    // test totals drift constantly; active docs must reference the suite, not
    // a hardcoded number presented as current state
    expect(readme).not.toMatch(/\b\d{3}\s+test automatici\b/);
  });

  it('llms.txt version line matches package.json', () => {
    expect(llms).toContain(`- Version: v${pkg.version}`);
  });

  it('README case count matches the data', () => {
    expect(readme).toContain(`${CASES.length} casi`);
  });

  it('last tagged release stays linked as history (not as current when ahead)', () => {
    expect(llms).toContain(`releases/tag/${cfg.lastTaggedRelease}`);
  });
});

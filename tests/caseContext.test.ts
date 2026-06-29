import { describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('Case context review — i18n strings (IT/EN)', () => {
  for (const [lang, L] of [['it', it], ['en', en]] as const) {
    test(`${lang} exposes the full context block`, () => {
      const c = L.ui.context;
      for (const key of ['button', 'title', 'scenarioLabel', 'objectiveLabel', 'objective', 'note', 'closeToDecision', 'closeToEvidence'] as const) {
        expect(c[key].trim().length, `${lang}.ui.context.${key}`).toBeGreaterThan(0);
      }
    });
  }

  test('agreed microcopy matches', () => {
    expect(it.ui.context.button).toBe('Rivedi contesto');
    expect(it.ui.context.title).toBe('Contesto del caso');
    expect(it.ui.context.closeToDecision).toBe('Torna alla decisione');
    expect(it.ui.context.closeToEvidence).toBe('Torna ai reperti');
    expect(en.ui.context.button).toBe('Review context');
    expect(en.ui.context.title).toBe('Case context');
    expect(en.ui.context.closeToDecision).toBe('Back to decision');
    expect(en.ui.context.closeToEvidence).toBe('Back to evidence');
  });
});

describe('Case context review — wiring in scenes', () => {
  const evidence = read('src/game/scenes/EvidenceScene.ts');
  const decision = read('src/game/scenes/DecisionScene.ts');

  test('the review-context button is wired in EvidenceScene', () => {
    expect(evidence).toContain('CaseContextOverlay');
    expect(evidence).toContain('ui.context.button');
    expect(evidence).toContain("'closeToEvidence'");
  });

  test('the review-context button is wired in DecisionScene', () => {
    expect(decision).toContain('CaseContextOverlay');
    expect(decision).toContain('ui.context.button');
    expect(decision).toContain("'closeToDecision'");
  });

  test('Decision ignores number-key input while the context overlay is open', () => {
    expect(decision).toContain('!this.contextOverlay.isOpen');
  });
});

/** Strip comments so read-only assertions check executable code, not the docstring. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('Case context review — overlay is strictly read-only', () => {
  const overlay = stripComments(read('src/game/ui/CaseContextOverlay.ts'));

  test('does not mutate game state', () => {
    expect(overlay).not.toContain('StateManager');
    expect(overlay).not.toContain('resolveCase');
    expect(overlay).not.toContain('saveCaseReport');
    expect(overlay).not.toContain('newGame');
    expect(overlay).not.toContain('SaveSystem');
  });

  test('adds no analytics / telemetry', () => {
    expect(overlay).not.toContain('AnalyticsSystem');
    expect(overlay).not.toMatch(/\.track\(/);
    expect(overlay).not.toMatch(/\.page\(/);
  });

  test('does not navigate between scenes and opens no external URL', () => {
    expect(overlay).not.toContain('scene.start');
    expect(overlay).not.toContain('window.open');
    expect(overlay).not.toContain('http');
    expect(overlay).not.toContain('tally');
  });

  test('only reads case data', () => {
    expect(overlay).toContain('caseText');
    expect(overlay).toContain('getCase');
  });
});

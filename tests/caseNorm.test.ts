import { describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** Strip comments so read-only assertions check executable code, not the docstring. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('PR 1D — case-rule i18n (IT/EN)', () => {
  for (const [lang, L] of [['it', it], ['en', en]] as const) {
    test(`${lang} exposes the full caseNorm block`, () => {
      const c = L.ui.caseNorm;
      for (const key of ['button', 'supportNote', 'relevantLabel', 'referenceLabel', 'inShortLabel', 'whyLabel', 'whyFallback', 'continuityNote', 'close'] as const) {
        expect(c[key].trim().length, `${lang}.ui.caseNorm.${key}`).toBeGreaterThan(0);
      }
    });
  }

  test('agreed microcopy matches (support, fallback, continuity)', () => {
    expect(it.ui.caseNorm.supportNote).toBe('Norma utile per orientarti nel caso. Consultarla non modifica il rapporto né la decisione.');
    expect(it.ui.caseNorm.whyFallback).toBe('Questa norma aiuta a valutare il caso, ma la decisione finale dipende dagli elementi osservati nel fascicolo.');
    expect(it.ui.caseNorm.continuityNote).toBe('Usa la norma per orientare il ragionamento, poi torna alla decisione e valuta gli elementi del fascicolo.');
    expect(en.ui.caseNorm.supportNote).toBe('A useful rule to orient your reasoning in this case. Consulting it does not change the report or the decision.');
    expect(en.ui.caseNorm.whyFallback).toBe('This rule helps you assess the case, but the final decision depends on the evidence observed in the dossier.');
    expect(en.ui.caseNorm.continuityNote).toBe('Use the rule to orient your reasoning, then return to the decision and assess the dossier evidence.');
  });
});

describe('PR 1D — wiring in DecisionScene', () => {
  const decision = read('src/game/scenes/DecisionScene.ts');

  test('the case rule of the current case is consultable during the decision', () => {
    expect(decision).toContain('CaseNormOverlay');
    expect(decision).toContain('ui.caseNorm.button');
    expect(decision).toContain('this.caseData.normId'); // bound to the current case's rule
  });

  test('number-key input is ignored while the rule overlay is open', () => {
    expect(decision).toContain('!this.caseNormOverlay.isOpen');
  });

  test('the existing unlocked-norms archive overlay is untouched', () => {
    expect(decision).toContain('toggleNormsOverlay');
    expect(decision).toContain('NormSystem.unlocked()');
  });
});

describe('PR 1D — rule overlay is read-only and non-unlocking', () => {
  const overlay = stripComments(read('src/game/ui/CaseNormOverlay.ts'));

  test('does not unlock the rule or mutate game state', () => {
    for (const forbidden of ['unlock', 'StateManager', 'SaveSystem', 'resolveCase', 'saveCaseReport', 'completedCases', 'NormSystem']) {
      expect(overlay, `must not reference ${forbidden}`).not.toContain(forbidden);
    }
  });

  test('adds no analytics / telemetry', () => {
    expect(overlay).not.toContain('AnalyticsSystem');
    expect(overlay).not.toMatch(/\.track\(/);
    expect(overlay).not.toMatch(/\.page\(/);
  });

  test('does not navigate and opens no external URL', () => {
    expect(overlay).not.toContain('scene.start');
    expect(overlay).not.toContain('window.open');
    expect(overlay).not.toContain('http');
    expect(overlay).not.toContain('tally');
  });

  test('reads only the localized rule texts (no answer/verdict access — anti-spoiler)', () => {
    expect(overlay).toContain('normText');
    // must NOT read the case answer or classification verdict vocabulary
    expect(overlay).not.toContain('correctClassification');
    expect(overlay).not.toContain('classifications');
  });
});

import { describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import { TALLY_PRE_GAME_IT_FORM_ID, TALLY_PRE_GAME_EN_URL, TALLY_POST_GAME_IT_URL, TALLY_POST_GAME_EN_URL } from '../src/game/config/tally';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** Strip comments so read-only assertions check executable code, not the docstring. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('PR 1E — decision debrief i18n (IT/EN)', () => {
  for (const [lang, L] of [['it', it], ['en', en]] as const) {
    test(`${lang} exposes the full decisionDebrief block`, () => {
      const d = L.ui.decisionDebrief;
      for (const key of [
        'button', 'title', 'intro', 'yourChoiceLabel', 'whyLabel', 'observeLabel', 'normLabel',
        'howToLabel', 'correctTitle', 'keyElementLabel', 'whyCorrect', 'whyPartialWrong',
        'observeFallback', 'howToFallback', 'close'
      ] as const) {
        expect(d[key].trim().length, `${lang}.ui.decisionDebrief.${key}`).toBeGreaterThan(0);
      }
    });
  }

  test('agreed microcopy matches', () => {
    expect(it.ui.decisionDebrief.intro).toBe('Questa scheda ti aiuta a capire il ragionamento, senza modificare il punteggio o il rapporto.');
    expect(it.ui.decisionDebrief.whyPartialWrong).toBe('La decisione non è pienamente coerente con gli elementi del fascicolo. Rivedi la prova chiave, la norma collegata e il passaggio logico richiesto.');
    expect(en.ui.decisionDebrief.intro).toBe('This panel helps you understand the reasoning without changing the score or the report.');
    expect(en.ui.decisionDebrief.whyCorrect).toBe('The decision is consistent with the dossier evidence and the related rule.');
  });

  test('the new strings carry no external URLs', () => {
    for (const L of [it, en]) {
      for (const v of Object.values(L.ui.decisionDebrief)) {
        expect(v).not.toMatch(/https?:\/\//);
      }
    }
  });
});

describe('PR 1E — debrief is wired post-decision (ReportScene) only', () => {
  const report = read('src/game/scenes/ReportScene.ts');

  test('ReportScene opens the debrief from the already-computed result', () => {
    expect(report).toContain('DecisionDebriefOverlay');
    expect(report).toContain('ui.decisionDebrief.button');
    expect(report).toContain('result.quality');
    expect(report).toContain('result.dominantError');
  });

  test('the debrief uses existing data: case rule via normId, relevant clues, typed error text', () => {
    expect(report).toContain('normText(this.caseData.normId)');
    expect(report).toContain('this.caseData.relevantClues');
    expect(report).toContain('t.ui.errors[result.dominantError]');
  });

  test('ReportScene still continues to Consequence (flow unchanged, no scoring here)', () => {
    expect(report).toContain("this.scene.start('Consequence'");
    expect(report).not.toContain('evaluateReport'); // scoring stays in DecisionScene/ReportSystem
  });

  test('the debrief does NOT appear before the decision (anti-spoiler)', () => {
    for (const p of ['src/game/scenes/EvidenceScene.ts', 'src/game/scenes/DecisionScene.ts']) {
      const src = read(p);
      expect(src).not.toContain('DecisionDebriefOverlay');
      expect(src).not.toContain('decisionDebrief');
    }
  });
});

describe('PR 1E — overlay is strictly presentational / read-only', () => {
  const overlay = stripComments(read('src/game/ui/DecisionDebriefOverlay.ts'));

  test('does not touch game state, scoring, report, save or unlocks', () => {
    for (const forbidden of ['StateManager', 'SaveSystem', 'ReportSystem', 'resolveCase', 'saveCaseReport', 'completedCases', 'unlock', 'NormSystem']) {
      expect(overlay, `must not reference ${forbidden}`).not.toContain(forbidden);
    }
  });

  test('adds no analytics / telemetry and opens no URL', () => {
    expect(overlay).not.toContain('AnalyticsSystem');
    expect(overlay).not.toMatch(/\.track\(/);
    expect(overlay).not.toMatch(/\.page\(/);
    expect(overlay).not.toContain('scene.start');
    expect(overlay).not.toContain('window.open');
    expect(overlay).not.toContain('http');
    expect(overlay).not.toContain('tally');
  });

  test('is decoupled: imports no data/systems modules (pure presentation)', () => {
    expect(overlay).not.toMatch(/from '\.\.\/data\//);
    expect(overlay).not.toMatch(/from '\.\.\/systems\//);
  });
});

describe('PR 1E — Tally forms unchanged', () => {
  test('pre/post-game forms are unchanged', () => {
    expect(read('index.html')).toContain('data-tally-open="44ENVA"');
    expect(read('en/index.html')).toContain('https://tally.so/r/5BryXb');
    expect(TALLY_PRE_GAME_IT_FORM_ID).toBe('44ENVA');
    expect(TALLY_PRE_GAME_EN_URL).toBe('https://tally.so/r/5BryXb');
    expect(TALLY_POST_GAME_IT_URL).toBe('https://tally.so/r/dWgB5y');
    expect(TALLY_POST_GAME_EN_URL).toBe('https://tally.so/r/ZjWp9A');
  });
});

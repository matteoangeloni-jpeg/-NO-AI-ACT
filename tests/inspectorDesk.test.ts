import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { en } from '../src/game/i18n/en';
import { it as itLocale } from '../src/game/i18n/it';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('Inspector Desk', () => {
  it('keeps the same investigation tools in evidence and decision', () => {
    const evidence = read('src/game/scenes/EvidenceScene.ts');
    const decision = read('src/game/scenes/DecisionScene.ts');

    for (const source of [evidence, decision]) {
      expect(source).toContain('new InspectorDesk');
      expect(source).toContain('new EvidenceCompareOverlay');
      expect(source).toContain('new NotebookOverlay');
      expect(source).toContain("'keydown-X'");
      expect(source).toContain("'keydown-N'");
    }
  });

  it('compares only cited evidence without writing game state', () => {
    const compare = read('src/game/ui/EvidenceCompareOverlay.ts');

    expect(compare).toContain('this.getIndices()');
    expect(compare).toContain('Array<[number, number]>');
    expect(compare).toContain('ReadingLayer.openOverlay');
    expect(compare).not.toMatch(/StateManager|SaveSystem|localStorage|setItem|fetch\(/);
  });

  it('ships complete bilingual labels for the shared desk', () => {
    expect(Object.keys(itLocale.ui.inspectorDesk)).toEqual(Object.keys(en.ui.inspectorDesk));
    expect(itLocale.ui.inspectorDesk.compare).toContain('[X]');
    expect(en.ui.inspectorDesk.compare).toContain('[X]');
    expect(itLocale.ui.inspectorDesk.normLocked).toBe('NORMA IN DECISIONE');
    expect(en.ui.inspectorDesk.normLocked).toBe('RULE IN DECISION');
  });
});

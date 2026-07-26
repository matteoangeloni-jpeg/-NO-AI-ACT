import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * ARCHIVE SEARCH UI GUARD (roadmap 2.1, Phase 2 §6 — Her Story UI).
 * Typed keyword filter in ArchiveScene: uses the shipped engine, never
 * reveals locked norm titles, is announced via the reading layer, and
 * ESC clears the query before leaving the scene.
 */
const scene = readFileSync(resolve(__dirname, '..', 'src/game/scenes/ArchiveScene.ts'), 'utf8');

describe('ArchiveScene search wiring', () => {
  it('uses the shipped search engine and the reading layer', () => {
    expect(scene).toContain("import { searchArchive } from '../systems/SearchIndex'");
    expect(scene).toMatch(/ReadingLayer\.announce\(/);
  });

  it('locked cards stay opaque under an active query (no title spoilers)', () => {
    expect(scene).toContain('this.lockedCards');
    expect(scene).toMatch(/lockedCards\)\s*locked\.setAlpha\(active \? 0\.2 : 1\)/);
  });

  it('ESC clears the query before leaving; BACKSPACE edits it', () => {
    expect(scene).toContain("this.query.length > 0) { this.query = ''");
    expect(scene).toContain("e.key === 'Backspace'");
  });
});

describe('search UI i18n present in both languages', () => {
  it('idle/results/none strings with placeholders', () => {
    for (const d of [itDict, en]) {
      expect(d.ui.archive.searchIdle.length).toBeGreaterThan(10);
      for (const p of ['{query}', '{n}', '{g}', '{c}']) expect(d.ui.archive.searchResults).toContain(p);
      expect(d.ui.archive.searchNone).toContain('{query}');
    }
  });
});

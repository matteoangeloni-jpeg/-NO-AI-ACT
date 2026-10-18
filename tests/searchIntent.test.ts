import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INVENTORY_DIRS, SITE_LANGUAGE_CODES } from './lib-inventory';
// @ts-expect-error Shared ESM inventory audit.
import { rows } from '../scripts/seo/content-intents.mjs';

const read = (file: string) => readFileSync(resolve(__dirname, '..', file), 'utf8');
describe('Search intent and brand clarity', () => {
  it('covers every public route, without adding a second owner for the same topic/language', () => {
    expect(rows).toHaveLength(INVENTORY_DIRS.length);
    expect(new Set(rows.map((r: any) => r.route)).size).toBe(INVENTORY_DIRS.length);
    expect(new Set(rows.map((r: any) => `${r.lang}:${r.topic}`)).size).toBe(rows.length);
    for (const row of rows) {
      expect(SITE_LANGUAGE_CODES).toContain(row.lang);
      expect(row.title.length).toBeGreaterThan(15);
      expect(row.h1.length).toBeGreaterThan(5);
      expect(row.mainWords).toBeGreaterThan(100);
    }
  });
  it('every home names the game and its category instead of an unqualified legal counterfactual', () => {
    for (const lang of SITE_LANGUAGE_CODES) {
      const file = lang === 'it' ? 'index.html' : `${lang}/index.html`;
      const html = read(file);
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
      expect(h1, lang).toContain('NO AI ACT');
      expect(h1, lang).toMatch(/gioco|game|jeu|spiel|juego|jogo/i);
      expect(h1, lang).not.toMatch(/never entered|mai entrato/);
      expect(html).not.toMatch(/<meta\s+name="keywords"/i);
    }
  });
  it('the evidence capture is read-only and writes only into ignored local cache', () => {
    const script = read('scripts/seo/capture-search-console.mjs');
    expect(script).toContain('.seo-cache/no-ai-act/2026-10-18');
    expect(script).not.toMatch(/\.submit\(|\.delete\(|\.insert\(/);
    expect(read('.gitignore')).toContain('/.seo-cache/');
  });
  it('teacher-topic summaries introduce school use as well as playing the game', () => {
    const pages = [
      ['fr/ai-act-pour-enseignants', "Comprendre l'usage avant de classer le risque"],
      ['de/ki-verordnung-fuer-lehrkraefte', 'KI-Nutzung in der Schule einordnen'],
      ['es/reglamento-ia-para-docentes', 'Analizar el uso de IA en la escuela'],
      ['pt/regulamento-ia-para-docentes', 'Analisar a utilização de IA na escola']
    ];
    for (const [dir, heading] of pages) expect(read(`${dir}/index.html`)).toContain(heading);
    expect(read('fr/ai-act-pour-enseignants/index.html')).toContain('pour-les-formateurs/');
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error Shared editorial data.
import { markets, topics } from '../scripts/seo/keyword-markets.mjs';
// @ts-expect-error Shared read-only reporting helper.
import { plan, privateBaseline } from '../scripts/seo/build-keyword-research.mjs';

describe('Six-language keyword research, not unmeasured ranking claims', () => {
  it('maps 48 intents and 96 distinct local phrases to existing pages', () => {
    expect(Object.keys(markets)).toEqual(['it', 'en', 'fr', 'de', 'es', 'pt']);
    expect(topics).toHaveLength(8);
    expect(plan).toHaveLength(48);
    for (const lang of Object.keys(markets)) {
      const rows = plan.filter((row: any) => row.lang === lang);
      expect(rows).toHaveLength(8);
      expect(new Set(rows.map((row: any) => row.url)).size).toBe(8);
      expect(new Set(rows.flatMap((row: any) => row.keywords)).size).toBe(16);
      for (const row of rows) {
        expect(row.keywords).toHaveLength(2);
        expect(readFileSync(row.dir ? `${row.dir}/index.html` : 'index.html', 'utf8')).toContain('<main');
      }
      expect(markets[lang].sources.length).toBeGreaterThanOrEqual(2);
      for (const [url] of markets[lang].sources) expect(new URL(url).protocol).toBe('https:');
    }
  });

  it('keeps the localized classroom gap separate from school-AI law pages', () => {
    for (const lang of ['de', 'es', 'pt']) {
      const row = plan.find((row: any) => row.lang === lang && row.topic === 'classroom');
      expect(row.dir).not.toContain('docentes');
      expect(row.dir).not.toContain('lehrkraefte');
      expect(row.gap).toContain('manca un modulo');
    }
  });

  it('delivers all six briefs and a public candidate-only CSV', () => {
    const csv = readFileSync('docs/seo/keyword-research/keywords.csv', 'utf8');
    expect(csv.trim().split('\n')).toHaveLength(97);
    expect(csv).not.toMatch(/impressions|clicks|topVisibleQueries|client_email|private_key/);
    for (const lang of Object.keys(markets)) {
      const report = readFileSync(`docs/seo/keyword-research/${lang}.md`, 'utf8');
      expect(report).toContain('sedici espressioni candidate');
      expect(report.match(/### P[12]:/g)).toHaveLength(8);
      expect(report).toContain('Non sono una SERP Google geolocalizzata');
    }
  });

  it('adds a concrete literacy exercise to all six existing pages', () => {
    const headings = {
      it: "Un'attività di alfabetizzazione all'IA basata sulle prove",
      en: 'An evidence-based AI literacy classroom activity',
      fr: 'Une activité de maîtrise de l’IA fondée sur les preuves',
      de: 'Eine Übung zur KI-Kompetenz im Unterricht',
      es: 'Una actividad de alfabetización en IA para el aula',
      pt: 'Uma atividade de literacia em IA para a sala de aula'
    };
    for (const row of plan.filter((row: any) => row.topic === 'literacy')) {
      const html = readFileSync(`${row.dir}/index.html`, 'utf8');
      expect(html).toContain(headings[row.lang as keyof typeof headings]);
      expect(html).not.toContain('<form');
      expect(row.gap).toContain('esercizio localizzato');
    }
  });

  it('private evidence uses landing-page language, not inferred query language', () => {
    const report = privateBaseline({ property: 'sc-domain:no-ai-act.eu', searchType: 'web', dataState: 'final',
      periods: { current: ['2026-09-18', '2026-10-15'] }, cuts: {
        'current:query,page': { rows: [
          { query: 'KI-Kompetenz', page: 'https://www.no-ai-act.eu/en/ai-literacy/', impressions: 1 },
          { query: 'AI Act', page: 'https://www.no-ai-act.eu/de/#section', impressions: 1 }
        ] }, 'current:page': { rows: [{ page: 'https://www.no-ai-act.eu/en/ai-literacy/' }] }
      } });
    expect(report.locales.en.visibleQueryPageRows).toBe(1);
    expect(report.locales.de.visibleQueryPageRows).toBe(1);
    expect(report.locales.fr.visibleQueryPageRows).toBe(0);
    expect(report.caveats.join(' ')).toContain('non domanda pari a zero');
    expect(report.caveats.join(' ')).toContain('precedono');
  });

  it('rejects different properties and incomplete or preliminary evidence', () => {
    expect(() => privateBaseline({ property: 'sc-domain:other.eu' })).toThrow();
    expect(() => privateBaseline({ property: 'sc-domain:no-ai-act.eu', searchType: 'web', dataState: 'all' })).toThrow();
    expect(() => privateBaseline({ property: 'sc-domain:no-ai-act.eu', searchType: 'web', dataState: 'final' })).toThrow();
  });
});

import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LANGUAGE_CODES, LANGUAGE_LABELS, LOCALES, L, languageFromQuery, setLanguage } from '../src/game/i18n';
import { GUIDED_COPY } from '../src/game/i18n/guidedInquiry';
import { INQUIRY_CASES } from '../src/game/i18n/inquiryCases';
import { SITE_LANGUAGE_CODES } from './lib-inventory';
import { LANGUAGES, ANALYTICS_GAME_VERSION, validateAggregate, validatePayload } from '../src/game/systems/analyticsSchema';
import { SaveSystem, defaultSave } from '../src/game/systems/SaveSystem';
import { emptyDraft } from '../src/game/systems/caseDraft';
import { PLAYABLE_CASES } from '../src/game/data/cases';

const read = (file: string) => readFileSync(file, 'utf8');
const newLanguages = ['de', 'es', 'pt'] as const;

function leaves(value: unknown, path = '', out: Record<string, unknown> = {}): Record<string, unknown> {
  if (Array.isArray(value)) {
    out[`${path}.length`] = value.length;
    value.forEach((item, i) => leaves(item, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) leaves(child, path ? `${path}.${key}` : key, out);
  } else out[path] = value;
  return out;
}
const dictionary = (language: typeof LANGUAGE_CODES[number]) => ({
  locale: LOCALES[language], guided: GUIDED_COPY[language], inquiry: INQUIRY_CASES[language]
});
const placeholders = (text: string) => [...text.matchAll(/\{\w+\}/g)].map(match => match[0]).sort();

afterEach(() => { setLanguage('it'); vi.unstubAllGlobals(); });

describe('the complete game and website share six published languages', () => {
  it('aligns game, site, collector and release registries', () => {
    const cfg = JSON.parse(read('release.config.json'));
    expect(LANGUAGE_CODES).toEqual(['it', 'en', 'fr', 'de', 'es', 'pt']);
    expect(LANGUAGE_CODES).toEqual(SITE_LANGUAGE_CODES);
    expect(LANGUAGE_CODES).toEqual(cfg.playableLanguages);
    expect(LANGUAGE_CODES).toEqual(cfg.siteLanguages);
    expect(LANGUAGE_CODES).toEqual(LANGUAGES);
  });

  for (const language of LANGUAGE_CODES) {
    it(`${language}: preserves every key, array length, placeholder and numeric value`, () => {
      const original = leaves(dictionary('en'));
      const translated = leaves(dictionary(language));
      expect(Object.keys(translated).sort()).toEqual(Object.keys(original).sort());
      for (const [path, value] of Object.entries(original)) {
        expect(typeof translated[path], path).toBe(typeof value);
        if (typeof value === 'string') {
          const text = translated[path] as string;
          expect(text.trim().length, path).toBeGreaterThan(0);
          expect(placeholders(text), path).toEqual(placeholders(value));
          expect(text, path).not.toMatch(/▁|<unk>|\{(?:DE|ES|PT)\}|^(?:TODO|TBD)$/);
        } else expect(translated[path], path).toBe(value);
      }
    });

    it(`${language}: can be selected directly from its site URL`, () => {
      expect(languageFromQuery(`?lang=${language}`)).toBe(language);
      setLanguage(language);
      expect(L()).toBe(LOCALES[language]);
      expect(LANGUAGE_LABELS[language].length).toBeGreaterThan(5);
    });

    it(`${language}: preserves signed reports and unfinished indices through language changes and reloads`, () => {
      const store = new Map<string, string>();
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key)
      });
      const data = defaultSave();
      data.language = language;
      data.completedCases.case_scoring = 'correct';
      data.caseReports.case_scoring = { outcome: 'conforme', dominantError: null, classification: 'vietata',
        measure: 'blocco', subject: 'autorita', motivationIndex: 1, citedClues: [0, 1] };
      data.caseDrafts.case_lavoro = { ...emptyDraft('case_lavoro', 1700000000000), step: 'motivation',
        revealedClues: [0, 1, 2], citedClues: [0, 2], motivation: 1 };
      SaveSystem.save(data);
      for (const next of LANGUAGE_CODES) {
        setLanguage(next);
        const loaded = SaveSystem.load();
        loaded.language = next;
        SaveSystem.save(loaded);
        expect(SaveSystem.load().language).toBe(next);
        expect(loaded.completedCases).toEqual(data.completedCases);
        expect(loaded.caseReports).toEqual(data.caseReports);
        expect(loaded.caseDrafts).toEqual(data.caseDrafts);
      }
      store.clear();
      const legacy = { ...data, version: 1 };
      const snapshot = JSON.stringify(legacy);
      store.set('no-ai-act-save-v1', snapshot);
      const migrated = SaveSystem.load();
      expect(migrated.version).toBe(2);
      expect(migrated.language).toBe(language);
      expect(migrated.completedCases).toEqual(data.completedCases);
      expect(migrated.caseReports).toEqual(data.caseReports);
      expect(store.get('no-ai-act-save-v1')).toBe(snapshot);
    });

    it(`${language}: accepts aggregate counters while rejecting individual fields`, () => {
      const payload = { schemaVersion: 2, gameVersion: ANALYTICS_GAME_VERSION, event: 'game_started',
        properties: { language, mode: 'turno', phase: 'menu' } };
      expect(validatePayload(payload)).toBe(true);
      expect(validateAggregate({ ...payload, count: 1 })).toBe(true);
      expect(validatePayload({ ...payload, properties: { ...payload.properties, answer: 'private answer' } })).toBe(false);
      expect(validatePayload({ ...payload, properties: { ...payload.properties, language: 'unknown' } })).toBe(false);
    });
  }

  for (const language of newLanguages) {
    it(`${language}: ships its complete authored text without an English content fallback`, () => {
      const original = leaves(dictionary('en'));
      const translated = leaves(dictionary(language));
      const prose = Object.entries(original).filter(([, value]) => typeof value === 'string' && value.length > 40);
      expect(prose.length).toBeGreaterThan(700);
      for (const [path, value] of prose) expect(translated[path], path).not.toBe(value);
      expect(read(`src/game/i18n/${language}.ts`)).not.toMatch(/import.*(?:en|it|fr)['"]|\.\.\.(?:en|it|fr)\b/);
      const raw = JSON.parse(read(`src/game/i18n/translations/${language}.json`));
      expect(raw).toEqual(dictionary(language));
      expect(Object.keys(raw.locale.cases)).toHaveLength(PLAYABLE_CASES.length);
    });

    it(`${language}: links native privacy and all six real game languages from its press kit`, () => {
      const dir = { de: 'de/pressemappe', es: 'es/kit-de-prensa', pt: 'pt/kit-de-imprensa' }[language];
      const html = read(`${dir}/index.html`);
      expect(html).toContain(`/game-statistics.html#${language}`);
      for (const target of LANGUAGE_CODES) expect(html).toContain(`/play/?lang=${target}`);
      expect(html).not.toMatch(/bleibt dreisprachig|sigue en tres idiomas|continua em três línguas/);
      expect(read('public/game-statistics.html')).toContain(`id="${language}" lang="${language === 'pt' ? 'pt-PT' : language}"`);
    });
  }

  it('accepts European Portuguese BCP 47 handoff without publishing unknown aliases', () => {
    expect(languageFromQuery('?lang=pt-PT')).toBe('pt');
    expect(languageFromQuery('?lang=pt-BR')).toBeNull();
    expect(languageFromQuery('?lang=klingon')).toBeNull();
  });
});

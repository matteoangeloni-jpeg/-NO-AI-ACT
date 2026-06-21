import type { CaseTexts, LanguageCode, NormTexts } from '../data/types';
import { it } from './it';
import { en } from './en';

/**
 * Sistema i18n minimale e tipato.
 *  - L() restituisce il dizionario corrente con accesso tipato diretto
 *    (L().ui.map.header) invece di chiavi stringa: gli errori di chiave
 *    diventano errori di compilazione.
 *  - La persistenza della lingua è responsabilità dello StateManager:
 *    questo modulo non tocca localStorage (testabile in Node).
 *  - Estensione futura: aggiungere 'fr' | 'es' a LanguageCode (types.ts),
 *    creare fr.ts/es.ts tipizzati `Locale` e registrarli in LOCALES.
 */
export type Locale = typeof it;

export const LOCALES: Record<LanguageCode, Locale> = { it, en };

export const LANGUAGE_CODES: LanguageCode[] = ['it', 'en'];

let current: LanguageCode = 'it';

export function setLanguage(lang: LanguageCode): void {
  if (LOCALES[lang]) current = lang;
}

export function getLanguage(): LanguageCode {
  return current;
}

export function nextLanguage(): LanguageCode {
  const i = LANGUAGE_CODES.indexOf(current);
  return LANGUAGE_CODES[(i + 1) % LANGUAGE_CODES.length];
}

/**
 * Parse a URL query string (e.g. `?lang=en`) into a known language code.
 * Used for the public landing → game handoff (/play/?lang=it|en). Returns
 * null for missing or unknown values, so the caller keeps the saved language.
 */
function isLanguageCode(value: string | null): value is LanguageCode {
  return value === 'it' || value === 'en';
}

export function languageFromQuery(search: string): LanguageCode | null {
  const lang = new URLSearchParams(search).get('lang');
  return isLanguageCode(lang) ? lang : null;
}

/** Dizionario della lingua corrente. */
export function L(): Locale {
  return LOCALES[current];
}

/** Sostituisce i segnaposto {nome} in una stringa localizzata. */
export function fmt(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`
  );
}

export function caseText(caseId: string): CaseTexts {
  const texts = (L().cases as unknown as Record<string, CaseTexts>)[caseId];
  if (!texts) throw new Error(`Testi mancanti per il caso: ${caseId}`);
  return texts;
}

export function normText(normId: string): NormTexts {
  const texts = (L().norms as Record<string, NormTexts>)[normId];
  if (!texts) throw new Error(`Testi mancanti per la norma: ${normId}`);
  return texts;
}

export function locationName(locationId: string): string {
  const name = (L().locations as Record<string, string>)[locationId];
  if (!name) throw new Error(`Nome mancante per il luogo: ${locationId}`);
  return name;
}

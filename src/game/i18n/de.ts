import type { Locale } from './index';
import translation from './translations/de.json';

/** Complete German dictionary; no runtime fallback to another language. */
export const de: Locale = translation.locale;

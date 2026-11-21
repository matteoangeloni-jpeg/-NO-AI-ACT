import type { Locale } from './index';
import translation from './translations/es.json';

/** Complete Spanish dictionary; no runtime fallback to another language. */
export const es: Locale = translation.locale;

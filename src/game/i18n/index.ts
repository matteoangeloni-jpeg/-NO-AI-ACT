import type { CaseTexts, LanguageCode, NormTexts } from '../data/types';
import { it } from './it';
import { en } from './en';
import { fr } from './fr';

/**
 * Sistema i18n minimale e tipato.
 *  - L() restituisce il dizionario corrente con accesso tipato diretto
 *    (L().ui.map.header) invece di chiavi stringa: gli errori di chiave
 *    diventano errori di compilazione.
 *  - La persistenza della lingua è responsabilità dello StateManager:
 *    questo modulo non tocca localStorage (testabile in Node).
 *  - Aggiungere una lingua: allargare LanguageCode (data/types.ts), creare il
 *    dizionario tipizzato `Locale`, registrarlo in LOCALES. Nient'altro: gli
 *    elenchi di lingue di questo modulo sono DERIVATI da LOCALES, non
 *    trascritti, e una lingua ancora in traduzione sta in DRAFT_LANGUAGES
 *    finché non è completa.
 */
export type Locale = typeof it;

/**
 * LE LINGUE PUBBLICATE, E L'UNICO POSTO IN CUI SONO ELENCATE.
 *
 * `Record<LanguageCode, Locale>` lega questo oggetto al tipo dichiarato in
 * data/types.ts in entrambe le direzioni: una lingua dichiarata e non
 * registrata non compila, una registrata e non dichiarata nemmeno. Aggiungere
 * una lingua è quindi: allargare `LanguageCode`, scrivere il dizionario,
 * registrarlo qui — e il compilatore pretende il resto.
 *
 * `Locale = typeof it` fa del dizionario italiano il contratto strutturale:
 * UN DIZIONARIO INCOMPLETO NON COMPILA. È il motivo per cui una lingua in
 * lavorazione non va registrata qui ma tenuta come bozza (vedi
 * DRAFT_LANGUAGES): registrarla a metà non produrrebbe una traduzione
 * parziale pubblicata, produrrebbe una build rotta.
 */
export const LOCALES: Record<LanguageCode, Locale> = { it, en, fr };

/**
 * DERIVATO da LOCALES, non trascritto. La versione precedente lo scriveva a
 * mano (`['it', 'en']`) accanto a un `isLanguageCode` che riscriveva la stessa
 * coppia una terza volta: tre elenchi della stessa cosa, e due da ricordarsi
 * di aggiornare. Il secondo era il più insidioso, perché la sua dimenticanza
 * non rompe niente — fa solo rifiutare `?lang=<nuova>` in silenzio, e il
 * giocatore arriva nella lingua sbagliata senza un messaggio.
 */
export const LANGUAGE_CODES: LanguageCode[] = Object.keys(LOCALES) as LanguageCode[];

/**
 * LINGUE IN LAVORAZIONE, dichiarate e non pubblicate.
 *
 * Il programma 4.0 chiede di predisporre altre lingue senza pubblicare
 * traduzioni incomplete. Questo elenco è la dichiarazione d'intento: i file di
 * bozza possono esistere nel repository, ma finché una lingua è qui NON entra
 * in LOCALES, non appare nell'interfaccia e non è raggiungibile da `?lang=`.
 * Il controllo è in tests/i18n.test.ts e vale in entrambe le direzioni.
 */
export const DRAFT_LANGUAGES = ['es', 'de'] as const;

/**
 * Oltre questo numero di lingue pubblicate il commutatore a ciclo
 * (`nextLanguage`) non è più un'interfaccia accettabile: diventa «premi finché
 * non indovini», che è un difetto di accessibilità prima che di gusto. Il test
 * che sorveglia questa soglia fallisce nel momento in cui una terza lingua
 * viene pubblicata, così la scelta dell'interfaccia non può essere dimenticata.
 */
export const MAX_LINGUE_PER_COMMUTATORE_A_CICLO = 2;

/**
 * IL NOME DI OGNI LINGUA NELLA LINGUA STESSA, e non nei dizionari.
 *
 * Un francofono che cerca il francese deve vedere « FRANÇAIS » anche mentre
 * l'interfaccia è in italiano: mettere questi nomi nei dizionari li
 * tradurrebbe, e li renderebbe irriconoscibili proprio a chi ne ha bisogno.
 * Sono endonimi, quindi stanno qui, una volta sola, uguali in tutte le lingue.
 */
export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  it: 'ITALIANO',
  en: 'ENGLISH',
  fr: 'FRANÇAIS'
};

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
export function isLanguageCode(value: unknown): value is LanguageCode {
  // Chiede a LOCALES, che è la fonte di verità, invece di riscriverne le
  // chiavi: è questa riga che prima conteneva la coppia 'it' | 'en' a mano.
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LOCALES, value);
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

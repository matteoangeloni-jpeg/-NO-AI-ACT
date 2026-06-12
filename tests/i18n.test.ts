import { beforeEach, describe, expect, it as test } from 'vitest';
import { L, LANGUAGE_CODES, LOCALES, fmt, getLanguage, nextLanguage, setLanguage } from '../src/game/i18n';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/** Raccoglie ricorsivamente i percorsi-chiave di un oggetto locale. */
function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    // gli array sono confrontati per lunghezza, non per indice
    return [`${prefix}[len=${obj.length}]`, ...obj.flatMap((v, i) => (typeof v === 'object' && v !== null ? keyPaths(v, `${prefix}[${i}]`) : []))];
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).flatMap(([k, v]) => {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null) return keyPaths(v, path);
      return [path];
    });
  }
  return [prefix];
}

/** Raccoglie ricorsivamente tutte le stringhe foglia. */
function leafStrings(obj: unknown): string[] {
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap(leafStrings);
  if (typeof obj === 'object' && obj !== null) return Object.values(obj).flatMap(leafStrings);
  return [];
}

describe('i18n — completezza dei dizionari', () => {
  test('IT e EN hanno esattamente le stesse chiavi (struttura identica)', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(it).sort());
  });

  test('nessuna stringa vuota in nessuna lingua', () => {
    for (const lang of LANGUAGE_CODES) {
      for (const s of leafStrings(LOCALES[lang])) {
        expect(s.trim().length, `stringa vuota in "${lang}"`).toBeGreaterThan(0);
      }
    }
  });

  test('le stringhe con segnaposto hanno gli stessi segnaposto in tutte le lingue', () => {
    const placeholders = (s: string): string[] => (s.match(/\{\w+\}/g) ?? []).sort();
    const itPaths = keyPaths(it).sort();
    // confronto campione sulle chiavi note con parametri
    expect(placeholders(it.ui.map.progress)).toEqual(placeholders(en.ui.map.progress));
    expect(placeholders(it.ui.evidence.header)).toEqual(placeholders(en.ui.evidence.header));
    expect(placeholders(it.ui.decision.recorded)).toEqual(placeholders(en.ui.decision.recorded));
    expect(placeholders(it.ui.archive.subtitle)).toEqual(placeholders(en.ui.archive.subtitle));
    expect(itPaths.length).toBeGreaterThan(100); // sanity: dizionario non troncato
  });

  test('ogni caso e ogni norma esistono in entrambe le lingue con 3 indizi', () => {
    for (const lang of LANGUAGE_CODES) {
      const locale = LOCALES[lang];
      expect(Object.keys(locale.cases)).toHaveLength(6);
      expect(Object.keys(locale.norms)).toHaveLength(6);
      for (const c of Object.values(locale.cases)) {
        expect(c.clues).toHaveLength(3);
      }
    }
  });

  test('EN biometria mantiene il perimetro law-enforcement', () => {
    expect(en.norms.norm_biometria.explanation).toContain('law-enforcement');
    expect(en.norms.norm_biometria.explanation).toContain('high-risk');
  });
});

describe('i18n — runtime', () => {
  beforeEach(() => setLanguage('it'));

  test('setLanguage cambia il dizionario corrente', () => {
    expect(L().ui.menu.newGame).toBe('NUOVA PARTITA');
    setLanguage('en');
    expect(getLanguage()).toBe('en');
    expect(L().ui.menu.newGame).toBe('NEW GAME');
  });

  test('nextLanguage cicla tutte le lingue registrate', () => {
    const seen = new Set([getLanguage()]);
    for (let i = 0; i < LANGUAGE_CODES.length; i++) {
      setLanguage(nextLanguage());
      seen.add(getLanguage());
    }
    expect(seen.size).toBe(LANGUAGE_CODES.length);
  });

  test('fmt sostituisce i segnaposto', () => {
    expect(fmt('CASI: {done}/{total}', { done: 2, total: 6 })).toBe('CASI: 2/6');
    expect(fmt('senza parametri', {})).toBe('senza parametri');
  });
});

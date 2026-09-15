import { beforeEach, describe, expect, it as test } from 'vitest';
import { readFileSync } from 'node:fs';
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
      expect(Object.keys(locale.cases)).toHaveLength(13);
      expect(Object.keys(locale.norms)).toHaveLength(13);
      for (const c of Object.values(locale.cases)) {
        expect(c.clues.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  test('EN biometria mantiene il perimetro law-enforcement', () => {
    expect(en.norms.norm_biometria.explanation).toContain('law-enforcement');
    expect(en.norms.norm_biometria.explanation).toContain('high-risk');
  });

  test('ogni carta ha la riga "Non significa che" / "This does not mean that", non vuota', () => {
    const ids = Object.keys(it.norms) as (keyof typeof it.norms)[];
    expect(ids).toHaveLength(13);
    for (const id of ids) {
      expect(it.norms[id].notMeaning.trim().length).toBeGreaterThan(20);
      expect(it.norms[id].notMeaning).toMatch(/Non significa che/i);
      expect(en.norms[id].notMeaning.trim().length).toBeGreaterThan(20);
      expect(en.norms[id].notMeaning).toMatch(/this does not mean that/i);
    }
  });

  test('ogni esito ha una reason localizzata in IT e EN', () => {
    const keys = ['grounded', 'classificazione', 'prove', 'misura_insufficiente', 'eccesso_cautela', 'soggetto', 'trasparenza', 'motivazione'] as const;
    for (const k of keys) {
      expect(it.ui.report.reasons[k].trim().length).toBeGreaterThan(10);
      expect(en.ui.report.reasons[k].trim().length).toBeGreaterThan(10);
    }
    expect(it.ui.report.reasonLabel.length).toBeGreaterThan(0);
    expect(en.ui.report.reasonLabel.length).toBeGreaterThan(0);
  });
});

describe('i18n — credits', () => {
  test('credits IT: testi esatti richiesti', () => {
    const c = it.ui.creditsScene;
    expect(c.heading).toBe('NO AI ACT');
    expect(c.roleLabel).toBe('Ideazione e direzione scientifica');
    expect(c.author).toBe('Matteo Angeloni');
    expect(c.affiliation).toBe('PhD Student — Università degli Studi della Tuscia');
    expect(c.note).toBe(
      'Vertical slice sviluppata con supporto AI.\n' +
        'Asset grafici e audio procedurali.\n' +
        'Licenze e attribuzioni complete disponibili nei file del progetto.'
    );
  });

  test('credits EN: testi esatti richiesti', () => {
    const c = en.ui.creditsScene;
    expect(c.heading).toBe('NO AI ACT');
    expect(c.roleLabel).toBe('Concept and scientific direction');
    expect(c.author).toBe('Matteo Angeloni');
    expect(c.affiliation).toBe('PhD Student — University of Tuscia');
    expect(c.note).toBe(
      'Vertical slice developed with AI support.\n' +
        'Procedural graphics and audio assets.\n' +
        'Full licenses and attributions available in the project files.'
    );
  });

  test('"PhD Student" scritto esattamente così, nessun refuso', () => {
    for (const locale of [it, en]) {
      expect(locale.ui.creditsScene.affiliation.startsWith('PhD Student')).toBe(true);
      const all = JSON.stringify(locale);
      expect(all).not.toMatch(/Phd|PHD Studen|Studet|Anjeloni|Tusica/);
    }
  });

  test('il contenuto dei credits cambia con la lingua selezionata', () => {
    setLanguage('it');
    expect(L().ui.creditsScene.roleLabel).toBe('Ideazione e direzione scientifica');
    setLanguage('en');
    expect(L().ui.creditsScene.roleLabel).toBe('Concept and scientific direction');
    setLanguage('it');
  });

  test('CreditsScene usa solo chiavi i18n: nessuna stringa di credito hardcoded', () => {
    const source = readFileSync(
      new URL('../src/game/scenes/CreditsScene.ts', import.meta.url),
      'utf-8'
    );
    expect(source).not.toContain('Matteo Angeloni');
    expect(source).not.toContain('PhD');
    expect(source).not.toContain('Tuscia');
    expect(source).not.toContain('Ideazione');
    expect(source).not.toContain('Concept and');
    expect(source).toContain('L().ui.creditsScene');
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

/**
 * MAIUSCOLE SUI PULSANTI.
 *
 * Il gioco scrive le etichette dei pulsanti in maiuscolo — è la sua voce,
 * quella di un'ispettorato che stampa moduli. Alcune aggiunte recenti erano
 * arrivate in minuscolo, e sulla stessa riga della mappa convivevano
 * "ARCHIVIO NORME", "MENU", "Capitoli" e "Taccuino": non un errore di
 * layout, ma abbastanza da far sembrare la schermata montata da due
 * persone diverse.
 *
 * La regola si applica alle chiavi che si chiamano `button`, cioè
 * esattamente quelle che finiscono dentro un Button. L'elenco si legge dal
 * dizionario: una voce nuova è coperta il giorno che nasce.
 */
describe('le etichette dei pulsanti parlano con la stessa voce', () => {
  /** Tutte le coppie [percorso, valore] delle chiavi chiamate `button`. */
  const buttonLabels = (node: unknown, path = ''): Array<[string, string]> => {
    if (typeof node !== 'object' || node === null) return [];
    const out: Array<[string, string]> = [];
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const here = path ? `${path}.${k}` : k;
      if (k === 'button' && typeof v === 'string') out.push([here, v]);
      else out.push(...buttonLabels(v, here));
    }
    return out;
  };

  for (const [lang, dict] of [['it', it], ['en', en]] as const) {
    test(`${lang}: nessuna etichetta di pulsante in minuscolo`, () => {
      // TUTTO il dizionario, non il solo ramo `ui`: taccuino e capitoli
      // vivono altrove, e limitarsi a `ui` rendeva la guardia cieca proprio
      // sui due pulsanti che avevano il difetto.
      const labels = buttonLabels(dict);
      expect(labels.length, 'nessuna chiave letta: il controllo sarebbe inerte').toBeGreaterThan(7);
      const offenders = labels.filter(([, v]) => v !== v.toLocaleUpperCase(lang === 'it' ? 'it-IT' : 'en-US'));
      expect(offenders.map(([k, v]) => `${k} = "${v}"`), offenders.map(([k, v]) => `${k} = "${v}"`).join('\n')).toEqual([]);
    });
  }
});

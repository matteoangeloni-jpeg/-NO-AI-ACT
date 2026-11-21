import { describe, expect, it } from 'vitest';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { LANGUAGE_CODES, LOCALES, type Locale } from '../src/game/i18n';

/**
 * GLI INDICI DEVONO VOLER DIRE LA STESSA COSA NELLE DUE LINGUE (U08).
 *
 * Il gioco non salva testi: salva NUMERI. Un rapporto archiviato registra
 * `citedClues: [0, 2]` e `motivationIndex: 1`; una bozza fa lo stesso; e
 * cases.ts dichiara `relevantClues`, `correctMotivation` e `weakMotivation`
 * una volta sola, validi per entrambe le lingue.
 *
 * Tutto questo regge su un presupposto che nessuno verificava: che la
 * traduzione abbia lo STESSO numero di reperti e di motivazioni, nello
 * stesso ordine. Se un giorno la versione inglese di un caso perdesse un
 * reperto, `relevantClues: [1, 2]` punterebbe fuori dall'elenco, un
 * rapporto già archiviato cambierebbe significato cambiando lingua, e una
 * bozza ripresa in inglese ricostruirebbe una decisione diversa da quella
 * lasciata in italiano. Nessuno di questi guasti darebbe un errore: il
 * gioco continuerebbe, valutando la cosa sbagliata.
 *
 * Oggi l'allineamento c'è. Questo test serve perché continui a esserci.
 */

const locales = LANGUAGE_CODES.map(lang => [lang, LOCALES[lang]] as const);

const caseTexts = (dict: Locale, id: string): { clues: unknown[]; motivations: unknown[]; clueSources?: unknown[] } =>
  (dict.cases as unknown as Record<string, { clues: unknown[]; motivations: unknown[]; clueSources?: unknown[] }>)[id];

describe('tutte le lingue descrivono ogni caso con indici equivalenti', () => {
  for (const c of PLAYABLE_CASES) {
    it(`${c.id}: reperti, fonti e motivazioni hanno la stessa lunghezza`, () => {
      const a = caseTexts(LOCALES.it, c.id);
      for (const [lang, dict] of locales) {
        const b = caseTexts(dict, c.id);
        expect(b, `${c.id} manca in ${lang}`).toBeTruthy();
        expect(b.clues.length, `${lang}: numero di reperti diverso`).toBe(a.clues.length);
        expect(b.motivations.length, `${lang}: numero di motivazioni diverso`).toBe(a.motivations.length);
        expect(b.clueSources, `${lang}: le fonti devono restare chiavi canoniche`).toEqual(a.clueSources);
      }
    });
  }
});

describe('ogni indice dichiarato in cases.ts esiste in entrambe le lingue', () => {
  for (const [lang, dict] of locales) {
    it(`${lang}: nessun indice punta fuori dagli elenchi tradotti`, () => {
      const offenders: string[] = [];
      for (const c of PLAYABLE_CASES) {
        const t = caseTexts(dict, c.id);
        for (const i of c.relevantClues) {
          if (i < 0 || i >= t.clues.length) offenders.push(`${c.id}.relevantClues ${i} su ${t.clues.length} reperti`);
        }
        for (const key of ['correctMotivation', 'weakMotivation'] as const) {
          const v = c[key];
          if (v < 0 || v >= t.motivations.length) offenders.push(`${c.id}.${key} ${v} su ${t.motivations.length} motivazioni`);
        }
        if (c.clueStances && c.clueStances.length !== t.clues.length) {
          offenders.push(`${c.id}.clueStances ${c.clueStances.length} ≠ ${t.clues.length} reperti`);
        }
      }
      expect(offenders, offenders.join('\n')).toEqual([]);
    });
  }

  it('la motivazione corretta e quella debole non coincidono', () => {
    for (const c of PLAYABLE_CASES) {
      expect(c.correctMotivation, `${c.id}: la motivazione debole è quella giusta`).not.toBe(c.weakMotivation);
    }
  });

  it('il minimo di reperti da citare è raggiungibile in entrambe le lingue', () => {
    for (const [lang, dict] of locales) {
      for (const c of PLAYABLE_CASES) {
        const n = caseTexts(dict, c.id).clues.length;
        expect(n, `${lang}/${c.id}: ${n} reperti non bastano per i ${c.relevantClues.length} rilevanti`).toBeGreaterThanOrEqual(
          c.relevantClues.length
        );
      }
    }
  });
});

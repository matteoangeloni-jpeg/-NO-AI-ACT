import { describe, expect, it } from 'vitest';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

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

const LOCALES = [
  ['it', itDict],
  ['en', en]
] as const;

const caseTexts = (dict: typeof itDict, id: string): { clues: unknown[]; motivations: unknown[]; clueSources?: unknown[] } =>
  (dict.cases as unknown as Record<string, { clues: unknown[]; motivations: unknown[]; clueSources?: unknown[] }>)[id];

describe('IT ed EN descrivono ogni caso con lo stesso numero di elementi', () => {
  for (const c of PLAYABLE_CASES) {
    it(`${c.id}: reperti, fonti e motivazioni hanno la stessa lunghezza`, () => {
      const a = caseTexts(itDict, c.id);
      const b = caseTexts(en, c.id);
      expect(a, `${c.id} manca in italiano`).toBeTruthy();
      expect(b, `${c.id} manca in inglese`).toBeTruthy();
      expect(b.clues.length, 'numero di reperti diverso fra le due lingue').toBe(a.clues.length);
      expect(b.motivations.length, 'numero di motivazioni diverso fra le due lingue').toBe(a.motivations.length);
      expect(b.clueSources?.length ?? 0, 'numero di fonti diverso fra le due lingue').toBe(a.clueSources?.length ?? 0);
    });
  }
});

describe('ogni indice dichiarato in cases.ts esiste in entrambe le lingue', () => {
  for (const [lang, dict] of LOCALES) {
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
    for (const [lang, dict] of LOCALES) {
      for (const c of PLAYABLE_CASES) {
        const n = caseTexts(dict, c.id).clues.length;
        expect(n, `${lang}/${c.id}: ${n} reperti non bastano per i ${c.relevantClues.length} rilevanti`).toBeGreaterThanOrEqual(
          c.relevantClues.length
        );
      }
    }
  });
});

import { describe, expect, it } from 'vitest';
import { LEGAL_MATRIX } from '../src/game/data/learningModel';
import { it as itTexts } from '../src/game/i18n/it';
import { en as enTexts } from '../src/game/i18n/en';

/**
 * L'AI ACT CHE IL GIOCO CITA È QUELLO MODIFICATO.
 *
 * Il Regolamento (UE) 2026/1744 — Digital Omnibus sull'IA, in vigore dal
 * 27 luglio 2026 — ha modificato il Reg. (UE) 2024/1689. Nessun testo del
 * gioco era diventato FALSO: le carte norma non contengono date e i loro
 * riferimenti reggono, cosa che è stata verificata articolo per articolo.
 * Una cosa però era diventata fuorviante: la citazione nominava lo strumento
 * originario, e chi la seguiva sul testo consolidato trovava un articolo
 * diverso da quello descritto. L'articolo 5 in particolare è passato da otto
 * a dieci lettere, più due paragrafi nuovi.
 *
 * PERCHÉ UNA GUARDIA E NON SOLO LA CORREZIONE. Il difetto non era in un posto:
 * era in una classe di posti — due riferimenti di carta, due disclaimer, sei
 * ancore della matrice legale. Una carta scritta fra sei mesi ricopierebbe il
 * formato della vicina e reintrodurrebbe la citazione incompleta senza che
 * nessuno lo noti.
 *
 * E ATTRAVERSA TUTTO IL DIZIONARIO, NON UN ELENCO DI PERCORSI.
 * La prima stesura enumerava a mano dove guardare, e sbagliò due percorsi su
 * due: `subtitle` invece di `ui.footerDisclaimer`, e il disclaimer del
 * rapporto un livello più in alto del vero. Un elenco scritto a mano è
 * esattamente il difetto che questo controllo esiste per prevenire — e
 * invecchia al primo testo nuovo. Ora visita ricorsivamente entrambi i
 * dizionari: qualunque stringa, presente o futura, che nomini il regolamento
 * viene esaminata.
 *
 * COSA NON PRETENDE. Non pretende che ogni carta nomini il regolamento: la
 * maggioranza cita l'articolo senza lo strumento («AI Act — art. 5»), ed è una
 * scelta di leggibilità legittima. Pretende che CHI lo nomina lo nomini per
 * intero: dove compare 2024/1689, deve comparire anche 2026/1744.
 */

const ORIGINARIO = /2024\/1689/;
const MODIFICATIVO = /2026\/1744/;

/** Ogni stringa dei due dizionari, con il percorso da cui viene. */
function tutteLeStringhe(): { dove: string; testo: string }[] {
  const out: { dove: string; testo: string }[] = [];
  const visita = (nodo: unknown, percorso: string): void => {
    if (typeof nodo === 'string') {
      out.push({ dove: percorso, testo: nodo });
      return;
    }
    if (Array.isArray(nodo)) {
      nodo.forEach((v, i) => visita(v, `${percorso}[${i}]`));
      return;
    }
    if (nodo && typeof nodo === 'object') {
      for (const [k, v] of Object.entries(nodo as Record<string, unknown>)) {
        visita(v, percorso ? `${percorso}.${k}` : k);
      }
    }
  };
  visita(itTexts, 'it');
  visita(enTexts, 'en');
  for (const riga of LEGAL_MATRIX) out.push({ dove: `legalMatrix.${riga.provision}`, testo: riga.articleRef });
  return out;
}

describe("le citazioni del gioco nominano l'AI Act modificato", () => {
  it('nessuna stringa cita il Reg. 2024/1689 senza il Reg. 2026/1744 che lo modifica', () => {
    const incomplete = tutteLeStringhe()
      .filter((s) => ORIGINARIO.test(s.testo) && !MODIFICATIVO.test(s.testo))
      .map((s) => `${s.dove}: "${s.testo.slice(0, 100)}"`);

    expect(
      incomplete,
      'citazione allo strumento originario senza il modificativo — chi la segue trova un testo diverso da quello descritto:\n  ' +
        incomplete.join('\n  ')
    ).toEqual([]);
  });

  it('il controllo non è inerte: il regolamento è citato davvero, e in entrambe le lingue', () => {
    // Senza questa asserzione il controllo sopra sarebbe verde anche se il
    // gioco smettesse di citare il regolamento del tutto, cioè proprio nel
    // caso in cui la citazione andrebbe verificata. È la lezione delle guardie
    // che non potevano fallire.
    const citanti = tutteLeStringhe().filter((s) => ORIGINARIO.test(s.testo));
    expect(citanti.length, 'nessuna citazione trovata: la guardia non misura niente').toBeGreaterThanOrEqual(8);
    expect(citanti.some((s) => s.dove.startsWith('it.')), 'nessuna citazione in italiano').toBe(true);
    expect(citanti.some((s) => s.dove.startsWith('en.')), 'nessuna citazione in inglese').toBe(true);
  });

  it('le ancore della matrice legale sono tutte aggiornate', () => {
    expect(LEGAL_MATRIX.length).toBeGreaterThanOrEqual(6);
    for (const riga of LEGAL_MATRIX) {
      expect(riga.articleRef, riga.provision).toMatch(ORIGINARIO);
      expect(riga.articleRef, riga.provision).toMatch(MODIFICATIVO);
    }
  });
});

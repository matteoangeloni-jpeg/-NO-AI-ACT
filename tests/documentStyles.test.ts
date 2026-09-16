import { describe, expect, it } from 'vitest';
import { DOCUMENT_STYLES, NEUTRAL_STYLE, documentTextureKey, type DocumentStyle } from '../src/game/assets/procedural/documentStyles';
import { COLOR_STR } from '../src/game/ui/theme';

/**
 * FOGLI DEI REPERTI — le proprietà che devono restare vere.
 *
 * Ogni tipo di fonte ha un trattamento visivo suo. Il rischio di un sistema
 * del genere è che l'atmosfera mangi la leggibilità: un foglio più chiaro
 * rende l'etichetta della fonte più difficile da leggere, e non se ne
 * accorge nessuno finché non si prova a leggerla su un proiettore.
 *
 * Qui l'elenco dei fogli si LEGGE dalla tabella degli stili, non si
 * ricopia: aggiungere un tipo lo sottopone automaticamente agli stessi
 * controlli.
 */

const TUTTI: [string, DocumentStyle][] = [
  ...Object.entries(DOCUMENT_STYLES),
  ['neutro', NEUTRAL_STYLE]
];

/** Luminanza relativa secondo WCAG 2.1. */
function luminanza(hex: string): number {
  const h = hex.replace('#', '');
  const canale = (i: number): number => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canale(0) + 0.7152 * canale(2) + 0.0722 * canale(4);
}

function contrasto(a: string, b: string): number {
  const [la, lb] = [luminanza(a), luminanza(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Composizione di un colore semitrasparente sopra un fondo opaco. */
function sopra(fg: string, alpha: number, bg: string): string {
  const val = (hex: string, i: number): number => parseInt(hex.replace('#', '').slice(i, i + 2), 16);
  const mix = (i: number): string =>
    Math.round(alpha * val(fg, i) + (1 - alpha) * val(bg, i))
      .toString(16)
      .padStart(2, '0');
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

/**
 * Opacità della fascia d'intestazione disegnata da `createDocumentTextures`.
 * È il fondo VERO su cui cade l'etichetta della fonte: misurare il
 * contrasto sulla carta nuda darebbe un valore più severo del reale e
 * boccerebbe fogli che si leggono benissimo.
 */
const FASCIA_ALPHA = 0.55;
const FASCIA_COLORE = '#07090f';

describe('il testo resta leggibile su ogni foglio', () => {
  it('il corpo del reperto supera la soglia AA su tutti i fogli', () => {
    for (const [nome, stile] of TUTTI) {
      const r = contrasto(COLOR_STR.paper, stile.fill);
      expect(r, `corpo illeggibile sul foglio "${nome}": ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('il titolo del reperto supera la soglia AA su tutti i fogli', () => {
    for (const [nome, stile] of TUTTI) {
      const r = contrasto(COLOR_STR.warning, stile.fill);
      expect(r, `titolo illeggibile sul foglio "${nome}": ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("l'etichetta della fonte supera la soglia AA sulla fascia d'intestazione", () => {
    /**
     * Misurato: sulla carta NUDA i due fogli più chiari (reclamo, brochure)
     * scendono a 4,00, sotto la soglia. È la fascia scura d'intestazione a
     * salvarli, portandoli a 4,58 — e quella fascia era stata messa per il
     * layout, non per il contrasto. Ora è una regola: chi la schiarisce, o
     * chi aggiunge un foglio più chiaro, trova questo test rosso.
     */
    for (const [nome, stile] of TUTTI) {
      const fondo = sopra(FASCIA_COLORE, FASCIA_ALPHA, stile.fill);
      const r = contrasto(COLOR_STR.accentText, fondo);
      expect(r, `etichetta fonte illeggibile sul foglio "${nome}": ${r.toFixed(2)} su ${fondo}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('i fogli sono davvero distinti', () => {
  it('nessun tipo di fonte condivide lo stesso fondo di un altro', () => {
    // Due tipi con lo stesso fondo E gli stessi tratti sarebbero lo stesso
    // foglio con due nomi: la classificazione smetterebbe di vedersi.
    const impronte = Object.entries(DOCUMENT_STYLES).map(([nome, s]) =>
      [nome, `${s.fill}|${s.ruleStep}|${s.gridStep}|${s.redactions}|${s.punched}|${s.glitch}`] as const
    );
    const viste = new Map<string, string>();
    for (const [nome, impronta] of impronte) {
      const gemello = viste.get(impronta);
      expect(gemello, `"${nome}" è indistinguibile da "${gemello}"`).toBeUndefined();
      viste.set(impronta, nome);
    }
  });

  it('ogni fonte ha una chiave di texture propria, e il neutro la sua', () => {
    const chiavi = Object.keys(DOCUMENT_STYLES).map((s) => documentTextureKey(s as never));
    expect(new Set(chiavi).size).toBe(chiavi.length);
    expect(chiavi).not.toContain(documentTextureKey(null));
  });

  it('la grana resta in un intervallo che non copre il testo', () => {
    for (const [nome, stile] of TUTTI) {
      expect(stile.grain, `grana fuori scala su "${nome}"`).toBeGreaterThanOrEqual(0);
      expect(stile.grain, `grana fuori scala su "${nome}"`).toBeLessThanOrEqual(1);
    }
  });
});

/**
 * CONTRASTO, CALCOLATO INVECE CHE STIMATO.
 *
 * In theme.ts c'era una nota scritta a mano — «#e25b5b regge ~5.5:1 su nero
 * carbone» — giusta, ma che nessuno verificava: se un domani qualcuno
 * ritoccasse quel valore, la nota sarebbe rimasta lì a dire il contrario del
 * vero. Qui il rapporto si calcola, e un test lo confronta con le soglie.
 *
 * Formula di WCAG 2.2 (luminanza relativa + rapporto di contrasto). Nessuna
 * dipendenza: sono quindici righe di aritmetica.
 *
 * Nota di onestà, coerente con il resto del progetto: calcolare i rapporti
 * NON significa dichiarare la conformità WCAG del gioco. Il contrasto è uno
 * dei criteri, e l'unico che si possa misurare da un file di colori.
 */

/** Soglia AA per il testo normale. */
export const AA_NORMAL = 4.5;
/** Soglia AA per il testo grande (≥24px, o ≥18.66px in grassetto). */
export const AA_LARGE = 3;
/** Sotto questo corpo un testo non è "grande" ai fini di WCAG. */
export const LARGE_TEXT_PX = 24;

const channel = (hex: string, index: number): number => {
  const v = parseInt(hex.replace('#', '').slice(index, index + 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

/** Luminanza relativa di un colore #rrggbb. */
export function luminance(hex: string): number {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 2) + 0.0722 * channel(hex, 4);
}

/** Rapporto di contrasto fra due colori, da 1 a 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Colore effettivo di un fondo semitrasparente sopra un altro.
 * I pannelli del gioco sono disegnati al 92%: il fondo su cui si legge il
 * testo non è il colore del pannello, è la mescolanza.
 */
export function blend(front: string, back: string, alpha: number): string {
  const part = (hex: string, i: number): number => parseInt(hex.replace('#', '').slice(i, i + 2), 16);
  const mixed = [0, 2, 4].map((i) => Math.round(part(front, i) * alpha + part(back, i) * (1 - alpha)));
  return `#${mixed.map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

/** Soglia richiesta per un testo di quel corpo. */
export function requiredRatio(fontSizePx: number, bold = false): number {
  const large = fontSizePx >= LARGE_TEXT_PX || (bold && fontSizePx >= 18.66);
  return large ? AA_LARGE : AA_NORMAL;
}

import Phaser from 'phaser';
import type { Classification, Measure } from '../../data/types';
import { COLOR_STR, RENDER_SCALE } from '../../ui/theme';

/**
 * QUANTO PESA UNA SCELTA, PRIMA DI SCEGLIERE.
 *
 * I passi della decisione erano sette righe di testo tutte uguali. Il
 * giocatore doveva sapere già, a memoria, che «blocco» è la misura più dura
 * e «nessuna» la più tenue: un'informazione che il gioco possiede e non
 * mostrava, e che senza non si può nemmeno ragionare di proporzionalità —
 * che è il cuore della materia.
 *
 * NON È UN SUGGERIMENTO. La scala dice quanto una misura è INVASIVA, non
 * quanto è GIUSTA: la misura giusta può stare in cima o in fondo secondo il
 * caso, ed è esattamente questo il giudizio che il gioco chiede. Mostrare
 * quanto pesa un'opzione aiuta a pesarla; non dice quale scegliere.
 *
 * NON È COLORE. La gravità si legge dalle tacche PIENE su cinque: si conta,
 * e si conta anche in bianco e nero. Il colore segue, e da solo non porta
 * mai l'informazione.
 */

/** Cinque gradini: abbastanza per distinguere, pochi per contarli a colpo d'occhio. */
export const SEVERITY_STEPS = 5;

/**
 * Quanto è INVASIVA ciascuna classificazione, da 5 (regime più stretto) a 1
 * (nessun regime). È l'ordine del regolamento, non un'opinione.
 */
export const CLASSIFICATION_SEVERITY: Record<Classification, number> = {
  vietata: 5,
  alto_rischio: 4,
  trasparenza: 3,
  basso_rischio: 2,
  non_rilevante: 1
};

/**
 * Quanto è invasiva ciascuna misura. Spegnere un sistema incide su tutti;
 * tenere i log incide su nessuno. In mezzo c'è la proporzionalità.
 */
export const MEASURE_SEVERITY: Record<Measure, number> = {
  blocco: 5,
  oversight: 4,
  audit: 3,
  informare: 2,
  etichettare: 2,
  dati_logging: 1,
  nessuna: 0
};

const W = 46;
const H = 10;

export const severityKey = (livello: number): string => `severity_${livello}`;

/**
 * La scala: cinque tacche, le prime `livello` piene. Una texture per
 * livello, condivisa da tutte le opzioni che hanno quel peso.
 */
export function createSeverityGauge(scene: Phaser.Scene, livello: number): string | null {
  const key = severityKey(livello);
  if (scene.textures.exists(key)) return key;
  const canvas = scene.textures.createCanvas(key, W * RENDER_SCALE, H * RENDER_SCALE);
  if (!canvas) return null;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);

  const passo = W / SEVERITY_STEPS;
  for (let i = 0; i < SEVERITY_STEPS; i++) {
    const piena = i < livello;
    const x = i * passo + 1;
    const w = passo - 3;
    if (piena) {
      ctx.fillStyle = COLOR_STR.warning;
      ctx.fillRect(x, 1, w, H - 2);
    } else {
      ctx.strokeStyle = 'rgba(154,152,143,0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, 1.5, w - 1, H - 3);
    }
  }
  canvas.refresh();
  return key;
}

export const SEVERITY_SIZE = { width: W, height: H };

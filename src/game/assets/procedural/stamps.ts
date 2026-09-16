import Phaser from 'phaser';
import { COLOR_STR, RENDER_SCALE } from '../../ui/theme';
import { between, drawStamp, seeded } from './kit';

/**
 * I TIMBRI: cornici mute, parole a carico di chi le usa.
 *
 * Un caso chiuso si distingueva solo per il colore dell'anello sul
 * segnaposto — informazione affidata al solo colore, e per giunta minuscola.
 * Il timbro si legge anche in bianco e nero, e resta sulla mappa a ricordare
 * che quella decisione è stata presa.
 *
 * QUI DENTRO NON SI SCRIVE NIENTE. La prima versione cuoceva l'etichetta
 * ("CONFORME", "CONTESTABILE") nei pixel del canvas. Una texture nasce una
 * volta sola e sopravvive al cambio di lingua — che ricarica la schermata,
 * non le texture — quindi chi passava all'inglese continuava a leggere i
 * timbri in italiano sulla mappa. La cornice è muta; la parola la mette il
 * chiamante con un testo di Phaser, che segue la lingua, si ingrandisce con
 * il resto del testo e arriva allo strato di lettura.
 */

export type StampTone = 'correct' | 'partial' | 'wrong';

export const OUTCOME_STAMP_KEYS: Record<StampTone, string> = {
  correct: 'stamp_conforme',
  partial: 'stamp_parziale',
  wrong: 'stamp_contestabile'
};

/** Cornice del timbro "citato" sulle schede reperto. */
export const CITE_STAMP_KEY = 'stamp_citato';

/**
 * MISURE PRESE DALLE PAROLE, NON A OCCHIO.
 *
 * La cornice d'esito era 132×30 con l'etichetta a 11px. "PARZIALMENTE
 * CONFORME" sono 21 caratteri: a 11px di monospace fanno ~139px, cioè più
 * larghi dei 124 di luce interna — la parola usciva dal timbro da entrambi
 * i lati. Non si vedeva perché l'esito parziale è quello che capita meno.
 *
 * Il rapporto fra le due misure è quello che `tests/proceduralTextures`
 * verifica sulle etichette VERE di tutte e due le lingue, invece di
 * fidarsi di una prova a schermo fatta in italiano.
 */
const STAMP_W = 148;
const STAMP_H = 30;
/** Corpo dell'etichetta che il chiamante scrive sopra la cornice. */
export const OUTCOME_STAMP_FONT = 10;
export const CITE_STAMP_FONT = 12.5;
/** Luce interna: la cornice è disegnata a 8px dal bordo della texture. */
export const STAMP_PADDING = 8;
/** Passo medio di un carattere monospace, in frazione del corpo. */
export const MONO_ADVANCE = 0.6;
// Larghezza presa dall'etichetta più lunga che ci va dentro, non a occhio:
// "CITATO NEL RAPPORTO ▣" sono 21 caratteri a 12,5px di monospace, cioè
// ~158px. Una cornice da 150 li avrebbe lasciati sbordare da entrambi i lati.
const CITE_W = 196;
const CITE_H = 26;

/** Disegna una cornice consumata al centro di una texture nuova. */
function cornice(scene: Phaser.Scene, key: string, w: number, h: number, colore: string, seme: string): void {
  if (scene.textures.exists(key)) return;
  const canvas = scene.textures.createCanvas(key, w * RENDER_SCALE, h * RENDER_SCALE);
  if (!canvas) return;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.translate(w / 2, h / 2);
  const rnd = seeded(seme);
  // Seme dalla chiave: lo stesso timbro è sempre consumato allo stesso modo,
  // ma due timbri diversi non escono identici.
  drawStamp(ctx, rnd, {
    color: colore,
    width: w - 8,
    height: h - 8,
    wear: between(rnd, 0.16, 0.28)
  });
  canvas.refresh();
}

/** Le tre cornici d'esito, condivise da tutti i segnaposto della mappa. */
export function createOutcomeStamps(scene: Phaser.Scene): void {
  const colori: Record<StampTone, string> = {
    correct: COLOR_STR.ok,
    partial: COLOR_STR.warning,
    wrong: COLOR_STR.alertText
  };
  for (const esito of ['correct', 'partial', 'wrong'] as const) {
    cornice(scene, OUTCOME_STAMP_KEYS[esito], STAMP_W, STAMP_H, colori[esito], `timbro:${esito}`);
  }
}

/**
 * La cornice del reperto citato. Citare era un cambio di colore del bordo
 * più una parola che cambiava: due segnali, uno dei quali affidato al solo
 * colore. Con la cornice il reperto incluso nel rapporto si vede come un
 * documento timbrato, che è esattamente quello che è.
 */
export function createCiteStamp(scene: Phaser.Scene): void {
  cornice(scene, CITE_STAMP_KEY, CITE_W, CITE_H, COLOR_STR.ok, 'timbro:citato');
}

export const CITE_STAMP_SIZE = { width: CITE_W, height: CITE_H };
export const OUTCOME_STAMP_SIZE = { width: STAMP_W, height: STAMP_H };

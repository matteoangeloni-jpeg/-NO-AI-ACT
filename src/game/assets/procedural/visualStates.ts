import Phaser from 'phaser';
import { COLOR_STR, RENDER_SCALE, textStyle } from '../../ui/theme';
import { L } from '../../i18n';
import {
  between,
  drawCornerTicks,
  drawFrameBroken,
  drawFrameDouble,
  drawFrameSolid,
  drawHalfFill,
  drawHatch,
  drawStamp,
  seeded
} from './kit';

/**
 * UN LINGUAGGIO SOLO PER TUTTI GLI STATI.
 *
 * Il gioco aveva dieci stati e sei modi diversi di dirli: un bordo verde
 * qui, una parola lì, un anello colorato sulla mappa, un riquadro nel
 * rapporto. Chi imparava a leggerne uno non sapeva leggere gli altri, e
 * quasi tutti finivano per appoggiarsi al colore — che è il primo segnale a
 * sparire su un proiettore, su una stampa, o per chi non distingue rosso e
 * verde.
 *
 * Qui ogni stato ha TRE segnali, e solo uno è il colore:
 *
 *   1. una FORMA (un glifo geometrico) che sta davanti all'etichetta;
 *   2. un TRATTAMENTO DELLA CORNICE, che è la forma stessa del riquadro;
 *   3. il colore.
 *
 * Togliendo il colore restano due segnali; togliendo anche la forma resta
 * la cornice. È questo che rende la lettura possibile in bianco e nero.
 *
 * I GLIFI vengono tutti dal blocco Geometric Shapes (U+25A0–U+25FF), l'unico
 * di cui il gioco ha già la prova a schermo: ▢ ▣ ▸ ◂ ▲ ▼ erano in uso da
 * prima. Un glifo da un blocco non verificato esce come rettangolo vuoto
 * sulle macchine senza quel font, e sarebbe un segnale in meno proprio dove
 * servono di più.
 *
 * LE PAROLE NON SONO QUI. Arrivano da i18n al momento in cui si costruisce
 * il distintivo, come per ogni altro testo del gioco.
 */

export type VisualState =
  | 'sigillato'
  | 'aperto'
  | 'citato'
  | 'prova_decisiva'
  | 'contraddizione'
  | 'procedibile'
  | 'conforme'
  | 'parziale'
  | 'contestabile'
  | 'non_conforme';

/** Come si disegna la cornice di uno stato. */
export type FrameTreatment = 'chiusa' | 'angoli' | 'timbro' | 'doppia' | 'interrotta' | 'tratteggiata' | 'barrata' | 'mezza';

export interface StateMark {
  /** Glifo geometrico che precede sempre l'etichetta. */
  glyph: string;
  treatment: FrameTreatment;
  color: string;
  /** Spessore della cornice, in unità logiche. */
  weight: number;
}

export const STATE_MARKS: Record<VisualState, StateMark> = {
  // ---- il reperto, lungo la sua vita
  // quadrato vuoto, cornice chiusa: non si sa che cosa c'è dentro
  sigillato: { glyph: '▢', treatment: 'chiusa', color: COLOR_STR.paperDim, weight: 1 },
  // quadrato rigato, cornice aperta agli angoli: il foglio si legge
  aperto: { glyph: '▤', treatment: 'angoli', color: COLOR_STR.accentText, weight: 1 },
  // quadrato dentro quadrato, cornice consumata: è stato preso e timbrato
  citato: { glyph: '▣', treatment: 'timbro', color: COLOR_STR.ok, weight: 2 },
  // rombo pieno, cornice doppia: il perno su cui regge la classificazione
  prova_decisiva: { glyph: '◆', treatment: 'doppia', color: COLOR_STR.warning, weight: 2 },
  // quadrato diviso in due, cornice interrotta: due versioni nello stesso atto
  contraddizione: { glyph: '◫', treatment: 'interrotta', color: COLOR_STR.alertText, weight: 2 },
  // freccia, cornice tratteggiata: la pratica si può aprire
  procedibile: { glyph: '▸', treatment: 'tratteggiata', color: COLOR_STR.accentText, weight: 1 },

  // ---- l'esito dell'atto
  // quadrato pieno, cornice doppia: chiuso e confermato
  conforme: { glyph: '■', treatment: 'doppia', color: COLOR_STR.ok, weight: 2 },
  // quadrato pieno a metà, cornice riempita a metà: regge solo in parte
  parziale: { glyph: '◧', treatment: 'mezza', color: COLOR_STR.warning, weight: 2 },
  // rombo vuoto, cornice interrotta: l'atto ha un vuoto, si può contestare
  contestabile: { glyph: '◇', treatment: 'interrotta', color: COLOR_STR.warning, weight: 2 },
  // tratteggio obliquo sopra tutto: annullato
  non_conforme: { glyph: '▨', treatment: 'barrata', color: COLOR_STR.alertText, weight: 2 }
};

/**
 * L'etichetta di uno stato, dalla lingua corrente. I quattro esiti si
 * leggono da `ui.outcomes`, dove esistevano già: riscriverli sotto
 * `ui.states` avrebbe creato due elenchi da tenere allineati a mano.
 */
export function stateLabel(state: VisualState): string {
  const t = L().ui;
  switch (state) {
    case 'conforme':
    case 'parziale':
    case 'contestabile':
    case 'non_conforme':
      return t.outcomes[state];
    default:
      return t.states[state];
  }
}

/** Il testo completo del distintivo: glifo e parola, mai la sola parola. */
export const stateText = (state: VisualState): string => `${STATE_MARKS[state].glyph} ${stateLabel(state)}`;

const PADDING = 8;

/** Chiave della texture della cornice: dipende dallo stato e dalla misura. */
export const stateFrameKey = (state: VisualState, w: number, h: number): string => `state_${state}_${w}x${h}`;

/**
 * Genera la cornice di uno stato, se non esiste già. Muta: nessuna parola
 * entra nella texture, per la regola del sistema (una texture sopravvive al
 * cambio di lingua, una parola no).
 */
/**
 * Disegna il TRATTAMENTO di uno stato attorno all'origine. Sta qui e non
 * dentro `createStateFrame` perché il sigillo del rapporto lo usa alla
 * propria misura e con il proprio seme: due switch sugli stessi otto casi
 * sarebbero divergiti alla prima aggiunta.
 */
export function drawStateTreatment(
  ctx: CanvasRenderingContext2D,
  rnd: () => number,
  state: VisualState,
  w: number,
  h: number
): void {
  const mark = STATE_MARKS[state];
  switch (mark.treatment) {
    case 'chiusa':
      drawFrameSolid(ctx, w, h, mark.weight, mark.color);
      break;
    case 'angoli':
      // i crocini si disegnano dall'angolo in alto a sinistra, non dal centro
      ctx.save();
      ctx.translate(-w / 2, -h / 2);
      drawCornerTicks(ctx, w, h, 1, Math.min(12, h / 2), mark.color);
      ctx.restore();
      break;
    case 'timbro':
      drawStamp(ctx, rnd, { color: mark.color, width: w, height: h, wear: between(rnd, 0.14, 0.26) });
      break;
    case 'doppia':
      // lo scarto fra le due cornici varia col seme: due atti conformi non
      // escono identici, ma nessuno dei due esce disordinato
      drawFrameDouble(ctx, w, h, mark.weight, mark.color, between(rnd, 4, 7));
      break;
    case 'interrotta':
      drawFrameBroken(ctx, w, h, mark.weight, mark.color, between(rnd, 0.2, 0.32));
      break;
    case 'tratteggiata':
      drawStamp(ctx, rnd, { color: mark.color, width: w, height: h, wear: 0.45 });
      break;
    case 'barrata':
      drawFrameSolid(ctx, w, h, mark.weight, mark.color);
      drawHatch(ctx, w - 2, h - 2, between(rnd, 8, 12), mark.color, 1);
      break;
    case 'mezza':
      drawFrameSolid(ctx, w, h, mark.weight, mark.color);
      drawHalfFill(ctx, w - 2, h - 2, between(rnd, 0.42, 0.58), mark.color);
      break;
  }
}

/**
 * Genera la cornice di uno stato, se non esiste già. Muta: nessuna parola
 * entra nella texture, per la regola del sistema (una texture sopravvive al
 * cambio di lingua, una parola no).
 */
export function createStateFrame(scene: Phaser.Scene, state: VisualState, w: number, h: number): string | null {
  const key = stateFrameKey(state, w, h);
  if (scene.textures.exists(key)) return key;

  const cw = w + PADDING * 2;
  const ch = h + PADDING * 2;
  const canvas = scene.textures.createCanvas(key, cw * RENDER_SCALE, ch * RENDER_SCALE);
  if (!canvas) return null;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.translate(cw / 2, ch / 2);
  drawStateTreatment(ctx, seeded(`stato:${state}:${w}x${h}`), state, w, h);
  canvas.refresh();
  return key;
}

/**
 * Il distintivo completo — cornice, glifo e parola — come contenitore
 * pronto da posizionare. È l'unico punto in cui il linguaggio degli stati
 * prende forma: una scena che se lo ridisegnasse da sola tornerebbe ad
 * avere il suo dialetto.
 */
/** Passo medio di un carattere monospace, in frazione del corpo. */
export const MONO_ADVANCE = 0.6;

/** Larghezza che il testo di uno stato occupa davvero, in unità logiche. */
export const stateTextWidth = (state: VisualState, fontSize: number): number =>
  stateText(state).length * fontSize * MONO_ADVANCE;

/** Aria fra la parola e la cornice, di qua e di là. */
const RESPIRO = 14;

/**
 * Il distintivo completo — cornice, glifo e parola — come contenitore
 * pronto da posizionare. È l'unico punto in cui il linguaggio degli stati
 * prende forma: una scena che se lo ridisegnasse da sola tornerebbe ad
 * avere il suo dialetto.
 *
 * LA LARGHEZZA SI RICAVA DALLA PAROLA, non si dichiara. Una misura scritta
 * a mano sta bene finché non arriva una traduzione più lunga, e allora il
 * testo esce dalla cornice — è successo davvero, con «PARZIALMENTE
 * CONFORME» che sbordava da un timbro da 132px. Ricavarla è meglio di una
 * guardia che la controlla: il difetto non può nascere.
 */
export function stateBadge(
  scene: Phaser.Scene,
  x: number,
  y: number,
  state: VisualState,
  opts: { minWidth?: number; height?: number; fontSize?: number } = {}
): Phaser.GameObjects.Container {
  const fs = opts.fontSize ?? 11.5;
  const h = opts.height ?? 26;
  const w = Math.ceil(Math.max(opts.minWidth ?? 0, stateTextWidth(state, fs) + RESPIRO * 2));
  const mark = STATE_MARKS[state];
  const box = scene.add.container(x, y);
  const key = createStateFrame(scene, state, w, h);
  if (key) box.add(scene.add.image(0, 0, key).setDisplaySize(w + PADDING * 2, h + PADDING * 2));
  box.add(
    scene.add
      .text(0, 0, stateText(state), textStyle(fs, mark.color, { align: 'center' }))
      .setOrigin(0.5)
  );
  box.setSize(w, h);
  return box;
}

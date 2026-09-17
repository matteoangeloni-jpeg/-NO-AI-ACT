import Phaser from 'phaser';
import type { NormCardData } from '../../data/types';
import { L } from '../../i18n';
import { COLOR_STR, RENDER_SCALE, textStyle } from '../../ui/theme';
import { drawDataGrid, drawFrameSolid, drawHatch, seeded } from './kit';

/**
 * L'IDENTITÀ DELLE CATEGORIE NORMATIVE, IN UN POSTO SOLO.
 *
 * Le cinque famiglie di norme si distinguevano soltanto per il testo e per
 * l'icona del settore — che però racconta *dove* succede (scuola, ospedale,
 * banca), non *sotto quale regime* ricade. Due norme opposte, un divieto e
 * un obbligo di trasparenza, avevano la stessa faccia.
 *
 * LE CINQUE IDENTITÀ NON COINCIDONO CON I QUATTRO LIVELLI, E SI È SCELTO DI
 * NON TOCCARE I DATI. `NormLevel` ha quattro valori, e `restrittivo` tiene
 * insieme due cose molto diverse: la biometria a condizioni e i modelli per
 * finalità generali. La quinta identità si RICAVA — `iconKey === 'icon_model'`
 * marca i GPAI — invece di aggiungere un livello nuovo, che vorrebbe dire
 * rivedere i tredici casi, i testi delle norme e i salvataggi. Quando quei
 * dati verranno rivisti, questa funzione diventa una riga più corta e niente
 * altro cambia: è il motivo per cui la deduzione sta qui e non nelle scene.
 *
 * IL COLORE NON È MAI SOLO. Ogni identità porta un glifo geometrico e un
 * TRATTAMENTO del fondo — sbarre, spunte, righe aperte, scansione, reticolo
 * — che si legge anche in bianco e nero.
 */

export type NormIdentity = 'vietata' | 'alto' | 'trasparenza' | 'biometria' | 'gpai';

/** Come si riempie il fondo del distintivo: il segnale che non è colore. */
export type NormPattern = 'sbarre' | 'spunte' | 'righe_aperte' | 'scansione' | 'reticolo';

export interface NormIdentityStyle {
  /** Glifo dal blocco Geometric Shapes, l'unico con prova a schermo. */
  glyph: string;
  color: string;
  pattern: NormPattern;
}

export const NORM_IDENTITIES: Record<NormIdentity, NormIdentityStyle> = {
  // divieto: la sbarra che chiude
  vietata: { glyph: '▬', color: COLOR_STR.alertText, pattern: 'sbarre' },
  // alto rischio: il sistema resta, ma sotto controllo e audit
  alto: { glyph: '▲', color: COLOR_STR.warning, pattern: 'spunte' },
  // trasparenza: il riquadro si apre, l'informazione esce
  trasparenza: { glyph: '▭', color: COLOR_STR.accentText, pattern: 'righe_aperte' },
  // biometria a condizioni: tratti letti e misurati
  biometria: { glyph: '◉', color: COLOR_STR.paper, pattern: 'scansione' },
  // GPAI: un modello addestrato su una massa di dati
  gpai: { glyph: '▦', color: COLOR_STR.gpai, pattern: 'reticolo' }
};

/** Marcatore dei modelli per finalità generali nei dati esistenti. */
export const GPAI_ICON_KEY = 'icon_model';

/**
 * L'identità di una norma. UNICO punto in cui la deduzione avviene: le
 * scene chiedono qui, invece di ripetere `level === 'restrittivo' && …` in
 * cinque posti che poi divergono.
 */
export function normIdentity(norm: Pick<NormCardData, 'level' | 'iconKey'>): NormIdentity {
  if (norm.level === 'restrittivo') return norm.iconKey === GPAI_ICON_KEY ? 'gpai' : 'biometria';
  return norm.level;
}

/** L'etichetta dell'identità, dalla lingua corrente. */
export const normIdentityLabel = (id: NormIdentity): string => L().ui.normIdentities[id];

/** Testo completo del distintivo: glifo e parola. */
export const normIdentityText = (id: NormIdentity): string => `${NORM_IDENTITIES[id].glyph} ${normIdentityLabel(id)}`;

const PADDING = 6;
/** Passo medio di un carattere monospace, in frazione del corpo. */
const MONO_ADVANCE = 0.6;

export const normBadgeKey = (id: NormIdentity, w: number, h: number): string => `norm_${id}_${w}x${h}`;

/** Disegna il trattamento di fondo, centrato sull'origine. */
function drawPattern(ctx: CanvasRenderingContext2D, p: NormPattern, w: number, h: number, colore: string): void {
  switch (p) {
    case 'sbarre':
      // sbarre oblique fitte: passaggio chiuso
      drawHatch(ctx, w, h, 7, colore, 1.5);
      break;
    case 'spunte': {
      // file di piccole spunte: la lista di controllo di un audit
      ctx.save();
      ctx.strokeStyle = colore;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -w / 2 + 6; x < w / 2 - 4; x += 11) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 3, 4);
        ctx.lineTo(x + 8, -5);
      }
      ctx.stroke();
      ctx.restore();
      break;
    }
    case 'righe_aperte': {
      // righe che si interrompono prima del bordo destro: l'informazione esce
      ctx.save();
      ctx.strokeStyle = colore;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = -h / 2 + 5; y < h / 2 - 2; y += 6) {
        ctx.moveTo(-w / 2 + 4, y);
        ctx.lineTo(w / 2 - 14, y);
      }
      ctx.stroke();
      ctx.restore();
      break;
    }
    case 'scansione': {
      // archi concentrici: un tratto biometrico letto da una macchina
      ctx.save();
      ctx.strokeStyle = colore;
      ctx.lineWidth = 1;
      for (let r = 4; r < h; r += 5) {
        ctx.beginPath();
        ctx.arc(-w / 2 + 10, 0, r, -0.9, 0.9);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case 'reticolo':
      // reticolo fitto: la massa di dati su cui il modello è addestrato
      ctx.save();
      ctx.translate(-w / 2, -h / 2);
      drawDataGrid(ctx, 0, 0, w, h, 5, colore);
      ctx.restore();
      break;
  }
}

/**
 * La cornice con il trattamento della categoria, muta. Il testo lo mette
 * `normIdentityBadge`, come per ogni altra texture del sistema.
 */
export function createNormBadge(scene: Phaser.Scene, id: NormIdentity, w: number, h: number): string | null {
  const key = normBadgeKey(id, w, h);
  if (scene.textures.exists(key)) return key;
  const style = NORM_IDENTITIES[id];
  const cw = w + PADDING * 2;
  const ch = h + PADDING * 2;
  const canvas = scene.textures.createCanvas(key, cw * RENDER_SCALE, ch * RENDER_SCALE);
  if (!canvas) return null;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.translate(cw / 2, ch / 2);

  // il trattamento sta SOTTO il testo e resta debole: deve dare carattere al
  // distintivo, non contendere la lettura della parola che gli sta sopra
  ctx.save();
  ctx.globalAlpha = 0.16;
  drawPattern(ctx, style.pattern, w - 2, h - 2, style.color);
  ctx.restore();

  drawFrameSolid(ctx, w, h, 1.5, style.color);
  // seme dalla chiave: presente per coerenza col resto del sistema, così un
  // trattamento che un giorno vorrà variare ha già da dove pescare
  seeded(key);
  canvas.refresh();
  return key;
}

/**
 * Distintivo completo della categoria: cornice, trattamento, glifo e parola.
 *
 * La larghezza si RICAVA dalla parola, come per i distintivi di stato: una
 * misura scritta a mano regge finché non arriva una traduzione più lunga, e
 * «BIOMETRIA A CONDIZIONI» è già più lunga di quanto si direbbe.
 */
export function normIdentityBadge(
  scene: Phaser.Scene,
  x: number,
  y: number,
  id: NormIdentity,
  opts: { minWidth?: number; height?: number; fontSize?: number } = {}
): Phaser.GameObjects.Container {
  const h = opts.height ?? 24;
  const fs = opts.fontSize ?? 11;
  const w = Math.ceil(Math.max(opts.minWidth ?? 0, normIdentityText(id).length * fs * MONO_ADVANCE + 24));
  const box = scene.add.container(x, y);
  const key = createNormBadge(scene, id, w, h);
  if (key) box.add(scene.add.image(0, 0, key).setDisplaySize(w + PADDING * 2, h + PADDING * 2));
  box.add(
    scene.add
      .text(0, 0, normIdentityText(id), textStyle(fs, NORM_IDENTITIES[id].color, { align: 'center' }))
      .setOrigin(0.5)
  );
  box.setSize(w, h);
  return box;
}

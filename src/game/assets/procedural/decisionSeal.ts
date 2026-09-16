import Phaser from 'phaser';
import type { ReportOutcome } from '../../data/types';
import { COLORS, COLOR_STR, RENDER_SCALE } from '../../ui/theme';
import { between, drawCornerTicks, drawRegistryStrip, drawStamp, seeded } from './kit';

/**
 * IL SIGILLO DELLA DECISIONE.
 *
 * In fondo al rapporto c'era un rettangolo con dentro una parola. Funzionava
 * — l'esito si legge — ma diceva "riquadro dell'interfaccia" proprio nel
 * punto in cui il gioco vuole dire "atto firmato": è l'ultima cosa che il
 * giocatore guarda prima di uscire dal caso, e il momento in cui la sua
 * decisione diventa definitiva.
 *
 * Qui il riquadro diventa un sigillo: cornice doppia consumata, crocini
 * interni, striscia di protocollo. E soprattutto VARIA: il seme è
 * `caso:esito`, quindi due casi chiusi con lo stesso esito non hanno lo
 * stesso sigillo, e lo stesso caso riaperto ha sempre il suo.
 *
 * LE PAROLE RESTANO FUORI. Il sigillo è solo la cornice; l'etichetta
 * dell'esito la mette la scena, con il testo di Phaser preso da i18n. Cuocere
 * la parola qui dentro l'avrebbe congelata in una lingua sola e tolta
 * all'ingrandimento del testo — due regressioni per un pixel di atmosfera.
 */

/** Colore della cornice e del testo per ogni esito. */
export const OUTCOME_COLORS: Record<ReportOutcome, { stroke: number; text: string }> = {
  conforme: { stroke: COLORS.ok, text: COLOR_STR.ok },
  parziale: { stroke: COLORS.warning, text: COLOR_STR.warning },
  contestabile: { stroke: COLORS.warning, text: COLOR_STR.warning },
  non_conforme: { stroke: COLORS.alert, text: COLOR_STR.alertText }
};

/** Misura logica della cornice, e il margine che il consumo può sbordare. */
export const SEAL_WIDTH = 300;
export const SEAL_HEIGHT = 70;
const PADDING = 10;

export const decisionSealKey = (outcome: ReportOutcome, caseId: string): string => `seal_${outcome}_${caseId}`;

/**
 * Genera il sigillo di un caso, se non esiste già. Restituisce la chiave
 * della texture, o null se il canvas non è disponibile: chi chiama deve
 * poter ripiegare sul riquadro semplice invece di restare senza esito.
 */
export function createDecisionSeal(scene: Phaser.Scene, outcome: ReportOutcome, caseId: string): string | null {
  const key = decisionSealKey(outcome, caseId);
  if (scene.textures.exists(key)) return key;

  const w = SEAL_WIDTH + PADDING * 2;
  const h = SEAL_HEIGHT + PADDING * 2;
  const canvas = scene.textures.createCanvas(key, w * RENDER_SCALE, h * RENDER_SCALE);
  if (!canvas) return null;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);

  const rnd = seeded(`sigillo:${caseId}:${outcome}`);
  const colore = COLOR_STR[outcome === 'conforme' ? 'ok' : outcome === 'non_conforme' ? 'alertText' : 'warning'];

  ctx.save();
  ctx.translate(w / 2, h / 2);

  // cornice esterna: consumata, con qualche tratto che salta
  drawStamp(ctx, rnd, {
    color: colore,
    width: SEAL_WIDTH,
    height: SEAL_HEIGHT,
    wear: between(rnd, 0.1, 0.24)
  });

  // cornice interna: più consumata della prima, e mai allo stesso scarto
  const inset = between(rnd, 5, 8);
  ctx.save();
  ctx.globalAlpha = 0.7;
  drawStamp(ctx, rnd, {
    color: colore,
    width: SEAL_WIDTH - inset * 2,
    height: SEAL_HEIGHT - inset * 2,
    wear: between(rnd, 0.28, 0.46)
  });
  ctx.restore();

  ctx.restore();

  // crocini interni e striscia di protocollo: i segni che distinguono un
  // sigillo d'ufficio da una cornice grafica. Restano ai bordi, fuori dalla
  // zona dove la scena scrive l'esito.
  ctx.save();
  ctx.globalAlpha = 0.55;
  drawCornerTicks(ctx, w, h, PADDING + 4, 7, colore);
  drawRegistryStrip(ctx, rnd, w / 2 - 55, h - PADDING - 9, 110, 4, colore);
  ctx.restore();

  canvas.refresh();
  return key;
}

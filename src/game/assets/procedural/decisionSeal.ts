import Phaser from 'phaser';
import type { ReportOutcome } from '../../data/types';
import { COLORS, COLOR_STR, RENDER_SCALE } from '../../ui/theme';
import { between, drawBarCode, drawCornerTicks, seeded } from './kit';
import { STATE_MARKS, drawStateTreatment } from './visualStates';

/**
 * IL SIGILLO DELLA DECISIONE.
 *
 * In fondo al rapporto c'era un rettangolo con dentro una parola:
 * funzionava, ma diceva «riquadro dell'interfaccia» proprio dove il gioco
 * vuole dire «atto firmato». È l'ultima cosa che il giocatore guarda prima
 * di uscire dal caso, e il momento in cui la sua decisione diventa
 * definitiva.
 *
 * IL SIGILLO PARLA LA LINGUA DEGLI STATI. La cornice non è inventata qui:
 * è il trattamento che `visualStates` assegna a quell'esito — doppia per
 * conforme, riempita a metà per parziale, interrotta per contestabile,
 * barrata per non conforme — alla misura del sigillo. Chi ha imparato a
 * leggere il distintivo su una scheda reperto sa già leggere questo, e i
 * quattro esiti si distinguono per FORMA prima che per colore.
 *
 * Sopra ci va il seme del CASO: consumo, crocini e protocollo cambiano da
 * una pratica all'altra, e lo stesso caso riaperto ha sempre il suo.
 *
 * LE PAROLE RESTANO FUORI. L'etichetta la mette la scena con un testo di
 * Phaser: segue la lingua, si ingrandisce con il resto, arriva allo strato
 * di lettura.
 */

/** Colore della cornice e del testo per ogni esito, dal linguaggio degli stati. */
export const OUTCOME_COLORS: Record<ReportOutcome, { stroke: number; text: string }> = {
  conforme: { stroke: COLORS.ok, text: STATE_MARKS.conforme.color },
  parziale: { stroke: COLORS.warning, text: STATE_MARKS.parziale.color },
  contestabile: { stroke: COLORS.warning, text: STATE_MARKS.contestabile.color },
  non_conforme: { stroke: COLORS.alert, text: STATE_MARKS.non_conforme.color }
};

/** Misura logica della cornice, e il margine che il consumo può sbordare. */
export const SEAL_WIDTH = 300;
export const SEAL_HEIGHT = 70;
const PADDING = 10;

export const decisionSealKey = (outcome: ReportOutcome, caseId: string): string => `seal_${outcome}_${caseId}`;

/**
 * PROTOCOLLO DELLA PRATICA, deterministico.
 *
 * Quattro cifre ricavate dall'identificativo del caso: la stessa pratica ha
 * sempre lo stesso numero, due pratiche diverse non lo condividono, e
 * nessuna data o sequenza finta viene inventata altrove nel codice.
 */
export function protocolNumber(caseId: string): string {
  const rnd = seeded(`protocollo:${caseId}`);
  return String(Math.floor(between(rnd, 1000, 9999)));
}

/**
 * Data di redazione, coerente con il mondo: l'anno è il 2032 del briefing e
 * dei codici pratica (`AX-031/2032`), il giorno si ricava dal caso. Non è
 * decorazione: è ciò che distingue un atto da un appunto, e resta uguale a
 * sé stesso a ogni riapertura.
 */
export const NARRATIVE_YEAR = 2032;
export function protocolDate(caseId: string): string {
  const rnd = seeded(`data:${caseId}`);
  const mese = Math.floor(between(rnd, 1, 13));
  // 28 giorni per ogni mese: nessuna data impossibile, nessuna tabella dei
  // giorni del mese da mantenere per un dettaglio di atmosfera
  const giorno = Math.floor(between(rnd, 1, 29));
  return `${String(giorno).padStart(2, '0')}.${String(mese).padStart(2, '0')}.${NARRATIVE_YEAR}`;
}

/** Striscia di registrazione: la chiave dipende dalle cifre che codifica. */
export const registryStripKey = (cifre: string): string => `registry_${cifre}`;
const STRIP_H = 14;

/**
 * La striscia di registrazione CODIFICA il protocollo: ogni cifra è una
 * barra di larghezza propria. La prima versione era rumore da un seme
 * qualunque, cioè una decorazione che prometteva un dato inesistente su un
 * atto amministrativo. Ora due protocolli diversi hanno strisce diverse, e
 * la stessa pratica ha sempre la sua.
 */
export function createRegistryStrip(scene: Phaser.Scene, cifre: string): { key: string; width: number } | null {
  const larghezza = cifre.length * 6 + 8;
  const key = registryStripKey(cifre);
  if (scene.textures.exists(key)) return { key, width: larghezza };
  const canvas = scene.textures.createCanvas(key, larghezza * RENDER_SCALE, STRIP_H * RENDER_SCALE);
  if (!canvas) return null;
  const ctx = canvas.getContext();
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  drawBarCode(ctx, cifre, 4, 2, STRIP_H - 4, 'rgba(93,127,184,0.55)');
  canvas.refresh();
  return { key, width: larghezza };
}

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
  const colore = STATE_MARKS[outcome].color;

  /**
   * UNA SOLA PASSATA.
   *
   * La prima versione ne disegnava due, la seconda spostata di un paio di
   * pixel, «perché l'inchiostro di un timbro premuto a mano non cade due
   * volte nello stesso punto». A schermo non leggeva come inchiostro:
   * leggeva come uno scarabocchio, con una ventina di segmenti spezzati
   * sovrapposti, ed era il pezzo meno nitido dell'ultima schermata che il
   * giocatore vede prima di chiudere il caso.
   *
   * La variazione per pratica c'è ancora, ma sta DENTRO il trattamento —
   * lo scarto fra le due cornici, l'ampiezza dello strappo, il passo del
   * tratteggio — dove cambia la forma senza sporcarla.
   */
  ctx.save();
  ctx.translate(w / 2, h / 2);
  drawStateTreatment(ctx, rnd, outcome, SEAL_WIDTH, SEAL_HEIGHT);
  ctx.restore();

  // crocini interni e protocollo in barre: i segni che distinguono un
  // sigillo d'ufficio da una cornice grafica, e restano ai bordi, fuori
  // dalla zona dove la scena scrive l'esito
  ctx.save();
  ctx.globalAlpha = 0.55;
  drawCornerTicks(ctx, w, h, PADDING + 4, 7, colore);
  const cifre = protocolNumber(caseId);
  drawBarCode(ctx, cifre, w / 2 - (cifre.length * 6) / 2, h - PADDING - 9, 4, colore);
  ctx.restore();

  canvas.refresh();
  return key;
}

/** Colore del testo dell'esito, per chi non vuole importare tutta la tabella. */
export const outcomeTextColor = (outcome: ReportOutcome): string => OUTCOME_COLORS[outcome].text ?? COLOR_STR.paper;

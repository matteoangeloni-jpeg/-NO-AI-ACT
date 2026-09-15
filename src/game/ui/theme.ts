/** Token di design lato canvas (specchiano i token CSS in global.css). */

export const COLORS = {
  night: 0x0a1020,
  night2: 0x101a30,
  iron: 0x4a5260,
  carbon: 0x07090f,
  paper: 0xd8d6cd,
  alert: 0xd23b3b,
  warning: 0xd9a521,
  ok: 0x3fa66a,
  accent: 0x5d7fb8
} as const;

export const COLOR_STR = {
  night: '#0a1020',
  night2: '#101a30',
  iron: '#4a5260',
  carbon: '#07090f',
  paper: '#d8d6cd',
  paperDim: '#9a988f',
  alert: '#d23b3b',
  /** Variante chiara del rosso per il TESTO: il rosso pieno è sotto il
   *  contrasto AA su fondo scuro; #e25b5b regge ~5.5:1 su nero carbone. */
  alertText: '#e25b5b',
  warning: '#d9a521',
  ok: '#3fa66a',
  accent: '#5d7fb8'
} as const;

export const FONT_MONO =
  '"IBM Plex Mono", "Cascadia Code", "Consolas", "DejaVu Sans Mono", monospace';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

/**
 * Fattore di risoluzione del rendering.
 *
 * Il mondo di gioco resta 1280×720 in unità logiche — nessuna coordinata
 * cambia — ma il canvas viene disegnato a RENDER_SCALE volte quei pixel,
 * così su uno schermo grande il gioco non è un 720p ingrandito.
 *
 * Il fattore NON è fisso. Disegnare sempre al doppio significa, su uno
 * schermo che mostra il gioco a 1280×720 reali, riempire quattro volte i
 * pixel necessari per non guadagnare nulla — e il costo non è teorico:
 * misurato in un browser senza accelerazione hardware, il doppio fisso
 * portava l'avvio da 2,3 a 7,1 secondi, perché a rallentare è il ritmo dei
 * fotogrammi, non la generazione delle texture (86 ms in tutto).
 *
 * Qui si calcola quanti pixel reali occuperà davvero un pixel logico —
 * l'ingrandimento di Scale.FIT moltiplicato per la densità dello schermo —
 * e si disegna esattamente quelli, senza superare MAX_RENDER_SCALE.
 */
export const MAX_RENDER_SCALE = 2;

export function computeRenderScale(
  viewportWidth: number,
  viewportHeight: number,
  devicePixelRatio: number
): number {
  const fit = Math.min(viewportWidth / GAME_WIDTH, viewportHeight / GAME_HEIGHT);
  const wanted = fit * (devicePixelRatio > 0 ? devicePixelRatio : 1);
  if (!Number.isFinite(wanted) || wanted <= 0) return 1;
  // Mai sotto 1: sotto la dimensione logica si perderebbe dettaglio invece
  // di risparmiare. Mai sopra il tetto: oltre non si vede la differenza.
  return Math.min(MAX_RENDER_SCALE, Math.max(1, wanted));
}

/**
 * Fattore scelto all'avvio. È deciso una volta: cambiarlo a finestra
 * ridimensionata vorrebbe dire ricreare il canvas e tutte le texture
 * generate, per una nitidezza che l'ingrandimento di FIT già preserva.
 */
export const RENDER_SCALE: number =
  typeof window === 'undefined'
    ? 1
    : computeRenderScale(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);

export function textStyle(
  size: number,
  color: string = COLOR_STR.paper,
  extra: Phaser.Types.GameObjects.Text.TextStyle = {}
): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_MONO,
    fontSize: `${size}px`,
    color,
    // Il testo di Phaser è una texture disegnata al corpo richiesto: senza
    // questo verrebbe rasterizzato a 1× e poi ingrandito dalla camera, cioè
    // sfocato esattamente come prima. `resolution` lo disegna a RENDER_SCALE
    // e lo mostra alla dimensione logica.
    resolution: RENDER_SCALE,
    ...extra
  };
}

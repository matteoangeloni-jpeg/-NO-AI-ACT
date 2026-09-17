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
  accent: 0x5d7fb8,
  /** Identità dei modelli GPAI. Viola contenuto, non neon: vedi COLOR_STR. */
  gpai: 0x9b86cf
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
  accent: '#5d7fb8',
  /**
   * Variante chiara dell'accento per il TESTO, come alertText lo è per
   * alert. Il blu pieno regge 4,92:1 sul fondo della scena ma scende a
   * 4,34:1 sopra un pannello (night2 al 92% su carbon): sotto la soglia AA,
   * e i pannelli sono proprio dove l'accento viene usato a corpo piccolo.
   * #6a8cc4 sta a 5,15:1 sul pannello e 5,84:1 sulla scena. Misurato, non
   * stimato: lo verifica tests/contrast.test.ts.
   */
  accentText: '#6a8cc4',
  /**
   * Viola dei modelli per finalità generali (GPAI). Unica tinta fuori dalla
   * palette originale, e per un motivo: il GPAI non è un livello di rischio
   * a sé nei dati — condivide `restrittivo` con la biometria — quindi senza
   * una sua identità visiva le due categorie erano indistinguibili.
   * Misurato: 6,36:1 sul fondo scena, 5,53:1 su pannello, 5,55:1 sulla carta
   * del rapporto. Contenuto di proposito: un viola saturo su fondo notturno
   * sembra un errore di calibrazione, non una categoria giuridica.
   */
  gpai: '#9b86cf'
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
 *
 * Il tetto era 2, e su uno schermo denso restava sotto il necessario: una
 * finestra 1600×900 a densità 2 chiede 2,5, riceveva 2, e il browser
 * stirava 2560×1440 fino a 3200×1800. Alzato a 3 copre 1:1 fino a
 * 1920×1080 a densità 2.
 *
 * Il costo è misurato, non stimato: tre avvii per tetto in un browser
 * senza accelerazione hardware, stessa finestra, danno 11,2-12,7 s a tetto
 * 2 e 16,4-17,5 s a tetto 3 — cioè circa quanto crescono i pixel (1,56×
 * di superficie per 1,44× di tempo). È un costo che si paga per intero
 * solo dove a disegnare è la CPU; con una GPU la stessa proporzione parte
 * da qualche millisecondo per fotogramma. Il tetto resta comunque un
 * tetto: oltre 3 la scala adattiva non chiede nulla di più su nessuno
 * schermo che regga il gioco a schermo intero.
 */
export const MAX_RENDER_SCALE = 3;

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

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
 * cambia — ma il canvas viene disegnato a RENDER_SCALE volte quei pixel e
 * poi rimpicciolito dallo scale manager. Su uno schermo 1080p o 1440p il
 * risultato smette di essere un 720p ingrandito.
 *
 * 2 è il compromesso: 4× i pixel da riempire è già percepibile su macchine
 * modeste, e oltre il raddoppio il guadagno visivo non si vede più.
 */
export const RENDER_SCALE = 2;

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

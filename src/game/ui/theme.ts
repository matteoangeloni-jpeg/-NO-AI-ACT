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
  warning: '#d9a521',
  ok: '#3fa66a',
  accent: '#5d7fb8'
} as const;

export const FONT_MONO =
  '"IBM Plex Mono", "Cascadia Code", "Consolas", "DejaVu Sans Mono", monospace';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export function textStyle(
  size: number,
  color: string = COLOR_STR.paper,
  extra: Phaser.Types.GameObjects.Text.TextStyle = {}
): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT_MONO,
    fontSize: `${size}px`,
    color,
    ...extra
  };
}

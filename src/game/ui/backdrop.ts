import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, RENDER_SCALE } from './theme';

/**
 * VELO DI GRANA che quasi tutte le scene stendono sul fondo.
 *
 * Stava scritto a mano in quindici scene, con la stessa riga copiata e
 * l'opacità che ballava fra 0,4 e 0,5 senza una ragione. Ora è una funzione
 * sola, e soprattutto è una funzione che sa a che risoluzione si sta
 * disegnando.
 *
 * La texture 'noise' è generata a RENDER_SCALE volte il suo lato: senza
 * tileScale la camera la ingrandirebbe insieme al resto, e la grana
 * diventerebbe grossa quanto i blocchi che si vedevano prima invece di
 * restare grana. Con tileScale = 1/RENDER_SCALE ogni pixel di rumore vale un
 * pixel reale dello schermo, a qualunque densità.
 */
export function addNoiseOverlay(scene: Phaser.Scene, alpha = 0.4): Phaser.GameObjects.TileSprite {
  return scene.add
    .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise')
    .setTileScale(1 / RENDER_SCALE)
    .setAlpha(alpha);
}

import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import { AudioSystem } from '../systems/AudioSystem';
import type { Clue } from '../data/types';

/**
 * Scheda indizio del fascicolo: chiusa mostra solo il codice reperto,
 * al click si "apre" rivelando il contenuto.
 */
export class DossierCard extends Phaser.GameObjects.Container {
  private revealed = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    clue: Clue,
    index: number,
    private onReveal: (allRevealedCheck: () => void) => void
  ) {
    super(scene, x, y);

    const bg = scene.add.rectangle(0, 0, width, height, COLORS.night2, 0.95).setStrokeStyle(1, COLORS.iron);
    const tape = scene.add.rectangle(0, -height / 2 + 14, width, 28, COLORS.carbon).setStrokeStyle(1, COLORS.iron);
    const code = scene.add
      .text(-width / 2 + 12, -height / 2 + 14, `REPERTO ${String(index + 1).padStart(2, '0')}`, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0, 0.5);
    const sealed = scene.add
      .text(0, 10, '[ SIGILLATO ]\n\nclic per esaminare', textStyle(13, COLOR_STR.accent, { align: 'center' }))
      .setOrigin(0.5);
    const title = scene.add
      .text(-width / 2 + 14, -height / 2 + 38, clue.title.toUpperCase(), textStyle(13, COLOR_STR.warning, { wordWrap: { width: width - 28 } }))
      .setVisible(false);
    const body = scene.add
      .text(-width / 2 + 14, -height / 2 + 64, clue.text, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: width - 28 }, lineSpacing: 5 }))
      .setVisible(false);

    this.add([bg, tape, code, sealed, title, body]);
    this.setSize(width, height);
    scene.add.existing(this);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => !this.revealed && bg.setStrokeStyle(2, COLORS.accent))
      .on('pointerout', () => !this.revealed && bg.setStrokeStyle(1, COLORS.iron))
      .on('pointerdown', () => {
        if (this.revealed) return;
        this.revealed = true;
        AudioSystem.init();
        AudioSystem.confirm();
        sealed.setVisible(false);
        title.setVisible(true);
        body.setVisible(true);
        bg.setStrokeStyle(1, COLORS.warning);
        scene.tweens.add({ targets: [title, body], alpha: { from: 0, to: 1 }, duration: 250 });
        this.onReveal(() => undefined);
      });
  }

  get isRevealed(): boolean {
    return this.revealed;
  }
}

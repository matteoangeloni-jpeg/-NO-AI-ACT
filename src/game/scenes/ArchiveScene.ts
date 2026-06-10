import Phaser from 'phaser';
import { NORMS } from '../data/norms';
import { NormSystem } from '../systems/NormSystem';
import { Button } from '../ui/Button';
import { LockedNormCard, NormCardView } from '../ui/NormCard';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Archivio norme: griglia di carte sbloccate/bloccate, dettaglio al click. */
export class ArchiveScene extends Phaser.Scene {
  private from = 'CityMap';
  private detail?: Phaser.GameObjects.Container;
  private detailShade?: Phaser.GameObjects.Rectangle;

  constructor() {
    super('Archive');
  }

  init(data: { from?: string }): void {
    this.from = data.from ?? 'CityMap';
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    const unlockedCount = NormSystem.unlocked().length;
    this.add.text(cx, 50, 'ARCHIVIO NORME — AI ACT', textStyle(20, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add
      .text(cx, 78, `Disposizioni acquisite: ${unlockedCount}/${NORMS.length} · versione didattica semplificata`, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);

    const cardW = 380;
    const cardH = 200;
    const cols = 3;
    NORMS.forEach((norm, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = cx + (col - 1) * (cardW + 30);
      const y = 220 + row * (cardH + 40);
      if (NormSystem.isUnlocked(norm.id)) {
        const card = new NormCardView(this, x, y, norm, { width: cardW, height: cardH, compact: true });
        card.setInteractive({ useHandCursor: true })
          .on('pointerover', () => card.setScale(1.02))
          .on('pointerout', () => card.setScale(1))
          .on('pointerdown', () => this.showDetail(norm.id));
      } else {
        new LockedNormCard(this, x, y, cardW, cardH);
      }
    });

    new Button(this, cx, GAME_HEIGHT - 46, '◂ INDIETRO', () => this.scene.start(this.from), { width: 200, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.detail) this.hideDetail();
      else this.scene.start(this.from);
    });
  }

  private showDetail(normId: string): void {
    this.hideDetail();
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    this.detailShade = this.add
      .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.75)
      .setDepth(50)
      .setInteractive()
      .on('pointerdown', () => this.hideDetail());
    const card = new NormCardView(this, cx, cy, NormSystem.get(normId), { width: 620, height: 460 });
    card.setDepth(51);
    const hint = this.add
      .text(cx, cy + 260, 'clic fuori dalla carta per chiudere', textStyle(11, COLOR_STR.paperDim))
      .setOrigin(0.5)
      .setDepth(51);
    this.detail = this.add.container(0, 0, []).setDepth(51);
    this.detail.add([card, hint]);
  }

  private hideDetail(): void {
    this.detail?.destroy();
    this.detailShade?.destroy();
    this.detail = undefined;
    this.detailShade = undefined;
  }
}

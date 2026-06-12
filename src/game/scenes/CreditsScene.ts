import Phaser from 'phaser';
import { LicenseNoticeSystem } from '../systems/LicenseNoticeSystem';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const ui = L().ui.creditsScene;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 56, ui.title, textStyle(22, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    new Panel(this, cx, GAME_HEIGHT / 2 + 10, 900, 500);

    let y = 132;
    const left = cx - 420;
    for (const entry of LicenseNoticeSystem.entries()) {
      this.add.text(left, y, entry.name.toUpperCase(), textStyle(13, COLOR_STR.accent));
      this.add.text(left + 280, y, `${entry.type} — ${entry.license}`, textStyle(12, COLOR_STR.paper, { wordWrap: { width: 560 } }));
      this.add.text(left + 280, y + 16, entry.source, textStyle(11.5, COLOR_STR.paperDim));
      y += 42;
    }

    y += 8;
    this.add.text(left, y, ui.footer, textStyle(12, COLOR_STR.paperDim, { lineSpacing: 6 }));

    new Button(this, cx, GAME_HEIGHT - 46, ui.back, () => this.scene.start('Title'), { width: 240, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Title'));
  }
}

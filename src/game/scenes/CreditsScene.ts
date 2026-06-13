import Phaser from 'phaser';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Schermata credits essenziale. I crediti tecnici completi vivono nei file
 * del repository (CREDITS.md, ASSET_REGISTER.md, LICENSE_NOTES.md).
 */
export class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const ui = L().ui.creditsScene;
    AnalyticsSystem.track('credits_opened');
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, cy, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 90, ui.title, textStyle(14, COLOR_STR.paperDim)).setOrigin(0.5);

    new Panel(this, cx, cy, 640, 360);
    this.add.text(cx, cy - 110, ui.heading, textStyle(34, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, cy - 56, ui.roleLabel, textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, cy - 22, ui.author, textStyle(20, COLOR_STR.accent)).setOrigin(0.5);
    this.add.text(cx, cy + 8, ui.affiliation, textStyle(13, COLOR_STR.paper)).setOrigin(0.5);

    this.add
      .text(cx, cy + 92, ui.note, textStyle(12, COLOR_STR.paperDim, { align: 'center', lineSpacing: 7 }))
      .setOrigin(0.5);

    this.add.text(cx, GAME_HEIGHT - 86, L().ui.footerDisclaimer, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);

    new Button(this, cx, GAME_HEIGHT - 46, ui.back, () => this.scene.start('Title'), { width: 240, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Title'));
  }
}

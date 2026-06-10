import Phaser from 'phaser';
import { LicenseNoticeSystem } from '../systems/LicenseNoticeSystem';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 56, 'CREDITS E LICENZE', textStyle(22, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    new Panel(this, cx, GAME_HEIGHT / 2 + 10, 900, 500);

    let y = 140;
    const left = cx - 420;
    for (const entry of LicenseNoticeSystem.entries()) {
      this.add.text(left, y, entry.name.toUpperCase(), textStyle(13, COLOR_STR.accent));
      this.add.text(left + 280, y, `${entry.type} — ${entry.license}`, textStyle(12, COLOR_STR.paper, { wordWrap: { width: 560 } }));
      this.add.text(left + 280, y + 18, entry.source, textStyle(10.5, COLOR_STR.paperDim));
      y += 52;
    }

    y += 8;
    this.add.text(
      left,
      y,
      'Contenuti normativi: sintesi divulgative del Regolamento (UE) 2024/1689 (AI Act).\n' +
        'Versione didattica semplificata: questo gioco non costituisce consulenza legale.\n' +
        'Dettagli completi: ASSET_REGISTER.md · CREDITS.md · LICENSE_NOTES.md nel repository.',
      textStyle(12, COLOR_STR.paperDim, { lineSpacing: 6 })
    );

    new Button(this, cx, GAME_HEIGHT - 46, '◂ TORNA AL TITOLO', () => this.scene.start('Title'), { width: 240, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Title'));
  }
}

import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData } from '../data/types';
import { Button } from '../ui/Button';
import { TypewriterText } from '../ui/TypewriterText';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Apertura del fascicolo: scenario narrativo del caso. */
export class CaseScene extends Phaser.Scene {
  private caseData!: CaseData;

  constructor() {
    super('Case');
  }

  init(data: { caseId: string }): void {
    this.caseData = getCase(data.caseId);
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    // dossier che "compare" dal basso
    const dossier = this.add.container(cx, GAME_HEIGHT / 2 + 30);
    const paper = this.add.image(0, 0, 'dossier_paper');
    dossier.add(paper);
    dossier.setAlpha(0);
    this.tweens.add({ targets: dossier, alpha: 1, y: GAME_HEIGHT / 2, duration: 350, ease: 'Cubic.easeOut' });

    const left = cx - 410;
    this.add.text(left, 70, `FASCICOLO ${this.caseData.fileCode}`, textStyle(13, COLOR_STR.alertText));
    this.add.text(left, 92, this.caseData.locationName.toUpperCase(), textStyle(12, COLOR_STR.paperDim));
    this.add.text(left, 124, this.caseData.title.toUpperCase(), textStyle(26, COLOR_STR.paper, { fontStyle: 'bold' }));
    this.add.rectangle(cx, 165, 820, 1, COLORS.iron).setOrigin(0.5);

    const body = new TypewriterText(this, left, 190, 15, COLOR_STR.paper, 820);
    const proceed = new Button(this, cx, GAME_HEIGHT - 70, 'ESAMINA I REPERTI ▸', () => {
      this.scene.start('Evidence', { caseId: this.caseData.id });
    });
    proceed.setVisible(false);

    body.write(this.caseData.scenario, () => proceed.setVisible(true));
    this.input.on('pointerdown', () => body.skip());

    new Button(this, 90, GAME_HEIGHT - 36, '◂ MAPPA', () => this.scene.start('CityMap'), { width: 140, height: 36, fontSize: 12, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('CityMap'));
  }
}

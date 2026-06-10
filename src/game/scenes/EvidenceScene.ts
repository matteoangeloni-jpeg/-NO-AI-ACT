import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData } from '../data/types';
import { Button } from '../ui/Button';
import { DossierCard } from '../ui/DossierCard';
import { showToast } from '../ui/AlertToast';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Esame dei reperti: tre indizi da aprire prima di poter decidere. */
export class EvidenceScene extends Phaser.Scene {
  private caseData!: CaseData;
  private cards: DossierCard[] = [];
  private proceedBtn!: Button;

  constructor() {
    super('Evidence');
  }

  init(data: { caseId: string }): void {
    this.caseData = getCase(data.caseId);
    this.cards = [];
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 56, `FASCICOLO ${this.caseData.fileCode} — REPERTI`, textStyle(14, COLOR_STR.alert)).setOrigin(0.5);
    this.add.text(cx, 80, 'Esaminare tutti i reperti per procedere alla classificazione.', textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.rectangle(cx, 100, 900, 1, COLORS.iron);

    const cardW = 360;
    const cardH = 300;
    const positions = [cx - 390, cx, cx + 390];
    this.caseData.clues.forEach((clue, i) => {
      const card = new DossierCard(this, positions[i], 290, cardW, cardH, clue, i, () => this.checkAllRevealed());
      card.setAlpha(0);
      this.tweens.add({ targets: card, alpha: 1, duration: 250, delay: i * 130 });
      this.cards.push(card);
    });

    this.proceedBtn = new Button(this, cx, GAME_HEIGHT - 90, 'PROCEDI ALLA CLASSIFICAZIONE ▸', () => {
      this.scene.start('Decision', { caseId: this.caseData.id });
    }, { width: 380 });
    this.proceedBtn.setVisible(false);

    new Button(this, 90, GAME_HEIGHT - 36, '◂ MAPPA', () => this.scene.start('CityMap'), { width: 140, height: 36, fontSize: 12, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('CityMap'));
  }

  private checkAllRevealed(): void {
    if (this.cards.every((c) => c.isRevealed) && !this.proceedBtn.visible) {
      this.proceedBtn.setVisible(true);
      showToast(this, 'Tutti i reperti esaminati. Pronto per la classificazione.', 'info');
    }
  }
}

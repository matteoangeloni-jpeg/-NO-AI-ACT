import Phaser from 'phaser';
import { MIN_CITED_CLUES, getCase } from '../data/cases';
import type { CaseData } from '../data/types';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Button } from '../ui/Button';
import { DossierCard } from '../ui/DossierCard';
import { showToast } from '../ui/AlertToast';
import { L, caseText, fmt } from '../i18n';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Esame dei reperti: aprire tutti gli indizi, poi citare nel rapporto
 * almeno MIN_CITED_CLUES reperti. La scelta dei reperti citati entra nella
 * valutazione finale del caso.
 */
export class EvidenceScene extends Phaser.Scene {
  private caseData!: CaseData;
  private cards: DossierCard[] = [];
  private proceedBtn!: Button;
  private revealToastShown = false;

  constructor() {
    super('Evidence');
  }

  init(data: { caseId: string }): void {
    this.caseData = getCase(data.caseId);
    this.cards = [];
    this.revealToastShown = false;
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const texts = caseText(this.caseData.id);
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    AnalyticsSystem.page('evidence');
    AnalyticsSystem.track('evidence_opened', { caseId: this.caseData.id });
    AudioSystem.crossfadeToTheme(this.caseData.id);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 56, fmt(L().ui.evidence.header, { code: this.caseData.fileCode }), textStyle(14, COLOR_STR.alertText)).setOrigin(0.5);
    this.add.text(cx, 80, L().ui.evidence.instruction, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.rectangle(cx, 100, 900, 1, COLORS.iron);

    const cardW = 360;
    const cardH = 320;
    const positions = [cx - 390, cx, cx + 390];
    texts.clues.forEach((clue, i) => {
      const card = new DossierCard(this, positions[i], 290, cardW, cardH, clue, i, () => this.refreshState());
      card.setAlpha(0);
      this.tweens.add({ targets: card, alpha: 1, duration: 250, delay: i * 130 });
      this.cards.push(card);
    });

    this.proceedBtn = new Button(this, cx, GAME_HEIGHT - 90, L().ui.evidence.proceedButton, () => {
      const cited = this.cards
        .map((card, i) => (card.isCited ? i : -1))
        .filter((i) => i >= 0);
      AnalyticsSystem.track('clues_selected', {
        caseId: this.caseData.id,
        selectedClueCount: cited.length,
        relevantClueCount: this.caseData.relevantClues.length
      });
      this.scene.start('Decision', { caseId: this.caseData.id, citedClues: cited });
    }, { width: 380 });
    this.proceedBtn.setVisible(false);

    new Button(this, 90, GAME_HEIGHT - 36, L().ui.case.backToMap, () => this.scene.start('CityMap'), { width: 140, height: 36, fontSize: 12, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('CityMap'));
  }

  private refreshState(): void {
    const allRevealed = this.cards.every((c) => c.isRevealed);
    const citedCount = this.cards.filter((c) => c.isCited).length;
    if (allRevealed && !this.revealToastShown) {
      this.revealToastShown = true;
      showToast(this, L().ui.evidence.allRevealedToast, 'info');
    }
    // senza almeno MIN_CITED_CLUES reperti citati non si procede
    this.proceedBtn.setVisible(allRevealed && citedCount >= MIN_CITED_CLUES);
  }
}

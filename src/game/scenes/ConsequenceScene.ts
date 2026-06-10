import Phaser from 'phaser';
import { CLASSIFICATION_LABELS, MEASURE_LABELS, getCase } from '../data/cases';
import type { CaseData, Classification, Measure, OutcomeQuality } from '../data/types';
import { consequenceFor, noteFor } from '../systems/CaseSystem';
import { IndicatorHud, randomComment } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { TypewriterText } from '../ui/TypewriterText';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

interface ConsequenceParams {
  caseId: string;
  classification: Classification;
  measure: Measure;
  quality: OutcomeQuality;
}

const QUALITY_LABELS: Record<OutcomeQuality, { text: string; color: string }> = {
  correct: { text: 'DECISIONE CONFORME', color: COLOR_STR.ok },
  partial: { text: 'DECISIONE PARZIALE', color: COLOR_STR.warning },
  wrong: { text: 'DECISIONE NON CONFORME', color: COLOR_STR.alert }
};

/** Esito della decisione: conseguenza narrativa + aggiornamento indicatori. */
export class ConsequenceScene extends Phaser.Scene {
  private params!: ConsequenceParams;
  private caseData!: CaseData;

  constructor() {
    super('Consequence');
  }

  init(data: ConsequenceParams): void {
    this.params = data;
    this.caseData = getCase(data.caseId);
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const { quality } = this.params;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    // applica l'esito allo stato (salvataggio automatico incluso)
    const before = StateManager.indicators;
    const after = StateManager.resolveCase(this.caseData.id, this.caseData.normId, quality);

    if (quality === 'wrong' && !StateManager.reducedMotion) {
      this.cameras.main.shake(220, 0.004);
    }

    const q = QUALITY_LABELS[quality];
    this.add.text(cx, 60, q.text, textStyle(24, q.color, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add
      .text(
        cx,
        92,
        `Classificazione: ${CLASSIFICATION_LABELS[this.params.classification]} · Misura: ${MEASURE_LABELS[this.params.measure]}`,
        textStyle(12, COLOR_STR.paperDim)
      )
      .setOrigin(0.5);

    // conseguenza narrativa
    new Panel(this, cx - 190, 300, 620, 320);
    this.add.text(cx - 480, 158, 'ESITO SUL TERRITORIO', textStyle(11, COLOR_STR.paperDim));
    const consequence = new TypewriterText(this, cx - 480, 184, 14, COLOR_STR.paper, 580);

    // nota investigativa
    this.add.text(cx - 480, 380, 'NOTA INVESTIGATIVA', textStyle(11, COLOR_STR.paperDim));
    const note = this.add
      .text(cx - 480, 404, noteFor(this.caseData, quality), textStyle(13, quality === 'wrong' ? COLOR_STR.alert : COLOR_STR.accent, { wordWrap: { width: 580 }, lineSpacing: 5 }))
      .setAlpha(0);

    // pannello indicatori animati
    this.add.rectangle(cx + 330, 280, 320, 240, COLORS.carbon, 0.85).setStrokeStyle(1, COLORS.iron);
    this.add.text(cx + 190, 172, 'STATO DELLA CITTÀ', textStyle(11, COLOR_STR.paperDim));
    const hud = new IndicatorHud(this, cx + 190, 200, 270);
    hud.setState(before);
    this.time.delayedCall(600, () => hud.animateTo(this, before, after));

    // micro-commento
    const comment = this.add
      .text(cx + 190, 470, `» ${randomComment(quality)}`, textStyle(12.5, q.color, { wordWrap: { width: 290 }, fontStyle: 'italic', lineSpacing: 4 }))
      .setAlpha(0);
    this.tweens.add({ targets: comment, alpha: 1, duration: 400, delay: 1400 });

    const nextLabel = quality === 'wrong' ? 'CONSULTA COMUNQUE LA NORMA ▸' : 'NORMA ACQUISITA ▸';
    const nextBtn = new Button(this, cx, GAME_HEIGHT - 60, nextLabel, () => {
      this.scene.start('NormCard', { normId: this.caseData.normId, quality });
    }, { width: 380 });
    nextBtn.setVisible(false);

    consequence.write(consequenceFor(this.caseData, quality), () => {
      this.tweens.add({ targets: note, alpha: 1, duration: 300 });
      nextBtn.setVisible(true);
    });
    this.input.on('pointerdown', () => consequence.skip());
  }
}

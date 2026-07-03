import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData, Classification, IndicatorState, Measure, OutcomeQuality, ReportOutcome } from '../data/types';
import { consequenceFor, noteFor } from '../systems/CaseSystem';
import { NOTE_BOX } from './consequenceLayout';
import { AudioSystem } from '../systems/AudioSystem';
import { IndicatorHud, randomComment } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { DiscussionPauseOverlay } from '../ui/DiscussionPauseOverlay';
import { Panel } from '../ui/Panel';
import { TypewriterText } from '../ui/TypewriterText';
import { L, caseText, fmt } from '../i18n';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

interface ConsequenceParams {
  caseId: string;
  classification: Classification;
  measure: Measure;
  quality: OutcomeQuality;
  /** Esito a 4 livelli del rapporto: usato per allineare la dicitura allo stampo. */
  outcome?: ReportOutcome;
  cluesOk: boolean;
  before: IndicatorState;
  after: IndicatorState;
}

/** Colore dell'intestazione per esito del rapporto. */
const OUTCOME_HEADER: Record<ReportOutcome, string> = {
  conforme: COLOR_STR.ok,
  parziale: COLOR_STR.warning,
  contestabile: COLOR_STR.warning,
  non_conforme: COLOR_STR.alertText
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
    const { quality, before, after } = this.params;
    const texts = caseText(this.caseData.id);
    const ui = L().ui.consequence;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    AudioSystem.crossfadeToTheme(this.caseData.id);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    if (quality === 'wrong' && !StateManager.reducedMotion) {
      this.cameras.main.shake(220, 0.004);
    }

    // dicitura allineata allo stampo del rapporto (stessa vocabolario a 4 esiti);
    // fallback alla qualità a 3 livelli per retrocompatibilità
    const outcome = this.params.outcome;
    const headerText = outcome ? L().ui.outcomes[outcome] : ui.qualityPartial;
    const headerColor = outcome
      ? OUTCOME_HEADER[outcome]
      : quality === 'correct' ? COLOR_STR.ok : quality === 'partial' ? COLOR_STR.warning : COLOR_STR.alertText;

    this.add.text(cx, 60, headerText, textStyle(24, headerColor, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add
      .text(
        cx,
        92,
        fmt(ui.summary, {
          classification: L().classifications[this.params.classification],
          measure: L().measures[this.params.measure]
        }),
        textStyle(12, COLOR_STR.paperDim)
      )
      .setOrigin(0.5);

    // conseguenza narrativa — pannello superiore
    new Panel(this, cx - 190, 250, 620, 190);
    this.add.text(cx - 480, 138, ui.territoryLabel, textStyle(12, COLOR_STR.paperDim));
    const consequence = new TypewriterText(this, cx - 480, 176, 14, COLOR_STR.paper, 580);

    // nota investigativa — pannello DEDICATO, dimensionato per non far
    // fuoriuscire il testo: la nota più lunga è ~6 righe (vedi consequenceLayout
    // + tests/consequenceLayout.test.ts). Il feedback tipizzato è già nel rapporto.
    this.add.text(cx - 480, NOTE_BOX.labelY, ui.noteLabel, textStyle(12, COLOR_STR.paperDim));
    new Panel(this, cx - 190, NOTE_BOX.panelCenterY, NOTE_BOX.width, NOTE_BOX.height);
    const noteText = noteFor(texts, quality);
    const note = this.add
      .text(cx - 480, NOTE_BOX.textY, noteText, textStyle(NOTE_BOX.fontSize, quality === 'wrong' ? COLOR_STR.alertText : COLOR_STR.accent, { wordWrap: { width: NOTE_BOX.wrapWidth }, lineSpacing: NOTE_BOX.lineSpacing }))
      .setAlpha(0);

    // pannello indicatori animati
    this.add.rectangle(cx + 330, 280, 320, 240, COLORS.carbon, 0.85).setStrokeStyle(1, COLORS.iron);
    this.add.text(cx + 190, 172, ui.cityLabel, textStyle(12, COLOR_STR.paperDim));
    const hud = new IndicatorHud(this, cx + 190, 200, 270);
    hud.setState(before);
    this.time.delayedCall(600, () => hud.animateTo(this, before, after));

    // micro-commento
    const comment = this.add
      .text(cx + 190, 470, `» ${randomComment(quality)}`, textStyle(12.5, headerColor, { wordWrap: { width: 290 }, fontStyle: 'italic', lineSpacing: 4 }))
      .setAlpha(0);
    this.tweens.add({ targets: comment, alpha: 1, duration: 400, delay: 1400 });

    const nextLabel = quality === 'wrong' ? ui.nextWrong : ui.nextCorrect;
    const goNext = (): void => {
      this.scene.start('NormCard', { normId: this.caseData.normId, quality });
    };
    const nextBtn = new Button(this, cx, GAME_HEIGHT - 60, nextLabel, goNext, { width: 380 });
    nextBtn.setVisible(false);

    // pausa di discussione (v1.1, solo modalità docente): le tre domande del
    // caso per la classe, prima di passare alla norma. Nulla viene registrato.
    const pause = StateManager.teacherMode ? new DiscussionPauseOverlay(this, texts.debriefQuestions) : null;
    if (pause) {
      new Button(this, 240, GAME_HEIGHT - 60, L().ui.discussionPause.button, () => pause.toggle(), { width: 320, height: 40, fontSize: 13, variant: 'ghost' });
    }

    consequence.write(consequenceFor(texts, quality), () => {
      this.tweens.add({ targets: note, alpha: 1, duration: 300 });
      nextBtn.setVisible(true);
    });
    this.input.on('pointerdown', () => consequence.skip());
    // tastiera (v1.1): INVIO prosegue quando il pulsante è visibile e la
    // pausa di discussione non è aperta
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (nextBtn.visible && !pause?.isOpen) goNext();
    });
  }
}

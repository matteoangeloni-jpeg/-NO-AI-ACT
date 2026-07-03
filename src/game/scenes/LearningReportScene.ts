import Phaser from 'phaser';
import { FALLBACK_LINKS } from '../data/concepts';
import { buildLearningReport } from '../systems/LearningReportSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { L, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Rapporto di apprendimento finale (v1.1): trasforma gli esiti dei casi in un
 * riepilogo didattico per concetto AI Act, con tre letture consigliate dal
 * sito. Tutto locale: legge lo stato già salvato, non invia e non memorizza
 * nulla altrove. I link consigliati sono pagine interne (stessa origine).
 */
export class LearningReportScene extends Phaser.Scene {
  constructor() {
    super('LearningReport');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const t = L();
    const ui = t.ui.learningReport;
    const report = buildLearningReport(StateManager.completedCases, StateManager.language);

    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    if (!StateManager.reducedMotion) this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 40, ui.header, textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 68, ui.title.toUpperCase(), textStyle(22, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);

    new Panel(this, cx, GAME_HEIGHT / 2 + 16, 1100, 550);
    const left = cx - 520;
    let y = 108;

    const intro = this.add.text(left, y, ui.intro, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 1040 }, lineSpacing: 4 }));
    y += intro.height + 14;

    // esiti dei casi
    this.add.text(left, y, ui.scoreLabel, textStyle(12, COLOR_STR.accent, { fontStyle: 'bold' }));
    y += 20;
    this.add.text(
      left,
      y,
      fmt(ui.scoreLine, {
        correct: report.correct,
        partial: report.partial,
        wrong: report.wrong,
        completed: report.completedCount,
        total: report.totalPlayable
      }),
      textStyle(13.5, COLOR_STR.paper)
    );
    y += 30;

    // concetti incontrati, con giudizio qualitativo (mai un voto)
    this.add.text(left, y, ui.conceptsLabel, textStyle(12, COLOR_STR.accent, { fontStyle: 'bold' }));
    y += 20;
    if (report.concepts.length === 0) {
      this.add.text(left, y, ui.noneYet, textStyle(12.5, COLOR_STR.paperDim));
      y += 24;
    } else {
      const line = report.concepts
        .map((c) => `${t.ui.concepts[c.id]} (${ui.performance[perfOf(c.score)]})`)
        .join(' · ');
      const conceptsText = this.add.text(left, y, line, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: 1040 }, lineSpacing: 5 }));
      y += conceptsText.height + 12;
    }

    // area più solida / da ripassare
    const strongestValue = report.strongest ? t.ui.concepts[report.strongest] : ui.noneYet;
    this.add.text(left, y, `${ui.strongestLabel}:`, textStyle(12, COLOR_STR.ok, { fontStyle: 'bold' }));
    this.add.text(left + 230, y, strongestValue, textStyle(13, COLOR_STR.paper));
    y += 24;
    const reviewValue = report.toReview ? t.ui.concepts[report.toReview] : report.completedCount > 0 ? ui.allSolid : ui.noneYet;
    this.add.text(left, y, `${ui.reviewLabel}:`, textStyle(12, COLOR_STR.warning, { fontStyle: 'bold' }));
    this.add.text(left + 230, y, reviewValue, textStyle(13, COLOR_STR.paper, { wordWrap: { width: 810 } }));
    y += 34;

    // tre letture consigliate: pagine interne del sito, in una nuova scheda
    this.add.text(left, y, ui.recommendedLabel, textStyle(12, COLOR_STR.accent, { fontStyle: 'bold' }));
    y += 48; // i pulsanti-link sono centrati verticalmente: spazio per l'etichetta
    const linkW = 330;
    report.recommended.forEach((rec, i) => {
      const label = rec.concept
        ? fmt(ui.linkFor, { concept: t.ui.concepts[rec.concept] })
        : (ui.generalLinkLabels[FALLBACK_LINKS[StateManager.language].indexOf(rec.url)] ?? rec.url);
      new Button(
        this,
        left + linkW / 2 + i * (linkW + 25),
        y,
        label,
        () => window.open(rec.url, '_blank', 'noopener,noreferrer'),
        { width: linkW, height: 42, fontSize: 12, variant: 'ghost' }
      );
    });
    y += 44;

    // avvertenza obbligatoria: didattico, non consulenza legale
    this.add.text(left, y, ui.disclaimer, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: 1040 }, lineSpacing: 4, fontStyle: 'italic' }));

    new Button(this, cx, GAME_HEIGHT - 44, ui.back, () => this.scene.start('Finale'), { width: 320, height: 40, fontSize: 13 });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Finale'));
  }
}

/** Soglie qualitative per la media 0..2 di un concetto. */
function perfOf(score: number): 'strong' | 'mixed' | 'weak' {
  if (score >= 1.5) return 'strong';
  if (score >= 0.75) return 'mixed';
  return 'weak';
}

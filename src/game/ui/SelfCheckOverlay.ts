import Phaser from 'phaser';
import { SELF_CHECK_QUESTIONS } from '../data/learningModel';
import type { SelfCheckPhase } from '../data/types';
import { StateManager } from '../systems/StateManager';
import { Button } from './Button';
import { Panel } from './Panel';
import { L, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Autocontrollo locale FACOLTATIVO (2.0 — mission §10.3).
 *
 * Sei domande mappate sugli obiettivi di apprendimento. Vincoli di privacy,
 * per progetto e per test: nessun nome/email/scuola/classe, nessuna chiamata
 * di rete, nessun identificatore persistente; il risultato è un semplice
 * conteggio locale (correct/total) salvato in localStorage e cancellabile con
 * il reset. È dichiarato formativo, non è una valutazione certificata, e si
 * può saltare in ogni momento.
 */
export class SelfCheckOverlay {
  private container?: Phaser.GameObjects.Container;
  private index = 0;
  private correct = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly phase: SelfCheckPhase,
    private readonly onClose?: () => void
  ) {}

  get isOpen(): boolean {
    return !!this.container;
  }

  open(): void {
    if (this.isOpen) return;
    this.index = 0;
    this.correct = 0;
    this.renderQuestion();
  }

  close(): void {
    this.scene.input.keyboard?.off('keydown-ESC', this.escHandler);
    this.container?.destroy();
    this.container = undefined;
    this.onClose?.();
  }

  private readonly escHandler = (): void => this.close();

  private baseFrame(): { cx: number; cy: number; left: number; wrap: number } {
    this.container?.destroy();
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const container = this.scene.add.container(0, 0).setDepth(95);
    container.add(this.scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setInteractive());
    const panelW = 900;
    const panelH = 540;
    container.add(new Panel(this.scene, cx, cy, panelW, panelH));
    const t = L().learningLayer.selfCheck;
    const left = cx - panelW / 2 + 40;
    container.add(
      this.scene.add.text(left, cy - panelH / 2 + 26, this.phase === 'pre' ? t.titlePre : t.titlePost, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' }))
    );
    container.add(
      this.scene.add.text(left, cy - panelH / 2 + 56, t.formative, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: panelW - 80 }, lineSpacing: 3 }))
    );
    this.container = container;
    this.scene.input.keyboard?.off('keydown-ESC', this.escHandler);
    this.scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    return { cx, cy, left, wrap: panelW - 80 };
  }

  private renderQuestion(): void {
    const t = L().learningLayer.selfCheck;
    const q = SELF_CHECK_QUESTIONS[this.index];
    const texts = (t.questions as Record<string, { q: string; options: string[] }>)[q.id];
    const { cx, cy, left, wrap } = this.baseFrame();
    const c = this.container!;

    c.add(this.scene.add.text(left, cy - 150, fmt(t.questionLabel, { i: this.index + 1, total: SELF_CHECK_QUESTIONS.length }), textStyle(12, COLOR_STR.paperDim)));
    c.add(this.scene.add.text(left, cy - 124, texts.q, textStyle(15.5, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 5 })));

    texts.options.forEach((option, i) => {
      const y = cy - 30 + i * 74;
      c.add(new Button(this.scene, cx, y, '', () => this.answer(i === q.correctIndex), { width: wrap, height: 60, fontSize: 13 }));
      c.add(
        this.scene.add
          .text(cx - wrap / 2 + 18, y, `${i + 1}. ${option}`, textStyle(13, COLOR_STR.paper, { wordWrap: { width: wrap - 40 }, lineSpacing: 4 }))
          .setOrigin(0, 0.5)
      );
    });
    // tastiera: 1..3 rispondono, ESC salta/chiude
    this.scene.input.keyboard?.off('keydown-ONE');
    this.scene.input.keyboard?.off('keydown-TWO');
    this.scene.input.keyboard?.off('keydown-THREE');
    (['ONE', 'TWO', 'THREE'] as const).forEach((key, i) => {
      this.scene.input.keyboard?.on(`keydown-${key}`, () => {
        if (this.isOpen) this.answer(i === q.correctIndex);
      });
    });

    c.add(new Button(this.scene, cx, cy + 226, t.skip, () => this.close(), { width: 180, height: 38, fontSize: 12, variant: 'ghost' }));
  }

  private answer(isCorrect: boolean): void {
    if (isCorrect) this.correct += 1;
    this.index += 1;
    if (this.index < SELF_CHECK_QUESTIONS.length) this.renderQuestion();
    else this.renderResult();
  }

  private renderResult(): void {
    const t = L().learningLayer.selfCheck;
    const total = SELF_CHECK_QUESTIONS.length;
    StateManager.recordSelfCheck(this.phase, { correct: this.correct, total, answeredAt: Date.now() });

    const { cx, cy, left, wrap } = this.baseFrame();
    const c = this.container!;
    c.add(this.scene.add.text(left, cy - 80, fmt(t.resultLine, { correct: this.correct, total }), textStyle(17, COLOR_STR.paper, { fontStyle: 'bold' })));
    // confronto pre/post quando entrambi esistono (solo locale)
    const pre = StateManager.selfCheck.pre;
    if (this.phase === 'post' && pre) {
      c.add(this.scene.add.text(left, cy - 40, fmt(t.compareLine, { correct: pre.correct, total: pre.total }), textStyle(13, COLOR_STR.accent, { wordWrap: { width: wrap } })));
    }
    c.add(new Button(this.scene, cx, cy + 180, t.close, () => this.close(), { width: 200, height: 40, fontSize: 13 }));
  }
}

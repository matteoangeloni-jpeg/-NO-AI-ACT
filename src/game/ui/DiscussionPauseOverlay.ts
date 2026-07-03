import Phaser from 'phaser';
import { Button } from './Button';
import { Panel } from './Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Pausa di discussione (v1.1, solo modalità docente): mostra le domande di
 * discussione del caso appena chiuso, per confrontare le decisioni in classe
 * prima di proseguire.
 *
 * STRETTAMENTE presentazionale: riceve le domande già localizzate e disegna
 * una scheda modale. Non legge né scrive lo stato di gioco, non tocca
 * punteggio o rapporto, non registra nulla e non apre URL esterni.
 * ESC o il pulsante la chiudono.
 */
export class DiscussionPauseOverlay {
  private container?: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly questions: readonly string[]
  ) {}

  get isOpen(): boolean {
    return !!this.container;
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  close(): void {
    this.scene.input.keyboard?.off('keydown-ESC', this.escHandler);
    this.container?.destroy();
    this.container = undefined;
  }

  private readonly escHandler = (): void => this.close();

  open(): void {
    if (this.isOpen) return;
    const scene = this.scene;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const ui = L().ui.discussionPause;

    const container = scene.add.container(0, 0).setDepth(90);
    container.add(
      scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setInteractive().on('pointerdown', () => this.close())
    );

    const panelW = 860;
    const panelH = 460;
    container.add(new Panel(scene, cx, cy, panelW, panelH));
    container.add(scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 40;
    const wrap = panelW - 80;
    let y = cy - panelH / 2 + 30;

    container.add(scene.add.text(left, y, ui.title, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 30;
    const intro = scene.add.text(left, y, ui.intro, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: wrap }, lineSpacing: 4 }));
    container.add(intro);
    y += intro.height + 20;

    this.questions.forEach((q, i) => {
      const qt = scene.add.text(left, y, `${i + 1}. ${q}`, textStyle(14, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 5 }));
      container.add(qt);
      y += qt.height + 14;
    });

    container.add(new Button(scene, cx, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 220, height: 38, fontSize: 13 }));

    scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

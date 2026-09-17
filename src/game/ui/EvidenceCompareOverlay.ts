import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { EvidenceSource } from '../data/types';
import { L, caseText, fmt } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { Button } from './Button';
import { Panel } from './Panel';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

type CloseKey = 'compareCloseEvidence' | 'compareCloseDecision';

/** Confronto read-only fra tutte le coppie di reperti citati. */
export class EvidenceCompareOverlay {
  private container?: Phaser.GameObjects.Container;
  private pairCursor = 0;
  private pairs: Array<[number, number]> = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly caseId: string,
    private readonly getIndices: () => number[],
    private readonly closeKey: CloseKey
  ) {}

  get isOpen(): boolean {
    return !!this.container;
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  open(): void {
    if (this.isOpen) return;
    const valid = [...new Set(this.getIndices())]
      .filter((index) => index >= 0 && index < caseText(this.caseId).clues.length)
      .sort((a, b) => a - b);
    this.pairs = [];
    for (let a = 0; a < valid.length; a += 1) {
      for (let b = a + 1; b < valid.length; b += 1) this.pairs.push([valid[a], valid[b]]);
    }
    if (this.pairs.length === 0) {
      ReadingLayer.announce(L().ui.inspectorDesk.compareEmpty);
      return;
    }
    // L'ultima coppia contiene normalmente gli ultimi due reperti citati.
    this.pairCursor = this.pairs.length - 1;
    this.draw(false);
  }

  close(): void {
    if (!this.container) return;
    this.container.destroy();
    this.container = undefined;
    ReadingLayer.closeOverlay();
  }

  private move(delta: number): void {
    if (this.pairs.length < 2) return;
    this.pairCursor = (this.pairCursor + delta + this.pairs.length) % this.pairs.length;
    this.container?.destroy();
    this.container = undefined;
    this.draw(true);
  }

  private draw(replacing: boolean): void {
    const ui = L().ui.inspectorDesk;
    const texts = caseText(this.caseId);
    const data = getCase(this.caseId);
    const [leftIndex, rightIndex] = this.pairs[this.pairCursor];
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const panelW = 1160;
    const panelH = 540;
    const container = this.scene.add.container(0, 0).setDepth(90);
    container.add(
      this.scene.add
        .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.86)
        .setInteractive()
        .on('pointerdown', () => this.close())
    );
    container.add(new Panel(this.scene, cx, cy, panelW, panelH));
    container.add(this.scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const top = cy - panelH / 2 + 24;
    container.add(this.scene.add.text(cx, top, ui.compareTitle, textStyle(17, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5));
    container.add(
      this.scene.add
        .text(cx, top + 28, ui.compareIntro, textStyle(11.5, COLOR_STR.paperDim, { align: 'center', wordWrap: { width: 920 } }))
        .setOrigin(0.5)
    );
    container.add(
      this.scene.add
        .text(cx, top + 52, fmt(ui.compareCounter, { current: this.pairCursor + 1, total: this.pairs.length }), textStyle(10.5, COLOR_STR.accentText))
        .setOrigin(0.5)
    );
    container.add(this.scene.add.rectangle(cx, cy + 8, 1, 330, COLORS.iron, 0.8));

    const drawDocument = (index: number, x: number): void => {
      const clue = texts.clues[index];
      const source = texts.clueSources?.[index] as EvidenceSource | undefined;
      const stance = data.clueStances?.[index];
      const sourceText = source
        ? (L().ui.evidence.sources as Record<string, string>)[source]
        : ui.compareUnknownSource;
      const stanceText = stance
        ? (L().ui.evidence.stances as Record<string, string>)[stance]
        : ui.compareUnknownFunction;

      const paperY = cy + 8;
      const paperW = 520;
      const paperH = 330;
      container.add(this.scene.add.rectangle(x, paperY, paperW, paperH, COLORS.night2, 0.78).setStrokeStyle(1, COLORS.iron));
      container.add(this.scene.add.rectangle(x, paperY - paperH / 2 + 18, paperW, 36, COLORS.carbon, 0.7));
      container.add(
        this.scene.add
          .text(x - paperW / 2 + 18, paperY - paperH / 2 + 18, fmt(L().ui.evidence.exhibit, { num: String(index + 1).padStart(2, '0') }), textStyle(11.5, COLOR_STR.accentText, { fontStyle: 'bold' }))
          .setOrigin(0, 0.5)
      );
      container.add(
        this.scene.add
          .text(x + paperW / 2 - 18, paperY - paperH / 2 + 18, `${ui.compareSource}: ${sourceText}`, textStyle(10.5, COLOR_STR.paperDim))
          .setOrigin(1, 0.5)
      );
      container.add(
        this.scene.add
          .text(x - paperW / 2 + 22, paperY - paperH / 2 + 56, clue.title.toUpperCase(), textStyle(13.5, COLOR_STR.warning, { fontStyle: 'bold', wordWrap: { width: paperW - 44 } }))
      );
      container.add(
        this.scene.add
          .text(x - paperW / 2 + 22, paperY - paperH / 2 + 104, clue.text, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: paperW - 44 }, lineSpacing: 6 }))
      );
      container.add(
        this.scene.add
          .text(x - paperW / 2 + 22, paperY + paperH / 2 - 24, `${ui.compareFunction}: ${stanceText}`, textStyle(10.5, COLOR_STR.warning))
          .setOrigin(0, 0.5)
      );
    };

    drawDocument(leftIndex, cx - 278);
    drawDocument(rightIndex, cx + 278);
    container.add(
      this.scene.add
        .text(cx, cy + panelH / 2 - 82, ui.compareHint, textStyle(11, COLOR_STR.paperDim, { align: 'center', wordWrap: { width: 780 } }))
        .setOrigin(0.5)
    );

    if (this.pairs.length > 1) {
      container.add(new Button(this.scene, cx - 410, cy + panelH / 2 - 34, ui.comparePrev, () => this.move(-1), { width: 190, height: 38, fontSize: 11.5, variant: 'ghost' }));
      container.add(new Button(this.scene, cx + 410, cy + panelH / 2 - 34, ui.compareNext, () => this.move(1), { width: 190, height: 38, fontSize: 11.5, variant: 'ghost' }));
    }
    container.add(new Button(this.scene, cx, cy + panelH / 2 - 34, ui[this.closeKey], () => this.close(), { width: 250, height: 38, fontSize: 12.5 }));
    this.container = container;

    const sections = [leftIndex, rightIndex].map((index) => ({
      heading: `${fmt(L().ui.evidence.exhibit, { num: index + 1 })} — ${texts.clues[index].title}`,
      text: texts.clues[index].text
    }));
    if (replacing) ReadingLayer.replaceOverlay(ui.compareTitle, sections);
    else ReadingLayer.openOverlay(ui.compareTitle, sections);
  }
}

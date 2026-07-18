import Phaser from 'phaser';
import { Button } from './Button';
import { Panel } from './Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Pre-computed, localized content for the decision debrief. ReportScene builds
 * this from the ALREADY-COMPUTED ReportResult + existing case/rule texts and
 * passes it in — so this component is a pure presentation layer.
 */
export interface DecisionDebriefData {
  /** true when the outcome is fully correct (positive, shorter variant). */
  positive: boolean;
  /** "classification → measure" the player chose. */
  yourChoice: string;
  /** why it is (not) fully correct — reuses the existing typed error text. */
  why: string;
  /** the dossier evidence to observe (relevant clue titles) or a fallback. */
  observe: string;
  /** the related rule: "title — reference" (existing norm texts). */
  norm: string;
  /** how to reason next time (didactic fallback). */
  howTo: string;
  /** AI Act concept(s) of the case, already localized (v1.1). */
  concept: string;
  /** one-sentence learning takeaway, already localized (v1.1). */
  takeaway: string;
  /** optional INTERNAL site page to read next (same-origin path, v1.1). */
  linkUrl?: string;
  /**
   * optional reflection hook (2.0): when set, the overlay shows the single
   * reflection question with three discrete choices and reports the pick.
   * Local-only by contract — the callback must not trigger any network call.
   */
  onReflect?: (choice: 'holds' | 'unsure' | 'revise') => void;
}

/**
 * Read-only "Decision debrief" overlay shown AFTER the decision (from
 * ReportScene), turning the error into learning.
 *
 * STRICTLY presentational: it receives pre-localized strings and only draws a
 * modal. It does NOT read or write game state, does NOT touch the score, the
 * report, completed cases or unlocked norms, adds no analytics/telemetry and
 * opens no external URL. Closing it just destroys the overlay container.
 */
export class DecisionDebriefOverlay {
  private container?: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly data: DecisionDebriefData
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

  /** ESC chiude l'overlay (accessibilità da tastiera, v1.1). */
  private readonly escHandler = (): void => this.close();

  open(): void {
    if (this.isOpen) return;
    const scene = this.scene;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const ui = L().ui.decisionDebrief;
    const d = this.data;

    const container = scene.add.container(0, 0).setDepth(90);

    // backdrop: a click outside the panel closes the overlay
    container.add(
      scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setInteractive().on('pointerdown', () => this.close())
    );

    const panelW = 940;
    // 640: la variante negativa ha 7 righe etichettate dalla v1.1
    const panelH = 640;
    container.add(new Panel(scene, cx, cy, panelW, panelH));
    // transparent hit area over the panel so clicks INSIDE it don't close it
    container.add(scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 40;
    const wrap = panelW - 80;
    let y = cy - panelH / 2 + 28;

    const titleText = d.positive ? ui.correctTitle : ui.title;
    container.add(scene.add.text(left, y, titleText, textStyle(18, d.positive ? COLOR_STR.ok : COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 30;
    container.add(scene.add.text(left, y, ui.intro, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: wrap } })));
    y += 40;

    const labelled = (label: string, value: string): void => {
      container.add(scene.add.text(left, y, label, textStyle(11.5, COLOR_STR.accent, { fontStyle: 'bold' })));
      y += 20;
      const v = scene.add.text(left, y, value, textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 4 }));
      container.add(v);
      y += Math.max(24, v.height + 12);
    };

    if (d.positive) {
      // shorter positive variant: why (coherent) → key element → rule
      labelled(ui.whyLabel, d.why);
      labelled(ui.keyElementLabel, d.observe);
      labelled(ui.normLabel, d.norm);
    } else {
      labelled(ui.yourChoiceLabel, d.yourChoice);
      labelled(ui.whyLabel, d.why);
      labelled(ui.observeLabel, d.observe);
      labelled(ui.normLabel, d.norm);
      labelled(ui.howToLabel, d.howTo);
    }
    // v1.1: concept involved + one-sentence takeaway, in both variants
    labelled(ui.conceptLabel, d.concept);
    labelled(ui.takeawayLabel, d.takeaway);

    // 2.0: one concise reflection question (optional, local, no score effect)
    if (d.onReflect) {
      const r = L().learningLayer.reflection;
      container.add(scene.add.text(left, y, `${r.label} — ${r.prompt}`, textStyle(11.5, COLOR_STR.accent, { fontStyle: 'bold' })));
      y += 24;
      const ack = scene.add.text(left, y + 34, '', textStyle(11.5, COLOR_STR.ok));
      container.add(ack);
      const choices: Array<['holds' | 'unsure' | 'revise', string]> = [
        ['holds', r.options.holds],
        ['unsure', r.options.unsure],
        ['revise', r.options.revise]
      ];
      choices.forEach(([choice, label], i) => {
        container.add(
          new Button(scene, left + 110 + i * 230, y + 6, label, () => {
            d.onReflect?.(choice);
            ack.setText(r.thanks);
          }, { width: 214, height: 32, fontSize: 11, variant: 'ghost' })
        );
      });
      y += 52;
    }

    // close button added LAST → above the shade/hit-area, stays clickable.
    // Optional "learn more": INTERNAL page only (same origin), new tab.
    if (d.linkUrl) {
      const url = d.linkUrl;
      container.add(
        new Button(scene, cx - 150, cy + panelH / 2 - 34, ui.learnMore, () => window.open(url, '_blank', 'noopener,noreferrer'), { width: 260, height: 38, fontSize: 13, variant: 'ghost' })
      );
      container.add(new Button(scene, cx + 130, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 220, height: 38, fontSize: 13 }));
    } else {
      container.add(new Button(scene, cx, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 220, height: 38, fontSize: 13 }));
    }

    this.scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

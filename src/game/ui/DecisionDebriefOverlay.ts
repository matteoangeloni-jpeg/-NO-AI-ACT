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
    this.container?.destroy();
    this.container = undefined;
  }

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
    const panelH = 600;
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

    // close button added LAST → above the shade/hit-area, stays clickable
    container.add(new Button(scene, cx, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 220, height: 38, fontSize: 13 }));

    this.container = container;
  }
}

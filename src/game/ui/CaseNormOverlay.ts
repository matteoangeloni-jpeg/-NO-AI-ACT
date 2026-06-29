import Phaser from 'phaser';
import { Button } from './Button';
import { Panel } from './Panel';
import { L, normText } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Read-only "Case rule" overlay shown during the decision.
 *
 * Surfaces the relevant rule of the CURRENT case (linked via CaseData.normId)
 * as a short, contextual card — so the player can connect case → rule →
 * reasoned decision while they classify.
 *
 * STRICTLY read-only and NON-unlocking:
 *  - it only reads the localized rule texts (normText), nothing else;
 *  - it does NOT unlock the rule, does NOT mark progress, does NOT touch
 *    StateManager, scoring, the report, completed cases or unlocked norms;
 *  - it adds no analytics/telemetry and opens no external URL.
 *
 * Anti-spoiler: it presents the rule as support, not as the answer. It shows the
 * existing Reference + short explanation, never states a classification verdict,
 * and the "why it matters" slot uses a generic line that redirects to the
 * dossier evidence (no invented, case-specific legal content).
 */
export class CaseNormOverlay {
  private container?: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly normId: string
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
    const ui = L().ui.caseNorm;
    const rule = normText(this.normId); // read-only: localized texts only

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

    // framing: this is support for reasoning, not the answer
    container.add(scene.add.text(left, y, ui.supportNote, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: wrap } })));
    y += 44;

    const labelled = (label: string, value: string, valueStyle = textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 5 })): void => {
      container.add(scene.add.text(left, y, label, textStyle(11.5, COLOR_STR.accent, { fontStyle: 'bold' })));
      y += 20;
      const v = scene.add.text(left, y, value, valueStyle);
      container.add(v);
      y += Math.max(26, v.height + 12);
    };

    labelled(ui.relevantLabel, rule.title, textStyle(15, COLOR_STR.paper, { fontStyle: 'bold', wordWrap: { width: wrap } }));
    labelled(ui.referenceLabel, rule.reference);
    labelled(ui.inShortLabel, rule.explanation);
    labelled(ui.whyLabel, ui.whyFallback, textStyle(13, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 4 }));

    // continuity: use the rule to reason, then go back to the evidence
    container.add(
      scene.add.text(cx, cy + panelH / 2 - 76, ui.continuityNote, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: panelW - 120 }, align: 'center', fontStyle: 'italic' })).setOrigin(0.5)
    );

    // close button added LAST → above the shade/hit-area, stays clickable
    container.add(new Button(scene, cx, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 280, height: 38, fontSize: 13 }));

    this.container = container;
  }
}

import Phaser from 'phaser';
import { getCase } from '../data/cases';
import { Button } from './Button';
import { Panel } from './Panel';
import { L, caseText, fmt, locationName } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Read-only "Review context" overlay, reused by EvidenceScene and DecisionScene.
 *
 * Lets the player re-read the case they are working on (title, file/location,
 * scenario summary, decision objective) so they can re-orient during the
 * investigation and the decision steps WITHOUT going back or rolling state.
 *
 * STRICTLY read-only: it only reads existing case data (caseText / getCase /
 * locationName) and draws a modal overlay. It never mutates StateManager, never
 * tracks analytics, never navigates (scene.start) and opens no external URL.
 * Closing it simply destroys the overlay container — no game state changes.
 *
 * Note: the game model has no dedicated "AI system under review" or "affected
 * subjects" fields; those details live inside the scenario prose (and `subject`
 * is the answer, not shown here). So the overlay shows the scenario rather than
 * inventing structured fields.
 */
export class CaseContextOverlay {
  private container?: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly caseId: string,
    private readonly closeKey: 'closeToDecision' | 'closeToEvidence'
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
    const ui = L().ui.context;
    const data = getCase(this.caseId);
    const texts = caseText(this.caseId);

    const container = scene.add.container(0, 0).setDepth(90);

    // backdrop: a click outside the panel closes the overlay
    const shade = scene.add
      .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82)
      .setInteractive()
      .on('pointerdown', () => this.close());
    container.add(shade);

    const panelW = 920;
    const panelH = 540;
    container.add(new Panel(scene, cx, cy, panelW, panelH));
    // transparent hit area over the panel so clicks INSIDE it don't close it
    container.add(scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 40;
    const wrap = panelW - 80;
    let y = cy - panelH / 2 + 30;

    container.add(scene.add.text(left, y, ui.title, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 34;
    container.add(
      scene.add.text(left, y, texts.title.toUpperCase(), textStyle(15, COLOR_STR.paper, { fontStyle: 'bold', wordWrap: { width: wrap } }))
    );
    y += 26;
    container.add(
      scene.add.text(
        left,
        y,
        `${fmt(L().ui.case.fileLabel, { code: data.fileCode })} · ${locationName(data.locationId).toUpperCase()}`,
        textStyle(12, COLOR_STR.paperDim)
      )
    );
    y += 34;

    container.add(scene.add.text(left, y, ui.scenarioLabel, textStyle(12, COLOR_STR.paperDim)));
    y += 22;
    container.add(scene.add.text(left, y, texts.scenario, textStyle(14, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 5 })));
    y += 156;

    container.add(scene.add.text(left, y, ui.objectiveLabel, textStyle(12, COLOR_STR.paperDim)));
    y += 22;
    container.add(scene.add.text(left, y, ui.objective, textStyle(13.5, COLOR_STR.accent, { wordWrap: { width: wrap }, lineSpacing: 4 })));

    container.add(
      scene.add
        .text(cx, cy + panelH / 2 - 78, ui.note, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: panelW - 120 }, align: 'center' }))
        .setOrigin(0.5)
    );

    // close button added LAST → sits above the shade/hit-area and stays clickable
    container.add(
      new Button(scene, cx, cy + panelH / 2 - 36, ui[this.closeKey], () => this.close(), { width: 280, height: 38, fontSize: 13 })
    );

    this.container = container;
  }
}

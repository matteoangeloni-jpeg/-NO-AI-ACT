import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import { AudioSystem } from '../systems/AudioSystem';
import { L, fmt } from '../i18n';

/**
 * Scheda reperto del fascicolo. Tre stati:
 *  1. sigillata: mostra solo il codice reperto; clic per aprire;
 *  2. aperta: mostra titolo e contenuto + pulsante "CITA NEL RAPPORTO";
 *  3. citata: il reperto è incluso nel rapporto (toggle).
 */
export class DossierCard extends Phaser.GameObjects.Container {
  private revealed = false;
  private cited = false;
  private citeLabel!: Phaser.GameObjects.Text;
  private bg!: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    clue: { title: string; text: string },
    index: number,
    private onChange: () => void,
    sourceLabel?: string
  ) {
    super(scene, x, y);

    this.bg = scene.add.rectangle(0, 0, width, height, COLORS.night2, 0.95).setStrokeStyle(1, COLORS.iron);
    const tape = scene.add.rectangle(0, -height / 2 + 14, width, 28, COLORS.carbon).setStrokeStyle(1, COLORS.iron);
    const code = scene.add
      .text(-width / 2 + 12, -height / 2 + 14, fmt(L().ui.evidence.exhibit, { num: String(index + 1).padStart(2, '0') }), textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0, 0.5);
    // etichetta-fonte (attendibilità): sempre visibile, aiuta a ragionare
    const srcText = sourceLabel
      ? scene.add.text(width / 2 - 12, -height / 2 + 14, sourceLabel, textStyle(11, COLOR_STR.accent)).setOrigin(1, 0.5)
      : null;
    const sealed = scene.add
      .text(0, 10, L().ui.evidence.sealed, textStyle(13, COLOR_STR.accent, { align: 'center' }))
      .setOrigin(0.5);
    const title = scene.add
      .text(-width / 2 + 14, -height / 2 + 38, clue.title.toUpperCase(), textStyle(13, COLOR_STR.warning, { wordWrap: { width: width - 28 } }))
      .setVisible(false);
    const body = scene.add
      .text(-width / 2 + 14, -height / 2 + 64, clue.text, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: width - 28 }, lineSpacing: 5 }))
      .setVisible(false);
    this.citeLabel = scene.add
      .text(0, height / 2 - 22, L().ui.evidence.cite, textStyle(12.5, COLOR_STR.accent))
      .setOrigin(0.5)
      .setVisible(false);

    this.add([this.bg, tape, code, sealed, title, body, this.citeLabel]);
    if (srcText) this.add(srcText);
    this.setSize(width, height);
    scene.add.existing(this);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        if (!this.revealed) this.bg.setStrokeStyle(2, COLORS.accent);
        else if (!this.cited) this.bg.setStrokeStyle(2, COLORS.accent);
      })
      .on('pointerout', () => this.refreshBorder())
      .on('pointerdown', () => {
        AudioSystem.init();
        if (!this.revealed) {
          // primo clic: apertura del reperto
          this.revealed = true;
          AudioSystem.confirm();
          sealed.setVisible(false);
          title.setVisible(true);
          body.setVisible(true);
          this.citeLabel.setVisible(true);
          scene.tweens.add({ targets: [title, body, this.citeLabel], alpha: { from: 0, to: 1 }, duration: 250 });
        } else {
          // clic successivi: toggle citazione nel rapporto
          this.cited = !this.cited;
          AudioSystem.click();
          this.citeLabel.setText(this.cited ? L().ui.evidence.cited : L().ui.evidence.cite);
          this.citeLabel.setColor(this.cited ? COLOR_STR.ok : COLOR_STR.accent);
        }
        this.refreshBorder();
        this.onChange();
      });
  }

  private refreshBorder(): void {
    if (this.cited) this.bg.setStrokeStyle(2, COLORS.ok);
    else if (this.revealed) this.bg.setStrokeStyle(1, COLORS.warning);
    else this.bg.setStrokeStyle(1, COLORS.iron);
  }

  get isRevealed(): boolean {
    return this.revealed;
  }

  get isCited(): boolean {
    return this.cited;
  }
}

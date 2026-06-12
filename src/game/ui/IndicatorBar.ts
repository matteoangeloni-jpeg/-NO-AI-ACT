import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';

/**
 * Barra indicatore con etichetta e valore numerico sempre visibili
 * (l'informazione non è mai affidata al solo colore).
 */
export class IndicatorBar {
  private scene: Phaser.Scene;
  private labelText: Phaser.GameObjects.Text;
  private valueText: Phaser.GameObjects.Text;
  private barBg: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;
  private frame: Phaser.GameObjects.Rectangle;
  private width: number;
  private value: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, label: string, value: number) {
    this.scene = scene;
    this.width = width;
    this.value = value;

    this.labelText = scene.add.text(x, y, label, textStyle(12, COLOR_STR.paperDim));
    this.valueText = scene.add.text(x + width, y, String(value), textStyle(12, COLOR_STR.paper)).setOrigin(1, 0);
    this.barBg = scene.add.rectangle(x, y + 16, width, 8, COLORS.carbon).setOrigin(0, 0);
    this.barFill = scene.add
      .rectangle(x, y + 16, (width * value) / 100, 8, this.colorFor(value))
      .setOrigin(0, 0);
    this.frame = scene.add.rectangle(x, y + 16, width, 8).setOrigin(0, 0).setStrokeStyle(1, COLORS.iron);
  }

  setValue(value: number): void {
    this.value = value;
    this.barFill.width = (this.width * value) / 100;
    this.barFill.fillColor = this.colorFor(value);
    this.valueText.setText(String(value));
  }

  animateTo(from: number, to: number): void {
    this.barFill.fillColor = this.colorFor(to);
    this.scene.tweens.addCounter({
      from,
      to,
      duration: 700,
      ease: 'Cubic.easeOut',
      onUpdate: (tween) => {
        const v = Math.round(tween.getValue() ?? to);
        this.barFill.width = (this.width * v) / 100;
        this.valueText.setText(String(v));
      },
      onComplete: () => this.setValue(to)
    });
    // pulse del delta accanto al valore
    const delta = to - from;
    if (delta !== 0) {
      const sign = delta > 0 ? '+' : '';
      const deltaText = this.scene.add
        .text(this.valueText.x + 8, this.valueText.y, `${sign}${delta}`, textStyle(12, delta > 0 ? COLOR_STR.accent : COLOR_STR.warning))
        .setOrigin(0, 0);
      this.scene.tweens.add({
        targets: deltaText,
        alpha: 0,
        y: deltaText.y - 12,
        duration: 1600,
        onComplete: () => deltaText.destroy()
      });
    }
  }

  setDepth(depth: number): void {
    [this.labelText, this.valueText, this.barBg, this.barFill, this.frame].forEach((o) => o.setDepth(depth));
  }

  /** Soglie di allarme: rosso sotto 40, giallo sotto 60, altrimenti neutro. */
  private colorFor(value: number): number {
    if (value < 40) return COLORS.alert;
    if (value < 60) return COLORS.warning;
    return COLORS.accent;
  }

  get current(): number {
    return this.value;
  }
}

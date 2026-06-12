import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { COLORS, COLOR_STR, textStyle } from './theme';

export interface ButtonOptions {
  width?: number;
  height?: number;
  variant?: 'default' | 'danger' | 'ok' | 'ghost';
  fontSize?: number;
  disabled?: boolean;
}

/**
 * Bottone accessibile: area generosa, stati hover/focus visibili,
 * feedback sonoro, etichetta sempre testuale (mai solo colore).
 */
export class Button extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private border: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private opts: Required<ButtonOptions>;
  private enabled: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: ButtonOptions = {}
  ) {
    super(scene, x, y);
    this.opts = {
      width: options.width ?? 280,
      height: options.height ?? 48,
      variant: options.variant ?? 'default',
      fontSize: options.fontSize ?? 16,
      disabled: options.disabled ?? false
    };
    this.enabled = !this.opts.disabled;

    const { width, height } = this.opts;
    this.bg = scene.add.rectangle(0, 0, width, height, this.fillColor(), 1);
    this.border = scene.add.rectangle(0, 0, width, height).setStrokeStyle(1, this.strokeColor());
    this.label = scene.add
      .text(0, 0, text, textStyle(this.opts.fontSize, this.textColor()))
      .setOrigin(0.5);

    this.add([this.bg, this.border, this.label]);
    this.setSize(width, height);
    scene.add.existing(this);

    if (this.enabled) {
      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.setHover(true))
        .on('pointerout', () => this.setHover(false))
        .on('pointerdown', () => {
          AudioSystem.init();
          AudioSystem.click();
          onClick();
        });
    } else {
      this.setAlpha(0.45);
    }
  }

  setHover(hover: boolean): void {
    if (!this.enabled) return;
    this.bg.setFillStyle(hover ? this.hoverColor() : this.fillColor());
    this.border.setStrokeStyle(hover ? 2 : 1, hover ? COLORS.accent : this.strokeColor());
    this.label.setColor(hover ? COLOR_STR.paper : this.textColor());
  }

  setLabel(text: string): void {
    this.label.setText(text);
  }

  private fillColor(): number {
    switch (this.opts.variant) {
      case 'danger': return 0x2a1014;
      case 'ok': return 0x0f2418;
      case 'ghost': return COLORS.carbon;
      default: return COLORS.night2;
    }
  }

  private hoverColor(): number {
    switch (this.opts.variant) {
      case 'danger': return 0x3d181e;
      case 'ok': return 0x163524;
      case 'ghost': return COLORS.night2;
      default: return 0x1a2a4a;
    }
  }

  private strokeColor(): number {
    switch (this.opts.variant) {
      case 'danger': return COLORS.alert;
      case 'ok': return COLORS.ok;
      default: return COLORS.iron;
    }
  }

  private textColor(): string {
    switch (this.opts.variant) {
      case 'danger': return COLOR_STR.alertText;
      case 'ok': return COLOR_STR.ok;
      case 'ghost': return COLOR_STR.paperDim;
      default: return COLOR_STR.paper;
    }
  }
}

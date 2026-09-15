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
  private readonly onClick: () => void;

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
    this.onClick = onClick;

    const { width, height } = this.opts;
    this.bg = scene.add.rectangle(0, 0, width, height, this.fillColor(), 1);
    this.border = scene.add.rectangle(0, 0, width, height).setStrokeStyle(1, this.strokeColor());
    this.label = scene.add
      .text(0, 0, text, textStyle(this.opts.fontSize, this.textColor()))
      .setOrigin(0.5);

    this.add([this.bg, this.border, this.label]);
    this.setSize(width, height);
    scene.add.existing(this);

    this.applyEnabled();
  }

  /**
   * Accende o spegne il bottone dopo la costruzione. Serve dove la
   * disponibilità di un'azione dipende da una scelta fatta nella stessa
   * schermata — il ripasso quando non c'è niente da ripassare, per esempio.
   * Un bottone spento non è solo più pallido: smette di reagire al
   * puntatore, altrimenti sembrerebbe rotto invece che non disponibile.
   */
  setEnabled(value: boolean): void {
    if (this.enabled === value) return;
    this.enabled = value;
    this.applyEnabled();
  }

  private applyEnabled(): void {
    if (this.enabled) {
      this.setAlpha(1);
      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.setHover(true))
        .on('pointerout', () => this.setHover(false))
        .on('pointerdown', () => {
          AudioSystem.init();
          AudioSystem.click();
          this.onClick();
        });
    } else {
      this.removeAllListeners();
      this.disableInteractive();
      this.setHoverVisual(false);
      this.setAlpha(0.45);
    }
  }

  /**
   * Cambia la larghezza a bottone già costruito, sfondo, bordo e area
   * sensibile insieme. Scalare il contenitore invece deformerebbe anche
   * l'etichetta.
   */
  setButtonWidth(width: number): void {
    this.opts.width = width;
    this.bg.setSize(width, this.opts.height);
    this.border.setSize(width, this.opts.height);
    this.setSize(width, this.opts.height);
    if (this.enabled) this.setInteractive({ useHandCursor: true });
  }

  /** Etichetta corrente, per chi deve annunciarla o verificarla. */
  get labelText(): string {
    return this.label.text;
  }

  setHover(hover: boolean): void {
    if (!this.enabled) return;
    this.setHoverVisual(hover);
  }

  private setHoverVisual(hover: boolean): void {
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

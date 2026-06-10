import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import { textStyle, COLOR_STR } from './theme';

/**
 * Testo a macchina da scrivere con suono da terminale.
 * Con "riduci animazioni" attivo il testo appare subito.
 * Un click/tap mentre scrive completa immediatamente.
 */
export class TypewriterText extends Phaser.GameObjects.Text {
  private fullText = '';
  private timer?: Phaser.Time.TimerEvent;
  private onDone?: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    size: number,
    color: string = COLOR_STR.paper,
    wordWrapWidth?: number
  ) {
    super(scene, x, y, '', textStyle(size, color, {
      wordWrap: wordWrapWidth ? { width: wordWrapWidth } : undefined,
      lineSpacing: 6
    }));
    scene.add.existing(this);
  }

  write(text: string, onDone?: () => void): void {
    this.fullText = text;
    this.onDone = onDone;
    this.timer?.remove();

    if (StateManager.reducedMotion) {
      this.setText(text);
      onDone?.();
      return;
    }

    this.setText('');
    let i = 0;
    this.timer = this.scene.time.addEvent({
      delay: 14,
      repeat: text.length - 1,
      callback: () => {
        i += 1;
        this.setText(text.slice(0, i));
        if (i % 3 === 0) AudioSystem.terminal();
        if (i >= text.length) this.finish();
      }
    });
  }

  /** Completa subito la scrittura (skip). */
  skip(): void {
    if (!this.timer || this.timer.getOverallProgress() >= 1) return;
    this.timer.remove();
    this.setText(this.fullText);
    this.finish();
  }

  get isWriting(): boolean {
    return !!this.timer && this.timer.getOverallProgress() < 1 && this.text !== this.fullText;
  }

  private finish(): void {
    this.timer?.remove();
    this.timer = undefined;
    const cb = this.onDone;
    this.onDone = undefined;
    cb?.();
  }
}

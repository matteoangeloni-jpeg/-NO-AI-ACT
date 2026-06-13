import Phaser from 'phaser';
import type { IndicatorKey, IndicatorState, OutcomeQuality } from '../data/types';
import { L } from '../i18n';
import { StateManager } from './StateManager';
import { IndicatorBar } from '../ui/IndicatorBar';

export const INDICATOR_KEYS: IndicatorKey[] = ['efficienza', 'controllo', 'diritti', 'fiducia'];

export function randomComment(quality: OutcomeQuality): string {
  const pool = L().indicators.comments[quality];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * HUD degli indicatori: quattro barre sempre visibili, animate al cambio.
 * Va montato in ogni scena che mostra lo stato della città.
 */
export class IndicatorHud {
  private bars = new Map<IndicatorKey, IndicatorBar>();

  constructor(scene: Phaser.Scene, x: number, y: number, width = 250) {
    const state = StateManager.indicators;
    INDICATOR_KEYS.forEach((key, i) => {
      // per il controllo sociale un valore ALTO è il segnale d'allarme
      const bar = new IndicatorBar(scene, x, y + i * 34, width, L().indicators.labels[key], state[key], key === 'controllo');
      this.bars.set(key, bar);
    });
  }

  /** Anima le barre dal vecchio al nuovo stato. */
  animateTo(scene: Phaser.Scene, from: IndicatorState, to: IndicatorState): void {
    INDICATOR_KEYS.forEach((key, i) => {
      const bar = this.bars.get(key);
      if (!bar) return;
      scene.time.delayedCall(i * 120, () => bar.animateTo(from[key], to[key]));
    });
  }

  refresh(): void {
    this.setState(StateManager.indicators);
  }

  /** Imposta le barre su uno stato arbitrario (es. stato precedente). */
  setState(state: IndicatorState): void {
    INDICATOR_KEYS.forEach((key) => this.bars.get(key)?.setValue(state[key]));
  }

  setDepth(depth: number): void {
    this.bars.forEach((b) => b.setDepth(depth));
  }
}

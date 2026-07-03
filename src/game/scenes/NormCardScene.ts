import Phaser from 'phaser';
import type { OutcomeQuality } from '../data/types';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { NormSystem } from '../systems/NormSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { NormCardView } from '../ui/NormCard';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Sblocco della carta norma con animazione di flip. */
export class NormCardScene extends Phaser.Scene {
  private normId!: string;
  private quality!: OutcomeQuality;

  constructor() {
    super('NormCard');
  }

  init(data: { normId: string; quality: OutcomeQuality }): void {
    this.normId = data.normId;
    this.quality = data.quality;
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const ui = L().ui.normCard;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, cy, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    const norm = NormSystem.view(this.normId);
    AnalyticsSystem.track('norm_unlocked', {
      normId: this.normId,
      unlockedNormsCount: StateManager.unlockedNorms.length
    });
    this.add.text(cx, 64, ui.unlocked, textStyle(16, COLOR_STR.ok)).setOrigin(0.5);
    this.add
      .text(cx, 90, this.quality === 'wrong' ? ui.subWrong : ui.subCorrect, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);

    const card = new NormCardView(this, cx, cy + 30, norm, { width: 600, height: 488 });

    // flip di sblocco + particelle
    AudioSystem.unlock();
    if (!StateManager.reducedMotion) {
      card.setScale(0, 1);
      this.tweens.add({ targets: card, scaleX: 1, duration: 450, ease: 'Back.easeOut' });
      const emitter = this.add.particles(cx, cy + 26, 'px', {
        speed: { min: 60, max: 180 },
        lifespan: 900,
        scale: { start: 0.8, end: 0 },
        quantity: 2,
        alpha: { start: 0.8, end: 0 },
        tint: 0x5d7fb8,
        emitting: false
      });
      emitter.explode(36);
    }

    const backToMap = (): void => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CityMap'));
    };
    new Button(this, cx, GAME_HEIGHT - 50, ui.backToMap, backToMap);
    // tastiera (v1.1): INVIO chiude la carta norma e torna alla mappa
    this.input.keyboard?.once('keydown-ENTER', backToMap);
  }
}

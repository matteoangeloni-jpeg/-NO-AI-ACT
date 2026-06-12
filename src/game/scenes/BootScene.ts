import Phaser from 'phaser';
import { StateManager } from '../systems/StateManager';
import { LicenseNoticeSystem } from '../systems/LicenseNoticeSystem';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { COLOR_STR } from '../ui/theme';

/** Avvio: applica preferenze persistite e passa al preload. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    StateManager.applyDomPreferences();
    LicenseNoticeSystem.logToConsole();
    AnalyticsSystem.track('game_opened', { language: StateManager.language });
    this.scene.start('Preload');
  }
}

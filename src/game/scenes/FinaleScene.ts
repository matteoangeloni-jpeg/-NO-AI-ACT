import Phaser from 'phaser';
import { FINAL_MESSAGE, computeEnding } from '../data/endings';
import { AudioSystem } from '../systems/AudioSystem';
import { IndicatorHud } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { TypewriterText } from '../ui/TypewriterText';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Rapporto finale: l'esito dipende dagli indicatori accumulati. */
export class FinaleScene extends Phaser.Scene {
  constructor() {
    super('Finale');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.add.image(cx, GAME_HEIGHT / 2, 'citymap').setAlpha(0.15);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.5);

    const ending = computeEnding(StateManager.indicators);
    StateManager.setEnding(ending.id);
    AudioSystem.stopDrone();
    if (ending.id === 'ending_opaca') AudioSystem.error();
    else if (ending.id === 'ending_governata') AudioSystem.unlock();
    else AudioSystem.alert();

    const titleColor =
      ending.id === 'ending_governata' ? COLOR_STR.ok : ending.id === 'ending_opaca' ? COLOR_STR.alert : COLOR_STR.warning;

    this.add.text(cx, 70, 'RAPPORTO CONCLUSIVO DELL\'ISPETTORATO', textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 110, ending.title, textStyle(28, titleColor, { fontStyle: 'bold' })).setOrigin(0.5);

    new Panel(this, cx - 180, 300, 640, 260);
    const body = new TypewriterText(this, cx - 480, 200, 15, COLOR_STR.paper, 600);
    body.write(ending.text);
    this.input.on('pointerdown', () => body.skip());

    // stato finale degli indicatori
    this.add.rectangle(cx + 340, 290, 320, 230, COLORS.carbon, 0.85).setStrokeStyle(1, COLORS.iron);
    this.add.text(cx + 200, 190, 'STATO FINALE DELLA CITTÀ', textStyle(11, COLOR_STR.paperDim));
    new IndicatorHud(this, cx + 200, 214, 270);

    // messaggio finale obbligatorio
    const msg = this.add
      .text(cx, 510, `“${FINAL_MESSAGE}”`, textStyle(16, COLOR_STR.accent, { wordWrap: { width: 880 }, align: 'center', lineSpacing: 6 }))
      .setOrigin(0.5)
      .setAlpha(0);
    this.tweens.add({ targets: msg, alpha: 1, duration: 900, delay: StateManager.reducedMotion ? 0 : 1500 });

    new Button(this, cx - 220, GAME_HEIGHT - 60, 'NUOVA PARTITA', () => {
      StateManager.newGame();
      this.scene.start('Briefing');
    });
    new Button(this, cx + 70, GAME_HEIGHT - 60, 'ARCHIVIO NORME', () => this.scene.start('Archive', { from: 'Finale' }), { variant: 'ghost' });
    new Button(this, cx + 330, GAME_HEIGHT - 60, 'CREDITS', () => this.scene.start('Credits'), { width: 180, variant: 'ghost' });
  }
}

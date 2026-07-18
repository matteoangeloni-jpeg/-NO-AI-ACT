import Phaser from 'phaser';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { SelfCheckOverlay } from '../ui/SelfCheckOverlay';
import { TypewriterText } from '../ui/TypewriterText';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

export class BriefingScene extends Phaser.Scene {
  constructor() {
    super('Briefing');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    new Panel(this, cx, GAME_HEIGHT / 2, 860, 560);
    this.add.text(cx - 400, 90, L().briefing.header, textStyle(13, COLOR_STR.alertText));
    this.add.text(cx - 400, 112, L().briefing.sub, textStyle(12, COLOR_STR.paperDim));

    const body = new TypewriterText(this, cx - 400, 150, 15, COLOR_STR.paper, 800);
    // La CTA vive dentro il pannello (fondo a 640), con margine dal bordo: mai
    // a cavallo del bordo del canvas né sotto il testo di onboarding.
    const btnY = 600;
    const btn = new Button(this, cx, btnY, L().briefing.cta, () => {
      StateManager.setBriefingSeen();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CityMap'));
    }, { width: 340 });
    btn.setVisible(false);

    // riga di onboarding: cosa aspettarsi, rivelata quando il testo è finito.
    // Ancorata SOPRA la CTA usando la sua altezza misurata, così le copie lunghe
    // IT/EN non si sovrappongono mai al bottone (prima erano a y fisse in
    // collisione).
    const how = this.add
      .text(cx - 400, 0, L().briefing.how, textStyle(12.5, COLOR_STR.accent, { wordWrap: { width: 800 }, lineSpacing: 4, fontStyle: 'italic' }))
      .setAlpha(0);
    how.setY(btnY - btn.height / 2 - 16 - how.height);

    // autocontrollo iniziale 2.0: facoltativo, locale, saltabile; mostrato solo
    // finché non è stato fatto (una volta basta per il confronto pre/post)
    const selfCheck = new SelfCheckOverlay(this, 'pre');
    const scBtn = StateManager.selfCheck.pre === null
      ? new Button(this, cx, btnY + 46, L().learningLayer.selfCheck.buttonPre, () => selfCheck.open(), { width: 340, height: 34, fontSize: 11.5, variant: 'ghost' })
      : null;
    scBtn?.setVisible(false);

    body.write(L().briefing.body, () => {
      btn.setVisible(true);
      scBtn?.setVisible(true);
      this.tweens.add({ targets: how, alpha: 1, duration: StateManager.reducedMotion ? 0 : 400 });
    });
    this.input.on('pointerdown', () => body.skip());
  }
}

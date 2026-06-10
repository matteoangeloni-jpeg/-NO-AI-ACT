import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { showToast } from '../ui/AlertToast';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

export class TitleScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private glitchTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('Title');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.add.image(cx, GAME_HEIGHT / 2, 'citymap').setAlpha(0.25);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.5);

    this.add.text(cx, 150, 'REPUBBLICA MUNICIPALE AUTOMATIZZATA — ANNO 2032', textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.titleText = this.add.text(cx, 220, 'NO AI ACT', textStyle(76, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, 285, 'Simulatore di una società non regolata', textStyle(18, COLOR_STR.accent)).setOrigin(0.5);

    if (!StateManager.reducedMotion) {
      this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
    }

    const hasSave = SaveSystem.hasSave();
    let y = 390;
    if (hasSave && StateManager.completedCount() > 0) {
      new Button(this, cx, y, 'CONTINUA INDAGINE', () => this.startGame(false));
      y += 62;
    }
    new Button(this, cx, y, 'NUOVA PARTITA', () => {
      if (hasSave) StateManager.newGame();
      this.startGame(true);
    });
    y += 62;
    new Button(this, cx, y, 'ARCHIVIO NORME', () => this.scene.start('Archive', { from: 'Title' }), { variant: 'ghost' });
    y += 62;
    new Button(this, cx, y, 'CREDITS E LICENZE', () => this.scene.start('Credits'), { variant: 'ghost' });
    y += 62;
    if (hasSave) {
      new Button(this, cx, y, 'RESET SALVATAGGIO', () => {
        StateManager.newGame();
        showToast(this, 'Salvataggio azzerato.', 'warning');
        this.scene.restart();
      }, { variant: 'danger', height: 40, fontSize: 13 });
    }

    this.buildPrefsToggles();

    this.add
      .text(cx, GAME_HEIGHT - 24, 'Versione didattica semplificata dell\'AI Act (Reg. UE 2024/1689). Non costituisce consulenza legale.', textStyle(11, COLOR_STR.paperDim))
      .setOrigin(0.5);
  }

  private buildPrefsToggles(): void {
    const x = GAME_WIDTH - 20;
    const audioBtn = new Button(
      this,
      x - 90,
      30,
      StateManager.audioMuted ? 'AUDIO: OFF' : 'AUDIO: ON',
      () => {
        AudioSystem.init();
        const muted = AudioSystem.toggleMute();
        audioBtn.setLabel(muted ? 'AUDIO: OFF' : 'AUDIO: ON');
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    const motionBtn = new Button(
      this,
      x - 90,
      72,
      StateManager.reducedMotion ? 'ANIMAZIONI: RIDOTTE' : 'ANIMAZIONI: PIENE',
      () => {
        StateManager.setReducedMotion(!StateManager.reducedMotion);
        motionBtn.setLabel(StateManager.reducedMotion ? 'ANIMAZIONI: RIDOTTE' : 'ANIMAZIONI: PIENE');
        if (StateManager.reducedMotion) this.glitchTimer?.remove();
        else this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
  }

  private startGame(isNew: boolean): void {
    AudioSystem.init();
    AudioSystem.confirm();
    AudioSystem.startDrone();
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (isNew || !StateManager.briefingSeen) this.scene.start('Briefing');
      else this.scene.start('CityMap');
    });
  }

  /** Glitch del titolo: brevi offset orizzontali e cambio colore. */
  private glitch(): void {
    const original = this.titleText.x;
    this.titleText.setColor(COLOR_STR.alert);
    this.titleText.setX(original + Phaser.Math.Between(-6, 6));
    this.time.delayedCall(60, () => {
      this.titleText.setColor(COLOR_STR.accent);
      this.titleText.setX(original + Phaser.Math.Between(-3, 3));
    });
    this.time.delayedCall(120, () => {
      this.titleText.setColor(COLOR_STR.paper);
      this.titleText.setX(original);
    });
  }
}

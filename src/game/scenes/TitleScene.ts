import Phaser from 'phaser';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { showToast } from '../ui/AlertToast';
import { L, fmt, nextLanguage } from '../i18n';
import { MISSION_IDS } from '../data/missions';
import type { DifficultyMode } from '../data/types';
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
    AnalyticsSystem.page('title');
    AudioSystem.stopLevelTheme(); // la musica appartiene alla città, non al menu
    this.add.image(cx, GAME_HEIGHT / 2, 'citymap').setAlpha(0.25);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.5);

    this.add.text(cx, 150, L().ui.titleHeader, textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.titleText = this.add.text(cx, 220, L().ui.gameTitle, textStyle(76, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, 285, L().ui.gameSubtitle, textStyle(18, COLOR_STR.accent)).setOrigin(0.5);

    if (!StateManager.reducedMotion) {
      this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
    }

    const hasSave = SaveSystem.hasSave();
    let y = 390;
    if (hasSave && StateManager.completedCount() > 0) {
      new Button(this, cx, y, L().ui.menu.continue, () => this.startGame(false));
      y += 62;
    }
    new Button(this, cx, y, L().ui.menu.newGame, () => {
      if (hasSave) StateManager.newGame();
      this.startGame(true);
    });
    y += 62;
    new Button(this, cx, y, L().ui.menu.archive, () => this.scene.start('Archive', { from: 'Title' }), { variant: 'ghost' });
    y += 62;
    new Button(this, cx, y, L().ui.menu.credits, () => this.scene.start('Credits'), { variant: 'ghost' });
    y += 62;
    if (hasSave) {
      new Button(this, cx, y, L().ui.menu.reset, () => {
        AnalyticsSystem.track('reset_game');
        StateManager.newGame();
        showToast(this, L().ui.menu.resetDone, 'warning');
        // lascia il tempo di leggere il toast prima che il restart lo distrugga
        this.time.delayedCall(900, () => this.scene.restart());
      }, { variant: 'danger', height: 40, fontSize: 13 });
    }

    this.buildPrefsToggles();

    this.add
      .text(cx, GAME_HEIGHT - 24, L().ui.footerDisclaimer, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);
  }

  private buildPrefsToggles(): void {
    const x = GAME_WIDTH - 20;
    const m = L().ui.menu;
    const audioBtn = new Button(
      this,
      x - 90,
      30,
      StateManager.audioMuted ? m.audioOff : m.audioOn,
      () => {
        AudioSystem.init();
        const muted = AudioSystem.toggleMute();
        audioBtn.setLabel(muted ? m.audioOff : m.audioOn);
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    const musicLabel = (): string => fmt(m.music, { value: `${Math.round(StateManager.musicVolume * 100)}%` });
    const musicBtn = new Button(
      this,
      x - 90,
      72,
      musicLabel(),
      () => {
        AudioSystem.init();
        // cicla 100% → 50% → 0% → 100%
        const next = StateManager.musicVolume > 0.75 ? 0.5 : StateManager.musicVolume > 0.25 ? 0 : 1;
        AudioSystem.setMusicVolume(next);
        musicBtn.setLabel(musicLabel());
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    const motionBtn = new Button(
      this,
      x - 90,
      114,
      StateManager.reducedMotion ? m.motionReduced : m.motionFull,
      () => {
        StateManager.setReducedMotion(!StateManager.reducedMotion);
        motionBtn.setLabel(StateManager.reducedMotion ? m.motionReduced : m.motionFull);
        if (StateManager.reducedMotion) this.glitchTimer?.remove();
        else this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    // toggle dedicato per aule/proiettori: indipendente dalle animazioni
    const crtBtn = new Button(
      this,
      x - 90,
      156,
      StateManager.crtOverlay ? m.crtOn : m.crtOff,
      () => {
        StateManager.setCrtOverlay(!StateManager.crtOverlay);
        crtBtn.setLabel(StateManager.crtOverlay ? m.crtOn : m.crtOff);
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    // modalità docente: abilita il debrief locale a fine partita
    const teacherBtn = new Button(
      this,
      x - 90,
      198,
      StateManager.teacherMode ? m.teacherOn : m.teacherOff,
      () => {
        StateManager.setTeacherMode(!StateManager.teacherMode);
        teacherBtn.setLabel(StateManager.teacherMode ? m.teacherOn : m.teacherOff);
      },
      { width: 160, height: 34, fontSize: 11, variant: 'ghost' }
    );
    // selettore lingua: cicla le lingue registrate e ricarica la scena
    new Button(
      this,
      x - 90,
      240,
      m.language,
      () => {
        StateManager.setLanguage(nextLanguage());
        AnalyticsSystem.track('language_selected', { language: StateManager.language });
        this.scene.restart();
      },
      { width: 160, height: 34, fontSize: 12, variant: 'ghost' }
    );
    // selettore difficoltà (base → standard → expert)
    const diffOrder: DifficultyMode[] = ['base', 'standard', 'expert'];
    const diffLabel = (): string => fmt(L().ui.difficulty.label, { value: L().ui.difficulty.modes[StateManager.difficulty].name });
    const diffBtn = new Button(
      this,
      x - 90,
      282,
      diffLabel(),
      () => {
        const next = diffOrder[(diffOrder.indexOf(StateManager.difficulty) + 1) % diffOrder.length];
        StateManager.setDifficulty(next);
        diffBtn.setLabel(diffLabel());
      },
      { width: 160, height: 34, fontSize: 11, variant: 'ghost' }
    );
    // selettore percorso/missione (demo → lab → full → advanced)
    const missLabel = (): string => L().ui.missions.modes[StateManager.mission].name.toUpperCase();
    const missBtn = new Button(
      this,
      x - 90,
      324,
      missLabel(),
      () => {
        const next = MISSION_IDS[(MISSION_IDS.indexOf(StateManager.mission) + 1) % MISSION_IDS.length];
        StateManager.setMission(next);
        missBtn.setLabel(missLabel());
      },
      { width: 160, height: 34, fontSize: 11, variant: 'ghost' }
    );
  }

  private startGame(isNew: boolean): void {
    AudioSystem.init();
    AudioSystem.confirm();
    AnalyticsSystem.track('game_started', { language: StateManager.language });
    StateManager.markStarted();
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

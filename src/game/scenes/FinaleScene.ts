import Phaser from 'phaser';
import { computeEnding } from '../data/endings';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { IndicatorHud } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { SelfCheckOverlay } from '../ui/SelfCheckOverlay';
import { TypewriterText } from '../ui/TypewriterText';
import { L } from '../i18n';
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

    const endingId = computeEnding(StateManager.indicators);
    const ending = L().endings[endingId];
    StateManager.setEnding(endingId);
    AnalyticsSystem.track('ending_reached', { ending: endingId, completedCasesCount: StateManager.completedCount() });
    AnalyticsSystem.track('game_completed', {
      ending: endingId,
      completedCasesCount: StateManager.completedCount(),
      unlockedNormsCount: StateManager.unlockedNorms.length,
      musicEnabled: StateManager.musicVolume > 0,
      reducedMotion: StateManager.reducedMotion,
      language: StateManager.language
    });
    AudioSystem.stopLevelTheme();
    if (endingId === 'ending_opaca') AudioSystem.error();
    else if (endingId === 'ending_governata') AudioSystem.unlock();
    else AudioSystem.alert();

    const titleColor =
      endingId === 'ending_governata' ? COLOR_STR.ok : endingId === 'ending_opaca' ? COLOR_STR.alertText : COLOR_STR.warning;

    this.add.text(cx, 70, L().ui.finale.header, textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 110, ending.title, textStyle(28, titleColor, { fontStyle: 'bold' })).setOrigin(0.5);

    new Panel(this, cx - 180, 300, 640, 260);
    const body = new TypewriterText(this, cx - 480, 200, 15, COLOR_STR.paper, 600);
    body.write(ending.text);
    this.input.on('pointerdown', () => body.skip());

    // stato finale degli indicatori
    this.add.rectangle(cx + 340, 290, 320, 230, COLORS.carbon, 0.85).setStrokeStyle(1, COLORS.iron);
    this.add.text(cx + 200, 190, L().ui.finale.cityLabel, textStyle(12, COLOR_STR.paperDim));
    new IndicatorHud(this, cx + 200, 214, 270);

    // messaggio finale obbligatorio
    const msg = this.add
      .text(cx, 510, `“${L().endings.finalMessage}”`, textStyle(16, COLOR_STR.accent, { wordWrap: { width: 880 }, align: 'center', lineSpacing: 6 }))
      .setOrigin(0.5)
      .setAlpha(0);
    this.tweens.add({ targets: msg, alpha: 1, duration: 900, delay: StateManager.reducedMotion ? 0 : 1500 });

    new Button(this, cx - 220, GAME_HEIGHT - 60, L().ui.finale.newGame, () => {
      StateManager.newGame();
      StateManager.markStarted();
      this.scene.start('Briefing');
    });
    new Button(this, cx + 70, GAME_HEIGHT - 60, L().ui.finale.archive, () => this.scene.start('Archive', { from: 'Finale' }), { variant: 'ghost' });
    new Button(this, cx + 330, GAME_HEIGHT - 60, L().ui.finale.credits, () => this.scene.start('Credits'), { width: 180, variant: 'ghost' });
    // rapporto di apprendimento (v1.1): per tutti, non solo per i docenti
    const lrX = StateManager.teacherMode ? cx - 170 : cx;
    new Button(this, lrX, GAME_HEIGHT - 118, L().ui.finale.learningReport, () => this.scene.start('LearningReport'), { width: 320, variant: 'ok' });
    if (StateManager.teacherMode) {
      new Button(this, cx + 170, GAME_HEIGHT - 118, L().ui.finale.debrief, () => this.scene.start('Debrief'), { width: 300, variant: 'ok' });
    }
    // autocontrollo finale 2.0: facoltativo, locale; confronto col pre se esiste
    const postCheck = new SelfCheckOverlay(this, 'post');
    new Button(this, cx + 430, GAME_HEIGHT - 118, L().learningLayer.selfCheck.buttonPost, () => postCheck.open(), { width: 220, height: 36, fontSize: 11, variant: 'ghost' });

    // Nota privacy statica, non interattiva: questa versione non incorpora
    // moduli esterni e non raccoglie feedback o dati — niente pulsanti, niente
    // link, nessuna trasmissione. Sostituisce il vecchio CTA verso il modulo
    // esterno, rimosso dal prodotto pubblico.
    const privacy = L().ui.finale.privacyNote;
    const fbLeft = cx - 570;
    this.add.text(fbLeft, 540, privacy.title, textStyle(13, COLOR_STR.accent, { fontStyle: 'bold' }));
    this.add.text(fbLeft, 562, privacy.text, textStyle(11, COLOR_STR.paperDim, { wordWrap: { width: 410 }, lineSpacing: 3 }));
  }
}

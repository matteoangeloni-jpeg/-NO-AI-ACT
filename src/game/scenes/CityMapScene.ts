import Phaser from 'phaser';
import { CASES_REQUIRED_FOR_FINALE, LOCATIONS, PLAYABLE_CASES, getCase } from '../data/cases';
import { isRecommended } from '../data/missions';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { IndicatorHud } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { ChaptersOverlay } from '../ui/ChaptersOverlay';
import { showToast } from '../ui/AlertToast';
import { L, fmt, locationName } from '../i18n';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

export class CityMapScene extends Phaser.Scene {
  constructor() {
    super('CityMap');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(300, 0, 0, 0);
    AnalyticsSystem.page('map');
    AudioSystem.crossfadeToTheme('city'); // no-op se già attivo
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'citymap');
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.6);

    // header istituzionale
    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, COLORS.carbon, 0.85);
    this.add.text(24, 18, L().ui.map.header, textStyle(15, COLOR_STR.paper));
    this.add.text(
      24,
      40,
      fmt(L().ui.map.progress, { done: StateManager.completedCount(), total: PLAYABLE_CASES.length }),
      textStyle(12, COLOR_STR.paperDim)
    );

    // HUD indicatori
    this.add.rectangle(GAME_WIDTH - 150, 150, 290, 190, COLORS.carbon, 0.8).setStrokeStyle(1, COLORS.iron);
    new IndicatorHud(this, GAME_WIDTH - 280, 72, 250);

    for (const loc of LOCATIONS) this.buildMarker(loc.id);

    // pulsanti di servizio
    new Button(this, 110, GAME_HEIGHT - 36, L().ui.menu.archive, () => this.scene.start('Archive', { from: 'CityMap' }), { width: 190, height: 38, fontSize: 12, variant: 'ghost' });
    new Button(this, 310, GAME_HEIGHT - 36, L().ui.map.menuButton, () => this.scene.start('Title'), { width: 120, height: 38, fontSize: 12, variant: 'ghost' });
    // capitoli 2.0: panoramica read-only, la selezione libera resta invariata
    const chapters = new ChaptersOverlay(this);
    new Button(this, 470, GAME_HEIGHT - 36, L().learningLayer.chapters.button, () => chapters.toggle(), { width: 160, height: 38, fontSize: 12, variant: 'ghost' });

    if (StateManager.completedCount() >= CASES_REQUIRED_FOR_FINALE) {
      new Button(this, GAME_WIDTH - 170, GAME_HEIGHT - 40, L().ui.map.finaleButton, () => {
        AudioSystem.alert();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Finale'));
      }, { width: 260, variant: 'danger' });
      // avvisa solo finché il rapporto non è mai stato generato
      if (StateManager.endingId === null) {
        showToast(this, L().ui.map.finaleReadyToast, 'warning');
      }
    }
  }

  private buildMarker(locationId: string): void {
    const loc = LOCATIONS.find((l) => l.id === locationId)!;
    const x = loc.x * GAME_WIDTH;
    const y = loc.y * GAME_HEIGHT;
    const caseData = loc.caseId ? getCase(loc.caseId) : null;
    const quality = caseData ? StateManager.caseQuality(caseData.id) : undefined;
    const completed = quality !== undefined;
    const playable = !!caseData?.playable && !completed;
    const nonConforme = quality === 'wrong';

    const container = this.add.container(x, y);
    const ringColor = nonConforme ? COLORS.warning : completed ? COLORS.ok : playable ? COLORS.alert : COLORS.iron;
    const ring = this.add.circle(0, 0, 26, COLORS.carbon, 0.85).setStrokeStyle(2, ringColor);
    const icon = this.add.image(0, 0, loc.iconKey).setDisplaySize(28, 28).setAlpha(playable || completed ? 1 : 0.5);
    const nameTag = this.add
      .text(0, 42, locationName(loc.id).toUpperCase(), textStyle(12, completed ? (nonConforme ? COLOR_STR.warning : COLOR_STR.ok) : COLOR_STR.paper, { align: 'center' }))
      .setOrigin(0.5);
    const statusLabel = nonConforme
      ? L().ui.map.statusNonCompliant
      : completed
        ? L().ui.map.statusClosed
        : playable
          ? L().ui.map.statusOpen
          : L().ui.map.statusSealed;
    const statusColor = nonConforme
      ? COLOR_STR.warning
      : completed
        ? COLOR_STR.ok
        : playable
          ? COLOR_STR.alertText
          : COLOR_STR.paperDim;
    const statusTag = this.add
      .text(0, 58, statusLabel, textStyle(12, statusColor))
      .setOrigin(0.5);
    container.add([ring, icon, nameTag, statusTag]);

    // evidenzia i casi consigliati dalla missione corrente (non blocca gli altri)
    if (caseData && playable && isRecommended(StateManager.mission, caseData.id)) {
      const rec = this.add.text(0, 74, `★ ${L().ui.missions.recommendedTag}`, textStyle(11, COLOR_STR.accent)).setOrigin(0.5);
      container.add(rec);
      ring.setStrokeStyle(2, COLORS.accent);
    }

    // pulsazione dei casi aperti
    if (playable && !StateManager.reducedMotion) {
      const pulse = this.add.circle(x, y, 26).setStrokeStyle(2, COLORS.alert, 0.8);
      this.tweens.add({ targets: pulse, scale: 1.6, alpha: 0, duration: 1500, repeat: -1 });
    }

    container.setSize(60, 60);
    container.setInteractive({ useHandCursor: playable })
      .on('pointerover', () => ring.setStrokeStyle(3, playable ? COLORS.accent : ringColor))
      .on('pointerout', () => ring.setStrokeStyle(2, ringColor))
      .on('pointerdown', () => {
        AudioSystem.init();
        if (!caseData) return;
        if (completed) {
          showToast(this, fmt(L().ui.map.alreadyClosedToast, { code: caseData.fileCode }), 'ok');
          return;
        }
        if (!caseData.playable) {
          AudioSystem.error();
          showToast(this, L().ui.map.sealedToast, 'warning');
          return;
        }
        AudioSystem.confirm();
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Case', { caseId: caseData.id }));
      });
  }
}

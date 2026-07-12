import Phaser from 'phaser';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { TeacherGuideOverlay } from '../ui/TeacherGuideOverlay';
import { SiteResourcesOverlay } from '../ui/SiteResourcesOverlay';
import { showToast } from '../ui/AlertToast';
import { L, fmt, nextLanguage } from '../i18n';
import { MISSION_IDS } from '../data/missions';
import type { DifficultyMode } from '../data/types';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { footerBaselineY, layoutVStack } from '../ui/layout';

/**
 * Schermata titolo "player-first": due azioni primarie (CONTINUA / NUOVA
 * PARTITA) e tre gruppi secondari (DOCENTI E CLASSE / RISORSE / IMPOSTAZIONI)
 * aperti come pannelli modali. Il RESET del salvataggio non è più un'azione di
 * primo livello: vive dentro Impostazioni e richiede una conferma esplicita.
 * Nessun modulo esterno, nessun link di feedback: tutto resta locale.
 */
export class TitleScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private glitchTimer?: Phaser.Time.TimerEvent;
  /** Pannello di gruppo aperto (al massimo uno alla volta). */
  private group?: Phaser.GameObjects.Container;

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
    // micro-framing (< 10 secondi): ruolo, effetto delle scelte, obiettivo
    this.add
      .text(cx, 318, L().ui.titleTagline, textStyle(13, COLOR_STR.paper, { wordWrap: { width: 940 }, align: 'center', lineSpacing: 4 }))
      .setOrigin(0.5)
      .setAlpha(0.9);

    if (!StateManager.reducedMotion) {
      this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
    }

    const hasSave = SaveSystem.hasSave();
    const showContinue = hasSave && StateManager.completedCount() > 0;
    // Il giocatore non resta mai intrappolato nel gioco: le risorse del sito
    // restano raggiungibili dal pannello RISORSE tramite questo overlay.
    const siteLinks = new SiteResourcesOverlay(this);
    const guide = new TeacherGuideOverlay(this);

    // Azioni primarie (gioco) + gruppi secondari (pannelli). Le y sono
    // calcolate da layoutVStack: nessuna coordinata hardcoded che possa
    // sovrapporsi al disclaimer, con o senza CONTINUA.
    const PRIMARY_H = 48;
    const GROUP_H = 44;
    const m = L().ui.menu;
    const specs: Array<{ height: number; build: (y: number) => void }> = [];
    if (showContinue) {
      specs.push({ height: PRIMARY_H, build: (y) => new Button(this, cx, y, m.continue, () => this.startGame(false)) });
    }
    specs.push({ height: PRIMARY_H, build: (y) => new Button(this, cx, y, m.newGame, () => {
      if (hasSave) StateManager.newGame();
      this.startGame(true);
    }) });
    specs.push({ height: GROUP_H, build: (y) => new Button(this, cx, y, m.teachers, () => this.openTeachers(guide), { height: GROUP_H, fontSize: 14, variant: 'ghost' }) });
    specs.push({ height: GROUP_H, build: (y) => new Button(this, cx, y, m.resources, () => this.openResources(siteLinks), { height: GROUP_H, fontSize: 14, variant: 'ghost' }) });
    specs.push({ height: GROUP_H, build: (y) => new Button(this, cx, y, m.settings, () => this.openSettings(), { height: GROUP_H, fontSize: 14, variant: 'ghost' }) });

    const footerY = footerBaselineY();
    const ys = layoutVStack({
      heights: specs.map((s) => s.height),
      top: 352,
      bottom: footerY - 22, // lascia sempre spazio libero sopra il disclaimer
      preferredGap: 14,
      minGap: 6
    });
    specs.forEach((s, i) => s.build(ys[i]));

    this.add
      .text(cx, footerY, L().ui.footerDisclaimer, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);
  }

  // ------------------------- pannelli di gruppo -------------------------

  private closeGroup(): void {
    this.input.keyboard?.off('keydown-ESC', this.escHandler);
    this.group?.destroy();
    this.group = undefined;
  }

  private readonly escHandler = (): void => this.closeGroup();

  /** Fondale + pannello + titolo + CHIUDI. Un solo pannello aperto alla volta. */
  private openPanel(title: string, panelH: number): Phaser.GameObjects.Container {
    this.closeGroup();
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const panelW = 840;
    const c = this.add.container(0, 0).setDepth(80);
    c.add(this.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setInteractive().on('pointerdown', () => this.closeGroup()));
    c.add(new Panel(this, cx, cy, panelW, panelH));
    c.add(this.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());
    c.add(this.add.text(cx - panelW / 2 + 40, cy - panelH / 2 + 26, title, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' })));
    c.add(new Button(this, cx, cy + panelH / 2 - 38, L().ui.titleGroups.close, () => this.closeGroup(), { width: 220, height: 40, fontSize: 13 }));
    this.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.group = c;
    return c;
  }

  /** IMPOSTAZIONI: preferenze locali + gestione salvataggio (reset con conferma). */
  private openSettings(): void {
    const g = L().ui.titleGroups;
    const m = L().ui.menu;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const c = this.openPanel(g.settingsTitle, 500);
    const colL = cx - 190;
    const colR = cx + 190;
    const BW = 360;
    const rowY = (r: number): number => cy - 250 + 78 + r * 52;

    const audioBtn = new Button(this, colL, rowY(0), StateManager.audioMuted ? m.audioOff : m.audioOn, () => {
      AudioSystem.init();
      const muted = AudioSystem.toggleMute();
      audioBtn.setLabel(muted ? m.audioOff : m.audioOn);
    }, { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    const musicLabel = (): string => fmt(m.music, { value: `${Math.round(StateManager.musicVolume * 100)}%` });
    const musicBtn = new Button(this, colR, rowY(0), musicLabel(), () => {
      AudioSystem.init();
      // cicla 100% → 50% → 0% → 100%
      const next = StateManager.musicVolume > 0.75 ? 0.5 : StateManager.musicVolume > 0.25 ? 0 : 1;
      AudioSystem.setMusicVolume(next);
      musicBtn.setLabel(musicLabel());
    }, { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    const motionBtn = new Button(this, colL, rowY(1), StateManager.reducedMotion ? m.motionReduced : m.motionFull, () => {
      StateManager.setReducedMotion(!StateManager.reducedMotion);
      motionBtn.setLabel(StateManager.reducedMotion ? m.motionReduced : m.motionFull);
      if (StateManager.reducedMotion) this.glitchTimer?.remove();
      else this.glitchTimer = this.time.addEvent({ delay: 2600, loop: true, callback: () => this.glitch() });
    }, { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    const crtBtn = new Button(this, colR, rowY(1), StateManager.crtOverlay ? m.crtOn : m.crtOff, () => {
      StateManager.setCrtOverlay(!StateManager.crtOverlay);
      crtBtn.setLabel(StateManager.crtOverlay ? m.crtOn : m.crtOff);
    }, { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    // selettore lingua: cicla le lingue registrate e ricarica la scena
    const langBtn = new Button(this, colL, rowY(2), m.language, () => {
      StateManager.setLanguage(nextLanguage());
      AnalyticsSystem.track('language_selected', { language: StateManager.language });
      this.scene.restart();
    }, { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    // selettore difficoltà (base → standard → expert)
    const diffOrder: DifficultyMode[] = ['base', 'standard', 'expert'];
    const diffLabel = (): string => fmt(L().ui.difficulty.label, { value: L().ui.difficulty.modes[StateManager.difficulty].name });
    const diffBtn = new Button(this, colR, rowY(2), diffLabel(), () => {
      const next = diffOrder[(diffOrder.indexOf(StateManager.difficulty) + 1) % diffOrder.length];
      StateManager.setDifficulty(next);
      diffBtn.setLabel(diffLabel());
    }, { width: BW, height: 44, fontSize: 12, variant: 'ghost' });

    // selettore percorso/missione (demo → lab → full → advanced)
    const missLabel = (): string => L().ui.missions.modes[StateManager.mission].name.toUpperCase();
    const missBtn = new Button(this, colL, rowY(3), missLabel(), () => {
      const next = MISSION_IDS[(MISSION_IDS.indexOf(StateManager.mission) + 1) % MISSION_IDS.length];
      StateManager.setMission(next);
      missBtn.setLabel(missLabel());
    }, { width: BW, height: 44, fontSize: 12, variant: 'ghost' });

    // RESET SALVATAGGIO: azione distruttiva, MAI di primo livello. Doppio
    // click esplicito: il primo chiede conferma, il secondo azzera.
    let armed = false;
    const resetBtn = new Button(this, colR, rowY(3), m.reset, () => {
      if (!armed) {
        armed = true;
        resetBtn.setLabel(m.resetConfirm);
        return;
      }
      AnalyticsSystem.track('reset_game');
      StateManager.newGame();
      showToast(this, L().ui.menu.resetDone, 'warning');
      // lascia il tempo di leggere il toast prima che il restart lo distrugga
      this.time.delayedCall(900, () => this.scene.restart());
    }, { width: BW, height: 44, fontSize: 13, variant: 'danger' });

    // nota privacy locale, concisa
    const note = this.add.text(cx - 380, rowY(3) + 44, g.settingsPrivacy, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: 760 }, lineSpacing: 3 }));
    c.add([audioBtn, musicBtn, motionBtn, crtBtn, langBtn, diffBtn, missBtn, resetBtn, note]);
  }

  /** DOCENTI E CLASSE: modalità docente + guida, tutto locale. */
  private openTeachers(guide: TeacherGuideOverlay): void {
    const g = L().ui.titleGroups;
    const m = L().ui.menu;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const c = this.openPanel(g.teachersTitle, 380);
    const note = this.add.text(cx - 380, cy - 190 + 66, g.teachersNote, textStyle(12.5, COLOR_STR.paperDim, { wordWrap: { width: 760 }, lineSpacing: 4 }));

    const teacherBtn = new Button(this, cx - 190, cy - 8, StateManager.teacherMode ? m.teacherOn : m.teacherOff, () => {
      StateManager.setTeacherMode(!StateManager.teacherMode);
      teacherBtn.setLabel(StateManager.teacherMode ? m.teacherOn : m.teacherOff);
      // chiarisce subito che la modalità docente è un supporto locale, non una dashboard classe
      if (StateManager.teacherMode) showToast(this, m.teacherScope, 'info');
    }, { width: 360, height: 46, fontSize: 13, variant: 'ghost' });

    // guida docente (prima/durante/dopo la lezione), sopra il pannello (depth 90)
    const guideBtn = new Button(this, cx + 190, cy - 8, L().ui.teacherGuide.button, () => guide.toggle(), { width: 360, height: 46, fontSize: 12, variant: 'ok' });
    c.add([note, teacherBtn, guideBtn]);
  }

  /** RISORSE: archivio e glossario del gioco + guide del sito. */
  private openResources(siteLinks: SiteResourcesOverlay): void {
    const g = L().ui.titleGroups;
    const m = L().ui.menu;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const c = this.openPanel(g.resourcesTitle, 400);
    const note = this.add.text(cx - 380, cy - 200 + 62, g.resourcesNote, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 760 }, lineSpacing: 3 }));

    const items: Array<{ label: string; go: () => void }> = [
      { label: m.archive, go: () => this.scene.start('Archive', { from: 'Title' }) },
      { label: L().glossary.title, go: () => this.scene.start('Glossary', { from: 'Title' }) },
      { label: m.credits, go: () => this.scene.start('Credits') },
      // sito e risorse educative: overlay esistente, sopra il pannello (depth 90)
      { label: L().ui.siteLinks.button, go: () => siteLinks.toggle() }
    ];
    const built = items.map((it, i) => {
      const bx = cx - 190 + (i % 2) * 380;
      const by = cy - 42 + Math.floor(i / 2) * 58;
      return new Button(this, bx, by, it.label, it.go, { width: 360, height: 46, fontSize: 13, variant: 'ghost' });
    });
    c.add([note, ...built]);
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

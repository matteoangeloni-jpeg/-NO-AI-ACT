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
import { AUDIENCE_IDS, SESSION_DURATIONS } from '../data/audiences';
import { GAME_MODE_IDS, getGameMode } from '../data/gameModes';
import { ReadingLayer } from '../systems/ReadingLayer';
import type { DifficultyMode } from '../data/types';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { footerBaselineY, layoutVStack } from '../ui/layout';
import { fadeOutScene } from '../ui/motion';
import { addNoiseOverlay } from '../ui/backdrop';

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
    this.add.image(cx, GAME_HEIGHT / 2, 'citymap').setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.25);
    addNoiseOverlay(this, 0.5);

    this.add.text(cx, 150, L().ui.titleHeader, textStyle(13, COLOR_STR.paperDim)).setOrigin(0.5);
    this.titleText = this.add.text(cx, 220, L().ui.gameTitle, textStyle(76, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, 285, L().ui.gameSubtitle, textStyle(18, COLOR_STR.accentText)).setOrigin(0.5);
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
    // NUOVA PARTITA non parte più al primo clic: apre la scelta della
    // modalità. Il pubblico e la durata vivono lì dentro, dove servono,
    // invece che in una voce di menu a parte che nessuno collegava alla
    // partita che stava per cominciare.
    specs.push({ height: PRIMARY_H, build: (y) => new Button(this, cx, y, m.newGame, () => this.openNewGame(hasSave)) });
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
    c.add(this.add.text(cx - panelW / 2 + 40, cy - panelH / 2 + 26, title, textStyle(18, COLOR_STR.accentText, { fontStyle: 'bold' })));
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

    // Il percorso NON si sceglie più qui: la composizione della sessione —
    // modalità, profilo, durata — vive tutta dentro NUOVA PARTITA, dove il
    // giocatore vede subito quanti fascicoli ne escono. Lasciarne una copia
    // nelle impostazioni significava avere due manopole per la stessa cosa,
    // e una delle due non veniva letta da chi premeva NUOVA PARTITA.

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

    // Crediti: stanno qui e non fra le risorse, perché riguardano chi firma il
    // progetto, non il materiale didattico a cui il giocatore attinge.
    const creditsBtn = new Button(this, colL, rowY(3), m.credits, () => this.scene.start('Credits'),
      { width: BW, height: 44, fontSize: 13, variant: 'ghost' });

    // nota privacy locale, concisa
    const note = this.add.text(cx - 380, rowY(4), g.settingsPrivacy, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: 760 }, lineSpacing: 3 }));
    c.add([audioBtn, musicBtn, motionBtn, crtBtn, langBtn, diffBtn, resetBtn, creditsBtn, note]);
  }

  /**
   * NUOVA PARTITA: modalità, profilo, durata — e il piano che ne esce,
   * scritto sotto prima di premere INIZIA.
   *
   * È l'unico posto in cui si compone una sessione. Prima la scelta era
   * sparsa fra una voce di menu ("per chi giochi") e due selettori dentro
   * le impostazioni, e NUOVA PARTITA ignorava tutti e tre: si poteva girare
   * la durata su 90 minuti e cominciare una partita identica a quella da 15.
   *
   * La riga di riepilogo si ricalcola a ogni scatto, così chi sceglie vede
   * quanti fascicoli riceve invece di scoprirlo giocando.
   */
  private openNewGame(hasSave: boolean): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const g = L().ui.newGamePanel;
    const a = L().ui.audience;
    const PANEL_H = 560;
    // Posizioni verticali del pannello, relative al suo bordo alto. Stanno
    // qui e non sparse fra le chiamate perché il profilo compare e scompare
    // a seconda della modalità, e i due casi devono restare pettinati
    // tutti e due.
    const AUDIENCE_Y = 218;
    const DURATION_Y_WITH_AUDIENCE = 274;
    const DURATION_Y_ALONE = 246;
    const PLAN_Y = 322;
    const WARN_Y = 348;
    const ACTIONS_Y = 452;
    const c = this.openPanel(g.title, PANEL_H);
    const top = cy - PANEL_H / 2;
    const W = 760;

    const sub = this.add.text(cx - W / 2, top + 60, g.subtitle, textStyle(12.5, COLOR_STR.paperDim, { wordWrap: { width: W }, lineSpacing: 4 }));
    const desc = this.add.text(cx - W / 2, top + 148, '', textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: W }, lineSpacing: 3 }));
    const planText = this.add.text(cx - W / 2, top + PLAN_Y, '', textStyle(13, COLOR_STR.accentText, { wordWrap: { width: W }, lineSpacing: 4 }));
    const warnText = this.add.text(cx - W / 2, top + WARN_Y, '', textStyle(12, COLOR_STR.warning, { wordWrap: { width: W }, lineSpacing: 4 }));
    const note = this.add.text(cx - W / 2, top + 380, g.note, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: W }, lineSpacing: 3 }));

    const modeBtn = new Button(this, cx, top + 112, '', () => {
      const next = GAME_MODE_IDS[(GAME_MODE_IDS.indexOf(StateManager.gameMode) + 1) % GAME_MODE_IDS.length];
      StateManager.setGameMode(next);
      refresh();
    }, { width: W, height: 46, fontSize: 13, variant: 'ghost' });

    const audBtn = new Button(this, cx, top + AUDIENCE_Y, '', () => {
      const next = AUDIENCE_IDS[(AUDIENCE_IDS.indexOf(StateManager.audience) + 1) % AUDIENCE_IDS.length];
      StateManager.setAudience(next);
      refresh();
    }, { width: W, height: 44, fontSize: 13, variant: 'ghost' });

    const durBtn = new Button(this, cx, top + DURATION_Y_WITH_AUDIENCE, '', () => {
      const next = SESSION_DURATIONS[(SESSION_DURATIONS.indexOf(StateManager.sessionMinutes) + 1) % SESSION_DURATIONS.length];
      StateManager.setSessionMinutes(next);
      refresh();
    }, { width: W, height: 44, fontSize: 13, variant: 'ghost' });

    // Riestrai vale solo per l'ispezione a sorpresa: senza, il seme resterebbe
    // lo stesso per tutta la sessione e la sorpresa sarebbe una sola.
    const rerollBtn = new Button(this, cx - 250, top + ACTIONS_Y, g.reroll, () => {
      StateManager.rerollSurprise();
      refresh();
    }, { width: 240, height: 46, fontSize: 13, variant: 'ghost' });

    const startBtn = new Button(this, cx, top + ACTIONS_Y, g.start, () => this.startPlanned(hasSave), { width: W, height: 48, fontSize: 14 });

    const refresh = (): void => {
      const plan = StateManager.gamePlan;
      const mode = getGameMode(plan.mode);
      modeBtn.setLabel(fmt(g.modeLabel, { value: g.modes[plan.mode].name }));
      desc.setText(g.modes[plan.mode].desc);

      // Il profilo compare solo dove conta davvero. Quando non conta, la
      // durata sale al suo posto: un pulsante nascosto non deve lasciare
      // un buco nel pannello.
      audBtn.setVisible(mode.usesAudience);
      audBtn.setLabel(fmt(g.audienceLabel, { value: a.modes[StateManager.audience].name }));
      // senza il profilo la durata scivola al centro dello spazio libero:
      // un pulsante nascosto non deve lasciare un buco nel pannello
      durBtn.setY(top + (mode.usesAudience ? DURATION_Y_WITH_AUDIENCE : DURATION_Y_ALONE));
      durBtn.setLabel(fmt(g.durationLabel, { value: String(StateManager.sessionMinutes) }));

      const showReroll = plan.mode === 'sorpresa';
      rerollBtn.setVisible(showReroll);
      startBtn.setButtonWidth(showReroll ? 480 : W);
      startBtn.setX(showReroll ? cx + 140 : cx);

      if (plan.unavailable === 'nothingToReview') {
        // senza riga di piano l'avviso sale al suo posto, invece di lasciare
        // un vuoto in mezzo al pannello
        planText.setText('');
        warnText.setY(top + PLAN_Y);
        warnText.setText(g.nothingToReview);
        startBtn.setEnabled(false);
      } else {
        // "1 fascicoli" non lo scrive nessuno: il singolare ha una riga sua.
        const one = plan.caseIds.length === 1;
        const line = plan.freeMap
          ? one ? g.planLineFreeOne : g.planLineFree
          : one ? g.planLineOne : g.planLine;
        planText.setText(
          fmt(line, {
            count: String(plan.caseIds.length),
            minutes: String(plan.estimatedMinutes),
            difficulty: L().ui.difficulty.modes[plan.difficulty].name
          })
        );
        warnText.setY(top + WARN_Y);
        warnText.setText(plan.overBudget ? fmt(g.overBudget, { minutes: String(plan.estimatedMinutes) }) : '');
        startBtn.setEnabled(true);
      }
      ReadingLayer.announce(`${modeBtn.labelText} · ${planText.text} ${warnText.text}`.trim());
    };

    refresh();
    c.add([sub, modeBtn, desc, audBtn, durBtn, planText, warnText, note, rerollBtn, startBtn]);
  }

  /**
   * Avvia la sessione composta nel pannello. Il briefing resta la porta
   * d'ingresso di chi non l'ha mai visto: una modalità non può saltare la
   * spiegazione di che cosa fa un ispettore.
   */
  private startPlanned(hasSave: boolean): void {
    const plan = StateManager.gamePlan;
    if (plan.unavailable) return;
    if (hasSave) StateManager.newGame();
    StateManager.rerollSurprise();
    this.closeGroup();
    AudioSystem.init();
    AudioSystem.confirm();
    AnalyticsSystem.track('game_started', { language: StateManager.language });
    StateManager.markStarted();
    fadeOutScene(this, 300, () => {
      if (!StateManager.briefingSeen) this.scene.start('Briefing');
      else if (plan.freeMap || plan.caseIds.length === 0) this.scene.start('CityMap');
      else this.scene.start('Case', { caseId: plan.caseIds[0] });
    });
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
    fadeOutScene(this, 300, () => {
      if (isNew || !StateManager.briefingSeen) this.scene.start('Briefing');
      else this.scene.start('CityMap');
    });
  }

  /**
   * Glitch del titolo: brevi offset orizzontali e cambio colore.
   *
   * Usa le varianti chiare anche qui. Il titolo è a 76px, quindi la tinta
   * piena reggerebbe la soglia del testo grande — ma tenere una sola regola
   * ("le tinte piene non sono colori di testo") vale più della sfumatura di
   * un lampo da 60 ms, e permette al controllo sul contrasto di non dover
   * conoscere il corpo di ogni scritta raggiunta per via indiretta.
   */
  private glitch(): void {
    const original = this.titleText.x;
    this.titleText.setColor(COLOR_STR.alertText);
    this.titleText.setX(original + Phaser.Math.Between(-6, 6));
    this.time.delayedCall(60, () => {
      this.titleText.setColor(COLOR_STR.accentText);
      this.titleText.setX(original + Phaser.Math.Between(-3, 3));
    });
    this.time.delayedCall(120, () => {
      this.titleText.setColor(COLOR_STR.paper);
      this.titleText.setX(original);
    });
  }
}

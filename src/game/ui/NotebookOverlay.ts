import Phaser from 'phaser';
import { buildNotebook } from '../systems/InvestigationNotebook';
import { StateManager } from '../systems/StateManager';
import { ReadingLayer } from '../systems/ReadingLayer';
import { Button } from './Button';
import { Panel } from './Panel';
import { L, caseText, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Taccuino investigativo (2.1 — roadmap Phase 2 §7), aperto dalla mappa.
 *
 * SOLO lettura: raccoglie fascicoli chiusi, ricorrenze dei soggetti
 * responsabili, questioni lasciate aperte e schemi confermati per capitolo.
 * Non modifica nulla e non tocca il punteggio.
 */
export class NotebookOverlay {
  private container?: Phaser.GameObjects.Container;

  constructor(private readonly scene: Phaser.Scene) {}

  get isOpen(): boolean {
    return !!this.container;
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  close(): void {
    this.scene.input.keyboard?.off('keydown-ESC', this.escHandler);
    this.container?.destroy();
    this.container = undefined;
  }

  private readonly escHandler = (): void => this.close();

  open(): void {
    if (this.isOpen) return;
    const t = L().learningLayer.notebook;
    const nb = buildNotebook(StateManager.caseReports, StateManager.caseMeta, StateManager.unlockedNorms);
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const container = this.scene.add.container(0, 0).setDepth(90);
    container.add(this.scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setInteractive().on('pointerdown', () => this.close()));

    const panelW = 1120;
    const panelH = 620;
    container.add(new Panel(this.scene, cx, cy, panelW, panelH));
    container.add(this.scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 36;
    const wrap = panelW - 100;
    let y = cy - panelH / 2 + 24;
    const heading = (text: string): void => {
      container.add(this.scene.add.text(left, y, text, textStyle(13, COLOR_STR.accent, { fontStyle: 'bold' })));
      y += 22;
    };
    const line = (text: string, color: string = COLOR_STR.paper, size = 11.5): void => {
      const o = this.scene.add.text(left, y, text, textStyle(size, color, { wordWrap: { width: wrap }, lineSpacing: 3 }));
      container.add(o);
      y += o.height + 4;
    };

    container.add(this.scene.add.text(left, y, t.title, textStyle(18, COLOR_STR.paper, { fontStyle: 'bold' })));
    y += 30;
    line(t.intro, COLOR_STR.paperDim);
    y += 12;

    // --- fascicoli chiusi -------------------------------------------------
    heading(fmt(t.factsLabel, { n: nb.facts.length }));
    if (nb.facts.length === 0) {
      line(t.factsEmpty, COLOR_STR.paperDim);
    } else {
      for (const f of nb.facts) {
        const evidence = fmt(t.evidenceLine, { cited: f.decisiveCited, total: f.decisiveTotal });
        const trap = f.spottedTrap ? ` · ${t.trapSpotted}` : '';
        line(`${caseText(f.caseId).title} — ${L().ui.outcomes[f.outcome]} · ${evidence}${trap}`);
      }
    }
    y += 10;

    // --- soggetti ricorrenti ---------------------------------------------
    heading(t.actorsLabel);
    if (nb.actors.length === 0) line(t.actorsEmpty, COLOR_STR.paperDim);
    else line(nb.actors.map((a) => `${L().ui.subjects[a.subject]} × ${a.timesChosen}`).join('   ·   '));
    y += 10;

    // --- schemi confermati per capitolo (verifica differita, §10) --------
    heading(t.patternsLabel);
    const defs = L().learningLayer.chapters.defs as Record<string, { title: string }>;
    for (const p of nb.patterns) {
      const label = defs[p.chapterId]?.title ?? p.chapterId;
      const status = p.confirmed ? t.patternConfirmed : fmt(t.patternProgress, { done: p.done, total: p.total });
      line(`${label} — ${status}`, p.confirmed ? COLOR_STR.ok : COLOR_STR.paperDim);
    }
    y += 10;

    // --- questioni aperte -------------------------------------------------
    heading(t.openLabel);
    if (nb.openQuestions.length === 0) {
      line(t.openEmpty, COLOR_STR.paperDim);
    } else {
      const reasons = t.openReasons as Record<string, string>;
      for (const q of nb.openQuestions) line(`${caseText(q.caseId).title} — ${reasons[q.reason]}`, COLOR_STR.warning);
    }

    container.add(new Button(this.scene, cx, cy + panelH / 2 - 32, t.close, () => this.close(), { width: 200, height: 38, fontSize: 13 }));
    ReadingLayer.announce(fmt(t.announce, { n: nb.facts.length, open: nb.openQuestions.length }));
    this.scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

import Phaser from 'phaser';
import { CHAPTERS, chapterProgress } from '../data/chapters';
import { StateManager } from '../systems/StateManager';
import { Button } from './Button';
import { Panel } from './Panel';
import { L, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Panoramica dei capitoli (2.0 — mission §10.2), aperta dalla mappa.
 *
 * SOLO lettura: mostra introduzioni, obiettivi, ordine consigliato, durata
 * stimata e stato di completamento; quando un capitolo è completo appare il
 * suo debrief. Non blocca né avvia nulla: la selezione libera dei casi dalla
 * mappa resta invariata (modalità docente preservata).
 */
export class ChaptersOverlay {
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
    const t = L().learningLayer.chapters;
    const objectives = L().learningLayer.objectives as Record<string, string>;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const container = this.scene.add.container(0, 0).setDepth(90);
    container.add(this.scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85).setInteractive().on('pointerdown', () => this.close()));

    const panelW = 1120;
    const panelH = 620;
    container.add(new Panel(this.scene, cx, cy, panelW, panelH));
    container.add(this.scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 36;
    let y = cy - panelH / 2 + 24;
    container.add(this.scene.add.text(left, y, t.title, textStyle(18, COLOR_STR.paper, { fontStyle: 'bold' })));
    y += 30;
    container.add(this.scene.add.text(left, y, t.intro, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: panelW - 72 }, lineSpacing: 3 })));
    y += 44;

    const progress = chapterProgress(StateManager.completedCases);
    const defs = t.defs as Record<string, { title: string; intro: string; debrief: string }>;
    for (const p of progress) {
      const d = defs[p.chapter.id];
      const header = `${fmt(t.orderLabel, { order: p.chapter.order, total: CHAPTERS.length })} — ${d.title.toUpperCase()}`;
      container.add(this.scene.add.text(left, y, header, textStyle(13.5, p.complete ? COLOR_STR.ok : COLOR_STR.accent, { fontStyle: 'bold' })));
      const status = p.complete
        ? t.completeTag
        : `${fmt(t.completionLabel, { done: p.done, total: p.total })} · ${fmt(t.durationLabel, { minutes: p.chapter.estimatedMinutes })}`;
      container.add(this.scene.add.text(left + panelW - 72 - 320, y, status, textStyle(11.5, p.complete ? COLOR_STR.ok : COLOR_STR.paperDim, { align: 'right', fixedWidth: 320 })));
      y += 22;
      const body = p.complete ? `${t.debriefLabel}: ${d.debrief}` : d.intro;
      const bodyText = this.scene.add.text(left, y, body, textStyle(11.5, COLOR_STR.paper, { wordWrap: { width: panelW - 100 }, lineSpacing: 3 }));
      container.add(bodyText);
      y += bodyText.height + 6;
      const objLine = `${t.objectivesLabel}: ${p.chapter.objectives.map((o) => objectives[o]).join(' · ')}`;
      container.add(this.scene.add.text(left, y, objLine, textStyle(10.5, COLOR_STR.paperDim, { wordWrap: { width: panelW - 100 } })));
      y += 30;
    }

    container.add(new Button(this.scene, cx, cy + panelH / 2 - 32, t.close, () => this.close(), { width: 200, height: 38, fontSize: 13 }));
    this.scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

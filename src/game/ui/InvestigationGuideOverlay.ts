import Phaser from 'phaser';
import { L } from '../i18n';
import { InvestigationGuide } from '../systems/InvestigationGuide';
import { ReadingLayer } from '../systems/ReadingLayer';
import { Button } from './Button';
import { Panel } from './Panel';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/** Procedural help only: no case solutions, scores or mandatory steps. */
export function openInvestigationGuide(scene: Phaser.Scene, caseId: string, step: number, onClose = (): void => {}): void {
  const ui = L().gameplay;
  InvestigationGuide.recall(caseId);
  const keyboard = scene.input.keyboard;
  const wasEnabled = keyboard?.enabled ?? false;
  if (keyboard) keyboard.enabled = false;
  const c = scene.add.container(0, 0).setDepth(100);
  const cx = GAME_WIDTH / 2;
  const cy = GAME_HEIGHT / 2;
  let closed = false;
  const close = (): void => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', esc, true);
    if (keyboard) keyboard.enabled = wasEnabled;
    c.destroy();
    ReadingLayer.closeOverlay();
    onClose();
  };
  const esc = (e: KeyboardEvent): void => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); } };
  c.add(scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0, 0.86).setInteractive());
  c.add(new Panel(scene, cx, cy, 960, 560));
  c.add(scene.add.text(cx - 440, 112, ui.guideTitle, textStyle(18, COLOR_STR.accentText)));
  let y = 160;
  ui.steps.forEach((text, i) => {
    const row = scene.add.text(cx - 440, y, `${i + 1}. ${text}`, textStyle(14, i === step ? COLOR_STR.paper : COLOR_STR.paperDim, { wordWrap: { width: 880 }, lineSpacing: 4 }));
    c.add(row);
    y += row.height + 18;
  });
  c.add(new Button(scene, cx - 220, 594, ui.skip, () => { InvestigationGuide.skip(caseId); close(); }, { width: 400, height: 44, fontSize: 12, variant: 'ghost' }));
  c.add(new Button(scene, cx + 220, 594, ui.close, close, { width: 400, height: 44, fontSize: 12 }));
  ReadingLayer.openOverlay(ui.guideTitle, [{ items: ui.steps }]);
  document.addEventListener('keydown', esc, true);
  scene.events.once('shutdown', close);
}

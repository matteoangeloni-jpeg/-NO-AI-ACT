import Phaser from 'phaser';
import { glossaryViews } from '../data/glossary';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { L, caseText, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Glossario operativo (v0.5): voci brevi consultabili una alla volta, con
 * navigazione avanti/indietro. Raggiungibile dall'Archivio. Nessun dato
 * personale, nessuna rete: solo testo localizzato.
 */
export class GlossaryScene extends Phaser.Scene {
  private from = 'Archive';
  private index = 0;
  private content?: Phaser.GameObjects.Container;

  constructor() {
    super('Glossary');
  }

  init(data: { from?: string; index?: number }): void {
    this.from = data.from ?? 'Archive';
    this.index = data.index ?? 0;
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const g = L().glossary;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(200, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 46, g.title, textStyle(20, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, 74, g.subtitle, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);

    new Panel(this, cx, GAME_HEIGHT / 2 + 6, 980, 470);

    new Button(this, cx - 300, GAME_HEIGHT - 48, g.prevButton, () => this.step(-1), { width: 200, height: 40, fontSize: 12, variant: 'ghost' });
    new Button(this, cx + 300, GAME_HEIGHT - 48, g.nextButton, () => this.step(1), { width: 200, height: 40, fontSize: 12, variant: 'ghost' });
    new Button(this, cx, GAME_HEIGHT - 48, g.back, () => this.scene.start(this.from), { width: 220, height: 40, fontSize: 12 });

    this.input.keyboard?.on('keydown-LEFT', () => this.step(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.step(1));
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start(this.from));

    this.render();
  }

  private step(dir: number): void {
    const total = glossaryViews().length;
    this.index = (this.index + dir + total) % total;
    this.render();
  }

  private render(): void {
    this.content?.destroy();
    const cx = GAME_WIDTH / 2;
    const left = cx - 440;
    const g = L().glossary;
    const entries = glossaryViews();
    const entry = entries[this.index];
    const c = this.add.container(0, 0);
    let y = 120;

    c.add(this.add.text(cx + 430, y, fmt(g.counter, { index: this.index + 1, total: entries.length }), textStyle(12, COLOR_STR.paperDim)).setOrigin(1, 0));
    c.add(this.add.text(left, y, entry.term.toUpperCase(), textStyle(20, COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 40;
    const def = this.add.text(left, y, entry.definition, textStyle(14, COLOR_STR.paper, { wordWrap: { width: 880 }, lineSpacing: 5 }));
    y += def.height + 18;

    c.add(this.add.text(left, y, `${g.whyLabel}:`, textStyle(12, COLOR_STR.paperDim)));
    y += 20;
    const why = this.add.text(left, y, entry.whyItMatters, textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: 880 }, lineSpacing: 4 }));
    y += why.height + 18;

    if (entry.relatedCases.length > 0) {
      c.add(this.add.text(left, y, `${g.relatedLabel}:`, textStyle(12, COLOR_STR.paperDim)));
      y += 20;
      const titles = entry.relatedCases.map((id) => `«${caseText(id).title}»`).join(' · ');
      const rel = this.add.text(left, y, titles, textStyle(13, COLOR_STR.paper, { wordWrap: { width: 880 }, lineSpacing: 4 }));
      y += rel.height + 18;
    }

    c.add(this.add.text(left, y, `${g.cautionLabel}:`, textStyle(12, COLOR_STR.warning)));
    y += 20;
    const caution = this.add.text(left, y, entry.caution, textStyle(13, COLOR_STR.warning, { wordWrap: { width: 880 }, lineSpacing: 4 }));

    c.add([def, why, caution]);
    this.content = c;
  }
}

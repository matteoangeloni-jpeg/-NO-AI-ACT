import Phaser from 'phaser';
import { TEACHER_RESOURCES } from '../data/concepts';
import { Button } from './Button';
import { Panel } from './Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Guida docente in gioco (v1.1): struttura prima/durante/dopo per usare il
 * gioco in aula, con i collegamenti alle risorse del sito (attività
 * didattiche e lezione introduttiva, IT e EN).
 *
 * Locale e presentazionale: nessun login, nessun account, nessun dato degli
 * studenti. I link aprono solo pagine INTERNE del sito in una nuova scheda.
 * ESC o il pulsante la chiudono.
 */
export class TeacherGuideOverlay {
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
    const scene = this.scene;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const ui = L().ui.teacherGuide;

    const container = scene.add.container(0, 0).setDepth(90);
    container.add(
      scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setInteractive().on('pointerdown', () => this.close())
    );

    const panelW = 980;
    const panelH = 620;
    container.add(new Panel(scene, cx, cy, panelW, panelH));
    container.add(scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 40;
    const wrap = panelW - 80;
    let y = cy - panelH / 2 + 28;

    container.add(scene.add.text(left, y, ui.title, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 28;
    const intro = scene.add.text(left, y, ui.intro, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: wrap }, lineSpacing: 4 }));
    container.add(intro);
    y += intro.height + 16;

    const section = (title: string, text: string): void => {
      container.add(scene.add.text(left, y, title.toUpperCase(), textStyle(12.5, COLOR_STR.ok, { fontStyle: 'bold' })));
      y += 20;
      const body = scene.add.text(left, y, text, textStyle(13, COLOR_STR.paper, { wordWrap: { width: wrap }, lineSpacing: 5 }));
      container.add(body);
      y += body.height + 14;
    };
    section(ui.beforeTitle, ui.beforeText);
    section(ui.duringTitle, ui.duringText);
    section(ui.afterTitle, ui.afterText);

    container.add(scene.add.text(left, y, ui.resourcesLabel, textStyle(11.5, COLOR_STR.paperDim)));
    y += 46; // i pulsanti-risorsa sono centrati verticalmente: spazio per l'etichetta
    // quattro risorse (IT e EN): pagine interne del sito, nuova scheda
    const linkW = 216;
    TEACHER_RESOURCES.forEach((res, i) => {
      const label = ui.links[res.id as keyof typeof ui.links];
      container.add(
        new Button(scene, left + linkW / 2 + i * (linkW + 12), y, label, () => window.open(res.url, '_blank', 'noopener,noreferrer'), {
          width: linkW,
          height: 40,
          fontSize: 11,
          variant: 'ghost'
        })
      );
    });

    container.add(new Button(scene, cx, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 220, height: 38, fontSize: 13 }));

    scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

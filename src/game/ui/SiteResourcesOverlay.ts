import Phaser from 'phaser';
import { SITE_LINKS } from '../data/concepts';
import { StateManager } from '../systems/StateManager';
import { Button } from './Button';
import { Panel } from './Panel';
import { L } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from './theme';

/**
 * Collegamenti dal gioco al sito educativo (v1.2): risorse, glossario, guida
 * docenti, privacy e "torna al sito". Serve a non far sentire il giocatore
 * intrappolato nel gioco.
 *
 * Locale e presentazionale: nessun account, nessun evento esterno. Le pagine
 * dell'hub si aprono in una NUOVA scheda (window.open, noopener) così il gioco
 * resta aperto; "torna al sito" naviga nella stessa scheda alla landing della
 * lingua corrente. Tutti i percorsi sono INTERNI (stessa origine). ESC chiude.
 */
export class SiteResourcesOverlay {
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
    const ui = L().ui.siteLinks;
    const links = SITE_LINKS[StateManager.language];

    const container = scene.add.container(0, 0).setDepth(90);
    container.add(
      scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.82).setInteractive().on('pointerdown', () => this.close())
    );

    const panelW = 760;
    const panelH = 440;
    container.add(new Panel(scene, cx, cy, panelW, panelH));
    container.add(scene.add.rectangle(cx, cy, panelW, panelH, 0x000000, 0.001).setInteractive());

    const left = cx - panelW / 2 + 40;
    const wrap = panelW - 80;
    let y = cy - panelH / 2 + 30;

    container.add(scene.add.text(left, y, ui.title, textStyle(18, COLOR_STR.accent, { fontStyle: 'bold' })));
    y += 28;
    const intro = scene.add.text(left, y, ui.intro, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: wrap }, lineSpacing: 4 }));
    container.add(intro);
    y += intro.height + 34;

    // sezioni del sito raggruppate per intento: Play / Education / Teachers /
    // AI Act / Glossary / Privacy. Pagine interne, nuova scheda: il gioco resta aperto.
    const resources: { label: string; url: string }[] = [
      { label: ui.play, url: links.play },
      { label: ui.hub, url: links.hub },
      { label: ui.teacher, url: links.teacher },
      { label: ui.guide, url: links.guide },
      { label: ui.glossary, url: links.glossary },
      { label: ui.privacy, url: links.privacy }
    ];
    const colW = wrap / 2;
    resources.forEach((res, i) => {
      const bx = left + colW / 2 + (i % 2) * colW;
      const by = y + Math.floor(i / 2) * 52;
      container.add(
        new Button(scene, bx, by, res.label, () => window.open(res.url, '_blank', 'noopener,noreferrer'), {
          width: colW - 20,
          height: 44,
          fontSize: 13,
          variant: 'ghost'
        })
      );
    });
    y += 3 * 52 + 12;

    // "torna al sito": naviga nella stessa scheda alla landing della lingua
    container.add(
      new Button(scene, cx - 140, cy + panelH / 2 - 34, ui.backToSite, () => { window.location.href = links.home; }, {
        width: 260,
        height: 40,
        fontSize: 13,
        variant: 'ok'
      })
    );
    container.add(new Button(scene, cx + 130, cy + panelH / 2 - 34, ui.close, () => this.close(), { width: 200, height: 40, fontSize: 13 }));

    scene.input.keyboard?.on('keydown-ESC', this.escHandler);
    this.container = container;
  }
}

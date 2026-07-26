import Phaser from 'phaser';
import { NORMS } from '../data/norms';
import { searchArchive } from '../systems/SearchIndex';
import { ReadingLayer } from '../systems/ReadingLayer';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { NormSystem } from '../systems/NormSystem';
import { Button } from '../ui/Button';
import { LockedNormCard, NormCardView } from '../ui/NormCard';
import { L, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/** Confini verticali dell'area scrollabile della griglia (fissi: header sopra, nav sotto). */
const GRID_TOP = 110;
const GRID_BOTTOM = GAME_HEIGHT - 70;

/** Archivio norme: griglia di carte sbloccate/bloccate, dettaglio al click. */
export class ArchiveScene extends Phaser.Scene {
  private from = 'CityMap';
  private detail?: Phaser.GameObjects.Container;
  private detailShade?: Phaser.GameObjects.Rectangle;
  private gridContainer!: Phaser.GameObjects.Container;
  private scrollY = 0;
  private maxScroll = 0;
  // 2.1 (roadmap §6) — ricerca digitata: stato query + riferimenti alle carte
  private query = '';
  private searchText!: Phaser.GameObjects.Text;
  private unlockedCards: Array<{ id: string; card: Phaser.GameObjects.Container }> = [];
  private lockedCards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super('Archive');
  }

  init(data: { from?: string }): void {
    this.from = data.from ?? 'CityMap';
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const ui = L().ui.archive;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    const unlockedCount = NormSystem.unlocked().length;
    AnalyticsSystem.track('archive_opened', { unlockedNormsCount: unlockedCount });
    this.add.text(cx, 50, ui.title, textStyle(20, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add
      .text(cx, 78, fmt(ui.subtitle, { done: unlockedCount, total: NORMS.length }), textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);

    // griglia scrollabile: con 11 norme (4 righe) il contenuto eccede l'area
    // disponibile tra header e bottoni di navigazione, quindi va in un
    // container mascherato invece che direttamente sulla scena.
    this.gridContainer = this.add.container(0, 0);
    const cardW = 380;
    const cardH = 200;
    const cols = 3;
    NORMS.forEach((norm, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = cx + (col - 1) * (cardW + 30);
      const y = GRID_TOP + cardH / 2 + row * (cardH + 40);
      if (NormSystem.isUnlocked(norm.id)) {
        const card = new NormCardView(this, x, y, NormSystem.view(norm.id), { width: cardW, height: cardH, compact: true });
        card.setInteractive({ useHandCursor: true })
          .on('pointerover', () => card.setScale(1.02))
          .on('pointerout', () => card.setScale(1))
          .on('pointerdown', () => this.showDetail(norm.id));
        this.gridContainer.add(card);
        this.unlockedCards.push({ id: norm.id, card });
      } else {
        const locked = new LockedNormCard(this, x, y, cardW, cardH);
        this.gridContainer.add(locked);
        this.lockedCards.push(locked);
      }
    });

    const rows = Math.ceil(NORMS.length / cols);
    const contentHeight = rows * (cardH + 40);
    const visibleHeight = GRID_BOTTOM - GRID_TOP;
    this.maxScroll = Math.max(0, contentHeight - visibleHeight);

    if (this.maxScroll > 0) {
      const maskShape = this.make.graphics({}, false);
      maskShape.fillRect(0, GRID_TOP, GAME_WIDTH, visibleHeight);
      this.gridContainer.setMask(maskShape.createGeometryMask());

      this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => this.scrollBy(dy * 0.6));
      // 30px-wide arrows in the margin right of the grid (cards end at cx+410+190=1240, canvas at 1280)
      new Button(this, GAME_WIDTH - 22, GRID_TOP + 16, '▲', () => this.scrollBy(-cardH - 40), { width: 30, height: 36, fontSize: 13, variant: 'ghost' });
      new Button(this, GAME_WIDTH - 22, GRID_BOTTOM - 16, '▼', () => this.scrollBy(cardH + 40), { width: 30, height: 36, fontSize: 13, variant: 'ghost' });
    }

    new Button(this, cx - 170, GAME_HEIGHT - 46, ui.back, () => this.scene.start(this.from), { width: 200, variant: 'ghost' });
    // accesso al glossario operativo (v0.5): non interrompe il flusso dei casi
    new Button(this, cx + 170, GAME_HEIGHT - 46, L().glossary.title, () => this.scene.start('Glossary', { from: 'Archive' }), { width: 260, fontSize: 12 });
    // 2.1 (roadmap §6, Her Story) — ricerca digitata: si scrive e basta.
    // Filtra le carte sbloccate (le bloccate restano opache: nessuno spoiler
    // dei titoli non ancora guadagnati) e riassume i risultati extra.
    this.searchText = this.add.text(cx, 96, '', textStyle(12, COLOR_STR.accent)).setOrigin(0.5);
    this.applySearch();
    this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
      if (this.detail) return;
      if (e.key === 'Backspace') this.query = this.query.substring(0, this.query.length - 1);
      else if (e.key.length === 1 && /[\p{L}\p{N} ]/u.test(e.key)) this.query += e.key.toLowerCase();
      else return;
      this.applySearch();
    });
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.detail) this.hideDetail();
      else if (this.query.length > 0) { this.query = ''; this.applySearch(); }
      else this.scene.start(this.from);
    });
  }

  /** Applica la query corrente: evidenzia le norme trovate, riassume il resto. */
  private applySearch(): void {
    const ui = L().ui.archive;
    const active = this.query.trim().length >= 2;
    const hits = active ? searchArchive(this.query) : [];
    const normHits = new Set(hits.filter((h) => h.kind === 'norm').map((h) => h.id));
    for (const { id, card } of this.unlockedCards) card.setAlpha(!active || normHits.has(id) ? 1 : 0.2);
    for (const locked of this.lockedCards) locked.setAlpha(active ? 0.2 : 1);
    if (!active) {
      this.searchText.setText(fmt(ui.searchIdle, { query: this.query }));
      return;
    }
    const g = hits.filter((h) => h.kind === 'glossary').length;
    const c = hits.filter((h) => h.kind === 'case').length;
    const found = [...normHits].filter((id) => this.unlockedCards.some((u) => u.id === id)).length;
    const line = hits.length === 0
      ? fmt(ui.searchNone, { query: this.query })
      : fmt(ui.searchResults, { query: this.query, n: found, g, c });
    this.searchText.setText(line);
    ReadingLayer.announce(line);
  }

  private scrollBy(delta: number): void {
    this.scrollY = Phaser.Math.Clamp(this.scrollY + delta, 0, this.maxScroll);
    this.gridContainer.setY(-this.scrollY);
  }

  private showDetail(normId: string): void {
    this.hideDetail();
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    this.detailShade = this.add
      .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.75)
      .setDepth(50)
      .setInteractive()
      .on('pointerdown', () => this.hideDetail());
    const card = new NormCardView(this, cx, cy, NormSystem.view(normId), { width: 620, height: 504 });
    card.setDepth(51);
    // la carta consuma il click: si chiude solo cliccando fuori, come dice l'hint
    card.setInteractive();
    const hint = this.add
      .text(cx, cy + 260, L().ui.archive.hint, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5)
      .setDepth(51);
    this.detail = this.add.container(0, 0, []).setDepth(51);
    this.detail.add([card, hint]);
  }

  private hideDetail(): void {
    this.detail?.destroy();
    this.detailShade?.destroy();
    this.detail = undefined;
    this.detailShade = undefined;
  }
}

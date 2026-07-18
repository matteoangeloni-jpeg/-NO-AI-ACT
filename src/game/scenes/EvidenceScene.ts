import Phaser from 'phaser';
import { MIN_CITED_CLUES, getCase } from '../data/cases';
import type { CaseData } from '../data/types';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Button } from '../ui/Button';
import { CaseContextOverlay } from '../ui/CaseContextOverlay';
import { DossierCard } from '../ui/DossierCard';
import { showToast } from '../ui/AlertToast';
import { L, caseText, fmt } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Esame dei reperti: aprire tutti gli indizi, poi citare nel rapporto
 * almeno MIN_CITED_CLUES reperti. La scelta dei reperti citati entra nella
 * valutazione finale del caso.
 */
export class EvidenceScene extends Phaser.Scene {
  private caseData!: CaseData;
  private cards: DossierCard[] = [];
  private proceedBtn!: Button;
  private proceedEligible = false;
  private revealToastShown = false;
  private contextOverlay!: CaseContextOverlay;
  private contextBtn!: Button;
  private backBtn!: Button;

  constructor() {
    super('Evidence');
  }

  init(data: { caseId: string }): void {
    this.caseData = getCase(data.caseId);
    this.cards = [];
    this.proceedEligible = false;
    this.revealToastShown = false;
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const texts = caseText(this.caseData.id);
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    AnalyticsSystem.page('evidence');
    AnalyticsSystem.track('evidence_opened', { caseId: this.caseData.id });
    AudioSystem.crossfadeToTheme(this.caseData.id);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 56, fmt(L().ui.evidence.header, { code: this.caseData.fileCode }), textStyle(14, COLOR_STR.alertText)).setOrigin(0.5);
    this.add.text(cx, 78, L().ui.evidence.instruction, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    // microcopy: citare un reperto costruisce il rapporto, non è la classificazione
    this.add.text(cx, 98, L().ui.evidence.citeNote, textStyle(11, COLOR_STR.accent, { wordWrap: { width: 900 }, align: 'center' })).setOrigin(0.5);
    this.add.rectangle(cx, 116, 900, 1, COLORS.iron);

    // read-only "Rivedi contesto" — re-read the case without leaving the scene
    this.contextOverlay = new CaseContextOverlay(this, this.caseData.id, 'closeToEvidence');
    this.contextBtn = new Button(this, GAME_WIDTH - 130, 36, L().ui.context.button, () => this.contextOverlay.toggle(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });

    // layout a griglia: 1 riga per ≤3 reperti, 2 righe per 4–6 (caso credito)
    const n = texts.clues.length;
    const cols = Math.min(n, 3);
    const rows = Math.ceil(n / cols);
    const cardW = 360;
    const cardH = rows === 1 ? 320 : 230;
    const colX = cols === 1 ? [cx] : cols === 2 ? [cx - 300, cx + 300] : [cx - 390, cx, cx + 390];
    const rowY = rows === 1 ? [290] : [236, 236 + cardH + 16];
    const sources = texts.clueSources;
    texts.clues.forEach((clue, i) => {
      const x = colX[i % cols];
      const y = rowY[Math.floor(i / cols)];
      const src = sources?.[i];
      const sourceLabel = src
        ? `${L().ui.evidence.sourceLabel}: ${(L().ui.evidence.sources as Record<string, string>)[src]}`
        : undefined;
      // micro-tag investigativo (v0.5): funzione del reperto rispetto al rischio
      // (minimizza / prova decisiva / effetto concreto…), reso da DossierCard
      // su una propria riga — niente concatenazione con la fonte
      const stance = this.caseData.clueStances?.[i];
      const stanceLabel = stance ? (L().ui.evidence.stances as Record<string, string>)[stance] : undefined;
      const card = new DossierCard(this, x, y, cardW, cardH, clue, i, () => this.refreshState(), sourceLabel, stanceLabel);
      card.setAlpha(0);
      this.tweens.add({ targets: card, alpha: 1, duration: 250, delay: i * 100 });
      this.cards.push(card);
    });

    this.proceedBtn = new Button(this, cx, GAME_HEIGHT - 90, L().ui.evidence.proceedButton, () => this.proceed(), { width: 380 });
    this.proceedBtn.setVisible(false);

    this.backBtn = new Button(this, 90, GAME_HEIGHT - 36, L().ui.case.backToMap, () => this.scene.start('CityMap'), { width: 140, height: 36, fontSize: 12, variant: 'ghost' });
    // ESC closes the context overlay first (if open), otherwise leaves to the map
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.contextOverlay.isOpen) this.contextOverlay.close();
      else this.scene.start('CityMap');
    });

    // tastiera (§11.2): 1..n apre/cita il reperto i-esimo, INVIO prosegue
    const KEYS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'] as const;
    KEYS.slice(0, n).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => {
        if (!this.contextOverlay.isOpen) this.cards[i]?.activate();
      });
    });
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (this.proceedEligible && !this.contextOverlay.isOpen) this.proceed();
    });
    this.syncReadingLayer();
  }

  /** Avanza alla decisione (o all'evento imprevisto) con i reperti citati. */
  private proceed(): void {
    const cited = this.cards
      .map((card, i) => (card.isCited ? i : -1))
      .filter((i) => i >= 0);
    AnalyticsSystem.track('clues_selected', {
      caseId: this.caseData.id,
      selectedClueCount: cited.length,
      relevantClueCount: this.caseData.relevantClues.length
    });
    const next = this.caseData.hasIncident ? 'Incident' : 'Decision';
    this.scene.start(next, { caseId: this.caseData.id, citedClues: cited });
  }

  /** Strato di lettura (§11.1): titoli sempre, testi dei reperti aperti. */
  private syncReadingLayer(): void {
    const texts = caseText(this.caseData.id);
    ReadingLayer.setScene(fmt(L().ui.evidence.header, { code: this.caseData.fileCode }), [
      { text: L().ui.evidence.instruction },
      { text: fmt(L().a11y.evidenceHint, { n: Math.min(texts.clues.length, 6) }) },
      {
        items: texts.clues.map((clue, i) => {
          const card = this.cards[i];
          const state = card?.isCited ? L().ui.evidence.cited : card?.isRevealed ? clue.text : L().ui.evidence.sealed;
          return `${clue.title} — ${state}`;
        })
      }
    ]);
  }

  update(): void {
    // the context overlay's full-screen shade doesn't visually dim these two
    // root-level buttons (a Phaser depth-sort quirk); hide them outright
    // while it's open instead of leaving them looking clickable but inert.
    const hideNav = this.contextOverlay.isOpen;
    this.contextBtn.setVisible(!hideNav);
    this.backBtn.setVisible(!hideNav);
    this.proceedBtn.setVisible(this.proceedEligible && !hideNav);
  }

  private refreshState(): void {
    const allRevealed = this.cards.every((c) => c.isRevealed);
    const citedCount = this.cards.filter((c) => c.isCited).length;
    if (allRevealed && !this.revealToastShown) {
      this.revealToastShown = true;
      // topOffset 20 (vs default 36): the file-code header sits at y=56 here,
      // the default toast position would cover it for ~2.5s.
      showToast(this, L().ui.evidence.allRevealedToast, 'info', 20);
    }
    // senza almeno MIN_CITED_CLUES reperti citati non si procede
    this.proceedEligible = allRevealed && citedCount >= MIN_CITED_CLUES;
    this.syncReadingLayer();
  }
}

import Phaser from 'phaser';
import { MIN_CITED_CLUES, getCase } from '../data/cases';
import { contradictionPairs } from '../data/learningModel';
import type { CaseData } from '../data/types';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Button } from '../ui/Button';
import { CaseContextOverlay } from '../ui/CaseContextOverlay';
import { DossierCard } from '../ui/DossierCard';
import { showToast } from '../ui/AlertToast';
import { L, caseText, fmt } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { evidenceReadingLine } from '../systems/evidenceReading';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { fadeInScene, reveal } from '../ui/motion';
import { StateManager } from '../systems/StateManager';
import { addNoiseOverlay } from '../ui/backdrop';
import { createDocumentTextures } from '../assets/procedural/documentStyles';

/**
 * Esame dei reperti: aprire tutti gli indizi, poi citare nel rapporto
 * almeno MIN_CITED_CLUES reperti. La scelta dei reperti citati entra nella
 * valutazione finale del caso.
 */
export class EvidenceScene extends Phaser.Scene {
  private caseData!: CaseData;
  private cards: DossierCard[] = [];
  private proceedBtn!: Button;
  private progressText!: Phaser.GameObjects.Text;
  private proceedEligible = false;
  private revealToastShown = false;
  private contextOverlay!: CaseContextOverlay;
  private contextBtn!: Button;
  private backBtn!: Button;
  private contradictionBtn: Button | null = null;

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
    fadeInScene(this, 250);
    AnalyticsSystem.page('evidence');
    AnalyticsSystem.track('evidence_opened', { caseId: this.caseData.id });
    AudioSystem.setMusicRole('archive', this.caseData.id);
    addNoiseOverlay(this, 0.4);

    this.add.text(cx, 56, fmt(L().ui.evidence.header, { code: this.caseData.fileCode }), textStyle(14, COLOR_STR.alertText)).setOrigin(0.5);
    this.add.text(cx, 78, L().ui.evidence.instruction, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    // microcopy: citare un reperto costruisce il rapporto, non è la classificazione
    this.add.text(cx, 98, L().ui.evidence.citeNote, textStyle(11, COLOR_STR.accentText, { wordWrap: { width: 900 }, align: 'center' })).setOrigin(0.5);
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
    /**
     * L'altezza su due file è 216, non 230.
     *
     * Con 230 la fila di sotto arrivava a y=597 e la riga di avanzamento
     * («hai abbastanza elementi: puoi passare alla classificazione») sta a
     * y=588: la frase finiva dentro le schede. Era già così prima dei
     * distintivi, ma i distintivi stanno proprio lì e l'hanno resa visibile.
     */
    const cardH = rows === 1 ? 320 : 216;
    // I fogli si generano alla dimensione VERA della scheda: una texture
    // stirata perderebbe il passo delle righe e la grana, che sono il
    // motivo per cui esiste.
    createDocumentTextures(this, cardW, cardH);
    const colX = cols === 1 ? [cx] : cols === 2 ? [cx - 300, cx + 300] : [cx - 390, cx, cx + 390];
    const rowY = rows === 1 ? [290] : [236, 236 + cardH + 16];
    const fondoSchede = rowY[rowY.length - 1] + cardH / 2;
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
      // Alla scheda si passa la FUNZIONE del reperto, non la sua etichetta:
      // è lei a sapere che «prova decisiva» è uno stato e merita il
      // distintivo, mentre le altre funzioni restano una riga di testo.
      const stance = this.caseData.clueStances?.[i];
      const card = new DossierCard(this, x, y, cardW, cardH, clue, i, () => this.refreshState(), sourceLabel, stance, src);
      card.setAlpha(0);
      reveal(this, { targets: card, alpha: 1, duration: 250, delay: i * 100 });
      this.cards.push(card);
    });

    // Ripresa della bozza (U01): reperti già aperti e già citati tornano
    // come erano. Le carte sono appena state create con una dissolvenza
    // scaglionata: restore() la annulla su quelle ripristinate, altrimenti
    // comparirebbero vuote e poi si riempirebbero.
    const draft = StateManager.draftFor(this.caseData.id);
    if (draft) {
      this.cards.forEach((card, i) => {
        card.setAlpha(1);
        card.restore(draft.revealedClues.includes(i), draft.citedClues.includes(i));
      });
      this.revealToastShown = this.cards.every((c) => c.isRevealed);
    }

    /**
     * QUANTO MANCA PER PROCEDERE, SCRITTO.
     *
     * Il pulsante per proseguire era semplicemente nascosto finché non si
     * aveva diritto a vederlo: tutti i reperti aperti e almeno due citati.
     * Chi giocava non aveva modo di sapere che cosa mancasse — il pulsante
     * compariva dal nulla, e fino a quel momento la schermata sembrava senza
     * uscita. Segnalato da chi ha giocato.
     *
     * I numeri sono DERIVATI: quanti reperti ha il fascicolo e quanti ne
     * servono citati non sono scritti qui, si leggono dal caso e da
     * MIN_CITED_CLUES.
     */
    this.progressText = this.add
      .text(cx, Math.max(GAME_HEIGHT - 132, fondoSchede + 14), '', textStyle(13, COLOR_STR.accentText, { align: 'center' }))
      .setOrigin(0.5);

    this.proceedBtn = new Button(this, cx, GAME_HEIGHT - 90, L().ui.evidence.proceedButton, () => this.proceed(), { width: 380 });
    this.proceedBtn.setVisible(false);
    this.citedBefore = new Set(this.cards.flatMap((c, i) => (c.isCited ? [i] : [])));
    this.proceedEligible = this.cards.every((c) => c.isRevealed) && this.citedBefore.size >= MIN_CITED_CLUES;
    this.refreshProgressLine();

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

    // 2.1 (roadmap §2) — marcatura contraddizioni, NON punteggiata: il
    // giocatore dichiara che i reperti citati si contraddicono; il gioco
    // conferma solo se la coppia (segnale decisivo × resoconto minimizzante)
    // esiste davvero nei dati derivati. Pulsante presente solo nei casi che
    // hanno almeno una contraddizione documentale; tasto C come scorciatoia.
    this.pairs = contradictionPairs(this.caseData.id);
    if (this.pairs.length > 0) {
      this.contradictionBtn = new Button(this, cx - 400, GAME_HEIGHT - 90, L().ui.evidence.contradictionButton, () => this.markContradiction(), { width: 300, height: 40, fontSize: 12, variant: 'ghost' });
      this.input.keyboard?.on('keydown-C', () => {
        if (!this.contextOverlay.isOpen) this.markContradiction();
      });
    }
    this.syncReadingLayer();
  }

  private pairs: Array<[number, number]> = [];

  /** Reperti già citati all'ultimo aggiornamento: serve a riconoscere l'ultimo. */
  private citedBefore = new Set<number>();

  /** Verifica la contraddizione dichiarata sui reperti CITATI (mai sul punteggio). */
  private markContradiction(): void {
    const texts = caseText(this.caseData.id);
    const cited = new Set(this.cards.flatMap((card, i) => (card.isCited ? [i] : [])));
    const hit = this.pairs.find(([s, m]) => cited.has(s) && cited.has(m));
    if (hit) {
      // una contraddizione documentale accertata: è esattamente l'opacità
      // del sistema che il gioco racconta, e ora si sente
      AudioSystem.glitchOpacity();
      const msg = fmt(L().ui.evidence.contradictionFound, { a: texts.clues[hit[0]].title, b: texts.clues[hit[1]].title });
      showToast(this, msg, 'info', 20);
      ReadingLayer.announce(msg);
      /**
       * Le due schede restano marcate. Il toast passa dopo qualche secondo
       * e la contraddizione se ne va con lui: chi la trova a inizio esame e
       * poi costruisce il rapporto non ha più niente sotto gli occhi che
       * gliela ricordi. Il distintivo è il verbale di un accertamento che
       * il giocatore ha già fatto — non anticipa nulla, perché arriva solo
       * dopo che lui l'ha dichiarata e i dati l'hanno confermata.
       */
      this.cards[hit[0]]?.markContradiction();
      this.cards[hit[1]]?.markContradiction();
    } else {
      showToast(this, L().ui.evidence.contradictionNone, 'info', 20);
      ReadingLayer.announce(L().ui.evidence.contradictionNone);
    }
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
          return evidenceReadingLine(
            clue,
            card ? { revealed: card.isRevealed, cited: card.isCited } : undefined,
            { sealed: L().ui.evidence.sealed, cited: L().a11y.evidenceCited }
          );
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
    this.contradictionBtn?.setVisible(!hideNav);
  }

  /**
   * Scritta separata da refreshState perché va mostrata anche APPENA SI
   * ENTRA, quando nessuna carta è stata ancora toccata: mettendola solo
   * nella reazione al tocco, la schermata si apriva muta proprio nel
   * momento in cui il giocatore si chiede che cosa deve fare.
   *
   * refreshState invece salva la bozza, e chiamarlo all'ingresso
   * scriverebbe un salvataggio per un fascicolo che nessuno ha ancora
   * aperto.
   */
  private refreshProgressLine(): void {
    const ui = L().ui.evidence;
    this.progressText.setText(
      this.proceedEligible
        ? ui.progressReady
        : fmt(ui.progress, {
            opened: String(this.cards.filter((c) => c.isRevealed).length),
            total: String(this.cards.length),
            cited: String(this.cards.filter((c) => c.isCited).length),
            min: String(MIN_CITED_CLUES)
          })
    );
    this.progressText.setColor(this.proceedEligible ? COLOR_STR.ok : COLOR_STR.accentText);
  }

  private refreshState(): void {
    const allRevealed = this.cards.every((c) => c.isRevealed);
    const citedCount = this.cards.filter((c) => c.isCited).length;
    // La bozza si aggiorna a ogni tocco: è il punto unico in cui lo stato
    // delle carte cambia, quindi è anche l'unico posto da cui salvarlo.
    StateManager.saveDraft(this.caseData.id, {
      step: 'evidence',
      revealedClues: this.cards.flatMap((c, i) => (c.isRevealed ? [i] : [])),
      citedClues: this.cards.flatMap((c, i) => (c.isCited ? [i] : []))
    });
    if (allRevealed && !this.revealToastShown) {
      this.revealToastShown = true;
      // topOffset 20 (vs default 36): the file-code header sits at y=56 here,
      // the default toast position would cover it for ~2.5s.
      showToast(this, L().ui.evidence.allRevealedToast, 'info', 20);
    }
    // senza almeno MIN_CITED_CLUES reperti citati non si procede
    const couldProceedBefore = this.proceedEligible;
    this.proceedEligible = allRevealed && citedCount >= MIN_CITED_CLUES;

    this.refreshProgressLine();

    /**
     * IL MOMENTO IN CUI SI PUÒ PROCEDERE HA UN SUONO SUO.
     *
     * La riga di avanzamento cambia colore e il pulsante compare, ma
     * entrambi stanno in fondo allo schermo mentre lo sguardo è sulle
     * schede: chi sta leggendo il terzo reperto non si accorge di avere
     * già finito. Suona solo sul PASSAGGIO, non a ogni tocco successivo.
     */
    if (this.proceedEligible && !couldProceedBefore) AudioSystem.canProceed();

    /**
     * RISCONTRO IMMEDIATO SU UNA CITAZIONE.
     *
     * Citare un reperto non diceva niente sul perché contasse: si scopriva
     * solo alla fine, nel rapporto. Ora appena si cita il gioco nomina la
     * funzione di quel reperto rispetto al rischio — la stessa che la scheda
     * mostra una volta aperta, non un'informazione nuova e non un giudizio
     * sulla decisione, che resta tutta da prendere.
     */
    const justCited = this.cards.findIndex((c, i) => c.isCited && !this.citedBefore.has(i));
    this.citedBefore = new Set(this.cards.flatMap((c, i) => (c.isCited ? [i] : [])));
    if (justCited >= 0) {
      // il gesto centrale del gioco: finora suonava come un pulsante qualunque
      AudioSystem.citeEvidence();
      const ui = L().ui.evidence;
      const stance = this.caseData.clueStances?.[justCited];
      const label = stance ? (ui.stances as Record<string, string>)[stance] : null;
      if (label) {
        const msg = fmt(ui.citedBecause, { title: caseText(this.caseData.id).clues[justCited].title, stance: label });
        showToast(this, msg, 'info', 20);
        ReadingLayer.announce(msg);
      }
    }

    this.syncReadingLayer();
  }
}

import Phaser from 'phaser';
import { MIN_CITED_CLUES, getCase } from '../data/cases';
import { contradictionPairs } from '../data/learningModel';
import type { CaseData } from '../data/types';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Button } from '../ui/Button';
import { CaseContextOverlay } from '../ui/CaseContextOverlay';
import { DossierCard } from '../ui/DossierCard';
import { EvidenceCompareOverlay } from '../ui/EvidenceCompareOverlay';
import { DESK_BOTTOM, InspectorDesk } from '../ui/InspectorDesk';
import { NotebookOverlay } from '../ui/NotebookOverlay';
import { TOAST_HEIGHT, showToast } from '../ui/AlertToast';
import { L, caseText, fmt } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { evidenceReadingLine } from '../systems/evidenceReading';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { fadeInScene, reveal } from '../ui/motion';
import { StateManager } from '../systems/StateManager';
import { addNoiseOverlay } from '../ui/backdrop';
import { createDocumentTextures } from '../assets/procedural/documentStyles';

/**
 * Esame dei reperti: aprire tutti gli indizi, poi citare nel rapporto
 * almeno MIN_CITED_CLUES reperti. La scelta dei reperti citati entra nella
 * valutazione finale del caso.
 */
/**
 * Altezza di riposo degli avvisi.
 *
 * Era 20, cioè dentro la barra della pratica: il toast atterrava sopra la
 * postazione e ne copriva due pulsanti. Il primo rimedio — `DESK_BOTTOM + 14`
 * — non bastava, ed è un errore istruttivo: il container dell'avviso è
 * CENTRATO su questa coordinata, non appoggiato, quindi a 65 il suo bordo
 * superiore cadeva a 43 e la barra finisce a 51. Otto pixel di
 * sovrapposizione, e la guardia li accettava perché confrontava il centro.
 *
 * Qui si somma mezza altezza dell'avviso: è il BORDO a dover stare sotto
 * la barra, non il centro.
 */
const TOAST_Y = DESK_BOTTOM + TOAST_HEIGHT / 2;

/**
 * Interruttore delle due istruzioni che si ritirano a compito svolto.
 *
 * `false` le rimette a video per sempre, come erano prima. Sta qui e non
 * altrove perché è una decisione di prodotto, non un dettaglio di
 * implementazione: chi vuole tornare indietro cambia una parola, e la guardia
 * in `inspector-desk-smoke.mjs` diventa rossa, che è il comportamento voluto —
 * la decisione è scritta anche nel controllo, non solo qui.
 */
const RITIRA_ISTRUZIONI_A_COMPITO_SVOLTO = true;

export class EvidenceScene extends Phaser.Scene {
  private caseData!: CaseData;
  private cards: DossierCard[] = [];
  private proceedBtn!: Button;
  private progressText!: Phaser.GameObjects.Text;
  private istruzione!: Phaser.GameObjects.Text;
  private notaCitazione!: Phaser.GameObjects.Text;
  private istruzioniRitirate = false;
  private proceedEligible = false;
  private revealToastShown = false;
  private contextOverlay!: CaseContextOverlay;
  private contextBtn!: Button;
  private compareOverlay!: EvidenceCompareOverlay;
  private compareBtn!: Button;
  private notebookOverlay!: NotebookOverlay;
  private notebookBtn!: Button;
  private inspectorDesk!: InspectorDesk;
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

    /**
     * IL CODICE DEL FASCICOLO NON SI SCRIVE DUE VOLTE.
     *
     * Qui c'era «FASCICOLO AX-102/2032 — REPERTI», e venti pixel più su la
     * barra della pratica dice già «FASCICOLO AX-102/2032 · ESAME REPERTI».
     * La stessa informazione due volte, una sotto l'altra: la barra è
     * arrivata dopo e questa riga non è stata tolta.
     *
     * Resta nello STRATO DI LETTURA come titolo della scena (più sotto),
     * dove serve e dove non occupa spazio: chi legge con uno strumento
     * assistivo continua a sapere quale fascicolo sta esaminando.
     *
     * La fascia liberata è quella in cui atterrano gli avvisi.
     */
    /**
     * LE DUE ISTRUZIONI SI RITIRANO A COMPITO SVOLTO.
     *
     * Misurato: nello stato «reperti aperti e citati» questa schermata porta
     * SETTE blocchi di prosa per 1119 caratteri, il massimo del giro — e due
     * dei sette sono queste righe, che spiegano come fare una cosa già fatta.
     * Competono con i reperti che il giocatore sta leggendo nel momento in cui
     * deve pesarli. La diagnosi completa è in docs/UI_DENSITY_DIAGNOSIS.md.
     *
     * Si ritirano solo quando l'istruzione è ESAURITA, cioè quando tutti i
     * reperti sono aperti e ne sono citati almeno due: non si può più «non
     * sapere come citare» dopo aver citato due volte. Prima di quel momento
     * restano, perché all'ingresso la schermata dev'essere ancora spiegata.
     *
     * Nessuno perde nulla: entrambe restano nello strato di lettura, come già
     * si è fatto per la colonna della città e per il riepilogo laterale.
     * Spente, non cancellate — la costante qui sotto le riaccende.
     */
    this.istruzione = this.add.text(cx, 100, L().ui.evidence.instruction, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    // microcopy: citare un reperto costruisce il rapporto, non è la classificazione
    this.notaCitazione = this.add.text(cx, 118, L().ui.evidence.citeNote, textStyle(11, COLOR_STR.accentText, { wordWrap: { width: 900 }, align: 'center' })).setOrigin(0.5);

    // Gli strumenti condivisi vivono nella stessa postazione in entrambe le fasi.
    this.contextOverlay = new CaseContextOverlay(this, this.caseData.id, 'closeToEvidence');
    this.compareOverlay = new EvidenceCompareOverlay(this, this.caseData.id, () => this.citedIndices(), 'compareCloseEvidence');
    this.notebookOverlay = new NotebookOverlay(this);

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
    this.citedBefore = new Set(this.citedIndices());
    this.buildInspectorDesk();

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
    this.proceedEligible = this.cards.every((c) => c.isRevealed) && this.citedBefore.size >= MIN_CITED_CLUES;
    this.refreshProgressLine();

    this.backBtn = new Button(this, 90, GAME_HEIGHT - 36, L().ui.case.backToMap, () => this.scene.start('CityMap'), { width: 140, height: 36, fontSize: 12, variant: 'ghost' });
    // ESC chiude prima lo strumento aperto, altrimenti lascia il fascicolo.
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.contextOverlay.isOpen) this.contextOverlay.close();
      else if (this.compareOverlay.isOpen) this.compareOverlay.close();
      else if (this.notebookOverlay.isOpen) this.notebookOverlay.close();
      else this.scene.start('CityMap');
    });

    // tastiera (§11.2): 1..n apre/cita il reperto i-esimo, INVIO prosegue
    const KEYS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'] as const;
    KEYS.slice(0, n).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => {
        if (!this.hasOpenOverlay()) this.cards[i]?.activate();
      });
    });
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (this.proceedEligible && !this.hasOpenOverlay()) this.proceed();
    });
    this.input.keyboard?.on('keydown-X', () => {
      if (!this.hasOpenOverlay() && this.citedIndices().length >= 2) this.compareOverlay.toggle();
    });
    this.input.keyboard?.on('keydown-N', () => {
      if (!this.hasOpenOverlay()) this.notebookOverlay.toggle();
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
        if (!this.hasOpenOverlay()) this.markContradiction();
      });
    }
    this.syncReadingLayer();
  }

  private pairs: Array<[number, number]> = [];

  /** Reperti già citati all'ultimo aggiornamento: serve a riconoscere l'ultimo. */
  private citedBefore = new Set<number>();

  private citedIndices(): number[] {
    return this.cards.flatMap((card, i) => (card.isCited ? [i] : []));
  }

  private hasOpenOverlay(): boolean {
    return this.contextOverlay.isOpen || this.compareOverlay.isOpen || this.notebookOverlay.isOpen;
  }

  private buildInspectorDesk(): void {
    const ui = L().ui.inspectorDesk;
    this.inspectorDesk = new InspectorDesk(this, {
      caseLabel: fmt(ui.fileLabel, { code: this.caseData.fileCode }),
      phaseLabel: ui.evidencePhase
    });
    this.contextBtn = this.inspectorDesk.addAction(ui.context, () => this.contextOverlay.toggle(), { width: 126 });
    this.compareBtn = this.inspectorDesk.addAction(ui.compare, () => this.compareOverlay.toggle(), { width: 142, disabled: true });
    this.inspectorDesk.addAction(ui.normLocked, () => undefined, { width: 142, disabled: true });
    this.notebookBtn = this.inspectorDesk.addAction(ui.notebook, () => this.notebookOverlay.toggle(), { width: 126 });
    this.refreshInspectorDesk();
  }

  private refreshInspectorDesk(): void {
    const ui = L().ui.inspectorDesk;
    const cited = this.citedIndices().length;
    this.inspectorDesk.setStatus(fmt(ui.evidenceStatus, {
      opened: this.cards.filter((card) => card.isRevealed).length,
      total: this.cards.length,
      cited
    }));
    this.compareBtn.setEnabled(cited >= 2);
  }

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
      showToast(this, msg, 'info', TOAST_Y);
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
      showToast(this, L().ui.evidence.contradictionNone, 'info', TOAST_Y);
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
      // Prima non c'era: ora che la riga a video si ritira, se non stesse qui
      // chi legge con uno strumento assistivo la perderebbe del tutto.
      { text: L().ui.evidence.citeNote },
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
    const hideNav = this.contextOverlay.isOpen || this.compareOverlay.isOpen || this.notebookOverlay.isOpen;
    this.inspectorDesk.setVisible(!hideNav);
    this.contextBtn.setVisible(!hideNav);
    this.compareBtn.setVisible(!hideNav);
    this.notebookBtn.setVisible(!hideNav);
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
      showToast(this, L().ui.evidence.allRevealedToast, 'info', TOAST_Y);
    }
    // senza almeno MIN_CITED_CLUES reperti citati non si procede
    const couldProceedBefore = this.proceedEligible;
    this.proceedEligible = allRevealed && citedCount >= MIN_CITED_CLUES;

    this.refreshProgressLine();
    this.refreshInspectorDesk();

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
     * E allo stesso passaggio le due istruzioni si ritirano.
     *
     * In dissolvenza e non di scatto: una riga che sparisce di colpo attira
     * l'occhio proprio mentre lo si vuole libero per i reperti. `setVisible`
     * a dissolvenza finita, così la riga non resta un oggetto invisibile che
     * intercetta niente ma che le misure contano ancora.
     */
    if (RITIRA_ISTRUZIONI_A_COMPITO_SVOLTO && this.proceedEligible && !this.istruzioniRitirate) {
      this.istruzioniRitirate = true;
      for (const riga of [this.istruzione, this.notaCitazione]) {
        // Passa per reveal() e non per l'aggiunta diretta di un tween: con
        // «riduci movimento» attivo applica subito lo stato finale ed esegue
        // onComplete invece di animare. Lo pretende tests/motion.test.ts, che
        // ha fatto bene a fermarmi — la prima stesura animava e quella
        // impostazione la ignorava.
        reveal(this, {
          targets: riga,
          alpha: 0,
          duration: 260,
          ease: 'Quad.easeOut',
          onComplete: () => riga.setVisible(false)
        });
      }
    }

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
        showToast(this, msg, 'info', TOAST_Y);
        ReadingLayer.announce(msg);
      }
    }

    this.syncReadingLayer();
  }
}

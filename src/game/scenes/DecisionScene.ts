import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData, Classification, ConfidenceLevel, IncidentChoice, Measure, ResponsibleSubject } from '../data/types';
import { evaluateReport } from '../systems/ReportSystem';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { NormSystem } from '../systems/NormSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { CaseContextOverlay } from '../ui/CaseContextOverlay';
import { CaseNormOverlay } from '../ui/CaseNormOverlay';
import { NormCardView } from '../ui/NormCard';
import { L, caseText, fmt } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { fadeInScene } from '../ui/motion';
import type { DraftStep } from '../systems/caseDraft';
import { CLASSIFICATION_TERMS, SUBJECT_TERMS } from '../data/termHints';
import { addNoiseOverlay } from '../ui/backdrop';
import { INDICATOR_KEYS, IndicatorHud } from '../systems/IndicatorSystem';

/**
 * Riga dell'avviso sulla firma. Sta fra il riepilogo e la fila della
 * fiducia dichiarata, che buildConfidenceRow disegna a y=566: le due cose
 * vanno tenute distanti a mano, perché nessuna delle due conosce l'altra.
 */
const SIGN_NOTE_Y = 470;
const CONFIDENCE_ROW_Y = 566;

const CLASSIFICATIONS: Classification[] = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
const MEASURES: Measure[] = ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'];
const SUBJECTS: ResponsibleSubject[] = ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'];
/** Ritorno al passo precedente: centro e larghezza, con 15 px di margine. */
export const BACK_BTN_X = 115;
export const BACK_BTN_W = 200;

const NUMBER_KEYS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'];

/**
 * Costruzione del rapporto ispettivo in quattro passi:
 * classificazione → misura → soggetto responsabile → motivazione.
 * L'esito viene calcolato dal ReportSystem e mostrato nella ReportScene.
 */
export class DecisionScene extends Phaser.Scene {
  private caseData!: CaseData;
  private classification: Classification | null = null;
  private measure: Measure | null = null;
  private subject: ResponsibleSubject | null = null;
  private motivation: number | null = null;
  private citedClues: number[] = [];
  private confidence: ConfidenceLevel | null = null;
  private incidentChoice?: IncidentChoice;
  private resolved = false;
  private overlay?: Phaser.GameObjects.Container;
  private contextOverlay!: CaseContextOverlay;
  private caseNormOverlay!: CaseNormOverlay;
  private contextBtn?: Button;
  private normsBtn?: Button;
  private caseNormBtn?: Button;
  private backBtn?: Button;
  private termsBtn?: Button;
  private lastStep?: { label: string; question: string };

  constructor() {
    super('Decision');
  }

  init(data: { caseId: string; citedClues?: number[]; incidentChoice?: IncidentChoice }): void {
    this.caseData = getCase(data.caseId);
    this.classification = null;
    this.measure = null;
    this.subject = null;
    this.motivation = null;
    this.citedClues = data.citedClues ?? [];
    this.confidence = null;
    this.incidentChoice = data.incidentChoice;
    this.resolved = false; // le istanze di scena vengono riusate tra start()
    this.overlay = undefined;

    // Ripresa della bozza (U01). Le scelte non firmate tornano com'erano, e
    // con loro i reperti citati: ricostruire la decisione senza le prove su
    // cui si fondava darebbe un rapporto diverso da quello lasciato a metà.
    const draft = StateManager.draftFor(this.caseData.id);
    if (draft) {
      this.classification = draft.classification;
      this.measure = draft.measure;
      this.subject = draft.subject;
      this.motivation = draft.motivation;
      this.confidence = draft.confidence;
      if (draft.citedClues.length > 0 && this.citedClues.length === 0) this.citedClues = [...draft.citedClues];
    }
  }

  /**
   * Salva la bozza dopo ogni scelta. La fase dichiarata è quella in cui il
   * giocatore si trova ORA, non quella appena conclusa: riaprendo deve
   * ritrovare la domanda a cui non ha ancora risposto.
   */
  private persistDraft(step: DraftStep): void {
    StateManager.saveDraft(this.caseData.id, {
      step,
      citedClues: this.citedClues,
      classification: this.classification,
      measure: this.measure,
      subject: this.subject,
      motivation: this.motivation,
      confidence: this.confidence
    });
  }

  /** Passo da cui ripartire, secondo le scelte già prese. */
  private resumeStep(): DraftStep {
    if (this.classification === null) return 'classification';
    if (this.measure === null) return 'measure';
    if (this.subject === null) return 'subject';
    if (this.motivation === null) return 'motivation';
    return 'summary';
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    fadeInScene(this, 250);
    AudioSystem.setMusicRole('decision', this.caseData.id);
    addNoiseOverlay(this, 0.4);
    this.contextOverlay = new CaseContextOverlay(this, this.caseData.id, 'closeToDecision');
    // read-only "Norma del caso": relevant rule of the current case (no unlock)
    this.caseNormOverlay = new CaseNormOverlay(this, this.caseData.normId);
    const builders: Record<DraftStep, () => void> = {
      evidence: () => this.showClassificationStep(),
      classification: () => this.showClassificationStep(),
      measure: () => this.showMeasureStep(),
      subject: () => this.showSubjectStep(),
      motivation: () => this.showMotivationStep(),
      summary: () => this.showSummaryStep()
    };
    builders[this.resumeStep()]();
  }

  /**
   * Riporta lo strato di lettura al passo corrente. Serve dopo la chiusura
   * di un overlay che lo ha sostituito: senza, chi legge con uno strumento
   * assistivo resterebbe sui termini del glossario mentre sullo schermo è
   * tornata la domanda.
   */
  private syncStepReading(): void {
    if (!this.lastStep) return;
    ReadingLayer.setScene(fmt(L().a11y.decisionTitle, { step: this.lastStep.label }), [
      { text: this.lastStep.question },
      { text: L().ui.decision.stepBackHint }
    ]);
  }

  /**
   * RIEPILOGO LATERALE, SEMPRE LÌ.
   *
   * Durante la decisione il giocatore doveva tenere a mente che cosa aveva
   * citato e che cosa aveva già scelto: i reperti erano a una scena di
   * distanza, e le scelte fatte sparivano insieme al passo che le aveva
   * prese. "Voglio poter tornare facilmente alle prove mentre scelgo",
   * detto da chi ha giocato.
   *
   * Non introduce nulla di nuovo: i titoli dei reperti citati e le scelte
   * già prese sono gli stessi dati che il riepilogo finale rimette in fila.
   * Sta nella colonna di sinistra, che nei passi di scelta è vuota, e non
   * compare nel riepilogo finale — lì sarebbe la stessa cosa scritta due
   * volte sulla stessa schermata.
   */
  private buildSidebar(): void {
    const t = L().ui.decision;
    const texts = caseText(this.caseData.id);
    const left = 24;
    const wrap = 226;
    let y = 176;

    const heading = (label: string): void => {
      this.add.text(left, y, label, textStyle(11, COLOR_STR.accentText, { fontStyle: 'bold' }));
      y += 18;
    };
    const line = (text: string, color: string): void => {
      const o = this.add.text(left, y, text, textStyle(11.5, color, { wordWrap: { width: wrap }, lineSpacing: 2 }));
      y += o.height + 5;
    };

    heading(t.sidebar.cited);
    for (const i of this.citedClues) line(`· ${texts.clues[i].title}`, COLOR_STR.paper);
    y += 12;

    heading(t.sidebar.soFar);
    const pending = t.sidebar.pending;
    const rows: Array<[string, string | null]> = [
      [t.summary.classification, this.classification ? L().classifications[this.classification] : null],
      [t.summary.measure, this.measure ? L().measures[this.measure] : null],
      [t.summary.subject, this.subject ? L().ui.subjects[this.subject] : null]
    ];
    for (const [label, value] of rows) {
      this.add.text(left, y, label.toUpperCase(), textStyle(10, COLOR_STR.paperDim));
      y += 14;
      line(value ?? pending, value ? COLOR_STR.paper : COLOR_STR.paperDim);
      y += 4;
    }
  }

  private header(step: string, question: string, sidebar = true): void {
    this.lastStep = { label: step, question };
    // strato di lettura (§11.1): passo corrente e domanda, a ogni transizione
    // Il ritorno al passo precedente è annunciato qui e non nei tasti in
    // fondo: chi legge con uno strumento assistivo incontra la scena
    // dall'alto, e deve sapere di poter correggere prima di scegliere.
    ReadingLayer.setScene(fmt(L().a11y.decisionTitle, { step }), [
      { text: question },
      { text: L().ui.decision.stepBackHint }
    ]);
    const cx = GAME_WIDTH / 2;
    this.add
      .text(cx, 56, fmt(L().ui.case.fileLabel, { code: this.caseData.fileCode }), textStyle(13, COLOR_STR.alertText))
      .setOrigin(0.5);
    this.add.text(cx, 82, step, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 122, question, textStyle(19, COLOR_STR.paper)).setOrigin(0.5);
    this.add.rectangle(cx, 150, 900, 1, COLORS.iron);
    // archivio norme consultabile in ogni passo della decisione
    this.normsBtn = new Button(this, GAME_WIDTH - 130, 36, L().ui.decision.normsButton, () => this.toggleNormsOverlay(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
    // read-only "Rivedi contesto" — consultabile in ogni passo, non tocca lo stato
    this.contextBtn = new Button(this, 130, 36, L().ui.context.button, () => this.contextOverlay.toggle(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
    // read-only "Norma del caso" — norma rilevante in sola lettura (no sblocco)
    this.caseNormBtn = new Button(this, GAME_WIDTH - 130, 76, L().ui.caseNorm.button, () => this.caseNormOverlay.toggle(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
    if (sidebar) {
      this.buildSidebar();
      this.buildCityState();
    }
  }

  /**
   * STATO DELLA CITTÀ, MENTRE SI DECIDE.
   *
   * I quattro indicatori si vedevano sulla mappa e dopo il caso, mai
   * durante: "voglio sentire che le mie scelte cambiano la città", e non si
   * sentiva perché la città spariva proprio nel momento in cui si decide di
   * lei.
   *
   * Qui c'è lo STATO ATTUALE, e soltanto quello. Nessuna previsione di che
   * cosa farebbe ciascuna opzione: mostrarla trasformerebbe la decisione in
   * un gioco di cursori da massimizzare, e il rapporto non si valuta su
   * quanto sale una barra ma su quanto regge giuridicamente. La città dice
   * dove si trova, non che cosa conviene.
   */
  private buildCityState(): void {
    const right = GAME_WIDTH - 250;
    this.add.text(right, 176, L().ui.decision.cityState, textStyle(11, COLOR_STR.accentText, { fontStyle: 'bold' }));
    new IndicatorHud(this, right, 204, 226);
    this.add.text(right, 204 + INDICATOR_KEYS.length * 34, L().ui.decision.cityStateNote, textStyle(10.5, COLOR_STR.paperDim, { wordWrap: { width: 226 }, lineSpacing: 2 }));
  }

  update(): void {
    // the read-only overlays' full-screen shade doesn't visually dim these
    // root-level buttons (a Phaser depth-sort quirk); hide them outright
    // while any overlay is open instead of leaving them looking clickable.
    const hideNav = this.contextOverlay.isOpen || this.caseNormOverlay.isOpen || !!this.overlay;
    this.contextBtn?.setVisible(!hideNav);
    this.normsBtn?.setVisible(!hideNav);
    this.caseNormBtn?.setVisible(!hideNav);
    this.backBtn?.setVisible(!hideNav);
    this.termsBtn?.setVisible(!hideNav);
  }

  /**
   * Associa i tasti numerici 1..n alle opzioni correnti, e BACKSPACE al
   * ritorno al passo precedente. La riassociazione avviene a ogni passo
   * perché removeAllListeners() qui sotto azzera anche il ritorno: senza
   * questo parametro, indietro funzionerebbe col mouse e non da tastiera.
   */
  private bindNumberKeys(count: number, onPick: (index: number) => void, onBack?: () => void): void {
    this.input.keyboard?.removeAllListeners();
    NUMBER_KEYS.slice(0, count).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => {
        // ignore number keys while a read-only overlay (norms / context / rule) is open
        if (!this.overlay && !this.contextOverlay.isOpen && !this.caseNormOverlay.isOpen) onPick(i);
      });
    });
    if (onBack) {
      this.input.keyboard?.on('keydown-BACKSPACE', () => {
        if (!this.overlay && !this.contextOverlay.isOpen && !this.caseNormOverlay.isOpen && !this.resolved) onBack();
      });
    }
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.contextOverlay.isOpen) this.contextOverlay.close();
      else if (this.caseNormOverlay.isOpen) this.caseNormOverlay.close();
      else this.closeNormsOverlay();
    });
  }

  /**
   * Torna al passo precedente (U02). Azzera SOLO la scelta di quel passo,
   * così le altre restano: tornare indietro per correggere una misura non
   * deve costare la classificazione già data. Il rapporto non è ancora
   * firmato, quindi nulla di archiviato viene toccato.
   */
  private stepBack(clear: () => void, builder: () => void): void {
    if (this.resolved) return;
    clear();
    // anche tornare indietro è uno stato da salvare: chi corregge e poi
    // chiude la scheda deve ritrovare la correzione, non la scelta annullata
    this.persistDraft(this.resumeStep());
    AudioSystem.confirm();
    this.nextStep(builder);
  }

  /**
   * Bottone di ritorno, nella stessa posizione in tutti i passi.
   *
   * Il Button è centrato su (x, y): con BACK_BTN_W più larga del doppio di
   * BACK_BTN_X il bordo sinistro finirebbe fuori dal canvas. Le due costanti
   * stanno qui insieme, e un test le confronta, perché allargare l'etichetta
   * senza spostare il centro è esattamente l'errore facile da fare.
   */
  private addBackButton(label: string, onBack: () => void): Button {
    return new Button(this, BACK_BTN_X, GAME_HEIGHT - 36, label, onBack, {
      width: BACK_BTN_W,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
  }

  private nextStep(builder: () => void): void {
    // distruggi i children fuori dal dispatch dell'input (bug intermittenti Phaser)
    this.time.delayedCall(0, () => {
      this.closeNormsOverlay();
      this.children.list.slice().forEach((child) => child.destroy());
      addNoiseOverlay(this, 0.4);
      builder();
    });
  }

  // ------------------------------------------------------------ passo 1
  private showClassificationStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header(L().ui.decision.step1, L().ui.decision.question1);
    this.add
      .text(cx, 168, L().ui.decision.contextNote, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 880 }, align: 'center' }))
      .setOrigin(0.5, 0);
    // microcopy: la decisione è distinta dal rapporto e si svolge in 4 passi
    this.add
      .text(cx, GAME_HEIGHT - 110, L().ui.decision.processNote, textStyle(12, COLOR_STR.accentText, { wordWrap: { width: 900 }, align: 'center' }))
      .setOrigin(0.5);

    const pick = (cls: Classification): void => {
      if (this.classification !== null) return;
      this.classification = cls;
      this.persistDraft('measure');
      AnalyticsSystem.track('classification_selected', { caseId: this.caseData.id, classification: cls });
      AudioSystem.registerDecision();
      this.nextStep(() => this.showMeasureStep());
    };

    CLASSIFICATIONS.forEach((cls, i) => {
      new Button(this, cx, 228 + i * 62, `${i + 1}. ${L().classifications[cls].toUpperCase()}`, () => pick(cls), { width: 460 });
    });
    this.addTermsButton(
      CLASSIFICATIONS.map((c) => ({ label: L().classifications[c], glossaryId: CLASSIFICATION_TERMS[c] }))
    );

    const toEvidence = (): void => {
      this.scene.start('Evidence', { caseId: this.caseData.id });
    };
    this.bindNumberKeys(CLASSIFICATIONS.length, (i) => pick(CLASSIFICATIONS[i]), toEvidence);
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys5, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.backBtn = this.addBackButton(L().ui.evidence.backToEvidence, toEvidence);
  }

  // ------------------------------------------------------------ passo 2
  private showMeasureStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header(L().ui.decision.step2, L().ui.decision.question2);
    this.add
      .text(cx, 170, fmt(L().ui.decision.recorded, { value: L().classifications[this.classification!].toUpperCase() }), textStyle(12, COLOR_STR.accentText))
      .setOrigin(0.5);

    const pick = (measure: Measure): void => {
      if (this.measure !== null) return;
      this.measure = measure;
      this.persistDraft('subject');
      AnalyticsSystem.track('measure_selected', { caseId: this.caseData.id, measure });
      AudioSystem.registerDecision();
      this.nextStep(() => this.showSubjectStep());
    };

    MEASURES.forEach((measure, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? cx - 240 : cx + 240;
      new Button(this, i === MEASURES.length - 1 ? cx : x, 224 + row * 62, `${i + 1}. ${L().measures[measure].toUpperCase()}`, () => pick(measure), { width: 440, fontSize: 14 });
    });
    const back = (): void => this.stepBack(() => { this.classification = null; }, () => this.showClassificationStep());
    this.bindNumberKeys(MEASURES.length, (i) => pick(MEASURES[i]), back);
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys7, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.backBtn = this.addBackButton(L().ui.decision.stepBack, back);
  }

  // ------------------------------------------------------------ passo 3
  private showSubjectStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header(L().ui.decision.step3, L().ui.decision.question3);

    const pick = (subject: ResponsibleSubject): void => {
      if (this.subject !== null) return;
      this.subject = subject;
      this.persistDraft('motivation');
      AudioSystem.registerDecision();
      this.nextStep(() => this.showMotivationStep());
    };

    SUBJECTS.forEach((subject, i) => {
      new Button(this, cx, 210 + i * 62, `${i + 1}. ${L().ui.subjects[subject].toUpperCase()}`, () => pick(subject), { width: 560, fontSize: 14 });
    });
    this.addTermsButton(SUBJECTS.map((x) => ({ label: L().ui.subjects[x], glossaryId: SUBJECT_TERMS[x] })));

    const back = (): void => this.stepBack(() => { this.measure = null; }, () => this.showMeasureStep());
    this.bindNumberKeys(SUBJECTS.length, (i) => pick(SUBJECTS[i]), back);
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys5, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.backBtn = this.addBackButton(L().ui.decision.stepBack, back);
  }

  // ------------------------------------------------------------ passo 4
  private showMotivationStep(): void {
    const cx = GAME_WIDTH / 2;
    const texts = (L().cases as Record<string, { motivations: string[] }>)[this.caseData.id];
    this.header(L().ui.decision.step4, L().ui.decision.question4);

    const pick = (i: number): void => {
      if (this.motivation !== null) return;
      this.motivation = i;
      this.persistDraft('summary');
      AudioSystem.registerDecision();
      this.nextStep(() => this.showSummaryStep());
    };

    texts.motivations.forEach((motivation, i) => {
      // bottone largo con etichetta vuota: il testo multilinea è sovrapposto
      new Button(this, cx, 230 + i * 110, '', () => pick(i), { width: 880, height: 92, fontSize: 13 });
      this.add
        .text(cx - 410, 230 + i * 110, `${i + 1}. ${motivation}`, textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: 800 }, lineSpacing: 5 }))
        .setOrigin(0, 0.5);
    });
    const back = (): void => this.stepBack(() => { this.subject = null; }, () => this.showSubjectStep());
    this.bindNumberKeys(3, pick, back);
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys3, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.backBtn = this.addBackButton(L().ui.decision.stepBack, back);
  }

  // ------------------------------------------------------------ passo 5
  /**
   * RIEPILOGO E FIRMA (U03).
   *
   * Prima scegliere la motivazione FIRMAVA: il quarto bottone chiamava
   * direttamente resolve(), cioè archiviava il rapporto, muoveva gli
   * indicatori e chiudeva il caso. Chi cliccava per leggere meglio
   * l'opzione aveva già consegnato.
   *
   * Ora le due cose sono separate: qui si rivede ciò che si è deciso e si
   * firma con un gesto suo. La firma richiede che il rapporto sia COMPLETO,
   * non che sia giusto — la valutazione arriva dopo, e un rapporto sbagliato
   * resta giocabile e discutibile.
   */
  private showSummaryStep(): void {
    const cx = GAME_WIDTH / 2;
    const t = L().ui.decision;
    const texts = (L().cases as Record<string, { motivations: string[] }>)[this.caseData.id];
    this.header(t.step5, t.question5, false);

    const rows: Array<[string, string]> = [
      [t.summary.classification, L().classifications[this.classification!]],
      [t.summary.measure, L().measures[this.measure!]],
      [t.summary.subject, L().ui.subjects[this.subject!]],
      [t.summary.clues, this.citedClues.map((i) => String(i + 1)).join(', ')],
      [t.summary.motivation, texts.motivations[this.motivation!]]
    ];
    let y = 196;
    for (const [label, value] of rows) {
      this.add.text(cx - 430, y, label.toUpperCase(), textStyle(11.5, COLOR_STR.paperDim));
      const v = this.add.text(cx - 430, y + 18, value, textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: 860 }, lineSpacing: 4 }));
      y += 26 + v.height;
    }

    // L'avviso sta SOPRA la fila della fiducia, non sotto: buildConfidenceRow
    // disegna a y=566 e qui finiva esattamente addosso, in entrambe le lingue.
    this.add
      .text(cx, SIGN_NOTE_Y, t.signNote, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: 880 }, align: 'center' }))
      .setOrigin(0.5);

    const back = (): void => this.stepBack(() => { this.motivation = null; }, () => this.showMotivationStep());
    // Nessun tasto numerico qui: l'unico gesto è firmare, e va compiuto
    // apposta. bindNumberKeys serve comunque per riagganciare il ritorno.
    this.bindNumberKeys(0, () => undefined, back);
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (!this.overlay && !this.contextOverlay.isOpen && !this.caseNormOverlay.isOpen) this.sign();
    });

    new Button(this, cx, GAME_HEIGHT - 104, t.sign, () => this.sign(), { width: 460, height: 48, fontSize: 14 });
    this.add.text(cx, GAME_HEIGHT - 70, t.signHint, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.backBtn = this.addBackButton(t.stepBack, back);
    this.buildConfidenceRow(cx);
  }

  /**
   * Firma: consentita solo su un rapporto completo, e una volta sola. La
   * guardia `resolved` in resolve() copre già il doppio clic; questa
   * verifica la completezza, che è l'altra metà di U03.
   */
  private sign(): void {
    if (this.resolved) return;
    if (this.classification === null || this.measure === null || this.subject === null || this.motivation === null) return;
    this.resolve(this.motivation);
  }

  /**
   * Fiducia dichiarata (2.0 — mission §10.4): scala discreta FACOLTATIVA,
   * selezionabile con puntatore o tasti 7–9, mostrata sopra la firma. Non
   * blocca il rapporto e non entra mai nel calcolo del punteggio: alimenta
   * solo la riga di calibrazione nel rapporto e il debrief.
   */
  private buildConfidenceRow(cx: number): void {
    const t = L().learningLayer.confidence;
    const y = CONFIDENCE_ROW_Y;
    // L'etichetta sta SOPRA i bottoni, non sulla loro riga: in italiano e in
    // inglese è lunga abbastanza da arrivare sotto il primo ("7. Poco"), e
    // le due scritte si sovrapponevano. Difetto che c'era già quando questa
    // fila stava sul passo della motivazione; è emerso misurando la scena.
    this.add.text(cx - 430, y - 28, `${t.label} ${t.optionalTag}`, textStyle(11.5, COLOR_STR.paperDim)).setOrigin(0, 0.5);
    const status = this.add.text(cx + 430, y + 26, '', textStyle(11.5, COLOR_STR.accentText)).setOrigin(1, 0.5);
    const levels: Array<{ level: ConfidenceLevel; label: string }> = [
      { level: 1, label: t.levels.low },
      { level: 2, label: t.levels.mid },
      { level: 3, label: t.levels.high }
    ];
    const pick = (level: ConfidenceLevel, label: string): void => {
      this.confidence = level;
      this.persistDraft('summary');
      status.setText(fmt(t.recorded, { level: label }));
    };
    // Una fiducia già dichiarata e poi ripresa da una bozza deve rileggersi:
    // senza questo il giocatore la ritroverebbe salvata ma invisibile, e la
    // ridichiarerebbe convinto di non averlo fatto.
    const restored = levels.find((l) => l.level === this.confidence);
    if (restored) status.setText(fmt(t.recorded, { level: restored.label }));

    levels.forEach(({ level, label }, i) => {
      new Button(this, cx + 150 + i * 130, y, `${7 + i}. ${label}`, () => pick(level, label), { width: 118, height: 32, fontSize: 11, variant: 'ghost' });
    });
    (['SEVEN', 'EIGHT', 'NINE'] as const).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => {
        if (!this.overlay && !this.contextOverlay.isOpen && !this.caseNormOverlay.isOpen && !this.resolved) {
          pick(levels[i].level, levels[i].label);
        }
      });
    });
  }

  /**
   * AIUTO CONTESTUALE (U05): che cosa vogliono dire le opzioni di questo
   * passo, senza uscire dal fascicolo.
   *
   * Le definizioni esistevano già nel glossario, ma in una schermata a
   * parte raggiungibile solo dalla mappa: per leggerle bisognava lasciare
   * la decisione. Qui è un overlay dentro la scena, come l'archivio norme,
   * quindi consultarlo non costa nulla — e con le bozze non costerebbe
   * comunque più il lavoro fatto, ma costerebbe il filo del ragionamento.
   *
   * Un'opzione senza voce di glossario NON viene inventata: mostra perché
   * non ce l'ha. Vedi il commento in termHints.ts.
   */
  private toggleTermsOverlay(options: Array<{ label: string; glossaryId: string | null }>): void {
    if (this.overlay) {
      this.closeNormsOverlay();
      return;
    }
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const t = L().ui.decision;
    const container = this.add.container(0, 0).setDepth(80);
    container.add(
      this.add
        .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.86)
        .setInteractive()
        .on('pointerdown', () => this.closeNormsOverlay())
    );
    // Un foglio con un bordo, non testo sospeso sul fondo scurito: senza, le
    // definizioni si leggevano sopra l'intestazione del passo rimasta dietro.
    // Il foglio viene dimensionato DOPO aver misurato le definizioni: le
    // opzioni non sono sempre cinque e i testi vanno a capo in modo diverso
    // nelle due lingue, quindi un'altezza fissa lascerebbe un vuoto qui e
    // taglierebbe là.
    const TOP = cy - 214;
    const sheet = this.add.rectangle(cx, cy, 960, 100, COLORS.night, 0.96).setStrokeStyle(1, COLORS.iron);
    container.add(sheet);
    container.add(this.add.text(cx, TOP, t.termsTitle, textStyle(15, COLOR_STR.accentText)).setOrigin(0.5));

    let y = TOP + 36;
    const read: Array<{ text: string }> = [{ text: t.termsHint }];
    for (const opt of options) {
      const entry = opt.glossaryId
        ? (L().glossary.entries as Record<string, { term: string; definition: string }>)[opt.glossaryId]
        : undefined;
      const title = this.add.text(cx - 440, y, opt.label.toUpperCase(), textStyle(12.5, COLOR_STR.paper));
      const body = this.add.text(cx - 440, y + 20, entry ? entry.definition : t.termsNoEntry,
        textStyle(12, entry ? COLOR_STR.paperDim : COLOR_STR.warning, { wordWrap: { width: 880 }, lineSpacing: 3 }));
      container.add([title, body]);
      read.push({ text: `${opt.label} — ${entry ? entry.definition : t.termsNoEntry}` });
      y += 34 + body.height;
    }
    const hint = this.add
      .text(cx, y + 18, t.termsHint, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: 900 }, align: 'center' }))
      .setOrigin(0.5);
    container.add(hint);
    const bottom = hint.y + hint.height / 2 + 24;
    sheet.setSize(960, bottom - (TOP - 28)).setPosition(cx, (TOP - 28 + bottom) / 2);
    ReadingLayer.setScene(t.termsTitle, read);
    this.overlay = container;
  }

  /** Bottone dell'aiuto contestuale, nella stessa posizione in ogni passo. */
  private addTermsButton(options: Array<{ label: string; glossaryId: string | null }>): void {
    // Terza riga della colonna in alto a destra: sopra ci sono già
    // "consulta norme" (centro 36) e "norma del caso" (76). A 76 questo
    // bottone finiva esattamente sul secondo, in entrambe le lingue.
    this.termsBtn = new Button(this, GAME_WIDTH - 130, 116, L().ui.decision.termsButton, () => this.toggleTermsOverlay(options), {
      width: 210,
      height: 34,
      fontSize: 11.5,
      variant: 'ghost'
    });
  }

  // ----------------------------------------------------- overlay norme
  private toggleNormsOverlay(): void {
    if (this.overlay) {
      this.closeNormsOverlay();
      return;
    }
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const container = this.add.container(0, 0).setDepth(80);
    const shade = this.add
      .rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
      .setInteractive()
      .on('pointerdown', () => this.closeNormsOverlay());
    container.add(shade);

    const unlocked = NormSystem.unlocked();
    if (unlocked.length === 0) {
      const empty = this.add.text(cx, cy, L().ui.decision.normsEmpty, textStyle(14, COLOR_STR.paperDim)).setOrigin(0.5);
      container.add(empty);
    } else {
      unlocked.slice(0, 6).forEach((norm, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const card = new NormCardView(this, cx + (col - 1) * 410, cy - 110 + row * 230, NormSystem.view(norm.id), {
          width: 380,
          height: 200,
          compact: true
        });
        card.setInteractive(); // consuma il click: chiude solo il fondo
        container.add(card);
      });
    }
    const hint = this.add
      .text(cx, GAME_HEIGHT - 110, L().ui.decision.normsHint, textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);
    container.add(hint);
    this.overlay = container;
  }

  private closeNormsOverlay(): void {
    this.overlay?.destroy();
    this.overlay = undefined;
    this.syncStepReading();
  }

  // ------------------------------------------------------------ esito
  private resolve(motivationIndex: number): void {
    if (this.resolved) return; // un solo rapporto per fascicolo
    this.resolved = true;

    const result = evaluateReport({
      caseData: this.caseData,
      citedClues: this.citedClues,
      classification: this.classification!,
      measure: this.measure!,
      subject: this.subject!,
      motivationIndex
    }, StateManager.difficulty);

    if (result.outcome === 'non_conforme') AudioSystem.errorContestable();
    else if (result.outcome === 'conforme') AudioSystem.stampConforme();
    else AudioSystem.alert();

    // commit dell'esito: indicatori, caso completato, rapporto archiviato
    const before = StateManager.indicators;
    const after = StateManager.resolveCase(this.caseData.id, this.caseData.normId, result.quality);
    // fiducia dichiarata (facoltativa): annotazione locale, mai nel punteggio
    if (this.confidence !== null) {
      StateManager.saveCaseMeta(this.caseData.id, { confidence: this.confidence });
    }
    StateManager.saveCaseReport(this.caseData.id, {
      outcome: result.outcome,
      dominantError: result.dominantError,
      classification: this.classification!,
      measure: this.measure!,
      subject: this.subject!,
      motivationIndex,
      citedClues: this.citedClues,
      incidentChoice: this.incidentChoice
    });
    AnalyticsSystem.track('case_completed', {
      caseId: this.caseData.id,
      completedCasesCount: StateManager.completedCount()
    });
    AnalyticsSystem.track('case_result', {
      caseId: this.caseData.id,
      result: result.quality,
      classification: this.classification!,
      measure: this.measure!,
      selectedClueCount: this.citedClues.length
    });

    this.scene.start('Report', {
      caseId: this.caseData.id,
      citedClues: this.citedClues,
      classification: this.classification,
      measure: this.measure,
      subject: this.subject,
      motivationIndex,
      incidentChoice: this.incidentChoice,
      result,
      before,
      after
    });
  }
}

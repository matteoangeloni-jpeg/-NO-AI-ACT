import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData, Classification, IncidentChoice, Measure, ResponsibleSubject } from '../data/types';
import { evaluateReport } from '../systems/ReportSystem';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { NormSystem } from '../systems/NormSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { CaseContextOverlay } from '../ui/CaseContextOverlay';
import { NormCardView } from '../ui/NormCard';
import { L, fmt } from '../i18n';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

const CLASSIFICATIONS: Classification[] = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
const MEASURES: Measure[] = ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'];
const SUBJECTS: ResponsibleSubject[] = ['provider', 'deployer', 'autorita', 'responsabile_umano', 'fornitore_esterno'];
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
  private citedClues: number[] = [];
  private incidentChoice?: IncidentChoice;
  private resolved = false;
  private overlay?: Phaser.GameObjects.Container;
  private contextOverlay!: CaseContextOverlay;

  constructor() {
    super('Decision');
  }

  init(data: { caseId: string; citedClues?: number[]; incidentChoice?: IncidentChoice }): void {
    this.caseData = getCase(data.caseId);
    this.classification = null;
    this.measure = null;
    this.subject = null;
    this.citedClues = data.citedClues ?? [];
    this.incidentChoice = data.incidentChoice;
    this.resolved = false; // le istanze di scena vengono riusate tra start()
    this.overlay = undefined;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    AudioSystem.crossfadeToTheme(this.caseData.id);
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);
    this.contextOverlay = new CaseContextOverlay(this, this.caseData.id, 'closeToDecision');
    this.showClassificationStep();
  }

  private header(step: string, question: string): void {
    const cx = GAME_WIDTH / 2;
    this.add
      .text(cx, 56, fmt(L().ui.case.fileLabel, { code: this.caseData.fileCode }), textStyle(13, COLOR_STR.alertText))
      .setOrigin(0.5);
    this.add.text(cx, 82, step, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 122, question, textStyle(19, COLOR_STR.paper)).setOrigin(0.5);
    this.add.rectangle(cx, 150, 900, 1, COLORS.iron);
    // archivio norme consultabile in ogni passo della decisione
    new Button(this, GAME_WIDTH - 130, 36, L().ui.decision.normsButton, () => this.toggleNormsOverlay(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
    // read-only "Rivedi contesto" — consultabile in ogni passo, non tocca lo stato
    new Button(this, 130, 36, L().ui.context.button, () => this.contextOverlay.toggle(), {
      width: 210,
      height: 36,
      fontSize: 12,
      variant: 'ghost'
    });
  }

  /** Associa i tasti numerici 1..n alle opzioni correnti. */
  private bindNumberKeys(count: number, onPick: (index: number) => void): void {
    this.input.keyboard?.removeAllListeners();
    NUMBER_KEYS.slice(0, count).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => {
        // ignore number keys while a read-only overlay (norms / context) is open
        if (!this.overlay && !this.contextOverlay.isOpen) onPick(i);
      });
    });
    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.contextOverlay.isOpen) this.contextOverlay.close();
      else this.closeNormsOverlay();
    });
  }

  private nextStep(builder: () => void): void {
    // distruggi i children fuori dal dispatch dell'input (bug intermittenti Phaser)
    this.time.delayedCall(0, () => {
      this.closeNormsOverlay();
      this.children.list.slice().forEach((child) => child.destroy());
      this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);
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

    const pick = (cls: Classification): void => {
      if (this.classification !== null) return;
      this.classification = cls;
      AnalyticsSystem.track('classification_selected', { caseId: this.caseData.id, classification: cls });
      AudioSystem.confirm();
      this.nextStep(() => this.showMeasureStep());
    };

    CLASSIFICATIONS.forEach((cls, i) => {
      new Button(this, cx, 228 + i * 62, `${i + 1}. ${L().classifications[cls].toUpperCase()}`, () => pick(cls), { width: 460 });
    });
    this.bindNumberKeys(CLASSIFICATIONS.length, (i) => pick(CLASSIFICATIONS[i]));
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys5, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);

    new Button(this, 90, GAME_HEIGHT - 36, L().ui.evidence.backToEvidence, () => this.scene.start('Evidence', { caseId: this.caseData.id }), { width: 150, height: 36, fontSize: 12, variant: 'ghost' });
  }

  // ------------------------------------------------------------ passo 2
  private showMeasureStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header(L().ui.decision.step2, L().ui.decision.question2);
    this.add
      .text(cx, 170, fmt(L().ui.decision.recorded, { value: L().classifications[this.classification!].toUpperCase() }), textStyle(12, COLOR_STR.accent))
      .setOrigin(0.5);

    const pick = (measure: Measure): void => {
      if (this.measure !== null) return;
      this.measure = measure;
      AnalyticsSystem.track('measure_selected', { caseId: this.caseData.id, measure });
      AudioSystem.confirm();
      this.nextStep(() => this.showSubjectStep());
    };

    MEASURES.forEach((measure, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? cx - 240 : cx + 240;
      new Button(this, i === MEASURES.length - 1 ? cx : x, 224 + row * 62, `${i + 1}. ${L().measures[measure].toUpperCase()}`, () => pick(measure), { width: 440, fontSize: 14 });
    });
    this.bindNumberKeys(MEASURES.length, (i) => pick(MEASURES[i]));
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys7, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
  }

  // ------------------------------------------------------------ passo 3
  private showSubjectStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header(L().ui.decision.step3, L().ui.decision.question3);

    const pick = (subject: ResponsibleSubject): void => {
      if (this.subject !== null) return;
      this.subject = subject;
      AudioSystem.confirm();
      this.nextStep(() => this.showMotivationStep());
    };

    SUBJECTS.forEach((subject, i) => {
      new Button(this, cx, 210 + i * 62, `${i + 1}. ${L().ui.subjects[subject].toUpperCase()}`, () => pick(subject), { width: 560, fontSize: 14 });
    });
    this.bindNumberKeys(SUBJECTS.length, (i) => pick(SUBJECTS[i]));
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys5, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
  }

  // ------------------------------------------------------------ passo 4
  private showMotivationStep(): void {
    const cx = GAME_WIDTH / 2;
    const texts = (L().cases as Record<string, { motivations: string[] }>)[this.caseData.id];
    this.header(L().ui.decision.step4, L().ui.decision.question4);

    texts.motivations.forEach((motivation, i) => {
      // bottone largo con etichetta vuota: il testo multilinea è sovrapposto
      new Button(this, cx, 230 + i * 110, '', () => this.resolve(i), { width: 880, height: 92, fontSize: 13 });
      this.add
        .text(cx - 410, 230 + i * 110, `${i + 1}. ${motivation}`, textStyle(13.5, COLOR_STR.paper, { wordWrap: { width: 800 }, lineSpacing: 5 }))
        .setOrigin(0, 0.5);
    });
    this.bindNumberKeys(3, (i) => this.resolve(i));
    this.add.text(cx, GAME_HEIGHT - 80, L().ui.decision.keys3, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
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

    if (result.outcome === 'non_conforme') AudioSystem.error();
    else if (result.outcome === 'conforme') AudioSystem.confirm();
    else AudioSystem.alert();

    // commit dell'esito: indicatori, caso completato, rapporto archiviato
    const before = StateManager.indicators;
    const after = StateManager.resolveCase(this.caseData.id, this.caseData.normId, result.quality);
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

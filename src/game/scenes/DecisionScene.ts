import Phaser from 'phaser';
import { CLASSIFICATION_LABELS, MEASURE_LABELS, getCase } from '../data/cases';
import type { CaseData, Classification, Measure } from '../data/types';
import { evaluateDecision } from '../systems/CaseSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

const NUMBER_KEYS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'];

const CLASSIFICATIONS: Classification[] = ['vietata', 'alto_rischio', 'trasparenza', 'basso_rischio', 'non_rilevante'];
const MEASURES: Measure[] = ['blocco', 'oversight', 'audit', 'informare', 'etichettare', 'dati_logging', 'nessuna'];

/**
 * Decisione in due passi: prima la classificazione del sistema secondo
 * la piramide del rischio, poi la misura correttiva.
 */
export class DecisionScene extends Phaser.Scene {
  private caseData!: CaseData;
  private classification: Classification | null = null;

  constructor() {
    super('Decision');
  }

  init(data: { caseId: string }): void {
    this.caseData = getCase(data.caseId);
    this.classification = null;
    this.resolved = false; // le istanze di scena vengono riusate tra start()
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);
    this.showClassificationStep();
  }

  private header(step: string, question: string): void {
    const cx = GAME_WIDTH / 2;
    this.add.text(cx, 56, `FASCICOLO ${this.caseData.fileCode} — ${this.caseData.title.toUpperCase()}`, textStyle(13, COLOR_STR.alertText)).setOrigin(0.5);
    this.add.text(cx, 82, step, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 122, question, textStyle(19, COLOR_STR.paper)).setOrigin(0.5);
    this.add.rectangle(cx, 150, 900, 1, COLORS.iron);
  }

  /** Associa i tasti numerici 1..n alle opzioni correnti. */
  private bindNumberKeys(count: number, onPick: (index: number) => void): void {
    this.input.keyboard?.removeAllListeners();
    NUMBER_KEYS.slice(0, count).forEach((key, i) => {
      this.input.keyboard?.on(`keydown-${key}`, () => onPick(i));
    });
  }

  private showClassificationStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header('DECISIONE 1 DI 2 — CLASSIFICAZIONE', 'Come si qualifica questo sistema rispetto all\'AI Act?');
    this.add
      .text(
        cx,
        170,
        'Nel regolamento, il rischio non dipende solo dalla tecnologia, ma dal contesto d\'uso, dalla finalità e dagli effetti sulle persone.',
        textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 880 }, align: 'center' })
      )
      .setOrigin(0.5, 0);

    const pick = (cls: Classification): void => {
      if (this.classification !== null) return; // ignora doppi input
      this.classification = cls;
      AudioSystem.confirm();
      // distruggi i children fuori dal dispatch dell'input: distruggere
      // oggetti interattivi dentro il loro stesso handler pointerdown è
      // territorio da bug intermittente in Phaser
      this.time.delayedCall(0, () => {
        this.children.list.slice().forEach((child) => child.destroy());
        this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);
        this.showMeasureStep();
      });
    };

    CLASSIFICATIONS.forEach((cls, i) => {
      new Button(this, cx, 230 + i * 64, `${i + 1}. ${CLASSIFICATION_LABELS[cls].toUpperCase()}`, () => pick(cls), { width: 460 });
    });
    this.bindNumberKeys(CLASSIFICATIONS.length, (i) => pick(CLASSIFICATIONS[i]));
    this.add
      .text(cx, GAME_HEIGHT - 80, 'tastiera: tasti 1–5 per selezionare', textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);

    new Button(this, 90, GAME_HEIGHT - 36, '◂ REPERTI', () => this.scene.start('Evidence', { caseId: this.caseData.id }), { width: 150, height: 36, fontSize: 12, variant: 'ghost' });
  }

  private showMeasureStep(): void {
    const cx = GAME_WIDTH / 2;
    this.header('DECISIONE 2 DI 2 — MISURA CORRETTIVA', 'Quale misura dispone l\'ispettorato?');
    this.add
      .text(cx, 170, `Classificazione registrata: ${CLASSIFICATION_LABELS[this.classification!].toUpperCase()}`, textStyle(12, COLOR_STR.accent))
      .setOrigin(0.5);

    MEASURES.forEach((measure, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? cx - 240 : cx + 240;
      new Button(this, i === MEASURES.length - 1 && MEASURES.length % 2 === 1 ? cx : x, 230 + row * 64, `${i + 1}. ${MEASURE_LABELS[measure].toUpperCase()}`, () => this.resolve(measure), { width: 440, fontSize: 14 });
    });
    this.bindNumberKeys(MEASURES.length, (i) => this.resolve(MEASURES[i]));
    this.add
      .text(cx, GAME_HEIGHT - 80, 'tastiera: tasti 1–7 per selezionare', textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0.5);
  }

  private resolved = false;

  private resolve(measure: Measure): void {
    if (this.resolved) return; // un solo esito per fascicolo
    this.resolved = true;
    const quality = evaluateDecision(this.caseData, this.classification!, measure);
    if (quality === 'wrong') AudioSystem.error();
    else if (quality === 'partial') AudioSystem.alert();
    else AudioSystem.confirm();
    // il commit dell'esito avviene qui, non nella scena di conseguenza:
    // un refresh su Consequence non deve poter salvare due volte né
    // dipendere da side effect dentro create()
    const before = StateManager.indicators;
    const after = StateManager.resolveCase(this.caseData.id, this.caseData.normId, quality);
    this.scene.start('Consequence', {
      caseId: this.caseData.id,
      classification: this.classification,
      measure,
      quality,
      before,
      after
    });
  }
}

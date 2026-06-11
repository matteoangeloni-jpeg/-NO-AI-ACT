import Phaser from 'phaser';
import { CLASSIFICATION_LABELS, MEASURE_LABELS, getCase } from '../data/cases';
import type { CaseData, Classification, Measure } from '../data/types';
import { evaluateDecision } from '../systems/CaseSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Button } from '../ui/Button';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

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
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);
    this.showClassificationStep();
  }

  private header(step: string, question: string): void {
    const cx = GAME_WIDTH / 2;
    this.add.text(cx, 56, `FASCICOLO ${this.caseData.fileCode} — ${this.caseData.title.toUpperCase()}`, textStyle(13, COLOR_STR.alert)).setOrigin(0.5);
    this.add.text(cx, 82, step, textStyle(11, COLOR_STR.paperDim)).setOrigin(0.5);
    this.add.text(cx, 122, question, textStyle(19, COLOR_STR.paper)).setOrigin(0.5);
    this.add.rectangle(cx, 150, 900, 1, COLORS.iron);
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

    CLASSIFICATIONS.forEach((cls, i) => {
      new Button(this, cx, 230 + i * 64, CLASSIFICATION_LABELS[cls].toUpperCase(), () => {
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
      }, { width: 460 });
    });

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
      new Button(this, i === MEASURES.length - 1 && MEASURES.length % 2 === 1 ? cx : x, 230 + row * 64, MEASURE_LABELS[measure].toUpperCase(), () => this.resolve(measure), { width: 440, fontSize: 14 });
    });
  }

  private resolve(measure: Measure): void {
    const quality = evaluateDecision(this.caseData, this.classification!, measure);
    if (quality === 'wrong') AudioSystem.error();
    else if (quality === 'partial') AudioSystem.alert();
    else AudioSystem.confirm();
    this.scene.start('Consequence', {
      caseId: this.caseData.id,
      classification: this.classification,
      measure,
      quality
    });
  }
}

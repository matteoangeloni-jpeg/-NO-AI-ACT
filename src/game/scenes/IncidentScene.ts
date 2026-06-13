import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type { CaseData, IncidentChoice } from '../data/types';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { TypewriterText } from '../ui/TypewriterText';
import { L, caseText } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

const CHOICES: IncidentChoice[] = ['document', 'suspend', 'minimize'];
const NUMBER_KEYS = ['ONE', 'TWO', 'THREE'];

/**
 * Evento imprevisto: un telex urgente interrompe l'indagine tra i reperti e
 * la decisione. La risposta modifica leggermente gli indicatori e viene
 * protocollata nel rapporto finale del caso.
 */
export class IncidentScene extends Phaser.Scene {
  private caseData!: CaseData;
  private citedClues: number[] = [];
  private answered = false;

  constructor() {
    super('Incident');
  }

  init(data: { caseId: string; citedClues: number[] }): void {
    this.caseData = getCase(data.caseId);
    this.citedClues = data.citedClues;
    this.answered = false;
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const incident = caseText(this.caseData.id).incident;
    if (!incident) {
      this.scene.start('Decision', { caseId: this.caseData.id, citedClues: this.citedClues });
      return;
    }
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(200, 0, 0, 0);
    AudioSystem.alert();
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.5);

    new Panel(this, cx, GAME_HEIGHT / 2 - 40, 860, 380);
    this.add.text(cx, 132, L().ui.incident.header, textStyle(14, COLOR_STR.alertText)).setOrigin(0.5);
    this.add.text(cx, 168, incident.title, textStyle(24, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);

    const body = new TypewriterText(this, cx - 390, 210, 15, COLOR_STR.paper, 780);
    body.write(incident.text);
    this.input.on('pointerdown', () => body.skip());

    const labels = [incident.options.document, incident.options.suspend, incident.options.minimize];
    const pick = (i: number): void => {
      if (this.answered) return;
      this.answered = true;
      const choice = CHOICES[i];
      const delta = this.caseData.incidentDeltas?.[choice];
      if (delta) StateManager.applyIndicatorDelta(delta);
      AudioSystem.confirm();
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Decision', { caseId: this.caseData.id, citedClues: this.citedClues, incidentChoice: choice })
      );
    };

    labels.forEach((label, i) => {
      new Button(this, cx, 420 + i * 58, `${i + 1}. ${label.toUpperCase()}`, () => pick(i), { width: 720, height: 48, fontSize: 13 });
    });
    NUMBER_KEYS.forEach((key, i) => this.input.keyboard?.on(`keydown-${key}`, () => pick(i)));
    this.add.text(cx, GAME_HEIGHT - 66, L().ui.incident.hint, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);
  }
}

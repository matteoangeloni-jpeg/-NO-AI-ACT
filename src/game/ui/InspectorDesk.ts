import Phaser from 'phaser';
import { Button } from './Button';
import { COLORS, COLOR_STR, GAME_WIDTH, textStyle } from './theme';

/**
 * Geometria della barra, dichiarata invece che ripetuta.
 *
 * Serve fuori di qui: un avviso che compare in alto deve sapere dove
 * finisce la barra, o ci atterra sopra — ed è successo, con il toast dei
 * reperti che copriva due pulsanti della postazione.
 */
export const DESK_Y = 30;
export const DESK_HEIGHT = 42;
export const DESK_BOTTOM = DESK_Y + DESK_HEIGHT / 2;

export interface InspectorDeskOptions {
  caseLabel: string;
  phaseLabel: string;
  status?: string;
}

export interface InspectorDeskActionOptions {
  width?: number;
  disabled?: boolean;
}

/**
 * Barra persistente della pratica. Tiene nello stesso posto gli strumenti
 * consultivi mentre il giocatore passa dai reperti alla decisione.
 */
export class InspectorDesk extends Phaser.GameObjects.Container {
  private readonly actions: Array<{ button: Button; width: number }> = [];
  private readonly statusText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, options: InspectorDeskOptions) {
    super(scene, 0, 0);

    const y = DESK_Y;
    const shell = scene.add
      .rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 28, DESK_HEIGHT, COLORS.carbon, 0.96)
      .setStrokeStyle(1, COLORS.iron);
    const signal = scene.add.rectangle(22, y, 3, 28, COLORS.alert, 0.9);
    const title = scene.add
      .text(32, 16, options.phaseLabel, textStyle(9.5, COLOR_STR.accentText, { fontStyle: 'bold' }))
      .setOrigin(0, 0.5);
    const file = scene.add
      .text(32, 34, options.caseLabel, textStyle(11, COLOR_STR.paper, { fontStyle: 'bold' }))
      .setOrigin(0, 0.5);
    this.statusText = scene.add
      .text(250, y, options.status ?? '', textStyle(10.5, COLOR_STR.paperDim))
      .setOrigin(0, 0.5);

    this.add([shell, signal, title, file, this.statusText]);
    this.setDepth(20);
    scene.add.existing(this);
  }

  addAction(
    label: string,
    onClick: () => void,
    options: InspectorDeskActionOptions = {}
  ): Button {
    const width = options.width ?? 128;
    const button = new Button(this.scene, 0, DESK_Y, label, onClick, {
      width,
      height: 30,
      fontSize: 10.5,
      variant: 'ghost',
      disabled: options.disabled ?? false
    });
    this.add(button);
    this.actions.push({ button, width });
    this.layoutActions();
    return button;
  }

  setStatus(status: string): void {
    this.statusText.setText(status);
  }

  private layoutActions(): void {
    let right = GAME_WIDTH - 22;
    for (let i = this.actions.length - 1; i >= 0; i -= 1) {
      const action = this.actions[i];
      action.button.setPosition(right - action.width / 2, DESK_Y);
      right -= action.width + 6;
    }
  }
}

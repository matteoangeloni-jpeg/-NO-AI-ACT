import Phaser from 'phaser';
import { createCityMap } from '../assets/procedural/createCityMap';
import { createIcons } from '../assets/procedural/createIcons';
import { createParticles } from '../assets/procedural/createParticles';
import { createDossierTextures } from '../assets/procedural/createDossierTextures';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Non ci sono file da scaricare: tutti gli asset sono generati qui.
 * La barra di caricamento scandisce i passi di generazione (e dà tono).
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);

    this.add.text(cx, cy - 60, 'SISTEMA CIVICO INTEGRATO', textStyle(14, COLOR_STR.paperDim)).setOrigin(0.5);
    const status = this.add.text(cx, cy + 34, '', textStyle(12, COLOR_STR.accent)).setOrigin(0.5);
    this.add.rectangle(cx, cy, 420, 14).setStrokeStyle(1, COLORS.iron);
    const fill = this.add.rectangle(cx - 208, cy, 0, 8, COLORS.accent).setOrigin(0, 0.5);

    const steps: [string, () => void][] = [
      ['generazione cartografia civica…', () => createCityMap(this, 'citymap', GAME_WIDTH, GAME_HEIGHT)],
      ['compilazione segnaletica…', () => createIcons(this)],
      ['calibrazione rumore di fondo…', () => createParticles(this)],
      ['apertura archivio fascicoli…', () => createDossierTextures(this)]
    ];

    let i = 0;
    const runStep = (): void => {
      if (i >= steps.length) {
        status.setText('accesso ispettorato: CONCESSO');
        this.time.delayedCall(350, () => this.scene.start('Title'));
        return;
      }
      const [label, fn] = steps[i];
      status.setText(label);
      fn();
      i += 1;
      fill.width = (416 * i) / steps.length;
      this.time.delayedCall(180, runStep);
    };
    runStep();
  }
}

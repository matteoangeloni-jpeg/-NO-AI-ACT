import Phaser from 'phaser';
import { COLORS } from './theme';

/** Pannello istituzionale: fondo scuro, bordo grigio ferro, angoli vivi. */
export class Panel extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    options: { fill?: number; stroke?: number; alpha?: number } = {}
  ) {
    super(scene, x, y);
    const bg = scene.add.rectangle(0, 0, width, height, options.fill ?? COLORS.night2, options.alpha ?? 0.92);
    const border = scene.add.rectangle(0, 0, width, height).setStrokeStyle(1, options.stroke ?? COLORS.iron);
    // dettaglio "fascicolo": tacche agli angoli
    const g = scene.add.graphics();
    g.lineStyle(2, options.stroke ?? COLORS.iron, 1);
    const hw = width / 2;
    const hh = height / 2;
    const t = 10;
    g.beginPath();
    g.moveTo(-hw, -hh + t); g.lineTo(-hw, -hh); g.lineTo(-hw + t, -hh);
    g.moveTo(hw - t, -hh); g.lineTo(hw, -hh); g.lineTo(hw, -hh + t);
    g.moveTo(hw, hh - t); g.lineTo(hw, hh); g.lineTo(hw - t, hh);
    g.moveTo(-hw + t, hh); g.lineTo(-hw, hh); g.lineTo(-hw, hh - t);
    g.strokePath();
    this.add([bg, border, g]);
    this.setSize(width, height);
    scene.add.existing(this);
  }
}

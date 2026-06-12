import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import type { NormCardData } from '../data/types';

const LEVEL_COLORS: Record<NormCardData['level'], { stroke: number; text: string }> = {
  'Pratica vietata': { stroke: COLORS.alert, text: COLOR_STR.alertText },
  'Alto rischio': { stroke: COLORS.warning, text: COLOR_STR.warning },
  Trasparenza: { stroke: COLORS.accent, text: COLOR_STR.accent },
  'Condizioni restrittive': { stroke: COLORS.alert, text: COLOR_STR.alertText }
};

/** Carta norma AI Act, usata sia nello sblocco sia nell'archivio. */
export class NormCardView extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    norm: NormCardData,
    options: { width?: number; height?: number; compact?: boolean } = {}
  ) {
    super(scene, x, y);
    const width = options.width ?? 560;
    const height = options.height ?? 420;
    const compact = options.compact ?? false;
    const lvl = LEVEL_COLORS[norm.level];

    const bg = scene.add.rectangle(0, 0, width, height, COLORS.night2, 0.98).setStrokeStyle(2, lvl.stroke);
    const header = scene.add.rectangle(0, -height / 2 + 26, width, 52, COLORS.carbon).setStrokeStyle(1, COLORS.iron);
    const icon = scene.add.image(-width / 2 + 34, -height / 2 + 26, norm.iconKey).setDisplaySize(30, 30);
    const levelTag = scene.add
      .text(width / 2 - 14, -height / 2 + 26, norm.level.toUpperCase(), textStyle(12, lvl.text))
      .setOrigin(1, 0.5);
    const title = scene.add
      .text(-width / 2 + 60, -height / 2 + 26, norm.title.toUpperCase(), textStyle(compact ? 12 : 15, COLOR_STR.paper, { wordWrap: { width: width - 200 } }))
      .setOrigin(0, 0.5);
    const reference = scene.add.text(
      -width / 2 + 20,
      -height / 2 + 64,
      norm.reference,
      textStyle(compact ? 12 : 12.5, COLOR_STR.accent, { wordWrap: { width: width - 40 } })
    );

    this.add([bg, header, icon, levelTag, title, reference]);

    if (!compact) {
      const explanation = scene.add.text(
        -width / 2 + 20,
        -height / 2 + 100,
        norm.explanation,
        textStyle(13, COLOR_STR.paper, { wordWrap: { width: width - 40 }, lineSpacing: 6 })
      );
      const fnLabel = scene.add.text(
        -width / 2 + 20,
        height / 2 - 130,
        'FUNZIONE DEMOCRATICA',
        textStyle(12, COLOR_STR.paperDim)
      );
      const fn = scene.add.text(
        -width / 2 + 20,
        height / 2 - 110,
        norm.democraticFunction,
        textStyle(12.5, COLOR_STR.ok, { wordWrap: { width: width - 40 }, lineSpacing: 5 })
      );
      const tags = scene.add.text(
        -width / 2 + 20,
        height / 2 - 44,
        norm.tags.map((t) => `#${t}`).join('  '),
        textStyle(12, COLOR_STR.paperDim)
      );
      const disclaimer = scene.add
        .text(width / 2 - 14, height / 2 - 12, 'versione didattica semplificata', textStyle(12, COLOR_STR.paperDim))
        .setOrigin(1, 1);
      this.add([explanation, fnLabel, fn, tags, disclaimer]);
    } else {
      const tags = scene.add.text(
        -width / 2 + 20,
        height / 2 - 32,
        norm.tags.map((t) => `#${t}`).join('  '),
        textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: width - 40 } })
      );
      this.add(tags);
    }

    this.setSize(width, height);
    scene.add.existing(this);
  }
}

/** Retro carta per gli slot non ancora sbloccati nell'archivio. */
export class LockedNormCard extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y);
    const bg = scene.add.rectangle(0, 0, width, height, COLORS.carbon, 0.9).setStrokeStyle(1, COLORS.iron);
    const lock = scene.add.image(0, -14, 'icon_lock').setDisplaySize(34, 34).setAlpha(0.6);
    const label = scene.add
      .text(0, 28, 'NORMA NON ANCORA\nACQUISITA', textStyle(12, COLOR_STR.paperDim, { align: 'center' }))
      .setOrigin(0.5);
    this.add([bg, lock, label]);
    this.setSize(width, height);
    scene.add.existing(this);
  }
}

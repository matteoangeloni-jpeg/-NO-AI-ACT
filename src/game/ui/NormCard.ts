import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import type { NormView } from '../data/types';
import { L } from '../i18n';
import { NORM_IDENTITIES, normIdentity, normIdentityBadge } from '../assets/procedural/normIdentity';

/**
 * LA CARTA PRENDE L'IDENTITÀ DALLA CATEGORIA, NON DAL LIVELLO.
 *
 * C'era una tabella locale con quattro colori, e `restrittivo` valeva rosso
 * come `vietata`: la biometria a condizioni e i modelli GPAI — due regimi
 * diversi che nei dati condividono quel livello — uscivano identici a un
 * divieto. Ora la tabella è una sola, in `normIdentity`, e le scene non
 * ripetono la deduzione.
 */

/** Carta norma AI Act, usata sia nello sblocco sia nell'archivio. */
export class NormCardView extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    norm: NormView,
    options: { width?: number; height?: number; compact?: boolean } = {}
  ) {
    super(scene, x, y);
    const width = options.width ?? 560;
    const height = options.height ?? 420;
    const compact = options.compact ?? false;
    const identita = normIdentity(norm);
    const tinta = NORM_IDENTITIES[identita].color;
    const bordo = Phaser.Display.Color.HexStringToColor(tinta).color;

    const bg = scene.add.rectangle(0, 0, width, height, COLORS.night2, 0.98).setStrokeStyle(2, bordo);
    const header = scene.add.rectangle(0, -height / 2 + 26, width, 52, COLORS.carbon).setStrokeStyle(1, COLORS.iron);
    const icon = scene.add.image(-width / 2 + 34, -height / 2 + 26, norm.iconKey).setDisplaySize(30, 30);
    /**
     * Il distintivo della categoria al posto dell'etichetta del livello.
     * Porta glifo, trattamento di fondo e colore — in quest'ordine — e per
     * `restrittivo` dice quale dei due regimi è, che l'etichetta del
     * livello non poteva dire.
     */
    const levelTag = normIdentityBadge(scene, 0, 0, identita, { height: 22, fontSize: 10.5 });
    levelTag.setPosition(width / 2 - 14 - levelTag.width / 2, -height / 2 + 26);
    const title = scene.add
      .text(-width / 2 + 60, -height / 2 + 26, norm.title.toUpperCase(), textStyle(compact ? 12 : 15, COLOR_STR.paper, { wordWrap: { width: width - 260 } }))
      .setOrigin(0, 0.5);
    const reference = scene.add.text(
      -width / 2 + 20,
      -height / 2 + 64,
      norm.reference,
      textStyle(compact ? 12 : 12.5, COLOR_STR.accentText, { wordWrap: { width: width - 40 } })
    );

    this.add([bg, header, icon, levelTag, title, reference]);

    if (!compact) {
      // flusso verticale misurato: spiegazione → "Non significa che…" →
      // funzione democratica, così la riga anti-frainteso non collide mai
      const innerW = width - 40;
      const leftX = -width / 2 + 20;
      let by = -height / 2 + 96;

      const explanation = scene.add.text(leftX, by, norm.explanation, textStyle(13, COLOR_STR.paper, { wordWrap: { width: innerW }, lineSpacing: 6 }));
      by += explanation.height + 10;

      const notMeaning = scene.add.text(leftX, by, norm.notMeaning, textStyle(12.5, COLOR_STR.warning, { wordWrap: { width: innerW }, lineSpacing: 5 }));
      by += notMeaning.height + 12;

      const fnLabel = scene.add.text(leftX, by, L().ui.normCard.democraticFunctionLabel, textStyle(12, COLOR_STR.paperDim));
      by += 18;
      const fn = scene.add.text(leftX, by, norm.democraticFunction, textStyle(12.5, COLOR_STR.ok, { wordWrap: { width: innerW }, lineSpacing: 5 }));

      const tags = scene.add.text(leftX, height / 2 - 44, norm.tags.map((t) => `#${t}`).join('  '), textStyle(12, COLOR_STR.paperDim));
      const disclaimer = scene.add
        .text(width / 2 - 14, height / 2 - 12, L().ui.normCard.disclaimer, textStyle(12, COLOR_STR.paperDim))
        .setOrigin(1, 1);
      this.add([explanation, notMeaning, fnLabel, fn, tags, disclaimer]);
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
      .text(0, 28, L().ui.archive.locked, textStyle(12, COLOR_STR.paperDim, { align: 'center' }))
      .setOrigin(0.5);
    this.add([bg, lock, label]);
    this.setSize(width, height);
    scene.add.existing(this);
  }
}

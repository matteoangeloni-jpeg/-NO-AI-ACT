import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle, GAME_WIDTH } from './theme';
import { StateManager } from '../systems/StateManager';
import { L } from '../i18n';

export type ToastKind = 'info' | 'warning' | 'alert' | 'ok';

/**
 * Avviso a schermo per scena. Più avvisi si sovrapponevano nello stesso
 * punto e diventavano illeggibili — "[AVVI[AVVISO] Citato..." — perché ogni
 * chiamata creava il proprio riquadro senza sapere di quelli già in volo.
 * Succede ogni volta che due eventi capitano ravvicinati: aprire l'ultimo
 * reperto e citarne uno, per esempio.
 *
 * Qui l'avviso in corso viene tolto prima di mostrarne uno nuovo: sullo
 * schermo ce n'è sempre al massimo uno, ed è l'ultimo — quello che si
 * riferisce a ciò che il giocatore ha appena fatto.
 */
const current = new WeakMap<Phaser.Scene, Phaser.GameObjects.Container>();

/**
 * Notifica impersonale in stile burocratico, slide-in dall'alto.
 * `topOffset` sposta il punto di riposo (default 36) per le scene il cui
 * header occupa già quella fascia verticale.
 */
/**
 * Altezza dell'avviso. Serve fuori di qui: chi lo posiziona deve sapere
 * quanto è alto, perché il container è centrato su `topOffset` e non
 * appoggiato — un numero preso a occhio lo fa sbordare verso l'alto.
 */
export const TOAST_HEIGHT = 44;

export function showToast(scene: Phaser.Scene, message: string, kind: ToastKind = 'info', topOffset = 36): void {
  const previous = current.get(scene);
  if (previous?.active) {
    scene.tweens.killTweensOf(previous);
    previous.destroy();
  }
  const colors: Record<ToastKind, { stroke: number; text: string }> = {
    info: { stroke: COLORS.accent, text: COLOR_STR.paper },
    warning: { stroke: COLORS.warning, text: COLOR_STR.warning },
    alert: { stroke: COLORS.alert, text: COLOR_STR.alertText },
    ok: { stroke: COLORS.ok, text: COLOR_STR.ok }
  };
  const c = { ...colors[kind], prefix: L().ui.toastPrefixes[kind] };
  const width = Math.min(640, GAME_WIDTH - 80);
  const container = scene.add.container(GAME_WIDTH / 2, -40).setDepth(1000);
  const bg = scene.add.rectangle(0, 0, width, TOAST_HEIGHT, COLORS.carbon, 0.96).setStrokeStyle(1, c.stroke);
  const stripe = scene.add.rectangle(-width / 2 + 3, 0, 6, TOAST_HEIGHT, c.stroke);
  const label = scene.add
    .text(0, 0, `[${c.prefix}] ${message}`, textStyle(13, c.text))
    .setOrigin(0.5);
  container.add([bg, stripe, label]);
  current.set(scene, container);

  const targetY = topOffset;
  if (StateManager.reducedMotion) {
    container.setY(targetY);
    scene.time.delayedCall(2200, () => container.destroy());
    return;
  }
  scene.tweens.add({
    targets: container,
    y: targetY,
    duration: 260,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.time.delayedCall(2000, () => {
        scene.tweens.add({
          targets: container,
          y: -50,
          alpha: 0,
          duration: 260,
          ease: 'Cubic.easeIn',
          onComplete: () => container.destroy()
        });
      });
    }
  });
}

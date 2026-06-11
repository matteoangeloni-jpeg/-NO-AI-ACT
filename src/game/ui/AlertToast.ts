import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle, GAME_WIDTH } from './theme';
import { StateManager } from '../systems/StateManager';

export type ToastKind = 'info' | 'warning' | 'alert' | 'ok';

/** Notifica impersonale in stile burocratico, slide-in dall'alto. */
export function showToast(scene: Phaser.Scene, message: string, kind: ToastKind = 'info'): void {
  const colors: Record<ToastKind, { stroke: number; text: string; prefix: string }> = {
    info: { stroke: COLORS.accent, text: COLOR_STR.paper, prefix: 'AVVISO' },
    warning: { stroke: COLORS.warning, text: COLOR_STR.warning, prefix: 'ATTENZIONE' },
    alert: { stroke: COLORS.alert, text: COLOR_STR.alertText, prefix: 'ALLARME' },
    ok: { stroke: COLORS.ok, text: COLOR_STR.ok, prefix: 'REGISTRATO' }
  };
  const c = colors[kind];
  const width = Math.min(640, GAME_WIDTH - 80);
  const container = scene.add.container(GAME_WIDTH / 2, -40).setDepth(1000);
  const bg = scene.add.rectangle(0, 0, width, 44, COLORS.carbon, 0.96).setStrokeStyle(1, c.stroke);
  const stripe = scene.add.rectangle(-width / 2 + 3, 0, 6, 44, c.stroke);
  const label = scene.add
    .text(0, 0, `[${c.prefix}] ${message}`, textStyle(13, c.text))
    .setOrigin(0.5);
  container.add([bg, stripe, label]);

  const targetY = 36;
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

import Phaser from 'phaser';
import { oncePerKeyEvent, type KeyHandler } from './keyDedupe';

/**
 * L'installazione vive qui, separata dalla regola, perché importa Phaser:
 * i controlli girano in Node, dove il motore non si carica senza `window`.
 * La regola sta in keyDedupe.ts e si verifica lì.
 */

export { oncePerKeyEvent } from './keyDedupe';
export type { KeyHandler } from './keyDedupe';

/**
 * Applica la regola a TUTTI i gestori di tastiera, in un punto solo.
 *
 * Le scene e gli overlay registrano i tasti in una quarantina di posti.
 * Avvolgerli uno per uno avrebbe funzionato finché qualcuno non ne scrive
 * il quarantunesimo dimenticandosene — e il difetto si vede solo su una
 * macchina lenta, cioè mai durante lo sviluppo. Qui la regola vale per
 * chiunque registri un `keydown`, compreso chi arriva dopo.
 *
 * `.off()` continua a funzionare: la funzione avvolta viene ricordata
 * accanto all'originale, e quando si chiede di togliere l'originale viene
 * tolta quella giusta.
 */
export function installKeyEventDedupe(): void {
  const proto = Phaser.Input.Keyboard.KeyboardPlugin.prototype as unknown as Record<string, unknown> & {
    on: (...args: unknown[]) => unknown;
    off: (...args: unknown[]) => unknown;
  };
  if (proto.__keyDedupe) return;

  const onOriginale = proto.on;
  const offOriginale = proto.off;
  /** Per ogni plugin, la funzione avvolta che corrisponde a ciascun gestore. */
  const perPlugin = new WeakMap<object, Map<unknown, KeyHandler>>();
  const daDedupe = (evento: unknown): boolean => typeof evento === 'string' && evento.startsWith('keydown');

  proto.on = function (this: object, evento: unknown, gestore: unknown, contesto?: unknown): unknown {
    if (!daDedupe(evento) || typeof gestore !== 'function') {
      return onOriginale.call(this, evento, gestore, contesto);
    }
    let mappa = perPlugin.get(this);
    if (!mappa) { mappa = new Map(); perPlugin.set(this, mappa); }
    let avvolto = mappa.get(gestore);
    if (!avvolto) { avvolto = oncePerKeyEvent(gestore as KeyHandler); mappa.set(gestore, avvolto); }
    return onOriginale.call(this, evento, avvolto, contesto);
  };

  proto.off = function (this: object, evento: unknown, gestore?: unknown, contesto?: unknown, once?: unknown): unknown {
    const avvolto = daDedupe(evento) && typeof gestore === 'function'
      ? perPlugin.get(this)?.get(gestore)
      : undefined;
    return offOriginale.call(this, evento, avvolto ?? gestore, contesto, once);
  };

  proto.__keyDedupe = true;
}

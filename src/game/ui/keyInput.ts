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
    once: (...args: unknown[]) => unknown;
    addListener: (...args: unknown[]) => unknown;
    off: (...args: unknown[]) => unknown;
  };
  if (proto.__keyDedupe) return;

  const originali = { on: proto.on, once: proto.once, addListener: proto.addListener };
  const offOriginale = proto.off;

  /**
   * Per ogni plugin, la funzione avvolta che corrisponde a ciascun gestore.
   *
   * La mappa interna è DEBOLE, e la ragione è un difetto vero trovato in
   * revisione: una mappa forte avrebbe trattenuto per sempre ogni gestore
   * registrato, e con lui la scena o l'overlay catturati dalla chiusura.
   * Le scene qui si riavviano spesso — il cambio lingua fa `scene.restart()`
   * — quindi sarebbe cresciuta a ogni giro.
   *
   * Debole risolve anche il caso che una cancellazione esplicita non copre:
   * quando è Phaser a togliere gli ascoltatori allo spegnimento di una
   * scena, `off()` non passa di qui, e una voce cancellata solo lì sarebbe
   * rimasta comunque.
   */
  const perPlugin = new WeakMap<object, WeakMap<object, KeyHandler>>();
  const daDedupe = (evento: unknown): boolean => typeof evento === 'string' && evento.startsWith('keydown');

  const avvolgi = (plugin: object, gestore: object): KeyHandler => {
    let mappa = perPlugin.get(plugin);
    if (!mappa) { mappa = new WeakMap(); perPlugin.set(plugin, mappa); }
    let avvolto = mappa.get(gestore);
    if (!avvolto) { avvolto = oncePerKeyEvent(gestore as KeyHandler); mappa.set(gestore, avvolto); }
    return avvolto;
  };

  /**
   * TUTTE le vie di registrazione, non solo `on`.
   *
   * Segnalato in revisione: `once()` e `addListener()` sono porte separate
   * sullo stesso emettitore, e quattro registrazioni reali le usano
   * (NormCardScene e SessionEndScene, con INVIO). Lasciarne fuori anche una
   * sola contraddice il motivo per cui questa regola sta sul motore invece
   * che nei singoli gestori: che nessuno debba ricordarsene.
   */
  for (const nome of ['on', 'once', 'addListener'] as const) {
    const originale = originali[nome];
    proto[nome] = function (this: object, evento: unknown, gestore: unknown, contesto?: unknown): unknown {
      return daDedupe(evento) && typeof gestore === 'function'
        ? originale.call(this, evento, avvolgi(this, gestore), contesto)
        : originale.call(this, evento, gestore, contesto);
    };
  }

  proto.off = function (this: object, evento: unknown, gestore?: unknown, contesto?: unknown, once?: unknown): unknown {
    const avvolto = daDedupe(evento) && typeof gestore === 'function'
      ? perPlugin.get(this)?.get(gestore)
      : undefined;
    return offOriginale.call(this, evento, avvolto ?? gestore, contesto, once);
  };

  proto.__keyDedupe = true;
}

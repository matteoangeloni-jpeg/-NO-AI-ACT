import type Phaser from 'phaser';
import { StateManager } from '../systems/StateManager';

/**
 * DISSOLVENZE DI SCENA, COERENTI CON "RIDUCI MOVIMENTO".
 *
 * Il gioco offre un'impostazione "riduci movimento" e la rispetta in nove
 * punti — il toast, la macchina da scrivere, il timbro del rapporto, lo
 * scossone dopo un esito sbagliato. Non la rispettava però nelle
 * dissolvenze fra scene: quattordici scene su quindici chiamavano
 * cameras.main.fadeIn() senza guardare l'impostazione, e una sola
 * (LearningReportScene) la controllava. Chi chiede meno movimento ne
 * riceveva comunque una a ogni cambio di schermata.
 *
 * Qui la decisione sta in un posto solo. Passare da qui, e non dalla
 * camera, è anche il modo per non dimenticarsene alla prossima scena.
 */

/** Dissolvenza in entrata. Con "riduci movimento" la scena appare subito. */
export function fadeInScene(scene: Phaser.Scene, duration = 250): void {
  scene.cameras.main.fadeIn(StateManager.reducedMotion ? 0 : duration, 0, 0, 0);
}

/**
 * Quante volte la durata nominale si è disposti ad aspettare prima di
 * passare oltre comunque. Tre è abbastanza largo da non tagliare mai una
 * dissolvenza su una macchina normale, e abbastanza stretto da non far
 * sembrare il gioco bloccato su una lenta.
 */
export const FADE_PATIENCE = 3;

/**
 * Dissolvenza in uscita, con la chiamata da eseguire a transizione finita.
 *
 * Non usa durata 0 nemmeno con "riduci movimento": qui la navigazione
 * dipende dall'evento di completamento, e una durata nulla è il genere di
 * dettaglio che fa uscire un utente da una schermata senza entrare nella
 * successiva. Un fotogramma è impercettibile e l'evento arriva di sicuro.
 *
 * L'EVENTO ARRIVA, MA QUANDO.
 *
 * La dissolvenza di Phaser avanza per FOTOGRAMMI, non a orologio: sono
 * diciotto passi da 16,67 ms nominali, e se la macchina ne disegna tre al
 * secondo quei 300 ms diventano sei secondi di attesa reale. Fino ad allora
 * la schermata resta ferma e il pulsante appena premuto sembra non aver
 * fatto niente. Misurato in un browser senza accelerazione hardware: 1,7 s
 * su un canvas 1280×720, 7 s su uno 2880×1620 — cioè il difetto peggiora
 * proprio dove si è alzata la risoluzione.
 *
 * La rete di sicurezza è un timer a orologio vero (setTimeout, non
 * delayedCall, che sarebbe a sua volta legato ai fotogrammi): scaduta la
 * pazienza si procede comunque. Su una macchina normale non scatta mai,
 * perché la dissolvenza finisce molto prima.
 */
export function fadeOutScene(scene: Phaser.Scene, duration: number, then: () => void): void {
  const ms = StateManager.reducedMotion ? 1 : duration;
  let done = false;
  const go = (): void => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    then();
  };
  const timer = window.setTimeout(go, Math.max(ms, ms * FADE_PATIENCE));
  scene.cameras.main.fadeOut(ms, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', go);
}

/**
 * COMPARSE: la stessa decisione delle dissolvenze di scena, per gli oggetti.
 *
 * Il gioco rispettava «riduci movimento» nelle transizioni fra scene e nelle
 * animazioni vistose — timbro, scossone, sblocco della norma — ma non nelle
 * comparse minute: le schede reperto entravano una dopo l'altra, la nota
 * della conseguenza sfumava, il fascicolo saliva dal basso. Quattro tween
 * una tantum, ognuno innocuo da solo, tutti insieme l'esatto contrario di
 * quello che l'impostazione promette.
 *
 * Erano sfuggiti anche al controllo automatico, che cercava `repeat: -1`:
 * un'animazione che non si ripete è comunque un'animazione per chi ha
 * chiesto di non vederne.
 *
 * `reveal` mette l'oggetto NELLO STATO FINALE e non anima, quando
 * l'impostazione è attiva. Non salta il risultato: lo raggiunge subito. Chi
 * passa di qui non può dimenticarsene, ed è questo il punto.
 */
export function reveal(
  scene: Phaser.Scene,
  config: Phaser.Types.Tweens.TweenBuilderConfig | Record<string, unknown>
): Phaser.Tweens.Tween | null {
  const cfg = config as Record<string, unknown>;
  if (!StateManager.reducedMotion) return scene.tweens.add(cfg as Phaser.Types.Tweens.TweenBuilderConfig);

  const targets = Array.isArray(cfg.targets) ? cfg.targets : [cfg.targets];
  const saltate = new Set(['targets', 'duration', 'delay', 'ease', 'repeat', 'yoyo', 'hold', 'onUpdate', 'onComplete']);
  for (const t of targets) {
    const obj = t as Record<string, unknown>;
    if (!obj) continue;
    for (const [chiave, valore] of Object.entries(cfg)) {
      if (saltate.has(chiave)) continue;
      // `alpha: { from: 0, to: 1 }` vale quanto `alpha: 1`: conta dove si arriva
      const finale =
        typeof valore === 'object' && valore !== null && 'to' in (valore as Record<string, unknown>)
          ? (valore as Record<string, unknown>).to
          : valore;
      if (typeof finale === 'number') obj[chiave] = finale;
    }
  }
  // il seguito va eseguito lo stesso, o la scena resta senza il suo pulsante
  const poi = cfg.onComplete;
  if (typeof poi === 'function') (poi as () => void)();
  return null;
}

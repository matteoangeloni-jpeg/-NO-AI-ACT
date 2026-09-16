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

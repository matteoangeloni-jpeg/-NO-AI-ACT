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
 * Dissolvenza in uscita, con la chiamata da eseguire a transizione finita.
 *
 * Non usa durata 0 nemmeno con "riduci movimento": qui la navigazione
 * dipende dall'evento di completamento, e una durata nulla è il genere di
 * dettaglio che fa uscire un utente da una schermata senza entrare nella
 * successiva. Un fotogramma è impercettibile e l'evento arriva di sicuro.
 */
export function fadeOutScene(scene: Phaser.Scene, duration: number, then: () => void): void {
  scene.cameras.main.fadeOut(StateManager.reducedMotion ? 1 : duration, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', then);
}

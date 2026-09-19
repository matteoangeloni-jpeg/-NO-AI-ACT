import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import type { TextSpeed } from '../data/types';
import { textStyle, COLOR_STR } from './theme';
import { L } from '../i18n';
import { charsShownAt } from './typewriterTiming';

/**
 * Ri-esportata perché è parte del comportamento della scrittura, ma VIVE in
 * un modulo senza Phaser: i controlli girano in Node, e importare questa
 * classe vi tirerebbe dentro il motore, che senza `window` non si carica.
 */
export { charsShownAt };

/**
 * Testo a macchina da scrivere con suono da terminale.
 * Con "riduci animazioni" attivo il testo appare subito.
 *
 * SI PUÒ SALTARE, E ORA SI VEDE CHE SI PUÒ.
 *
 * Saltare si poteva già — un clic completava la scrittura — ma non lo
 * diceva nessuno, e la scrittura è la prima cosa che il gioco fa: chi
 * arriva pensa che i primi minuti siano un'introduzione da subire, e
 * qualcuno se ne va prima di toccare un fascicolo. Segnalato da chi ha
 * giocato, come cosa più importante da sistemare.
 *
 * Il suggerimento e i tasti stanno QUI e non nelle scene: erano quattro
 * scene a registrare il clic ciascuna per conto suo, e la tastiera non la
 * registrava nessuna. Chi aggiunge la prossima scena non deve ricordarsene.
 */
/**
 * Millisecondi per carattere. Il valore storico è quello di 'normal': le
 * altre due velocità gli stanno intorno, una doppia e una nulla.
 */
export const CHAR_DELAY_MS: Record<TextSpeed, number> = {
  slow: 28,
  normal: 14,
  instant: 0
};

export class TypewriterText extends Phaser.GameObjects.Text {
  private fullText = '';
  private timer?: Phaser.Time.TimerEvent;
  private onDone?: () => void;
  private hint?: Phaser.GameObjects.Text;
  private writing = false;
  private readonly skipHandler = (): void => this.skip();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    size: number,
    color: string = COLOR_STR.paper,
    wordWrapWidth?: number
  ) {
    super(scene, x, y, '', textStyle(size, color, {
      wordWrap: wordWrapWidth ? { width: wordWrapWidth } : undefined,
      lineSpacing: 6
    }));
    scene.add.existing(this);
  }

  write(text: string, onDone?: () => void): void {
    // una scrittura nuova cancella quella in corso senza farne scattare il
    // seguito: altrimenti restano appesi alla scena il suggerimento e i due
    // gestori di salto della scrittura precedente.
    this.teardown();
    this.fullText = text;
    this.onDone = onDone;

    /**
     * "Riduci animazioni" e velocità istantanea arrivano allo stesso punto
     * per ragioni diverse: la prima spegne ogni movimento del gioco, la
     * seconda è una preferenza sul solo ritmo del testo. Tenerle separate
     * significa che chi vuole leggere subito non deve rinunciare anche alle
     * dissolvenze e alla parallasse.
     */
    const delay = CHAR_DELAY_MS[StateManager.textSpeed] ?? CHAR_DELAY_MS.normal;
    if (StateManager.reducedMotion || delay === 0) {
      // niente da saltare, quindi niente da suggerire
      this.setText(text);
      onDone?.();
      return;
    }

    // Il suggerimento va sotto il testo COMPLETO, non sotto quello che sta
    // crescendo: misurato una volta qui, resta fermo mentre il testo scorre.
    this.setText(text);
    const hintY = this.y + this.height + 10;
    this.setText('');
    this.hint?.destroy();
    this.hint = this.scene.add
      .text(this.x, hintY, L().ui.typewriterHint, textStyle(11.5, COLOR_STR.accentText))
      .setAlpha(0.85);
    this.scene.input.on('pointerdown', this.skipHandler);
    for (const key of ['keydown-SPACE', 'keydown-ENTER']) this.scene.input.keyboard?.on(key, this.skipHandler);

    /**
     * Il timer serve solo a far ricontrollare l'orologio: quanti caratteri
     * mostrare lo decide il tempo trascorso, non il numero di scatti.
     *
     * L'ISTANTE DI PARTENZA SI PRENDE AL PRIMO SCATTO, non qui.
     *
     * `time.now` dell'orologio della scena vale ZERO finché la scena non ha
     * fatto il suo primo aggiornamento, e write() viene chiamata dentro
     * create(), cioè prima. Prendendolo qui, il primo scatto calcolava
     * «sono passati 1650 ms» e sputava fuori tutto il testo in un colpo:
     * misurato a schermo, l'invito ai reperti compariva dopo 3 ms invece
     * che dopo sei secondi. Al primo scatto è passato un `delay`, e da lì
     * il conto torna.
     */
    this.writing = true;
    let inizio = -1;
    let mostrati = 0;
    this.timer = this.scene.time.addEvent({
      delay,
      loop: true,
      callback: () => {
        if (inizio < 0) inizio = this.scene.time.now - delay;
        const quanti = charsShownAt(this.scene.time.now - inizio, delay, text.length);
        if (quanti === mostrati) return;
        // il suono segna blocchi di tre caratteri, non fotogrammi: se la
        // macchina ne recupera dieci in un colpo, resta un ticchettio solo
        if (Math.floor(quanti / 3) > Math.floor(mostrati / 3)) AudioSystem.terminal();
        mostrati = quanti;
        this.setText(text.slice(0, quanti));
        if (quanti >= text.length) this.finish();
      }
    });
  }

  /** Completa subito la scrittura (skip). */
  skip(): void {
    if (!this.writing) return;
    this.setText(this.fullText);
    this.finish();
  }

  get isWriting(): boolean {
    return this.writing;
  }

  /**
   * Smonta la scrittura in corso: timer, suggerimento e gestori di salto.
   * NON chiama il seguito — quello è compito di finish(), cioè di chi
   * arriva in fondo davvero.
   */
  private teardown(): void {
    this.writing = false;
    this.timer?.remove();
    this.timer = undefined;
    this.hint?.destroy();
    this.hint = undefined;
    this.scene.input.off('pointerdown', this.skipHandler);
    for (const key of ['keydown-SPACE', 'keydown-ENTER']) this.scene.input.keyboard?.off(key, this.skipHandler);
  }

  private finish(): void {
    this.teardown();
    const cb = this.onDone;
    this.onDone = undefined;
    cb?.();
  }
}

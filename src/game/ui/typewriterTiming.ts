/**
 * QUANTI CARATTERI DEVONO ESSERE VISIBILI DOPO UN CERTO TEMPO.
 *
 * Sta qui fuori, e non dentro il timer, perché è l'unica cosa che decide il
 * ritmo della scrittura — e va potuta verificare senza un browser.
 *
 * Prima non esisteva: il timer teneva un contatore e faceva `i += 1` a ogni
 * scatto. Un TimerEvent di Phaser però scatta AL PIÙ UNA VOLTA PER
 * FOTOGRAMMA, quindi la velocità del testo non era 14 ms per carattere: era
 * un carattere per fotogramma, cioè dipendeva da quanto in fretta la
 * macchina riusciva a disegnare. Misurato in questo contenitore, dove il
 * disegno è software:
 *
 *   1280×720   10 fps  →  24,0 caratteri/s  →  17,5 s
 *   1920×1080   5 fps  →  10,4 caratteri/s  →  40,6 s
 *   1920×1080@2x 2 fps →   1,4 caratteri/s  →  oltre 120 s, mai finito
 *
 * per lo stesso testo di 421 caratteri, che a 14 ms l'uno dovrebbe
 * impiegarne sei. Lo stesso testo, sullo stesso gioco, dieci volte più
 * lento perché lo schermo era più grande. Era anche il motivo per cui la
 * verifica visiva falliva a intermittenza in CI: superava i trenta secondi
 * di attesa proprio ai due giri a 1920×1080 a movimento pieno.
 *
 * Ricavare il conto dal TEMPO TRASCORSO rende la scrittura indipendente dal
 * numero di fotogrammi: su una macchina lenta il testo appare a scatti più
 * grossi, ma finisce quando deve finire.
 */
export function charsShownAt(elapsedMs: number, delayMs: number, total: number): number {
  if (delayMs <= 0) return total;
  return Math.min(total, Math.max(0, Math.floor(elapsedMs / delayMs)));
}

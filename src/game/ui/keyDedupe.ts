/**
 * UN TASTO, UN'AZIONE — anche quando il gioco è indietro con i fotogrammi.
 *
 * IL DIFETTO. Su una macchina lenta, o su uno schermo molto grande dove il
 * disegno costa, una sola pressione di un tasto faceva partire l'azione più
 * volte. Misurato a schermo su questo gioco, a 1920×1080 con densità doppia:
 *
 *   sei pressioni DOM  →  22–24 emissioni `keydown-*` di Phaser
 *
 * A sessanta fotogrammi al secondo il rapporto è uno a uno, ed è per questo
 * che non si vedeva provando il gioco su una macchina normale.
 *
 * COME SI MANIFESTAVA. Dipende da che cosa fa il gestore.
 *   - Sulla mappa civica, dove la freccia SPOSTA la selezione, le ripetizioni
 *     si sommano: una freccia saltava due o più fascicoli.
 *   - Sui reperti, dove il tasto COMMUTA la citazione, le ripetizioni si
 *     annullano a coppie: il reperto si apriva ma la citazione non restava
 *     mai. È anche il motivo per cui la verifica della bozza è caduta in CI
 *     con «reperti citati non salvati».
 * Due sintomi opposti, una causa sola.
 *
 * PERCHÉ SUCCEDE. La coda degli eventi della tastiera è del gestore di
 * gioco, e le scene la leggono durante il proprio aggiornamento; viene
 * svuotata dopo. Quando il gioco è indietro, la stessa coda può essere
 * letta più di una volta. Phaser un controllo ce l'ha — in
 * `KeyboardPlugin.update` c'è un «duplicate event bailout» — ma confronta
 * l'evento SOLTANTO con quello immediatamente precedente. La sequenza che
 * ho misurato qui è interlacciata:
 *
 *   evento   0 1 1 2 1 2
 *
 * L'evento 1 torna dopo il 2: un confronto con il precedente non lo vede.
 *
 * LA CORREZIONE. Ogni gestore ricorda gli eventi su cui ha già agito e
 * ignora i ritorni, anche non adiacenti. Il ricordo sta in un WeakSet: le
 * voci spariscono con gli eventi, quindi non cresce mai.
 *
 * Non è una soglia di tempo e non è un antirimbalzo: due pressioni VERE e
 * ravvicinate restano due azioni, perché sono due eventi diversi. L'unica
 * cosa che viene tolta è la ripetizione dello stesso identico evento.
 */

/** I tasti che una scena registra passano di qui. */
export type KeyHandler = (event?: KeyboardEvent) => void;

/**
 * Avvolge un gestore di tastiera perché agisca UNA VOLTA SOLA per evento.
 *
 * Restituisce una funzione nuova: chi deve poi togliere il gestore con
 * `.off()` deve conservare QUESTA, non l'originale. Per questo gli overlay
 * la assegnano al proprio campo (`this.escHandler = oncePerKeyEvent(...)`)
 * invece di avvolgerla al volo dentro la chiamata a `.on()`.
 */
export function oncePerKeyEvent(handler: KeyHandler): KeyHandler {
  const gestiti = new WeakSet<KeyboardEvent>();
  return (event?: KeyboardEvent): void => {
    if (event) {
      if (gestiti.has(event)) return;
      gestiti.add(event);
    }
    handler(event);
  };
}

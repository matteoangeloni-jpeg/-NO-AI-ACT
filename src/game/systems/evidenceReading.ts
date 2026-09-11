/**
 * Riga dello strato di lettura per un reperto (U06).
 *
 * Prima questa logica viveva dentro EvidenceScene e trattava la citazione
 * come uno stato ALTERNATIVO al contenuto: un reperto citato veniva
 * annunciato come "CITATO NEL RAPPORTO" al posto del suo testo. Chi gioca
 * con uno screen reader perdeva così, nel momento in cui lo sceglieva,
 * proprio il documento che gli serve per motivare il rapporto — e senza
 * modo di rileggerlo.
 *
 * Qui la citazione è uno stato IN PIÙ. La funzione è pura e priva di
 * dipendenze da Phaser e dall'i18n (le etichette arrivano dal chiamante)
 * proprio perché il comportamento sia verificabile da solo.
 */

export interface ClueReadingState {
  revealed: boolean;
  cited: boolean;
}

export interface ClueReadingLabels {
  /** Testo per un reperto non ancora aperto. */
  sealed: string;
  /** Qualificatore additivo per un reperto citato, es. "citato nel rapporto". */
  cited: string;
}

export function evidenceReadingLine(
  clue: { title: string; text: string },
  state: ClueReadingState | undefined,
  labels: ClueReadingLabels
): string {
  if (!state?.revealed) return `${clue.title} — ${labels.sealed}`;
  return `${clue.title} — ${clue.text}${state.cited ? ` (${labels.cited})` : ''}`;
}

import type { IndicatorKey, IndicatorState, OutcomeQuality } from './types';

export const INITIAL_INDICATORS: IndicatorState = {
  efficienza: 70,
  controllo: 40,
  diritti: 70,
  fiducia: 65
};

export const INDICATOR_LABELS: Record<IndicatorKey, string> = {
  efficienza: 'EFFICIENZA',
  controllo: 'CONTROLLO SOCIALE',
  diritti: 'DIRITTI FONDAMENTALI',
  fiducia: 'FIDUCIA PUBBLICA'
};

/**
 * Delta applicati agli indicatori in base alla qualità della decisione.
 * Scelta corretta: la città perde un po' di efficienza apparente ma
 * guadagna diritti e fiducia. Scelta sbagliata: il contrario.
 */
export const OUTCOME_DELTAS: Record<OutcomeQuality, IndicatorState> = {
  correct: { efficienza: -3, controllo: -6, diritti: 10, fiducia: 8 },
  partial: { efficienza: 0, controllo: -2, diritti: 4, fiducia: 2 },
  wrong: { efficienza: 6, controllo: 10, diritti: -10, fiducia: -8 }
};

/** Micro-commenti mostrati dopo ogni aggiornamento degli indicatori. */
export const OUTCOME_COMMENTS: Record<OutcomeQuality, string[]> = {
  correct: [
    'La decisione è contestabile. Quindi è legittima.',
    'Qualche processo rallenta. Qualche persona respira.',
    'Il sistema ora deve spiegarsi. È un inizio.'
  ],
  partial: [
    'Una toppa amministrativa. Il problema resta sotto la superficie.',
    'Meglio di niente. Ma "meglio di niente" non è governance.',
    'La misura mitiga il sintomo, non la causa.'
  ],
  wrong: [
    'I dashboard migliorano. Le persone no.',
    'Efficienza record. Nessuno sa più chi decide.',
    'Il sistema ringrazia. I cittadini non possono.'
  ]
};

export function clampIndicator(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyOutcome(state: IndicatorState, quality: OutcomeQuality): IndicatorState {
  const d = OUTCOME_DELTAS[quality];
  return {
    efficienza: clampIndicator(state.efficienza + d.efficienza),
    controllo: clampIndicator(state.controllo + d.controllo),
    diritti: clampIndicator(state.diritti + d.diritti),
    fiducia: clampIndicator(state.fiducia + d.fiducia)
  };
}

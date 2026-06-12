import type { IndicatorState, OutcomeQuality } from './types';

export const INITIAL_INDICATORS: IndicatorState = {
  efficienza: 70,
  controllo: 40,
  diritti: 70,
  fiducia: 65
};

/**
 * Delta applicati agli indicatori in base alla qualità della decisione.
 * Scelta corretta: la città perde un po' di efficienza apparente ma
 * guadagna diritti e fiducia. Scelta sbagliata: il contrario.
 * (Etichette e micro-commenti localizzati: src/game/i18n.)
 */
export const OUTCOME_DELTAS: Record<OutcomeQuality, IndicatorState> = {
  correct: { efficienza: -3, controllo: -6, diritti: 10, fiducia: 8 },
  partial: { efficienza: 0, controllo: -2, diritti: 4, fiducia: 2 },
  wrong: { efficienza: 6, controllo: 10, diritti: -10, fiducia: -8 }
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

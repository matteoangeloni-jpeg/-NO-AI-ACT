import { OUTCOME_DELTAS } from '../data/indicators';
import type { OutcomeQuality } from '../data/types';

/**
 * Feedback multi-asse (roadmap 2.1, Phase 1 §4): la stessa decisione viene
 * riletta su tre assi — validità legale, impatto sui diritti fondamentali e
 * costo/beneficio istituzionale — invece del solo esito binario.
 *
 * SOLO presentazione: gli assi sono DERIVATI dalla qualità dell'esito già
 * calcolata e dai delta indicatori esistenti (OUTCOME_DELTAS, pinnati dagli
 * invarianti di gameplay). Nessun effetto su punteggio, esiti o salvataggi.
 */
export type AxisJudgment = 'strengthened' | 'mixed' | 'weakened';

export interface MultiAxisFeedback {
  /** Asse 1 — validità legale: coincide con la qualità dell'esito. */
  legal: OutcomeQuality;
  /** Asse 2 — impatto sui diritti fondamentali (segno del delta `diritti`). */
  rights: AxisJudgment;
  /** Asse 3 — esito istituzionale (segno del delta `fiducia`). */
  institution: AxisJudgment;
}

const judge = (delta: number): AxisJudgment => (delta > 0 ? 'strengthened' : delta < 0 ? 'weakened' : 'mixed');

export function multiAxisFeedback(quality: OutcomeQuality): MultiAxisFeedback {
  const d = OUTCOME_DELTAS[quality];
  return { legal: quality, rights: judge(d.diritti), institution: judge(d.fiducia) };
}

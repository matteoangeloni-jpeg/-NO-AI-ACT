import type { ReportOutcome } from '../data/types';

/**
 * Fascicolo città (v0.5). Effetti SISTEMICI delle decisioni, derivati dagli
 * esiti dei casi già archiviati. Non è un punteggio arcade: produce TENDENZE
 * qualitative. È calcolato (non persistito): i salvataggi vecchi restano
 * compatibili e il default sicuro è "tutto stabile".
 */
export type CityIndicator =
  | 'publicTrust'
  | 'fundamentalRights'
  | 'administrativeOpacity'
  | 'litigationRisk'
  | 'serviceEfficiency';

export type DossierTrend = 'improving' | 'worsening' | 'stable' | 'watch';

export const CITY_INDICATORS: CityIndicator[] = [
  'publicTrust',
  'fundamentalRights',
  'administrativeOpacity',
  'litigationRisk',
  'serviceEfficiency'
];

/**
 * Contributo grezzo di ciascun esito a ogni dimensione (positivo = "più di
 * questa dimensione"). Un atto contestabile è impugnabile: alza il rischio
 * contenzioso anche quando il merito è corretto.
 */
const OUTCOME_CONTRIB: Record<ReportOutcome, Record<CityIndicator, number>> = {
  conforme: { publicTrust: 2, fundamentalRights: 2, administrativeOpacity: -2, litigationRisk: -1, serviceEfficiency: -1 },
  parziale: { publicTrust: 1, fundamentalRights: 1, administrativeOpacity: -1, litigationRisk: 0, serviceEfficiency: 0 },
  contestabile: { publicTrust: 0, fundamentalRights: 0, administrativeOpacity: 1, litigationRisk: 2, serviceEfficiency: 0 },
  non_conforme: { publicTrust: -2, fundamentalRights: -2, administrativeOpacity: 2, litigationRisk: 2, serviceEfficiency: 1 }
};

/** true se per la dimensione "più alto = meglio" (trust/diritti). */
const GOOD_WHEN_HIGHER: Record<CityIndicator, boolean> = {
  publicTrust: true,
  fundamentalRights: true,
  administrativeOpacity: false,
  litigationRisk: false,
  serviceEfficiency: true
};

/** Mappa un punteggio grezzo sulla tendenza qualitativa di una dimensione. */
export function trendFor(indicator: CityIndicator, score: number): DossierTrend {
  // l'efficienza nel gioco sale anche per le decisioni sbagliate (efficienza
  // apparente): qualunque variazione resta "sotto osservazione", mai un merito.
  if (indicator === 'serviceEfficiency') return score === 0 ? 'stable' : 'watch';
  if (score === 0) return 'stable';
  const good = GOOD_WHEN_HIGHER[indicator];
  if (good) return score > 0 ? 'improving' : 'worsening';
  return score > 0 ? 'worsening' : 'improving';
}

export interface DossierLine {
  indicator: CityIndicator;
  score: number;
  trend: DossierTrend;
}

/** Fascicolo complessivo derivato dagli esiti dei casi chiusi. */
export function cityDossier(outcomes: ReportOutcome[]): DossierLine[] {
  return CITY_INDICATORS.map((indicator) => {
    const score = outcomes.reduce((sum, o) => sum + OUTCOME_CONTRIB[o][indicator], 0);
    return { indicator, score, trend: trendFor(indicator, score) };
  });
}

/** Aggiornamento sintetico per un singolo caso appena chiuso (per la UI). */
export function caseDossierUpdate(outcome: ReportOutcome): DossierLine[] {
  return CITY_INDICATORS.map((indicator) => {
    const score = OUTCOME_CONTRIB[outcome][indicator];
    return { indicator, score, trend: trendFor(indicator, score) };
  });
}

import type { CaseData, Classification, Measure, OutcomeQuality } from '../data/types';

/**
 * Valuta la coppia (classificazione, misura) scelta dal giocatore.
 *
 *  - correct: classificazione esatta E misura tra quelle pienamente corrette;
 *  - partial: classificazione esatta con misura solo mitigante, oppure
 *    classificazione "adiacente" con misura pienamente corretta, oppure
 *    eccesso di cautela (bloccare un sistema correttamente classificato
 *    come alto rischio);
 *  - wrong: tutto il resto.
 */
export function evaluateDecision(
  caseData: CaseData,
  classification: Classification,
  measure: Measure
): OutcomeQuality {
  const classOk = classification === caseData.correctClassification;
  const measureFull = caseData.correctMeasures.includes(measure);
  const measurePartial = caseData.partialMeasures.includes(measure);

  if (classOk && measureFull) return 'correct';
  if (classOk && measurePartial) return 'partial';
  // L'eccesso di cautela non è negazione del problema: bloccare un sistema
  // ad alto rischio classificato correttamente vale come decisione parziale.
  if (classOk && caseData.correctClassification === 'alto_rischio' && measure === 'blocco') {
    return 'partial';
  }
  if (isAdjacentClassification(caseData.correctClassification, classification) && measureFull) {
    return 'partial';
  }
  return 'wrong';
}

/**
 * Classificazioni "adiacenti": errori comprensibili che mantengono il caso
 * dentro il perimetro dell'AI Act (es. trattare una pratica vietata come
 * alto rischio). Sbagliare verso "basso rischio" o "non rilevante" non è
 * mai adiacente: significa negare il problema.
 */
export function isAdjacentClassification(correct: Classification, chosen: Classification): boolean {
  if (correct === chosen) return false;
  const adjacency: Record<Classification, Classification[]> = {
    vietata: ['alto_rischio'],
    alto_rischio: ['vietata', 'trasparenza'],
    trasparenza: ['alto_rischio'],
    basso_rischio: ['trasparenza'],
    non_rilevante: []
  };
  return adjacency[correct].includes(chosen);
}

export function noteFor(caseData: CaseData, quality: OutcomeQuality): string {
  if (quality === 'correct') return caseData.noteCorrect;
  if (quality === 'partial') return caseData.notePartial;
  return caseData.noteWrong;
}

export function consequenceFor(caseData: CaseData, quality: OutcomeQuality): string {
  return quality === 'wrong' ? caseData.consequenceWrong : caseData.consequenceCorrect;
}

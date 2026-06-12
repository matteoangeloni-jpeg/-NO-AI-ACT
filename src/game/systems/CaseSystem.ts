import type { CaseData, CaseTexts, Classification, Measure, OutcomeQuality } from '../data/types';

/**
 * Valuta la tripletta (reperti citati, classificazione, misura).
 *
 *  - correct: reperti rilevanti citati E classificazione esatta E misura piena;
 *  - partial: classificazione esatta con misura solo mitigante; oppure
 *    classificazione "adiacente" con misura piena; oppure eccesso di cautela
 *    (bloccare un sistema correttamente classificato come alto rischio);
 *    oppure tutto corretto ma reperti citati che non fondano la classificazione;
 *  - wrong: tutto il resto.
 *
 * `citedClues` è opzionale per retrocompatibilità: se omesso, la valutazione
 * considera solo classificazione e misura.
 */
export function evaluateDecision(
  caseData: CaseData,
  classification: Classification,
  measure: Measure,
  citedClues?: number[]
): OutcomeQuality {
  const base = evaluateClassificationAndMeasure(caseData, classification, measure);
  if (base !== 'correct' || citedClues === undefined) return base;
  return cluesSupportClassification(caseData, citedClues) ? 'correct' : 'partial';
}

/**
 * I reperti citati fondano la classificazione se includono TUTTI quelli
 * designati come rilevanti. Citare anche il reperto "di contorno" non è un
 * errore: l'errore è ometterne uno portante.
 */
export function cluesSupportClassification(caseData: CaseData, citedClues: number[]): boolean {
  return caseData.relevantClues.every((i) => citedClues.includes(i));
}

function evaluateClassificationAndMeasure(
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

export function noteFor(texts: CaseTexts, quality: OutcomeQuality): string {
  if (quality === 'correct') return texts.noteCorrect;
  if (quality === 'partial') return texts.notePartial;
  return texts.noteWrong;
}

export function consequenceFor(texts: CaseTexts, quality: OutcomeQuality): string {
  return quality === 'wrong' ? texts.consequenceWrong : texts.consequenceCorrect;
}

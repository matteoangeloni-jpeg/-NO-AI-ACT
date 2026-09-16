import type {
  CaseData,
  Classification,
  DifficultyMode,
  ErrorType,
  Measure,
  OutcomeQuality,
  ReportOutcome,
  ResponsibleSubject
} from '../data/types';
import { cluesSupportClassification, isAdjacentClassification } from './CaseSystem';

/**
 * Valutazione del rapporto ispettivo (v0.3).
 *
 * Il rapporto ha due piani:
 *  - il NUCLEO della decisione (classificazione + misura): è il merito;
 *  - il FONDAMENTO (prove citate + soggetto responsabile + motivazione):
 *    è ciò che rende l'atto difendibile.
 *
 * Regole d'esito:
 *  - nucleo sbagliato (negazione del problema / nessuna misura) → NON CONFORME;
 *  - nucleo corretto + fondamento integro → CONFORME;
 *  - nucleo corretto + qualunque vizio di fondamento → CONTESTABILE
 *    (decisione giusta, atto impugnabile: lezione P5);
 *  - nucleo parziale + fondamento integro → PARZIALMENTE CONFORME;
 *  - nucleo parziale + vizio lieve (prove, motivazione debole, soggetto
 *    parziale) → CONTESTABILE;
 *  - nucleo parziale + vizio grave (soggetto errato o motivazione errata)
 *    → NON CONFORME, salvo eccesso di cautela: lo zelo non può mai
 *    precipitare l'atto in non conformità (cap a CONTESTABILE).
 */

export interface ReportInput {
  caseData: CaseData;
  citedClues: number[];
  classification: Classification;
  measure: Measure;
  subject: ResponsibleSubject;
  motivationIndex: number;
}

export type SubjectGrade = 'full' | 'partial' | 'wrong';
export type MotivationGrade = 'correct' | 'weak' | 'wrong';
export type CoreGrade = 'correct' | 'partial' | 'wrong';

export interface ReportResult {
  outcome: ReportOutcome;
  /** Mappatura sugli indicatori/salvataggi esistenti (compatibilità v0.2). */
  quality: OutcomeQuality;
  dominantError: ErrorType | null;
  secondaryErrors: ErrorType[];
  coreGrade: CoreGrade;
  subjectGrade: SubjectGrade;
  motivationGrade: MotivationGrade;
  cluesOk: boolean;
  overcaution: boolean;
}

/** Chiave i18n della riga "Esito perché": il rilievo dominante, o 'grounded'
 *  quando l'atto è pienamente fondato (nessun errore). */
export type ReasonKey = ErrorType | 'grounded';

export function reasonKeyFor(result: ReportResult): ReasonKey {
  return result.dominantError ?? 'grounded';
}

/** In difficoltà 'base', dopo un errore, mostra un suggerimento mirato
 *  (la dimensione da riconsiderare) senza svelare la risposta. */
export function shouldShowHint(difficulty: DifficultyMode, result: ReportResult): boolean {
  return difficulty === 'base' && result.dominantError !== null;
}

export function hintKeyFor(result: ReportResult): ErrorType | null {
  return result.dominantError;
}

/**
 * Il rapporto elenca, sotto il rilievo principale, fino a due rilievi
 * secondari. In 'expert' no: è il "feedback asciutto" che la scheda del
 * livello promette, e senza questo restava una parola — standard ed esperto
 * mostravano esattamente lo stesso rapporto.
 *
 * Il dato non sparisce: `secondaryErrors` continua a essere calcolato e
 * archiviato nel rapporto del caso, quindi taccuino e debrief docente lo
 * vedono comunque. A cambiare è quanto il gioco ti suggerisce al momento
 * dell'esito, che è ciò che distingue un livello dall'altro.
 */
export function showsSecondaryErrors(difficulty: DifficultyMode): boolean {
  return difficulty !== 'expert';
}

export function gradeSubject(caseData: CaseData, subject: ResponsibleSubject): SubjectGrade {
  if (subject === caseData.responsibleSubjectCorrect) return 'full';
  if (caseData.responsibleSubjectPartial && subject === caseData.responsibleSubjectPartial) return 'partial';
  return 'wrong';
}

export function gradeMotivation(caseData: CaseData, motivationIndex: number): MotivationGrade {
  if (motivationIndex === caseData.correctMotivation) return 'correct';
  if (motivationIndex === caseData.weakMotivation) return 'weak';
  return 'wrong';
}

/** Nucleo della decisione: solo classificazione + misura. */
export function gradeCore(caseData: CaseData, classification: Classification, measure: Measure): CoreGrade {
  const classOk = classification === caseData.correctClassification;
  const measureFull = caseData.correctMeasures.includes(measure);
  if (classOk && measureFull) return 'correct';
  if (classOk && caseData.partialMeasures.includes(measure)) return 'partial';
  if (classOk && caseData.correctClassification === 'alto_rischio' && measure === 'blocco') return 'partial';
  if (isAdjacentClassification(caseData.correctClassification, classification) && measureFull) return 'partial';
  return 'wrong';
}

export function isOvercaution(caseData: CaseData, classification: Classification, measure: Measure): boolean {
  return (
    classification === caseData.correctClassification &&
    caseData.correctClassification === 'alto_rischio' &&
    measure === 'blocco'
  );
}

const OUTCOME_TO_QUALITY: Record<ReportOutcome, OutcomeQuality> = {
  conforme: 'correct',
  parziale: 'partial',
  contestabile: 'partial',
  non_conforme: 'wrong'
};

/**
 * Valutazione del rapporto, con difficoltà.
 *
 *  - 'base' (indulgente): un vizio di fondamento SOLO lieve (prove non
 *    pertinenti, motivazione debole, soggetto parziale) non degrada un nucleo
 *    corretto a contestabile, e un nucleo parziale con vizio grave resta
 *    contestabile (non non conforme).
 *  - 'standard' (default): comportamento severo storico — qualunque vizio di
 *    fondamento su nucleo corretto rende l'atto contestabile.
 *  - 'expert': come standard, più la severità che la scheda del livello
 *    annuncia da sempre, "severità su soggetto e motivazione": imputare gli
 *    obblighi a un soggetto solo PARZIALMENTE competente, o motivare in modo
 *    DEBOLE, smette di essere un vizio lieve e conta come grave.
 *
 * Fino a qui i livelli erano due travestiti da tre: la funzione distingueva
 * soltanto 'base', ed 'expert' era una parola sul menu — mentre l'ispezione a
 * sorpresa lo forzava proprio per essere più dura. La severità aggiunta è
 * esattamente quella promessa: i reperti non pertinenti, che la scheda non
 * nomina, restano un vizio lieve anche in esperto.
 *
 * Dove si vede: su un nucleo CORRETTO l'esito non cambia (un vizio qualunque
 * lo rende contestabile già in standard). Cambia sui nuclei parziali, dove il
 * peso del vizio decide fra contestabile e non conforme.
 */
export function evaluateReport(input: ReportInput, difficulty: DifficultyMode = 'standard'): ReportResult {
  const { caseData, citedClues, classification, measure, subject, motivationIndex } = input;
  const coreGrade = gradeCore(caseData, classification, measure);
  const subjectGrade = gradeSubject(caseData, subject);
  const motivationGrade = gradeMotivation(caseData, motivationIndex);
  const cluesOk = cluesSupportClassification(caseData, citedClues);
  const overcaution = isOvercaution(caseData, classification, measure);

  const strict = difficulty === 'expert';
  // in 'expert' soggetto parziale e motivazione debole pesano come vizi gravi
  const foundationHardFlaw =
    subjectGrade === 'wrong' ||
    motivationGrade === 'wrong' ||
    (strict && (subjectGrade === 'partial' || motivationGrade === 'weak'));
  const foundationSoftFlaw = !cluesOk || subjectGrade === 'partial' || motivationGrade === 'weak';
  const lenient = difficulty === 'base';
  // in 'base' i vizi lievi non contano ai fini dell'esito; restano i gravi
  const foundationFlaw = lenient ? foundationHardFlaw : foundationHardFlaw || foundationSoftFlaw;

  let outcome: ReportOutcome;
  if (coreGrade === 'wrong') {
    outcome = 'non_conforme';
  } else if (coreGrade === 'correct') {
    outcome = foundationFlaw ? 'contestabile' : 'conforme';
  } else {
    // nucleo parziale
    if (!foundationFlaw) outcome = 'parziale';
    else if (foundationHardFlaw && !overcaution && !lenient) outcome = 'non_conforme';
    else outcome = 'contestabile';
  }

  const { dominantError, secondaryErrors } = pickErrors({
    caseData,
    classification,
    measure,
    coreGrade,
    subjectGrade,
    motivationGrade,
    cluesOk,
    overcaution,
    outcome
  });

  return {
    outcome,
    quality: OUTCOME_TO_QUALITY[outcome],
    dominantError,
    secondaryErrors,
    coreGrade,
    subjectGrade,
    motivationGrade,
    cluesOk,
    overcaution
  };
}

interface ErrorPickContext {
  caseData: CaseData;
  classification: Classification;
  measure: Measure;
  coreGrade: CoreGrade;
  subjectGrade: SubjectGrade;
  motivationGrade: MotivationGrade;
  cluesOk: boolean;
  overcaution: boolean;
  outcome: ReportOutcome;
}

/**
 * Sceglie un solo errore dominante (quello che spiega l'esito) e al massimo
 * due rilievi secondari. La priorità dipende dall'esito: per gli atti
 * contestabili viene prima il vizio di fondamento, per quelli parziali il
 * difetto di merito.
 */
function pickErrors(ctx: ErrorPickContext): { dominantError: ErrorType | null; secondaryErrors: ErrorType[] } {
  // un atto conforme non ha rilievi (in 'base' i vizi lievi sono perdonati)
  if (ctx.outcome === 'conforme') return { dominantError: null, secondaryErrors: [] };
  const candidates: ErrorType[] = [];
  const classOk = ctx.classification === ctx.caseData.correctClassification;
  const measureFull = ctx.caseData.correctMeasures.includes(ctx.measure);

  if (!classOk) candidates.push('classificazione');
  if (classOk && !measureFull) {
    if (ctx.overcaution) candidates.push('eccesso_cautela');
    else if (ctx.caseData.correctClassification === 'trasparenza') candidates.push('trasparenza');
    else candidates.push('misura_insufficiente');
  }
  if (ctx.subjectGrade !== 'full') candidates.push('soggetto');
  if (!ctx.cluesOk) candidates.push('prove');
  if (ctx.motivationGrade !== 'correct') candidates.push('motivazione');

  if (candidates.length === 0) return { dominantError: null, secondaryErrors: [] };

  const priorityByOutcome: Record<ReportOutcome, ErrorType[]> = {
    conforme: [],
    // vizio di merito davanti: spiega perché l'atto è solo parziale
    parziale: ['trasparenza', 'eccesso_cautela', 'misura_insufficiente', 'classificazione', 'soggetto', 'prove', 'motivazione'],
    // vizio di fondamento davanti: spiega perché l'atto è impugnabile
    contestabile: ['soggetto', 'prove', 'motivazione', 'trasparenza', 'eccesso_cautela', 'misura_insufficiente', 'classificazione'],
    non_conforme: ['classificazione', 'misura_insufficiente', 'soggetto', 'motivazione', 'prove', 'trasparenza', 'eccesso_cautela']
  };

  const order = priorityByOutcome[ctx.outcome];
  const sorted = [...candidates].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return { dominantError: sorted[0], secondaryErrors: sorted.slice(1, 3) };
}

/** Tipi condivisi del dominio di gioco. */

export type Classification =
  | 'vietata'
  | 'alto_rischio'
  | 'trasparenza'
  | 'basso_rischio'
  | 'non_rilevante';

export type Measure =
  | 'blocco'
  | 'oversight'
  | 'audit'
  | 'informare'
  | 'etichettare'
  | 'dati_logging'
  | 'nessuna';

export type OutcomeQuality = 'correct' | 'partial' | 'wrong';

export interface IndicatorState {
  efficienza: number;
  controllo: number;
  diritti: number;
  fiducia: number;
}

export type IndicatorKey = keyof IndicatorState;

export interface Clue {
  id: string;
  title: string;
  text: string;
}

export interface CaseData {
  id: string;
  locationId: string;
  locationName: string;
  title: string;
  /** Codice fascicolo mostrato nella UI, es. "AX-031/2032". */
  fileCode: string;
  scenario: string;
  clues: Clue[];
  correctClassification: Classification;
  /** Misure che danno credito pieno. */
  correctMeasures: Measure[];
  /** Misure che danno credito parziale (mitigano senza risolvere). */
  partialMeasures: Measure[];
  normId: string;
  noteCorrect: string;
  notePartial: string;
  noteWrong: string;
  consequenceCorrect: string;
  consequenceWrong: string;
  playable: boolean;
}

export interface NormCardData {
  id: string;
  title: string;
  reference: string;
  /** Livello nella piramide del rischio dell'AI Act. */
  level: 'Pratica vietata' | 'Alto rischio' | 'Trasparenza' | 'Condizioni restrittive';
  explanation: string;
  democraticFunction: string;
  tags: string[];
  iconKey: string;
}

export interface EndingData {
  id: string;
  title: string;
  text: string;
}

export interface LocationData {
  id: string;
  name: string;
  x: number; // coordinate relative 0..1 sulla mappa
  y: number;
  iconKey: string;
  caseId: string | null;
}

export interface SaveData {
  version: number;
  indicators: IndicatorState;
  completedCases: Record<string, OutcomeQuality>;
  unlockedNorms: string[];
  audioMuted: boolean;
  reducedMotion: boolean;
  crtOverlay: boolean;
  endingId: string | null;
  briefingSeen: boolean;
}

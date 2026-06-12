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

/** Lingue supportate. Estensione futura: 'fr' | 'es'. */
export type LanguageCode = 'it' | 'en';

export type NormLevel = 'vietata' | 'alto' | 'trasparenza' | 'restrittivo';

export interface IndicatorState {
  efficienza: number;
  controllo: number;
  diritti: number;
  fiducia: number;
}

export type IndicatorKey = keyof IndicatorState;

/**
 * Dati STRUTTURALI di un caso. Tutto il testo visibile all'utente vive in
 * src/game/i18n/<lingua>.ts sotto cases[id].
 */
export interface CaseData {
  id: string;
  locationId: string;
  /** Codice fascicolo mostrato nella UI, es. "AX-031/2032". */
  fileCode: string;
  correctClassification: Classification;
  /** Misure che danno credito pieno. */
  correctMeasures: Measure[];
  /** Misure che danno credito parziale (mitigano senza risolvere). */
  partialMeasures: Measure[];
  /**
   * Indici (0..2) dei reperti che giustificano la classificazione corretta.
   * Il terzo indizio è sempre vero ma punta a una dimensione diversa del
   * problema: selezionarlo al posto di uno rilevante degrada l'esito.
   */
  relevantClues: number[];
  normId: string;
  playable: boolean;
}

/** Testi localizzati di un caso (vedi i18n). */
export interface CaseTexts {
  title: string;
  scenario: string;
  clues: { title: string; text: string }[];
  noteCorrect: string;
  notePartial: string;
  noteWrong: string;
  consequenceCorrect: string;
  consequenceWrong: string;
}

/** Dati STRUTTURALI di una carta norma; testi in i18n sotto norms[id]. */
export interface NormCardData {
  id: string;
  level: NormLevel;
  iconKey: string;
}

/** Testi localizzati di una carta norma. */
export interface NormTexts {
  title: string;
  reference: string;
  explanation: string;
  democraticFunction: string;
  tags: string[];
}

/** Vista completa (struttura + testi) usata dalla UI. */
export interface NormView extends NormCardData, NormTexts {}

export interface LocationData {
  id: string;
  x: number; // coordinate relative 0..1 sulla mappa
  y: number;
  iconKey: string;
  caseId: string | null;
}

export type EndingId = 'ending_opaca' | 'ending_fragile' | 'ending_governata';

export interface SaveData {
  version: number;
  indicators: IndicatorState;
  completedCases: Record<string, OutcomeQuality>;
  unlockedNorms: string[];
  audioMuted: boolean;
  /** Volume musica 0..1 (gli effetti seguono solo il mute globale). */
  musicVolume: number;
  reducedMotion: boolean;
  crtOverlay: boolean;
  language: LanguageCode;
  endingId: string | null;
  briefingSeen: boolean;
}

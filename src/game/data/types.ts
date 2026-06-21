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

/** Soggetti a cui l'ispettore può imputare gli obblighi principali. */
export type ResponsibleSubject =
  | 'provider'
  | 'deployer'
  | 'autorita'
  | 'responsabile_umano'
  | 'fornitore_esterno';

/** Esito del rapporto ispettivo (v0.3). */
export type ReportOutcome = 'conforme' | 'parziale' | 'contestabile' | 'non_conforme';

/** Tassonomia degli errori per il feedback tipizzato. */
export type ErrorType =
  | 'classificazione'
  | 'prove'
  | 'misura_insufficiente'
  | 'eccesso_cautela'
  | 'soggetto'
  | 'trasparenza'
  | 'motivazione';

/** Scelte disponibili durante un evento imprevisto. */
export type IncidentChoice = 'document' | 'suspend' | 'minimize';

/** Lingue supportate. Estensione futura: 'fr' | 'es'. */
export type LanguageCode = 'it' | 'en';

export type NormLevel = 'vietata' | 'alto' | 'trasparenza' | 'restrittivo';

/** Livelli di difficoltà selezionabili (v0.4). */
export type DifficultyMode = 'base' | 'standard' | 'expert';

/** Percorsi didattici / missioni (v0.4; 'pack' = Advanced Case Pack v0.6). */
export type MissionId = 'demo' | 'lab' | 'full' | 'advanced' | 'pack';

/** Fonte/attendibilità di un reperto (etichetta investigativa, v0.4). */
export type EvidenceSource =
  | 'amministrativa'
  | 'tecnica'
  | 'vendor'
  | 'reclamo'
  | 'pubblica'
  | 'log'
  | 'interna';

/**
 * Funzione investigativa di un reperto (v0.5): come si colloca rispetto al
 * rischio. Strutturale e indipendente dalla lingua (le etichette sono in i18n
 * sotto ui.evidence.stances). 'decisive' allinea il reperto a relevantClues.
 */
export type EvidenceStance =
  | 'supports_risk'
  | 'minimizes_risk'
  | 'ambiguous'
  | 'contextual'
  | 'concrete_effect'
  | 'decisive';

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
  /** Soggetto a cui imputare gli obblighi principali. */
  responsibleSubjectCorrect: ResponsibleSubject;
  /** Soggetto difendibile ma incompleto (opzionale). */
  responsibleSubjectPartial?: ResponsibleSubject;
  /** Indice (0..2) della motivazione corretta in CaseTexts.motivations. */
  correctMotivation: number;
  /** Indice (0..2) della motivazione plausibile ma debole. */
  weakMotivation: number;
  /** Errori dominanti plausibili per questo caso (documentazione/debrief). */
  possibleDominantErrors: ErrorType[];
  /**
   * Funzione investigativa di ciascun reperto (v0.5), parallela ai clues
   * dell'i18n. Opzionale: presente solo nei casi resi più investigativi.
   */
  clueStances?: EvidenceStance[];
  /** true solo per i 3 casi con evento imprevisto nella v0.3. */
  hasIncident: boolean;
  /** Delta indicatori per ciascuna scelta dell'evento (se presente). */
  incidentDeltas?: Record<IncidentChoice, Partial<IndicatorState>>;
}

/** Testi localizzati di un caso (vedi i18n). */
export interface CaseTexts {
  title: string;
  scenario: string;
  clues: { title: string; text: string }[];
  /** Etichetta-fonte opzionale per ciascun reperto (parallela a clues). */
  clueSources?: EvidenceSource[];
  noteCorrect: string;
  notePartial: string;
  noteWrong: string;
  consequenceCorrect: string;
  consequenceWrong: string;
  /** Tre motivazioni predefinite: corretta/debole/errata (ordine per caso). */
  motivations: [string, string, string];
  /** Tre domande di discussione per la modalità docente. */
  debriefQuestions: [string, string, string];
  /** Epilogo breve del caso, usato nel debrief docente. */
  epilogue: string;
  /** Testi dell'evento imprevisto (solo per i casi con hasIncident). */
  incident?: {
    title: string;
    text: string;
    options: { document: string; suspend: string; minimize: string };
  };
}

/** Rapporto archiviato per il debrief docente. */
export interface CaseReport {
  outcome: ReportOutcome;
  dominantError: ErrorType | null;
  classification: Classification;
  measure: Measure;
  subject: ResponsibleSubject;
  motivationIndex: number;
  citedClues: number[];
  incidentChoice?: IncidentChoice;
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
  /** Riga anti-frainteso: "Non significa che…". */
  notMeaning: string;
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
  /** Rapporti ispettivi archiviati, per il debrief docente. */
  caseReports: Record<string, CaseReport>;
  /** Modalità docente attiva. */
  teacherMode: boolean;
  /** Avvio partita (epoch ms) per il tempo di completamento. Non è un dato personale. */
  startedAt: number | null;
  /** Difficoltà selezionata (v0.4). Default sicuro: 'standard'. */
  difficulty: DifficultyMode;
  /** Missione/percorso selezionato (v0.4). Default sicuro: 'full'. */
  mission: MissionId;
}

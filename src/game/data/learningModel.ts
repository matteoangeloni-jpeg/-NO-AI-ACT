import { PLAYABLE_CASES, getCase } from './cases';
import type { Measure, ResponsibleSubject } from './types';

/**
 * Modello di apprendimento versionato (2.0 — mission §10.1).
 *
 * Entità tipate e STRUTTURALI: obiettivi, misconcezioni, mappatura
 * caso→obiettivi e matrice legale machine-readable. Tutti i testi visibili
 * vivono in i18n (`learningLayer.*` + le schede `caseLearning` esistenti).
 * Il modello NON tocca il punteggio: descrive che cosa ogni caso insegna,
 * per debrief, capitoli, autocontrollo e ricerca (stimoli riproducibili).
 */

export const LEARNING_MODEL_VERSION = 1;

export type CompetenceId =
  | 'classify'
  | 'evidence'
  | 'responsibility'
  | 'measures'
  | 'transparency'
  | 'oversight'
  | 'context'
  | 'gpai';

export interface LearningObjective {
  id: ObjectiveId;
  competence: CompetenceId;
}

export type ObjectiveId =
  | 'obj_prohibited_boundary'
  | 'obj_risk_classification'
  | 'obj_decisive_evidence'
  | 'obj_actor_responsibility'
  | 'obj_proportionate_measures'
  | 'obj_transparency_duties'
  | 'obj_human_oversight'
  | 'obj_context_dependence'
  | 'obj_gpai_downstream';

export const OBJECTIVES: LearningObjective[] = [
  { id: 'obj_prohibited_boundary', competence: 'classify' },
  { id: 'obj_risk_classification', competence: 'classify' },
  { id: 'obj_decisive_evidence', competence: 'evidence' },
  { id: 'obj_actor_responsibility', competence: 'responsibility' },
  { id: 'obj_proportionate_measures', competence: 'measures' },
  { id: 'obj_transparency_duties', competence: 'transparency' },
  { id: 'obj_human_oversight', competence: 'oversight' },
  { id: 'obj_context_dependence', competence: 'context' },
  { id: 'obj_gpai_downstream', competence: 'gpai' }
];

export type MisconceptionId =
  | 'mis_ai_always_banned'
  | 'mis_high_risk_means_banned'
  | 'mis_disclaimer_sufficient'
  | 'mis_formal_oversight_enough'
  | 'mis_provider_only'
  | 'mis_accuracy_equals_lawful'
  | 'mis_transparency_optional'
  | 'mis_context_irrelevant'
  | 'mis_gpai_unregulated';

export const MISCONCEPTIONS: MisconceptionId[] = [
  'mis_ai_always_banned',
  'mis_high_risk_means_banned',
  'mis_disclaimer_sufficient',
  'mis_formal_oversight_enough',
  'mis_provider_only',
  'mis_accuracy_equals_lawful',
  'mis_transparency_optional',
  'mis_context_irrelevant',
  'mis_gpai_unregulated'
];

/** Aree del Regolamento (UE) 2024/1689 usate come ancore didattiche. */
export type ProvisionId = 'art5' | 'annex3' | 'art50' | 'chapter5' | 'art14' | 'art26';

export interface LegalMatrixRow {
  provision: ProvisionId;
  /** Riferimento leggibile, non tradotto (identico in tutte le lingue). */
  articleRef: string;
  normIds: string[];
  caseIds: string[];
}

/**
 * Matrice legale machine-readable: area della norma → carte norma del gioco →
 * casi. Ancoraggio didattico, NON parere legale: la fonte è sempre EUR-Lex.
 */
export const LEGAL_MATRIX: LegalMatrixRow[] = [
  {
    provision: 'art5',
    articleRef: 'Reg. (UE) 2024/1689, art. 5',
    normIds: ['norm_social_scoring', 'norm_emotion_recognition', 'norm_biometria', 'norm_credito', 'norm_predpol'],
    caseIds: ['case_scoring', 'case_scuola', 'case_biometria', 'case_credito', 'case_predpol']
  },
  {
    provision: 'annex3',
    articleRef: 'Reg. (UE) 2024/1689, capo III e allegato III',
    normIds: ['norm_lavoro_alto_rischio', 'norm_alto_rischio_obblighi', 'norm_procurement', 'norm_edtech', 'norm_frodi_welfare'],
    caseIds: ['case_lavoro', 'case_ospedale', 'case_procurement', 'case_edtech', 'case_frodi']
  },
  {
    provision: 'art50',
    articleRef: 'Reg. (UE) 2024/1689, art. 50',
    normIds: ['norm_trasparenza_sintetici', 'norm_chatbot'],
    caseIds: ['case_media', 'case_chatbot']
  },
  {
    provision: 'chapter5',
    articleRef: 'Reg. (UE) 2024/1689, capo V',
    normIds: ['norm_gpai'],
    caseIds: ['case_gpai']
  },
  {
    provision: 'art14',
    articleRef: 'Reg. (UE) 2024/1689, art. 14',
    normIds: ['norm_lavoro_alto_rischio', 'norm_alto_rischio_obblighi', 'norm_frodi_welfare'],
    caseIds: ['case_lavoro', 'case_ospedale', 'case_frodi']
  },
  {
    provision: 'art26',
    articleRef: 'Reg. (UE) 2024/1689, art. 26',
    normIds: ['norm_procurement', 'norm_edtech', 'norm_gpai'],
    caseIds: ['case_procurement', 'case_edtech', 'case_gpai']
  }
];

export interface CaseObjectiveMap {
  caseId: string;
  /** Un obiettivo primario per caso. */
  primaryObjective: ObjectiveId;
  /** Fino a tre obiettivi secondari. */
  secondaryObjectives: ObjectiveId[];
  /** Aree normative rilevanti (devono esistere nella LEGAL_MATRIX). */
  provisions: ProvisionId[];
  /** Misconcezioni attese che il caso mette alla prova. */
  misconceptions: MisconceptionId[];
}

export const CASE_OBJECTIVES: CaseObjectiveMap[] = [
  {
    caseId: 'case_scoring',
    primaryObjective: 'obj_prohibited_boundary',
    secondaryObjectives: ['obj_decisive_evidence', 'obj_actor_responsibility'],
    provisions: ['art5'],
    misconceptions: ['mis_ai_always_banned', 'mis_accuracy_equals_lawful']
  },
  {
    caseId: 'case_lavoro',
    primaryObjective: 'obj_risk_classification',
    secondaryObjectives: ['obj_human_oversight', 'obj_actor_responsibility'],
    provisions: ['annex3', 'art14'],
    misconceptions: ['mis_high_risk_means_banned', 'mis_formal_oversight_enough']
  },
  {
    caseId: 'case_media',
    primaryObjective: 'obj_transparency_duties',
    secondaryObjectives: ['obj_actor_responsibility', 'obj_proportionate_measures'],
    provisions: ['art50'],
    misconceptions: ['mis_transparency_optional', 'mis_provider_only']
  },
  {
    caseId: 'case_scuola',
    primaryObjective: 'obj_prohibited_boundary',
    secondaryObjectives: ['obj_context_dependence', 'obj_decisive_evidence'],
    provisions: ['art5'],
    misconceptions: ['mis_context_irrelevant', 'mis_accuracy_equals_lawful']
  },
  {
    caseId: 'case_ospedale',
    primaryObjective: 'obj_human_oversight',
    secondaryObjectives: ['obj_risk_classification', 'obj_proportionate_measures'],
    provisions: ['annex3', 'art14'],
    misconceptions: ['mis_formal_oversight_enough', 'mis_high_risk_means_banned']
  },
  {
    caseId: 'case_biometria',
    primaryObjective: 'obj_prohibited_boundary',
    secondaryObjectives: ['obj_context_dependence', 'obj_proportionate_measures'],
    provisions: ['art5'],
    misconceptions: ['mis_context_irrelevant', 'mis_disclaimer_sufficient']
  },
  {
    caseId: 'case_credito',
    primaryObjective: 'obj_context_dependence',
    secondaryObjectives: ['obj_prohibited_boundary', 'obj_decisive_evidence'],
    provisions: ['art5'],
    misconceptions: ['mis_ai_always_banned', 'mis_context_irrelevant']
  },
  {
    caseId: 'case_chatbot',
    primaryObjective: 'obj_transparency_duties',
    secondaryObjectives: ['obj_proportionate_measures', 'obj_context_dependence'],
    provisions: ['art50'],
    misconceptions: ['mis_transparency_optional', 'mis_disclaimer_sufficient']
  },
  {
    caseId: 'case_procurement',
    primaryObjective: 'obj_actor_responsibility',
    secondaryObjectives: ['obj_risk_classification', 'obj_decisive_evidence'],
    provisions: ['annex3', 'art26'],
    misconceptions: ['mis_provider_only', 'mis_accuracy_equals_lawful']
  },
  {
    caseId: 'case_edtech',
    primaryObjective: 'obj_risk_classification',
    secondaryObjectives: ['obj_context_dependence', 'obj_actor_responsibility'],
    provisions: ['annex3', 'art26'],
    misconceptions: ['mis_high_risk_means_banned', 'mis_context_irrelevant']
  },
  {
    caseId: 'case_gpai',
    primaryObjective: 'obj_gpai_downstream',
    secondaryObjectives: ['obj_actor_responsibility', 'obj_human_oversight'],
    provisions: ['chapter5', 'art26'],
    misconceptions: ['mis_gpai_unregulated', 'mis_provider_only']
  },
  {
    caseId: 'case_predpol',
    primaryObjective: 'obj_prohibited_boundary',
    secondaryObjectives: ['obj_decisive_evidence', 'obj_context_dependence'],
    provisions: ['art5'],
    misconceptions: ['mis_accuracy_equals_lawful', 'mis_context_irrelevant']
  },
  {
    caseId: 'case_frodi',
    primaryObjective: 'obj_decisive_evidence',
    secondaryObjectives: ['obj_human_oversight', 'obj_risk_classification'],
    provisions: ['annex3', 'art14'],
    misconceptions: ['mis_formal_oversight_enough', 'mis_high_risk_means_banned']
  }
];

/**
 * Vista completa per un caso: mappa didattica + soluzione ESISTENTE del caso
 * (prove decisive, soggetto, misure) senza duplicare i dati — la fonte della
 * verità sulla soluzione resta cases.ts.
 */
export interface CaseObjectiveView extends CaseObjectiveMap {
  decisiveClues: number[];
  responsibleActor: ResponsibleSubject;
  correctiveMeasures: Measure[];
}

export function caseObjectives(caseId: string): CaseObjectiveView {
  const map = CASE_OBJECTIVES.find((m) => m.caseId === caseId);
  if (!map) throw new Error(`Mappa didattica mancante per il caso: ${caseId}`);
  const c = getCase(caseId);
  return {
    ...map,
    decisiveClues: [...c.relevantClues],
    responsibleActor: c.responsibleSubjectCorrect,
    correctiveMeasures: [...c.correctMeasures]
  };
}

export function allCaseObjectives(): CaseObjectiveView[] {
  return PLAYABLE_CASES.map((c) => caseObjectives(c.id));
}

// ------------------------------------------------------------ self-check

/**
 * Autocontrollo locale facoltativo (mission §10.3): domande mappate sugli
 * obiettivi (non curiosità). Testi in i18n `learningLayer.selfCheck.questions`;
 * qui solo struttura + indice della risposta corretta.
 */
export interface SelfCheckQuestion {
  id: string;
  objectiveId: ObjectiveId;
  correctIndex: 0 | 1 | 2;
}

export const SELF_CHECK_QUESTIONS: SelfCheckQuestion[] = [
  { id: 'sc_prohibited', objectiveId: 'obj_prohibited_boundary', correctIndex: 1 },
  { id: 'sc_high_risk', objectiveId: 'obj_risk_classification', correctIndex: 2 },
  { id: 'sc_transparency', objectiveId: 'obj_transparency_duties', correctIndex: 0 },
  { id: 'sc_oversight', objectiveId: 'obj_human_oversight', correctIndex: 2 },
  { id: 'sc_actor', objectiveId: 'obj_actor_responsibility', correctIndex: 1 },
  { id: 'sc_context', objectiveId: 'obj_context_dependence', correctIndex: 0 }
];

import type { LanguageCode } from './types';

/**
 * Tassonomia strutturale dei concetti AI Act (v1.1 — Learning Experience).
 * Ogni caso giocabile è taggato con uno o più concetti (cases.ts): i tag
 * alimentano il debrief della decisione e il rapporto di apprendimento
 * finale. Le etichette localizzate vivono in i18n sotto ui.concepts.
 * Nessun dato lascia il browser: i concetti servono solo alla UI locale.
 */
export type ConceptId =
  | 'risk_based_approach'
  | 'prohibited_practices'
  | 'high_risk'
  | 'transparency'
  | 'gpai'
  | 'human_oversight'
  | 'data_governance'
  | 'privacy_by_design'
  | 'ai_literacy';

export const CONCEPT_IDS: ConceptId[] = [
  'risk_based_approach',
  'prohibited_practices',
  'high_risk',
  'transparency',
  'gpai',
  'human_oversight',
  'data_governance',
  'privacy_by_design',
  'ai_literacy'
];

/**
 * Pagina educativa del sito per ogni concetto, per lingua. Percorsi INTERNI
 * (stessa origine): il gioco non apre mai servizi esterni per l'apprendimento.
 * L'esistenza di ogni pagina è verificata dai test (tests/learningExperience).
 */
export const CONCEPT_LINKS: Record<ConceptId, Record<LanguageCode, string>> = {
  risk_based_approach: { it: '/categorie-rischio-ai-act/', en: '/en/ai-act-risk-categories/' },
  prohibited_practices: { it: '/pratiche-vietate-ai-act/', en: '/en/prohibited-ai-practices/' },
  high_risk: { it: '/sistemi-ai-ad-alto-rischio/', en: '/en/high-risk-ai-systems/' },
  transparency: { it: '/obblighi-trasparenza-ai-act/', en: '/en/transparency-obligations/' },
  gpai: { it: '/ai-generativa-e-gpai/', en: '/en/general-purpose-ai/' },
  human_oversight: { it: '/guida-ai-act/', en: '/en/eu-ai-act-guide/' },
  data_governance: { it: '/glossario/', en: '/en/glossary/' },
  privacy_by_design: { it: '/privacy-by-design/', en: '/en/privacy-by-design/' },
  ai_literacy: { it: '/alfabetizzazione-ai/', en: '/en/ai-literacy/' }
};

/** Pagine consigliate quando non ci sono concetti deboli da approfondire. */
export const FALLBACK_LINKS: Record<LanguageCode, string[]> = {
  it: ['/educazione/', '/guida-ai-act/', '/glossario/'],
  en: ['/en/education/', '/en/eu-ai-act-guide/', '/en/glossary/']
};

/**
 * Risorse per la modalità docente (guida in gioco + export del debrief).
 * Le quattro pagine sono richieste in entrambe le lingue perché una classe
 * può giocare in una lingua e preparare la lezione nell'altra.
 */
export const TEACHER_RESOURCES: { id: string; url: string }[] = [
  { id: 'activities_it', url: '/attivita-didattiche/' },
  { id: 'lesson_it', url: '/lezione-introduzione-ai-act/' },
  { id: 'activities_en', url: '/en/classroom-activities/' },
  { id: 'lesson_en', url: '/en/lesson-plan-introduction-to-the-ai-act/' }
];

export function conceptLink(id: ConceptId, lang: LanguageCode): string {
  return CONCEPT_LINKS[id][lang];
}

/**
 * Collegamenti dal gioco al sito (v1.2 — navigazione gioco→sito). Percorsi
 * RELATIVI a /play/ (stessa origine): il gioco non apre mai servizi esterni.
 * `home` porta alla landing della lingua; gli altri alle pagine dell'hub.
 */
export interface SiteLinkSet {
  hub: string;
  glossary: string;
  teacher: string;
  privacy: string;
  home: string;
}

export const SITE_LINKS: Record<LanguageCode, SiteLinkSet> = {
  it: {
    hub: '../educazione/',
    glossary: '../glossario/',
    teacher: '../ai-act-per-docenti/',
    privacy: '../privacy-by-design/',
    home: '../'
  },
  en: {
    hub: '../en/education/',
    glossary: '../en/glossary/',
    teacher: '../en/ai-act-for-teachers/',
    privacy: '../en/privacy-by-design/',
    home: '../en/'
  }
};

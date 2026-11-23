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
  risk_based_approach: { it: '/categorie-rischio-ai-act/', en: '/en/ai-act-risk-categories/', fr: '/fr/categories-de-risque-ai-act/', de: '/de/ki-risikokategorien/', es: '/es/categorias-riesgo-ia/', pt: '/pt/categorias-risco-ia/' },
  prohibited_practices: { it: '/pratiche-vietate-ai-act/', en: '/en/prohibited-ai-practices/', fr: '/fr/pratiques-interdites-ai-act/', de: '/de/verbotene-ki-praktiken/', es: '/es/practicas-ia-prohibidas/', pt: '/pt/praticas-ia-proibidas/' },
  high_risk: { it: '/sistemi-ai-ad-alto-rischio/', en: '/en/high-risk-ai-systems/', fr: '/fr/systemes-ia-a-haut-risque/', de: '/de/hochrisiko-ki-systeme/', es: '/es/sistemas-ia-alto-riesgo/', pt: '/pt/sistemas-ia-risco-elevado/' },
  transparency: { it: '/obblighi-trasparenza-ai-act/', en: '/en/transparency-obligations/', fr: '/fr/obligations-de-transparence/', de: '/de/ki-transparenzpflichten/', es: '/es/obligaciones-transparencia-ia/', pt: '/pt/obrigacoes-transparencia-ia/' },
  gpai: { it: '/ai-generativa-e-gpai/', en: '/en/general-purpose-ai/', fr: '/fr/ia-a-usage-general/', de: '/de/ki-modelle-allgemeiner-verwendungszweck/', es: '/es/modelos-ia-uso-general/', pt: '/pt/modelos-ia-finalidade-geral/' },
  human_oversight: { it: '/guida-ai-act/', en: '/en/eu-ai-act-guide/', fr: '/fr/guide-ai-act/', de: '/de/ki-verordnung-leitfaden/', es: '/es/guia-reglamento-ia/', pt: '/pt/guia-regulamento-ia/' },
  data_governance: { it: '/glossario/', en: '/en/glossary/', fr: '/fr/glossaire/', de: '/de/ki-verordnung-glossar/', es: '/es/glosario-ia/', pt: '/pt/glossario-ia/' },
  privacy_by_design: { it: '/privacy-by-design/', en: '/en/privacy-by-design/', fr: '/fr/protection-des-donnees-des-la-conception/', de: '/de/datenschutz/', es: '/es/privacidad/', pt: '/pt/privacidade/' },
  ai_literacy: { it: '/alfabetizzazione-ai/', en: '/en/ai-literacy/', fr: '/fr/maitrise-de-l-ia/', de: '/de/ki-kompetenz/', es: '/es/alfabetizacion-ia/', pt: '/pt/literacia-ia/' }
};

/** Pagine consigliate quando non ci sono concetti deboli da approfondire. */
export const FALLBACK_LINKS: Record<LanguageCode, string[]> = {
  it: ['/educazione/', '/guida-ai-act/', '/glossario/'],
  en: ['/en/education/', '/en/eu-ai-act-guide/', '/en/glossary/'],
  fr: ['/fr/education/', '/fr/guide-ai-act/', '/fr/glossaire/'],
  de: ['/de/bildung/', '/de/ki-verordnung-leitfaden/', '/de/ki-verordnung-glossar/'],
  es: ['/es/educacion/', '/es/guia-reglamento-ia/', '/es/glosario-ia/'],
  pt: ['/pt/educacao/', '/pt/guia-regulamento-ia/', '/pt/glossario-ia/']
};

/**
 * Risorse per la modalità docente (guida in gioco + export del debrief).
 * Le pagine sono disponibili nelle sei lingue perché una classe
 * può giocare in una lingua e preparare la lezione nell'altra.
 */
export const TEACHER_RESOURCES: { id: string; url: string }[] = [
  { id: 'activities_it', url: '/attivita-didattiche/' },
  { id: 'lesson_it', url: '/lezione-introduzione-ai-act/' },
  { id: 'activities_en', url: '/en/classroom-activities/' },
  { id: 'lesson_en', url: '/en/lesson-plan-introduction-to-the-ai-act/' },
  { id: 'activities_fr', url: '/fr/activites-pedagogiques/' },
  { id: 'lesson_fr', url: '/fr/seance-introduction-ai-act/' },
  { id: 'activities_de', url: '/de/unterrichtsaktivitaeten/' },
  { id: 'lesson_de', url: '/de/unterrichtsplan-ki-einstieg/' },
  { id: 'activities_es', url: '/es/actividades-didacticas/' },
  { id: 'lesson_es', url: '/es/plan-clase-introduccion-ia/' },
  { id: 'activities_pt', url: '/pt/atividades-pedagogicas/' },
  { id: 'lesson_pt', url: '/pt/plano-aula-introducao-ia/' }
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
  /** "come funziona il gioco" — rappresenta il gruppo Play nell'overlay. */
  play: string;
  hub: string;
  teacher: string;
  /** guida all'AI Act — gruppo AI Act. */
  guide: string;
  glossary: string;
  privacy: string;
  home: string;
}

export const SITE_LINKS: Record<LanguageCode, SiteLinkSet> = {
  it: {
    play: '../come-funziona/',
    hub: '../educazione/',
    teacher: '../ai-act-per-docenti/',
    guide: '../guida-ai-act/',
    glossary: '../glossario/',
    privacy: '../privacy-by-design/',
    home: '../'
  },
  en: {
    play: '../en/how-it-works/',
    hub: '../en/education/',
    teacher: '../en/ai-act-for-teachers/',
    guide: '../en/eu-ai-act-guide/',
    glossary: '../en/glossary/',
    privacy: '../en/privacy-by-design/',
    home: '../en/'
  },
  de: {
    play: '../de/so-funktioniert-es/', hub: '../de/bildung/', teacher: '../de/ki-verordnung-fuer-lehrkraefte/',
    guide: '../de/ki-verordnung-leitfaden/', glossary: '../de/ki-verordnung-glossar/', privacy: '../de/datenschutz/', home: '../de/'
  },
  es: {
    play: '../es/como-funciona/', hub: '../es/educacion/', teacher: '../es/reglamento-ia-para-docentes/',
    guide: '../es/guia-reglamento-ia/', glossary: '../es/glosario-ia/', privacy: '../es/privacidad/', home: '../es/'
  },
  pt: {
    play: '../pt/como-funciona/', hub: '../pt/educacao/', teacher: '../pt/regulamento-ia-para-docentes/',
    guide: '../pt/guia-regulamento-ia/', glossary: '../pt/glossario-ia/', privacy: '../pt/privacidade/', home: '../pt/'
  },
  fr: {
    play: '../fr/comment-ca-marche/',
    hub: '../fr/education/',
    teacher: '../fr/ai-act-pour-enseignants/',
    guide: '../fr/guide-ai-act/',
    glossary: '../fr/glossaire/',
    privacy: '../fr/protection-des-donnees-des-la-conception/',
    home: '../fr/'
  }
};

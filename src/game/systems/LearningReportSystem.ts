import { getCase, PLAYABLE_CASES } from '../data/cases';
import { CONCEPT_IDS, CONCEPT_LINKS, FALLBACK_LINKS, type ConceptId } from '../data/concepts';
import type { LanguageCode, OutcomeQuality } from '../data/types';

/**
 * Rapporto di apprendimento finale (v1.1 — Learning Experience).
 *
 * Logica PURA e locale: legge gli esiti dei casi completati (già salvati in
 * localStorage dallo StateManager) e li aggrega per concetto AI Act. Nessun
 * dato viene inviato, memorizzato altrove o allegato a un identificativo:
 * il rapporto vive solo nella scena che lo mostra.
 *
 * Punteggio per concetto: media dei punti dei casi che lo toccano
 * (corretto = 2, parziale = 1, sbagliato = 0), quindi 0..2.
 */

const QUALITY_POINTS: Record<OutcomeQuality, number> = { correct: 2, partial: 1, wrong: 0 };

/** Un concetto incontrato, con quanti casi lo toccano e la media 0..2. */
export interface ConceptStat {
  id: ConceptId;
  casesCount: number;
  score: number;
}

export interface RecommendedLink {
  /** Concetto che motiva il consiglio; null per i consigli generali. */
  concept: ConceptId | null;
  /** Percorso interno del sito (stessa origine, mai servizi esterni). */
  url: string;
}

export interface LearningReportData {
  completedCount: number;
  totalPlayable: number;
  correct: number;
  partial: number;
  wrong: number;
  /** Concetti incontrati, nell'ordine della tassonomia. */
  concepts: ConceptStat[];
  /** Area più solida (score massimo; a parità, più casi). null senza casi. */
  strongest: ConceptId | null;
  /** Area da ripassare (score minimo, solo se non perfetto). */
  toReview: ConceptId | null;
  /** Esattamente 3 pagine interne consigliate, deboli prima. */
  recommended: RecommendedLink[];
}

export const RECOMMENDED_LINKS_COUNT = 3;

export function buildLearningReport(
  completedCases: Record<string, OutcomeQuality>,
  lang: LanguageCode
): LearningReportData {
  const counts = { correct: 0, partial: 0, wrong: 0 };
  const byConcept = new Map<ConceptId, number[]>();

  for (const [caseId, quality] of Object.entries(completedCases)) {
    counts[quality] += 1;
    for (const concept of getCase(caseId).concepts) {
      const scores = byConcept.get(concept) ?? [];
      scores.push(QUALITY_POINTS[quality]);
      byConcept.set(concept, scores);
    }
  }

  // ordine stabile: la tassonomia, non l'ordine di completamento
  const concepts: ConceptStat[] = CONCEPT_IDS.filter((id) => byConcept.has(id)).map((id) => {
    const scores = byConcept.get(id)!;
    return { id, casesCount: scores.length, score: scores.reduce((a, b) => a + b, 0) / scores.length };
  });

  let strongest: ConceptId | null = null;
  let toReview: ConceptId | null = null;
  if (concepts.length > 0) {
    const best = [...concepts].sort((a, b) => b.score - a.score || b.casesCount - a.casesCount)[0];
    strongest = best.id;
    const weak = [...concepts].sort((a, b) => a.score - b.score || b.casesCount - a.casesCount)[0];
    // un'area "da ripassare" esiste solo se qualcosa non è andato perfettamente
    if (weak.score < 2) toReview = weak.id;
  }

  return {
    completedCount: Object.keys(completedCases).length,
    totalPlayable: PLAYABLE_CASES.length,
    ...counts,
    concepts,
    strongest,
    toReview,
    recommended: recommendLinks(concepts, lang)
  };
}

/**
 * Tre pagine interne del sito: prima i concetti più deboli (score crescente),
 * poi — se mancano posti o è andato tutto bene — le pagine generali dell'hub.
 * Gli URL sono deduplicati (concetti diversi possono condividere la pagina).
 */
function recommendLinks(concepts: ConceptStat[], lang: LanguageCode): RecommendedLink[] {
  const links: RecommendedLink[] = [];
  const seen = new Set<string>();
  const push = (concept: ConceptId | null, url: string): void => {
    if (links.length >= RECOMMENDED_LINKS_COUNT || seen.has(url)) return;
    seen.add(url);
    links.push({ concept, url });
  };

  const weakFirst = [...concepts].sort((a, b) => a.score - b.score || b.casesCount - a.casesCount);
  for (const stat of weakFirst) {
    if (stat.score < 2) push(stat.id, CONCEPT_LINKS[stat.id][lang]);
  }
  for (const url of FALLBACK_LINKS[lang]) push(null, url);
  return links;
}

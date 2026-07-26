import { NORMS } from '../data/norms';
import { PLAYABLE_CASES } from '../data/cases';
import { GLOSSARY } from '../data/glossary';
import { L, caseText, normText } from '../i18n';

/**
 * Motore di ricerca dell'archivio (roadmap 2.1, Phase 2 §6 — Her Story):
 * indice per parole chiave su carte norma, voci di glossario e casi, nella
 * lingua corrente. Puro e locale: nessuna rete, nessun salvataggio; l'indice
 * si ricostruisce a ogni query dalla i18n corrente (i testi sono pochi).
 */
export type SearchHitKind = 'norm' | 'glossary' | 'case';

export interface SearchHit {
  kind: SearchHitKind;
  id: string;
  title: string;
  /** Numero di termini della query trovati (per l'ordinamento). */
  score: number;
}

const norm = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Cerca `query` su norme, glossario e casi. Query vuota → nessun filtro (tutte le norme). */
export function searchArchive(query: string): SearchHit[] {
  const terms = norm(query).split(/\s+/).filter((t) => t.length >= 2);
  const hits: SearchHit[] = [];
  const scoreOf = (haystack: string): number => {
    const h = norm(haystack);
    return terms.filter((t) => h.includes(t)).length;
  };

  for (const n of NORMS) {
    const t = normText(n.id);
    const s = terms.length === 0 ? 1 : scoreOf(`${t.title} ${t.explanation} ${t.reference} ${t.tags.join(' ')}`);
    if (s > 0) hits.push({ kind: 'norm', id: n.id, title: t.title, score: s });
  }
  if (terms.length > 0) {
    const g = L().glossary.entries as Record<string, { term: string; definition: string }>;
    for (const e of GLOSSARY) {
      const txt = g[e.id];
      if (!txt) continue;
      const s = scoreOf(`${txt.term} ${txt.definition}`);
      if (s > 0) hits.push({ kind: 'glossary', id: e.id, title: txt.term, score: s });
    }
    for (const c of PLAYABLE_CASES) {
      const t = caseText(c.id);
      const s = scoreOf(`${t.title} ${t.scenario}`);
      if (s > 0) hits.push({ kind: 'case', id: c.id, title: t.title, score: s });
    }
  }
  return hits.sort((a, b) => b.score - a.score);
}

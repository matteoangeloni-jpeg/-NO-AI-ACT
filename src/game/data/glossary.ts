import { L } from '../i18n';

/**
 * Glossario operativo (v0.5). Le voci e i loro collegamenti ai casi sono
 * STRUTTURALI (qui); i testi (term, definition, whyItMatters, caution) vivono
 * in i18n sotto glossary.entries[id]. Così i collegamenti ai casi non vanno
 * duplicati per lingua.
 */
export interface GlossaryEntryMeta {
  id: string;
  /** Casi collegati (id), per il rimando didattico. Può essere vuoto. */
  relatedCases: string[];
}

export const GLOSSARY: GlossaryEntryMeta[] = [
  { id: 'prohibited_practice', relatedCases: ['case_scoring', 'case_scuola', 'case_biometria', 'case_credito'] },
  { id: 'high_risk', relatedCases: ['case_lavoro', 'case_ospedale', 'case_credito', 'case_procurement', 'case_edtech', 'case_gpai'] },
  { id: 'transparency', relatedCases: ['case_media', 'case_chatbot'] },
  { id: 'challengeable', relatedCases: [] },
  { id: 'provider', relatedCases: ['case_lavoro', 'case_ospedale', 'case_gpai'] },
  { id: 'deployer', relatedCases: ['case_lavoro', 'case_ospedale', 'case_credito', 'case_chatbot', 'case_edtech', 'case_gpai'] },
  { id: 'human_oversight', relatedCases: ['case_lavoro', 'case_ospedale', 'case_credito', 'case_edtech', 'case_gpai'] },
  { id: 'social_scoring', relatedCases: ['case_scoring', 'case_credito'] },
  { id: 'biometrics', relatedCases: ['case_biometria'] },
  { id: 'emotion_recognition', relatedCases: ['case_scuola'] },
  { id: 'deepfake', relatedCases: ['case_media'] },
  { id: 'credit_welfare', relatedCases: ['case_credito'] },
  { id: 'gpai', relatedCases: ['case_gpai'] },
  // Advanced Case Pack (v0.6)
  { id: 'public_chatbot', relatedCases: ['case_chatbot'] },
  { id: 'human_escalation', relatedCases: ['case_chatbot'] },
  { id: 'procurement_ai', relatedCases: ['case_procurement'] },
  { id: 'technical_documentation', relatedCases: ['case_procurement', 'case_gpai'] },
  { id: 'lock_in', relatedCases: ['case_procurement'] },
  { id: 'adaptive_edtech', relatedCases: ['case_edtech'] },
  { id: 'generative_model', relatedCases: ['case_gpai'] },
  { id: 'data_governance', relatedCases: ['case_edtech', 'case_gpai'] }
];

export interface GlossaryEntryTexts {
  term: string;
  definition: string;
  whyItMatters: string;
  caution: string;
}

export interface GlossaryEntryView extends GlossaryEntryMeta, GlossaryEntryTexts {}

export function glossaryEntry(id: string): GlossaryEntryView {
  const meta = GLOSSARY.find((e) => e.id === id);
  if (!meta) throw new Error(`Voce di glossario sconosciuta: ${id}`);
  const texts = (L().glossary.entries as Record<string, GlossaryEntryTexts>)[id];
  if (!texts) throw new Error(`Testi mancanti per la voce di glossario: ${id}`);
  return { ...meta, ...texts };
}

export function glossaryViews(): GlossaryEntryView[] {
  return GLOSSARY.map((e) => glossaryEntry(e.id));
}

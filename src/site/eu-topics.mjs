// Scope of the first European-language publication; no empty counterpart routes.
export const TOPICS = [
  ['home', 'en', '', '', ''],
  ['how', 'en/how-it-works', 'so-funktioniert-es', 'como-funciona', 'como-funciona'],
  ['education', 'en/education', 'bildung', 'educacion', 'educacao'],
  ['teachers', 'en/ai-act-for-teachers', 'ki-verordnung-fuer-lehrkraefte', 'reglamento-ia-para-docentes', 'regulamento-ia-para-docentes'],
  ['guide', 'en/eu-ai-act-guide', 'ki-verordnung-leitfaden', 'guia-reglamento-ia', 'guia-regulamento-ia'],
  ['glossary', 'en/glossary', 'ki-verordnung-glossar', 'glosario-ia', 'glossario-ia'],
  ['privacy', 'en/privacy-by-design', 'datenschutz', 'privacidad', 'privacidade'],
  ['risk', 'en/ai-act-risk-categories', 'ki-risikokategorien', 'categorias-riesgo-ia', 'categorias-risco-ia'],
  ['prohibited', 'en/prohibited-ai-practices', 'verbotene-ki-praktiken', 'practicas-ia-prohibidas', 'praticas-ia-proibidas'],
  ['high', 'en/high-risk-ai-systems', 'hochrisiko-ki-systeme', 'sistemas-ia-alto-riesgo', 'sistemas-ia-risco-elevado'],
  ['transparency', 'en/transparency-obligations', 'ki-transparenzpflichten', 'obligaciones-transparencia-ia', 'obrigacoes-transparencia-ia'],
  ['gpai', 'en/general-purpose-ai', 'ki-modelle-allgemeiner-verwendungszweck', 'modelos-ia-uso-general', 'modelos-ia-finalidade-geral'],
  ['literacy', 'en/ai-literacy', 'ki-kompetenz', 'alfabetizacion-ia', 'literacia-ia']
];
export const topicDir = (topic, lang) => `${lang}${topic[{ de: 2, es: 3, pt: 4 }[lang]] ? `/${topic[{ de: 2, es: 3, pt: 4 }[lang]]}` : ''}`;

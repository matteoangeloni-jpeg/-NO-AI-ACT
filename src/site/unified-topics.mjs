// Full topic equivalents. Existing public slugs remain unchanged.
// English is the shared editorial reference for the new translations.
export const ADDITIONAL_EQUIVALENTS = [
 ['en/for-educators','fuer-lehrende','para-formadores','para-formadores'],
 ['en/ai-act-serious-game','serious-game-ki-verordnung','juego-serio-reglamento-ia','jogo-serio-regulamento-ia'],
 ['en/provider-deployer-ai-act','anbieter-betreiber-ki-verordnung','proveedor-responsable-despliegue-ia','prestador-responsavel-implantacao'],
 ['en/ai-act-public-administration','ki-oeffentliche-verwaltung','ia-administracion-publica','ia-administracao-publica'],
 ['en/ai-act-for-business','ki-verordnung-unternehmen','reglamento-ia-empresas','regulamento-ia-empresas'],
 ['en/ai-act-penalties','ki-verordnung-sanktionen','sanciones-reglamento-ia','sancoes-regulamento-ia'],
 ['en/ai-act-and-gdpr','ki-verordnung-dsgvo','reglamento-ia-rgpd','regulamento-ia-rgpd'],
 ['en/fria-ai-act-fundamental-rights-impact-assessment','grundrechte-folgenabschaetzung-ki','evaluacion-impacto-derechos-fundamentales-ia','avaliacao-impacto-direitos-fundamentais-ia'],
 ['en/privacy-conscious-learning','datenschutzbewusstes-lernen','aprendizaje-respetuoso-privacidad','aprendizagem-respeitadora-privacidade'],
 ['en/serious-games-for-ai-regulation','serious-games-ki-regulierung','juegos-serios-regulacion-ia','jogos-serios-regulacao-ia'],
 ['en/classroom-activities','unterrichtsaktivitaeten','actividades-didacticas','atividades-pedagogicas'],
 ['en/lesson-plan-introduction-to-the-ai-act','unterrichtsplan-ki-einstieg','plan-clase-introduccion-ia','plano-aula-introducao-ia'],
 ['en/how-to-cite','richtig-zitieren','como-citar','como-citar'],
 ['en/research-and-methodology','forschung-methodik','investigacion-metodologia','investigacao-metodologia'],
 ['en/matteo-angeloni','matteo-angeloni','matteo-angeloni','matteo-angeloni'],
 ['en/ai-act-application-timeline','ki-verordnung-zeitplan','calendario-reglamento-ia','calendario-regulamento-ia'],
 ['en/deepfakes-and-transparency','deepfakes-transparenz','deepfakes-transparencia','deepfakes-transparencia'],
 ['en/digital-citizenship-ai-regulation','digitale-buergerschaft-ki-regulierung','ciudadania-digital-regulacion-ia','cidadania-digital-regulacao-ia','cittadinanza-digitale-regolazione-ia'],
 ['en/lesson-plan-risk-based-approach','unterrichtsplan-risiko','plan-clase-riesgo','plano-aula-risco','lezione-approccio-rischio'],
 ['en/lesson-plan-transparency-and-users','unterrichtsplan-transparenz','plan-clase-transparencia','plano-aula-transparencia','lezione-trasparenza-utenti'],
 ['en/faq','faq','preguntas-frecuentes','perguntas-frequentes','faq']
];
export function completeTopicGroups(groups) {
 return groups.map(original=>{
  const group={...original},entry=ADDITIONAL_EQUIVALENTS.find(row=>row[0]===group.en);
  if(entry){for(const [index,lang] of [[1,'de'],[2,'es'],[3,'pt']])group[lang]??=`${lang}/${entry[index]}`;if(entry[4])group.it??=entry[4];}
  return Object.fromEntries(['it','en','fr','de','es','pt'].map(lang=>{if(typeof group[lang]!=='string')throw new Error(`Missing ${lang} equivalent: ${group.en}`);return[lang,group[lang]];}));
 });
}

export const SITE_LANGUAGES = ['it', 'en', 'fr', 'de', 'es', 'pt'];
export const languageCode = lang => lang === 'pt' ? 'pt-PT' : lang;
export function routeGroups(config) {
  return [...config.pairs, ...config.enOnly.map(en => ({ en, ...(config.frForEn?.[en] ? { fr: config.frForEn[en] } : {}) }))];
}
export function publicRoutes(config) {
  return routeGroups(config).flatMap(group => SITE_LANGUAGES.filter(lang => typeof group[lang] === 'string').map(lang => ({
    dir: group[lang], lang, group, it: group.it, en: group.en, fr: group.fr,
    alt: lang === 'it' ? group.en : (group.it ?? group.en), xDefault: group.it ?? group.en
  })));
}
export function publishedLanguages(config) {
  return SITE_LANGUAGES.filter(lang => publicRoutes(config).some(route => route.lang === lang));
}

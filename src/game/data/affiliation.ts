/**
 * Affiliazione accademica dell'autore, con i link istituzionali.
 *
 * Sono gli UNICI indirizzi esterni che il gioco può aprire. Ogni altro link
 * del gioco è un percorso relativo al sito del progetto: quella scelta resta,
 * e questa è un'eccezione dichiarata, non un allentamento.
 *
 * Le destinazioni sono elencate anche in release.config.json sotto
 * `externalLinkAllowlist`, e un test verifica che le due liste coincidano:
 * un indirizzo esterno aggiunto qui e non lì fa fallire la build.
 *
 * I link si aprono con noopener,noreferrer: nessun referrer lascia il gioco.
 */
export const AFFILIATION_LINKS = {
  phd: {
    it: 'https://www.unitus.it/post-laurea/dottorati-di-ricerca/corsi-di-dottorato-attivi/societa-in-mutamento-politiche-diritti-e-sicurezza/',
    en: 'https://www.unitus.it/en/post-graduation/phd-opportunities/ongoing-phd-programs/society-in-change-policies-rights-and-security/'
  },
  university: 'https://www.unitus.it/'
} as const;

/** Tutti gli indirizzi esterni raggiungibili dal gioco, in forma piatta. */
export const EXTERNAL_LINKS: readonly string[] = [
  AFFILIATION_LINKS.phd.it,
  AFFILIATION_LINKS.phd.en,
  AFFILIATION_LINKS.university
];

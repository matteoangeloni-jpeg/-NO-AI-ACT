import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * L'INVENTARIO DELLE PAGINE SI LEGGE, NON SI RICOPIA.
 *
 * Otto file lo tenevano scritto a mano: due con l'elenco completo delle
 * cartelle, sei con il solo totale («62»). Aggiungere una pagina li
 * mandava rossi tutti insieme, e nessuno di quei rossi diceva qualcosa di
 * vero sul sito: dicevano soltanto che un numero era stato ricopiato.
 *
 * La sorgente unica è già dichiarata: scripts/seo/routes.config.json, che
 * l'audit usa per decidere quali rotte devono esistere, essere
 * indicizzabili e stare in una sola sitemap. Da lì si ricava tutto il
 * resto.
 *
 * /play/ non c'è di proposito: è noindex e fuori dalle sitemap.
 */
interface RoutesConfig {
  site: string;
  pairs: { it: string; en: string }[];
  enOnly: string[];
}

const root = resolve(__dirname, '../..');
const config: RoutesConfig = JSON.parse(
  readFileSync(resolve(root, 'scripts/seo/routes.config.json'), 'utf8')
) as RoutesConfig;

/** Cartelle italiane, relative alla radice; '' è la pagina d'ingresso. */
export const IT: string[] = config.pairs.map((p) => p.it);

/** Cartelle inglesi; 'en' è la pagina d'ingresso inglese. */
export const EN: string[] = [...config.pairs.map((p) => p.en), ...config.enOnly];

/** Tutte le pagine pubbliche indicizzabili. */
export const ALL_PUBLIC: string[] = [...IT, ...EN];

/** Quante sono: il numero da usare al posto di una costante ricopiata. */
export const PUBLIC_COUNT = ALL_PUBLIC.length;

/** L'indirizzo pubblico di una cartella, come compare in canonical e sitemap. */
export const publicUrl = (dir: string): string =>
  dir === '' ? config.site : `${config.site}${dir}/`;

/** Il file su disco che serve quella cartella. */
export const pageFile = (dir: string): string => (dir === '' ? 'index.html' : `${dir}/index.html`);

export const isEnDir = (dir: string): boolean => dir === 'en' || dir.startsWith('en/');

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// @ts-expect-error Shared ESM inventory.
import { publicRoutes, publishedLanguages } from '../src/site/route-inventory.mjs';

/**
 * L'INVENTARIO PUBBLICO, LETTO DALLA SUA UNICA FONTE.
 *
 * PERCHÉ QUESTO FILE ESISTE. Cinque test verificavano «questa pagina è un
 * input di build» leggendo `vite.config.ts` COME TESTO e cercandovi il
 * percorso letterale. Funzionava finché quel file conteneva 71 voci scritte a
 * mano — ed era proprio quell'elenco il difetto: il 13 ottobre 2026 tredici
 * pagine francesi sono state generate, i test sono passati, `verify:dist` ha
 * dato PASS, e le pagine NON ERANO NEL DIST, perché nessuno aveva aggiornato
 * quella lista.
 *
 * Ora `vite.config.ts` DERIVA i suoi input da `routes.config.json`. La
 * proprietà che quei test difendono resta valida e si verifica alla fonte:
 * una pagina è costruita se e solo se è nell'inventario.
 */
const root = resolve(__dirname, '..');

type Config = {
  pairs: { it: string; en: string; fr?: string }[];
  enOnly: string[];
  frForEn?: Record<string, string>;
};

const cfg: Config = JSON.parse(
  readFileSync(resolve(root, 'scripts/seo/routes.config.json'), 'utf8')
);

/** Le cartelle di ogni rotta pubblicata, in tutte le lingue. */
export const INVENTORY_DIRS: string[] = publicRoutes(cfg).map((r: { dir: string }) => r.dir);
export const SITE_LANGUAGE_CODES: string[] = publishedLanguages(cfg);

/** I file `index.html` corrispondenti, nella forma usata dai test. */
export const INVENTORY_FILES: string[] = INVENTORY_DIRS.map((d) =>
  d === '' ? 'index.html' : `${d}/index.html`
);

/**
 * Vero se la pagina entra nella build. Accetta sia `dir` sia
 * `dir/index.html`, perché i test esistenti usano entrambe le forme.
 */
export function isBuildInput(pageOrDir: string): boolean {
  const dir = pageOrDir.replace(/\/?index\.html$/, '');
  // la coque /play/ non è una rotta pubblica: ha noindex e sta fuori dai
  // sitemap, quindi vive come input aggiuntivo in vite.config.ts.
  if (dir === 'play') return true;
  return INVENTORY_DIRS.includes(dir);
}

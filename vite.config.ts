import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

/** L'inventario pubblico, letto dalla sua unica fonte di verità. */
const rotte = JSON.parse(
  readFileSync(resolve(import.meta.dirname, 'scripts/seo/routes.config.json'), 'utf8')
) as { pairs: { it: string; en: string; fr?: string }[]; enOnly: string[] };
const ROTTE: string[] = [
  ...rotte.pairs.flatMap((p) => [p.it, p.en, ...(p.fr ? [p.fr] : [])]),
  ...rotte.enOnly
];

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      /**
       * LE PAGINE DELLA BUILD SI DERIVANO DALL'INVENTARIO, non si elencano.
       *
       * Qui c'erano 71 voci scritte a mano. Il 13 ottobre 2026 sono state
       * generate tredici pagine francesi, i test sono passati, `verify:dist`
       * ha dato PASS — e le pagine francesi NON ERANO NEL DIST. Esistevano nel
       * repository e non sarebbero mai state pubblicate: un difetto che non
       * rompe niente, e quindi quello che arriva in produzione.
       *
       * Era il quarto elenco della stessa cosa (sitemap, routes.config.json,
       * meta.config.json, questo). Ora la fonte è una: routes.config.json,
       * che è anche ciò su cui gira `audit:seo`. Una pagina nuova entra nella
       * build il giorno che entra nell'inventario.
       */
      input: Object.fromEntries([
        ...ROTTE.map((dir) => [
          dir === '' ? 'main' : dir.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
          resolve(import.meta.dirname, dir === '' ? 'index.html' : `${dir}/index.html`)
        ]),
        // La coque du jeu n'est pas une route publique de l'inventaire : elle
        // porte un noindex et vit hors des sitemaps, donc elle s'ajoute ici.
        ['play', resolve(import.meta.dirname, 'play/index.html')]
      ])
    }
  },
  server: {
    port: 5173,
    host: true
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});

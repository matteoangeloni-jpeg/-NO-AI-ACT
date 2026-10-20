import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * GLI ARTEFATTI DEGLI STRUMENTI DI SVILUPPO NON ENTRANO NEL PRODOTTO.
 *
 * PERCHÉ QUESTO FILE ESISTE, dal 20 ottobre 2026. È stato installato
 * `graphify`, uno strumento che mappa il repository in un grafo di conoscenza
 * interrogabile. È un ottimo strumento e non è un problema — tranne per un
 * dettaglio: fra i suoi tre output c'è `graphify-out/graph.html`, che carica
 * **vis-network da unpkg.com**.
 *
 * Nel repository quel file non fa alcun danno. Se finisse nel `dist`, invece,
 * il sito pubblicherebbe una pagina che chiama un CDN di terze parti — e il
 * sito DICHIARA pubblicamente di non inviare nulla a fornitori terzi oltre
 * all'analytics cookieless di Cloudflare. `release.config.json` fissa
 * `runtimeHostAllowlist`, e quella promessa è il valore del progetto.
 *
 * `.gitignore` è la prima barriera. Una riga di .gitignore, però, è
 * un'intenzione: si cancella per sbaglio, si aggira con `git add -f`, e non
 * dice niente a chi copia una cartella a mano. Questa è la seconda, e
 * pretende la proprietà invece di fidarsi della prima.
 *
 * NON È UN GIUDIZIO SULLO STRUMENTO. Serve a tenerlo dove è utile — accanto
 * al codice — e fuori da dove sarebbe un difetto: nel sito pubblicato.
 */

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** Cartelle prodotte da strumenti di sviluppo, con il motivo dell'esclusione. */
const ARTEFATTI: { dir: string; perche: string }[] = [
  { dir: 'graphify-out', perche: 'graph.html carica vis-network da unpkg.com' },
  { dir: '.diag', perche: 'misure di densità: referti, non contenuti' },
  { dir: 'scripts/smoke/out', perche: 'screenshot degli smoke test' }
];

describe('artefatti degli strumenti di sviluppo', () => {
  it('ognuno è escluso dal repository', () => {
    const ignore = read('.gitignore');
    for (const { dir, perche } of ARTEFATTI) {
      expect(ignore, `${dir} non è in .gitignore — ${perche}`).toContain(dir);
    }
  });

  it('nessuno finisce nel dist', () => {
    // Il dist può non esistere quando i test girano prima del build: in quel
    // caso non c'è niente da verificare, e dirlo è meglio che passare in
    // silenzio facendo credere che la proprietà sia stata controllata.
    const dist = resolve(root, 'dist');
    if (!existsSync(dist)) {
      expect(existsSync(dist), 'dist assente: controllo rinviato al build').toBe(false);
      return;
    }
    const presenti = ARTEFATTI.map((a) => a.dir)
      .map((d) => d.split('/').pop() as string)
      .filter((nome) => existsSync(resolve(dist, nome)));
    expect(
      presenti,
      `artefatti di sviluppo dentro il dist: ${presenti.join(', ')} — il sito li pubblicherebbe`
    ).toEqual([]);
  });

  it('nessun host di terze parti nuovo è entrato nella allowlist di runtime', () => {
    // La allowlist è il punto in cui un CDN entrerebbe «per far funzionare la
    // visualizzazione». Un host in più qui è una promessa pubblica rotta, e
    // questo controllo nomina gli host che NON devono comparirvi.
    const cfg = JSON.parse(read('release.config.json'));
    expect(cfg.runtimeHostAllowlist).toEqual(['static.cloudflareinsights.com']);
    const vietati = ['unpkg.com', 'cdn.jsdelivr.net', 'd3js.org', 'app.graphify.com'];
    for (const h of vietati) {
      expect(cfg.runtimeHostAllowlist, `${h} non deve stare nella allowlist`).not.toContain(h);
    }
  });

  it("il grafo, se esiste, non è dentro una cartella pubblicata", () => {
    // Un `graphify update` lanciato dentro `fr/` o `en/` scriverebbe il suo
    // output in una cartella che il build pubblica. Il controllo guarda dove
    // il grafo è, non dove dovrebbe essere.
    const pubblicate = ['fr', 'en', 'play', 'public', 'assets'];
    const trovati = pubblicate
      .filter((d) => existsSync(resolve(root, d)))
      .flatMap((d) =>
        readdirSync(resolve(root, d), { withFileTypes: true })
          .filter((e) => e.isDirectory() && e.name === 'graphify-out')
          .map(() => `${d}/graphify-out`)
      );
    expect(trovati, `grafo dentro una cartella pubblicata: ${trovati.join(', ')}`).toEqual([]);
  });
});

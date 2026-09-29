/**
 * Porta il numero di versione da quello corrente a quello nuovo, ovunque.
 *
 * PERCHÉ UNO SCRIPT E NON UN sed. La versione compare in una settantina di
 * file — le pagine pubbliche, le citazioni accademiche, il press kit,
 * release.config.json, CITATION.cff — e due posti la contengono per ragioni
 * che NON c'entrano col prodotto:
 *
 *   package-lock.json   la dipendenza `why-is-node-running` sta a 2.3.0,
 *                       cioè esattamente la versione da cui partiamo. Una
 *                       sostituzione globale l'avrebbe alzata a 3.0.0 e il
 *                       lockfile avrebbe smesso di risolvere.
 *   release.config.json `"version": 2` è la versione dello SCHEMA del file,
 *                       non del gioco.
 *
 * Il primo è escluso e affidato a `npm version`, che sa aggiornare i campi
 * giusti del lockfile e nient'altro. Il secondo non viene toccato perché la
 * sostituzione cerca la stringa completa `2.3.0`, non il numero `2`.
 *
 * LA FONTE DELLA VERITÀ È package.json. Lo script non accetta la versione
 * vecchia come parametro: la legge, così non si può sbagliare a dichiararla e
 * finire per sostituire una stringa che non c'era.
 *
 * NON TAGGA E NON PUBBLICA. Il tag lo mette il proprietario: le credenziali
 * di una sessione di sviluppo sono limitate al branch, e un push di tag
 * restituisce 403. Questo script prepara l'albero, nient'altro.
 *
 * Uso:
 *   node scripts/release/bump-version.mjs 3.0.0
 *   node scripts/release/bump-version.mjs 3.0.0 --prova   (non scrive niente)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const nuova = process.argv[2];
const prova = process.argv.includes('--prova');

if (!nuova || !/^\d+\.\d+\.\d+$/.test(nuova)) {
  console.error('uso: node scripts/release/bump-version.mjs <maggiore.minore.patch> [--prova]');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const vecchia = pkg.version;
if (vecchia === nuova) {
  console.error(`la versione è già ${nuova}: niente da fare.`);
  process.exit(1);
}

/** Cartelle che non si toccano mai: generate, scaricate, o non nostre. */
const ESCLUSE = new Set(['node_modules', 'dist', '.git', '.diag', '.press-capture-tmp', 'scripts/smoke/out']);
/** Estensioni in cui la versione compare come testo. */
const ESTENSIONI = /\.(html|md|cff|json|txt|xml)$/;
/**
 * Il lockfile NON si tocca a mano: contiene versioni di dipendenze che
 * possono coincidere con la nostra. Ci pensa `npm version`.
 */
const MAI = new Set(['package-lock.json']);
/**
 * I documenti STORICI parlano di una versione passata, e quel numero è il loro
 * oggetto: `docs/RELEASE_NOTES_v2.3.0.md` racconta la 2.3.0, e riscriverlo a
 * 3.0.0 falsificherebbe la storia delle release invece di aggiornarla. La
 * prova a vuoto ha trovato questo caso prima che lo script scrivesse, ed è il
 * motivo per cui la prova esiste.
 *
 * E IL FILTRO SUL NOME NON BASTA — VA DETTO, PERCHÉ È IL LIMITE DI QUESTO
 * STRUMENTO. Uno script non distingue «la versione che questo file DICHIARA»
 * da «la versione di cui questo file PARLA». Al primo giro ha riscritto, in
 * docs/SPRINT_REPORT_2026-09.md, la frase «versione corrente 2.3.0»: vera
 * quando fu scritta, falsa un istante dopo la sostituzione. Il nome del file
 * non lo lasciava prevedere.
 *
 * Quindi: l'elenco che `--prova` stampa va LETTO, non scorso. Ogni `.md` in
 * quell'elenco è un candidato a contenere prosa sul passato, e nessun filtro
 * automatico può deciderlo al posto di chi rilegge.
 */
const STORICI = /^(RELEASE_NOTES|GITHUB_RELEASE_BODY)_v\d+\.\d+\.\d+\.md$/;

function* file(dir) {
  for (const voce of readdirSync(dir)) {
    const p = join(dir, voce);
    const rel = relative(root, p);
    if (ESCLUSE.has(voce) || ESCLUSE.has(rel)) continue;
    if (statSync(p).isDirectory()) yield* file(p);
    else if (ESTENSIONI.test(voce) && !MAI.has(voce) && !STORICI.test(voce)) yield p;
  }
}

const toccati = [];
for (const p of file(root)) {
  const testo = readFileSync(p, 'utf8');
  if (!testo.includes(vecchia)) continue;
  const quante = testo.split(vecchia).length - 1;
  toccati.push({ file: relative(root, p), quante });
  if (!prova) writeFileSync(p, testo.split(vecchia).join(nuova));
}

console.log(`${vecchia} → ${nuova}${prova ? '  (prova: nessuna scrittura)' : ''}\n`);
for (const t of toccati.sort((a, b) => b.quante - a.quante)) {
  console.log(`  ${String(t.quante).padStart(3)}×  ${t.file}`);
}
console.log(`\n${toccati.length} file, ${toccati.reduce((n, t) => n + t.quante, 0)} occorrenze.`);

if (!prova) {
  // package.json e package-lock.json insieme, dai comandi di npm: il lockfile
  // ha una struttura sua e riscriverlo a mano è il modo di romperlo.
  execFileSync('npm', ['version', nuova, '--no-git-tag-version', '--allow-same-version'], {
    cwd: root, stdio: 'inherit'
  });
  console.log(`\npackage.json e package-lock.json portati a ${nuova} da npm.`);
  console.log('\nRestano da fare a mano, perché sono decisioni e non sostituzioni:');
  console.log('  · le note di rilascio in docs/');
  console.log('  · il tag, che mette il proprietario (qui le credenziali sono limitate al branch)');
}

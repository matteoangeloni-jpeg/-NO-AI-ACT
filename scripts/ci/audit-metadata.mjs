/**
 * METADATI PUBBLICI vs VERITÀ DEL REPOSITORY (ticket Q14 dell'audit).
 *
 * La suite release-integrity impedisce che un numero sbagliato di casi
 * ricompaia in una pagina, in un README o nel bundle. Non poteva però
 * vedere l'unico posto in cui quel numero è sopravvissuto per mesi: la
 * DESCRIZIONE del repository su GitHub, che non è un file e che nessun
 * test del progetto può leggere.
 *
 * Questo script chiude quel buco, e resta FUORI dal gate di build: fa una
 * chiamata di rete e legge impostazioni che la build non deve dipendere da.
 * Va eseguito quando si pubblica una release, o quando cambia un numero
 * dichiarato in release.config.json.
 *
 *   GITHUB_TOKEN=... npm run audit:metadata
 *
 * Esce con 1 se i metadati pubblici contraddicono il repository.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cfg = JSON.parse(readFileSync(resolve(root, 'release.config.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const REPO = 'matteoangeloni-jpeg/-NO-AI-ACT';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const fail = [];
/** Cose da sapere che NON sono difetti: non fanno fallire l'audit. */
const note = [];

if (!token) {
  console.log('audit:metadata — SALTATO (nessun GITHUB_TOKEN nell\'ambiente)');
  process.exit(0);
}

/**
 * La lettura passa da curl e non da fetch(): in questo ambiente l'uscita
 * verso internet attraversa un proxy che fetch() di Node non onora, e la
 * stessa chiamata tornava 401 mentre da curl funziona. curl è presente sia
 * qui sia sui runner di GitHub, e non aggiunge dipendenze al progetto.
 */
let meta;
try {
  const raw = execFileSync(
    'curl',
    ['-sS', '--max-time', '20', '-H', `Authorization: Bearer ${token}`,
     '-H', 'Accept: application/vnd.github+json', `https://api.github.com/repos/${REPO}`],
    { encoding: 'utf8' }
  );
  meta = JSON.parse(raw);
} catch (e) {
  console.error(`audit:metadata — impossibile leggere i metadati: ${e.message}`);
  process.exit(1);
}
if (!meta || typeof meta.full_name !== 'string') {
  console.error(`audit:metadata — risposta inattesa: ${JSON.stringify(meta?.message ?? meta).slice(0, 120)}`);
  process.exit(1);
}
const description = meta.description ?? '';

console.log('--- metadati pubblici del repository ---');
console.log(`  descrizione: ${description}`);
console.log(`  homepage   : ${meta.homepage ?? '(nessuna)'}`);
console.log(`  topics     : ${(meta.topics ?? []).join(', ') || '(nessuno)'}`);

// 1. nessun conteggio di casi diverso da quello dichiarato
{
  const expected = cfg.playableCases;
  const counts = [...description.matchAll(/\b(\d+)\s+(?:casi|cases)\b/gi)].map((m) => Number(m[1]));
  for (const n of counts) {
    if (n !== expected) fail.push(`la descrizione dice ${n} casi, release.config.json ne dichiara ${expected}`);
  }
  if (counts.length === 0) {
    console.log(`  (la descrizione non nomina un conteggio di casi: nulla da confrontare)`);
  }
}

// 2. la homepage dichiarata è quella del progetto
{
  const site = cfg.siteOrigin ?? 'https://www.no-ai-act.eu';
  if (meta.homepage && !meta.homepage.startsWith(site)) {
    fail.push(`la homepage dichiarata è ${meta.homepage}, attesa sotto ${site}`);
  }
}

// 3. i topic non contengono refusi
//
// Non si vieta un topic nuovo: sarebbe un elenco da tenere aggiornato a
// mano, e il primo topic legittimo aggiunto farebbe fallire il controllo.
// Si segnala solo ciò che ASSOMIGLIA a una parola nota senza esserlo —
// cioè un refuso, come "gamifiaction" per "gamification".
{
  const known = ['ai', 'ai-act', 'aiact', 'game', 'gamification', 'serious-game', 'serious-games',
    'education', 'privacy', 'phaser', 'typescript', 'eu', 'europe', 'edtech', 'open-source',
    'accessibility', 'civic-tech', 'regulation'];
  const distance = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  };
  for (const t of meta.topics ?? []) {
    if (known.includes(t)) continue;
    const near = known.find((k) => distance(t, k) > 0 && distance(t, k) <= 2);
    if (near) fail.push(`topic "${t}" sembra un refuso di "${near}"`);
  }
}

// 4. la licenza pubblica corrisponde a quella dichiarata nel package
//
// Con una licenza sola, NOASSERTION è un difetto: vuol dire che GitHub non
// ha riconosciuto il file e chi arriva non sa a che condizioni può usare il
// progetto. Con PIÙ licenze è il contrario — qui il codice è
// GPL-3.0-or-later e i contenuti CC BY-SA 4.0, e un badge unico ne
// dichiarerebbe una falsa sull'altra metà. GitHub non ha modo di mostrarne
// due, quindi NOASSERTION è la risposta onesta e il controllo la accetta.
//
// Restano segnalati i casi che contano davvero: una licenza riconosciuta ma
// DIVERSA da quella dichiarata (qualcuno ha cambiato il file), e l'assenza
// di dichiarazione quando la licenza è una sola.
{
  const declared = cfg.licenses?.code ?? pkg.license;
  const spdx = meta.license?.spdx_id;
  const multiLicenza = Boolean(cfg.licenses?.code && cfg.licenses?.content
    && cfg.licenses.code !== cfg.licenses.content);
  const nonRiconosciuta = !spdx || spdx === 'NOASSERTION';

  if (nonRiconosciuta && !multiLicenza) {
    fail.push(`GitHub non riconosce nessuna licenza, il progetto dichiara ${declared}`);
  } else if (!nonRiconosciuta && declared && spdx !== declared && !declared.startsWith(spdx)) {
    fail.push(`GitHub riconosce la licenza come ${spdx}, il progetto dichiara ${declared}`);
  } else if (nonRiconosciuta && multiLicenza) {
    note.push(`licenza non riconosciuta da GitHub (NOASSERTION): atteso, il progetto ne dichiara due — codice ${cfg.licenses.code}, contenuti ${cfg.licenses.content}`);
  }
}

for (const n of note) console.log(`  · ${n}`);

if (fail.length) {
  console.error('\naudit:metadata — FAIL');
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error('\nQuesti campi NON sono file: vanno corretti nelle impostazioni del');
  console.error('repository su GitHub, o via API con un token che abbia i permessi di');
  console.error('scrittura sulle impostazioni (il proxy di questo ambiente li nega).');
  process.exit(1);
}
console.log('\naudit:metadata — PASS: i metadati pubblici non contraddicono il repository.');

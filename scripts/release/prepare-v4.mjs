import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { sourceMain, sourceHash, blocks } from '../site/translation-blocks.mjs';

const replacements = new Map([
  ['No. There is no registration, no account, no backend. The game runs entirely in the browser and progress is stored only locally.', 'No registration or account is required. Progress stays local. Automatic aggregate usage counters can be disabled in the game bar; answers and outcomes are not sent.'],
  ['<strong>Nessuna telemetria di gioco</strong>: le tue decisioni, i punteggi, i rapporti ispettivi e i percorsi non vengono inviati ad alcun server.', '<strong>Statistiche aggregate di utilizzo</strong>: avvii, completamenti e schermate sono contati automaticamente, con disattivazione nella barra del gioco. Decisioni, punteggi e rapporti restano locali.'],
  ['<strong>Nessun backend</strong>: il gioco è un sito statico; non esiste un database di giocatori.', '<strong>Nessun database di giocatori</strong>: il backend conserva solo contatori aggregati, senza account o identificatori del giocatore.'],
  ['Decisioni, classificazioni, punteggi, rapporti ispettivi, casi giocati, tempo di gioco, esiti: niente di tutto questo lascia il tuo browser. Non esistono account, cookie di gioco, pixel o telemetria.', 'Decisioni, classificazioni, punteggi, rapporti ed esiti restano locali. Il gioco invia automaticamente solo contatori aggregati di utilizzo, senza cookie statistici o identificatori del giocatore. La barra permette di disattivarli; DNT e GPC sono rispettati.'],
  ['<strong>No gameplay telemetry</strong>: your decisions, scores, inspection reports and case paths are never sent to any server.', '<strong>Aggregate usage statistics</strong>: starts, completions and screens are counted automatically, with a disable control in the game bar. Decisions, scores and reports stay local.'],
  ['<strong>No backend</strong>: the game is a static site; there is no player database.', '<strong>No player database</strong>: the backend stores marginal counters only, without player accounts or identifiers.'],
  ['Decisions, classifications, scores, inspection reports, cases played, play time, outcomes: none of it leaves your browser. There are no accounts, no game cookies, no pixels, no telemetry.', 'Decisions, classifications, scores, reports and outcomes stay local. The game automatically sends aggregate usage counters only, without analytics cookies or player identifiers. Disable them in the game bar; DNT and GPC are respected.'],
  ['including the rules that keep in-game analytics off by default and the automated tests that lock these behaviours in. You can also open your browser\'s developer tools and observe the absence of network calls during play.', 'including the minimal aggregate collector, opt-out controls and automated tests. Browser developer tools can be used to inspect the bounded counter batches; answers and outcomes are excluded.'],
  ['nessuna telemetria di gioco, salvataggi solo locali', 'statistiche aggregate disattivabili, salvataggi locali'],
  ['no gameplay telemetry, local-only saves', 'aggregate statistics with opt-out, local-only saves'],
  ['il gioco non invia nulla a fornitori terzi.', 'le risposte non sono inviate a fornitori terzi; Cloudflare ospita i contatori aggregati di utilizzo.'],
  ['no account, no backend, no gameplay telemetry', 'no account or player identifier; automatic aggregate usage counters with opt-out'],
  ['nessun account, nessun backend, nessuna telemetria di gioco', 'nessun account o identificativo del giocatore; contatori aggregati automatici disattivabili'],
  ['no network calls during gameplay', 'only aggregate usage counter calls during gameplay'],
  ['nessuna chiamata di rete durante il gameplay', 'sole chiamate per contatori aggregati durante il gameplay'],
  ['Measured (public pages only)', 'Measured (aggregate usage only)'],
  ['Everything you do in the game', 'Answers, scores and reports'],
  ['Misurato (solo pagine pubbliche)', 'Misurato (solo contatori aggregati)'],
  ['Tutto ciò che fai nel gioco', 'Risposte, punteggi e rapporti'],
  ['Nessun account, nessun dato personale, nessun backend', 'Nessun account; risposte locali; contatori aggregati disattivabili'],
  ['No backend · No accounts', 'Aggregate usage counters only · No accounts'],
  ['No account, no backend, no personal-data collection, no network calls during', 'No account or player identifiers; only aggregate usage calls during'],
  ['- No backend, no account, no registration, no personal data collection in the game.', '- No account, registration or player identifiers. A first-party backend stores aggregate usage counters only.'],
  ['- No gameplay telemetry: decisions, scores and reports never leave the player\'s browser (localStorage only). Public pages use aggregate, cookie-free Cloudflare Web Analytics; the game itself sends nothing.', '- Automatic first-party usage counters (starts, completions and phases), without answers, outcomes, player IDs or analytics cookies. Disable in the game bar; DNT/GPC respected. Saves, decisions and reports stay local. See /game-statistics.html.'],
  ['sans compte, serveur applicatif ni télémétrie du jeu', 'sans compte ni identifiant de joueur ; compteurs agreges automatiques desactivables dans la barre du jeu'],
  ['aucun compte, aucun traceur, aucune requête pendant la partie', 'aucun compte ni identifiant du joueur ; statistiques agregees automatiques desactivables'],
  ['<strong>Aucune requête réseau pendant la partie.</strong> Réponses, rapports et progression ne quittent jamais l\'appareil ; la sauvegarde vit dans le stockage local du navigateur.', '<strong>Statistiques agregees de fonctionnement.</strong> Des compteurs sont envoyes automatiquement, sans reponses, resultats ou identifiants du joueur. Desactivation dans la barre du jeu ; DNT/GPC respectes. Sauvegardes locales.']
]);
const excluded = new Set(['node_modules', 'dist', 'dist-beta', '.git', '.infrastructure', '.wrangler', 'docs', 'artifacts', 'scripts', 'tests']);
function visit(dir = '.') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const file = join(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (/\.html$/.test(file) || ['README.md', 'public/llms.txt', 'src/site/fr-content.mjs'].includes(file.replaceAll('\\', '/'))) {
      const old = readFileSync(file, 'utf8'); let text = old;
      for (const [a, b] of replacements) text = text.split(a).join(b);
      if (text !== old) writeFileSync(file, text);
    }
  }
}
visit();
// Only refresh translation hashes after the source and corresponding translated
// version strings have been mechanically updated; block counts must still agree.
for (const name of readdirSync('src/site/fr').filter(name => name.endsWith('.json'))) {
  const file = `src/site/fr/${name}`; const item = JSON.parse(readFileSync(file, 'utf8'));
  const source = sourceMain(readFileSync(`${item.en}/index.html`, 'utf8'));
  if (blocks(source).length !== item.blocks.length) throw Error(`Translation requires review: ${name}`);
  item.blocks = item.blocks.map(text => {
    for (const [a, b] of replacements) text = text.split(a).join(b);
    return text;
  });
  item.sourceHash = sourceHash(source); writeFileSync(file, JSON.stringify(item, null, 2) + '\n');
}
const release = JSON.parse(readFileSync('release.config.json', 'utf8'));
release.privacy.backend = 'aggregate usage counters only';
release.privacy.gameplayNetworkCalls = 'first-party aggregate usage only, no answers or player identifiers';
release.privacy.analytics = 'Automatic first-party aggregate usage, visible notice and per-page opt-out; DNT/GPC respected. Public pages also use cookie-free Cloudflare Web Analytics.';
release.optionalAnalyticsEndpoints.publicUsage = 'https://beta.no-ai-act.eu/collect';
release.optionalAnalyticsEndpoints.note = 'First-party aggregate collection authorized for beta and production only. Preview and unspecified providers stay off. See game-statistics.html.';
writeFileSync('release.config.json', JSON.stringify(release, null, 2) + '\n');

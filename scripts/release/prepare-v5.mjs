import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { sourceMain, sourceHash, blocks } from '../site/translation-blocks.mjs';

const VERSION = JSON.parse(readFileSync('package.json', 'utf8')).version;
const TAG = `v${VERSION}`;
const DATE = JSON.parse(readFileSync('release.config.json', 'utf8')).releaseDate;
const read = file => readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const write = (file, text) => { if (read(file) !== text) writeFileSync(file, text); };
const cfg = JSON.parse(read('release.config.json'));
// Stage final metadata locally, then publish branch + new tag in one atomic push.
// This flag does not itself publish anything; --tag-published verifies the remote.
const stageTag = process.argv.includes('--stage-tag');
if (stageTag && execFileSync('git', ['ls-remote', 'upstream', `refs/tags/${TAG}`], { encoding: 'utf8' }).trim()) {
  throw new Error(`${TAG} already exists; verify it with --tag-published instead`);
}
const tagged = stageTag || process.argv.includes('--tag-published') || cfg.lastTaggedRelease === TAG;
if (process.argv.includes('--tag-published')) {
  const refs = execFileSync('git', ['ls-remote', 'upstream', `refs/tags/${TAG}`, `refs/tags/${TAG}^{}`], { encoding: 'utf8' }).trim().split('\n');
  const remote = refs.find(line => line.endsWith('^{}')) ?? refs.find(line => line.endsWith(`refs/tags/${TAG}`));
  if (!remote) throw new Error(`${TAG} does not exist remotely`);
  const sha = remote.split(/\s+/)[0];
  execFileSync('git', ['merge-base', '--is-ancestor', sha, 'HEAD']);
  if (JSON.parse(execFileSync('git', ['show', `${sha}:package.json`], { encoding: 'utf8' })).version !== VERSION) throw new Error('Tag version mismatch');
}

// Check existing bilingual alignment BEFORE changing English source blocks.
const translations = readdirSync('src/site/fr').filter(name => name.endsWith('.json')).map(name => {
  const path = `src/site/fr/${name}`; const data = JSON.parse(read(path));
  const source = sourceMain(read(`${data.en}/index.html`));
  if (data.sourceHash !== sourceHash(source) || data.blocks.length !== blocks(source).length) throw new Error(`Unreviewed translation drift: ${path}`);
  return { path, data };
});
const pkg = JSON.parse(read('package.json')); pkg.version = VERSION;
write('package.json', JSON.stringify(pkg, null, 2) + '\n');
const lock = JSON.parse(read('package-lock.json')); lock.version = VERSION; lock.packages[''].version = VERSION;
write('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
cfg.versionTag = TAG; cfg.releaseDate = DATE;
if (tagged) cfg.lastTaggedRelease = TAG;
write('release.config.json', JSON.stringify(cfg, null, 2) + '\n');

// Mechanical current-version update. Historical assets and old release notes stay.
const htmlFiles = execFileSync('git', ['ls-files', '-z', '*.html'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of htmlFiles) {
  let text = read(file).replaceAll('4.0.0', VERSION);
  if (['press-kit/index.html', 'en/press-kit/index.html'].includes(file)) {
    text = text.replaceAll('screenshots-v4/', 'screenshots-v5/').replaceAll('screenshots show version 4.0', 'screenshots show version 5.0')
      .replaceAll('Version 4.0 and teaching resources', 'Version 5.0 and teaching resources').replaceAll('Versione 4.0', 'Versione 5.0')
      .replaceAll('schermate mostrano la versione 4.0', 'schermate mostrano la versione 5.0').replaceAll('2026-10-22', DATE)
      .replaceAll('22 October 2026', '21 November 2026').replaceAll('22 ottobre 2026', '21 novembre 2026');
  }
  write(file, text);
}
const inventory = JSON.parse(read('scripts/seo/routes.config.json'));
const italianMethod = inventory.pairs.find(pair => pair.en === 'en/research-and-methodology')?.it;
if (!italianMethod) throw new Error('Missing Italian methodology owner');
const mechanics = [
  ['en/research-and-methodology/index.html', /<li><strong>Decision cycle<\/strong>[\s\S]*?<\/li>/,
    '<li><strong>Guided inquiry in V5</strong>: understanding → hypothesis → investigation → argument → feedback → transfer. All 14 cases offer contextual support, source assessment and explained hypothesis revisions. A free argument is fixed before feedback; later reflection and a final debrief remain distinct. These writing aids do not automatically assess critical thinking. Notes stay temporarily in the tab; independent transfer is specified in a separate research protocol.</li>'],
  [`${italianMethod}/index.html`, /<li><strong>Ciclo (?:di decisione|decisionale)<\/strong>[\s\S]*?<\/li>/,
    '<li><strong>Percorso guidato V5</strong>: comprensione → ipotesi → investigazione → argomentazione → feedback → trasferimento. Tutti i 14 casi offrono mediazioni contestuali, valutazione delle fonti e revisioni motivate. La nota autonoma è fissata prima del feedback; riflessione successiva e debrief finale restano distinti. Gli appunti sono temporanei nella scheda e non valutano automaticamente il pensiero critico. La prova indipendente di trasferimento appartiene a un protocollo di ricerca separato.</li>']
];
for (const [file, pattern, replacement] of mechanics) {
  const old = read(file);
  if (!pattern.test(old) && !old.includes(replacement)) throw new Error(`Method block not found: ${file}`);
  write(file, old.replace(pattern, replacement));
}
for (const { path, data } of translations) {
  data.blocks = data.blocks.map(text => text.replaceAll('4.0.0', VERSION));
  if (data.en === 'en/research-and-methodology') {
    data.blocks = data.blocks.map(text => text.includes('<strong>Cycle de décision')
      ? '<strong>Parcours guidé V5 :</strong> compréhension → hypothèse → enquête → argumentation → retour → transfert. Les 14 dossiers proposent des médiations contextuelles, une évaluation des sources et des révisions motivées. La note autonome est figée avant le retour ; réflexion ultérieure et débrief final restent distincts. Les notes sont temporaires dans l’onglet et n’évaluent pas automatiquement la pensée critique. Le transfert indépendant relève d’un protocole de recherche séparé.' : text);
  }
  if (data.en === 'en/press-kit') data.blocks = data.blocks.map(text => text.includes('BJO6aiElmrY') ? text : text.replaceAll('screenshots-v4/', 'screenshots-v5/').replaceAll('version 4.0', 'version 5.0').replaceAll('Version 4.0', 'Version 5.0')
    .replaceAll('2026-10-22', DATE).replaceAll('22 octobre 2026', '21 novembre 2026'));
  const source = sourceMain(read(`${data.en}/index.html`));
  if (data.blocks.length !== blocks(source).length) throw new Error(`Translation block count changed: ${path}`);
  data.sourceHash = sourceHash(source);
  write(path, JSON.stringify(data, null, 2) + '\n');
}
let press = read('src/site/eu-press-content.mjs').replaceAll('4.0.0', VERSION)
  .replace(/(NO AI ACT |Version |versión |versão )4\.0/g, (_, prefix) => prefix + '5.0')
  .replaceAll('screenshots-v4/', 'screenshots-v5/')
  .replaceAll('22. Oktober 2026', '21. November 2026').replaceAll('22 de octubre de 2026', '21 de noviembre de 2026').replaceAll('22 de outubro de 2026', '21 de novembro de 2026');
write('src/site/eu-press-content.mjs', press);
let citation = read('CITATION.cff').replace(/^version: .+$/m, `version: ${VERSION}`).replace(/^date-released: .+$/m, `date-released: "${DATE}"`)
  .replace('The game is bilingual (Italian/English)', 'The game is available in Italian, English and French')
  .replace('runs entirely in the browser, performs no gameplay network requests and\n  collects no personal data.', 'runs in the browser and sends only aggregate usage counters, with opt-out\n  and no player identifiers. Answers, reports and guided notes stay local.')
  .replace('after the first Zenodo archive of the 2.0 release.', 'after an authorised Zenodo archive is created.');
write('CITATION.cff', citation);

let readme = read('README.md').replace('stato-v4.0.0', `stato-${TAG}`);
readme = readme.replace(/## Stato attuale del codice[^\n]*\n[\s\S]*?(?=\n## Novità in v1)/,
`## Stato attuale del codice (v${VERSION})\n\nLa V5 aggiunge un percorso ludopedagogico guidato a tutti i 14 casi in italiano,\ninglese e francese: mediazioni contestuali, valutazione delle fonti, collegamenti\nspiegati, revisioni motivate dell'ipotesi e argomentazione autonoma prima del\nfeedback. Il debrief distingue il testo precedente dalla riflessione successiva\ne include una sintesi a fine sessione. Gli appunti restano temporanei nella scheda.\n\nIl dossier [metodologico](docs/v5/METHODOLOGY.md) contiene matrici A/B/C, CEPAJe,\nLM–GM, bibliografia e limiti. Il laboratorio [Study 02](docs/v5/ARGUMENTATION_STUDY02.md)\nè separato dalla build pubblica: due forme indipendenti, osservazione e rubrica\nsolo umana. Non è una raccolta pubblica di dati individuali. L'efficacia educativa\ne la validità delle inferenze richiedono ancora uno studio con partecipanti.\n\nRestano 14 casi, quattro modalità, salvataggi v2 compatibili con v1 e 155 URL\npubblici in sei lingue del sito. Note: [RELEASE_NOTES_v5.0.0.md](docs/RELEASE_NOTES_v5.0.0.md).\n`);
readme = readme.replace(/Note di rilascio: \[`docs\/RELEASE_NOTES_v4\.0\.0.md`\]\(docs\/RELEASE_NOTES_v4\.0\.0.md\)\./,
  'Note di rilascio: [`docs/RELEASE_NOTES_v5.0.0.md`](docs/RELEASE_NOTES_v5.0.0.md).');
readme = readme.replace(/- \*\*Versione\*\*: .+/, `- **Versione**: v${VERSION} (fonte: \`package.json\`)`)
  .replace(/- \*\*Tag della versione\*\*: .+/, `- **Tag della versione**: \`${TAG}\` — **${tagged ? 'pubblicato' : 'non ancora pubblicato'}**`)
  .replace(/- \*\*Ultima release effettivamente taggata\*\*: .+/, `- **Ultima release effettivamente taggata**: \`${cfg.lastTaggedRelease}\``)
  .replace(/- \*\*Nota\*\*: la candidata 2\.3[^\n]+/, '- **Nota**: il tag software e lo stato del deploy web sono verifiche distinte; l’efficacia educativa resta da validare.')
  .replace('italiano, inglese e francese (ramo di revisione, senza deploy)', 'italiano, inglese e francese')
  .replace(/Version \*\*4\.0\.0\*\* is a\npress candidate not yet tagged; the latest tagged release is \*\*2\.2\.0\*\*\./,
    `Version **${VERSION}** adds guided inquiry across all 14 cases. The latest tagged release is **${cfg.lastTaggedRelease}**${tagged ? '.' : '; the V5 tag is not yet published.'}`);
// Keep every historical/latest-tag statement consistent as the real tag advances.
readme = readme.replace(/(last tagged release is \*\*)[^*]+(\*\*)/g, `$1${cfg.lastTaggedRelease}$2`);
readme = readme.replace(/The latest tagged release is \*\*[^*]+\*\*(?:; the V5 tag is not yet published)?\./g,
  `The latest tagged release is **${cfg.lastTaggedRelease}**${tagged ? '.' : '; the V5 tag is not yet published.'}`)
  .replace('Three difficulty modes, mission paths, IT/EN.', 'Three difficulty modes, mission paths, IT/EN/FR.');
readme = readme.replace(/Version \*\*[\d.]+\*\* adds guided inquiry/, `Version **${VERSION}** adds guided inquiry`);
readme = readme.replace('Note: [RELEASE_NOTES_v5.0.0.md](docs/RELEASE_NOTES_v5.0.0.md).',
  `Note: [RELEASE_NOTES_v${VERSION}.md](docs/RELEASE_NOTES_v${VERSION}.md).`);
write('README.md', readme);
let llms = read('public/llms.txt').replace(/- Version: v[^\n]+/, `- Version: ${TAG}`);
llms = llms.replace(/releases\/tag\/v2\.2\.0/g, `releases/tag/${cfg.lastTaggedRelease}`);
llms = llms.replace('## Key facts and limitations', '## Guided inquiry in V5\n\n- All 14 cases offer optional case-specific mediation, source assessments, explained relations and hypothesis revisions.\n- A free argument is fixed before feedback; later reflection and final debrief stay distinct.\n- Guided notes are temporary in the tab and are excluded from saves, exports and analytics.\n- Study 02 is a separate local research tool, not included in the public game; rubrics and transfer tasks are preliminary.\n- Technical coverage does not establish educational effectiveness or critical-thinking competence.\n\n## Key facts and limitations');
// Idempotent on the tag-publication pass.
if (read('public/llms.txt').includes('## Guided inquiry in V5')) llms = read('public/llms.txt').replace(/- Version: v[^\n]+/, `- Version: ${TAG}`).replace(/releases\/tag\/v2\.2\.0/g, `releases/tag/${cfg.lastTaggedRelease}`);
if (tagged) llms = llms.replace(/^- Last tagged release: .+$/m,
  `- Last tagged release: https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/${TAG} (tagged ${DATE}; guided inquiry and independent study tools)`);
write('public/llms.txt', llms);
console.log(stageTag ? `Staged ${TAG} metadata for atomic branch/tag publication; no remote mutation performed.`
  : `Prepared ${TAG}; last recorded tagged release: ${cfg.lastTaggedRelease}.`);

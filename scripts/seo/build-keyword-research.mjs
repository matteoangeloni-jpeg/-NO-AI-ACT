import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { researchedAt, markets, topics } from './keyword-markets.mjs';
import { routeGroups, publicRoutes } from '../../src/site/route-inventory.mjs';

const config = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const groups = routeGroups(config);
const output = 'docs/seo/keyword-research';
export const plan = Object.entries(markets).flatMap(([lang, market]) => topics.map(([topic, source, priority, intent, action], i) => {
  const introductory = ['de', 'es', 'pt'].includes(lang);
  const key = introductory && topic === 'classroom' ? 'en/education' : source;
  const dir = groups.find(group => group.en === key)?.[lang];
  if (typeof dir !== 'string' || !existsSync(dir ? `${dir}/index.html` : 'index.html')) {
    throw new Error(`Missing real destination: ${lang}/${topic}`);
  }
  return { lang, topic, priority, intent, action, dir, url: config.site + (dir ? `${dir}/` : ''),
    keywords: market.phrases[i],
    gap: introductory && topic === 'classroom'
      ? 'Introduzione disponibile; manca un modulo operativo localizzato con materiali e discussione finale.'
      : topic === 'literacy'
        ? 'Questa proposta aggiunge un esercizio localizzato sulle prove e sulla discussione, senza certificazioni o raccolta di risposte.'
      : topic === 'game'
        ? 'Categoria e marchio già aggiornati; preservare il testo e misurare prima di riscriverlo.'
        : 'Pagina esistente da verificare rispetto alla domanda; nessuna riscrittura automatica.' };
}));

export function privateBaseline(snapshot) {
  if (snapshot.property !== 'sc-domain:no-ai-act.eu' || snapshot.dataState !== 'final' || snapshot.searchType !== 'web') {
    throw new Error('Expected final web-search evidence for the authorized domain');
  }
  const rows = snapshot.cuts?.['current:query,page']?.rows;
  const pages = snapshot.cuts?.['current:page']?.rows;
  if (!Array.isArray(rows) || !Array.isArray(pages)) throw new Error('Missing query/page and page evidence');
  const routeMap = new Map(publicRoutes(config).map(route => [config.site + (route.dir ? `${route.dir}/` : ''), route.lang]));
  // Language describes the landing page, never the searcher's language/country.
  const language = url => { try { const u = new URL(url); u.hash = ''; return routeMap.get(u.href); } catch { return undefined; } };
  return { property: snapshot.property, capturedAt: snapshot.capturedAt, periods: snapshot.periods,
    caveats: [
      'Lingua della pagina di destinazione, non lingua della query o nazionalita del visitatore.',
      'Righe query/pagina filtrate da Google: non equivalgono ai totali della proprieta.',
      'Nessuna riga significa assenza di evidenza visibile, non domanda pari a zero.',
      snapshot.periods?.current?.[1] < '2026-10-18'
        ? 'Le date precedono il rilascio multilingue del 18 ottobre: non misurano gli effetti delle modifiche.'
        : 'Separare i periodi prima e dopo il rilascio; la correlazione non dimostra un effetto causale.',
      'Il campo totals.position del vecchio helper non e una posizione Google utilizzabile.'
    ],
    locales: Object.fromEntries(Object.keys(markets).map(lang => {
      const queryPages = rows.filter(row => language(row.page) === lang);
      const pageRows = pages.filter(row => language(row.page) === lang);
      return [lang, { visibleQueryPageRows: queryPages.length, pageRows: pageRows.length,
        topVisibleQueries: [...queryPages].sort((a, b) => b.impressions - a.impressions).slice(0, 12),
        candidateEvidence: plan.filter(row => row.lang === lang).flatMap(row => row.keywords.map(keyword => ({
          keyword, url: row.url,
          exactVisibleRows: queryPages.filter(q => q.page.split('#')[0] === row.url && q.query.toLocaleLowerCase() === keyword.toLocaleLowerCase())
        }))) }];
    })) };
}

function generate() {
  mkdirSync(output, { recursive: true });
  const columns = ['lang', 'topic', 'priority', 'keyword', 'url', 'intent', 'evidence', 'action', 'gap'];
  const csv = value => `"${String(value).replaceAll('"', '""')}"`;
  const rows = plan.flatMap(row => row.keywords.map(keyword => ({ ...row, keyword, evidence: 'Editorial candidate; demand and ranking not measured' })));
  writeFileSync(`${output}/keywords.csv`, [columns.join(','), ...rows.map(row => columns.map(key => csv(row[key])).join(','))].join('\n') + '\n');
  for (const [lang, market] of Object.entries(markets)) {
    const local = plan.filter(row => row.lang === lang);
    const sections = local.map(row => `### ${row.priority}: ${row.keywords[0]}\n\n- Variante: ${row.keywords[1]}.\n- Intento: ${row.intent}.\n- Pagina proprietaria: [${row.dir || '/'}](${row.url}).\n- Intervento: ${row.action}\n- Stato: ${row.gap}\n`).join('\n');
    writeFileSync(`${output}/${lang}.md`, `# ${market.name}: piano di ricerca e posizionamento\n\nRicerca del ${researchedAt}. ${market.market}.\n\n## Direzione editoriale\n\n${market.angle}\n\nOtto gruppi, sedici espressioni candidate. P1 indica pertinenza al gioco e alla\ndidattica, non volume maggiore o difficolta minore. Le proposte sono inferenze\neditoriali: non sono tutte query osservate ne promesse di ranking.\n\n## Pagine e domande\n\n${sections}\n## Ricerca effettuata\n\nLe seguenti ricerche web esplorative servono a trovare lessico, formati e risorse\nadiacenti. Non sono una SERP Google geolocalizzata, un campione completo del mercato\no una misura del nostro posizionamento. I documenti istituzionali e le fonti degli\nautori supportano contesto e terminologia, non la frequenza delle query.\n\n${market.queries.map(query => `- ${query}`).join('\n')}\n\n## Fonti e risorse adiacenti\n\n${market.sources.map(([url, note]) => `- ${note} [Fonte](${url}).`).join('\n')}\n\n## Regole di pubblicazione e verifica\n\n- Una pagina di destinazione per gruppo; varianti nella stessa pagina, non URL duplicati.\n- Il sito ha sei lingue, il gioco tre: IT/EN/FR. Non promettere gameplay DE/ES/PT.\n- Non equiparare il gioco a un corso accreditato o a una prova di conformita.\n- Revisione madrelingua e specialistica non certificata da questa ricerca.\n- Applicare solo interventi che risolvano una lacuna verificata; non ripetere keyword.\n- Confrontare periodi post-rilascio equivalenti e separare query di marchio e non di marchio.\n`);
  }
  writeFileSync(`${output}/README.md`, `# Ricerca SEO nelle sei lingue\n\nData: ${researchedAt}. ${plan.length} gruppi di intento, ${rows.length} espressioni\ncandidate, ciascuna collegata a una pagina esistente.\n\n${Object.entries(markets).map(([lang, market]) => `- [${market.name}](${lang}.md): ${market.angle}`).join('\n')}\n\n[Tabella completa](keywords.csv). Questa ricerca approfondisce la precedente\nlista di 24 opportunita; non significa che tutte le espressioni siano state\ninserite nel sito o abbiano volumi/ranking misurati.\n\n## Metodo e limiti\n\n- Ricerche separate per lingua e confronto di fonti istituzionali, autori e\n  risorse didattiche. Nessuna stima di autorita dei domini o promessa di battere\n  i risultati istituzionali sulla keyword generica AI Act.\n- Priorita alla nicchia: gioco investigativo, alfabetizzazione critica, attivita\n  didattiche basate su casi e prove. Le guide giuridiche generiche sono secondarie.\n- Search Console disponibile tramite API; riuso della cattura privata del\n  18 ottobre, con dati finali fino al 15 ottobre. Non e un risultato post-rilascio.\n- Nessun accesso utile ai volumi di Keyword Planner: nessun numero inventato,\n  difficolta o CPC. Candidati editoriali ed evidenza osservata restano separati.\n- Le differenze tra paesi non equivalgono alle lingue: inglese non significa\n  solo Regno Unito; portoghese di questo sito significa pt-PT, non pt-BR.\n- Il confronto di risorse concorrenti e adiacenti non implica accordi, citazioni\n  ricevute, validazione pedagogica o efficacia superiore del nostro gioco.\n\n## Ordine di esecuzione\n\n1. Conservare il rilascio appena pubblicato e la sua baseline; non riscrivere\n   titoli ogni giorno in assenza di nuove prove.\n2. Migliorare prima i materiali di facilitazione piu brevi in DE/ES/PT, con\n   obiettivi, un esercizio verificabile e discussione finale; mantenere distinte\n   le guide sugli usi scolastici dell'IA.\n3. Per IT/EN/FR partire dalle risorse esistenti: verificare percorsi verso lezioni,\n   materiali e concetti richiesti; usare le query reali per scegliere approfondimenti.\n4. Approfondire casi di rischio e trasparenza solo con revisione delle condizioni\n   normative e fonti aggiornate, non con duplicati di keyword.\n5. Valutare la scoperta e gli URL canonici dopo la scansione di Google; confrontare\n   finestre complete di 28 giorni post-rilascio con un periodo equivalente, evitando\n   conclusioni forti con pochi clic. Non e stato creato un monitor automatico.\n\n## Riproduzione\n\n- \`node scripts/seo/build-keyword-research.mjs --write\`: rigenera schede e CSV\n  pubblici senza leggere dati privati.\n- \`node scripts/seo/build-keyword-research.mjs --baseline .seo-cache/no-ai-act/2026-10-18/search-console.json\`:\n  legge solo la cattura autorizzata e salva il riepilogo privato nella stessa\n  cartella ignorata. Non invia dati, non modifica Google o il sito.\n`);
  console.log(`Generated six briefs: ${plan.length} intent groups and ${rows.length} candidate phrases. No website or Google changes.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--write')) generate();
  const index = process.argv.indexOf('--baseline');
  if (index >= 0) {
    const path = resolve(process.argv[index + 1] ?? '');
    const cache = resolve('.seo-cache') + '/';
    if (!path.replaceAll('\\', '/').startsWith(cache.replaceAll('\\', '/'))) throw new Error('Baseline must stay inside ignored .seo-cache');
    const baseline = privateBaseline(JSON.parse(readFileSync(path, 'utf8')));
    writeFileSync(resolve(dirname(path), 'language-keyword-baseline.json'), JSON.stringify(baseline, null, 2) + '\n');
    console.log('Saved private language baseline inside ignored local cache. No API or publication changes.');
  }
}

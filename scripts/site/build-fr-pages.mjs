/**
 * French pages: the original 13 summaries plus 24 full source-block translations.
 * Shared metadata/navigation preserve the existing site design. IT/EN editorial
 * content is never generated here; sync-fr-inventory adds reciprocal alternates.
 * Run npm run site:fr, then update-sitemap-lastmod and the SEO/build checks.
 * --prova validates and reports without writing HTML.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGINE, NAV, SITE } from '../../src/site/fr-content.mjs';
import { translatedPages } from './fr-translations.mjs';

/**
 * L'IMMAGINE SOCIALE VIENE DALLA MAPPATURA, non da una costante.
 *
 * La prima stesura metteva `no-ai-act-en-og.png` su tutte le pagine francesi,
 * e il controllo social l'ha bocciata: la categoria di ogni pagina è
 * dichiarata in scripts/social/meta.config.json, e quella mappatura è la fonte
 * di verità anche per l'italiano e l'inglese. Due fonti per la stessa cosa è
 * la classe di difetto che questo repository conosce bene.
 *
 * NON ESISTE UN'IMMAGINE SOCIALE FRANCESE, e non ne ho inventata una: le
 * pagine francesi riusano le immagini per CATEGORIA — guide, éducation,
 * glossaire — che non contengono testo di lingua, e la copertina generica solo
 * dove non c'è categoria tematica. È una lacuna dichiarata, non un dettaglio
 * nascosto: una copertina francese va disegnata, e finché non esiste questa è
 * la scelta meno sbagliata.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const prova = process.argv.includes('--prova');
const versione = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const social = JSON.parse(readFileSync(join(root, 'scripts/social/meta.config.json'), 'utf8'));
const inventory = JSON.parse(readFileSync(join(root, 'scripts/seo/routes.config.json'), 'utf8'));
const additional = translatedPages(inventory);
const extraNav = [
  { nome: 'Pédagogie', voci: additional.filter(p => /lesson-plan|classroom|educators|citizenship|serious-game|privacy-conscious/.test(p.en)) },
  { nome: 'En pratique', voci: additional.filter(p => /penalties|gdpr|timeline|business|administration|provider|fria|deepfakes|recruitment/.test(p.en)) },
  { nome: 'Projet', voci: additional.filter(p => /faq|how-to-cite|matteo|press-kit|research/.test(p.en)) }
].map(g => ({ ...g, voci: g.voci.map(p => ({ slug: p.slug, nome: p.breadcrumb })) }));
if (new Set(extraNav.flatMap(g => g.voci.map(v => v.slug))).size !== additional.length) {
  throw new Error('Every supplemental French page must belong to the navigation');
}
const immagineDi = (slug) => {
  const chiave = slug === '' ? 'fr' : `fr/${slug}`;
  const categoria = social.pageCategory[chiave];
  if (!categoria) throw new Error(`categoria social mancante per ${chiave}: aggiungerla a scripts/social/meta.config.json`);
  const file = social.categories[categoria]?.file;
  if (!file) throw new Error(`categoria social sconosciuta: ${categoria}`);
  return `${SITE}assets/social/${file}`;
};

/** Scappa il minimo indispensabile per un attributo HTML. */
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** La navigazione, identica su ogni pagina tranne la voce corrente. */
function nav(slug) {
  const voce = (v) => {
    const corrente = v.slug === slug;
    const href = v.slug === '' ? '{FR}' : `{FR}${v.slug}/`;
    return `<li><a href="${href}"${corrente ? ' aria-current="page"' : ''}>${v.nome}</a></li>`;
  };
  const gruppo = (g, i) => {
    const attivo = g.voci.some((v) => v.slug === slug);
    return `          <li class="has-sub">
            <button class="nav-sub-btn${attivo ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="sub-${i}">${g.nome}</button>
            <ul class="nav-sub" id="sub-${i}">
${g.voci.map((v) => '              ' + voce(v)).join('\n')}
            </ul>
          </li>`;
  };
  return `      <nav class="site-nav" aria-label="Navigation principale">
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu de navigation">Menu</button>
        <ul class="nav-menu" id="site-menu">
          <li><a href="{ROOT}play/?lang=fr">Jouer</a></li>
${[...NAV, ...extraNav].map(gruppo).join('\n')}
        </ul>
      </nav>`;
}

/** Una sezione: titolo, paragrafi, e liste opzionali. */
function sezione(s, i) {
  const id = `s${i}-title`;
  const corpo = s.blocchi
    .map((b) => {
      if (b.lista) {
        return `        <ul class="plain">\n${b.lista.map((v) => `          <li>${v}</li>`).join('\n')}\n        </ul>`;
      }
      if (b.callout) return `        <div class="callout">${b.callout}</div>`;
      return `        <p${b.intro ? ' class="section-intro"' : ''}>${b.testo}</p>`;
    })
    .join('\n');
  return `    <section aria-labelledby="${id}">
      <div class="wrap">
        <h2 id="${id}"><span class="num">${String(i + 1).padStart(2, '0')}</span>${s.titolo}</h2>
${corpo}
      </div>
    </section>`;
}

/**
 * I PERCORSI RELATIVI DIPENDONO DALLA PROFONDITÀ, E QUESTO È IL DIFETTO CHE
 * L'AUDIT HA PRESO. Il contenuto scriveva `../fr/<slug>/`: giusto dalla home
 * `/fr/index.html`, rotto da `/fr/<slug>/index.html`, dove risolve in
 * `/fr/fr/<slug>/`. Un collegamento rotto in una lingua nuova non lo nota
 * nessuno, perché nessuno la percorre ancora. Il contenuto usa ora i token
 * {FR} e {ROOT}, e la profondità la calcola il generatore.
 */
function risolvi(testo, slug) {
  const fr = slug === '' ? './' : '../';
  const root = slug === '' ? '../' : '../../';
  return testo.split('{FR}').join(fr).split('{ROOT}').join(root);
}

function pagina(p) {
  const url = p.slug === '' ? `${SITE}fr/` : `${SITE}fr/${p.slug}/`;
  const og = immagineDi(p.slug);
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="{ROOT}favicon.svg" />

  <title>${p.title}</title>
  <meta name="description" content="${attr(p.description)}" />
  <meta name="author" content="NO AI ACT" />
  <meta name="robots" content="index, follow, max-image-preview:large" />

  <link rel="canonical" href="${url}" />
${p.it === null ? '' : `  <link rel="alternate" hreflang="it" href="${SITE}${p.it}" />`}
  <link rel="alternate" hreflang="en" href="${SITE}${p.en}" />
  <link rel="alternate" hreflang="fr" href="${url}" />
  <link rel="alternate" hreflang="x-default" href="${SITE}${p.it ?? p.en}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="NO AI ACT" />
  <meta property="og:locale" content="fr_FR" />
${p.it === null ? '' : '  <meta property="og:locale:alternate" content="it_IT" />'}
  <meta property="og:locale:alternate" content="en_GB" />
  <meta property="og:title" content="${attr(p.ogTitle)}" />
  <meta property="og:description" content="${attr(p.ogDescription)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${og}" />
  <meta property="og:image:secure_url" content="${og}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Couverture NO AI ACT : serious game pédagogique gratuit sur l'AI Act européen." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(p.ogTitle)}" />
  <meta name="twitter:description" content="${attr(p.ogDescription)}" />
  <meta name="twitter:image" content="${og}" />
  <meta name="twitter:image:alt" content="Couverture NO AI ACT : serious game pédagogique gratuit sur l'AI Act européen." />
  <link rel="stylesheet" href="/src/styles/landing.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "NO AI ACT",
        "item": "${SITE}fr/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": ${JSON.stringify(p.breadcrumb)},
        "item": "${url}"
      }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": ${JSON.stringify(p.ogTitle)},
    "url": "${url}",
    "image": "${og}",
    "inLanguage": "fr",
    "learningResourceType": "Reading",
    "isAccessibleForFree": true,
    "about": {
      "@type": "Thing",
      "name": ${JSON.stringify(p.breadcrumb)}
    }
  }
  </script>
  <script>document.documentElement.classList.add('has-js');</script>
</head>
<body>
  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="topbar">
    <div class="wrap">
      <a class="brand" href="{FR}">NO AI ACT</a>
${nav(p.slug)}
    </div>
  </header>

  ${p.main ?? `<main id="main">
    <section class="hero" aria-labelledby="page-title">
      <div class="wrap">
        <p class="stamp">${p.eyebrow}</p>
        <h1 id="page-title">${p.h1}</h1>
        <p class="lead">${p.lead}</p>
      </div>
    </section>

${p.sezioni?.map(sezione).join('\n\n')}
  </main>`}

  <footer aria-labelledby="footer-title">
    <div class="wrap">
      <h2 id="footer-title" class="stamp">Simulation pédagogique — pas un conseil juridique</h2>
      <p>NO AI ACT est un outil pédagogique indépendant et open source. Il simplifie délibérément le <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" hreflang="fr">règlement (UE) 2024/1689 (AI Act)</a> et ne remplace ni le texte juridique ni l'avis d'un professionnel.</p>
      <p><a href="{FR}education/">Ressources éducatives</a> · <a href="{FR}comment-ca-marche/">Comment ça marche</a> · <a href="{FR}ai-act-pour-enseignants/">Pour les enseignants</a> · <a href="{FR}glossaire/">Glossaire</a> ${p.it === null ? '' : `· <a href="{ROOT}${p.it}" hreflang="it">Version italienne</a>`} · <a href="{ROOT}${p.en}" hreflang="en">English version</a></p>
      <p class="credit">Conçu et développé par <a href="{FR}matteo-angeloni/">Matteo Angeloni</a> · v${versione} · <span class="ai-disclosure">Fait avec l'IA, non par l'IA</span><br /><span class="credit-affil">Doctorant en <a href="https://www.unitus.it/post-laurea/dottorati-di-ricerca/corsi-di-dottorato-attivi/societa-in-mutamento-politiche-diritti-e-sicurezza/">Società in mutamento: politiche, diritti e sicurezza</a> · <a href="https://www.unitus.it/">Università degli Studi della Tuscia</a> — projet indépendant, sans caractère officiel pour l'université</span></p>
    </div>
  </footer>
  <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "7c85578fc8ad4488a54c6bc670a10dcf"}'></script><!-- End Cloudflare Web Analytics -->
  <script type="module" src="/src/scripts/nav.ts"></script>
</body>
</html>
`;
}

let scritte = 0;
for (const p of [...PAGINE, ...additional]) {
  const html = risolvi(pagina(p), p.slug);
  const dir = p.slug === '' ? join(root, 'fr') : join(root, 'fr', p.slug);
  const file = join(dir, 'index.html');
  const titolo = p.title.length;
  const descr = p.description.length;
  const avviso = titolo > 65 || descr < 50 || descr > 165 ? '  ⚠ fuori soglia SEO' : '';
  console.log(`  ${p.slug || '(racine)'}  ·  title ${titolo}  ·  desc ${descr}${avviso}`);
  if (!prova) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, html);
  }
  scritte++;
}
console.log(`\n${scritte} pagine FR${prova ? ' (prova: nessuna scrittura)' : ' scritte'}.`);
if (!prova) console.log('Run audit:seo and build/verify:dist before review. No deployment performed.');

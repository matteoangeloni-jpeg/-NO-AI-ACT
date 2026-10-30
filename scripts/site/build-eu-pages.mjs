import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { TOPICS, topicDir } from '../../src/site/eu-topics.mjs';
import { publicRoutes, publishedLanguages, languageCode } from '../../src/site/route-inventory.mjs';
import * as de from '../../src/site/de-content.mjs';
import * as es from '../../src/site/es-content.mjs';
import * as pt from '../../src/site/pt-content.mjs';
import { PRACTICAL_PAGES, HUB_PATHS } from '../../src/site/eu-practical-content.mjs';
import { PRESS_PAGES } from '../../src/site/eu-press-content.mjs';
import { renderPressCoverage, renderPressReferences } from '../../src/site/press-coverage.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const write = (file, text) => { mkdirSync(dirname(resolve(root, file)), { recursive: true }); writeFileSync(resolve(root, file), text); };
const config = JSON.parse(read('scripts/seo/routes.config.json'));
const social = JSON.parse(read('scripts/social/meta.config.json'));
const version = JSON.parse(read('package.json')).version;
const names = { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', pt: 'Português' };
const locales = { it: 'it_IT', en: 'en_GB', fr: 'fr_FR', de: 'de_DE', es: 'es_ES', pt: 'pt_PT' };
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const url = dir => `${config.site}${dir ? `${dir}/` : ''}`;
const href = dir => `/${dir ? `${dir}/` : ''}`;
const file = dir => dir ? `${dir}/index.html` : 'index.html';
const walk = (node, visit) => { visit(node); for (const child of node.childNodes ?? []) walk(child, visit); };
const attribute = (node, key) => node.attrs?.find(attr => attr.name === key)?.value;

for (const topic of TOPICS) {
  const group = config.pairs.find(pair => pair.en === topic[1]);
  if (!group) throw new Error(`Missing source group: ${topic[1]}`);
  for (const lang of ['de', 'es', 'pt']) {
    group[lang] = topicDir(topic, lang);
    social.pageCategory[group[lang]] = social.pageCategory[group.en];
    if (!social.pageCategory[group[lang]]) throw new Error(`Missing social category: ${group.en}`);
  }
}
config.$comment = `Language groups declare only existing page equivalents. IT/EN/FR cover the current full inventory; DE/ES/PT contain ${TOPICS.length} introductory and practical resources each. Portuguese targets pt-PT. /play/ is noindex and remains IT/EN/FR.`;
const languages = publishedLanguages(config);
const alternates = group => Object.entries(group).map(([lang, dir]) => `  <link rel="alternate" hreflang="${languageCode(lang)}" href="${url(dir)}" />`).join('\n') + `\n  <link rel="alternate" hreflang="x-default" href="${url(group.it ?? group.en)}" />`;
const switcher = (group, current) => `<nav class="locale-links" aria-label="${{it:'Lingue',en:'Languages',fr:'Langues',de:'Sprachen',es:'Idiomas',pt:'Idiomas'}[current]}"><div class="wrap">${Object.entries(group).map(([lang, dir]) => `<a href="${href(dir)}" hreflang="${languageCode(lang)}" lang="${languageCode(lang)}"${lang === current ? ' aria-current="page"' : ''}><img src="/assets/flags/${lang === 'en' ? 'gb' : lang}.png" width="28" height="20" alt="" /><span>${names[lang]}</span></a>`).join('')}</div></nav>`;

function press(lang) {
  return renderPressCoverage(lang);
}

for (const [lang, { UI: ui, PAGES: basePages }] of Object.entries({ de, es, pt })) {
  const pages = { ...basePages, ...PRACTICAL_PAGES[lang], ...PRESS_PAGES[lang] };
  for (const topic of TOPICS) {
    const id = topic[0]; const page = pages[id]; const dir = topicDir(topic, lang);
    if (!page || page.sections.length < 3) throw new Error(`Incomplete editorial page: ${lang}/${id}`);
    const group = config.pairs.find(pair => pair.en === topic[1]);
    const category = social.pageCategory[dir]; const image = `/assets/social/${social.categories[category].file}`;
    const navLinks = TOPICS.map(t => `<li><a href="${href(topicDir(t,lang))}"${t[0]===id?' aria-current="page"':''}>${escape(t[0]==='home'?ui.home:pages[t[0]].h1)}</a></li>`).join('');
    const json = value => JSON.stringify(value).replaceAll('<','\\u003c');
    const breadcrumb = { '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'NO AI ACT',item:url(lang)},
      ...(id==='home'?[]:[{'@type':'ListItem',position:2,name:page.h1,item:url(dir)}])
    ]};
    const resource = { '@context':'https://schema.org','@type':id==='press'?'WebPage':'LearningResource',name:page.h1,url:url(dir),inLanguage:ui.lang,isAccessibleForFree:true,...(id==='press'?{}:{learningResourceType:'Reading'}),image:`${config.site}${image.slice(1)}` };
    const html = `<!doctype html>
<html lang="${ui.lang}"><head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>${escape(page.title)}</title>
  <meta name="description" content="${escape(page.description)}" />
  <meta name="author" content="Matteo Angeloni" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${url(dir)}" />
${alternates(group)}
  <meta property="og:type" content="website" /><meta property="og:site_name" content="NO AI ACT" />
  <meta property="og:locale" content="${ui.locale}" />
${Object.keys(group).filter(l=>l!==lang).map(l=>`  <meta property="og:locale:alternate" content="${locales[l]}" />`).join('\n')}
  <meta property="og:title" content="${escape(page.title)}" /><meta property="og:description" content="${escape(page.description)}" />
  <meta property="og:url" content="${url(dir)}" /><meta property="og:image" content="${config.site}${image.slice(1)}" />
  <meta property="og:image:secure_url" content="${config.site}${image.slice(1)}" /><meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="${escape(page.h1)}" />
  <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escape(page.title)}" />
  <meta name="twitter:description" content="${escape(page.description)}" /><meta name="twitter:image" content="${config.site}${image.slice(1)}" /><meta name="twitter:image:alt" content="${escape(page.h1)}" />
  <link rel="stylesheet" href="/src/styles/landing.css" />
  <script type="application/ld+json">${json(breadcrumb)}</script>
  <script type="application/ld+json">${json(resource)}</script>
  <script>document.documentElement.classList.add('has-js');</script>
</head><body class="eu-site">
  <a class="skip-link" href="#main">${ui.skip}</a>
  <header class="topbar"><div class="wrap"><a class="brand" href="/${lang}/">NO AI ACT</a>
    <nav class="site-nav" aria-label="${ui.menu}"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="${ui.menu}">${ui.menu}</button>
    <ul class="nav-menu" id="site-menu"><li><a href="#play-languages">${ui.play}</a></li><li class="has-sub"><button class="nav-sub-btn" type="button" aria-expanded="false" aria-controls="eu-topics">${ui.resources}</button><ul class="nav-sub" id="eu-topics">${navLinks}</ul></li></ul></nav>
  </div></header>
${switcher(group,lang)}
  <main id="main"><section class="hero" aria-labelledby="page-title"><div class="wrap"><p class="stamp">NO AI ACT · ${ui.name}</p><h1 id="page-title">${escape(page.h1)}</h1><p class="lead">${escape(page.lead)}</p><p class="cta-row"><a class="btn btn-primary" href="#play-languages">${ui.play}</a></p></div></section>
${page.sections.map(([heading,text],i)=>`<section aria-labelledby="section-${i}"><div class="wrap"><h2 id="section-${i}"><span class="num">${String(i+1).padStart(2,'0')}</span>${escape(heading)}</h2><p>${escape(text)}</p>${page.extras?.[i]??''}</div></section>`).join('\n')}
${id==='education'?`<section aria-labelledby="study-paths-title"><div class="wrap"><h2 id="study-paths-title">${HUB_PATHS[lang].title}</h2>${HUB_PATHS[lang].items.map(([target,label,text])=>`<h3><a href="${href(topicDir(TOPICS.find(t=>t[0]===target),lang))}">${escape(label)}</a></h3><p>${escape(text)}</p>`).join('')}</div></section>`:''}
${page.illustrated?`<section aria-label="NO AI ACT"><div class="wrap"><figure class="resource-figure"><a href="/assets/press/screenshots/03-evidence-desk.jpg" target="_blank" rel="noopener"><img src="/assets/press/screenshots/03-evidence-desk.jpg" width="1920" height="1080" alt="${escape(ui.screenshot)}" loading="lazy" decoding="async" /></a><figcaption>${escape(ui.screenshot)}</figcaption></figure></div></section>`:''}
${page.links?`<section aria-labelledby="next-reading-title"><div class="wrap"><h2 id="next-reading-title">${ui.related}</h2><ul class="plain">${page.links.map(([target,label])=>`<li><a href="${href(topicDir(TOPICS.find(t=>t[0]===target),lang))}">${escape(label)}</a></li>`).join('')}</ul></div></section>`:''}
${page.sources?`<section aria-labelledby="source-reading-title"><div class="wrap"><h2 id="source-reading-title">${ui.source}</h2><ul class="plain">${page.sources.map(([link,label])=>`<li><a href="${escape(link)}">${escape(label)}</a></li>`).join('')}</ul></div></section>`:''}
${id==='home'?press(lang):''}
  <section aria-labelledby="play-languages"><div class="wrap"><h2 id="play-languages">${ui.play}</h2><p>${escape(ui.game)}</p><p class="eu-play-links">${['it','en','fr'].map((l,i)=>`<a href="/play/?lang=${l}" hreflang="${l}">${ui.gameLanguages[i]}</a>`).join(' · ')}</p></div></section>
${page.links?'':`  <section aria-labelledby="related-title"><div class="wrap"><h2 id="related-title">${ui.related}</h2><ul class="plain">${TOPICS.filter(t=>t[0]!==id).map(t=>`<li><a href="${href(topicDir(t,lang))}">${escape(t[0]==='home'?ui.home:pages[t[0]].h1)}</a></li>`).join('')}</ul></div></section>`}
  </main><footer aria-labelledby="footer-title"><div class="wrap"><h2 id="footer-title" class="stamp">${ui.legal}</h2><p>${escape(ui.disclaimer)}</p><p><a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/${ui.official}" hreflang="${ui.lang}">${ui.source}</a> · <a href="/en/research-and-methodology/" hreflang="en" lang="en">${ui.authorLink}</a> · <a href="/game-statistics.html#en" hreflang="en">${ui.privacyLink}</a></p><p class="credit">${ui.author} · v${version}<br />${escape(ui.disclosure)}</p></div></footer>
  <script type="module" src="/src/scripts/nav.ts"></script>
${id==='home'?'  <script type="module" src="/src/scripts/press-carousel.ts"></script>':''}
</body></html>\n`;
    write(file(dir),html);
  }
}

// Structured locations preserve unrelated editorial HTML when synchronizing
// language navigation and the shared press inventory.
for (const route of publicRoutes(config).filter(route => ['it','en','fr'].includes(route.lang))) {
  let html = read(file(route.dir)); const edits = []; let header;
  walk(parse(html,{sourceCodeLocationInfo:true}), node => {
    if (['', 'en'].includes(route.dir) && node.tagName==='section' && attribute(node,'aria-labelledby')==='press-title') {
      const loc=node.sourceCodeLocation; edits.push({start:loc.startOffset,end:loc.endOffset,text:renderPressCoverage(route.lang,'04')});
    }
    if (['press-kit','en/press-kit'].includes(route.dir) && node.tagName==='section' && attribute(node,'aria-labelledby')==='coverage-title') {
      const wrap=node.childNodes.find(n=>n.tagName==='div');
      const references=wrap?.childNodes.find(n=>n.tagName==='p'||attribute(n,'id')==='press-references');
      if (!references?.sourceCodeLocation) throw new Error(`Missing press references: ${route.dir}`);
      const loc=references.sourceCodeLocation; edits.push({start:loc.startOffset,end:loc.endOffset,text:renderPressReferences(route.lang)});
    }
    if (node.tagName==='header' && !header) header=node.sourceCodeLocation;
    if (node.tagName==='link' && attribute(node,'rel')==='alternate' && attribute(node,'hreflang')) {
      const loc=node.sourceCodeLocation; edits.push({start:loc.startOffset,end:loc.endOffset,text:''});
    }
    if (node.tagName==='nav' && attribute(node,'class')==='locale-links') {
      const loc=node.sourceCodeLocation; edits.push({start:loc.startOffset,end:loc.endOffset,text:''});
    }
  });
  const head=parse(html,{sourceCodeLocationInfo:true}).childNodes.find(n=>n.tagName==='html')?.childNodes.find(n=>n.tagName==='head');
  if (!header || !head?.sourceCodeLocation?.endTag) throw new Error(`Missing document shell: ${route.dir}`);
  edits.push({start:head.sourceCodeLocation.endTag.startOffset,end:head.sourceCodeLocation.endTag.startOffset,text:`${alternates(route.group)}\n`});
  edits.push({start:header.endOffset,end:header.endOffset,text:`\n${switcher(route.group,route.lang)}`});
  for (const edit of edits.sort((a,b)=>b.start-a.start)) html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
  html = html.replace(/(?:[\t ]*\r?\n){3,}/g, '\n\n');
  write(file(route.dir),html);
}

write('scripts/seo/routes.config.json', JSON.stringify(config,null,2)+'\n');
write('scripts/social/meta.config.json', JSON.stringify(social,null,2)+'\n');
for (const lang of languages) {
  const path=`public/sitemap-${lang}.xml`;
  let old=''; try { old=read(path); } catch { /* first publication */ }
  const dates=new Map([...old.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(m=>[m[1],m[2]]));
  const today=new Date().toISOString().slice(0,10);
  write(path,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes(config).filter(r=>r.lang===lang).map(r=>`  <url>\n    <loc>${url(r.dir)}</loc>\n    <lastmod>${dates.get(url(r.dir))??today}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`);
}
const release=JSON.parse(read('release.config.json'));
release.siteLanguages=languages; // release.languages remains the playable languages.
for (const lang of languages) release.publicUrls[lang]=publicRoutes(config).filter(r=>r.lang===lang).length;
release.publicUrls.total=publicRoutes(config).length;
write('release.config.json',JSON.stringify(release,null,2)+'\n');
console.log(`Generated ${TOPICS.length*3} localized resources; inventory ${release.publicUrls.total}. No deployment performed.`);

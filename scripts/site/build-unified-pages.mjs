import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {dirname} from 'node:path';
import {parse} from 'parse5';
import {routeGroups,languageCode,SITE_LANGUAGES} from '../../src/site/route-inventory.mjs';
import {completeTopicGroups} from '../../src/site/unified-topics.mjs';
import {renderPressCoverage,renderPressReferences} from '../../src/site/press-coverage.mjs';

const read=file=>readFileSync(file,'utf8').replace(/^\uFEFF/,'');
const write=(file,value)=>{mkdirSync(dirname(file),{recursive:true});writeFileSync(file,value);};
const config=JSON.parse(read('scripts/seo/routes.config.json'));
config.pairs=completeTopicGroups(routeGroups(config));config.enOnly=[];config.frForEn={};
config.$comment='37 complete topic groups in IT/EN/FR/DE/ES/PT (pt-PT); every language has the same editorial coverage. Existing URLs preserved. /play/ is noindex.';
const groups=config.pairs,origin=config.site.replace(/\/$/,''),version=JSON.parse(read('package.json')).version;
const names={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',es:'Español',pt:'Português'};
const locale={it:'it_IT',en:'en_GB',fr:'fr_FR',de:'de_DE',es:'es_ES',pt:'pt_PT'};
const labels={it:['Lingue','Menu','Gioca','Impara','Docenti','AI Act','Organizzazioni','Privacy'],en:['Languages','Menu','Play','Learn','Teachers','AI Act','Organisations','Privacy'],fr:['Langues','Menu','Jouer','Apprendre','Enseignants','AI Act','Organisations','Confidentialité'],de:['Sprachen','Menü','Spielen','Lernen','Lehrkräfte','KI-Verordnung','Organisationen','Datenschutz'],es:['Idiomas','Menú','Jugar','Aprender','Docentes','Reglamento de IA','Organizaciones','Privacidad'],pt:['Idiomas','Menu','Jogar','Aprender','Docentes','Regulamento de IA','Organizações','Privacidade']};
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const flatten=(node,out=[])=>{out.push(node);for(const child of node.childNodes??[])flatten(child,out);return out;};
const escape=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const file=dir=>dir?`${dir}/index.html`:'index.html';
const href=dir=>`/${dir?`${dir}/`:''}`;
const canonical=dir=>origin+href(dir);
const dictionaries=Object.fromEntries(['it','de','es','pt'].map(lang=>[lang,JSON.parse(read(`src/site/unified/${lang}.json`))]));
const normal=text=>text.replaceAll(version,'__GAME_VERSION__').replaceAll('5.2.2','__GAME_VERSION__');
const get=(text,lang,required=true)=>{
 const key=text.trim(),value=dictionaries[lang]?.[normal(key)]??dictionaries[lang]?.[key];
 if(value!==undefined)return text.replace(key,value.replaceAll('__GAME_VERSION__',version).replaceAll('5.2.2',version));
 if(required&&/[A-Za-z]/.test(key)&&!/^https?:|^NO AI ACT$|^Matteo Angeloni$/.test(key))throw new Error(`Missing editorial translation [${lang}]: ${key}`);
 return text;
};
function ancestor(node,check){for(let parent=node.parentNode;parent;parent=parent.parentNode)if(check(parent))return true;return false;}
function invariant(node){
 if(ancestor(node,n=>['script','style','noscript'].includes(n.tagName)))return true;
 if(ancestor(node,n=>['code','pre'].includes(n.tagName))&&!node.value?.startsWith('NO AI ACT is a free, open-source serious game'))return true;
 if(ancestor(node,n=>n.tagName==='a'&&attr(n,'rel')?.includes('external'))&&ancestor(node,n=>n.tagName==='h3'||attr(n,'id')==='press-references'))return true;
 if(ancestor(node,n=>attr(n,'class')==='press-outlet'))return true;
 if(ancestor(node,n=>attr(n,'class')==='locale-links'))return true;
 if(ancestor(node,n=>n.tagName==='a'&&attr(n,'hreflang')&&attr(n,'href')?.includes('/play/')))return true;
 return false;
}
function ownLink(value,base,lang,absolute=false,multi=false){
 let url;try{url=new URL(value,base);}catch{return value;}
 if(url.origin===origin){
  const route=url.pathname.replace(/^\//,'').replace(/\/(?:index\.html)?$/,'');
  const group=groups.find(g=>Object.values(g).includes(route));
  if(group)url.pathname=href(group[lang]);
  if(url.pathname==='/play/'&&!multi)url.searchParams.set('lang',lang);
  if(url.pathname==='/game-statistics.html'&&!multi)url.hash=lang;
  return absolute?url.href:url.pathname+url.search+url.hash;
 }
 if(url.hostname==='github.com'&&url.pathname.includes('/-NO-AI-ACT/')){
  url.pathname=url.pathname.replace(/\/docs\/v5\/(?:en\/|fr\/|de\/|es\/|pt\/)?([A-Z_]+\.md)/,`/docs/v5/${lang==='it'?'':lang+'/'}$1`);
  url.pathname=url.pathname.replace(/\/README(?:\.(?:en|fr|de|es|pt))?\.md$/,`/README${lang==='it'?'':'.'+lang}.md`);
  return url.href;
 }
 if(url.hostname==='eur-lex.europa.eu'){
  const code={it:'ita',en:'eng',fr:'fra',de:'deu',es:'spa',pt:'por'}[lang];
  url.pathname=url.pathname.replace(/\/legal-content\/(EN|IT|FR|DE|ES|PT)\//,`/legal-content/${lang.toUpperCase()}/`).replace(/\/oj(?:\/(?:eng|ita|fra|deu|spa|por))?$/,`/oj/${code}`).replace(/\/2026-07-27\/(?:eng|ita|fra|deu|spa|por)(?=\/|$)/,`/2026-07-27/${code}`);
  return url.href;
 }
 return value;
}
function translate(source,base,lang,{italianShell=false}={}){
 const all=flatten(parse(source,{sourceCodeLocationInfo:true})),edits=[];
 const add=(start,end,text)=>edits.push({start,end,text});
 for(const node of all){
  const location=node.sourceCodeLocation;if(!location)continue;
  const shell=ancestor(node,n=>n.tagName==='header')||node.tagName==='header'||italianShell&&(ancestor(node,n=>n.tagName==='footer')||node.tagName==='footer');
  if(node.nodeName==='#text'&&!invariant(node)&&!shell)add(location.startOffset,location.endOffset,escape(get(node.value,lang)));
  if(node.tagName==='script'&&attr(node,'type')==='application/ld+json'){
   const data=JSON.parse(node.childNodes.map(n=>n.value??'').join(''));
   const update=value=>{if(!value||typeof value!=='object')return;for(const[key,child]of Object.entries(value)){
    if(typeof child==='string'){
     if(['name','description','headline','text','caption'].includes(key))value[key]=get(child,lang,false);
     if(child.startsWith(origin+'/'))value[key]=ownLink(child,base,lang,true);
     if(key==='inLanguage'&&!['SoftwareApplication','VideoGame','WebSite'].includes(value['@type']))value[key]=languageCode(lang);
    }else if(child&&typeof child==='object')update(child);
   }};update(data);add(location.startTag.endOffset,location.endTag.startOffset,'\n'+JSON.stringify(data,null,2)+'\n');
  }
  for(const attribute of node.attrs??[]){
   let next=attribute.value;
   if(['href','src','action','poster'].includes(attribute.name)&&!next.startsWith('#'))next=ownLink(next,base,lang,node.tagName==='link',Boolean(attr(node,'hreflang')&&next.includes('/play/')));
   if(['alt','title','aria-label','placeholder'].includes(attribute.name)&&!shell)next=get(next,lang);
   if(node.tagName==='meta'&&attribute.name==='content'){
    const name=attr(node,'name')??attr(node,'property');
    if(['description','og:title','og:description','og:image:alt','twitter:title','twitter:description','twitter:image:alt'].includes(name))next=get(next,lang);
    if(['og:url','og:image','og:image:secure_url','twitter:image'].includes(name))next=ownLink(next,base,lang,true);
    if(name==='og:locale')next=locale[lang];
   }
   if(node.tagName==='html'&&attribute.name==='lang')next=languageCode(lang);
   if(attribute.name==='hreflang'&&next==='en'&&!attr(node,'rel')?.includes('external'))next=languageCode(lang);
   if(next!==attribute.value){const range=location.attrs?.[attribute.name];if(range)add(range.startOffset,range.endOffset,`${attribute.name}="${escape(next)}"`);}
  }
 }
 let html=source;for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);return html;
}

// Fill the four Italian equivalents without replacing the existing 33 articles.
const italianTemplate=read('ai-act-per-docenti/index.html');
for(const group of groups.filter(g=>!existsSync(file(g.it)))){
 let source=read(file(group.en));
 for(const tag of ['header','footer'])source=source.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`),italianTemplate.match(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`))[0].replace(/(?:href|src)="(\.\.[^"]+)"/g,(match,value)=>match.replace(value,ownLink(value,canonical('ai-act-per-docenti'),'it'))));
 write(file(group.it),translate(source,canonical(group.en),'it',{italianShell:true}));
}
for(const group of groups)for(const lang of ['de','es','pt'])write(file(group[lang]),translate(read(file(group.en)).replace(/<section id="localized-materials"[\s\S]*?<\/section>/g,'').replace(/<p class="shared-play-languages"[\s\S]*?<\/p>/g,''),canonical(group.en),lang));

const navGroups=[
 ['en','en/how-it-works','en/for-educators','en/ai-act-serious-game','en/press-kit','en/how-to-cite','en/matteo-angeloni'],
 ['en/education','en/ai-literacy','en/digital-citizenship-ai-regulation','en/serious-games-for-ai-regulation','en/research-and-methodology','en/privacy-conscious-learning','en/faq'],
 ['en/ai-act-for-teachers','en/classroom-activities','en/lesson-plan-introduction-to-the-ai-act','en/lesson-plan-risk-based-approach','en/lesson-plan-transparency-and-users','en/ai-act-classroom-lab'],
 ['en/eu-ai-act-guide','en/ai-act-risk-categories','en/prohibited-ai-practices','en/high-risk-ai-systems','en/transparency-obligations','en/general-purpose-ai','en/ai-act-penalties','en/ai-act-and-gdpr','en/glossary'],
 ['en/ai-act-for-business','en/ai-act-public-administration','en/provider-deployer-ai-act','en/ai-in-recruitment-and-employment','en/fria-ai-act-fundamental-rights-impact-assessment','en/deepfakes-and-transparency','en/ai-act-application-timeline']
];
const titles={};for(const group of groups)for(const lang of SITE_LANGUAGES){const doc=flatten(parse(read(file(group[lang])))),h1=doc.find(n=>n.tagName==='h1');titles[group[lang]]=flatten(h1).filter(n=>n.nodeName==='#text').map(n=>n.value).join('').trim();}
for(const group of groups)for(const lang of SITE_LANGUAGES){
 let html=read(file(group[lang]));const ui=labels[lang],current=group[lang];
 const header=`<header class="topbar"><div class="wrap"><a class="brand" href="${href(groups[0][lang])}">NO AI ACT</a><nav class="site-nav" aria-label="${ui[1]}"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="${ui[1]}">${ui[1]}</button><ul class="nav-menu" id="site-menu">${navGroups.map((routes,index)=>`<li class="has-sub"><button class="nav-sub-btn" type="button" aria-expanded="false" aria-controls="topics-${index}">${ui[index+2]}</button><ul class="nav-sub" id="topics-${index}">${routes.map(en=>{const destination=groups.find(g=>g.en===en)[lang];return`<li><a href="${href(destination)}"${destination===current?' aria-current="page"':''}>${escape(titles[destination])}</a></li>`;}).join('')}</ul></li>`).join('')}<li><a href="${href(groups.find(g=>g.en==='en/privacy-by-design')[lang])}">${ui[7]}</a></li></ul></nav></div></header>`;
 html=html.replace(/<header\b[\s\S]*?<\/header>/,header);
 const switcher=`<nav class="locale-links" aria-label="${ui[0]}"><div class="wrap">${SITE_LANGUAGES.map(code=>`<a href="${href(group[code])}" hreflang="${languageCode(code)}" lang="${languageCode(code)}"${code===lang?' aria-current="page"':''}><img src="/assets/flags/${code==='en'?'gb':code}.png" width="28" height="20" alt="" /><span>${names[code]}</span></a>`).join('')}</div></nav>`;
 html=html.replace(/<nav class="locale-links"[\s\S]*?<\/nav>/g,'').replace('</header>','</header>\n'+switcher);
 html=html.replace(/\s*<link\b(?=[^>]*\brel="alternate")(?=[^>]*\bhreflang=)[^>]+>/g,'');
 const alternates=SITE_LANGUAGES.map(code=>`  <link rel="alternate" hreflang="${languageCode(code)}" href="${canonical(group[code])}" />`).join('\n')+`\n  <link rel="alternate" hreflang="x-default" href="${canonical(group.it)}" />\n`;
 html=html.replace('</head>',alternates+'</head>');
 html=html.replace(/\s*<meta property="og:locale:alternate"[^>]*>/g,'').replace('</head>',SITE_LANGUAGES.filter(code=>code!==lang).map(code=>`  <meta property="og:locale:alternate" content="${locale[code]}" />`).join('\n')+'\n</head>');
 if(group.en==='en')html=html.replace(/<section\b[^>]*aria-labelledby="press-title"[\s\S]*?<\/section>/,renderPressCoverage(lang,'04'));
 if(group.en==='en/press-kit')html=html.replace(/<ul class="plain" id="press-references">[\s\S]*?<\/ul>/,renderPressReferences(lang));
 html=html.replace(/<p class="shared-play-languages"[\s\S]*?<\/p>/g,'').replace('</footer>',`<p class="shared-play-languages">${ui[2]}: ${SITE_LANGUAGES.map(code=>`<a href="/play/?lang=${code}" hreflang="${languageCode(code)}" lang="${languageCode(code)}">${names[code]}</a>`).join(' · ')}</p></footer>`);
 write(file(current),html.replace(/(?:[\t ]*\r?\n){3,}/g,'\n\n'));
}
const social=JSON.parse(read('scripts/social/meta.config.json'));
for(const group of groups)for(const lang of SITE_LANGUAGES)social.pageCategory[group[lang]]=social.pageCategory[group.en];
write('scripts/social/meta.config.json',JSON.stringify(social,null,2)+'\n');
write('scripts/seo/routes.config.json',JSON.stringify(config,null,2)+'\n');
for(const lang of SITE_LANGUAGES)write(`public/sitemap-${lang}.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${groups.map(g=>`  <url><loc>${canonical(g[lang])}</loc><lastmod>2026-11-23</lastmod></url>`).join('\n')}\n</urlset>\n`);
const release=JSON.parse(read('release.config.json'));release.publicUrls={...Object.fromEntries(SITE_LANGUAGES.map(lang=>[lang,groups.length])),total:groups.length*SITE_LANGUAGES.length};write('release.config.json',JSON.stringify(release,null,2)+'\n');
console.log(`Generated shared content: ${groups.length} full sections in each of ${SITE_LANGUAGES.length} languages; ${release.publicUrls.total} public URLs.`);

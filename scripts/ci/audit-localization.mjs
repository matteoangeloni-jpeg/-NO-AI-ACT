import assert from 'node:assert/strict';
import {readFileSync,existsSync,writeFileSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {parse} from 'parse5';
import {publicRoutes,PLAYABLE_LANGUAGES,LEARNING_RESOURCES_LANGUAGES,languageCode} from '../../src/site/route-inventory.mjs';
import {LOCALES} from '../../src/game/i18n/index.ts';
import {GUIDED_COPY} from '../../src/game/i18n/guidedInquiry.ts';
import {INQUIRY_CASES} from '../../src/game/i18n/inquiryCases.ts';
import {JOURNAL_COPY} from '../../src/game/i18n/journal.ts';
import {PLAYABLE_CASES} from '../../src/game/data/cases.ts';
import {TEACHER_RESOURCES} from '../../src/game/data/concepts.ts';
const read=p=>readFileSync(p,'utf8'),cfg=JSON.parse(read('release.config.json')),routes=publicRoutes(JSON.parse(read('scripts/seo/routes.config.json'))),origin=cfg.domain;
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
function nodes(root,out=[]){out.push(root);for(const child of root.childNodes??[])nodes(child,out);return out;}
const counts={},errors=[],handoffs=[];
for(const route of routes){
 const file=route.dir?`${route.dir}/index.html`:'index.html',canonical=origin+'/'+(route.dir?route.dir+'/':''),all=nodes(parse(read(file))),expected=languageCode(route.lang);
 const check=(valid,message)=>{if(!valid)errors.push(`${file}: ${message}`);};
 check(attr(all.find(node=>node.tagName==='html'),'lang')===expected,'html lang');
 check(attr(all.find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href')===canonical,'canonical');
 for(const [lang,dir]of Object.entries(route.group)){
  if(!cfg.siteLanguages.includes(lang)||typeof dir!=='string')continue;
  check(all.some(node=>node.tagName==='link'&&attr(node,'rel')==='alternate'&&attr(node,'hreflang')===languageCode(lang)&&attr(node,'href')===origin+'/'+(dir?dir+'/':'')),`hreflang ${lang}`);
 }
 const metadata={};for(const node of all.filter(node=>node.tagName==='meta'))metadata[attr(node,'property')??attr(node,'name')]=attr(node,'content');
 check(Boolean(metadata.description?.trim()),'missing description');check(Boolean(metadata['og:title']?.trim()),'missing Open Graph title');check(Boolean(metadata['og:description']?.trim()),'missing Open Graph description');
 let languageMetadata=0;
 function structured(value){if(!value||typeof value!=='object')return;
  if(value.inLanguage){languageMetadata++;const tags=Array.isArray(value.inLanguage)?value.inLanguage:[value.inLanguage];check(tags.some(tag=>String(tag).toLowerCase().split('-')[0]===route.lang),'JSON-LD inLanguage');}
  for(const child of Object.values(value))if(child&&typeof child==='object')structured(child);
 }
 for(const node of all.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json')){try{structured(JSON.parse((node.childNodes??[]).map(n=>n.value??'').join('')));}catch{check(false,'invalid JSON-LD');}}
 check(languageMetadata>0,'missing JSON-LD language');
 for(const anchor of all.filter(node=>node.tagName==='a'&&attr(node,'href'))){
  const value=attr(anchor,'href');let url;try{url=new URL(value,canonical);}catch{check(false,'invalid link '+value);continue;}
  if(url.origin!==origin)continue;
  const path=decodeURIComponent(url.pathname).replace(/^\//,'');
  if(path==='play/'||path==='play/index.html'){
   const language=url.searchParams.get('lang');check(PLAYABLE_LANGUAGES.includes(language),'invalid/missing playable language '+value);handoffs.push({page:file,language});
  }
  const options=[path,path.replace(/\/$/,'')+'/index.html'].flatMap(p=>[resolve(p||'index.html'),resolve('public',p||'index.html')]);
  check(options.some(p=>existsSync(p)&&statSync(p).isFile()),`nonexistent internal link ${value}`);
 }
 counts[route.lang]=(counts[route.lang]??0)+1;
}
assert.deepEqual(Object.keys(LOCALES),PLAYABLE_LANGUAGES,'runtime dictionaries disagree with the release');
assert.equal(Object.hasOwn(cfg,'languages'),false,'ambiguous legacy language field');
for(const language of PLAYABLE_LANGUAGES){
 assert.equal(cfg.caseLocalizationStatus[language],'complete');
 assert.deepEqual(Object.keys(LOCALES[language].cases).sort(),PLAYABLE_CASES.map(item=>item.id).sort());
 assert.equal(Object.keys(INQUIRY_CASES[language]).length,PLAYABLE_CASES.length);
 assert.deepEqual(Object.keys(GUIDED_COPY[language]),Object.keys(GUIDED_COPY.it));
 assert.deepEqual(Object.keys(JOURNAL_COPY[language]),Object.keys(JOURNAL_COPY.it));
 assert(handoffs.some(item=>item.language===language),language+': no portal handoff');
}
for(const language of LEARNING_RESOURCES_LANGUAGES)for(const kind of ['activities','lesson']){
 const resource=TEACHER_RESOURCES.find(item=>item.id===`${kind}_${language}`);assert(resource);assert(existsSync(resolve(resource.url.slice(1),'index.html')));
}
const result={sourceVersion:JSON.parse(read('package.json')).version,publicPages:routes.length,counts,playableLanguages:PLAYABLE_LANGUAGES,casesPerLanguage:PLAYABLE_CASES.length,learningResourcesLanguages:LEARNING_RESOURCES_LANGUAGES,scientificDocumentation:JSON.parse(read('docs/v5/languages.json')),handoffs:handoffs.length,errors};
if(process.env.LOCALIZATION_AUDIT_OUTPUT)writeFileSync(process.env.LOCALIZATION_AUDIT_OUTPUT,JSON.stringify(result,null,2)+'\n');
assert.deepEqual(errors,[],'Localization route audit failed');console.log(JSON.stringify(result,null,2));

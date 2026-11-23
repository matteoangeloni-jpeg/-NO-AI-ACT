import {readFileSync,writeFileSync} from 'node:fs';
import {parse} from 'parse5';
import {publicRoutes,languageCode,PLAYABLE_LANGUAGES,SITE_LANGUAGES} from '../../src/site/route-inventory.mjs';
const cfg=JSON.parse(readFileSync('scripts/seo/routes.config.json','utf8'));
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const organizationDescriptions={
 it:"Gioco investigativo educativo gratuito e risorse didattiche sul regolamento europeo sull’intelligenza artificiale.",
 en:'Free educational investigative game and learning resources about the European AI Act.',
 fr:'Jeu éducatif d’enquête gratuit et ressources pédagogiques sur le règlement européen sur l’intelligence artificielle.',
 de:'Kostenloses investigatives Lernspiel und Lernmaterialien zur europäischen KI-Verordnung.',
 es:'Juego educativo de investigación gratuito y recursos didácticos sobre el Reglamento europeo de Inteligencia Artificial.',
 pt:'Jogo educativo de investigação gratuito e recursos pedagógicos sobre o Regulamento europeu da Inteligência Artificial.'
};
function nodes(root,out=[]){out.push(root);for(const child of root.childNodes??[])nodes(child,out);return out;}
let changed=0;
for(const route of publicRoutes(cfg)){
 const file=route.dir?`${route.dir}/index.html`:'index.html',html=readFileSync(file,'utf8').replace(/^\uFEFF/,''),all=nodes(parse(html,{sourceCodeLocationInfo:true})),edits=[];
 const locale=languageCode(route.lang);let languageMetadata=false;
 function update(value){if(!value||typeof value!=='object')return;
  const types=Array.isArray(value['@type'])?value['@type']:[value['@type']];
  if(types.includes('Organization')&&value.name==='NO AI ACT')value.description=organizationDescriptions[route.lang];
  if(types.some(type=>['WebPage','FAQPage','Article','LearningResource','HowTo'].includes(type))){value.inLanguage=locale;languageMetadata=true;}
  if(types.includes('WebSite')){value.inLanguage=SITE_LANGUAGES.map(languageCode);languageMetadata=true;}
  if(types.some(type=>['SoftwareApplication','VideoGame'].includes(type))&&value.name?.includes('NO AI ACT')){value.inLanguage=PLAYABLE_LANGUAGES.map(languageCode);languageMetadata=true;}
  for(const child of Object.values(value))if(child&&typeof child==='object')update(child);
 }
 for(const node of all.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json')){
  const original=(node.childNodes??[]).map(n=>n.value??'').join(''),data=JSON.parse(original),before=JSON.stringify(data);update(data);
  if(before!==JSON.stringify(data)){const loc=node.sourceCodeLocation;edits.push({start:loc.startTag.endOffset,end:loc.endTag.startOffset,text:'\n'+JSON.stringify(data,null,2)+'\n'});}
 }
 if(!languageMetadata){
  const head=all.find(node=>node.tagName==='head'),canonical=attr(all.find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href'),title=all.find(node=>node.tagName==='title');
  if(!head?.sourceCodeLocation?.endTag||!canonical||!title)throw new Error('Incomplete document shell: '+file);
  const data={'@context':'https://schema.org','@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:(title.childNodes??[]).map(node=>node.value??'').join(''),description:attr(all.find(node=>node.tagName==='meta'&&attr(node,'name')==='description'),'content'),inLanguage:locale};
  const start=head.sourceCodeLocation.endTag.startOffset;edits.push({start,end:start,text:`  <script type="application/ld+json">\n${JSON.stringify(data,null,2)}\n  </script>\n`});
 }
 let next=html;for(const edit of edits.sort((a,b)=>b.start-a.start))next=next.slice(0,edit.start)+edit.text+next.slice(edit.end);
 const headEnd=next.indexOf('</head>');
 next=next.slice(0,headEnd).replace(/(?:[\t ]*\r?\n){3,}/g,'\n\n')+next.slice(headEnd);
 if(next!==html){writeFileSync(file,next);changed++;}
}
console.log(`Localized structured metadata: ${changed} documents updated; source bodies and canonicals preserved.`);

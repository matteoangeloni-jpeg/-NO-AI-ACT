import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parse} from 'parse5';
import {routeGroups} from '../../src/site/route-inventory.mjs';
import {FORMS,COPY} from '../../research/study02/materials.mjs';
const out='../../outputs/V5_uniformazione';mkdirSync(out,{recursive:true});
const groups=routeGroups(JSON.parse(readFileSync('scripts/seo/routes.config.json','utf8'))),units=new Set();
const ignored=new Set(['script','style','code','pre','noscript']);
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
function ancestor(node,check){for(let parent=node.parentNode;parent;parent=parent.parentNode)if(check(parent))return true;return false;}
export function invariantText(node){
 if(ancestor(node,n=>ignored.has(n.tagName))&&!node.value?.startsWith('NO AI ACT is a free, open-source serious game'))return true;
 if(ancestor(node,n=>n.tagName==='a'&&attr(n,'rel')?.includes('external'))&&ancestor(node,n=>n.tagName==='h3'||attr(n,'id')==='press-references'))return true;
 if(ancestor(node,n=>attr(n,'class')==='locale-links'||n.tagName==='a'&&attr(n,'hreflang')&&attr(n,'href')?.includes('/play/')))return true;
 return false;
}
const add=text=>{if(text?.trim()&&/[A-Za-z]/.test(text)&&!/^https?:|^NO AI ACT$|^Matteo Angeloni$/.test(text.trim()))units.add(text.trim());};
function visit(node){
 if(node.nodeName==='#text'&&!invariantText(node))add(node.value);
 if(node.tagName==='script'&&attr(node,'type')==='application/ld+json'){
  const collect=value=>{if(!value||typeof value!=='object')return;for(const[key,child]of Object.entries(value)){
   if(typeof child==='string'&&['name','description','headline','text','caption'].includes(key))add(child);
   else if(child&&typeof child==='object')collect(child);
  }};collect(JSON.parse(node.childNodes.map(n=>n.value??'').join('')));
 }
 for(const attribute of node.attrs??[]){
  if(['alt','title','aria-label','placeholder'].includes(attribute.name))add(attribute.value);
  if(node.tagName==='meta'&&attribute.name==='content'&&['description','og:title','og:description','og:image:alt','twitter:title','twitter:description','twitter:image:alt'].includes(attr(node,'name')??attr(node,'property')))add(attribute.value);
 }
 for(const child of node.childNodes??[])visit(child);
}
for(const group of groups)visit(parse(readFileSync(`${group.en}/index.html`,'utf8')));
const docs=['METHODOLOGY','LEGAL_LEARNING_MATRIX','COVERAGE_COMPLETION','ARGUMENTATION_STUDY02','METHODOLOGY_TEST_PLAN','METHODOLOGY_IMPLEMENTATION','TEST_RESULTS','SESSION_JOURNAL'];
const documentUnits={};
for(const name of docs){
 const file=`docs/v5/en/${name}.md`;
 const source=readFileSync(file,'utf8');documentUnits[name]=[];let fenced=false;
 for(const line of source.split(/\r?\n/)){
  if(line.startsWith('```')){fenced=!fenced;continue;}if(fenced||/^\[Italiano\]|^\d+\. .*(?:https?:\/\/|DOI)/.test(line)||/^\|[- :|]+\|$/.test(line))continue;
  const cells=line.startsWith('|')?line.split('|').slice(1,-1):[line];
  for(const cell of cells){add(cell);if(cell.trim())documentUnits[name].push(cell.trim());}
 }
}
function leaves(value){if(typeof value==='string')add(value);else if(value&&typeof value==='object')for(const child of Object.values(value))leaves(child);}
leaves(COPY.en);leaves(FORMS.A.en);leaves(FORMS.B.en);
writeFileSync(out+'/translation-units.json',JSON.stringify([...units],null,2)+'\n');
writeFileSync(out+'/document-units.json',JSON.stringify(documentUnits,null,2)+'\n');
console.log(`Prepared ${groups.length} shared site topics, ${docs.length} document families, Study 02; ${units.size} distinct text units.`);

import {readFileSync,writeFileSync} from 'node:fs';
import {FRENCH_REVISIONS} from '../../src/site/unified/french-revisions.mjs';
const path='../../outputs/V5_uniformazione/',units=JSON.parse(readFileSync(path+'fr-translation-units.json','utf8')),draft=JSON.parse(readFileSync(path+'fr-draft.json','utf8')),result={};
const normal=text=>text.replaceAll('5.3.0','__GAME_VERSION__').replaceAll('5.2.2','__GAME_VERSION__');
for(const source of units){
 let text=draft[source];if(text===undefined)throw new Error('Incomplete French paragraph: '+source);
 text=text.replaceAll('▁',' ').replace(/[ \t]{2,}/g,' ').trim().replaceAll('alphabétisation de l\'IA','maîtrise de l’IA').replaceAll('alphabétisation en IA','maîtrise de l’IA').replaceAll('faux profonds','hypertrucages');
 if(/\bdeployers?\b/i.test(source))text=text.replaceAll('déployeurs','déployeurs').replaceAll('exploitants','déployeurs').replaceAll('exploitant','déployeur').replaceAll('déploiements','déployeurs');
 result[normal(source)]=normal(text);
}
for(const[source,target]of Object.entries(FRENCH_REVISIONS))result[normal(source)]=normal(target);
writeFileSync('src/site/unified/fr.json',JSON.stringify(result,null,2)+'\n');
console.log(`Prepared ${Object.keys(result).length} full-text French editorial units.`);

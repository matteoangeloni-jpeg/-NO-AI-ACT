import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {FORMS,COPY} from '../../research/study02/materials.mjs';
import {BIBLIOGRAPHY_NOTES} from '../../src/site/unified/bibliography-notes.mjs';
const read=file=>readFileSync(file,'utf8'),write=(file,text)=>writeFileSync(file,text);
const names={it:'Italiano',en:'English',fr:'Français',de:'Deutsch',es:'Español',pt:'Português'};
const files=['METHODOLOGY','LEGAL_LEARNING_MATRIX','COVERAGE_COMPLETION','ARGUMENTATION_STUDY02','METHODOLOGY_TEST_PLAN','METHODOLOGY_IMPLEMENTATION','TEST_RESULTS','SESSION_JOURNAL'];
const notices={
 it:'Edizione linguistica V5.3.0 · 23 novembre 2026. Il dossier e i materiali locali di Study 02 sono ora disponibili in sei lingue. Date, conteggi e risultati del prototipo descrivono le esecuzioni storiche. Il contratto attuale del registro facoltativo per maggiorenni è in SESSION_JOURNAL.md e supera il precedente vincolo dei soli aggregati. Le traduzioni non dimostrano equivalenza degli strumenti, efficacia educativa o validità della rubrica. Non sono stati eseguiti nuovi test per questo aggiornamento dei contenuti.',
 en:'V5.3.0 language edition · 23 November 2026. The dossier and local Study 02 materials now have six language versions. Prototype dates, counts and outcomes describe historical executions. The current optional adult journal contract is in SESSION_JOURNAL.md and supersedes the earlier aggregates-only restriction. Translations do not establish instrument equivalence, educational effectiveness or rubric validity. No new tests were run for this content update.',
 fr:'Édition linguistique V5.3.0 · 23 novembre 2026. Le dossier et les matériaux locaux de Study 02 sont désormais disponibles dans les six langues. Les dates, nombres et résultats du prototype décrivent les exécutions historiques. Le contrat actuel du registre facultatif réservé aux adultes figure dans SESSION_JOURNAL.md et remplace la restriction antérieure aux seuls agrégats. Les traductions ne démontrent ni équivalence des instruments, ni efficacité éducative, ni validité de la grille. Aucun nouveau test pour cette mise à jour des contenus.',
 de:'Sprachausgabe V5.3.0 · 23. November 2026. Das Dossier und die lokalen Materialien für Study 02 liegen jetzt in sechs Sprachen vor. Daten, Zahlen und Ergebnisse des Prototyps dokumentieren frühere Ausführungen. Der aktuelle Vertrag für das freiwillige Sitzungsprotokoll für Erwachsene steht in SESSION_JOURNAL.md und ersetzt die frühere Beschränkung auf aggregierte Daten. Übersetzungen belegen weder die Gleichwertigkeit der Instrumente noch Bildungswirksamkeit oder Rubrikvalidität. Für diese Inhaltsaktualisierung wurden keine neuen Tests ausgeführt.',
 es:'Edición lingüística V5.3.0 · 23 de noviembre de 2026. El dossier y los materiales locales de Study 02 están disponibles en seis idiomas. Las fechas, cifras y resultados del prototipo corresponden a ejecuciones históricas. El contrato actual del registro voluntario para adultos figura en SESSION_JOURNAL.md y sustituye la restricción anterior a datos agregados. Las traducciones no demuestran equivalencia de los instrumentos, eficacia educativa ni validez de la rúbrica. No se ejecutaron nuevas pruebas para esta actualización de contenidos.',
 pt:'Edição linguística V5.3.0 · 23 de novembro de 2026. O dossier e os materiais locais de Study 02 estão disponíveis em seis línguas. As datas, contagens e resultados do protótipo descrevem execuções históricas. O contrato atual do registo facultativo para adultos está em SESSION_JOURNAL.md e substitui a anterior restrição aos agregados. As traduções não demonstram equivalência dos instrumentos, eficácia educativa ou validade da rubrica. Não foram executados novos testes nesta atualização de conteúdos.'
};
function selector(lang,name){return Object.entries(names).map(([code,label])=>`[${label}](${lang==='it'?'':'../'}${code==='it'?'':code+'/'}${name}.md)`).join(' · ');}
for(const lang of ['de','es','pt']){
 const dictionary=JSON.parse(read(`src/site/unified/${lang}.json`));mkdirSync(`docs/v5/${lang}`,{recursive:true});
 for(const name of files){
  const source=read(`docs/v5/en/${name}.md`);let fenced=false;
  const lines=source.split(/\r?\n/).filter(line=>!/^\[Italiano\]|^> V5\.3\.0 language edition/.test(line)).map(line=>{
   if(line.startsWith('```')){fenced=!fenced;return line;}if(fenced||/^\|[- :|]+\|$/.test(line)||!line.trim())return line;
   if(name==='METHODOLOGY'&&/^\d+\. .*(?:https?:\/\/|DOI)/.test(line)){
    const index=Number(line.match(/^\d+/)[0])-1;
    const starts=['OpenEdition returned','Metadata and abstract checked','Open text checked','[Official record]','Articles 4 and 4a','[Committee of Ministers text]','Metadata verified','Metadata and abstract checked','Metadata and abstract checked'];
    const citation=line.slice(0,line.indexOf(starts[index])).trim();
    const links=[...line.slice(citation.length).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match,i)=>`[${i+1}](${match[1]})`).join(' · ');
    return citation+' '+BIBLIOGRAPHY_NOTES[lang][index]+(links?' '+links:'');
   }
   if(/^\d+\. .*(?:https?:\/\/|DOI)/.test(line))return line;
   const translate=cell=>{if(!/[A-Za-z]/.test(cell))return cell;const value=dictionary[cell.trim()];if(value===undefined)throw new Error(`Missing ${lang} document text: ${cell}`);return cell.replace(cell.trim(),value);};
   return line.startsWith('|')?line.split('|').map((cell,index,array)=>index===0||index===array.length-1?cell:translate(cell)).join('|'):translate(line);
  });
  lines.splice(1,0,'',selector(lang,name),'',`> ${notices[lang]}`,'');write(`docs/v5/${lang}/${name}.md`,lines.join('\n').replace(/\n{4,}/g,'\n\n\n'));
 }
 const translated=value=>typeof value==='string'?(dictionary[value]??(()=>{throw new Error('Missing local material '+lang+': '+value)})()):Array.isArray(value)?value.map(translated):Object.fromEntries(Object.entries(value).map(([key,child])=>[key,translated(child)]));
 write(`research/study02/materials.${lang}.json`,JSON.stringify({copy:translated(COPY.en),A:translated(FORMS.A.en),B:translated(FORMS.B.en)},null,2)+'\n');
}
// Keep original historical IT/EN/FR prose while making current scope explicit.
for(const lang of ['it','en','fr'])for(const name of files){
 if(lang==='fr'&&name==='SESSION_JOURNAL')continue;
 const path=`docs/v5/${lang==='it'?'':lang+'/'}${name}.md`,lines=read(path).split(/\r?\n/).filter(line=>!/^\[Italiano\]/.test(line));
 if(!lines.some(line=>line.includes(notices[lang])))lines.splice(1,0,'',selector(lang,name),'',`> ${notices[lang]}`,'');write(path,lines.join('\n'));
}
write('docs/v5/languages.json',JSON.stringify({methodologyDossier:Object.keys(names),independentStudy02:Object.keys(names),sessionJournal:Object.keys(names),note:'Six linguistic versions of the same materials. Linguistic availability does not establish scientific equivalence or validate Study 02. Historical dates and outcomes are preserved.'},null,2)+'\n');
console.log('Generated full document translations and six-language local research materials. Historical executions preserved.');

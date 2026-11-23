import {readFileSync,writeFileSync} from 'node:fs';
import {tsImport} from 'tsx/esm/api';
import {DUTCH_NORMS,DUTCH_JOURNAL,DUTCH_CASE_DECISIONS} from '../../src/game/i18n/nl-reviewed.mjs';
import {DUTCH_TEXT,DUTCH_SESSION_SUMMARY} from '../../src/site/unified/nl-reviewed.mjs';
import {DUTCH_GUIDED,DUTCH_INQUIRY} from '../../src/game/i18n/nl-guided-reviewed.mjs';
import {DUTCH_CASE_NARRATIVE} from '../../src/game/i18n/nl-cases-reviewed.mjs';
import {DUTCH_LOCALE} from '../../src/game/i18n/nl-interface-reviewed.mjs';
import {currentAvailability,currentDictionary} from '../../src/site/language-availability.mjs';
// The checked-in editorial dictionary is the reusable translation source.
// No model download, private corpus or machine-specific path is required.
const [{en},{GUIDED_COPY},{INQUIRY_CASES},{JOURNAL_COPY}]=await Promise.all([
 tsImport('../../src/game/i18n/en.ts',import.meta.url),tsImport('../../src/game/i18n/guidedInquiry.ts',import.meta.url),
 tsImport('../../src/game/i18n/inquiryCases.ts',import.meta.url),tsImport('../../src/game/i18n/journal.ts',import.meta.url)
]);
const source={locale:en,guided:GUIDED_COPY.en,inquiry:INQUIRY_CASES.en,sessionJournal:JOURNAL_COPY.en};
const draft=currentDictionary(JSON.parse(readFileSync('src/site/unified/nl.json','utf8')),'nl');
const dictionary={},normal=value=>value.replaceAll('5.3.1','__GAME_VERSION__').replaceAll('5.4.0','__GAME_VERSION__');
for(const[english,raw]of Object.entries(draft)){
 let value=raw.replaceAll('▁',' ').replace(/[ \t]{2,}/g,' ').trim();
 value=value.replace(/tentoonstellingen/g,'bewijsstukken').replace(/Tentoonstellingen/g,'Bewijsstukken').replace(/tentoonstelling/g,'bewijsstuk').replace(/Tentoonstelling/g,'Bewijsstuk').replace(/AI-wet/g,'AI-verordening').replace(/AI Act/g,'AI-verordening');
 if(/\bdeployers?\b/i.test(english)){
  value=value.replace(/\b(?:deployers|uitvoerders|exploitanten|inzenders|inposanten)\b/gi,'gebruiksverantwoordelijken').replace(/\b(?:deployer|uitvoerder|exploitant|inzender|inposant|instructeur|uitstuurder)\b/gi,'gebruiksverantwoordelijke');
  if(!/\bemployers?\b/i.test(english))value=value.replace(/\b(?:werkgevers|employers|implementaties)\b/gi,'gebruiksverantwoordelijken').replace(/\b(?:werkgever|employer)\b/gi,'gebruiksverantwoordelijke');
 }
 if(/\bproviders?\b/i.test(english))value=value.replace(/\b(?:leveranciers|providers|dienstverrichters)\b/gi,'aanbieders').replace(/\b(?:leverancier|provider|dienstverrichter)\b/gi,'aanbieder');
 if(english.includes('Council of Europe'))value=value.replaceAll('Europese Raad','Raad van Europa');
 const heading=english.match(/^(#{1,6}) /);if(heading)value=heading[1]+' '+value.replace(/^#{1,6}\s*/,'');
 const caseId=english.match(/^(case_\w+)\s*[—–-]/);if(caseId)value=value.replace(/^[^—–-]+[—–-]\s*/,caseId[1]+' — ');
 dictionary[normal(english)]=normal(value);
}
function remember(from,to){if(typeof from==='string'&&typeof to==='string')dictionary[normal(from)]=normal(to);else if(from&&to&&typeof from==='object')for(const key of Object.keys(to))remember(from[key],to[key]);}
remember(source.locale.norms,DUTCH_NORMS);remember(source.sessionJournal,DUTCH_JOURNAL);remember(source.locale.cases,DUTCH_CASE_DECISIONS);
remember(source.guided,DUTCH_GUIDED);remember(source.inquiry,DUTCH_INQUIRY);
remember(source.locale.cases,DUTCH_CASE_NARRATIVE);
remember(source.locale,DUTCH_LOCALE);
for(const[from,to]of Object.entries(DUTCH_TEXT))dictionary[normal(from)]=normal(to);
const placeholders=text=>(text.match(/\{\w+\}/g)??[]).sort().join('|');
const translate=(value,path='')=>{
 if(typeof value==='string'){
  if(!/[A-Za-z]/.test(value)||/^https?:|^NO AI ACT$|^Matteo Angeloni$/.test(value))return value;
  const target=dictionary[normal(value.trim())];if(target===undefined)throw new Error('Missing Dutch text '+path+': '+value);
  if(placeholders(value)!==placeholders(target))throw new Error('Incomplete Dutch placeholders '+path+': '+value+' -> '+target);
  if(/ZXQ[A-Z]+XQ|991\d{3}|\.{15}/.test(target))throw new Error('Unresolved draft text '+path+': '+value);
  return target.replaceAll('__GAME_VERSION__',JSON.parse(readFileSync('package.json')).version);
 }
 if(Array.isArray(value))return value.map((child,index)=>translate(child,path+'.'+index));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,child])=>[key,translate(child,path+'.'+key)]));
 return value;
};
const game=translate(source);
for(const[id,original]of Object.entries(source.locale.cases))if(original.clueSources)game.locale.cases[id].clueSources=[...original.clueSources];
const promote=value=>typeof value==='string'?currentAvailability(value,'nl'):Array.isArray(value)?value.map(promote):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,child])=>[key,promote(child)])):value;
game.locale.ui=promote(game.locale.ui);
Object.assign(game.locale.norms,DUTCH_NORMS);Object.assign(game.sessionJournal,DUTCH_JOURNAL);
for(const[id,values]of Object.entries(DUTCH_CASE_DECISIONS))Object.assign(game.locale.cases[id],values);
game.locale.ui.titleGroups.settingsPrivacy=DUTCH_SESSION_SUMMARY;
game.locale.ui.finale.privacyNote.text=DUTCH_SESSION_SUMMARY;
Object.assign(game.locale.ui.teacherGuide.links,{activities_nl:'Lesactiviteiten (NL)',lesson_nl:'Inleiding voor docenten (NL)'});
writeFileSync('src/game/i18n/translations/nl.json',JSON.stringify(game,null,2)+'\n');
writeFileSync('src/site/unified/nl.json',JSON.stringify(dictionary,null,2)+'\n');
console.log('Materialized Dutch game dictionary and full editorial dictionary with protected interpolation literals.');

import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {LOCALES,LANGUAGE_CODES} from '../../src/game/i18n/index';
import {GUIDED_COPY} from '../../src/game/i18n/guidedInquiry';
import {INQUIRY_CASES} from '../../src/game/i18n/inquiryCases';
import {JOURNAL_COPY} from '../../src/game/i18n/journal';
const version=JSON.parse(readFileSync('package.json','utf8')).version;
const stage=resolve(`.infrastructure/release-v${version}/pack`);
const put=(file:string,text:string)=>{const target=resolve(stage,file);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,text);};
const copy=(file:string)=>{const target=resolve(stage,file);mkdirSync(dirname(target),{recursive:true});copyFileSync(file,target);};
for(const file of ['LICENSE','LICENSES/GPL-3.0.txt','CREDITS.md','THIRD_PARTY_LICENSES.md','CITATION.cff','release.config.json','docs/GDD.md','docs/archive/README_pre_v5.3.0.it.md'])copy(file);
for(const language of LANGUAGE_CODES){
 const suffix=language==='it'?'':'.'+language,folder=language==='it'?'':language+'/';
 for(const file of [`README${suffix}.md`,`docs/v5/README${suffix}.md`,`docs/RELEASE_NOTES_v${version}${suffix}.md`])copy(file);
 for(const name of ['METHODOLOGY','LEGAL_LEARNING_MATRIX','COVERAGE_COMPLETION','ARGUMENTATION_STUDY02','METHODOLOGY_TEST_PLAN','METHODOLOGY_IMPLEMENTATION','TEST_RESULTS','SESSION_JOURNAL'])copy(`docs/v5/${folder}${name}.md`);
 put(`press/${language}.md`,readFileSync(`public/assets/press/no-ai-act-v${version}-${language}.md`,'utf8'));
 put(`game-texts/${language}.json`,JSON.stringify({version,language,locale:LOCALES[language],guided:GUIDED_COPY[language],inquiry:INQUIRY_CASES[language],sessionJournal:JOURNAL_COPY[language]},null,2)+'\n');
}
// Archive aliases keep the Italian link stable when a language-specific ZIP
// presents its own README as the default file.
for(const language of LANGUAGE_CODES){const name=`README${language==='it'?'':'.'+language}.md`;put(name,readFileSync(name,'utf8').replace('[Italiano](README.md)','[Italiano](README.it.md)'));}
put('README.it.md',readFileSync('README.md','utf8').replace('[Italiano](README.md)','[Italiano](README.it.md)'));
put('CONTENTS.txt',`NO AI ACT v${version}\nSix complete language versions: IT EN FR DE ES PT (pt-PT).\n37 website topics and 14 game cases per language.\nCurrent README, press copy, eight methodology documents, release notes and complete playable text dictionaries.\nHistorical screenshots remain in the separately labelled V5.0.0 archive.\nResearch documents are preliminary; translations are not scientific validation.\nNo participant data, credentials or private correspondence in this archive.\n`);
console.log('Prepared current six-language materials at '+stage);

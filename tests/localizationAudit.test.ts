import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {LANGUAGE_CODES,LOCALES,languageTag} from '../src/game/i18n';
import {GUIDED_COPY} from '../src/game/i18n/guidedInquiry';
import {INQUIRY_CASES} from '../src/game/i18n/inquiryCases';
import {JOURNAL_COPY} from '../src/game/i18n/journal';
import {PLAYABLE_CASES} from '../src/game/data/cases';
import {TEACHER_RESOURCES} from '../src/game/data/concepts';
const cfg=JSON.parse(readFileSync('release.config.json','utf8'));
function leaves(value:unknown,path='',out:Record<string,string>={}):Record<string,string>{
 if(typeof value==='string')out[path]=value;
 else if(value&&typeof value==='object')for(const [key,child]of Object.entries(value))leaves(child,path?`${path}.${key}`:key,out);
 return out;
}
const content=(language:typeof LANGUAGE_CODES[number])=>leaves({locale:LOCALES[language],guided:GUIDED_COPY[language],inquiry:INQUIRY_CASES[language],journal:JOURNAL_COPY[language]});
describe('V5 localization audit regressions',()=>{
 it('declares site, game, case and teaching coverage separately in the existing registry',()=>{
  expect(cfg).not.toHaveProperty('languages');
  expect(cfg.playableLanguages).toEqual(Object.keys(LOCALES));
  expect(Object.keys(cfg.caseLocalizationStatus)).toEqual(cfg.playableLanguages);
  expect(cfg.playableCases).toBe(PLAYABLE_CASES.length);
  for(const language of cfg.learningResourcesLanguages){
   expect(cfg.siteLanguages).toContain(language);
   for(const kind of ['activities','lesson'])expect(TEACHER_RESOURCES.some(resource=>resource.id===`${kind}_${language}`)).toBe(true);
  }
  for(const language of LANGUAGE_CODES){
   expect(cfg.caseLocalizationStatus[language]).toBe('complete');
   expect(Object.keys(LOCALES[language].cases).sort()).toEqual(PLAYABLE_CASES.map(data=>data.id).sort());
  }
 });
 it('uses a European Portuguese document tag without changing query/save codes',()=>{
  expect(languageTag('pt')).toBe('pt-PT');expect(LANGUAGE_CODES).toContain('pt');expect(LANGUAGE_CODES).not.toContain('pt-PT');
  for(const language of LANGUAGE_CODES.filter(l=>l!=='pt'))expect(languageTag(language)).toBe(language);
 });
 for(const language of LANGUAGE_CODES.filter(l=>l!=='it')){
  it(`${language}: has no copied Italian sentences outside explicit proper-name/format exceptions`,()=>{
   const original=content('it'),translated=content(language);
   // Official institutional names and a placeholders-only format are invariant.
   const invariant=new Set(['locale.ui.creditsScene.phdProgramme','locale.ui.creditsScene.universityLink','locale.ui.debrief.recommendedLine']);
   const copied=Object.entries(translated).filter(([path,text])=>text.length>=25&&text===original[path]&&!invariant.has(path)&&!/^https?:/.test(text));
   expect(copied).toEqual([]);
  });
 }
 for(const language of LANGUAGE_CODES.filter(l=>!['it','en'].includes(l))){
  it(`${language}: does not silently fall back to English sentences`,()=>{
   const original=content('en'),translated=content(language);
   const copied=Object.entries(translated).filter(([path,text])=>text.length>=30&&text===original[path]&&!/^https?:/.test(text));
   expect(copied).toEqual([]);
  });
 }
});

import {readFileSync,writeFileSync} from 'node:fs';
import {REVISED} from '../../src/site/unified/reviewed-overrides.mjs';
import {SPANISH_REVISIONS} from '../../src/site/unified/spanish-revisions.mjs';
const root='../../outputs/V5_uniformazione';
const units=JSON.parse(readFileSync(root+'/translation-units.json','utf8'));
const normal=text=>text.replaceAll('5.2.2','__GAME_VERSION__').replaceAll('5.3.0','__GAME_VERSION__');
const terminology={
 de:[[/KI-Akt/g,'KI-Verordnung'],[/\bDeployer\b/g,'Betreiber'],[/\bdeployer\b/g,'Betreiber'],[/Entsorgers/g,'Betreibers'],[/Entsorger/g,'Betreiber'],[/Deployment-Kette/g,'Betreiberkette'],[/\bMediation\b/g,'Lernbegleitung']],
 es:[[/\binterrogatorio\b/gi,'reflexión final'],[/\bdebriefing\b/gi,'reflexión final'],[/\bDestinguir\b/g,'Distinguir'],[/significativamente significativa/g,'efectiva']],
 pt:[[/\binterrogatório\b/gi,'reflexão final'],[/\bdebriefing\b/gi,'reflexão final'],[/\busuários\b/g,'utilizadores'],[/\busuário\b/g,'utilizador'],[/\bUsuário\b/g,'Utilizador'],[/\bcontrole\b/g,'controlo'],[/\bControle\b/g,'Controlo'],[/\bregistros\b/g,'registos'],[/\bregistro\b/g,'registo'],[/\bRegistro\b/g,'Registo'],[/\baprendizado\b/g,'aprendizagem'],[/\bplanejamento\b/g,'planeamento'],[/\btreinamento\b/g,'formação'],[/\bcelular\b/g,'telemóvel'],[/\balfabetização\b/g,'literacia'],[/\bAlfabetização\b/g,'Literacia'],[/\bcompartilhada\b/g,'partilhada'],[/\bcompartilhar\b/g,'partilhar'],[/\balto risco\b/g,'risco elevado'],[/\bequipe\b/g,'equipa'],[/\btela\b/g,'ecrã'],[/\bprovedor\b/g,'prestador'],[/\bProvedor\b/g,'Prestador']]
};
for(const[index,lang]of ['de','es','pt'].entries()){
 const draft=JSON.parse(readFileSync(`${root}/${lang}-draft.json`,'utf8')),result={};
 for(const source of units){
  let value=draft[source];if(value===undefined)throw new Error(`Unfinished translation draft ${lang}: ${source}`);
  value=value.replaceAll('▁',' ').replace(/[ \t]{2,}/g,' ').trim();
  for(const[from,to]of terminology[lang])value=value.replace(from,to);
  if(lang==='de')value=value.replaceAll('KI-Kenntnisse','KI-Kompetenz').replaceAll('Deployments','Betreiber').replaceAll('Deployers','Betreibers');
  if(lang==='es')value=value.replaceAll('e implementadores','y responsables del despliegue').replaceAll('implementadores','responsables del despliegue').replaceAll('implementador','responsable del despliegue');
  if(lang==='pt'){
   value=value.replaceAll('implementadores','responsáveis pela implantação').replaceAll('implementador','responsável pela implantação').replaceAll('provedores','prestadores');
   if(/\bproviders?\b/i.test(source))value=value.replaceAll('fornecedores','prestadores').replaceAll('fornecedor','prestador');
   value=value.replace(/(\d+)\.o\b/g,'$1.º').replace(/\bn\.o\b/g,'n.º');
  }
  // A translated heading must retain its Markdown level. Case IDs are stable.
  const heading=source.match(/^(#{1,6}) /);if(heading)value=heading[1]+' '+value.replace(/^#{1,6}\s*/,'');
  const caseId=source.match(/^(case_\w+)\s*[—–-]/);if(caseId)value=value.replace(/^[^—–-]+[—–-]\s*/,caseId[1]+' — ');
  result[normal(source)]=normal(value);
 }
 for(const[source,...values]of REVISED)result[normal(source)]=normal(values[index]);
 if(lang==='es')for(const[source,value]of Object.entries(SPANISH_REVISIONS))result[normal(source)]=normal(value);
 if(lang==='pt')result['155/155 routes, no mojibake in HTML, no external collection form']='155/155 rotas, sem caracteres corrompidos no HTML e sem formulário externo de recolha';
 writeFileSync(`src/site/unified/${lang}.json`,JSON.stringify(result,null,2)+'\n');
 console.log(`Prepared ${lang}: ${Object.keys(result).length} editorial units.`);
}

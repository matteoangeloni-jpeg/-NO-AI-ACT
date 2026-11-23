// Update current availability copy without touching counts of conditions,
// rubric dimensions, historical test runs or existing release-note files.
const lists={
 it:[['italiano, inglese, francese, tedesco, spagnolo e portoghese europeo','italiano, inglese, francese, tedesco, spagnolo, portoghese europeo e olandese'],['Italiano, English, Français, Deutsch, Español, Português','Italiano, English, Français, Deutsch, Español, Português, Nederlands']],
 en:[['Italian, English, French, German, Spanish and European Portuguese','Italian, English, French, German, Spanish, European Portuguese and Dutch']],
 fr:[['italien, anglais, français, allemand, espagnol et portugais européen','italien, anglais, français, allemand, espagnol, portugais européen et néerlandais']],
 de:[['Italienisch, Englisch, Französisch, Deutsch, Spanisch und europäisches Portugiesisch','Italienisch, Englisch, Französisch, Deutsch, Spanisch, europäisches Portugiesisch und Niederländisch'],['Italienisch, Englisch, Französisch, Deutsch, Spanisch und europäischem Portugiesisch','Italienisch, Englisch, Französisch, Deutsch, Spanisch, europäischem Portugiesisch und Niederländisch']],
 es:[['italiano, inglés, francés, alemán, español y portugués europeo','italiano, inglés, francés, alemán, español, portugués europeo y neerlandés']],
 pt:[['italiano, inglês, francês, alemão, espanhol e português europeu','italiano, inglês, francês, alemão, espanhol, português europeu e neerlandês']],
 nl:[['Italiaans, Engels, Frans, Duits, Spaans en Europees Portugees','Italiaans, Engels, Frans, Duits, Spaans, Europees Portugees en Nederlands'],['Italiaans, Engels, Frans, Duits, Spaans en Europees-Portugees','Italiaans, Engels, Frans, Duits, Spaans, Europees-Portugees en Nederlands']]
};
const phrases={
 it:[['sei lingue','sette lingue'],['tutte e sei le lingue','tutte e sette le lingue']],
 en:[['six languages','seven languages'],['six language versions','seven language versions'],['six website languages','seven website languages'],['six playable languages','seven playable languages']],
 fr:[['six langues','sept langues']],
 de:[['sechs Sprachen','sieben Sprachen'],['sechs Website-Sprachen','sieben Website-Sprachen'],['sechs Spielsprachen','sieben Spielsprachen']],
 es:[['seis idiomas','siete idiomas'],['seis lenguas','siete lenguas']],
 pt:[['seis línguas','sete línguas']],
 nl:[['zes talen','zeven talen']]
};
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function currentAvailability(text,language){
 let result=text;
 for(const[from,to]of [...(lists[language]??[]),...(phrases[language]??[])])result=result.replace(new RegExp(escape(from),'gi'),match=>/^[A-ZÀ-ÖØ-Þ]/.test(match)?to[0].toUpperCase()+to.slice(1):to);
 result=result.replace(/IT\/EN\/FR\/DE\/ES\/PT(?![/-]NL|-PT)/g,'IT/EN/FR/DE/ES/PT/NL');
 result=result.replace(/\bIT\s*\/\s*EN\s*\/\s*FR(?!\s*\/\s*DE)\b/g,'IT / EN / FR / DE / ES / PT / NL');
 for(const[from,to]of [
  ['portoghese europeo e olandese (pt-PT)','portoghese europeo (pt-PT) e olandese'],
  ['European Portuguese and Dutch (pt-PT)','European Portuguese (pt-PT) and Dutch'],
  ['portugais européen et néerlandais (pt-PT)','portugais européen (pt-PT) et néerlandais'],
  ['Portugiesisch und Niederländisch (pt-PT)','Portugiesisch (pt-PT) und Niederländisch'],
  ['portugués europeo y neerlandés (pt-PT)','portugués europeo (pt-PT) y neerlandés'],
  ['português europeu e neerlandês (pt-PT)','português europeu (pt-PT) e neerlandês'],
  ['Europees Portugees en Nederlands (pt-PT)','Europees Portugees (pt-PT) en Nederlands']
 ])result=result.replaceAll(from,to);
 return result;
}
export function currentDictionary(dictionary,language){
 const result={...dictionary};
 for(const[source,target]of Object.entries(dictionary))result[currentAvailability(source,'en')]=currentAvailability(target,language);
 return result;
}

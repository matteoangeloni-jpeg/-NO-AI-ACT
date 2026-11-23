import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { sourceMain, sourceHash, blocks } from '../site/translation-blocks.mjs';
import { EU_EDITORIAL_OVERRIDES } from '../../src/site/eu-editorial-overrides.mjs';
import { PLAYABLE_LANGUAGES as LANGUAGES } from '../../src/site/route-inventory.mjs';

const VERSION = '5.1.0';
const TAG = `v${VERSION}`;
const read = file => readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const write = (file, text) => { if (read(file) !== text) writeFileSync(file, text); };
const cfg = JSON.parse(read('release.config.json'));
if (process.argv.includes('--stage-tag')) {
  if (execFileSync('git', ['ls-remote', 'upstream', `refs/tags/${TAG}`], {encoding:'utf8'}).trim()) throw new Error(`${TAG} already exists`);
  cfg.lastTaggedRelease = TAG;
}
const translated = readdirSync('src/site/fr').filter(name=>name.endsWith('.json')).map(name=>{
  const path=`src/site/fr/${name}`, data=JSON.parse(read(path));
  const main=sourceMain(read(`${data.en}/index.html`));
  if (data.sourceHash!==sourceHash(main)||data.blocks.length!==blocks(main).length) throw new Error(`Unreviewed translation drift: ${path}`);
  return {path,data};
});
const gameCopy = text => text
  .replaceAll('Available in Italian, English and French.', 'Available in Italian, English, French, German, Spanish and European Portuguese.')
  .replaceAll('supports Italian, English and French;', 'supports Italian, English, French, German, Spanish and European Portuguese;')
  .replaceAll('Game: Italian, English and French. Website: also German, Spanish and European Portuguese', 'Game and website: Italian, English, French, German, Spanish and European Portuguese')
  .replaceAll('The game supports three languages.', 'The game supports all six languages.')
  .replaceAll('In italiano, inglese e francese.', 'In italiano, inglese, francese, tedesco, spagnolo e portoghese europeo.')
  .replaceAll('senza account, in italiano, inglese e francese;', 'senza account, in italiano, inglese, francese, tedesco, spagnolo e portoghese europeo;')
  .replaceAll('Gioco: italiano, inglese e francese. Sito: anche tedesco, spagnolo e portoghese europeo', 'Gioco e sito: italiano, inglese, francese, tedesco, spagnolo e portoghese europeo')
  .replaceAll('Il gioco resta in tre lingue.', 'Il gioco è disponibile in tutte e sei le lingue.')
  .replaceAll('navigateur, en italien, anglais et français ;', 'navigateur, en italien, anglais, français, allemand, espagnol et portugais européen ;')
  .replaceAll('Jeu : italien, anglais et français. Site : également allemand, espagnol et portugais européen', 'Jeu et site : italien, anglais, français, allemand, espagnol et portugais européen')
  .replaceAll('Le jeu reste disponible en trois langues.', 'Le jeu est disponible dans les six langues.')
  .replaceAll('dictionnaires italien, anglais et français.', 'dictionnaires italien, anglais, français, allemand, espagnol et portugais européen.');
const htmlFiles=execFileSync('git',['ls-files','-z','*.html'],{encoding:'utf8'}).split('\0').filter(Boolean);
for(const file of htmlFiles) {
  const html=gameCopy(read(file)).replaceAll('5.0.1',VERSION).replace(/(<script[^>]+type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(match,open,body,close)=>{
    const data=JSON.parse(body);
    const update=node=>{
      if(!node||typeof node!=='object') return;
      if(['WebSite','SoftwareApplication','VideoGame'].includes(node['@type'])) node.inLanguage=['it','en','fr','de','es','pt-PT'];
      if(typeof node.dateModified==='string' && !file.includes('matteo-angeloni')) node.dateModified='2026-11-21T00:00:00Z';
      for(const value of Object.values(node)) if(typeof value==='object') Array.isArray(value)?value.forEach(update):update(value);
    };
    update(data);return open+'\n'+JSON.stringify(data,null,2)+'\n'+close;
  });
  write(file,html);
}
for(const {path,data} of translated) {
  data.blocks=data.blocks.map(text=>gameCopy(text).replaceAll('5.0.1',VERSION));
  const main=sourceMain(read(`${data.en}/index.html`));
  if(data.blocks.length!==blocks(main).length) throw new Error(`Translation structure changed: ${path}`);
  data.sourceHash=sourceHash(main);write(path,JSON.stringify(data,null,2)+'\n');
}

const multilingual = text => text
  .replaceAll('Italienisch, Englisch und Französisch verfügbar, nicht auf Deutsch', 'Italienisch, Englisch, Französisch, Deutsch, Spanisch und europäischem Portugiesisch verfügbar')
  .replaceAll('Italienisch, Englisch und Französisch verfügbar', 'Italienisch, Englisch, Französisch, Deutsch, Spanisch und europäischem Portugiesisch verfügbar')
  .replaceAll('italiano, inglés y francés, no en español', 'italiano, inglés, francés, alemán, español y portugués europeo')
  .replaceAll('italiano, inglés y francés', 'italiano, inglés, francés, alemán, español y portugués europeo')
  .replaceAll('italiano, inglês e francês, não em português', 'italiano, inglês, francês, alemão, espanhol e português europeu')
  .replaceAll('italiano, inglês e francês', 'italiano, inglês, francês, alemão, espanhol e português europeu')
  .replaceAll('Das Spiel bleibt dreisprachig;', 'Das Spiel ist in allen sechs Sprachen verfügbar;')
  .replaceAll('El juego sigue en tres idiomas;', 'El juego está disponible en los seis idiomas;')
  .replaceAll('O jogo continua em três línguas;', 'O jogo está disponível nas seis línguas;')
  .replaceAll('die drei verfügbaren Spielsprachen', 'die sechs verfügbaren Spielsprachen')
  .replaceAll('las tres lenguas disponibles del juego', 'las seis lenguas disponibles del juego')
  .replaceAll('as três línguas disponíveis no jogo', 'as seis línguas disponíveis no jogo')
  .replaceAll('Die aktuelle Veröffentlichung ist Version 4.', 'Die aktuelle Veröffentlichung ist Version 5.1.0.')
  .replaceAll('La publicación actual es la versión 4.', 'La publicación actual es la versión 5.1.0.')
  .replaceAll('A publicação atual é a versão 4.', 'A publicação atual é a versão 5.1.0.')
  .replaceAll("'Italienisch, Englisch, Französisch'", "'Italienisch, Englisch, Französisch, Deutsch, Spanisch, europäisches Portugiesisch'")
  .replaceAll("'Italiano, inglés y francés'", "'Italiano, inglés, francés, alemán, español y portugués europeo'")
  .replaceAll("'Italiano, inglês e francês'", "'Italiano, inglês, francês, alemão, espanhol e português europeu'")
  .replaceAll('5.0.1',VERSION);
for(const file of ['src/site/de-content.mjs','src/site/es-content.mjs','src/site/pt-content.mjs','src/site/eu-practical-content.mjs','src/site/eu-press-content.mjs']) {
  let text=multilingual(read(file));
  if(file.endsWith('de-content.mjs')) text=text.replace("['Italienisch', 'Englisch', 'Französisch']", "['Italienisch', 'Englisch', 'Französisch', 'Deutsch', 'Spanisch', 'Portugiesisch']").replace("privacyLink: 'Informationen zur Statistik (Englisch)'", "privacyLink: 'Informationen zur Statistik'");
  if(file.endsWith('es-content.mjs')) text=text.replace("['Italiano', 'Inglés', 'Francés']", "['Italiano', 'Inglés', 'Francés', 'Alemán', 'Español', 'Portugués']").replace("privacyLink: 'Información sobre las estadísticas (en inglés)'", "privacyLink: 'Información sobre las estadísticas'");
  if(file.endsWith('pt-content.mjs')) text=text.replace("['Italiano', 'Inglês', 'Francês']", "['Italiano', 'Inglês', 'Francês', 'Alemão', 'Espanhol', 'Português']").replace("privacyLink: 'Informação sobre as estatísticas (em inglês)'", "privacyLink: 'Informação sobre as estatísticas'");
  if(file.endsWith('eu-press-content.mjs')) text=text
    .replace("privacy: 'Details zur Nutzungsstatistik (Englisch)'", "privacy: 'Details zur Nutzungsstatistik'")
    .replace("privacy: 'Detalles de las estadísticas (inglés)'", "privacy: 'Detalles de las estadísticas'")
    .replace("privacy: 'Detalhes das estatísticas (inglês)'", "privacy: 'Detalhes das estatísticas'")
    .replace("link('/game-statistics.html#en',p.privacy,true)", "link(`/game-statistics.html#${lang}`,p.privacy)");
  write(file,text);
}
const overrides={...EU_EDITORIAL_OVERRIDES};
for(const [path,html] of Object.entries(overrides)) {
  const links=['it','en','fr','de','es','pt'].map((lang,i)=>`<a href="/play/?lang=${lang}" hreflang="${lang==='pt'?'pt-PT':lang}">${['Italienisch','Englisch','Französisch','Deutsch','Spanisch','Portugiesisch'][i]}</a>`).join(' · ');
  overrides[path]=multilingual(html).replace(/"dateModified"\s*:\s*"[^"]+"/g, '"dateModified":"2026-11-21T00:00:00Z"')
    .replace(/<p class="eu-play-links">[\s\S]*?<\/p>/,`<p class="eu-play-links">${links}</p>`)
    .replace('href="/game-statistics.html#en" hreflang="en">Informationen zur Statistik (Englisch)', 'href="/game-statistics.html#de" hreflang="de">Informationen zur Statistik');
}
write('src/site/eu-editorial-overrides.mjs','// Reviewed editorial pages retained as full-document overrides.\nexport const EU_EDITORIAL_OVERRIDES = '+JSON.stringify(overrides,null,2)+';\n');
const pkg=JSON.parse(read('package.json'));pkg.version=VERSION;write('package.json',JSON.stringify(pkg,null,2)+'\n');
const lock=JSON.parse(read('package-lock.json'));lock.version=VERSION;lock.packages[''].version=VERSION;write('package-lock.json',JSON.stringify(lock,null,2)+'\n');
cfg.versionTag=TAG;cfg.contentLastReviewed='2026-11-21';
write('release.config.json',JSON.stringify(cfg,null,2)+'\n');
write('CITATION.cff',read('CITATION.cff').replace(/^version: .+$/m,`version: ${VERSION}`).replace('Italian, English and French, requires no account', 'Italian, English, French, German, Spanish and European Portuguese, requires no account'));
let readme=read('README.md').replaceAll('5.0.1',VERSION)
  .replace('lingue-IT%20%2B%20EN%20%2B%20FR-', 'lingue-IT%20EN%20FR%20DE%20ES%20PT-')
  .replace('| **Lingue del gioco** | Italiano / English / Français |','| **Lingue del gioco** | Italiano / English / Français / Deutsch / Español / Português (PT) |')
  .replace('Localizzazione **IT/EN/FR** completa:', 'Localizzazione **IT/EN/FR/DE/ES/PT** completa:')
  .replace('- **Lingue**: italiano, inglese e francese', '- **Lingue**: italiano, inglese, francese, tedesco, spagnolo e portoghese europeo')
  .replace('Press kit in tutte e sei le lingue; il gioco resta IT/EN/FR.', 'Gioco e press kit sono disponibili in tutte e sei le lingue.')
  .replace('Three difficulty modes, mission paths, IT/EN/FR.', 'Three difficulty modes, mission paths, IT/EN/FR/DE/ES/PT.')
  .replace(/- \*\*Ultima release effettivamente taggata\*\*: .+/,`- **Ultima release effettivamente taggata**: \`${cfg.lastTaggedRelease}\``)
  .replace(/- \*\*Tag della versione\*\*: .+/,`- **Tag della versione**: \`${TAG}\` — **${cfg.lastTaggedRelease===TAG?'pubblicato':'non ancora pubblicato'}**`)
  .replace(/The latest tagged release is \*\*[^*]+\*\*\./,`The latest tagged release is **${cfg.lastTaggedRelease}**.`);
readme=readme.replace(/## Stato attuale del codice[^\n]*\n[\s\S]*?(?=\n## Novità in v1)/,`## Stato attuale del codice (v${VERSION})\n\nGioco e sito condividono sei lingue: italiano, inglese, francese, tedesco, spagnolo\ne portoghese europeo. Tutti i 14 casi, le prove, le motivazioni, i feedback, il\npercorso guidato, il glossario e i report sono tradotti. Il selettore dispone\ndi sei pulsanti su due righe; salvataggi v2 e migrazione v1 restano compatibili.\n\nIl dossier metodologico storico e il laboratorio locale Study 02 restano in\nIT/EN/FR e separati dalla build pubblica. Il gioco non acquisisce dati\nindividuali né assegna punteggi automatici al pensiero critico. La validazione\numana delle traduzioni e dell'efficacia educativa resta da svolgere.\n\nRestano 155 URL pubblici in sei lingue, con diversa profondità editoriale per\nlingua. [Copertura e verifiche](docs/v5/SIX_LANGUAGE_LOCALIZATION.md).\nNote: [RELEASE_NOTES_v${VERSION}.md](docs/RELEASE_NOTES_v${VERSION}.md).\n`);
write('README.md',readme);
let llms=read('public/llms.txt').replace(/- Version: v[^\n]+/,`- Version: ${TAG}`)
  .replace(/- Game languages: .+/, '- Game languages: Italian, English, French, German, Spanish and European Portuguese (pt-PT).')
  .replace('New website languages do not imply a translated game or the full educational hub.', 'The game supports the same six languages; editorial depth in the educational hub varies by locale.')
  .replace('Play the game (IT/EN/FR):','Play the game (IT/EN/FR/DE/ES/PT):');
if(cfg.lastTaggedRelease===TAG) llms=llms.replace(/- Last tagged release: .+/,`- Last tagged release: https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/${TAG} (tagged 2026-11-21; six playable languages)`);
write('public/llms.txt',llms);
console.log(`Prepared ${TAG}: six game languages, 155 existing site routes. No deployment or tests performed.`);

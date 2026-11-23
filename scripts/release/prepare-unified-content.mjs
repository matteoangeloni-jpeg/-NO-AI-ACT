import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const old='5.2.2',version='5.3.0',date='2026-11-23';
if(JSON.parse(readFileSync('package.json','utf8')).version!==old)throw new Error('This one-time release migration requires v5.2.2; the current edition is already prepared.');
const read=file=>readFileSync(file,'utf8'),save=(file,data)=>writeFileSync(file,data);
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
// Current public statements only; release notes, research observations and
// dependency package versions remain historical records.
for(const file of files){
 if(!/\.html$/.test(file)&&!['README.md','CITATION.cff','public/llms.txt'].includes(file))continue;
 const before=read(file);save(file,before.replaceAll(old,version));
}
for(const path of ['package.json','package-lock.json']){const value=JSON.parse(read(path));value.version=version;if(value.packages?.[''])value.packages[''].version=version;save(path,JSON.stringify(value,null,2)+'\n');}
const release=JSON.parse(read('release.config.json'));release.versionTag=`v${version}`;release.lastTaggedRelease=`v${version}`;release.releaseDate=date;release.contentLastReviewed=date;save('release.config.json',JSON.stringify(release,null,2)+'\n');
mkdirSync('docs/archive',{recursive:true});copyFileSync('README.md','docs/archive/README_pre_v5.3.0.it.md');
console.log('Prepared stable v5.3.0 metadata; preserved historical release notes and save schema.');

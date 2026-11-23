import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {serialize} from 'parse5';
import {sourceMain,sourceHash,blocks,walk} from './translation-blocks.mjs';
// Preserve the older block-based source archive alongside the unified builder.
for(const filename of readdirSync('src/site/fr').filter(file=>file.endsWith('.json'))){
 const path='src/site/fr/'+filename,data=JSON.parse(readFileSync(path,'utf8'));
 const en=sourceMain(readFileSync(data.en+'/index.html','utf8')),fr=sourceMain(readFileSync('fr/'+data.slug+'/index.html','utf8'));
 const source=blocks(en),target=blocks(fr);
 if(source.length!==target.length)throw new Error(`Different editorial structures: ${filename}: ${source.length}/${target.length}`);
 data.sourceHash=sourceHash(en);data.blocks=target.map(serialize);
 const native=[];walk(fr,node=>{for(const attr of node.attrs??[])if(['alt','title','aria-label'].includes(attr.name)&&attr.value)native.push([attr.name,attr.value]);});
 let index=0;walk(en,node=>{for(const attr of node.attrs??[])if(['alt','title','aria-label'].includes(attr.name)&&attr.value){const destination=native[index++];if(destination?.[0]===attr.name)data.attributes={...data.attributes,[attr.value]:destination[1]};}});
 writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
console.log('French block sources synchronized with current translated editorial content.');

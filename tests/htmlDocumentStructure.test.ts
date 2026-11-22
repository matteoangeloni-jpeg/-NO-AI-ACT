import {readFileSync} from 'node:fs';
import {parse} from 'parse5';
import {describe,it,expect} from 'vitest';
import {INVENTORY_FILES} from './lib-inventory';
interface Node {nodeName:string;tagName?:string;attrs?:Array<{name:string;value:string}>;childNodes?:Node[];mode?:string;}
const files=[...INVENTORY_FILES,'play/index.html'];
const nodes=(node:Node):Node[]=>[node,...(node.childNodes??[]).flatMap(nodes)];
describe('HTML document parsing preserves game layout and metadata',()=>{
 it('keeps all published documents in standards mode without a decoded BOM in the body',()=>{
  const failures=files.filter(file=>{const raw=readFileSync(file,'utf8');return raw.includes('\ufeff')||(parse(raw) as unknown as Node).mode!=='no-quirks';});
  expect(failures,'A BOM parsed as text can drop the doctype and enable quirks mode').toEqual([]);
 });
 it('keeps charset, title, viewport and document metadata inside head, including the playable shell',()=>{
  const failures:string[]=[];
  for(const file of files){const all=nodes(parse(readFileSync(file,'utf8')) as unknown as Node),head=all.find(n=>n.tagName==='head')!,inside=new Set(nodes(head));
   for(const node of all){const attrs=Object.fromEntries((node.attrs??[]).map(a=>[a.name,a.value]));
    if((node.tagName==='title'||node.tagName==='meta'&&(attrs.charset||attrs.name||attrs.property)||node.tagName==='link'&&attrs.rel==='canonical')&&!inside.has(node))failures.push(file+': '+node.tagName);}
   expect(nodes(head).some(n=>n.tagName==='meta'&&n.attrs?.some(a=>a.name==='charset')),file).toBe(true);
   expect(nodes(head).some(n=>n.tagName==='title'),file).toBe(true);
  }
  expect(failures).toEqual([]);
 });
});

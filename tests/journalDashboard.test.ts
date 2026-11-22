import {readFileSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import {describe,it,expect} from 'vitest';
describe('legacy completion counts remain available alongside consented individual sessions',()=>{
 it('reconciles the actual dashboard aliases without inventing missing outcome or duration data',()=>{
  const source=readFileSync('analytics/dashboard/dashboard.js','utf8'),ast=ts.createSourceFile('dashboard.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const declarations=ast.statements.filter(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='rows'||ts.isVariableStatement(node)&&node.declarationList.declarations.some(d=>d.name.getText(ast)==='eventAliases')).map(n=>n.getText(ast)).join('\n');
  const original=[{event:'usage_case_completed',count:197,dimension:'all',value:'all'},{event:'usage_case_left',count:5,dimension:'caseId',value:'case_scoring'},{event:'usage_session_completed',count:9,dimension:'all',value:'all'}];
  const rows=vm.runInNewContext(`${declarations};rows('all')`,{data:{all:original}});
  expect(rows.map((r:{event:string})=>r.event)).toEqual(['case_completed','case_abandoned','session_completed']);
  expect(rows.map((r:{count:number})=>r.count)).toEqual([197,5,9]);expect(rows[0]).not.toHaveProperty('result');expect(rows[0]).not.toHaveProperty('durationBucket');expect(original[0].event).toBe('usage_case_completed');
 });
});

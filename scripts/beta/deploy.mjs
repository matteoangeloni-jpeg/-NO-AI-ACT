/** Explicit publication command: the beta custom domain uses branch beta. */
import {readFileSync,mkdirSync,existsSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
export function validateBetaArtifact(manifest,version,head){
 if(manifest.channel!=='beta'||manifest.gameVersion!==version||manifest.commit!==head||manifest.dirty!==false)throw new Error('Rebuild the beta from the clean release commit.');
 if(manifest.sessionJournal?.mode!=='adult-opt-in'||manifest.sessionJournal?.writing!=='separate-opt-in')throw new Error('Build the public beta with BETA_USAGE_COLLECTION=true.');
}
export function betaDeploymentArgs(directory,head){return ['pages','deploy',directory,'--project-name','no-ai-act-beta','--branch','beta','--commit-hash',head,'--commit-dirty=false'];}
function main(){
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const manifest=JSON.parse(readFileSync(resolve(root,'dist-beta/beta-release.json'),'utf8')),version=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')).version;
 validateBetaArtifact(manifest,version,head);
 const directory=resolve(root,'.infrastructure/pages');mkdirSync(directory,{recursive:true});const config=resolve(directory,'wrangler.jsonc');
 if(!existsSync(config))copyFileSync(resolve(root,'deploy/cloudflare/beta.pages.jsonc'),config);
 const settings=JSON.parse(readFileSync(config,'utf8'));
 if(settings.name!=='no-ai-act-beta'||resolve(directory,settings.pages_build_output_dir)!==resolve(root,'dist-beta'))throw new Error('Unexpected beta project configuration.');
 const result=spawnSync(process.execPath,[resolve(root,'node_modules/wrangler/bin/wrangler.js'),...betaDeploymentArgs(resolve(root,'dist-beta'),head)],{cwd:directory,stdio:'inherit',windowsHide:true});
 process.exitCode=result.status??1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main();

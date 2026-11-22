import {describe,it,expect} from 'vitest';
// @ts-expect-error Operational ESM helper shared with the explicit deployment command.
import {validateBetaArtifact,betaDeploymentArgs} from '../scripts/beta/deploy.mjs';
const manifest={channel:'beta',gameVersion:'5.2.1',commit:'a'.repeat(40),dirty:false,sessionJournal:{mode:'adult-opt-in',writing:'separate-opt-in'}};
describe('the beta custom domain receives the verified production deployment',()=>{
 it('uses the beta production branch; main would only create a preview',()=>{
  const args=betaDeploymentArgs('/verified/dist-beta',manifest.commit);expect(args[args.indexOf('--branch')+1]).toBe('beta');
  expect(args[args.indexOf('--project-name')+1]).toBe('no-ai-act-beta');expect(args[args.indexOf('--commit-hash')+1]).toBe(manifest.commit);
 });
 it('rejects stale, dirty or differently versioned artifacts before publication',()=>{
  expect(()=>validateBetaArtifact(manifest,'5.2.1',manifest.commit)).not.toThrow();
  for(const patch of [{dirty:true},{channel:'production'},{gameVersion:'5.2.0'},{commit:'b'.repeat(40)}])expect(()=>validateBetaArtifact({...manifest,...patch},'5.2.1',manifest.commit)).toThrow();
 });
 it('rejects an artifact that accidentally disables the requested recording capability',()=>{
  expect(()=>validateBetaArtifact({...manifest,sessionJournal:'off'},'5.2.1',manifest.commit)).toThrow();
 });
});

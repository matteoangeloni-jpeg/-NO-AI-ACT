import {describe,it,expect} from 'vitest';
import {Analytics,type AnalyticsConfig} from '../src/game/systems/AnalyticsSystem';
import collector from '../analytics/usage-worker';
import type {Env} from '../analytics/types';
import {SessionJournal} from '../src/game/systems/SessionJournal';
import {JOURNAL_POLICY} from '../analytics/journal-schema';
import {PRODUCTION_USAGE_ENDPOINT,PRODUCTION_JOURNAL_ENDPOINT,LEGACY_JOURNAL_ENDPOINT} from '../analytics/endpoints';
// @ts-expect-error Operational ESM helper.
import {assertBetaPublicationEnabled} from '../scripts/beta/deploy.mjs';
// @ts-expect-error Cloudflare Pages advanced-mode entry.
import retired from '../deploy/cloudflare/retired-channel/_worker.js';
describe('production only publication and compatibility',()=>{
 it('redirects the retired game to the stable URL while preserving language and path',()=>{
  const response=retired.fetch(new Request('https://beta.no-ai-act.eu/play/?lang=de'));
  expect(response.status).toBe(302);expect(response.headers.get('Location')).toBe('https://www.no-ai-act.eu/play/?lang=de');expect(response.headers.get('X-Robots-Tag')).toContain('noindex');
  expect(retired.fetch(new Request('https://beta.no-ai-act.eu/',{method:'POST'})).status).toBe(405);
 });
 it('blocks public beta publication before reading or uploading artifacts',()=>{expect(()=>assertBetaPublicationEnabled()).toThrow('retired');});
 it('sends production counters to the neutral approved address',async()=>{
  const urls:string[]=[],config:AnalyticsConfig={dev:false,provider:'first-party',releaseChannel:'production',origin:'https://www.no-ai-act.eu',remoteApproved:true,collectionMode:'automatic',approvedEndpoints:[PRODUCTION_USAGE_ENDPOINT]};
  const analytics=new Analytics(config,async url=>{urls.push(url);});analytics.track('game_opened');expect(await analytics.flush()).toBe(true);expect(urls).toEqual([PRODUCTION_USAGE_ENDPOINT]);
 });
 it('exposes only collection on the new host and preserves the legacy collection route',async()=>{
  const env={COLLECTION_ENABLED:'false',ADMIN_HOST:'insights.no-ai-act.eu'} as Env;
  for(const host of ['telemetry.no-ai-act.eu','beta.no-ai-act.eu']){
   expect((await collector.fetch(new Request(`https://${host}/collect`,{method:'POST',headers:{Origin:'https://www.no-ai-act.eu'}}),env)).status).toBe(503);
   expect((await collector.fetch(new Request(`https://${host}/api/stats`),env)).status).toBe(404);
  }
 });
 it('recovers legacy receipts into the production service without restarting recording',async()=>{
  const urls:string[]=[],now=Date.now();const journal=new SessionJournal({enabled:true,endpoint:PRODUCTION_JOURNAL_ENDPOINT,receiptEndpoints:[LEGACY_JOURNAL_ENDPOINT],now:()=>now,
   fetch:(async url=>{urls.push(String(url));return Response.json({events:[],session:{}});}) as typeof fetch});
  const receipt={privateReceipt:true,endpoint:LEGACY_JOURNAL_ENDPOINT,sessionId:crypto.randomUUID(),token:'a'.repeat(64),expiresAt:now+100000,policyVersion:JOURNAL_POLICY};
  expect(journal.recoverReceipt({...receipt,endpoint:'https://other.invalid'})).toBe(false);expect(journal.recoverReceipt(receipt)).toBe(true);expect(journal.active).toBe(false);await journal.exportData();expect(urls).toEqual([PRODUCTION_JOURNAL_ENDPOINT+'/export']);
 });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { Analytics, AnalyticsSystem, resolveProvider, sanitizeProperties, type AnalyticsConfig, type AnalyticsTransport } from '../src/game/systems/AnalyticsSystem';
import { ANALYTICS_EVENTS, ANALYTICS_LIMITS, EVENT_CATALOG, LANGUAGES, MODES, PHASES, durationBucket, validatePayload, validateAggregate,
  type AnalyticsEvent } from '../src/game/systems/analyticsSchema';
import { installAnalyticsInstrumentation } from '../src/game/systems/analyticsInstrumentation';

beforeEach(() => { vi.spyOn(console, 'info').mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());
const approved: AnalyticsConfig = { dev: false, provider: 'plausible', plausibleDomain: 'noaiact.example',
  remoteApproved: true, approvedEndpoints: ['https://plausible.io/api/event'] };
function mockTransport() {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const fn: AnalyticsTransport = (url, body) => { calls.push({ url, body }); };
  return { calls, fn };
}
function count(a: Analytics, event: AnalyticsEvent) { return a.snapshot().filter(c => c.event === event).reduce((n,c) => n+c.count,0); }
function open(a: Analytics) { a.startSession('new'); a.page('case'); a.startCase('case_scoring'); }
function signed(a: Analytics) {
  a.page('decision'); a.track('decision_submitted', {caseId:'case_scoring'});
  a.track('report_signed', {caseId:'case_scoring',result:'wrong'});
  a.track('case_completed', {caseId:'case_scoring',result:'wrong'});
}

describe('production and infrastructure gates', () => {
  it('default production and the shipped singleton cannot send remotely', () => {
    expect(resolveProvider({dev:false})).toBe('off');
    expect(['off','console']).toContain(AnalyticsSystem.provider);
    expect(resolveProvider({dev:true})).toBe('console');
    expect(resolveProvider({dev:true,provider:'typo'})).toBe('off');
  });
  it('old provider variables alone cannot authorize transport', () => {
    expect(resolveProvider({...approved,remoteApproved:undefined})).toBe('off');
    expect(resolveProvider({...approved,approvedEndpoints:[]})).toBe('off');
    expect(resolveProvider({...approved,plausibleDomain:'somebody@example.org'})).toBe('off');
    expect(resolveProvider(approved)).toBe('plausible');
  });
  it('DNT wins even over an approved provider and runtime enable', async () => {
    const t=mockTransport(); const a=new Analytics({...approved,doNotTrack:true},t.fn);
    a.enable(); open(a); await a.flush();
    expect(a.isEnabled()).toBe(false); expect(a.snapshot()).toEqual([]); expect(t.calls).toEqual([]);
  });
  it('off collects nothing and enable does not change that', async () => {
    const t=mockTransport(); const a=new Analytics({dev:false},t.fn);
    a.enable(); open(a); a.page('map'); a.endSession(); await a.flush();
    expect(a.snapshot()).toEqual([]); expect(t.calls).toEqual([]); expect(a.sentCount).toBe(0);
  });
  it('console is offline and disable erases buffered cells', async () => {
    const t=mockTransport(); const a=new Analytics({dev:true},t.fn);
    open(a); expect(a.snapshot().length).toBeGreaterThan(0);
    expect(await a.flush()).toBe(false); expect(t.calls).toEqual([]);
    a.disable(); expect(a.snapshot()).toEqual([]); a.enable(); open(a);
    expect(count(a,'case_started')).toBe(1);
  });
  it.each(['http://stats.example/script.js','https://x:y@stats.example/script.js','https://stats.example/script.js?email=x','https://stats.example/script.js#user','broken'])('rejects unsafe Umami configuration %s',url => {
    expect(resolveProvider({dev:false,provider:'umami',umamiWebsiteId:'site-1',umamiScriptUrl:url,remoteApproved:true,approvedEndpoints:['https://stats.example/api/send']})).toBe('off');
  });
});

describe('closed schema and minimization', () => {
  it.each([undefined,null,NaN,Infinity,-Infinity,1,true,'email@example.org','192.0.2.1','https://example.org/user','a short answer',{},[]])('does not admit arbitrary values %s',value => {
    expect(sanitizeProperties({language:value,mode:value,phase:value,caseId:value,result:value,durationBucket:value,tutorialVersion:value})).toEqual({});
  });
  it('drops all answer, identifier, free text and network metadata fields', () => {
    const raw={language:'fr',mode:'libera',caseId:'case_scoring',result:'partial',hintUsed:true,
      name:'Someone',email:'x@y.example',ip:'192.0.2.1',userAgent:'browser',sessionId:'abc',
      classification:'vietata',measure:'blocco',motivationIndex:2,selectedClueCount:3,query:'private'};
    expect(sanitizeProperties(raw)).toEqual({language:'fr',mode:'libera',caseId:'case_scoring',result:'partial',hintUsed:true});
  });
  it('validates required properties, version and per-event property lists', () => {
    const a=new Analytics({dev:true}); open(a); signed(a);
    for(const c of a.snapshot()) expect(validateAggregate(c)).toBe(true);
    const {count:ignored,...p}=a.snapshot().find(c=>c.event==='case_completed')!;
    expect(ignored).toBe(1); expect(validatePayload(p)).toBe(true);
    expect(validatePayload({...p,schemaVersion:2})).toBe(false);
    expect(validatePayload({...p,extra:'x'})).toBe(false);
    expect(validatePayload({...p,properties:{...p.properties,email:'x'}})).toBe(false);
    expect(validatePayload({...p,properties:{...p.properties,caseId:'unknown'}})).toBe(false);
    expect(validatePayload({...p,properties:{language:'it',mode:'turno',phase:'case'}})).toBe(false);
    for(const bad of [0,-1,NaN,Infinity,1.5,ANALYTICS_LIMITS.count+1]) expect(validateAggregate({...p,count:bad})).toBe(false);
  });
  it('rejects orphan case events and unknown names without breaking gameplay', () => {
    const a=new Analytics({dev:true});
    a.track('case_completed',{caseId:'case_scoring',result:'wrong'});
    a.track('user_typed_name' as AnalyticsEvent);
    expect(a.snapshot()).toEqual([]);
    expect(a.diagnostics.rejected).toBe(2);
    const malicious=Object.defineProperty({},'language',{get(){throw new Error('bad getter');}});
    expect(()=>a.track('game_opened',malicious)).not.toThrow();
    a.setContextProvider(()=>{throw new Error('unavailable');}); expect(()=>open(a)).not.toThrow();
  });
  it.each(['title','map','case','evidence','decision','report','session-end'])('accepts known page %s',screen => {
    const a=new Analytics({dev:true}); a.page(screen); expect(count(a,'pageview')).toBe(1);
  });
  it.each(['Some Person','https://example.org','case?email=x','constructor','__proto__'])('rejects unapproved screen %s',screen => {
    const a=new Analytics({dev:true}); a.page(screen); expect(a.snapshot()).toEqual([]);
    a.track('game_opened'); expect(a.snapshot()[0].properties.phase).toBe('menu');
  });
  it('catalog and rules contain each required event exactly once', () => {
    expect(new Set(ANALYTICS_EVENTS).size).toBe(ANALYTICS_EVENTS.length);
    expect(Object.keys(EVENT_CATALOG).sort()).toEqual([...ANALYTICS_EVENTS].sort());
    for(const event of ['game_started','game_resumed','game_session_ended','language_selected','mode_selected',
      'case_started','case_completed','case_abandoned','session_completed','evidence_opened','evidence_cited',
      'citation_error','hint_requested','decision_submitted','report_signed','tutorial_started','tutorial_skipped',
      'tutorial_completed','debrief_opened','review_started']) expect(ANALYTICS_EVENTS).toContain(event);
  });
  it('does not let consumers extend the language or property vocabulary at runtime', () => {
    expect(()=>{(LANGUAGES as unknown as string[]).push('private@example.org');}).toThrow();
    expect(()=>{(EVENT_CATALOG.game_started.optional as string[]).push('email');}).toThrow();
    expect(sanitizeProperties({language:'private@example.org',email:'private@example.org'})).toEqual({});
  });
});

describe('observational sessions, attempts and deduplication', () => {
  it('ignores a repeated start before leaving the menu, but accepts a real next session', () => {
    const a=new Analytics({dev:true}); a.startSession('new'); a.startSession('new');
    expect(count(a,'game_started')).toBe(1); expect(count(a,'game_session_ended')).toBe(0);
    a.page('case'); a.page('title'); a.startSession('new');
    expect(count(a,'game_started')).toBe(2);
    a.disable(); a.enable(); a.startSession('resume'); a.startSession('resume');
    expect(count(a,'game_resumed')).toBe(1);
  });
  it('does not duplicate revisits, decisions, signatures, results or debrief', () => {
    const a=new Analytics({dev:true}); open(a); a.startCase('case_scoring'); signed(a); signed(a);
    a.track('case_result',{caseId:'case_scoring',result:'wrong'});
    a.page('report'); a.track('debrief_opened',{caseId:'case_scoring'}); a.track('debrief_opened',{caseId:'case_scoring'});
    a.page('map');
    for(const event of ['case_started','decision_submitted','report_signed','case_completed','debrief_opened'] as const) expect(count(a,event)).toBe(1);
    expect(count(a,'case_result')).toBe(0); expect(count(a,'case_abandoned')).toBe(0);
  });
  it('counts distinct openings/citations, never uncitation, recitation or restored evidence', () => {
    const a=new Analytics({dev:true}); open(a);
    a.evidenceAction('case_scoring',0,true,false); a.evidenceAction('case_scoring',0,true,true);
    a.evidenceAction('case_scoring',0,true,false); a.evidenceAction('case_scoring',0,true,true);
    a.restoreEvidence('case_scoring',[1],[1]); a.evidenceAction('case_scoring',1,true,true);
    a.evidenceAction('case_scoring',2,true,true); a.evidenceAction('case_scoring',99,true,true);
    expect(count(a,'evidence_opened')).toBe(2); expect(count(a,'evidence_cited')).toBe(2);
    expect(JSON.stringify(a.snapshot())).not.toMatch(/index|citedClues|relevantClues/);
  });
  it('observes abandonment only on positive navigation; re-entry is a new attempt', () => {
    const a=new Analytics({dev:true}); open(a); a.page('evidence'); a.page('map'); a.page('map');
    expect(count(a,'case_abandoned')).toBe(1); a.page('case'); a.startCase('case_scoring');
    expect(count(a,'case_started')).toBe(2);
  });
  it('does not infer abandonment from page exit, missing events or elapsed time', () => {
    let now=0; const a=new Analytics({dev:true},undefined,()=>now); open(a); now=2_000_000;
    expect(count(a,'case_abandoned')).toBe(0); a.endSession(); a.endSession();
    expect(count(a,'game_session_ended')).toBe(1); expect(count(a,'case_abandoned')).toBe(0);
    a.startSession('resume'); expect(count(a,'game_resumed')).toBe(1);
  });
  it('captures help and coarse durations with no timestamps', () => {
    let now=0; const a=new Analytics({dev:true},undefined,()=>now); open(a);
    a.track('hint_requested',{caseId:'case_scoring'}); now=90_000; signed(a); a.completeSession(); a.completeSession();
    const c=a.snapshot().find(x=>x.event==='case_completed')!;
    expect(c.properties.hintUsed).toBe(true); expect(c.properties.durationBucket).toBe('1_to_5m');
    expect(count(a,'session_completed')).toBe(1); expect(JSON.stringify(a.snapshot())).not.toMatch(/startedAt|timestamp|sessionId|durationMs/);
  });
  it.each([[0,'under_1m'],[59_999,'under_1m'],[60_000,'1_to_5m'],[300_000,'5_to_15m'],[900_000,'15_to_30m'],[1_800_000,'30m_plus']])('buckets %i ms', (n,b) => expect(durationBucket(n as number)).toBe(b));
  it('bounds aggregate memory without falsely abandoning a completed case', () => {
    const a=new Analytics({dev:true}); open(a);
    for(const caseId of ['case_scoring','case_lavoro','case_media']) {
      a.startCase(caseId);
      for(const language of LANGUAGES) for(const mode of MODES) for(const phase of PHASES)
        a.track('hint_requested',{caseId,language,mode,phase});
    }
    const previous=count(a,'case_abandoned');
    a.track('report_signed',{caseId:'case_media',result:'wrong'});
    a.track('case_completed',{caseId:'case_media',result:'wrong'}); a.page('map');
    expect(a.snapshot().length).toBe(ANALYTICS_LIMITS.cells); expect(a.diagnostics.droppedCells).toBeGreaterThan(0);
    expect(a.snapshot().every(validateAggregate)).toBe(true);
    expect(count(a,'case_abandoned')).toBe(previous);
  });
});

describe('existing event bus and locale context', () => {
  it.each(['it','en','fr'] as const)('uses closed %s context and one subscription',language => {
    const bus=new EventEmitter(); const life=new EventTarget(); const a=new Analytics({dev:true});
    const dispose=installAnalyticsInstrumentation(bus,a,()=>({language,mode:'turno'}),life as unknown as Window);
    expect(installAnalyticsInstrumentation(bus,a,()=>({language,mode:'turno'}),life as unknown as Window)).toBe(dispose);
    expect(bus.listenerCount('gameplay-ux')).toBe(1); open(a);
    expect(()=>bus.emit('gameplay-ux',Object.defineProperty({},'event',{get(){throw new Error('broken observer input');}}))).not.toThrow();
    for(const event of ['tutorial_started','tutorial_skipped','tutorial_completed','citation_error','help_requested']) {
      bus.emit('gameplay-ux',{event,caseId:'case_scoring'});
      if(event!=='help_requested') bus.emit('gameplay-ux',{event,caseId:'case_scoring'});
    }
    signed(a); bus.emit('gameplay-ux',{event:'debrief_opened',caseId:'case_scoring'});
    bus.emit('gameplay-ux',{event:'review_started'}); bus.emit('gameplay-ux',{event:'review_started'});
    for(const event of ['tutorial_started','tutorial_skipped','tutorial_completed','citation_error','hint_requested','debrief_opened','review_started'] as const) expect(count(a,event)).toBe(1);
    expect(a.snapshot().every(c=>c.properties.language===language)).toBe(true);
    const exit=new Event('pagehide'); Object.defineProperty(exit,'persisted',{value:false}); life.dispatchEvent(exit);
    expect(count(a,'game_session_ended')).toBe(1); expect(count(a,'case_abandoned')).toBe(0);
    dispose(); expect(bus.listenerCount('gameplay-ux')).toBe(0);
  });
});

describe('aggregate transports use explicit flush and closed data', () => {
  it('default HTTP transport omits credentials and referrer and never uses an unload beacon', async () => {
    const request=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('',{status:202}));
    const a=new Analytics(approved); a.track('game_opened'); await a.flush();
    expect(request).toHaveBeenCalledWith('https://plausible.io/api/event',expect.objectContaining({credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',method:'POST'}));
    expect(request.mock.calls[0][1]?.keepalive).toBeUndefined();
  });
  it('a dropped provider response is not treated as durable delivery', async () => {
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('',{status:202,headers:{'x-plausible-dropped':'1'}}));
    const a=new Analytics(approved); a.track('game_opened'); expect(await a.flush()).toBe(false);
    expect(count(a,'game_opened')).toBe(1);
  });
  it('does not send on track; flush sends counts without real page URL/answers', async () => {
    const t=mockTransport(); const a=new Analytics(approved,t.fn); open(a); signed(a);
    expect(t.calls).toEqual([]); expect(await a.flush()).toBe(true); expect(t.calls.length).toBeGreaterThan(0);
    const body=t.calls[0].body as {url:string;props:Record<string,unknown>};
    expect(body.url).toBe('https://noaiact.example/play/');
    expect(body.props.schemaVersion).toBe(1); expect(body.props.count).toBe(1);
    expect(JSON.stringify(t.calls)).not.toMatch(/classification|motivation|referrer|userAgent|sessionId/);
    expect(a.snapshot()).toEqual([]);
  });
  it('Umami uses only its approved endpoint and canonical path', async () => {
    const t=mockTransport(); const a=new Analytics({dev:false,provider:'umami',umamiWebsiteId:'site-1',
      umamiScriptUrl:'https://stats.example/script.js',remoteApproved:true,approvedEndpoints:['https://stats.example/api/send']},t.fn);
    a.track('game_opened'); await a.flush(); expect(t.calls[0].url).toBe('https://stats.example/api/send');
    expect(JSON.stringify(t.calls[0].body)).toContain('"schemaVersion":1');
    expect((t.calls[0].body as {payload:{hostname:string}}).payload.hostname).toBe('www.no-ai-act.eu');
  });
  it('sync and async failures keep bounded cells and never reject gameplay', async () => {
    for(const transport of [()=>{throw new Error('offline');},()=>Promise.reject(new Error('offline'))]) {
      const a=new Analytics(approved,transport); a.track('game_opened');
      await expect(a.flush()).resolves.toBe(false); expect(a.snapshot()).toHaveLength(1);
      expect(a.diagnostics.transportErrors).toBe(1);
    }
  });
  it('cannot mutate approved configuration after construction', async () => {
    const cfg={...approved,approvedEndpoints:[...approved.approvedEndpoints!]}; const t=mockTransport(); const a=new Analytics(cfg,t.fn);
    cfg.provider='umami'; cfg.approvedEndpoints.length=0; a.track('game_opened'); await a.flush();
    expect(t.calls[0].url).toBe('https://plausible.io/api/event');
  });
  it('does not erase a new buffer when disabled during an in-flight flush', async () => {
    let finish!:()=>void; const a=new Analytics(approved,()=>new Promise<void>(resolve=>{finish=resolve;}));
    a.track('game_opened'); const pending=a.flush(); a.disable(); a.enable(); a.track('game_opened'); finish(); await pending;
    expect(count(a,'game_opened')).toBe(1);
  });
});

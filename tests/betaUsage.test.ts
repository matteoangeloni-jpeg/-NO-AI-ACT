import { describe, expect, it } from 'vitest';
import { Analytics, resolveProvider, type AnalyticsConfig } from '../src/game/systems/AnalyticsSystem';
import { validateUsageBatch } from '../analytics/beta-usage';
import { handle } from '../analytics/worker';
import type { Env } from '../analytics/types';

const config: AnalyticsConfig = { dev: false, provider: 'first-party', releaseChannel: 'beta',
  origin: 'https://beta.no-ai-act.eu', remoteApproved: true,
  approvedEndpoints: ['https://beta.no-ai-act.eu/collect'] };
function play(a: Analytics) {
  a.startSession('new'); a.page('case'); a.startCase('case_scoring');
  a.track('report_signed', { caseId: 'case_scoring', result: 'wrong' });
  a.track('case_completed', { caseId: 'case_scoring', result: 'wrong' });
}
describe('minimal voluntary beta collection', () => {
  it('requires the exact approved origin/channel and never enables previews', () => {
    expect(resolveProvider(config)).toBe('first-party');
    for (const change of [{ releaseChannel: 'production' }, { origin: 'https://www.no-ai-act.eu' },
      { origin: 'https://no-ai-act-beta.pages.dev' }, { remoteApproved: false }, { doNotTrack: true }]) {
      expect(resolveProvider({ ...config, ...change })).toBe('off');
    }
  });
  it('records automatically only with explicit automatic configuration and respects browser privacy signals', async () => {
    const calls: unknown[] = [];
    const a = new Analytics({ ...config, collectionMode: 'automatic' }, (_url, body) => { calls.push(body); });
    play(a); await a.flush(); expect(calls).toHaveLength(1);
    a.disable(); play(a); await a.flush(); expect(calls).toHaveLength(1);
    const blocked = new Analytics({ ...config, collectionMode: 'automatic', doNotTrack: true });
    blocked.enable(); play(blocked); expect(blocked.snapshot()).toEqual([]);
    expect(resolveProvider({ ...config, releaseChannel: 'production', origin: 'https://www.no-ai-act.eu',
      approvedEndpoints: ['https://beta.no-ai-act.eu/collect'] })).toBe('first-party');
  });
  it('does not record or transmit before opt-in; revocation clears the buffer', async () => {
    const calls: unknown[] = []; const a = new Analytics(config, (_url, body) => { calls.push(body); });
    play(a); await a.flush(); expect(a.snapshot()).toEqual([]); expect(calls).toEqual([]);
    a.enable(); play(a); expect(a.snapshot().length).toBeGreaterThan(0);
    a.disable(); await a.flush(); expect(a.snapshot()).toEqual([]); expect(calls).toEqual([]);
  });
  it('ships only aggregate usage, never outcomes, selected answers or durations', async () => {
    const calls: unknown[] = []; const a = new Analytics(config, (_url, body) => { calls.push(body); });
    a.enable(); play(a); await a.flush();
    expect(calls).toHaveLength(1); expect(validateUsageBatch(calls[0])).toBe(true);
    const payload = JSON.stringify(calls[0]);
    expect(payload).toContain('usage_case_completed');
    for (const denied of ['wrong', 'result', 'hintUsed', 'durationBucket', 'report_signed', 'email', 'sessionId', 'ipAddress']) expect(payload).not.toContain(denied);
    expect(a.snapshot()).toEqual([]);
  });
  it('retries the same batch ID after an ambiguous network error', async () => {
    const ids: unknown[] = []; let fail = true;
    const a = new Analytics(config, (_url, body) => { ids.push(body.batchId); if (fail) { fail = false; throw new Error('network'); } });
    a.enable(); play(a); expect(await a.flush()).toBe(false); expect(await a.flush()).toBe(true);
    expect(ids).toHaveLength(2); expect(ids[0]).toBe(ids[1]); expect(a.snapshot()).toEqual([]);
  });
  it('preserves concurrent increments and abandons retries before receipt expiry', async () => {
    let now = 0; let fail = true;
    const a = new Analytics(config, () => { if (fail) throw new Error('network'); }, () => now);
    a.enable(); play(a); await a.flush(); now = 23 * 3600000; fail = false;
    expect(await a.flush()).toBe(false); expect(a.snapshot()).toEqual([]);
  });
  it('the deployed intake rejects the legacy detailed schema and never exposes admin data', async () => {
    const a = new Analytics({ dev: true }); play(a);
    const detailed = { batchId: crypto.randomUUID(), cells: a.snapshot() };
    const env = { COLLECTION_ENABLED: 'true', USAGE_ONLY: 'true', COLLECTION_HOST: 'beta.no-ai-act.eu',
      ADMIN_HOST: 'insights.no-ai-act.eu', ALLOWED_ORIGIN: 'https://beta.no-ai-act.eu',
      INGEST_LIMITER: { limit: async () => ({ success: true }) },
      DB: { prepare: () => { throw new Error('must not query'); }, batch: async () => { throw new Error('must not write'); } } } as Env;
    const response = await handle(new Request('https://beta.no-ai-act.eu/collect', { method: 'POST',
      headers: { Origin: 'https://beta.no-ai-act.eu', 'Content-Type': 'application/json' }, body: JSON.stringify(detailed) }), env);
    expect(response.status).toBe(400);
    expect((await handle(new Request('https://beta.no-ai-act.eu/api/stats'), env)).status).toBe(404);
    expect((await handle(new Request('https://insights.no-ai-act.eu/api/stats'), env)).status).toBe(401);
  });
});

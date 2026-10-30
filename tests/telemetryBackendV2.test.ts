import { afterEach, describe, expect, it } from 'vitest';
import { LocalDatabase } from '../analytics/local-db';
import { DailyQuotaExceeded, ingest, LIMITS, projectComposite, readCompositeCells, type Batch } from '../analytics/aggregation';
import { handle } from '../analytics/worker';
import type { Env } from '../analytics/types';
import { ANALYTICS_GAME_VERSION, type AnalyticsAggregate } from '../src/game/systems/analyticsSchema';
import { PLAYABLE_CASES } from '../src/game/data/cases';

const databases: LocalDatabase[] = [];
const database = () => { const db = new LocalDatabase(); databases.push(db); return db; };
afterEach(() => databases.splice(0).forEach(db => db.close()));
const password = 'a-local-only-secret-at-least-24-characters';
const auth = `Basic ${btoa(`reviewer:${password}`)}`;
const allowed = { async limit() { return { success: true }; } };
const day = '2026-10-30';
const caseId = PLAYABLE_CASES[0].id;
const quality: AnalyticsAggregate = {
  schemaVersion: 2, gameVersion: ANALYTICS_GAME_VERSION, event: 'case_quality_assessed', count: 10,
  properties: { language: 'it', mode: 'turno', phase: 'report', caseId,
    selectedClassification: 'vietata', referenceClassification: 'vietata', classificationMatch: true,
    selectedMeasure: 'blocco', selectedActor: 'provider', evidenceQuality: 'high', decisionQuality: 'high', reasoningQuality: 'correct',
    viewedEvidenceBand: 'three_plus', citedEvidenceBand: 'two', omittedRelevantBand: 'none', contradictoryEvidenceRecognized: true,
    revisionOccurred: false, revisionCountBand: 'none', revisionDirection: 'none' }
};
const batch = (cells: AnalyticsAggregate[] = [quality]): Batch => ({ batchId: crypto.randomUUID(), cells });
const env = (DB = database()): Env => ({ DB, COLLECTION_ENABLED: 'true', ALLOWED_ORIGIN: 'https://www.no-ai-act.eu', LOCAL_TEST: 'true',
  LOCAL_PASSWORD: password, INGEST_LIMITER: allowed, ADMIN_LIMITER: allowed });
const admin = (path: string) => new Request(`http://127.0.0.1:4214${path}`, { headers: { Authorization: auth } });

describe('telemetry schema v2 backend', () => {
  it('stores one closed composite cell while retaining v1-compatible marginal projection', async () => {
    const db = database();
    await ingest(db, batch(), Date.parse(`${day}T12:00:00Z`));
    expect(db.sqlite.prepare("SELECT count(*) n FROM counters WHERE dimension='caseId'").get()?.n).toBe(1);
    const rows = await readCompositeCells(db, 'decision_evidence', { from: day, to: day, dimension: 'all' }, Date.parse(`${day}T12:00:00Z`));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ schemaVersion: 2, report: 'decision_evidence', count: 10,
      dimensions: { event: 'case_quality_assessed', caseId, evidenceQuality: 'high', decisionQuality: 'high' } });
    expect(projectComposite(batch([{ ...quality, schemaVersion: 1 }]), day)).toEqual([]);
  });

  it('rejects the daily quota explicitly before any counter or receipt mutation', async () => {
    const db = database();
    db.sqlite.prepare('INSERT INTO daily_quota(day,count) VALUES(?,?)').run(day, LIMITS.dailyCount);
    await expect(ingest(db, batch(), Date.parse(`${day}T12:00:00Z`))).rejects.toBeInstanceOf(DailyQuotaExceeded);
    expect(db.sqlite.prepare('SELECT count(*) n FROM counters').get()?.n).toBe(0);
    expect(db.sqlite.prepare('SELECT count(*) n FROM composite_counters').get()?.n).toBe(0);
    expect(db.sqlite.prepare('SELECT count(*) n FROM receipts').get()?.n).toBe(0);
  });

  it('returns an explicit quota response from collection without mutating counters', async () => {
    const e = env();
    const today = new Date().toISOString().slice(0, 10);
    (e.DB as LocalDatabase).sqlite.prepare('INSERT INTO daily_quota(day,count) VALUES(?,?)').run(today, LIMITS.dailyCount);
    const request = new Request('https://insights.invalid/collect', { method: 'POST', headers: {
      Origin: e.ALLOWED_ORIGIN!, 'Content-Type': 'application/json' }, body: JSON.stringify(batch()) });
    const response = await handle(request, e);
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: 'daily_quota_exceeded' });
    expect((e.DB as LocalDatabase).sqlite.prepare('SELECT count(*) n FROM counters').get()?.n).toBe(0);
  });

  it('exports authorized schema/game metadata and leaves non-applicable values empty', async () => {
    const e = env();
    await ingest(e.DB, batch(), Date.parse(`${day}T12:00:00Z`));
    const path = `/api/export/decision-evidence.csv?from=${day}&to=${day}&version=${ANALYTICS_GAME_VERSION}`;
    const response = await handle(admin(path), e);
    expect(response.status).toBe(200);
    expect(response.headers.get('X-Telemetry-Schema')).toBe('2');
    expect(response.headers.get('X-Game-Version')).toBe(ANALYTICS_GAME_VERSION);
    const text = await response.text();
    expect(text).toContain('telemetry_schema_version');
    expect(text).toContain('"2","4.0.0"');
    expect(text).not.toContain('undefined');
  });

  it.each(['/api/export/aggregate-counts.csv', '/api/export/case-performance.csv', '/api/export/decision-evidence.csv', '/api/export/technical-quality.csv'])
  ('requires authorization for %s', async path => expect((await handle(admin(path).clone(), { ...env(), LOCAL_PASSWORD: undefined })).status).toBe(401));
});

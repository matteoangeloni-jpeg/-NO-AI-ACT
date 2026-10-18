import { ANALYTICS_GAME_VERSION, ANALYTICS_SCHEMA_VERSION, LANGUAGES, MODES, type AnalyticsAggregate, type AnalyticsEvent } from '../src/game/systems/analyticsSchema';
import { PLAYABLE_CASES } from '../src/game/data/cases';
import { project } from './aggregation';
import type { Database } from './types';

// Deterministic fixtures, never exported as live player observations.
export async function seedSynthetic(db: Database, now = Date.now()): Promise<void> {
  await db.batch([db.prepare('DELETE FROM counters'), db.prepare('DELETE FROM receipts'), db.prepare('DELETE FROM daily_quota')]);
  for (let d = 27; d >= 0; d--) {
    const day = new Date(now - d * 86400000).toISOString().slice(0, 10);
    const cells: AnalyticsAggregate[] = [];
    for (const [li, language] of LANGUAGES.entries()) for (const [mi, mode] of MODES.entries()) {
      const base = 30 + ((d * 7 + li * 11 + mi * 3) % 50);
      const add = (event: AnalyticsEvent, count: number, extra = {}) => cells.push({ schemaVersion: ANALYTICS_SCHEMA_VERSION, gameVersion: ANALYTICS_GAME_VERSION, event,
        properties: { language, mode, phase: 'case', ...extra }, count });
      add('game_started', base); add('game_resumed', 12 + mi); add('game_session_ended', base, { durationBucket: '5_to_15m' });
      add('session_completed', Math.round(base * .6), { durationBucket: '15_to_30m' });
      add('review_started', 10 + mi);
      for (const [ci, c] of PLAYABLE_CASES.entries()) {
        const n = 10 + ((d + ci + li + mi) % 14) + (ci % 7) * 2;
        add('case_started', n, { caseId: c.id });
        add('case_completed', Math.round(n * (.45 + (ci % 5) * .07)), { caseId: c.id, result: 'correct', hintUsed: false, durationBucket: '5_to_15m' });
        add('case_completed', Math.round(n * .1), { caseId: c.id, result: 'partial', hintUsed: true, durationBucket: '1_to_5m' });
        add('case_completed', Math.round(n * (.1 + (ci % 3) * .03)), { caseId: c.id, result: 'wrong', hintUsed: true, durationBucket: '15_to_30m' });
        add('citation_error', Math.round(n * (.1 + (ci % 6) * .09)), { caseId: c.id });
        add('hint_requested', Math.round(n * (.15 + (ci % 4) * .16)), { caseId: c.id });
        add('debrief_opened', Math.round(n * .5), { caseId: c.id, result: 'correct' });
        add('tutorial_started', n, { caseId: c.id, tutorialVersion: 'investigation-v1' });
        add('tutorial_completed', Math.round(n * .5), { caseId: c.id, tutorialVersion: 'investigation-v1' });
        add('tutorial_skipped', Math.round(n * .2), { caseId: c.id, tutorialVersion: 'investigation-v1' });
      }
    }
    const rows = project({ batchId: crypto.randomUUID(), cells }, day);
    await db.prepare(`INSERT INTO counters(day,version,event,dimension,value,count)
      SELECT json_extract(value,'$.day'),json_extract(value,'$.version'),json_extract(value,'$.event'),
      json_extract(value,'$.dimension'),json_extract(value,'$.value'),json_extract(value,'$.count') FROM json_each(?)`).bind(JSON.stringify(rows)).run();
  }
}

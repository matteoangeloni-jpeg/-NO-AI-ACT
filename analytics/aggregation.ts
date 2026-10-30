import { ANALYTICS_GAME_VERSIONS, validateAggregate, type AnalyticsAggregate } from '../src/game/systems/analyticsSchema';
import { DIMENSIONS, type Cell, type CompositeCell, type CompositeReport, type Database, type Dimension } from './types';

export const LIMITS = Object.freeze({ bytes: 32768, cells: 32, cellCount: 100, batchCount: 1000, dailyCount: 100000, retentionDays: 90, threshold: 10 });
export interface Batch { batchId: string; cells: AnalyticsAggregate[] }
export class DailyQuotaExceeded extends Error {
  constructor() { super('daily_quota_exceeded'); this.name = 'DailyQuotaExceeded'; }
}
export function validateBatch(value: unknown): value is Batch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const b = value as Record<string, unknown>;
  if (Object.keys(b).length !== 2 || !Object.prototype.hasOwnProperty.call(b, 'batchId') || !Object.prototype.hasOwnProperty.call(b, 'cells')) return false;
  if (typeof b.batchId !== 'string' || b.batchId.length !== 36 || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.batchId)) return false;
  if (!Array.isArray(b.cells) || !b.cells.length || b.cells.length > LIMITS.cells) return false;
  const keys = new Set<string>();
  let total = 0;
  for (const c of b.cells) {
    if (!validateAggregate(c) || c.event === 'case_result' || c.count > LIMITS.cellCount) return false;
    const key = JSON.stringify([c.event, Object.entries(c.properties).sort(([a], [z]) => a.localeCompare(z))]);
    if (keys.has(key)) return false;
    keys.add(key); total += c.count;
  }
  return total <= LIMITS.batchCount;
}
export function project(batch: Batch, day: string): Cell[] {
  const cells = new Map<string, Cell>();
  for (const c of batch.cells) {
    for (const dimension of DIMENSIONS) {
      const p = c.properties as unknown as Record<string, unknown>;
      const caseMetric = (key: string): string | undefined => typeof p.caseId === 'string' && typeof p[key] === 'string' ? `${p.caseId}|${p[key]}` : undefined;
      const raw = dimension === 'all' ? '*'
        : dimension === 'classificationPair' && typeof p.caseId === 'string' && typeof p.selectedClassification === 'string' && typeof p.referenceClassification === 'string'
          ? `${p.caseId}|${p.selectedClassification}->${p.referenceClassification}`
        : dimension === 'caseEvidenceQuality' ? caseMetric('evidenceQuality')
        : dimension === 'caseDecisionQuality' ? caseMetric('decisionQuality')
        : dimension === 'caseFinalEvaluation' ? caseMetric('result')
        : dimension === 'caseDuration' ? caseMetric('durationBucket')
        : dimension === 'caseRevision' ? caseMetric('revisionDirection')
        : dimension === 'abandonmentPhase' && typeof p.abandonmentPhase === 'string' ? `${String(p.caseId ?? '*')}|${p.abandonmentPhase}`
        : dimension === 'technicalError' && typeof p.errorCode === 'string' ? `${String(p.caseId ?? '*')}|${p.errorCode}`
        : dimension === 'accessibilitySetting' ? p.accessibilitySetting
        : p[dimension];
      if (raw === undefined) continue;
      const value = String(raw);
      const key = JSON.stringify([c.gameVersion, c.event, dimension, value]);
      const existing = cells.get(key);
      if (existing) existing.count += c.count;
      else cells.set(key, { day, version: c.gameVersion, event: c.event, dimension, value, count: c.count });
    }
  }
  return [...cells.values()];
}
const CASE_PERFORMANCE_KEYS = ['caseId', 'result', 'durationBucket', 'hintUsed', 'abandonmentPhase'] as const;
const DECISION_EVIDENCE_KEYS = ['caseId', 'selectedClassification', 'referenceClassification', 'classificationMatch', 'selectedMeasure', 'selectedActor',
  'decisionQuality', 'reasoningQuality', 'evidenceQuality', 'viewedEvidenceBand', 'citedEvidenceBand', 'omittedRelevantBand',
  'contradictoryEvidenceRecognized', 'revisionOccurred', 'revisionCountBand', 'revisionDirection'] as const;
const TECHNICAL_QUALITY_KEYS = ['caseId', 'errorCode', 'accessibilitySetting', 'abandonmentPhase', 'durationBucket'] as const;
function closedDimensions(properties: Record<string, unknown>, keys: readonly string[]): Record<string, string | boolean> {
  const result: Record<string, string | boolean> = {};
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === 'string' || typeof value === 'boolean') result[key] = value;
  }
  return result;
}
export function projectComposite(batch: Batch, day: string): CompositeCell[] {
  const cells = new Map<string, CompositeCell>();
  for (const cell of batch.cells) {
    if (cell.schemaVersion !== 2) continue;
    let report: CompositeReport | undefined;
    let keys: readonly string[] = [];
    if (cell.event === 'case_completed' || cell.event === 'case_abandoned') { report = 'case_performance'; keys = CASE_PERFORMANCE_KEYS; }
    else if (cell.event === 'case_quality_assessed' || cell.event === 'decision_revised') { report = 'decision_evidence'; keys = DECISION_EVIDENCE_KEYS; }
    else if (cell.event === 'interface_error' || cell.event === 'accessibility_used') { report = 'technical_quality'; keys = TECHNICAL_QUALITY_KEYS; }
    if (!report) continue;
    const dimensions = { event: cell.event, ...closedDimensions(cell.properties as unknown as Record<string, unknown>, keys) };
    const encoded = JSON.stringify(dimensions);
    const id = JSON.stringify([cell.schemaVersion, cell.gameVersion, report, encoded]);
    const existing = cells.get(id);
    if (existing) existing.count += cell.count;
    else cells.set(id, { day, schemaVersion: cell.schemaVersion, version: cell.gameVersion, report, dimensions, count: cell.count });
  }
  return [...cells.values()];
}
async function receiptHash(id: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id.toLowerCase()));
  return [...new Uint8Array(hash)].map(n => n.toString(16).padStart(2, '0')).join('');
}
// All conditional writes and the receipt commit are in one D1 transaction.
export async function ingest(db: Database, batch: Batch, now = Date.now()): Promise<void> {
  const day = new Date(now).toISOString().slice(0, 10);
  const hash = await receiptHash(batch.batchId);
  const total = batch.cells.reduce((n, c) => n + c.count, 0);
  const rows = JSON.stringify(project(batch, day));
  const compositeRows = JSON.stringify(projectComposite(batch, day));
  const quota = await db.prepare(`SELECT
      EXISTS(SELECT 1 FROM receipts WHERE hash=?) duplicate,
      COALESCE((SELECT count FROM daily_quota WHERE day=?),0) current_count`).bind(hash, day).all<{ duplicate: number; current_count: number }>();
  if (quota.results[0]?.duplicate) return;
  if ((quota.results[0]?.current_count ?? 0) + total > LIMITS.dailyCount) throw new DailyQuotaExceeded();
  await db.batch([
    db.prepare('DELETE FROM receipts WHERE expires <= ?').bind(now),
    db.prepare(`INSERT INTO daily_quota(day,count) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM receipts WHERE hash=?)
      ON CONFLICT(day) DO UPDATE SET count=count+excluded.count`).bind(day, total, hash),
    db.prepare(`INSERT INTO counters(day,version,event,dimension,value,count)
      SELECT json_extract(value,'$.day'),json_extract(value,'$.version'),json_extract(value,'$.event'),
        json_extract(value,'$.dimension'),json_extract(value,'$.value'),json_extract(value,'$.count')
      FROM json_each(?) WHERE NOT EXISTS (SELECT 1 FROM receipts WHERE hash=?)
      ON CONFLICT(day,version,event,dimension,value) DO UPDATE SET count=count+excluded.count`).bind(rows, hash),
    db.prepare(`INSERT INTO composite_counters(day,schema_version,game_version,report,dimensions,count)
      SELECT json_extract(value,'$.day'),json_extract(value,'$.schemaVersion'),json_extract(value,'$.version'),
        json_extract(value,'$.report'),json_extract(value,'$.dimensions'),json_extract(value,'$.count')
      FROM json_each(?) WHERE NOT EXISTS (SELECT 1 FROM receipts WHERE hash=?)
      ON CONFLICT(day,schema_version,game_version,report,dimensions) DO UPDATE SET count=count+excluded.count`).bind(compositeRows, hash),
    db.prepare('INSERT INTO receipts(hash,expires) VALUES(?,?) ON CONFLICT(hash) DO NOTHING')
      .bind(hash, Math.floor(now / 3600000) * 3600000 + 86400000)
  ]);
}
export async function purge(db: Database, now = Date.now()): Promise<void> {
  const cutoff = new Date(now - (LIMITS.retentionDays - 1) * 86400000).toISOString().slice(0, 10);
  await db.batch([
    db.prepare('DELETE FROM counters WHERE day < ?').bind(cutoff),
    db.prepare('DELETE FROM composite_counters WHERE day < ?').bind(cutoff),
    db.prepare('DELETE FROM daily_quota WHERE day < ?').bind(cutoff),
    db.prepare('DELETE FROM receipts WHERE expires <= ?').bind(now)
  ]);
}
export interface Query { from: string; to: string; dimension: Dimension; version?: string }
export function retentionWindow(query: Query, now = Date.now()): { retainedFrom: string; clipped: boolean; availableDays: number } {
  const retainedFrom = new Date(now - (LIMITS.retentionDays - 1) * 86400000).toISOString().slice(0, 10);
  const effectiveFrom = query.from > retainedFrom ? query.from : retainedFrom;
  return { retainedFrom, clipped: query.from < retainedFrom,
    availableDays: Math.max(0, Math.floor((Date.parse(query.to) - Date.parse(effectiveFrom)) / 86400000) + 1) };
}
export function parseQuery(url: URL, now = Date.now()): Query | null {
  if ([...url.searchParams.keys()].some(k => !['from', 'to', 'dimension', 'version'].includes(k))) return null;
  if (['from','to','dimension','version'].some(k => url.searchParams.getAll(k).length > 1)) return null;
  const today = new Date(now).toISOString().slice(0, 10);
  const from = url.searchParams.get('from') ?? new Date(now - 13 * 86400000).toISOString().slice(0, 10);
  const to = url.searchParams.get('to') ?? today;
  const dimension = url.searchParams.get('dimension') ?? 'all';
  const version = url.searchParams.get('version') || undefined;
  if (version && !ANALYTICS_GAME_VERSIONS.some(known => known === version)) return null;
  const validDay = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d;
  if (!validDay(from) || !validDay(to) || from > to || to > today || Date.parse(to) - Date.parse(from) > 89 * 86400000 || !DIMENSIONS.includes(dimension as Dimension)) return null;
  return { from, to, dimension: dimension as Dimension, ...(version ? { version } : {}) };
}
export async function readCells(db: Database, query: Query, now = Date.now()): Promise<Cell[]> {
  // Low cells are suppressed at the finest stored daily grain, before any sums.
  const result = await db.prepare(`SELECT day,version,event,dimension,value,count FROM counters
    WHERE day >= ? AND day <= ? AND dimension=? AND count>=? AND (? IS NULL OR version=?) AND day >= ? ORDER BY day,version,event,value`)
    .bind(query.from, query.to, query.dimension, LIMITS.threshold, query.version ?? null, query.version ?? null,
      retentionWindow(query, now).retainedFrom).all<Cell>();
  return result.results;
}
export async function readCompositeCells(db: Database, report: CompositeReport, query: Query, now = Date.now()): Promise<CompositeCell[]> {
  const result = await db.prepare(`SELECT day,schema_version schemaVersion,game_version version,report,dimensions,count
    FROM composite_counters WHERE day>=? AND day<=? AND day>=? AND report=? AND count>=?
      AND (? IS NULL OR game_version=?) ORDER BY day,game_version,dimensions`)
    .bind(query.from, query.to, retentionWindow(query, now).retainedFrom, report, LIMITS.threshold,
      query.version ?? null, query.version ?? null).all<Omit<CompositeCell, 'dimensions'> & { dimensions: string }>();
  return result.results.map(row => ({ ...row, dimensions: JSON.parse(row.dimensions) as Record<string, string | boolean> }));
}
export function csv(cells: Cell[], classification: string, query?: Query, now = Date.now()): string {
  const escape = (v: unknown) => '"' + String(v).replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""') + '"';
  const coverage = query ? retentionWindow(query, now) : undefined;
  return 'classification,day_utc,game_version,event,dimension,value,event_count,requested_from_utc,requested_to_utc,retained_from_utc,retention_clipped\r\n' +
    cells.map(c => [classification, c.day, c.version, c.event, c.dimension, c.value, c.count, query?.from ?? '', query?.to ?? '', coverage?.retainedFrom ?? '', coverage?.clipped ?? ''].map(escape).join(',')).join('\r\n');
}
export function aggregateCountsCsv(cells: Cell[], classification: string, query: Query, now = Date.now()): string {
  const coverage = retentionWindow(query, now);
  const header = ['classification', 'telemetry_schema_version', 'game_version', 'day_utc', 'event', 'dimension', 'value', 'event_count',
    'requested_from_utc', 'requested_to_utc', 'retained_from_utc', 'retention_clipped'];
  const rows = cells.map(cell => [classification, '', cell.version, cell.day, cell.event, cell.dimension, cell.value, cell.count,
    query.from, query.to, coverage.retainedFrom, coverage.clipped]);
  return [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
}
const EXPORT_FIELDS: Record<CompositeReport, readonly string[]> = {
  case_performance: ['event', 'caseId', 'result', 'durationBucket', 'hintUsed', 'abandonmentPhase'],
  decision_evidence: ['event', 'caseId', 'selectedClassification', 'referenceClassification', 'classificationMatch', 'selectedMeasure', 'selectedActor',
    'decisionQuality', 'reasoningQuality', 'evidenceQuality', 'viewedEvidenceBand', 'citedEvidenceBand', 'omittedRelevantBand',
    'contradictoryEvidenceRecognized', 'revisionOccurred', 'revisionCountBand', 'revisionDirection'],
  technical_quality: ['event', 'caseId', 'errorCode', 'accessibilitySetting', 'abandonmentPhase', 'durationBucket']
};
function csvEscape(value: unknown): string {
  return '"' + String(value ?? '').replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""') + '"';
}
export function compositeCsv(cells: CompositeCell[], classification: string, report: CompositeReport, query: Query, now = Date.now()): string {
  const coverage = retentionWindow(query, now);
  const fields = EXPORT_FIELDS[report];
  const header = ['classification', 'telemetry_schema_version', 'game_version', 'day_utc', 'report', ...fields, 'event_count',
    'requested_from_utc', 'requested_to_utc', 'retained_from_utc', 'retention_clipped'];
  const rows = cells.map(cell => [classification, cell.schemaVersion, cell.version, cell.day, report,
    ...fields.map(field => Object.prototype.hasOwnProperty.call(cell.dimensions, field) ? cell.dimensions[field] : ''), cell.count,
    query.from, query.to, coverage.retainedFrom, coverage.clipped]);
  return [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
}

export const DIMENSIONS = ['all', 'language', 'mode', 'caseId', 'phase', 'result', 'durationBucket', 'hintUsed', 'tutorialVersion',
  'classificationPair', 'caseEvidenceQuality', 'caseDecisionQuality', 'caseFinalEvaluation', 'caseDuration',
  'caseRevision', 'abandonmentPhase', 'technicalError', 'accessibilitySetting'] as const;
export type Dimension = typeof DIMENSIONS[number];
export interface Cell { day: string; version: string; event: string; dimension: Dimension; value: string; count: number }
export const COMPOSITE_REPORTS = ['case_performance', 'decision_evidence', 'technical_quality'] as const;
export type CompositeReport = typeof COMPOSITE_REPORTS[number];
export interface CompositeCell {
  day: string;
  schemaVersion: number;
  version: string;
  report: CompositeReport;
  dimensions: Record<string, string | boolean>;
  count: number;
}
export interface Statement {
  bind(...values: unknown[]): Statement;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
export interface Database { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<unknown[]> }
export interface Limiter { limit(input: { key: string }): Promise<{ success: boolean }> }
export interface Env {
  DB: Database;
  COLLECTION_ENABLED?: string;
  USAGE_ONLY?: string;
  ALLOWED_ORIGIN?: string;
  ADMIN_HOST?: string;
  COLLECTION_HOST?: string;
  INGEST_LIMITER?: Limiter;
  ADMIN_LIMITER?: Limiter;
  ACCESS_TEAM?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  LOCAL_TEST?: string;
  LOCAL_PASSWORD?: string;
  DATA_CLASSIFICATION?: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
}

/** Production service plus compatibility addresses for existing clients/receipts. */
export const PRODUCTION_COLLECTOR_ORIGIN='https://telemetry.no-ai-act.eu';
export const PRODUCTION_USAGE_ENDPOINT=PRODUCTION_COLLECTOR_ORIGIN+'/collect';
export const PRODUCTION_JOURNAL_ENDPOINT=PRODUCTION_USAGE_ENDPOINT+'/v3';
export const LEGACY_COLLECTOR_ORIGIN='https://beta.no-ai-act.eu';
export const LEGACY_USAGE_ENDPOINT=LEGACY_COLLECTOR_ORIGIN+'/collect';
export const LEGACY_JOURNAL_ENDPOINT=LEGACY_USAGE_ENDPOINT+'/v3';

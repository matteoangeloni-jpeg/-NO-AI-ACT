-- Consented, per-session event journal. Legacy aggregates remain separate.
CREATE TABLE IF NOT EXISTS journal_sessions (
  id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, policy_version TEXT NOT NULL,
  adult_confirmed INTEGER NOT NULL CHECK(adult_confirmed=1),
  qualitative INTEGER NOT NULL CHECK(qualitative IN (0,1)),
  game_version TEXT NOT NULL, channel TEXT NOT NULL CHECK(channel IN ('production','beta')),
  language TEXT NOT NULL CHECK(language IN ('it','en','fr','de','es','pt')),
  mode TEXT NOT NULL, context_json TEXT NOT NULL CHECK(json_valid(context_json)),
  created_at INTEGER NOT NULL, last_seen_at INTEGER NOT NULL, active_until INTEGER NOT NULL,
  expires_at INTEGER NOT NULL, revoked_at INTEGER, event_count INTEGER NOT NULL DEFAULT 0,
  CHECK(expires_at>created_at)
);
CREATE TABLE IF NOT EXISTS journal_events (
  session_id TEXT NOT NULL REFERENCES journal_sessions(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL, seq INTEGER NOT NULL CHECK(seq>0 AND seq<=10000),
  event_type TEXT NOT NULL, case_id TEXT, attempt_id TEXT,
  language TEXT NOT NULL, mode TEXT NOT NULL, phase TEXT NOT NULL,
  client_at INTEGER NOT NULL, elapsed_ms INTEGER NOT NULL, received_at INTEGER NOT NULL,
  properties_json TEXT NOT NULL CHECK(json_valid(properties_json) AND length(properties_json)<=32768),
  writing_cipher TEXT,
  PRIMARY KEY(session_id,event_id), UNIQUE(session_id,seq)
);
CREATE INDEX IF NOT EXISTS journal_events_case ON journal_events(session_id,case_id,seq);
CREATE INDEX IF NOT EXISTS journal_sessions_dates ON journal_sessions(created_at,expires_at);
CREATE TABLE IF NOT EXISTS journal_daily_limits (day TEXT PRIMARY KEY, sessions INTEGER NOT NULL, events INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS journal_revocations (
  id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, revoked_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS journal_revocations_expiry ON journal_revocations(expires_at);

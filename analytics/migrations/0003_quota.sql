CREATE TABLE IF NOT EXISTS daily_quota (
  day TEXT PRIMARY KEY,
  count INTEGER NOT NULL CHECK(typeof(count)='integer' AND count>0 AND count<=100000)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS composite_counters (
  day TEXT NOT NULL CHECK(length(day)=10),
  schema_version INTEGER NOT NULL CHECK(schema_version=2),
  game_version TEXT NOT NULL CHECK(length(game_version)<=32),
  report TEXT NOT NULL CHECK(report IN ('case_performance','decision_evidence','technical_quality')),
  dimensions TEXT NOT NULL CHECK(json_valid(dimensions) AND length(dimensions)<=2048),
  count INTEGER NOT NULL CHECK(count>0 AND count<=100000),
  PRIMARY KEY(day,schema_version,game_version,report,dimensions)
);
CREATE INDEX IF NOT EXISTS idx_composite_report_day ON composite_counters(report,day,game_version);

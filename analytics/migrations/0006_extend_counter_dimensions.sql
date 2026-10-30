CREATE TABLE counters_v2 (
  day TEXT NOT NULL CHECK(length(day)=10),
  version TEXT NOT NULL CHECK(length(version)<=32),
  event TEXT NOT NULL CHECK(length(event)<=32),
  dimension TEXT NOT NULL CHECK(dimension IN ('all','language','mode','caseId','phase','result','durationBucket','hintUsed','tutorialVersion','classificationPair','caseEvidenceQuality','caseDecisionQuality','caseFinalEvaluation','caseDuration','caseRevision','abandonmentPhase','technicalError','accessibilitySetting')),
  value TEXT NOT NULL CHECK(length(value)<=96),
  count INTEGER NOT NULL CHECK(typeof(count)='integer' AND count>0 AND count<=100000),
  PRIMARY KEY(day,version,event,dimension,value)
) WITHOUT ROWID;

INSERT OR IGNORE INTO counters_v2(day,version,event,dimension,value,count)
  SELECT day,version,event,dimension,value,count FROM counters;
DROP TABLE counters;
ALTER TABLE counters_v2 RENAME TO counters;

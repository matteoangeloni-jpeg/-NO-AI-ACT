CREATE TABLE IF NOT EXISTS counters (
  day TEXT NOT NULL CHECK(length(day)=10),
  version TEXT NOT NULL CHECK(length(version)<=32),
  event TEXT NOT NULL CHECK(length(event)<=32),
  dimension TEXT NOT NULL CHECK(dimension IN ('all','language','mode','caseId','phase','result','durationBucket','hintUsed','tutorialVersion')),
  value TEXT NOT NULL CHECK(length(value)<=40),
  count INTEGER NOT NULL CHECK(typeof(count)='integer' AND count>0 AND count<=100000),
  PRIMARY KEY(day,version,event,dimension,value)
) WITHOUT ROWID;

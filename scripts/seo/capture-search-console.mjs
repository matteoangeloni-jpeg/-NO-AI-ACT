import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

// Read-only evidence: never import credentials into the repository or public/.
const helpers = process.env.SEO_GOOGLE_SCRIPTS ?? resolve(homedir(), '.codex/skills/seo/scripts');
const property = 'sc-domain:no-ai-act.eu';
const periods = { current: ['2026-09-18', '2026-10-15'], previous: ['2026-08-21', '2026-09-17'] };
const output = resolve('.seo-cache/no-ai-act/2026-10-18');
mkdirSync(output, { recursive: true });
function run(script, args) {
  const result = JSON.parse(execFileSync('python', [resolve(helpers, script), ...args, '--json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
  if (result.error) throw new Error(result.error);
  return result;
}
const evidence = { capturedAt: new Date().toISOString(), property, searchType: 'web', dataState: 'final', periods, cuts: {}, inspections: {} };
for (const [period, [start, end]] of Object.entries(periods)) {
  for (const dimensions of ['date', 'query,page', 'page', 'country', 'device']) {
    evidence.cuts[`${period}:${dimensions}`] = run('gsc_query.py', ['--property', property, '--start-date', start, '--end-date', end, '--dimensions', dimensions, '--limit', '25000']);
  }
}
evidence.sitemaps = run('gsc_query.py', ['sitemaps', '--property', property]);
for (const path of ['', 'en/', 'fr/', 'de/', 'es/', 'pt/', 'guida-ai-act/', 'en/high-risk-ai-systems/']) {
  const url = `https://www.no-ai-act.eu/${path}`;
  evidence.inspections[url] = run('gsc_inspect.py', [url, '--site-url', property]);
}
writeFileSync(resolve(output, 'search-console.json'), JSON.stringify(evidence, null, 2) + '\n');
for (const period of Object.keys(periods)) {
  const rows = evidence.cuts[`${period}:date`].rows;
  const clicks = rows.reduce((n, r) => n + r.clicks, 0);
  const impressions = rows.reduce((n, r) => n + r.impressions, 0);
  console.log(period, JSON.stringify({ clicks, impressions, ctr: 100 * clicks / impressions, reportedDays: rows.length }));
}
const queryPages = evidence.cuts['current:query,page'].rows;
console.log('Top visible query/page rows:', JSON.stringify([...queryPages].sort((a, b) => b.impressions - a.impressions).slice(0, 15).map(r => ({ query: r.query, page: r.page, impressions: r.impressions, clicks: r.clicks, position: r.position }))));
console.log('Captured read-only evidence:', output);

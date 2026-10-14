import { resolveNs, resolveCname, resolve4 } from 'node:dns/promises';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// GET-only inventory. Never print credentials, email addresses or unrelated resources.
const output = { observedAt: new Date().toISOString(), dns: {}, cloudflare: {}, stable: {} };
for (const host of ['no-ai-act.eu', 'www.no-ai-act.eu', 'beta.no-ai-act.eu', 'insights.no-ai-act.eu']) {
  output.dns[host] = {};
  for (const [type, lookup] of [['NS', resolveNs], ['CNAME', resolveCname], ['A', resolve4]]) {
    try { output.dns[host][type] = await lookup(host); } catch (e) { output.dns[host][type] = e.code; }
  }
}
try {
  const response = await fetch('https://www.no-ai-act.eu/', { signal: AbortSignal.timeout(15000) });
  output.stable = { status: response.status, server: response.headers.get('server'), url: response.url };
} catch { output.stable = { error: 'unavailable' }; }

let token = process.env.CLOUDFLARE_API_TOKEN;
if (!token && process.env.INFRA_PYTHON) {
  // Python's standard TOML parser is used only for Wrangler's credential file.
  // Its stdout stays inside this process; no token is written to inventory or logs.
  const config = process.env.CF_OAUTH_CONFIG ?? join(process.env.APPDATA ?? '', 'xdg.config', '.wrangler', 'config', 'default.toml');
  const parsed = spawnSync(process.env.INFRA_PYTHON, ['-c',
    'import tomllib,json,sys; f=open(sys.argv[1],"rb"); d=tomllib.load(f); print(json.dumps({"token":d.get("oauth_token")}))', config], { encoding: 'utf8' });
  if (parsed.status === 0) { try { token = JSON.parse(parsed.stdout).token; } catch {} }
}
async function get(path) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method: 'GET', headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000)
  });
  const data = await response.json();
  return { status: response.status, success: data.success === true, result: data.success ? data.result : null };
}
if (!token) output.cloudflare = { authenticated: false, reason: 'credentials_unavailable' };
else {
  output.cloudflare.authenticated = true;
  const zones = await get('/zones?name=no-ai-act.eu&per_page=50');
  output.cloudflare.zoneLookupStatus = zones.status;
  const zone = zones.result?.find(z => z.name === 'no-ai-act.eu');
  if (zone) {
    output.cloudflare.zone = { name: zone.name, status: zone.status, plan: zone.plan?.name };
    const id = zone.account.id;
    const matches = name => /no[-_]?ai[-_]?act/i.test(name ?? '');
    for (const [key, path] of [['pages', `/accounts/${id}/pages/projects`],
      ['workers', `/accounts/${id}/workers/scripts`], ['d1', `/accounts/${id}/d1/database?per_page=100`]]) {
      const response = await get(path); const all = response.result ?? [];
      output.cloudflare[key] = { status: response.status, inspectedCount: all.length,
        relevant: all.filter(r => matches(r.name ?? r.id)).map(r => ({ name: r.name ?? r.id, subdomain: r.subdomain, domains: r.domains })) };
    }
    const records = await get(`/zones/${zone.id}/dns_records?per_page=100&name=beta.no-ai-act.eu`);
    const insights = await get(`/zones/${zone.id}/dns_records?per_page=100&name=insights.no-ai-act.eu`);
    output.cloudflare.proposedRecords = [records, insights].map(r => ({ status: r.status,
      records: (r.result ?? []).map(d => ({ name: d.name, type: d.type, content: d.content, proxied: d.proxied })) }));
    const routes = await get(`/zones/${zone.id}/workers/routes`);
    output.cloudflare.routes = { status: routes.status, relevant: (routes.result ?? []).filter(r => /no-ai-act\.eu/.test(r.pattern))
      .map(r => ({ pattern: r.pattern, script: r.script })) };
    const subscriptions = await get(`/accounts/${id}/subscriptions`);
    output.cloudflare.subscriptions = { status: subscriptions.status,
      plans: (subscriptions.result ?? []).map(s => s.rate_plan?.public_name ?? s.rate_plan?.id).filter(Boolean) };
  } else output.cloudflare.zone = 'not_visible_in_authorized_account';
}
mkdirSync('.infrastructure', { recursive: true });
writeFileSync('.infrastructure/inspection.local.json', JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));

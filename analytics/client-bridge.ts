import { validateBatch } from './aggregation';
import type { AnalyticsAggregate } from '../src/game/systems/analyticsSchema';

export interface DeliveryConfig { enabled: boolean; approvedEndpoint?: string }
// Deliberately not imported by the game. Future connection requires separate approval.
export function prepareDelivery(cells: AnalyticsAggregate[], config: DeliveryConfig,
  send: typeof fetch = fetch, clock: () => number = Date.now): { retry(): Promise<'disabled' | 'sent' | 'failed' | 'expired'> } {
  const endpoint = config.approvedEndpoint;
  let allowed = config.enabled === true;
  try { const url = new URL(endpoint ?? ''); allowed &&= url.protocol === 'https:' && url.pathname === '/collect' && !url.search && !url.hash && !url.username && !url.password; } catch { allowed = false; }
  const body = JSON.parse(JSON.stringify({ batchId: crypto.randomUUID(), cells })) as unknown;
  allowed &&= validateBatch(body);
  const payload = JSON.stringify(body); const created = clock(); let completed = false; let pending = false;
  return { async retry() {
    if (!allowed || !endpoint) return 'disabled';
    if (completed) return 'sent';
    // Shorter than the backend receipt TTL; never retry an expired request.
    if (clock() - created >= 23 * 3600000) return 'expired';
    if (pending) return 'failed'; pending = true;
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 2000);
    try {
      const response = await send(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload,
        credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal: controller.signal });
      const result = response.status === 202 ? await response.json() : undefined;
      if (result?.accepted !== true) return 'failed';
      completed = true; return 'sent';
    } catch { return 'failed'; } finally { pending = false; clearTimeout(timer); }
  } };
}

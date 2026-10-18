import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error Edge Worker module, independently deployable.
import worker from '../infra/canonical-redirect/worker.mjs';

describe('apex-only canonical redirect candidate', () => {
  for (const path of ['/', '/de/', '/en/high-risk-ai-systems/', '/play/?lang=fr', '/es/?q=a%26b&lang=es']) {
    it(`preserves path and query: ${path}`, async () => {
      const response = await worker.fetch(new Request(`https://no-ai-act.eu${path}`));
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(`https://www.no-ai-act.eu${path}`);
    });
  }
  for (const host of ['www.no-ai-act.eu', 'beta.no-ai-act.eu', 'insights.no-ai-act.eu', 'example.com']) {
    it(`does not handle other hosts: ${host}`, async () => {
      expect((await worker.fetch(new Request(`https://${host}/`))).status).toBe(404);
    });
  }
  it('preserves methods that must not become GET', async () => {
    expect((await worker.fetch(new Request('https://no-ai-act.eu/test', { method: 'POST' }))).status).toBe(308);
    expect((await worker.fetch(new Request('http://no-ai-act.eu/', { method: 'HEAD' }))).status).toBe(301);
  });
  it('deploys only on the exact apex, without preview hosts or analytics', () => {
    const config = JSON.parse(readFileSync(new URL('../infra/canonical-redirect/wrangler.jsonc', import.meta.url), 'utf8'));
    expect(config.routes).toEqual([{ pattern: 'no-ai-act.eu/*', zone_name: 'no-ai-act.eu' }]);
    expect(config.workers_dev).toBe(false);
    expect(config.preview_urls).toBe(false);
    expect(config.observability.enabled).toBe(false);
  });
});

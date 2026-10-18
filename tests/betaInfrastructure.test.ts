import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { saveStorageKey } from '../src/game/systems/saveNamespace';
import { SaveSystem, defaultSave } from '../src/game/systems/SaveSystem';
import { handle } from '../analytics/worker';
import type { Env } from '../analytics/types';
import { savedLanguage } from '../src/mobileGuard';
const storage = new Map<string, string>();
beforeEach(() => {
  storage.clear(); vi.stubEnv('VITE_RELEASE_CHANNEL', 'beta');
  vi.stubGlobal('localStorage', { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe('beta storage boundary, unchanged save schema', () => {
  it('keeps exact production keys when not beta', () => {
    expect(saveStorageKey('no-ai-act-save-v2', 'production')).toBe('no-ai-act-save-v2');
    expect(saveStorageKey('no-ai-act-save-v1', '')).toBe('no-ai-act-save-v1');
  });
  it('does not read or migrate production saves', () => {
    storage.set('no-ai-act-save-v2', JSON.stringify({ ...defaultSave(), language: 'fr', completedCases: { case_scoring: 'correct' } }));
    storage.set('no-ai-act-save-v1', JSON.stringify({ version: 1, language: 'en' }));
    expect(SaveSystem.load().language).toBe('it');
    expect(SaveSystem.load().completedCases).toEqual({});
    expect(storage.has('no-ai-act-beta-save-v2')).toBe(false);
  });
  it('writes and resets beta only, preserving every production byte', () => {
    storage.set('no-ai-act-save-v2', 'production-v2'); storage.set('no-ai-act-save-v1', 'production-v1');
    SaveSystem.save({ ...defaultSave(), language: 'fr' });
    expect(SaveSystem.load().language).toBe('fr'); expect(SaveSystem.load().version).toBe(2);
    SaveSystem.reset();
    expect(storage.get('no-ai-act-save-v2')).toBe('production-v2');
    expect(storage.get('no-ai-act-save-v1')).toBe('production-v1');
    expect(storage.has('no-ai-act-beta-save-v2')).toBe(false);
  });
  it('migrates beta legacy only without deleting the snapshot', () => {
    storage.set('no-ai-act-beta-save-v1', JSON.stringify({ version: 1, language: 'en' }));
    expect(SaveSystem.load().language).toBe('en');
    expect(storage.has('no-ai-act-beta-save-v2')).toBe(true);
    expect(storage.has('no-ai-act-beta-save-v1')).toBe(true);
  });
  it('the mobile guard also reads only the beta namespace', () => {
    storage.set('no-ai-act-save-v2', JSON.stringify({ version: 2, language: 'en' }));
    storage.set('no-ai-act-beta-save-v2', JSON.stringify({ version: 2, language: 'fr' }));
    expect(savedLanguage()).toBe('fr');
  });
});
describe('one worker, explicit host boundaries', () => {
  const env = { ADMIN_HOST: 'insights.no-ai-act.eu', COLLECTION_HOST: 'beta.no-ai-act.eu', COLLECTION_ENABLED: 'false' } as Env;
  it('never exposes admin endpoints or assets on beta/stable', async () => {
    for (const host of ['beta.no-ai-act.eu', 'www.no-ai-act.eu']) for (const path of ['/', '/api/stats', '/api/export.csv', '/dashboard.js']) {
      expect((await handle(new Request(`https://${host}${path}`), env)).status).toBe(404);
    }
  });
  it('requires real authentication on Insights and leaves collection disabled', async () => {
    expect((await handle(new Request('https://insights.no-ai-act.eu/api/stats'), env)).status).toBe(401);
    expect((await handle(new Request('https://insights.no-ai-act.eu/collect', { method: 'POST' }), env)).status).toBe(404);
    expect((await handle(new Request('https://beta.no-ai-act.eu/collect', { method: 'POST' }), env)).status).toBe(503);
  });
});

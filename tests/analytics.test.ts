import { describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import {
  ANALYTICS_EVENTS,
  Analytics,
  resolveProvider,
  sanitizeProperties,
  type AnalyticsTransport
} from '../src/game/systems/AnalyticsSystem';

function mockTransport(): { calls: { url: string; body: Record<string, unknown> }[]; fn: AnalyticsTransport } {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  return { calls, fn: (url, body) => calls.push({ url, body }) };
}

describe('resoluzione del provider', () => {
  it('produzione senza configurazione → off', () => {
    expect(resolveProvider({ dev: false })).toBe('off');
  });

  it('sviluppo senza configurazione → console', () => {
    expect(resolveProvider({ dev: true })).toBe('console');
  });

  it('provider remoto senza configurazione completa → off (mai inviare per sbaglio)', () => {
    expect(resolveProvider({ dev: false, provider: 'plausible' })).toBe('off');
    expect(resolveProvider({ dev: false, provider: 'umami' })).toBe('off');
    expect(resolveProvider({ dev: false, provider: 'umami', umamiWebsiteId: 'x' })).toBe('off');
  });

  it('provider configurato correttamente → attivo', () => {
    expect(resolveProvider({ dev: false, provider: 'plausible', plausibleDomain: 'example.org' })).toBe('plausible');
    expect(
      resolveProvider({ dev: false, provider: 'umami', umamiWebsiteId: 'id', umamiScriptUrl: 'https://u.example/script.js' })
    ).toBe('umami');
  });

  it('Do Not Track vince su qualsiasi configurazione', () => {
    expect(
      resolveProvider({ dev: true, provider: 'plausible', plausibleDomain: 'example.org', doNotTrack: true })
    ).toBe('off');
  });
});

describe('sanitizzazione proprietà', () => {
  it('scarta le proprietà fuori allowlist (nome, email, ip, userAgent, freeText…)', () => {
    const clean = sanitizeProperties({
      caseId: 'case_scoring',
      name: 'Mario Rossi',
      email: 'mario@example.org',
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0 …',
      school: 'Liceo X',
      freeText: 'testo libero',
      sessionId: 'abc-123'
    });
    expect(clean).toEqual({ caseId: 'case_scoring' });
  });

  it('scarta valori stringa sospetti anche su chiavi ammesse', () => {
    const clean = sanitizeProperties({
      language: 'it',
      caseId: 'qualcuno@example.org', // email infilata in chiave lecita
      normId: 'x'.repeat(200) // free text oltre soglia
    });
    expect(clean).toEqual({ language: 'it' });
  });

  it('ammette numeri e booleani sulle chiavi lecite', () => {
    expect(sanitizeProperties({ selectedClueCount: 2, musicEnabled: true })).toEqual({
      selectedClueCount: 2,
      musicEnabled: true
    });
  });
});

describe('Analytics', () => {
  it('off: nessun evento inviato, isEnabled false', () => {
    const t = mockTransport();
    const a = new Analytics({ dev: false }, t.fn);
    a.track('game_opened', { language: 'it' });
    a.page('title');
    expect(a.isEnabled()).toBe(false);
    expect(a.sentCount).toBe(0);
    expect(t.calls).toHaveLength(0);
  });

  it('enable() non riaccende un provider off', () => {
    const a = new Analytics({ dev: false });
    a.enable();
    expect(a.isEnabled()).toBe(false);
  });

  it('console adapter: logga e non usa la rete', () => {
    const t = mockTransport();
    const a = new Analytics({ dev: true }, t.fn);
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    a.track('case_started', { caseId: 'case_scoring' });
    a.page('map');
    expect(a.sentCount).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(t.calls).toHaveLength(0);
    spy.mockRestore();
  });

  it('disable()/enable() funzionano a runtime', () => {
    const a = new Analytics({ dev: true });
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    a.disable();
    a.track('game_opened');
    expect(a.sentCount).toBe(0);
    a.enable();
    a.track('game_opened');
    expect(a.sentCount).toBe(1);
    spy.mockRestore();
  });

  it('eventi fuori allowlist vengono scartati', () => {
    const a = new Analytics({ dev: true });
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    a.track('user_typed_name', { language: 'it' });
    a.track('session_replay_chunk');
    expect(a.sentCount).toBe(0);
    spy.mockRestore();
  });

  it('plausible: payload con solo proprietà ammesse e sanitizzate', () => {
    const t = mockTransport();
    const a = new Analytics({ dev: false, provider: 'plausible', plausibleDomain: 'noaiact.example' }, t.fn);
    a.track('case_result', {
      caseId: 'case_scoring',
      result: 'correct',
      email: 'x@y.z',
      name: 'Mario'
    });
    expect(t.calls).toHaveLength(1);
    const body = t.calls[0].body as { domain: string; name: string; props: Record<string, unknown> };
    expect(t.calls[0].url).toContain('plausible.io/api/event');
    expect(body.domain).toBe('noaiact.example');
    expect(body.name).toBe('case_result');
    expect(body.props).toEqual({ caseId: 'case_scoring', result: 'correct' });
  });

  it('umami: payload verso /api/send con data sanitizzata', () => {
    const t = mockTransport();
    const a = new Analytics(
      { dev: false, provider: 'umami', umamiWebsiteId: 'site-1', umamiScriptUrl: 'https://stats.example/script.js' },
      t.fn
    );
    a.track('ending_reached', { ending: 'ending_governata', completedCasesCount: 6, ip: '1.2.3.4' });
    expect(t.calls).toHaveLength(1);
    expect(t.calls[0].url).toBe('https://stats.example/api/send');
    const payload = (t.calls[0].body as { payload: { website: string; name: string; data: Record<string, unknown> } }).payload;
    expect(payload.website).toBe('site-1');
    expect(payload.name).toBe('ending_reached');
    expect(payload.data).toEqual({ ending: 'ending_governata', completedCasesCount: 6 });
  });
});

describe('strumentazione: ogni evento è invocato nel codice di gioco', () => {
  it('tutti gli eventi dichiarati compaiono in almeno una scena/sistema', () => {
    const dirs = ['../src/game/scenes', '../src/game/systems'];
    let allSource = '';
    for (const dir of dirs) {
      const base = new URL(`${dir}/`, import.meta.url);
      for (const file of readdirSync(base)) {
        allSource += readFileSync(new URL(file, base), 'utf-8');
      }
    }
    for (const event of ANALYTICS_EVENTS) {
      expect(allSource, `evento non strumentato: ${event}`).toContain(`'${event}'`);
    }
  });
});

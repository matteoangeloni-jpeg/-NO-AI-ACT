import { ANALYTICS_SCHEMA_VERSION, ANALYTICS_GAME_VERSION, ANALYTICS_LIMITS, EVENT_CATALOG, TUTORIAL_VERSION,
  sanitizeProperties, validatePayload, durationBucket, isCaseId, isEvidenceIndex,
  type AnalyticsContext, type AnalyticsPhase, type AnalyticsPayload, type AnalyticsAggregate,
  type AnalyticsProperties, type AnalyticsEvent, type AnalyticsResult } from './analyticsSchema';
import { usagePayload } from '../../../analytics/beta-usage';
export { ANALYTICS_EVENTS, ALLOWED_PROPERTIES, sanitizeProperties } from './analyticsSchema';
export type { AnalyticsEvent, AnalyticsProperties, AllowedProperty } from './analyticsSchema';

export type AnalyticsProvider = 'off' | 'console' | 'plausible' | 'umami' | 'first-party';
export interface AnalyticsConfig {
  provider?: string;
  dev: boolean;
  plausibleDomain?: string;
  umamiWebsiteId?: string;
  umamiScriptUrl?: string;
  doNotTrack?: boolean;
  /** Separate infrastructure approval, never inferred from provider environment variables. */
  remoteApproved?: boolean;
  approvedEndpoints?: readonly string[];
  releaseChannel?: string;
  origin?: string;
  collectionMode?: 'automatic';
}
export type AnalyticsTransport = (url: string, body: Record<string, unknown>) => void | Promise<void>;
const { cells: MAX_CELLS, count: MAX_COUNT } = ANALYTICS_LIMITS;
const BETA_USAGE_ENDPOINT = 'https://beta.no-ai-act.eu/collect';
const PUBLIC_USAGE_ENDPOINT = BETA_USAGE_ENDPOINT;
function endpoint(config: AnalyticsConfig): string | undefined {
  if (config.provider === 'first-party') return config.origin === 'https://www.no-ai-act.eu' ? PUBLIC_USAGE_ENDPOINT : BETA_USAGE_ENDPOINT;
  if (config.provider === 'plausible') return 'https://plausible.io/api/event';
  if (config.provider !== 'umami' || !config.umamiScriptUrl) return;
  try {
    const url = new URL(config.umamiScriptUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !url.pathname.endsWith('/script.js')) return;
    url.pathname = url.pathname.slice(0, -10) + '/api/send';
    return url.href;
  } catch { return; }
}
export function resolveProvider(config: AnalyticsConfig): AnalyticsProvider {
  if (config.doNotTrack) return 'off';
  if (config.provider === 'first-party') return ((config.releaseChannel === 'beta' && config.origin === new URL(BETA_USAGE_ENDPOINT).origin)
    || (config.releaseChannel === 'production' && config.origin === 'https://www.no-ai-act.eu')) && config.remoteApproved === true
    && config.approvedEndpoints?.includes(endpoint(config)!) ? 'first-party' : 'off';
  if (config.provider === 'off' || config.provider === 'console') return config.provider;
  if (config.provider === 'plausible' || config.provider === 'umami') {
    const url = endpoint(config);
    const configured = config.provider === 'plausible'
      ? !!config.plausibleDomain && config.plausibleDomain.length <= 253 && /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(config.plausibleDomain)
      : !!config.umamiWebsiteId && /^[a-z0-9_-]{1,64}$/i.test(config.umamiWebsiteId);
    return config.remoteApproved === true && url && configured && config.approvedEndpoints?.includes(url) ? config.provider : 'off';
  }
  return config.provider === undefined && config.dev ? 'console' : 'off';
}
const fetchTransport: AnalyticsTransport = async (url, body) => {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
    ...([BETA_USAGE_ENDPOINT, PUBLIC_USAGE_ENDPOINT].includes(url) ? { keepalive: true, redirect: 'error' as const, signal: AbortSignal.timeout(5000) } : {}) });
  if (!response.ok || response.headers.get('x-plausible-dropped') === '1') throw new Error('Analytics transport failed');
  if ([BETA_USAGE_ENDPOINT, PUBLIC_USAGE_ENDPOINT].includes(url) && (response.status !== 202 || (await response.json()).accepted !== true)) throw new Error('Usage batch not accepted');
};
interface Attempt {
  id: string;
  context: AnalyticsContext;
  started: number;
  completed: boolean;
  hintUsed: boolean;
  result?: AnalyticsResult;
  once: Set<AnalyticsEvent>;
  opened: Set<number>;
  cited: Set<number>;
}

/** Closed, bounded counters. No raw timeline, persistent identifiers or automatic flush. */
export class Analytics {
  readonly provider: AnalyticsProvider;
  private enabled: boolean;
  private readonly cells = new Map<string, AnalyticsAggregate>();
  private readonly documentOnce = new Set<AnalyticsEvent>();
  private readonly sessionOnce = new Set<AnalyticsEvent>();
  private session: { started: number; context: AnalyticsContext } | null = null;
  private attempt: Attempt | null = null;
  private phase: AnalyticsPhase = 'menu';
  private hasPage = false;
  private contextProvider: () => AnalyticsContext = () => ({ language: 'it', mode: 'turno' });
  private lastSelection = new Map<string, string>();
  private flushing = false;
  private generation = 0;
  private pendingUsage: { batchId: string; cells: AnalyticsAggregate[] } | null = null;
  private pendingUsageCreated = 0;
  private readonly config: AnalyticsConfig;
  sentCount = 0;
  readonly diagnostics = { accepted: 0, rejected: 0, duplicates: 0, droppedCells: 0, droppedCounts: 0, transportErrors: 0 };

  constructor(config: AnalyticsConfig, private readonly transport: AnalyticsTransport = fetchTransport,
    private readonly clock: () => number = () => performance.now()) {
    this.config = Object.freeze({ ...config, approvedEndpoints: Object.freeze([...(config.approvedEndpoints ?? [])]) });
    this.provider = resolveProvider(this.config);
    this.enabled = this.provider !== 'off' && (this.provider !== 'first-party' || config.collectionMode === 'automatic');
  }
  private now(): number { try { const n = this.clock(); return Number.isFinite(n) ? n : 0; } catch { return 0; } }
  private context(): AnalyticsContext {
    try {
      const c = sanitizeProperties(this.contextProvider() as unknown as Record<string, unknown>);
      return { language: c.language ?? 'it', mode: c.mode ?? 'turno' };
    } catch { return { language: 'it', mode: 'turno' }; }
  }
  setContextProvider(provider: () => AnalyticsContext): void { this.contextProvider = provider; }
  isEnabled(): boolean { return this.enabled && this.provider !== 'off'; }
  enable(): void { if (this.provider !== 'off') this.enabled = true; }
  disable(): void {
    this.enabled = false;
    this.generation++;
    this.pendingUsage = null;
    this.cells.clear(); this.documentOnce.clear(); this.sessionOnce.clear(); this.lastSelection.clear();
    this.session = null; this.attempt = null;
  }
  snapshot(): AnalyticsAggregate[] { return [...this.cells.values()].map(c => ({ ...c, properties: { ...c.properties } })); }

  startSession(kind: 'new' | 'resume'): void {
    if (!this.isEnabled()) return;
    const event = kind === 'new' ? 'game_started' : 'game_resumed';
    if (this.session && this.phase === 'menu' && this.sessionOnce.has(event)) {
      this.diagnostics.duplicates++;
      return;
    }
    this.endSession(true);
    this.sessionOnce.clear(); this.lastSelection.clear(); this.attempt = null;
    this.session = { started: this.now(), context: this.context() };
    this.track(event);
  }
  endSession(observedNavigation = false): void {
    if (!this.isEnabled() || !this.session) return;
    if (observedNavigation) this.abandonCase();
    this.track('game_session_ended', { ...this.session.context, durationBucket: durationBucket(this.now() - this.session.started) });
    this.session = null; this.attempt = null;
  }
  startCase(caseId: string): void {
    if (!this.isEnabled() || !isCaseId(caseId)) return;
    if (this.attempt?.id === caseId && !this.attempt.completed) return;
    if (!this.session) this.startSession('resume');
    this.abandonCase();
    this.attempt = { id: caseId, context: this.context(), started: this.now(), completed: false,
      hintUsed: false, once: new Set(), opened: new Set(), cited: new Set() };
    this.track('case_started', { caseId });
  }
  restoreEvidence(caseId: string, opened: readonly number[], cited: readonly number[]): void {
    if (!this.isEnabled() || this.attempt?.id !== caseId) return;
    for (const index of opened) if (isEvidenceIndex(caseId, index)) this.attempt.opened.add(index);
    for (const index of cited) if (isEvidenceIndex(caseId, index)) this.attempt.cited.add(index);
  }
  evidenceAction(caseId: string, index: number, opened: boolean, cited: boolean): void {
    if (!this.isEnabled() || this.attempt?.id !== caseId || this.attempt.completed || !isEvidenceIndex(caseId, index)) return;
    for (const [yes, seen, event] of [[opened, this.attempt.opened, 'evidence_opened'], [cited, this.attempt.cited, 'evidence_cited']] as const) {
      if (!yes || seen.has(index)) continue;
      seen.add(index);
      this.track(event, { caseId });
    }
  }
  completeSession(): void {
    if (this.session) this.track('session_completed', { durationBucket: durationBucket(this.now() - this.session.started) });
  }
  startReview(): void {
    if (!this.isEnabled()) return;
    if (!this.session) this.startSession('resume');
    this.track('review_started');
  }
  page(screenName: string): void {
    if (!this.isEnabled()) return;
    const names: Record<string, AnalyticsPhase> = { title: 'menu', briefing: 'briefing', map: 'map', case: 'case',
      evidence: 'evidence', incident: 'incident', decision: 'decision', report: 'report', consequence: 'consequence',
      norm: 'norm', archive: 'archive', glossary: 'glossary', 'session-end': 'session_end', finale: 'finale', learning: 'learning', credits: 'credits' };
    const next = names[screenName];
    if (!Object.prototype.hasOwnProperty.call(names, screenName)) { this.diagnostics.rejected++; return; }
    if (!['case', 'evidence', 'incident', 'decision', 'report', 'consequence', 'norm'].includes(next)) this.abandonCase();
    if (next === 'menu') this.endSession();
    if (next === this.phase && this.hasPage) return;
    this.hasPage = true;
    this.phase = next;
    this.track('pageview');
  }
  private abandonCase(): void {
    if (!this.attempt || this.attempt.completed) return;
    this.track('case_abandoned', { caseId: this.attempt.id, ...this.attempt.context });
    this.attempt = null;
  }

  track(eventName: AnalyticsEvent, properties?: Partial<AnalyticsProperties>): void {
    if (!this.isEnabled()) return;
    try { this.record(eventName, properties); }
    catch { this.diagnostics.rejected++; }
  }
  private record(eventName: string, properties?: Record<string, unknown>): void {
    if (!Object.prototype.hasOwnProperty.call(EVENT_CATALOG, eventName)) { this.diagnostics.rejected++; return; }
    const event = (eventName === 'case_result' ? 'case_completed' : eventName) as AnalyticsEvent;
    const r = EVENT_CATALOG[event];
    const clean = sanitizeProperties(properties);
    const caseId = clean.caseId ?? (r.optional.includes('caseId') ? this.attempt?.id : undefined);
    const a = caseId === this.attempt?.id ? this.attempt : null;
    if (r.required.includes('caseId') && !a) { this.diagnostics.rejected++; return; }
    const props: Record<string, unknown> = { ...this.context(), phase: this.phase };
    for (const key of ['language', 'mode', 'phase', ...r.required, ...r.optional] as const) {
      if (clean[key] !== undefined) props[key] = clean[key];
    }
    if (caseId) props.caseId = caseId;
    if (r.required.includes('tutorialVersion')) props.tutorialVersion = TUTORIAL_VERSION;
    if (a && r.required.includes('durationBucket')) props.durationBucket = durationBucket(this.now() - a.started);
    if (a && (r.required.includes('hintUsed') || r.optional.includes('hintUsed'))) props.hintUsed = a.hintUsed;
    if (a && event === 'debrief_opened') props.result = a.result;
    const payload: AnalyticsPayload = { schemaVersion: ANALYTICS_SCHEMA_VERSION, gameVersion: ANALYTICS_GAME_VERSION,
      event, properties: props as unknown as AnalyticsProperties };
    if (!validatePayload(payload)) { this.diagnostics.rejected++; return; }
    const seen = r.once === 'document' ? this.documentOnce : r.once === 'session' ? this.sessionOnce : r.once === 'case' ? a?.once : undefined;
    if (seen?.has(event)) { this.diagnostics.duplicates++; return; }
    if (event === 'language_selected' || event === 'mode_selected') {
      const selected = event === 'language_selected' ? payload.properties.language : payload.properties.mode;
      if (this.lastSelection.get(event) === selected) { this.diagnostics.duplicates++; return; }
      this.lastSelection.set(event, selected);
    }
    seen?.add(event);
    if (a && event === 'hint_requested') a.hintUsed = true;
    if (a && event === 'case_completed') { a.completed = true; a.result = payload.properties.result; }
    const stored = this.provider === 'first-party' ? usagePayload(payload) : payload;
    if (!stored) return;
    const key = JSON.stringify(stored);
    const cell = this.cells.get(key);
    if (!cell && this.cells.size >= MAX_CELLS) { this.diagnostics.droppedCells++; return; }
    const maxCount = this.provider === 'first-party' ? 100 : MAX_COUNT;
    if (cell && cell.count >= maxCount) { this.diagnostics.droppedCounts++; return; }
    if (cell) cell.count = Math.min(maxCount, cell.count + 1);
    else this.cells.set(key, { ...stored, count: 1 });
    this.diagnostics.accepted++;
    if (this.provider === 'console') {
      try { console.info('[analytics]', { cells: this.cells.size, accepted: this.diagnostics.accepted }); this.sentCount++; } catch { /* diagnostics cannot block play */ }
    }
  }

  /** Explicit aggregate delivery only. Failed cells remain bounded in memory. */
  async flush(): Promise<boolean> {
    if (!this.isEnabled() || this.flushing || this.provider === 'console') return false;
    const url = endpoint(this.config);
    if (!url || !this.config.remoteApproved || !this.config.approvedEndpoints?.includes(url)) return false;
    this.flushing = true;
    const generation = this.generation;
    let ok = true;
    try {
      if (this.provider === 'first-party') {
        if (this.pendingUsage && this.now() - this.pendingUsageCreated >= 23 * 3600000) {
          this.pendingUsage = null; this.cells.clear(); return false;
        }
        if (!this.pendingUsage) {
          const cells = this.snapshot().slice(0, 10);
          if (!cells.length) return true;
          this.pendingUsage = { batchId: crypto.randomUUID(), cells };
          this.pendingUsageCreated = this.now();
        }
        const pending = this.pendingUsage;
        try {
          await this.transport(url, pending as unknown as Record<string, unknown>);
          this.sentCount++;
          if (generation === this.generation) {
            for (const { count, ...cell } of pending.cells) {
              const key = JSON.stringify(cell); const current = this.cells.get(key);
              if (current && current.count <= count) this.cells.delete(key);
              else if (current) current.count -= count;
            }
            this.pendingUsage = null;
          }
          return true;
        } catch { this.diagnostics.transportErrors++; return false; }
      }
      for (const cell of this.snapshot()) {
        if (!this.isEnabled() || this.generation !== generation) break;
        const { properties, event, schemaVersion, gameVersion, count } = cell;
        const data = { schemaVersion, gameVersion, ...properties, count };
        const body = this.provider === 'plausible'
          ? { domain: this.config.plausibleDomain, name: event, url: `https://${this.config.plausibleDomain}/play/`, props: data }
          : { type: 'event', payload: { website: this.config.umamiWebsiteId, hostname: 'www.no-ai-act.eu', url: '/play/', name: event, data } };
        try {
          await this.transport(url, body);
          this.sentCount++;
          if (this.generation !== generation) continue;
          const key = JSON.stringify({ schemaVersion, gameVersion, event, properties });
          const current = this.cells.get(key);
          if (current && current.count <= count) this.cells.delete(key);
          else if (current) current.count -= count;
        } catch { this.diagnostics.transportErrors++; ok = false; }
      }
    } finally { this.flushing = false; }
    return ok;
  }
}

function envConfig(): AnalyticsConfig {
  const env = import.meta.env ?? {};
  const doNotTrack = typeof navigator !== 'undefined' &&
    (navigator.doNotTrack === '1' || (navigator as { msDoNotTrack?: string }).msDoNotTrack === '1'
      || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
  return { provider: env.VITE_ANALYTICS_PROVIDER as string | undefined, dev: Boolean(env.DEV), doNotTrack,
    plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN as string | undefined,
    umamiWebsiteId: env.VITE_UMAMI_WEBSITE_ID as string | undefined,
    umamiScriptUrl: env.VITE_UMAMI_SCRIPT_URL as string | undefined,
    releaseChannel: env.VITE_RELEASE_CHANNEL as string | undefined,
    origin: typeof location === 'undefined' ? undefined : location.origin,
    ...(env.VITE_ANALYTICS_PROVIDER === 'first-party' && ['beta', 'production'].includes(env.VITE_RELEASE_CHANNEL as string)
      ? { remoteApproved: true, approvedEndpoints: [BETA_USAGE_ENDPOINT, PUBLIC_USAGE_ENDPOINT], collectionMode: 'automatic' as const }
      : { remoteApproved: false, approvedEndpoints: [] }) };
}
export const AnalyticsSystem = new Analytics(envConfig());
export function betaUsagePrivacyNote(language: string): string | undefined {
  if (import.meta.env.VITE_ANALYTICS_PROVIDER !== 'first-party') return;
  const words: Record<string, string> = {
    it: 'Salvataggi e risposte restano sul dispositivo. Statistiche aggregate di utilizzo senza nomi o esiti sono attive automaticamente; puoi disattivarle nella barra Informativa statistiche.',
    en: 'Saves and answers stay on your device. Aggregate usage statistics without names or outcomes start automatically; you can disable them in the statistics notice bar.',
    fr: 'Sauvegardes et reponses restent sur votre appareil. Les statistiques agregees sans noms ni resultats sont automatiques ; vous pouvez les desactiver dans la barre de confidentialite.'
  };
  return words[language] ?? words.it;
}

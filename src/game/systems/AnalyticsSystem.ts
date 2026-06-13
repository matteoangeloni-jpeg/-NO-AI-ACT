/**
 * AnalyticsSystem — telemetria privacy-by-design.
 *
 * Principi:
 *  - allowlist rigida: solo eventi e proprietà elencati qui possono partire;
 *  - nessun identificativo del giocatore, nessun cookie, nessun fingerprinting,
 *    nessun session replay, nessun free text;
 *  - default: console in sviluppo, OFF in produzione salvo configurazione
 *    esplicita via variabili d'ambiente VITE_*;
 *  - rispetto del segnale Do Not Track del browser;
 *  - config e transport iniettabili → testabile in Node senza rete.
 *
 * Documentazione completa: docs/ANALYTICS.md
 */

export const ANALYTICS_EVENTS = [
  'game_opened',
  'game_started',
  'language_selected',
  'case_started',
  'evidence_opened',
  'clues_selected',
  'classification_selected',
  'measure_selected',
  'case_completed',
  'case_result',
  'norm_unlocked',
  'archive_opened',
  'ending_reached',
  'game_completed',
  'credits_opened',
  'reset_game'
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export const ALLOWED_PROPERTIES = [
  'language',
  'caseId',
  'locationId',
  'normId',
  'result',
  'classification',
  'measure',
  'selectedClueCount',
  'relevantClueCount',
  'ending',
  'completedCasesCount',
  'unlockedNormsCount',
  'musicEnabled',
  'reducedMotion'
] as const;

export type AllowedProperty = (typeof ALLOWED_PROPERTIES)[number];
export type AnalyticsProperties = Partial<Record<AllowedProperty, string | number | boolean>>;

export type AnalyticsProvider = 'off' | 'console' | 'plausible' | 'umami';

export interface AnalyticsConfig {
  /** Valore di VITE_ANALYTICS_PROVIDER (o assente). */
  provider?: string;
  /** true in `npm run dev`, false nelle build di produzione. */
  dev: boolean;
  plausibleDomain?: string;
  umamiWebsiteId?: string;
  umamiScriptUrl?: string;
  /** Segnale Do Not Track del browser: se attivo, tutto resta spento. */
  doNotTrack?: boolean;
}

/** Trasporto di rete iniettabile (fetch keepalive di default, mock nei test). */
export type AnalyticsTransport = (url: string, body: Record<string, unknown>) => void;

/** Lunghezza massima dei valori stringa: blocca free text per costruzione. */
const MAX_STRING_LENGTH = 64;

/**
 * Filtra le proprietà: scarta chiavi fuori allowlist e valori sospetti
 * (stringhe lunghe da free text, presenza di '@' da possibili email).
 */
export function sanitizeProperties(props: Record<string, unknown> | undefined): AnalyticsProperties {
  const clean: Record<string, string | number | boolean> = {};
  if (!props) return clean;
  for (const key of ALLOWED_PROPERTIES) {
    const value = props[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
      continue;
    }
    if (typeof value === 'string') {
      if (value.length > MAX_STRING_LENGTH) continue; // free text non ammesso
      if (value.includes('@')) continue; // possibile email
      clean[key] = value;
    }
    // oggetti/array: mai ammessi
  }
  return clean;
}

/**
 * Determina il provider effettivo.
 *  - DNT attivo → off, sempre;
 *  - provider esplicito valido e configurato → quello;
 *  - provider remoto senza configurazione → off (mai inviare per sbaglio);
 *  - nessuna configurazione → console in dev, off in produzione.
 */
export function resolveProvider(config: AnalyticsConfig): AnalyticsProvider {
  if (config.doNotTrack) return 'off';
  switch (config.provider) {
    case 'off':
      return 'off';
    case 'console':
      return 'console';
    case 'plausible':
      return config.plausibleDomain ? 'plausible' : 'off';
    case 'umami':
      return config.umamiWebsiteId && config.umamiScriptUrl ? 'umami' : 'off';
    default:
      return config.dev ? 'console' : 'off';
  }
}

const fetchTransport: AnalyticsTransport = (url, body) => {
  try {
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    });
  } catch {
    // l'analytics non deve mai rompere il gioco
  }
};

export class Analytics {
  readonly provider: AnalyticsProvider;
  private enabled: boolean;
  private readonly config: AnalyticsConfig;
  private readonly transport: AnalyticsTransport;
  /** Conteggio eventi inviati (per test e debug; nessun contenuto ritenuto). */
  sentCount = 0;

  constructor(config: AnalyticsConfig, transport: AnalyticsTransport = fetchTransport) {
    this.config = config;
    this.provider = resolveProvider(config);
    this.enabled = this.provider !== 'off';
    this.transport = transport;
  }

  isEnabled(): boolean {
    return this.enabled && this.provider !== 'off';
  }

  enable(): void {
    if (this.provider !== 'off') this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  /** Traccia un evento dell'allowlist con proprietà sanitizzate. */
  track(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.isEnabled()) return;
    if (!(ANALYTICS_EVENTS as readonly string[]).includes(eventName)) return; // evento sconosciuto: scartato
    const props = sanitizeProperties(properties);
    this.dispatch(eventName, props);
  }

  /** Registra la visualizzazione di una schermata (nome scena, nessun dato utente). */
  page(screenName: string): void {
    if (!this.isEnabled()) return;
    if (screenName.length > MAX_STRING_LENGTH) return;
    this.dispatch('pageview', {}, screenName);
  }

  private dispatch(name: string, props: AnalyticsProperties, screen?: string): void {
    this.sentCount += 1;
    if (this.provider === 'console') {
      console.info(`[analytics] ${name}${screen ? ` screen=${screen}` : ''}`, props);
      return;
    }
    const path = screen ? `/${screen}` : currentPath();
    if (this.provider === 'plausible') {
      this.transport('https://plausible.io/api/event', {
        domain: this.config.plausibleDomain,
        name,
        url: `https://${this.config.plausibleDomain}${path}`,
        props
      });
      return;
    }
    if (this.provider === 'umami') {
      const base = (this.config.umamiScriptUrl ?? '').replace(/\/[^/]*\.js$/, '').replace(/\/$/, '');
      this.transport(`${base}/api/send`, {
        type: 'event',
        payload: {
          website: this.config.umamiWebsiteId,
          hostname: currentHostname(),
          url: path,
          name,
          data: props
        }
      });
    }
  }
}

/** Path corrente senza query string né hash (evita PII accidentale negli URL). */
function currentPath(): string {
  if (typeof location === 'undefined') return '/';
  return location.pathname;
}

function currentHostname(): string {
  return typeof location === 'undefined' ? 'localhost' : location.hostname;
}

function envConfig(): AnalyticsConfig {
  const env = import.meta.env ?? {};
  const dnt =
    typeof navigator !== 'undefined' &&
    (navigator.doNotTrack === '1' || (navigator as { msDoNotTrack?: string }).msDoNotTrack === '1');
  return {
    provider: env.VITE_ANALYTICS_PROVIDER as string | undefined,
    dev: Boolean(env.DEV),
    plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN as string | undefined,
    umamiWebsiteId: env.VITE_UMAMI_WEBSITE_ID as string | undefined,
    umamiScriptUrl: env.VITE_UMAMI_SCRIPT_URL as string | undefined,
    doNotTrack: dnt
  };
}

/** Istanza globale usata dalle scene. */
export const AnalyticsSystem = new Analytics(envConfig());

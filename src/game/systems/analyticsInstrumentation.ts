import type { Analytics } from './AnalyticsSystem';
import { isCaseId, type AnalyticsContext } from './analyticsSchema';

interface EventBus {
  on(event: string, listener: (signal: unknown) => void): unknown;
  off(event: string, listener: (signal: unknown) => void): unknown;
}
const installed = new WeakMap<Analytics, () => void>();
/** Subscribe once to existing UX signals; no second emitter or game state. */
export function installAnalyticsInstrumentation(bus: EventBus, analytics: Analytics, context: () => AnalyticsContext,
  lifecycle: Pick<Window, 'addEventListener' | 'removeEventListener'>): () => void {
  const previous = installed.get(analytics);
  if (previous) return previous;
  analytics.setContextProvider(context);
  const ux = (value: unknown): void => {
    try {
      if (!value || typeof value !== 'object') return;
      const signal = value as { event?: unknown; caseId?: unknown };
      if (signal.event === 'review_started') { analytics.startReview(); return; }
      if (!isCaseId(signal.caseId)) return;
      switch (signal.event) {
        case 'tutorial_started': case 'tutorial_skipped': case 'tutorial_completed':
        case 'citation_error': case 'debrief_opened':
          analytics.track(signal.event, { caseId: signal.caseId }); break;
        case 'help_requested': analytics.track('hint_requested', { caseId: signal.caseId }); break;
      }
    } catch { analytics.diagnostics.rejected++; }
  };
  const exit = (event: PageTransitionEvent): void => { if (!event.persisted) analytics.endSession(); };
  bus.on('gameplay-ux', ux);
  lifecycle.addEventListener('pagehide', exit as EventListener);
  const dispose = (): void => {
    bus.off('gameplay-ux', ux); lifecycle.removeEventListener('pagehide', exit as EventListener);
    installed.delete(analytics);
  };
  installed.set(analytics, dispose);
  return dispose;
}

import { LOCALES } from './game/i18n';
import type { LanguageCode } from './game/data/types';

/**
 * Mobile guard: overlay puramente DOM/CSS (nessun canvas, nessun backend,
 * nessun dato raccolto). Avvisa gli utenti smartphone in portrait che il gioco
 * è ottimizzato per desktop/tablet landscape. Scompare ruotando il dispositivo
 * o su schermi sufficientemente larghi. Non blocca mai il desktop.
 */

function savedLanguage(): LanguageCode {
  try {
    const raw = localStorage.getItem('no-ai-act-save-v1');
    if (raw) {
      const parsed = JSON.parse(raw) as { language?: string };
      if (parsed.language === 'en' || parsed.language === 'it') return parsed.language;
    }
  } catch {
    /* localStorage non disponibile */
  }
  if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('en')) return 'en';
  return 'it';
}

/** true quando l'overlay deve essere mostrato (telefono in portrait o molto stretto). */
export function shouldShowMobileGuard(width: number, height: number): boolean {
  const portrait = height >= width;
  return (width < 760 && portrait) || width < 560;
}

export function initMobileGuard(): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('mobile-guard');
  if (!el) return;
  const msg = el.querySelector<HTMLElement>('.mg-msg');

  const update = (): void => {
    if (msg) msg.textContent = LOCALES[savedLanguage()].ui.mobileGuard.message;
    el.style.display = shouldShowMobileGuard(window.innerWidth, window.innerHeight) ? 'flex' : 'none';
  };

  update();
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
}

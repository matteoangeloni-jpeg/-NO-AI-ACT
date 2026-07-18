import { LOCALES } from './game/i18n';
import type { LanguageCode } from './game/data/types';

/**
 * Mobile guard: overlay puramente DOM/CSS (nessun canvas, nessun backend,
 * nessun dato raccolto). Avvisa gli utenti smartphone in portrait che il gioco
 * è ottimizzato per desktop/tablet landscape. Scompare ruotando il dispositivo
 * o su schermi sufficientemente larghi. Non blocca mai il desktop.
 */

export function savedLanguage(): LanguageCode {
  try {
    // schema v2 prima, con fallback allo snapshot v1 pre-migrazione
    for (const key of ['no-ai-act-save-v2', 'no-ai-act-save-v1']) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { language?: string };
        if (parsed.language === 'en' || parsed.language === 'it') return parsed.language;
      }
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
  const continueBtn = el.querySelector<HTMLButtonElement>('.mg-continue');
  // fallback dichiarato, non un blocco (§11.4): l'utente può proseguire
  // comunque con il canvas scalato; la scelta vale per la sessione corrente.
  let dismissed = false;

  const update = (): void => {
    const t = LOCALES[savedLanguage()].a11y;
    if (msg) msg.textContent = LOCALES[savedLanguage()].ui.mobileGuard.message;
    if (continueBtn) continueBtn.textContent = t.mobileContinue;
    const show = !dismissed && shouldShowMobileGuard(window.innerWidth, window.innerHeight);
    el.style.display = show ? 'flex' : 'none';
  };

  continueBtn?.addEventListener('click', () => {
    dismissed = true;
    update();
  });
  update();
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
}

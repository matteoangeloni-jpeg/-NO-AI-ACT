import type { Analytics } from '../systems/AnalyticsSystem';
import { createIcons, ShieldCheck, X } from 'lucide';
import './usageNotice.css';

export function initUsageNotice(analytics: Analytics): void {
  const words: Record<string, string[]> = {
    it: ['Statistiche aggregate attive', 'Statistiche disattivate', 'Informativa statistiche', 'Disattiva', 'Riattiva', 'Chiudi avviso'],
    en: ['Aggregate statistics active', 'Statistics disabled', 'Statistics privacy notice', 'Disable', 'Enable', 'Close notice'],
    fr: ['Statistiques agregees actives', 'Statistiques desactivees', 'Confidentialite des statistiques', 'Desactiver', 'Activer', 'Fermer la notification']
  };
  const bar = document.createElement('aside'); bar.id = 'game-usage';
  const status = document.createElement('span');
  const policy = document.createElement('a'); policy.target = '_blank'; policy.rel = 'noopener noreferrer';
  const toggle = document.createElement('button'); toggle.type = 'button'; toggle.id = 'usage-toggle';
  const close = document.createElement('button'); close.type = 'button'; close.id = 'usage-close';
  const reopen = document.createElement('button'); reopen.type = 'button'; reopen.id = 'usage-reopen'; reopen.hidden = true;
  close.innerHTML = '<i data-lucide="x"></i>';
  reopen.innerHTML = '<i data-lucide="shield-check"></i>';
  reopen.setAttribute('aria-controls', bar.id); reopen.setAttribute('aria-expanded', 'true');
  const update = () => {
    const lang = document.documentElement.lang in words ? document.documentElement.lang : 'it';
    const w = words[lang]; const active = analytics.isEnabled();
    status.textContent = w[active ? 0 : 1]; policy.textContent = w[2];
    policy.href = `/game-statistics.html#${lang}`; bar.setAttribute('aria-label', w[2]);
    toggle.textContent = w[active ? 3 : 4]; toggle.disabled = analytics.provider === 'off';
    close.title = w[5]; close.setAttribute('aria-label', w[5]);
    reopen.title = w[2]; reopen.setAttribute('aria-label', w[2]);
  };
  toggle.addEventListener('click', () => {
    if (analytics.isEnabled()) analytics.disable();
    else { analytics.enable(); analytics.track('game_opened'); }
    update();
  });
  // Stop game shortcuts while a notice control owns focus.
  bar.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); collapse(true); }
  });
  reopen.addEventListener('keydown', event => event.stopPropagation());
  bar.append(status, policy, toggle, close); document.body.prepend(bar); document.body.classList.add('usage-game');
  document.querySelector('#app')!.append(reopen);
  createIcons({ icons: { ShieldCheck, X }, root: document.body, attrs: { 'aria-hidden': 'true', focusable: 'false' } });
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  update();
  const measure = () => {
    const height = `${bar.getBoundingClientRect().height}px`;
    if (document.documentElement.style.getPropertyValue('--usage-bar-height') === height) return;
    document.documentElement.style.setProperty('--usage-bar-height', height);
    window.dispatchEvent(new Event('resize'));
  };
  // Reserve the measured row before Phaser reads its initial parent size.
  measure();
  new ResizeObserver(measure).observe(bar);
  let timer: ReturnType<typeof setTimeout>;
  function collapse(restoreFocus = false) {
    clearTimeout(timer);
    bar.hidden = true; reopen.hidden = false; reopen.setAttribute('aria-expanded', 'false');
    measure();
    if (restoreFocus) reopen.focus();
  }
  close.addEventListener('click', () => collapse(true));
  reopen.addEventListener('click', () => {
    clearTimeout(timer);
    bar.hidden = false; reopen.hidden = true; reopen.setAttribute('aria-expanded', 'true');
    measure(); close.focus();
  });
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (!bar.contains(document.activeElement)) collapse(); }, 8000);
  };
  bar.addEventListener('pointerenter', () => clearTimeout(timer));
  bar.addEventListener('pointerleave', schedule);
  bar.addEventListener('focusin', () => clearTimeout(timer));
  bar.addEventListener('focusout', event => { if (!bar.contains(event.relatedTarget as Node | null)) schedule(); });
  schedule();
}

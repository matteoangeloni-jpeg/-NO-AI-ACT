import type { Analytics } from '../systems/AnalyticsSystem';
import './usageNotice.css';

export function initUsageNotice(analytics: Analytics): void {
  const words: Record<string, string[]> = {
    it: ['Statistiche aggregate attive', 'Statistiche disattivate', 'Informativa statistiche', 'Disattiva', 'Riattiva'],
    en: ['Aggregate statistics active', 'Statistics disabled', 'Statistics privacy notice', 'Disable', 'Enable'],
    fr: ['Statistiques agregees actives', 'Statistiques desactivees', 'Confidentialite des statistiques', 'Desactiver', 'Activer']
  };
  const bar = document.createElement('aside'); bar.id = 'game-usage';
  const status = document.createElement('span');
  const policy = document.createElement('a'); policy.target = '_blank'; policy.rel = 'noopener noreferrer';
  const toggle = document.createElement('button'); toggle.type = 'button'; toggle.id = 'usage-toggle';
  const update = () => {
    const lang = document.documentElement.lang in words ? document.documentElement.lang : 'it';
    const w = words[lang]; const active = analytics.isEnabled();
    status.textContent = w[active ? 0 : 1]; policy.textContent = w[2];
    policy.href = `/game-statistics.html#${lang}`; bar.setAttribute('aria-label', w[2]);
    toggle.textContent = w[active ? 3 : 4]; toggle.disabled = analytics.provider === 'off';
  };
  toggle.addEventListener('click', () => {
    if (analytics.isEnabled()) analytics.disable();
    else { analytics.enable(); analytics.track('game_opened'); }
    update();
  });
  // Stop game shortcuts while a notice control owns focus.
  bar.addEventListener('keydown', event => event.stopPropagation());
  bar.append(status, policy, toggle); document.body.prepend(bar); document.body.classList.add('usage-game');
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
}

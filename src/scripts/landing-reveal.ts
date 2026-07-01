/**
 * Landing scroll-reveal: progressive enhancement only.
 * Elements are fully visible by default (no-JS / crawlers see final state);
 * this only adds a one-shot entrance class once an element scrolls into view.
 * No game state, no analytics, no external requests.
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length > 0) {
    targets.forEach((el) => el.classList.add('reveal-pending'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.remove('reveal-pending');
          el.classList.add(`is-visible-${el.dataset.reveal}`);
          io.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    targets.forEach((el) => io.observe(el));
  }
}

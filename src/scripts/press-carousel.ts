import { ArrowLeft, ArrowRight, createIcons } from 'lucide';

const track = document.querySelector<HTMLUListElement>('#press-track');
const controls = document.querySelector<HTMLDivElement>('.press-controls');
if (track && controls) {
  const previous = controls.querySelector<HTMLButtonElement>('[data-press-prev]')!;
  const next = controls.querySelector<HTMLButtonElement>('[data-press-next]')!;
  const position = controls.querySelector<HTMLElement>('.press-position')!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.press-item'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const offset = (card: HTMLElement) => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  const nearest = () => cards.reduce((best, card, i) => Math.abs(offset(card) - track.scrollLeft) < Math.abs(offset(cards[best]) - track.scrollLeft) ? i : best, 0);
  const update = () => {
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 3;
    position.textContent = `${String(nearest() + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  };
  const move = (index: number) => track.scrollTo({
    left: index >= cards.length ? track.scrollWidth : offset(cards[Math.max(0, index)]) - 2,
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
  previous.addEventListener('click', () => move(nearest() - 1));
  next.addEventListener('click', () => move(nearest() + 1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(cards.length);
    else move(nearest() + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame); frame = requestAnimationFrame(update);
  }, { passive: true });
  new ResizeObserver(update).observe(track);
  createIcons({ icons: { ArrowLeft, ArrowRight }, root: controls, attrs: { 'aria-hidden': 'true', focusable: 'false' } });
  controls.hidden = false;
  update();
}

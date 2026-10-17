import { ArrowLeft, ArrowRight, createIcons } from 'lucide';

const track = document.querySelector<HTMLUListElement>('#press-track');
const controls = document.querySelector<HTMLDivElement>('.press-controls');
if (track && controls) {
  const previous = controls.querySelector<HTMLButtonElement>('[data-press-prev]')!;
  const next = controls.querySelector<HTMLButtonElement>('[data-press-next]')!;
  const position = controls.querySelector<HTMLElement>('.press-position')!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>('.press-item'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let destination: number | null = null;
  const offset = (card: HTMLElement) => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
  const nearest = () => cards.reduce((best, card, i) => Math.abs(offset(card) - track.scrollLeft) < Math.abs(offset(cards[best]) - track.scrollLeft) ? i : best, 0);
  const targetLeft = (index: number) => Math.max(0, Math.min(offset(cards[index]) - 2, track.scrollWidth - track.clientWidth));
  const update = () => {
    if (destination !== null && Math.abs(track.scrollLeft - targetLeft(destination)) <= 3) destination = null;
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 3;
    position.textContent = `${String(nearest() + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  };
  const move = (index: number) => {
    destination = Math.max(0, Math.min(index, cards.length - 1));
    track.scrollTo({ left: targetLeft(destination), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  const step = (direction: number) => move((destination ?? nearest()) + direction);
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  for (const event of ['pointerdown', 'wheel', 'touchstart']) {
    track.addEventListener(event, () => { destination = null; }, { passive: true });
  }
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(cards.length);
    else step(event.key === 'ArrowRight' ? 1 : -1);
  });
  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame); frame = requestAnimationFrame(update);
  }, { passive: true });
  new ResizeObserver(() => { destination = null; update(); }).observe(track);
  createIcons({ icons: { ArrowLeft, ArrowRight }, root: controls, attrs: { 'aria-hidden': 'true', focusable: 'false' } });
  controls.hidden = false;
  update();
}

/** CSS viewport, not device identity: also supports desktop browser zoom. */
export function needsMobilePresentation(width: number, height: number): boolean {
  return width <= 1024 || (height <= 520 && width <= 1200);
}

export function mobilePresentationActive(): boolean {
  return typeof document !== 'undefined' && document.body.classList.contains('mobile-presentation');
}

export function initMobilePresentation(): void {
  const update = (): void => {
    const active = needsMobilePresentation(window.innerWidth, window.innerHeight);
    document.body.classList.toggle('mobile-presentation', active);
    const canvasHost = document.getElementById('game-container');
    if (active) canvasHost?.setAttribute('aria-hidden', 'true');
    else canvasHost?.removeAttribute('aria-hidden');
    if (!active) {
      const app = document.getElementById('app');
      for (const attr of ['role', 'aria-modal', 'aria-label']) app?.removeAttribute(attr);
      const back = document.getElementById('site-return');
      if (back) back.inert = false;
    }
  };
  update();
  window.addEventListener('resize', update);
}

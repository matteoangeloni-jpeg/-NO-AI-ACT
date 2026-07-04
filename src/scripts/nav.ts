/**
 * Structured site navigation — progressive enhancement only.
 *
 * The markup degrades without JS: submenus and the full menu are visible
 * (the `has-js` class, set inline in <head>, is what collapses them into
 * dropdowns + a mobile drawer). This module wires:
 *  - the mobile "Menu" drawer toggle;
 *  - click/keyboard submenu disclosure with aria-expanded;
 *  - Escape to close, click-outside to close, close-on-link-select.
 * No game state, no analytics, no external requests, no storage.
 */
const nav = document.querySelector<HTMLElement>('.site-nav');

if (nav) {
  const toggle = nav.querySelector<HTMLButtonElement>('.nav-toggle');
  const subButtons = Array.from(nav.querySelectorAll<HTMLButtonElement>('.nav-sub-btn'));

  const closeAllSubs = (except?: HTMLButtonElement): void => {
    for (const b of subButtons) {
      if (b !== except) b.setAttribute('aria-expanded', 'false');
    }
  };

  const closeDrawer = (): void => {
    if (!toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  // mobile drawer
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAllSubs();
  });

  // submenu disclosure
  for (const btn of subButtons) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAllSubs(open ? undefined : btn);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  // selecting a link closes the drawer and any open submenu
  nav.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      closeAllSubs();
      closeDrawer();
    }
  });

  // Escape closes submenus first, then the drawer, restoring focus sensibly
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openSub = subButtons.find((b) => b.getAttribute('aria-expanded') === 'true');
    if (openSub) {
      closeAllSubs();
      openSub.focus();
      return;
    }
    if (nav.classList.contains('open')) {
      closeDrawer();
      toggle?.focus();
    }
  });

  // clicking outside the nav closes everything
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target as Node)) {
      closeAllSubs();
      closeDrawer();
    }
  });
}

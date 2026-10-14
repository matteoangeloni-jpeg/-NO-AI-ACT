(() => {
  const words = {
    it: ['BETA 4.0 - Sperimentale', 'Feedback', 'Sito stabile', 'Feedback facoltativo', 'Non inserire dati personali. Il file resta locale e non viene inviato automaticamente.', 'Osservazione', 'Scarica feedback', 'Annulla'],
    en: ['BETA 4.0 - Experimental', 'Feedback', 'Stable site', 'Optional feedback', 'Do not include personal data. The file stays local and is not sent automatically.', 'Observation', 'Download feedback', 'Cancel'],
    fr: ['BETA 4.0 - Expérimentale', 'Retour', 'Site stable', 'Retour facultatif', 'Ne saisissez pas de données personnelles. Le fichier reste local et ne sera pas envoyé automatiquement.', 'Observation', 'Télécharger le retour', 'Annuler']
  };
  const create = (tag, attrs = {}) => {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
    return element;
  };
  const banner = create('aside', { id: 'beta-banner', 'aria-label': 'NO AI ACT Beta' });
  const badge = create('strong'); const open = create('button', { type: 'button' });
  const stable = create('a', { href: 'https://www.no-ai-act.eu/', rel: 'noreferrer' });
  banner.append(badge, open, stable);
  const dialog = create('dialog', { id: 'beta-feedback', 'aria-labelledby': 'beta-feedback-title' });
  const form = create('form', { method: 'dialog', autocomplete: 'off' });
  const title = create('h2', { id: 'beta-feedback-title' }); const notice = create('p', { id: 'beta-feedback-notice' });
  const label = create('label', { for: 'beta-feedback-text' });
  const text = create('textarea', { id: 'beta-feedback-text', maxlength: '2000', required: '', 'aria-describedby': 'beta-feedback-notice' });
  const actions = create('div', { class: 'beta-actions' });
  const download = create('button', { type: 'submit' }); const cancel = create('button', { type: 'button' });
  actions.append(download, cancel); form.append(title, notice, label, text, actions); dialog.append(form);
  document.body.prepend(banner); document.body.append(dialog);
  document.body.classList.add(document.getElementById('app') ? 'beta-game' : 'beta-page');
  const language = () => words[document.documentElement.lang] ? document.documentElement.lang : 'it';
  const update = () => {
    const w = words[language()]; [badge, open, stable, title, notice, label, download, cancel].forEach((el, i) => { el.textContent = w[i]; });
    banner.lang = language(); dialog.lang = language();
  };
  update(); new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const resize = () => document.documentElement.style.setProperty('--beta-banner-height', `${banner.getBoundingClientRect().height}px`);
  new ResizeObserver(resize).observe(banner); resize();
  // A native modal must not send typing or shortcut keys to Phaser behind it.
  window.addEventListener('keydown', event => {
    if (!dialog.open && !banner.contains(event.target)) return;
    event.stopImmediatePropagation();
    if (dialog.open && event.key === 'Escape') { event.preventDefault(); dialog.close(); }
  }, true);
  const app = document.getElementById('app'); let previousInert = false;
  open.addEventListener('click', () => { previousInert = app?.inert ?? false; if (app) app.inert = true; dialog.showModal(); text.focus(); });
  cancel.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (app) app.inert = previousInert; text.value = ''; open.focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!text.value.trim()) return;
    const payload = { version: '4.0-beta', language: language(), feedback: text.value.trim() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = create('a', { href: url, download: 'no-ai-act-beta-feedback.json' });
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); dialog.close();
  });
})();

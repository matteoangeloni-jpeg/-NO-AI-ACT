import { COPY, FORMS, LANGUAGES } from './materials.mjs';
import { StudySheet } from './model.mjs';

const root = document.querySelector('main');
let language = 'it'; let form = 'A'; let occasion = 'pre'; let sheet; let dirty = false;
function node(tag, text, parent = root) {
  const el = document.createElement(tag); if (text) el.textContent = text; parent.appendChild(el); return el;
}
function button(label, callback, parent = root) {
  const el = node('button', label, parent); el.type = 'button'; el.addEventListener('click', callback); return el;
}
function textField(labelText, name, onChange, parent = root, max = 3000) {
  const label = node('label', labelText, parent);
  const input = node('textarea', '', label); input.name = name; input.maxLength = max; input.rows = 3;
  input.addEventListener('input', () => { dirty = true; onChange(input.value); }); return input;
}
function select(labelText, name, options, selected, callback, parent) {
  const label = node('label', labelText, parent); const el = node('select', '', label); el.name = name;
  for (const [value, text] of options) el.add(new Option(text, value));
  el.value = selected; el.addEventListener('change', () => callback(el)); return el;
}
function render() {
  sheet = new StudySheet(form, language, occasion); dirty = false;
  const ui = COPY[language]; const material = FORMS[form][language];
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : language; document.title = ui.title;
  root.replaceChildren();
  node('h1', ui.title); node('p', ui.draft).className = 'notice'; node('p', ui.notice);
  const config = node('div'); config.className = 'config';
  function change(el, update) {
    if (dirty && !window.confirm(ui.resetConfirm)) { renderSelects(); return; }
    update(el.value); render();
  }
  const langSelect = select(ui.language, 'language', LANGUAGES.map(code => [code, { it: 'Italiano', en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', pt: 'Português', nl: 'Nederlands' }[code]]), language,
    el => change(el, value => { language = value; }), config);
  const formSelect = select(ui.form, 'form', ['A', 'B'].map(value => [value, value]), form,
    el => change(el, value => { form = value; }), config);
  const occasionSelect = select(ui.occasion, 'occasion', [['pre', ui.pre], ['post', ui.post]], occasion,
    el => change(el, value => { occasion = value; }), config);
  function renderSelects() { langSelect.value = language; formSelect.value = form; occasionSelect.value = occasion; }
  const nav = node('nav'); nav.setAttribute('aria-label', ui.title);
  const task = node('section'); task.id = 'participant';
  const observer = node('section'); observer.id = 'observer'; observer.hidden = true;
  const taskButton = button(ui.participant, () => show(false), nav);
  const observerButton = button(ui.observer, () => show(true), nav);
  taskButton.setAttribute('aria-controls', task.id); observerButton.setAttribute('aria-controls', observer.id);
  function show(observing) {
    task.hidden = observing; observer.hidden = !observing;
    taskButton.setAttribute('aria-pressed', String(!observing)); observerButton.setAttribute('aria-pressed', String(observing));
  }
  show(false);
  node('h2', material.title, task); node('p', material.scenario, task);
  for (const [title, text] of material.sources) {
    const doc = node('details', '', task); doc.className = 'source';
    node('summary', title, doc); node('p', text, doc);
  }
  const law = node('details', '', task); node('summary', ui.legal, law); node('p', ui.legalText, law);
  for (const [label, href] of [
    [ui.lawLink, 'https://eur-lex.europa.eu/eli/reg/2024/1689'],
    [ui.councilLink, 'https://search.coe.int/cm/eng?i=09125948802cde8e']
  ]) {
    const a = node('a', label, law); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
  }
  node('h3', ui.task, task); node('p', ui.prompt, task);
  const essay = textField(ui.answer, 'argument', value => sheet.writeAnswer(value), task, 12000); essay.rows = 10;
  const status = node('p', '', task); status.setAttribute('role', 'status');
  const seal = button(ui.seal, () => {
    if (!sheet.submit()) { status.textContent = ui.required; essay.focus(); return; }
    essay.readOnly = true; seal.disabled = true; status.textContent = ui.sealed;
    release.disabled = false;
    for (const control of [langSelect, formSelect, occasionSelect]) control.disabled = true;
  }, task);
  button(ui.print, () => window.print(), task);

  node('h2', ui.context, observer);
  textField(ui.contextPrompt, 'context', value => sheet.writeContext(value), observer, 6000);
  node('h2', ui.observation, observer);
  ui.observationRows.forEach((label, index) => {
    const block = node('fieldset', '', observer); node('legend', label, block);
    textField(ui.observed, `observed-${index}`, value => sheet.writeObservation(index, 'observed', value), block);
    textField(ui.interpretation, `interpretation-${index}`, value => sheet.writeObservation(index, 'interpretation', value), block);
  });
  node('h2', ui.rubric, observer); node('p', ui.noTotal, observer);
  ui.rubricRows.forEach((label, index) => {
    const block = node('fieldset', '', observer); node('legend', label, block);
    let rationale = ''; let code = null;
    select(label, `code-${index}`, ['', '0', '1', '2'].map((value, i) => [value, ui.anchors[i]]), '', el => {
      dirty = true; code = el.value === '' ? null : Number(el.value); sheet.code(index, code, rationale);
    }, block);
    textField(ui.rationale, `rationale-${index}`, value => { rationale = value; sheet.code(index, code, rationale); }, block);
  });
  textField(ui.legalJudgment, 'humanLegalReview', value => sheet.writeLegal(value), observer, 6000);
  node('h2', ui.guidance, observer); node('p', ui.afterOnly, observer);
  const guidance = node('p', '', observer); guidance.hidden = true;
  const release = button(ui.release, () => {
    guidance.textContent = ui.debrief; guidance.hidden = false;
  }, observer);
  release.disabled = true;
  const footer = node('footer'); node('p', ui.downloadNote, footer);
  const downloadStatus = node('p', '', footer); downloadStatus.setAttribute('role', 'status');
  button(ui.download, () => {
    const blob = new Blob([JSON.stringify(sheet.exportCopy(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `study02-${form}-${language}-${occasion}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); downloadStatus.textContent = ui.statusDownload;
  }, footer);
  button(ui.reset, () => { if (!dirty || window.confirm(ui.resetConfirm)) render(); }, footer);
}
render();
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });

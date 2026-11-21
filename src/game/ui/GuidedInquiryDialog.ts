import type Phaser from 'phaser';
import { caseText } from '../i18n';
import { GUIDED_COPY } from '../i18n/guidedInquiry';
import { GuidedInquiry, type ArgumentField } from '../systems/GuidedInquiry';
import { StateManager } from '../systems/StateManager';
import './guidedInquiry.css';

type InquiryStage = 'introduction' | 'investigation' | 'argument' | 'reflection' | 'session';

export function inquiryCopy() {
  GuidedInquiry.resetFor(StateManager.startedAt);
  return GUIDED_COPY[StateManager.language];
}

export function inquiryActive(caseId: string): boolean {
  inquiryCopy();
  return GuidedInquiry.active(caseId);
}

/** Native semantic dialog gives the writing surface the same keyboard/touch flow. */
export function openGuidedInquiry(
  scene: Phaser.Scene,
  caseId: string,
  stage: InquiryStage,
  onConfirm?: () => void
): void {
  if (document.querySelector('.guided-inquiry')) return;
  const ui = inquiryCopy();
  if (stage === 'introduction') GuidedInquiry.start(caseId);
  const notes = GuidedInquiry.read(caseId);
  if (!notes) return;
  const returnFocus = document.activeElement;
  const keyboard = scene.input.keyboard;
  const wasEnabled = keyboard?.enabled ?? false;
  if (keyboard) keyboard.enabled = false;

  const dialog = document.createElement('dialog');
  dialog.className = 'guided-inquiry';
  dialog.lang = StateManager.language;
  dialog.setAttribute('aria-labelledby', 'inquiry-title');
  const heading = document.createElement('h2');
  heading.id = 'inquiry-title';
  heading.textContent = stage === 'introduction' ? ui.introduction
    : stage === 'argument' ? ui.argument
    : stage === 'session' ? ui.finalDebrief
    : stage === 'reflection' ? ui.debrief : ui.notebook;
  heading.tabIndex = -1;
  dialog.appendChild(heading);

  function paragraph(text: string): void {
    const p = document.createElement('p');
    p.textContent = text;
    dialog.appendChild(p);
  }

  function display(label: string, value: string): void {
    const title = document.createElement('h3');
    title.textContent = label;
    dialog.appendChild(title);
    paragraph(value || ui.empty);
  }

  function field(key: ArgumentField | 'reflection'): void {
    const label = document.createElement('label');
    label.textContent = ui[key];
    const input = document.createElement('textarea');
    input.name = key;
    input.value = GuidedInquiry.read(caseId)?.[key] ?? '';
    input.readOnly = !!GuidedInquiry.submitted(caseId) && key !== 'reflection';
    input.maxLength = 1200;
    input.rows = 3;
    input.addEventListener('input', () => GuidedInquiry.write(caseId, key, input.value));
    label.appendChild(input);
    dialog.appendChild(label);
  }

  const argumentFields: ArgumentField[] = ['hypothesis', 'evidence', 'alternative', 'uncertainty'];
  paragraph(ui.privacy);
  paragraph(caseText(caseId).title);
  if (stage === 'introduction') {
    display(ui.colleague, ui.purpose);
    paragraph(ui.categories);
    paragraph(ui.demonstration);
    paragraph(caseText(caseId).scenario);
    paragraph(ui.mission);
    field('hypothesis');
  } else if (stage === 'reflection' || stage === 'session') {
    paragraph(ui.reflectionPrompt);
    const cases = stage === 'session' ? StateManager.gamePlan.caseIds : [caseId];
    for (const id of cases) {
      const previous = GuidedInquiry.submitted(id);
      const current = GuidedInquiry.read(id);
      if (!previous || !current) continue;
      display(caseText(id).title + ' — ' + ui.initial, current.initialHypothesis || ui.empty);
      for (const key of argumentFields) display(ui[key], previous[key]);
      if (stage === 'session') display(ui.reflection, current.reflection);
    }
    if (stage === 'reflection') field('reflection');
    paragraph(ui.transferPrompt);
  } else {
    display(ui.initial, notes.initialHypothesis);
    for (const key of argumentFields) field(key);
  }

  const actions = document.createElement('div');
  actions.className = 'inquiry-actions';
  dialog.appendChild(actions);
  const button = (text: string, action: () => void): void => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.addEventListener('click', action);
    actions.appendChild(b);
  };
  let closed = false;
  const close = (): void => {
    if (closed) return;
    closed = true;
    scene.events.off('shutdown', close);
    dialog.close();
    dialog.remove();
    if (keyboard) keyboard.enabled = wasEnabled;
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
  };
  const confirm = (): void => {
    if (stage === 'introduction') GuidedInquiry.finishIntroduction(caseId);
    if (stage === 'argument') GuidedInquiry.submit(caseId);
    close();
    onConfirm?.();
  };
  button(ui.close, close);
  if (onConfirm) button(stage === 'argument' ? ui.confirm : ui.continue, confirm);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  // Scene shortcuts must never turn Enter in a textarea into a signature.
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll<HTMLElement>('textarea, button')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  dialog.addEventListener('keyup', event => event.stopPropagation());
  scene.events.once('shutdown', close);
  document.body.appendChild(dialog);
  dialog.showModal();
  heading.focus();
}

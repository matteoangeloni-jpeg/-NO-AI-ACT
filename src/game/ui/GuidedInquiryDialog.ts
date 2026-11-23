import type Phaser from 'phaser';
import { getCase } from '../data/cases';
import { caseLearning } from '../data/learning';
import { L, caseText, normText, languageTag } from '../i18n';
import { GUIDED_COPY } from '../i18n/guidedInquiry';
import { caseInquiry } from '../i18n/inquiryCases';
import { GuidedInquiry, type ArgumentField, type PostFeedbackField, type SourceRelation } from '../systems/GuidedInquiry';
import { StateManager } from '../systems/StateManager';
import './guidedInquiry.css';

type InquiryStage = 'introduction' | 'method' | 'investigation' | 'argument' | 'reflection' | 'session';

export function inquiryCopy() {
  GuidedInquiry.resetFor(StateManager.startedAt);
  return GUIDED_COPY[StateManager.language];
}
export function inquiryActive(caseId: string): boolean {
  inquiryCopy();
  return GuidedInquiry.active(caseId);
}

/** Temporary notes; optional sharing is controlled by the separate session journal. */
export function openGuidedInquiry(scene: Phaser.Scene, caseId: string, stage: InquiryStage, onConfirm?: () => void): void {
  if (document.querySelector('.guided-inquiry')) return;
  const ui = inquiryCopy();
  if (stage === 'introduction') GuidedInquiry.start(caseId);
  if (!GuidedInquiry.read(caseId)) return;
  const scaffold = caseInquiry(caseId, StateManager.language);
  const returnFocus = document.activeElement;
  const keyboard = scene.input.keyboard;
  const wasEnabled = keyboard?.enabled ?? false;
  const wasPointerEnabled = scene.input.enabled;
  scene.input.enabled = false;
  if (keyboard) keyboard.enabled = false;
  const dialog = document.createElement('dialog');
  dialog.className = 'guided-inquiry';
  dialog.lang = languageTag(StateManager.language);
  dialog.dataset.stage = stage;
  dialog.dataset.case = caseId;
  dialog.setAttribute('aria-labelledby', 'inquiry-title');
  const heading = document.createElement('h2');
  heading.id = 'inquiry-title';
  heading.textContent = stage === 'introduction' ? ui.introduction
    : stage === 'argument' ? ui.argument : stage === 'method' ? ui.method
    : stage === 'session' ? ui.finalDebrief : stage === 'reflection' ? ui.debrief : ui.notebook;
  heading.tabIndex = -1;
  dialog.appendChild(heading);
  const content = document.createElement('div');
  dialog.appendChild(content);
  const actions = document.createElement('div');
  actions.className = 'inquiry-actions';
  dialog.appendChild(actions);

  function paragraph(text: string, parent: HTMLElement = content): void {
    const p = document.createElement('p'); p.textContent = text; parent.appendChild(p);
  }
  function display(label: string, value: string, parent: HTMLElement = content): void {
    const title = document.createElement('h3'); title.textContent = label; parent.appendChild(title);
    paragraph(value || ui.empty, parent);
  }
  function button(text: string, action: () => void, parent: HTMLElement = actions): HTMLButtonElement {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = text;
    b.addEventListener('click', action); parent.appendChild(b); return b;
  }
  function writing(labelText: string, name: string, value: string, change: (value: string) => void,
    parent: HTMLElement = content, readOnly = false): void {
    const label = document.createElement('label'); label.textContent = labelText;
    const input = document.createElement('textarea');
    input.name = name; input.value = value; input.readOnly = readOnly; input.maxLength = 1200; input.rows = 3;
    input.addEventListener('input', () => change(input.value)); label.appendChild(input); parent.appendChild(label);
  }
  function field(key: ArgumentField | PostFeedbackField, parent: HTMLElement = content): void {
    writing(ui[key], key, GuidedInquiry.read(caseId)?.[key] ?? '',
      value => GuidedInquiry.write(caseId, key, value), parent,
      !!GuidedInquiry.submitted(caseId) && !['reflection', 'feedbackUse', 'transferPlan'].includes(key));
  }
  function status(parent: HTMLElement): HTMLElement {
    const p = document.createElement('p'); p.setAttribute('role', 'status'); parent.appendChild(p); return p;
  }
  function details(label: string, parent: HTMLElement = content): HTMLDetailsElement {
    const el = document.createElement('details');
    const summary = document.createElement('summary'); summary.textContent = label;
    el.appendChild(summary); parent.appendChild(el); return el;
  }
  function sourceTitle(id: string, index: number): string {
    const texts = caseText(id); const source = texts.clueSources?.[index];
    return `${index + 1}. ${texts.clues[index].title}${source ? ' — ' + L().ui.evidence.sources[source] : ''}`;
  }
  function showRelations(id: string, parent: HTMLElement): void {
    const relations = GuidedInquiry.relations(id);
    if (!relations.length) paragraph(ui.empty, parent);
    relations.forEach((relation, index) => {
      const item = document.createElement('div'); item.className = 'inquiry-relation';
      paragraph(`${sourceTitle(id, relation.left)} ↔ ${sourceTitle(id, relation.right)}`, item);
      paragraph(`${ui[relation.relation]}: ${relation.reason}`, item);
      if (!GuidedInquiry.submitted(id)) button(ui.removeRelation, () => {
        GuidedInquiry.removeRelation(id, index); parent.replaceChildren(); showRelations(id, parent);
      }, item);
      parent.appendChild(item);
    });
  }
  function showRevisions(id: string, parent: HTMLElement): void {
    const revisions = GuidedInquiry.revisions(id);
    if (!revisions.length) paragraph(ui.empty, parent);
    revisions.forEach((revision, index) => paragraph(`${index + 1}. ${revision.hypothesis}\n${revision.reason}`, parent));
  }
  function sources(): void {
    display(ui.sources, scaffold.source);
    const texts = caseText(caseId);
    const opened = StateManager.draftFor(caseId)?.revealedClues ?? [];
    const available = [...new Set(opened)].filter(index => !!texts.clues[index]).sort((a, b) => a - b);
    if (!available.length) paragraph(ui.sourcesUnavailable);
    for (const index of available) {
      const item = details(`${ui.reread}: ${sourceTitle(caseId, index)}`);
      paragraph(texts.clues[index].text, item);
      writing(ui.sourceAssessment, `source-${index}`, GuidedInquiry.sourceNotes(caseId)[index] ?? '',
        value => GuidedInquiry.writeSource(caseId, index, value), item);
    }
    display(ui.relationTitle, scaffold.relation);
    const list = document.createElement('div'); content.appendChild(list); showRelations(caseId, list);
    if (available.length < 2) return;
    function select(labelText: string, name: string, options: Array<[string, string]>): HTMLSelectElement {
      const label = document.createElement('label'); label.textContent = labelText;
      const el = document.createElement('select'); el.name = name;
      for (const [value, text] of options) el.add(new Option(text, value));
      label.appendChild(el); content.appendChild(label); return el;
    }
    const options: Array<[string, string]> = available.map(index => [String(index), sourceTitle(caseId, index)]);
    const left = select(ui.leftSource, 'relation-left', options);
    const right = select(ui.rightSource, 'relation-right', options); right.selectedIndex = 1;
    const relation = select(ui.relationKind, 'relation-kind',
      (['supports', 'challenges', 'uncertain'] as SourceRelation[]).map(key => [key, ui[key]]));
    let reason = '';
    writing(ui.relationReason, 'relation-reason', '', value => { reason = value; });
    const message = status(content);
    button(ui.addRelation, () => {
      const saved = GuidedInquiry.relate(caseId, {
        left: Number(left.value), right: Number(right.value), relation: relation.value as SourceRelation, reason
      });
      message.textContent = saved ? ui.relationSaved : ui.relationRequired;
      if (saved) { list.replaceChildren(); showRelations(caseId, list); }
    }, content);
  }
  function revisions(): void {
    field('hypothesis'); field('revisionReason');
    const list = details(ui.revisions); showRevisions(caseId, list);
    const message = status(content);
    button(ui.recordRevision, () => {
      const saved = GuidedInquiry.recordRevision(caseId);
      message.textContent = saved ? ui.revisionSaved : ui.revisionRequired;
      if (saved) {
        const summary = list.querySelector('summary')!; list.replaceChildren(summary); showRevisions(caseId, list);
      }
    }, content);
  }
  const argumentFields: ArgumentField[] = ['hypothesis', 'revisionReason', 'evidence', 'reasoning', 'alternative', 'uncertainty'];
  function feedback(id: string, parent: HTMLElement): void {
    const previous = GuidedInquiry.submitted(id); const current = GuidedInquiry.read(id);
    if (!previous || !current) return;
    const note = details(ui.argument, parent); display(ui.initial, current.initialHypothesis, note);
    for (const key of argumentFields) display(ui[key], previous[key], note);
    for (const [index, value] of Object.entries(previous.sources)) display(sourceTitle(id, Number(index)), value, note);
    display(ui.relationTitle, '', note); showRelations(id, note);
    display(ui.revisions, '', note); showRevisions(id, note);
    const report = StateManager.caseReports[id];
    if (report) display(ui.choices, [L().classifications[report.classification], L().measures[report.measure],
      L().ui.subjects[report.subject], caseText(id).motivations[report.motivationIndex]].join('\n'), parent);
    const norm = normText(getCase(id).normId);
    display(ui.legalReference, `${norm.reference}\n${norm.explanation}`, parent);
    display(ui.takeaway, caseLearning(id).takeaway, parent);
    paragraph(caseInquiry(id, StateManager.language).debrief, parent);
    if (stage === 'session') for (const key of ['reflection', 'feedbackUse', 'transferPlan'] as PostFeedbackField[]) display(ui[key], current[key], parent);
  }

  let closed = false;
  const close = (): void => {
    if (closed) return; closed = true;
    GuidedInquiry.recordNotes(caseId,stage);
    scene.events.off('shutdown', close); dialog.close(); dialog.remove();
    scene.input.enabled = wasPointerEnabled;
    if (keyboard) keyboard.enabled = wasEnabled;
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
  };
  const confirm = (): void => {
    if (stage === 'introduction') GuidedInquiry.finishIntroduction(caseId);
    if (stage === 'argument') GuidedInquiry.submit(caseId);
    close(); onConfirm?.();
  };
  let page = 0;
  function introduction(): void {
    content.replaceChildren(); actions.replaceChildren(); paragraph(ui.privacy);
    display(`${page + 1}/3 — ${[ui.openingStage, ui.sourcesStage, ui.hypothesisStage][page]}`, caseText(caseId).title);
    if (page === 0) {
      paragraph(caseText(caseId).scenario); display(ui.colleague, scaffold.opening); paragraph(ui.purpose);
    } else if (page === 1) {
      paragraph(ui.demonstration); paragraph(scaffold.source); paragraph(ui.categories);
    } else {
      paragraph(ui.mission); field('hypothesis'); paragraph(scaffold.uncertainty);
    }
    button(ui.close, close);
    if (page > 0) button(ui.previous, () => { page -= 1; introduction(); heading.focus(); });
    if (page < 2) button(ui.next, () => { page += 1; introduction(); heading.focus(); });
    else button(ui.continue, confirm);
    dialog.scrollTop = 0;
  }
  if (stage === 'introduction') introduction();
  else {
    paragraph(ui.privacy); paragraph(caseText(caseId).title);
    if (stage === 'reflection' || stage === 'session') {
      paragraph(ui.reflectionPrompt);
      if (stage === 'session') {
        for (const id of GuidedInquiry.caseIds().filter(id => GuidedInquiry.submitted(id))) feedback(id, details(caseText(id).title));
        writing(ui.sessionReflection, 'sessionReflection', GuidedInquiry.sessionReflection, value => { GuidedInquiry.sessionReflection = value; });
        writing(ui.sessionTransferPlan, 'sessionTransferPlan', GuidedInquiry.sessionTransferPlan, value => { GuidedInquiry.sessionTransferPlan = value; });
      } else {
        feedback(caseId, content); field('reflection'); field('feedbackUse'); field('transferPlan');
      }
      paragraph(ui.assessmentNote); paragraph(ui.transferPrompt);
    } else if (stage === 'method') {
      display(ui.colleague, scaffold.opening); paragraph(scaffold.relation); paragraph(scaffold.uncertainty); paragraph(ui.categories);
    } else {
      display(ui.initial, GuidedInquiry.read(caseId)!.initialHypothesis);
      if (stage === 'investigation') {
        revisions(); sources();
        for (const key of ['evidence', 'reasoning', 'alternative', 'uncertainty'] as ArgumentField[]) field(key);
      } else {
        for (const key of argumentFields) field(key);
        const review = details(ui.sources);
        for (const [index, value] of Object.entries(GuidedInquiry.sourceNotes(caseId))) display(sourceTitle(caseId, Number(index)), value, review);
        showRelations(caseId, review); showRevisions(caseId, review);
      }
      paragraph(scaffold.uncertainty);
    }
    button(ui.close, close);
    if (onConfirm) button(stage === 'argument' ? ui.confirm : ui.resume, confirm);
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  // Phaser also listens for mouse/touch events on window, outside the canvas.
  // Native top-layer inertness alone does not stop those global listeners.
  for (const type of ['pointerdown', 'pointerup', 'pointermove', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove', 'click']) {
    dialog.addEventListener(type, event => event.stopPropagation());
  }
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll<HTMLElement>('textarea, select, button, summary')].filter(el => el.getClientRects().length > 0);
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading)) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('keyup', event => event.stopPropagation());
  scene.events.once('shutdown', close); document.body.appendChild(dialog); dialog.showModal(); heading.focus();
}

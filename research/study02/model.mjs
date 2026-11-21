import { FORMS, LANGUAGES, MATERIALS_VERSION, RUBRIC_IDS } from './materials.mjs';

/** Explicit local research sheet, independent from game saves and analytics. */
export class StudySheet {
  #answer = '';
  #submitted = null;
  #context = '';
  #observations = Array.from({ length: 7 }, () => ({ observed: '', interpretation: '' }));
  #rubric = Array.from({ length: 6 }, () => ({ code: null, rationale: '' }));
  #legal = '';
  constructor(form = 'A', language = 'it', occasion = 'pre') {
    if (!Object.hasOwn(FORMS, form) || !LANGUAGES.includes(language) || !['pre', 'post'].includes(occasion)) {
      throw new Error('Unknown study configuration');
    }
    this.form = form; this.language = language; this.occasion = occasion;
    Object.freeze(this);
  }
  get answer() { return this.#answer; }
  get submitted() { return this.#submitted; }
  writeAnswer(value) {
    if (this.#submitted !== null) return false;
    this.#answer = String(value).slice(0, 12000); return true;
  }
  submit() {
    if (this.#submitted !== null || !this.#answer.trim()) return false;
    this.#submitted = this.#answer; return true;
  }
  writeContext(value) { this.#context = String(value).slice(0, 6000); }
  writeObservation(index, field, value) {
    if (!Number.isInteger(index) || !this.#observations[index] || !['observed', 'interpretation'].includes(field)) return false;
    this.#observations[index][field] = String(value).slice(0, 3000); return true;
  }
  code(index, code, rationale) {
    if (!Number.isInteger(index) || !this.#rubric[index] || ![null, 0, 1, 2].includes(code)) return false;
    this.#rubric[index] = { code, rationale: String(rationale).slice(0, 3000) }; return true;
  }
  writeLegal(value) { this.#legal = String(value).slice(0, 6000); }
  exportCopy() {
    return { materialsVersion: MATERIALS_VERSION, form: this.form, language: this.language, occasion: this.occasion,
      submittedArgument: this.#submitted, context: this.#context,
      observations: this.#observations.map(row => ({ ...row })),
      humanRubric: this.#rubric.map((row, index) => ({ dimension: RUBRIC_IDS[index], ...row })), humanLegalReview: this.#legal };
  }
}

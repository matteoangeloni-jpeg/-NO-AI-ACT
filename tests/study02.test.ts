import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const modelPath = '../research/study02/model.mjs';
const materialsPath = '../research/study02/materials.mjs';
const { StudySheet } = await import(modelPath);
const { FORMS, COPY, LANGUAGES } = await import(materialsPath);

describe('independent Study 02 research sheet', () => {
  it('exports only the submitted argument and keeps later human coding separate', () => {
    const sheet = new StudySheet('B', 'fr', 'post');
    expect(sheet.submit()).toBe(false);
    sheet.writeAnswer('An operational log needs corroboration.');
    expect(sheet.exportCopy().submittedArgument).toBeNull();
    expect(sheet.submit()).toBe(true);
    expect(sheet.writeAnswer('Copy of debrief')).toBe(false);
    sheet.code(0, 0, 'Claim not explicit'); sheet.code(1, null, 'Not observed');
    sheet.writeObservation(0, 'observed', 'Returned to B3 and explained why');
    const copy = sheet.exportCopy();
    expect(copy.submittedArgument).toBe('An operational log needs corroboration.');
    expect(copy.humanRubric[0]).toEqual({ dimension: 'claim', code: 0, rationale: 'Claim not explicit' });
    expect(copy.humanRubric[1].code).toBeNull();
    copy.observations[0].observed = 'outside mutation';
    expect(sheet.exportCopy().observations[0].observed).toContain('B3');
    for (const key of ['participantId', 'score', 'total', 'timestamp']) expect(copy).not.toHaveProperty(key);
  });
  it('rejects unsupported configurations and automatic grading values', () => {
    expect(() => new StudySheet('C')).toThrow(); expect(() => new StudySheet('A', 'de')).toThrow();
    const sheet = new StudySheet();
    expect(sheet.code(0, 99, 'automatic')).toBe(false);
    expect(sheet.code(-1, 2, 'bad index')).toBe(false);
    sheet.writeAnswer('x'.repeat(13000)); expect(sheet.answer).toHaveLength(12000);
    expect(sheet.exportCopy().humanRubric.every((row: { code: unknown }) => row.code === null)).toBe(true);
  });
  it('supplies two held-out four-source tasks and all observation dimensions in each game language', () => {
    expect(Object.keys(FORMS)).toEqual(['A', 'B']);
    for (const language of LANGUAGES) {
      expect(COPY[language].observationRows).toHaveLength(7); expect(COPY[language].rubricRows).toHaveLength(6);
      for (const form of ['A', 'B']) {
        const material = FORMS[form][language];
        expect(material.sources).toHaveLength(4);
        for (const [title, text] of material.sources) { expect(title).toContain(form); expect(text.length).toBeGreaterThan(100); }
        expect(material).not.toHaveProperty('correctAnswer');
      }
    }
    const app = readFileSync(new URL('../research/study02/app.mjs', import.meta.url), 'utf8');
    expect(app).not.toMatch(/localStorage|sessionStorage|indexedDB|sendBeacon|fetch\(/);
  });
});

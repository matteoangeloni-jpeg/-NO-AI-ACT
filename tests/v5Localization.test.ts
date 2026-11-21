import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { LANGUAGE_CODES, LOCALES, setLanguage } from '../src/game/i18n';
import { GUIDED_COPY } from '../src/game/i18n/guidedInquiry';
import { INQUIRY_CASES, INQUIRY_CASE_IDS } from '../src/game/i18n/inquiryCases';
import { TEACHER_RESOURCES } from '../src/game/data/concepts';
import { buildTeacherReport, teacherReportToText } from '../src/game/systems/TeacherReportSystem';

const read = (path: string) => readFileSync(path, 'utf8');
const researchLanguages = JSON.parse(read('docs/v5/languages.json')).methodologyDossier as string[];
const documents = ['METHODOLOGY', 'LEGAL_LEARNING_MATRIX', 'COVERAGE_COMPLETION',
  'ARGUMENTATION_STUDY02', 'METHODOLOGY_TEST_PLAN', 'METHODOLOGY_IMPLEMENTATION', 'TEST_RESULTS'];
const documentPath = (language: string, name: string) => `docs/v5/${language === 'it' ? '' : `${language}/`}${name}.md`;

afterEach(() => setLanguage('it'));

describe('V5 learning texts have real translations, not Italian fallbacks', () => {
  for (const language of LANGUAGE_CODES.filter(code => code !== 'it')) {
    it(`${language}: translates every guided label and every support in all 14 cases`, () => {
      for (const key of Object.keys(GUIDED_COPY.it) as (keyof typeof GUIDED_COPY.it)[]) {
        expect(GUIDED_COPY[language][key], `${language}.${key}`).not.toBe(GUIDED_COPY.it[key]);
      }
      for (const id of INQUIRY_CASE_IDS) {
        for (const field of Object.keys(INQUIRY_CASES.it[id]) as (keyof typeof INQUIRY_CASES.it[typeof id])[]) {
          expect(INQUIRY_CASES[language][id][field], `${language}.${id}.${field}`).not.toBe(INQUIRY_CASES.it[id][field]);
        }
      }
    });
  }
});

describe('teacher guide resources and exports cover every playable language', () => {
  for (const language of LANGUAGE_CODES) {
    it(`${language}: offers activities and a lesson in each language with localized export captions`, () => {
      setLanguage(language);
      const labels = LOCALES[language].ui.teacherGuide.links;
      const report = buildTeacherReport({ caseReports: {}, indicators: { efficienza: 5, controllo: 5, diritti: 5, fiducia: 5 },
        unlockedNorms: [], endingId: null, startedAt: null, mission: 'full', difficulty: 'standard' });
      const text = teacherReportToText(report);
      const json = JSON.stringify(report);
      for (const target of LANGUAGE_CODES) {
        for (const kind of ['activities', 'lesson']) {
          const id = `${kind}_${target}` as keyof typeof labels;
          const resource = TEACHER_RESOURCES.find(item => item.id === id);
          expect(resource, `${language}: ${id}`).toBeDefined();
          expect(existsSync(resolve(resource!.url.slice(1), 'index.html'))).toBe(true);
          const html = read(resolve(resource!.url.slice(1), 'index.html'));
          expect(html).toContain(`<html lang="${target === 'pt' ? 'pt-PT' : target}"`);
          expect(labels[id]).toContain(`(${target.toUpperCase()})`);
          if (language !== 'it') expect(labels[id]).not.toBe(LOCALES.it.ui.teacherGuide.links[id]);
          const line = `${labels[id]} — https://www.no-ai-act.eu${resource!.url}`;
          expect(report.resources).toContain(line);
          expect(text).toContain(line);
          expect(json).toContain(line);
        }
      }
      expect(report.resources).toHaveLength(LANGUAGE_CODES.length * 2);
    });
  }
});

describe('the historical methodology dossier retains its declared research languages', () => {
  for (const language of researchLanguages) {
    it(`${language}: includes all seven substantial documents with working local navigation`, () => {
      const index = read('docs/v5/README.md');
      for (const name of documents) {
        const path = documentPath(language, name);
        expect(existsSync(path), path).toBe(true);
        const content = read(path);
        expect(content.split(/\s+/).length, path).toBeGreaterThan(250);
        expect(content).toContain('Italiano'); expect(content).toContain('English'); expect(content).toContain('Français');
        expect(index).toContain(language === 'it' ? `](${name}.md)` : `](${language}/${name}.md)`);
        for (const match of content.matchAll(/\]\(([^)]+\.md)\)/g)) {
          if (/^https?:/.test(match[1])) continue;
          expect(existsSync(resolve(dirname(path), match[1])), `${path}: ${match[1]}`).toBe(true);
        }
        if (language !== 'it') expect(content).not.toBe(read(documentPath('it', name)));
      }
    });

    it(`${language}: retains the 14 legal case identifiers, learning objectives and original bibliography`, () => {
      const matrix = read(documentPath(language, 'LEGAL_LEARNING_MATRIX'));
      for (const id of INQUIRY_CASE_IDS) expect(matrix).toContain(id);
      const method = read(documentPath(language, 'METHODOLOGY'));
      const original = read(documentPath('it', 'METHODOLOGY'));
      const identifiers = (text: string) => [...new Set(text.match(/LO\d\.\d\.\d+/g))].sort();
      const urls = (text: string) => [...new Set(text.match(/https?:\/\/[^\s)]+(?:%29[^\s)]*)?/g))].sort();
      expect(identifiers(method)).toEqual(identifiers(original));
      expect(urls(method)).toEqual(urls(original));
      expect(method).toContain('CEPAJe'); expect(method).toContain('LM–GM');
      expect(method).toContain('2024/1689'); expect(method).toContain('CM/Rec(2026)12');
    });

    it(`${language}: provides both V5 release notes and preserves the original screenshot version`, () => {
      for (const version of ['5.0.0', '5.0.1']) {
        const path = `docs/RELEASE_NOTES_v${version}${language === 'it' ? '' : `.${language}`}.md`;
        const notes = read(path);
        expect(notes).toContain(`v${version}`);
        expect(notes).toContain('Italiano'); expect(notes).toContain('Français');
      }
      const cfg = JSON.parse(read('release.config.json'));
      expect(existsSync(`public/assets/press/no-ai-act-v${cfg.pressScreenshotVersion}-press-screenshots.zip`)).toBe(true);
    });
  }
});

describe('current release notes describe all six playable languages', () => {
  for (const language of LANGUAGE_CODES) {
    it(`${language}: has localized current notes and working six-language navigation`, () => {
      const version = JSON.parse(read('package.json')).version;
      const path = `docs/RELEASE_NOTES_v${version}${language === 'it' ? '' : `.${language}`}.md`;
      const notes = read(path);
      expect(notes).toContain(`v${version}`);
      for (const name of ['Italiano', 'English', 'Français', 'Deutsch', 'Español', 'Português']) expect(notes).toContain(name);
      for (const match of notes.matchAll(/\]\(([^)]+\.md)\)/g)) {
        if (!/^https?:/.test(match[1])) expect(existsSync(resolve(dirname(path), match[1])), match[1]).toBe(true);
      }
      if (language !== 'it') expect(notes).not.toBe(read(`docs/RELEASE_NOTES_v${version}.md`));
    });
  }
});

describe('explicit manual deployment can honour the request to avoid smoke tests', () => {
  it('keeps browser checks enabled by default and restricts the four opt-outs to manual dispatch', () => {
    const workflow = read('.github/workflows/deploy.yml');
    expect(workflow).toMatch(/skip_browser_smoke:[\s\S]*?type: boolean\s+default: false/);
    const guards = workflow.match(/if: \$\{\{ !\(github\.event_name == 'workflow_dispatch' && inputs\.skip_browser_smoke\) \}\}/g) ?? [];
    expect(guards).toHaveLength(4);
    for (const command of ['npm run typecheck', 'npm test', 'npm run audit:seo', 'npm run build', 'npm run verify:dist']) {
      expect(workflow).toContain(`run: ${command}`);
    }
  });
});

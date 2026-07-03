import { describe, expect, it as test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CASES, PLAYABLE_CASES } from '../src/game/data/cases';
import {
  CONCEPT_IDS,
  CONCEPT_LINKS,
  FALLBACK_LINKS,
  TEACHER_RESOURCES,
  conceptLink,
  type ConceptId
} from '../src/game/data/concepts';
import {
  buildLearningReport,
  RECOMMENDED_LINKS_COUNT
} from '../src/game/systems/LearningReportSystem';
import { buildTeacherReport, teacherReportToText } from '../src/game/systems/TeacherReportSystem';
import { ANALYTICS_EVENTS } from '../src/game/systems/AnalyticsSystem';
import { it } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';
import { setLanguage } from '../src/game/i18n';
import type { OutcomeQuality } from '../src/game/data/types';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** Strip comments so source guards check executable code, not docstrings. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

// ============================ concept tagging ============================

describe('v1.1 — concept tagging of cases', () => {
  test('every playable case has at least one concept from the taxonomy', () => {
    for (const c of PLAYABLE_CASES) {
      expect(c.concepts.length, `${c.id} must have >=1 concept`).toBeGreaterThan(0);
      for (const concept of c.concepts) {
        expect(CONCEPT_IDS, `${c.id}: unknown concept ${concept}`).toContain(concept);
      }
    }
  });

  test('every concept of the taxonomy is exercised by at least one case', () => {
    const used = new Set(CASES.flatMap((c) => c.concepts));
    for (const id of CONCEPT_IDS) {
      expect(used.has(id), `concept ${id} is never used by a case`).toBe(true);
    }
  });

  test('concept tags do not duplicate within a case', () => {
    for (const c of PLAYABLE_CASES) {
      expect(new Set(c.concepts).size).toBe(c.concepts.length);
    }
  });
});

describe('v1.1 — concept links resolve to real site pages', () => {
  test('every concept link (IT and EN) points to an existing built page', () => {
    for (const id of CONCEPT_IDS) {
      for (const lang of ['it', 'en'] as const) {
        const url = conceptLink(id, lang);
        expect(url.startsWith('/'), `${id}/${lang}: internal path`).toBe(true);
        expect(url.includes('?'), `${id}/${lang}: no query strings`).toBe(false);
        expect(url).not.toMatch(/^https?:/);
        const file = resolve(root, url.replace(/^\//, ''), 'index.html');
        expect(existsSync(file), `${id}/${lang}: missing page ${url}`).toBe(true);
      }
    }
  });

  test('fallback links and teacher resources point to existing pages', () => {
    const all = [...FALLBACK_LINKS.it, ...FALLBACK_LINKS.en, ...TEACHER_RESOURCES.map((r) => r.url)];
    for (const url of all) {
      const file = resolve(root, url.replace(/^\//, ''), 'index.html');
      expect(existsSync(file), `missing page ${url}`).toBe(true);
    }
  });

  test('teacher resources include the four required pages', () => {
    const urls = TEACHER_RESOURCES.map((r) => r.url);
    for (const required of [
      '/attivita-didattiche/',
      '/lezione-introduzione-ai-act/',
      '/en/classroom-activities/',
      '/en/lesson-plan-introduction-to-the-ai-act/'
    ]) {
      expect(urls).toContain(required);
    }
  });
});

// ============================ learning report ============================

describe('v1.1 — final learning report logic', () => {
  const run = (cases: Record<string, OutcomeQuality>, lang: 'it' | 'en' = 'it') =>
    buildLearningReport(cases, lang);

  test('empty run: no concepts, no strongest/toReview, 3 general recommendations', () => {
    const r = run({});
    expect(r.completedCount).toBe(0);
    expect(r.concepts).toEqual([]);
    expect(r.strongest).toBeNull();
    expect(r.toReview).toBeNull();
    expect(r.recommended).toHaveLength(RECOMMENDED_LINKS_COUNT);
    expect(r.recommended.map((x) => x.url)).toEqual(FALLBACK_LINKS.it);
  });

  test('score line counts correct/partial/wrong', () => {
    const r = run({ case_scoring: 'correct', case_lavoro: 'partial', case_media: 'wrong' });
    expect(r.completedCount).toBe(3);
    expect(r.correct).toBe(1);
    expect(r.partial).toBe(1);
    expect(r.wrong).toBe(1);
    expect(r.totalPlayable).toBe(PLAYABLE_CASES.length);
  });

  test('weak concepts drive the recommendations, weakest first', () => {
    // case_media wrong → transparency + ai_literacy at 0; case_scoring correct → its concepts at 2
    const r = run({ case_scoring: 'correct', case_media: 'wrong' }, 'en');
    expect(r.strongest).not.toBeNull();
    expect(['prohibited_practices', 'risk_based_approach']).toContain(r.strongest);
    expect(['transparency', 'ai_literacy']).toContain(r.toReview);
    const first = r.recommended[0];
    expect(['transparency', 'ai_literacy']).toContain(first.concept);
    expect(first.url).toBe(CONCEPT_LINKS[first.concept as ConceptId].en);
  });

  test('all-perfect run: toReview is null and recommendations fall back', () => {
    const r = run({ case_scoring: 'correct', case_biometria: 'correct' });
    expect(r.toReview).toBeNull();
    expect(r.recommended).toHaveLength(RECOMMENDED_LINKS_COUNT);
    expect(r.recommended.every((x) => x.concept === null)).toBe(true);
  });

  test('always exactly 3 recommendations with unique internal URLs, per language', () => {
    const heavy: Record<string, OutcomeQuality> = {
      case_scoring: 'wrong',
      case_lavoro: 'wrong',
      case_media: 'wrong',
      case_gpai: 'partial',
      case_edtech: 'partial'
    };
    for (const lang of ['it', 'en'] as const) {
      const r = buildLearningReport(heavy, lang);
      expect(r.recommended).toHaveLength(RECOMMENDED_LINKS_COUNT);
      const urls = r.recommended.map((x) => x.url);
      expect(new Set(urls).size).toBe(urls.length);
      for (const url of urls) {
        expect(url.startsWith(lang === 'en' ? '/en/' : '/')).toBe(true);
        expect(url).not.toMatch(/^https?:/);
      }
    }
  });

  test('concepts are reported in taxonomy order with a 0..2 score', () => {
    const r = run({ case_gpai: 'partial', case_scoring: 'correct' });
    const ids = r.concepts.map((c) => c.id);
    expect(ids).toEqual(CONCEPT_IDS.filter((id) => ids.includes(id)));
    for (const c of r.concepts) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(2);
      expect(c.casesCount).toBeGreaterThan(0);
    }
  });
});

// ============================ i18n completeness ============================

describe('v1.1 — i18n completeness for the learning layer', () => {
  for (const [lang, L] of [['it', it], ['en', en]] as const) {
    test(`${lang}: concept labels exist for all 9 concepts`, () => {
      for (const id of CONCEPT_IDS) {
        expect(L.ui.concepts[id].trim().length, `${lang}.ui.concepts.${id}`).toBeGreaterThan(0);
      }
    });

    test(`${lang}: every playable case has a non-empty learning takeaway`, () => {
      const cards = L.caseLearning as Record<string, { takeaway: string }>;
      for (const c of PLAYABLE_CASES) {
        expect(cards[c.id].takeaway.trim().length, `${lang}.caseLearning.${c.id}.takeaway`).toBeGreaterThan(20);
      }
    });

    test(`${lang}: debrief carries concept/takeaway/learn-more labels`, () => {
      const d = L.ui.decisionDebrief;
      expect(d.conceptLabel.trim().length).toBeGreaterThan(0);
      expect(d.takeawayLabel.trim().length).toBeGreaterThan(0);
      expect(d.learnMore.trim().length).toBeGreaterThan(0);
    });

    test(`${lang}: learning report block is complete and educational`, () => {
      const r = L.ui.learningReport;
      for (const key of ['header', 'title', 'intro', 'scoreLabel', 'scoreLine', 'conceptsLabel', 'strongestLabel', 'reviewLabel', 'recommendedLabel', 'linkFor', 'disclaimer', 'back'] as const) {
        expect(String(r[key]).trim().length, `${lang}.ui.learningReport.${key}`).toBeGreaterThan(0);
      }
      expect(r.generalLinkLabels).toHaveLength(FALLBACK_LINKS[lang].length);
      // the disclaimer must state the educational, non-legal nature
      expect(r.disclaimer).toMatch(/2024\/1689/);
      expect(r.disclaimer.toLowerCase()).toMatch(/non costituisce|not legal|non è una consulenza|consulenza legale/);
    });

    test(`${lang}: teacher guide has before/during/after and 4 resource labels`, () => {
      const g = L.ui.teacherGuide;
      for (const key of ['button', 'title', 'intro', 'beforeTitle', 'beforeText', 'duringTitle', 'duringText', 'afterTitle', 'afterText', 'resourcesLabel', 'close'] as const) {
        expect(g[key].trim().length, `${lang}.ui.teacherGuide.${key}`).toBeGreaterThan(0);
      }
      for (const res of TEACHER_RESOURCES) {
        expect(g.links[res.id as keyof typeof g.links].trim().length, `${lang} label for ${res.id}`).toBeGreaterThan(0);
      }
    });

    test(`${lang}: discussion pause block exists and promises no recording`, () => {
      const p = L.ui.discussionPause;
      for (const key of ['button', 'title', 'intro', 'close'] as const) {
        expect(p[key].trim().length).toBeGreaterThan(0);
      }
      expect(p.intro.toLowerCase()).toMatch(/niente viene registrato|nothing is recorded/);
    });
  }
});

// ============================ teacher report ============================

describe('v1.1 — teacher report includes site resources', () => {
  const input = {
    caseReports: {},
    indicators: { efficienza: 5, controllo: 5, diritti: 5, fiducia: 5 },
    unlockedNorms: [],
    endingId: null,
    startedAt: null,
    mission: 'full' as const,
    difficulty: 'standard' as const
  };

  test('report and text export list the four teacher resources', () => {
    setLanguage('it');
    const report = buildTeacherReport(input);
    expect(report.resources).toHaveLength(TEACHER_RESOURCES.length);
    const txt = teacherReportToText(report);
    for (const res of TEACHER_RESOURCES) {
      expect(txt).toContain(`https://www.no-ai-act.eu${res.url}`);
    }
  });
});

// ============================ safeguards ============================

describe('v1.1 — privacy and safety guards', () => {
  const newFiles = [
    'src/game/data/concepts.ts',
    'src/game/systems/LearningReportSystem.ts',
    'src/game/scenes/LearningReportScene.ts',
    'src/game/ui/TeacherGuideOverlay.ts',
    'src/game/ui/DiscussionPauseOverlay.ts'
  ];

  test('no new telemetry, network calls or storage in the learning layer', () => {
    for (const p of newFiles) {
      const src = stripComments(read(p));
      for (const forbidden of ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'AnalyticsSystem', 'localStorage', 'sessionStorage', 'document.cookie']) {
        expect(src, `${p} must not use ${forbidden}`).not.toContain(forbidden);
      }
    }
  });

  test('learning layer opens only internal same-origin paths, with noopener', () => {
    for (const p of newFiles) {
      const src = stripComments(read(p));
      expect(src, `${p}: no external URLs`).not.toMatch(/https?:\/\//);
      for (const call of src.match(/window\.open\([^)]*\)/g) ?? []) {
        expect(call, `${p}: ${call}`).toContain('noopener');
      }
    }
  });

  test('no registration or login anywhere in the game source', () => {
    for (const p of newFiles) {
      const src = stripComments(read(p)).toLowerCase();
      for (const forbidden of ['login', 'signup', 'register', 'password', 'account']) {
        expect(src, `${p} must not mention ${forbidden}`).not.toContain(forbidden);
      }
    }
  });

  test('the analytics allowlist is unchanged (no new telemetry events)', () => {
    expect([...ANALYTICS_EVENTS]).toEqual([
      'game_opened',
      'game_started',
      'language_selected',
      'case_started',
      'evidence_opened',
      'clues_selected',
      'classification_selected',
      'measure_selected',
      'case_completed',
      'case_result',
      'norm_unlocked',
      'archive_opened',
      'ending_reached',
      'game_completed',
      'credits_opened',
      'reset_game'
    ]);
  });

  test('teacher mode needs no login: it is a plain local toggle', () => {
    const sm = read('src/game/systems/StateManager.ts');
    expect(sm).toContain('setTeacherMode(enabled: boolean)');
    const src = stripComments(sm).toLowerCase();
    for (const forbidden of ['fetch(', 'login', 'password', 'account']) {
      expect(src).not.toContain(forbidden);
    }
  });

  test('/play/ stays noindex, follow', () => {
    expect(read('play/index.html')).toContain('content="noindex, follow"');
  });
});

// ============================ wiring ============================

describe('v1.1 — learning feedback is wired into the flow', () => {
  test('ReportScene passes concept, takeaway and internal link to the debrief', () => {
    const src = read('src/game/scenes/ReportScene.ts');
    expect(src).toContain('this.caseData.concepts');
    expect(src).toContain('caseLearning(this.caseData.id).takeaway');
    expect(src).toContain('conceptLink(this.caseData.concepts[0]');
  });

  test('FinaleScene offers the learning report to every player', () => {
    const src = read('src/game/scenes/FinaleScene.ts');
    expect(src).toContain("this.scene.start('LearningReport')");
    expect(src).toContain('ui.finale.learningReport');
  });

  test('LearningReportScene is registered and shows recommendations + disclaimer', () => {
    expect(read('src/game/GameConfig.ts')).toContain('LearningReportScene');
    const src = read('src/game/scenes/LearningReportScene.ts');
    expect(src).toContain('buildLearningReport');
    expect(src).toContain('report.recommended');
    expect(src).toContain('ui.disclaimer');
  });

  test('teacher mode: discussion pause after each case, guide from the title', () => {
    const consequence = read('src/game/scenes/ConsequenceScene.ts');
    expect(consequence).toContain('DiscussionPauseOverlay');
    expect(consequence).toContain('StateManager.teacherMode');
    const title = read('src/game/scenes/TitleScene.ts');
    expect(title).toContain('TeacherGuideOverlay');
  });

  test('keyboard navigation: ENTER advances, ESC closes overlays', () => {
    expect(read('src/game/scenes/ReportScene.ts')).toContain('keydown-ENTER');
    expect(read('src/game/scenes/ConsequenceScene.ts')).toContain('keydown-ENTER');
    expect(read('src/game/scenes/NormCardScene.ts')).toContain('keydown-ENTER');
    expect(read('src/game/scenes/LearningReportScene.ts')).toContain('keydown-ESC');
    for (const p of ['src/game/ui/DecisionDebriefOverlay.ts', 'src/game/ui/TeacherGuideOverlay.ts', 'src/game/ui/DiscussionPauseOverlay.ts']) {
      expect(read(p)).toContain('keydown-ESC');
    }
  });
});

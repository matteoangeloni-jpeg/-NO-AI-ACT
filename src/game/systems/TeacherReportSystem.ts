import { PLAYABLE_CASES } from '../data/cases';
import { TEACHER_RESOURCES } from '../data/concepts';
import { NORMS } from '../data/norms';
import type { CaseReport, DifficultyMode, IndicatorState, MissionId, ReportOutcome } from '../data/types';
import { L, caseText } from '../i18n';
import { issueForError } from './DecisionIssues';
import { cityDossier } from './CityDossier';
import { conceptsForCases } from '../data/learning';

/**
 * Costruzione del report per la modalità docente.
 * SOLO dati di gioco: nessun nome, email, classe, scuola o identificativo.
 * Il report resta locale (download/stampa dal browser, nessuna rete).
 */

export interface TeacherReportInput {
  caseReports: Record<string, CaseReport>;
  indicators: IndicatorState;
  unlockedNorms: string[];
  endingId: string | null;
  startedAt: number | null;
  mission: MissionId;
  difficulty: DifficultyMode;
  now?: number;
}

export interface TeacherReportCaseRow {
  caseId: string;
  title: string;
  outcome: string;
  mainFinding: string;
  epilogue: string;
  /** Fragilità decisionale principale, localizzata (v0.5). null se conforme. */
  fragility: string | null;
}

/** Riga del fascicolo città, già localizzata (v0.5). */
export interface TeacherDossierLine {
  indicator: string;
  trend: string;
}

export interface TeacherReport {
  generator: string;
  mission: string;
  difficulty: string;
  cases: TeacherReportCaseRow[];
  normsUnlocked: number;
  normsTotal: number;
  indicators: IndicatorState;
  ending: string | null;
  completionMinutes: number | null;
  questions: string[];
  /** Concetti AI Act emersi nei casi chiusi (v0.5). */
  concepts: string[];
  /** Fascicolo città finale: effetti sistemici qualitativi (v0.5). */
  cityDossier: TeacherDossierLine[];
  /** Risorse didattiche del sito (v1.1): etichetta — URL assoluto. */
  resources: string[];
}

export function buildTeacherReport(input: TeacherReportInput): TeacherReport {
  const t = L();
  const rows: TeacherReportCaseRow[] = [];
  const questions: string[] = [];
  const completedIds: string[] = [];
  const outcomes: ReportOutcome[] = [];

  PLAYABLE_CASES.forEach((c, i) => {
    const texts = caseText(c.id);
    const report = input.caseReports[c.id];
    if (report) {
      completedIds.push(c.id);
      outcomes.push(report.outcome);
      rows.push({
        caseId: c.id,
        title: texts.title,
        outcome: t.ui.outcomes[report.outcome],
        mainFinding: report.dominantError ? t.ui.errors[report.dominantError] : t.ui.debrief.noError,
        epilogue: texts.epilogue,
        fragility: report.dominantError ? t.ui.report.issues[issueForError(report.dominantError)] : null
      });
      // una domanda per caso completato, a rotazione sulle tre disponibili
      if (questions.length < 3) questions.push(texts.debriefQuestions[i % 3]);
    }
  });

  const minutes =
    input.startedAt !== null ? Math.max(1, Math.round(((input.now ?? Date.now()) - input.startedAt) / 60000)) : null;

  const dossier: TeacherDossierLine[] = cityDossier(outcomes).map((l) => ({
    indicator: t.ui.cityDossier.indicators[l.indicator],
    trend: t.ui.cityDossier.trends[l.trend]
  }));

  return {
    generator: 'NO AI ACT — local teacher report',
    mission: t.ui.missions.modes[input.mission].name,
    difficulty: t.ui.difficulty.modes[input.difficulty].name,
    cases: rows,
    normsUnlocked: input.unlockedNorms.length,
    normsTotal: NORMS.length,
    indicators: { ...input.indicators },
    ending: input.endingId,
    completionMinutes: minutes,
    questions,
    concepts: conceptsForCases(completedIds),
    cityDossier: dossier,
    resources: TEACHER_RESOURCES.map(
      (r) => `${t.ui.teacherGuide.links[r.id as keyof typeof t.ui.teacherGuide.links]} — https://www.no-ai-act.eu${r.url}`
    )
  };
}

/** Serializzazione testuale per stampa/download .txt. */
export function teacherReportToText(report: TeacherReport): string {
  const t = L();
  const lines: string[] = [];
  lines.push(t.ui.debrief.title);
  lines.push(t.ui.debrief.subtitle);
  lines.push(t.ui.debrief.missionLine.replace('{mission}', report.mission));
  lines.push(t.ui.debrief.difficultyLine.replace('{difficulty}', report.difficulty));
  lines.push('');
  lines.push(`== ${t.ui.debrief.casesLabel} ==`);
  for (const row of report.cases) {
    lines.push(`- ${row.title} — ${row.outcome}`);
    lines.push(`  ${row.mainFinding}`);
    if (row.fragility) lines.push(`  ${t.ui.report.analysisLabel}: ${row.fragility}`);
    lines.push(`  ${row.epilogue}`);
  }
  lines.push('');
  lines.push(
    t.ui.debrief.normsLine.replace('{done}', String(report.normsUnlocked)).replace('{total}', String(report.normsTotal))
  );
  lines.push(
    report.completionMinutes !== null
      ? t.ui.debrief.timeLine.replace('{minutes}', String(report.completionMinutes))
      : t.ui.debrief.timeUnknown
  );
  lines.push('');
  lines.push(`== ${t.ui.debrief.indicatorsLabel} ==`);
  for (const key of ['efficienza', 'controllo', 'diritti', 'fiducia'] as const) {
    lines.push(`${t.indicators.labels[key]}: ${report.indicators[key]}`);
  }
  lines.push('');
  if (report.concepts.length > 0) {
    lines.push(`== ${t.ui.debrief.conceptsLabel} ==`);
    lines.push(report.concepts.join(' · '));
    lines.push('');
  }

  lines.push(`== ${t.ui.cityDossier.title} ==`);
  for (const line of report.cityDossier) {
    lines.push(`${line.indicator}: ${line.trend}`);
  }
  lines.push('');

  lines.push(`== ${t.ui.debrief.questionsLabel} ==`);
  report.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push('');
  lines.push(`${t.ui.debrief.reviewLabel}: ${t.ui.debrief.reviewLine}`);
  lines.push('');
  lines.push(`== ${t.ui.teacherGuide.resourcesLabel} ==`);
  for (const resource of report.resources) lines.push(`- ${resource}`);
  lines.push('');
  lines.push(t.ui.debrief.privacyNote);
  lines.push(t.ui.footerDisclaimer);
  return lines.join('\n');
}

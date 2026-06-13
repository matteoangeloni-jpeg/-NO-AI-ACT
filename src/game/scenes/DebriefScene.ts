import Phaser from 'phaser';
import { NORMS } from '../data/norms';
import { StateManager } from '../systems/StateManager';
import { buildTeacherReport, teacherReportToText } from '../systems/TeacherReportSystem';
import { INDICATOR_KEYS } from '../systems/IndicatorSystem';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { L, fmt } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

/**
 * Debrief docente: report LOCALE delle decisioni di gioco.
 * Nessun dato personale; export .txt/.json e stampa restano sul dispositivo.
 */
export class DebriefScene extends Phaser.Scene {
  constructor() {
    super('Debrief');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const t = L();
    const report = buildTeacherReport({
      caseReports: StateManager.caseReports,
      indicators: StateManager.indicators,
      unlockedNorms: StateManager.unlockedNorms,
      endingId: StateManager.endingId,
      startedAt: StateManager.startedAt
    });

    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    this.add.text(cx, 42, t.ui.debrief.title, textStyle(18, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(cx, 66, t.ui.debrief.subtitle, textStyle(12, COLOR_STR.paperDim)).setOrigin(0.5);

    new Panel(this, cx, GAME_HEIGHT / 2 + 14, 1080, 540);
    const left = cx - 510;
    let y = 102;

    this.add.text(left, y, t.ui.debrief.casesLabel, textStyle(12, COLOR_STR.accent));
    y += 22;
    // una riga per caso: il titolo+esito restano sempre leggibili, il rilievo
    // è troncato per non far traboccare il pannello con 6 casi completati
    for (const row of report.cases) {
      this.add.text(left, y, fmt(t.ui.debrief.caseLine, { title: row.title, outcome: row.outcome }), textStyle(12.5, COLOR_STR.paper));
      this.add.text(left + 440, y, truncate(row.mainFinding, 72), textStyle(12, COLOR_STR.paperDim));
      y += 22;
    }

    y += 6;
    this.add.text(left, y, fmt(t.ui.debrief.normsLine, { done: report.normsUnlocked, total: NORMS.length }), textStyle(12.5, COLOR_STR.paper));
    const timeLine = report.completionMinutes !== null ? fmt(t.ui.debrief.timeLine, { minutes: report.completionMinutes }) : t.ui.debrief.timeUnknown;
    this.add.text(left + 420, y, timeLine, textStyle(12.5, COLOR_STR.paper));
    const indicatorsLine = INDICATOR_KEYS.map((k) => `${t.indicators.labels[k]}: ${report.indicators[k]}`).join(' · ');
    y += 22;
    this.add.text(left, y, indicatorsLine, textStyle(12, COLOR_STR.paperDim));
    y += 28;

    this.add.text(left, y, t.ui.debrief.questionsLabel, textStyle(12, COLOR_STR.accent));
    y += 22;
    report.questions.forEach((q, i) => {
      const qt = this.add.text(left, y, `${i + 1}. ${q}`, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: 1020 }, lineSpacing: 4 }));
      y += qt.height + 8;
    });
    this.add.text(left, y, `${t.ui.debrief.reviewLabel}: ${t.ui.debrief.reviewLine}`, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 1020 } }));

    // export locale: nessuna rete, nessun dato personale
    const txt = teacherReportToText(report);
    new Button(this, cx - 330, GAME_HEIGHT - 44, t.ui.debrief.downloadTxt, () => download('no-ai-act-debrief.txt', txt, 'text/plain'), { width: 190, height: 40, fontSize: 12 });
    new Button(this, cx - 120, GAME_HEIGHT - 44, t.ui.debrief.downloadJson, () => download('no-ai-act-debrief.json', JSON.stringify(report, null, 2), 'application/json'), { width: 190, height: 40, fontSize: 12 });
    new Button(this, cx + 80, GAME_HEIGHT - 44, t.ui.debrief.print, () => printText(txt), { width: 160, height: 40, fontSize: 12 });
    new Button(this, cx + 320, GAME_HEIGHT - 44, t.ui.debrief.back, () => this.scene.start('Finale'), { width: 250, height: 40, fontSize: 12, variant: 'ghost' });
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('Finale'));
  }
}

/** Tronca a maxLen caratteri con ellissi (per le righe a colonna del debrief). */
function truncate(text: string, maxLen: number): string {
  return text.length <= maxLen ? text : `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function printText(text: string): void {
  const w = window.open('', '_blank', 'width=800,height=600');
  if (!w) return;
  w.document.write(`<pre style="font-family:monospace;white-space:pre-wrap;padding:24px">${text.replace(/</g, '&lt;')}</pre>`);
  w.document.close();
  w.print();
}

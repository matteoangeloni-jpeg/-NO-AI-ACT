import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type {
  CaseData,
  Classification,
  IncidentChoice,
  IndicatorState,
  Measure,
  ReportOutcome,
  ResponsibleSubject
} from '../data/types';
import { hintKeyFor, shouldShowHint, type ReportResult } from '../systems/ReportSystem';
import { conceptLink } from '../data/concepts';
import { caseLearning } from '../data/learning';
import { decisionAnalysisKeys } from '../systems/DecisionIssues';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { DecisionDebriefOverlay } from '../ui/DecisionDebriefOverlay';
import { L, caseText, fmt, normText } from '../i18n';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';

interface ReportParams {
  caseId: string;
  citedClues: number[];
  classification: Classification;
  measure: Measure;
  subject: ResponsibleSubject;
  motivationIndex: number;
  incidentChoice?: IncidentChoice;
  result: ReportResult;
  before: IndicatorState;
  after: IndicatorState;
}

const OUTCOME_COLORS: Record<ReportOutcome, { stroke: number; text: string }> = {
  conforme: { stroke: COLORS.ok, text: COLOR_STR.ok },
  parziale: { stroke: COLORS.warning, text: COLOR_STR.warning },
  contestabile: { stroke: COLORS.warning, text: COLOR_STR.warning },
  non_conforme: { stroke: COLORS.alert, text: COLOR_STR.alertText }
};

/**
 * Il rapporto ispettivo: il documento che il giocatore ha costruito,
 * timbrato con l'esito e annotato con il rilievo principale.
 */
export class ReportScene extends Phaser.Scene {
  private params!: ReportParams;
  private caseData!: CaseData;

  constructor() {
    super('Report');
  }

  init(data: ReportParams): void {
    this.params = data;
    this.caseData = getCase(data.caseId);
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const t = L();
    const texts = caseText(this.caseData.id);
    const { result } = this.params;
    const oc = OUTCOME_COLORS[result.outcome];

    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    this.cameras.main.fadeIn(250, 0, 0, 0);
    AudioSystem.crossfadeToTheme(this.caseData.id);
    this.add.tileSprite(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'noise').setAlpha(0.4);

    // documento
    this.add.image(cx, GAME_HEIGHT / 2 - 10, 'dossier_paper').setDisplaySize(940, 580);
    const left = cx - 430;
    let y = 76;
    this.add.text(left, y, `${t.ui.report.title} — ${fmt(t.ui.case.fileLabel, { code: this.caseData.fileCode })}`, textStyle(14, COLOR_STR.alertText));
    y += 24;
    this.add.text(left, y, texts.title.toUpperCase(), textStyle(19, COLOR_STR.paper, { fontStyle: 'bold' }));
    y += 40;

    const line = (label: string, value: string, color: string = COLOR_STR.paper): number => {
      this.add.text(left, y, label, textStyle(12, COLOR_STR.paperDim));
      const v = this.add.text(left + 200, y, value, textStyle(12.5, color, { wordWrap: { width: 620 }, lineSpacing: 4 }));
      y += Math.max(24, v.height + 8);
      return y;
    };

    const citedTitles =
      this.params.citedClues.length > 0
        ? this.params.citedClues.map((i) => `«${texts.clues[i].title}»`).join(' · ')
        : t.ui.report.noEvidence;
    line(t.ui.report.evidenceLabel, citedTitles, result.cluesOk ? COLOR_STR.paper : COLOR_STR.warning);
    line(
      t.ui.report.decisionLabel,
      `${t.classifications[this.params.classification]} → ${t.measures[this.params.measure]}`
    );
    line(t.ui.report.subjectLabel, t.ui.subjects[this.params.subject], result.subjectGrade === 'full' ? COLOR_STR.paper : COLOR_STR.warning);
    line(t.ui.report.motivationLabel, texts.motivations[this.params.motivationIndex], result.motivationGrade === 'correct' ? COLOR_STR.paper : COLOR_STR.warning);
    if (this.params.incidentChoice && texts.incident) {
      line(t.ui.report.incidentLabel, texts.incident.options[this.params.incidentChoice]);
    }

    y += 6;
    this.add.rectangle(cx, y, 860, 1, COLORS.iron);
    y += 16;

    // rilievo principale + secondari (max 2)
    if (result.dominantError) {
      this.add.text(left, y, t.ui.report.dominantLabel, textStyle(12, oc.text));
      const dom = this.add.text(left + 200, y, t.ui.errors[result.dominantError], textStyle(13, oc.text, { wordWrap: { width: 620 }, lineSpacing: 4 }));
      y += Math.max(26, dom.height + 8);
      if (result.secondaryErrors.length > 0) {
        this.add.text(left, y, t.ui.report.secondaryLabel, textStyle(12, COLOR_STR.paperDim));
        const sec = result.secondaryErrors.map((e) => `· ${t.ui.errors[e]}`).join('\n');
        const secText = this.add.text(left + 200, y, sec, textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: 620 }, lineSpacing: 4 }));
        y += secText.height + 6;
      }
    } else {
      this.add.text(left + 200, y, texts.noteCorrect, textStyle(12.5, COLOR_STR.ok, { wordWrap: { width: 620 }, lineSpacing: 4 }));
    }
    y += 30;

    // sintesi "prove decisive": perché i reperti citati contano (o no)
    const decisiveText = result.cluesOk ? t.ui.report.decisiveEvidenceOk : t.ui.report.decisiveEvidenceWeak;
    this.add.text(left, y, t.ui.report.decisiveEvidenceLabel, textStyle(12, COLOR_STR.paperDim));
    this.add.text(left + 200, y, decisiveText, textStyle(12.5, result.cluesOk ? COLOR_STR.ok : COLOR_STR.warning, { wordWrap: { width: 620 } }));
    y += 28;

    // difficoltà BASE: suggerimento mirato dopo un errore (senza svelare la risposta)
    if (shouldShowHint(StateManager.difficulty, result)) {
      const hk = hintKeyFor(result);
      if (hk) {
        this.add.text(left, y, t.ui.difficulty.hintLabel, textStyle(12, COLOR_STR.accent));
        this.add.text(left + 200, y, t.ui.difficulty.hints[hk], textStyle(12.5, COLOR_STR.accent, { wordWrap: { width: 620 }, lineSpacing: 4 }));
      }
    }

    // timbro dell'esito: applicato in basso a destra del documento, come su un
    // modulo reale — fuori dalla colonna di testo, nessuna collisione
    const stamp = this.add.container(cx + 250, 556);
    const stampW = 300;
    const box = this.add.rectangle(0, 0, stampW, 70).setStrokeStyle(3, oc.stroke, 0.9);
    const label = this.add
      .text(0, 0, t.ui.outcomes[result.outcome], textStyle(result.outcome === 'parziale' ? 16 : 20, oc.text, { fontStyle: 'bold', align: 'center', wordWrap: { width: stampW - 24 } }))
      .setOrigin(0.5);
    stamp.add([box, label]);
    stamp.setRotation(-0.06);
    if (!StateManager.reducedMotion) {
      stamp.setScale(2.2).setAlpha(0);
      this.tweens.add({ targets: stamp, scale: 1, alpha: 1, duration: 320, ease: 'Cubic.easeIn', onComplete: () => this.cameras.main.shake(90, 0.002) });
    }

    // analisi sintetica della decisione: perché regge / è contestabile /
    // parziale / non conforme, con il punto debole specifico (v0.5)
    const ak = decisionAnalysisKeys(result);
    const analysis = ak.issue
      ? `${t.ui.report.analysis[ak.outcome]} ${t.ui.report.issues[ak.issue]}`
      : t.ui.report.analysis[ak.outcome];
    this.add
      .text(left, 600, `${t.ui.report.analysisLabel}: ${analysis}`, textStyle(13, oc.text, { wordWrap: { width: 620 }, lineSpacing: 4 }))
      .setOrigin(0, 0);

    // 2.0 — calibrazione metacognitiva: solo se il giocatore ha dichiarato la
    // fiducia (facoltativa). Confronto descrittivo, nessun effetto sul punteggio.
    const confidence = StateManager.caseMetaFor(this.caseData.id).confidence;
    if (confidence) {
      const m = t.learningLayer.metacognition;
      const levelLabel = [t.learningLayer.confidence.levels.low, t.learningLayer.confidence.levels.mid, t.learningLayer.confidence.levels.high][confidence - 1];
      const judgment =
        result.quality === 'correct'
          ? confidence === 1 ? m.underconfident : m.calibrated
          : confidence === 3 ? m.overconfident : m.calibrated;
      const lineText = `${m.label}: ${fmt(m.line, { confidence: levelLabel, outcome: t.ui.outcomes[result.outcome] })} ${judgment}`;
      this.add.text(left, 632, lineText, textStyle(11.5, COLOR_STR.accent, { wordWrap: { width: 940 } })).setOrigin(0, 0);
    }

    // post-decision debrief (read-only): turns the already-computed outcome into
    // learning. Reuses ReportResult + existing case/rule texts; no score change.
    const rule = normText(this.caseData.normId);
    const relevant = this.caseData.relevantClues.map((i) => `«${texts.clues[i].title}»`).join(' · ');
    const debrief = new DecisionDebriefOverlay(this, {
      positive: result.quality === 'correct',
      yourChoice: `${t.classifications[this.params.classification]} → ${t.measures[this.params.measure]}`,
      why:
        result.quality === 'correct'
          ? t.ui.decisionDebrief.whyCorrect
          : result.dominantError
            ? t.ui.errors[result.dominantError]
            : t.ui.decisionDebrief.whyPartialWrong,
      observe: relevant.length > 0 ? relevant : t.ui.decisionDebrief.observeFallback,
      norm: `${rule.title} — ${rule.reference}`,
      howTo: t.ui.decisionDebrief.howToFallback,
      // v1.1: concetti del caso + takeaway + pagina interna da leggere dopo
      concept: this.caseData.concepts.map((c) => t.ui.concepts[c]).join(' · '),
      takeaway: caseLearning(this.caseData.id).takeaway,
      linkUrl: conceptLink(this.caseData.concepts[0], StateManager.language),
      // 2.0: riflessione facoltativa, annotata solo in locale (mai nel punteggio)
      onReflect: (choice) => StateManager.saveCaseMeta(this.caseData.id, { reflection: choice })
    });
    new Button(this, 240, GAME_HEIGHT - 46, t.ui.decisionDebrief.button, () => debrief.toggle(), { width: 320, height: 40, fontSize: 13, variant: 'ghost' });

    const goNext = (): void => {
      this.scene.start('Consequence', {
        caseId: this.params.caseId,
        classification: this.params.classification,
        measure: this.params.measure,
        quality: result.quality,
        outcome: result.outcome,
        cluesOk: result.cluesOk,
        before: this.params.before,
        after: this.params.after
      });
    };
    new Button(this, cx, GAME_HEIGHT - 46, t.ui.report.continueButton, goNext, { width: 280 });
    // tastiera (v1.1): INVIO prosegue, ma non mentre il debrief è aperto
    this.input.keyboard?.on('keydown-ENTER', () => {
      if (!debrief.isOpen) goNext();
    });
  }
}

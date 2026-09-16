import Phaser from 'phaser';
import { getCase } from '../data/cases';
import type {
  CaseData,
  Classification,
  IncidentChoice,
  IndicatorState,
  Measure,
  ResponsibleSubject
} from '../data/types';
import { hintKeyFor, shouldShowHint, showsSecondaryErrors, type ReportResult } from '../systems/ReportSystem';
import { conceptLink } from '../data/concepts';
import { caseLearning } from '../data/learning';

/** Riga dell'analisi: le due righe che la precedono devono starle sopra. */
const ANALYSIS_Y = 582;

/**
 * Bordo basso della carta del rapporto: la carta è alta 580 e centrata a
 * GAME_HEIGHT/2 - 10, quindi finisce qui. Niente testo sotto questa riga.
 */
export const REPORT_PAPER_BOTTOM = 640;
import { decisionAnalysisKeys } from '../systems/DecisionIssues';
import { multiAxisFeedback } from '../systems/MultiAxisFeedback';
import {
  OUTCOME_COLORS,
  SEAL_HEIGHT,
  SEAL_WIDTH,
  createDecisionSeal,
  createRegistryStrip,
  protocolDate,
  protocolNumber
} from '../assets/procedural/decisionSeal';
import { STATE_MARKS } from '../assets/procedural/visualStates';
import { seeded } from '../assets/procedural/kit';
import { AudioSystem } from '../systems/AudioSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { DecisionDebriefOverlay } from '../ui/DecisionDebriefOverlay';
import { L, caseText, fmt, normText } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { fadeInScene } from '../ui/motion';
import { addNoiseOverlay } from '../ui/backdrop';

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

  /**
   * L'INTESTAZIONE CHE FA DI UN FOGLIO UN ATTO.
   *
   * Il rapporto diceva il titolo e il codice pratica, e basta. Mancava
   * tutto ciò che in un atto amministrativo viene prima del contenuto:
   * quale ufficio lo emette, con che numero è stato protocollato, quando è
   * stato redatto, con che classifica esce. Sono metadati noiosi, ed è
   * esattamente il motivo per cui funzionano: il giocatore li riconosce
   * come «ufficiale» senza doverli imparare.
   *
   * Tutto quello che si legge qui ESISTEVA GIÀ nel mondo del gioco:
   * l'ufficio è quello del briefing, il codice pratica è `fileCode`
   * (AX-031/2032), l'anno è il 2032 che il briefing dichiara. Protocollo e
   * data si ricavano dall'identificativo del caso, quindi la stessa pratica
   * riaperta porta sempre gli stessi numeri.
   *
   * Sono TESTI DI PHASER, non parole cotte nella texture: seguono la lingua
   * e arrivano allo strato di lettura. La striscia accanto al protocollo ne
   * codifica le cifre, e non è un ornamento.
   */
  private buildRegistryBlock(cx: number): void {
    const t = L();
    const r = t.ui.report.registry;
    const destra = cx + 440;
    const protocollo = protocolNumber(this.caseData.id);

    const riga = (y: number, etichetta: string, valore: string, colore: string = COLOR_STR.paper): void => {
      this.add.text(destra, y, `${etichetta} ${valore}`, textStyle(10.5, colore)).setOrigin(1, 0.5);
    };

    // l'ufficio emittente in alto, dove sta l'intestazione di un atto
    this.add
      .text(destra, 72, `${r.officeLabel}: ${t.briefing.header}`, textStyle(10.5, COLOR_STR.accentText))
      .setOrigin(1, 0.5);
    riga(88, `${r.fileLabel}:`, this.caseData.fileCode);

    /**
     * LA STRISCIA STA ACCANTO AL NUMERO CHE CODIFICA.
     *
     * Aveva una didascalia sotto — «striscia di registrazione: il protocollo
     * in forma di barre» — che diceva a parole quello che la posizione dice
     * da sola, e per giunta finiva addosso alla riga della classifica. Una
     * didascalia su un timbro è il segno che il timbro non si spiega: qui
     * basta metterla a fianco del protocollo perché il legame si veda.
     */
    const etichettaProt = `${r.protocolLabel}: ${protocollo}`;
    this.add.text(destra, 104, etichettaProt, textStyle(10.5, COLOR_STR.paper)).setOrigin(1, 0.5);
    const striscia = createRegistryStrip(this, protocollo);
    if (striscia) {
      const larghezzaEtichetta = etichettaProt.length * 10.5 * 0.6;
      this.add
        .image(destra - larghezzaEtichetta - 8 - striscia.width / 2, 104, striscia.key)
        .setDisplaySize(striscia.width, 14);
    }

    riga(120, `${r.dateLabel}:`, protocolDate(this.caseData.id), COLOR_STR.paperDim);
    this.add.text(destra, 136, `${r.statusLabel}: ${r.status}`, textStyle(10, COLOR_STR.paperDim)).setOrigin(1, 0.5);
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const t = L();
    const texts = caseText(this.caseData.id);
    const { result } = this.params;
    const oc = OUTCOME_COLORS[result.outcome];

    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    fadeInScene(this, 250);
    AudioSystem.setMusicRole('debrief', this.caseData.id);
    addNoiseOverlay(this, 0.4);

    // documento
    this.add.image(cx, GAME_HEIGHT / 2 - 10, 'report_paper').setDisplaySize(940, 580);
    const left = cx - 430;
    let y = 76;
    this.add.text(left, y, t.ui.report.title, textStyle(14, COLOR_STR.alertText));
    this.buildRegistryBlock(cx);
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
      if (result.secondaryErrors.length > 0 && showsSecondaryErrors(StateManager.difficulty)) {
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
        this.add.text(left, y, t.ui.difficulty.hintLabel, textStyle(12, COLOR_STR.accentText));
        this.add.text(left + 200, y, t.ui.difficulty.hints[hk], textStyle(12.5, COLOR_STR.accentText, { wordWrap: { width: 620 }, lineSpacing: 4 }));
      }
    }

    /**
     * LA LEZIONE DEL CASO, SEMPRE, ANCHE QUANDO SI È RISPOSTO BENE.
     *
     * Il ragionamento atteso esisteva già — è la riga che il debrief della
     * decisione mostra come "takeaway" — ma viveva dietro un pulsante
     * facoltativo, e chi aveva risposto correttamente non aveva motivo di
     * aprirlo: proprio chi ha capito se ne andava senza la frase che glielo
     * conferma. "Voglio un perché più visibile dopo ogni scelta, non
     * nascosto dietro bottoni opzionali."
     *
     * Sta nel flusso della colonna, non a un'altezza fissa: sotto c'è
     * l'analisi a y=600, e una riga piantata più in basso finiva sopra i
     * pulsanti. Il limite superiore è quel 600 meno lo spazio che la frase
     * occupa davvero, misurato e non stimato.
     */
    const lesson = this.add
      .text(left, 0, `${t.ui.report.lessonLabel}: ${caseLearning(this.caseData.id).takeaway}`,
        textStyle(12, COLOR_STR.accentText, { wordWrap: { width: 620 }, lineSpacing: 3 }))
      .setOrigin(0, 0);
    lesson.setY(Math.min(y + 24, ANALYSIS_Y - lesson.height - 16));

    // timbro dell'esito: applicato in basso a destra del documento, come su un
    // modulo reale — fuori dalla colonna di testo, nessuna collisione
    /**
     * Il sigillo sta a y=500, non a 556.
     *
     * A 556 la sua cornice arrivava a y=601 e l'analisi della decisione
     * comincia a 582: il timbro cadeva sulla prima riga dell'analisi, e su
     * un esito con la frase lunga la copriva. Lo spazio fra la lezione del
     * caso e l'analisi era comunque vuoto, quindi il sigillo ci sta per
     * intero senza togliere niente a nessuno.
     */
    const stamp = this.add.container(cx + 250, 500);
    const sealKey = createDecisionSeal(this, result.outcome, this.caseData.id);
    const cornice: Phaser.GameObjects.GameObject = sealKey
      ? this.add.image(0, 0, sealKey).setDisplaySize(SEAL_WIDTH + 20, SEAL_HEIGHT + 20)
      : this.add.rectangle(0, 0, SEAL_WIDTH, SEAL_HEIGHT).setStrokeStyle(3, oc.stroke, 0.9);
    const label = this.add
      .text(0, 0, `${STATE_MARKS[result.outcome].glyph} ${t.ui.outcomes[result.outcome]}`, textStyle(result.outcome === 'parziale' ? 16 : 20, oc.text, { fontStyle: 'bold', align: 'center', wordWrap: { width: SEAL_WIDTH - 24 } }))
      .setOrigin(0.5);
    stamp.add([cornice, label]);
    // l'inclinazione viene dal caso: due sigilli di casi diversi non escono
    // paralleli, e lo stesso caso riaperto ha sempre la sua
    stamp.setRotation(-0.06 + (seeded(`sigillo-inclinazione:${this.caseData.id}`)() - 0.5) * 0.06);
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
    /**
     * LE DUE RIGHE IN FONDO NON SI SOVRAPPONGONO PIÙ.
     *
     * L'analisi stava a y=600 e la calibrazione a y=632, due altezze fisse
     * decise separatamente. Quando l'analisi va su due righe — e ci va, in
     * italiano, per tre esiti su quattro — occupa fino a y=636 e la
     * calibrazione le finiva addosso; entrambe uscivano anche dal bordo
     * basso della carta, che sta a y=640.
     *
     * Ora l'analisi è più stretta e la calibrazione la SEGUE, misurata e non
     * stimata. Il fondo utile è il bordo della carta: sotto ci sono i
     * pulsanti.
     */
    const analisi = this.add
      .text(left, ANALYSIS_Y, `${t.ui.report.analysisLabel}: ${analysis}`, textStyle(12.5, oc.text, { wordWrap: { width: 880 }, lineSpacing: 3 }))
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
      this.add
        .text(left, analisi.y + analisi.height + 6, lineText, textStyle(11, COLOR_STR.accentText, { wordWrap: { width: 880 } }))
        .setOrigin(0, 0);
    }

    // post-decision debrief (read-only): turns the already-computed outcome into
    // learning. Reuses ReportResult + existing case/rule texts; no score change.
    // 2.1 — multi-axis reading of the SAME outcome (legal / rights / trust)
    const ax = multiAxisFeedback(result.quality);
    const axesLine = [
      t.ui.decisionDebrief.axes.legal[ax.legal],
      t.ui.decisionDebrief.axes.rights[ax.rights],
      t.ui.decisionDebrief.axes.institution[ax.institution]
    ].join(' · ');
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
      axes: axesLine,
      linkUrl: conceptLink(this.caseData.concepts[0], StateManager.language),
      // 2.0: riflessione facoltativa, annotata solo in locale (mai nel punteggio)
      onReflect: (choice) => StateManager.saveCaseMeta(this.caseData.id, { reflection: choice })
    });
    // non è una decorazione: è dove sta il confronto per assi, i concetti e la
    // lettura consigliata. Variante primaria, non fantasma.
    new Button(this, 240, GAME_HEIGHT - 46, t.ui.decisionDebrief.button, () => debrief.toggle(), { width: 320, height: 40, fontSize: 13 });

    // strato di lettura (§11.1) + annuncio dell'esito (aria-live)
    ReadingLayer.setScene(t.a11y.reportTitle, [
      { text: texts.title },
      { heading: t.ui.outcomes[result.outcome], text: analysis },
      { text: `${t.ui.report.decisionLabel} ${t.classifications[this.params.classification]} → ${t.measures[this.params.measure]}` },
      { text: `${t.ui.decisionDebrief.axes.label}: ${axesLine}` }
    ]);
    ReadingLayer.announce(fmt(t.a11y.outcomeAnnounced, { outcome: t.ui.outcomes[result.outcome] }));

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

import Phaser from 'phaser';
import { StateManager } from '../systems/StateManager';
import { buildSessionSummary, type SessionSummaryData } from '../systems/SessionSummary';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { SelfCheckOverlay } from '../ui/SelfCheckOverlay';
import { ReadingLayer } from '../systems/ReadingLayer';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { L, caseText, fmt, normText } from '../i18n';
import { COLOR_STR, GAME_HEIGHT, GAME_WIDTH, textStyle } from '../ui/theme';
import { fadeInScene, fadeOutScene } from '../ui/motion';
import { addNoiseOverlay } from '../ui/backdrop';
import { layoutHStack } from '../ui/layout';
import type { OutcomeQuality } from '../data/types';
import { AudioSystem } from '../systems/AudioSystem';

/**
 * FINE TURNO.
 *
 * Compare quando l'ultimo fascicolo di una sessione composta in NUOVA
 * PARTITA viene chiuso. Prima quel momento non esisteva: si tornava sulla
 * mappa come dopo qualunque altro caso, e i due rapporti che il gioco
 * produce (apprendimento e debrief docente) restavano raggiungibili solo dal
 * finale, che chiede molti più casi di quanti ne contenga mezz'ora di gioco.
 *
 * Non aggiunge punteggi: rilegge quello che il gioco ha già deciso fascicolo
 * per fascicolo. Tutto locale, come il resto — nessun invio, nessun account.
 *
 * Le altezze NON sono fisse. Una sessione va da un fascicolo a otto, e i
 * riferimenti agli articoli vanno a capo di lunghezza diversa nelle due
 * lingue: con un passo di riga costante una riga finiva sopra la successiva,
 * e con un pannello di altezza fissa restava mezzo schermo vuoto sotto. Qui
 * si misura ogni riga e si dimensiona il pannello su quello che contiene.
 */
export class SessionEndScene extends Phaser.Scene {
  constructor() {
    super('SessionEnd');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const t = L();
    const ui = t.ui.sessionEnd;
    const plan = StateManager.gamePlan;
    const summary = buildSessionSummary(plan, StateManager.completedCases, StateManager.caseReports);

    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    fadeInScene(this, 250);
    AudioSystem.setMusicRole('debrief', 'city');
    addNoiseOverlay(this, 0.4).setDepth(-2);
    AnalyticsSystem.page('session-end');

    this.add.text(cx, 44, ui.title, textStyle(22, COLOR_STR.paper, { fontStyle: 'bold' })).setOrigin(0.5);
    const one = plan.caseIds.length === 1;
    this.add
      .text(
        cx,
        76,
        fmt(one ? ui.subtitleOne : ui.subtitle, {
          mode: t.ui.newGamePanel.modes[plan.mode].name,
          count: String(plan.caseIds.length),
          minutes: String(plan.estimatedMinutes)
        }),
        textStyle(12.5, COLOR_STR.paperDim)
      )
      .setOrigin(0.5);

    const PANEL_W = 1100;
    const PAD = 28;
    const left = cx - PANEL_W / 2 + PAD;
    const COL_OUTCOME = 620;
    const COL_NORM = 800;
    const NORM_W = 244;
    /**
     * Il contenuto vive in un contenitore che alla fine viene centrato nella
     * fascia fra intestazione e riga dei pulsanti. Con tre fascicoli il
     * pannello è basso e, ancorato in alto, lasciava mezzo schermo vuoto
     * sotto; con otto arriva quasi a toccare i pulsanti. Centrarlo fa stare
     * bene tutte e due le sessioni senza altezze fisse.
     */
    const body = this.add.container(0, 0);
    const BAND_TOP = 104;
    // sotto il blocco stanno la riga dei pulsanti e, quando compare,
    // l'autocontrollo finale: la fascia si ferma prima
    const BAND_BOTTOM = GAME_HEIGHT - (StateManager.selfCheck.post === null ? 132 : 78);
    const top = BAND_TOP + PAD;
    let y = top;

    // conteggio degli esiti: la stessa cosa che dice il rapporto del caso,
    // sommata sui fascicoli del turno. Ogni voce ha la sua forma singolare:
    // "1 chiusi bene" non lo scrive nessuno.
    const counts = this.add.text(left, y, countsLine(summary.counts), textStyle(15, COLOR_STR.paper));
    body.add(counts);
    y += counts.height + 16;

    // una riga per fascicolo, nell'ordine in cui il piano li proponeva
    for (const line of summary.lines) {
      const color = line.quality ? QUALITY_COLOR[line.quality] : COLOR_STR.paperDim;
      // il verdetto stampato sul fascicolo, non una parola nuova per la
      // stessa cosa; la qualità resta come ripiego per i salvataggi vecchi
      const label = line.outcome
        ? t.ui.outcomes[line.outcome]
        : line.quality
          ? ui.quality[line.quality]
          : ui.open;
      const title = this.add.text(left, y, caseText(line.caseId).title, textStyle(13, COLOR_STR.paper, { wordWrap: { width: COL_OUTCOME - 20 } }));
      const verdict = this.add.text(left + COL_OUTCOME, y, label.toUpperCase(), textStyle(12, color, { wordWrap: { width: COL_NORM - COL_OUTCOME - 20 } }));
      const ref = this.add.text(left + COL_NORM, y, normText(line.normId).reference, textStyle(11, COLOR_STR.paperDim, { wordWrap: { width: NORM_W }, lineSpacing: 2 }));
      body.add([title, verdict, ref]);
      y += Math.max(title.height, verdict.height, ref.height) + 10;
    }
    y += 10;

    // La tendenza si dichiara solo quando è una tendenza: sotto la soglia il
    // cruscotto dice che non ce n'è, invece di eleggere a diagnosi un caso
    // andato storto una volta.
    const trend = summary.recurringError
      ? fmt(ui.recurring, { times: String(summary.recurringError.times), error: t.ui.errors[summary.recurringError.type] })
      : ui.noRecurring;
    const trendText = this.add.text(left, y, trend, textStyle(13, summary.recurringError ? COLOR_STR.warning : COLOR_STR.ok, { wordWrap: { width: PANEL_W - PAD * 2 }, lineSpacing: 4 }));
    body.add(trendText);
    y += trendText.height + 14;

    if (summary.normIds.length > 0) {
      const norms = summary.normIds.map((id) => normText(id).reference).join(' · ');
      const nt = this.add.text(left, y, fmt(ui.normsTouched, { norms }), textStyle(12, COLOR_STR.accentText, { wordWrap: { width: PANEL_W - PAD * 2 }, lineSpacing: 4 }));
      body.add(nt);
      y += nt.height + 14;
    }

    const stillOpen = summary.lines.length - summary.closed;
    if (stillOpen > 0) {
      const inc = this.add.text(
        left,
        y,
        stillOpen === 1 ? ui.incompleteOne : fmt(ui.incomplete, { count: String(stillOpen) }),
        textStyle(12, COLOR_STR.paperDim, { wordWrap: { width: PANEL_W - PAD * 2 } })
      );
      body.add(inc);
      y += inc.height + 14;
    }

    const note = this.add.text(left, y, ui.note, textStyle(11.5, COLOR_STR.paperDim, { wordWrap: { width: PANEL_W - PAD * 2 }, lineSpacing: 3 }));
    body.add(note);
    y += note.height;

    // Il pannello nasce DOPO il suo contenuto, perché solo ora se ne conosce
    // l'altezza, ma va disegnato PRIMA: dentro un contenitore conta l'ordine
    // di inserimento, non la profondità — messo in coda copriva tutto quello
    // che doveva incorniciare.
    const panelH = y - top + PAD * 2;
    body.addAt(new Panel(this, cx, (top + y) / 2, PANEL_W, panelH), 0);

    // e ora il blocco intero scende al centro della fascia disponibile
    const shift = (BAND_TOP + BAND_BOTTOM) / 2 - (top + y) / 2;
    body.setY(Math.max(0, shift));

    /**
     * AUTOCONTROLLO FINALE.
     *
     * Il confronto fra il "prima" e il "dopo" è il senso di questo
     * strumento, ma la metà finale viveva soltanto nel finale del gioco, che
     * chiede almeno quattro fascicoli e una visita esplicita: chi giocava un
     * turno da mezz'ora non la incontrava mai. Qui sta al suo posto — un
     * turno è finito, ed è il momento in cui ha senso chiedersi che cosa è
     * cambiato.
     *
     * Si offre solo se non è già stato fatto: rifarlo sovrascriverebbe il
     * confronto invece di arricchirlo. Resta facoltativo e locale, come
     * nella sua schermata d'origine.
     */
    if (StateManager.selfCheck.post === null) {
      const selfCheck = new SelfCheckOverlay(this, 'post');
      new Button(this, cx, GAME_HEIGHT - 104, L().learningLayer.selfCheck.buttonPost, () => selfCheck.open(), {
        width: 460,
        height: 36,
        fontSize: 11.5,
        variant: 'ghost'
      });
    }

    // Il debrief docente compare solo in modalità docente: è il suo posto, e
    // fuori da lì sarebbe una voce che non riguarda chi sta giocando.
    const actions: Array<[string, () => void]> = [
      [ui.toMap, () => fadeOutScene(this, 250, () => this.scene.start('CityMap'))],
      [ui.learningReport, () => fadeOutScene(this, 250, () => this.scene.start('LearningReport'))]
    ];
    if (StateManager.teacherMode) {
      actions.push([ui.debrief, () => fadeOutScene(this, 250, () => this.scene.start('Debrief'))]);
    }
    const row = layoutHStack({ count: actions.length, left: cx - 500, right: cx + 500, gap: 20 });
    actions.forEach(([label, action], i) => {
      new Button(this, row.xs[i], GAME_HEIGHT - 44, label, action, { width: row.width, height: 44, fontSize: 13, variant: i === 0 ? 'default' : 'ghost' });
    });

    ReadingLayer.setScene(ui.title, [
      { text: countsLine(summary.counts) },
      { text: trend },
      {
        heading: ui.normsTouched.replace(' {norms}', ''),
        items: summary.normIds.map((id) => normText(id).reference)
      }
    ]);

    this.input.keyboard?.once('keydown-ENTER', () => fadeOutScene(this, 250, () => this.scene.start('CityMap')));
  }
}

/**
 * "1 chiusi bene · 1 a metà · 1 sbagliati" non lo scrive nessuno. Ogni voce
 * ha la sua forma singolare, e lo zero prende il plurale come in italiano e
 * in inglese.
 */
function countsLine(counts: SessionSummaryData['counts']): string {
  const ui = L().ui.sessionEnd;
  const part = (n: number, one: string, many: string): string => (n === 1 ? one : fmt(many, { n: String(n) }));
  return [
    part(counts.correct, ui.countCorrectOne, ui.countCorrect),
    part(counts.partial, ui.countPartialOne, ui.countPartial),
    part(counts.wrong, ui.countWrongOne, ui.countWrong)
  ].join(' · ');
}

const QUALITY_COLOR: Record<OutcomeQuality, string> = {
  correct: COLOR_STR.ok,
  partial: COLOR_STR.warning,
  wrong: COLOR_STR.alertText
};

import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import { AudioSystem } from '../systems/AudioSystem';
import { L, fmt } from '../i18n';
import type { EvidenceSource, EvidenceStance } from '../data/types';
import { documentTextureKey } from '../assets/procedural/documentStyles';
import { STATE_MARKS, createStateFrame, stateBadge } from '../assets/procedural/visualStates';

/** Corpo dell'invito a citare e del distintivo che lo sostituisce. */
const CITE_FONT = 12.5;
import { reveal } from './motion';

/**
 * Scheda reperto del fascicolo. Tre stati:
 *  1. sigillata: mostra solo il codice reperto; clic per aprire;
 *  2. aperta: mostra titolo e contenuto + pulsante "CITA NEL RAPPORTO";
 *  3. citata: il reperto è incluso nel rapporto (toggle).
 */
export class DossierCard extends Phaser.GameObjects.Container {
  private revealed = false;
  private cited = false;
  private citeLabel!: Phaser.GameObjects.Text;
  private bg!: Phaser.GameObjects.Rectangle;
  private citeFrame: Phaser.GameObjects.Container | null = null;
  private apertoFrame: Phaser.GameObjects.Image | null = null;
  private contraddizione: Phaser.GameObjects.Container | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    clue: { title: string; text: string },
    index: number,
    private onChange: () => void,
    sourceLabel?: string,
    stance?: EvidenceStance,
    source?: EvidenceSource
  ) {
    super(scene, x, y);

    /**
     * IL FOGLIO PRIMA DEL TESTO.
     *
     * La scheda era un rettangolo pieno: tutti i reperti avevano la stessa
     * faccia, e da dove veniva un documento si leggeva solo nell'etichetta
     * in alto a destra. Ora il foglio è una texture generata dal TIPO di
     * fonte — modulo protocollato, perizia, tabulato, nota interna epurata,
     * reclamo, brochure, comunicato — così la provenienza si vede prima di
     * essere letta.
     *
     * Il rettangolo resta sotto come bordo: è lui a portare gli stati
     * (sigillato, aperto, citato), che devono restare leggibili sopra
     * qualunque foglio.
     */
    const paperKey = documentTextureKey(source ?? null);
    const paper = scene.textures.exists(paperKey)
      ? scene.add.image(0, 0, paperKey).setDisplaySize(width, height)
      : null;
    this.bg = scene.add
      .rectangle(0, 0, width, height, COLORS.night2, paper ? 0 : 0.95)
      .setStrokeStyle(1, COLORS.iron);
    const tape = scene.add.rectangle(0, -height / 2 + 14, width, 28, COLORS.carbon, paper ? 0.55 : 1).setStrokeStyle(1, COLORS.iron);
    const code = scene.add
      .text(-width / 2 + 12, -height / 2 + 14, fmt(L().ui.evidence.exhibit, { num: String(index + 1).padStart(2, '0') }), textStyle(12, COLOR_STR.paperDim))
      .setOrigin(0, 0.5);
    // etichetta-fonte (attendibilità): sempre visibile, aiuta a ragionare
    const srcText = sourceLabel
      ? scene.add.text(width / 2 - 12, -height / 2 + 14, sourceLabel, textStyle(11, COLOR_STR.accentText)).setOrigin(1, 0.5)
      : null;
    /**
     * Micro-tag investigativo: che funzione ha il reperto rispetto al
     * rischio — "prova decisiva", "minimizza", "effetto concreto".
     *
     * NASCOSTO FINCHÉ IL REPERTO È SIGILLATO. Era visibile da subito, e
     * quindi il fascicolo diceva quali reperti contavano prima che li si
     * aprisse: bastava citare le due carte marcate "prova decisiva" senza
     * leggere una riga. È la risposta stampata sulla busta chiusa.
     *
     * La FONTE resta invece sempre visibile, ed è una scelta diversa e
     * deliberata: sapere che un documento viene dal fornitore o dal reclamo
     * di un cittadino è un elemento di attendibilità, non la soluzione.
     */
    /**
     * La PROVA DECISIVA è uno stato, non una sfumatura: è il reperto su cui
     * la classificazione regge o cade. Prende il distintivo del linguaggio
     * comune — rombo pieno, cornice doppia — mentre le altre funzioni
     * restano un'etichetta di testo, perché dicono una gradazione
     * («minimizza», «contesto») e non uno stato dell'atto.
     */
    const stanceLabel = stance ? (L().ui.evidence.stances as Record<string, string>)[stance] : undefined;
    /**
     * LA STRISCIA IN FONDO HA DUE POSTI, NON UNO.
     *
     * A sinistra l'AZIONE — l'invito a citare, o il timbro «citato» che lo
     * sostituisce. A destra la FUNZIONE del reperto. Prima stavano sulla
     * stessa verticale a due altezze vicine, e appena il reperto decisivo
     * veniva citato i due distintivi si accavallavano: si vedeva solo su un
     * reperto decisivo E citato, cioè proprio sulla scheda più importante
     * della schermata.
     */
    const stanceText: (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible) | null =
      stance === 'decisive'
        ? stateBadge(scene, width / 4 + 6, height / 2 - 22, 'prova_decisiva', { height: 20, fontSize: 10.5 }).setVisible(false)
        : stanceLabel
          ? scene.add.text(width / 2 - 12, height / 2 - 22, stanceLabel, textStyle(10.5, COLOR_STR.warning)).setOrigin(1, 0.5).setVisible(false)
          : null;
    const sealed = scene.add
      .text(0, 10, `${STATE_MARKS.sigillato.glyph} ${L().ui.evidence.sealed}`, textStyle(13, COLOR_STR.accentText, { align: 'center' }))
      .setOrigin(0.5);
    const title = scene.add
      .text(-width / 2 + 14, -height / 2 + 38, clue.title.toUpperCase(), textStyle(13, COLOR_STR.warning, { wordWrap: { width: width - 28 } }))
      .setVisible(false);
    const body = scene.add
      .text(-width / 2 + 14, -height / 2 + 64, clue.text, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: width - 28 }, lineSpacing: 5 }))
      .setVisible(false);
    this.citeLabel = scene.add
      .text(-width / 4 - 6, height / 2 - 22, L().ui.evidence.cite, textStyle(CITE_FONT, COLOR_STR.accentText))
      .setOrigin(0.5)
      .setVisible(false);

    /**
     * I DISTINTIVI DI STATO, NELLA LINGUA COMUNE.
     *
     * Citare un reperto cambiava il colore del bordo della scheda e la
     * parola in fondo: il colore da solo è l'informazione che sparisce per
     * prima — su un proiettore, in stampa, per chi non distingue verde e
     * blu — e la parola cambiava senza che nulla dicesse che quel documento
     * era stato *preso*.
     *
     * Ora gli stati della scheda usano il linguaggio condiviso di
     * `visualStates`: glifo, trattamento della cornice e colore, in
     * quest'ordine di importanza. Chi impara a leggerli qui li ritrova
     * identici sulla mappa, nel rapporto e sulla conseguenza.
     */
    const citato = stateBadge(scene, -width / 4 - 6, height / 2 - 22, 'citato', { height: 22, fontSize: CITE_FONT });
    citato.setVisible(false);
    this.citeFrame = citato;

    /**
     * APERTO: crocini agli angoli della scheda. È il trattamento che il
     * linguaggio assegna ad «aperto», e diventa il segnale di forma della
     * scheda esaminata — il bordo colorato da solo non bastava.
     *
     * Qui serve la sola cornice, senza parola: una scheda che mostra il
     * proprio testo è già evidentemente aperta, e scriverci sopra «APERTO»
     * sarebbe rumore. Per questo si usa `createStateFrame` e non
     * `stateBadge`: il distintivo con la parola è per gli stati che senza
     * parola non si capiscono.
     */
    const apertoKey = createStateFrame(scene, 'aperto', width - 12, height - 12);
    const aperto = apertoKey
      ? scene.add.image(0, 0, apertoKey).setDisplaySize(width + 4, height + 4).setVisible(false)
      : null;
    this.apertoFrame = aperto;

    // Il foglio va sotto a tutto: i contenitori di Phaser disegnano in
    // ordine di inserimento, non per profondità dichiarata.
    if (paper) this.add(paper);
    this.add([this.bg, tape, code, sealed, title, body]);
    if (aperto) this.add(aperto);
    this.add([citato, this.citeLabel]);
    if (srcText) this.add(srcText);
    if (stanceText) this.add(stanceText);
    this.setSize(width, height);
    scene.add.existing(this);

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        if (!this.revealed) this.bg.setStrokeStyle(2, COLORS.accent);
        else if (!this.cited) this.bg.setStrokeStyle(2, COLORS.accent);
      })
      .on('pointerout', () => this.refreshBorder())
      .on('pointerdown', () => this.activate());
    this.revealElements = { sealed, title, body, stance: stanceText };
  }

  private revealElements!: {
    stance: (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible) | null;
    sealed: Phaser.GameObjects.Text;
    title: Phaser.GameObjects.Text;
    body: Phaser.GameObjects.Text;
  };

  /**
   * Azione principale della scheda: primo uso = apertura, usi successivi =
   * toggle della citazione. Unica per puntatore E tastiera (§11.2), così i
   * due input restano sempre coerenti.
   */
  activate(): void {
    AudioSystem.init();
    const { sealed, title, body, stance } = this.revealElements;
    if (!this.revealed) {
      // prima attivazione: apertura del reperto
      this.revealed = true;
      AudioSystem.confirm();
      sealed.setVisible(false);
      title.setVisible(true);
      body.setVisible(true);
      stance?.setVisible(true);
      this.citeLabel.setVisible(true);
      this.apertoFrame?.setVisible(true);
      /**
       * «Riduci movimento» vale anche per una dissolvenza di 250 ms.
       *
       * Questa era l'ultima animazione del gioco che non chiedeva
       * l'impostazione: chi apre dodici reperti in un caso riceveva dodici
       * dissolvenze pur avendo chiesto di non riceverne. Era sfuggita
       * perché è breve e perché non si ripete da sola — il controllo
       * automatico cercava `repeat: -1`, e un tween una tantum non lo è.
       */
      reveal(this.scene, { targets: [title, body, this.citeLabel], alpha: { from: 0, to: 1 }, duration: 250 });
    } else {
      // attivazioni successive: toggle citazione nel rapporto
      this.cited = !this.cited;
      AudioSystem.click();
      this.applyCited();
    }
    this.refreshBorder();
    this.onChange();
  }

  /**
   * Riporta la carta allo stato salvato in una bozza (U01).
   *
   * Non passa da activate(): riaprire un fascicolo non è un gesto del
   * giocatore. Niente suoni — sei conferme in fila all'apertura suonerebbero
   * come un allarme — niente dissolvenze, e nessuna notifica di cambiamento,
   * perché la scena richiama refreshState() una volta sola alla fine.
   */
  restore(revealed: boolean, cited: boolean): void {
    if (!revealed) return;
    const { sealed, title, body, stance } = this.revealElements;
    this.revealed = true;
    this.cited = cited;
    sealed.setVisible(false);
    stance?.setVisible(true);
    for (const el of [title, body, this.citeLabel]) {
      el.setVisible(true);
      el.setAlpha(1);
    }
    this.apertoFrame?.setVisible(true);
    this.applyCited();
    this.refreshBorder();
  }

  /**
   * Lo stato «citato», su due segnali: il distintivo timbrato compare e
   * l'invito a citare sparisce. Erano due scritture sparse fra `activate` e
   * `restore`, che è il modo in cui il gesto e la bozza ripristinata
   * finiscono per raccontare due cose diverse.
   */
  private applyCited(): void {
    this.citeLabel.setVisible(!this.cited);
    this.citeFrame?.setVisible(this.cited);
  }

  /**
   * CONTRADDIZIONE ACCERTATA. La marca solo la scena, e solo dopo che il
   * giocatore l'ha dichiarata e il gioco l'ha confermata sui dati: non è
   * un suggerimento, è la registrazione di una cosa che il giocatore ha
   * già trovato da sé. Marcarla prima sarebbe scrivere la risposta sulla
   * busta chiusa, che è la regola che questa scheda rispetta da sempre.
   */
  markContradiction(): void {
    if (this.contraddizione) return;
    this.contraddizione = stateBadge(this.scene, 0, -this.height / 2 + 44, 'contraddizione', {
      height: 22,
      fontSize: 11
    });
    this.add(this.contraddizione);
  }

  private refreshBorder(): void {
    if (this.cited) this.bg.setStrokeStyle(2, COLORS.ok);
    else if (this.revealed) this.bg.setStrokeStyle(1, COLORS.warning);
    else this.bg.setStrokeStyle(1, COLORS.iron);
  }

  get isRevealed(): boolean {
    return this.revealed;
  }

  get isCited(): boolean {
    return this.cited;
  }
}

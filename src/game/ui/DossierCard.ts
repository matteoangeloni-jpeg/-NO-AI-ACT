import Phaser from 'phaser';
import { COLORS, COLOR_STR, textStyle } from './theme';
import { AudioSystem } from '../systems/AudioSystem';
import { L, fmt } from '../i18n';
import type { EvidenceSource } from '../data/types';
import { documentTextureKey } from '../assets/procedural/documentStyles';

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
    stanceLabel?: string,
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
    const stanceText = stanceLabel
      ? scene.add.text(width / 2 - 12, height / 2 - 40, stanceLabel, textStyle(10.5, COLOR_STR.warning)).setOrigin(1, 0.5).setVisible(false)
      : null;
    const sealed = scene.add
      .text(0, 10, L().ui.evidence.sealed, textStyle(13, COLOR_STR.accentText, { align: 'center' }))
      .setOrigin(0.5);
    const title = scene.add
      .text(-width / 2 + 14, -height / 2 + 38, clue.title.toUpperCase(), textStyle(13, COLOR_STR.warning, { wordWrap: { width: width - 28 } }))
      .setVisible(false);
    const body = scene.add
      .text(-width / 2 + 14, -height / 2 + 64, clue.text, textStyle(12.5, COLOR_STR.paper, { wordWrap: { width: width - 28 }, lineSpacing: 5 }))
      .setVisible(false);
    this.citeLabel = scene.add
      .text(0, height / 2 - 22, L().ui.evidence.cite, textStyle(12.5, COLOR_STR.accentText))
      .setOrigin(0.5)
      .setVisible(false);

    // Il foglio va sotto a tutto: i contenitori di Phaser disegnano in
    // ordine di inserimento, non per profondità dichiarata.
    if (paper) this.add(paper);
    this.add([this.bg, tape, code, sealed, title, body, this.citeLabel]);
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
    stance: Phaser.GameObjects.Text | null;
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
      this.scene.tweens.add({ targets: [title, body, this.citeLabel], alpha: { from: 0, to: 1 }, duration: 250 });
    } else {
      // attivazioni successive: toggle citazione nel rapporto
      this.cited = !this.cited;
      AudioSystem.click();
      this.citeLabel.setText(this.cited ? L().ui.evidence.cited : L().ui.evidence.cite);
      this.citeLabel.setColor(this.cited ? COLOR_STR.ok : COLOR_STR.accentText);
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
    this.citeLabel.setText(cited ? L().ui.evidence.cited : L().ui.evidence.cite);
    this.citeLabel.setColor(cited ? COLOR_STR.ok : COLOR_STR.accentText);
    this.refreshBorder();
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

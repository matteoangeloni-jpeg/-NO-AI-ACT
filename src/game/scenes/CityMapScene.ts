import Phaser from 'phaser';
import { CASES_REQUIRED_FOR_FINALE, LOCATIONS, PLAYABLE_CASES, getCase } from '../data/cases';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { IndicatorHud } from '../systems/IndicatorSystem';
import { StateManager } from '../systems/StateManager';
import { Button } from '../ui/Button';
import { ChaptersOverlay } from '../ui/ChaptersOverlay';
import { NotebookOverlay } from '../ui/NotebookOverlay';
import { showToast } from '../ui/AlertToast';
import { L, fmt, locationName } from '../i18n';
import { ReadingLayer } from '../systems/ReadingLayer';
import { COLORS, COLOR_STR, GAME_HEIGHT, GAME_WIDTH, RENDER_SCALE, textStyle } from '../ui/theme';
import { fadeInScene, fadeOutScene } from '../ui/motion';
import { layoutHStack } from '../ui/layout';
import { draftProgress } from '../systems/caseDraft';
import { drawCivicNetwork, type CivicNode, type NodeState } from '../assets/procedural/civicNetwork';
import { OUTCOME_STAMP_FONT, OUTCOME_STAMP_KEYS, OUTCOME_STAMP_SIZE, createOutcomeStamps } from '../assets/procedural/stamps';
import { seeded } from '../assets/procedural/kit';

/** Deriva massima, in pixel logici, dei due strati di fondo della mappa. */
const PARALLAX_MAP = 12;
const PARALLAX_GRAIN = 6;

/**
 * Etichetta di stato di un fascicolo sulla mappa (U04).
 *
 * Una bozza esisteva ma era invisibile: un caso lasciato a metà mostrava
 * "INCIDENTE APERTO" esattamente come uno mai toccato, e l'unico modo di
 * scoprire dove si era rimasti era riaprirli a uno a uno. Qui la ripresa
 * diventa uno stato a sé, con quante decisioni sono già state prese.
 *
 * L'ordine dei rami conta: un caso chiuso non ha bozze (resolveCase le
 * cancella), ma se un salvataggio ne contenesse comunque una, deve vincere
 * il rapporto firmato — lo stesso ordine di precedenza del modello.
 */
function caseStatus(caseId: string | null | undefined, playable: boolean): { label: string; color: string } {
  const t = L().ui.map;
  const quality = caseId ? StateManager.caseQuality(caseId) : undefined;
  if (quality === 'wrong') return { label: t.statusNonCompliant, color: COLOR_STR.warning };
  if (quality !== undefined) return { label: t.statusClosed, color: COLOR_STR.ok };
  if (!playable) return { label: t.statusSealed, color: COLOR_STR.paperDim };

  const draft = caseId ? StateManager.draftFor(caseId) : null;
  if (draft) {
    const { taken, total } = draftProgress(draft);
    return {
      label: taken > 0 ? fmt(t.statusDraft, { taken: String(taken), total: String(total) }) : t.statusDraftEvidence,
      color: COLOR_STR.accentText
    };
  }
  return { label: t.statusOpen, color: COLOR_STR.alertText };
}

export class CityMapScene extends Phaser.Scene {
  /** Selezione da tastiera (§11.2): indice nel vettore dei casi aperti. */
  private keyIndex = -1;
  private keyRing?: Phaser.GameObjects.Arc;

  constructor() {
    super('CityMap');
  }

  private readonly drift = { x: 0, y: 0 };
  private mapLayer?: Phaser.GameObjects.Image;
  private grainLayer?: Phaser.GameObjects.TileSprite;

  /** Fascicoli consigliati dalla sessione corrente, calcolati una volta. */
  private recommendedIds: Set<string> = new Set();

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_STR.carbon);
    // L'ispezione a sorpresa non consiglia: l'estrazione perderebbe senso.
    const plan = StateManager.gamePlan;
    this.recommendedIds = new Set(plan.mode === 'sorpresa' ? [] : plan.caseIds);
    fadeInScene(this, 300);
    AnalyticsSystem.page('map');
    AudioSystem.setMusicRole('city', 'city'); // no-op se già attivo
    // Parallasse: la mappa e la grana scorrono di pochi pixel seguendo il
    // puntatore, in direzioni opposte e con ampiezze diverse. La mappa è
    // disegnata più larga del riquadro esattamente del doppio della deriva,
    // altrimenti muovendola comparirebbe il fondo lungo i bordi.
    this.mapLayer = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'citymap')
      .setDisplaySize(GAME_WIDTH + PARALLAX_MAP * 2, GAME_HEIGHT + PARALLAX_MAP * 2);
    this.grainLayer = this.add
      .tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH + PARALLAX_GRAIN * 2, GAME_HEIGHT + PARALLAX_GRAIN * 2, 'noise')
      // stessa compensazione di addNoiseOverlay: qui il velo non è a tutto
      // schermo perché deve poter scorrere, ma la grana resta grana
      .setTileScale(1 / RENDER_SCALE)
      .setAlpha(0.6);

    // header istituzionale
    this.add.rectangle(GAME_WIDTH / 2, 30, GAME_WIDTH, 60, COLORS.carbon, 0.85);
    this.add.text(24, 18, L().ui.map.header, textStyle(15, COLOR_STR.paper));
    this.add.text(
      24,
      40,
      fmt(L().ui.map.progress, { done: StateManager.completedCount(), total: PLAYABLE_CASES.length }),
      textStyle(12, COLOR_STR.paperDim)
    );

    // HUD indicatori
    this.add.rectangle(GAME_WIDTH - 150, 150, 290, 190, COLORS.carbon, 0.8).setStrokeStyle(1, COLORS.iron);
    new IndicatorHud(this, GAME_WIDTH - 280, 72, 250);

    /**
     * LA RETE PRIMA DEI SEGNAPOSTO.
     *
     * I sistemi automatizzati di questa città si parlano, ed è l'unica cosa
     * che rende il tema comprensibile: un punteggio di credito che pesca
     * dai dati della scuola non è un caso isolato. La rete sta SOPRA la
     * texture e SOTTO i segnaposto, così i collegamenti passano dietro i
     * nodi invece di attraversarli.
     */
    const nodi: CivicNode[] = LOCATIONS.map((l) => {
      const c = l.caseId ? getCase(l.caseId) : null;
      const q = c ? StateManager.caseQuality(c.id) : undefined;
      let state: NodeState = 'inattivo';
      if (q === 'correct') state = 'chiusoBene';
      else if (q === 'wrong') state = 'chiusoMale';
      else if (q === 'partial') state = 'chiusoParziale';
      else if (c?.playable) state = 'aperto';
      return { id: l.id, x: l.x * GAME_WIDTH, y: l.y * GAME_HEIGHT, state };
    });
    drawCivicNetwork(this, nodi, !StateManager.reducedMotion);

    // Le cornici dei timbri d'esito. Sono mute: la parola la mette il
    // segnaposto, con un testo che segue la lingua scelta.
    createOutcomeStamps(this);

    for (const loc of LOCATIONS) this.buildMarker(loc.id);

    // Pulsanti di servizio: una riga sola, una larghezza sola, un passo
    // solo. Erano quattro larghezze diverse e tre distanze diverse, messe a
    // mano una alla volta man mano che i pulsanti nascevano.
    // capitoli 2.0: panoramica read-only, la selezione libera resta invariata
    const chapters = new ChaptersOverlay(this);
    // taccuino 2.1 (§7): cognizione esterna, sola lettura, aperto anche con N
    const notebook = new NotebookOverlay(this);
    const serviceButtons: Array<[string, () => void]> = [
      [L().ui.menu.archive, () => this.scene.start('Archive', { from: 'CityMap' })],
      [L().ui.map.menuButton, () => this.scene.start('Title')],
      [L().learningLayer.chapters.button, () => chapters.toggle()],
      [L().learningLayer.notebook.button, () => notebook.toggle()]
    ];
    const row = layoutHStack({ count: serviceButtons.length, left: 24, right: 744, gap: 16 });
    serviceButtons.forEach(([label, action], i) => {
      new Button(this, row.xs[i], GAME_HEIGHT - 36, label, action, { width: row.width, height: 38, fontSize: 12, variant: 'ghost' });
    });
    this.input.keyboard?.on('keydown-N', () => {
      if (!chapters.isOpen) notebook.toggle();
    });

    this.setupKeyboardSelection();
    this.syncReadingLayer();

    if (StateManager.completedCount() >= CASES_REQUIRED_FOR_FINALE) {
      new Button(this, GAME_WIDTH - 170, GAME_HEIGHT - 40, L().ui.map.finaleButton, () => {
        AudioSystem.alert();
        fadeOutScene(this, 400, () => this.scene.start('Finale'));
      }, { width: 260, variant: 'danger' });
      // avvisa solo finché il rapporto non è mai stato generato
      if (StateManager.endingId === null) {
        showToast(this, L().ui.map.finaleReadyToast, 'warning');
      }
    }
  }

  /** Casi aperti (giocabili e non completati), nell'ordine della mappa. */
  private openCases(): { caseId: string; locationId: string; x: number; y: number }[] {
    return LOCATIONS.filter((l) => {
      const c = l.caseId ? getCase(l.caseId) : null;
      return !!c?.playable && StateManager.caseQuality(c.id) === undefined;
    }).map((l) => ({ caseId: l.caseId!, locationId: l.id, x: l.x * GAME_WIDTH, y: l.y * GAME_HEIGHT }));
  }

  /**
   * Navigazione da tastiera (§11.2): le frecce scorrono i fascicoli aperti,
   * INVIO apre quello selezionato. Stesso percorso del puntatore, nessuna
   * interazione duplicata: cambia solo il modo di selezionare.
   */
  private setupKeyboardSelection(): void {
    const move = (delta: number): void => {
      const open = this.openCases();
      if (open.length === 0) return;
      this.keyIndex = (this.keyIndex + delta + open.length) % open.length;
      const sel = open[this.keyIndex];
      this.keyRing?.destroy();
      this.keyRing = this.add.circle(sel.x, sel.y, 34).setStrokeStyle(3, COLORS.accent, 1);
      ReadingLayer.announce(fmt(L().a11y.selectedCase, { name: locationName(sel.locationId) }));
    };
    for (const key of ['RIGHT', 'DOWN']) this.input.keyboard?.on(`keydown-${key}`, () => move(1));
    for (const key of ['LEFT', 'UP']) this.input.keyboard?.on(`keydown-${key}`, () => move(-1));
    this.input.keyboard?.on('keydown-ENTER', () => {
      const open = this.openCases();
      const sel = this.keyIndex >= 0 ? open[this.keyIndex] : undefined;
      if (!sel) return;
      AudioSystem.confirm();
      fadeOutScene(this, 250, () => this.scene.start('Case', { caseId: sel.caseId }));
    });
  }

  /** Strato di lettura (§11.1): stato della città e dei fascicoli. */
  private syncReadingLayer(): void {
    const t = L();
    ReadingLayer.setScene(t.a11y.mapTitle, [
      { text: fmt(t.ui.map.progress, { done: StateManager.completedCount(), total: PLAYABLE_CASES.length }) },
      { text: t.a11y.mapHint },
      {
        items: LOCATIONS.filter((l) => l.caseId).map((l) => {
          const c = getCase(l.caseId!);
          // stesso stato che si vede sul canvas, derivato dalla stessa funzione:
          // chi legge con uno strumento assistivo deve sapere dov'era rimasto
          // quanto chi guarda la mappa
          const status = caseStatus(l.caseId!, c.playable).label;
          return `${locationName(l.id)} — ${status}`;
        })
      }
    ]);
  }

  private buildMarker(locationId: string): void {
    const loc = LOCATIONS.find((l) => l.id === locationId)!;
    const x = loc.x * GAME_WIDTH;
    const y = loc.y * GAME_HEIGHT;
    const caseData = loc.caseId ? getCase(loc.caseId) : null;
    const quality = caseData ? StateManager.caseQuality(caseData.id) : undefined;
    const completed = quality !== undefined;
    const playable = !!caseData?.playable && !completed;
    const nonConforme = quality === 'wrong';

    const container = this.add.container(x, y);
    const ringColor = nonConforme ? COLORS.warning : completed ? COLORS.ok : playable ? COLORS.alert : COLORS.iron;
    const ring = this.add.circle(0, 0, 26, COLORS.carbon, 0.85).setStrokeStyle(2, ringColor);
    const icon = this.add.image(0, 0, loc.iconKey).setDisplaySize(28, 28).setAlpha(playable || completed ? 1 : 0.5);
    const nameTag = this.add
      .text(0, 42, locationName(loc.id).toUpperCase(), textStyle(12, completed ? (nonConforme ? COLOR_STR.warning : COLOR_STR.ok) : COLOR_STR.paper, { align: 'center' }))
      .setOrigin(0.5);
    const { label: statusLabel, color: statusColor } = caseStatus(caseData?.id, playable);
    const statusTag = this.add
      .text(0, 58, statusLabel, textStyle(12, statusColor))
      .setOrigin(0.5);
    container.add([ring, icon, nameTag, statusTag]);

    /**
     * La mappa porta i segni delle decisioni prese. Prima un caso chiuso si
     * distingueva solo per il colore dell'anello: un'informazione affidata
     * al solo colore, e per giunta minuscola. Ora c'è il timbro, che si
     * legge anche in bianco e nero.
     *
     * L'inclinazione viene dall'id del caso: sempre la stessa per quel
     * caso, diversa da quella del caso accanto, così due timbri vicini non
     * escono paralleli come due adesivi.
     */
    if (caseData && quality) {
      const key = OUTCOME_STAMP_KEYS[quality];
      if (this.textures.exists(key)) {
        const inclina = (seeded(`inclinazione:${caseData.id}`)() - 0.5) * 0.34;
        const timbro = this.add
          .image(0, -34, key)
          .setDisplaySize(OUTCOME_STAMP_SIZE.width, OUTCOME_STAMP_SIZE.height)
          .setRotation(inclina)
          .setAlpha(0.9);
        // La PAROLA non sta nella texture: è un testo di Phaser, quindi segue
        // la lingua scelta invece di restare quella del primo avvio.
        const esitoLabel: Record<'correct' | 'partial' | 'wrong', string> = {
          correct: L().ui.outcomes.conforme,
          partial: L().ui.outcomes.parziale,
          wrong: L().ui.outcomes.contestabile
        };
        const colore =
          quality === 'correct' ? COLOR_STR.ok : quality === 'wrong' ? COLOR_STR.alertText : COLOR_STR.warning;
        const parola = this.add
          .text(0, -34, esitoLabel[quality], textStyle(OUTCOME_STAMP_FONT, colore, { align: 'center' }))
          .setOrigin(0.5)
          .setRotation(inclina)
          .setAlpha(0.9);
        container.add([timbro, parola]);
      }
    }

    // Evidenzia i fascicoli del piano della modalità corrente (non blocca
    // gli altri: la mappa resta tutta aperta, come sempre).
    //
    // Prima la stella seguiva la missione scelta nelle impostazioni, che è
    // il posto che il giocatore non guarda mai. Ora segue la sessione che
    // ha appena composto premendo NUOVA PARTITA. L'ispezione a sorpresa non
    // ha stelle per definizione: suggerire i casi estratti a caso
    // vanificherebbe l'estrazione.
    if (caseData && playable && this.recommendedIds.has(caseData.id)) {
      const rec = this.add.text(0, 74, `★ ${L().ui.missions.recommendedTag}`, textStyle(11, COLOR_STR.accentText)).setOrigin(0.5);
      container.add(rec);
      ring.setStrokeStyle(2, COLORS.accent);
    }

    // pulsazione dei casi aperti
    if (playable && !StateManager.reducedMotion) {
      const pulse = this.add.circle(x, y, 26).setStrokeStyle(2, COLORS.alert, 0.8);
      this.tweens.add({ targets: pulse, scale: 1.6, alpha: 0, duration: 1500, repeat: -1 });
    }

    container.setSize(60, 60);
    container.setInteractive({ useHandCursor: playable })
      .on('pointerover', () => ring.setStrokeStyle(3, playable ? COLORS.accent : ringColor))
      .on('pointerout', () => ring.setStrokeStyle(2, ringColor))
      .on('pointerdown', () => {
        AudioSystem.init();
        if (!caseData) return;
        if (completed) {
          showToast(this, fmt(L().ui.map.alreadyClosedToast, { code: caseData.fileCode }), 'ok');
          return;
        }
        if (!caseData.playable) {
          AudioSystem.error();
          showToast(this, L().ui.map.sealedToast, 'warning');
          return;
        }
        AudioSystem.confirm();
        fadeOutScene(this, 250, () => this.scene.start('Case', { caseId: caseData.id }));
      });
  }

  /**
   * Segue il puntatore con inerzia. Con "riduci movimento" i due strati
   * restano fermi al centro: è movimento decorativo, non informazione, ed
   * è esattamente ciò che quell'impostazione chiede di togliere.
   */
  update(): void {
    if (!this.mapLayer || !this.grainLayer) return;
    const target = StateManager.reducedMotion
      ? { x: 0, y: 0 }
      : {
          x: (this.input.activePointer.worldX - GAME_WIDTH / 2) / (GAME_WIDTH / 2),
          y: (this.input.activePointer.worldY - GAME_HEIGHT / 2) / (GAME_HEIGHT / 2)
        };
    const ease = 0.06;
    this.drift.x += (Phaser.Math.Clamp(target.x, -1, 1) - this.drift.x) * ease;
    this.drift.y += (Phaser.Math.Clamp(target.y, -1, 1) - this.drift.y) * ease;
    this.mapLayer.setPosition(
      GAME_WIDTH / 2 - this.drift.x * PARALLAX_MAP,
      GAME_HEIGHT / 2 - this.drift.y * PARALLAX_MAP
    );
    // la grana va nel verso opposto: è ciò che dà la sensazione di due piani
    this.grainLayer.setPosition(
      GAME_WIDTH / 2 + this.drift.x * PARALLAX_GRAIN,
      GAME_HEIGHT / 2 + this.drift.y * PARALLAX_GRAIN
    );
  }
}

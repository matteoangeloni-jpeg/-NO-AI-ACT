import Phaser from 'phaser';
import type { EvidenceSource } from '../../data/types';
import { RENDER_SCALE } from '../../ui/theme';
import { drawDataGrid, drawGlitchBands, drawGrain, drawPaper, drawPunchHoles, drawRedactionBars, drawRegistryStrip, seeded } from './kit';

/**
 * SETTE DOCUMENTI, NON SETTE DECORAZIONI.
 *
 * Un reperto non è un riquadro di testo: è un pezzo di carta arrivato da
 * qualche parte, e da dove arriva cambia quanto ci si può fidare. Il gioco
 * lo diceva già con un'etichetta ("Fonte: reclamo"), che però si legge solo
 * se la si cerca. Qui la provenienza si vede prima di leggere.
 *
 * Il dato ESISTE GIÀ: `clueSources` in i18n porta esattamente questi sette
 * valori. Non si inventa niente e non si scrive contenuto nuovo — si dà una
 * forma a una classificazione che il gioco faceva già.
 *
 * Ogni trattamento deve rispondere a una domanda sola: **come arriva in
 * mano a un ispettore un documento di quel tipo?** Da lì scendono i tratti,
 * non dal gusto.
 *
 *   amministrativa  atto d'ufficio protocollato → righe da modulo, margine
 *                   rosso, fori da faldone
 *   tecnica         perizia → reticolo tecnico, niente righe
 *   log             tabulato di macchina → reticolo fitto, monocromo freddo
 *   interna         nota non destinata a uscire → omissis, carta più scura
 *   reclamo         scritto da una persona → foglio chiaro, nessun reticolo
 *   vendor          materiale promozionale → fondo più chiaro, niente grana
 *   pubblica        comunicato → intestazione larga, molto vuoto
 *
 * Una texture per tipo, generata una volta e condivisa da tutte le schede:
 * sette canvas in tutto, non uno per reperto.
 */

export interface DocumentStyle {
  /** Fondo del foglio. */
  fill: string;
  /** Passo delle righe da modulo; 0 = nessuna. */
  ruleStep: number;
  ruleColor: string;
  /** Colonna di margine; 0 = nessuna. */
  marginX: number;
  marginColor: string;
  /** Grana, 0..1: quanto il foglio sembra stampato e maneggiato. */
  grain: number;
  /** Colore del bordo della scheda. */
  border: string;
  /** Reticolo tecnico: passo in unità logiche, 0 = nessuno. */
  gridStep: number;
  gridColor: string;
  /** Righe di omissis nel corpo. */
  redactions: number;
  /** Fori da faldone sul margine sinistro. */
  punched: boolean;
  /** Bande di disturbo: documenti che non tornano. */
  glitch: number;
}

/**
 * I sette trattamenti. I colori restano dentro la palette del gioco —
 * l'identità è bureaucratic cyber-noir, non sette tinte diverse.
 */
export const DOCUMENT_STYLES: Record<EvidenceSource, DocumentStyle> = {
  amministrativa: {
    fill: '#101a30',
    ruleStep: 22,
    ruleColor: 'rgba(74,82,96,0.20)',
    marginX: 26,
    marginColor: 'rgba(210,59,59,0.28)',
    grain: 0.5,
    border: 'rgba(74,82,96,0.85)',
    gridStep: 0,
    gridColor: '',
    redactions: 0,
    punched: true,
    glitch: 0
  },
  tecnica: {
    fill: '#0d1626',
    ruleStep: 0,
    ruleColor: '',
    marginX: 0,
    marginColor: '',
    grain: 0.35,
    border: 'rgba(93,127,184,0.7)',
    gridStep: 14,
    gridColor: 'rgba(93,127,184,0.10)',
    redactions: 0,
    punched: false,
    glitch: 0
  },
  log: {
    fill: '#080f1c',
    ruleStep: 0,
    ruleColor: '',
    marginX: 0,
    marginColor: '',
    grain: 0.25,
    border: 'rgba(93,127,184,0.55)',
    gridStep: 8,
    gridColor: 'rgba(93,127,184,0.13)',
    redactions: 0,
    punched: false,
    // il tabulato di un sistema opaco non torna mai del tutto
    glitch: 5
  },
  interna: {
    fill: '#0b1120',
    ruleStep: 26,
    ruleColor: 'rgba(74,82,96,0.13)',
    marginX: 0,
    marginColor: '',
    grain: 0.7,
    border: 'rgba(217,165,33,0.5)',
    gridStep: 0,
    gridColor: '',
    // non doveva uscire dall'ufficio: esce epurata
    redactions: 3,
    punched: false,
    glitch: 0
  },
  reclamo: {
    fill: '#13203a',
    ruleStep: 24,
    ruleColor: 'rgba(216,214,205,0.10)',
    marginX: 0,
    marginColor: '',
    grain: 0.8,
    border: 'rgba(216,214,205,0.45)',
    gridStep: 0,
    gridColor: '',
    redactions: 0,
    punched: false,
    glitch: 0
  },
  vendor: {
    fill: '#152039',
    ruleStep: 0,
    ruleColor: '',
    marginX: 0,
    marginColor: '',
    // carta patinata: la brochure non ha grana
    grain: 0.1,
    border: 'rgba(63,166,106,0.5)',
    gridStep: 0,
    gridColor: '',
    redactions: 0,
    punched: false,
    glitch: 0
  },
  pubblica: {
    fill: '#0f1a2e',
    ruleStep: 30,
    ruleColor: 'rgba(74,82,96,0.12)',
    marginX: 0,
    marginColor: '',
    grain: 0.3,
    border: 'rgba(93,127,184,0.45)',
    gridStep: 0,
    gridColor: '',
    redactions: 0,
    punched: false,
    glitch: 0
  }
};

/**
 * Trattamento del reperto senza fonte dichiarata. Sei casi su tredici non
 * hanno ancora `clueSources`, e per quelli il foglio deve restare NEUTRO:
 * inventare una provenienza sarebbe peggio che non mostrarne nessuna,
 * perché la fonte in questo gioco è un elemento di attendibilità.
 */
export const NEUTRAL_STYLE: DocumentStyle = {
  fill: '#101a30',
  ruleStep: 0,
  ruleColor: '',
  marginX: 0,
  marginColor: '',
  grain: 0.4,
  border: 'rgba(74,82,96,0.85)',
  gridStep: 0,
  gridColor: '',
  redactions: 0,
  punched: false,
  glitch: 0
};

/** Chiave della texture per una fonte (o per il foglio neutro). */
export const documentTextureKey = (source: EvidenceSource | null): string =>
  source ? `doc_${source}` : 'doc_neutral';

/**
 * Genera le texture dei fogli. Una per tipo, non una per reperto: le schede
 * di uno stesso tipo condividono lo stesso canvas, quindi il costo è di
 * otto texture per partita a prescindere da quanti reperti ci sono.
 */
export function createDocumentTextures(scene: Phaser.Scene, width: number, height: number): void {
  const voci: [EvidenceSource | null, DocumentStyle][] = [
    ...(Object.entries(DOCUMENT_STYLES) as [EvidenceSource, DocumentStyle][]),
    [null, NEUTRAL_STYLE]
  ];

  for (const [source, style] of voci) {
    const key = documentTextureKey(source);
    if (scene.textures.exists(key)) continue;
    const canvas = scene.textures.createCanvas(key, width * RENDER_SCALE, height * RENDER_SCALE);
    if (!canvas) continue;
    const ctx = canvas.getContext();
    ctx.scale(RENDER_SCALE, RENDER_SCALE);

    // Seme dal tipo: lo stesso documento ha sempre la stessa faccia, e due
    // tipi diversi non condividono per caso la stessa disposizione.
    const rnd = seeded(`documento:${source ?? 'neutro'}`);

    drawPaper(ctx, width, height, {
      fill: style.fill,
      ruleStep: style.ruleStep,
      ruleColor: style.ruleColor,
      marginX: style.marginX,
      marginColor: style.marginColor
    });

    if (style.gridStep > 0) {
      drawDataGrid(ctx, 0, 30, width, height - 30, style.gridStep, style.gridColor);
    }
    if (style.punched) {
      drawPunchHoles(ctx, 13, height, 'rgba(7,9,15,0.85)');
    }
    if (style.redactions > 0) {
      // in basso, dove il corpo del testo finisce: non coprono mai la lettura
      drawRedactionBars(ctx, rnd, 18, height - 58, width - 36, style.redactions);
    }
    if (style.glitch > 0) {
      drawGlitchBands(ctx, rnd, width, height, style.glitch, 'rgba(93,127,184,0.18)');
    }

    // fascia d'intestazione: il posto dove la scheda scrive codice e fonte
    ctx.fillStyle = 'rgba(7,9,15,0.55)';
    ctx.fillRect(0, 0, width, 28);

    /**
     * Sigla di protocollo d'angolo, SENZA PAROLE: trattini di registrazione
     * invece della stringa "AX/123-45" che c'era prima. Non è purismo — una
     * texture nasce una volta sola e sopravvive al cambio di lingua, quindi
     * qualunque cosa scritta qui dentro resta nella lingua di chi l'ha
     * scritta. La striscia dice la stessa cosa e non ha una lingua.
     */
    drawRegistryStrip(ctx, rnd, width - 78, height - 14, 70, 6, 'rgba(216,214,205,0.22)');

    // la grana per ultima: sopra ogni tratto, in pixel veri
    drawGrain(ctx, canvas.width, canvas.height, rnd, style.grain);

    canvas.refresh();
  }
}

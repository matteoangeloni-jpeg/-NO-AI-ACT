import Phaser from 'phaser';
import { RENDER_SCALE } from '../../ui/theme';
import { drawCornerTicks, drawDoubleRule, drawGrain, drawPaper, drawPunchHoles, seeded } from './kit';

/**
 * LE DUE CARTE: il fascicolo e il rapporto.
 *
 * Erano una sola texture, usata da entrambe le schermate e stirata da
 * 900×560 a 940×580 sul rapporto — e con dentro, cotto nei pixel, un timbro
 * fisso che diceva "NON CLASSIFICATO / ISPETTORATO AX".
 *
 * Quel timbro era il difetto strutturale da rimuovere, per due motivi.
 *
 * 1. NON POTEVA VARIARE. Un timbro è il segno di un atto singolo: uguale su
 *    tredici fascicoli diversi legge come sfondo, non come atto. E non
 *    poteva portare lo stato del caso, perché la texture nasce una volta
 *    sola nel preload, quando ancora non si sa cosa farà il giocatore.
 * 2. ERA IN ITALIANO ANCHE IN INGLESE. Le parole cotte in una texture non
 *    passano da i18n: chi giocava in inglese leggeva comunque "ISPETTORATO".
 *
 * Ora la carta porta solo segni SENZA PAROLE — righe, margini, fori da
 * faldone, crocini di taglio, striscia di protocollo — e tutto ciò che
 * parla o che dipende dal caso è un oggetto separato, sopra il foglio.
 *
 * Il rapporto ha una carta sua, generata alla misura in cui si mostra
 * invece di essere un ingrandimento della carta del fascicolo.
 */

export interface PaperSpec {
  key: string;
  /** Misura logica: la stessa con cui la scena la mostra. */
  width: number;
  height: number;
  fill: string;
  /** Passo delle righe da modulo; 0 = nessuna. */
  ruleStep: number;
  /** Colonna di margine; 0 = nessuna. */
  marginX: number;
  /** Altezza della fascia d'intestazione. */
  headerBand: number;
  grain: number;
}

/**
 * Le due carte. Le misure NON sono decorative: sono quelle con cui le scene
 * mostrano l'immagine, e generare alla misura giusta è ciò che evita lo
 * stiramento che il rapporto subiva.
 */
export const PAPER_SPECS: PaperSpec[] = [
  {
    // fascicolo: modulo rigato da archivio, con margine rosso e faldone
    key: 'dossier_paper',
    width: 900,
    height: 360,
    fill: '#101a30',
    ruleStep: 28,
    marginX: 70,
    headerBand: 56,
    grain: 0.45
  },
  {
    /**
     * ISTRUTTORIA: il foglio su cui si costruisce la decisione.
     *
     * Serve una carta SUA e non quella del fascicolo, per una ragione di
     * misura e non di gusto: la decisione occupa quasi tutto lo schermo —
     * colonna dei reperti a sinistra, stato della città a destra — e la
     * carta del fascicolo, larga 900, ci finiva in mezzo come un rettangolo
     * appoggiato sopra, con i suoi bordi che tagliavano la domanda in alto
     * e la colonna a destra. Stirarla sarebbe stato peggio: la carta
     * generata si mostra alla misura in cui è nata.
     *
     * Niente righe da modulo: qui non si compila, si sceglie.
     */
    key: 'decision_paper',
    width: 1180,
    height: 620,
    fill: '#0d1626',
    ruleStep: 0,
    marginX: 0,
    headerBand: 0,
    grain: 0.3
  },
  {
    // rapporto ispettivo: atto in uscita, non modulo rigato. Niente righe:
    // il corpo del rapporto è una colonna di coppie etichetta/valore ad
    // altezze variabili, e delle righe fisse sotto ci passerebbero in mezzo.
    key: 'report_paper',
    width: 940,
    height: 580,
    fill: '#0f1a2e',
    ruleStep: 0,
    marginX: 0,
    headerBand: 62,
    grain: 0.35
  }
];

/** Le carte dei documenti: fascicolo e rapporto, generate una volta sola. */
export function createDossierTextures(scene: Phaser.Scene): void {
  for (const spec of PAPER_SPECS) {
    if (scene.textures.exists(spec.key)) continue;
    const canvas = scene.textures.createCanvas(spec.key, spec.width * RENDER_SCALE, spec.height * RENDER_SCALE);
    if (!canvas) continue;
    const ctx = canvas.getContext();
    ctx.scale(RENDER_SCALE, RENDER_SCALE);

    const rnd = seeded(`carta:${spec.key}`);
    const { width: w, height: h } = spec;

    drawPaper(ctx, w, h, {
      fill: spec.fill,
      ruleStep: spec.ruleStep,
      ruleColor: 'rgba(74,82,96,0.16)',
      marginX: spec.marginX,
      marginColor: 'rgba(210,59,59,0.25)'
    });

    // fascia d'intestazione: il posto dove la scena scrive codice e titolo.
    // Più scura della carta, così il testo chiaro ci sta sopra con margine.
    if (spec.headerBand > 0) {
      ctx.fillStyle = 'rgba(7,9,15,0.45)';
      ctx.fillRect(0, 0, w, spec.headerBand);
      drawDoubleRule(ctx, 18, spec.headerBand, w - 36, 'rgba(74,82,96,0.55)', 'rgba(74,82,96,0.22)');
    }

    // fori da faldone: il dettaglio che fa leggere "archiviato"
    drawPunchHoles(ctx, 20, h, 'rgba(7,9,15,0.85)');

    // crocini di taglio: modulo stampato, non pannello dell'interfaccia
    drawCornerTicks(ctx, w, h, 12, 14, 'rgba(74,82,96,0.45)');

    /**
     * NESSUNA STRISCIA GENERICA QUI. La carta ne aveva una, disegnata da un
     * seme qualunque: un codice a barre che non codificava niente, cioè una
     * decorazione che su un atto amministrativo promette un dato che non
     * c'è. La striscia vera la disegna la scena, e porta le cifre del
     * protocollo di QUELLA pratica.
     */

    // la grana per ultima, sopra ogni tratto, in pixel veri del canvas
    drawGrain(ctx, canvas.width, canvas.height, rnd, spec.grain);

    canvas.refresh();
  }
}

import Phaser from 'phaser';
import { COLORS, COLOR_STR, RENDER_SCALE } from '../../ui/theme';
import { between, drawStamp, seeded } from './kit';

/**
 * LA RETE CIVICA: la mappa smette di essere uno sfondo.
 *
 * La mappa era una texture statica con dei segnaposto sopra. Bella, ma
 * muta: non diceva che i sistemi automatizzati della città *si parlano*,
 * che è l'unica cosa che rende il tema comprensibile. Un punteggio di
 * credito che pesca dai dati della scuola non è un caso isolato, è un nodo
 * di una rete — e questo si vede o non si vede.
 *
 * Qui la rete è disegnata SOPRA la texture e SOTTO i segnaposto, e riflette
 * lo stato: un collegamento verso un fascicolo aperto pulsa, uno verso un
 * caso chiuso male resta interrotto, uno verso un caso chiuso bene è una
 * linea ferma.
 *
 * LE CONNESSIONI SI RICAVANO, NON SI SCRIVONO. Ogni nodo si collega ai due
 * più vicini. È una topologia plausibile per un'amministrazione — i sistemi
 * si parlano soprattutto per prossimità di competenza — e soprattutto non
 * è un dato da mantenere: aggiungere un luogo aggiunge i suoi collegamenti
 * da solo, invece di lasciare un nodo isolato che nessuno nota.
 */

/** Stato di un nodo, dal punto di vista di chi guarda la mappa. */
export type NodeState = 'aperto' | 'chiusoBene' | 'chiusoMale' | 'chiusoParziale' | 'inattivo';

export interface CivicNode {
  id: string;
  x: number;
  y: number;
  state: NodeState;
}

/** Quanti vicini collega ogni nodo. Due: una rete, non una ragnatela. */
const GRADO = 2;

/**
 * Le coppie collegate, ricavate dalla posizione. Simmetriche e senza
 * doppioni: se A sceglie B e B sceglie A, il collegamento è uno solo.
 */
export function deriveLinks(nodes: CivicNode[]): [number, number][] {
  const coppie = new Set<string>();
  const out: [number, number][] = [];
  nodes.forEach((n, i) => {
    const vicini = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((v) => v.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, GRADO);
    for (const v of vicini) {
      const chiave = i < v.j ? `${i}-${v.j}` : `${v.j}-${i}`;
      if (coppie.has(chiave)) continue;
      coppie.add(chiave);
      out.push([i, v.j]);
    }
  });
  return out;
}

/**
 * Il collegamento prende il carattere dal capo PEGGIORE. Un flusso di dati
 * fra un sistema sano e uno fuori norma non è sano a metà: è quello il
 * punto del gioco.
 */
function linkStyle(a: NodeState, b: NodeState): { color: number; alpha: number; width: number; rotto: boolean } {
  const peggiore: NodeState[] = ['chiusoMale', 'aperto', 'chiusoParziale', 'chiusoBene', 'inattivo'];
  const stato = peggiore.find((s) => s === a || s === b) ?? 'inattivo';
  switch (stato) {
    case 'chiusoMale':
      return { color: COLORS.alert, alpha: 0.55, width: 1.5, rotto: true };
    case 'aperto':
      return { color: COLORS.accent, alpha: 0.45, width: 1.5, rotto: false };
    case 'chiusoParziale':
      return { color: COLORS.warning, alpha: 0.35, width: 1, rotto: false };
    case 'chiusoBene':
      return { color: COLORS.ok, alpha: 0.3, width: 1, rotto: false };
    default:
      return { color: COLORS.iron, alpha: 0.25, width: 1, rotto: false };
  }
}

/**
 * Disegna la rete. Restituisce l'oggetto Graphics, che il chiamante
 * inserisce a una profondità sotto i segnaposto.
 *
 * Un collegamento "rotto" non è una linea tratteggiata decorativa: è una
 * linea con un vuoto nel mezzo, perché il dato lì non passa più come
 * dovrebbe. La differenza si vede anche in bianco e nero, che è il motivo
 * per cui non è affidata al solo colore.
 */
export function drawCivicNetwork(scene: Phaser.Scene, nodes: CivicNode[]): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const links = deriveLinks(nodes);
  const rnd = seeded('rete-civica');

  for (const [i, j] of links) {
    const a = nodes[i];
    const b = nodes[j];
    const st = linkStyle(a.state, b.state);
    g.lineStyle(st.width, st.color, st.alpha);

    if (!st.rotto) {
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
      continue;
    }

    // interrotto: due tronconi e un vuoto al centro, di ampiezza variabile
    const buco = between(rnd, 0.16, 0.3);
    const t1 = 0.5 - buco / 2;
    const t2 = 0.5 + buco / 2;
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.lineTo(a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1);
    g.strokePath();
    g.beginPath();
    g.moveTo(a.x + (b.x - a.x) * t2, a.y + (b.y - a.y) * t2);
    g.lineTo(b.x, b.y);
    g.strokePath();
  }

  // Pacchetti di dati: un punto a metà dei collegamenti attivi. Sta fermo —
  // il movimento lo aggiunge la scena, e solo se il giocatore lo permette.
  for (const [i, j] of links) {
    const a = nodes[i];
    const b = nodes[j];
    if (a.state !== 'aperto' && b.state !== 'aperto') continue;
    g.fillStyle(COLORS.accent, 0.5);
    g.fillCircle((a.x + b.x) / 2, (a.y + b.y) / 2, 2);
  }

  return g;
}

/**
 * Timbro d'esito sul segnaposto di un caso chiuso: la mappa porta i segni
 * delle decisioni prese, invece di dimenticarle appena si cambia schermata.
 *
 * Tre texture in tutto, condivise da tutti i segnaposto. La rotazione la
 * mette il chiamante, così due timbri uguali non escono paralleli.
 */
export const OUTCOME_STAMP_KEYS: Record<'correct' | 'partial' | 'wrong', string> = {
  correct: 'stamp_conforme',
  partial: 'stamp_parziale',
  wrong: 'stamp_contestabile'
};

const STAMP_W = 132;
const STAMP_H = 30;

/**
 * Genera i tre timbri. Le etichette arrivano dal chiamante perché il gioco è
 * bilingue e i testi vivono in i18n: un timbro con la parola scritta qui
 * dentro sarebbe italiano anche per chi gioca in inglese.
 */
export function createOutcomeStamps(
  scene: Phaser.Scene,
  etichette: Record<'correct' | 'partial' | 'wrong', string>
): void {
  const colori: Record<'correct' | 'partial' | 'wrong', string> = {
    correct: COLOR_STR.ok,
    partial: COLOR_STR.warning,
    wrong: COLOR_STR.alertText
  };

  for (const esito of ['correct', 'partial', 'wrong'] as const) {
    const key = OUTCOME_STAMP_KEYS[esito];
    if (scene.textures.exists(key)) continue;
    const canvas = scene.textures.createCanvas(key, STAMP_W * RENDER_SCALE, STAMP_H * RENDER_SCALE);
    if (!canvas) continue;
    const ctx = canvas.getContext();
    ctx.scale(RENDER_SCALE, RENDER_SCALE);
    ctx.translate(STAMP_W / 2, STAMP_H / 2);
    // Seme dall'esito: lo stesso timbro è sempre consumato allo stesso modo,
    // ma tre esiti diversi non escono identici.
    drawStamp(ctx, seeded(`timbro:${esito}`), {
      lines: [etichette[esito]],
      color: colori[esito],
      width: STAMP_W - 8,
      height: STAMP_H - 8,
      fontSize: 11,
      wear: 0.22
    });
    canvas.refresh();
  }
}

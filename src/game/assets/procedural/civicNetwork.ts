import Phaser from 'phaser';
import { COLORS } from '../../ui/theme';
import { between, seeded } from './kit';

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
export function drawCivicNetwork(
  scene: Phaser.Scene,
  nodes: CivicNode[],
  animate = false
): Phaser.GameObjects.Graphics {
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

  /**
   * PACCHETTI DI DATI sui collegamenti verso un fascicolo aperto.
   *
   * Dicono una cosa sola, e per questo ci sono: il dato *passa adesso*. Un
   * caso aperto non è una pratica ferma in un cassetto, è un sistema in
   * funzione che continua a decidere sulle persone mentre l'ispettore ci
   * pensa. Su un caso chiuso non si muove niente.
   *
   * IL MOVIMENTO È UN'AGGIUNTA, MAI IL PORTATORE DELL'INFORMAZIONE. Con
   * `reducedMotion` il pacchetto resta un punto fermo a metà del
   * collegamento: la stessa informazione, senza moto. Chi ha chiesto di non
   * vedere animazioni non perde niente di leggibile — perde solo l'effetto.
   */
  const attivi = links.filter(([i, j]) => nodes[i].state === 'aperto' || nodes[j].state === 'aperto');
  for (const [i, j] of attivi) {
    const a = nodes[i];
    const b = nodes[j];
    if (!animate) {
      g.fillStyle(COLORS.accent, 0.5);
      g.fillCircle((a.x + b.x) / 2, (a.y + b.y) / 2, 2);
      continue;
    }
    // Il verso va dal nodo sano verso quello aperto: il dato arriva al
    // fascicolo sotto ispezione, non ne esce.
    const [da, verso] = a.state === 'aperto' ? [b, a] : [a, b];
    const pacchetto = scene.add.circle(da.x, da.y, 2, COLORS.accent, 0.6);
    pacchetto.setDepth(g.depth);
    scene.tweens.add({
      targets: pacchetto,
      x: verso.x,
      y: verso.y,
      duration: 2600,
      // sfalsati: dodici punti che partono insieme sono una parata, non un flusso
      delay: between(seeded(`pacchetto:${a.id}:${b.id}`), 0, 2200),
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  return g;
}

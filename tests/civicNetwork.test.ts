import { describe, expect, it } from 'vitest';
import { deriveLinks, type CivicNode } from '../src/game/assets/procedural/civicNetwork';
import { LOCATIONS } from '../src/game/data/cases';
import { GAME_HEIGHT, GAME_WIDTH } from '../src/game/ui/theme';

/**
 * RETE CIVICA — le proprietà della topologia.
 *
 * I collegamenti non sono scritti a mano: si ricavano dalla posizione dei
 * luoghi. È la scelta giusta — aggiungere un luogo aggiunge i suoi
 * collegamenti da solo — ma sposta il rischio: un difetto nel calcolo
 * produce una mappa *plausibile* e sbagliata, per esempio con un nodo
 * isolato che nessuno nota perché la mappa sembra comunque una rete.
 *
 * I nodi si leggono da LOCATIONS, non da un elenco ricopiato qui: se un
 * giorno un luogo finisce in un angolo lontano da tutti, questi controlli
 * lo vedono.
 */

const nodiVeri = (): CivicNode[] =>
  LOCATIONS.map((l) => ({
    id: l.id,
    x: l.x * GAME_WIDTH,
    y: l.y * GAME_HEIGHT,
    state: 'inattivo' as const
  }));

describe('la rete collega tutti i nodi', () => {
  it('nessun luogo resta isolato sulla mappa vera', () => {
    const nodi = nodiVeri();
    const links = deriveLinks(nodi);
    const collegati = new Set<number>();
    for (const [a, b] of links) {
      collegati.add(a);
      collegati.add(b);
    }
    const isolati = nodi.map((n, i) => (collegati.has(i) ? null : n.id)).filter(Boolean);
    expect(isolati, `luoghi senza nessun collegamento: ${isolati.join(', ')}`).toEqual([]);
  });

  it('un collegamento compare una volta sola, in qualunque verso', () => {
    const links = deriveLinks(nodiVeri());
    const chiavi = links.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`));
    expect(new Set(chiavi).size, 'la stessa coppia è collegata due volte').toBe(chiavi.length);
  });

  it('nessun nodo si collega a sé stesso', () => {
    const links = deriveLinks(nodiVeri());
    expect(links.filter(([a, b]) => a === b)).toEqual([]);
  });

  it('la rete resta una rete, non una ragnatela', () => {
    // Con grado 2 il numero di archi sta fra n/2 (tutti reciproci) e 2n.
    // Sopra quella soglia la mappa diventa illeggibile.
    const nodi = nodiVeri();
    const links = deriveLinks(nodi);
    expect(links.length).toBeGreaterThanOrEqual(Math.floor(nodi.length / 2));
    expect(links.length, 'troppi collegamenti: la mappa diventa una ragnatela').toBeLessThanOrEqual(nodi.length * 2);
  });

  it('due nodi bastano a fare un collegamento, e uno solo non ne fa nessuno', () => {
    const due: CivicNode[] = [
      { id: 'a', x: 0, y: 0, state: 'inattivo' },
      { id: 'b', x: 10, y: 0, state: 'inattivo' }
    ];
    expect(deriveLinks(due)).toHaveLength(1);
    expect(deriveLinks([due[0]])).toEqual([]);
    expect(deriveLinks([])).toEqual([]);
  });

  it('collega davvero i più VICINI, non i primi dell\'elenco', () => {
    /**
     * Il difetto da cui questo controllo protegge: un ordinamento sbagliato
     * produrrebbe una rete completa e plausibile, che però non ha niente a
     * che vedere con la geografia della città — e a occhio non si distingue.
     */
    const nodi: CivicNode[] = [
      { id: 'vicino1', x: 0, y: 0, state: 'inattivo' },
      { id: 'vicino2', x: 5, y: 0, state: 'inattivo' },
      { id: 'vicino3', x: 10, y: 0, state: 'inattivo' },
      { id: 'lontano', x: 900, y: 600, state: 'inattivo' }
    ];
    const links = deriveLinks(nodi);
    const coppie = links.map(([a, b]) => [nodi[a].id, nodi[b].id].sort().join('|'));

    // Il nodo lontano si aggancia ai due più vicini A LUI — vicino3 (il più
    // prossimo) e vicino2 — mai al più distante del gruppo. È questo a
    // distinguere "collega i vicini" da "collega i primi dell'elenco": con
    // un ordinamento sbagliato il lontano finirebbe su vicino1.
    expect(coppie).toContain('lontano|vicino3');
    expect(coppie, 'il nodo lontano si è agganciato al più distante del gruppo').not.toContain('lontano|vicino1');

    // e il gruppo compatto resta collegato al suo interno
    expect(coppie).toContain('vicino1|vicino2');
    expect(coppie).toContain('vicino2|vicino3');
  });
});

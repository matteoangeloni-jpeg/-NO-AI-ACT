import { describe, expect, it } from 'vitest';
import { THEME_BUILDERS, THEME_IDS } from '../src/game/systems/musicThemes';
import { PLAYABLE_CASES } from '../src/game/data/cases';

/**
 * UN TIMBRO PER FASCICOLO.
 *
 * Sei casi su tredici prendevano in prestito il tema di un altro: l'ufficio
 * appalti suonava identico al punteggio sui sussidi, la polizia predittiva
 * identica al centro di sorveglianza. Nessun errore, nessun difetto visibile
 * — solo che chi giocava due fascicoli di fila si ritrovava nella stessa
 * stanza, e la musica smetteva di dire dove si trova.
 *
 * Questi controlli non ascoltano (per quello c'è lo smoke audio, che rende i
 * temi con un OfflineAudioContext vero): qui si verifica che la mappa dei
 * temi copra tutti i casi e non faccia prestiti.
 */
describe('ogni fascicolo giocabile ha il suo tema', () => {
  it('nessun caso resta senza tema', () => {
    const missing = PLAYABLE_CASES.map((c) => c.id).filter((id) => !(id in THEME_BUILDERS));
    expect(missing, missing.join(', ')).toEqual([]);
  });

  it('nessun caso prende in prestito il tema di un altro', () => {
    const byBuilder = new Map<unknown, string[]>();
    for (const c of PLAYABLE_CASES) {
      const b = THEME_BUILDERS[c.id];
      byBuilder.set(b, [...(byBuilder.get(b) ?? []), c.id]);
    }
    const shared = [...byBuilder.values()].filter((ids) => ids.length > 1).map((ids) => ids.join(' = '));
    expect(shared, shared.join('\n')).toEqual([]);
  });

  it('la mappa non contiene temi che nessun caso usa (a parte la città)', () => {
    const used = new Set<string>(PLAYABLE_CASES.map((c) => c.id));
    const orphans = THEME_IDS.filter((id) => id !== 'city' && !used.has(id));
    expect(orphans, orphans.join(', ')).toEqual([]);
  });

  it('la città ha un tema suo, separato da quelli dei fascicoli', () => {
    expect(THEME_BUILDERS.city).toBeTypeOf('function');
    const caseBuilders = PLAYABLE_CASES.map((c) => THEME_BUILDERS[c.id]);
    expect(caseBuilders, 'la mappa non deve suonare come un fascicolo').not.toContain(THEME_BUILDERS.city);
  });
});

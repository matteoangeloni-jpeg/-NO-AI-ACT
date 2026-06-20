import { describe, expect, it } from 'vitest';
import { CITY_INDICATORS, cityDossier, caseDossierUpdate, trendFor } from '../src/game/systems/CityDossier';

describe('v0.5 — fascicolo città (effetti sistemici)', () => {
  it('default sicuro: nessun caso chiuso ⇒ tutto stabile', () => {
    const d = cityDossier([]);
    expect(d).toHaveLength(5);
    expect(d.every((l) => l.trend === 'stable')).toBe(true);
  });

  it('copre tutte e cinque le dimensioni nell ordine atteso', () => {
    expect(cityDossier([]).map((l) => l.indicator)).toEqual(CITY_INDICATORS);
  });

  it('un atto conforme migliora fiducia e diritti, riduce opacità', () => {
    const byKey = Object.fromEntries(cityDossier(['conforme']).map((l) => [l.indicator, l.trend]));
    expect(byKey.publicTrust).toBe('improving');
    expect(byKey.fundamentalRights).toBe('improving');
    expect(byKey.administrativeOpacity).toBe('improving'); // meno opacità = bene
  });

  it('un atto contestabile alza il rischio contenzioso', () => {
    const byKey = Object.fromEntries(cityDossier(['contestabile']).map((l) => [l.indicator, l.trend]));
    expect(byKey.litigationRisk).toBe('worsening');
  });

  it("un atto non conforme peggiora diritti e opacità", () => {
    const byKey = Object.fromEntries(cityDossier(['non_conforme']).map((l) => [l.indicator, l.trend]));
    expect(byKey.fundamentalRights).toBe('worsening');
    expect(byKey.administrativeOpacity).toBe('worsening');
  });

  it("l'efficienza dei servizi resta sempre sotto osservazione quando cambia", () => {
    expect(trendFor('serviceEfficiency', -1)).toBe('watch');
    expect(trendFor('serviceEfficiency', 1)).toBe('watch');
    expect(trendFor('serviceEfficiency', 0)).toBe('stable');
  });

  it('aggiornamento per singolo caso disponibile per la UI', () => {
    const update = caseDossierUpdate('conforme');
    expect(update).toHaveLength(5);
    expect(update.find((l) => l.indicator === 'publicTrust')?.trend).toBe('improving');
  });
});

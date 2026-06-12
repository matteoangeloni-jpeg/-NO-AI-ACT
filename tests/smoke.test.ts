import { describe, expect, it } from 'vitest';
import { CASES, CASES_REQUIRED_FOR_FINALE, LOCATIONS, PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import { NORMS, getNorm } from '../src/game/data/norms';
import { ENDINGS, computeEnding, FINAL_MESSAGE } from '../src/game/data/endings';
import { INITIAL_INDICATORS, applyOutcome, clampIndicator } from '../src/game/data/indicators';
import { evaluateDecision, isAdjacentClassification } from '../src/game/systems/CaseSystem';

describe('integrità dei dati di gioco', () => {
  it('ha 6 luoghi e 6 casi, di cui almeno 4 giocabili', () => {
    expect(LOCATIONS).toHaveLength(6);
    expect(CASES).toHaveLength(6);
    expect(PLAYABLE_CASES.length).toBeGreaterThanOrEqual(4);
    expect(PLAYABLE_CASES.length).toBeGreaterThanOrEqual(CASES_REQUIRED_FOR_FINALE);
  });

  it('ogni caso referenzia una norma e un luogo esistenti', () => {
    for (const c of CASES) {
      expect(() => getNorm(c.normId)).not.toThrow();
      expect(LOCATIONS.some((l) => l.id === c.locationId)).toBe(true);
      expect(c.clues).toHaveLength(3);
      expect(c.correctMeasures.length).toBeGreaterThan(0);
    }
  });

  it('ogni luogo con caso punta a un caso esistente', () => {
    for (const l of LOCATIONS) {
      if (l.caseId) expect(() => getCase(l.caseId!)).not.toThrow();
    }
  });

  it('ha 6 carte norma con i campi obbligatori', () => {
    expect(NORMS).toHaveLength(6);
    for (const n of NORMS) {
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.reference).toContain('AI Act');
      expect(n.explanation.length).toBeGreaterThan(40);
      expect(n.democraticFunction.length).toBeGreaterThan(20);
    }
  });
});

describe('valutazione delle decisioni', () => {
  const scoring = getCase('case_scoring');
  const lavoro = getCase('case_lavoro');

  it('classificazione e misura corrette → correct', () => {
    expect(evaluateDecision(scoring, 'vietata', 'blocco')).toBe('correct');
    expect(evaluateDecision(lavoro, 'alto_rischio', 'audit')).toBe('correct');
  });

  it('classificazione corretta con misura solo mitigante → partial', () => {
    expect(evaluateDecision(scoring, 'vietata', 'audit')).toBe('partial');
  });

  it('classificazione adiacente con misura corretta → partial', () => {
    expect(evaluateDecision(scoring, 'alto_rischio', 'blocco')).toBe('partial');
  });

  it('negare il problema → wrong', () => {
    expect(evaluateDecision(scoring, 'non_rilevante', 'nessuna')).toBe('wrong');
    expect(evaluateDecision(lavoro, 'basso_rischio', 'nessuna')).toBe('wrong');
  });

  it('eccesso di cautela: blocco su alto rischio classificato bene → partial, mai wrong', () => {
    expect(evaluateDecision(lavoro, 'alto_rischio', 'blocco')).toBe('partial');
    const ospedale = getCase('case_ospedale');
    expect(evaluateDecision(ospedale, 'alto_rischio', 'blocco')).toBe('partial');
    // il blocco prudente non deve mai equivalere a "nessuna misura"
    expect(evaluateDecision(lavoro, 'alto_rischio', 'nessuna')).toBe('wrong');
  });
});

describe('matrice di adiacenza delle classificazioni', () => {
  it('una classificazione non è mai adiacente a sé stessa', () => {
    expect(isAdjacentClassification('vietata', 'vietata')).toBe(false);
    expect(isAdjacentClassification('alto_rischio', 'alto_rischio')).toBe(false);
  });

  it('vietata ↔ alto rischio sono adiacenti; alto rischio ↔ trasparenza idem', () => {
    expect(isAdjacentClassification('vietata', 'alto_rischio')).toBe(true);
    expect(isAdjacentClassification('alto_rischio', 'vietata')).toBe(true);
    expect(isAdjacentClassification('alto_rischio', 'trasparenza')).toBe(true);
    expect(isAdjacentClassification('trasparenza', 'alto_rischio')).toBe(true);
  });

  it('negare il problema non è mai adiacente', () => {
    expect(isAdjacentClassification('vietata', 'non_rilevante')).toBe(false);
    expect(isAdjacentClassification('vietata', 'basso_rischio')).toBe(false);
    expect(isAdjacentClassification('alto_rischio', 'non_rilevante')).toBe(false);
    expect(isAdjacentClassification('trasparenza', 'non_rilevante')).toBe(false);
  });
});

describe('accuratezza dei testi normativi', () => {
  it('biometria: il divieto è circoscritto alle finalità di contrasto, non generalizzato', () => {
    const biometria = getNorm('norm_biometria');
    expect(biometria.explanation).toContain('finalità di contrasto');
    expect(biometria.explanation).toContain('alto rischio');
    expect(biometria.explanation).not.toMatch(/in linea generale vietata/);
  });

  it('art. 50: distingue i due obblighi e segnala il cumulo con altre categorie', () => {
    const trasparenza = getNorm('norm_trasparenza_sintetici');
    expect(trasparenza.explanation).toMatch(/cumular/);
    expect(trasparenza.explanation).toContain('(1)');
    expect(trasparenza.explanation).toContain('(2)');
  });

  it('nessun caso giocabile presenta "attenzione" come emozione inferita', () => {
    for (const c of PLAYABLE_CASES) {
      const allText = [c.scenario, ...c.clues.map((k) => `${k.title} ${k.text}`)].join(' ');
      expect(allText.toLowerCase()).not.toContain('attenzione');
    }
  });
});

describe('indicatori', () => {
  it('parte dai valori richiesti dal design', () => {
    expect(INITIAL_INDICATORS).toEqual({ efficienza: 70, controllo: 40, diritti: 70, fiducia: 65 });
  });

  it('le scelte corrette aumentano diritti e fiducia, riducono controllo', () => {
    const after = applyOutcome(INITIAL_INDICATORS, 'correct');
    expect(after.diritti).toBeGreaterThan(INITIAL_INDICATORS.diritti);
    expect(after.fiducia).toBeGreaterThan(INITIAL_INDICATORS.fiducia);
    expect(after.controllo).toBeLessThan(INITIAL_INDICATORS.controllo);
  });

  it('le scelte sbagliate aumentano efficienza e controllo, riducono diritti', () => {
    const after = applyOutcome(INITIAL_INDICATORS, 'wrong');
    expect(after.efficienza).toBeGreaterThan(INITIAL_INDICATORS.efficienza);
    expect(after.controllo).toBeGreaterThan(INITIAL_INDICATORS.controllo);
    expect(after.diritti).toBeLessThan(INITIAL_INDICATORS.diritti);
  });

  it('clamp tra 0 e 100', () => {
    expect(clampIndicator(120)).toBe(100);
    expect(clampIndicator(-5)).toBe(0);
  });
});

describe('finali multipli', () => {
  it('città opaca quando diritti o fiducia sotto 40', () => {
    expect(computeEnding({ efficienza: 90, controllo: 80, diritti: 30, fiducia: 70 }).id).toBe('ending_opaca');
    expect(computeEnding({ efficienza: 90, controllo: 80, diritti: 70, fiducia: 39 }).id).toBe('ending_opaca');
  });

  it('innovazione governata con diritti e fiducia >= 60', () => {
    expect(computeEnding({ efficienza: 60, controllo: 20, diritti: 60, fiducia: 60 }).id).toBe('ending_governata');
  });

  it('governance fragile nei casi intermedi', () => {
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 50, fiducia: 55 }).id).toBe('ending_fragile');
  });

  it('boundary esatti: 40 non è opaca, 59 è fragile, 60 è governata', () => {
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 40, fiducia: 40 }).id).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 59, fiducia: 80 }).id).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 80, fiducia: 59 }).id).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 60, fiducia: 60 }).id).toBe('ending_governata');
  });

  it('esistono tre finali e il messaggio finale obbligatorio', () => {
    expect(ENDINGS).toHaveLength(3);
    expect(FINAL_MESSAGE).toContain('governabile');
  });
});

import { describe, expect, it } from 'vitest';
import { CASES, CASES_REQUIRED_FOR_FINALE, LOCATIONS, MIN_CITED_CLUES, PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import { NORMS, getNorm } from '../src/game/data/norms';
import { ENDING_IDS, computeEnding } from '../src/game/data/endings';
import { INITIAL_INDICATORS, applyOutcome, clampIndicator } from '../src/game/data/indicators';
import { cluesSupportClassification, evaluateDecision, isAdjacentClassification } from '../src/game/systems/CaseSystem';
import { it as itLocale } from '../src/game/i18n/it';
import { THEME_IDS, buildTheme } from '../src/game/systems/musicThemes';

describe('integrità dei dati di gioco', () => {
  it('ha 13 luoghi e 13 casi, tutti giocabili (2.0)', () => {
    expect(LOCATIONS).toHaveLength(13);
    expect(CASES).toHaveLength(13);
    expect(PLAYABLE_CASES).toHaveLength(13);
    expect(PLAYABLE_CASES.length).toBeGreaterThanOrEqual(CASES_REQUIRED_FOR_FINALE);
  });

  it('i casi 5 e 6 (ospedale, biometria) sono giocabili', () => {
    expect(getCase('case_ospedale').playable).toBe(true);
    expect(getCase('case_biometria').playable).toBe(true);
  });

  it('ogni caso referenzia norma, luogo, testi e reperti rilevanti validi', () => {
    for (const c of CASES) {
      expect(() => getNorm(c.normId)).not.toThrow();
      expect(LOCATIONS.some((l) => l.id === c.locationId)).toBe(true);
      expect(c.correctMeasures.length).toBeGreaterThan(0);
      // testi presenti nel locale
      const texts = itLocale.cases[c.id as keyof typeof itLocale.cases];
      expect(texts).toBeDefined();
      expect(texts.clues.length).toBeGreaterThanOrEqual(3);
      // reperti rilevanti: almeno MIN_CITED_CLUES, indici validi
      expect(c.relevantClues.length).toBeGreaterThanOrEqual(MIN_CITED_CLUES);
      for (const idx of c.relevantClues) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(texts.clues.length);
      }
    }
  });

  it('ha 13 carte norma con testi localizzati', () => {
    expect(NORMS).toHaveLength(13);
    for (const n of NORMS) {
      const texts = itLocale.norms[n.id as keyof typeof itLocale.norms];
      expect(texts.title.length).toBeGreaterThan(0);
      expect(texts.reference).toContain('AI Act');
      expect(texts.explanation.length).toBeGreaterThan(40);
      expect(texts.democraticFunction.length).toBeGreaterThan(20);
    }
  });
});

describe('temi musicali procedurali', () => {
  it('esiste un tema per ogni caso giocabile più la città', () => {
    expect(THEME_IDS).toContain('city');
    for (const c of PLAYABLE_CASES) {
      expect(THEME_IDS).toContain(c.id);
    }
  });

  it('buildTheme è invocabile (fallback su city per id ignoti)', () => {
    expect(typeof buildTheme).toBe('function');
  });
});

describe('valutazione delle decisioni', () => {
  const scoring = getCase('case_scoring');
  const lavoro = getCase('case_lavoro');
  const ospedale = getCase('case_ospedale');

  it('classificazione e misura corrette (senza reperti) → correct', () => {
    expect(evaluateDecision(scoring, 'vietata', 'blocco')).toBe('correct');
    expect(evaluateDecision(lavoro, 'alto_rischio', 'audit')).toBe('correct');
    expect(evaluateDecision(ospedale, 'alto_rischio', 'audit')).toBe('correct');
  });

  it('tutto corretto CON reperti rilevanti citati → correct', () => {
    expect(evaluateDecision(scoring, 'vietata', 'blocco', scoring.relevantClues)).toBe('correct');
    // citare anche il reperto di contorno non penalizza
    expect(evaluateDecision(scoring, 'vietata', 'blocco', [0, 1, 2])).toBe('correct');
    expect(evaluateDecision(ospedale, 'alto_rischio', 'audit', [1, 2])).toBe('correct');
  });

  it('classificazione e misura corrette ma reperti sbagliati → partial', () => {
    // manca un reperto portante: il rapporto non regge
    expect(evaluateDecision(scoring, 'vietata', 'blocco', [0, 2])).toBe('partial');
    expect(evaluateDecision(ospedale, 'alto_rischio', 'audit', [0, 1])).toBe('partial');
    expect(evaluateDecision(lavoro, 'alto_rischio', 'audit', [0])).toBe('partial');
  });

  it('cluesSupportClassification richiede tutti i reperti rilevanti', () => {
    expect(cluesSupportClassification(scoring, [0, 1])).toBe(true);
    expect(cluesSupportClassification(scoring, [0, 1, 2])).toBe(true);
    expect(cluesSupportClassification(scoring, [1, 2])).toBe(false);
    expect(cluesSupportClassification(scoring, [])).toBe(false);
  });

  it('classificazione corretta con misura solo mitigante → partial', () => {
    expect(evaluateDecision(scoring, 'vietata', 'audit')).toBe('partial');
  });

  it('eccesso di cautela: blocco su alto rischio classificato bene → partial, mai wrong', () => {
    expect(evaluateDecision(lavoro, 'alto_rischio', 'blocco')).toBe('partial');
    expect(evaluateDecision(ospedale, 'alto_rischio', 'blocco')).toBe('partial');
    expect(evaluateDecision(lavoro, 'alto_rischio', 'nessuna')).toBe('wrong');
  });

  it('classificazione adiacente con misura corretta → partial', () => {
    expect(evaluateDecision(scoring, 'alto_rischio', 'blocco')).toBe('partial');
  });

  it('negare il problema → wrong, anche con reperti giusti', () => {
    expect(evaluateDecision(scoring, 'non_rilevante', 'nessuna')).toBe('wrong');
    expect(evaluateDecision(scoring, 'non_rilevante', 'nessuna', scoring.relevantClues)).toBe('wrong');
    expect(evaluateDecision(lavoro, 'basso_rischio', 'nessuna')).toBe('wrong');
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

describe('accuratezza dei testi normativi (IT)', () => {
  it('biometria: il divieto è circoscritto alle finalità di contrasto, non generalizzato', () => {
    const biometria = itLocale.norms.norm_biometria;
    expect(biometria.explanation).toContain('finalità di contrasto');
    expect(biometria.explanation).toContain('alto rischio');
    expect(biometria.explanation).not.toMatch(/in linea generale vietata/);
  });

  it('il caso biometria esplicita il perimetro: tempo reale, spazio pubblico, contrasto', () => {
    const clueTitles = itLocale.cases.case_biometria.clues.map((c) => c.title.toLowerCase()).join(' ');
    expect(clueTitles).toContain('contrasto');
    expect(itLocale.cases.case_biometria.scenario.toLowerCase()).toContain('polizia');
  });

  it('art. 50: distingue i due obblighi e segnala il cumulo con altre categorie', () => {
    const trasparenza = itLocale.norms.norm_trasparenza_sintetici;
    expect(trasparenza.explanation).toMatch(/cumular/);
    expect(trasparenza.explanation).toContain('(1)');
    expect(trasparenza.explanation).toContain('(2)');
  });

  it('nessun caso giocabile presenta "attenzione" come emozione inferita', () => {
    for (const c of PLAYABLE_CASES) {
      const texts = itLocale.cases[c.id as keyof typeof itLocale.cases];
      const allText = [texts.scenario, ...texts.clues.map((k) => `${k.title} ${k.text}`)].join(' ');
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
    expect(computeEnding({ efficienza: 90, controllo: 80, diritti: 30, fiducia: 70 })).toBe('ending_opaca');
    expect(computeEnding({ efficienza: 90, controllo: 80, diritti: 70, fiducia: 39 })).toBe('ending_opaca');
  });

  it('innovazione governata con diritti e fiducia >= 60', () => {
    expect(computeEnding({ efficienza: 60, controllo: 20, diritti: 60, fiducia: 60 })).toBe('ending_governata');
  });

  it('governance fragile nei casi intermedi', () => {
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 50, fiducia: 55 })).toBe('ending_fragile');
  });

  it('boundary esatti: 40 non è opaca, 59 è fragile, 60 è governata', () => {
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 40, fiducia: 40 })).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 59, fiducia: 80 })).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 80, fiducia: 59 })).toBe('ending_fragile');
    expect(computeEnding({ efficienza: 70, controllo: 50, diritti: 60, fiducia: 60 })).toBe('ending_governata');
  });

  it('esistono tre finali e il messaggio finale obbligatorio (in ogni lingua)', () => {
    expect(ENDING_IDS).toHaveLength(3);
    for (const id of ENDING_IDS) {
      expect(itLocale.endings[id].title.length).toBeGreaterThan(0);
      expect(itLocale.endings[id].text.length).toBeGreaterThan(40);
    }
    expect(itLocale.endings.finalMessage).toContain('governabile');
  });
});

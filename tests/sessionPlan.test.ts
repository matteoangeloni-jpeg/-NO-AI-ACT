import { describe, expect, it } from 'vitest';
import { MISSIONS } from '../src/game/data/missions';
import { PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import {
  AUDIENCES,
  AUDIENCE_IDS,
  DEFAULT_AUDIENCE,
  DEFAULT_SESSION_MINUTES,
  SESSION_DURATIONS,
  SESSION_WARMUP_MINUTES,
  estimateMinutes,
  getAudience,
  planSession
} from '../src/game/data/audiences';
import { it as itDict } from '../src/game/i18n/it';
import { en } from '../src/game/i18n/en';

/**
 * PERCORSI PER PUBBLICO E DURATA (2.2).
 *
 * Il rischio di una funzione così è inventare i numeri: dichiarare "45
 * minuti" e comporre una sessione che ne dura il doppio. Qui le stime sono
 * ancorate a qualcosa di già pubblicato — le durate delle cinque missioni
 * storiche, scritte nell'i18n e visibili sul sito — e il primo test le
 * riconcilia. Se un caso cambia stima, o una missione cambia composizione,
 * è questo test a dirlo, non un giocatore deluso.
 */

/** "10–15 min" / "10-15 min" → [10, 15]. */
const parseRange = (label: string): [number, number] => {
  const m = label.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (!m) throw new Error(`durata non interpretabile: "${label}"`);
  return [Number(m[1]), Number(m[2])];
};

describe('le stime di durata riproducono le durate già pubblicate', () => {
  for (const mission of MISSIONS) {
    it(`la missione "${mission.id}" resta dentro la durata che dichiara`, () => {
      const estimate = estimateMinutes(mission.recommendedCaseIds);
      for (const [lang, dict] of [['it', itDict], ['en', en]] as const) {
        const label = dict.ui.missions.modes[mission.id].duration;
        const [lo, hi] = parseRange(label);
        expect(estimate, `${lang}: ${mission.id} stimata ${estimate} min, pubblicata ${label}`).toBeGreaterThanOrEqual(lo);
        expect(estimate, `${lang}: ${mission.id} stimata ${estimate} min, pubblicata ${label}`).toBeLessThanOrEqual(hi);
      }
    });
  }

  it('IT ed EN pubblicano la stessa durata per ogni missione', () => {
    for (const m of MISSIONS) {
      expect(parseRange(en.ui.missions.modes[m.id].duration)).toEqual(
        parseRange(itDict.ui.missions.modes[m.id].duration)
      );
    }
  });

  it('ogni caso giocabile dichiara una stima positiva e plausibile', () => {
    for (const c of PLAYABLE_CASES) {
      expect(c.estimatedMinutes, `${c.id}`).toBeGreaterThan(0);
      expect(c.estimatedMinutes, `${c.id}: una stima oltre l'ora non è un fascicolo`).toBeLessThanOrEqual(30);
    }
  });

  it('la presa di confidenza si conta una volta, non per caso', () => {
    const one = estimateMinutes(['case_scoring']);
    const two = estimateMinutes(['case_scoring', 'case_media']);
    expect(one).toBe(SESSION_WARMUP_MINUTES + getCase('case_scoring').estimatedMinutes);
    expect(two - one).toBe(getCase('case_media').estimatedMinutes);
  });

  it('una lista vuota non costa nulla', () => {
    expect(estimateMinutes([])).toBe(0);
  });
});

describe('i percorsi per pubblico sono composti su casi che esistono', () => {
  it('ogni pubblico elenca solo casi giocabili, senza ripetizioni', () => {
    for (const a of AUDIENCES) {
      for (const id of a.orderedCaseIds) {
        expect(PLAYABLE_CASES.some((c) => c.id === id), `${a.id} indica ${id}, che non è un caso giocabile`).toBe(true);
      }
      expect(new Set(a.orderedCaseIds).size, `${a.id} ripete un caso`).toBe(a.orderedCaseIds.length);
    }
  });

  it('ogni pubblico ha abbastanza materiale per la durata più lunga che offre', () => {
    const longest = Math.max(...SESSION_DURATIONS);
    for (const a of AUDIENCES) {
      const total = estimateMinutes(a.orderedCaseIds);
      expect(total, `${a.id} offre solo ${total} min: la durata più lunga è ${longest}`).toBeGreaterThanOrEqual(longest * 0.85);
    }
  });

  it('i valori di partenza esistono davvero', () => {
    expect(AUDIENCE_IDS).toContain(DEFAULT_AUDIENCE);
    expect(SESSION_DURATIONS).toContain(DEFAULT_SESSION_MINUTES);
  });
});

describe('il piano di sessione rispetta il budget, o lo dichiara', () => {
  it('non propone mai una sessione vuota', () => {
    for (const a of AUDIENCE_IDS) {
      for (const d of SESSION_DURATIONS) {
        expect(planSession(a, d).caseIds.length, `${a} a ${d} min`).toBeGreaterThan(0);
      }
    }
  });

  it('resta dentro il budget ogni volta che è possibile', () => {
    for (const a of AUDIENCE_IDS) {
      for (const d of SESSION_DURATIONS) {
        const p = planSession(a, d);
        if (p.overBudget) continue;
        expect(p.estimatedMinutes, `${a} a ${d} min ne stima ${p.estimatedMinutes}`).toBeLessThanOrEqual(d);
      }
    }
  });

  it('quando sfora lo dice, invece di fingere', () => {
    for (const a of AUDIENCE_IDS) {
      for (const d of SESSION_DURATIONS) {
        const p = planSession(a, d);
        expect(p.overBudget, `${a} a ${d} min: overBudget non riflette la stima`).toBe(p.estimatedMinutes > d);
      }
    }
  });

  it('la stima dichiarata coincide con quella dei casi proposti', () => {
    for (const a of AUDIENCE_IDS) {
      for (const d of SESSION_DURATIONS) {
        const p = planSession(a, d);
        expect(p.estimatedMinutes).toBe(estimateMinutes(p.caseIds));
      }
    }
  });

  it('più tempo non toglie mai fascicoli', () => {
    for (const a of AUDIENCE_IDS) {
      const sorted = [...SESSION_DURATIONS].sort((x, y) => x - y);
      for (let i = 1; i < sorted.length; i++) {
        const prev = planSession(a, sorted[i - 1]).caseIds;
        const next = planSession(a, sorted[i]).caseIds;
        expect(next.length, `${a}: ${sorted[i]} min offre meno di ${sorted[i - 1]}`).toBeGreaterThanOrEqual(prev.length);
        expect(next.slice(0, prev.length), `${a}: ${sorted[i]} min riordina i casi invece di aggiungerne`).toEqual(prev);
      }
    }
  });

  it('il primo caso di un pubblico è quello che si porta a casa chi ha poco tempo', () => {
    for (const a of AUDIENCE_IDS) {
      expect(planSession(a, 15).caseIds[0]).toBe(getAudience(a).orderedCaseIds[0]);
    }
  });
});

describe('la difficoltà segue il tempo, e chi gioca per capire resta accompagnato', () => {
  it('un quarto d\'ora è sempre accompagnato', () => {
    for (const a of AUDIENCE_IDS) expect(planSession(a, 15).difficulty).toBe('base');
  });

  it('la sessione lunga di un professionista arriva a esperto', () => {
    for (const a of AUDIENCE_IDS.filter((x) => x !== 'casual')) {
      expect(planSession(a, 90).difficulty).toBe('expert');
    }
  });

  it('chi gioca per conto proprio non viene buttato in modalità esperto', () => {
    expect(planSession('casual', 90).difficulty).toBe('standard');
    expect(getAudience('casual').baseDifficulty).toBe('base');
  });
});

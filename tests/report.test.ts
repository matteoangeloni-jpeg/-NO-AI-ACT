import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { INCIDENT_DELTAS, PLAYABLE_CASES, getCase } from '../src/game/data/cases';
import type { ReportInput } from '../src/game/systems/ReportSystem';
import type { DifficultyMode } from '../src/game/data/types';
import { evaluateReport, gradeMotivation, gradeSubject, reasonKeyFor, shouldShowHint, showsSecondaryErrors, type ReportResult } from '../src/game/systems/ReportSystem';
import { buildTeacherReport, teacherReportToText } from '../src/game/systems/TeacherReportSystem';
import { setLanguage } from '../src/game/i18n';
import { it as itLocale } from '../src/game/i18n/it';
import { en as enLocale } from '../src/game/i18n/en';

const scoring = getCase('case_scoring');
const lavoro = getCase('case_lavoro');
const ospedale = getCase('case_ospedale');

/** Input interamente corretto per un caso. */
function perfect(c = scoring): ReportInput {
  return {
    caseData: c,
    citedClues: c.relevantClues,
    classification: c.correctClassification,
    measure: c.correctMeasures[0],
    subject: c.responsibleSubjectCorrect,
    motivationIndex: c.correctMotivation
  };
}

describe('dati v0.3: soggetti, motivazioni, domande, epiloghi', () => {
  it('ogni caso ha soggetto corretto, indici motivazione validi e distinti', () => {
    for (const c of PLAYABLE_CASES) {
      expect(c.responsibleSubjectCorrect).toBeTruthy();
      expect(c.correctMotivation).toBeGreaterThanOrEqual(0);
      expect(c.correctMotivation).toBeLessThan(3);
      expect(c.weakMotivation).toBeGreaterThanOrEqual(0);
      expect(c.weakMotivation).toBeLessThan(3);
      expect(c.correctMotivation).not.toBe(c.weakMotivation);
      expect(c.possibleDominantErrors.length).toBeGreaterThan(0);
    }
  });

  it('ogni caso ha 3 motivazioni, 3 domande di debrief e un epilogo in IT e EN', () => {
    for (const locale of [itLocale, enLocale]) {
      for (const c of PLAYABLE_CASES) {
        const texts = locale.cases[c.id as keyof typeof locale.cases];
        expect(texts.motivations).toHaveLength(3);
        expect(texts.debriefQuestions).toHaveLength(3);
        expect(texts.epilogue.length).toBeGreaterThan(10);
      }
    }
  });

  it('solo i 3 casi previsti hanno un evento imprevisto, con testi in entrambe le lingue', () => {
    const withIncident = PLAYABLE_CASES.filter((c) => c.hasIncident).map((c) => c.id);
    expect(withIncident.sort()).toEqual(['case_lavoro', 'case_media', 'case_ospedale']);
    for (const locale of [itLocale, enLocale]) {
      for (const id of withIncident) {
        const texts = locale.cases[id as keyof typeof locale.cases] as { incident?: { options: Record<string, string> } };
        expect(texts.incident).toBeDefined();
        expect(Object.keys(texts.incident!.options).sort()).toEqual(['document', 'minimize', 'suspend']);
      }
    }
  });

  it('i delta degli eventi sono coerenti: documentare premia fiducia, minimizzare la erode', () => {
    expect(INCIDENT_DELTAS.document.fiducia).toBeGreaterThan(0);
    expect(INCIDENT_DELTAS.suspend.diritti).toBeGreaterThan(0);
    expect(INCIDENT_DELTAS.minimize.fiducia).toBeLessThan(0);
    expect(INCIDENT_DELTAS.minimize.diritti).toBeLessThan(0);
    expect(INCIDENT_DELTAS.minimize.efficienza).toBeGreaterThan(0);
  });
});

describe('esiti del rapporto ispettivo', () => {
  it('CONFORME solo se prove, classificazione, misura, soggetto e motivazione sono tutti corretti', () => {
    expect(evaluateReport(perfect()).outcome).toBe('conforme');
    expect(evaluateReport(perfect(lavoro)).outcome).toBe('conforme');
    // ogni singola componente degradata rompe la conformità
    expect(evaluateReport({ ...perfect(), citedClues: [0, 2] }).outcome).not.toBe('conforme');
    expect(evaluateReport({ ...perfect(), subject: 'responsabile_umano' }).outcome).not.toBe('conforme');
    expect(evaluateReport({ ...perfect(), motivationIndex: scoring.weakMotivation }).outcome).not.toBe('conforme');
  });

  it('decisione corretta ma motivazione debole → CONTESTABILE', () => {
    const r = evaluateReport({ ...perfect(), motivationIndex: scoring.weakMotivation });
    expect(r.outcome).toBe('contestabile');
    expect(r.dominantError).toBe('motivazione');
  });

  it('decisione corretta ma prove non pertinenti → CONTESTABILE con rilievo sulle prove', () => {
    const r = evaluateReport({ ...perfect(), citedClues: [0, 2] }); // manca la prova 1
    expect(r.outcome).toBe('contestabile');
    expect(r.dominantError).toBe('prove');
  });

  it('soggetto sbagliato: CONTESTABILE con nucleo corretto, NON CONFORME con nucleo parziale', () => {
    const wrongSubject = evaluateReport({ ...perfect(), subject: 'responsabile_umano' });
    expect(wrongSubject.outcome).toBe('contestabile');
    expect(wrongSubject.dominantError).toBe('soggetto');
    // nucleo parziale (misura mitigante) + soggetto errato → la gravità si somma
    const partialCore = evaluateReport({
      ...perfect(),
      measure: scoring.partialMeasures[0],
      subject: 'responsabile_umano'
    });
    expect(partialCore.outcome).toBe('non_conforme');
  });

  it('soggetto parziale → CONTESTABILE, mai non conforme da solo', () => {
    const r = evaluateReport({ ...perfect(), subject: scoring.responsibleSubjectPartial! });
    expect(r.outcome).toBe('contestabile');
  });

  it('eccesso di cautela su alto rischio non è MAI non conforme', () => {
    const base = { ...perfect(ospedale), measure: 'blocco' as const };
    expect(evaluateReport(base).outcome).toBe('parziale'); // zelo con fondamento integro
    expect(evaluateReport(base).dominantError).toBe('eccesso_cautela');
    // perfino con soggetto e motivazione sbagliati resta sotto la non conformità
    const worst = evaluateReport({ ...base, subject: 'responsabile_umano', motivationIndex: 2 });
    expect(worst.outcome).not.toBe('non_conforme');
  });

  it('negare il problema → NON CONFORME, qualunque sia il fondamento', () => {
    const r = evaluateReport({ ...perfect(), classification: 'non_rilevante', measure: 'nessuna' });
    expect(r.outcome).toBe('non_conforme');
    expect(r.dominantError).toBe('classificazione');
    expect(r.quality).toBe('wrong');
  });

  it('trasparenza omessa: caso media con misura mitigante → rilievo di trasparenza', () => {
    const media = getCase('case_media');
    const r = evaluateReport({
      caseData: media,
      citedClues: media.relevantClues,
      classification: 'trasparenza',
      measure: 'audit',
      subject: media.responsibleSubjectCorrect,
      motivationIndex: media.correctMotivation
    });
    expect(r.outcome).toBe('parziale');
    expect(r.dominantError).toBe('trasparenza');
  });

  it('nucleo parziale con fondamento integro → PARZIALMENTE CONFORME', () => {
    const r = evaluateReport({ ...perfect(), measure: scoring.partialMeasures[0] });
    expect(r.outcome).toBe('parziale');
  });

  it('massimo un errore dominante e due rilievi secondari', () => {
    const r = evaluateReport({
      ...perfect(),
      citedClues: [2],
      measure: scoring.partialMeasures[0],
      subject: 'fornitore_esterno',
      motivationIndex: 2
    });
    expect(r.dominantError).not.toBeNull();
    expect(r.secondaryErrors.length).toBeLessThanOrEqual(2);
  });

  it('reasonKeyFor: grounded quando conforme, altrimenti il rilievo dominante', () => {
    expect(reasonKeyFor(evaluateReport(perfect()))).toBe('grounded');
    expect(reasonKeyFor(evaluateReport({ ...perfect(), motivationIndex: scoring.weakMotivation }))).toBe('motivazione');
    expect(reasonKeyFor(evaluateReport({ ...perfect(), subject: 'responsabile_umano' }))).toBe('soggetto');
    expect(reasonKeyFor(evaluateReport({ ...perfect(), classification: 'non_rilevante', measure: 'nessuna' }))).toBe('classificazione');
    // "contestabile" ha sempre una reason (mai null)
    const challenge = evaluateReport({ ...perfect(), citedClues: [0, 2] });
    expect(challenge.outcome).toBe('contestabile');
    expect(reasonKeyFor(challenge)).toBe('prove');
  });

  it('grading di soggetto e motivazione', () => {
    expect(gradeSubject(scoring, scoring.responsibleSubjectCorrect)).toBe('full');
    expect(gradeSubject(scoring, scoring.responsibleSubjectPartial!)).toBe('partial');
    expect(gradeSubject(scoring, 'responsabile_umano')).toBe('wrong');
    expect(gradeMotivation(scoring, scoring.correctMotivation)).toBe('correct');
    expect(gradeMotivation(scoring, scoring.weakMotivation)).toBe('weak');
  });
});

describe('debrief docente', () => {
  const sampleInput = {
    caseReports: {
      case_scoring: {
        outcome: 'conforme' as const,
        dominantError: null,
        classification: 'vietata' as const,
        measure: 'blocco' as const,
        subject: 'autorita' as const,
        motivationIndex: 1,
        citedClues: [0, 1]
      },
      case_lavoro: {
        outcome: 'contestabile' as const,
        dominantError: 'soggetto' as const,
        classification: 'alto_rischio' as const,
        measure: 'audit' as const,
        subject: 'responsabile_umano' as const,
        motivationIndex: 2,
        citedClues: [1, 2]
      }
    },
    indicators: { efficienza: 64, controllo: 30, diritti: 88, fiducia: 79 },
    unlockedNorms: ['norm_social_scoring', 'norm_lavoro_alto_rischio'],
    endingId: null,
    startedAt: 1000,
    mission: 'full' as const,
    difficulty: 'standard' as const,
    now: 1000 + 27 * 60000
  };

  it('contiene esiti per caso, norme, indicatori, domande e tempo', () => {
    setLanguage('it');
    const report = buildTeacherReport(sampleInput);
    expect(report.cases).toHaveLength(2);
    expect(report.cases[1].outcome).toBe('CONTESTABILE');
    expect(report.normsUnlocked).toBe(2);
    expect(report.completionMinutes).toBe(27);
    expect(report.questions.length).toBeGreaterThan(0);
  });

  it('non contiene dati personali né campi vietati', () => {
    const report = buildTeacherReport(sampleInput);
    const serialized = JSON.stringify(report).toLowerCase();
    for (const forbidden of ['email', 'nome studente', 'scuola', 'classe ', 'student name', 'school', 'ip', 'useragent']) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).not.toContain('@');
  });

  it('la versione testuale è esportabile e localizzata', () => {
    setLanguage('en');
    const txt = teacherReportToText(buildTeacherReport(sampleInput));
    expect(txt).toContain('TEACHER DEBRIEF');
    expect(txt).toContain('Completion time: 27 min');
    setLanguage('it');
    const txtIt = teacherReportToText(buildTeacherReport(sampleInput));
    expect(txtIt).toContain('DEBRIEF DOCENTE');
  });
});

/**
 * DIFFICOLTÀ ESPERTO.
 *
 * I tre livelli non erano tre: `evaluateReport` distingueva soltanto 'base',
 * e 'expert' si comportava esattamente come 'standard'. La descrizione
 * pubblicata prometteva però "severità su soggetto e motivazione", e
 * l'ispezione a sorpresa forza l'esperto proprio per essere più dura — una
 * modalità che si annunciava severa e giocava identica.
 *
 * La severità è quella promessa, né più né meno: in esperto un soggetto
 * PARZIALE e una motivazione DEBOLE smettono di essere vizi lievi e contano
 * come gravi. Sui nuclei corretti l'esito non cambia (un vizio qualunque li
 * rende contestabili già in standard); cambia dove il nucleo è a sua volta
 * parziale, che è il caso in cui la differenza fra i tre livelli si vede.
 */
describe('i tre livelli di difficoltà sono davvero tre', () => {
  /** Nucleo parziale (misura solo parziale) + soggetto parziale. */
  const partialCoreAndSubject = (caseId: string): ReportInput => {
    const caseData = getCase(caseId);
    return {
      caseData,
      citedClues: caseData.relevantClues,
      classification: caseData.correctClassification,
      measure: caseData.partialMeasures[0],
      subject: caseData.responsibleSubjectPartial!,
      motivationIndex: caseData.correctMotivation
    };
  };

  /** Nucleo parziale + motivazione debole. */
  const partialCoreWeakMotivation = (caseId: string): ReportInput => {
    const caseData = getCase(caseId);
    return {
      caseData,
      citedClues: caseData.relevantClues,
      classification: caseData.correctClassification,
      measure: caseData.partialMeasures[0],
      subject: caseData.responsibleSubjectCorrect,
      motivationIndex: caseData.weakMotivation
    };
  };

  it('un soggetto parziale su nucleo parziale: esperto più severo di standard', () => {
    const input = partialCoreAndSubject('case_scoring');
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
    expect(
      evaluateReport(input, 'expert').outcome,
      "l'esperto promette severità sul soggetto: deve pesare più dello standard"
    ).toBe('non_conforme');
  });

  it('una motivazione debole su nucleo parziale: esperto più severo di standard', () => {
    const input = partialCoreWeakMotivation('case_scoring');
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
    expect(evaluateReport(input, 'expert').outcome).toBe('non_conforme');
  });

  it('la base resta la più indulgente dei tre, su entrambi i vizi', () => {
    for (const build of [partialCoreAndSubject, partialCoreWeakMotivation]) {
      const input = build('case_scoring');
      expect(evaluateReport(input, 'base').outcome).toBe('parziale');
    }
  });

  /**
   * La severità NON si estende a ciò che la descrizione non promette: i
   * reperti non pertinenti restano un vizio lieve anche in esperto. Senza
   * questo controllo "più severo" diventerebbe col tempo "severo su tutto".
   */
  it("l'esperto non inasprisce ciò che non ha annunciato", () => {
    const caseData = getCase('case_scoring');
    const input: ReportInput = {
      caseData,
      citedClues: [],
      classification: caseData.correctClassification,
      measure: caseData.partialMeasures[0],
      subject: caseData.responsibleSubjectCorrect,
      motivationIndex: caseData.correctMotivation
    };
    expect(evaluateReport(input, 'standard').outcome).toBe('contestabile');
    expect(evaluateReport(input, 'expert').outcome).toBe('contestabile');
  });

  /**
   * Nessun livello può diventare inerte in silenzio: su tutta la casistica
   * giocabile i tre devono produrre almeno un esito che li distingue a due a
   * due. È la guardia che sarebbe stata rossa dal giorno in cui expert è
   * nato uguale a standard.
   */
  it('su tutti i casi giocabili nessuna coppia di livelli è indistinguibile', () => {
    const pairs: Array<[DifficultyMode, DifficultyMode]> = [
      ['base', 'standard'],
      ['standard', 'expert'],
      ['base', 'expert']
    ];
    const differing = new Map<string, number>(pairs.map(([a, b]) => [`${a}/${b}`, 0]));

    for (const c of PLAYABLE_CASES) {
      if (!c.responsibleSubjectPartial || c.partialMeasures.length === 0) continue;
      for (const build of [partialCoreAndSubject, partialCoreWeakMotivation]) {
        const input = build(c.id);
        for (const [a, b] of pairs) {
          if (evaluateReport(input, a).outcome !== evaluateReport(input, b).outcome) {
            differing.set(`${a}/${b}`, (differing.get(`${a}/${b}`) ?? 0) + 1);
          }
        }
      }
    }
    for (const [pair, n] of differing) {
      expect(n, `${pair}: nessun caso li distingue, uno dei due è una parola sul menu`).toBeGreaterThan(0);
    }
  });
});

/**
 * Le tre schede dei livelli promettono cose diverse; il gioco deve
 * mantenerle tutte. Questi controlli guardano le tre leve osservabili —
 * indulgenza dell'esito, suggerimento dopo l'errore, rilievi secondari nel
 * rapporto — e chiedono che nessuna coppia di livelli si comporti allo
 * stesso modo su tutte e tre.
 */
describe('ogni livello mantiene quello che la sua scheda promette', () => {
  const failed = (caseId: string): ReportResult => {
    const caseData = getCase(caseId);
    return evaluateReport(
      {
        caseData,
        citedClues: caseData.relevantClues,
        classification: caseData.correctClassification,
        measure: caseData.partialMeasures[0],
        subject: caseData.responsibleSubjectPartial!,
        motivationIndex: caseData.correctMotivation
      },
      'standard'
    );
  };

  it('base è l\'unico che suggerisce dopo un errore', () => {
    const r = failed('case_scoring');
    expect(r.dominantError, 'il caso di prova deve avere un rilievo, o il controllo è inerte').not.toBeNull();
    expect(shouldShowHint('base', r)).toBe(true);
    expect(shouldShowHint('standard', r)).toBe(false);
    expect(shouldShowHint('expert', r)).toBe(false);
  });

  it("esperto è l'unico che tace i rilievi secondari: è il \"feedback asciutto\"", () => {
    expect(showsSecondaryErrors('base')).toBe(true);
    expect(showsSecondaryErrors('standard')).toBe(true);
    expect(showsSecondaryErrors('expert')).toBe(false);
  });

  it('e il rapporto li nasconde davvero, invece di calcolarli e mostrarli lo stesso', () => {
    const src = readFileSync(resolve(__dirname, '../src/game/scenes/ReportScene.ts'), 'utf8');
    expect(src, 'la decisione deve passare dal predicato, non da un confronto sparso').toContain(
      'showsSecondaryErrors(StateManager.difficulty)'
    );
  });

  it('nessuna coppia di livelli è identica su tutte le leve insieme', () => {
    const r = failed('case_scoring');
    const profile = (d: DifficultyMode): string =>
      [shouldShowHint(d, r), showsSecondaryErrors(d), evaluateReport(
        {
          caseData: scoring,
          citedClues: scoring.relevantClues,
          classification: scoring.correctClassification,
          measure: scoring.partialMeasures[0],
          subject: scoring.responsibleSubjectPartial!,
          motivationIndex: scoring.correctMotivation
        },
        d
      ).outcome].join('|');

    const profiles = (['base', 'standard', 'expert'] as const).map(profile);
    expect(new Set(profiles).size, `profili: ${profiles.join(' / ')}`).toBe(3);
  });
});

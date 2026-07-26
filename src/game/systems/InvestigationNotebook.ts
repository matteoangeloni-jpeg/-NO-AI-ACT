import { CHAPTERS } from '../data/chapters';
import { caseAnatomy } from '../data/learningModel';
import { NORMS } from '../data/norms';
import type { CaseMeta, CaseReport, ReportOutcome, ResponsibleSubject } from '../data/types';

/**
 * Taccuino investigativo (roadmap 2.1, Phase 2 §7 — Obra Dinn).
 *
 * "Cognizione esterna": raccoglie in un posto solo ciò che il giocatore ha
 * gia' stabilito, invece di farglielo ricordare. Tutto DERIVATO da dati gia'
 * salvati (rapporti di caso, note metacognitive, norme sbloccate): nessuna
 * nuova chiave di salvataggio, nessun effetto sul punteggio.
 *
 * Include la verifica differita per capitolo (§10): un capitolo conferma il
 * proprio schema solo quando abbastanza casi collegati sono stati chiusi
 * bene — l'inferenza vale piu' della singola risposta corretta.
 */

/** Un caso chiuso, come appare nel taccuino. */
export interface NotebookFact {
  caseId: string;
  outcome: ReportOutcome;
  /** Reperti citati che erano davvero decisivi. */
  decisiveCited: number;
  /** Reperti decisivi del fascicolo (denominatore). */
  decisiveTotal: number;
  /** Il giocatore ha citato anche il resoconto che minimizzava? */
  spottedTrap: boolean;
}

/** Ricorrenza di un soggetto responsabile tra i casi chiusi. */
export interface NotebookActor {
  subject: ResponsibleSubject;
  /** Quante volte il giocatore ha indicato questo soggetto. */
  timesChosen: number;
}

/** Una questione che il giocatore ha lasciato aperta. */
export interface NotebookOpenQuestion {
  caseId: string;
  /** 'unsure'/'revise' dalla riflessione, oppure 'miscalibrated'. */
  reason: 'unsure' | 'revise' | 'miscalibrated';
}

/** Stato di verifica differita di un capitolo (§10). */
export interface NotebookPattern {
  chapterId: string;
  done: number;
  total: number;
  /** Il capitolo e' completo E chiuso senza errori dominanti. */
  confirmed: boolean;
}

export interface Notebook {
  facts: NotebookFact[];
  actors: NotebookActor[];
  openQuestions: NotebookOpenQuestion[];
  patterns: NotebookPattern[];
  normsUnlocked: number;
  normsTotal: number;
}

export function buildNotebook(
  caseReports: Record<string, CaseReport>,
  caseMeta: Record<string, CaseMeta>,
  unlockedNorms: string[]
): Notebook {
  const facts: NotebookFact[] = [];
  const actorCount = new Map<ResponsibleSubject, number>();
  const openQuestions: NotebookOpenQuestion[] = [];

  for (const [caseId, report] of Object.entries(caseReports)) {
    const anatomy = caseAnatomy(caseId);
    const cited = new Set(report.citedClues);
    facts.push({
      caseId,
      outcome: report.outcome,
      decisiveCited: anatomy.signalClues.filter((i) => cited.has(i)).length,
      decisiveTotal: anatomy.signalClues.length,
      spottedTrap: anatomy.trapClues.some((i) => cited.has(i))
    });

    actorCount.set(report.subject, (actorCount.get(report.subject) ?? 0) + 1);

    const meta = caseMeta[caseId] ?? {};
    if (meta.reflection === 'unsure' || meta.reflection === 'revise') {
      openQuestions.push({ caseId, reason: meta.reflection });
    } else if (meta.confidence === 3 && report.dominantError !== null) {
      // sicurezza alta ma esito con errore dominante: vale la pena rileggerlo
      openQuestions.push({ caseId, reason: 'miscalibrated' });
    }
  }

  const actors: NotebookActor[] = [...actorCount.entries()]
    .map(([subject, timesChosen]) => ({ subject, timesChosen }))
    .sort((a, b) => b.timesChosen - a.timesChosen);

  const patterns: NotebookPattern[] = CHAPTERS.map((ch) => {
    const closed = ch.caseIds.filter((id) => caseReports[id]);
    const clean = closed.every((id) => caseReports[id].dominantError === null);
    return {
      chapterId: ch.id,
      done: closed.length,
      total: ch.caseIds.length,
      confirmed: closed.length === ch.caseIds.length && clean
    };
  });

  return {
    facts: facts.sort((a, b) => a.caseId.localeCompare(b.caseId)),
    actors,
    openQuestions,
    patterns,
    normsUnlocked: unlockedNorms.length,
    normsTotal: NORMS.length
  };
}

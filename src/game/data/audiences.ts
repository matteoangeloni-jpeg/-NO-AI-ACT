import type { AudienceId, DifficultyMode, SessionMinutes } from './types';
import { PLAYABLE_CASES, getCase } from './cases';

/**
 * PERCORSI PER PUBBLICO E DURATA (2.2).
 *
 * Le missioni storiche (MissionId) restano intatte: consigliano casi senza
 * bloccare gli altri, e nessun salvataggio esistente cambia comportamento.
 * Questo modulo aggiunge un secondo asse — chi gioca, e per quanto tempo —
 * e compone la sessione di conseguenza.
 *
 * Il tempo è un BUDGET DICHIARATO, non un timer: il gioco non misura né
 * limita il tempo reale di nessuno, e non penalizza chi è più lento, usa la
 * tastiera o uno strumento di lettura. Serve solo a scegliere quanti
 * fascicoli proporre.
 *
 * Le stime non sono inventate qui: SESSION_WARMUP_MINUTES più gli
 * estimatedMinutes dei singoli casi riproducono le durate già pubblicate
 * per le cinque missioni storiche, e un test lo verifica. Se domani un caso
 * cambia stima, le durate si ricalcolano da sole.
 */

/**
 * Presa di confidenza con l'interfaccia: vale una volta per sessione, non
 * per caso. È la ragione per cui un fascicolo solo costa più di un
 * fascicolo quando se ne giocano sei.
 */
export const SESSION_WARMUP_MINUTES = 5;

export const SESSION_DURATIONS: SessionMinutes[] = [15, 30, 60, 90];

export interface AudienceData {
  id: AudienceId;
  /**
   * Casi in ordine di priorità per questo pubblico: la sessione prende dai
   * primi finché il budget regge. Il primo caso è quindi quello che chi ha
   * solo un quarto d'ora si porta a casa.
   */
  orderedCaseIds: string[];
  /**
   * Difficoltà di partenza. Resta una proposta: il giocatore può cambiarla,
   * e nessun percorso la impone.
   */
  baseDifficulty: DifficultyMode;
}

export const AUDIENCES: AudienceData[] = [
  {
    // Chi non lavora nel settore. Ordine per forza narrativa e chiarezza del
    // concetto, non per rilevanza professionale: si parte dal punteggio che
    // decide al posto tuo, si arriva all'ambiguità.
    id: 'casual',
    orderedCaseIds: [
      'case_scoring',
      'case_media',
      'case_biometria',
      'case_credito',
      'case_predpol',
      'case_scuola',
      'case_chatbot'
    ],
    baseDifficulty: 'base'
  },
  {
    // PA: sportello, appalti, antifrode — i tre punti in cui un ente decide
    // con un sistema che non ha scritto lui.
    id: 'pa',
    orderedCaseIds: [
      'case_chatbot',
      'case_procurement',
      'case_frodi',
      'case_scoring',
      'case_predpol',
      'case_biometria'
    ],
    baseDifficulty: 'standard'
  },
  {
    // Scuola: riconoscimento emotivo in classe, piattaforma adattiva, e il
    // modello generale che entra in entrambe.
    id: 'scuola',
    orderedCaseIds: [
      'case_scuola',
      'case_edtech',
      'case_gpai',
      'case_media',
      'case_scoring',
      'case_lavoro',
      'case_biometria',
      'case_credito'
    ],
    baseDifficulty: 'standard'
  },
  {
    // Risorse umane: selezione, e il modello generale usato a valle.
    id: 'hr',
    orderedCaseIds: [
      'case_lavoro',
      'case_gpai',
      'case_scoring',
      'case_credito',
      'case_edtech',
      'case_procurement'
    ],
    baseDifficulty: 'standard'
  }
];

export const AUDIENCE_IDS: AudienceId[] = AUDIENCES.map((a) => a.id);
export const DEFAULT_AUDIENCE: AudienceId = 'casual';
export const DEFAULT_SESSION_MINUTES: SessionMinutes = 30;

export function getAudience(id: AudienceId): AudienceData {
  const a = AUDIENCES.find((x) => x.id === id);
  if (!a) throw new Error(`Pubblico sconosciuto: ${id}`);
  return a;
}

/** Minuti stimati per una lista di casi, compresa la presa di confidenza. */
export function estimateMinutes(caseIds: string[]): number {
  if (caseIds.length === 0) return 0;
  return SESSION_WARMUP_MINUTES + caseIds.reduce((sum, id) => sum + getCase(id).estimatedMinutes, 0);
}

export interface SessionPlan {
  audience: AudienceId;
  /** Budget richiesto dal giocatore. */
  requestedMinutes: SessionMinutes;
  /** Casi proposti, nell'ordine. Mai vuoto. */
  caseIds: string[];
  /** Stima per i casi effettivamente proposti. */
  estimatedMinutes: number;
  difficulty: DifficultyMode;
  /**
   * true quando il budget non basta nemmeno per un fascicolo e ne viene
   * proposto uno solo comunque. Il piano non mente sulla durata: chi sceglie
   * 15 minuti sul percorso PA vede che il primo fascicolo ne chiede di più.
   */
  overBudget: boolean;
}

/**
 * Compone la sessione: prende i casi del pubblico, in ordine, finché la
 * stima resta dentro il budget. Se nemmeno il primo ci sta, lo propone lo
 * stesso e lo dichiara: meglio un fascicolo intero e un'avvertenza onesta
 * che mezzo fascicolo o una lista vuota.
 */
export function planSession(audience: AudienceId, requestedMinutes: SessionMinutes): SessionPlan {
  const { orderedCaseIds, baseDifficulty } = getAudience(audience);
  const available = orderedCaseIds.filter((id) => PLAYABLE_CASES.some((c) => c.id === id));

  const caseIds: string[] = [];
  for (const id of available) {
    if (estimateMinutes([...caseIds, id]) > requestedMinutes) break;
    caseIds.push(id);
  }
  const overBudget = caseIds.length === 0;
  if (overBudget && available.length > 0) caseIds.push(available[0]);

  return {
    audience,
    requestedMinutes,
    caseIds,
    estimatedMinutes: estimateMinutes(caseIds),
    difficulty: difficultyFor(audience, requestedMinutes, baseDifficulty),
    overBudget
  };
}

/**
 * Una sessione lunga può permettersi meno guida, una corta no. 'casual'
 * resta di un gradino più accompagnato: il tempo che un professionista
 * spende sulle sfumature, chi gioca per capire lo spende sulle basi.
 */
function difficultyFor(audience: AudienceId, minutes: SessionMinutes, base: DifficultyMode): DifficultyMode {
  if (minutes <= 15) return 'base';
  if (minutes >= 90) return audience === 'casual' ? 'standard' : 'expert';
  return base;
}

import type { Classification, ResponsibleSubject } from './types';

/**
 * TERMINI DELLA DECISIONE → VOCI DEL GLOSSARIO (U05).
 *
 * Al momento di scegliere, il giocatore vede solo etichette: "Pratica
 * vietata", "Deployer", "Obbligo di trasparenza". Le definizioni esistevano
 * già, ma in una schermata a parte, raggiungibile solo dalla mappa: per
 * leggerle bisognava uscire dal fascicolo. Questa mappa collega ogni opzione
 * alla voce che la spiega, così l'aiuto può stare accanto alla scelta.
 *
 * `null` è una risposta legittima e va lasciata tale. Due esempi, e sono
 * scelte di merito, non dimenticanze:
 *
 *  - "basso rischio" e "non rilevante" non hanno una voce di glossario
 *    perché non sono categorie definite dal regolamento, ma il residuo di
 *    ciò che non ricade nelle altre. Inventare una definizione le farebbe
 *    sembrare istituti giuridici a sé;
 *
 *  - "autorità pubblica utilizzatrice" NON rimanda a `deployer`. Nel
 *    regolamento un'autorità pubblica che usa un sistema è un deployer, ma
 *    presentare le due voci come sinonimi nel momento in cui il gioco
 *    chiede di distinguerle trasformerebbe un aiuto in un suggerimento
 *    della risposta.
 *
 * Il collegamento è STRUTTURALE, come in glossary.ts: gli id non vanno
 * duplicati per lingua, e un test verifica che esistano davvero.
 */

export const CLASSIFICATION_TERMS: Record<Classification, string | null> = {
  vietata: 'prohibited_practice',
  alto_rischio: 'high_risk',
  trasparenza: 'transparency',
  basso_rischio: null,
  non_rilevante: null
};

export const SUBJECT_TERMS: Record<ResponsibleSubject, string | null> = {
  provider: 'provider',
  deployer: 'deployer',
  autorita: null,
  responsabile_umano: 'human_oversight',
  fornitore_esterno: null
};

/** Tutti gli id di glossario effettivamente riferiti da qui. */
export function referencedGlossaryIds(): string[] {
  return [...Object.values(CLASSIFICATION_TERMS), ...Object.values(SUBJECT_TERMS)].filter(
    (id): id is string => id !== null
  );
}

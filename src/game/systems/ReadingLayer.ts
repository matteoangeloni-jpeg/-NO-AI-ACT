import { L } from '../i18n';
import { StateManager } from './StateManager';

/**
 * Strato di lettura semantico (2.0 — mission §11.1).
 *
 * Rende i contenuti testuali chiave del canvas disponibili come HTML
 * semantico: le scene pubblicano titolo/sezioni/elenchi a ogni transizione
 * (sincronizzazione con lo stato Phaser) e gli esiti vengono annunciati in
 * un'area aria-live. Di default lo strato è solo per screen reader
 * (.sr-only); il pulsante reading-toggle lo rende un pannello visibile
 * (modalità di lettura selezionabile dall'utente).
 *
 * VINCOLI: solo lettura — nessuna interazione duplicata (le azioni restano
 * canvas + tastiera), nessuna chiamata di rete, nessun dato personale,
 * nessuna dipendenza dallo stato di gioco oltre ai testi già visibili.
 * Non è una conformità WCAG certificata: è un livello semantico
 * complementare, dichiarato come tale.
 */

export interface ReadingSection {
  heading?: string;
  text?: string;
  items?: string[];
}

function el(id: string): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.getElementById(id);
}

/** Nodo testuale sicuro: sempre textContent, mai markup interpretato. */
function node(tag: string, text: string, className?: string): HTMLElement {
  const e = document.createElement(tag);
  e.textContent = text;
  if (className) e.className = className;
  return e;
}

/**
 * Ultimo contenuto di scena pubblicato. Serve a rimettere le cose a posto
 * quando un pannello modale si chiude: senza, lo strato resterebbe fermo sul
 * pannello appena sparito.
 */
let lastScene: { title: string; sections: ReadingSection[] } | null = null;
/** Quanti pannelli modali sono aperti (annidati: la guida sopra il pannello). */
let overlayDepth = 0;

export const ReadingLayer = {
  /** Pubblica il contenuto testuale della schermata corrente. */
  setScene(title: string, sections: ReadingSection[]): void {
    lastScene = { title, sections };
    // Un cambio di scena azzera la pila: le scene si sostituiscono, e un
    // pannello aperto non sopravvive alla scena che lo conteneva.
    overlayDepth = 0;
    render(title, sections);
  },

  /**
   * PANNELLI MODALI.
   *
   * Un overlay copre lo schermo, ma lo strato di lettura continuava a
   * descrivere la scena sotto: chi legge con uno screen reader apriva la
   * guida, l'autocontrollo o il contesto del caso e si ritrovava davanti il
   * testo di un'altra schermata. Otto pannelli su nove non pubblicavano
   * nulla.
   *
   * openOverlay pubblica il contenuto del pannello, closeOverlay rimette la
   * scena. La profondità è contata perché due pannelli possono stare aperti
   * uno sopra l'altro (la guida docente sopra il pannello del titolo): solo
   * la chiusura dell'ultimo riporta alla scena.
   */
  openOverlay(title: string, sections: ReadingSection[]): void {
    overlayDepth += 1;
    render(title, sections);
  },

  /**
   * Sostituisce il contenuto del pannello aperto senza toccare la pila.
   * Serve ai pannelli che cambiano schermata restando aperti — l'autocontrollo
   * passa da una domanda all'altra — dove contare un'apertura per schermata
   * lascerebbe la pila sbilanciata alla chiusura.
   */
  replaceOverlay(title: string, sections: ReadingSection[]): void {
    render(title, sections);
  },

  closeOverlay(): void {
    overlayDepth = Math.max(0, overlayDepth - 1);
    if (overlayDepth === 0 && lastScene) render(lastScene.title, lastScene.sections);
  },

  /** Annuncio puntuale (esiti, transizioni) per gli screen reader. */
  announce(text: string): void {
    const region = el('sr-announcer');
    if (!region) return;
    region.textContent = '';
    // il doppio write forza l'annuncio anche per testi ripetuti
    window.setTimeout(() => {
      region.textContent = text;
    }, 30);
  }
};

function render(title: string, sections: ReadingSection[]): void {
  const layer = el('reading-layer');
  if (!layer) return;
  layer.setAttribute('lang', StateManager.language);
  // costruzione DOM con textContent, senza markup interpretato: il testo dei casi
  // non può mai essere interpretato come markup
  layer.replaceChildren(node('h2', title));
  for (const s of sections) {
    if (s.heading) layer.appendChild(node('h3', s.heading));
    if (s.text) layer.appendChild(node('p', s.text));
    if (s.items && s.items.length > 0) {
      const ul = document.createElement('ul');
      for (const item of s.items) ul.appendChild(node('li', item));
      layer.appendChild(ul);
    }
  }
  layer.appendChild(node('p', L().a11y.readingNote, 'rl-note'));
}

/** Collega il toggle della modalità di lettura visibile (una volta, dal boot). */
export function initReadingLayer(): void {
  const toggle = el('reading-toggle') as HTMLButtonElement | null;
  if (!toggle) return;
  const label = (): void => {
    const t = L().a11y;
    const visible = document.body.classList.contains('reading-visible');
    toggle.textContent = visible ? t.readingHide : t.readingShow;
    toggle.setAttribute('aria-pressed', String(visible));
  };
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('reading-visible');
    label();
  });
  label();
}

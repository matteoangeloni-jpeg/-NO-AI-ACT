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
 * VINCOLI: nessuna logica applicativa duplicata; ActionLayer dispone su mobile
 * gli stessi comandi accanto ai contenuti. Nessuna chiamata di rete o dato personale,
 * nessuna dipendenza dallo stato di gioco oltre ai testi già visibili.
 * Non è una conformità WCAG certificata: è un livello semantico
 * complementare, dichiarato come tale.
 */

export interface ReadingSection {
  desktopOnly?: boolean;
  actionSlot?: string;
  input?: { label: string; value: string; onInput: (value: string) => void };
  statusKey?: string;
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
let current: { title: string; sections: ReadingSection[] } | null = null;
const overlayParents: Array<{ title: string; sections: ReadingSection[] } | null> = [];

export const ReadingLayer = {
  /** Pubblica il contenuto testuale della schermata corrente. */
  setScene(title: string, sections: ReadingSection[]): void {
    lastScene = { title, sections };
    // Un cambio di scena azzera la pila: le scene si sostituiscono, e un
    // pannello aperto non sopravvive alla scena che lo conteneva.
    overlayDepth = 0;
    overlayParents.length = 0;
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
    overlayParents.push(current);
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
    const parent = overlayParents.pop();
    overlayDepth = Math.max(0, overlayDepth - 1);
    const content = overlayDepth > 0 ? parent : lastScene;
    if (content) render(content.title, content.sections);
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
  if (current?.title !== title) {
    const announcer = el('sr-announcer');
    if (announcer) announcer.textContent = '';
  }
  current = { title, sections };
  updateToggleLabel();
  if (typeof document !== 'undefined') document.documentElement.lang = StateManager.language;
  const layer = el('reading-layer');
  if (!layer) return;
  layer.setAttribute('lang', StateManager.language);
  // costruzione DOM con textContent, senza markup interpretato: il testo dei casi
  // non può mai essere interpretato come markup
  layer.replaceChildren(node('h2', title));
  for (const s of sections) {
    const section = document.createElement('section');
    if (s.desktopOnly) section.classList.add('rl-desktop-only');
    if (s.actionSlot) section.dataset.actionSlot = s.actionSlot;
    if (s.statusKey) section.dataset.readingStatus = s.statusKey;
    if (s.input) {
      const label = node('label', s.input.label);
      const input = document.createElement('input');
      input.type = 'search';
      input.value = s.input.value;
      input.addEventListener('focus', revealFocusedInput);
      input.addEventListener('input', () => {
        if (!s.input) return;
        s.input.value = input.value;
        s.input.onInput(input.value);
      });
      input.addEventListener('keydown', event => event.stopPropagation());
      input.addEventListener('keyup', event => event.stopPropagation());
      label.appendChild(input);
      section.appendChild(label);
    }
    if (s.heading) section.appendChild(node('h3', s.heading));
    if (s.text) section.appendChild(node('p', s.text));
    if (s.items && s.items.length > 0) {
      const ul = document.createElement('ul');
      for (const item of s.items) ul.appendChild(node('li', item));
      section.appendChild(ul);
    }
    layer.appendChild(section);
  }
  layer.appendChild(node('p', L().a11y.readingNote, 'rl-note'));
  layer.dataset.overlay = String(overlayDepth > 0);
  // One surface for text and actions on phones, with a predictable start point.
  document.dispatchEvent(new CustomEvent('reading-layer-rendered', { detail: { title, overlay: overlayDepth > 0 } }));
}

/** Collega il toggle della modalità di lettura visibile (una volta, dal boot). */
function updateToggleLabel(): void {
  const toggle = el('reading-toggle') as HTMLButtonElement | null;
  if (!toggle) return;
  const t = L().a11y;
  const visible = document.body.classList.contains('reading-visible');
  toggle.textContent = visible ? t.readingHide : t.readingShow;
  toggle.setAttribute('aria-pressed', String(visible));
}

function revealFocusedInput(): void {
  if (document.body.classList.contains('mobile-presentation')) return;
  const layer = el('reading-layer');
  if (!(document.activeElement instanceof HTMLInputElement) || !layer?.contains(document.activeElement)) return;
  document.body.classList.add('reading-visible');
  updateToggleLabel();
}

export function initReadingLayer(): void {
  const toggle = el('reading-toggle') as HTMLButtonElement | null;
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('reading-visible');
    updateToggleLabel();
  });
  updateToggleLabel();
  window.addEventListener('resize', revealFocusedInput);
}

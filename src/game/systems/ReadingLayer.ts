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

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const ReadingLayer = {
  /** Pubblica il contenuto testuale della schermata corrente. */
  setScene(title: string, sections: ReadingSection[]): void {
    const layer = el('reading-layer');
    if (!layer) return;
    layer.setAttribute('lang', StateManager.language);
    const parts: string[] = [`<h2>${esc(title)}</h2>`];
    for (const s of sections) {
      if (s.heading) parts.push(`<h3>${esc(s.heading)}</h3>`);
      if (s.text) parts.push(`<p>${esc(s.text)}</p>`);
      if (s.items && s.items.length > 0) {
        parts.push(`<ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`);
      }
    }
    parts.push(`<p class="rl-note">${esc(L().a11y.readingNote)}</p>`);
    layer.innerHTML = parts.join('');
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

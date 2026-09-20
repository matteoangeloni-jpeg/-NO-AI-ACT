import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { oncePerKeyEvent } from '../src/game/ui/keyDedupe';

const root = resolve(__dirname, '..');
const read = (p: string): string => readFileSync(resolve(root, p), 'utf8');

/** Un evento finto: al controllo serve solo che sia un oggetto distinto. */
const evento = (): KeyboardEvent => ({}) as KeyboardEvent;

/**
 * UN TASTO, UN'AZIONE — anche quando il gioco è indietro con i fotogrammi.
 *
 * Misurato a schermo prima della correzione, a 1920×1080 con densità
 * doppia (circa 2 fotogrammi al secondo): sei pressioni DOM producevano
 * 22–24 emissioni `keydown-*`. A 60 fotogrammi il rapporto è uno a uno, ed
 * è per questo che non si vedeva provando il gioco su una macchina normale.
 *
 * Due sintomi opposti, una causa sola: sulla mappa le ripetizioni si
 * sommavano (una freccia saltava due fascicoli), sui reperti si annullavano
 * a coppie (il reperto si apriva ma la citazione non restava mai).
 *
 * Phaser un controllo ce l'ha, ma confronta l'evento solo con quello
 * immediatamente precedente. La sequenza misurata è interlacciata —
 * 0 1 1 2 1 2 — e un confronto con il precedente non la vede.
 */
describe('la ripetizione dello stesso evento di tastiera non produce due azioni', () => {
  it('lo stesso evento consegnato due volte agisce una volta sola', () => {
    let n = 0;
    const gestore = oncePerKeyEvent(() => { n += 1; });
    const e = evento();
    gestore(e);
    gestore(e);
    expect(n).toBe(1);
  });

  it('due pressioni VERE restano due azioni, anche ravvicinate', () => {
    let n = 0;
    const gestore = oncePerKeyEvent(() => { n += 1; });
    gestore(evento());
    gestore(evento());
    expect(n, 'non è un antirimbalzo: due eventi diversi sono due azioni').toBe(2);
  });

  /**
   * IL CONTROLLO CHE CONTA, ed è quello che il guardiano di Phaser non fa.
   * La sequenza è quella misurata a schermo: l'evento 1 torna DOPO il 2.
   */
  it('riconosce una ripetizione non adiacente (A B A B)', () => {
    const visti: number[] = [];
    const a = evento(); const b = evento();
    const gestore = oncePerKeyEvent(() => { visti.push(visti.length); });
    for (const e of [a, b, a, b, a]) gestore(e);
    expect(visti.length, 'due eventi distinti, due azioni, qualunque sia l\'ordine').toBe(2);
  });

  it('una sequenza di sei pressioni vere produce sei azioni, non ventidue', () => {
    let n = 0;
    const gestore = oncePerKeyEvent(() => { n += 1; });
    const pressioni = Array.from({ length: 6 }, () => evento());
    // ogni evento consegnato quattro volte, come faceva il motore a 2 fps
    for (const e of pressioni) for (let i = 0; i < 4; i += 1) gestore(e);
    expect(n).toBe(6);
  });

  it('senza evento il gestore passa sempre: non si perde un tasto sintetico', () => {
    let n = 0;
    const gestore = oncePerKeyEvent(() => { n += 1; });
    gestore(); gestore();
    expect(n).toBe(2);
  });

  it('gestori diversi non si rubano gli eventi a vicenda', () => {
    let a = 0; let b = 0;
    const primo = oncePerKeyEvent(() => { a += 1; });
    const secondo = oncePerKeyEvent(() => { b += 1; });
    const e = evento();
    primo(e); secondo(e); primo(e); secondo(e);
    expect([a, b], 'lo stesso evento deve poter raggiungere due gestori distinti').toEqual([1, 1]);
  });
});

/**
 * La regola vale per TUTTI i gestori perché è installata sul motore, non
 * ricopiata in una quarantina di punti. Se l'installazione sparisce, il
 * difetto torna ovunque e in silenzio: qui si verifica che ci sia, e che
 * avvenga prima che il gioco esista.
 */
describe('la regola è installata una volta sola, per tutto il gioco', () => {
  /**
   * Si guardano le RIGHE, non la stringa.
   *
   * Un primo tentativo cercava «installKeyEventDedupe» dentro il file: la
   * riga commentata lo conteneva ancora, e anche l'import — il controllo
   * restava verde con l'installazione spenta. Era una guardia che non
   * poteva fallire.
   */
  it('main.ts la installa prima di creare il gioco', () => {
    const righe = read('src/main.ts').split('\n').map((r) => r.trim());
    const chiamata = righe.indexOf('installKeyEventDedupe();');
    const creazione = righe.findIndex((r) => r.includes('new Phaser.Game'));
    expect(chiamata, 'main.ts deve chiamare installKeyEventDedupe(), non commentarla').toBeGreaterThan(-1);
    expect(creazione, 'main.ts deve creare il gioco').toBeGreaterThan(-1);
    expect(chiamata, "l'installazione deve precedere new Phaser.Game").toBeLessThan(creazione);
  });

  /**
   * Segnalato in revisione, e verificato: `once()` e `addListener()` sono
   * porte separate sullo stesso emettitore, e quattro registrazioni reali
   * usano `once('keydown-ENTER', ...)` — NormCardScene e SessionEndScene.
   * Lasciarne fuori una contraddice il motivo per cui la regola sta sul
   * motore: che nessuno debba ricordarsene.
   */
  it('copre tutte le vie di registrazione, non solo on()', () => {
    const src = read('src/game/ui/keyInput.ts');
    for (const via of ['on', 'once', 'addListener']) {
      expect(src, `${via}() deve passare dalla deduplicazione`).toMatch(
        new RegExp(`'${via}'`)
      );
    }
    const scene = read('src/game/scenes/NormCardScene.ts') + read('src/game/scenes/SessionEndScene.ts');
    expect(scene, 'se queste scene smettono di usare once(), questo controllo va rivisto')
      .toMatch(/keyboard\?\.once\('keydown/);
  });

  /**
   * Segnalato in revisione: una mappa FORTE avrebbe trattenuto per sempre
   * ogni gestore registrato, e con lui la scena catturata dalla chiusura.
   * Qui le scene si riavviano a ogni cambio lingua.
   */
  it('non trattiene i gestori tolti: la mappa interna è debole', () => {
    const src = read('src/game/ui/keyInput.ts');
    const installa = src.slice(src.indexOf('export function installKeyEventDedupe'));
    expect(installa, 'la mappa da gestore a funzione avvolta deve essere debole')
      .toMatch(/WeakMap<object, WeakMap<object, KeyHandler>>/);
    expect(installa, 'nessuna Map forte per i gestori')
      .not.toMatch(/new Map\(/);
  });

  it("l'installazione copre anche la rimozione dei gestori", () => {
    const src = read('src/game/ui/keyInput.ts');
    expect(src, 'senza avvolgere anche off() un overlay non riesce più a togliersi il proprio ESC')
      .toMatch(/proto\.off\s*=/);
  });
});

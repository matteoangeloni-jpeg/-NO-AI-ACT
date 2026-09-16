import Phaser from 'phaser';

/**
 * STRATO DELLE AZIONI: i pulsanti del gioco come veri elementi del documento.
 *
 * I pulsanti sono disegnati sul canvas. Per chi vede e usa il mouse va
 * benissimo; per tutto il resto no: uno screen reader su un canvas non trova
 * niente da premere, il tasto TAB non incontra nulla, e non esiste un anello
 * di fuoco da seguire. Lo strato di lettura raccontava la schermata ma era
 * dichiaratamente di sola lettura, quindi il gioco si poteva LEGGERE senza
 * poterlo USARE.
 *
 * Qui ogni Button registra un <button> vero, trasparente, sovrapposto al
 * proprio riquadro. NON è una seconda implementazione dell'azione: è la
 * stessa, esposta due volte — il pulsante del documento chiama lo stesso
 * gestore del pulsante disegnato. Chi vede non nota alcuna differenza, se
 * non un anello di fuoco quando naviga da tastiera.
 *
 * Tre scelte che vale la pena spiegare.
 *
 * `pointer-events: none`: il mouse continua a parlare col canvas, che ha già
 * la sua gestione del puntatore (hover, suoni, aree sensibili). Un elemento
 * sopra che intercettasse i clic li farebbe gestire due volte. La tastiera e
 * gli strumenti assistivi non passano dal puntatore e funzionano lo stesso.
 *
 * La posizione si chiede al MOTORE. Fra le coordinate di scena e i pixel
 * della pagina ci sono tre trasformazioni (camera, canvas, CSS), e
 * riscriverle a mano è già stato sbagliato una volta in questo progetto:
 * qui si campiona `cam.getWorldPoint`, cioè l'inversa che Phaser espone.
 *
 * I pulsanti coperti da un pannello modale diventano inerti. La profondità
 * non si dichiara: si ricava risalendo i contenitori di ciascun pulsante e
 * prendendo la massima. Sotto il livello più alto attualmente visibile,
 * niente è raggiungibile col TAB — altrimenti il fuoco uscirebbe dal
 * pannello aperto e finirebbe su voci che nessuno vede.
 */

export interface ActionSource {
  /** Riquadro nel mondo di gioco, o null se l'oggetto non è più valido. */
  worldBounds(): Phaser.Geom.Rectangle | null;
  scene: Phaser.Scene;
  label: string;
  isVisible: boolean;
  isEnabled: boolean;
  activate(): void;
  /** Profondità efficace: la massima fra l'oggetto e i suoi contenitori. */
  depth: number;
}

/** Chi espone un'azione sa anche rinfrescarne lo stato prima della lettura. */
export interface ActionOwner {
  refreshAction(): void;
}

interface Entry {
  source: ActionSource;
  owner: ActionOwner;
  el: HTMLButtonElement;
  /** Ultimo stato scritto nel DOM: evita di toccarlo a ogni fotogramma. */
  last: string;
}

const entries = new Set<Entry>();
let root: HTMLElement | null = null;

function layer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (root?.isConnected) return root;
  root = document.getElementById('action-layer');
  return root;
}

export const ActionLayer = {
  register(source: ActionSource, owner: ActionOwner): void {
    const host = layer();
    if (!host) return;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'action-btn';
    el.textContent = source.label;
    // Attivazione da tastiera e da strumento assistivo: stessa azione del
    // pulsante disegnato, non una copia della sua logica.
    el.addEventListener('click', () => {
      if (source.isEnabled && source.isVisible) source.activate();
    });
    // INVIO e SPAZIO su un pulsante a fuoco sono già la sua attivazione: il
    // documento li trasforma da solo in un clic. Ma Phaser ascolta la
    // tastiera sulla finestra, quindi lo stesso tasto arriverebbe anche ai
    // gestori globali della scena — e quelli non sono sempre la stessa
    // azione. Sulla carta norma, un INVIO col fuoco su TORNA ALLA MAPPA
    // avviava CityMap dal pulsante e Case dal gestore globale: due scene
    // vive insieme. Fermare la propagazione lascia intatta l'attivazione
    // (che è l'azione predefinita, non un ascoltatore) e toglie il tasto
    // solo a chi sta più in alto.
    const swallow = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') e.stopPropagation();
    };
    el.addEventListener('keydown', swallow);
    el.addEventListener('keyup', swallow);
    host.appendChild(el);
    entries.add({ source, owner, el, last: '' });
  },

  unregister(source: ActionSource): void {
    for (const e of entries) {
      if (e.source !== source) continue;
      e.el.remove();
      entries.delete(e);
      return;
    }
  },

  /** Quanti pulsanti sono esposti adesso. Serve ai controlli, non al gioco. */
  get size(): number {
    return entries.size;
  },

  /**
   * Allinea gli elementi ai pulsanti disegnati. Gira a ogni fotogramma ma
   * scrive nel DOM solo quando qualcosa è davvero cambiato: i contenitori si
   * spostano (un pannello che scende al centro, un pulsante che cambia
   * larghezza) senza che il pulsante lo sappia, quindi non basta aggiornare
   * sugli eventi.
   */
  sync(): void {
    const host = layer();
    if (!host || entries.size === 0) return;

    for (const { owner } of entries) owner.refreshAction();

    // livello più alto attualmente visibile: tutto ciò che sta sotto è
    // coperto da un pannello e non deve essere raggiungibile col TAB
    let top = -Infinity;
    for (const { source } of entries) {
      if (source.isVisible && source.depth > top) top = source.depth;
    }

    for (const entry of entries) {
      const { source, el } = entry;
      const b = source.worldBounds();
      const reachable = source.isVisible && source.depth >= top;
      if (!b || !reachable) {
        if (entry.last !== 'hidden') {
          el.hidden = true;
          entry.last = 'hidden';
        }
        continue;
      }
      const rect = toPage(source.scene, b);
      if (!rect) continue;
      const state = `${Math.round(rect.x)},${Math.round(rect.y)},${Math.round(rect.w)},${Math.round(rect.h)},${source.label},${source.isEnabled}`;
      if (state === entry.last) continue;
      entry.last = state;
      el.hidden = false;
      el.disabled = !source.isEnabled;
      if (el.textContent !== source.label) el.textContent = source.label;
      el.style.left = `${rect.x}px`;
      el.style.top = `${rect.y}px`;
      el.style.width = `${rect.w}px`;
      el.style.height = `${rect.h}px`;
    }
  }
};

/**
 * Dal riquadro nel mondo ai pixel della pagina. La trasformazione non è
 * riscritta: si campiona l'inversa che la camera espone, in due punti, e se
 * ne ricava la diretta.
 */
function toPage(scene: Phaser.Scene, b: Phaser.Geom.Rectangle): { x: number; y: number; w: number; h: number } | null {
  const game = scene.game;
  const cam = scene.cameras?.main;
  if (!cam || !game?.canvas) return null;
  const p0 = cam.getWorldPoint(0, 0);
  const p1 = cam.getWorldPoint(100, 100);
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  if (dx === 0 || dy === 0) return null;
  const kx = 100 / dx;
  const ky = 100 / dy;
  const canvas = game.canvas.getBoundingClientRect();
  const cssX = canvas.width / game.scale.baseSize.width;
  const cssY = canvas.height / game.scale.baseSize.height;
  return {
    x: (b.x - p0.x) * kx * cssX + canvas.left,
    y: (b.y - p0.y) * ky * cssY + canvas.top,
    w: b.width * kx * cssX,
    h: b.height * ky * cssY
  };
}

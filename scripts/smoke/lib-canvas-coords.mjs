/**
 * DAL MONDO DEL GIOCO AI PIXEL DELLA PAGINA.
 *
 * Tre trasformazioni in fila separano una coordinata di scena dal punto in
 * cui il mouse va cliccato:
 *   1. la camera, che ingrandisce di RENDER_SCALE e scorre per restare
 *      centrata sul mondo logico 1280×720;
 *   2. il canvas, i cui pixel sono RENDER_SCALE volte quelli logici;
 *   3. il CSS, che rimpicciolisce il canvas per farlo stare nella finestra e
 *      lo centra dentro le fasce riservate al contorno della pagina.
 *
 * Fino a poco fa gli smoke saltavano tutte e tre dando per scontato che a
 * 1280×720 le coordinate logiche fossero anche quelle dello schermo. Era
 * vero per coincidenza — a quella dimensione RENDER_SCALE vale 1 e la
 * camera non trasforma niente — e ha smesso di esserlo appena il canvas è
 * stato rientrato. Una versione scritta a mano della formula sbagliava di
 * centinaia di pixel a densità 2, e un controllo che misura sovrapposizioni
 * con coordinate sbagliate è peggio di nessun controllo.
 *
 * Qui la trasformazione NON è riscritta: si campiona `cam.getWorldPoint`,
 * cioè l'inversa che il motore espone, in due punti e se ne ricava la
 * diretta. Se un giorno Phaser cambia il modo di comporre zoom e scroll,
 * questa funzione lo segue senza sapere come.
 *
 * Va passata a `page.evaluate` come sorgente (`page.evaluate(worldToPage,
 * ...)`): gira nel browser, non in Node.
 */
export const worldToPageFn = ({ x, y }) => {
  const g = window.game;
  const scenes = g.scene.getScenes(true);
  const cam = scenes[scenes.length - 1].cameras.main;

  // due campioni dell'inversa esposta dal motore → la diretta, per assi
  const p0 = cam.getWorldPoint(0, 0);
  const p1 = cam.getWorldPoint(100, 100);
  const kx = 100 / (p1.x - p0.x);
  const ky = 100 / (p1.y - p0.y);

  // pixel del canvas → pixel CSS della pagina
  const rect = g.canvas.getBoundingClientRect();
  const cssX = rect.width / g.scale.baseSize.width;
  const cssY = rect.height / g.scale.baseSize.height;

  return {
    x: (x - p0.x) * kx * cssX + rect.left,
    y: (y - p0.y) * ky * cssY + rect.top
  };
};

/**
 * Rettangolo di un oggetto di scena in pixel della pagina, per confrontarlo
 * con gli elementi del documento (che vivono solo lì).
 */
export const boundsToPageSrc = `
  const __toPage = ${worldToPageFn.toString()};
  const boundsToPage = (o) => {
    const b = o.getBounds();
    const tl = __toPage({ x: b.x, y: b.y });
    const br = __toPage({ x: b.x + b.width, y: b.y + b.height });
    return { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
  };
`;

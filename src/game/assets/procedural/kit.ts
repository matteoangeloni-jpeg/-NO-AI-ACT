/**
 * KIT DI DISEGNO PROCEDURALE — le primitive che tutti i generatori compongono.
 *
 * Il sistema grafico del gioco aveva quattro generatori indipendenti che si
 * ripetevano a vicenda: ognuno rifaceva il proprio rumore, il proprio
 * reticolo, il proprio timbro. Aggiungere un tipo di documento voleva dire
 * copiare un altro blocco, e cambiare il grigio della carta voleva dire
 * cercarlo in quattro posti.
 *
 * Qui ci sono le primitive, una volta sola. Sono funzioni pure su un
 * contesto canvas: non conoscono Phaser, non conoscono le scene, e si
 * possono comporre in qualunque ordine.
 *
 * DUE REGOLE.
 *
 * 1. NIENTE `Math.random()`. Un fascicolo deve avere lo stesso aspetto ogni
 *    volta che lo si apre — altrimenti il giocatore che riapre un caso non
 *    riconosce il documento che stava leggendo, e due schermate identiche
 *    diventano due schermate diverse. Il caso semina il proprio generatore
 *    con `seeded(chiave)`.
 *
 * 2. UNITÀ LOGICHE, NON PIXEL. Chi crea la texture applica `ctx.scale` una
 *    volta; qui dentro si disegna sempre in unità logiche, così lo stesso
 *    codice esce nitido a qualunque RENDER_SCALE. L'unica eccezione è la
 *    grana, che deve restare grana e quindi si misura in pixel veri.
 */

/** Numeri pseudo-casuali riproducibili a partire da una stringa. */
export function seeded(key: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un valore nell'intervallo, dal generatore dato. */
export const between = (rnd: () => number, min: number, max: number): number => min + rnd() * (max - min);

// --------------------------------------------------------------- superfici

export interface PaperOptions {
  /** Colore di fondo del foglio. */
  fill: string;
  /** Righe da modulo: passo verticale, 0 per nessuna riga. */
  ruleStep?: number;
  ruleColor?: string;
  /** Colonna di margine a sinistra, in unità logiche. 0 per nessuna. */
  marginX?: number;
  marginColor?: string;
  /** Intensità della grana, 0..1. */
  grain?: number;
}

/**
 * Il foglio su cui tutto il resto si appoggia: fondo, righe del modulo,
 * colonna di margine. La grana NON è qui — va applicata alla fine, sopra
 * ogni altro tratto, altrimenti i disegni successivi la coprono.
 */
export function drawPaper(ctx: CanvasRenderingContext2D, w: number, h: number, o: PaperOptions): void {
  ctx.fillStyle = o.fill;
  ctx.fillRect(0, 0, w, h);

  if (o.ruleStep && o.ruleStep > 0) {
    ctx.strokeStyle = o.ruleColor ?? 'rgba(74,82,96,0.16)';
    ctx.lineWidth = 1;
    for (let y = o.ruleStep; y < h; y += o.ruleStep) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }
  }

  if (o.marginX && o.marginX > 0) {
    ctx.strokeStyle = o.marginColor ?? 'rgba(210,59,59,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(o.marginX, 6);
    ctx.lineTo(o.marginX, h - 6);
    ctx.stroke();
  }
}

/**
 * Grana della carta. Si misura in PIXEL VERI del canvas, non in unità
 * logiche: `getImageData` ignora `ctx.scale`, e chiederla in unità logiche
 * legge soltanto l'angolo in alto a sinistra — difetto già capitato qui,
 * con la mappa che usciva con un quadrante granuloso e tre lisci.
 */
export function drawGrain(
  ctx: CanvasRenderingContext2D,
  pixelW: number,
  pixelH: number,
  rnd: () => number,
  intensity = 0.5
): void {
  if (intensity <= 0 || pixelW <= 0 || pixelH <= 0) return;
  const img = ctx.getImageData(0, 0, pixelW, pixelH);
  const soglia = 1 - 0.02 * intensity;
  for (let p = 0; p < img.data.length; p += 4) {
    if (rnd() > soglia) {
      const n = (8 + rnd() * 20) * intensity;
      img.data[p] += n;
      img.data[p + 1] += n;
      img.data[p + 2] += n;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ------------------------------------------------------------------ timbri

export interface StampOptions {
  color: string;
  /** Rotazione in radianti. Un timbro dritto non sembra apposto a mano. */
  rotation?: number;
  /** Consumo del bordo, 0..1: quanti tratti del rettangolo saltano. */
  wear?: number;
  width?: number;
  height?: number;
}

/**
 * CORNICE DI TIMBRO — e SOLO la cornice.
 *
 * Il bordo è disegnato a segmenti e alcuni saltano: un rettangolo continuo e
 * perfettamente orizzontale legge come una cornice grafica, non come
 * inchiostro premuto male su carta.
 *
 * LE PAROLE NON ENTRANO QUI. Prima questa funzione stampava anche il testo
 * del timbro, e i chiamanti le passavano etichette prese da i18n: quelle
 * parole finivano cotte nei pixel di una texture che nasce una volta sola e
 * sopravvive al cambio di lingua, quindi chi passava all'inglese continuava
 * a vedere "CONFORME" sui timbri della mappa. Ora la cornice è muta e la
 * parola la mette il chiamante con un testo di Phaser: segue la lingua,
 * segue l'ingrandimento del testo, e si legge allo strato di lettura.
 *
 * L'origine è il CENTRO del timbro. Chi chiama posiziona con `translate`.
 */
export function drawStamp(ctx: CanvasRenderingContext2D, rnd: () => number, o: StampOptions): void {
  const w = o.width ?? 170;
  const h = o.height ?? 34;
  const wear = o.wear ?? 0.18;

  ctx.save();
  ctx.rotate(o.rotation ?? 0);
  ctx.strokeStyle = o.color;
  ctx.lineWidth = 2;

  // bordo a tratti: ogni segmento può saltare
  const perimetro: [number, number, number, number][] = [
    [-w / 2, -h / 2, w / 2, -h / 2],
    [w / 2, -h / 2, w / 2, h / 2],
    [w / 2, h / 2, -w / 2, h / 2],
    [-w / 2, h / 2, -w / 2, -h / 2]
  ];
  for (const [x1, y1, x2, y2] of perimetro) {
    const passi = 12;
    for (let i = 0; i < passi; i++) {
      if (rnd() < wear) continue;
      const t0 = i / passi;
      const t1 = (i + 1) / passi;
      ctx.beginPath();
      ctx.moveTo(x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0);
      ctx.lineTo(x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ------------------------------------------------------- tratti documentali

/**
 * Barre di omissis. Non decorazione: dicono che il documento è arrivato
 * all'ispettorato già epurato, che è il modo in cui l'opacità amministrativa
 * si vede su un foglio.
 */
export function drawRedactionBars(
  ctx: CanvasRenderingContext2D,
  rnd: () => number,
  x: number,
  y: number,
  larghezzaUtile: number,
  righe: number,
  colore = 'rgba(7,9,15,0.92)'
): void {
  ctx.fillStyle = colore;
  for (let i = 0; i < righe; i++) {
    const w = between(rnd, larghezzaUtile * 0.28, larghezzaUtile * 0.8);
    const offset = between(rnd, 0, larghezzaUtile - w);
    ctx.fillRect(x + offset, y + i * 13, w, 7);
  }
}

/**
 * Reticolo da tabulato tecnico: colonne strette e fitte, come il margine di
 * un log stampato. Serve a far leggere "macchina" prima ancora del testo.
 */
export function drawDataGrid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  passo: number,
  colore: string
): void {
  ctx.save();
  ctx.strokeStyle = colore;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = x; gx <= x + w; gx += passo) {
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
  }
  for (let gy = y; gy <= y + h; gy += passo) {
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Disturbo: righe spostate orizzontalmente, come un'immagine ricostruita
 * male. Si usa per i sistemi opachi e le contraddizioni, mai per decorare.
 */
export function drawGlitchBands(
  ctx: CanvasRenderingContext2D,
  rnd: () => number,
  w: number,
  h: number,
  bande: number,
  colore: string
): void {
  ctx.save();
  ctx.fillStyle = colore;
  for (let i = 0; i < bande; i++) {
    const y = between(rnd, 0, h);
    const altezza = between(rnd, 1, 3);
    const offset = between(rnd, -w * 0.06, w * 0.06);
    ctx.fillRect(offset, y, w, altezza);
  }
  ctx.restore();
}

/**
 * Perforazione da faldone: i due fori del raccoglitore. Un dettaglio solo,
 * ma è quello che fa leggere "documento archiviato" invece di "riquadro".
 */
export function drawPunchHoles(ctx: CanvasRenderingContext2D, x: number, h: number, colore: string): void {
  ctx.save();
  ctx.fillStyle = colore;
  for (const y of [h * 0.34, h * 0.66]) {
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Riga di intestazione: protocollo, data, ufficio. Testo già formattato. */
export function drawHeaderRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  colore: string
): void {
  ctx.save();
  ctx.strokeStyle = colore;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Crocini d'angolo. Sono i segni di taglio di un modulo stampato: quattro
 * coppie di trattini che non chiudono il rettangolo. Una cornice continua
 * legge come "riquadro dell'interfaccia"; questi leggono come "foglio
 * uscito da una tipografia d'ufficio", che è la differenza fra un pannello
 * e un documento.
 */
export function drawCornerTicks(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  inset: number,
  lunghezza: number,
  colore: string
): void {
  ctx.save();
  ctx.strokeStyle = colore;
  ctx.lineWidth = 1;
  const angoli: [number, number, number, number][] = [
    [inset, inset, 1, 1],
    [w - inset, inset, -1, 1],
    [inset, h - inset, 1, -1],
    [w - inset, h - inset, -1, -1]
  ];
  for (const [x, y, sx, sy] of angoli) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sx * lunghezza, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + sy * lunghezza);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Striscia di protocollo: trattini verticali di larghezza variabile, come il
 * codice a barre che gli uffici stampano sul margine per la registrazione.
 *
 * È volutamente SENZA PAROLE. Il gioco è bilingue e queste texture sono
 * condivise fra italiano e inglese: qualunque parola cotta qui dentro
 * resterebbe nella lingua di chi l'ha scritta anche per l'altro pubblico —
 * difetto che c'era davvero, con "NON CLASSIFICATO / ISPETTORATO AX"
 * stampato nella carta e mostrato identico nella versione inglese.
 */
export function drawRegistryStrip(
  ctx: CanvasRenderingContext2D,
  rnd: () => number,
  x: number,
  y: number,
  w: number,
  h: number,
  colore: string
): void {
  ctx.save();
  ctx.fillStyle = colore;
  let cx = x;
  while (cx < x + w) {
    const larghezza = between(rnd, 1, 3.5);
    if (cx + larghezza > x + w) break;
    ctx.fillRect(cx, y, larghezza, h);
    cx += larghezza + between(rnd, 1.5, 4);
  }
  ctx.restore();
}

/**
 * Doppio filo: la riga spessa e la sua sottile appaiata. È il taglio che
 * separa l'intestazione dal corpo in un atto amministrativo — un filo solo
 * sembra un divisore qualunque, due sembrano un modulo.
 */
export function drawDoubleRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  colore: string,
  colorePallido: string
): void {
  drawHeaderRule(ctx, x, y, w, colore);
  drawHeaderRule(ctx, x, y + 3, w, colorePallido);
}

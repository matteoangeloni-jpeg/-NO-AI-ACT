import Phaser from 'phaser';

/**
 * Genera la mappa civica come texture canvas: reticolo stradale ortogonale,
 * isolati, un fiume-canale e rumore leggero. Estetica: cartografia
 * amministrativa notturna, non cyberpunk.
 */
export function createCityMap(scene: Phaser.Scene, key: string, width: number, height: number): void {
  if (scene.textures.exists(key)) return;
  const canvas = scene.textures.createCanvas(key, width, height);
  if (!canvas) return;
  const ctx = canvas.getContext();

  // fondale blu notte con vignettatura
  const grad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * 0.7);
  grad.addColorStop(0, '#0d1630');
  grad.addColorStop(1, '#07090f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // canale che attraversa la città
  ctx.strokeStyle = '#16233f';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.moveTo(-20, height * 0.18);
  ctx.bezierCurveTo(width * 0.3, height * 0.34, width * 0.55, height * 0.5, width + 20, height * 0.42);
  ctx.stroke();

  // griglia stradale principale
  ctx.strokeStyle = '#1a2440';
  ctx.lineWidth = 3;
  const stepX = width / 12;
  const stepY = height / 8;
  for (let i = 1; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(i * stepX + jitter(6), 0);
    ctx.lineTo(i * stepX + jitter(6), height);
    ctx.stroke();
  }
  for (let j = 1; j < 8; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * stepY + jitter(6));
    ctx.lineTo(width, j * stepY + jitter(6));
    ctx.stroke();
  }

  // strade secondarie
  ctx.strokeStyle = '#141d33';
  ctx.lineWidth = 1;
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    ctx.moveTo(i * (width / 24), 0);
    ctx.lineTo(i * (width / 24), height);
    ctx.stroke();
  }
  for (let j = 0; j < 16; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * (height / 16));
    ctx.lineTo(width, j * (height / 16));
    ctx.stroke();
  }

  // isolati: rettangoli appena più chiari, alcuni "attivi"
  const rnd = mulberry32(20320);
  for (let i = 0; i < 110; i++) {
    const bx = rnd() * width;
    const by = rnd() * height;
    const bw = 14 + rnd() * 50;
    const bh = 10 + rnd() * 36;
    ctx.fillStyle = rnd() > 0.88 ? 'rgba(93,127,184,0.10)' : 'rgba(74,82,96,0.10)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(74,82,96,0.18)';
    ctx.strokeRect(bx, by, bw, bh);
  }

  // rumore digitale leggero
  const img = ctx.getImageData(0, 0, width, height);
  for (let p = 0; p < img.data.length; p += 4) {
    if (rnd() > 0.985) {
      const n = 10 + rnd() * 18;
      img.data[p] += n;
      img.data[p + 1] += n;
      img.data[p + 2] += n;
    }
  }
  ctx.putImageData(img, 0, 0);

  canvas.refresh();
}

function jitter(amount: number): number {
  return (Math.random() - 0.5) * amount;
}

/** PRNG deterministico: la mappa è identica a ogni avvio. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

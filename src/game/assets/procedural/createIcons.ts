import Phaser from 'phaser';

type Drawer = (ctx: CanvasRenderingContext2D, s: number) => void;

const STROKE = '#d8d6cd';

/**
 * Icone vettoriali disegnate su canvas (stile "line icon" istituzionale).
 * Nessun asset esterno: ogni icona è una manciata di tratti geometrici.
 */
export function createIcons(scene: Phaser.Scene): void {
  const size = 64;
  const icons: Record<string, Drawer> = {
    icon_townhall: (ctx, s) => {
      // municipio: timpano + colonne
      path(ctx, [[8, 24], [32, 8], [56, 24]], false);
      line(ctx, 10, 28, 54, 28);
      for (const x of [16, 28, 40, 52 - 4]) line(ctx, x, 32, x, 48);
      line(ctx, 8, 52, 56, 52);
      void s;
    },
    icon_work: (ctx, s) => {
      // valigetta
      rect(ctx, 10, 24, 44, 28);
      path(ctx, [[24, 24], [24, 16], [40, 16], [40, 24]], false);
      line(ctx, 10, 36, 54, 36);
      void s;
    },
    icon_media: (ctx, s) => {
      // monitor con onda di trasmissione
      rect(ctx, 10, 14, 44, 30);
      line(ctx, 24, 52, 40, 52);
      line(ctx, 32, 44, 32, 52);
      arc(ctx, 32, 29, 6, 0, Math.PI * 2);
      arc(ctx, 32, 29, 12, -0.6, 0.6);
      void s;
    },
    icon_school: (ctx, s) => {
      // volto stilizzato osservato da mirino
      arc(ctx, 32, 32, 13, 0, Math.PI * 2);
      arc(ctx, 27, 29, 1.6, 0, Math.PI * 2);
      arc(ctx, 37, 29, 1.6, 0, Math.PI * 2);
      line(ctx, 27, 38, 37, 38);
      // angoli mirino
      path(ctx, [[10, 18], [10, 10], [18, 10]], false);
      path(ctx, [[46, 10], [54, 10], [54, 18]], false);
      path(ctx, [[54, 46], [54, 54], [46, 54]], false);
      path(ctx, [[18, 54], [10, 54], [10, 46]], false);
      void s;
    },
    icon_hospital: (ctx, s) => {
      // croce in scudo
      path(ctx, [[32, 8], [54, 16], [54, 36], [32, 56], [10, 36], [10, 16]], true);
      line(ctx, 32, 22, 32, 42);
      line(ctx, 22, 32, 42, 32);
      void s;
    },
    icon_eye: (ctx, s) => {
      // occhio di sorveglianza
      ctx.beginPath();
      ctx.moveTo(8, 32);
      ctx.bezierCurveTo(20, 16, 44, 16, 56, 32);
      ctx.bezierCurveTo(44, 48, 20, 48, 8, 32);
      ctx.stroke();
      arc(ctx, 32, 32, 7, 0, Math.PI * 2);
      arc(ctx, 32, 32, 2.5, 0, Math.PI * 2);
      void s;
    },
    icon_ban: (ctx, s) => {
      arc(ctx, 32, 32, 20, 0, Math.PI * 2);
      line(ctx, 18, 46, 46, 18);
      void s;
    },
    icon_lock: (ctx, s) => {
      rect(ctx, 16, 28, 32, 24);
      ctx.beginPath();
      ctx.arc(32, 28, 10, Math.PI, 0);
      ctx.stroke();
      line(ctx, 32, 36, 32, 44);
      void s;
    },
    icon_card: (ctx, s) => {
      rect(ctx, 12, 10, 40, 44);
      line(ctx, 18, 22, 46, 22);
      line(ctx, 18, 30, 46, 30);
      line(ctx, 18, 38, 38, 38);
      void s;
    }
  };

  for (const [key, draw] of Object.entries(icons)) {
    if (scene.textures.exists(key)) continue;
    const canvas = scene.textures.createCanvas(key, size, size);
    if (!canvas) continue;
    const ctx = canvas.getContext();
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    draw(ctx, size);
    canvas.refresh();
  }
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.strokeRect(x, y, w, h);
}

function arc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a0: number, a1: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, a0, a1);
  ctx.stroke();
}

function path(ctx: CanvasRenderingContext2D, pts: [number, number][], close: boolean): void {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
  ctx.stroke();
}

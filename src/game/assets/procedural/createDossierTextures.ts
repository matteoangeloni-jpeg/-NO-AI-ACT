import Phaser from 'phaser';

/**
 * Texture "carta da fascicolo": fondo scuro con righe orizzontali deboli
 * e timbratura d'angolo, usata come sfondo dei dossier.
 */
export function createDossierTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists('dossier_paper')) return;
  const w = 900;
  const h = 560;
  const canvas = scene.textures.createCanvas('dossier_paper', w, h);
  if (!canvas) return;
  const ctx = canvas.getContext();

  ctx.fillStyle = '#101a30';
  ctx.fillRect(0, 0, w, h);

  // righe da modulo amministrativo
  ctx.strokeStyle = 'rgba(74,82,96,0.16)';
  ctx.lineWidth = 1;
  for (let y = 60; y < h; y += 28) {
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(w - 24, y);
    ctx.stroke();
  }

  // colonna margine
  ctx.strokeStyle = 'rgba(210,59,59,0.25)';
  ctx.beginPath();
  ctx.moveTo(70, 24);
  ctx.lineTo(70, h - 24);
  ctx.stroke();

  // timbro d'angolo
  ctx.save();
  ctx.translate(w - 130, 90);
  ctx.rotate(-0.18);
  ctx.strokeStyle = 'rgba(210,59,59,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-85, -26, 170, 52);
  ctx.font = '16px monospace';
  ctx.fillStyle = 'rgba(210,59,59,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText('NON CLASSIFICATO', 0, -2);
  ctx.fillText('ISPETTORATO AX', 0, 18);
  ctx.restore();

  canvas.refresh();
}

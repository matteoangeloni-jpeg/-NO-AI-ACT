import Phaser from 'phaser';

/** Texture minime per particelle e overlay di rumore digitale. */
export function createParticles(scene: Phaser.Scene): void {
  if (!scene.textures.exists('px')) {
    const canvas = scene.textures.createCanvas('px', 4, 4);
    if (canvas) {
      const ctx = canvas.getContext();
      ctx.fillStyle = '#d8d6cd';
      ctx.fillRect(0, 0, 4, 4);
      canvas.refresh();
    }
  }

  if (!scene.textures.exists('noise')) {
    const size = 256;
    const canvas = scene.textures.createCanvas('noise', size, size);
    if (canvas) {
      const ctx = canvas.getContext();
      const img = ctx.createImageData(size, size);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 14; // quasi trasparente
      }
      ctx.putImageData(img, 0, 0);
      canvas.refresh();
    }
  }
}

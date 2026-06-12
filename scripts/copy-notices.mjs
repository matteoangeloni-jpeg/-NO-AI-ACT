// Copia i notice di licenza nella build distribuita (dist/).
// Eseguito da `npm run build` dopo vite build.
import { copyFileSync, existsSync } from 'node:fs';

const files = ['THIRD_PARTY_LICENSES.md', 'LICENSE', 'CREDITS.md'];

if (!existsSync('dist')) {
  console.error('copy-notices: cartella dist/ assente. Eseguire prima vite build.');
  process.exit(1);
}

for (const f of files) {
  copyFileSync(f, `dist/${f}`);
  console.log(`copy-notices: ${f} -> dist/${f}`);
}

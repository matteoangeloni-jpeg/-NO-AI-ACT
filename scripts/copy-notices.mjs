// Copia i notice di licenza nella build distribuita (dist/).
// Eseguito da `npm run build` dopo vite build.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const files = ['THIRD_PARTY_LICENSES.md', 'LICENSE', 'CREDITS.md', 'LICENSES/GPL-3.0.txt'];

if (!existsSync('dist')) {
  console.error('copy-notices: cartella dist/ assente. Eseguire prima vite build.');
  process.exit(1);
}

for (const f of files) {
  // il testo integrale della GPL sta in una sottocartella: va creata, altrimenti
  // copyFileSync fallisce e la build distribuita resta senza licenza
  mkdirSync(dirname(`dist/${f}`), { recursive: true });
  copyFileSync(f, `dist/${f}`);
  console.log(`copy-notices: ${f} -> dist/${f}`);
}

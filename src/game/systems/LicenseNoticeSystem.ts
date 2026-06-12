/**
 * Registro licenze esposto a runtime (schermata Credits) e in console.
 * La fonte autorevole è ASSET_REGISTER.md nel repository.
 */
export interface LicenseEntry {
  name: string;
  type: string;
  license: string;
  source: string;
}

export const LICENSES: LicenseEntry[] = [
  { name: 'Phaser 3', type: 'libreria di gioco', license: 'MIT', source: 'https://phaser.io' },
  { name: 'Vite', type: 'build tool', license: 'MIT', source: 'https://vitejs.dev' },
  { name: 'TypeScript', type: 'linguaggio/compilatore', license: 'Apache-2.0', source: 'https://www.typescriptlang.org' },
  { name: 'Vitest', type: 'test runner (solo dev)', license: 'MIT', source: 'https://vitest.dev' },
  { name: 'Grafica di gioco', type: 'asset procedurali', license: 'MIT (codice del progetto)', source: 'src/game/assets/procedural' },
  { name: 'Audio di gioco', type: 'sintesi Web Audio', license: 'MIT (codice del progetto)', source: 'src/game/systems/AudioSystem.ts' },
  { name: 'Testi narrativi e carte norma', type: 'contenuto editoriale', license: 'CC BY 4.0', source: 'src/game/data' },
  { name: 'Font', type: 'font stack di sistema', license: 'Font locali del sistema operativo, nessun file distribuito', source: 'src/styles/global.css' }
];

export const LicenseNoticeSystem = {
  entries(): LicenseEntry[] {
    return LICENSES;
  },

  logToConsole(): void {
    // Nota visibile agli sviluppatori che aprono la console.
    console.info(
      '%cNO AI ACT — asset e licenze',
      'color:#5d7fb8;font-weight:bold',
      '\nTutti gli asset grafici e audio sono generati proceduralmente.' +
        '\nDettagli completi: ASSET_REGISTER.md, CREDITS.md, LICENSE_NOTES.md.'
    );
  }
};

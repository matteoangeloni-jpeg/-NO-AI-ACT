import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en/index.html'),
        play: resolve(__dirname, 'play/index.html'),
        comeFunziona: resolve(__dirname, 'come-funziona/index.html'),
        perDocenti: resolve(__dirname, 'per-docenti/index.html'),
        aiActSeriousGame: resolve(__dirname, 'ai-act-serious-game/index.html'),
        privacyByDesign: resolve(__dirname, 'privacy-by-design/index.html'),
        enHowItWorks: resolve(__dirname, 'en/how-it-works/index.html'),
        enForEducators: resolve(__dirname, 'en/for-educators/index.html'),
        enAiActSeriousGame: resolve(__dirname, 'en/ai-act-serious-game/index.html'),
        enPrivacyByDesign: resolve(__dirname, 'en/privacy-by-design/index.html')
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});

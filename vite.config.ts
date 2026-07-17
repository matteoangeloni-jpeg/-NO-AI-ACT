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
        enPrivacyByDesign: resolve(__dirname, 'en/privacy-by-design/index.html'),
        hub_educazione: resolve(__dirname, 'educazione/index.html'),
        hub_aiActPerDocenti: resolve(__dirname, 'ai-act-per-docenti/index.html'),
        hub_alfabetizzazioneAi: resolve(__dirname, 'alfabetizzazione-ai/index.html'),
        hub_guidaAiAct: resolve(__dirname, 'guida-ai-act/index.html'),
        hub_categorieRischioAiAct: resolve(__dirname, 'categorie-rischio-ai-act/index.html'),
        hub_praticheVietateAiAct: resolve(__dirname, 'pratiche-vietate-ai-act/index.html'),
        hub_sistemiAiAdAltoRischio: resolve(__dirname, 'sistemi-ai-ad-alto-rischio/index.html'),
        hub_obblighiTrasparenzaAiAct: resolve(__dirname, 'obblighi-trasparenza-ai-act/index.html'),
        hub_aiGenerativaEGpai: resolve(__dirname, 'ai-generativa-e-gpai/index.html'),
        hub_apprendimentoPrivacyConsapevole: resolve(__dirname, 'apprendimento-privacy-consapevole/index.html'),
        hub_seriousGameRegolazioneAi: resolve(__dirname, 'serious-game-regolazione-ai/index.html'),
        hub_attivitaDidattiche: resolve(__dirname, 'attivita-didattiche/index.html'),
        hub_lezioneIntroduzioneAiAct: resolve(__dirname, 'lezione-introduzione-ai-act/index.html'),
        hub_glossario: resolve(__dirname, 'glossario/index.html'),
        hubEn_education: resolve(__dirname, 'en/education/index.html'),
        hubEn_aiActForTeachers: resolve(__dirname, 'en/ai-act-for-teachers/index.html'),
        hubEn_aiLiteracy: resolve(__dirname, 'en/ai-literacy/index.html'),
        hubEn_euAiActGuide: resolve(__dirname, 'en/eu-ai-act-guide/index.html'),
        hubEn_aiActRiskCategories: resolve(__dirname, 'en/ai-act-risk-categories/index.html'),
        hubEn_prohibitedAiPractices: resolve(__dirname, 'en/prohibited-ai-practices/index.html'),
        hubEn_highRiskAiSystems: resolve(__dirname, 'en/high-risk-ai-systems/index.html'),
        hubEn_transparencyObligations: resolve(__dirname, 'en/transparency-obligations/index.html'),
        hubEn_generalPurposeAi: resolve(__dirname, 'en/general-purpose-ai/index.html'),
        hubEn_privacyConsciousLearning: resolve(__dirname, 'en/privacy-conscious-learning/index.html'),
        hubEn_seriousGamesForAiRegulation: resolve(__dirname, 'en/serious-games-for-ai-regulation/index.html'),
        hubEn_digitalCitizenshipAiRegulation: resolve(__dirname, 'en/digital-citizenship-ai-regulation/index.html'),
        hubEn_classroomActivities: resolve(__dirname, 'en/classroom-activities/index.html'),
        hubEn_lessonPlanIntroductionToTheAiAct: resolve(__dirname, 'en/lesson-plan-introduction-to-the-ai-act/index.html'),
        hubEn_lessonPlanRiskBasedApproach: resolve(__dirname, 'en/lesson-plan-risk-based-approach/index.html'),
        hubEn_lessonPlanTransparencyAndUsers: resolve(__dirname, 'en/lesson-plan-transparency-and-users/index.html'),
        hubEn_glossary: resolve(__dirname, 'en/glossary/index.html'),
        hubEn_faq: resolve(__dirname, 'en/faq/index.html'),
        auth_comeCitare: resolve(__dirname, 'come-citare/index.html'),
        auth_ricercaEMetodologia: resolve(__dirname, 'ricerca-e-metodologia/index.html'),
        auth_pressKit: resolve(__dirname, 'press-kit/index.html'),
        authEn_howToCite: resolve(__dirname, 'en/how-to-cite/index.html'),
        authEn_researchAndMethodology: resolve(__dirname, 'en/research-and-methodology/index.html'),
        authEn_pressKit: resolve(__dirname, 'en/press-kit/index.html')
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

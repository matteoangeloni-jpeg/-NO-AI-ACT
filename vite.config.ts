import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
        play: resolve(import.meta.dirname, 'play/index.html'),
        comeFunziona: resolve(import.meta.dirname, 'come-funziona/index.html'),
        perDocenti: resolve(import.meta.dirname, 'per-docenti/index.html'),
        aiActSeriousGame: resolve(import.meta.dirname, 'ai-act-serious-game/index.html'),
        privacyByDesign: resolve(import.meta.dirname, 'privacy-by-design/index.html'),
        enHowItWorks: resolve(import.meta.dirname, 'en/how-it-works/index.html'),
        enForEducators: resolve(import.meta.dirname, 'en/for-educators/index.html'),
        enAiActSeriousGame: resolve(import.meta.dirname, 'en/ai-act-serious-game/index.html'),
        enPrivacyByDesign: resolve(import.meta.dirname, 'en/privacy-by-design/index.html'),
        hub_educazione: resolve(import.meta.dirname, 'educazione/index.html'),
        hub_aiActPerDocenti: resolve(import.meta.dirname, 'ai-act-per-docenti/index.html'),
        hub_alfabetizzazioneAi: resolve(import.meta.dirname, 'alfabetizzazione-ai/index.html'),
        hub_guidaAiAct: resolve(import.meta.dirname, 'guida-ai-act/index.html'),
        hub_categorieRischioAiAct: resolve(import.meta.dirname, 'categorie-rischio-ai-act/index.html'),
        hub_praticheVietateAiAct: resolve(import.meta.dirname, 'pratiche-vietate-ai-act/index.html'),
        hub_sistemiAiAdAltoRischio: resolve(import.meta.dirname, 'sistemi-ai-ad-alto-rischio/index.html'),
        hub_obblighiTrasparenzaAiAct: resolve(import.meta.dirname, 'obblighi-trasparenza-ai-act/index.html'),
        hub_aiGenerativaEGpai: resolve(import.meta.dirname, 'ai-generativa-e-gpai/index.html'),
        hub_apprendimentoPrivacyConsapevole: resolve(import.meta.dirname, 'apprendimento-privacy-consapevole/index.html'),
        hub_seriousGameRegolazioneAi: resolve(import.meta.dirname, 'serious-game-regolazione-ai/index.html'),
        hub_attivitaDidattiche: resolve(import.meta.dirname, 'attivita-didattiche/index.html'),
        hub_lezioneIntroduzioneAiAct: resolve(import.meta.dirname, 'lezione-introduzione-ai-act/index.html'),
        hub_glossario: resolve(import.meta.dirname, 'glossario/index.html'),
        hubEn_education: resolve(import.meta.dirname, 'en/education/index.html'),
        hubEn_aiActForTeachers: resolve(import.meta.dirname, 'en/ai-act-for-teachers/index.html'),
        hubEn_aiLiteracy: resolve(import.meta.dirname, 'en/ai-literacy/index.html'),
        hubEn_euAiActGuide: resolve(import.meta.dirname, 'en/eu-ai-act-guide/index.html'),
        hubEn_aiActRiskCategories: resolve(import.meta.dirname, 'en/ai-act-risk-categories/index.html'),
        hubEn_prohibitedAiPractices: resolve(import.meta.dirname, 'en/prohibited-ai-practices/index.html'),
        hubEn_highRiskAiSystems: resolve(import.meta.dirname, 'en/high-risk-ai-systems/index.html'),
        hubEn_transparencyObligations: resolve(import.meta.dirname, 'en/transparency-obligations/index.html'),
        hubEn_generalPurposeAi: resolve(import.meta.dirname, 'en/general-purpose-ai/index.html'),
        hubEn_privacyConsciousLearning: resolve(import.meta.dirname, 'en/privacy-conscious-learning/index.html'),
        hubEn_seriousGamesForAiRegulation: resolve(import.meta.dirname, 'en/serious-games-for-ai-regulation/index.html'),
        hubEn_digitalCitizenshipAiRegulation: resolve(import.meta.dirname, 'en/digital-citizenship-ai-regulation/index.html'),
        hubEn_classroomActivities: resolve(import.meta.dirname, 'en/classroom-activities/index.html'),
        hubEn_lessonPlanIntroductionToTheAiAct: resolve(import.meta.dirname, 'en/lesson-plan-introduction-to-the-ai-act/index.html'),
        hubEn_lessonPlanRiskBasedApproach: resolve(import.meta.dirname, 'en/lesson-plan-risk-based-approach/index.html'),
        hubEn_lessonPlanTransparencyAndUsers: resolve(import.meta.dirname, 'en/lesson-plan-transparency-and-users/index.html'),
        hubEn_glossary: resolve(import.meta.dirname, 'en/glossary/index.html'),
        hubEn_faq: resolve(import.meta.dirname, 'en/faq/index.html'),
        auth_comeCitare: resolve(import.meta.dirname, 'come-citare/index.html'),
        auth_ricercaEMetodologia: resolve(import.meta.dirname, 'ricerca-e-metodologia/index.html'),
        auth_pressKit: resolve(import.meta.dirname, 'press-kit/index.html'),
        authEn_howToCite: resolve(import.meta.dirname, 'en/how-to-cite/index.html'),
        authEn_researchAndMethodology: resolve(import.meta.dirname, 'en/research-and-methodology/index.html'),
        authEn_pressKit: resolve(import.meta.dirname, 'en/press-kit/index.html'),
        cl_tempiApplicazione: resolve(import.meta.dirname, 'tempi-applicazione-ai-act/index.html'),
        cl_deepfakeETrasparenza: resolve(import.meta.dirname, 'deepfake-e-trasparenza/index.html'),
        cl_aiNelLavoro: resolve(import.meta.dirname, 'ai-nel-lavoro-e-selezione/index.html'),
        cl_laboratorioInClasse: resolve(import.meta.dirname, 'laboratorio-ai-act-in-classe/index.html'),
        clEn_applicationTimeline: resolve(import.meta.dirname, 'en/ai-act-application-timeline/index.html'),
        clEn_deepfakesTransparency: resolve(import.meta.dirname, 'en/deepfakes-and-transparency/index.html'),
        clEn_recruitmentEmployment: resolve(import.meta.dirname, 'en/ai-in-recruitment-and-employment/index.html'),
        clEn_classroomLab: resolve(import.meta.dirname, 'en/ai-act-classroom-lab/index.html')
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

/**
 * Dictionnaire FRANÇAIS — doit fournir exactement les mêmes clés que `it`.
 *
 * TERMINOLOGIE. Les termes normatifs suivent la version officielle française du
 * règlement (UE) 2024/1689, tel que modifié par le règlement (UE) 2026/1744.
 * La table complète est dans docs/GLOSSAIRE_FR.md, qui est la seule source
 * autorisée : « déployeur » et non « utilisateur », « hypertrucage » et non
 * « deepfake », « contrôle humain » et non « supervision humaine ».
 *
 * Contenus normatifs : version pédagogique simplifiée. Ne constitue pas un
 * conseil juridique.
 *
 * REGISTRE. Celui d'une administration d'inspection, sobre et bureaucratique,
 * jamais familier : « dossier », « pièce », « rapport d'inspection »,
 * « fiche normative ». Le vouvoiement est la règle.
 */
import { gameplayFr } from './gameplay';
export const fr = {
  gameplay: gameplayFr,
  ui: {
    gameTitle: 'NO AI ACT',
    gameSubtitle: "Simulateur d'une société non régulée",
    titleTagline:
      "Évaluez des cas d'usage de l'IA. Chaque choix pèse sur la confiance publique, l'innovation et les droits. Objectif : trouver un équilibre tenable.",
    titleHeader: 'RÉPUBLIQUE MUNICIPALE AUTOMATISÉE — ANNÉE 2032',
    textSpeed: {
      label: 'VITESSE DU TEXTE : {value}',
      modes: { slow: 'lente', normal: 'normale', instant: 'instantanée' }
    },
    typewriterHint: "▸ clic, ESPACE ou ENTRÉE pour afficher tout le texte d'un coup",
    footerDisclaimer:
      "Version pédagogique simplifiée de l'AI Act (règlement UE 2024/1689, tel que modifié par le règlement UE 2026/1744). Ne constitue pas un conseil juridique.",
    menu: {
      continue: "POURSUIVRE L'ENQUÊTE",
      newGame: 'NOUVELLE PARTIE',
      archive: 'ARCHIVES NORMATIVES',
      credits: 'CRÉDITS ET LICENCES',
      reset: 'RÉINITIALISER LA SAUVEGARDE',
      audioOn: 'AUDIO : ACTIVÉ',
      audioOff: 'AUDIO : DÉSACTIVÉ',
      motionFull: 'ANIMATIONS : COMPLÈTES',
      motionReduced: 'ANIMATIONS : RÉDUITES',
      crtOn: 'EFFET CRT : ACTIVÉ',
      crtOff: 'EFFET CRT : DÉSACTIVÉ',
      music: 'MUSIQUE : {value}',
      musicOn: 'MUSIQUE : ACTIVÉE',
      musicOff: 'MUSIQUE : DÉSACTIVÉE',
      sfx: 'EFFETS : {value}',
      sfxOn: 'EFFETS : ACTIVÉS',
      sfxOff: 'EFFETS : DÉSACTIVÉS',
      language: 'LANGUE : FRANÇAIS',
      teacherOn: 'MODE ENSEIGNANT : ACTIVÉ',
      teacherOff: 'MODE ENSEIGNANT : DÉSACTIVÉ',
      teacherScope: 'Débriefing local : aucune classe, aucun compte, aucun serveur.',
      resetDone: 'Sauvegarde réinitialisée.',
      teachers: 'ENSEIGNANTS ET CLASSE',
      resources: 'RESSOURCES',
      settings: 'PARAMÈTRES',
      resetConfirm: 'CONFIRMER LA RÉINITIALISATION ?'
    },
    titleGroups: {
      settingsTitle: 'Paramètres',
      settingsPrivacy:
        'Sauvegarde et préférences restent uniquement dans votre navigateur : aucun compte, aucune donnée envoyée.',
      teachersTitle: 'Enseignants et classe',
      classPreset: 'PRÊT POUR LA CLASSE ▸',
      classPresetDone: 'Mode enseignant actif et texte instantané.',
      classPresetNote:
        "Active les pauses de discussion après chaque dossier et affiche le texte sans attente. N'ajoute aucun minuteur et ne compare aucun groupe : le jeu ne mesure pas votre temps et ne fait sortir aucune donnée de l'appareil.",
      teachersNote:
        'Mode enseignant : pauses de discussion après chaque dossier et débriefing local en fin de partie. Usage en classe : 20 à 40 minutes, aucun compte, aucune donnée collectée.',
      resourcesTitle: 'Ressources',
      resourcesNote: 'Archives et glossaire du jeu, plus les guides du site (nouvel onglet).',
      close: 'FERMER'
    },
    preload: {
      systemName: 'SYSTÈME CIVIQUE INTÉGRÉ',
      steps: [
        'génération de la cartographie civique…',
        'compilation de la signalétique…',
        'calibrage du bruit de fond…',
        'ouverture des archives de dossiers…'
      ],
      accessGranted: 'accès inspection : ACCORDÉ'
    },
    map: {
      header: 'CARTE CIVIQUE — RÉSEAU DES SYSTÈMES AUTOMATISÉS',
      progress: 'INSPECTEUR AX · DOSSIERS CLOS : {done}/{total}',
      statusOpen: '[ INCIDENT OUVERT ]',
      statusDraft: '[ REPRENDRE · {taken}/{total} décisions ]',
      statusDraftEvidence: '[ REPRENDRE · pièces ouvertes ]',
      statusClosed: '[ DOSSIER CLOS ]',
      statusNonCompliant: '[ CLOS — NON CONFORME ]',
      statusSealed: '[ DOSSIER SOUS SCELLÉS ]',
      sealedToast: "Dossier sous scellés. Autorisation d'accès refusée.",
      alreadyClosedToast: '{code} : dossier déjà clos.',
      finaleReadyToast: 'Au moins quatre dossiers sont clos. Le rapport final est disponible.',
      finaleButton: 'RAPPORT FINAL ▸',
      menuButton: 'MENU'
    },
    case: {
      fileLabel: 'DOSSIER {code}',
      examineButton: 'EXAMINER LES PIÈCES ▸',
      backToMap: '◂ CARTE'
    },
    context: {
      button: 'REVOIR LE CONTEXTE',
      title: 'Contexte du dossier',
      scenarioLabel: 'Synthèse du dossier',
      objectiveLabel: 'Objectif',
      objective:
        "Classer le risque du système selon l'AI Act et prescrire la mesure adéquate.",
      note: 'Cette fiche sert seulement à revoir le dossier. Elle ne modifie ni le rapport ni la classification.',
      closeToDecision: 'Revenir à la décision',
      closeToEvidence: 'Revenir aux pièces'
    },
    inspectorDesk: {
      evidencePhase: "POSTE D'INSPECTION · EXAMEN DES PIÈCES",
      decisionPhase: "POSTE D'INSPECTION · RÉDACTION DE L'ACTE",
      fileLabel: 'DOSSIER {code}',
      evidenceStatus: 'OUVERTES {opened}/{total} · CITÉES {cited}',
      citedStatus: 'PREUVES CITÉES {cited}',
      context: 'DOSSIER',
      compare: 'COMPARER [X]',
      norm: 'NORME',
      normLocked: 'NORME EN DÉCISION',
      archive: 'ARCHIVES',
      notebook: 'CARNET',
      terms: 'TERMES',
      compareTitle: 'COMPARAISON DES PIÈCES',
      compareIntro:
        'Deux documents sur le même plan : comparez provenance, fonction et contenu avant de décider.',
      compareCounter: 'PAIRE {current} SUR {total}',
      compareSource: 'SOURCE',
      compareFunction: 'FONCTION',
      compareUnknownSource: 'non déclarée',
      compareUnknownFunction: 'à évaluer',
      compareHint:
        "Cherchez ce qui se confirme, ce qui se contredit et quelle source soutient le mieux le rapport.",
      comparePrev: 'PAIRE PRÉCÉDENTE',
      compareNext: 'PAIRE SUIVANTE',
      compareCloseEvidence: 'Revenir aux pièces',
      compareCloseDecision: 'Revenir à la décision',
      compareEmpty: 'Citez au moins deux pièces avant de les comparer.'
    },
    caseNorm: {
      button: 'NORME DU DOSSIER',
      supportNote:
        'Norme utile pour vous orienter dans le dossier. La consulter ne modifie ni le rapport ni la décision.',
      relevantLabel: 'Norme pertinente',
      referenceLabel: 'Référence',
      inShortLabel: 'En bref',
      whyLabel: 'Pourquoi elle compte dans ce dossier',
      whyFallback:
        "Cette norme aide à évaluer le dossier, mais la décision finale dépend des éléments observés dans le dossier lui-même.",
      continuityNote:
        'Servez-vous de la norme pour orienter le raisonnement, puis revenez à la décision et pesez les éléments du dossier.',
      close: 'Revenir à la décision'
    },
    // Libellés des concepts AI Act (taxonomie structurelle dans data/concepts.ts)
    concepts: {
      risk_based_approach: 'approche fondée sur le risque',
      prohibited_practices: 'pratiques interdites',
      high_risk: "systèmes d'IA à haut risque",
      transparency: 'transparence',
      gpai: "IA à usage général (GPAI)",
      human_oversight: 'contrôle humain',
      data_governance: 'gouvernance des données',
      privacy_by_design: 'protection des données dès la conception',
      ai_literacy: "maîtrise de l'IA"
    },
    // Rapport d'apprentissage final (v1.1) : local, jamais envoyé ailleurs.
    learningReport: {
      header: 'CE QUE VOUS RETIREZ DE CETTE ENQUÊTE',
      title: "Rapport d'apprentissage",
      intro:
        "Un récapitulatif pédagogique de vos décisions, pour voir où vous êtes solide et ce qu'il faut relire. Il reste sur votre appareil : il n'est envoyé nulle part.",
      scoreLabel: 'Issues des dossiers',
      scoreLine:
        '{correct} correctes · {partial} partielles · {wrong} à revoir — {completed} dossiers terminés sur {total}',
      conceptsLabel: 'Concepts AI Act rencontrés',
      strongestLabel: 'Domaine le plus solide',
      reviewLabel: 'Domaine à réviser',
      allSolid:
        'Aucun en particulier : les décisions tiennent. Vous pouvez monter la difficulté ou changer de parcours.',
      noneYet: 'Aucun dossier terminé dans cette partie.',
      recommendedLabel: 'Trois lectures conseillées sur le site (gratuites, dans un nouvel onglet)',
      linkFor: 'Approfondir : {concept} ▸',
      // libellés parallèles à FALLBACK_LINKS de la langue (même ordre)
      generalLinkLabels: ['Ressources éducatives ▸', "Guide de l'AI Act ▸", 'Glossaire ▸'],
      performance: { strong: 'solide', mixed: 'à consolider', weak: 'à revoir' },
      disclaimer:
        "NO AI ACT est une simulation pédagogique et simplifie le règlement (UE) 2024/1689, tel que modifié par le règlement (UE) 2026/1744 : ce rapport décrit votre parcours dans le jeu, pas une compétence certifiée ni un conseil juridique.",
      back: 'REVENIR AU RAPPORT FINAL'
    },
    // Guide enseignant en jeu (v1.1) : structure avant/pendant/après + ressources.
    teacherGuide: {
      button: 'GUIDE ENSEIGNANT ▸',
      title: 'Utiliser NO AI ACT en classe',
      intro:
        "Structure conseillée en trois temps. Aucun compte, aucune donnée d'élève : tout reste local.",
      beforeTitle: 'Avant le cours',
      beforeText:
        "Jouez un dossier seul, choisissez le parcours (démo, atelier ou complet) et fixez 2 ou 3 objectifs. Les activités prêtes et la leçon d'introduction ci-dessous donnent le cadre sur l'AI Act avant de jouer.",
      duringTitle: 'Pendant',
      duringText:
        'Projetez le jeu ou faites jouer par deux. Avec le mode enseignant actif, une pause de discussion apparaît après chaque dossier, avec les questions pour la classe : comparez les décisions avant de poursuivre.',
      afterTitle: 'Après',
      afterText:
        "Ouvrez le débriefing enseignant depuis le rapport final : récapitulatif des décisions, concepts rencontrés et questions. Exportez-le en texte ou en JSON et servez-vous-en pour la réflexion écrite ou l'évaluation formative.",
      resourcesLabel: 'Ressources liées (elles s\'ouvrent dans un nouvel onglet)',
      links: {
        activities_it: 'Activités pédagogiques (IT)',
        lesson_it: "Leçon d'introduction (IT)",
        activities_en: 'Classroom activities (EN)',
        lesson_en: 'Lesson plan (EN)'
      },
      close: 'Fermer'
    },
    // Liens jeu→site (v1.2) : pages internes, le jeu reste ouvert.
    siteLinks: {
      button: 'SITE ET RESSOURCES ▸',
      title: 'Site et ressources éducatives',
      intro:
        "Les sections du site, par intention. Elles s'ouvrent dans un nouvel onglet : le jeu reste ouvert et rien n'est enregistré. Vous êtes toujours libre de quitter le jeu.",
      play: 'Comment fonctionne le jeu',
      hub: 'Ressources éducatives',
      teacher: 'Ressources pour enseignants',
      guide: 'Guide AI Act',
      glossary: 'Glossaire',
      privacy: 'Confidentialité',
      backToSite: 'Revenir au site',
      close: 'Fermer'
    },
    // Pause de discussion après chaque dossier (mode enseignant seulement, v1.1).
    discussionPause: {
      button: 'PAUSE DE DISCUSSION ▸',
      title: 'Pause de discussion',
      intro:
        "Questions pour la classe sur ce dossier. Rien n'est enregistré : ce sont des pistes pour en parler avant le dossier suivant.",
      close: 'Reprendre'
    },
    decisionDebrief: {
      button: 'DÉBRIEFING DE LA DÉCISION',
      title: 'Débriefing de la décision',
      intro:
        'Cette fiche vous aide à comprendre le raisonnement, sans modifier le score ni le rapport.',
      yourChoiceLabel: 'Votre choix',
      whyLabel: "Pourquoi il n'est pas pleinement correct",
      observeLabel: 'Élément à observer',
      normLabel: 'Norme liée',
      howToLabel: 'Comment raisonner au dossier suivant',
      correctTitle: 'Décision cohérente',
      keyElementLabel: 'Élément clé observé',
      whyCorrect:
        'La décision est cohérente avec les éléments du dossier et avec la norme liée.',
      whyPartialWrong:
        "La décision n'est pas pleinement cohérente avec les éléments du dossier. Revoyez la preuve clé, la norme liée et le pas logique attendu.",
      observeFallback:
        'Relisez les preuves pertinentes du dossier : la décision dépend des indices observés, pas seulement de la catégorie abstraite.',
      howToFallback:
        "Partez du système d'IA concret, identifiez qui en subit l'impact, reliez les preuves à la norme et seulement après choisissez classification, mesure, responsable et motivation.",
      conceptLabel: 'Concept AI Act du dossier',
      takeawayLabel: 'À retenir',
      axes: {
        label: 'Effets de la décision',
        legal: {
          correct: 'validité juridique pleine',
          partial: 'validité juridique partielle',
          wrong: 'décision non valide'
        },
        rights: {
          strengthened: 'droits renforcés',
          mixed: 'droits en équilibre',
          weakened: 'droits affaiblis'
        },
        institution: {
          strengthened: 'confiance publique en hausse',
          mixed: 'confiance publique stable',
          weakened: 'confiance publique en baisse'
        }
      },
      learnMore: 'Approfondir sur le site ▸',
      close: 'Fermer'
    },
    evidence: {
      header: 'DOSSIER {code} — PIÈCES',
      instruction:
        'Examiner toutes les pièces, puis citer celles qui fondent la classification (au moins 2).',
      citeNote:
        "Citer une pièce l'ajoute au rapport, mais ne détermine pas encore la classification finale du risque.",
      exhibit: 'PIÈCE {num}',
      sealed: '[ SCELLÉE ]\n\ncliquer pour examiner',
      cite: 'CITER DANS LE RAPPORT ▢',
      cited: 'CITÉE DANS LE RAPPORT ▣',
      allRevealedToast: 'Pièces examinées. Citer au moins 2 pièces pour continuer.',
      contradictionButton: 'Signaler une contradiction [C]',
      contradictionFound: 'Contradiction documentaire : « {a} » contredit « {b} ».',
      contradictionNone:
        'Aucune contradiction documentaire entre les pièces citées : citez la pièce décisive et le compte rendu qui minimise.',
      progress:
        'Pièces examinées : {opened} sur {total} · citées : {cited} (il en faut au moins {min})',
      progressReady: "Vous avez assez d'éléments : vous pouvez passer à la classification.",
      citedBecause: '« {title} » citée — {stance}.',
      proceedButton: 'PASSER À LA CLASSIFICATION ▸',
      backToEvidence: '◂ PIÈCES',
      sourceLabel: 'SOURCE',
      sources: {
        amministrativa: 'source administrative',
        tecnica: 'source technique',
        vendor: 'déclaration du fournisseur',
        reclamo: 'réclamation du citoyen',
        pubblica: 'communication publique',
        log: 'journal système',
        interna: 'note interne'
      },
      stances: {
        supports_risk: 'montre le risque',
        minimizes_risk: 'minimise',
        ambiguous: 'ambigu',
        contextual: 'contexte',
        concrete_effect: 'effet concret',
        decisive: 'preuve décisive'
      }
    },
    decision: {
      stepBack: '◂ ÉTAPE PRÉCÉDENTE',
      stepBackHint: "RETOUR ARRIÈRE revient à l'étape précédente et la rend de nouveau modifiable.",
      step1: 'DÉCISION 1 SUR 5 — CLASSIFICATION',
      step2: 'DÉCISION 2 SUR 5 — MESURE CORRECTIVE',
      step3: 'DÉCISION 3 SUR 5 — RESPONSABLE',
      step4: 'DÉCISION 4 SUR 5 — MOTIVATION',
      step5: 'DÉCISION 5 SUR 5 — RÉCAPITULATIF ET SIGNATURE',
      question5: 'Revoyez le rapport avant de le signer.',
      cityState: 'ÉTAT DE LA VILLE',
      cityStateNote: "Tel qu'il est maintenant. Le jeu n'anticipe pas ce que ferait chaque choix.",
      sidebar: {
        cited: 'PIÈCES CITÉES',
        soFar: 'DÉCISION À CE STADE',
        pending: 'à choisir'
      },
      summary: {
        classification: 'Classification',
        measure: 'Mesure',
        subject: 'Responsable',
        motivation: 'Motivation',
        clues: 'Pièces citées'
      },
      sign: 'SIGNER LE RAPPORT ▸',
      signHint: 'ENTRÉE signe le rapport. RETOUR ARRIÈRE revient à la motivation.',
      signNote:
        "Signer ne veut pas dire avoir bien répondu : l'évaluation vient après. Tant que vous n'avez pas signé, vous pouvez encore changer chaque choix.",
      question1: "Comment ce système se qualifie-t-il au regard de l'AI Act ?",
      question2: "Quelle mesure l'inspection prescrit-elle ?",
      question3: 'À qui imputez-vous les obligations principales ?',
      question4: 'Sur quelle motivation fondez-vous le rapport ?',
      contextNote:
        "Dans le règlement, le risque ne dépend pas seulement de la technologie, mais du contexte d'usage, de la destination et des effets sur les personnes.",
      processNote:
        'Décision finale : classez le risque, puis choisissez la mesure, le responsable et la motivation.',
      recorded: 'Classification enregistrée : {value}',
      keys5: 'clavier : touches 1 à 5 pour sélectionner',
      keys7: 'clavier : touches 1 à 7 pour sélectionner',
      keys3: 'clavier : touches 1 à 3 pour sélectionner',
      normsButton: 'CONSULTER LES NORMES',
      normsHint: 'consultation seule — clic à l\'extérieur ou ÉCHAP pour fermer',
      normsEmpty: 'Aucune norme encore acquise.',
      termsButton: "QU'EST-CE QUE CELA VEUT DIRE ?",
      termsTitle: 'LES TERMES DE CE CHOIX',
      termsHint:
        "consultation seule — clic à l'extérieur ou ÉCHAP pour fermer. Ne suggère pas la réponse.",
      termsNoEntry:
        "Ce n'est pas une catégorie définie par le règlement : c'est ce qui reste en dehors des autres."
    },
    subjects: {
      provider: 'Fournisseur (celui qui développe le système)',
      deployer: 'Déployeur (celui qui l\'utilise)',
      autorita: 'Autorité publique utilisatrice',
      responsabile_umano: 'Responsable humain désigné',
      fornitore_esterno: 'Prestataire externe'
    },
    report: {
      title: "RAPPORT D'INSPECTION",
      evidenceLabel: 'PREUVES CITÉES',
      decisionLabel: 'DÉCISION',
      subjectLabel: 'RESPONSABLE',
      motivationLabel: 'MOTIVATION',
      incidentLabel: 'ÉVÉNEMENT ENREGISTRÉ',
      dominantLabel: 'OBSERVATION PRINCIPALE',
      secondaryLabel: 'OBSERVATIONS SECONDAIRES',
      continueButton: 'POURSUIVRE ▸',
      noEvidence: 'aucune preuve citée',
      decisiveEvidenceLabel: 'PREUVES DÉCISIVES',
      decisiveEvidenceOk: 'les pièces citées soutiennent la classification',
      decisiveEvidenceWeak: 'les pièces citées ne suffisent pas à soutenir la classification',
      reasonLabel: 'Issue parce que',
      reasons: {
        grounded: 'les preuves citées soutiennent la classification et la mesure est proportionnée',
        classificazione: 'le système a été classé dans un régime erroné',
        prove: "l'acte est contestable parce que le fondement probatoire est incomplet",
        misura_insufficiente: 'la mesure proposée ne maîtrise pas le risque principal',
        eccesso_cautela:
          'la classification est correcte, mais tout éteindre excède la mesure nécessaire',
        soggetto: 'la classification est correcte, mais le responsable désigné est erroné',
        trasparenza:
          'la transparence requise manque : les citoyens ne peuvent reconnaître ni le système ni le contenu',
        motivazione: 'la décision est correcte, mais la motivation est faible'
      },
      /**
       * En-tête de l'acte. Un rapport d'inspection sans service émetteur, code
       * de dossier et numéro d'enregistrement est une feuille de notes : ce
       * sont ces métadonnées qui en font un acte, et c'est la seule chose que
       * le joueur reconnaît comme « officielle » sans avoir à l'apprendre.
       * L'autorité n'est PAS répétée ici : elle se lit dans briefing.header,
       * où elle vit déjà.
       */
      registry: {
        officeLabel: 'SERVICE ÉMETTEUR',
        fileLabel: 'CODE DE DOSSIER',
        protocolLabel: 'ENREGISTREMENT',
        dateLabel: 'DATE DE RÉDACTION',
        statusLabel: 'CLASSEMENT',
        status: 'ACTE DÉFINITIF · NON CLASSIFIÉ',
        /** État de l'acte pendant qu'on est encore en train de l'écrire. */
        draftStatus: 'BROUILLON · NON ENREGISTRÉ',
        /** Légende de la bande : dit qu'elle n'est pas un ornement. */
        stripNote: "bande d'enregistrement : le numéro sous forme de barres"
      },
      lessonLabel: 'LEÇON DU DOSSIER',
      analysisLabel: 'ANALYSE DE LA DÉCISION',
      analysis: {
        conforme:
          'La décision tient : classification, mesure, responsable et motivation sont cohérents avec les preuves décisives.',
        parziale: 'La décision saisit le cœur du problème, mais reste incomplète —',
        contestabile: 'La décision est contestable —',
        non_conforme: 'La décision ne tient pas —'
      },
      issues: {
        wrong_classification: "la classification ne saisit pas le contexte d'usage du système.",
        insufficient_measure: 'la mesure proposée réduit le risque, mais ne le maîtrise pas.',
        excessive_measure:
          "la classification est correcte, mais la mesure excède ce qui est nécessaire.",
        wrong_responsible_subject: 'la responsabilité est attribuée à la mauvaise personne.',
        weak_motivation: "la motivation n'est pas soutenue par les preuves citées.",
        weak_evidence: 'les preuves citées ne suffisent pas à soutenir la classification.',
        formal_human_oversight: 'le contrôle humain reste formel, non effectif.',
        missing_transparency: 'il manque la transparence qui rendrait le système reconnaissable.',
        context_misread: "le contexte d'usage du système a été mal lu.",
        proportionality_problem: "la mesure n'est pas proportionnée au risque réel."
      }
    },
    /**
     * NOMS DES ÉTATS VISUELS. Les quatre issues ne sont PAS ici : elles vivent
     * dans `outcomes` et le langage des états les y lit, parce que le même mot
     * écrit à deux endroits devient deux mots différents à la première
     * révision.
     */
    states: {
      sigillato: 'SCELLÉE',
      aperto: 'OUVERTE',
      citato: 'CITÉE',
      prova_decisiva: 'PREUVE DÉCISIVE',
      contraddizione: 'CONTRADICTION',
      procedibile: 'RECEVABLE'
    },
    /** Catégories normatives : le nom de l'identité, pas du niveau. */
    normIdentities: {
      vietata: 'PRATIQUE INTERDITE',
      alto: 'HAUT RISQUE',
      trasparenza: 'TRANSPARENCE',
      biometria: 'AUTORISÉE SOUS CONDITIONS',
      gpai: 'MODÈLE GPAI'
    },
    outcomes: {
      conforme: 'CONFORME',
      parziale: 'PARTIELLEMENT CONFORME',
      contestabile: 'CONTESTABLE',
      non_conforme: 'NON CONFORME'
    },
    errors: {
      classificazione:
        'La classification ne correspond pas au régime prévu par le règlement.',
      prove: "Les preuves citées ne fondent pas la classification : l'acte est attaquable.",
      misura_insufficiente: 'La mesure touche le symptôme : le système continue de décider.',
      eccesso_cautela:
        "Vous avez éteint ce qu'il fallait maîtriser. Le service s'arrête, le problème se déplace.",
      soggetto:
        "Obligations imputées à qui ne pouvait pas les remplir : personne ne répond.",
      trasparenza:
        "Mesures actives, citoyens dans l'ignorance : la confiance ne se reconstruit pas dans le noir.",
      motivazione: 'La motivation ne tient pas : la décision est juste, son fondement non.'
    },
    cityDossier: {
      title: 'DOSSIER VILLE',
      subtitle: 'Effets systémiques des décisions. Pas un score : des tendances.',
      updatedLabel: 'Dossier ville mis à jour',
      emptyHint: 'Aucun dossier encore clos : le dossier ville reste stable.',
      openButton: 'DOSSIER VILLE ▸',
      indicators: {
        publicTrust: 'Confiance publique',
        fundamentalRights: 'Droits fondamentaux',
        administrativeOpacity: 'Opacité administrative',
        litigationRisk: 'Risque de contentieux',
        serviceEfficiency: 'Efficacité des services'
      },
      trends: {
        improving: 's\'améliore',
        worsening: 'se dégrade',
        stable: 'stable',
        watch: 'sous observation'
      }
    },
    incident: {
      header: 'TÉLEX URGENT — RÉPONSE REQUISE',
      hint: 'clavier : touches 1 à 3 pour répondre',
      logged: 'Réponse enregistrée : {value}'
    },
    consequence: {
      qualityCorrect: 'DÉCISION CONFORME',
      qualityPartial: 'DÉCISION PARTIELLE',
      qualityWrong: 'DÉCISION NON CONFORME',
      summary: 'Classification : {classification} · Mesure : {measure}',
      territoryLabel: 'EFFET SUR LE TERRITOIRE',
      noteLabel: "NOTE D'ENQUÊTE",
      cityLabel: 'ÉTAT DE LA VILLE',
      cluesMismatch:
        "Les pièces citées dans le rapport ne soutenaient pas la classification : l'acte est attaquable.",
      nextCorrect: 'NORME ACQUISE ▸',
      nextWrong: 'CONSULTER QUAND MÊME LA NORME ▸'
    },
    normCard: {
      democraticFunctionLabel: 'FONCTION DÉMOCRATIQUE',
      unlocked: 'NORME VERSÉE AUX ARCHIVES',
      subCorrect: 'Cette disposition aurait rendu le dommage évitable ou maîtrisable.',
      subWrong: "La norme existait. Dans une autre Europe, quelqu'un l'aurait appliquée.",
      backToMap: '◂ REVENIR À LA CARTE',
      endOfShift: 'FIN DE SERVICE ▸',
      nextCase: 'DOSSIER SUIVANT ▸',
      disclaimer: 'version pédagogique simplifiée'
    },
    archive: {
      title: 'ARCHIVES NORMATIVES — AI ACT',
      subtitle: 'Dispositions acquises : {done}/{total} · version pédagogique simplifiée',
      locked: 'NORME PAS ENCORE\nACQUISE',
      hint: 'clic en dehors de la fiche pour fermer (ou ÉCHAP)',
      searchIdle: 'Chercher dans les archives : tapez un mot-clé (ÉCHAP pour sortir)',
      searchResults: '« {query} » — normes trouvées : {n} · glossaire : {g} · dossiers : {c}',
      searchNone: 'Aucun résultat pour « {query} » (RETOUR ARRIÈRE pour corriger)',
      back: '◂ RETOUR'
    },
    finale: {
      header: "RAPPORT DÉFINITIF DE L'INSPECTION",
      cityLabel: 'ÉTAT FINAL DE LA VILLE',
      newGame: 'NOUVELLE PARTIE',
      archive: 'ARCHIVES NORMATIVES',
      credits: 'CRÉDITS',
      debrief: 'DÉBRIEFING ENSEIGNANT ▸',
      learningReport: "RAPPORT D'APPRENTISSAGE ▸",
      privacyNote: {
        title: 'Confidentialité : tout reste dans votre navigateur',
        text: "Cette version n'intègre aucun module externe et ne collecte ni retours ni données : réponses, rapports et progression ne quittent jamais votre appareil."
      }
    },
    debrief: {
      title: 'DÉBRIEFING ENSEIGNANT — RAPPORT LOCAL',
      subtitle:
        "Appui local pour le débriefing. Ne crée aucune classe, n'enregistre aucun élève, n'envoie aucun résultat à un serveur.",
      casesLabel: 'DOSSIERS ET RAPPORTS',
      caseLine: '{title} — issue : {outcome}',
      mainErrorLine: 'observation : {error}',
      noError: 'aucune observation',
      anatomyLabel: 'Anatomie du dossier',
      anatomySignal: 'signal décisif',
      anatomyTrap: 'piège minimisant',
      anatomyTrapNone: 'aucune pièce minimisante dans ce dossier',
      normsLine: 'Normes acquises : {done}/{total}',
      timeLine: 'Temps de réalisation : {minutes} min',
      timeUnknown: 'Temps de réalisation : non disponible',
      indicatorsLabel: 'INDICATEURS FINAUX',
      conceptsLabel: 'CONCEPTS AI ACT RENCONTRÉS',
      questionsLabel: 'QUESTIONS POUR LA DISCUSSION',
      reviewLabel: 'SUGGESTION DE RÉVISION',
      reviewLine: 'Revoir les fiches des dossiers dont l\'issue est non conforme ou contestable.',
      downloadJson: 'TÉLÉCHARGER .JSON',
      downloadTxt: 'TÉLÉCHARGER .TXT',
      print: 'IMPRIMER',
      back: '◂ REVENIR AU RAPPORT',
      notCompleted: 'dossier non terminé',
      missionLine: 'Mission : {mission}',
      difficultyLine: 'Difficulté : {difficulty}',
      privacyNote:
        "Les données affichées restent sur cet appareil. L'export éventuel est local et ne contient ni noms, ni adresses électroniques, ni classe, ni établissement.",
      recommendedHeader: 'PARCOURS CONSEILLÉS',
      recommendedLine: '{name} · {duration} · {goal}'
    },
      sessionEnd: {
        title: 'FIN DE SERVICE',
        subtitle: '{mode} · {count} dossiers · environ {minutes} min',
        subtitleOne: '{mode} · un dossier · environ {minutes} min',
        countCorrectOne: 'un bien clos',
        countCorrect: '{n} bien clos',
        countPartialOne: 'un à moitié',
        countPartial: '{n} à moitié',
        countWrongOne: 'un manqué',
        countWrong: '{n} manqués',
        recurring: 'Le même faux pas {times} fois. {error}',
        noRecurring: "Aucune erreur ne s'est répétée pendant ce service.",
        normsTouched: 'Articles abordés : {norms}',
        incompleteOne: 'Un dossier du plan est resté ouvert. Il reste sur la carte.',
        incomplete: '{count} dossiers du plan sont restés ouverts. Ils restent sur la carte.',
        quality: { correct: 'bien clos', partial: 'à moitié', wrong: 'manqué' },
        open: 'ouvert',
        toMap: 'REVENIR À LA CARTE',
        learningReport: "RAPPORT D'APPRENTISSAGE ▸",
        debrief: 'DÉBRIEFING ENSEIGNANT ▸',
        note:
          "Récapitulatif du service qui vient d'être joué. Il reste sur votre appareil : aucun envoi, aucun compte."
      },
      newGamePanel: {
        title: 'NOUVELLE PARTIE',
        subtitle:
          'Choisissez comment jouer et de combien de temps vous disposez. Le plan se recompose en dessous, avant de commencer.',
        modeLabel: 'MODE : {value}',
        audienceLabel: 'PROFIL : {value}',
        durationLabel: 'DURÉE : {value} min',
        planLine: '{count} dossiers · environ {minutes} min · difficulté {difficulty}',
        planLineOne: 'un dossier · environ {minutes} min · difficulté {difficulty}',
        planLineFree: 'carte ouverte · {count} dossiers conseillés · environ {minutes} min',
        planLineFreeOne: 'carte ouverte · un dossier conseillé · environ {minutes} min',
        overBudget: 'Le premier dossier demande environ {minutes} min : plus que le temps choisi.',
        nothingToReview:
          "Rien à réviser : aucun dossier mal clos pour l'instant. Choisissez un autre mode pour commencer.",
        note:
          'Le temps est une estimation servant à composer la séance. Le jeu ne mesure ni ne limite votre temps réel.',
        reroll: 'RETIRER AU SORT ⟲',
        start: 'COMMENCER ▸',
        modes: {
          turno: {
            name: 'Tour de service',
            desc: "Les dossiers de votre profil, en séquence. La voie classique : un bureau, une file d'attente de dossiers."
          },
          libera: {
            name: 'Enquête libre',
            desc: "La ville est ouverte : ouvrez les dossiers dans l'ordre que vous voulez. La durée indique seulement combien il est raisonnable d'en clore."
          },
          sorpresa: {
            name: 'Inspection surprise',
            desc: 'Dossiers tirés au hasard parmi tous, difficulté expert, aucune indication sur la carte.'
          },
          ripasso: {
            name: 'Révision des erreurs',
            desc: "Seulement les dossiers que vous avez mal clos ou laissés à moitié. Disponible dès qu'il y en a au moins un."
          }
        }
      },
      audience: {
        // Il ne reste que les noms et descriptions des profils : le panneau qui
        // les affichait (« pour qui vous jouez ») a été fondu dans NOUVELLE
        // PARTIE, et ses libellés vivent sous newGamePanel.
        modes: {
          casual: {
            name: 'Pour moi-même',
            desc: "Vous ne travaillez pas dans le secteur et voulez comprendre l'AI Act. Dossiers choisis pour leur clarté, pas pour un rôle."
          },
          pa: {
            name: 'Administration publique',
            desc: "Guichet, marchés publics et lutte antifraude : décider avec un système que vous n'avez pas écrit."
          },
          scuola: {
            name: 'École et formation',
            desc: 'Émotions en classe, plateformes adaptatives et modèles à usage général.'
          },
          hr: {
            name: 'Ressources humaines',
            desc: 'Recrutement, classements et modèles à usage général utilisés en aval.'
          }
        }
      },
    missions: {
      title: 'CHOISISSEZ LE PARCOURS',
      subtitle:
        'Un parcours suggère les dossiers conseillés. Vous pouvez de toute façon tous les jouer.',
      recommendedTag: 'CONSEILLÉ',
      durationLabel: 'durée',
      start: 'LANCER LE PARCOURS ▸',
      modes: {
        demo: {
          name: 'Démo rapide',
          duration: '10–15 min',
          goal: "Comprendre la logique du rapport d'inspection."
        },
        lab: {
          name: 'Atelier court',
          duration: '25–35 min',
          goal: 'Distinguer pratique interdite, haut risque et transparence.'
        },
        full: {
          name: 'Parcours complet',
          duration: '45–60 min',
          goal: 'Audit, responsabilité, mesures et motivation.'
        },
        advanced: {
          name: 'Parcours avancé',
          duration: '60–75 min',
          goal: 'Dossiers ambigus et frontières normatives (inclut le crédit civique).'
        },
        pack: {
          name: 'Dossiers avancés',
          duration: '75–90 min',
          goal: 'Dossiers plus ambigus : agent conversationnel public, marchés publics, EdTech et GPAI.'
        }
      }
    },
    difficulty: {
      title: 'NIVEAU DE DIFFICULTÉ',
      label: 'DIFFICULTÉ : {value}',
      modes: {
        base: {
          name: 'Base',
          desc: 'Instructions explicites, indications après une erreur, évaluation plus indulgente.'
        },
        standard: {
          name: 'Standard',
          desc: 'Rapport complet, retour équilibré. Conseillée pour la démo.'
        },
        expert: {
          name: 'Expert',
          desc: 'Peu d\'indications, retour sec, sévérité sur le responsable et la motivation.'
        }
      },
      hintLabel: 'À RECONSIDÉRER',
      hints: {
        classificazione: "Revoyez la classification : comparez destination et contexte d'usage.",
        prove: 'Revoyez les pièces citées : soutiennent-elles vraiment la classification ?',
        misura_insufficiente: 'La mesure est-elle proportionnée au risque principal ?',
        eccesso_cautela:
          'Il n\'est peut-être pas nécessaire de bloquer : le système peut demander une gouvernance.',
        soggetto: "Vérifiez le responsable : qui porte l'obligation principale ?",
        trasparenza:
          'Attention à la transparence : les citoyens peuvent-ils reconnaître le système ?',
        motivazione: 'La motivation tient-elle au regard des pièces citées ?'
      }
    },
    mobileGuard: {
      message:
        'NO AI ACT est optimisé pour un ordinateur ou une tablette en mode paysage. Tournez votre appareil ou utilisez un ordinateur pour une meilleure expérience.'
    },
    creditsScene: {
      title: 'CRÉDITS',
      heading: 'NO AI ACT',
      roleLabel: 'Conception et direction scientifique',
      author: 'Matteo Angeloni',
      affiliation: 'PhD Student — Università degli Studi della Tuscia',
      note:
        "FAIT AVEC L'IA, NON PAR L'IA — déclaration volontaire : développé avec\n" +
        "des assistants d'IA, sous la responsabilité éditoriale et scientifique d'une personne.\n" +
        'Ressources graphiques et audio procédurales. Licences complètes dans les fichiers du projet.',
      phdProgramme: 'Società in mutamento: politiche, diritti e sicurezza',
      phdLink: 'Page du doctorat ▸',
      universityLink: 'Università degli Studi della Tuscia ▸',
      independence: "Projet indépendant : il n'engage pas officiellement l'université.",
      back: '◂ REVENIR AU TITRE'
    },
    toastPrefixes: {
      info: 'AVIS',
      warning: 'ATTENTION',
      alert: 'ALERTE',
      ok: 'ENREGISTRÉ'
    },
    levels: {
      vietata: 'Pratique interdite',
      alto: 'Haut risque',
      trasparenza: 'Transparence',
      restrittivo: 'Conditions restrictives'
    }
  },

  briefing: {
    header: 'INSPECTION DES INCIDENTS ALGORITHMIQUES',
    sub: 'BRIEFING CONFIDENTIEL — DOSSIER AX/2032',
    body:
      "Année 2032. Dans cette ville, l'AI Act n'est jamais entré en vigueur.\n\n" +
      "La ville fonctionne. Les files d'attente n'existent pas, les formulaires se " +
      'remplissent tout seuls, les décisions arrivent avant même les demandes.\n\n' +
      'Personne ne sait plus qui décide. Personne ne sait plus comment contester. ' +
      "Les incidents algorithmiques s'accumulent dans les archives comme des dossiers en souffrance.\n\n" +
      "Vous êtes l'Inspecteur. Votre mandat : enquêter sur les incidents, classer les " +
      'systèmes, imposer les mesures. Pour chaque dossier clos, les archives vous rendront ' +
      "la norme qui — ailleurs, dans une autre Europe — aurait empêché tout cela.\n\n" +
      "La ville vous attend. Essayez de ne pas vous habituer à son efficacité.",
    how:
      "Comment on joue : ouvrez les pièces, citez les preuves, classez le risque et déposez le rapport. Après chaque décision, un débriefing explique le raisonnement. Rien ne quitte votre navigateur : c'est une simulation pédagogique, pas un conseil juridique.",
    ctaFirstCase: 'OUVRIR LE PREMIER DOSSIER',
    cta: 'ACCÉDER À LA CARTE CIVIQUE'
  },

  classifications: {
    vietata: 'Pratique interdite',
    alto_rischio: "Système d'IA à haut risque",
    trasparenza: 'Obligation de transparence',
    basso_rischio: 'Risque faible',
    non_rilevante: "Hors du champ de l'AI Act"
  },

  measures: {
    blocco: 'Bloquer le système',
    oversight: 'Instaurer un contrôle humain',
    audit: 'Activer audit et gestion des risques',
    informare: 'Informer les personnes concernées',
    etichettare: "Marquer les contenus générés par l'IA",
    dati_logging: 'Améliorer la qualité des données et les journaux',
    nessuna: 'Aucune mesure'
  },

  indicators: {
    labels: {
      efficienza: 'EFFICACITÉ',
      controllo: 'CONTRÔLE SOCIAL',
      diritti: 'DROITS FONDAMENTAUX',
      fiducia: 'CONFIANCE PUBLIQUE'
    },
    comments: {
      correct: [
        'La décision est contestable. Donc elle est légitime.',
        'Quelques procédures ralentissent. Quelques personnes respirent.',
        'Le système doit maintenant se justifier. C\'est un début.'
      ],
      partial: [
        'Une rustine administrative. Le problème reste sous la surface.',
        'Mieux que rien. Mais « mieux que rien » n\'est pas de la gouvernance.',
        'La mesure atténue le symptôme, pas la cause.'
      ],
      wrong: [
        'Les tableaux de bord s\'améliorent. Les personnes non.',
        'Efficacité record. Personne ne sait plus qui décide.',
        'Le système vous remercie. Les citoyens ne peuvent pas.'
      ]
    }
  },

  locations: {
    commissariato: 'Commissariat de quartier',
    sussidi: 'Bureau des aides sociales',
    osservatorio: "Observatoire de l'emploi",
    municipio: 'Hôtel de ville',
    lavoro: "Agence pour l'emploi",
    media: 'Centre municipal des médias',
    scuola: 'École des Émotions',
    ospedale: 'Hôpital Prédictif',
    sorveglianza: 'Centre de surveillance urbaine',
    welfare: 'Bureau de l\'aide sociale et des services',
    sportello: 'Guichet civique',
    appalti: 'Bureau des marchés publics',
    campus: 'Campus Adaptatif',
    modelli: 'Centre des Modèles'
  },

  cases: {
    case_predpol: {
      title: 'Le quartier marqué',
      scenario:
        "La police municipale adopte un système qui attribue à chaque résident un « score de propension à la délinquance » : adresse, relations, antécédents familiaux, contacts avec les services sociaux. Chaque matin, les patrouilles reçoivent la liste des noms en tête de classement. Dans le quartier ouest, les contrôles ont triplé ; personne ne sait qu'il est sur la liste, ni pourquoi.",
      clues: [
        {
          title: 'Journal de génération',
          text:
            "Le registre technique montre que les scores découlent exclusivement de catégories de profilage : zone de résidence, réseau de relations, histoire familiale. Aucun fait concret lié à une infraction."
        },
        {
          title: 'Ordre de service',
          text:
            "Une circulaire interne : « les contrôles prioritaires suivent la liste générée par le système ; l'évaluation individuelle des personnes désignées n'est pas requise ». Les interpellations partent du classement."
        },
        {
          title: 'Étude du fournisseur',
          text:
            "Le fournisseur présente une étude : « 92 % des personnes signalées à haut risque ont eu au moins un contact avec les forces de l'ordre dans les 5 années suivantes ». Il qualifie le système d'« appui scientifique à la décision humaine »."
        }
      ],
      clueSources: ['log', 'interna', 'vendor'],
      noteCorrect:
        "Prévoir la propension d'une personne à commettre une infraction sur la seule base du profilage est une pratique interdite : le blocage est la seule mesure cohérente.",
      notePartial:
        "Vous avez saisi le problème, mais traiter une pratique interdite comme une question de gouvernance laisse le quartier sous une surveillance qu'aucun audit ne peut régulariser.",
      noteWrong:
        "Le rapport ne tient pas : la pratique relève de l'interdiction de l'article 5 et aucune mesure organisationnelle ne la rend licite.",
      consequenceCorrect:
        'Le système est arrêté. Les contrôles repartent de faits, non de classements : dans le quartier ouest, la confiance envers les institutions commence à se recoudre.',
      consequenceWrong:
        "La liste continue de décider qui est interpellé. Celui qui y naît n'en sort pas : le quartier apprend que l'adresse pèse plus que les comportements.",
      motivations: [
        "Le système est imprécis et doit être suspendu jusqu'à ce que le fournisseur démontre une exactitude adéquate sur le terrain.",
        "Prévoir le risque d'infraction d'une personne sur la seule base du profilage est une pratique interdite : l'exactitude ne rend pas licite ce que le règlement exclut.",
        'La police peut utiliser tout outil d\'appui : la décision finale reste de toute façon à un agent humain.'
      ],
      debriefQuestions: [
        "Pourquoi le règlement interdit-il la prévision individuelle d'infraction fondée sur le profilage, au lieu de l'encadrer comme un haut risque ?",
        "L'étude du fournisseur sur les 92 % est-elle une preuve pour ou contre le système ? Que ne dit-elle pas ?",
        "Qu'est-ce qui distinguerait un système licite d'appui aux enquêtes de celui de ce dossier ?"
      ],
      epilogue:
        "Le commandement démantèle le classement et publie les critères des contrôles. Certains agents protestent : « ça marchait ». Le point, explique l'inspection, n'est pas de savoir si ça marchait : c'est ce que cela faisait marcher."
    },
    case_bias: {
      title: 'Le préjugé corrigé',
      scenario:
        "L'agence régionale pour l'emploi filtre les candidatures avec un système automatique. Le fournisseur annonce avoir détecté et corrigé un biais qui défavorisait les candidats d'origine étrangère : pour le trouver, il a dû traiter précisément les données qui le révélaient — origine ethnique et état de santé. L'article 4 bis de l'AI Act le permet à titre exceptionnel, à six conditions. Toutes ensemble.",
      clues: [
        {
          title: 'Registre des traitements',
          text:
            "Le registre consigne le traitement des catégories particulières, mais ne dit ni pourquoi ces données étaient strictement nécessaires, ni pourquoi d'autres — synthétiques ou anonymisées — ne suffisaient pas. Les deux motifs que l'article 4 bis exige par écrit n'y sont pas."
        },
        {
          title: "Contrat avec l'analyste externe",
          text:
            "L'analyse a été confiée à un cabinet de conseil, et l'échantillon contenant origine ethnique et données de santé lui a été transmis en clair. L'article 4 bis interdit que ces données soient transmises ou rendues accessibles à d'autres : ici, les deux se sont produits."
        },
        {
          title: 'Rapport sur la correction',
          text:
            "Le biais existait et il a disparu : l'écart entre les taux de rejet des groupes est passé de quatorze points à deux, et la mesure résiste à un recalcul indépendant. Le travail a été fait, et bien fait."
        }
      ],
      clueSources: ['interna', 'amministrativa', 'tecnica'],
      noteCorrect:
        "Les six conditions de l'article 4 bis sont cumulatives : il suffit que deux manquent pour que le traitement reste sans base juridique. Le système est à haut risque et continue de fonctionner ; c'est la manière dont il a été corrigé qui doit rentrer dans les conditions.",
      notePartial:
        "Vous avez vu le bon domaine, mais pas le point décisif : tant que des données particulières sortent vers un tiers et que le registre reste muet sur la nécessité, compléter la documentation ne régularise rien.",
      noteWrong:
        "Le rapport ne tient pas : l'article 4 bis autorise expressément ce traitement, et son paragraphe 2 précise que personne n'est obligé de chercher les biais. Bloquer revient à punir précisément celui qui les a cherchés.",
      consequenceCorrect:
        "L'échantillon revient dans le périmètre du fournisseur et est effacé une fois la correction faite ; le registre explique pourquoi ces données étaient nécessaires. La correction du biais demeure, avec une base juridique sous elle.",
      consequenceWrong:
        'Le fournisseur retient la mauvaise leçon : la prochaine fois, il ne cherchera pas le biais. L\'écart revient à quatorze points, et cette fois personne ne le mesure.',
      motivations: [
        "L'article 4 bis autorise le traitement de catégories particulières pour détecter les biais, mais à six conditions cumulatives : la transmission à un tiers et le registre sans motivation en font tomber deux. Le traitement est illicite même si la correction a fonctionné.",
        "Le fournisseur a traité l'origine ethnique et les données de santé des candidats : le système doit être bloqué jusqu'au passage à des méthodes qui ne touchent pas aux données sensibles.",
        "Le biais a été corrigé et l'écart s'est refermé : le résultat démontre que le traitement était proportionné, il suffit de compléter le registre."
      ],
      debriefQuestions: [
        "Si les six conditions étaient alternatives au lieu d'être cumulatives, ce fournisseur serait en règle. Pourquoi le législateur les a-t-il voulues toutes ensemble ?",
        "La correction a réellement fonctionné. Dans quels autres domaines acceptons-nous qu'un bon résultat ne régularise pas la manière dont il a été obtenu — et pourquoi devrait-il en aller de même ici ?",
        "L'article 4 bis dit que personne n'est obligé de chercher les biais. Un fournisseur qui ne les cherche pas est plus à l'abri que celui qui les cherche mal : est-ce un effet voulu ou un défaut de la norme ?"
      ],
      epilogue:
        "L'agence conserve le système corrigé et réécrit le contrat du consultant : l'analyse se fait sur les serveurs du fournisseur, les données ne sortent pas. Dans le registre apparaît la phrase qui manquait. Le délégué à la protection des données commente : « le préjugé, c'est vous qui l'aviez trouvé — c'est la seule partie que personne ne vous reprochait »."
    },
    case_frodi: {
      title: "L'algorithme du soupçon",
      scenario:
        "Le bureau des aides sociales introduit un score de « risque de fraude » sur les dossiers de soutien au revenu. Les dossiers signalés sont suspendus automatiquement en attente de vérification ; la vérification humaine, en revanche, n'arrive que si le citoyen formule un recours. Les familles découvrent la suspension au guichet, l'aide déjà interrompue.",
      clues: [
        {
          title: 'Analyse des erreurs',
          text:
            "71 % des dossiers signalés sont clos sans aucune fraude. Les signalements se concentrent sur les familles monoparentales et sur les familles d'origine étrangère : le modèle utilise des variables de substitution qui frappent toujours les mêmes profils."
        },
        {
          title: 'Procédure opérationnelle interne',
          text:
            "La procédure : au signalement, l'aide est suspendue automatiquement ; un agent réexamine le dossier seulement si un recours formel arrive. Le contrôle humain existe, mais après le dommage."
        },
        {
          title: 'Fiche du fournisseur',
          text:
            "Le fournisseur revendique « 12 millions récupérés et des délais de vérification réduits de moitié ». Aucune donnée sur les faux positifs ni sur l'impact des suspensions sur les familles."
        }
      ],
      clueSources: ['tecnica', 'interna', 'vendor'],
      noteCorrect:
        "Un système qui décide de l'accès à des prestations essentielles est à haut risque : il ne peut fonctionner qu'avec un contrôle humain effectif AVANT les effets, un audit et une traçabilité.",
      notePartial:
        'Vous avez identifié le bon domaine, mais sans corriger le point décisif — la suspension automatique avant toute vérification humaine — le système continue de faire des dégâts.',
      noteWrong:
        "Le rapport ne tient pas : le problème documenté n'est pas l'outil en lui-même, mais un usage sans contrôle effectif et avec des impacts disproportionnés.",
      consequenceCorrect:
        "Les suspensions automatiques s'arrêtent : aucune aide n'est plus coupée sans qu'une personne ait regardé le dossier. Les faux positifs s'effondrent.",
      consequenceWrong:
        "Les suspensions continuent d'arriver avant les vérifications. Celui qui dépend de l'aide apprend à craindre une lettre plus qu'une inspection.",
      motivations: [
        "Le système commet trop d'erreurs : il doit être suspendu jusqu'à ce que l'exactitude s'améliore.",
        "Décider de l'accès à des prestations essentielles est à haut risque : il faut un contrôle humain effectif avant les effets, avec audit et traçabilité — pas un réexamen uniquement sur recours.",
        "Le bureau doit pouvoir combattre la fraude : qui n'a rien à cacher n'a rien à craindre d'un contrôle de plus."
      ],
      debriefQuestions: [
        "Pourquoi la vérification humaine « seulement sur recours » n'est-elle pas un contrôle effectif ? Qui paie le coût de l'erreur entre-temps ?",
        "L'analyse des erreurs montre des impacts concentrés sur des profils précis : quand cela ferait-il basculer le dossier vers une pratique interdite, et pas seulement vers le haut risque ?",
        'Ce dossier ressemble au « crédit civique » mais a une solution différente : qu\'est-ce qui change entre les deux ?'
      ],
      epilogue:
        "Le bureau rétablit la vérification préalable et publie les taux d'erreur par profil. La récupération des fraudes baisse à peine ; les recours s'effondrent. Le directeur le reconnaît : « nous mesurions les économies, pas les erreurs »."
    },
    case_scoring: {
      title: 'La ville des scores',
      scenario:
        "La municipalité attribue à chaque citoyen un Indice de Fiabilité Civique. " +
        "Le score décide des priorités d'accès aux services, aux aides, aux classements " +
        'et aux logements. Sont pénalisés : les protestations en ligne, les dettes passées, ' +
        'les « fréquentations à risque » et des comportements sans aucun lien avec le ' +
        'service demandé. Trois familles ont perdu leur logement social cette ' +
        "semaine. Aucune n'a compris pourquoi.",
      clues: [
        {
          title: 'Données non pertinentes',
          text:
            "Le score du logement intègre l'historique des réseaux sociaux, les amendes routières " +
            "et les contacts téléphoniques. Rien de tout cela ne concerne le droit au logement."
        },
        {
          title: 'Une pénalité qui migre',
          text:
            "Une protestation en ligne de 2029 a abaissé le score sanitaire, " +
            "scolaire et résidentiel d'un citoyen. La pénalisation s'étend à des " +
            'contextes différents de celui d\'origine.'
        },
        {
          title: 'Motivation absente',
          text:
            'La notification officielle indique : « Score insuffisant. Code E-77 ». ' +
            "Aucun citoyen n'a jamais obtenu de motivation compréhensible ni de " +
            'voie de contestation.'
        }
      ],
      noteCorrect:
        "Note d'enquête : le système n'est pas améliorable. Il punit les personnes dans " +
        'des contextes sans rapport et sans justification. Il doit être éteint, non corrigé.',
      notePartial:
        "Note d'enquête : audit et contrôle ne suffisent pas. Une notation sociale " +
        'généralisée reste incompatible avec la dignité et l\'égalité : il fallait la bloquer.',
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le score continue de " +
        'décider qui a droit à un logement.',
      consequenceCorrect:
        'Le système est désactivé. Les classements reviennent à des critères pertinents ' +
        "et vérifiables. Le bureau des réclamations rouvre : il est lent, humain, contestable.",
      consequenceWrong:
        "L'Indice de Fiabilité Civique est étendu aux transports et aux cantines " +
        "scolaires. L'efficacité administrative progresse. Les demandes de logement " +
        'des familles signalées disparaissent silencieusement des files d\'attente.',
      motivations: [
        "Le système est opaque : les citoyens ne reçoivent pas de motivation compréhensible.",
        "Le score produit des traitements défavorables dans des contextes étrangers à celui de la collecte des données : notation sociale interdite (art. 5).",
        'Le système collecte trop de données : il faut l\'alléger et le rendre plus efficace.'
      ],
      debriefQuestions: [
        'Pourquoi la notation sociale généralisée est-elle interdite plutôt que simplement encadrée ?',
        "Quelle différence y a-t-il entre utiliser une donnée dans son contexte et hors de son contexte ?",
        'Un score semblable géré par un acteur privé serait-il traité de la même manière ?'
      ],
      epilogue:
        "L'Indice de Fiabilité Civique est le banc d'essai de l'interdiction : ou il s'éteint, ou il gouverne la ville."
    },
    case_lavoro: {
      title: "L'entretien qui n'existe pas",
      scenario:
        "Les entreprises de la ville filtrent les candidats avec un système d'IA qui " +
        'analyse CV, entretiens vidéo, ton de la voix, micro-expressions, pauses et ' +
        "parcours professionnels. Le résultat arrive en 40 secondes : « Profil non " +
        'compatible ». Un ingénieur avec douze ans d\'expérience a été écarté ' +
        "217 fois. Aucun être humain n'a jamais lu son curriculum.",
      clues: [
        {
          title: 'Aucune explication',
          text:
            "La notification est identique pour tous : « Profil non compatible ». Aucune " +
            'explication individuelle significative, aucune référence aux critères utilisés.'
        },
        {
          title: 'Les parcours non linéaires pénalisés',
          text:
            'Le modèle pénalise les interruptions de carrière, les congés parentaux et les ' +
            "changements de secteur. Il reproduit les discriminations des données historiques d'embauche."
        },
        {
          title: 'Un contrôle de façade',
          text:
            "Un agent « valide » 1 400 résultats par jour : 20 secondes par dossier. " +
            "Le contrôle humain existe sur le papier, pas dans les faits."
        }
      ],
      noteCorrect:
        "Note d'enquête : le recrutement automatisé peut exister, mais seulement " +
        'sous des obligations vérifiables : gestion des risques, données de qualité, ' +
        'contrôle humain réel, journaux et information des candidats.',
      notePartial:
        "Note d'enquête : mesure mal calibrée. Un système à haut risque ne doit " +
        'être ni laissé à moitié ni simplement éteint : il faut un audit, un contrôle ' +
        'effectif et la qualité des données.',
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Les personnes continuent d'être " +
        'écartées par un système que personne ne peut interroger.',
      consequenceCorrect:
        "L'audit révèle un biais contre les parcours non linéaires. Le système est " +
        'recalibré, les recruteurs reprennent la lecture des cas limites, les candidats ' +
        'reçoivent une motivation et une voie de recours.',
      consequenceWrong:
        "Le filtre est adopté aussi par l'organisme public pour les stages. " +
        'Le taux d\'« incompatibilité » chez celles et ceux qui ont eu des interruptions ' +
        "pour raisons familiales atteint 81 %. Personne ne s'en aperçoit : aucun journal n'existe.",
      motivations: [
        'La sélection automatisée des candidats est en soi une pratique interdite.',
        'Les candidats ne reçoivent pas d\'explications adéquates sur les résultats.',
        "Système de recrutement du personnel : haut risque (annexe III) ; des données biaisées et un contrôle de façade violent les obligations."
      ],
      debriefQuestions: [
        'Qui doit garantir la qualité des données : celui qui développe le système ou celui qui l\'utilise ?',
        'Quand le contrôle humain est-il effectif et quand n\'est-il que formel ?',
        'Bloquer entièrement le système aurait-il été une meilleure solution ? Pourquoi non ?'
      ],
      epilogue:
        "Le filtre décidait des carrières en 40 secondes : désormais chaque résultat a un responsable, ou continue de n'en avoir aucun.",
      incident: {
        title: 'LE FOURNISSEUR SE DÉROBE',
        text:
          "Le fournisseur du système déclare par écrit : « toute responsabilité d'usage incombe au déployeur ». Les directions des ressources humaines demandent des instructions immédiates.",
        options: {
          document: 'Dresser procès-verbal et notifier les obligations au fournisseur et au déployeur',
          suspend: "Suspendre le filtrage en attendant l'audit",
          minimize: 'En prendre acte et laisser poursuivre'
        }
      }
    },
    case_media: {
      title: 'La ville de synthèse',
      scenario:
        "La municipalité produit des vidéos, des audios et des communiqués générés par IA sans " +
        "le déclarer. Hier soir, un faux message vidéo « institutionnel » a annoncé " +
        "la contamination du réseau d'eau : panique, supermarchés vidés, trois " +
        "blessés. Le démenti officiel est arrivé quatre heures plus tard. Il était lui aussi " +
        "généré. Personne ne l'a cru.",
      clues: [
        {
          title: 'Aucun marquage',
          text:
            'Les contenus de synthèse de la municipalité sont indiscernables des contenus réels : ' +
            "aucun marquage, aucun filigrane, aucune déclaration d'origine."
        },
        {
          title: 'Authenticité apparente',
          text:
            'Le faux message reprenait le format, la voix de synthèse et la charte ' +
            'graphique officielle. La source institutionnelle paraît authentique même quand le ' +
            'contenu est manipulé.'
        },
        {
          title: 'Une confiance irrécupérable',
          text:
            "Sondage après l'incident : 64 % des citoyens déclarent qu'ils ne croiront " +
            'plus « à aucun communiqué, vrai ou faux ». Les démentis ne reconstruisent pas ' +
            'la confiance.'
        }
      ],
      noteCorrect:
        "Note d'enquête : le problème n'est pas la génération en soi, mais " +
        "l'impossibilité de distinguer. Le marquage des contenus de synthèse " +
        'est la condition minimale de la communication publique.',
      notePartial:
        "Note d'enquête : sans marquage visible sur les contenus générés, " +
        "toute autre mesure laisse les citoyens dans l'indiscernable.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. La ville ne sait plus " +
        'ce qui est réel.',
      consequenceCorrect:
        'Chaque contenu généré ou manipulé est marqué de façon visible. ' +
        "Les citoyens apprennent à reconnaître l'origine des messages. La confiance " +
        'ne revient pas tout de suite, mais elle redevient vérifiable.',
      consequenceWrong:
        "Une deuxième fausse annonce — cette fois sur une évacuation — est ignorée " +
        'par la moitié de la population. Elle était vraie.',
      motivations: [
        "Contenus générés ou manipulés diffusés sans marquage : violation des obligations de transparence (art. 50).",
        'La génération de contenus par des organismes publics est une pratique interdite.',
        'La communication de la municipalité est peu fiable et doit être réorganisée.'
      ],
      debriefQuestions: [
        "Pourquoi marquer un contenu de synthèse est-il différent de l'interdire ?",
        "Un démenti peut-il reconstruire la confiance sans transparence sur l'origine des contenus ?",
        "Les obligations de transparence peuvent-elles se cumuler avec d'autres régimes de risque ?"
      ],
      epilogue:
        "La ville a retrouvé un critère pour distinguer le réel du généré — ou l'a perdu tout à fait.",
      incident: {
        title: 'ACCÈS AUX DOCUMENTS',
        text:
          "Un organe de presse demande un accès urgent aux documents sur l'origine des communiqués. La presse attend une réponse sous une heure.",
        options: {
          document: 'Communiquer et remettre les documents demandés',
          suspend: 'Suspendre les publications et ouvrir une vérification interne',
          minimize: 'Différer par une note d\'attente'
        }
      }
    },
    case_scuola: {
      title: 'La classe observée',
      scenario:
        "Un réseau scolaire utilise des webcams et de l'IA dans chaque salle pour inférer des états " +
        'émotionnels et affectifs : stress, ennui, agressivité et « prédisposition à ' +
        "l'échec ». Les élèves sont répartis en groupes de niveau sur la " +
        "base de ces inférences. Une fille de treize ans a été déplacée " +
        'dans le « groupe de contention » parce que le système lit son visage comme ' +
        '« hostile ». Elle est seulement très timide.',
      clues: [
        {
          title: 'Émotions inférées du visage',
          text:
            "Le système déduit des états émotionnels du visage et de la posture. La corrélation entre " +
            'expression et état intérieur est scientifiquement fragile et culturellement ' +
            'variable.'
        },
        {
          title: 'Aucune contestation possible',
          text:
            'Les classements émotionnels ne sont ni notifiés ni contestables. ' +
            'Les élèves découvrent leur « profil » seulement quand ils changent de groupe.'
        },
        {
          title: 'Les plus fragiles pénalisés',
          text:
            'Les élèves neurodivergents et introvertis se retrouvent systématiquement dans les ' +
            'groupes « à risque ». Le système prend la différence pour une déviance.'
        }
      ],
      noteCorrect:
        "Note d'enquête : l'inférence des émotions dans les établissements d'enseignement est une " +
        'pratique interdite, sauf exceptions limitées (par exemple raisons médicales ou de ' +
        'sécurité) qui ne se présentent pas ici. On éteint.',
      notePartial:
        "Note d'enquête : contrôler une pratique interdite ne la rend pas " +
        'licite. La surveillance émotionnelle en classe devait être bloquée.',
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Les caméras continuent " +
        'de décider qui est « à risque ».',
      consequenceCorrect:
        'Les webcams émotionnelles sont retirées. Les groupes sont de nouveau décidés par des ' +
        'enseignants qui parlent avec les élèves. La jeune fille de treize ans revient dans sa classe.',
      consequenceWrong:
        'Le système est étendu aux couloirs et à la cantine. Les élèves apprennent ' +
        'à composer le « bon » visage huit heures par jour. Les cas d\'anxiété ' +
        'scolaire doublent. Le tableau de bord signale : « climat émotionnel : optimal ».',
      motivations: [
        'Les journaux et la documentation technique adéquats manquent : il faut les compléter.',
        "Inférence des émotions dans un établissement d'enseignement : pratique interdite (art. 5), sauf exceptions qui ne se présentent pas ici.",
        'Le système pénalise les élèves les plus fragiles et doit être recalibré.'
      ],
      debriefQuestions: [
        "Pourquoi l'interdiction frappe-t-elle l'inférence des émotions à l'école même si la technologie « fonctionnait » ?",
        "Quelles exceptions l'interdiction admet-elle et pourquoi ne s'appliquent-elles pas ici ?",
        "Quelle différence y a-t-il entre interdire une pratique et corriger ses défauts ?"
      ],
      epilogue:
        "Les salles de classe sont redevenues sans caméras émotionnelles, ou les élèves ont appris à jouer le bon visage."
    },
    case_ospedale: {
      title: 'Triage invisible',
      scenario:
        "L'hôpital attribue les priorités de triage avec un modèle prédictif " +
        'entraîné sur des données historiques biaisées : il sous-estime systématiquement le ' +
        'risque pour certaines catégories de patients. Les performances agrégées ' +
        "paraissent excellentes. Les sous-groupes vulnérables meurent en attendant.",
      clues: [
        {
          title: 'Des moyennes excellentes',
          text: "Exactitude agrégée : 94 %. Personne n'a jamais désagrégé par sous-groupe."
        },
        {
          title: 'Des erreurs concentrées',
          text:
            'Les erreurs de sous-estimation se concentrent sur les personnes âgées isolées, les patients dont ' +
            "l'histoire clinique est fragmentée et les catégories peu représentées dans les données."
        },
        {
          title: 'Confiance aveugle',
          text:
            'Le personnel suit le score sans en connaître les limites. ' +
            '« Si le système dit vert, c\'est vert. »'
        }
      ],
      noteCorrect:
        "Note d'enquête : le triage assisté peut sauver des vies, mais seulement avec " +
        'une gestion des risques, des données représentatives, une surveillance après commercialisation et ' +
        'un personnel capable de contredire le score.',
      notePartial:
        "Note d'enquête : mesure mal calibrée. Ni le score aveugle ni l'extinction " +
        'pure : sans audit par sous-groupes, qualité des données et ' +
        'contrôle humain effectif, le triage ne devient pas maîtrisable.',
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Les moyennes restent " +
        'excellentes. Les morts restent hors moyenne.',
      consequenceCorrect:
        "L'audit par sous-groupes révèle le biais. Le modèle est " +
        'réentraîné, le personnel formé à le remettre en question, chaque ' +
        'décision tracée et révisable.',
      consequenceWrong:
        'Le modèle est étendu à trois hôpitaux. Les statistiques agrégées ' +
        "s'améliorent encore. Une catégorie de patients cesse complètement de se présenter " +
        'aux urgences : elle a appris que le système ne la voit pas.',
      motivations: [
        "Triage sanitaire à haut risque : des données non représentatives et un contrôle inefficace violent les obligations prévues.",
        'Le personnel se fie trop au score et doit être mieux formé.',
        "Le triage assisté par IA est une pratique interdite dans le domaine de la santé."
      ],
      debriefQuestions: [
        "Pourquoi une exactitude moyenne élevée peut-elle masquer des dommages graves sur les sous-groupes ?",
        'Que faut-il pour que le personnel puisse réellement contredire le score ?',
        "Pourquoi éteindre le système serait-il un excès de précaution et non de la conformité ?"
      ],
      epilogue:
        'Le triage est désormais vérifiable par sous-groupes — ou les moyennes continuent de couvrir les morts.',
      incident: {
        title: 'LE CHEF DE SERVICE PROTESTE',
        text:
          "Le chef de service demande de ne pas arrêter le système : « sans le score, les urgences s'effondrent en une garde ».",
        options: {
          document: 'Documenter le risque et informer la direction médicale',
          suspend: 'Suspendre le modèle pour les sous-groupes à risque',
          minimize: 'Rassurer le service et ne rien toucher'
        }
      }
    },
    case_biometria: {
      title: 'Des visages dans la foule',
      scenario:
        'La police municipale utilise le réseau de caméras de la ville pour ' +
        'identifier en temps réel, sur les places et dans les gares, des personnes considérées comme ' +
        '« sujets d\'intérêt » à des fins de contrôle et de répression. Les faux positifs ' +
        'sont interpellés, fichés, parfois retenus. Certains quartiers ont ' +
        'cessé de descendre dans la rue.',
      clues: [
        {
          title: 'Des interpellations inexpliquées',
          text:
            "Les personnes sont interpellées sans savoir pourquoi. « Le système l'a signalée. »"
        },
        {
          title: 'Temps réel, espace public, finalité répressive',
          text:
            "L'identification biométrique opère en direct sur les places, les gares et " +
            'les cortèges, à des fins de police : c\'est le périmètre de l\'interdiction, sauf ' +
            'exceptions limitativement énumérées et autorisées.'
        },
        {
          title: 'Des erreurs disproportionnées',
          text:
            'Les faux positifs frappent de manière disproportionnée certaines catégories ' +
            "de personnes. Le taux d'erreur n'a jamais été publié."
        }
      ],
      noteCorrect:
        "Note d'enquête : l'usage généralisé en temps réel à des fins répressives " +
        'doit être arrêté. Les éventuelles exceptions sont limitativement énumérées, soumises à ' +
        'autorisation et à des garanties. D\'autres usages biométriques suivent des régimes différents ' +
        'selon la finalité et le contexte.',
      notePartial:
        "Note d'enquête : un audit ne rend pas licite une identification de " +
        "masse permanente à des fins de police. L'usage généralisé devait être arrêté.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. La foule a cessé " +
        "d'être anonyme.",
      consequenceCorrect:
        "L'identification généralisée est éteinte. Les cas exceptionnels passent " +
        'par des autorisations spécifiques et des garanties. Les places se remplissent de nouveau.',
      consequenceWrong:
        'Le système est renforcé. Les manifestations baissent de 70 %. Le rapport ' +
        'annuel l\'enregistre comme une « amélioration de l\'ordre public ».',
      motivations: [
        'Le système produit trop de faux positifs et doit être vérifié.',
        "Il faut améliorer l'exactitude de la reconnaissance pour réduire les erreurs.",
        "Identification biométrique à distance en temps réel dans des espaces publics à des fins répressives : interdiction (art. 5), sauf exceptions limitativement énumérées."
      ],
      debriefQuestions: [
        "Quels éléments du dossier déclenchent l'interdiction : la technologie ou l'usage ?",
        "Pourquoi les exceptions à l'interdiction sont-elles limitativement énumérées et soumises à autorisation ?",
        'Le même système utilisé par un centre commercial relèverait-il du même régime ?'
      ],
      epilogue: 'Les places sont redevenues anonymes, ou la foule a appris à ne pas se réunir.'
    },
    case_credito: {
      title: 'Le crédit civique',
      scenario:
        "Le bureau de l'aide sociale adopte une plateforme de « fiabilité civique » qui fusionne données administratives, ponctualité des paiements, demandes d'aides, historique de logement, signalements et fréquentations en un score unique. Le score décide des priorités et de l'accès aux aides, aux logements et aux services à tarif réduit. Les familles qui ont protesté ou fréquenté des personnes « à risque » glissent au bas des listes. Personne ne sait expliquer pourquoi.",
      clues: [
        {
          title: "Décision d'attribution",
          text:
            "La décision déclare des finalités légitimes : efficacité, réduction des files d'attente, prévention de la fraude. Sur le papier, rien d'anormal."
        },
        {
          title: 'Manuel du fournisseur',
          text:
            "Le manuel répète que le système est « un simple appui à la décision » et que « la décision reste toujours humaine »."
        },
        {
          title: "Réclamation d'une citoyenne",
          text:
            "Une mère raconte avoir perdu la priorité pour la crèche : « score insuffisant », aucune explication, aucun recours utile."
        },
        {
          title: 'Tableau des données du modèle',
          text:
            "Le modèle pondère aussi les signalements, les fréquentations, l'activité sur les réseaux sociaux et la « réputation de quartier » : des comportements sociaux agrégés, sans pertinence pour le service demandé."
        },
        {
          title: 'Note interne du responsable',
          text:
            "Une note admet que les agents « suivent le score » pour écouler les dossiers : le contrôle humain existe sur le papier, pas dans les faits."
        },
        {
          title: 'Communiqué public',
          text:
            "La municipalité parle d'un « algorithme équitable et objectif » sans expliquer quelles données il utilise ni comment contester le score."
        }
      ],
      clueSources: ['amministrativa', 'vendor', 'reclamo', 'tecnica', 'interna', 'pubblica'],
      noteCorrect:
        "Note d'enquête : ce n'est pas une évaluation de solvabilité. Le système agrège des comportements sociaux en un score généralisé qui limite l'accès à des services essentiels dans des contextes sans rapport : il relève de l'interdiction de la notation sociale. Il doit être arrêté.",
      notePartial:
        "Note d'enquête : audit et contrôle atténuent, mais un score social généralisé qui décide de l'accès aux services ne se régularise pas par une procédure : il devait être arrêté.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le score continue de décider qui entre dans les listes, et qui non.",
      consequenceCorrect:
        "Le score civique est désactivé. Les priorités reviennent à des critères pertinents, motivés et contestables. Le bureau des réclamations rouvre : lent, humain, vérifiable.",
      consequenceWrong:
        "Le crédit civique est étendu aux transports et aux cantines. L'efficacité augmente. Des quartiers entiers glissent au bas de chaque liste, sans savoir pourquoi.",
      motivations: [
        "C'est un instrument ordinaire d'efficacité administrative : il optimise les files d'attente et les priorités.",
        "Le score agrège des comportements sociaux et des données non pertinentes pour limiter l'accès à des services essentiels dans des contextes sans rapport : il relève de l'interdiction de la notation sociale.",
        'Les citoyens ne reçoivent pas d\'explications adéquates sur le score.'
      ],
      debriefQuestions: [
        "Pourquoi ce score relève-t-il de l'interdiction et non d'une simple évaluation de solvabilité ?",
        'Quelles données transforment une évaluation de fiabilité économique en notation sociale interdite ?',
        "Qui porte l'obligation principale : le fournisseur de la plateforme ou l'organisme qui l'utilise ?"
      ],
      epilogue:
        "Le crédit civique est la frontière : tout score n'est pas interdit, mais celui-ci agrège la vie sociale pour décider qui accède aux services."
    },

    case_chatbot: {
      title: 'Le guichet qui répond toujours',
      scenario:
        "La municipalité ouvre un guichet numérique : un assistant automatique répond sur les aides, les échéances, les conditions et les documents. C'est pratique, rapide, toujours disponible. Mais certaines réponses sont fausses, personne n'avertit que c'est une machine qui répond et il n'existe aucun moyen simple de parler à une personne. Certains citoyens perdent des droits à cause d'une information erronée.",
      clues: [
        {
          title: 'Communiqué public',
          text:
            "La municipalité annonce « des réponses immédiates et toujours à jour ». Aucune mention des limites du système."
        },
        {
          title: 'Journal des conversations',
          text:
            "Le registre montre des réponses erronées sur les conditions et les échéances d'une aide : des indications fausses répétées à plusieurs citoyens."
        },
        {
          title: 'Note du fournisseur',
          text:
            "Le manuel répète que « le système est purement informatif » et ne remplace pas les services. Sur le papier, une précaution."
        },
        {
          title: "Réclamation d'un citoyen",
          text:
            "Une personne a manqué la fenêtre de dépôt : « Le guichet m'avait dit qu'il y avait encore du temps ». Aucun canal pour corriger à temps."
        },
        {
          title: 'Procédure interne',
          text:
            "La procédure ne prévoit aucun passage à un agent humain : aucune escalade, aucune révision des réponses critiques."
        },
        {
          title: "Décision d'adoption",
          text:
            "La décision présente le guichet comme un service d'efficacité. Finalité légitime, rien d'anormal en soi."
        }
      ],
      clueSources: ['pubblica', 'log', 'vendor', 'reclamo', 'interna', 'amministrativa'],
      noteCorrect:
        "Note d'enquête : le guichet ne doit pas être interdit, il doit être rendu transparent et gouverné. Le citoyen doit savoir qu'il parle à une machine, recevoir des informations exactes et pouvoir joindre une personne. Il faut un avertissement clair, un canal humain, un audit des réponses et une journalisation respectueuse des données personnelles.",
      notePartial:
        "Note d'enquête : la direction est la bonne, mais à moitié. Sans transparence envers le citoyen et sans canal humain effectif, l'assistant reste une source de confiance fragile.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le guichet continue de répondre, parfois mal, et personne n'en assume la responsabilité.",
      consequenceCorrect:
        "Le guichet déclare être automatique, signale ses limites et propose un contact humain. Les réponses critiques sont revues et tracées. L'efficacité demeure, mais elle devient fiable.",
      consequenceWrong:
        "Le guichet est étendu à d'autres services. Les réponses arrivent toujours plus vite. Et toujours plus de personnes agissent sur des informations que personne n'a vérifiées.",
      motivations: [
        "C'est un simple service d'information : s'il se trompe, la responsabilité incombe au citoyen qui s'y fie.",
        "L'assistant automatique crée une confiance légitime : il faut la transparence sur le fait qu'il s'agit d'une machine, une information exacte, un canal humain et la traçabilité. La responsabilité d'usage reste à l'organisme.",
        "Le problème est seulement technique : il suffit que le fournisseur mette le modèle à jour."
      ],
      debriefQuestions: [
        'Quand un assistant automatique devient-il une source fiable pour le citoyen ?',
        "Pourquoi la transparence ne suffit-elle pas seule ici, et pourquoi faut-il aussi un canal humain ?",
        "Qui répond si l'agent conversationnel public donne une information erronée : le fournisseur ou l'organisme ?"
      ],
      epilogue:
        "Le guichet automatique n'est pas le problème : il le devient quand il cache qu'il en est un, qu'il se trompe et qu'il ne laisse aucune porte humaine à laquelle frapper."
    },

    case_procurement: {
      title: 'Le marché opaque',
      scenario:
        "Un organisme public achète un système d'IA pour instruire des dossiers et établir des priorités. Le marché est conclu à la hâte : cahier des charges générique, aucune documentation technique, critères peu transparents. Quand le service demande l'accès au fonctionnement du système, le fournisseur refuse. « Il est certifié », dit-il. Mais personne, dans l'organisme, ne peut expliquer ni contrôler ses décisions.",
      clues: [
        {
          title: 'Cahier des charges',
          text:
            "Le cahier des charges décrit le service en termes généraux : aucune exigence de documentation, d'audit ou de contrôle humain sur le système d'IA."
        },
        {
          title: 'Offre du fournisseur',
          text:
            "L'offre est pleine d'affirmations : « solution certifiée, conforme, sûre ». Aucune preuve technique annexée."
        },
        {
          title: 'Procès-verbal interne',
          text:
            "Un procès-verbal du service technique admet : « nous ne disposons ni de la documentation technique ni de critères de vérification du système »."
        },
        {
          title: 'Clause contractuelle',
          text:
            "Une clause limite la responsabilité et les accès, avec des formules ambiguës sur la propriété et le savoir-faire. Difficile de dire qui peut contrôler quoi."
        },
        {
          title: 'Accès refusé',
          text:
            "La demande d'accès au fonctionnement et aux journaux du système est rejetée par le fournisseur comme « information confidentielle »."
        },
        {
          title: 'Note du responsable de la procédure',
          text:
            "Le responsable de la procédure signale le risque : « si le système se trompe, nous ne saurions démontrer pourquoi, ni le corriger »."
        }
      ],
      clueSources: ['amministrativa', 'vendor', 'interna', 'amministrativa', 'tecnica', 'amministrativa'],
      noteCorrect:
        "Note d'enquête : « le fournisseur est certifié » ne suffit pas. Un système qui instruit des décisions publiques est à haut risque : il faut une documentation technique, une gouvernance, des critères de vérification ex ante, des droits d'accès et d'audit, des responsabilités contractuelles claires. L'administration ne peut acheter un système qu'elle ne peut ni expliquer ni contrôler.",
      notePartial:
        "Note d'enquête : le problème n'est saisi qu'à moitié. Sans documentation ni droits d'accès et d'audit, la gouvernance reste sur le papier et l'organisme ne contrôle pas vraiment le système.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le système décide, l'organisme ne sait pas comment, et le fournisseur garde la clé.",
      consequenceCorrect:
        "La fourniture est renégociée : documentation technique, droits d'audit et d'accès, contrôle humain et responsabilités définies. L'organisme peut de nouveau expliquer et contrôler ce qu'il a acheté.",
      consequenceWrong:
        "Le système entre en service tel quel. Il fonctionne, jusqu'à ce qu'il se trompe. Et quand il se trompe, personne dans l'organisme ne peut l'ouvrir, l'expliquer ou l'arrêter.",
      motivations: [
        "Achat opaque d'un système à haut risque : documentation, critères de vérification, droits d'accès et d'audit et responsabilités manquent. La reddition de comptes reste à la charge de l'organisme qui l'emploie.",
        "Le marché est régulier : si le produit est certifié, l'administration n'a rien d'autre à demander.",
        "C'est un problème de transparence envers les citoyens : il suffit de publier les pièces du marché."
      ],
      debriefQuestions: [
        "Que doit exiger une administration avant d'acheter un système d'IA ?",
        "Pourquoi « le fournisseur est certifié » ne suffit-il pas à garantir gouvernance et responsabilité ?",
        "Quelles clauses évitent la dépendance au fournisseur et gardent l'organisme capable de contrôler le système ?"
      ],
      epilogue:
        "Le marché public est le moment où la gouvernance se gagne ou se perd : qui ne demande pas documentation et contrôle avant ne les obtiendra pas après."
    },

    case_edtech: {
      title: 'La classe profilée',
      scenario:
        "Une plateforme éducative adaptative profile les élèves : elle attribue un « score de risque d'échec », suggère des parcours, signale ceux qu'il faut surveiller. Elle est née comme un appui. Mais les enseignants commencent à suivre le tableau de bord plus que leur propre jugement : celui qui est marqué « à risque » reçoit moins d'occasions. Les familles ne savent pas comment cela fonctionne, et ne peuvent pas contester.",
      clues: [
        {
          title: 'Tableau de bord du risque',
          text:
            "Un tableau de bord attribue à chaque élève un score de risque d'échec et oriente les choix de groupes, de parcours et de priorités de soutien."
        },
        {
          title: 'Communication aux familles',
          text:
            "L'école présente la plateforme comme un « outil neutre et objectif » pour personnaliser l'enseignement. Aucun détail sur les critères."
        },
        {
          title: "Description de l'algorithme",
          text:
            "La fiche technique indique que le modèle utilise notes, présences, retards, comportement et données d'utilisation de la plateforme."
        },
        {
          title: "Note d'une enseignante",
          text:
            "Une enseignante écrit : « nous suivons le score pour décider qui rattraper ; revoir au cas par cas, il n'y a pas le temps ». Le contrôle humain existe sur le papier."
        },
        {
          title: "Réclamation d'une famille",
          text:
            "Une famille conteste la décision : l'élève a été exclu d'un projet parce qu'« à risque ». Aucune explication, aucun moyen de faire réexaminer la décision."
        },
        {
          title: 'Politique de données',
          text:
            "La politique est incomplète : elle ne précise ni la minimisation, ni la conservation, ni les accès. Difficile de dire quelles données sont réellement nécessaires."
        }
      ],
      clueSources: ['tecnica', 'pubblica', 'tecnica', 'interna', 'reclamo', 'amministrativa'],
      noteCorrect:
        "Note d'enquête : toute plateforme éducative n'est pas interdite, mais celle-ci pèse sur les occasions et les parcours des élèves : elle est à haut risque. Il faut un contrôle humain effectif (ne pas suivre aveuglément le score), la minimisation des données, l'explicabilité envers les enseignants et les familles et la possibilité de contester.",
      notePartial:
        "Note d'enquête : la classification tient, la mesure non. Sans un contrôle humain capable de s'écarter réellement du score et sans explicabilité, la plateforme oriente les décisions à la place des enseignants.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le score continue de décider qui a une chance de plus et qui une de moins.",
      consequenceCorrect:
        "La plateforme redevient un appui, non un verdict : les enseignants peuvent s'en écarter et doivent motiver, les familles reçoivent des explications et peuvent contester, les données collectées sont réduites au nécessaire.",
      consequenceWrong:
        "Le score de risque s'étend à l'orientation et aux bourses. L'école est plus « efficace ». Certains élèves restent marqués, sans savoir pourquoi.",
      motivations: [
        "Ce n'est qu'un appui pédagogique neutre : s'il signale un risque, il ne fait qu'aider les enseignants.",
        "Le problème est la communication : il suffit de mieux expliquer aux familles comment cela fonctionne.",
        "La plateforme pèse sur les occasions éducatives : elle est à haut risque et exige un contrôle humain effectif, la minimisation des données, l'explicabilité et la contestabilité. C'est l'école qui l'utilise qui répond."
      ],
      debriefQuestions: [
        "Quand une recommandation pédagogique devient-elle une décision importante pour l'élève ?",
        "Qu'est-ce qui distingue un appui à l'enseignant d'une automatisation qui décide à sa place ?",
        "Comment rendre un score éducatif contestable et explicable envers les élèves et les familles ?"
      ],
      epilogue:
        "La classe profilée enseigne la frontière : l'IA peut soutenir l'enseignement, non remplacer le jugement humain sur les chances des élèves."
    },

    case_gpai: {
      title: 'Le modèle à tout faire',
      scenario:
        "Un organisme intègre un modèle génératif à usage général dans ses flux internes : il résume des documents, prépare des projets de décision, classe des demandes, suggère des réponses aux agents. Pratique et polyvalent. Mais quelqu'un commence à l'utiliser pour décider, et non seulement pour ébaucher. Les sorties ne sont pas vérifiées, les requêtes ne sont pas encadrées, et une hallucination finit dans un acte.",
      clues: [
        {
          title: "Politique d'usage interne",
          text:
            "Une politique générique autorise l'usage du modèle génératif « pour appuyer le travail ». Aucune limite sur les usages décisionnels."
        },
        {
          title: 'Sortie erronée',
          text:
            "Un projet généré contient une référence normative inventée. Le texte s'est retrouvé presque inchangé dans une communication officielle."
        },
        {
          title: 'Courriel interne',
          text:
            "Un courriel invite les collègues à « faire écrire les projets de décision par le modèle, comme ça c'est plus rapide » : le générateur entre dans le fond des choix."
        },
        {
          title: 'Note du délégué à la protection des données',
          text:
            "Le délégué à la protection des données signale des risques sur les données saisies dans les requêtes, la vérification des sorties et la traçabilité des décisions."
        },
        {
          title: 'Journal des requêtes',
          text:
            "Le registre montre des requêtes libres, contenant des données et des demandes décisionnelles, sans critères, contrôles ni révision humaine documentée."
        },
        {
          title: 'Document du fournisseur',
          text:
            "La fiche du fournisseur est générique : « modèle polyvalent pour de nombreuses tâches ». Aucune indication sur les usages à éviter."
        }
      ],
      clueSources: ['amministrativa', 'log', 'interna', 'interna', 'log', 'vendor'],
      noteCorrect:
        "Note d'enquête : le modèle à usage général n'est en soi ni interdit ni automatiquement à haut risque. Le risque naît de l'usage concret : ici, il entre dans des décisions importantes sans vérification. Il faut une révision humaine effective, la traçabilité, une politique d'usage aux frontières claires, le contrôle des données saisies et une information des utilisateurs. C'est l'organisation qui l'emploie qui répond.",
      notePartial:
        "Note d'enquête : le risque est saisi à moitié. Sans vérification effective des sorties et sans encadrement des requêtes, le modèle continue d'influencer des décisions que personne ne contrôle.",
      noteWrong:
        "Note d'enquête : le dossier reste ouvert. Le modèle écrit, quelqu'un signe, et personne ne vérifie.",
      consequenceCorrect:
        "L'usage du modèle est encadré : frontières claires entre ébaucher et décider, révision humaine effective, traçabilité des requêtes et des sorties, contrôle des données saisies. Il reste utile, il cesse de décider seul.",
      consequenceWrong:
        "Le modèle à tout faire entre dans d'autres procédures. La productivité augmente. Et de temps en temps, une décision repose sur quelque chose que le modèle a simplement inventé.",
      motivations: [
        "Un modèle à usage général n'est qu'un outil : l'usage interne n'exige pas de règles particulières.",
        "Le modèle à usage général n'est ni interdit ni automatiquement à haut risque, mais il est ici utilisé dans des décisions importantes sans contrôle : il faut une gouvernance de l'usage (révision humaine effective, traçabilité, limites, données admises). C'est le déployeur qui répond.",
        "Il suffit d'un avertissement rappelant que les réponses doivent être vérifiées."
      ],
      debriefQuestions: [
        "Qui répond si un modèle à usage général est utilisé dans un processus décisionnel concret ?",
        "Qu'est-ce qui change entre utiliser le modèle pour ébaucher et l'utiliser pour décider ?",
        "Quelles garanties faut-il quand un modèle à usage général entre dans le flux décisionnel d'un organisme ?"
      ],
      epilogue:
        "Le modèle à tout faire n'est pas le problème : il le devient quand il passe, sans contrôle, de l'ébauche à la décision."
    }
  },

  norms: {
    norm_bias_detection: {
      title: 'Données particulières pour détecter les biais',
      reference: 'AI Act — règl. (UE) 2024/1689 (mod. règl. UE 2026/1744), art. 4 bis',
      explanation:
        "Pour s'apercevoir qu'un système discrimine selon l'origine ethnique, la religion ou la santé, il faut traiter précisément ces données, que le RGPD protège comme catégories particulières. L'article 4 bis résout la contradiction : les fournisseurs de systèmes à haut risque peuvent les traiter à titre exceptionnel pour détecter et corriger les biais, dans la mesure strictement nécessaire et à six conditions CUMULATIVES — aucune autre donnée utilisable, limites techniques à la réutilisation et pseudonymisation, contrôles d'accès documentés, aucune transmission à des tiers, effacement après correction, motivation écrite dans le registre des traitements.",
      notMeaning:
        "Cela ne signifie pas que l'on puisse collecter des données sensibles « au nom de l'équité » : c'est une exception stricte à six verrous, et qui n'en ouvre que cinq traite des données particulières sans base juridique. Cela ne signifie pas non plus l'inverse : le second paragraphe dit expressément que personne n'est obligé de chercher les biais.",
      democraticFunction:
        "Rend possible la découverte de la discrimination sans que la recherche de la discrimination devienne elle-même un fichage.",
      tags: ['données particulières', 'biais', 'haut risque', 'RGPD']
    },
    norm_predpol: {
      title: 'Interdiction de la police prédictive individuelle',
      reference: 'AI Act — règl. (UE) 2024/1689 (mod. règl. UE 2026/1744), art. 5, par. 1, point d)',
      explanation:
        "Il est interdit d'utiliser des systèmes d'IA pour prévoir le risque qu'une personne commette une infraction sur la seule base du profilage ou des traits de personnalité.",
      notMeaning:
        "Cela ne signifie pas que l'IA soit bannie des enquêtes : l'appui à une évaluation humaine fondée sur des faits objectifs liés à une activité criminelle reste hors du champ de l'interdiction.",
      democraticFunction:
        "Empêche que les personnes soient traitées en suspects pour ce qu'elles sont — où elles vivent, qui elles connaissent — au lieu de ce qu'elles font.",
      tags: ['pratiques interdites', 'profilage', 'police']
    },
    norm_frodi_welfare: {
      title: 'Haut risque : accès aux prestations essentielles',
      reference:
        'AI Act — règl. (UE) 2024/1689 (mod. règl. UE 2026/1744), annexe III, point 5 ; art. 14 et 26',
      explanation:
        "Les systèmes qui évaluent l'accès à des prestations publiques essentielles sont à haut risque : ils exigent des données de qualité, la traçabilité et un contrôle humain effectif avant que les effets ne retombent sur les personnes.",
      notMeaning:
        "Cela ne signifie pas que les organismes ne puissent pas combattre la fraude : cela signifie qu'un score ne peut pas suspendre un droit sans qu'une personne ait vérifié.",
      democraticFunction:
        "Protège celui qui dépend de l'aide sociale contre les erreurs automatisées : la charge de la vérification pèse sur l'administration, non sur le citoyen qui forme un recours.",
      tags: ['haut risque', 'aide sociale', 'contrôle humain']
    },
    norm_social_scoring: {
      title: 'Interdiction de la notation sociale',
      reference: 'AI Act — art. 5 (pratiques interdites)',
      explanation:
        "Est interdit l'usage de systèmes d'IA qui évaluent ou classent les personnes " +
        'en fonction de leur comportement social ou de caractéristiques personnelles, lorsque le ' +
        'score produit des traitements défavorables dans des contextes différents de celui ' +
        'de la collecte des données, ou en tout cas disproportionnés et injustifiés.',
      democraticFunction:
        "Certains usages de l'IA ne doivent pas être atténués : ils doivent être interdits, parce qu'incompatibles " +
        'avec la dignité, l\'égalité et la liberté individuelle.',
      notMeaning:
        "Cela ne signifie pas que tout classement ou système de priorité soit interdit : le problème est l'usage disproportionné ou non pertinent de données sociales et de réputation dans des contextes sans rapport.",
      tags: ['interdiction', 'notation', 'services publics']
    },
    norm_lavoro_alto_rischio: {
      title: "Systèmes à haut risque dans l'emploi",
      reference: 'AI Act — annexe III (emploi et gestion des travailleurs)',
      explanation:
        "Les systèmes d'IA utilisés pour le recrutement, la sélection, l'évaluation et la gestion " +
        'des travailleurs sont classés à haut risque : ils exigent une gestion des ' +
        'risques, la qualité des données, un contrôle humain effectif, des journaux et ' +
        "l'information des personnes concernées.",
      democraticFunction:
        "L'accès à l'emploi ne peut dépendre de classements opaques qui " +
        'empêchent la compréhension, la mobilité et la contestation.',
      notMeaning:
        "Cela ne signifie pas que tout outil numérique de ressources humaines soit interdit : les systèmes qui sélectionnent, évaluent ou gèrent des personnes exigent des garanties fortes.",
      tags: ['haut risque', 'emploi', 'contrôle humain']
    },
    norm_trasparenza_sintetici: {
      title: 'Transparence des contenus de synthèse',
      reference: 'AI Act — art. 50 (obligations de transparence)',
      explanation:
        'Deux obligations distinctes : (1) qui interagit avec un système d\'IA doit ' +
        'être informé qu\'il interagit avec une machine ; (2) les contenus ' +
        'générés ou manipulés artificiellement (y compris les hypertrucages) doivent être ' +
        'rendus reconnaissables comme tels par qui les crée ou les diffuse. ' +
        'Note pédagogique : les obligations de transparence peuvent se cumuler avec d\'autres ' +
        'catégories de risque ; elles sont présentées ici comme une catégorie autonome uniquement ' +
        'à des fins pédagogiques.',
      democraticFunction:
        'La transparence protège la capacité de distinguer communication publique, ' +
        'manipulation et contenu de synthèse.',
      notMeaning:
        "Cela ne signifie pas que tout contenu généré par IA soit illicite : dans certains cas, il doit cependant être reconnaissable comme de synthèse ou manipulé.",
      tags: ['transparence', 'hypertrucage', 'information']
    },
    norm_emotion_recognition: {
      title: "Interdiction de la reconnaissance des émotions à l'école et au travail",
      reference: 'AI Act — art. 5 (pratiques interdites, sauf exceptions)',
      explanation:
        "Il est interdit d'utiliser des systèmes d'IA pour inférer les émotions des personnes sur les " +
        "lieux de travail et dans les établissements d'enseignement, sauf exceptions limitées " +
        '(par exemple raisons médicales ou de sécurité) prévues par le règlement.',
      democraticFunction:
        "L'environnement éducatif et professionnel ne doit pas devenir un espace de " +
        'surveillance émotionnelle permanente.',
      notMeaning:
        "Cela ne signifie pas que toute observation du comportement soit interdite : le problème est l'inférence automatique des émotions à l'école ou au travail, sauf les exceptions prévues.",
      tags: ['interdiction', 'émotions', 'école', 'travail']
    },
    norm_alto_rischio_obblighi: {
      title: 'Obligations des systèmes à haut risque',
      reference: 'AI Act — obligations applicables aux systèmes à haut risque',
      explanation:
        'Les systèmes à haut risque doivent respecter des exigences portant sur : la gestion des ' +
        'risques, la qualité des données, la documentation technique, les journaux, la transparence, ' +
        'le contrôle humain, l\'exactitude, la robustesse et la cybersécurité — y compris après ' +
        'la mise en service (surveillance après commercialisation).',
      democraticFunction:
        'Un système automatisé qui pèse sur la vie des personnes doit être ' +
        'vérifiable jusque dans ses effets sur les groupes vulnérables.',
      notMeaning:
        "Cela ne signifie pas que l'IA en santé soit interdite : les systèmes qui pèsent sur la santé, la sécurité ou les droits doivent être gouvernés, documentés et supervisés.",
      tags: ['haut risque', 'audit', 'données', 'santé']
    },
    norm_biometria: {
      title: 'Identification biométrique à distance',
      reference: 'AI Act — art. 5 et dispositions spécifiques sur la biométrie',
      explanation:
        "L'interdiction de l'art. 5 porte sur l'identification biométrique à distance " +
        '« en temps réel » dans des espaces accessibles au public lorsqu\'elle est utilisée à des ' +
        'fins répressives (activité de police), sauf exceptions limitativement énumérées ' +
        'soumises à des conditions et autorisations très restrictives. D\'autres usages ' +
        'biométriques peuvent relever de régimes différents — y compris les systèmes à ' +
        "haut risque — selon le contexte d'usage et la finalité.",
      democraticFunction:
        "L'espace public ne peut devenir une zone d'identification " +
        'automatique permanente.',
      notMeaning:
        "Cela ne signifie pas que tout usage biométrique soit interdit : le régime dépend de la finalité, du contexte, de l'acteur qui emploie le système et des conditions prévues par le règlement.",
      tags: ['interdiction', 'biométrie', 'espace public']
    },
    norm_credito: {
      title: 'Scores sociaux et accès aux services',
      reference: 'AI Act — art. 5 (pratiques interdites, notation sociale) ; cf. annexe III',
      explanation:
        "Un score qui agrège des comportements sociaux et des caractéristiques personnelles et produit des traitements défavorables dans des contextes sans rapport, ou disproportionnés et injustifiés, relève de l'interdiction de la notation sociale (art. 5). Un système qui évalue l'accès à des prestations ou services essentiels, sans généralisation sociale interdite, peut en revanche être à haut risque (annexe III) : comptent la finalité, les données utilisées, le contexte et les effets sur les droits.",
      notMeaning:
        "Cela ne signifie pas que tout système de score soit interdit : le régime dépend de la finalité, des données utilisées, du contexte d'usage, des effets sur les droits et de la possibilité effective d'un contrôle humain.",
      democraticFunction:
        "L'accès aux services essentiels ne peut dépendre d'une réputation sociale calculée et sans appel.",
      tags: ['interdiction', 'notation', 'aide sociale', 'services']
    },
    norm_chatbot: {
      title: 'Assistants automatiques et transparence envers le citoyen',
      reference: "AI Act — art. 50 (obligations de transparence) ; cf. obligations du déployeur",
      explanation:
        "Qui interagit avec un système d'IA doit savoir qu'il parle à une machine (art. 50). Pour un assistant public, la transparence est le minimum : comptent aussi l'exactitude de l'information, un contrôle humain effectif, la possibilité de joindre une personne et la traçabilité. La responsabilité d'usage reste au déployeur, elle ne se reporte pas sur le fournisseur.",
      notMeaning:
        "Cela ne signifie pas que tout agent conversationnel public soit interdit : ils doivent être rendus transparents, supervisés et accompagnés d'un canal humain, surtout lorsqu'ils pèsent sur des droits ou des opportunités.",
      democraticFunction:
        "Le citoyen a le droit de savoir quand une information publique vient d'une machine et de pouvoir parler à une personne.",
      tags: ['transparence', 'agent conversationnel', 'services publics', 'déployeur']
    },
    norm_procurement: {
      title: "Achat public de systèmes d'IA",
      reference:
        'AI Act — obligations applicables aux systèmes à haut risque (gouvernance et documentation)',
      explanation:
        "Quand une administration achète un système d'IA qui pèse sur des décisions importantes, les obligations du haut risque ne s'achètent pas avec une certification : il faut une documentation technique, des critères de vérification ex ante, des droits d'accès et d'audit, un contrôle humain et des responsabilités contractuelles claires. La reddition de comptes reste à la charge de l'organisme qui emploie le système.",
      notMeaning:
        "Cela ne signifie pas qu'acheter de l'IA soit illégitime : cela signifie qu'il faut une documentation, une gouvernance et des responsabilités vérifiables avant et après l'achat.",
      democraticFunction:
        "La dépense publique en IA doit rester explicable et contrôlable : un organisme ne peut utiliser ce qu'il ne sait pas ouvrir.",
      tags: ['haut risque', 'marchés publics', 'gouvernance', 'documentation']
    },
    norm_edtech: {
      title: 'Plateformes éducatives et décisions importantes',
      reference: 'AI Act — annexe III (éducation et formation professionnelle)',
      explanation:
        "Les systèmes d'IA utilisés dans l'éducation pour évaluer, orienter ou décider de l'accès à des parcours et à des opportunités sont à haut risque. Ils exigent un contrôle humain effectif, la qualité et la minimisation des données, l'explicabilité envers les enseignants, les élèves et les familles, et la possibilité de contester. Un appui pédagogique ne doit pas devenir un verdict automatique.",
      notMeaning:
        "Cela ne signifie pas que toute plateforme éducative soit interdite : le régime dépend de l'effet sur les opportunités des élèves et de la présence d'un contrôle humain effectif.",
      democraticFunction:
        "Les opportunités éducatives ne peuvent dépendre d'un score opaque que les enseignants suivent et que les familles ne peuvent contester.",
      tags: ['haut risque', 'éducation', 'contrôle humain', 'explicabilité']
    },
    norm_gpai: {
      title: 'Modèles à usage général (GPAI) et usage en aval',
      reference:
        "AI Act — dispositions sur les modèles d'IA à usage général (GPAI) et obligations du déployeur",
      explanation:
        "Un modèle génératif à usage général n'est en soi ni interdit ni automatiquement à haut risque : le risque dépend de l'usage concret. Quand il entre dans des décisions importantes, il faut une révision humaine effective, la traçabilité, une politique d'usage aux frontières claires, le contrôle des données saisies et la transparence envers les utilisateurs. Les obligations portant sur le modèle (côté fournisseur) s'ajoutent à la responsabilité d'usage du déployeur.",
      notMeaning:
        "Cela ne signifie pas qu'utiliser un modèle à usage général soit interdit, ni que ce soit toujours à haut risque : compte la manière dont il est utilisé, où, et avec quelles garanties.",
      democraticFunction:
        "Un modèle qui rédige des projets de décision doit rester vérifiable : aucun acte ne peut reposer sur une sortie non contrôlée.",
      tags: ['GPAI', 'modèle génératif', 'usage en aval', 'déployeur']
    }
  },

  endings: {
    ending_opaca: {
      title: 'FIN 1 — VILLE OPAQUE',
      text:
        'La ville est efficace, mais les citoyens ne parviennent plus à comprendre, ' +
        'contester ou corriger les décisions automatisées. Les files avancent, les ' +
        'scores se mettent à jour, les notifications arrivent à l\'heure. Personne ne signe ' +
        'plus rien. Personne ne répond plus de rien.'
    },
    ending_fragile: {
      title: 'FIN 2 — GOUVERNANCE FRAGILE',
      text:
        "Quelques garanties ont été introduites, mais la ville reste vulnérable à " +
        "l'opacité, à la discrimination et à l'automatisation irresponsable. Les règles existent " +
        "par taches : là où l'inspection est passée, les systèmes répondent ; ailleurs, " +
        'ils décident encore seuls.'
    },
    ending_governata: {
      title: 'FIN 3 — INNOVATION GOUVERNÉE',
      text:
        "L'IA n'est pas bloquée, mais rendue visible, documentable, contestable et " +
        'contrôlable. La ville est encore automatisée — mais chaque système a un ' +
        'responsable, un registre et une porte à laquelle frapper.'
    },
    finalMessage:
      "L'AI Act n'élimine pas le risque. Il rend le risque visible, documentable, " +
      'contestable et gouvernable.'
  },

  // Fiches pédagogiques par dossier (v0.5). Visibles dans le débriefing
  // enseignant ; elles ne changent pas la solution des dossiers. Une fiche par
  // dossier jouable.
  caseLearning: {
    case_bias: {
      takeaway:
        "Les six conditions de l'article 4 bis sont cumulatives : un biais réellement corrigé ne régularise pas un traitement sans base juridique.",
      teaches:
        "La frontière entre ce que la norme permet et la manière dont on le fait, et la lecture des preuves : une pièce vraie — la correction a réussi — peut être celle qui égare.",
      typicalMistake:
        "Répondre « interdite » par excès de précaution, ou accepter le résultat comme preuve de licéité et s'arrêter à « complétons le registre ».",
      discussionQuestion:
        "Un fournisseur qui ne cherche pas les biais est plus à l'abri que celui qui les cherche mal. Est-ce un effet voulu de la norme ou un de ses défauts ?",
      aiActConcepts: ['Gouvernance des données', 'Haut risque', 'Protection dès la conception'],
      understandingSignal:
        "L'élève cite la transmission à un tiers ou le registre muet comme preuve décisive, et non le rapport sur la correction réussie.",
      classroomUse:
        "À associer à « AI Act et RGPD » : c'est le dossier où les deux règlements se touchent réellement, au lieu de se tenir côte à côte.",
      estimatedDebriefMinutes: 12
    },
    case_predpol: {
      takeaway:
        "L'exactitude ne rend pas licite une pratique interdite : la prévision individuelle d'infraction fondée sur le profilage est exclue à la racine.",
      teaches:
        "La frontière de l'article 5 en matière de police : profilage contre faits objectifs, et pourquoi l'« appui à la décision humaine » peut n'être qu'une étiquette.",
      typicalMistake:
        "Classer à haut risque et prescrire audit et contrôle, en traitant comme gouvernable une pratique que le règlement exclut.",
      discussionQuestion:
        "Si le système « fonctionne » à 92 %, pourquoi l'interdire au lieu de l'améliorer ?",
      aiActConcepts: ['Pratiques interdites', 'Profilage', 'Approche fondée sur le risque'],
      understandingSignal:
        "L'élève distingue un problème de qualité (corrigeable) d'une interdiction de finalité (non corrigeable).",
      classroomUse:
        "Excellent pour le débat sur la frontière : la moitié de la classe défend le fournisseur avec l'étude des 92 %, l'autre l'inspection avec l'art. 5.",
      estimatedDebriefMinutes: 12
    },
    case_frodi: {
      takeaway:
        "Dans l'aide sociale, le haut risque se joue sur le QUAND de la vérification humaine : un réexamen seulement sur recours arrive après le dommage.",
      teaches:
        "Contrôle effectif contre contrôle formel dans les prestations essentielles, et la lecture des preuves : l'analyse des erreurs pèse plus que le communiqué du fournisseur.",
      typicalMistake:
        "Tout bloquer (excès de précaution) ou s'arrêter à « informer les familles » sans toucher à la suspension automatique.",
      discussionQuestion:
        "Qui doit supporter le coût de l'erreur du système : l'administration qui vérifie avant, ou le citoyen qui forme un recours après ?",
      aiActConcepts: ['Haut risque', 'Contrôle humain', 'Gouvernance des données'],
      understandingSignal:
        "L'élève désigne la procédure opérationnelle (suspension automatique) comme preuve décisive, et non le taux d'erreur seul.",
      classroomUse:
        "À associer au dossier « crédit civique » : même domaine (aide sociale), solutions opposées — pourquoi ?",
      estimatedDebriefMinutes: 12
    },
    case_scoring: {
      takeaway:
        "Un score social généralisé ne se corrige pas par davantage de contrôles : il s'interdit.",
      teaches:
        "Certains usages de l'IA ne s'atténuent pas : ils s'interdisent. La notation sociale atteint la dignité et l'égalité.",
      typicalMistake:
        "Traiter une interdiction comme un système à haut risque à gouverner par audit et contrôle.",
      discussionQuestion:
        'Pourquoi certaines pratiques sont-elles interdites et non simplement encadrées ?',
      aiActConcepts: ['pratique interdite (art. 5)', 'notation sociale', 'dignité et égalité'],
      understandingSignal: "Le joueur reconnaît l'interdiction et impose le blocage, non un audit.",
      classroomUse: "Ouvrir la discussion sur les seuils non négociables de l'AI Act.",
      estimatedDebriefMinutes: 8
    },
    case_lavoro: {
      takeaway:
        "Dans l'emploi, l'IA n'est admise qu'avec des garanties effectives : données de qualité, contrôle réel, traçabilité.",
      teaches:
        'Les systèmes qui sélectionnent et évaluent les travailleurs sont à haut risque : ils exigent des garanties effectives.',
      typicalMistake:
        "Se contenter d'un contrôle humain de façade ou de la seule notification à la personne concernée.",
      discussionQuestion:
        "Quelles obligations rendent gouvernable un système à haut risque dans l'emploi ?",
      aiActConcepts: [
        'haut risque (annexe III)',
        'qualité des données',
        'contrôle humain',
        'journaux'
      ],
      understandingSignal:
        'Le joueur impose audit, contrôle et journaux au lieu de bloquer ou d\'ignorer.',
      classroomUse: 'Relier le dossier au recrutement et à la gestion du personnel réels.',
      estimatedDebriefMinutes: 10
    },
    case_media: {
      takeaway:
        "Qui regarde un contenu de synthèse a le droit de le savoir : le marquage est le minimum, pas le point d'arrivée.",
      teaches:
        'La transparence sur les contenus de synthèse est nécessaire, mais pas toujours suffisante.',
      typicalMistake:
        'Penser que marquer un contenu résout tout problème de manipulation.',
      discussionQuestion: "Quand informer l'utilisateur est-il nécessaire mais insuffisant ?",
      aiActConcepts: ['transparence (art. 50)', 'hypertrucage', 'contenus de synthèse'],
      understandingSignal:
        'Le joueur impose le marquage et explique pourquoi il protège la confiance publique.',
      classroomUse: 'Discuter communication institutionnelle et désinformation.',
      estimatedDebriefMinutes: 8
    },
    case_scuola: {
      takeaway:
        "La salle de classe n'est pas un laboratoire de surveillance émotionnelle : inférer les émotions à l'école est interdit.",
      teaches:
        "Inférer les émotions à l'école est interdit, sauf exceptions limitées : la salle de classe n'est pas un espace de surveillance émotionnelle.",
      typicalMistake:
        "Traiter la reconnaissance des émotions comme un système à auditer plutôt qu'à interdire.",
      discussionQuestion: 'Pourquoi le contexte éducatif reçoit-il une protection spéciale ?',
      aiActConcepts: [
        'pratique interdite (art. 5)',
        'reconnaissance des émotions',
        'contexte éducatif'
      ],
      understandingSignal:
        'Le joueur distingue observation licite et inférence automatique des émotions.',
      classroomUse: "Réfléchir à la surveillance et au bien-être à l'école.",
      estimatedDebriefMinutes: 8
    },
    case_ospedale: {
      takeaway:
        'Une moyenne excellente peut masquer des erreurs graves sur les plus vulnérables : regardez les sous-groupes, pas le total.',
      teaches:
        "L'IA en santé n'est pas interdite : elle doit être gouvernée, documentée et supervisée, surtout sur les groupes vulnérables.",
      typicalMistake:
        'Se fier à la moyenne excellente et ignorer les erreurs concentrées sur les sous-groupes.',
      discussionQuestion:
        'Comment gouverner un système prédictif sans le bloquer ni le subir ?',
      aiActConcepts: [
        'haut risque',
        'qualité des données',
        'contrôle humain',
        'surveillance après commercialisation'
      ],
      understandingSignal:
        'Le joueur ne coupe pas tout : il impose audit, journaux et contrôle effectif.',
      classroomUse: 'Discuter biais cliniques et responsabilité du déployeur en santé.',
      estimatedDebriefMinutes: 10
    },
    case_biometria: {
      takeaway:
        "Reconnaître des visages en temps réel dans l'espace public est le périmètre d'une interdiction, pas un détail technique.",
      teaches:
        "L'identification biométrique à distance en temps réel dans les espaces publics à des fins répressives est interdite, sauf exceptions limitativement énumérées.",
      typicalMistake:
        'Croire que tout usage biométrique est identique, en ignorant finalité et contexte.',
      discussionQuestion: 'Où passe la frontière entre sécurité et surveillance de masse ?',
      aiActConcepts: [
        'pratique interdite (art. 5)',
        'biométrie à distance',
        'espace public',
        'finalité répressive'
      ],
      understandingSignal:
        "Le joueur identifie le périmètre de l'interdiction : temps réel, espace public, répression.",
      classroomUse: 'Discuter vidéosurveillance et libertés dans les espaces publics.',
      estimatedDebriefMinutes: 9
    },
    case_credito: {
      takeaway:
        "Compte l'effet sur les personnes, pas le nom du système : un « score de fiabilité » peut être de la notation sociale.",
      teaches:
        'Tout score n\'est pas interdit : comptent la finalité, les données, le contexte, les effets et le contrôle humain effectif.',
      typicalMistake:
        "Croire que la mention « appui à la décision » suffit à rendre le système sûr.",
      discussionQuestion:
        "Quand un système d'évaluation devient-il un traitement défavorable interdit ?",
      aiActConcepts: [
        'notation sociale (art. 5)',
        'haut risque (annexe III)',
        'contrôle humain',
        'responsabilité du déployeur'
      ],
      understandingSignal:
        'Le joueur distingue notation sociale interdite et évaluation à haut risque.',
      classroomUse:
        'Frontière crédit / aide sociale : dossier miroir pour clore le parcours avancé.',
      estimatedDebriefMinutes: 12
    },
    case_chatbot: {
      takeaway:
        "Un canal automatique qui répond toujours ne suffit pas : il faut de la transparence et une sortie humaine.",
      teaches:
        "Un assistant public ne doit pas être interdit, mais rendu transparent et accompagné d'un canal humain : compte la confiance du citoyen.",
      typicalMistake:
        "Penser que la mention « purement informatif » suffit à reporter la responsabilité sur le citoyen ou sur le fournisseur.",
      discussionQuestion:
        'Quand un assistant automatique devient-il une source fiable pour le citoyen ?',
      aiActConcepts: [
        'transparence (art. 50)',
        'contrôle humain',
        'responsabilité du déployeur',
        'agent conversationnel public'
      ],
      understandingSignal:
        'Le joueur impose transparence et canal humain au lieu d\'interdire ou de se fier aveuglément.',
      classroomUse:
        'Discuter services publics numériques, confiance légitime et droit à une réponse humaine.',
      estimatedDebriefMinutes: 9
    },
    case_procurement: {
      takeaway:
        "Acheter un système d'IA sans documentation revient à acheter un risque qu'on ne peut pas gouverner.",
      teaches:
        "Les obligations du haut risque ne s'achètent pas avec une certification : il faut documentation, gouvernance et droits de contrôle.",
      typicalMistake:
        "Se contenter de « le fournisseur est certifié » et renoncer à la documentation, à l'audit et à l'accès.",
      discussionQuestion: "Que doit exiger une administration avant d'acheter un système d'IA ?",
      aiActConcepts: [
        'haut risque',
        "marchés publics d'IA",
        'documentation technique',
        'reddition de comptes',
        'dépendance au fournisseur'
      ],
      understandingSignal:
        "Le joueur demande documentation, droits d'audit et d'accès et responsabilités contractuelles, pas seulement une certification.",
      classroomUse:
        "Relier gouvernance de l'IA et achats publics réels, sans entrer dans le code des marchés publics.",
      estimatedDebriefMinutes: 11
    },
    case_edtech: {
      takeaway:
        'Une plateforme qui profile les élèves et oriente les décisions pédagogiques est à haut risque : elle doit être gouvernée, non subie.',
      teaches:
        "Toute plateforme éducative n'est pas interdite, mais si elle pèse sur les opportunités et les parcours, elle est à haut risque et exige un contrôle humain effectif.",
      typicalMistake:
        "Traiter un score de risque d'élève comme neutre et le suivre à la place du jugement de l'enseignant.",
      discussionQuestion:
        "Quand une recommandation pédagogique devient-elle une décision importante pour l'élève ?",
      aiActConcepts: [
        'haut risque (annexe III)',
        'éducation',
        'contrôle humain',
        'minimisation des données',
        'explicabilité'
      ],
      understandingSignal:
        'Le joueur distingue appui pédagogique et décision importante, et exige la contestabilité.',
      classroomUse: 'Réfléchir au profilage, à l\'équité et aux opportunités éducatives.',
      estimatedDebriefMinutes: 11
    },
    case_gpai: {
      takeaway:
        "Le modèle à usage général n'est pas le point : c'est l'usage en aval dans les décisions concrètes qui exige une gouvernance.",
      teaches:
        "Un modèle à usage général n'est pas automatiquement interdit ni à haut risque : le risque dépend de l'usage concret et se gouverne en aval.",
      typicalMistake:
        "Croire qu'un avertissement suffit, ou utiliser le modèle pour décider sans vérification ni traçabilité.",
      discussionQuestion:
        'Qui répond si un modèle à usage général est utilisé dans un processus décisionnel concret ?',
      aiActConcepts: [
        'GPAI',
        'modèle génératif',
        'usage en aval',
        'contrôle humain effectif',
        'gouvernance des données'
      ],
      understandingSignal:
        "Le joueur distingue ébaucher et décider, et impose une gouvernance de l'usage au lieu d'interdire ou d'ignorer.",
      classroomUse:
        "Discuter l'adoption de l'IA générative en entreprise et dans l'administration, et la responsabilité du déployeur.",
      estimatedDebriefMinutes: 12
    }
  },

  glossary: {
    title: 'GLOSSAIRE OPÉRATIONNEL',
    subtitle: "Notices brèves pour jouer et comprendre. Ce n'est pas un traité.",
    back: '◂ ARCHIVES',
    whyLabel: 'Pourquoi cela compte',
    relatedLabel: 'Dossiers liés',
    cautionLabel: 'Attention',
    prevButton: '◂ RETOUR',
    nextButton: 'SUIVANT ▸',
    counter: '{index}/{total}',
    entries: {
      prohibited_practice: {
        term: 'Pratique interdite',
        definition:
          "Usage de l'IA incompatible avec les droits fondamentaux, interdit par l'art. 5 indépendamment de tout audit ou garantie.",
        whyItMatters: 'Certains risques ne se gouvernent pas : ils s\'arrêtent.',
        caution:
          "Cela ne signifie pas que toute IA soit interdite : l'interdiction frappe des usages précis."
      },
      high_risk: {
        term: 'Haut risque',
        definition:
          "Système qui pèse sur les droits, la sécurité ou l'accès aux services : admis mais soumis à des obligations fortes (annexe III).",
        whyItMatters: 'Le risque doit être gouverné, non nié.',
        caution: 'Cela ne signifie pas interdit : cela signifie documenté, supervisé et vérifiable.'
      },
      transparency: {
        term: 'Transparence',
        definition:
          "Obligation de rendre reconnaissable l'interaction avec l'IA ou un contenu de synthèse (art. 50).",
        whyItMatters: 'Permet de distinguer le réel du généré.',
        caution: 'Cela ne signifie pas que le seul marquage suffise à éliminer le risque.'
      },
      challengeable: {
        term: 'Contestable',
        definition:
          "Une décision peut être correcte au fond mais fragile parce que mal motivée, fondée sur des preuves faibles ou imputée au mauvais responsable.",
        whyItMatters: "Enseigne qu'avoir raison ne suffit pas : l'acte doit tenir.",
        caution: 'Cela ne signifie pas fausse : cela signifie attaquable.'
      },
      provider: {
        term: 'Fournisseur',
        definition: "Celui qui développe ou met sur le marché le système d'IA.",
        whyItMatters: 'Définit les obligations de conception du système.',
        caution:
          "Cela ne signifie pas qu'il réponde de tout : le déployeur a aussi des obligations."
      },
      deployer: {
        term: 'Déployeur',
        definition:
          'Celui qui utilise le système sous sa propre autorité (par exemple un organisme public).',
        whyItMatters: "Beaucoup d'obligations d'usage retombent ici.",
        caution: 'Cela ne signifie pas qu\'il puisse tout reporter sur le fournisseur.'
      },
      human_oversight: {
        term: 'Contrôle humain',
        definition:
          'Supervision humaine effective sur les décisions automatisées, non seulement formelle.',
        whyItMatters: "Un humain qui suit toujours la machine n'est pas un contrôle.",
        caution: 'Cela ne signifie pas une signature de façade : il doit pouvoir peser réellement.'
      },
      social_scoring: {
        term: 'Notation sociale',
        definition:
          'Score qui évalue les personnes sur leur comportement social et produit des traitements défavorables dans des contextes sans rapport ou disproportionnés : interdit.',
        whyItMatters: "Atteint la dignité et l'égalité.",
        caution: 'Cela ne signifie pas que tout classement soit interdit.'
      },
      biometrics: {
        term: 'Biométrie',
        definition:
          "Identification à distance au moyen de données biométriques ; en temps réel et à des fins répressives dans les espaces publics, elle est interdite sauf exceptions.",
        whyItMatters: "L'espace public n'est pas une zone d'identification permanente.",
        caution:
          'Cela ne signifie pas que tout usage biométrique soit interdit : comptent la finalité et le contexte.'
      },
      emotion_recognition: {
        term: 'Reconnaissance des émotions',
        definition:
          "Inférence automatique des émotions ; à l'école et au travail, elle est interdite sauf exceptions limitées.",
        whyItMatters:
          'Protège les espaces éducatifs et professionnels de la surveillance émotionnelle.',
        caution: 'Cela ne signifie pas que toute observation du comportement soit interdite.'
      },
      deepfake: {
        term: 'Hypertrucage',
        definition:
          'Contenu de synthèse qui imite des personnes ou des événements réels ; il doit être rendu reconnaissable (art. 50).',
        whyItMatters: 'Défend la confiance dans les informations.',
        caution: 'Cela ne signifie pas que tout contenu généré par IA soit illicite.'
      },
      credit_welfare: {
        term: 'Crédit / aide sociale',
        definition:
          "Évaluations qui décident de l'accès à des prestations ou services : elles peuvent être à haut risque ou, si elles généralisent la vie sociale, de la notation sociale interdite.",
        whyItMatters: 'C\'est la frontière entre évaluation licite et score social.',
        caution: 'Cela ne signifie pas que toute évaluation économique soit interdite.'
      },
      gpai: {
        term: "GPAI — IA à usage général",
        definition:
          "Modèles d'IA à usage général soumis à leurs propres obligations de transparence et de gestion du risque systémique. Le risque pour qui les utilise dépend de l'usage concret en aval.",
        whyItMatters: "De plus en plus central dans l'écosystème de l'IA.",
        caution: 'Cela ne signifie pas que tout modèle à usage général soit à haut risque.'
      },
      public_chatbot: {
        term: 'Agent conversationnel public',
        definition:
          "Assistant automatique d'un organisme qui informe les citoyens sur des services, des conditions ou des échéances.",
        whyItMatters: "Crée une confiance légitime : il faut de la transparence et un canal humain.",
        caution:
          "Cela ne signifie pas qu'il soit interdit : il doit être rendu transparent et supervisé."
      },
      human_escalation: {
        term: 'Escalade humaine',
        definition:
          "Possibilité effective de passer d'un système automatique à une personne compétente.",
        whyItMatters: "Sans elle, l'automatisation devient un mur pour le citoyen.",
        caution:
          'Cela ne signifie pas tout refaire à la main : cela signifie une porte humaine quand il le faut.'
      },
      procurement_ai: {
        term: "Marchés publics d'IA",
        definition:
          "Achat public de systèmes d'IA : la gouvernance se décide déjà dans le cahier des charges et dans le contrat.",
        whyItMatters: "Qui ne demande pas documentation et contrôle avant ne les obtient pas après.",
        caution:
          "Cela ne signifie pas qu'acheter de l'IA soit illégitime : il faut le faire avec des garanties."
      },
      technical_documentation: {
        term: 'Documentation technique',
        definition:
          "Ensemble d'informations qui décrivent le système, les données, les limites et les contrôles, et permettent sa vérification.",
        whyItMatters: 'Sans documentation, on ne peut ni expliquer ni contester une décision.',
        caution:
          'Cela ne signifie pas un amas de papiers : elle sert à rendre le système vérifiable.'
      },
      lock_in: {
        term: 'Dépendance au fournisseur',
        definition:
          "Dépendance envers un fournisseur qui rend difficile de changer de système, d'accéder aux données ou de contrôler leur fonctionnement.",
        whyItMatters: "Réduit la capacité de l'organisme à gouverner et à corriger.",
        caution:
          "Cela ne signifie pas que toute fourniture crée une dépendance : cela dépend des clauses et des droits d'accès."
      },
      adaptive_edtech: {
        term: 'Plateforme éducative adaptative',
        definition:
          'Système qui profile les élèves et adapte parcours, suggestions ou priorités pédagogiques.',
        whyItMatters: "S'il pèse sur les opportunités ou l'évaluation, il devient à haut risque.",
        caution:
          "Cela ne signifie pas que toute EdTech soit interdite : compte s'il décide ou s'il appuie seulement."
      },
      generative_model: {
        term: 'Modèle génératif',
        definition:
          "Système qui produit du texte ou des contenus à la demande ; il peut se tromper ou « halluciner ».",
        whyItMatters: 'Utilisé pour décider sans vérification, il fait entrer des erreurs dans les actes.',
        caution:
          "Cela ne signifie pas qu'il soit toujours peu fiable : il doit être vérifié et gouverné dans son usage."
      },
      data_governance: {
        term: 'Gouvernance des données',
        definition:
          "Règles sur les données utilisées, leur conservation, qui y accède et pourquoi — y compris minimisation et traçabilité.",
        whyItMatters: 'Maintient les données proportionnées à la finalité et les systèmes vérifiables.',
        caution:
          'Cela ne signifie pas tout collecter « par sécurité » : cela signifie n\'utiliser que le nécessaire.'
      }
    }
  }
  ,
  learningLayer: {
    notebook: {
      button: 'CARNET',
      title: "CARNET D'ENQUÊTE",
      intro:
        "Ce que vous avez déjà établi, rassemblé en un seul endroit : dossiers clos, responsables retenus, schémas confirmés et questions laissées ouvertes.",
      factsLabel: 'Dossiers clos ({n})',
      factsEmpty: 'Aucun dossier clos pour le moment.',
      evidenceLine: 'preuves décisives citées : {cited}/{total}',
      trapSpotted: 'vous avez cité aussi le compte rendu qui minimisait',
      actorsLabel: 'Qui en a été retenu responsable',
      actorsEmpty: 'Aucun responsable identifié pour le moment.',
      patternsLabel: 'Schémas par chapitre',
      patternConfirmed: 'schéma confirmé',
      patternProgress: '{done}/{total} dossiers clos',
      openLabel: 'Questions ouvertes',
      openEmpty: 'Aucune question laissée en suspens.',
      openReasons: {
        unsure: 'vous vous étiez déclaré incertain',
        revise: 'vous vouliez le revoir',
        miscalibrated:
          'beaucoup de confiance, une issue avec une observation : cela vaut une relecture'
      },
      announce: "Carnet d'enquête : {n} dossiers clos, {open} questions ouvertes.",
      close: 'Fermer'
    },
    chapters: {
      button: 'CHAPITRES',
      title: 'Chapitres du parcours',
      intro:
        "Quatre chapitres thématiques regroupent les 11 dossiers. C'est un ordre conseillé, non une contrainte : chaque dossier reste librement ouvrable depuis la carte.",
      orderLabel: 'Chapitre {order} sur {total}',
      durationLabel: '~{minutes} min',
      completionLabel: '{done}/{total} dossiers clos',
      completeTag: 'TERMINÉ',
      debriefLabel: 'Débriefing du chapitre',
      objectivesLabel: 'Objectifs',
      close: 'Fermer',
      defs: {
        prohibited: {
          title: 'Pratiques interdites',
          intro:
            "Où passe la ligne de ce qu'aucune mesure ne peut régulariser : scores sociaux, émotions déduites, visages dans la foule, crédit civique.",
          debrief:
            "Le fil des quatre dossiers : quand un système conditionne des droits fondamentaux par son fonctionnement même — et non par sa configuration — la réponse n'est pas de le corriger, c'est de l'arrêter."
        },
        high_risk: {
          title: 'Systèmes à haut risque',
          intro:
            "Permis mais sous des obligations sévères : recrutement, triage sanitaire, plateformes éducatives. On y apprend à distinguer l'interdit du mal gouverné.",
          debrief:
            "Le fil des trois dossiers : le haut risque n'interdit pas la technologie — il exige des données de qualité, de la documentation et un contrôle humain capable de dire non."
        },
        transparency: {
          title: 'Transparence',
          intro:
            "Contenus de synthèse et guichets automatiques : c'est la tromperie, non la technologie, qui pose problème. Les personnes ont le droit de savoir avec quoi elles interagissent.",
          debrief:
            "Le fil des deux dossiers : un marquage manquant paraît un détail, mais il érode la confiance de tous en tout — c'est là le dommage systémique."
        },
        governance: {
          title: 'Gouvernance et GPAI',
          intro:
            "Marchés opaques et modèles à tout faire utilisés en aval : les dossiers les plus ambigus, où la responsabilité se répartit le long de la chaîne.",
          debrief:
            "Le fil des deux dossiers : acheter ou réutiliser un système ne transfère pas la responsabilité — il la multiplie le long de la chaîne."
        }
      }
    },
    objectives: {
      obj_prohibited_boundary: 'Reconnaître la frontière des pratiques interdites',
      obj_risk_classification: "Classer le risque d'un système",
      obj_decisive_evidence: 'Sélectionner les preuves décisives',
      obj_actor_responsibility: 'Attribuer la responsabilité correcte',
      obj_proportionate_measures: 'Choisir des mesures proportionnées',
      obj_transparency_duties: 'Appliquer les obligations de transparence',
      obj_human_oversight: 'Évaluer le contrôle humain effectif',
      obj_context_dependence: "Peser le contexte d'usage",
      obj_gpai_downstream: 'Gouverner les modèles GPAI en aval'
    },
    confidence: {
      label: 'Avant de signer : à quel point êtes-vous sûr de votre rapport ?',
      optionalTag: '(facultatif — ne change pas le score)',
      levels: { low: 'Peu', mid: 'Assez', high: 'Très' },
      keysHint: 'Touches 7 à 9',
      recorded: 'Confiance notée : {level}'
    },
    metacognition: {
      label: 'Calibrage',
      line: 'Confiance déclarée : {confidence} · Issue : {outcome}.',
      calibrated: 'Confiance et issue cohérentes : bon calibrage.',
      overconfident:
        "La confiance dépassait l'issue : relisez la preuve décisive dans le débriefing.",
      underconfident:
        'Issue meilleure que la confiance déclarée : votre raisonnement tient mieux que vous ne le pensez.'
    },
    reflection: {
      label: 'Réflexion (facultative)',
      prompt: 'Votre rapport résisterait-il à un recours ?',
      options: { holds: 'Oui, il tient', unsure: 'Je ne suis pas sûr', revise: 'Je le reverrais' },
      thanks: 'Noté — uniquement sur votre appareil.'
    },
    selfCheck: {
      titlePre: 'Autocontrôle initial',
      titlePost: 'Autocontrôle final',
      buttonPre: 'Autocontrôle initial (facultatif)',
      buttonPost: 'Autocontrôle final (facultatif)',
      formative:
        "Outil formatif LOCAL : ce n'est pas une évaluation certifiée, il n'est envoyé à personne et il s'effacera avec la réinitialisation de la partie.",
      questionLabel: 'Question {i} sur {total}',
      skip: 'Passer',
      resultLine: 'Réponses correctes : {correct} sur {total}.',
      compareLine: 'Autocontrôle initial : {correct} sur {total}.',
      close: 'Fermer',
      questions: {
        sc_prohibited: {
          q: "Laquelle de ces situations est une pratique INTERDITE par l'AI Act ?",
          options: [
            'Un agent conversationnel municipal qui répond à des questions sur les services',
            "Un score social public qui conditionne l'accès aux services",
            'Un filtre anti-spam dans la messagerie électronique'
          ]
        },
        sc_high_risk: {
          q: 'Que signifie qu\'un système est « à haut risque » ?',
          options: [
            'Il est interdit de l\'utiliser',
            "Il est expérimental et pas encore testé",
            'Il est permis, mais sous des obligations sévères sur les données, la documentation et le contrôle'
          ]
        },
        sc_transparency: {
          q: "Un organisme utilise un agent conversationnel avec les citoyens. Qu'exige l'AI Act ?",
          options: [
            'Que les personnes sachent qu\'elles interagissent avec une machine',
            "Que l'agent soit éteint en dehors des heures d'ouverture",
            'Rien : les agents conversationnels ne sont pas couverts par le règlement'
          ]
        },
        sc_oversight: {
          q: 'Quand le contrôle humain est-il réellement « effectif » ?',
          options: [
            'Quand une personne signe les décisions du système',
            'Quand le système est très exact',
            "Quand celui qui supervise comprend le système et peut renverser son résultat"
          ]
        },
        sc_actor: {
          q: "Qui répond de l'USAGE correct d'un système d'IA acheté à un fournisseur ?",
          options: [
            'Seulement le fournisseur qui l\'a développé',
            "Aussi celui qui l'utilise (le déployeur), pour l'usage concret",
            'Personne, si le système est certifié'
          ]
        },
        sc_context: {
          q: 'La même technologie peut-elle changer de catégorie de risque ?',
          options: [
            "Oui : cela dépend du contexte d'usage et de qui en subit les effets",
            "Non : la catégorie dépend seulement de l'algorithme",
            'Seulement si le fournisseur change'
          ]
        }
      }
    }
  }
  ,
  a11y: {
    readingShow: "Texte de l'écran",
    readingHide: 'Masquer le texte',
    readingNote:
      'Panneau en lecture seule : les actions s\'exécutent dans le jeu, au pointeur ou au clavier.',
    mobileContinue: 'Continuer quand même',
    outcomeAnnounced: 'Issue du rapport : {outcome}.',
    mapTitle: 'Carte civique',
    mapHint: 'Flèches pour parcourir les dossiers ouverts, ENTRÉE pour ouvrir celui sélectionné.',
    selectedCase: 'Sélectionné : {name}',
    evidenceHint:
      'Touches 1 à {n} : ouvrir une pièce, puis les presser de nouveau pour la citer. ENTRÉE poursuit dès que possible.',
    evidenceCited: 'citée dans le rapport',
    decisionTitle: 'Décision — {step}',
    reportTitle: "Rapport d'inspection",
    briefingTitle: 'Briefing initial',
    finaleTitle: 'Rapport final'
  }
};

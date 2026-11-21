# Plan de vérification du parcours guidé

[Italiano](../METHODOLOGY_TEST_PLAN.md) · [English](../en/METHODOLOGY_TEST_PLAN.md) · [Français](METHODOLOGY_TEST_PLAN.md)

Avant la modification. Les matrices A, B et C ont été rédigées dans METHODOLOGY.md et LEGAL_LEARNING_MATRIX.md. Le code initial propose une aide contextuelle, la comparaison, un rapport avec des justifications prédéfinies, un débriefing et la révision des dossiers. À ce stade initial, il manque une production autonome et une comparaison explicite entre interprétation initiale et retour.

## Critères techniques

| ID | Scénario | Critère observable |
|---|---|---|
| T1 | Ouverture normale depuis CaseScene | Parcours guidé proposé comme action facultative en IT/EN/FR |
| T2 | Compréhension et hypothèse | Lecture de l'objectif, hypothèse écrite avant les pièces, passage à Evidence |
| T3 | Révision pendant l'enquête | Hypothèse initiale toujours lisible, hypothèse actuelle modifiable |
| T4 | Signature | Note autonome avant le retour dans le parcours choisi ; possibilité de passer cette étape |
| T5 | Après le retour | Note signée relisible, sans écrasement par la réflexion ultérieure |
| T6 | Nouvelle séance et rechargement | Notes temporaires absentes des sauvegardes, exports et données télémétriques |
| T7 | Échap et fenêtre modale | Fermeture du dialogue, restitution du focus et des commandes ; aucune touche ne signe derrière le dialogue ; les clics dans le carnet ne modifient pas les pièces sous-jacentes |
| T8 | Tactile et clavier | Toutes les actions accessibles, champ de texte étiqueté, focus confiné dans le dialogue |
| T9 | Mise en page | 320/390 px, ordinateur, zoom simulé à 200 %, faible hauteur et 4K avec défilement interne |
| T10 | Catalogue | Maintien des 14 dossiers et des langues ; évaluation et migration V1/V2 conformes aux fixtures existantes |
| T11 | Récupération | Fermer le dialogue ou changer de scène ne laisse ni superposition, ni écouteur, ni focus bloqué |
| T12 | Réseau | Aucun texte saisi dans les charges de collecte ; aucun nouveau point de terminaison |
| T13 | Médiations contextuelles | Ouverture, source, relation, incertitude et débriefing pour chaque dossier en IT/EN/FR ; aucune solution affichée avant le retour |
| T14 | Provenance et relations | Relecture des seules sources déjà ouvertes, note par source, paire distincte avec explication libre ; aucun jugement automatique du lien |
| T15 | Révision explicite | Première hypothèse intacte, révisions motivées consultables, note signée et relations immuables après le retour |
| T16 | Débriefing complet | Choix, règle, note antérieure, usage du retour, projet d'application ; synthèse de tous les dossiers guidés terminés |
| T17 | Épreuve indépendante | Deux formes × trois langues, quatre sources nouvelles, aucun menu de réponses ; texte bloqué à la remise et débriefing indisponible avant |
| T18 | Observation et grille | Sept lignes d'observation, six dimensions manuelles, absence distinguée de 0, aucun total, justesse juridique séparée |
| T19 | Séparation recherche/public | Matériaux et outil Study 02 exclus de dist et des imports du jeu ; pas de POST ni de persistance automatique dans le laboratoire |

Commandes prévues : npm run typecheck, npm test, npm run build, npm run audit:seo, npm run verify:dist, npm run smoke:guided-inquiry, npm run smoke:release-cases et npm run smoke:final-modes. Les vérifications techniques ne constituent ni validation pédagogique ni certification d'accessibilité.

Ordre de réalisation demandé. Rédiger toutes les médiations, les composants, les matériaux de transfert et les outils d'observation avant de commencer les tests. Exécuter ensuite la suite complète, le parcours guidé sur 14 dossiers × trois langues et six profils de mise en page, Study 02 sur deux formes × trois langues × PRE/POST, puis les régressions du catalogue et des modes. Une correction issue des tests impose une nouvelle exécution des contrôles concernés avant livraison. Les tests utilisent des données synthétiques et ne prouvent aucun apprentissage humain.

Le fichier existant telemetryMetrics.ts comprend contradictoryEvidenceRecognized, indicateur dérivé de l'ouverture de certaines catégories de pièces. Son nom peut suggérer davantage que ce que démontre le comportement. Dans Study 02, le traiter comme un indicateur technique d'exposition ; ne pas en inférer la reconnaissance d'une contradiction sans explication du participant. Cet incrément ne change pas le schéma télémétrique.

## Protocole humain à réaliser

Recruter débutants et personnes expérimentées, avec consentement à l'observation et aux notes. Une première itération de 5–8 participants par profil peut révéler des obstacles sans estimer l'efficacité. Noter contexte CEPAJe, langue, dispositif, aide, interruptions et difficultés de lecture.

Tâches : expliquer l'objectif de la classification, formuler une hypothèse, trouver et relier deux sources, proposer une alternative, écrire avant la signature, relire après le retour et motiver une révision ou une confirmation. Le facilitateur distingue réussite autonome, réussite aidée, non-achèvement, erreur grave et raison déclarée. Le nombre de clics ne doit pas être qualifié de pensée critique.

Critères de révision. Sortie du dialogue impossible, signature involontaire, perte de texte dans une même séance ou consigne révélant la solution exigent une correction avant d'élargir le prototype. Définir dans le pilote un seuil opérationnel de compréhension, par exemple au moins quatre débutants sur cinq capables d'expliquer la tâche avec leurs mots. Rapporter aussi les cas discordants. Ce seuil est une décision de produit, pas un test d'efficacité.

Vérifier les lecteurs d'écran réels, la dictée ou transcription médiée, le clavier et le tactile avec clavier virtuel. Prévoir une restitution orale équivalente pour les personnes rencontrant des obstacles à l'écriture. Les trois langues nécessitent une révision humaine avant le recrutement de Study 02.

Ce document est le plan méthodologique d'origine. Sa traduction ne relance pas ses smoke tests : la correction de localisation V5.0.1 est vérifiée par contrôles linguistiques statiques, tests unitaires et compilation uniquement, à la demande du propriétaire.

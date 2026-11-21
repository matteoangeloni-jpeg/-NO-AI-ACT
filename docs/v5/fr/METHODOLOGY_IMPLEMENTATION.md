# Incrément méthodologique V5 — couverture complète

[Italiano](../METHODOLOGY_IMPLEMENTATION.md) · [English](../en/METHODOLOGY_IMPLEMENTATION.md) · [Français](METHODOLOGY_IMPLEMENTATION.md)

Branche de travail `codex/v5-methodology-guided-path`, base main `527fde5`. Révision du 21 novembre 2026. Ce rapport consigne l'achèvement local avant publication. Le propriétaire a ensuite autorisé V5.0.0 ; l'état du déploiement et les notes figurent dans la release GitHub et [RELEASE_NOTES_v5.0.0.fr.md](../../RELEASE_NOTES_v5.0.0.fr.md).

## Modifications implémentées

| Composant | Comportement |
|---|---|
| CaseScene et inquiryCases | Trois temps introductifs et cinq médiations propres à chacun des 14 dossiers, en IT/EN/FR |
| EvidenceScene et carnet | Relecture des documents ouverts, évaluation de la provenance, liens libres entre deux sources avec une raison |
| GuidedInquirySession | Première hypothèse conservée, révisions motivées enregistrées explicitement, copie immuable de l'argumentation, des sources et des relations avant le retour |
| DecisionScene | Rappel contextuel, aide réouvrable et note autonome : thèse, preuves, raisonnement, alternative et incertitude avant signature |
| ReportScene | Choix et règle du dossier, note antérieure, réflexion, vérification du retour et projet d'application distincts |
| SessionEndScene | Débriefing de tous les dossiers guidés terminés, synthèse transversale et stratégie pour d'autres contextes |
| Dialogue accessible | HTML sémantique, étiquettes, listes et détails natifs, Échap, focus confiné puis rétabli, défilement interne ; pointeur et clavier isolés de la scène |
| Study 02 local | Deux formes nouvelles, quatre sources originales par forme dans trois langues, texte libre bloqué à la remise, aucune correction automatique |
| Observation et grille | Contexte CEPAJe, sept lignes d'observation, six dimensions de codage humain, justesse juridique séparée |
| Séparation des données | Notes du jeu uniquement en mémoire ; laboratoire hors dist, serveur GET/HEAD sur boucle locale, téléchargement local explicite uniquement |

Le parcours préserve récit, 14 dossiers, justifications prédéfinies, résultats et scores d'origine. Écrire ou proposer un lien n'attribue aucun point et ne produit aucune évaluation de pensée critique. Les médiations interrogent preuves et circonstances sans annoncer une solution juridique avant le retour. La matrice C documente le rapprochement avec le texte UE consolidé du 27 juillet 2026 vérifié sur EUR-Lex.

## Traçabilité et matériaux

Les matrices A/B, la carte LM–GM, l'analyse CEPAJe et la bibliographie figurent dans METHODOLOGY.md ; la matrice C dans LEGAL_LEARNING_MATRIX.md. COVERAGE_COMPLETION.md relie les comportements demandés aux composants. ARGUMENTATION_STUDY02.md présente grilles, protocole, triangulation et plan d'analyse. Les courriels originaux ont été lus ; leurs références et leur traçabilité privée restent dans le dossier du propriétaire, hors version publique. Aucun retour n'est présenté comme une approbation du produit.

## Vérification finale

L'implémentation a été achevée avant les nouveaux tests, conformément à la demande. Les résultats de la version partielle précédente ne certifient pas cet incrément. La vérification finale et ses résultats sont consignés dans TEST_RESULTS.md après exécution. Les tests automatiques utilisent uniquement des matériaux synthétiques et des fixtures explicites.

Commandes : `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:seo`, `npm run verify:dist`, `npm run smoke:guided-inquiry`, `npm run smoke:study02`, `npm run smoke:release-cases`, `npm run smoke:final-modes`.

## Utilisation locale

Jeu : `npm run dev`, ouvrir `/play/?lang=fr`, choisir un dossier et PARCOURS GUIDÉ. La médiation précède les pièces. Les notes sont facultatives et disparaissent au rechargement ou à une nouvelle partie ; le texte saisi n'entre ni dans les sauvegardes, ni dans les exports du jeu, ni dans la télémétrie.

Étude : `npm run study02:local`, ouvrir `http://127.0.0.1:4262/` et sélectionner Français. PRE/POST utilisent des onglets séparés et des formes contrebalancées. L'outil ne gère ni identité, ni consentement, ni randomisation, ni recrutement, ni conservation institutionnelle : ces éléments relèvent du protocole externe autorisé. Le débriefing est désactivé avant la remise. Le téléchargement explicite conserve sur l'appareil le texte remis et les notes humaines.

Référence des smoke tests : `CHROMIUM_PATH` permet de sélectionner Chrome installé. `INQUIRY_PORT` choisit le port. `INQUIRY_ONLY` limite un profil à des fins diagnostiques ; la vérification méthodologique complète d'origine utilisait tous les profils. La couverture guidée comprend 14 dossiers × trois langues et trois autres profils de mise en page, soit 45 parcours. Study 02 comprend deux formes × trois langues × PRE/POST, soit 12 configurations. Ces commandes documentent cette vérification ; elles ne sont pas relancées pour la correction de localisation.

Sur cette machine Windows, `INQUIRY_4K_GPU=d3d11` demande Direct3D pour le seul profil 3840×2160 ; les autres profils utilisent le rendu logiciel du test. Le moteur effectif est enregistré dans chaque résultat et cette différence doit être signalée lors d'une reproduction. Le démarrage 4K uniquement logiciel a dépassé 90 secondes dans le Preload préexistant ; le diagnostic GPU a atteint Title en environ 5,6 secondes. Cette mesure n'est pas une estimation généralisable des performances.

## Limites ouvertes

- La couverture des contenus et fonctions se distingue de la validité pédagogique. Pilotes avec débutants, observation, productions et épreuve indépendante restent nécessaires ; aucune étude humaine n'a été réalisée.
- Grille, équivalence des formes et traductions sont préliminaires : révision bilingue, entretiens cognitifs, exemples d'ancrage et accord interévaluateurs restent nécessaires.
- Les médiations sont textuelles. Densité, rythme et autonomie doivent être examinés dans le contexte CEPAJe ; une restitution orale équivalente exige une médiation autorisée.
- Lecteurs d'écran réels, dictée, clavier virtuel et appareils physiques requièrent des essais humains. Les vérifications automatiques ne certifient pas une accessibilité universelle.
- La note autonome suit les alternatives du rapport. Leur éventuel effet d'orientation est pris en compte méthodologiquement par l'épreuve externe.
- La première note est une déclaration du joueur. Une exposition antérieure au dossier peut l'influencer ; la référence de recherche est le PRE indépendant, avant le jeu, dans une séance nouvelle.
- Les notes du jeu ne sont pas un suivi individuel. Ouvrir ou réviser ne prouve pas la compréhension : la triangulation repose sur les explications et l'observation humaine externe.
- Les nouveaux matériaux nécessitent une révision juridique humaine avant administration. Les réponses des 14 dossiers n'ont pas changé.
- La bibliographie est une recension ciblée ; les limites d'accès aux textes intégraux figurent dans chaque entrée.
- Le rapport technique original précède la publication ; l'état du déploiement est documenté séparément dans V5.0.0.

## Livrables

| Demande | Résultat |
|---|---|
| Méthode et bibliographie européenne | METHODOLOGY.md |
| Matrice des retours | Matrice A et COVERAGE_COMPLETION.md ; dossier privé séparé |
| LM–GM | METHODOLOGY.md |
| CEPAJe | METHODOLOGY.md ; contexte dans le laboratoire |
| Parcours guidé | inquiryCases, GuidedInquiryDialog et scènes du jeu |
| Cycle et retour | Révisions, note figée et réflexion distincte |
| Grille | ARGUMENTATION_STUDY02.md et laboratoire manuel |
| Transfert Study 02 | Deux formes complètes dans research/study02 |
| Tests | METHODOLOGY_TEST_PLAN.md et TEST_RESULTS.md |
| Modifications et limites | Ce document |

# Couverture opérationnelle des retours

[Italiano](../COVERAGE_COMPLETION.md) · [English](../en/COVERAGE_COMPLETION.md) · [Français](COVERAGE_COMPLETION.md)

Incrément demandé par le propriétaire le 21 novembre 2026. Cette liste définit le travail à implémenter avant de commencer la nouvelle vérification finale.

| Exigence | Implémentation | Composant vérifiable |
|---|---|---|
| A1 — compréhension des débutants | Médiation spécifique à chacun des 14 dossiers, dans les trois langues | inquiryCases.ts ; dialogue, 42 fiches |
| A2 — scènes dans la séquence | Introduction progressive, aide contextuelle entre pièces et classification, guide réouvrable | CaseScene, trois temps courts ; DecisionScene, method |
| A3 — débriefing final | Reconstituer les raisons, comparer aux règles et au retour du dossier, synthétiser en fin de séance | ReportScene ; SessionEndScene ; feedback et session |
| P1 — exploration des sources | Relire les pièces déjà ouvertes, évaluer leur provenance et leur fiabilité en donnant des raisons | sources et writeSource ; observation humaine séparée |
| P2 — corrélation | Paires de sources reliées par le joueur, avec relation et explication | relate, relation supports/challenges/uncertain, aucune correction automatique |
| P3 — hypothèses et révision | Première hypothèse préservée, révisions explicites accompagnées de raisons | finishIntroduction ; recordRevision ; snapshot |
| P4 — argumentation autonome | Thèse, preuves, alternative, lien logique vers mesure et responsabilité avant le retour | argument, reasoning ; submit avant resolve |
| P5 — incertitude | Informations manquantes et conséquences pour les personnes et leurs droits | uncertainty ; médiation différente pour chaque dossier |
| P6 — usage du retour | Comparaison avec son texte antérieur, critère maintenu ou révisé, projet pour un nouveau dossier | reflection, feedbackUse, transferPlan ; synthèse de séance |
| P7 — observation et triangulation | Outil local séparé pour l'observation structurée et le codage humain par grille | Study 02 : sept lignes, six dimensions, contexte CEPAJe |
| P8 — transfert indépendant | Deux formes complètes IT/EN/FR, documents originaux, réponse libre figée avant le débriefing, outil local fonctionnel | research/study02 ; serveur local GET/HEAD ; 12 configurations |
| Limites du dispositif | Les 14 dossiers originaux, migrations et scores existants, notes temporaires, matériaux de recherche exclus de la version publique | Tests du catalogue, sauvegardes, confidentialité, réseau et dist |

La couverture opérationnelle concerne les contenus et les fonctions. L'efficacité et la validité des inférences nécessitent des participants, des réviseurs et une analyse selon le protocole Study 02. Le rapport final distingue implémentation, vérification technique et vérification humaine.

Les tests ont commencé après l'implémentation de toutes les lignes. Les corrections issues de la vérification finale ont été suivies de nouvelles exécutions. TEST_RESULTS.md consigne la réussite de 1 509 tests unitaires, 45 parcours guidés, 42 parcours standard, 12 configurations mode/langue et 12 configurations Study 02, en précisant les limites effectives de la vérification.

Ces identifiants opérationnels détaillent les retours P1–P5 de la matrice méthodologique A : P1–P5 opérationnels explicitent principalement sa ligne P2 ; P6 explicite P4 ; P7/P8 réalisent P3/P5. Ils n'attribuent aucune observation nouvelle aux personnes consultées. Les critères pédagogiques et les limites d'interprétation restent ceux des matrices A/B.

# NO AI ACT V5 — conception méthodologique


> Édition linguistique V5.3.0 · 23 novembre 2026. Le dossier et les matériaux locaux de Study 02 sont désormais disponibles dans les six langues. Les dates, nombres et résultats du prototype décrivent les exécutions historiques. Le contrat actuel du registre facultatif réservé aux adultes figure dans SESSION_JOURNAL.md et remplace la restriction antérieure aux seuls agrégats. Les traductions ne démontrent ni équivalence des instruments, ni efficacité éducative, ni validité de la grille. Aucun nouveau test pour cette mise à jour des contenus.



Révision du 21 novembre 2026. Base vérifiée dans la branche locale depuis main 527fde5. Le déploiement de la PR 128 a réussi. Le propriétaire a ensuite autorisé V5.0.0 ; notes et état du déploiement figurent dans [RELEASE_NOTES_v5.0.0.fr.md](../../RELEASE_NOTES_v5.0.0.fr.md) et la release GitHub.

## Décision de conception

Compréhension → Hypothèse → Enquête → Argumentation → Retour → Transfert constitue une structure provisoire autorisant des retours de l'enquête à l'hypothèse, puis du retour à une nouvelle enquête. Une progression strictement linéaire empêcherait précisément la révision que nous souhaitons observer. La première hypothèse reste visible lors de sa reformulation. La note antérieure au retour est figée avant la signature et distincte de la réflexion ultérieure.

Le parcours guidé se choisit dans le dossier. Les courtes scènes de médiation mobilisent la collègue inspectrice et les documents du récit. La classification sert à déterminer contrôles, mesures et acteurs à considérer. L'apprenant doit pouvoir signaler une information manquante et poursuivre sans écrire. Éviter les récompenses liées à la quantité de texte ou à la fréquence des révisions.

Couverture de l'incrément complet : chacun des 14 dossiers propose cinq médiations originales en italien, anglais et français — ouverture narrative, provenance des sources, relation entre preuves, incertitude et débriefing. La première scène comprend trois temps courts ; un rappel contextuel précède la décision et peut être rouvert. Le carnet permet de relire les pièces ouvertes, de commenter leur provenance et de proposer librement des paires de sources accompagnées de raisons. Il ne juge pas la justesse du lien. L'historique ne contient que les révisions explicitement enregistrées par le joueur avec une raison, et non un journal automatique des comportements.

La note avant signature explicite le passage des preuves à la classification, à la mesure et à la responsabilité. Après le retour, révision, confrontation du retour à une preuve et projet pour un autre dossier restent distincts. Le débriefing de séance compare les dossiers guidés terminés et produit une synthèse. Le laboratoire local séparé `research/study02/` propose observation structurée et deux tâches indépendantes ; il est exclu du jeu public. La traçabilité opérationnelle complète figure dans COVERAGE_COMPLETION.md. Les vérifications techniques suivent l'implémentation complète ; leurs résultats figurent dans le rapport d'implémentation.

## A. Des retours à la vérification

Les sources directes ont été consultées dans les courriels autorisés des 18 et 19 novembre 2026. Le registre nominatif et les références privées restent dans le dossier remis au propriétaire. Les identifiants suivants permettent la traçabilité dans le code sans reproduire de correspondance privée.

| ID | Retour direct, paraphrasé | Problème pédagogique | Mécanique V5 | Critère de vérification |
|---|---|---|---|---|
| A1 | La fonction évaluative prédomine | Des connaissances sont exigées sans médiation suffisante | Scène de la collègue avant les pièces, lecture de la finalité et du contexte | Le débutant explique la tâche et une question d'enquête sans connaître la solution |
| A2 | Les débutants nécessitent des médiations intégrées | Aide procédurale détachée de la compréhension | Exemple bref : déclaration d'une source contre fonctionnement observé, puis hypothèse sur le dossier | Distinguer affirmation et preuve en précisant la provenance |
| A3 | Un débriefing final est nécessaire | Le verdict du système clôt la réflexion | Relecture de l'hypothèse, note signée, révision et question pour le dossier suivant | Expliquer un choix maintenu ou révisé avec une raison |
| P1 | La réussite ludique ne suffit pas à inférer une pensée critique | Confusion entre résultat et processus | Note autonome avant signature, distincte des justifications prédéfinies | Des évaluateurs humains repèrent un lien preuve → jugement |
| P2 | Observer sources, corrélations, révisions et incertitude | Clics et durées admettent des explications ambiguës | Carnet avec hypothèse initiale, relation entre sources, alternative et lacune | L'observateur relie les actions à l'explication du participant |
| P3 | Les alternatives peuvent enseigner la logique attendue du dispositif | Reconnaissance de la réponse attendue | Écriture autonome et tâche externe sans alternatives de réponse | Comparer justification dans le jeu et tâche nouvelle |
| P4 | Le retour doit être retravaillé | Copie de l'explication après la réponse | Note antérieure bloquée et champ ultérieur séparé | Identifier l'élément ayant modifié son critère |
| P5 | Intégrer observation, restitution et transfert | Un rapport du jeu est une preuve partielle | Protocole Study 02 et grille à double codage | Convergence des indices, désaccords rapportés et limites explicites |

## B. Résultats d'apprentissage et indices observables

| Objectif local | Action du joueur | Indice observable dans une séance autorisée | Limite d'interprétation |
|---|---|---|---|
| Comprendre finalité et contexte | Reformuler le problème du dossier | Question d'enquête pertinente | Peut répéter la scène sans la comprendre |
| Évaluer la provenance | Comparer déclaration et constat documentaire | Expliquer la force différente des sources | Ouvrir deux documents prouve seulement l'accès |
| Relier deux pièces | Choisir les sources et motiver soutien, tension ou incertitude | Relation explicitée avec contenu et provenance | Proposer une paire ne prouve pas la validité du lien ; lecture humaine nécessaire |
| Réviser une hypothèse | Comparer interprétations initiale et actuelle | Raison spécifique du changement ou du maintien | Changer souvent peut refléter des essais au hasard |
| Argumenter | Écrire une note avant le retour | Thèse, preuve, lien logique et alternative | Écriture, langue et étayage influencent le texte |
| Gérer incertitude et droits | Identifier données manquantes et personnes exposées | Demande d'information et limite du jugement | Déclarer un doute ne prouve pas sa gestion |
| Utiliser le retour | Relire note et débriefing, formuler un nouveau critère | Différence motivée entre avant et après | Répéter le retour ne prouve pas le transfert |
| Transférer | Analyser de nouvelles sources hors du jeu | Performance sur formes parallèles pré/post et suivi | Validité dépendant de l'équivalence, des évaluateurs et du protocole |

Ces objectifs sont notre opérationnalisation. Une performance dans le jeu n'attribue aucun niveau DigComp. Le cadre considère complexité et autonomie : profils guidé et libre doivent être décrits séparément. La notice JRC, les descripteurs et l'annexe des résultats d'apprentissage ont été vérifiés [4].

| Référence DigComp 3.0 | Niveau de la référence | Objectif local et limite |
|---|---|---|
| LO1.2.02 | Basic | Distinguer source et contenu dans une pièce |
| LO1.2.07 | Basic | Exprimer une première appréciation de fiabilité avec la collègue |
| LO1.2.21 | Intermediate | Comparer fiabilité et intérêts de différentes sources |
| LO2.3.15 | Intermediate | Reconnaître droits et responsabilités pertinents pour le dossier |
| LO2.3.25 | Advanced | Distinguer conditions d'interdiction et de haut risque ; cette exigence complexe existe déjà dans le jeu et nécessite une médiation pour les débutants |

Le guide facilite l'accès à une tâche avancée. Ajouter un indice ne transforme pas cette performance en compétence de base. Les codes renvoient au texte JRC original, annexe 2, pages imprimées 88–94. Les formulations locales sont des adaptations du projet dont la Commission européenne n'est pas responsable.

## Éléments à conserver, modifier et ajouter

| Phase | Conserver | Modifier | Nouveau composant |
|---|---|---|---|
| Compréhension | CaseScene, récit et durée de séance | Entrée explicite vers le parcours guidé | Courte scène de la collègue, finalité de la classification et droits |
| Hypothèse | Liberté de relire et de choisir | Rendre visible l'interprétation initiale avant les pièces | Hypothèses initiale et actuelle en mémoire temporaire |
| Enquête | 14 dossiers, EvidenceScene et comparaison | Pause consacrée aux relations entre sources | Carnet avec contre-preuve et incertitude |
| Argumentation | Choix du rapport, possibilité d'erreur et signature | Ouvrir une note autonome avant le retour dans le parcours choisi | Brouillon libre, copie figée à la signature |
| Retour | ReportScene, axes du retour et révision | Comparer raisonnement antérieur et réflexion ultérieure | Champ séparé et débriefing de séance |
| Transfert | Langage de l'enquête | Évaluer l'efficacité hors des 14 dossiers | Deux tâches Study 02 complètes et indépendantes dans le laboratoire local |

## Analyse critique CEPAJe

CEPAJe croise contexte, enseignant, pédagogie, apprenant et jeu avec introduction, déroulement et débriefing. Nous l'utilisons comme grille de conception [1]. Le modèle aide à repérer des conditions négligées ; il ne certifie pas l'efficacité du produit.

| Dimension | Introduction | Pendant l'enquête | Débriefing et transfert | Risque à examiner |
|---|---|---|---|---|
| Contexte | Durée, dispositif, langue et accès aux règles | Pauses compatibles avec bruit et travail individuel/en binôme | Temps protégé d'écriture et de discussion | École et autoformation offrent des médiations différentes |
| Enseignant | Présenter finalité et règles sans annoncer les réponses | Demander quelle preuve changerait l'hypothèse | Animer l'échange sur raisons et limites | Une consigne du jeu ne remplace pas la médiation humaine |
| Pédagogie | Objectifs explicites et exemple | Hypothèses révisables et comparaison des sources | Note avant le retour, puis réélaboration | La séquence risque de devenir un formulaire |
| Apprenant | Connaissances et aisance de lecture établies extérieurement | Aides facultatives et sauts autorisés | Expliquer ses stratégies par des modalités accessibles | Écriture et langue peuvent masquer le raisonnement |
| Jeu | Préserver rôle, atmosphère et dossier | Exploration et conséquences centrales | Réutiliser débriefing et révision | Trop d'interruptions réduisent pouvoir d'agir et rythme |

Cette décision provisoire doit être mise à l'épreuve dans les essais de jeu. Si la scène paraît être une leçon séparée, la raccourcir et la relier à un document choisi. Si l'écriture libre bloque la partie, permettre de passer et prévoir une restitution orale médiée. Si tous répètent les indices, diminuer l'étayage de l'épreuve indépendante. Si les débutants restent désorientés, modifier l'exemple et tester la compréhension avant d'ajouter du texte.

## Carte LM–GM

LM–GM relie actions ludiques et processus d'apprentissage [2]. Le tableau est une carte opérationnelle locale ; les noms de nos composants ne sont pas attribués au modèle.

| Mécanique de jeu | Mécanique d'apprentissage | Relation à vérifier | État initial |
|---|---|---|---|
| Rôle d'inspecteur et ouverture du dossier | Contextualisation, activation des connaissances | Formuler une question utile à la décision | Récit présent, médiation à étendre |
| Scène de la collègue | Exemple et étayage | Distinguer déclaration et constat | Nouveau composant |
| Exploration libre des pièces | Recherche et comparaison d'informations | Expliquer le retour à une source | Ouverture et citation déjà présentes |
| Comparaison côte à côte | Analyse et corrélation | Argumenter soutien ou contradiction | Lecture présente, production à ajouter |
| Hypothèse révisable | Réflexion, contrôle de l'interprétation | Maintenir ou changer d'avis à partir d'une preuve précise | Nouveau champ |
| Note et signature | Auto-explication et décision engageante | Expliciter le lien logique avant le retour | Signature présente, texte nouveau |
| Conséquences et débriefing | Retour et réflexion sur l'expérience | Distinguer résultat juridique, appui et limite | Réutiliser les axes existants |
| Scénario externe indépendant | Application et transfert | Employer des critères avec d'autres sources | Formes A/B, quatre sources chacune en IT/EN/FR ; grille humaine |

Les alternatives du rapport apportent une aide mais peuvent favoriser la reconnaissance ; la production autonome les complète. Le carnet augmente l'observabilité dans une séance consentie. La version publique conserve uniquement les compteurs agrégés existants.

## Fondement scientifique et bibliographie vérifiée

Sources consultées le 21 novembre 2026. La sélection privilégie auteurs, réseaux et institutions européens. Le niveau réel d'accès est précisé pour ne pas assimiler résumé et lecture intégrale.

1. Alvarez, J., & Chaumette, P. (2017). Présentation d'un modèle dédié à l'évaluation d'activités ludo-pédagogiques et retours d'expériences. Recherche et pratiques pédagogiques en langues de spécialité, 36(2). DOI [10.4000/apliut.5659](https://doi.org/10.4000/apliut.5659). OpenEdition a affiché une vérification anti-robot. La structure est également attestée par la ressource institutionnelle [DRANE](https://drane.region-academique-idf.fr/article69.html) et la publication de l'auteur [RIHM 2019](https://europia.org/RIHM/V20N2/3-RIHM20%282%29-Alvarez.pdf), partiellement consultable par indexation. Usage de conception avec cette limite explicite.
2. Arnab, S., Lim, T., Carvalho, M. B., Bellotti, F., de Freitas, S., Louchart, S., Suttie, N., Berta, R., & De Gloria, A. (2015). Mapping learning and game mechanics for serious games analysis. British Journal of Educational Technology, 46(2), 391–411. DOI [10.1111/bjet.12113](https://doi.org/10.1111/bjet.12113). Métadonnées et résumé vérifiés dans le [dépôt Heriot-Watt](https://researchportal.hw.ac.uk/en/publications/mapping-learning-and-game-mechanics-for-serious-games-analysis/). Le manuscrit TU Eindhoven a renvoyé 403. Ce travail du réseau européen GALA aide à relier finalités et mécaniques.
3. Bijl, A., Veldkamp, B. P., Wools, S., & de Klerk, S. (2024). Serious games in high-stakes assessment contexts: a systematic literature review into the game design principles for valid game-based performance assessment. Educational Technology Research and Development, 72, 2041–2064. DOI [10.1007/s11423-024-10362-0](https://doi.org/10.1007/s11423-024-10362-0). Texte ouvert vérifié dans le [dépôt Twente](https://ris.utwente.nl/ws/portalfiles/portal/453330013/s11423-024-10362-0.pdf), notamment introduction et discussion. Cette revue de 56 études sur les compétences professionnelles souligne menaces pour la validité, authenticité et adaptativité. L'effet du retour sur la performance motive la séparation entre formation et mesure indépendante.
4. Cosgrove, J., & Cachia, R. (2025). DigComp 3.0: European Digital Competence Framework, Fifth Edition. European Commission, JRC144121. DOI [10.2760/0001149](https://doi.org/10.2760/0001149). [Notice officielle](https://publications.jrc.ec.europa.eu/repository/handle/JRC144121) et [descripteurs JRC](https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en) vérifiés ; la notice indique le 27 novembre 2025. Les objectifs du jeu sont une adaptation de l'auteur, pas une certification de la Commission.
5. Union européenne (2024, consolidation du 27 juillet 2026). Règlement (UE) 2024/1689, modifié par le règlement (UE) 2026/1744. [Texte consolidé EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689). Articles 4 et 4a, interdictions, obligations et annexe III consultés pour la matrice juridique. L'article 4 demande aux fournisseurs et déployeurs de prendre des mesures soutenant la maîtrise de l'IA du personnel, compte tenu des connaissances, du contexte et des personnes concernées ; il n'impose pas de garantir un niveau individuel précis. Commission et États membres soutiennent ces efforts. Les échéances de l'article 113 doivent être distinguées de l'univers fictif de 2032.
6. Conseil de l'Europe (2026). Recommendation CM/Rec(2026)12, adoptée le 2 septembre 2026. [Texte du Comité des Ministres](https://search.coe.int/cm/eng?i=09125948802cde8e) et [page institutionnelle](https://www.coe.int/web/education/-/recommendation-cm/rec-2026-12-of-the-committee-of-ministers-to-member-states-on-artificial-intelligence-literacy) vérifiés. Droits, autonomie et pratiques réflexives orientent les consignes sur les personnes concernées et les limites du jugement. Cette recommandation du Conseil de l'Europe diffère du règlement UE par son institution et sa nature juridique.
7. Wouters, P. J. M., & van Oostendorp, H. (2013). A meta-analytic review of the role of instructional support in game-based learning. Computers & Education, 60, 412–425. [Dépôt Utrecht](https://research-portal.uu.nl/en/publications/a-meta-analytic-review-of-the-role-of-instructional-support-in-ga/). Métadonnées vérifiées, accès éditeur au texte intégral refusé. Usage limité à motiver une vérification de l'étayage, sans transposer d'estimations d'effet à notre jeu.
8. van der Meij, H., Leemkuil, H. H., & Li, J.-L. (2013). Does individual or collaborative self-debriefing better enhance learning from games? Computers in Human Behavior, 29(6), 2471–2479. DOI [10.1016/j.chb.2013.06.001](https://doi.org/10.1016/j.chb.2013.06.001). Métadonnées et résumé vérifiés dans le [dépôt Twente](https://research.utwente.nl/en/publications/does-individual-or-collaborative-self-debriefing-better-enhance-l/). Domaine et échantillon limitent la généralisation ; cette étude motive la comparaison entre restitution individuelle et échange médié.
9. Noroozi, O., Weinberger, A., Biemans, H. J. A., Mulder, M., & Chizari, M. (2012). Argumentation-based computer supported collaborative learning (ABCSCL): A synthesis of fifteen years of research. Educational Research Review, 7(2), 79–106. DOI [10.1016/j.edurev.2011.11.006](https://doi.org/10.1016/j.edurev.2011.11.006). Métadonnées et résumé vérifiés dans le [dépôt Wageningen](https://research.wur.nl/en/publications/argumentation-based-computer-supported-collaborative-learning-abc/). L'étude traite prérequis, environnement, processus et résultats. Son application au carnet individuel demande de la prudence : la synthèse porte sur des contextes collaboratifs. Consignes et grille sont une proposition locale à valider.

Cette recension ciblée n'est pas une revue systématique. Aucune étude ne sert à affirmer que NO AI ACT développe la pensée critique. Le prototype n'a pas nécessité de source extra-européenne supplémentaire. Le futur protocole devra justifier tout autre modèle de validité ou de transfert, quelle que soit son origine.

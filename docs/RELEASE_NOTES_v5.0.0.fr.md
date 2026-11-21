# NO AI ACT v5.0.0 — Enquêter, argumenter, reconsidérer

[Italiano](RELEASE_NOTES_v5.0.0.md) · [English](RELEASE_NOTES_v5.0.0.en.md) · [Français](RELEASE_NOTES_v5.0.0.fr.md)

21 novembre 2026. Publication du parcours ludopédagogique guidé, conservant les 14 cas existants et les trois langues du jeu : italien, anglais et français. Le site conserve 155 routes et six langues éditoriales. Le README et le registre de publication précisent l'état effectif du tag et du déploiement.

## Nouveautés du jeu

- Médiations propres à chaque dossier : trois courtes étapes initiales, rappel contextuel avant la décision et aide consultable à nouveau.
- Carnet permettant de relire les documents ouverts, d'évaluer leur provenance, d'expliquer les relations entre sources et de consigner des révisions motivées de l'hypothèse. Les relations sont proposées par le joueur sans correction automatique.
- Argumentation autonome avant signature : thèse, preuves, raisonnement vers les mesures et responsabilités, alternative et incertitude. La note est figée avant le retour formatif.
- Relecture du raisonnement après le rapport, utilisation explicite du retour, plan pour un autre cas et débriefing transversal en fin de séance.
- Dialogue sémantique avec gestion du focus, Échap et défilement. Souris, tactile et clavier sont isolés de la scène sous-jacente pendant son ouverture.
- Numéro de version dérivé de package.json, également affiché à l'accueil et dans sa couche de lecture accessible.
- Les compteurs agrégés dérivent aussi leur version de package.json. Le service reste compatible avec les anciens clients 4.0 ; réponses et notes guidées restent exclues.

Les annotations sont facultatives et temporaires dans l'onglet. Rechargement et nouvelle partie les effacent. Elles ne figurent ni dans les sauvegardes, ni dans les rapports exportés du jeu, ni dans la télémétrie. L'évaluation des 14 cas et le schéma de sauvegarde v2 avec migration v1 restent compatibles.

## Méthode et outils de recherche

Le [dossier méthodologique](v5/README.md) contient les matrices A/B/C, la carte LM–GM, l'analyse CEPAJe, les références DigComp 3.0, la bibliographie européenne vérifiée, la grille préliminaire et le protocole Study 02. Les observations reçues ne constituent ni soutien officiel ni validation scientifique.

Le laboratoire Study 02 est disponible dans le dépôt avec `npm run study02:local` : deux formes indépendantes, quatre sources nouvelles par forme, réponse libre verrouillée à la remise, observation structurée et codage exclusivement humain. Il reste séparé de la version publique et n'autorise aucune collecte auprès de participants. Le débriefing du jeu est distinct de l'épreuve indépendante de transfert.

## Vérifications et limites

Le cycle méthodologique a été vérifié sur les 14 cas dans les trois langues et trois profils d'écran supplémentaires : 45 parcours guidés. Ont également réussi 42 parcours standard avec restauration des rapports, 12 combinaisons mode/langue et 12 configurations Study 02. Les preuves du prototype figurent dans [TEST_RESULTS](v5/fr/TEST_RESULTS.md) ; la publication initiale a également passé les contrôles de compilation, métadonnées et navigateur de la pipeline. Ce sont des résultats historiques V5.0.0, sans nouvelle exécution de smoke tests pour la correction de localisation.

La réussite au jeu ne démontre pas la pensée critique. Efficacité éducative, équivalence des formes, grille, traductions et accessibilité avec des technologies d'assistance réelles nécessitent encore une évaluation humaine. Aucun score automatique de pensée critique n'est introduit. Aucune certification de compétence n'est délivrée.

Le profil 4K a réussi avec un GPU Direct3D11. Le démarrage direct en 4K avec rendu uniquement logiciel a dépassé 90 secondes dans le Preload préexistant : cette limite reste documentée. Le jeu simplifie le droit à des fins pédagogiques et ne remplace ni le texte en vigueur ni un avis professionnel.

## Mise à jour

Ouvrir le site ou recharger après déploiement. Les sauvegardes existantes sont conservées. Pour reproduire une recherche, indiquer la version exacte et conserver le tag utilisé ; V5.0 ne constitue pas une validation empirique.

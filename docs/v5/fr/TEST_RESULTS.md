# Vérification finale de la couverture méthodologique V5

[Italiano](../TEST_RESULTS.md) · [English](../en/TEST_RESULTS.md) · [Français](../fr/TEST_RESULTS.md) · [Deutsch](../de/TEST_RESULTS.md) · [Español](../es/TEST_RESULTS.md) · [Português](../pt/TEST_RESULTS.md) · [Nederlands](../nl/TEST_RESULTS.md)

> Édition linguistique V5.4.0 · 23 novembre 2026. Le dossier et les matériaux locaux de Study 02 sont désormais disponibles dans les sept langues. Les dates, nombres et résultats du prototype décrivent les exécutions historiques. Le contrat actuel du registre facultatif réservé aux adultes figure dans SESSION_JOURNAL.md et remplace la restriction antérieure aux seuls agrégats. Les traductions ne démontrent ni équivalence des instruments, ni efficacité éducative, ni validité de la grille. Aucun nouveau test pour cette mise à jour des contenus.


21 novembre 2026. Rapport du prototype antérieur à V5.0.0. Les tests ont commencé après l'implémentation de toute la liste opérationnelle de COVERAGE_COMPLETION.md ; les corrections ont été suivies de nouvelles exécutions. Ces résultats concernent le clone local. Les vérifications de publication sont documentées séparément dans la release. Cette traduction rapporte les exécutions antérieures ; elle ne relance aucun smoke test pour V5.0.1.

| Vérification | Résultat observé |
|---|---|
| TypeScript | PASS, y compris la compilation après correction du dialogue |
| Suite Vitest | 1 509 tests dans 95 fichiers, tous réussis |
| Compilation Vite | PASS ; avertissement sur la taille du paquet du jeu, environ 1,83 Mo minifié |
| Audit SEO | 155 routes, aucun défaut critique ni avertissement |
| Vérification dist | 155/155 routes, HTML sans caractères corrompus, aucun formulaire externe de collecte |
| Parcours guidé | 45 parcours réussis : 14 dossiers × IT/EN/FR et trois profils de mise en page supplémentaires |
| Régression du catalogue | 42 parcours standard réussis, résultats corrects et rapports rétablis après rechargement |
| Modes | Service, Libre, Surprise, Révision × trois langues : 12 configurations réussies |
| Study 02 | Deux formes × trois langues × PRE/POST : 12 configurations réussies |
| Données du jeu | Marqueurs synthétiques des hypothèses, sources, relations et réflexions absents de localStorage et de la télémétrie ; rechargement effaçant les notes |
| Données Study 02 | Aucun cookie ni stockage du navigateur ; copie locale explicite ; POST rejeté avec 405 ; matériaux exclus de la version publique |

## Couverture du parcours guidé

Chaque parcours commence dans le dossier, traverse les trois temps introductifs, conserve la première hypothèse, ouvre les documents avec les touches réelles et cite les preuves. Dans le carnet, il relit une source, en note provenance et limites, enregistre deux révisions motivées et un lien expliqué. Clics et saisie dans le dialogue doivent laisser inchangée la sélection des pièces sous-jacentes.

Le test poursuit avec le rappel méthodologique, les quatre décisions et la signature. Un retour à la ligne dans la note ne doit pas signer. La confirmation fige le texte avant le rapport ; les tentatives ultérieures ne le modifient pas. Le débriefing distingue note précédente, règle, réflexion, usage du retour et projet pour un nouveau dossier. La synthèse finale inclut tous les dossiers guidés terminés. Le rechargement efface l'état temporaire. Aucun appel externe ni POST n'est autorisé pendant le smoke test.

Profils : IT 1920×1080 et 320×800 ; EN 390×844 et 640×360 ; FR 390×844 et 3840×2160. Focus, Tab, Échap, saisie multiligne et absence de débordement sont vérifiés. Le dernier test 4K utilise Direct3D11 sur Intel Iris Xe, avec moteur détecté et enregistré dans le JSON. Les cinq autres profils utilisent SwiftShader. Ces vérifications ne remplacent pas des essais sur appareils physiques, claviers virtuels ou lecteurs d'écran réels.

Les 14 dossiers sont sélectionnés par fixture ; pièces, décisions et signature passent par l'interface réelle. Le test confirme les résultats du moteur existant, pas la compréhension d'un participant ni la justesse juridique indépendante du corrigé.

## Corrections et limites techniques

1. Le watcher de Vite pouvait surveiller un téléchargement de test encore verrouillé par Windows, provoquant EBUSY. Les dossiers d'artefacts et du graphe local sont désormais exclus. Le catalogue complet et le parcours guidé ont réussi la nouvelle exécution.
2. Phaser écoute aussi les événements de souris sur la fenêtre : un clic dans le dialogue natif pouvait changer une citation. Le dialogue désactive temporairement les entrées de la scène et arrête la propagation des événements de pointeur, souris et tactile. Le test reproduit le dossier du crédit et vérifie l'invariance des pièces dans les 45 parcours finaux.
3. La vérification des formulaires externes parcourait le dossier croissant d'artefacts synthétiques et atteignait le délai maximal. Elle exclut désormais précisément scripts/smoke/out, qui n'est pas une source distribuée. Les contrôles des sources publiques et de dist restent actifs ; la suite finale a réussi 1 509 tests.
4. Le démarrage natif 4K uniquement logiciel a dépassé 90 secondes dans le Preload préexistant. Le diagnostic Direct3D11 a atteint Title en environ 5,6 secondes, puis le parcours 4K complet, rechargement compris, a réussi. Le délai logiciel reste une limite de cette configuration et n'est pas déclaré résolu. Le moteur de rendu n'a pas été modifié.

## Study 02

Les douze configurations vérifient quatre sources par forme, l'absence de réponses à choix, l'argumentation libre, le blocage à la remise, l'indisponibilité du débriefing avant celle-ci, sept lignes d'observation et six dimensions de codage humain. Non observé reste distinct de 0. Il n'y a ni total ni correction automatique. La copie JSON contient texte remis et notes explicites, sans identifiant de participant. Les tests utilisent uniquement des textes synthétiques.

## Reproduction

Dans le clone local, utiliser les commandes de METHODOLOGY_IMPLEMENTATION.md. Pour reproduire la 4K sur cette machine Windows, définir CHROMIUM_PATH vers Chrome installé et INQUIRY_4K_GPU=d3d11. INQUIRY_ONLY et INQUIRY_CASE sont des filtres diagnostiques ; la vérification complète d'origine ne les utilisait pas. Les JSON indiquent fenêtre d'affichage, langue, dossier et moteur effectif.

## Validation humaine encore nécessaire

La couverture fonctionnelle des retours est implémentée et vérifiée dans les configurations annoncées. Efficacité pédagogique, qualité de l'argumentation, équivalence des formes, traductions, justesse juridique pour l'administration et accessibilité avec technologies d'assistance nécessitent les vérifications humaines du protocole. Aucune étude avec participants n'a été réalisée. Aucun résultat du jeu ne devient un score automatique de pensée critique. Au stade consigné ici, cet incrément n'avait pas encore été publié en production.

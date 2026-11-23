# NO AI ACT · v5.4.0

[Italiano](README.md) · [English](README.en.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Nederlands](README.nl.md)

**Serious game d’enquête sur le règlement européen sur l’IA**

[▶ Jouer](https://www.no-ai-act.eu/play/?lang=fr) · [Site et ressources](https://www.no-ai-act.eu/fr/) · [Version stable](https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/releases/tag/v5.4.0)

En 2032, dans une ville européenne fictive où l’AI Act n’est jamais entré en vigueur, vous êtes inspecteur. Reconstituez l’utilisation des systèmes d’IA à partir de documents, de témoignages et de registres. Le jeu est gratuit, open source et fonctionne dans le navigateur sans compte.

## Couverture

Les mêmes langues couvrent le jeu, le site, les ressources pédagogiques, les dossiers de presse, les README et le dossier méthodologique : italien, anglais, français, allemand, espagnol, portugais européen (pt-PT) et néerlandais. Chaque langue comprend les 14 cas et les mêmes 37 sections du site. Les URL existantes sont conservées.

## Le parcours de jeu

- Enquêtez : ouvrez les pièces, examinez leur provenance, citez les preuves et comparez les sources. Décidez de la classification, de la mesure, de la responsabilité et du motif ; signez le rapport et discutez conséquences et limites.
- Le parcours guidé articule compréhension, hypothèse, investigation, argumentation autonome avant le feedback, débriefing et réflexion sur un autre cas. Revenez aux preuves et justifiez vos révisions ; l’écriture reste facultative.
- Quatre modes utilisent les mêmes cas : Service, Enquête libre, Inspection surprise et Révision des cas clos avec des erreurs. La durée choisie constitue un budget indicatif.
- Le mode enseignant propose un guide et des supports de débriefing local. Activités, trois plans de séance, glossaire et articles thématiques accompagnent préparation et discussion.
- Commandes au clavier, couche de lecture accessible et réglages du son, du texte et des animations. Compatibilité des sauvegardes v2 et de la migration depuis v1.

## Méthode et limites

CEPAJe et LM–GM relient contexte, médiation, actions et traces observables. Le dossier contient matrices, grille préliminaire et spécification du transfert. Les retours de Julian Alvarez et Federica Pelizzari orientent la refonte sans constituer un soutien officiel ni une validation. Le score et la réussite ne démontrent ni apprentissage ni pensée critique ; aucun score automatique de pensée critique. Cette simulation juridique simplifiée ne fournit ni conseil juridique ni certification.

[Méthode et limites](docs/v5/README.fr.md) · [Méthodologie, retours, CEPAJe et LM–GM](docs/v5/fr/METHODOLOGY.md) · [Matrice juridique des 14 cas](docs/v5/fr/LEGAL_LEARNING_MATRIX.md)

## Données et confidentialité

La progression reste dans le navigateur. Les compteurs agrégés peuvent être désactivés. Seuls les adultes peuvent consentir à un registre de session pseudonyme conservé 90 jours ; les textes du parcours guidé nécessitent un accord supplémentaire, initialement non sélectionné. Retrait, effacement et export sont accessibles dans la barre du jeu. DNT/GPC sont respectés. Aucun compte, profil publicitaire ou lien entre visites. La collecte utilise telemetry.no-ai-act.eu ; les anciennes API restent compatibles avec les reçus et exports existants.

[Données et confidentialité](https://www.no-ai-act.eu/game-statistics.html#fr) · [Contrat actuel du registre de session](docs/v5/fr/SESSION_JOURNAL.md)

## Matériaux de recherche

Study 02 est un laboratoire local absent de la version publique, avec deux formes et une grille codée par des personnes dans les sept langues. Il n’active aucune étude avec participants. Équivalence linguistique, validité de la grille et efficacité éducative restent à évaluer avec des personnes. Les résultats de vérification du dossier sont historiques.

[Grille et transfert Study 02](docs/v5/fr/ARGUMENTATION_STUDY02.md) · [Study 02](research/study02/)

## Développement local

Node.js 22+ · TypeScript · Phaser 3 · Vite.

```sh
npm ci
npm run dev
# http://localhost:5173/play/?lang=fr
npm run site:generate
npm run build
npm run study02:local
# http://127.0.0.1:4262/
```

## Auteur

Matteo Angeloni : conception, game design, développement et contenus éducatifs. Doctorant à l’Université de la Tuscia ; projet indépendant sans approbation institutionnelle implicite. Réalisé avec l’aide de l’IA sous responsabilité éditoriale humaine.

[Matteo Angeloni](https://www.no-ai-act.eu/fr/matteo-angeloni/)

## Licences

Code GPL-3.0-or-later ; contenus CC BY-SA 4.0. Voir LICENSE, CREDITS et THIRD_PARTY_LICENSES pour les attributions et composants. Les titres des publications et articles de presse restent dans leur langue originale.

[LICENSE](LICENSE) · [CREDITS](CREDITS.md) · [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES.md)

## Documentation technique et historique

[Version stable](docs/RELEASE_NOTES_v5.4.0.fr.md) · [Méthode et limites](docs/v5/README.fr.md) · [Press kit](https://www.no-ai-act.eu/fr/dossier-de-presse/) · [GDD](docs/GDD.md) · [README < v5.3.0](docs/archive/README_pre_v5.3.0.it.md)

# V5.2 — Registre volontaire des sessions individuelles

[Italiano](../SESSION_JOURNAL.md) · [English](../en/SESSION_JOURNAL.md) · [Français](SESSION_JOURNAL.md) · [Deutsch](../de/SESSION_JOURNAL.md) · [Español](../es/SESSION_JOURNAL.md) · [Português](../pt/SESSION_JOURNAL.md)

22 novembre 2026. Ce contrat répond à la demande ultérieure du propriétaire d’étendre la collecte au-delà des agrégats. La restriction antérieure reste documentée dans le dossier historique V5.0. Le protocole Study 02 ne change pas. Cette traduction décrit le service existant, sans étendre sa collecte.

## Éléments disponibles

Uniquement après consentement d’un adulte : identifiant aléatoire de session de l’onglet, version, canal (production ; bêta dans l’historique), langue et mode initiaux, difficulté, parcours et public choisis ; événements avec UUID, séquence, tentative, dossier, phase, heure déclarée par le client, temps écoulé et réception serveur. Le budget de minutes choisi est inclus ; ce n’est pas la durée réellement jouée. La version de session est celle du début.

| Action | Registre | Limite d’interprétation |
|---|---|---|
| Ouverture, démarrage, reprise, navigation | Événement et contexte | Ouvrir ne démontre pas la lecture |
| Pièces | Index, ouverte/citée, ajouts/retraits et état du brouillon | Aucune mesure de l’attention |
| Comparaison | Paire d’index affichée | Ne démontre pas une corrélation correcte |
| Décisions | Classification, mesure, acteur, motif, citations, confiance | Données déclarées par le client, manipulables |
| Incident | Option canonique, y compris au clavier | Ne mesure pas une disposition éthique stable |
| Rapport | Choix signés et résultat interne | Résultat du jeu, pas compétence validée |
| Parcours guidé | Hypothèse enregistrée/révisée, relations ajoutées/retirées, nombres de champs et révisions | Les nombres ne mesurent pas la qualité du raisonnement |
| Argumentation | Remise avant feedback distincte de la réflexion ultérieure | Aucun score de pensée critique |
| Auto-vérification | Nombres de l’exercice facultatif pré/post | Aucune validation externe implicite |
| Aides, tutoriel, feedback, révision, accessibilité | Événements avant réduction par l’adaptateur agrégé | L’usage ne démontre pas l’apprentissage |
| Activité | Signal périodique de visibilité, focus et activité récente | Estimation, sans suivi oculaire |

Un **second consentement**, initialement non sélectionné, autorise des instantanés des textes enregistrés du parcours guidé : hypothèses, appréciations des sources, motifs des relations/révisions, argumentation, réflexion et projet de transfert. Aucune saisie touche par touche. Un champ par événement, au maximum 1 200 caractères ; chiffrement AES-GCM côté serveur. L’interface demande d’éviter les données personnelles ou sensibles. Aucun texte n’est évalué automatiquement.

Aucun nom, courriel, IP applicative, user agent, empreinte, localisation, publicité ou lien entre visites/classes n’est ajouté. Le registre est **pseudonyme**, pas présenté comme anonyme.

## Consentement et droits

Invitation en IT/EN/FR/DE/ES/PT-PT ; refuser ne retire aucune fonction. Avant consentement, aucune session serveur ni file d’événements du registre. L’historique des sauvegardes précédentes n’est pas envoyé. Le même onglet peut reprendre le registre pendant 24 heures, y compris après rechargement ; aucun consentement ne passe à une autre visite ou un autre onglet. Les mineurs peuvent jouer et ne sont pas invités à activer ce registre.

File, reçu et clé privée utilisent le sessionStorage de l’onglet. L’export personnel distingue les événements reçus de ceux encore en attente localement. Le reçu téléchargeable contient une clé d’accès à garder privée. Il peut être rouvert après fermeture pour exporter ou effacer ; il ne réactive pas l’enregistrement. Sans reçu après fermeture, le responsable peut ne plus retrouver le registre exact, aucune identité personnelle n’étant conservée.

Le retrait arrête immédiatement la collecte. Hors ligne, l’effacement est indiqué **en attente**, jamais terminé ; le client réessaie. Désactiver les statistiques dans la barre révoque aussi le registre. DNT/GPC bloquent l’activation et, détectés ultérieurement, arrêtent le registre et demandent l’effacement.

Après 90 jours depuis le consentement, les données deviennent inaccessibles puis sont supprimées lors du nettoyage quotidien. Le retrait supprime les événements et la session. Seul un reçu technique reste jusqu’à la même échéance : UUID, empreinte de la clé, dates de retrait et d’expiration, pour rejeter les renvois tardifs.

Base : consentement, article 6(1)(a) du RGPD. Responsable : Matteo Angeloni ; contacts sur les pages auteur. Cloudflare fournit Workers/D1 et traite des métadonnées de connexion pour le service et la sécurité. La base existante est configurée dans la juridiction UE ; cela ne garantit ni anonymat ni absence de transferts dans l’ensemble de l’infrastructure. [Information dans les six langues](https://www.no-ai-act.eu/game-statistics.html).

Finalité : corriger et améliorer le jeu et les supports d’apprentissage. La fenêtre de 90 jours permet de comparer les itérations sans archive individuelle indéfinie. Le consentement n’autorise aucune collecte étrangère à la finalité ou disproportionnée : les lignes directrices EDPB 05/2020, paragraphe 5, maintiennent nécessité, proportionnalité et principes de l’article 5 du RGPD. Pas d’extension à la navigation extérieure, à l’identification nominative, aux empreintes ou aux demandes de données sensibles.

## Contrat technique

`https://telemetry.no-ai-act.eu/collect/v3/start`, `/events`, `/export`, `/revoke` utilisent le même collector de production. L’ancien hôte `beta.no-ai-act.eu` maintient uniquement la compatibilité des API et reçus téléchargés ; le jeu bêta est retiré et redirige vers la version stable. Aucune migration ni suppression des données.

Origines stable et historique, POST JSON limités, aucune clé dans les URL, aucun cookie, journalisation des contenus désactivée. La migration 0007 ajoute quatre tables sans réécrire les compteurs antérieurs. La base conserve seulement l’empreinte de la clé privée. `JOURNAL_TEXT_KEY`, hors du code et identique sur les deux Workers, est nécessaire pour chiffrer/lire les textes. Sa perte les rend illisibles. Ne pas la supprimer ou la renouveler sans préserver les clés encore nécessaires. Ce n’est pas un chiffrement de bout en bout : le serveur peut déchiffrer les exports autorisés.

Identifiants immuables, accusé de réception explicite par événement, reprises idempotentes et file conservée après rechargement. Limites : 30 000 octets par requête, 40 événements par lot, 10 000 par session, file client de 1,4 Mo ; 5 000 nouvelles sessions et 50 000 événements par jour. Limitation des envois par session. Les quotas peuvent rendre la couverture incomplète. Keepalive ne garantit pas la livraison après fermeture, panne réseau, refus du stockage ou expiration des 24 heures.

Le tableau de bord privé protégé par Cloudflare Access présente d’abord les **sessions individuelles** : filtres combinés, canal, version, nombre reçu et consentement aux textes. Langue/mode filtrent le contexte initial ; dossier sélectionne les sessions comprenant un événement de ce dossier. Pages de 50 sessions, chronologie progressive de 200 événements, exports JSON/CSV. Aucun seuil de 10 dans le registre privé. Les lacunes avant la dernière séquence sont visibles ; une file finale jamais reçue ne l’est pas.

## Historique et valeurs indisponibles

`usage_case_completed`, `usage_case_left`, `usage_session_completed` sont rapprochés des noms canoniques dans l’historique. Les requêtes sur des dimensions absentes du serveur ont été retirées. Agrégation et seuils historiques demeurent : séquences, résultats et durées abandonnés par l’adaptateur **ne peuvent pas être reconstruits**. Aucune substitution par zéro, estimation ou événement inventé.

## Vérification et limites

La V5.2 a documenté des vérifications client/serveur avec SQLite réel : consentement, six langues, 14 identifiants de dossier, propriétés exactes, reprises, conflits de séquence, rechargement, expiration, chiffrement, accès non autorisé, export, retrait hors ligne et concurrence avec l’ingestion, quotas et conservation. Régression, types client/Worker, compilation, SEO et distribution étaient également couverts. Ces exécutions sont historiques ; cette traduction ne rapporte aucun nouveau test.

Aucun smoke test ou test navigateur pour cette version, conformément à la demande ; la vérification visuelle et assistive sur appareils réels reste limitée. Restent ouvertes la révision linguistique spécialisée, l’évaluation de l’information dans son contexte d’usage, un éventuel parcours pour mineurs et la recherche avec des instruments validés. Aucun soutien officiel d’Alvarez/Pelizzari et aucune activation de Study 02.

## Sources de la recherche précédente

- [RGPD consolidé](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02016R0679-20160504).
- [EDPB, consentement](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [EDPB, ePrivacy 5(3)](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- [Garante, suivi](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876).
- [W3C Beacon](https://www.w3.org/TR/beacon/).
- [D1, localisation](https://developers.cloudflare.com/d1/configuration/data-location/).
- [Cloudflare, limitation des envois](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- [Serrano-Laguna et al.](https://pubman.e-ucm.es/drafts/e-UCM_draft_297.pdf), DOI 10.1016/j.csi.2016.09.014 : inspiration sémantique sans déclaration de conformité xAPI.

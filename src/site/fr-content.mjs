/**
 * CONTENUTO DELLE PAGINE PUBBLICHE FRANCESI.
 *
 * Il testo sta qui, la forma in scripts/site/build-fr-pages.mjs. La
 * separazione non è estetica: canonical, tre hreflang, Open Graph, due blocchi
 * JSON-LD, navigazione e piè di pagina versionato esistono UNA volta invece di
 * tredici, ed è la classe di difetto che su questo repository ha già prodotto
 * 31 conteggi divergenti su 21 pagine.
 *
 * TERMINOLOGIA. Ogni termine normativo viene da docs/GLOSSAIRE_FR.md, che
 * riporta la versione ufficiale francese del regolamento (UE) 2024/1689 come
 * modificato dal regolamento (UE) 2026/1744. « hypertrucage » e non
 * « deepfake », « déployeur » e non « utilisateur », « contrôle humain » e non
 * « supervision humaine ».
 *
 * QUELLO CHE QUESTE PAGINE NON SONO. Non sono la traduzione integrale delle
 * pagine italiane: sono un primo insieme completo e più breve. Le pagine
 * italiane ed inglesi contano ~28.000 parole su 70 rotte; queste tredici
 * coprono i percorsi che il GIOCO apre — i sette collegamenti di SITE_LINKS e
 * i nove dei concetti — perché un francese che gioca non deve atterrare su una
 * pagina italiana. Il divario è dichiarato in docs/PROGRAMMA_4_0_AUDIT.md e
 * non va nascosto.
 */

export const SITE = 'https://www.no-ai-act.eu/';

/** La navigazione, uguale su ogni pagina: i gruppi e le loro voci. */
export const NAV = [
  {
    nome: 'Ressources',
    voci: [
      { slug: 'education', nome: 'Ressources éducatives' },
      { slug: 'maitrise-de-l-ia', nome: "Maîtrise de l'IA" },
      { slug: 'ai-act-pour-enseignants', nome: 'Pour les enseignants' },
      { slug: 'comment-ca-marche', nome: 'Comment ça marche' }
    ]
  },
  {
    nome: 'AI Act',
    voci: [
      { slug: 'guide-ai-act', nome: "Guide de l'AI Act" },
      { slug: 'categories-de-risque-ai-act', nome: 'Catégories de risque' },
      { slug: 'pratiques-interdites-ai-act', nome: 'Pratiques interdites' },
      { slug: 'systemes-ia-a-haut-risque', nome: 'Systèmes à haut risque' },
      { slug: 'obligations-de-transparence', nome: 'Transparence' },
      { slug: 'ia-a-usage-general', nome: 'IA à usage général' },
      { slug: 'glossaire', nome: 'Glossaire' }
    ]
  },
  {
    nome: 'Confidentialité',
    voci: [
      {
        slug: 'protection-des-donnees-des-la-conception',
        nome: 'Protection dès la conception'
      }
    ]
  }
];

const DISCLAIMER =
  "Lecture pédagogique simplifiée. Pour une appréciation formelle de conformité, consultez un professionnel.";

export const PAGINE = [
  {
    slug: '',
    it: '',
    en: 'en/',
    title: 'NO AI ACT — serious game d\'enquête sur l\'AI Act européen',
    description:
      "Serious game d'enquête gratuit sur l'AI Act européen : enquêtez sur 14 dossiers de systèmes d'IA et apprenez à classer leur risque. Pas un conseil juridique.",
    ogTitle: "NO AI ACT — un serious game d'enquête sur l'AI Act",
    ogDescription:
      "Jeu d'enquête gratuit et open source sur le règlement européen sur l'intelligence artificielle : 14 dossiers, dans le navigateur, sans compte.",
    breadcrumb: 'Accueil',
    eyebrow: 'RÉPUBLIQUE MUNICIPALE AUTOMATISÉE — ANNÉE 2032',
    h1: "NO AI ACT — enquêter sur l'IA pour comprendre la règle",
    lead:
      "Quatorze dossiers. Des systèmes d'intelligence artificielle. Des personnes réelles. Vous êtes l'inspecteur : examinez les pièces, classez le risque, signez votre rapport.",
    sezioni: [
      {
        titolo: 'Une ville où la règle est arrivée trop tard',
        blocchi: [
          {
            intro: true,
            testo:
              "En 2032, dans cette ville, l'AI Act n'est jamais entré en vigueur. Tout fonctionne : les files d'attente n'existent plus, les décisions arrivent avant les demandes. Personne ne sait plus qui décide, ni comment contester."
          },
          {
            testo:
              "Vous ouvrez un dossier à la fois. Chacun contient un signal décisif, un compte rendu qui minimise le risque et un élément de contexte. Votre travail n'est pas de deviner la bonne réponse : c'est de <strong>fonder une décision sur des preuves</strong> et de l'assumer."
          }
        ]
      },
      {
        titolo: 'Ce que le jeu enseigne, et ce qu\'il ne prétend pas enseigner',
        blocchi: [
          {
            testo:
              "Quatre habitudes : classer le risque à partir du <strong>contexte d'usage</strong>, fonder les décisions sur des <strong>preuves citées</strong>, distinguer le contrôle humain <strong>effectif</strong> du contrôle formel, et imputer les obligations au <strong>bon responsable</strong>."
          },
          {
            lista: [
              "Il ne couvre pas tout le règlement : c'est une introduction raisonnée à ses concepts porteurs.",
              "Il ne remplace pas la lecture du texte, et encore moins l'avis d'un professionnel.",
              "Il n'est pas un questionnaire : chaque dossier admet des décisions partiellement correctes, et c'est là que se trouve l'apprentissage."
            ]
          }
        ]
      },
      {
        titolo: 'Gratuit, dans le navigateur, sans compte',
        blocchi: [
          {
            testo:
              "Le jeu tourne dans votre navigateur. Aucun compte, aucune donnée personnelle collectée, aucune requête réseau pendant la partie : sauvegarde et préférences restent sur votre appareil. Détails sur la page <a href=\"{FR}protection-des-donnees-des-la-conception/\">protection des données dès la conception</a>."
          },
          {
            callout:
              "<strong>Pour commencer :</strong> <a href=\"{ROOT}play/?lang=fr\">jouer maintenant</a>, ou lire d'abord <a href=\"{FR}comment-ca-marche/\">comment ça marche</a> et le <a href=\"{FR}guide-ai-act/\">guide de l'AI Act</a>."
          }
        ]
      }
    ]
  },
  {
    slug: 'comment-ca-marche',
    it: 'come-funziona/',
    en: 'en/how-it-works/',
    title: 'Comment fonctionne NO AI ACT : la boucle de jeu expliquée',
    description:
      "La boucle de NO AI ACT, étape par étape : incident, enquête, pièces citées, classification, mesure, responsable, motivation, rapport et débriefing.",
    ogTitle: 'Comment fonctionne NO AI ACT',
    ogDescription:
      "De l'incident au rapport signé : les cinq décisions que chaque dossier demande, et ce que le débriefing explique ensuite.",
    breadcrumb: 'Comment ça marche',
    eyebrow: "POSTE D'INSPECTION",
    h1: 'Comment fonctionne NO AI ACT',
    lead:
      "Un dossier, cinq décisions, un rapport qui peut être attaqué. La boucle est courte : ce qui prend du temps, c'est de la rendre défendable.",
    sezioni: [
      {
        titolo: 'La boucle, étape par étape',
        blocchi: [
          {
            intro: true,
            testo:
              "Incident → enquête → appréciation des preuves → décision → conséquences → débriefing. Chaque étape reste modifiable jusqu'à la signature."
          },
          {
            lista: [
              "<strong>Les pièces.</strong> Vous ouvrez les documents du dossier et citez ceux qui fondent votre classification. En citer deux est le minimum ; en citer les bons est le travail.",
              "<strong>La classification.</strong> Pratique interdite, haut risque, obligation de transparence, risque faible, ou hors du champ du règlement.",
              "<strong>La mesure.</strong> Bloquer, instaurer un contrôle humain, activer un audit, informer, marquer les contenus, améliorer données et journaux — ou aucune mesure.",
              "<strong>Le responsable.</strong> Fournisseur, déployeur, autorité utilisatrice, responsable humain désigné, prestataire externe.",
              "<strong>La motivation.</strong> Trois formulations possibles, dont une seule tient au regard des pièces citées."
            ]
          }
        ]
      },
      {
        titolo: 'Signer ne veut pas dire avoir bien répondu',
        blocchi: [
          {
            testo:
              "L'évaluation vient après la signature, et elle porte sur trois axes distincts : la <strong>validité juridique</strong> de la classification, la <strong>qualité probatoire</strong> des pièces citées, et la solidité de la <strong>motivation</strong>. On peut avoir raison pour une mauvaise raison : le jeu le dit, au lieu de l'arrondir en un score unique."
          },
          {
            testo:
              "Le débriefing explique le raisonnement attendu, nomme l'élément à observer et la norme liée, puis propose comment raisonner au dossier suivant. Il ne modifie ni le rapport ni l'issue."
          }
        ]
      },
      {
        titolo: 'Quatorze dossiers, du plus net au plus ambigu',
        blocchi: [
          {
            testo:
              "On part de la notation sociale interdite et de la police prédictive, on arrive aux dossiers volontairement gris : agents conversationnels publics, marchés publics d'IA, plateformes éducatives adaptatives, modèles à usage général utilisés en aval. <a href=\"{FR}categories-de-risque-ai-act/\">La liste des catégories de risque</a> donne la grille."
          },
          { testo: `Une partie sur un seul dossier dure 10 à 15 minutes ; les parcours complets, 60 à 90 minutes. ${DISCLAIMER}` }
        ]
      }
    ]
  },
  {
    slug: 'education',
    it: 'educazione/',
    en: 'en/education/',
    title: "Ressources éducatives sur l'AI Act : par où commencer",
    description:
      "Les ressources pédagogiques de NO AI ACT : guide de l'AI Act, glossaire, maîtrise de l'IA, usage en classe. Gratuit, sans compte, sans collecte de données.",
    ogTitle: "Ressources éducatives sur l'AI Act",
    ogDescription:
      "Un point d'entrée organisé par intention : comprendre la règle, enseigner la règle, ou jouer pour la comprendre.",
    breadcrumb: 'Ressources éducatives',
    eyebrow: 'RESSOURCES',
    h1: "Ressources éducatives sur l'AI Act",
    lead:
      "Trois chemins selon ce que vous cherchez : comprendre le règlement, l'enseigner, ou l'éprouver en jouant.",
    sezioni: [
      {
        titolo: 'Comprendre le règlement',
        blocchi: [
          {
            lista: [
              "<a href=\"{FR}guide-ai-act/\">Guide de l'AI Act</a> — la structure du règlement, de l'approche fondée sur le risque aux obligations.",
              "<a href=\"{FR}categories-de-risque-ai-act/\">Catégories de risque</a> — l'échelle, et ce qui fait passer un système d'un échelon à l'autre.",
              "<a href=\"{FR}glossaire/\">Glossaire</a> — les termes du règlement, avec ce qu'ils ne signifient pas.",
              "<a href=\"{FR}maitrise-de-l-ia/\">Maîtrise de l'IA</a> — pourquoi connaître les règles fait partie de la compétence."
            ]
          }
        ]
      },
      {
        titolo: 'Enseigner le règlement',
        blocchi: [
          {
            testo:
              "La page <a href=\"{FR}ai-act-pour-enseignants/\">pour les enseignants</a> donne la structure en trois temps — avant, pendant, après — et le mode enseignant du jeu : pauses de discussion après chaque dossier, débriefing local exportable, aucune donnée d'élève."
          }
        ]
      },
      {
        titolo: 'Éprouver le règlement en jouant',
        blocchi: [
          {
            testo:
              "Le jeu transforme chaque concept en une décision à prendre et à défendre. <a href=\"{FR}comment-ca-marche/\">Comment ça marche</a> explique la boucle ; <a href=\"{ROOT}play/?lang=fr\">jouer</a> la met à l'épreuve."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'ai-act-pour-enseignants',
    it: 'ai-act-per-docenti/',
    en: 'en/ai-act-for-teachers/',
    title: "AI Act pour les enseignants : utiliser le jeu en classe",
    description:
      "Comment utiliser NO AI ACT en classe : structure en trois temps, mode enseignant, pauses de discussion, débriefing local. Sans compte ni données d'élèves.",
    ogTitle: "L'AI Act pour les enseignants et les formateurs",
    ogDescription:
      "Une séance de 20 à 40 minutes, aucune donnée d'élève, un débriefing local exportable. Ce qui marche, et ce que le jeu ne mesure pas.",
    breadcrumb: 'Pour les enseignants',
    eyebrow: 'ENSEIGNANTS ET CLASSE',
    h1: "L'AI Act pour les enseignants et les formateurs",
    lead:
      "Une structure en trois temps, un mode enseignant qui ouvre la discussion après chaque dossier, et rien qui sorte de l'appareil.",
    sezioni: [
      {
        titolo: 'Avant, pendant, après',
        blocchi: [
          {
            lista: [
              "<strong>Avant.</strong> Jouez un dossier seul, choisissez le parcours (démo, atelier ou complet), fixez deux ou trois objectifs. Le <a href=\"{FR}guide-ai-act/\">guide</a> donne le cadre.",
              "<strong>Pendant.</strong> Projetez le jeu ou faites jouer par deux. Le mode enseignant insère une pause de discussion après chaque dossier, avec les questions pour la classe.",
              "<strong>Après.</strong> Ouvrez le débriefing enseignant depuis le rapport final : décisions, concepts rencontrés, questions. Exportable en texte ou en JSON."
            ]
          }
        ]
      },
      {
        titolo: "Ce que le jeu ne fait pas, et c'est voulu",
        blocchi: [
          {
            lista: [
              "Aucun compte, aucune classe à créer, aucune donnée d'élève : le débriefing est local et son export ne contient ni nom, ni adresse, ni établissement.",
              "<strong>Aucun minuteur et aucune comparaison entre groupes.</strong> Le jeu ne mesure pas le temps des élèves et ne les met pas en concurrence.",
              "Aucune note certifiée : l'autocontrôle est un outil formatif, pas une évaluation."
            ]
          }
        ]
      },
      {
        titolo: 'Ce qui reste à démontrer',
        blocchi: [
          {
            testo:
              "<strong>L'efficacité pédagogique de NO AI ACT n'a pas été validée empiriquement.</strong> Il n'existe pas d'étude contrôlée sur l'apprentissage ou le transfert. Les usages en classe rapportés sont des retours d'expérience, pas des résultats de recherche — et il serait plus confortable de ne pas l'écrire ici."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'guide-ai-act',
    it: 'guida-ai-act/',
    en: 'en/eu-ai-act-guide/',
    title: "Guide de l'AI Act : structure, risques et obligations",
    description:
      "L'AI Act européen expliqué simplement : approche fondée sur le risque, pratiques interdites, haut risque, transparence, IA à usage général, et qui répond de quoi.",
    ogTitle: "Guide de l'AI Act européen",
    ogDescription:
      "La structure du règlement (UE) 2024/1689, tel que modifié en 2026 : les quatre niveaux de risque et les obligations qui en découlent.",
    breadcrumb: "Guide de l'AI Act",
    eyebrow: 'RÈGLEMENT (UE) 2024/1689',
    h1: "Guide de l'AI Act européen",
    lead:
      "Le règlement ne classe pas les technologies : il classe les <strong>usages</strong>. C'est la clé qui rend le reste lisible.",
    sezioni: [
      {
        titolo: 'Une approche fondée sur le risque',
        blocchi: [
          {
            intro: true,
            testo:
              "Le même modèle peut être hors du champ du règlement dans un usage et à haut risque dans un autre. Ce qui compte : la <strong>destination</strong>, le <strong>contexte d'usage</strong> et les <strong>effets sur les personnes</strong>."
          },
          {
            lista: [
              "<a href=\"{FR}pratiques-interdites-ai-act/\"><strong>Pratiques interdites</strong></a> — incompatibles avec les droits fondamentaux : aucun audit ne les régularise.",
              "<a href=\"{FR}systemes-ia-a-haut-risque/\"><strong>Haut risque</strong></a> — permis, sous obligations fortes et vérifiables.",
              "<a href=\"{FR}obligations-de-transparence/\"><strong>Transparence</strong></a> — savoir qu'on parle à une machine, reconnaître un contenu de synthèse.",
              "<strong>Risque faible</strong> — ce qui reste en dehors des trois premiers régimes."
            ]
          }
        ]
      },
      {
        titolo: 'Fournisseur et déployeur : la distinction qui porte tout',
        blocchi: [
          {
            testo:
              "Le <strong>fournisseur</strong> développe le système ou le met sur le marché ; le <strong>déployeur</strong> l'utilise sous sa propre autorité. Les obligations se répartissent entre les deux, et le déployeur ne peut pas tout reporter sur le fournisseur : « le fournisseur est certifié » ne répond pas de l'usage."
          },
          {
            testo:
              "Quatre des quatorze dossiers du jeu reposent sur cette distinction. C'est aussi pourquoi le terme français est <strong>déployeur</strong> et non « utilisateur » : « utilisateur » effacerait la responsabilité que le mot désigne."
          }
        ]
      },
      {
        titolo: 'Un calendrier qui a changé en 2026',
        blocchi: [
          {
            testo:
              "Le règlement (UE) 2026/1744 — le « Digital Omnibus » sur l'IA, en vigueur depuis le 27 juillet 2026 — a modifié l'AI Act, et notamment son calendrier d'application. Les dates des systèmes à haut risque ont été déplacées, et deux pratiques interdites ont été ajoutées."
          },
          {
            callout:
              "Cette page ne chiffre pas les échéances ni les sanctions : les dates et les montants exacts se lisent sur le texte consolidé, et une page pédagogique qui les recopie vieillit mal. " +
              DISCLAIMER
          }
        ]
      },
      {
        titolo: 'Et aussi',
        blocchi: [
          {
            lista: [
              "<a href=\"{FR}ia-a-usage-general/\">IA à usage général (GPAI)</a> — les modèles polyvalents et ce qui change en aval.",
              "<a href=\"{FR}glossaire/\">Glossaire</a> — chaque terme avec ce qu'il ne signifie pas.",
              "<a href=\"{ROOT}play/?lang=fr\">Le jeu</a> — quatorze dossiers pour éprouver la grille sur des situations concrètes."
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'glossaire',
    it: 'glossario/',
    en: 'en/glossary/',
    title: "Glossaire de l'AI Act : les termes expliqués simplement",
    description:
      "Les termes de l'AI Act en français officiel : fournisseur, déployeur, haut risque, hypertrucage, contrôle humain — avec ce qu'ils ne signifient pas.",
    ogTitle: "Glossaire de l'AI Act",
    ogDescription:
      "Chaque notice dit ce que le terme signifie et, surtout, ce qu'il ne signifie pas : c'est là que se logent les malentendus.",
    breadcrumb: 'Glossaire',
    eyebrow: 'GLOSSAIRE OPÉRATIONNEL',
    h1: "Glossaire de l'AI Act",
    lead:
      "Des notices brèves, dans la terminologie officielle française du règlement. Chacune porte une mise en garde : c'est elle qui évite l'erreur.",
    sezioni: [
      {
        titolo: 'Les acteurs',
        blocchi: [
          {
            lista: [
              "<strong>Fournisseur</strong> — celui qui développe le système d'IA ou le met sur le marché. <em>Ne signifie pas</em> qu'il répond de tout : le déployeur a aussi des obligations.",
              "<strong>Déployeur</strong> — celui qui utilise le système sous sa propre autorité, par exemple un organisme public. <em>Ne signifie pas</em> qu'il peut tout reporter sur le fournisseur.",
              "<strong>Autorité de surveillance du marché</strong> — l'autorité qui contrôle. Depuis 2026, le <strong>Bureau de l'IA</strong> est exclusivement compétent sur une partie des systèmes."
            ]
          }
        ]
      },
      {
        titolo: 'Les régimes',
        blocchi: [
          {
            lista: [
              "<strong>Pratique interdite</strong> — usage incompatible avec les droits fondamentaux (art. 5). <em>Ne signifie pas</em> que toute IA soit interdite : l'interdiction frappe des usages précis.",
              "<strong>Haut risque</strong> — système qui pèse sur les droits, la sécurité ou l'accès aux services. <em>Ne signifie pas</em> interdit : signifie documenté, supervisé et vérifiable.",
              "<strong>Notation sociale</strong> — score fondé sur le comportement social produisant des traitements défavorables dans des contextes sans rapport : interdit. <em>Ne signifie pas</em> que tout classement soit interdit.",
              "<strong>IA à usage général (GPAI)</strong> — modèle polyvalent avec ses propres obligations. <em>Ne signifie pas</em> qu'il soit toujours à haut risque : compte l'usage en aval."
            ]
          }
        ]
      },
      {
        titolo: 'Les garanties',
        blocchi: [
          {
            lista: [
              "<strong>Contrôle humain</strong> — supervision effective, pas formelle. Un humain qui suit toujours la machine n'est pas un contrôle.",
              "<strong>Hypertrucage</strong> — contenu de synthèse imitant des personnes ou des événements réels ; il doit être rendu reconnaissable (art. 50). C'est le terme du texte français : « deepfake » n'y figure pas.",
              "<strong>Gouvernance des données</strong> — quelles données, combien de temps, qui y accède et pourquoi. <em>Ne signifie pas</em> tout collecter « par sécurité ».",
              "<strong>Documentation technique</strong> — ce qui permet de vérifier le système. Sans elle, on ne peut ni expliquer ni contester une décision."
            ]
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'protection-des-donnees-des-la-conception',
    it: 'privacy-by-design/',
    en: 'en/privacy-by-design/',
    title: 'Protection des données dès la conception : nos choix',
    description:
      "NO AI ACT ne collecte aucune donnée personnelle : aucun compte, aucun traceur, aucune requête pendant la partie. Ce que cela coûte, et ce que cela protège.",
    ogTitle: 'Protection des données dès la conception',
    ogDescription:
      "Aucun compte, aucun cookie de suivi, aucune donnée d'élève. Les choix techniques qui rendent la promesse vérifiable, et leurs limites.",
    breadcrumb: 'Protection dès la conception',
    eyebrow: 'ARCHITECTURE',
    h1: 'Protection des données dès la conception',
    lead:
      "Un outil qui enseigne la régulation de l'IA et qui pisterait ses visiteurs serait une contradiction. Voici ce qui a été écarté, et au prix de quoi.",
    sezioni: [
      {
        titolo: 'Ce qui ne se produit pas',
        blocchi: [
          {
            lista: [
              "<strong>Aucun compte.</strong> Le jeu s'ouvre et se joue : rien à créer, rien à confirmer.",
              "<strong>Aucune requête réseau pendant la partie.</strong> Réponses, rapports et progression ne quittent jamais l'appareil ; la sauvegarde vit dans le stockage local du navigateur.",
              "<strong>Aucun traceur publicitaire, aucun formulaire externe, aucune iframe de tiers.</strong>",
              "<strong>Aucune donnée d'élève.</strong> Le mode enseignant produit un débriefing local ; son export ne contient ni nom, ni adresse électronique, ni classe, ni établissement."
            ]
          }
        ]
      },
      {
        titolo: 'Le seul tiers, et pourquoi',
        blocchi: [
          {
            testo:
              "Les pages du site chargent la mesure d'audience <strong>sans cookie</strong> de Cloudflare, qui ne crée pas d'identifiant persistant et ne suit pas les visiteurs d'un site à l'autre. C'est le seul hôte tiers du projet, et une liste d'autorisation vérifiée par les tests fait échouer la construction si un autre apparaît."
          }
        ]
      },
      {
        titolo: 'Le prix de ces choix, dit franchement',
        blocchi: [
          {
            testo:
              "Sans compte et sans traceur, le projet ne sait pas combien de personnes terminent un dossier, où elles abandonnent, ni quelles explications ne fonctionnent pas. <strong>Cette ignorance est le coût assumé de la promesse</strong>, et elle est aussi la raison pour laquelle l'efficacité pédagogique reste non validée."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  }
  ,
  {
    slug: 'categories-de-risque-ai-act',
    it: 'categorie-rischio-ai-act/',
    en: 'en/ai-act-risk-categories/',
    title: "Catégories de risque de l'AI Act : l'échelle expliquée",
    description:
      "Les quatre régimes de risque de l'AI Act : pratiques interdites, haut risque, obligations de transparence, risque faible. Ce qui fait changer un système d'échelon.",
    ogTitle: "Les catégories de risque de l'AI Act",
    ogDescription:
      "Le règlement ne classe pas les technologies mais les usages : la même technologie change de régime selon le contexte et les effets.",
    breadcrumb: 'Catégories de risque',
    eyebrow: 'ÉCHELLE DU RISQUE',
    h1: "Les catégories de risque de l'AI Act",
    lead:
      "Quatre régimes, et une règle qui les gouverne tous : ce qui compte n'est pas la technologie, mais la destination, le contexte et les effets sur les personnes.",
    sezioni: [
      {
        titolo: "Les quatre échelons",
        blocchi: [
          {
            lista: [
              "<strong>Pratiques interdites</strong> — l'usage est incompatible avec les droits fondamentaux. Aucune garantie ne le régularise : la seule réponse est l'arrêt.",
              "<strong>Haut risque</strong> — l'usage pèse sur les droits, la sécurité ou l'accès aux services. Il est permis, sous des obligations fortes et vérifiables.",
              "<strong>Obligations de transparence</strong> — les personnes doivent pouvoir reconnaître qu'elles parlent à une machine, ou qu'un contenu est de synthèse.",
              "<strong>Risque faible</strong> — ce qui reste en dehors des trois premiers. Ce n'est pas une catégorie définie par le règlement : c'est son complément."
            ]
          }
        ]
      },
      {
        titolo: "Ce qui fait changer d'échelon",
        blocchi: [
          {
            intro: true,
            testo:
              "Un modèle de reconnaissance d'images peut trier des photos de vacances ou filtrer des candidatures : même technologie, deux régimes. Trois questions suffisent presque toujours."
          },
          {
            lista: [
              "<strong>Quelle est la destination du système ?</strong> Ce pour quoi il est conçu, pas ce qu'il pourrait faire.",
              "<strong>Qui en subit les effets, et peut-il les contester ?</strong> Un score qui ferme une porte sans motivation est un problème, même s'il est exact.",
              "<strong>Le contexte est-il celui de la collecte des données ?</strong> Une donnée pertinente ici peut être arbitraire ailleurs : c'est ce déplacement qui transforme une évaluation en notation sociale."
            ]
          }
        ]
      },
      {
        titolo: 'Les régimes peuvent se cumuler',
        blocchi: [
          {
            testo:
              "Un système à haut risque qui dialogue avec le public porte <em>aussi</em> les obligations de transparence. Les présenter comme quatre cases étanches est une simplification pédagogique : dans le texte, elles se superposent."
          },
          {
            callout:
              "Les quatorze dossiers du <a href=\"{ROOT}play/?lang=fr\">jeu</a> parcourent cette échelle, y compris les dossiers miroirs où le même mécanisme tombe différemment selon le contexte. " +
              DISCLAIMER
          }
        ]
      }
    ]
  },
  {
    slug: 'pratiques-interdites-ai-act',
    it: 'pratiche-vietate-ai-act/',
    en: 'en/prohibited-ai-practices/',
    title: "Pratiques interdites par l'AI Act : ce qui ne se corrige pas",
    description:
      "Les pratiques d'IA interdites par l'article 5 de l'AI Act : notation sociale, police prédictive individuelle, reconnaissance des émotions, biométrie à distance.",
    ogTitle: "Les pratiques interdites par l'AI Act",
    ogDescription:
      "Certains usages ne s'atténuent pas : ils s'interdisent. Pourquoi l'article 5 existe, et où passent ses frontières.",
    breadcrumb: 'Pratiques interdites',
    eyebrow: 'ARTICLE 5',
    h1: "Les pratiques interdites par l'AI Act",
    lead:
      "Pour la plupart des systèmes, le règlement demande des garanties. Pour ceux-ci, il dit non : aucun audit, aucune supervision, aucune exactitude ne les rend licites.",
    sezioni: [
      {
        titolo: "Ce que l'article 5 écarte",
        blocchi: [
          {
            lista: [
              "<strong>La notation sociale</strong> — évaluer les personnes sur leur comportement social et en tirer des traitements défavorables dans des contextes sans rapport.",
              "<strong>La police prédictive individuelle</strong> — prévoir le risque qu'une personne commette une infraction sur la seule base du profilage ou de traits de personnalité.",
              "<strong>La reconnaissance des émotions</strong> sur les lieux de travail et dans les établissements d'enseignement, sauf exceptions limitées (raisons médicales ou de sécurité).",
              "<strong>L'identification biométrique à distance en temps réel</strong> dans les espaces accessibles au public à des fins répressives, sauf exceptions limitativement énumérées et autorisées.",
              "<strong>Les techniques manipulatrices ou exploitant une vulnérabilité</strong> qui causent un préjudice important."
            ]
          },
          {
            testo:
              "Le règlement (UE) 2026/1744 a ajouté deux lettres à cette liste. Elles portent leurs propres limites, et un interdit enseigné <em>plus large</em> que le texte est aussi faux qu'un interdit enseigné plus étroit : cette page ne les résume donc pas, elle renvoie au texte consolidé."
          }
        ]
      },
      {
        titolo: 'Pourquoi interdire au lieu d\'encadrer',
        blocchi: [
          {
            testo:
              "Parce que le dommage ne vient pas d'un défaut réparable, mais du fonctionnement lui-même. Un score social plus exact note toujours des personnes sur leur vie sociale ; une police prédictive mieux calibrée traite toujours quelqu'un en suspect pour ce qu'il est — où il vit, qui il connaît — et non pour ce qu'il fait."
          },
          {
            callout:
              "C'est la question que le jeu pose dans son premier dossier : si le système « fonctionne » à 92 %, pourquoi l'interdire plutôt que l'améliorer ? L'exactitude ne rend pas licite ce que le règlement exclut."
          }
        ]
      },
      {
        titolo: 'Les frontières, qui sont la partie difficile',
        blocchi: [
          {
            testo:
              "Tout classement n'est pas une notation sociale ; toute biométrie n'est pas interdite ; toute observation du comportement n'est pas une reconnaissance des émotions. Le régime dépend de la finalité, du contexte et de l'acteur. Voir les <a href=\"{FR}categories-de-risque-ai-act/\">catégories de risque</a> et les <a href=\"{FR}systemes-ia-a-haut-risque/\">systèmes à haut risque</a>, qui est là que tombent la plupart des cas réels."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'systemes-ia-a-haut-risque',
    it: 'sistemi-ai-ad-alto-rischio/',
    en: 'en/high-risk-ai-systems/',
    title: "Systèmes d'IA à haut risque : obligations et contrôle humain",
    description:
      "Les systèmes d'IA à haut risque selon l'AI Act : gestion des risques, qualité des données, documentation, journaux et contrôle humain effectif.",
    ogTitle: "Les systèmes d'IA à haut risque",
    ogDescription:
      "Haut risque ne veut pas dire interdit : veut dire documenté, supervisé et vérifiable. Et le contrôle humain doit pouvoir dire non.",
    breadcrumb: 'Systèmes à haut risque',
    eyebrow: 'ANNEXE III',
    h1: "Les systèmes d'IA à haut risque",
    lead:
      "Recrutement, aide sociale, santé, éducation, services essentiels : permis, mais sous des obligations que quelqu'un doit pouvoir vérifier.",
    sezioni: [
      {
        titolo: 'Les obligations, en clair',
        blocchi: [
          {
            lista: [
              "<strong>Gestion des risques</strong> — un processus continu, pas un document signé une fois.",
              "<strong>Gouvernance et qualité des données</strong> — des données représentatives, et la connaissance de leurs biais.",
              "<strong>Documentation technique</strong> — ce qui permet d'expliquer et de contester une décision.",
              "<strong>Journaux</strong> — la traçabilité de ce que le système a fait.",
              "<strong>Contrôle humain</strong> — effectif, pas formel.",
              "<strong>Exactitude, robustesse et cybersécurité</strong>, y compris après la mise en service."
            ]
          }
        ]
      },
      {
        titolo: 'Quand le contrôle humain est-il effectif',
        blocchi: [
          {
            intro: true,
            testo:
              "C'est le point où la plupart des dossiers du jeu se décident, et celui qu'il est le plus facile de simuler."
          },
          {
            lista: [
              "La personne <strong>comprend</strong> le système : ses limites, ses cas d'erreur, ce qu'il ne voit pas.",
              "Elle peut <strong>renverser</strong> le résultat, et le faire n'a pas de coût professionnel.",
              "Elle intervient <strong>avant</strong> que les effets ne retombent sur quelqu'un. Un réexamen seulement sur recours arrive après le dommage."
            ]
          },
          {
            testo:
              "Un agent qui « valide » 1 400 résultats par jour — vingt secondes par dossier — n'exerce pas un contrôle : il en fournit la trace."
          }
        ]
      },
      {
        titolo: "Une moyenne excellente peut cacher l'essentiel",
        blocchi: [
          {
            testo:
              "Une exactitude globale de 94 % laisse 6 % d'erreurs, et elles ne sont presque jamais réparties au hasard : elles se concentrent sur les groupes peu représentés dans les données. <strong>Un audit par sous-groupes</strong> n'est pas un raffinement statistique, c'est la différence entre un système gouverné et un système dont les dégâts restent invisibles."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'obligations-de-transparence',
    it: 'obblighi-trasparenza-ai-act/',
    en: 'en/transparency-obligations/',
    title: "Obligations de transparence de l'AI Act (article 50)",
    description:
      "L'article 50 de l'AI Act : savoir qu'on interagit avec une machine, et reconnaître un contenu de synthèse ou un hypertrucage. Deux obligations distinctes.",
    ogTitle: "Les obligations de transparence de l'AI Act",
    ogDescription:
      "Deux devoirs qu'on confond souvent : informer qu'une machine répond, et rendre reconnaissable un contenu généré.",
    breadcrumb: 'Transparence',
    eyebrow: 'ARTICLE 50',
    h1: "Les obligations de transparence",
    lead:
      "Ce n'est pas la génération de contenus qui pose problème, c'est l'impossibilité de distinguer. La transparence est le minimum, pas le point d'arrivée.",
    sezioni: [
      {
        titolo: 'Deux obligations distinctes',
        blocchi: [
          {
            lista: [
              "<strong>Interagir avec une machine.</strong> Qui dialogue avec un système d'IA doit en être informé. Un guichet automatique qui ne le dit pas crée une confiance qu'il ne mérite pas.",
              "<strong>Reconnaître un contenu de synthèse.</strong> Les contenus générés ou manipulés — y compris les <strong>hypertrucages</strong> — doivent être rendus reconnaissables par qui les crée ou les diffuse."
            ]
          },
          {
            testo:
              "Le règlement (UE) 2026/1744 a reporté une partie de ces devoirs — le marquage lisible par machine des contenus de synthèse — pour les fournisseurs de systèmes déjà sur le marché. <strong>Reporté n'est pas supprimé</strong>, et le report ne concerne pas l'ensemble de l'article 50."
          }
        ]
      },
      {
        titolo: 'Pourquoi marquer plutôt qu\'interdire',
        blocchi: [
          {
            testo:
              "Parce que le dommage n'est pas dans le contenu généré, il est dans la confusion. Une ville où un faux message institutionnel a provoqué une panique découvre ensuite que ses démentis ne sont plus crus non plus — y compris quand ils sont vrais. <strong>Un marquage manquant paraît un détail et érode la confiance de tous en tout</strong> : c'est là le dommage systémique."
          }
        ]
      },
      {
        titolo: 'Et pour un service public, la transparence ne suffit pas',
        blocchi: [
          {
            testo:
              "Un agent conversationnel public doit dire qu'il est une machine, mais aussi donner une information exacte, être supervisé, et laisser une <strong>porte humaine</strong> à laquelle frapper. Sans elle, l'automatisation devient un mur, et la responsabilité d'usage reste au <a href=\"{FR}guide-ai-act/\">déployeur</a>."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'ia-a-usage-general',
    it: 'ai-generativa-e-gpai/',
    en: 'en/general-purpose-ai/',
    title: "IA à usage général (GPAI) : obligations et usage en aval",
    description:
      "Les modèles d'IA à usage général dans l'AI Act : obligations du fournisseur, risque systémique, et ce qui change quand un modèle entre dans une décision concrète.",
    ogTitle: "IA à usage général et usage en aval",
    ogDescription:
      "Un modèle polyvalent n'est ni interdit ni automatiquement à haut risque : le risque naît de l'usage concret, en aval.",
    breadcrumb: 'IA à usage général',
    eyebrow: 'MODÈLES À USAGE GÉNÉRAL',
    h1: "IA à usage général et usage en aval",
    lead:
      "Le modèle n'est pas le point. Ce qui compte, c'est le moment où quelqu'un passe de l'ébauche à la décision.",
    sezioni: [
      {
        titolo: 'Deux niveaux de responsabilité qui se superposent',
        blocchi: [
          {
            lista: [
              "<strong>Le fournisseur du modèle</strong> porte ses propres obligations : documentation, information des acteurs en aval, respect du droit d'auteur, et — pour les modèles présentant un risque systémique — évaluation et atténuation de ce risque.",
              "<strong>Le déployeur</strong> répond de l'usage concret. Intégrer un modèle polyvalent dans un flux de décision ne transfère pas la responsabilité au fournisseur : cela en ajoute une."
            ]
          }
        ]
      },
      {
        titolo: 'Ébaucher, ou décider',
        blocchi: [
          {
            intro: true,
            testo:
              "C'est la frontière que le jeu met à l'épreuve dans son dernier dossier, et elle se franchit sans que personne ne l'annonce."
          },
          {
            testo:
              "Un modèle qui résume un document appuie le travail. Le même modèle qui rédige un projet de décision que personne ne vérifie fait entrer dans un acte officiel une référence qu'il a simplement inventée. Entre les deux, aucune mise à jour technique : seulement une habitude qui s'installe."
          },
          {
            lista: [
              "Une <strong>révision humaine effective</strong> des sorties, pas un avertissement en bas de page.",
              "La <strong>traçabilité</strong> des requêtes et des réponses qui ont servi à décider.",
              "Une <strong>politique d'usage</strong> aux frontières explicites : ce pour quoi le modèle peut servir, et ce pour quoi non.",
              "Le <strong>contrôle des données saisies</strong> dans les requêtes."
            ]
          }
        ]
      },
      {
        titolo: 'Et si le fournisseur est aussi le déployeur',
        blocchi: [
          {
            testo:
              "Depuis 2026, le <strong>Bureau de l'IA</strong> est exclusivement compétent pour la surveillance des systèmes construits sur un modèle à usage général par le même fournisseur, et pour ceux intégrés dans les très grandes plateformes. Une entreprise qui construit une application sur son propre modèle n'a plus pour interlocuteur l'autorité de son pays : elle a la Commission."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  },
  {
    slug: 'maitrise-de-l-ia',
    it: 'alfabetizzazione-ai/',
    en: 'en/ai-literacy/',
    title: "Maîtrise de l'IA : connaître les modèles et leurs règles",
    description:
      "La maîtrise de l'IA selon l'article 4 de l'AI Act : ce que l'obligation demande vraiment, ce qu'elle ne garantit pas, et pourquoi connaître la règle en fait partie.",
    ogTitle: "La maîtrise de l'IA",
    ogDescription:
      "Savoir comment fonctionne un modèle ne suffit pas : savoir ce qui est permis, interdit ou conditionné fait partie de la compétence.",
    breadcrumb: "Maîtrise de l'IA",
    eyebrow: 'ARTICLE 4',
    h1: "La maîtrise de l'IA",
    lead:
      "Comprendre un modèle et comprendre son encadrement sont deux compétences. Le règlement demande les deux, et il le demande avec prudence.",
    sezioni: [
      {
        titolo: "Ce que l'article 4 demande, exactement",
        blocchi: [
          {
            testo:
              "Fournisseurs et déployeurs prennent des mesures pour <strong>soutenir le développement</strong> d'un niveau suffisant de maîtrise de l'IA chez leur personnel. Le règlement (UE) 2026/1744 a précisé la formulation, et la précision compte : <strong>l'obligation ne consiste pas à garantir le niveau d'une personne donnée</strong>."
          },
          {
            callout:
              "C'est une limite à ce qu'on peut exiger, pas une remise sur l'obligation. Une page qui écrit « l'article 4 impose de garantir » enseigne un devoir plus large que le texte — et l'erreur a été commise sur ce site avant d'être corrigée."
          }
        ]
      },
      {
        titolo: 'Pourquoi la règle fait partie de la compétence',
        blocchi: [
          {
            testo:
              "On peut savoir exactement comment un modèle de classification fonctionne et ne pas voir qu'en filtrant des candidatures il devient un système à haut risque. La compétence technique ne dit pas où passent les frontières : ce sont deux savoirs différents, et le second est rarement enseigné."
          },
          {
            lista: [
              "Reconnaître le <strong>contexte d'usage</strong> comme ce qui détermine le régime.",
              "Distinguer un problème de <strong>qualité</strong>, qui se corrige, d'un <strong>interdit de finalité</strong>, qui ne se corrige pas.",
              "Savoir qui porte l'obligation, et que « le fournisseur est certifié » ne répond pas de l'usage."
            ]
          }
        ]
      },
      {
        titolo: 'Apprendre en décidant',
        blocchi: [
          {
            testo:
              "C'est le pari de ce projet : une règle devient compréhensible quand il faut l'appliquer à un cas concret et en assumer l'issue. Les <a href=\"{ROOT}play/?lang=fr\">quatorze dossiers</a> servent à cela, et le <a href=\"{FR}glossaire/\">glossaire</a> à y revenir."
          },
          {
            testo:
              "<strong>Ce que ce projet ne démontre pas :</strong> que cette méthode fonctionne mieux qu'une autre. L'efficacité pédagogique n'a pas été validée empiriquement, et il n'existe pas d'étude contrôlée sur l'apprentissage ou le transfert."
          },
          { callout: DISCLAIMER }
        ]
      }
    ]
  }
];

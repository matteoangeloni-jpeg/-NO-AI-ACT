// Editorial research, not search-volume estimates or automatic content changes.
export const researchedAt = '2026-10-18';
export const topics = [
  ['game', 'en', 'P1', 'Scoperta del gioco', 'Conservare categoria e marchio; chiarire accesso gratuito e lingue giocabili.'],
  ['classroom', 'en/for-educators', 'P1', 'Preparare una lezione', 'Rendere immediatamente reperibili obiettivi, materiali, conduzione e discussione finale.'],
  ['literacy', 'en/ai-literacy', 'P1', 'Comprendere e discutere l’IA', 'Collegare un esercizio sulle prove a una domanda di riflessione; distinguere alfabetizzazione e certificazione.'],
  ['guide', 'en/eu-ai-act-guide', 'P2', 'Capire il regolamento', 'Rispondere alla domanda con un esempio circoscritto, fonti ufficiali e rimandi ai concetti; non duplicare la normativa.'],
  ['risk', 'en/ai-act-risk-categories', 'P2', 'Confrontare classificazioni', 'Mostrare come scopo e contesto cambiano la valutazione; distinguere categorie e obblighi trasversali.'],
  ['high', 'en/high-risk-ai-systems', 'P2', 'Esaminare un caso concreto', 'Sviluppare un esempio con fatti necessari e limiti; verificare condizioni normative prima di affermare obblighi.'],
  ['transparency', 'en/transparency-obligations', 'P2', 'Comprendere trasparenza e contenuti sintetici', 'Distinguere riconoscibilità, informazione e liceità; usare esempi, non una promessa di conformità.'],
  ['prohibited', 'en/prohibited-ai-practices', 'P2', 'Capire pratiche vietate e condizioni', 'Esplicitare contesto, condizioni ed eventuali eccezioni con verifica specialistica; collegare al caso pertinente.']
];

export const markets = {
  it: {
    name: 'Italiano', market: 'Italia; lingua italiana, non un filtro geografico implicito',
    angle: 'Serious game e laboratorio di educazione civica: partire da casi, prove e discussione in classe, non da corsi di certificazione.',
    queries: ['gioco educativo AI Act docenti scuola serious game', 'AI Act spiegato semplice alfabetizzazione intelligenza artificiale docenti'],
    sources: [
      ['https://scuolafutura.pubblica.istruzione.it/en/-didattica-digitale-integrata-per-la-transizione-digitale-per-la-scuola-secondaria-di-primo-e-secondo-grado-e-cpia', 'Contesto didattico: laboratori e cittadinanza digitale; non prova di domanda della keyword.'],
      ['https://www.consilium.europa.eu/it/policies/artificial-intelligence-act/', 'Terminologia istituzionale da confrontare nella revisione normativa.']
    ],
    phrases: [
      ['gioco educativo AI Act', 'serious game AI Act gratuito'],
      ['insegnare AI Act in classe', 'laboratorio AI Act educazione civica'],
      ['alfabetizzazione all’intelligenza artificiale', 'attività alfabetizzazione IA scuola'],
      ['AI Act spiegato semplice', 'come funziona il regolamento europeo intelligenza artificiale'],
      ['categorie rischio AI Act esempi', 'classificazione rischio intelligenza artificiale'],
      ['sistemi IA ad alto rischio esempi', 'AI Act selezione del personale esempio'],
      ['obblighi trasparenza AI Act esempi', 'deepfake e trasparenza AI Act'],
      ['pratiche vietate AI Act esempi', 'AI Act riconoscimento emozioni scuola']
    ]
  },
  en: {
    name: 'English', market: 'English-language audience in Europe and beyond; not limited to the UK',
    angle: 'An investigative classroom game about the EU AI Act; evidence and debriefing distinguish it from coding tutorials and generic AI tools.',
    queries: ['AI Act educational game classroom teachers', 'AI literacy classroom activities EU AI Act game'],
    sources: [
      ['https://datascience.uni-greifswald.de/forschung/research-artefacts/gaim-playfully-learn-basics-on-the-eu-ai-act/', 'Adjacent playable AI Act introduction: GAIM; not a tested comparison of learning effectiveness.'],
      ['https://experience-ai.org/en/themes/ai-and-critical-thinking', 'Publisher-owned classroom resource; critical-thinking audience and resource format.'],
      ['https://citizensinpower.org/activity/intergames-next/', 'Project-owned description of game-based AI and digital-citizenship education.']
    ],
    phrases: [
      ['AI Act educational game', 'free EU AI Act serious game'],
      ['teach the AI Act in the classroom', 'AI Act lesson plan for teachers'],
      ['AI literacy classroom activities', 'critical AI literacy activities'],
      ['EU AI Act explained with examples', 'EU AI Act beginner guide'],
      ['EU AI Act risk categories examples', 'AI Act risk classification exercise'],
      ['high risk AI systems examples', 'AI Act recruitment case study'],
      ['AI Act transparency obligations examples', 'deepfake disclosure AI Act'],
      ['prohibited AI practices examples', 'AI Act emotion recognition education']
    ]
  },
  fr: {
    name: 'Français', market: 'Public francophone européen; ne pas supposer un classement propre à la France',
    angle: 'Jeu sérieux, analyse de preuves et EMI: distinguer la séquence pédagogique sur les décisions automatisées des outils générant les devoirs.',
    queries: ['"AI Act" "jeu sérieux" formation', '"intelligence artificielle" "jeu" "CLEMI"', '"maîtrise de l’IA" enseignants ressources'],
    sources: [
      ['https://ww2.ac-poitiers.fr/clemi/spip.php?article643', 'Kit pédagogique Face à l’IA: ressource adjacente de jeu et débriefing, pas partenariat.'],
      ['https://eduscol.education.gouv.fr/6792/les-enjeux-ethiques-de-l-intelligence-artificielle', 'Contexte institutionnel: esprit critique, enjeux éthiques et ressources pédagogiques.'],
      ['https://eur-lex.europa.eu/legal-content/FR/TXT/PDF/?uri=OJ%3AC_202602826', 'Terminologie de maîtrise de l’IA et formation des enseignants.']
    ],
    phrases: [
      ['jeu sérieux AI Act', 'jeu pédagogique règlement européen intelligence artificielle'],
      ['enseigner l’AI Act en classe', 'séquence pédagogique IA esprit critique'],
      ['maîtrise de l’intelligence artificielle', 'activités pédagogiques maîtrise de l’IA'],
      ['comprendre le règlement européen sur l’IA', 'AI Act expliqué avec exemples'],
      ['catégories de risque AI Act exemples', 'classer les risques d’un système d’IA'],
      ['systèmes d’IA à haut risque exemples', 'AI Act recrutement étude de cas'],
      ['obligations de transparence AI Act exemples', 'hypertrucages transparence AI Act'],
      ['pratiques interdites AI Act exemples', 'reconnaissance des émotions école AI Act']
    ]
  },
  de: {
    name: 'Deutsch', market: 'Deutschsprachiger EU-Kontext; keine pauschale DACH-Rechtsberatung',
    angle: 'KI-Kompetenz, Unterrichtsmaterial und begründete Fallentscheidungen. EU AI Act und KI-Verordnung verbinden; keine Zertifizierung versprechen.',
    queries: ['"AI Act" "Lernspiel" GAIM', '"KI-Verordnung" "Unterrichtsmaterial"', '"KI-Kompetenz" "Unterricht" Materialien'],
    sources: [
      ['https://www.consilium.europa.eu/de/policies/artificial-intelligence-act/', 'Institutionelle Bezeichnung KI-Verordnung.'],
      ['https://iwjunior.de/weitere-formate/ki-kompetenzbox/', 'Anbieterquelle: KI-Kompetenz und Unterrichtsmaterial als benachbarter Ressourcenbedarf.'],
      ['https://appcamps.de/unterrichtsmaterial/kuenstliche-intelligenz/', 'Anbieterquelle: Unterrichtseinheiten und praktische Einführung; kein direkter AI-Act-Kursvergleich.']
    ],
    phrases: [
      ['Lernspiel zum EU AI Act', 'KI-Verordnung spielerisch lernen'],
      ['KI-Verordnung Unterrichtsmaterial', 'AI Act Unterrichtseinheit'],
      ['KI-Kompetenz im Unterricht', 'KI-Kompetenz Übungen Schule'],
      ['KI-Verordnung einfach erklärt', 'EU AI Act Beispiele'],
      ['KI-Verordnung Risikoklassen Beispiele', 'KI Risiken im Unterricht einordnen'],
      ['Hochrisiko-KI Beispiele', 'KI-Verordnung Personalauswahl Fallbeispiel'],
      ['KI-Verordnung Transparenzpflichten Beispiele', 'Deepfakes Kennzeichnung AI Act'],
      ['verbotene KI-Praktiken Beispiele', 'Emotionserkennung Schule KI-Verordnung']
    ]
  },
  es: {
    name: 'Español', market: 'España como contexto normativo de referencia; contenido en español accesible internacionalmente',
    angle: 'Situaciones de aprendizaje y alfabetización crítica en IA: explicar el Reglamento con casos, sin presentarlo como formación homologada.',
    queries: ['"reglamento inteligencia artificial" "juego" educativo', '"alfabetización" "inteligencia artificial" docentes INTEF recursos'],
    sources: [
      ['https://www.consilium.europa.eu/es/policies/artificial-intelligence-act/', 'Terminología institucional Reglamento de Inteligencia Artificial.'],
      ['https://intef.es/Noticias/nueva-version-de-la-guia-sobre-el-uso-de-la-inteligencia-artificial-en-el-ambito-educativo/', 'Fuente del editor: guía con situaciones de aprendizaje y reflexión crítica.'],
      ['https://intef.es/experiencias_edu/jugando-con-datos-%F0%9F%8F%86/', 'Experiencia educativa publicada por INTEF: datos, reglas de juego y análisis; recurso adyacente.']
    ],
    phrases: [
      ['juego educativo sobre el AI Act', 'aprender el Reglamento de IA jugando'],
      ['actividad AI Act para el aula', 'situación de aprendizaje inteligencia artificial ética'],
      ['alfabetización en inteligencia artificial', 'actividades alfabetización IA alumnado'],
      ['Reglamento de Inteligencia Artificial explicado', 'AI Act explicado con ejemplos'],
      ['categorías de riesgo IA ejemplos', 'clasificación de riesgos AI Act ejercicio'],
      ['sistemas de IA de alto riesgo ejemplos', 'AI Act selección de personal caso práctico'],
      ['obligaciones de transparencia IA ejemplos', 'ultrafalsificaciones transparencia AI Act'],
      ['prácticas de IA prohibidas ejemplos', 'reconocimiento de emociones escuela AI Act']
    ]
  },
  pt: {
    name: 'Português europeu', market: 'Portugal / pt-PT; não tratar a procura brasileira como equivalente',
    angle: 'Literacia em IA, pensamento crítico e cidadania digital. Manter vocabulário europeu e indicar as três línguas disponíveis no jogo.',
    queries: ['"inteligência artificial" "jogo" "literacia" Portugal', '"Regulamento IA" "professores" recursos', 'site.dge.mec.pt "inteligência artificial" "literacia"'],
    sources: [
      ['https://www.consilium.europa.eu/pt/policies/artificial-intelligence-act/', 'Terminologia institucional Regulamento Inteligência Artificial.'],
      ['https://digital.dge.mec.pt/noticias/mooc-inteligencia-artificial-vai-transformar-escola', 'Fonte institucional: literacia em IA e reflexão educativa; edição histórica, não inscrição atual.'],
      ['https://www.dge.mec.pt/node/5896', 'Contexto institucional de pensamento crítico e educação para os media.'],
      ['https://repositorio.ulisboa.pt/handle/10400.5/102559', 'Investigação adjacente sobre jogo e literacia em IA; não comprova resultados deste jogo.']
    ],
    phrases: [
      ['jogo educativo sobre o AI Act', 'aprender o Regulamento IA a jogar'],
      ['atividade AI Act para a sala de aula', 'recursos inteligência artificial cidadania digital'],
      ['literacia em inteligência artificial', 'atividades literacia em IA'],
      ['Regulamento Inteligência Artificial explicado', 'AI Act explicado com exemplos'],
      ['categorias de risco IA exemplos', 'classificação de riscos AI Act exercício'],
      ['sistemas de IA de risco elevado exemplos', 'AI Act recrutamento caso prático'],
      ['obrigações de transparência IA exemplos', 'falsificações profundas transparência AI Act'],
      ['práticas de IA proibidas exemplos', 'reconhecimento de emoções escola AI Act']
    ]
  }
};

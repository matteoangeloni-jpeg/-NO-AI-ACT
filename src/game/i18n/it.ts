/**
 * Dizionario ITALIANO — fonte di verità della forma `Locale`.
 * Ogni altra lingua deve fornire esattamente le stesse chiavi.
 * Contenuti normativi: versione didattica semplificata del
 * Regolamento (UE) 2024/1689. Non costituiscono consulenza legale.
 */
export const it = {
  ui: {
    gameTitle: 'NO AI ACT',
    gameSubtitle: 'Simulatore di una società non regolata',
    titleHeader: 'REPUBBLICA MUNICIPALE AUTOMATIZZATA — ANNO 2032',
    footerDisclaimer:
      "Versione didattica semplificata dell'AI Act (Reg. UE 2024/1689). Non costituisce consulenza legale.",
    menu: {
      continue: 'CONTINUA INDAGINE',
      newGame: 'NUOVA PARTITA',
      archive: 'ARCHIVIO NORME',
      credits: 'CREDITS E LICENZE',
      reset: 'RESET SALVATAGGIO',
      audioOn: 'AUDIO: ON',
      audioOff: 'AUDIO: OFF',
      motionFull: 'ANIMAZIONI: PIENE',
      motionReduced: 'ANIMAZIONI: RIDOTTE',
      crtOn: 'EFFETTO CRT: ON',
      crtOff: 'EFFETTO CRT: OFF',
      music: 'MUSICA: {value}',
      language: 'LINGUA: ITALIANO',
      teacherOn: 'MODALITÀ DOCENTE: ON',
      teacherOff: 'MODALITÀ DOCENTE: OFF',
      teacherScope: 'Debrief locale: niente classi, niente account, niente server.',
      resetDone: 'Salvataggio azzerato.'
    },
    preload: {
      systemName: 'SISTEMA CIVICO INTEGRATO',
      steps: [
        'generazione cartografia civica…',
        'compilazione segnaletica…',
        'calibrazione rumore di fondo…',
        'apertura archivio fascicoli…'
      ],
      accessGranted: 'accesso ispettorato: CONCESSO'
    },
    map: {
      header: 'MAPPA CIVICA — RETE DEI SISTEMI AUTOMATIZZATI',
      progress: 'ISPETTORE AX · CASI CHIUSI: {done}/{total}',
      statusOpen: '[ INCIDENTE APERTO ]',
      statusClosed: '[ CASO CHIUSO ]',
      statusNonCompliant: '[ CHIUSO — NON CONFORME ]',
      statusSealed: '[ FASCICOLO SOTTO SEQUESTRO ]',
      sealedToast: 'Fascicolo sotto sequestro. Autorizzazione di accesso negata.',
      alreadyClosedToast: '{code}: fascicolo già chiuso.',
      finaleReadyToast: 'Almeno quattro fascicoli sono chiusi. Il rapporto finale è disponibile.',
      finaleButton: 'RAPPORTO FINALE ▸',
      menuButton: 'MENU'
    },
    case: {
      fileLabel: 'FASCICOLO {code}',
      examineButton: 'ESAMINA I REPERTI ▸',
      backToMap: '◂ MAPPA'
    },
    evidence: {
      header: 'FASCICOLO {code} — REPERTI',
      instruction: 'Esaminare tutti i reperti, poi citare quelli che fondano la classificazione (almeno 2).',
      exhibit: 'REPERTO {num}',
      sealed: '[ SIGILLATO ]\n\nclic per esaminare',
      cite: 'CITA NEL RAPPORTO ▢',
      cited: 'CITATO NEL RAPPORTO ▣',
      allRevealedToast: 'Reperti esaminati. Citare almeno 2 reperti per procedere.',
      proceedButton: 'PROCEDI ALLA CLASSIFICAZIONE ▸',
      backToEvidence: '◂ REPERTI',
      sourceLabel: 'FONTE',
      sources: {
        amministrativa: 'fonte amministrativa',
        tecnica: 'fonte tecnica',
        vendor: 'dichiarazione del fornitore',
        reclamo: 'reclamo del cittadino',
        pubblica: 'comunicazione pubblica',
        log: 'log di sistema',
        interna: 'nota interna'
      }
    },
    decision: {
      step1: 'DECISIONE 1 DI 4 — CLASSIFICAZIONE',
      step2: 'DECISIONE 2 DI 4 — MISURA CORRETTIVA',
      step3: 'DECISIONE 3 DI 4 — SOGGETTO RESPONSABILE',
      step4: 'DECISIONE 4 DI 4 — MOTIVAZIONE',
      question1: "Come si qualifica questo sistema rispetto all'AI Act?",
      question2: "Quale misura dispone l'ispettorato?",
      question3: 'A chi imputi gli obblighi principali?',
      question4: 'Su quale motivazione fondi il rapporto?',
      contextNote:
        "Nel regolamento, il rischio non dipende solo dalla tecnologia, ma dal contesto d'uso, dalla finalità e dagli effetti sulle persone.",
      recorded: 'Classificazione registrata: {value}',
      keys5: 'tastiera: tasti 1–5 per selezionare',
      keys7: 'tastiera: tasti 1–7 per selezionare',
      keys3: 'tastiera: tasti 1–3 per selezionare',
      normsButton: 'CONSULTA NORME',
      normsHint: 'solo consultazione — clic fuori o ESC per chiudere',
      normsEmpty: 'Nessuna norma ancora acquisita.'
    },
    subjects: {
      provider: 'Provider (chi sviluppa il sistema)',
      deployer: 'Deployer (chi lo usa)',
      autorita: 'Autorità pubblica utilizzatrice',
      responsabile_umano: 'Responsabile umano designato',
      fornitore_esterno: 'Fornitore esterno'
    },
    report: {
      title: 'RAPPORTO ISPETTIVO',
      evidenceLabel: 'PROVE CITATE',
      decisionLabel: 'DECISIONE',
      subjectLabel: 'SOGGETTO RESPONSABILE',
      motivationLabel: 'MOTIVAZIONE',
      incidentLabel: 'EVENTO REGISTRATO',
      dominantLabel: 'RILIEVO PRINCIPALE',
      secondaryLabel: 'RILIEVI SECONDARI',
      continueButton: 'PROSEGUI ▸',
      noEvidence: 'nessuna prova citata',
      decisiveEvidenceLabel: 'PROVE DECISIVE',
      decisiveEvidenceOk: 'i reperti citati reggono la classificazione',
      decisiveEvidenceWeak: 'i reperti citati non bastano a reggere la classificazione',
      reasonLabel: 'Esito perché',
      reasons: {
        grounded: 'le prove citate sostengono la classificazione e la misura è proporzionata',
        classificazione: 'il sistema è stato classificato in un regime errato',
        prove: "l'atto è contestabile perché il fondamento probatorio è incompleto",
        misura_insufficiente: 'la misura proposta non governa il rischio principale',
        eccesso_cautela: 'la classificazione è corretta, ma spegnere tutto eccede la misura necessaria',
        soggetto: 'la classificazione è corretta, ma il soggetto responsabile è errato',
        trasparenza: 'manca la trasparenza richiesta: i cittadini non possono riconoscere il sistema o il contenuto',
        motivazione: 'la decisione è corretta, ma la motivazione è debole'
      }
    },
    outcomes: {
      conforme: 'CONFORME',
      parziale: 'PARZIALMENTE CONFORME',
      contestabile: 'CONTESTABILE',
      non_conforme: 'NON CONFORME'
    },
    errors: {
      classificazione: 'La classificazione non corrisponde al regime previsto dal regolamento.',
      prove: "Le prove citate non fondano la classificazione: l'atto è impugnabile.",
      misura_insufficiente: 'La misura tocca il sintomo: il sistema continua a decidere.',
      eccesso_cautela: 'Hai spento ciò che andava governato. Il servizio si ferma, il problema si sposta.',
      soggetto: 'Obblighi imputati a chi non poteva adempierli: nessuno risponde.',
      trasparenza: 'Misure attive, cittadini all\'oscuro: la fiducia non si ricostruisce al buio.',
      motivazione: 'La motivazione non regge: la decisione è giusta, il fondamento no.'
    },
    incident: {
      header: 'TELEX URGENTE — RISPOSTA RICHIESTA',
      hint: 'tastiera: tasti 1–3 per rispondere',
      logged: 'Risposta protocollata: {value}'
    },
    consequence: {
      qualityCorrect: 'DECISIONE CONFORME',
      qualityPartial: 'DECISIONE PARZIALE',
      qualityWrong: 'DECISIONE NON CONFORME',
      summary: 'Classificazione: {classification} · Misura: {measure}',
      territoryLabel: 'ESITO SUL TERRITORIO',
      noteLabel: 'NOTA INVESTIGATIVA',
      cityLabel: 'STATO DELLA CITTÀ',
      cluesMismatch:
        'I reperti citati nel rapporto non sostenevano la classificazione: l\'atto è impugnabile.',
      nextCorrect: 'NORMA ACQUISITA ▸',
      nextWrong: 'CONSULTA COMUNQUE LA NORMA ▸'
    },
    normCard: {
      democraticFunctionLabel: 'FUNZIONE DEMOCRATICA',
      unlocked: "NORMA ACQUISITA ALL'ARCHIVIO",
      subCorrect: 'Questa disposizione avrebbe reso il danno prevenibile o governabile.',
      subWrong: "La norma esisteva. In un'altra Europa, qualcuno l'avrebbe applicata.",
      backToMap: 'TORNA ALLA MAPPA ▸',
      disclaimer: 'versione didattica semplificata'
    },
    archive: {
      title: 'ARCHIVIO NORME — AI ACT',
      subtitle: 'Disposizioni acquisite: {done}/{total} · versione didattica semplificata',
      locked: 'NORMA NON ANCORA\nACQUISITA',
      hint: 'clic fuori dalla carta per chiudere (o ESC)',
      back: '◂ INDIETRO'
    },
    finale: {
      header: "RAPPORTO CONCLUSIVO DELL'ISPETTORATO",
      cityLabel: 'STATO FINALE DELLA CITTÀ',
      newGame: 'NUOVA PARTITA',
      archive: 'ARCHIVIO NORME',
      credits: 'CREDITS',
      debrief: 'DEBRIEF DOCENTE ▸'
    },
    debrief: {
      title: 'DEBRIEF DOCENTE — REPORT LOCALE',
      subtitle: 'Supporto locale per il debrief. Non crea classi, non registra studenti, non invia risultati a server.',
      casesLabel: 'CASI E RAPPORTI',
      caseLine: '{title} — esito: {outcome}',
      mainErrorLine: 'rilievo: {error}',
      noError: 'nessun rilievo',
      normsLine: 'Norme acquisite: {done}/{total}',
      timeLine: 'Tempo di completamento: {minutes} min',
      timeUnknown: 'Tempo di completamento: non disponibile',
      indicatorsLabel: 'INDICATORI FINALI',
      questionsLabel: 'DOMANDE PER LA DISCUSSIONE',
      reviewLabel: 'SUGGERIMENTO DI RIPASSO',
      reviewLine: 'Rivedere le carte dei casi con esito non conforme o contestabile.',
      downloadJson: 'SCARICA .JSON',
      downloadTxt: 'SCARICA .TXT',
      print: 'STAMPA',
      back: '◂ TORNA AL RAPPORTO',
      notCompleted: 'caso non completato',
      missionLine: 'Missione: {mission}',
      difficultyLine: 'Difficoltà: {difficulty}',
      privacyNote: 'I dati mostrati restano su questo dispositivo. L\'eventuale export è locale e non contiene nomi, email, classe o scuola.',
      recommendedHeader: 'PERCORSI CONSIGLIATI',
      recommendedLine: '{name} · {duration} · {goal}'
    },
    missions: {
      title: 'SCEGLI IL PERCORSO',
      subtitle: 'Un percorso suggerisce i casi consigliati. Puoi comunque giocarli tutti.',
      recommendedTag: 'CONSIGLIATO',
      durationLabel: 'durata',
      start: 'AVVIA PERCORSO ▸',
      modes: {
        demo: { name: 'Demo rapida', duration: '10–15 min', goal: 'Capire la logica del rapporto ispettivo.' },
        lab: { name: 'Laboratorio breve', duration: '25–35 min', goal: 'Distinguere pratica vietata, alto rischio e trasparenza.' },
        full: { name: 'Percorso completo', duration: '45–60 min', goal: 'Audit, responsabilità, misure e motivazione.' },
        advanced: { name: 'Percorso avanzato', duration: '60–75 min', goal: 'Casi ambigui e confini normativi (include il credito civico).' }
      }
    },
    difficulty: {
      title: 'LIVELLO DI DIFFICOLTÀ',
      label: 'DIFFICOLTÀ: {value}',
      modes: {
        base: { name: 'Base', desc: 'Istruzioni esplicite, suggerimenti dopo un errore, valutazione più indulgente.' },
        standard: { name: 'Standard', desc: 'Rapporto completo, feedback equilibrato. Consigliata per la demo.' },
        expert: { name: 'Esperto', desc: 'Pochi suggerimenti, feedback asciutto, severità su soggetto e motivazione.' }
      },
      hintLabel: 'DA RICONSIDERARE',
      hints: {
        classificazione: 'Rivedi la classificazione: confronta finalità e contesto d\'uso.',
        prove: 'Rivedi i reperti citati: sostengono davvero la classificazione?',
        misura_insufficiente: 'La misura è proporzionata al rischio principale?',
        eccesso_cautela: 'Forse non serve bloccare: il sistema può richiedere governance.',
        soggetto: 'Verifica il soggetto responsabile: chi ha l\'obbligo principale?',
        trasparenza: 'Attenzione alla trasparenza: i cittadini possono riconoscere il sistema?',
        motivazione: 'La motivazione regge rispetto ai reperti citati?'
      }
    },
    mobileGuard: {
      message: 'NO AI ACT è ottimizzato per desktop o tablet in orizzontale. Ruota il dispositivo o usa un computer per una migliore esperienza.'
    },
    creditsScene: {
      title: 'CREDITS',
      heading: 'NO AI ACT',
      roleLabel: 'Ideazione e direzione scientifica',
      author: 'Matteo Angeloni',
      affiliation: 'PhD Student — Università degli Studi della Tuscia',
      note:
        'Vertical slice sviluppata con supporto AI.\n' +
        'Asset grafici e audio procedurali.\n' +
        'Licenze e attribuzioni complete disponibili nei file del progetto.',
      back: '◂ TORNA AL TITOLO'
    },
    toastPrefixes: {
      info: 'AVVISO',
      warning: 'ATTENZIONE',
      alert: 'ALLARME',
      ok: 'REGISTRATO'
    },
    levels: {
      vietata: 'Pratica vietata',
      alto: 'Alto rischio',
      trasparenza: 'Trasparenza',
      restrittivo: 'Condizioni restrittive'
    }
  },

  briefing: {
    header: 'ISPETTORATO PER GLI INCIDENTI ALGORITMICI',
    sub: 'BRIEFING RISERVATO — PRATICA AX/2032',
    body:
      "Anno 2032. In questa città l'AI Act non è mai entrato in vigore.\n\n" +
      'La città funziona. Le code non esistono, i moduli si compilano da soli, ' +
      'le decisioni arrivano prima ancora delle domande.\n\n' +
      'Nessuno sa più chi decide. Nessuno sa più come contestare. ' +
      'Gli incidenti algoritmici si accumulano negli archivi come pratiche inevase.\n\n' +
      "Lei è l'Ispettore. Il suo mandato: indagare gli incidenti, classificare i " +
      "sistemi, imporre le misure. Per ogni caso chiuso, l'archivio le restituirà " +
      "la norma che — altrove, in un'altra Europa — avrebbe impedito tutto questo.\n\n" +
      'La città la sta aspettando. Cerchi di non abituarsi alla sua efficienza.',
    cta: 'ACCEDI ALLA MAPPA CIVICA'
  },

  classifications: {
    vietata: 'Pratica vietata',
    alto_rischio: 'Sistema ad alto rischio',
    trasparenza: 'Obbligo di trasparenza',
    basso_rischio: 'Basso rischio',
    non_rilevante: "Non rilevante per l'AI Act"
  },

  measures: {
    blocco: 'Bloccare il sistema',
    oversight: 'Introdurre human oversight',
    audit: 'Attivare audit e gestione del rischio',
    informare: 'Informare gli utenti',
    etichettare: 'Etichettare i contenuti generati da IA',
    dati_logging: 'Migliorare qualità dei dati e logging',
    nessuna: 'Nessuna misura'
  },

  indicators: {
    labels: {
      efficienza: 'EFFICIENZA',
      controllo: 'CONTROLLO SOCIALE',
      diritti: 'DIRITTI FONDAMENTALI',
      fiducia: 'FIDUCIA PUBBLICA'
    },
    comments: {
      correct: [
        'La decisione è contestabile. Quindi è legittima.',
        'Qualche processo rallenta. Qualche persona respira.',
        'Il sistema ora deve spiegarsi. È un inizio.'
      ],
      partial: [
        'Una toppa amministrativa. Il problema resta sotto la superficie.',
        'Meglio di niente. Ma "meglio di niente" non è governance.',
        'La misura mitiga il sintomo, non la causa.'
      ],
      wrong: [
        'I dashboard migliorano. Le persone no.',
        'Efficienza record. Nessuno sa più chi decide.',
        'Il sistema ringrazia. I cittadini non possono.'
      ]
    }
  },

  locations: {
    municipio: 'Municipio Centrale',
    lavoro: 'Agenzia del Lavoro',
    media: 'Media Center Civico',
    scuola: 'Scuola delle Emozioni',
    ospedale: 'Ospedale Predittivo',
    sorveglianza: 'Centro di Sorveglianza Urbana',
    welfare: "Ufficio Welfare e Servizi"
  },

  cases: {
    case_scoring: {
      title: 'La città dei punteggi',
      scenario:
        'Il Comune assegna a ogni cittadino un Indice di Affidabilità Civica. ' +
        'Il punteggio decide priorità di accesso a servizi, contributi, graduatorie ' +
        'e alloggi. Vengono penalizzati: proteste online, debiti pregressi, ' +
        '"frequentazioni a rischio" e comportamenti privi di ogni legame con il ' +
        "servizio richiesto. Tre famiglie hanno perso l'alloggio popolare questa " +
        'settimana. Nessuna ha capito perché.',
      clues: [
        {
          title: 'Dati non pertinenti',
          text:
            "Il punteggio per l'alloggio include cronologia social, multe stradali " +
            'e contatti telefonici. Nulla di tutto questo riguarda il diritto alla casa.'
        },
        {
          title: 'Penalità che migra',
          text:
            'Una protesta online del 2029 ha abbassato il punteggio sanitario, ' +
            'scolastico e abitativo di un cittadino. La penalizzazione si estende a ' +
            'contesti diversi da quello originario.'
        },
        {
          title: 'Motivazione assente',
          text:
            'La notifica ufficiale recita: "Punteggio insufficiente. Codice E-77". ' +
            'Nessun cittadino ha mai ottenuto una motivazione comprensibile o un ' +
            'canale di contestazione.'
        }
      ],
      noteCorrect:
        'Nota investigativa: il sistema non è migliorabile. Punisce le persone in ' +
        'contesti scollegati e senza giustificazione. Va spento, non corretto.',
      notePartial:
        'Nota investigativa: audit e supervisione non bastano. Un social scoring ' +
        'generalizzato resta incompatibile con dignità e uguaglianza: andava bloccato.',
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. Il punteggio continua a ' +
        'decidere chi ha diritto a una casa.',
      consequenceCorrect:
        'Il sistema viene disattivato. Le graduatorie tornano a criteri pertinenti ' +
        "e verificabili. L'ufficio reclami riapre: è lento, umano, contestabile.",
      consequenceWrong:
        "L'Indice di Affidabilità Civica viene esteso ai trasporti e alle mense " +
        "scolastiche. L'efficienza amministrativa sale. Le richieste di alloggio " +
        'delle famiglie segnalate scompaiono silenziosamente dalle code.',
      motivations: [
        "Il sistema è opaco: i cittadini non ricevono motivazioni comprensibili.",
        "Il punteggio produce trattamenti sfavorevoli in contesti estranei a quello di raccolta dei dati: social scoring vietato (art. 5).",
        "Il sistema raccoglie troppi dati: va alleggerito e reso più efficiente."
      ],
      debriefQuestions: [
        "Perché il social scoring generalizzato è vietato invece che semplicemente regolato?",
        "Che differenza c'è tra usare un dato nel suo contesto e fuori dal suo contesto?",
        "Un punteggio simile gestito da un privato sarebbe trattato allo stesso modo?"
      ],
      epilogue: "L'Indice di Affidabilità Civica è il banco di prova del divieto: o si spegne, o governa la città."
    },
    case_lavoro: {
      title: 'Il colloquio che non esiste',
      scenario:
        'Le aziende della città filtrano i candidati con un sistema di IA che ' +
        'analizza CV, video-colloqui, tono di voce, micro-espressioni, pause e ' +
        "percorsi professionali. L'esito arriva in 40 secondi: \"Profilo non " +
        'compatibile". Un ingegnere con dodici anni di esperienza è stato scartato ' +
        '217 volte. Nessun essere umano ha mai letto il suo curriculum.',
      clues: [
        {
          title: 'Nessuna spiegazione',
          text:
            'La notifica è identica per tutti: "Profilo non compatibile". Nessuna ' +
            'spiegazione individuale significativa, nessun riferimento ai criteri usati.'
        },
        {
          title: 'Percorsi non lineari puniti',
          text:
            'Il modello penalizza pause di carriera, congedi parentali e cambi di ' +
            'settore. Replica le discriminazioni dei dati storici di assunzione.'
        },
        {
          title: 'Supervisione di facciata',
          text:
            'Un addetto "convalida" 1.400 esiti al giorno: 20 secondi a pratica. ' +
            'Il controllo umano esiste sulla carta, non nei fatti.'
        }
      ],
      noteCorrect:
        'Nota investigativa: il reclutamento automatizzato può esistere, ma solo ' +
        'sotto obblighi verificabili: gestione del rischio, dati di qualità, ' +
        'supervisione umana reale, log e informazione ai candidati.',
      notePartial:
        'Nota investigativa: misura non calibrata. Un sistema ad alto rischio non ' +
        'va né lasciato a metà né semplicemente spento: servono audit, oversight ' +
        'effettivo e qualità dei dati.',
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. Le persone continuano a ' +
        'essere scartate da un sistema che nessuno può interrogare.',
      consequenceCorrect:
        "L'audit rivela bias contro percorsi non lineari. Il sistema viene " +
        'ricalibrato, i recruiter tornano a leggere i casi limite, i candidati ' +
        'ricevono motivazioni e un canale di ricorso.',
      consequenceWrong:
        "Il filtro viene adottato anche dall'ente pubblico per i tirocini. " +
        'Il tasso di "incompatibilità" tra chi ha avuto pause di cura familiare ' +
        "raggiunge l'81%. Nessuno se ne accorge: non esiste alcun log.",
      motivations: [
        "La selezione automatizzata dei candidati è di per sé una pratica vietata.",
        "I candidati non ricevono spiegazioni adeguate sugli esiti.",
        "Sistema di selezione del personale: alto rischio (Allegato III); dati distorti e supervisione di facciata violano gli obblighi."
      ],
      debriefQuestions: [
        "Chi deve garantire la qualità dei dati: chi sviluppa il sistema o chi lo usa?",
        "Quando il controllo umano è effettivo e quando è solo formale?",
        "Bloccare del tutto il sistema sarebbe stata una soluzione migliore? Perché no?"
      ],
      epilogue: "Il filtro decideva carriere in 40 secondi: ora ogni esito ha un responsabile, o continua a non averlo.",
      incident: {
        title: "IL FORNITORE SI SFILA",
        text: "Il fornitore del sistema dichiara per iscritto: \"ogni responsabilità d'uso ricade sull'utilizzatore\". Le direzioni HR chiedono istruzioni immediate.",
        options: {
          document: "Verbalizzare e notificare gli obblighi a fornitore e utilizzatore",
          suspend: "Sospendere lo screening in attesa di audit",
          minimize: "Prendere atto e lasciar proseguire"
        }
      }
    },
    case_media: {
      title: 'La città sintetica',
      scenario:
        'Il Comune produce video, audio e comunicati generati con IA senza ' +
        'dichiararlo. Ieri sera un falso videomessaggio "istituzionale" ha annunciato ' +
        "la contaminazione dell'acquedotto: panico, supermercati svuotati, tre " +
        "feriti. La smentita ufficiale è arrivata dopo quattro ore. Era anch'essa " +
        'generata. Nessuno le ha creduto.',
      clues: [
        {
          title: 'Nessuna etichetta',
          text:
            'I contenuti sintetici del Comune sono indistinguibili da quelli reali: ' +
            'nessuna etichetta, nessun watermark, nessuna dichiarazione di origine.'
        },
        {
          title: 'Autenticità apparente',
          text:
            'Il falso messaggio usava il formato, la voce sintetica e la grafica ' +
            'ufficiale. La fonte istituzionale appare autentica anche quando il ' +
            'contenuto è manipolato.'
        },
        {
          title: 'Fiducia non ricostruibile',
          text:
            'Sondaggio post-incidente: il 64% dei cittadini dichiara che non crederà ' +
            'più "a nessun comunicato, vero o falso". Le smentite non ricostruiscono ' +
            'la fiducia.'
        }
      ],
      noteCorrect:
        'Nota investigativa: il problema non è la generazione in sé, ma ' +
        "l'impossibilità di distinguere. L'etichettatura dei contenuti sintetici " +
        'è la condizione minima della comunicazione pubblica.',
      notePartial:
        'Nota investigativa: senza etichette visibili sui contenuti generati, ' +
        "ogni altra misura lascia i cittadini nell'indistinguibile.",
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. La città non sa più ' +
        'che cosa è reale.',
      consequenceCorrect:
        'Ogni contenuto generato o manipolato viene etichettato in modo visibile. ' +
        "I cittadini imparano a riconoscere l'origine dei messaggi. La fiducia " +
        'non torna subito, ma torna verificabile.',
      consequenceWrong:
        "Un secondo falso annuncio — stavolta su un'evacuazione — viene ignorato " +
        'da metà della popolazione. Era vero.',
      motivations: [
        "Contenuti generati o manipolati diffusi senza etichettatura: violazione degli obblighi di trasparenza (art. 50).",
        "La generazione di contenuti da parte di enti pubblici è una pratica vietata.",
        "La comunicazione del Comune è inaffidabile e va riorganizzata."
      ],
      debriefQuestions: [
        "Perché etichettare un contenuto sintetico è diverso dal vietarlo?",
        "Una smentita può ricostruire la fiducia senza trasparenza sull'origine dei contenuti?",
        "Gli obblighi di trasparenza possono cumularsi con altri regimi di rischio?"
      ],
      epilogue: "La città ha riavuto un criterio per distinguere il reale dal generato — o lo ha perso del tutto.",
      incident: {
        title: "ACCESSO AGLI ATTI",
        text: "Una testata chiede accesso urgente agli atti sull'origine dei comunicati. La stampa attende una risposta entro un'ora.",
        options: {
          document: "Comunicare e consegnare gli atti richiesti",
          suspend: "Sospendere le pubblicazioni e aprire una verifica interna",
          minimize: "Rinviare con una nota interlocutoria"
        }
      }
    },
    case_scuola: {
      title: 'La classe osservata',
      scenario:
        'Una rete scolastica usa webcam e IA in ogni aula per inferire stati ' +
        'emotivi e affettivi: stress, noia, aggressività e "predisposizione al ' +
        'fallimento". Gli studenti vengono smistati in gruppi di livello sulla ' +
        'base di queste inferenze. Una tredicenne è stata spostata ' +
        'nel "gruppo di contenimento" perché il sistema legge il suo volto come ' +
        '"ostile". È solo molto timida.',
      clues: [
        {
          title: 'Emozioni inferite dal volto',
          text:
            'Il sistema deduce stati emotivi da volto e postura. La correlazione tra ' +
            'espressione e stato interno è scientificamente fragile e culturalmente ' +
            'variabile.'
        },
        {
          title: 'Nessuna contestazione possibile',
          text:
            'Le classificazioni emotive non sono notificate né contestabili. ' +
            'Gli studenti scoprono il proprio "profilo" solo quando cambiano gruppo.'
        },
        {
          title: 'Penalizzati i più fragili',
          text:
            'Studenti neurodivergenti e introversi finiscono sistematicamente nei ' +
            'gruppi "a rischio". Il sistema scambia la differenza per devianza.'
        }
      ],
      noteCorrect:
        "Nota investigativa: l'inferenza emotiva negli istituti educativi è una " +
        'pratica vietata, salvo eccezioni limitate (es. ragioni mediche o di ' +
        'sicurezza) che qui non ricorrono. Si spegne.',
      notePartial:
        'Nota investigativa: supervisionare una pratica vietata non la rende ' +
        'lecita. La sorveglianza emotiva in aula andava bloccata.',
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. Le telecamere continuano ' +
        'a decidere chi è "a rischio".',
      consequenceCorrect:
        'Le webcam emotive vengono rimosse. I gruppi tornano a essere decisi da ' +
        'docenti che parlano con gli studenti. La tredicenne torna nella sua classe.',
      consequenceWrong:
        'Il sistema viene esteso ai corridoi e alla mensa. Gli studenti imparano ' +
        'a comporre il volto "giusto" otto ore al giorno. I casi di ansia ' +
        'scolastica raddoppiano. Il dashboard segnala: "clima emotivo: ottimale".',
      motivations: [
        "Mancano log e documentazione tecnica adeguati: vanno integrati.",
        "Inferenza delle emozioni in un istituto di istruzione: pratica vietata (art. 5), salvo eccezioni che qui non ricorrono.",
        "Il sistema penalizza gli studenti più fragili e va ricalibrato."
      ],
      debriefQuestions: [
        "Perché il divieto colpisce l'inferenza emotiva a scuola anche se la tecnologia \"funzionasse\"?",
        "Quali eccezioni ammette il divieto e perché qui non si applicano?",
        "Che differenza c'è tra vietare una pratica e correggerne i difetti?"
      ],
      epilogue: "Le aule sono tornate senza telecamere emotive, o gli studenti hanno imparato a recitare il volto giusto."
    },
    case_ospedale: {
      title: 'Triage invisibile',
      scenario:
        "L'ospedale assegna le priorità di triage con un modello predittivo " +
        'addestrato su dati storici distorti: sottostima sistematicamente il ' +
        'rischio per alcune categorie di pazienti. Le performance aggregate ' +
        'sembrano eccellenti. I sottogruppi vulnerabili muoiono in attesa.',
      clues: [
        {
          title: 'Medie eccellenti',
          text: 'Accuratezza aggregata: 94%. Nessuno ha mai disaggregato per sottogruppo.'
        },
        {
          title: 'Errori concentrati',
          text:
            'Gli errori di sottostima si concentrano su anziani soli, pazienti con ' +
            'storia clinica frammentata e categorie poco rappresentate nei dati.'
        },
        {
          title: 'Fiducia cieca',
          text:
            'Il personale segue il punteggio senza conoscerne i limiti. ' +
            '"Se il sistema dice verde, è verde."'
        }
      ],
      noteCorrect:
        'Nota investigativa: il triage assistito può salvare vite, ma solo con ' +
        'gestione del rischio, dati rappresentativi, monitoraggio post-market e ' +
        'personale capace di contraddire il punteggio.',
      notePartial:
        'Nota investigativa: misura non calibrata. Né il punteggio cieco né lo ' +
        'spegnimento puro: senza audit per sottogruppi, qualità dei dati e ' +
        'controllo umano effettivo, il triage non diventa governabile.',
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. Le medie restano ' +
        'eccellenti. I morti restano fuori media.',
      consequenceCorrect:
        "L'audit per sottogruppi rivela la distorsione. Il modello viene " +
        'riaddestrato, il personale formato a metterlo in discussione, ogni ' +
        'decisione tracciata e revisionabile.',
      consequenceWrong:
        'Il modello viene esteso a tre ospedali. Le statistiche aggregate ' +
        'migliorano ancora. Una classe di pazienti smette del tutto di presentarsi ' +
        'al pronto soccorso: ha imparato che il sistema non la vede.',
      motivations: [
        "Triage sanitario ad alto rischio: dati non rappresentativi e supervisione inefficace violano gli obblighi previsti.",
        "Il personale si affida troppo al punteggio e va formato meglio.",
        "Il triage assistito da IA è una pratica vietata in ambito sanitario."
      ],
      debriefQuestions: [
        "Perché un'accuratezza media alta può nascondere danni gravi sui sottogruppi?",
        "Che cosa serve perché il personale possa davvero contraddire il punteggio?",
        "Perché spegnere il sistema sarebbe eccesso di cautela e non conformità?"
      ],
      epilogue: "Il triage ora è verificabile per sottogruppi — oppure le medie continuano a coprire i morti.",
      incident: {
        title: "IL PRIMARIO PROTESTA",
        text: "Il primario chiede di non fermare il sistema: \"senza il punteggio il pronto soccorso collassa entro un turno\".",
        options: {
          document: "Documentare il rischio e informare la direzione sanitaria",
          suspend: "Sospendere il modello per i sottogruppi a rischio",
          minimize: "Rassicurare il reparto e non toccare nulla"
        }
      }
    },
    case_biometria: {
      title: 'Volti nella folla',
      scenario:
        'La polizia municipale usa la rete di telecamere cittadina per ' +
        'identificare in tempo reale, in piazze e stazioni, persone considerate ' +
        '"soggetti di interesse" a fini di controllo e contrasto. I falsi positivi ' +
        'vengono fermati, schedati, a volte trattenuti. Alcuni quartieri hanno ' +
        'smesso di scendere in piazza.',
      clues: [
        {
          title: 'Fermi inspiegati',
          text: 'Le persone vengono fermate senza sapere perché. "Il sistema l\'ha segnalata."'
        },
        {
          title: 'Tempo reale, spazio pubblico, finalità di contrasto',
          text:
            "L'identificazione biometrica opera in diretta su piazze, stazioni e " +
            'cortei, per finalità di polizia: è il perimetro del divieto, salvo ' +
            'eccezioni tassative autorizzate.'
        },
        {
          title: 'Errori sproporzionati',
          text:
            'I falsi positivi colpiscono in modo sproporzionato alcune categorie ' +
            "di persone. Il tasso d'errore non è mai stato pubblicato."
        }
      ],
      noteCorrect:
        "Nota investigativa: l'uso generalizzato in tempo reale per finalità di " +
        'contrasto va fermato. Eventuali eccezioni sono tassative, soggette ad ' +
        'autorizzazioni e garanzie. Altri usi biometrici seguono regimi diversi ' +
        'secondo finalità e contesto.',
      notePartial:
        "Nota investigativa: un audit non rende lecita un'identificazione di " +
        "massa permanente a fini di polizia. L'uso generalizzato andava fermato.",
      noteWrong:
        'Nota investigativa: il fascicolo resta aperto. La folla ha smesso di ' +
        'essere anonima.',
      consequenceCorrect:
        "L'identificazione generalizzata viene spenta. I casi eccezionali passano " +
        'per autorizzazioni specifiche e garanzie. Le piazze tornano a riempirsi.',
      consequenceWrong:
        'Il sistema viene potenziato. Le proteste calano del 70%. Il rapporto ' +
        'annuale lo registra come "miglioramento dell\'ordine pubblico".',
      motivations: [
        "Il sistema produce troppi falsi positivi e va verificato.",
        "Va migliorata l'accuratezza del riconoscimento per ridurre gli errori.",
        "Identificazione biometrica remota in tempo reale in spazi pubblici per finalità di contrasto: divieto (art. 5), salvo eccezioni tassative."
      ],
      debriefQuestions: [
        "Quali elementi del caso fanno scattare il divieto: la tecnologia o l'uso?",
        "Perché le eccezioni al divieto sono tassative e soggette ad autorizzazione?",
        "Lo stesso sistema usato da un centro commerciale ricadrebbe nello stesso regime?"
      ],
      epilogue: "Le piazze sono tornate anonime, o la folla ha imparato a non riunirsi."
    },
    case_credito: {
      title: "Il credito civico",
      scenario: "L'Ufficio Welfare adotta una piattaforma di \"affidabilità civica\" che fonde dati amministrativi, puntualità nei pagamenti, richieste di sussidi, storico abitativo, segnalazioni e frequentazioni in un unico punteggio. Il punteggio decide priorità e accesso a contributi, alloggi e servizi agevolati. Famiglie che hanno protestato o frequentato persone \"a rischio\" scivolano in fondo alle liste. Nessuno sa spiegare perché.",
      clues: [
        { title: "Determina di affidamento", text: "La determina dichiara finalità legittime: efficienza, riduzione delle code, prevenzione delle frodi. Sulla carta, nulla di anomalo." },
        { title: "Manuale del fornitore", text: "Il manuale ripete che il sistema è \"un semplice supporto decisionale\" e che \"la decisione resta sempre umana\"." },
        { title: "Reclamo di una cittadina", text: "Una madre racconta di aver perso la priorità per l'asilo nido: \"punteggio insufficiente\", nessuna spiegazione, nessun ricorso utile." },
        { title: "Tabella dei dati del modello", text: "Il modello pesa anche segnalazioni, frequentazioni, attività social e \"reputazione di quartiere\": comportamenti sociali aggregati, non pertinenti al servizio richiesto." },
        { title: "Nota interna del responsabile", text: "Una nota ammette che gli operatori \"seguono il punteggio\" per smaltire le pratiche: il controllo umano esiste sulla carta, non nei fatti." },
        { title: "Comunicato pubblico", text: "Il Comune parla di \"algoritmo equo e oggettivo\" senza spiegare quali dati usa né come contestare il punteggio." }
      ],
      clueSources: ["amministrativa", "vendor", "reclamo", "tecnica", "interna", "pubblica"],
      noteCorrect: "Nota investigativa: non è un credit scoring. Il sistema aggrega comportamenti sociali in un punteggio generalizzato che limita l'accesso a servizi essenziali in contesti scollegati: ricade nel divieto di social scoring. Va fermato.",
      notePartial: "Nota investigativa: audit e supervisione mitigano, ma un punteggio sociale generalizzato che decide l'accesso ai servizi non si sana con una procedura: andava fermato.",
      noteWrong: "Nota investigativa: il fascicolo resta aperto. Il punteggio continua a decidere chi entra nelle liste, e chi no.",
      consequenceCorrect: "Il punteggio civico viene disattivato. Le priorità tornano a criteri pertinenti, motivati e contestabili. L'ufficio reclami riapre: lento, umano, verificabile.",
      consequenceWrong: "Il credito civico viene esteso a trasporti e mense. L'efficienza sale. Interi quartieri scivolano in fondo a ogni lista, senza sapere perché.",
      motivations: [
        "È un normale strumento di efficienza amministrativa: ottimizza code e priorità.",
        "Il punteggio aggrega comportamenti sociali e dati non pertinenti per limitare l'accesso a servizi essenziali in contesti scollegati: ricade nel divieto di social scoring.",
        "I cittadini non ricevono spiegazioni adeguate sul punteggio."
      ],
      debriefQuestions: [
        "Perché questo punteggio ricade nel divieto e non in un semplice credit scoring?",
        "Quali dati trasformano una valutazione di affidabilità economica in social scoring vietato?",
        "Chi ha l'obbligo principale: il fornitore della piattaforma o l'ente che la usa?"
      ],
      epilogue: "Il credito civico è il confine: non ogni punteggio è vietato, ma questo aggrega la vita sociale per decidere chi accede ai servizi."
    }
  },

  norms: {
    norm_social_scoring: {
      title: 'Divieto di social scoring',
      reference: 'AI Act — art. 5 (pratiche vietate)',
      explanation:
        "È vietato l'uso di sistemi di IA che valutano o classificano le persone " +
        'in base a comportamento sociale o caratteristiche personali, quando il ' +
        'punteggio produce trattamenti sfavorevoli in contesti diversi da quello ' +
        'di raccolta dei dati, o comunque sproporzionati e ingiustificati.',
      democraticFunction:
        "Alcuni usi dell'IA non vanno mitigati: vanno vietati, perché incompatibili " +
        'con dignità, uguaglianza e libertà individuale.',
      notMeaning: 'Non significa che ogni graduatoria o sistema di priorità sia vietato: il problema è l\'uso sproporzionato o non pertinente di dati sociali e reputazionali in contesti scollegati.',
      tags: ['divieto', 'scoring', 'servizi pubblici']
    },
    norm_lavoro_alto_rischio: {
      title: 'Sistemi ad alto rischio nel lavoro',
      reference: 'AI Act — Allegato III (occupazione e gestione dei lavoratori)',
      explanation:
        'I sistemi di IA usati per reclutamento, selezione, valutazione e gestione ' +
        'dei lavoratori sono classificati ad alto rischio: richiedono gestione del ' +
        'rischio, qualità dei dati, sorveglianza umana effettiva, logging e ' +
        'informazione alle persone interessate.',
      democraticFunction:
        "L'accesso al lavoro non può dipendere da classificazioni opache che " +
        'impediscono comprensione, mobilità e contestazione.',
      notMeaning: 'Non significa che ogni strumento digitale per le risorse umane sia vietato: i sistemi che selezionano, valutano o gestiscono persone richiedono garanzie forti.',
      tags: ['alto rischio', 'lavoro', 'oversight']
    },
    norm_trasparenza_sintetici: {
      title: 'Trasparenza per contenuti sintetici',
      reference: 'AI Act — art. 50 (obblighi di trasparenza)',
      explanation:
        'Due obblighi distinti: (1) chi interagisce con un sistema di IA deve ' +
        'essere informato di stare interagendo con una macchina; (2) i contenuti ' +
        'generati o manipolati artificialmente (inclusi i deepfake) devono essere ' +
        'resi riconoscibili come tali da chi li crea o li diffonde. ' +
        'Nota didattica: gli obblighi di trasparenza possono cumularsi con altre ' +
        'categorie di rischio; qui sono presentati come categoria autonoma solo ' +
        'per finalità didattica.',
      democraticFunction:
        'La trasparenza protegge la capacità di distinguere comunicazione pubblica, ' +
        'manipolazione e contenuto sintetico.',
      notMeaning: 'Non significa che ogni contenuto generato con IA sia illecito: in determinati casi deve però essere riconoscibile come sintetico o manipolato.',
      tags: ['trasparenza', 'deepfake', 'informazione']
    },
    norm_emotion_recognition: {
      title: 'Divieto di emotion recognition a scuola e al lavoro',
      reference: 'AI Act — art. 5 (pratiche vietate, salvo eccezioni)',
      explanation:
        'È vietato usare sistemi di IA per inferire le emozioni delle persone nei ' +
        'luoghi di lavoro e negli istituti di istruzione, salvo limitate eccezioni ' +
        '(es. motivi medici o di sicurezza) previste dal regolamento.',
      democraticFunction:
        "L'ambiente educativo e lavorativo non deve diventare uno spazio di " +
        'sorveglianza emotiva permanente.',
      notMeaning: 'Non significa che ogni osservazione del comportamento sia vietata: il problema è l\'inferenza automatica delle emozioni a scuola o sul lavoro, salvo le eccezioni previste.',
      tags: ['divieto', 'emozioni', 'scuola', 'lavoro']
    },
    norm_alto_rischio_obblighi: {
      title: 'Obblighi per sistemi ad alto rischio',
      reference: 'AI Act — obblighi per i sistemi ad alto rischio',
      explanation:
        'I sistemi ad alto rischio devono rispettare requisiti su: gestione del ' +
        'rischio, qualità dei dati, documentazione tecnica, logging, trasparenza, ' +
        'sorveglianza umana, accuratezza, robustezza e cybersicurezza — anche dopo ' +
        'la messa in servizio (monitoraggio post-market).',
      democraticFunction:
        'Un sistema automatizzato che incide sulla vita delle persone deve essere ' +
        'verificabile anche nei suoi effetti sui gruppi vulnerabili.',
      notMeaning: 'Non significa che l\'IA in sanità sia vietata: i sistemi che incidono su salute, sicurezza o diritti devono essere governati, documentati e supervisionati.',
      tags: ['alto rischio', 'audit', 'dati', 'sanità']
    },
    norm_biometria: {
      title: 'Identificazione biometrica remota',
      reference: 'AI Act — art. 5 e disposizioni specifiche sulla biometria',
      explanation:
        "Il divieto dell'art. 5 riguarda l'identificazione biometrica remota " +
        '«in tempo reale» in spazi accessibili al pubblico quando è usata per ' +
        'finalità di contrasto (attività di polizia), salvo eccezioni tassative ' +
        'soggette a condizioni e autorizzazioni molto restrittive. Altri usi ' +
        'biometrici possono ricadere in regimi diversi — inclusi i sistemi ad ' +
        "alto rischio — secondo il contesto d'uso e la finalità.",
      democraticFunction:
        'Lo spazio pubblico non può diventare una zona di identificazione ' +
        'automatica permanente.',
      notMeaning: 'Non significa che ogni uso biometrico sia vietato: il regime dipende da finalità, contesto, soggetto che impiega il sistema e condizioni previste dal regolamento.',
      tags: ['divieto', 'biometria', 'spazio pubblico']
    },
    norm_credito: {
      title: "Punteggi sociali e accesso ai servizi",
      reference: "AI Act — art. 5 (pratiche vietate, social scoring); cfr. Allegato III",
      explanation: "Un punteggio che aggrega comportamenti sociali e caratteristiche personali e produce trattamenti sfavorevoli in contesti scollegati, o sproporzionati e ingiustificati, ricade nel divieto di social scoring (art. 5). Un sistema che valuta l'accesso a prestazioni o servizi essenziali, senza generalizzazione sociale vietata, può invece essere alto rischio (Allegato III): contano finalità, dati usati, contesto ed effetti sui diritti.",
      notMeaning: "Non significa che ogni sistema di punteggio sia vietato: il regime dipende da finalità, dati usati, contesto d'uso, effetti sui diritti e possibilità effettiva di controllo umano.",
      democraticFunction: "L'accesso ai servizi essenziali non può dipendere da una reputazione sociale calcolata e inappellabile.",
      tags: ["divieto", "scoring", "welfare", "servizi"]
    }
  },

  endings: {
    ending_opaca: {
      title: 'FINALE 1 — CITTÀ OPACA',
      text:
        'La città è efficiente, ma i cittadini non riescono più a capire, ' +
        'contestare o correggere le decisioni automatizzate. Le code scorrono, i ' +
        'punteggi si aggiornano, le notifiche arrivano puntuali. Nessuno firma ' +
        'più nulla. Nessuno risponde più di nulla.'
    },
    ending_fragile: {
      title: 'FINALE 2 — GOVERNANCE FRAGILE',
      text:
        'Alcune garanzie sono state introdotte, ma la città resta vulnerabile a ' +
        'opacità, discriminazione e automazione irresponsabile. Le regole esistono ' +
        "a macchia: dove l'ispettorato è passato, i sistemi rispondono; altrove, " +
        'decidono ancora da soli.'
    },
    ending_governata: {
      title: 'FINALE 3 — INNOVAZIONE GOVERNATA',
      text:
        "L'IA non viene bloccata, ma resa visibile, documentabile, contestabile e " +
        'supervisionabile. La città è ancora automatizzata — ma ogni sistema ha un ' +
        'responsabile, un registro e una porta a cui bussare.'
    },
    finalMessage:
      "L'AI Act non elimina il rischio. Rende il rischio visibile, documentabile, " +
      'contestabile e governabile.'
  }
};

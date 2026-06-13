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
      backToEvidence: '◂ REPERTI'
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
      noEvidence: 'nessuna prova citata'
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
      subtitle: 'Nessun dato personale: solo decisioni di gioco. Il report resta su questo dispositivo.',
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
      notCompleted: 'caso non completato'
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
    sorveglianza: 'Centro di Sorveglianza Urbana'
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
      tags: ['divieto', 'biometria', 'spazio pubblico']
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

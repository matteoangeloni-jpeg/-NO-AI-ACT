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
    titleTagline: "Valuta casi d'uso dell'IA. Ogni scelta incide su fiducia pubblica, innovazione e diritti. Obiettivo: trovare un equilibrio sostenibile.",
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
      resetDone: 'Salvataggio azzerato.',
      teachers: 'DOCENTI E CLASSE',
      resources: 'RISORSE',
      settings: 'IMPOSTAZIONI',
      resetConfirm: 'CONFERMA RESET?'
    },
    titleGroups: {
      settingsTitle: 'Impostazioni',
      settingsPrivacy: 'Salvataggio e preferenze restano solo nel tuo browser: nessun account, nessun dato inviato.',
      teachersTitle: 'Docenti e classe',
      teachersNote: 'Modalità docente: pause di discussione dopo ogni caso e debrief locale a fine partita. Uso in classe: 20–40 minuti, nessun account, nessun dato raccolto.',
      resourcesTitle: 'Risorse',
      resourcesNote: 'Archivio e glossario del gioco, più le guide del sito (nuova scheda).',
      close: 'CHIUDI'
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
    context: {
      button: 'Rivedi contesto',
      title: 'Contesto del caso',
      scenarioLabel: 'Sintesi del caso',
      objectiveLabel: 'Obiettivo',
      objective: "Classificare il rischio del sistema secondo l'AI Act e disporre la misura adeguata.",
      note: 'Questa scheda serve solo a rivedere il caso. Non modifica il rapporto né la classificazione.',
      closeToDecision: 'Torna alla decisione',
      closeToEvidence: 'Torna ai reperti'
    },
    caseNorm: {
      button: 'Norma del caso',
      supportNote: 'Norma utile per orientarti nel caso. Consultarla non modifica il rapporto né la decisione.',
      relevantLabel: 'Norma rilevante',
      referenceLabel: 'Riferimento',
      inShortLabel: 'In breve',
      whyLabel: 'Perché conta in questo caso',
      whyFallback: 'Questa norma aiuta a valutare il caso, ma la decisione finale dipende dagli elementi osservati nel fascicolo.',
      continuityNote: 'Usa la norma per orientare il ragionamento, poi torna alla decisione e valuta gli elementi del fascicolo.',
      close: 'Torna alla decisione'
    },
    // Etichette dei concetti AI Act (tassonomia strutturale in data/concepts.ts)
    concepts: {
      risk_based_approach: 'approccio basato sul rischio',
      prohibited_practices: 'pratiche vietate',
      high_risk: 'sistemi ad alto rischio',
      transparency: 'trasparenza',
      gpai: 'IA per finalità generali (GPAI)',
      human_oversight: 'sorveglianza umana',
      data_governance: 'governo dei dati',
      privacy_by_design: 'privacy by design',
      ai_literacy: "alfabetizzazione all'IA"
    },
    // Rapporto di apprendimento finale (v1.1): locale, mai inviato altrove.
    learningReport: {
      header: 'COSA TI PORTI VIA DA QUESTA INDAGINE',
      title: 'Rapporto di apprendimento',
      intro: 'Un riepilogo didattico delle tue decisioni, per capire dove sei solido e cosa rileggere. Resta sul tuo dispositivo: non viene inviato da nessuna parte.',
      scoreLabel: 'Esiti dei casi',
      scoreLine: '{correct} corretti · {partial} parziali · {wrong} da rivedere — {completed} casi completati su {total}',
      conceptsLabel: 'Concetti AI Act incontrati',
      strongestLabel: 'Area più solida',
      reviewLabel: 'Area da ripassare',
      allSolid: 'Nessuna in particolare: le decisioni reggono. Puoi alzare la difficoltà o cambiare percorso.',
      noneYet: 'Nessun caso completato in questa partita.',
      recommendedLabel: 'Tre letture consigliate dal sito (gratuite, in una nuova scheda)',
      linkFor: 'Approfondisci: {concept} ▸',
      // etichette parallele a FALLBACK_LINKS della lingua (stesso ordine)
      generalLinkLabels: ['Risorse educative ▸', "Guida all'AI Act ▸", 'Glossario ▸'],
      performance: { strong: 'solido', mixed: 'da consolidare', weak: 'da rivedere' },
      disclaimer: 'NO AI ACT è una simulazione didattica e semplifica il Regolamento (UE) 2024/1689: questo rapporto descrive il tuo percorso nel gioco, non una competenza certificata né una consulenza legale.',
      back: 'TORNA AL RAPPORTO FINALE'
    },
    // Guida docente in gioco (v1.1): struttura prima/durante/dopo + risorse.
    teacherGuide: {
      button: 'GUIDA DOCENTE ▸',
      title: 'Usare NO AI ACT in aula',
      intro: 'Struttura consigliata in tre tempi. Nessun account, nessun dato degli studenti: tutto resta locale.',
      beforeTitle: 'Prima della lezione',
      beforeText: "Prova un caso da solo, scegli il percorso (demo, laboratorio o completo) e fissa 2–3 obiettivi. Le attività pronte e la lezione introduttiva qui sotto danno la cornice sull'AI Act prima di giocare.",
      duringTitle: 'Durante',
      duringText: 'Proietta il gioco o fai giocare a coppie. Con la modalità docente attiva, dopo ogni caso compare una pausa di discussione con le domande per la classe: confrontate le decisioni prima di proseguire.',
      afterTitle: 'Dopo',
      afterText: 'Apri il debrief docente dal rapporto finale: riepilogo delle decisioni, concetti emersi e domande. Esportalo in testo o JSON e usalo per la riflessione scritta o la valutazione formativa.',
      resourcesLabel: 'Risorse collegate (si aprono in una nuova scheda)',
      links: {
        activities_it: 'Attività didattiche (IT)',
        lesson_it: 'Lezione introduttiva (IT)',
        activities_en: 'Classroom activities (EN)',
        lesson_en: 'Lesson plan (EN)'
      },
      close: 'Chiudi'
    },
    // Collegamenti gioco→sito (v1.2): pagine interne, il gioco resta aperto.
    siteLinks: {
      button: 'SITO E RISORSE ▸',
      title: 'Sito e risorse educative',
      intro: 'Le sezioni del sito, per intento. Si aprono in una nuova scheda: il gioco resta aperto e nulla viene registrato. Sei sempre libero di uscire dal gioco.',
      play: 'Come funziona il gioco',
      hub: 'Risorse educative',
      teacher: 'Risorse per docenti',
      guide: 'Guida AI Act',
      glossary: 'Glossario',
      privacy: 'Privacy',
      backToSite: 'Torna al sito',
      close: 'Chiudi'
    },
    // Pausa di discussione dopo ogni caso (solo modalità docente, v1.1).
    discussionPause: {
      button: 'PAUSA DISCUSSIONE ▸',
      title: 'Pausa di discussione',
      intro: 'Domande per la classe su questo caso. Niente viene registrato: sono spunti per parlarne prima del prossimo fascicolo.',
      close: 'Riprendi'
    },
    decisionDebrief: {
      button: 'Debrief della decisione',
      title: 'Debrief della decisione',
      intro: 'Questa scheda ti aiuta a capire il ragionamento, senza modificare il punteggio o il rapporto.',
      yourChoiceLabel: 'La tua scelta',
      whyLabel: 'Perché non è pienamente corretta',
      observeLabel: 'Elemento da osservare',
      normLabel: 'Norma collegata',
      howToLabel: 'Come ragionare nel prossimo caso',
      correctTitle: 'Decisione coerente',
      keyElementLabel: 'Elemento chiave osservato',
      whyCorrect: 'La decisione è coerente con gli elementi del fascicolo e con la norma collegata.',
      whyPartialWrong: 'La decisione non è pienamente coerente con gli elementi del fascicolo. Rivedi la prova chiave, la norma collegata e il passaggio logico richiesto.',
      observeFallback: 'Rileggi le prove rilevanti del fascicolo: la decisione dipende dagli indizi osservati, non solo dalla categoria astratta.',
      howToFallback: "Parti dal sistema AI concreto, individua chi subisce l'impatto, collega le prove alla norma e solo dopo scegli classificazione, misura, soggetto e motivazione.",
      conceptLabel: 'Concetto AI Act del caso',
      takeawayLabel: 'Da portare a casa',
      learnMore: 'Approfondisci sul sito ▸',
      close: 'Chiudi'
    },
    evidence: {
      header: 'FASCICOLO {code} — REPERTI',
      instruction: 'Esaminare tutti i reperti, poi citare quelli che fondano la classificazione (almeno 2).',
      citeNote: 'Citare un reperto lo aggiunge al rapporto, ma non determina ancora la classificazione finale del rischio.',
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
      },
      stances: {
        supports_risk: 'mostra il rischio',
        minimizes_risk: 'minimizza',
        ambiguous: 'ambiguo',
        contextual: 'contesto',
        concrete_effect: 'effetto concreto',
        decisive: 'prova decisiva'
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
      processNote: 'Decisione finale: classifica il rischio, poi scegli misura, soggetto responsabile e motivazione.',
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
      },
      analysisLabel: 'ANALISI DELLA DECISIONE',
      analysis: {
        conforme: 'La decisione regge: classificazione, misura, soggetto e motivazione sono coerenti con le prove decisive.',
        parziale: 'La decisione coglie il nucleo del problema, ma resta incompleta —',
        contestabile: 'La decisione è contestabile —',
        non_conforme: 'La decisione non regge —'
      },
      issues: {
        wrong_classification: "la classificazione non coglie il contesto d'uso del sistema.",
        insufficient_measure: 'la misura proposta riduce il rischio, ma non lo governa.',
        excessive_measure: 'la classificazione è corretta, ma la misura eccede ciò che serve.',
        wrong_responsible_subject: 'la responsabilità è attribuita al soggetto sbagliato.',
        weak_motivation: 'la motivazione non è sostenuta dalle prove citate.',
        weak_evidence: 'le prove citate non bastano a reggere la classificazione.',
        formal_human_oversight: 'il controllo umano resta formale, non effettivo.',
        missing_transparency: 'manca la trasparenza che renderebbe il sistema riconoscibile.',
        context_misread: "il contesto d'uso del sistema è stato letto male.",
        proportionality_problem: 'la misura non è proporzionata al rischio effettivo.'
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
    cityDossier: {
      title: 'FASCICOLO CITTÀ',
      subtitle: 'Effetti sistemici delle decisioni. Non un punteggio: tendenze.',
      updatedLabel: 'Fascicolo città aggiornato',
      emptyHint: 'Nessun caso ancora chiuso: il fascicolo resta stabile.',
      openButton: 'FASCICOLO CITTÀ ▸',
      indicators: {
        publicTrust: 'Fiducia pubblica',
        fundamentalRights: 'Diritti fondamentali',
        administrativeOpacity: 'Opacità amministrativa',
        litigationRisk: 'Rischio contenzioso',
        serviceEfficiency: 'Efficienza dei servizi'
      },
      trends: {
        improving: 'migliora',
        worsening: 'peggiora',
        stable: 'stabile',
        watch: 'sotto osservazione'
      }
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
      debrief: 'DEBRIEF DOCENTE ▸',
      learningReport: 'RAPPORTO DI APPRENDIMENTO ▸',
      privacyNote: {
        title: 'Privacy: tutto resta nel tuo browser',
        text: 'Questa versione non incorpora moduli esterni e non raccoglie feedback o dati: risposte, rapporti e progressi non lasciano mai il tuo dispositivo.'
      }
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
      conceptsLabel: 'CONCETTI AI ACT EMERSI',
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
        advanced: { name: 'Percorso avanzato', duration: '60–75 min', goal: 'Casi ambigui e confini normativi (include il credito civico).' },
        pack: { name: 'Casi avanzati', duration: '75–90 min', goal: 'Casi più ambigui: chatbot pubblico, procurement, EdTech e GPAI.' }
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
    how: 'Come si gioca: apri i reperti, cita le prove, classifica il rischio e deposita il rapporto. Dopo ogni decisione un debrief spiega il ragionamento. Niente lascia il tuo browser: è una simulazione didattica, non consulenza legale.',
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
    welfare: "Ufficio Welfare e Servizi",
    sportello: "Sportello Civico",
    appalti: "Ufficio Appalti",
    campus: "Campus Adattivo",
    modelli: "Centro Modelli"
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
    },

    case_chatbot: {
      title: "Lo sportello che risponde sempre",
      scenario: "Il Comune apre uno sportello digitale: un assistente automatico risponde su bonus, scadenze, requisiti e documenti. È comodo, veloce, sempre disponibile. Ma alcune risposte sono errate, nessuno avvisa che a rispondere è una macchina e non c'è un modo semplice per parlare con una persona. Alcuni cittadini perdono opportunità per un'informazione sbagliata.",
      clues: [
        { title: "Comunicato pubblico", text: "Il Comune annuncia \"risposte immediate e sempre aggiornate\". Nessun cenno ai limiti del sistema." },
        { title: "Log delle conversazioni", text: "Il registro mostra risposte errate su requisiti e scadenze di un bonus: indicazioni sbagliate ripetute a più cittadini." },
        { title: "Nota del fornitore", text: "Il manuale ripete che \"il sistema è solo informativo\" e non sostituisce gli uffici. Sulla carta, una cautela." },
        { title: "Reclamo di un cittadino", text: "Una persona ha perso la finestra per la domanda: \"Lo sportello mi aveva detto che c'era tempo\". Nessun canale per correggere in tempo." },
        { title: "Procedura interna", text: "La procedura non prevede alcun passaggio a un operatore umano: nessuna escalation, nessuna revisione delle risposte critiche." },
        { title: "Determina di adozione", text: "La determina inquadra lo sportello come servizio di efficienza. Finalità legittima, nulla di anomalo in sé." }
      ],
      clueSources: ["pubblica", "log", "vendor", "reclamo", "interna", "amministrativa"],
      noteCorrect: "Nota investigativa: lo sportello non va vietato, va reso trasparente e governato. Il cittadino deve sapere che parla con una macchina, ricevere informazioni corrette e poter raggiungere una persona. Servono avviso chiaro, canale umano, audit delle risposte e logging privacy-safe.",
      notePartial: "Nota investigativa: la direzione è giusta, ma a metà. Senza trasparenza verso il cittadino e senza un canale umano effettivo, l'assistente resta una fonte di affidamento fragile.",
      noteWrong: "Nota investigativa: il fascicolo resta aperto. Lo sportello continua a rispondere, a volte male, e nessuno se ne assume la responsabilità.",
      consequenceCorrect: "Lo sportello dichiara di essere automatico, segnala i limiti e offre un contatto umano. Le risposte critiche vengono riviste e tracciate. L'efficienza resta, ma diventa affidabile.",
      consequenceWrong: "Lo sportello viene esteso ad altri servizi. Le risposte arrivano sempre più veloci. E sempre più persone agiscono su informazioni che nessuno ha verificato.",
      motivations: [
        "È un semplice servizio informativo: se sbaglia, la responsabilità è del cittadino che si fida.",
        "L'assistente automatico crea affidamento: serve trasparenza sul fatto che è una macchina, informazione corretta, un canale umano e tracciabilità. La responsabilità d'uso resta dell'ente.",
        "Il problema è solo tecnico: basta che il fornitore aggiorni il modello."
      ],
      debriefQuestions: [
        "Quando un assistente automatico diventa una fonte affidabile per il cittadino?",
        "Perché la trasparenza qui non basta da sola, e serve anche un canale umano?",
        "Chi risponde se il chatbot pubblico dà un'informazione sbagliata: il fornitore o l'ente?"
      ],
      epilogue: "Lo sportello automatico non è il problema: lo è quando nasconde di esserlo, sbaglia e non lascia una porta umana a cui bussare."
    },

    case_procurement: {
      title: "La gara opaca",
      scenario: "Un ente pubblico acquista un sistema di IA per istruire pratiche e priorità. La gara è chiusa in fretta: capitolato generico, nessuna documentazione tecnica, criteri poco trasparenti. Quando l'ufficio chiede accesso al funzionamento del sistema, il fornitore nega. \"È certificato\", dicono. Ma nessuno, dentro l'ente, può spiegarne né controllarne le decisioni.",
      clues: [
        { title: "Capitolato di gara", text: "Il capitolato descrive il servizio in termini generali: nessun requisito di documentazione, audit o sorveglianza umana sul sistema di IA." },
        { title: "Offerta del fornitore", text: "L'offerta è piena di claim: \"soluzione certificata, conforme, sicura\". Nessuna prova tecnica allegata." },
        { title: "Verbale interno", text: "Un verbale dell'ufficio tecnico ammette: \"non disponiamo della documentazione tecnica né di criteri di verifica del sistema\"." },
        { title: "Clausola contrattuale", text: "Una clausola limita responsabilità e accessi, con formule ambigue su proprietà e know-how. Difficile dire chi può controllare cosa." },
        { title: "Accesso negato", text: "La richiesta di accesso al funzionamento e ai log del sistema viene respinta dal fornitore come \"informazione riservata\"." },
        { title: "Nota del RUP", text: "Il responsabile del procedimento segnala il rischio: \"se il sistema sbaglia, non sapremmo dimostrare perché, né correggerlo\"." }
      ],
      clueSources: ["amministrativa", "vendor", "interna", "amministrativa", "tecnica", "amministrativa"],
      noteCorrect: "Nota investigativa: non basta \"il fornitore è certificato\". Un sistema che istruisce decisioni pubbliche è ad alto rischio: servono documentazione tecnica, governance, criteri di verifica ex ante, diritti di accesso e audit, responsabilità contrattuali chiare. La PA non può acquistare un sistema che non può spiegare né controllare.",
      notePartial: "Nota investigativa: il problema è colto solo a metà. Senza documentazione e diritti di accesso/audit, la governance resta sulla carta e l'ente non controlla davvero il sistema.",
      noteWrong: "Nota investigativa: il fascicolo resta aperto. Il sistema decide, l'ente non sa come, e il fornitore tiene la chiave.",
      consequenceCorrect: "La fornitura viene rinegoziata: documentazione tecnica, diritti di audit e accesso, sorveglianza umana e responsabilità definite. L'ente torna a poter spiegare e controllare ciò che ha comprato.",
      consequenceWrong: "Il sistema entra in servizio così com'è. Funziona, finché non sbaglia. E quando sbaglia, nessuno dentro l'ente può aprirlo, spiegarlo o fermarlo.",
      motivations: [
        "Acquisto opaco di un sistema ad alto rischio: mancano documentazione, criteri di verifica, diritti di accesso/audit e responsabilità. L'accountability resta in capo all'ente che lo impiega.",
        "La gara è regolare: se il prodotto è certificato, la PA non deve chiedere altro.",
        "È un problema di trasparenza verso i cittadini: basta pubblicare gli atti di gara."
      ],
      debriefQuestions: [
        "Cosa deve chiedere una PA prima di acquistare un sistema di IA?",
        "Perché \"il fornitore è certificato\" non basta a garantire governance e responsabilità?",
        "Quali clausole evitano il lock-in e tengono l'ente capace di controllare il sistema?"
      ],
      epilogue: "Il procurement è il momento in cui la governance si vince o si perde: chi non chiede documentazione e controllo prima, non li otterrà dopo."
    },

    case_edtech: {
      title: "La classe profilata",
      scenario: "Una piattaforma educativa adattiva profila gli studenti: assegna un \"punteggio di rischio di insuccesso\", suggerisce percorsi, segnala chi tenere d'occhio. Nasce come supporto. Ma i docenti iniziano a seguire la dashboard più del proprio giudizio: chi è marcato \"a rischio\" riceve meno opportunità. Le famiglie non sanno come funziona, e non possono contestare.",
      clues: [
        { title: "Dashboard di rischio", text: "Un cruscotto assegna a ogni studente un punteggio di rischio di insuccesso e indirizza scelte su gruppi, percorsi e priorità di supporto." },
        { title: "Comunicazione alle famiglie", text: "La scuola presenta la piattaforma come \"strumento neutro e oggettivo\" per personalizzare la didattica. Nessun dettaglio sui criteri." },
        { title: "Descrizione dell'algoritmo", text: "La scheda tecnica indica che il modello usa voti, presenze, ritardi, comportamento e dati di utilizzo della piattaforma." },
        { title: "Nota di una docente", text: "Una docente scrive: \"seguiamo il punteggio per decidere chi recuperare; rivedere caso per caso non c'è tempo\". Il controllo umano esiste sulla carta." },
        { title: "Reclamo di una famiglia", text: "Una famiglia contesta: lo studente è stato escluso da un progetto perché \"a rischio\". Nessuna spiegazione, nessun modo per far rivedere la decisione." },
        { title: "Policy sui dati", text: "La policy è incompleta: non chiarisce minimizzazione, conservazione e accessi. Difficile dire quali dati servano davvero." }
      ],
      clueSources: ["tecnica", "pubblica", "tecnica", "interna", "reclamo", "amministrativa"],
      noteCorrect: "Nota investigativa: non ogni piattaforma educativa è vietata, ma questa incide su opportunità e percorsi degli studenti: è alto rischio. Servono controllo umano effettivo (non seguire ciecamente il punteggio), minimizzazione dei dati, spiegabilità verso docenti e famiglie e possibilità di contestare.",
      notePartial: "Nota investigativa: la classificazione regge, la misura no. Senza un controllo umano che possa davvero discostarsi dal punteggio e senza spiegabilità, la piattaforma orienta le decisioni al posto dei docenti.",
      noteWrong: "Nota investigativa: il fascicolo resta aperto. Il punteggio continua a decidere chi ha una possibilità in più e chi una in meno.",
      consequenceCorrect: "La piattaforma torna a essere supporto, non verdetto: i docenti possono discostarsi e devono motivare, le famiglie ricevono spiegazioni e possono contestare, i dati raccolti sono ridotti al necessario.",
      consequenceWrong: "Il punteggio di rischio si estende a orientamento e borse di studio. La scuola è più \"efficiente\". Alcuni studenti restano marcati, senza sapere perché.",
      motivations: [
        "È solo un supporto didattico neutro: se segnala un rischio, aiuta soltanto i docenti.",
        "Il problema è la comunicazione: basta spiegare meglio alle famiglie come funziona.",
        "La piattaforma incide su opportunità educative: è alto rischio e richiede controllo umano effettivo, minimizzazione dei dati, spiegabilità e contestabilità. Risponde la scuola che la usa."
      ],
      debriefQuestions: [
        "Quando una raccomandazione didattica diventa una decisione rilevante per lo studente?",
        "Cosa distingue un supporto al docente da un'automazione che decide al posto suo?",
        "Come si rende contestabile e spiegabile un punteggio educativo verso studenti e famiglie?"
      ],
      epilogue: "La classe profilata insegna il confine: l'IA può sostenere la didattica, non sostituire il giudizio umano sulle opportunità dei ragazzi."
    },

    case_gpai: {
      title: "Il modello tuttofare",
      scenario: "Un ente integra un modello generativo generale nei flussi interni: sintetizza documenti, prepara bozze di decisione, classifica richieste, suggerisce risposte agli operatori. Comodo e versatile. Ma qualcuno inizia a usarlo per decidere, non solo per abbozzare. Gli output non vengono verificati, i prompt non sono governati, e un'allucinazione finisce in un atto.",
      clues: [
        { title: "Policy d'uso aziendale", text: "Una policy generica autorizza l'uso del modello generativo \"per supportare il lavoro\". Nessun limite sugli usi decisionali." },
        { title: "Output errato", text: "Una bozza generata contiene un riferimento normativo inventato. Il testo è finito quasi inalterato in una comunicazione ufficiale." },
        { title: "Email interna", text: "Un'email invita i colleghi a \"far scrivere al modello le bozze di decisione, così si fa prima\": il generatore entra nel merito delle scelte." },
        { title: "Nota del DPO", text: "Il responsabile protezione dati segnala rischi su dati immessi nei prompt, verifica degli output e tracciabilità delle decisioni." },
        { title: "Log dei prompt", text: "Il registro mostra prompt liberi, con dati e richieste decisionali, senza criteri, controlli o revisione umana documentata." },
        { title: "Documento del fornitore", text: "La scheda del fornitore è generica: \"modello versatile per molti compiti\". Nessuna indicazione sugli usi da evitare." }
      ],
      clueSources: ["amministrativa", "log", "interna", "interna", "log", "vendor"],
      noteCorrect: "Nota investigativa: il modello generale non è di per sé vietato né automaticamente alto rischio. Il rischio nasce dall'uso concreto: qui entra in decisioni rilevanti senza verifica. Servono revisione umana effettiva, tracciabilità, policy d'uso con confini chiari, controllo dei dati immessi e disclaimer verso gli utenti. Risponde l'organizzazione che lo impiega.",
      notePartial: "Nota investigativa: il rischio è colto a metà. Senza verifica effettiva degli output e governance dei prompt, il modello continua a influenzare decisioni che nessuno controlla.",
      noteWrong: "Nota investigativa: il fascicolo resta aperto. Il modello scrive, qualcuno firma, e nessuno verifica.",
      consequenceCorrect: "L'uso del modello viene governato: confini chiari tra abbozzare e decidere, revisione umana effettiva, tracciabilità di prompt e output, controllo dei dati immessi. Resta utile, smette di decidere da solo.",
      consequenceWrong: "Il modello tuttofare entra in più processi. La produttività sale. E ogni tanto una decisione poggia su qualcosa che il modello ha semplicemente inventato.",
      motivations: [
        "Un modello generale è solo uno strumento: l'uso interno non richiede regole particolari.",
        "Il modello generale non è vietato né automaticamente alto rischio, ma qui è usato in decisioni rilevanti senza controllo: serve governance dell'uso (revisione umana effettiva, tracciabilità, limiti, dati ammessi). Risponde il deployer.",
        "Basta un disclaimer che ricordi che le risposte vanno verificate."
      ],
      debriefQuestions: [
        "Chi risponde se un modello generale viene usato in un processo decisionale concreto?",
        "Cosa cambia tra usare il modello per abbozzare e usarlo per decidere?",
        "Quali garanzie servono quando un GPAI entra in un flusso decisionale di un ente?"
      ],
      epilogue: "Il modello tuttofare non è il problema: lo diventa quando passa, senza controllo, dall'abbozzare al decidere."
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
    },
    norm_chatbot: {
      title: "Assistenti automatici e trasparenza al cittadino",
      reference: "AI Act — art. 50 (obblighi di trasparenza); cfr. obblighi del deployer",
      explanation: "Chi interagisce con un sistema di IA deve sapere che sta parlando con una macchina (art. 50). Per un assistente pubblico la trasparenza è il minimo: contano anche informazione corretta, supervisione umana effettiva, possibilità di raggiungere una persona e tracciabilità. La responsabilità d'uso resta del deployer, non si scarica sul fornitore.",
      notMeaning: "Non significa che ogni chatbot pubblico sia vietato: vanno resi trasparenti, supervisionati e affiancati da un canale umano, soprattutto quando incidono su diritti o opportunità.",
      democraticFunction: "Il cittadino ha diritto di sapere quando un'informazione pubblica arriva da una macchina e di poter parlare con una persona.",
      tags: ["trasparenza", "chatbot", "servizi pubblici", "deployer"]
    },
    norm_procurement: {
      title: "Acquisto pubblico di sistemi di IA",
      reference: "AI Act — obblighi per i sistemi ad alto rischio (governance e documentazione)",
      explanation: "Quando una PA acquista un sistema di IA che incide su decisioni rilevanti, gli obblighi dell'alto rischio non si comprano con una certificazione: servono documentazione tecnica, criteri di verifica ex ante, diritti di accesso e audit, sorveglianza umana e responsabilità contrattuali chiare. L'accountability resta in capo all'ente che impiega il sistema.",
      notMeaning: "Non significa che acquistare IA sia illegittimo: significa che servono documentazione, governance e responsabilità verificabili prima e dopo l'acquisto.",
      democraticFunction: "La spesa pubblica in IA deve restare spiegabile e controllabile: un ente non può usare ciò che non sa aprire.",
      tags: ["alto rischio", "procurement", "governance", "documentazione"]
    },
    norm_edtech: {
      title: "Piattaforme educative e decisioni rilevanti",
      reference: "AI Act — Allegato III (istruzione e formazione professionale)",
      explanation: "I sistemi di IA usati nell'istruzione per valutare, orientare o decidere l'accesso a percorsi e opportunità sono ad alto rischio. Richiedono sorveglianza umana effettiva, qualità e minimizzazione dei dati, spiegabilità verso docenti, studenti e famiglie, e possibilità di contestare. Un supporto didattico non deve diventare un verdetto automatico.",
      notMeaning: "Non significa che ogni piattaforma educativa sia vietata: il regime dipende dall'effetto sulle opportunità degli studenti e dalla presenza di un controllo umano effettivo.",
      democraticFunction: "Le opportunità educative non possono dipendere da un punteggio opaco che i docenti seguono e le famiglie non possono contestare.",
      tags: ["alto rischio", "istruzione", "controllo umano", "spiegabilità"]
    },
    norm_gpai: {
      title: "Modelli generali (GPAI) e uso a valle",
      reference: "AI Act — disposizioni sui modelli per finalità generali (GPAI) e obblighi del deployer",
      explanation: "Un modello generativo per finalità generali non è di per sé vietato né automaticamente ad alto rischio: il rischio dipende dall'uso concreto. Quando entra in decisioni rilevanti servono revisione umana effettiva, tracciabilità, policy d'uso con confini chiari, controllo dei dati immessi e trasparenza verso gli utenti. Gli obblighi del modello (lato provider) si sommano alla responsabilità d'uso del deployer.",
      notMeaning: "Non significa che usare un modello generale sia vietato, né che sia sempre alto rischio: conta come e dove viene usato, e con quali garanzie.",
      democraticFunction: "Un modello che redige bozze di decisione deve restare verificabile: nessun atto può poggiare su un output non controllato.",
      tags: ["GPAI", "modello generativo", "uso a valle", "deployer"]
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
  },

  // Schede didattiche per caso (v0.5). Visibili nel debrief docente; non
  // cambiano la soluzione dei casi. Una scheda per ciascun caso giocabile.
  caseLearning: {
    case_scoring: {
      takeaway: 'Un punteggio sociale generalizzato non si corregge con più controlli: si vieta.',
      teaches: "Alcuni usi dell'IA non si mitigano: si vietano. Il social scoring colpisce dignità e uguaglianza.",
      typicalMistake: 'Trattare un divieto come un sistema ad alto rischio da governare con audit e supervisione.',
      discussionQuestion: 'Perché alcune pratiche sono vietate e non semplicemente regolate?',
      aiActConcepts: ['pratica vietata (art. 5)', 'social scoring', 'dignità e uguaglianza'],
      understandingSignal: 'Il giocatore riconosce il divieto e impone il blocco, non un audit.',
      classroomUse: "Aprire la discussione sulle soglie non negoziabili dell'AI Act.",
      estimatedDebriefMinutes: 8
    },
    case_lavoro: {
      takeaway: 'Nel lavoro l\'IA è ammessa solo con garanzie effettive: dati di qualità, supervisione reale, tracciabilità.',
      teaches: 'I sistemi che selezionano e valutano i lavoratori sono ad alto rischio: richiedono garanzie effettive.',
      typicalMistake: "Accontentarsi di una supervisione umana di facciata o della sola notifica all'interessato.",
      discussionQuestion: 'Quali obblighi rendono governabile un sistema ad alto rischio nel lavoro?',
      aiActConcepts: ['alto rischio (Allegato III)', 'qualità dei dati', 'sorveglianza umana', 'logging'],
      understandingSignal: 'Il giocatore impone audit, supervisione e logging invece di bloccare o ignorare.',
      classroomUse: 'Collegare il caso a recruiting e gestione del personale reali.',
      estimatedDebriefMinutes: 10
    },
    case_media: {
      takeaway: 'Chi guarda un contenuto sintetico ha il diritto di saperlo: l\'etichetta è il minimo, non il punto d\'arrivo.',
      teaches: 'La trasparenza sui contenuti sintetici è necessaria, ma non sempre sufficiente.',
      typicalMistake: 'Pensare che etichettare un contenuto risolva ogni problema di manipolazione.',
      discussionQuestion: "Quando informare l'utente è necessario ma non basta?",
      aiActConcepts: ['trasparenza (art. 50)', 'deepfake', 'contenuti sintetici'],
      understandingSignal: "Il giocatore impone l'etichettatura e spiega perché protegge la fiducia pubblica.",
      classroomUse: 'Discutere comunicazione istituzionale e disinformazione.',
      estimatedDebriefMinutes: 8
    },
    case_scuola: {
      takeaway: 'L\'aula non è un laboratorio di sorveglianza emotiva: inferire le emozioni a scuola è vietato.',
      teaches: "Inferire le emozioni a scuola è vietato, salvo eccezioni limitate: l'aula non è uno spazio di sorveglianza emotiva.",
      typicalMistake: 'Trattare il riconoscimento delle emozioni come un sistema da auditare anziché da vietare.',
      discussionQuestion: 'Perché il contesto educativo riceve una protezione speciale?',
      aiActConcepts: ['pratica vietata (art. 5)', 'riconoscimento delle emozioni', 'contesto educativo'],
      understandingSignal: 'Il giocatore distingue osservazione lecita e inferenza automatica delle emozioni.',
      classroomUse: 'Riflettere su sorveglianza e benessere a scuola.',
      estimatedDebriefMinutes: 8
    },
    case_ospedale: {
      takeaway: 'Una media eccellente può nascondere errori gravi sui più vulnerabili: guarda i sottogruppi, non il totale.',
      teaches: "L'IA in sanità non è vietata: va governata, documentata e supervisionata, soprattutto sui gruppi vulnerabili.",
      typicalMistake: 'Fidarsi della media eccellente e ignorare gli errori concentrati sui sottogruppi.',
      discussionQuestion: 'Come si governa un sistema predittivo senza bloccarlo né subirlo?',
      aiActConcepts: ['alto rischio', 'qualità dei dati', 'sorveglianza umana', 'monitoraggio post-market'],
      understandingSignal: 'Il giocatore non spegne tutto: impone audit, logging e supervisione effettiva.',
      classroomUse: 'Discutere bias clinici e responsabilità del deployer sanitario.',
      estimatedDebriefMinutes: 10
    },
    case_biometria: {
      takeaway: 'Riconoscere volti in tempo reale nello spazio pubblico è il perimetro di un divieto, non un dettaglio tecnico.',
      teaches: "L'identificazione biometrica remota in tempo reale negli spazi pubblici per finalità di contrasto è vietata, salvo eccezioni tassative.",
      typicalMistake: 'Credere che ogni uso biometrico sia uguale, ignorando finalità e contesto.',
      discussionQuestion: 'Dove passa il confine tra sicurezza e sorveglianza di massa?',
      aiActConcepts: ['pratica vietata (art. 5)', 'biometria remota', 'spazio pubblico', 'finalità di contrasto'],
      understandingSignal: 'Il giocatore individua il perimetro del divieto: tempo reale, spazio pubblico, contrasto.',
      classroomUse: 'Discutere videosorveglianza e libertà negli spazi pubblici.',
      estimatedDebriefMinutes: 9
    },
    case_credito: {
      takeaway: 'Conta l\'effetto sulle persone, non il nome del sistema: un “punteggio di affidabilità” può essere social scoring.',
      teaches: 'Non ogni scoring è vietato: contano finalità, dati, contesto, effetti e controllo umano effettivo.',
      typicalMistake: "Credere che la dicitura 'supporto decisionale' basti a rendere il sistema sicuro.",
      discussionQuestion: 'Quando un sistema di valutazione diventa trattamento sfavorevole vietato?',
      aiActConcepts: ['social scoring (art. 5)', 'alto rischio (Allegato III)', 'controllo umano', 'responsabilità del deployer'],
      understandingSignal: 'Il giocatore distingue social scoring vietato e valutazione ad alto rischio.',
      classroomUse: 'Confine credito/welfare: caso-specchio per chiudere il percorso avanzato.',
      estimatedDebriefMinutes: 12
    },
    case_chatbot: {
      takeaway: 'Un canale automatico che risponde sempre non basta: servono trasparenza e una via d\'uscita umana.',
      teaches: "Un assistente pubblico non va vietato, va reso trasparente e affiancato da un canale umano: conta l'affidamento del cittadino.",
      typicalMistake: "Pensare che basti la dicitura \"solo informativo\" per scaricare la responsabilità sul cittadino o sul fornitore.",
      discussionQuestion: "Quando un assistente automatico diventa una fonte affidabile per il cittadino?",
      aiActConcepts: ["trasparenza (art. 50)", "supervisione umana", "responsabilità del deployer", "chatbot pubblico"],
      understandingSignal: "Il giocatore impone trasparenza e canale umano invece di vietare o di fidarsi ciecamente.",
      classroomUse: "Discutere servizi pubblici digitali, affidamento e diritto a una risposta umana.",
      estimatedDebriefMinutes: 9
    },
    case_procurement: {
      takeaway: 'Comprare un sistema di IA senza documentazione significa comprare un rischio che non puoi governare.',
      teaches: "Gli obblighi dell'alto rischio non si comprano con una certificazione: servono documentazione, governance e diritti di controllo.",
      typicalMistake: "Accontentarsi di \"il fornitore è certificato\" e rinunciare a documentazione, audit e accesso.",
      discussionQuestion: "Cosa deve chiedere una PA prima di acquistare un sistema di IA?",
      aiActConcepts: ["alto rischio", "procurement AI", "documentazione tecnica", "accountability", "lock-in"],
      understandingSignal: "Il giocatore chiede documentazione, diritti di audit/accesso e responsabilità contrattuali, non solo una certificazione.",
      classroomUse: "Collegare AI governance e acquisti pubblici reali, senza entrare nel codice appalti.",
      estimatedDebriefMinutes: 11
    },
    case_edtech: {
      takeaway: 'Una piattaforma che profila gli studenti e orienta le decisioni didattiche è alto rischio: va governata, non subita.',
      teaches: "Non ogni piattaforma educativa è vietata, ma se incide su opportunità e percorsi è alto rischio e serve controllo umano effettivo.",
      typicalMistake: "Trattare un punteggio di rischio studenti come neutro e seguirlo al posto del giudizio del docente.",
      discussionQuestion: "Quando una raccomandazione didattica diventa una decisione rilevante per lo studente?",
      aiActConcepts: ["alto rischio (Allegato III)", "istruzione", "controllo umano", "minimizzazione dei dati", "spiegabilità"],
      understandingSignal: "Il giocatore distingue supporto didattico e decisione rilevante, e pretende contestabilità.",
      classroomUse: "Riflettere su profilazione, equità e opportunità educative.",
      estimatedDebriefMinutes: 11
    },
    case_gpai: {
      takeaway: 'Il modello generale non è il punto: è l\'uso a valle nelle decisioni concrete che richiede governance.',
      teaches: "Un modello generale non è automaticamente vietato né alto rischio: il rischio dipende dall'uso concreto e va governato a valle.",
      typicalMistake: "Credere che un disclaimer basti, o usare il modello per decidere senza verifica né tracciabilità.",
      discussionQuestion: "Chi risponde se un modello generale viene usato in un processo decisionale concreto?",
      aiActConcepts: ["GPAI", "modello generativo", "uso a valle", "controllo umano effettivo", "data governance"],
      understandingSignal: "Il giocatore distingue abbozzare e decidere, e impone governance dell'uso invece di vietare o ignorare.",
      classroomUse: "Discutere adozione di IA generativa in azienda/PA e responsabilità del deployer.",
      estimatedDebriefMinutes: 12
    }
  },

  // Glossario operativo (v0.5). Voci brevi che aiutano a giocare e capire.
  // I collegamenti ai casi sono strutturali (src/game/data/glossary.ts).
  glossary: {
    title: 'GLOSSARIO OPERATIVO',
    subtitle: 'Voci brevi per giocare e capire. Non è un trattato.',
    back: '◂ ARCHIVIO',
    whyLabel: 'Perché conta',
    relatedLabel: 'Casi collegati',
    cautionLabel: 'Attenzione',
    prevButton: '◂ INDIETRO',
    nextButton: 'AVANTI ▸',
    counter: '{index}/{total}',
    entries: {
      prohibited_practice: {
        term: 'Pratica vietata',
        definition: "Uso dell'IA incompatibile con i diritti fondamentali, vietato dall'art. 5 a prescindere da audit o garanzie.",
        whyItMatters: 'Alcuni rischi non si governano: si fermano.',
        caution: 'Non significa che ogni IA sia vietata: il divieto colpisce usi specifici.'
      },
      high_risk: {
        term: 'Alto rischio',
        definition: 'Sistema che incide su diritti, sicurezza o accesso ai servizi: ammesso ma soggetto a obblighi forti (Allegato III).',
        whyItMatters: 'Il rischio va governato, non negato.',
        caution: 'Non significa vietato: significa documentato, supervisionato e verificabile.'
      },
      transparency: {
        term: 'Trasparenza',
        definition: "Obbligo di rendere riconoscibile l'interazione con l'IA o un contenuto sintetico (art. 50).",
        whyItMatters: 'Permette di distinguere reale e sintetico.',
        caution: 'Non significa che la sola etichetta basti a eliminare il rischio.'
      },
      challengeable: {
        term: 'Contestabile',
        definition: 'Una decisione può essere corretta nel merito ma fragile perché motivata male, fondata su prove deboli o attribuita al soggetto sbagliato.',
        whyItMatters: "Insegna che non basta avere ragione: l'atto deve reggere.",
        caution: 'Non significa sbagliata: significa impugnabile.'
      },
      provider: {
        term: 'Provider',
        definition: "Chi sviluppa o immette sul mercato il sistema di IA.",
        whyItMatters: 'Definisce gli obblighi di progettazione del sistema.',
        caution: 'Non significa che risponda di tutto: anche il deployer ha obblighi.'
      },
      deployer: {
        term: 'Deployer',
        definition: 'Chi utilizza il sistema sotto la propria autorità (es. un ente pubblico).',
        whyItMatters: "Molti obblighi d'uso ricadono qui.",
        caution: 'Non significa che possa scaricare tutto sul fornitore.'
      },
      human_oversight: {
        term: 'Controllo umano',
        definition: 'Supervisione umana effettiva sulle decisioni automatizzate, non solo formale.',
        whyItMatters: 'Un umano che segue sempre la macchina non è controllo.',
        caution: 'Non significa una firma di facciata: deve poter incidere davvero.'
      },
      social_scoring: {
        term: 'Social scoring',
        definition: 'Punteggio che valuta le persone sul comportamento sociale e produce trattamenti sfavorevoli in contesti scollegati o sproporzionati: vietato.',
        whyItMatters: 'Colpisce dignità e uguaglianza.',
        caution: 'Non significa che ogni graduatoria sia vietata.'
      },
      biometrics: {
        term: 'Biometria',
        definition: 'Identificazione remota tramite dati biometrici; in tempo reale e per finalità di contrasto negli spazi pubblici è vietata salvo eccezioni.',
        whyItMatters: 'Lo spazio pubblico non è una zona di identificazione permanente.',
        caution: 'Non significa che ogni uso biometrico sia vietato: contano finalità e contesto.'
      },
      emotion_recognition: {
        term: 'Riconoscimento delle emozioni',
        definition: 'Inferenza automatica delle emozioni; a scuola e al lavoro è vietata salvo eccezioni limitate.',
        whyItMatters: 'Protegge spazi educativi e lavorativi dalla sorveglianza emotiva.',
        caution: 'Non significa che ogni osservazione del comportamento sia vietata.'
      },
      deepfake: {
        term: 'Deepfake',
        definition: 'Contenuto sintetico che imita persone o eventi reali; deve essere reso riconoscibile (art. 50).',
        whyItMatters: 'Difende la fiducia nelle informazioni.',
        caution: 'Non significa che ogni contenuto generato con IA sia illecito.'
      },
      credit_welfare: {
        term: 'Credito / welfare',
        definition: "Valutazioni che decidono l'accesso a prestazioni o servizi: possono essere alto rischio o, se generalizzano la vita sociale, social scoring vietato.",
        whyItMatters: 'È il confine tra valutazione lecita e punteggio sociale.',
        caution: 'Non significa che ogni scoring economico sia vietato.'
      },
      gpai: {
        term: 'GPAI — IA per finalità generali',
        definition: 'Modelli di IA general-purpose con obblighi propri di trasparenza e gestione del rischio sistemico. Il rischio per chi li usa dipende dall\'uso concreto a valle.',
        whyItMatters: "Sempre più rilevante nell'ecosistema dell'IA.",
        caution: 'Non significa che ogni modello generale sia ad alto rischio.'
      },
      public_chatbot: {
        term: 'Chatbot pubblico',
        definition: 'Assistente automatico di un ente che informa i cittadini su servizi, requisiti o scadenze.',
        whyItMatters: 'Crea affidamento: serve trasparenza e un canale umano.',
        caution: 'Non significa che sia vietato: va reso trasparente e supervisionato.'
      },
      human_escalation: {
        term: 'Escalation umana',
        definition: 'Possibilità effettiva di passare da un sistema automatico a una persona competente.',
        whyItMatters: "Senza, l'automazione diventa un muro per il cittadino.",
        caution: 'Non significa rifare tutto a mano: significa una porta umana quando serve.'
      },
      procurement_ai: {
        term: 'Procurement AI',
        definition: 'Acquisto pubblico di sistemi di IA: la governance si decide già nel capitolato e nel contratto.',
        whyItMatters: 'Chi non chiede documentazione e controllo prima, non li ottiene dopo.',
        caution: 'Non significa che acquistare IA sia illegittimo: serve farlo con garanzie.'
      },
      technical_documentation: {
        term: 'Documentazione tecnica',
        definition: 'Insieme di informazioni che descrivono il sistema, i dati, i limiti e i controlli, e ne permettono la verifica.',
        whyItMatters: 'Senza documentazione non si può spiegare né contestare una decisione.',
        caution: 'Non significa un mucchio di carte: serve a rendere il sistema verificabile.'
      },
      lock_in: {
        term: 'Lock-in',
        definition: "Dipendenza da un fornitore che rende difficile cambiare sistema, accedere ai dati o controllarne il funzionamento.",
        whyItMatters: "Riduce la capacità dell'ente di governare e correggere.",
        caution: 'Non significa che ogni fornitura crei lock-in: dipende da clausole e diritti di accesso.'
      },
      adaptive_edtech: {
        term: 'Piattaforma educativa adattiva',
        definition: 'Sistema che profila gli studenti e adatta percorsi, suggerimenti o priorità didattiche.',
        whyItMatters: 'Se incide su opportunità o valutazione, diventa alto rischio.',
        caution: 'Non significa che ogni EdTech sia vietata: conta se decide o solo supporta.'
      },
      generative_model: {
        term: 'Modello generativo',
        definition: 'Sistema che produce testo o contenuti su richiesta; può sbagliare o “allucinare”.',
        whyItMatters: "Usato per decidere senza verifica, porta errori dentro gli atti.",
        caution: 'Non significa che sia inaffidabile sempre: va verificato e governato nell\'uso.'
      },
      data_governance: {
        term: 'Data governance',
        definition: 'Regole su quali dati si usano, come si conservano, chi vi accede e perché — incluse minimizzazione e tracciabilità.',
        whyItMatters: 'Tiene i dati proporzionati allo scopo e i sistemi verificabili.',
        caution: 'Non significa raccogliere tutto “per sicurezza”: significa usare solo ciò che serve.'
      }
    }
  }
  ,
  learningLayer: {
    chapters: {
      button: 'Capitoli',
      title: 'Capitoli del percorso',
      intro: "Quattro capitoli tematici raggruppano gli 11 casi. Sono un ordine consigliato, non un vincolo: ogni fascicolo resta apribile liberamente dalla mappa.",
      orderLabel: 'Capitolo {order} di {total}',
      durationLabel: '~{minutes} min',
      completionLabel: '{done}/{total} casi chiusi',
      completeTag: 'COMPLETATO',
      debriefLabel: 'Debrief del capitolo',
      objectivesLabel: 'Obiettivi',
      close: 'Chiudi',
      defs: {
        prohibited: {
          title: 'Pratiche vietate',
          intro: 'Dove passa la linea di ciò che nessuna misura può sanare: punteggi sociali, emozioni dedotte, volti nella folla, credito civico.',
          debrief: "Il filo dei quattro casi: quando un sistema condiziona diritti fondamentali per come funziona — non per come è configurato — la risposta non è correggerlo, è fermarlo."
        },
        high_risk: {
          title: 'Sistemi ad alto rischio',
          intro: 'Permessi ma sotto obblighi severi: selezione del personale, triage sanitario, piattaforme educative. Qui si impara a distinguere vietato da mal governato.',
          debrief: "Il filo dei tre casi: l'alto rischio non vieta la tecnologia — pretende dati di qualità, documentazione e una supervisione umana capace di dire no."
        },
        transparency: {
          title: 'Trasparenza',
          intro: "Contenuti sintetici e sportelli automatici: l'inganno, non la tecnologia, è il problema. Le persone hanno diritto di sapere con che cosa interagiscono.",
          debrief: "Il filo dei due casi: un'etichetta mancante sembra un dettaglio, ma erode la fiducia di tutti in tutto — è questo il danno sistemico."
        },
        governance: {
          title: 'Governance e GPAI',
          intro: "Appalti opachi e modelli tuttofare usati a valle: i casi più ambigui, dove la responsabilità si distribuisce lungo la filiera.",
          debrief: "Il filo dei due casi: comprare o riusare un sistema non trasferisce la responsabilità — la moltiplica lungo la catena."
        }
      }
    },
    objectives: {
      obj_prohibited_boundary: 'Riconoscere il confine delle pratiche vietate',
      obj_risk_classification: 'Classificare il rischio di un sistema',
      obj_decisive_evidence: 'Selezionare le prove decisive',
      obj_actor_responsibility: 'Attribuire la responsabilità corretta',
      obj_proportionate_measures: 'Scegliere misure proporzionate',
      obj_transparency_duties: 'Applicare gli obblighi di trasparenza',
      obj_human_oversight: 'Valutare la supervisione umana effettiva',
      obj_context_dependence: 'Pesare il contesto d\'uso',
      obj_gpai_downstream: 'Governare i modelli GPAI a valle'
    },
    confidence: {
      label: 'Prima di firmare: quanto sei sicuro del tuo rapporto?',
      optionalTag: '(facoltativo — non cambia il punteggio)',
      levels: { low: 'Poco', mid: 'Abbastanza', high: 'Molto' },
      keysHint: 'Tasti 7–9',
      recorded: 'Fiducia annotata: {level}'
    },
    metacognition: {
      label: 'Calibrazione',
      line: 'Fiducia dichiarata: {confidence} · Esito: {outcome}.',
      calibrated: 'Fiducia ed esito coerenti: buona calibrazione.',
      overconfident: 'La fiducia superava l\'esito: rileggi la prova decisiva nel debrief.',
      underconfident: 'Esito migliore della fiducia dichiarata: il tuo ragionamento regge più di quanto pensi.'
    },
    reflection: {
      label: 'Riflessione (facoltativa)',
      prompt: 'Il tuo rapporto reggerebbe a un ricorso?',
      options: { holds: 'Sì, regge', unsure: 'Non sono sicuro', revise: 'Lo rivedrei' },
      thanks: 'Annotato — solo sul tuo dispositivo.'
    },
    selfCheck: {
      titlePre: 'Autocontrollo iniziale',
      titlePost: 'Autocontrollo finale',
      buttonPre: 'Autocontrollo iniziale (facoltativo)',
      buttonPost: 'Autocontrollo finale (facoltativo)',
      formative: 'Strumento formativo LOCALE: non è una valutazione certificata, non viene inviato a nessuno e si cancella con il reset della partita.',
      questionLabel: 'Domanda {i} di {total}',
      skip: 'Salta',
      resultLine: 'Risposte corrette: {correct} su {total}.',
      compareLine: 'Autocontrollo iniziale: {correct} su {total}.',
      close: 'Chiudi',
      questions: {
        sc_prohibited: {
          q: 'Quale di queste situazioni è una pratica VIETATA dall\'AI Act?',
          options: ['Un chatbot comunale che risponde a domande sui servizi', 'Un punteggio sociale pubblico che condiziona l\'accesso ai servizi', 'Un filtro anti-spam nella posta elettronica']
        },
        sc_high_risk: {
          q: 'Che cosa significa che un sistema è "ad alto rischio"?',
          options: ['È vietato usarlo', 'È sperimentale e non ancora testato', 'È permesso, ma con obblighi severi su dati, documentazione e supervisione']
        },
        sc_transparency: {
          q: 'Un ente usa un chatbot con i cittadini. Che cosa richiede l\'AI Act?',
          options: ['Che le persone sappiano di interagire con una macchina', 'Che il chatbot sia spento fuori orario', 'Nulla: i chatbot non sono coperti dal regolamento']
        },
        sc_oversight: {
          q: 'Quando la supervisione umana è davvero "effettiva"?',
          options: ['Quando una persona firma le decisioni del sistema', 'Quando il sistema è molto accurato', 'Quando chi supervisiona capisce il sistema e può ribaltarne l\'esito']
        },
        sc_actor: {
          q: 'Chi risponde dell\'USO corretto di un sistema di IA comprato da un fornitore?',
          options: ['Solo il fornitore che lo ha sviluppato', 'Anche chi lo usa (il deployer), per l\'uso concreto', 'Nessuno, se il sistema è certificato']
        },
        sc_context: {
          q: 'La stessa tecnologia può cambiare categoria di rischio?',
          options: ['Sì: dipende dal contesto d\'uso e da chi subisce gli effetti', 'No: la categoria dipende solo dall\'algoritmo', 'Solo se cambia il fornitore']
        }
      }
    }
  }
};

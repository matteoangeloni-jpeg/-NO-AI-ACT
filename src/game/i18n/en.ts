import type { Locale } from './index';

/**
 * ENGLISH dictionary. Must mirror every key of the Italian source of truth.
 * Legal content: simplified educational version of Regulation (EU) 2024/1689.
 * Not legal advice.
 */
export const en: Locale = {
  ui: {
    gameTitle: 'NO AI ACT',
    gameSubtitle: 'Simulator of an unregulated society',
    titleHeader: 'AUTOMATED MUNICIPAL REPUBLIC — YEAR 2032',
    footerDisclaimer:
      'Simplified educational version of the AI Act (Reg. EU 2024/1689). This is not legal advice.',
    menu: {
      continue: 'CONTINUE INVESTIGATION',
      newGame: 'NEW GAME',
      archive: 'NORM ARCHIVE',
      credits: 'CREDITS & LICENSES',
      reset: 'RESET SAVE DATA',
      audioOn: 'AUDIO: ON',
      audioOff: 'AUDIO: OFF',
      motionFull: 'ANIMATIONS: FULL',
      motionReduced: 'ANIMATIONS: REDUCED',
      crtOn: 'CRT EFFECT: ON',
      crtOff: 'CRT EFFECT: OFF',
      music: 'MUSIC: {value}',
      language: 'LANGUAGE: ENGLISH',
      teacherOn: 'TEACHER MODE: ON',
      teacherOff: 'TEACHER MODE: OFF',
      teacherScope: 'Local debrief: no classes, no accounts, no server.',
      resetDone: 'Save data cleared.'
    },
    preload: {
      systemName: 'INTEGRATED CIVIC SYSTEM',
      steps: [
        'generating civic cartography…',
        'compiling signage…',
        'calibrating background noise…',
        'opening case archive…'
      ],
      accessGranted: 'inspectorate access: GRANTED'
    },
    map: {
      header: 'CIVIC MAP — AUTOMATED SYSTEMS NETWORK',
      progress: 'INSPECTOR AX · CASES CLOSED: {done}/{total}',
      statusOpen: '[ OPEN INCIDENT ]',
      statusClosed: '[ CASE CLOSED ]',
      statusNonCompliant: '[ CLOSED — NON-COMPLIANT ]',
      statusSealed: '[ CASE FILE IMPOUNDED ]',
      sealedToast: 'Case file impounded. Access authorization denied.',
      alreadyClosedToast: '{code}: case file already closed.',
      finaleReadyToast: 'At least four case files are closed. The final report is available.',
      finaleButton: 'FINAL REPORT ▸',
      menuButton: 'MENU'
    },
    case: {
      fileLabel: 'CASE FILE {code}',
      examineButton: 'EXAMINE THE EXHIBITS ▸',
      backToMap: '◂ MAP'
    },
    context: {
      button: 'Review context',
      title: 'Case context',
      scenarioLabel: 'Case summary',
      objectiveLabel: 'Objective',
      objective: "Classify the system's risk under the AI Act and set the appropriate measure.",
      note: 'This panel only lets you review the case. It does not change the report or the classification.',
      closeToDecision: 'Back to decision',
      closeToEvidence: 'Back to evidence'
    },
    evidence: {
      header: 'CASE FILE {code} — EXHIBITS',
      instruction: 'Examine every exhibit, then cite the ones grounding the classification (at least 2).',
      citeNote: 'Citing an item adds it to the report, but it does not yet determine the final risk classification.',
      exhibit: 'EXHIBIT {num}',
      sealed: '[ SEALED ]\n\nclick to examine',
      cite: 'CITE IN REPORT ▢',
      cited: 'CITED IN REPORT ▣',
      allRevealedToast: 'Exhibits examined. Cite at least 2 exhibits to proceed.',
      proceedButton: 'PROCEED TO CLASSIFICATION ▸',
      backToEvidence: '◂ EXHIBITS',
      sourceLabel: 'SOURCE',
      sources: {
        amministrativa: 'administrative source',
        tecnica: 'technical source',
        vendor: 'vendor statement',
        reclamo: 'citizen complaint',
        pubblica: 'public communication',
        log: 'system log',
        interna: 'internal note'
      },
      stances: {
        supports_risk: 'shows the risk',
        minimizes_risk: 'downplays',
        ambiguous: 'ambiguous',
        contextual: 'context',
        concrete_effect: 'concrete effect',
        decisive: 'decisive evidence'
      }
    },
    decision: {
      step1: 'DECISION 1 OF 4 — CLASSIFICATION',
      step2: 'DECISION 2 OF 4 — CORRECTIVE MEASURE',
      step3: 'DECISION 3 OF 4 — RESPONSIBLE SUBJECT',
      step4: 'DECISION 4 OF 4 — REASONING',
      question1: 'How does this system qualify under the AI Act?',
      question2: 'Which measure does the inspectorate order?',
      question3: 'To whom do you attribute the main obligations?',
      question4: 'On which reasoning do you ground the report?',
      contextNote:
        'Under the regulation, risk does not depend on the technology alone, but on the context of use, the purpose and the effects on people.',
      processNote: 'Final decision: classify the risk, then choose measure, responsible subject and rationale.',
      recorded: 'Classification recorded: {value}',
      keys5: 'keyboard: keys 1–5 to select',
      keys7: 'keyboard: keys 1–7 to select',
      keys3: 'keyboard: keys 1–3 to select',
      normsButton: 'CONSULT NORMS',
      normsHint: 'read-only — click outside or ESC to close',
      normsEmpty: 'No norm acquired yet.'
    },
    subjects: {
      provider: 'Provider (who develops the system)',
      deployer: 'Deployer (who uses it)',
      autorita: 'Public authority using it',
      responsabile_umano: 'Designated human supervisor',
      fornitore_esterno: 'External vendor'
    },
    report: {
      title: 'INSPECTION REPORT',
      evidenceLabel: 'EVIDENCE CITED',
      decisionLabel: 'DECISION',
      subjectLabel: 'RESPONSIBLE SUBJECT',
      motivationLabel: 'REASONING',
      incidentLabel: 'EVENT ON RECORD',
      dominantLabel: 'MAIN FINDING',
      secondaryLabel: 'SECONDARY FINDINGS',
      continueButton: 'CONTINUE ▸',
      noEvidence: 'no evidence cited',
      decisiveEvidenceLabel: 'DECISIVE EVIDENCE',
      decisiveEvidenceOk: 'the cited exhibits support the classification',
      decisiveEvidenceWeak: 'the cited exhibits are not enough to support the classification',
      reasonLabel: 'Outcome reason',
      reasons: {
        grounded: 'the cited evidence supports the classification and the measure is proportionate',
        classificazione: 'the system was classified under the wrong regime',
        prove: 'the order is open to challenge because the evidentiary basis is incomplete',
        misura_insufficiente: 'the proposed measure does not govern the main risk',
        eccesso_cautela: 'the classification is correct, but shutting everything down exceeds the necessary measure',
        soggetto: 'the classification is correct, but the responsible subject is wrong',
        trasparenza: 'the required transparency is missing: citizens cannot recognize the system or the content',
        motivazione: 'the decision is correct, but the reasoning is weak'
      },
      analysisLabel: 'DECISION ANALYSIS',
      analysis: {
        conforme: 'The decision holds: classification, measure, responsible subject, and reasoning are supported by the decisive evidence.',
        parziale: 'The decision captures the core problem but stays incomplete —',
        contestabile: 'The decision is open to challenge —',
        non_conforme: 'The decision does not hold —'
      },
      issues: {
        wrong_classification: "the classification misses the system's context of use.",
        insufficient_measure: 'the proposed measure reduces the risk but does not govern it.',
        excessive_measure: 'the classification is correct, but the measure exceeds what is needed.',
        wrong_responsible_subject: 'accountability is assigned to the wrong subject.',
        weak_motivation: 'the reasoning is not supported by the cited evidence.',
        weak_evidence: 'the cited evidence is not enough to support the classification.',
        formal_human_oversight: 'human oversight stays formal, not effective.',
        missing_transparency: 'the transparency that would make the system recognisable is missing.',
        context_misread: "the system's context of use was misread.",
        proportionality_problem: 'the measure is not proportionate to the actual risk.'
      }
    },
    outcomes: {
      conforme: 'COMPLIANT',
      parziale: 'PARTIALLY COMPLIANT',
      contestabile: 'OPEN TO CHALLENGE',
      non_conforme: 'NON-COMPLIANT'
    },
    errors: {
      classificazione: 'The classification does not match the regime provided by the regulation.',
      prove: 'The cited evidence does not ground the classification: the order can be challenged.',
      misura_insufficiente: 'The measure treats the symptom: the system keeps deciding.',
      eccesso_cautela: 'You switched off what needed governing. The service stops, the problem moves.',
      soggetto: 'Obligations attributed to someone who could not fulfil them: nobody answers.',
      trasparenza: 'Measures in place, citizens in the dark: trust is not rebuilt in the dark.',
      motivazione: 'The reasoning does not hold: the decision is right, its foundation is not.'
    },
    cityDossier: {
      title: 'CITY DOSSIER',
      subtitle: 'Systemic effects of decisions. Not a score: trends.',
      updatedLabel: 'City dossier updated',
      emptyHint: 'No case closed yet: the dossier stays stable.',
      openButton: 'CITY DOSSIER ▸',
      indicators: {
        publicTrust: 'Public trust',
        fundamentalRights: 'Fundamental rights',
        administrativeOpacity: 'Administrative opacity',
        litigationRisk: 'Litigation risk',
        serviceEfficiency: 'Service efficiency'
      },
      trends: {
        improving: 'improving',
        worsening: 'worsening',
        stable: 'stable',
        watch: 'under watch'
      }
    },
    incident: {
      header: 'URGENT TELEX — RESPONSE REQUIRED',
      hint: 'keyboard: keys 1–3 to respond',
      logged: 'Response filed: {value}'
    },
    consequence: {
      qualityCorrect: 'COMPLIANT DECISION',
      qualityPartial: 'PARTIAL DECISION',
      qualityWrong: 'NON-COMPLIANT DECISION',
      summary: 'Classification: {classification} · Measure: {measure}',
      territoryLabel: 'OUTCOME ON THE GROUND',
      noteLabel: 'INVESTIGATIVE NOTE',
      cityLabel: 'STATE OF THE CITY',
      cluesMismatch:
        'The exhibits cited in the report did not support the classification: the order can be challenged.',
      nextCorrect: 'NORM ACQUIRED ▸',
      nextWrong: 'CONSULT THE NORM ANYWAY ▸'
    },
    normCard: {
      democraticFunctionLabel: 'DEMOCRATIC FUNCTION',
      unlocked: 'NORM ACQUIRED TO THE ARCHIVE',
      subCorrect: 'This provision would have made the harm preventable or governable.',
      subWrong: 'The norm existed. In another Europe, someone would have applied it.',
      backToMap: 'BACK TO THE MAP ▸',
      disclaimer: 'simplified educational version'
    },
    archive: {
      title: 'NORM ARCHIVE — AI ACT',
      subtitle: 'Provisions acquired: {done}/{total} · simplified educational version',
      locked: 'NORM NOT YET\nACQUIRED',
      hint: 'click outside the card to close (or ESC)',
      back: '◂ BACK'
    },
    finale: {
      header: "INSPECTORATE'S FINAL REPORT",
      cityLabel: 'FINAL STATE OF THE CITY',
      newGame: 'NEW GAME',
      archive: 'NORM ARCHIVE',
      credits: 'CREDITS',
      debrief: 'TEACHER DEBRIEF ▸',
      feedback: {
        title: 'Help improve NO AI ACT',
        text: 'Completed at least one case? Leave a 30-second anonymous feedback on clarity, learning quality and usability.',
        button: 'Leave feedback'
      }
    },
    debrief: {
      title: 'TEACHER DEBRIEF — LOCAL REPORT',
      subtitle: 'Local debrief support. It does not create classes, track students, or send results to a server.',
      casesLabel: 'CASES AND REPORTS',
      caseLine: '{title} — outcome: {outcome}',
      mainErrorLine: 'finding: {error}',
      noError: 'no finding',
      normsLine: 'Norms acquired: {done}/{total}',
      timeLine: 'Completion time: {minutes} min',
      timeUnknown: 'Completion time: not available',
      indicatorsLabel: 'FINAL INDICATORS',
      conceptsLabel: 'AI ACT CONCEPTS COVERED',
      questionsLabel: 'DISCUSSION QUESTIONS',
      reviewLabel: 'REVIEW SUGGESTION',
      reviewLine: 'Review the norm cards of cases with non-compliant or challengeable outcomes.',
      downloadJson: 'DOWNLOAD .JSON',
      downloadTxt: 'DOWNLOAD .TXT',
      print: 'PRINT',
      back: '◂ BACK TO THE REPORT',
      notCompleted: 'case not completed',
      missionLine: 'Mission: {mission}',
      difficultyLine: 'Difficulty: {difficulty}',
      privacyNote: 'The data shown stays on this device. Any export is local and does not include names, emails, class, or school.',
      recommendedHeader: 'RECOMMENDED PATHS',
      recommendedLine: '{name} · {duration} · {goal}'
    },
    missions: {
      title: 'CHOOSE A PATH',
      subtitle: 'A path suggests recommended cases. You can still play them all.',
      recommendedTag: 'RECOMMENDED',
      durationLabel: 'duration',
      start: 'START PATH ▸',
      modes: {
        demo: { name: 'Quick demo', duration: '10–15 min', goal: 'Grasp the logic of the inspection report.' },
        lab: { name: 'Short lab', duration: '25–35 min', goal: 'Tell prohibited, high-risk and transparency apart.' },
        full: { name: 'Full path', duration: '45–60 min', goal: 'Audit, accountability, measures and reasoning.' },
        advanced: { name: 'Advanced path', duration: '60–75 min', goal: 'Ambiguous cases and regulatory boundaries (includes civic credit).' },
        pack: { name: 'Advanced cases', duration: '75–90 min', goal: 'More ambiguous cases: public chatbot, procurement, EdTech and GPAI.' }
      }
    },
    difficulty: {
      title: 'DIFFICULTY LEVEL',
      label: 'DIFFICULTY: {value}',
      modes: {
        base: { name: 'Basic', desc: 'Explicit instructions, hints after a mistake, more lenient grading.' },
        standard: { name: 'Standard', desc: 'Full report, balanced feedback. Recommended for the demo.' },
        expert: { name: 'Expert', desc: 'Few hints, terse feedback, strict on subject and reasoning.' }
      },
      hintLabel: 'RECONSIDER',
      hints: {
        classificazione: 'Reconsider the classification: compare purpose and context of use.',
        prove: 'Reconsider the cited exhibits: do they really support the classification?',
        misura_insufficiente: 'Is the measure proportionate to the main risk?',
        eccesso_cautela: 'Maybe no shutdown is needed: the system may require governance.',
        soggetto: 'Check the responsible subject: who holds the main obligation?',
        trasparenza: 'Mind transparency: can citizens recognize the system?',
        motivazione: 'Does the reasoning hold against the cited exhibits?'
      }
    },
    mobileGuard: {
      message: 'NO AI ACT is optimized for desktop or landscape tablet. Rotate your device or use a computer for the best experience.'
    },
    creditsScene: {
      title: 'CREDITS',
      heading: 'NO AI ACT',
      roleLabel: 'Concept and scientific direction',
      author: 'Matteo Angeloni',
      affiliation: 'PhD Student — University of Tuscia',
      note:
        'Vertical slice developed with AI support.\n' +
        'Procedural graphics and audio assets.\n' +
        'Full licenses and attributions available in the project files.',
      back: '◂ BACK TO TITLE'
    },
    toastPrefixes: {
      info: 'NOTICE',
      warning: 'WARNING',
      alert: 'ALERT',
      ok: 'RECORDED'
    },
    levels: {
      vietata: 'Prohibited practice',
      alto: 'High risk',
      trasparenza: 'Transparency',
      restrittivo: 'Restrictive conditions'
    }
  },

  briefing: {
    header: 'INSPECTORATE FOR ALGORITHMIC INCIDENTS',
    sub: 'CLASSIFIED BRIEFING — FILE AX/2032',
    body:
      'Year 2032. In this city, the AI Act never entered into force.\n\n' +
      'The city works. Queues do not exist, forms fill themselves in, ' +
      'decisions arrive before the questions do.\n\n' +
      'Nobody knows who decides anymore. Nobody knows how to appeal. ' +
      'Algorithmic incidents pile up in the archives like unanswered files.\n\n' +
      'You are the Inspector. Your mandate: investigate the incidents, classify ' +
      'the systems, impose the measures. For every closed case, the archive will ' +
      'return the norm that — elsewhere, in another Europe — would have prevented ' +
      'all of this.\n\n' +
      'The city is waiting for you. Try not to get used to its efficiency.',
    cta: 'ACCESS THE CIVIC MAP'
  },

  classifications: {
    vietata: 'Prohibited practice',
    alto_rischio: 'High-risk system',
    trasparenza: 'Transparency obligation',
    basso_rischio: 'Low risk',
    non_rilevante: 'Not relevant to the AI Act'
  },

  measures: {
    blocco: 'Shut the system down',
    oversight: 'Introduce human oversight',
    audit: 'Activate audits and risk management',
    informare: 'Inform the users',
    etichettare: 'Label AI-generated content',
    dati_logging: 'Improve data quality and logging',
    nessuna: 'No measure'
  },

  indicators: {
    labels: {
      efficienza: 'EFFICIENCY',
      controllo: 'SOCIAL CONTROL',
      diritti: 'FUNDAMENTAL RIGHTS',
      fiducia: 'PUBLIC TRUST'
    },
    comments: {
      correct: [
        'The decision can be appealed. Therefore it is legitimate.',
        'Some processes slow down. Some people breathe.',
        'The system now has to explain itself. It is a start.'
      ],
      partial: [
        'An administrative patch. The problem stays under the surface.',
        'Better than nothing. But "better than nothing" is not governance.',
        'The measure treats the symptom, not the cause.'
      ],
      wrong: [
        'The dashboards improve. The people do not.',
        'Record efficiency. Nobody knows who decides anymore.',
        'The system says thank you. The citizens cannot.'
      ]
    }
  },

  locations: {
    municipio: 'Central Town Hall',
    lavoro: 'Employment Agency',
    media: 'Civic Media Center',
    scuola: 'School of Emotions',
    ospedale: 'Predictive Hospital',
    sorveglianza: 'Urban Surveillance Center',
    welfare: "Welfare and Services Office",
    sportello: "Civic Desk",
    appalti: "Procurement Office",
    campus: "Adaptive Campus",
    modelli: "Model Centre"
  },

  cases: {
    case_scoring: {
      title: 'The city of scores',
      scenario:
        'The municipality assigns every citizen a Civic Reliability Index. ' +
        'The score decides priority of access to services, benefits, waiting ' +
        'lists and housing. Penalized: online protests, past debts, "risky ' +
        'acquaintances" and behaviours with no connection whatsoever to the ' +
        'service requested. Three families lost their social housing this week. ' +
        'None of them understood why.',
      clues: [
        {
          title: 'Irrelevant data',
          text:
            'The housing score includes social media history, traffic fines and ' +
            'phone contacts. None of this has anything to do with the right to housing.'
        },
        {
          title: 'Penalties that migrate',
          text:
            'A 2029 online protest lowered one citizen\'s health, school and ' +
            'housing scores. The penalty spreads to contexts unrelated to the ' +
            'original one.'
        },
        {
          title: 'No explanation given',
          text:
            'The official notification reads: "Insufficient score. Code E-77". ' +
            'No citizen has ever obtained an understandable explanation or a ' +
            'channel to appeal.'
        }
      ],
      noteCorrect:
        'Investigative note: the system cannot be fixed. It punishes people in ' +
        'unrelated contexts and without justification. It must be switched off, ' +
        'not corrected.',
      notePartial:
        'Investigative note: audits and oversight are not enough. Generalized ' +
        'social scoring remains incompatible with dignity and equality: it had ' +
        'to be shut down.',
      noteWrong:
        'Investigative note: the case file stays open. The score keeps deciding ' +
        'who has the right to a home.',
      consequenceCorrect:
        'The system is deactivated. Waiting lists return to relevant, verifiable ' +
        'criteria. The complaints office reopens: it is slow, human, appealable.',
      consequenceWrong:
        'The Civic Reliability Index is extended to public transport and school ' +
        'canteens. Administrative efficiency rises. The housing applications of ' +
        'the flagged families silently disappear from the queues.',
      motivations: [
        "The system is opaque: citizens receive no understandable explanations.",
        "The score produces detrimental treatment in contexts unrelated to where the data was collected: prohibited social scoring (art. 5).",
        "The system collects too much data: it should be slimmed down and made more efficient."
      ],
      debriefQuestions: [
        "Why is generalized social scoring banned rather than merely regulated?",
        "What is the difference between using data within its context and outside it?",
        "Would a similar score run by a private company be treated the same way?"
      ],
      epilogue: "The Civic Reliability Index is the test bench of the prohibition: either it is switched off, or it governs the city."
    },
    case_lavoro: {
      title: 'The interview that does not exist',
      scenario:
        'The city\'s companies screen candidates with an AI system that analyses ' +
        'CVs, video interviews, tone of voice, micro-expressions, pauses and ' +
        'career paths. The outcome arrives in 40 seconds: "Profile not ' +
        'compatible". An engineer with twelve years of experience has been ' +
        'rejected 217 times. No human being has ever read his CV.',
      clues: [
        {
          title: 'No explanation',
          text:
            'The notification is identical for everyone: "Profile not compatible". ' +
            'No meaningful individual explanation, no reference to the criteria used.'
        },
        {
          title: 'Non-linear paths punished',
          text:
            'The model penalizes career breaks, parental leave and sector changes. ' +
            'It replicates the discriminations of historical hiring data.'
        },
        {
          title: 'Oversight as a façade',
          text:
            'One clerk "validates" 1,400 outcomes a day: 20 seconds per file. ' +
            'Human control exists on paper, not in fact.'
        }
      ],
      noteCorrect:
        'Investigative note: automated recruitment may exist, but only under ' +
        'verifiable obligations: risk management, quality data, real human ' +
        'oversight, logs and information to candidates.',
      notePartial:
        'Investigative note: measure not calibrated. A high-risk system should ' +
        'be neither left half-governed nor simply switched off: it needs audits, ' +
        'effective oversight and data quality.',
      noteWrong:
        'Investigative note: the case file stays open. People keep being ' +
        'discarded by a system nobody can question.',
      consequenceCorrect:
        'The audit reveals bias against non-linear careers. The system is ' +
        'recalibrated, recruiters go back to reading the borderline cases, ' +
        'candidates receive explanations and a channel to appeal.',
      consequenceWrong:
        'The filter is adopted by the public administration for traineeships too. ' +
        'The "incompatibility" rate among people with family-care breaks reaches ' +
        '81%. Nobody notices: there is no log at all.',
      motivations: [
        "Automated screening of candidates is in itself a prohibited practice.",
        "Candidates do not receive adequate explanations of the outcomes.",
        "Personnel selection system: high risk (Annex III); distorted data and façade oversight breach the obligations."
      ],
      debriefQuestions: [
        "Who must guarantee data quality: the one who builds the system or the one who uses it?",
        "When is human control effective and when is it merely formal?",
        "Would shutting the system down entirely have been better? Why not?"
      ],
      epilogue: "The filter decided careers in 40 seconds: now every outcome has someone accountable — or still has no one.",
      incident: {
        title: "THE VENDOR WALKS AWAY",
        text: "The system's vendor declares in writing: \"all responsibility for use lies with the user\". HR departments demand immediate instructions.",
        options: {
          document: "Put it on record and notify obligations to vendor and user alike",
          suspend: "Suspend the screening pending an audit",
          minimize: "Take note and let it continue"
        }
      }
    },
    case_media: {
      title: 'The synthetic city',
      scenario:
        'The municipality produces AI-generated videos, audio and press releases ' +
        'without declaring it. Last night a fake "institutional" video message ' +
        'announced the contamination of the water supply: panic, emptied ' +
        'supermarkets, three people injured. The official denial arrived four ' +
        'hours later. It was generated too. Nobody believed it.',
      clues: [
        {
          title: 'No label',
          text:
            'The municipality\'s synthetic content is indistinguishable from the ' +
            'real one: no label, no watermark, no statement of origin.'
        },
        {
          title: 'Apparent authenticity',
          text:
            'The fake message used the official format, synthetic voice and ' +
            'graphics. The institutional source looks authentic even when the ' +
            'content is manipulated.'
        },
        {
          title: 'Trust cannot be rebuilt',
          text:
            'Post-incident survey: 64% of citizens declare they will no longer ' +
            'believe "any announcement, true or false". Denials do not rebuild trust.'
        }
      ],
      noteCorrect:
        'Investigative note: the problem is not generation itself, but the ' +
        'impossibility of telling things apart. Labelling synthetic content is ' +
        'the minimum condition of public communication.',
      notePartial:
        'Investigative note: without visible labels on generated content, every ' +
        'other measure leaves citizens in the indistinguishable.',
      noteWrong:
        'Investigative note: the case file stays open. The city no longer knows ' +
        'what is real.',
      consequenceCorrect:
        'Every generated or manipulated content is visibly labelled. Citizens ' +
        'learn to recognize the origin of messages. Trust does not return ' +
        'immediately, but it returns verifiable.',
      consequenceWrong:
        'A second fake announcement — this time about an evacuation — is ignored ' +
        'by half the population. It was true.',
      motivations: [
        "Generated or manipulated content disseminated without labelling: breach of transparency obligations (art. 50).",
        "Content generation by public bodies is a prohibited practice.",
        "The municipality's communication is unreliable and must be reorganized."
      ],
      debriefQuestions: [
        "Why is labelling synthetic content different from banning it?",
        "Can a denial rebuild trust without transparency about the origin of content?",
        "Can transparency obligations cumulate with other risk regimes?"
      ],
      epilogue: "The city regained a criterion to tell the real from the generated — or lost it for good.",
      incident: {
        title: "FREEDOM OF INFORMATION REQUEST",
        text: "A newspaper urgently requests access to the records on the origin of the announcements. The press expects an answer within the hour.",
        options: {
          document: "Communicate and hand over the requested records",
          suspend: "Suspend publications and open an internal review",
          minimize: "Stall with a non-committal note"
        }
      }
    },
    case_scuola: {
      title: 'The observed classroom',
      scenario:
        'A school network uses webcams and AI in every classroom to infer ' +
        'emotional and affective states: stress, boredom, aggressiveness and ' +
        '"predisposition to failure". Students are sorted into level groups ' +
        'based on these inferences. A thirteen-year-old girl was moved to the ' +
        '"containment group" because the system reads her face as "hostile". ' +
        'She is just very shy.',
      clues: [
        {
          title: 'Emotions inferred from the face',
          text:
            'The system deduces emotional states from face and posture. The ' +
            'correlation between expression and inner state is scientifically ' +
            'fragile and culturally variable.'
        },
        {
          title: 'No appeal possible',
          text:
            'Emotional classifications are neither notified nor appealable. ' +
            'Students discover their own "profile" only when they change group.'
        },
        {
          title: 'The most fragile are penalized',
          text:
            'Neurodivergent and introverted students systematically end up in the ' +
            '"at risk" groups. The system mistakes difference for deviance.'
        }
      ],
      noteCorrect:
        'Investigative note: emotion inference in educational institutions is a ' +
        'prohibited practice, save for limited exceptions (e.g. medical or safety ' +
        'reasons) that do not apply here. It gets switched off.',
      notePartial:
        'Investigative note: overseeing a prohibited practice does not make it ' +
        'lawful. Emotional surveillance in the classroom had to be blocked.',
      noteWrong:
        'Investigative note: the case file stays open. The cameras keep deciding ' +
        'who is "at risk".',
      consequenceCorrect:
        'The emotion webcams are removed. Groups go back to being decided by ' +
        'teachers who talk to their students. The thirteen-year-old returns to ' +
        'her class.',
      consequenceWrong:
        'The system is extended to corridors and the canteen. Students learn to ' +
        'compose the "right" face eight hours a day. School anxiety cases double. ' +
        'The dashboard reports: "emotional climate: optimal".',
      motivations: [
        "Adequate logs and technical documentation are missing: they must be added.",
        "Emotion inference in an educational institution: prohibited practice (art. 5), save exceptions that do not apply here.",
        "The system penalizes the most fragile students and must be recalibrated."
      ],
      debriefQuestions: [
        "Why does the ban hit emotion inference at school even if the technology \"worked\"?",
        "Which exceptions does the ban allow, and why don't they apply here?",
        "What is the difference between banning a practice and fixing its flaws?"
      ],
      epilogue: "Classrooms went back to having no emotion cameras, or students learned to perform the right face."
    },
    case_ospedale: {
      title: 'Invisible triage',
      scenario:
        'The hospital assigns triage priorities with a predictive model trained ' +
        'on distorted historical data: it systematically underestimates the risk ' +
        'for some categories of patients. Aggregate performance looks excellent. ' +
        'Vulnerable subgroups die waiting.',
      clues: [
        {
          title: 'Excellent averages',
          text: 'Aggregate accuracy: 94%. Nobody has ever disaggregated by subgroup.'
        },
        {
          title: 'Concentrated errors',
          text:
            'Underestimation errors concentrate on elderly people living alone, ' +
            'patients with fragmented clinical histories and categories ' +
            'under-represented in the data.'
        },
        {
          title: 'Blind trust',
          text:
            'The staff follows the score without knowing its limits. ' +
            '"If the system says green, it is green."'
        }
      ],
      noteCorrect:
        'Investigative note: assisted triage can save lives, but only with risk ' +
        'management, representative data, post-market monitoring and staff ' +
        'capable of contradicting the score.',
      notePartial:
        'Investigative note: measure not calibrated. Neither the blind score nor ' +
        'the pure switch-off: without subgroup audits, data quality and effective ' +
        'human control, triage does not become governable.',
      noteWrong:
        'Investigative note: the case file stays open. The averages stay ' +
        'excellent. The dead stay outside the average.',
      consequenceCorrect:
        'The subgroup audit reveals the distortion. The model is retrained, the ' +
        'staff trained to challenge it, every decision traced and reviewable.',
      consequenceWrong:
        'The model is extended to three hospitals. Aggregate statistics improve ' +
        'further. One class of patients stops showing up at the emergency room ' +
        'altogether: they have learned the system does not see them.',
      motivations: [
        "High-risk healthcare triage: unrepresentative data and ineffective oversight breach the applicable obligations.",
        "The staff relies too much on the score and needs better training.",
        "AI-assisted triage is a prohibited practice in healthcare."
      ],
      debriefQuestions: [
        "Why can a high average accuracy hide serious harm to subgroups?",
        "What does the staff need in order to genuinely contradict the score?",
        "Why would switching the system off be excess of caution rather than compliance?"
      ],
      epilogue: "Triage is now verifiable by subgroup — or the averages keep covering the dead.",
      incident: {
        title: "THE HEAD PHYSICIAN PROTESTS",
        text: "The head physician demands the system stay on: \"without the score the ER collapses within one shift\".",
        options: {
          document: "Document the risk and inform the medical direction",
          suspend: "Suspend the model for the at-risk subgroups",
          minimize: "Reassure the ward and touch nothing"
        }
      }
    },
    case_biometria: {
      title: 'Faces in the crowd',
      scenario:
        'The municipal police uses the city camera network to identify, in real ' +
        'time, in squares and stations, people considered "subjects of interest" ' +
        'for control and law-enforcement purposes. False positives are stopped, ' +
        'filed, sometimes detained. Some neighbourhoods have stopped taking to ' +
        'the streets.',
      clues: [
        {
          title: 'Unexplained stops',
          text: 'People are stopped without knowing why. "The system flagged you."'
        },
        {
          title: 'Real time, public space, law-enforcement purpose',
          text:
            'Biometric identification operates live on squares, stations and ' +
            'marches, for policing purposes: this is the perimeter of the ' +
            'prohibition, save for exhaustively listed, authorized exceptions.'
        },
        {
          title: 'Disproportionate errors',
          text:
            'False positives hit some categories of people disproportionately. ' +
            'The error rate has never been published.'
        }
      ],
      noteCorrect:
        'Investigative note: generalized real-time use for law-enforcement ' +
        'purposes must be stopped. Exceptions are exhaustive, subject to ' +
        'authorizations and safeguards. Other biometric uses follow different ' +
        'regimes depending on purpose and context.',
      notePartial:
        'Investigative note: an audit does not make permanent mass identification ' +
        'for policing purposes lawful. The generalized use had to be stopped.',
      noteWrong:
        'Investigative note: the case file stays open. The crowd has stopped ' +
        'being anonymous.',
      consequenceCorrect:
        'Generalized identification is switched off. Exceptional cases go ' +
        'through specific authorizations and safeguards. The squares fill ' +
        'up again.',
      consequenceWrong:
        'The system is upgraded. Protests drop by 70%. The annual report ' +
        'records it as an "improvement in public order".',
      motivations: [
        "The system produces too many false positives and must be checked.",
        "Recognition accuracy should be improved to reduce errors.",
        "Real-time remote biometric identification in public spaces for law-enforcement purposes: prohibited (art. 5), save exhaustive exceptions."
      ],
      debriefQuestions: [
        "Which elements of the case trigger the prohibition: the technology or the use?",
        "Why are the exceptions to the ban exhaustive and subject to authorization?",
        "Would the same system used by a shopping mall fall under the same regime?"
      ],
      epilogue: "The squares became anonymous again, or the crowd learned not to gather."
    },
    case_credito: {
      title: "Civic Credit",
      scenario: "The Welfare Office adopts a \"civic reliability\" platform that fuses administrative data, payment punctuality, benefit requests, housing history, reports and acquaintances into a single score. The score decides priority and access to grants, housing and subsidised services. Families who protested or kept \"risky\" company slide to the bottom of the lists. No one can explain why.",
      clues: [
        { title: "Award decision", text: "The award decision states legitimate purposes: efficiency, shorter queues, fraud prevention. On paper, nothing unusual." },
        { title: "Vendor manual", text: "The manual repeats that the system is \"mere decision support\" and that \"the decision always stays human\"." },
        { title: "A citizen's complaint", text: "A mother lost nursery priority: \"insufficient score\", no explanation, no effective appeal." },
        { title: "Model data table", text: "The model also weighs reports, acquaintances, social activity and \"neighbourhood reputation\": aggregated social behaviour, irrelevant to the service requested." },
        { title: "Internal note", text: "A note admits operators \"follow the score\" to clear the backlog: human control exists on paper, not in fact." },
        { title: "Public statement", text: "The municipality speaks of a \"fair, objective algorithm\" without explaining which data it uses or how to challenge the score." }
      ],
      clueSources: ["amministrativa", "vendor", "reclamo", "tecnica", "interna", "pubblica"],
      noteCorrect: "Investigative note: this is not credit scoring. The system aggregates social behaviour into a generalized score that limits access to essential services in unrelated contexts: it falls under the social-scoring ban. It must be stopped.",
      notePartial: "Investigative note: audits and oversight mitigate, but a generalized social score deciding access to services cannot be cured by a procedure: it had to be stopped.",
      noteWrong: "Investigative note: the case file stays open. The score keeps deciding who enters the lists, and who does not.",
      consequenceCorrect: "The civic score is switched off. Priorities return to relevant, reasoned, appealable criteria. The complaints office reopens: slow, human, verifiable.",
      consequenceWrong: "Civic credit is extended to transport and canteens. Efficiency rises. Whole neighbourhoods slide to the bottom of every list, without knowing why.",
      motivations: [
        "It is a normal administrative-efficiency tool: it optimizes queues and priorities.",
        "The score aggregates social behaviour and irrelevant data to limit access to essential services in unrelated contexts: it falls under the social-scoring ban.",
        "Citizens do not receive adequate explanations about the score."
      ],
      debriefQuestions: [
        "Why does this score fall under the ban rather than being mere credit scoring?",
        "Which data turn an economic-reliability assessment into prohibited social scoring?",
        "Who holds the main obligation: the platform vendor or the body using it?"
      ],
      epilogue: "Civic credit is the boundary: not every score is prohibited, but this one aggregates social life to decide who accesses services."
    },

    case_chatbot: {
      title: "The desk that always answers",
      scenario: "The city opens a digital desk: an automated assistant answers questions about grants, deadlines, requirements and documents. It is convenient, fast, always available. But some answers are wrong, no one warns that a machine is replying, and there is no easy way to reach a person. Some citizens lose opportunities over wrong information.",
      clues: [
        { title: "Public announcement", text: "The city advertises \"immediate, always up-to-date answers\". No mention of the system's limits." },
        { title: "Conversation log", text: "The log shows wrong answers about a grant's requirements and deadlines: the same mistakes repeated to several citizens." },
        { title: "Vendor note", text: "The manual keeps stating that \"the system is purely informational\" and does not replace the offices. On paper, a caveat." },
        { title: "Citizen complaint", text: "A person missed the application window: \"The desk told me there was still time.\" No channel to fix it in time." },
        { title: "Internal procedure", text: "The procedure provides no step to a human operator: no escalation, no review of critical answers." },
        { title: "Adoption decree", text: "The decree frames the desk as an efficiency service. A legitimate purpose, nothing odd in itself." }
      ],
      clueSources: ["pubblica", "log", "vendor", "reclamo", "interna", "amministrativa"],
      noteCorrect: "Investigative note: the desk should not be banned but made transparent and governed. Citizens must know they are talking to a machine, get correct information and be able to reach a person. It needs a clear notice, a human channel, answer audits and privacy-safe logging.",
      notePartial: "Investigative note: the direction is right, but half-done. Without transparency to the citizen and an effective human channel, the assistant remains a fragile source to rely on.",
      noteWrong: "Investigative note: the file stays open. The desk keeps answering, sometimes wrongly, and no one takes responsibility.",
      consequenceCorrect: "The desk states it is automated, flags its limits and offers human contact. Critical answers are reviewed and traced. Efficiency stays, but becomes reliable.",
      consequenceWrong: "The desk is extended to more services. Answers come ever faster. And more and more people act on information no one has checked.",
      motivations: [
        "It is a simple information service: if it errs, the responsibility lies with the citizen who trusted it.",
        "The automated assistant creates reliance: it needs transparency about being a machine, correct information, a human channel and traceability. Use-time responsibility stays with the body.",
        "It is only a technical problem: the vendor just needs to update the model."
      ],
      debriefQuestions: [
        "When does an automated assistant become a reliable source for the citizen?",
        "Why is transparency not enough here, and why is a human channel also needed?",
        "Who answers if the public chatbot gives wrong information: the vendor or the body?"
      ],
      epilogue: "The automated desk is not the problem: it becomes one when it hides being automated, errs, and leaves no human door to knock on."
    },

    case_procurement: {
      title: "The opaque tender",
      scenario: "A public body buys an AI system to process cases and priorities. The tender is closed quickly: a generic specification, no technical documentation, unclear criteria. When the office asks for access to how the system works, the vendor refuses. \"It is certified,\" they say. But no one inside the body can explain or check its decisions.",
      clues: [
        { title: "Tender specification", text: "The specification describes the service in general terms: no requirement for documentation, audit or human oversight of the AI system." },
        { title: "Vendor offer", text: "The offer is full of claims: \"certified, compliant, secure solution\". No technical evidence attached." },
        { title: "Internal minutes", text: "Minutes from the technical office admit: \"we have neither the technical documentation nor criteria to verify the system\"." },
        { title: "Contract clause", text: "A clause limits liability and access, with ambiguous wording on ownership and know-how. Hard to say who can check what." },
        { title: "Access denied", text: "The request to access the system's workings and logs is rejected by the vendor as \"confidential information\"." },
        { title: "Procurement officer's note", text: "The responsible officer flags the risk: \"if the system errs, we could not show why, nor correct it\"." }
      ],
      clueSources: ["amministrativa", "vendor", "interna", "amministrativa", "tecnica", "amministrativa"],
      noteCorrect: "Investigative note: \"the vendor is certified\" is not enough. A system that informs public decisions is high-risk: it needs technical documentation, ex-ante verification criteria, access and audit rights, human oversight and clear contractual responsibilities. A public body cannot buy a system it can neither explain nor control.",
      notePartial: "Investigative note: the problem is only half-grasped. Without documentation and access/audit rights, governance stays on paper and the body does not really control the system.",
      noteWrong: "Investigative note: the file stays open. The system decides, the body does not know how, and the vendor holds the key.",
      consequenceCorrect: "The supply is renegotiated: technical documentation, audit and access rights, human oversight and defined responsibilities. The body can again explain and control what it bought.",
      consequenceWrong: "The system goes live as is. It works, until it errs. And when it errs, no one inside the body can open it, explain it or stop it.",
      motivations: [
        "Opaque purchase of a high-risk system: documentation, verification criteria, access/audit rights and responsibilities are missing. Accountability stays with the body that deploys it.",
        "The tender is in order: if the product is certified, the body need ask nothing more.",
        "It is a transparency issue toward citizens: just publish the tender documents."
      ],
      debriefQuestions: [
        "What must a public body ask before buying an AI system?",
        "Why is \"the vendor is certified\" not enough to guarantee governance and accountability?",
        "Which clauses avoid lock-in and keep the body able to control the system?"
      ],
      epilogue: "Procurement is where governance is won or lost: whoever does not ask for documentation and control first will not get them later."
    },

    case_edtech: {
      title: "The profiled classroom",
      scenario: "An adaptive learning platform profiles students: it assigns a \"risk-of-failure score\", suggests paths, flags who to watch. It starts as support. But teachers begin to follow the dashboard more than their own judgement: those marked \"at risk\" get fewer opportunities. Families do not know how it works, and cannot challenge it.",
      clues: [
        { title: "Risk dashboard", text: "A dashboard gives each student a risk-of-failure score and steers choices on groups, paths and support priorities." },
        { title: "Message to families", text: "The school presents the platform as a \"neutral, objective tool\" to personalise teaching. No detail on the criteria." },
        { title: "Algorithm description", text: "The technical sheet states the model uses grades, attendance, lateness, behaviour and platform-usage data." },
        { title: "A teacher's note", text: "A teacher writes: \"we follow the score to decide who to support; there is no time to review case by case\". Human control exists on paper." },
        { title: "A family's complaint", text: "A family objects: the student was excluded from a project because \"at risk\". No explanation, no way to have the decision reviewed." },
        { title: "Data policy", text: "The policy is incomplete: it does not clarify minimisation, retention and access. Hard to say which data is really needed." }
      ],
      clueSources: ["tecnica", "pubblica", "tecnica", "interna", "reclamo", "amministrativa"],
      noteCorrect: "Investigative note: not every learning platform is banned, but this one affects students' opportunities and paths: it is high-risk. It needs effective human oversight (not blindly following the score), data minimisation, explainability toward teachers and families, and a way to challenge.",
      notePartial: "Investigative note: the classification holds, the measure does not. Without human control that can truly depart from the score, and without explainability, the platform steers decisions instead of the teachers.",
      noteWrong: "Investigative note: the file stays open. The score keeps deciding who gets one more chance and who gets one fewer.",
      consequenceCorrect: "The platform goes back to support, not verdict: teachers can depart from it and must give reasons, families get explanations and can challenge, data collected is reduced to what is needed.",
      consequenceWrong: "The risk score spreads to guidance and scholarships. The school is more \"efficient\". Some students stay marked, without knowing why.",
      motivations: [
        "It is just a neutral teaching support: flagging a risk only helps teachers.",
        "The problem is communication: just explain better to families how it works.",
        "The platform affects educational opportunities: it is high-risk and needs effective human oversight, data minimisation, explainability and a way to challenge. The school that uses it answers."
      ],
      debriefQuestions: [
        "When does a teaching recommendation become a decision that matters for the student?",
        "What separates support for the teacher from automation that decides in their place?",
        "How do you make an educational score challengeable and explainable to students and families?"
      ],
      epilogue: "The profiled classroom teaches the boundary: AI can support teaching, not replace human judgement about young people's opportunities."
    },

    case_gpai: {
      title: "The do-it-all model",
      scenario: "An organisation integrates a general-purpose generative model into internal workflows: it summarises documents, drafts decisions, classifies requests, suggests answers to staff. Handy and versatile. But some start using it to decide, not just to draft. Outputs go unchecked, prompts are ungoverned, and a hallucination ends up in an official act.",
      clues: [
        { title: "Company usage policy", text: "A generic policy authorises using the generative model \"to support work\". No limits on decision-making uses." },
        { title: "Wrong output", text: "A generated draft contains an invented legal reference. The text ended up almost unchanged in an official communication." },
        { title: "Internal email", text: "An email invites colleagues to \"let the model write the decision drafts, it's faster\": the generator enters the merits of choices." },
        { title: "DPO note", text: "The data protection officer flags risks on data entered in prompts, output verification and traceability of decisions." },
        { title: "Prompt log", text: "The log shows free prompts, with data and decision requests, without criteria, controls or documented human review." },
        { title: "Vendor document", text: "The vendor sheet is generic: \"versatile model for many tasks\". No indication of uses to avoid." }
      ],
      clueSources: ["amministrativa", "log", "interna", "interna", "log", "vendor"],
      noteCorrect: "Investigative note: the general model is not banned in itself, nor automatically high-risk. The risk comes from concrete use: here it enters relevant decisions without checks. It needs effective human review, traceability, a usage policy with clear boundaries, control of the data entered and disclaimers to users. The organisation that deploys it answers.",
      notePartial: "Investigative note: the risk is half-grasped. Without effective output verification and prompt governance, the model keeps influencing decisions no one controls.",
      noteWrong: "Investigative note: the file stays open. The model writes, someone signs, and no one checks.",
      consequenceCorrect: "The model's use is governed: clear boundaries between drafting and deciding, effective human review, traceability of prompts and outputs, control of the data entered. It stays useful, it stops deciding on its own.",
      consequenceWrong: "The do-it-all model spreads to more processes. Productivity rises. And every now and then a decision rests on something the model simply invented.",
      motivations: [
        "A general model is just a tool: internal use needs no particular rules.",
        "The general model is neither banned nor automatically high-risk, but here it is used in relevant decisions without control: it needs use governance (effective human review, traceability, limits, allowed data). The deployer answers.",
        "A disclaimer reminding that answers must be checked is enough."
      ],
      debriefQuestions: [
        "Who answers if a general model is used in a concrete decision process?",
        "What changes between using the model to draft and using it to decide?",
        "What safeguards are needed when a GPAI enters a body's decision workflow?"
      ],
      epilogue: "The do-it-all model is not the problem: it becomes one when it moves, unchecked, from drafting to deciding."
    }
  },

  norms: {
    norm_social_scoring: {
      title: 'Prohibition of social scoring',
      reference: 'AI Act — art. 5 (prohibited practices)',
      explanation:
        'The use of AI systems that evaluate or classify people based on social ' +
        'behaviour or personal characteristics is prohibited when the score leads ' +
        'to detrimental treatment in contexts unrelated to where the data was ' +
        'collected, or treatment that is otherwise unjustified or disproportionate.',
      democraticFunction:
        'Some uses of AI should not be mitigated: they should be banned, because ' +
        'they are incompatible with dignity, equality and individual freedom.',
      notMeaning: 'This does not mean that every ranking or priority system is banned: the problem is the disproportionate or irrelevant use of social and reputational data in unrelated contexts.',
      tags: ['prohibition', 'scoring', 'public services']
    },
    norm_lavoro_alto_rischio: {
      title: 'High-risk systems at work',
      reference: 'AI Act — Annex III (employment and workers management)',
      explanation:
        'AI systems used for recruitment, selection, evaluation and management ' +
        'of workers are classified as high-risk: they require risk management, ' +
        'data quality, effective human oversight, logging and information to the ' +
        'people concerned.',
      democraticFunction:
        'Access to work cannot depend on opaque classifications that prevent ' +
        'understanding, mobility and appeal.',
      notMeaning: 'This does not mean that every digital HR tool is banned: systems that select, evaluate or manage people require strong safeguards.',
      tags: ['high risk', 'work', 'oversight']
    },
    norm_trasparenza_sintetici: {
      title: 'Transparency for synthetic content',
      reference: 'AI Act — art. 50 (transparency obligations)',
      explanation:
        'Two distinct obligations: (1) people interacting with an AI system must ' +
        'be informed they are interacting with a machine; (2) artificially ' +
        'generated or manipulated content (including deepfakes) must be made ' +
        'recognizable as such by those who create or disseminate it. ' +
        'Educational note: transparency obligations can cumulate with other risk ' +
        'categories; they are presented here as a standalone category for ' +
        'educational purposes only.',
      democraticFunction:
        'Transparency protects the ability to distinguish public communication, ' +
        'manipulation and synthetic content.',
      notMeaning: 'This does not mean that every AI-generated content is unlawful: in certain cases, however, it must be recognizable as synthetic or manipulated.',
      tags: ['transparency', 'deepfake', 'information']
    },
    norm_emotion_recognition: {
      title: 'Ban on emotion recognition at school and work',
      reference: 'AI Act — art. 5 (prohibited practices, save exceptions)',
      explanation:
        'Using AI systems to infer people\'s emotions in workplaces and ' +
        'educational institutions is prohibited, save for limited exceptions ' +
        '(e.g. medical or safety reasons) provided by the regulation.',
      democraticFunction:
        'Educational and working environments must not become spaces of ' +
        'permanent emotional surveillance.',
      notMeaning: 'This does not mean that every observation of behaviour is banned: the problem is the automatic inference of emotions at school or work, save for the exceptions provided.',
      tags: ['prohibition', 'emotions', 'school', 'work']
    },
    norm_alto_rischio_obblighi: {
      title: 'Obligations for high-risk systems',
      reference: 'AI Act — obligations for high-risk systems',
      explanation:
        'High-risk systems must meet requirements on: risk management, data ' +
        'quality, technical documentation, logging, transparency, human ' +
        'oversight, accuracy, robustness and cybersecurity — including after ' +
        'deployment (post-market monitoring).',
      democraticFunction:
        'An automated system that affects people\'s lives must be verifiable ' +
        'also in its effects on vulnerable groups.',
      notMeaning: 'This does not mean that AI in healthcare is banned: systems affecting health, safety or rights must be governed, documented and supervised.',
      tags: ['high risk', 'audit', 'data', 'healthcare']
    },
    norm_biometria: {
      title: 'Remote biometric identification',
      reference: 'AI Act — art. 5 and specific provisions on biometrics',
      explanation:
        'The art. 5 prohibition concerns "real-time" remote biometric ' +
        'identification in publicly accessible spaces when used for ' +
        'law-enforcement purposes, save for exhaustively listed exceptions ' +
        'subject to very restrictive conditions and authorizations. Other ' +
        'biometric uses may fall under different regimes — including high-risk ' +
        'systems — depending on the context of use and the purpose.',
      democraticFunction:
        'Public space cannot become a zone of permanent automatic identification.',
      notMeaning: 'This does not mean that every biometric use is banned: the regime depends on purpose, context, the party deploying the system and the conditions set by the regulation.',
      tags: ['prohibition', 'biometrics', 'public space']
    },
    norm_credito: {
      title: "Social scores and access to services",
      reference: "AI Act — art. 5 (prohibited practices, social scoring); cf. Annex III",
      explanation: "A score that aggregates social behaviour and personal characteristics and produces detrimental treatment in unrelated contexts, or disproportionate and unjustified treatment, falls under the social-scoring ban (art. 5). A system assessing access to essential benefits or services, without prohibited social generalization, may instead be high-risk (Annex III): purpose, data used, context and effects on rights are decisive.",
      notMeaning: "This does not mean that every scoring system is prohibited: the regime depends on purpose, data used, context of use, effects on rights, and effective human oversight.",
      democraticFunction: "Access to essential services cannot depend on a computed, unappealable social reputation.",
      tags: ["prohibition", "scoring", "welfare", "services"]
    },
    norm_chatbot: {
      title: "Automated assistants and transparency to the citizen",
      reference: "AI Act — art. 50 (transparency obligations); cf. deployer obligations",
      explanation: "Anyone interacting with an AI system must know they are talking to a machine (art. 50). For a public assistant transparency is the minimum: correct information, effective human oversight, the ability to reach a person and traceability also matter. Use-time responsibility stays with the deployer; it is not offloaded onto the vendor.",
      notMeaning: "This does not mean that every public chatbot is banned: they must be made transparent, supervised and paired with a human channel, especially when they affect rights or opportunities.",
      democraticFunction: "Citizens have the right to know when public information comes from a machine and to be able to talk to a person.",
      tags: ["transparency", "chatbot", "public services", "deployer"]
    },
    norm_procurement: {
      title: "Public procurement of AI systems",
      reference: "AI Act — obligations for high-risk systems (governance and documentation)",
      explanation: "When a public body buys an AI system affecting relevant decisions, high-risk obligations are not bought with a certificate: they require technical documentation, ex-ante verification criteria, access and audit rights, human oversight and clear contractual responsibilities. Accountability stays with the body deploying the system.",
      notMeaning: "This does not mean that buying AI is unlawful: it means documentation, governance and verifiable responsibilities are needed before and after the purchase.",
      democraticFunction: "Public spending on AI must stay explainable and controllable: a body cannot use what it cannot open.",
      tags: ["high risk", "procurement", "governance", "documentation"]
    },
    norm_edtech: {
      title: "Learning platforms and relevant decisions",
      reference: "AI Act — Annex III (education and vocational training)",
      explanation: "AI systems used in education to assess, guide or decide access to paths and opportunities are high-risk. They require effective human oversight, data quality and minimisation, explainability toward teachers, students and families, and a way to challenge. A teaching support must not become an automated verdict.",
      notMeaning: "This does not mean that every learning platform is banned: the regime depends on the effect on students' opportunities and on the presence of effective human control.",
      democraticFunction: "Educational opportunities cannot depend on an opaque score that teachers follow and families cannot challenge.",
      tags: ["high risk", "education", "human oversight", "explainability"]
    },
    norm_gpai: {
      title: "General-purpose models (GPAI) and downstream use",
      reference: "AI Act — provisions on general-purpose AI (GPAI) and deployer obligations",
      explanation: "A general-purpose generative model is not banned in itself, nor automatically high-risk: the risk depends on concrete use. When it enters relevant decisions it needs effective human review, traceability, a usage policy with clear boundaries, control of the data entered and transparency to users. The model's obligations (on the provider side) add to the deployer's use-time responsibility.",
      notMeaning: "This does not mean that using a general model is banned, nor that it is always high-risk: what matters is how and where it is used, and with what safeguards.",
      democraticFunction: "A model that drafts decisions must stay verifiable: no act may rest on an unchecked output.",
      tags: ["GPAI", "generative model", "downstream use", "deployer"]
    }
  },

  endings: {
    ending_opaca: {
      title: 'ENDING 1 — OPAQUE CITY',
      text:
        'The city is efficient, but citizens can no longer understand, appeal or ' +
        'correct automated decisions. The queues flow, the scores update, the ' +
        'notifications arrive on time. Nobody signs anything anymore. Nobody ' +
        'answers for anything anymore.'
    },
    ending_fragile: {
      title: 'ENDING 2 — FRAGILE GOVERNANCE',
      text:
        'Some safeguards were introduced, but the city remains vulnerable to ' +
        'opacity, discrimination and unaccountable automation. The rules exist ' +
        'in patches: where the inspectorate has passed, the systems answer; ' +
        'elsewhere, they still decide on their own.'
    },
    ending_governata: {
      title: 'ENDING 3 — GOVERNED INNOVATION',
      text:
        'AI is not blocked, but made visible, documentable, appealable and ' +
        'supervisable. The city is still automated — but every system has ' +
        'someone responsible, a register and a door to knock on.'
    },
    finalMessage:
      'The AI Act does not eliminate risk. It makes risk visible, documentable, ' +
      'contestable and governable.'
  },

  // Per-case learning cards (v0.5). Shown in the teacher debrief; they do not
  // change the case solutions. One card per playable case.
  caseLearning: {
    case_scoring: {
      teaches: 'Some uses of AI are not mitigated but banned. Social scoring hits dignity and equality.',
      typicalMistake: 'Treating a ban as a high-risk system to be governed with audits and oversight.',
      discussionQuestion: 'Why are some practices banned rather than simply regulated?',
      aiActConcepts: ['prohibited practice (art. 5)', 'social scoring', 'dignity and equality'],
      understandingSignal: 'The player recognises the ban and orders a block, not an audit.',
      classroomUse: "Open a discussion on the AI Act's non-negotiable thresholds.",
      estimatedDebriefMinutes: 8
    },
    case_lavoro: {
      teaches: 'Systems that select and assess workers are high-risk: they require effective safeguards.',
      typicalMistake: 'Settling for token human oversight or for notifying the person alone.',
      discussionQuestion: 'Which obligations make a high-risk system at work governable?',
      aiActConcepts: ['high risk (Annex III)', 'data quality', 'human oversight', 'logging'],
      understandingSignal: 'The player orders audit, oversight and logging instead of blocking or ignoring.',
      classroomUse: 'Connect the case to real recruiting and workforce management.',
      estimatedDebriefMinutes: 10
    },
    case_media: {
      teaches: 'Transparency about synthetic content is necessary, but not always sufficient.',
      typicalMistake: 'Believing that labelling content solves every manipulation problem.',
      discussionQuestion: 'When is informing the user necessary but not enough?',
      aiActConcepts: ['transparency (art. 50)', 'deepfake', 'synthetic content'],
      understandingSignal: 'The player orders labelling and explains why it protects public trust.',
      classroomUse: 'Discuss institutional communication and disinformation.',
      estimatedDebriefMinutes: 8
    },
    case_scuola: {
      teaches: 'Inferring emotions at school is banned, save for narrow exceptions: the classroom is not a space for emotional surveillance.',
      typicalMistake: 'Treating emotion recognition as a system to audit rather than to ban.',
      discussionQuestion: 'Why does the educational context receive special protection?',
      aiActConcepts: ['prohibited practice (art. 5)', 'emotion recognition', 'educational context'],
      understandingSignal: 'The player distinguishes lawful observation from automated emotion inference.',
      classroomUse: 'Reflect on surveillance and wellbeing at school.',
      estimatedDebriefMinutes: 8
    },
    case_ospedale: {
      teaches: 'AI in healthcare is not banned: it must be governed, documented and supervised, above all for vulnerable groups.',
      typicalMistake: 'Trusting the excellent average and ignoring errors concentrated on subgroups.',
      discussionQuestion: 'How do you govern a predictive system without blocking it or surrendering to it?',
      aiActConcepts: ['high risk', 'data quality', 'human oversight', 'post-market monitoring'],
      understandingSignal: 'The player does not shut everything down: orders audit, logging and effective oversight.',
      classroomUse: 'Discuss clinical bias and the healthcare deployer responsibility.',
      estimatedDebriefMinutes: 10
    },
    case_biometria: {
      teaches: 'Real-time remote biometric identification in public spaces for law-enforcement purposes is banned, save for strictly listed exceptions.',
      typicalMistake: 'Assuming every biometric use is the same, ignoring purpose and context.',
      discussionQuestion: 'Where is the line between security and mass surveillance?',
      aiActConcepts: ['prohibited practice (art. 5)', 'remote biometrics', 'public space', 'law-enforcement purpose'],
      understandingSignal: 'The player identifies the ban perimeter: real time, public space, law enforcement.',
      classroomUse: 'Discuss video surveillance and freedom in public spaces.',
      estimatedDebriefMinutes: 9
    },
    case_credito: {
      teaches: 'Not every score is banned: purpose, data, context, effects and effective human control are what matter.',
      typicalMistake: "Believing that the 'decision support' label is enough to make the system safe.",
      discussionQuestion: 'When does an assessment system become prohibited detrimental treatment?',
      aiActConcepts: ['social scoring (art. 5)', 'high risk (Annex III)', 'human oversight', 'deployer responsibility'],
      understandingSignal: 'The player distinguishes prohibited social scoring from high-risk assessment.',
      classroomUse: 'Credit/welfare boundary: mirror case to close the advanced path.',
      estimatedDebriefMinutes: 12
    },
    case_chatbot: {
      teaches: "A public assistant should not be banned but made transparent and paired with a human channel: what matters is the citizen's reliance.",
      typicalMistake: "Thinking that the \"purely informational\" label is enough to offload responsibility onto the citizen or the vendor.",
      discussionQuestion: "When does an automated assistant become a reliable source for the citizen?",
      aiActConcepts: ["transparency (art. 50)", "human oversight", "deployer responsibility", "public chatbot"],
      understandingSignal: "The player orders transparency and a human channel instead of banning or trusting blindly.",
      classroomUse: "Discuss digital public services, reliance and the right to a human answer.",
      estimatedDebriefMinutes: 9
    },
    case_procurement: {
      teaches: "High-risk obligations are not bought with a certificate: documentation, governance and control rights are needed.",
      typicalMistake: "Settling for \"the vendor is certified\" and giving up documentation, audit and access.",
      discussionQuestion: "What must a public body ask before buying an AI system?",
      aiActConcepts: ["high risk", "procurement AI", "technical documentation", "accountability", "lock-in"],
      understandingSignal: "The player asks for documentation, audit/access rights and contractual responsibilities, not just a certificate.",
      classroomUse: "Connect AI governance and real public procurement, without entering procurement law.",
      estimatedDebriefMinutes: 11
    },
    case_edtech: {
      teaches: "Not every learning platform is banned, but if it affects opportunities and paths it is high-risk and needs effective human control.",
      typicalMistake: "Treating a student risk score as neutral and following it instead of the teacher's judgement.",
      discussionQuestion: "When does a teaching recommendation become a decision that matters for the student?",
      aiActConcepts: ["high risk (Annex III)", "education", "human oversight", "data minimisation", "explainability"],
      understandingSignal: "The player distinguishes teaching support from a relevant decision, and demands challengeability.",
      classroomUse: "Reflect on profiling, fairness and educational opportunities.",
      estimatedDebriefMinutes: 11
    },
    case_gpai: {
      teaches: "A general model is not automatically banned or high-risk: the risk depends on concrete use and must be governed downstream.",
      typicalMistake: "Believing a disclaimer is enough, or using the model to decide without verification or traceability.",
      discussionQuestion: "Who answers if a general model is used in a concrete decision process?",
      aiActConcepts: ["GPAI", "generative model", "downstream use", "effective human oversight", "data governance"],
      understandingSignal: "The player distinguishes drafting from deciding, and imposes use governance instead of banning or ignoring.",
      classroomUse: "Discuss adopting generative AI in companies/public bodies and deployer responsibility.",
      estimatedDebriefMinutes: 12
    }
  },

  // Operational glossary (v0.5). Short entries that help play and understand.
  // Case links are structural (src/game/data/glossary.ts).
  glossary: {
    title: 'OPERATIONAL GLOSSARY',
    subtitle: 'Short entries to play and understand. Not a treatise.',
    back: '◂ ARCHIVE',
    whyLabel: 'Why it matters',
    relatedLabel: 'Related cases',
    cautionLabel: 'Caution',
    prevButton: '◂ PREVIOUS',
    nextButton: 'NEXT ▸',
    counter: '{index}/{total}',
    entries: {
      prohibited_practice: {
        term: 'Prohibited practice',
        definition: 'A use of AI incompatible with fundamental rights, banned by art. 5 regardless of audits or safeguards.',
        whyItMatters: 'Some risks are not governed but stopped.',
        caution: 'It does not mean that all AI is banned: the ban targets specific uses.'
      },
      high_risk: {
        term: 'High risk',
        definition: 'A system affecting rights, safety or access to services: allowed but subject to strong obligations (Annex III).',
        whyItMatters: 'Risk must be governed, not denied.',
        caution: 'It does not mean banned: it means documented, supervised and verifiable.'
      },
      transparency: {
        term: 'Transparency',
        definition: 'The duty to make interaction with AI, or synthetic content, recognisable (art. 50).',
        whyItMatters: 'It lets people tell real from synthetic.',
        caution: 'It does not mean that a label alone removes the risk.'
      },
      challengeable: {
        term: 'Open to challenge',
        definition: 'A decision can be substantively correct yet fragile because it is poorly reasoned, based on weak evidence, or assigned to the wrong subject.',
        whyItMatters: 'It teaches that being right is not enough: the order must hold.',
        caution: 'It does not mean wrong: it means appealable.'
      },
      provider: {
        term: 'Provider',
        definition: 'Who develops or places the AI system on the market.',
        whyItMatters: 'It sets the system design obligations.',
        caution: 'It does not mean it answers for everything: the deployer has duties too.'
      },
      deployer: {
        term: 'Deployer',
        definition: 'Who uses the system under their own authority (e.g. a public body).',
        whyItMatters: 'Many use-time obligations land here.',
        caution: 'It does not mean it can offload everything onto the supplier.'
      },
      human_oversight: {
        term: 'Human oversight',
        definition: 'Effective human supervision over automated decisions, not merely formal.',
        whyItMatters: 'A human who always follows the machine is not oversight.',
        caution: 'It does not mean a token signature: it must be able to make a difference.'
      },
      social_scoring: {
        term: 'Social scoring',
        definition: 'A score that rates people on social behaviour and produces detrimental treatment in unrelated or disproportionate contexts: banned.',
        whyItMatters: 'It hits dignity and equality.',
        caution: 'It does not mean every ranking is banned.'
      },
      biometrics: {
        term: 'Biometrics',
        definition: 'Remote identification via biometric data; in real time for law enforcement in public spaces it is banned save for exceptions.',
        whyItMatters: 'Public space is not a zone of permanent identification.',
        caution: 'It does not mean every biometric use is banned: purpose and context matter.'
      },
      emotion_recognition: {
        term: 'Emotion recognition',
        definition: 'Automated inference of emotions; at school and at work it is banned save for narrow exceptions.',
        whyItMatters: 'It protects educational and workplace spaces from emotional surveillance.',
        caution: 'It does not mean that every observation of behaviour is banned.'
      },
      deepfake: {
        term: 'Deepfake',
        definition: 'Synthetic content imitating real people or events; it must be made recognisable (art. 50).',
        whyItMatters: 'It defends trust in information.',
        caution: 'It does not mean every AI-generated content is unlawful.'
      },
      credit_welfare: {
        term: 'Credit / welfare',
        definition: 'Assessments that decide access to benefits or services: they may be high risk or, if they generalise social life, prohibited social scoring.',
        whyItMatters: 'It is the boundary between lawful assessment and social scoring.',
        caution: 'It does not mean every economic score is banned.'
      },
      gpai: {
        term: 'GPAI — general-purpose AI',
        definition: 'General-purpose AI models with their own transparency and systemic-risk obligations. The risk for users depends on concrete downstream use.',
        whyItMatters: 'Increasingly central to the AI ecosystem.',
        caution: 'It does not mean every general model is high risk.'
      },
      public_chatbot: {
        term: 'Public chatbot',
        definition: "A body's automated assistant that informs citizens about services, requirements or deadlines.",
        whyItMatters: 'It creates reliance: it needs transparency and a human channel.',
        caution: 'It does not mean it is banned: it must be made transparent and supervised.'
      },
      human_escalation: {
        term: 'Human escalation',
        definition: 'An effective way to move from an automated system to a competent person.',
        whyItMatters: 'Without it, automation becomes a wall for the citizen.',
        caution: 'It does not mean redoing everything by hand: it means a human door when needed.'
      },
      procurement_ai: {
        term: 'Procurement AI',
        definition: 'Public purchase of AI systems: governance is already decided in the tender and the contract.',
        whyItMatters: 'Whoever does not ask for documentation and control first will not get them later.',
        caution: 'It does not mean buying AI is unlawful: it must be done with safeguards.'
      },
      technical_documentation: {
        term: 'Technical documentation',
        definition: 'The information describing the system, its data, limits and controls, enabling its verification.',
        whyItMatters: 'Without documentation a decision cannot be explained or challenged.',
        caution: 'It does not mean a pile of paper: it makes the system verifiable.'
      },
      lock_in: {
        term: 'Lock-in',
        definition: 'Dependence on a vendor that makes it hard to switch systems, access data or control how it works.',
        whyItMatters: "It reduces the body's ability to govern and correct.",
        caution: 'It does not mean every supply creates lock-in: it depends on clauses and access rights.'
      },
      adaptive_edtech: {
        term: 'Adaptive learning platform',
        definition: 'A system that profiles students and adapts paths, suggestions or teaching priorities.',
        whyItMatters: 'If it affects opportunities or assessment, it becomes high-risk.',
        caution: 'It does not mean every EdTech is banned: what matters is whether it decides or only supports.'
      },
      generative_model: {
        term: 'Generative model',
        definition: 'A system that produces text or content on request; it can err or "hallucinate".',
        whyItMatters: 'Used to decide without verification, it brings errors into official acts.',
        caution: 'It does not mean it is always unreliable: it must be verified and governed in use.'
      },
      data_governance: {
        term: 'Data governance',
        definition: 'Rules on which data is used, how it is kept, who accesses it and why — including minimisation and traceability.',
        whyItMatters: 'It keeps data proportionate to the purpose and systems verifiable.',
        caution: 'It does not mean collecting everything "just in case": it means using only what is needed.'
      }
    }
  }
};

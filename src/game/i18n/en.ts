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
    evidence: {
      header: 'CASE FILE {code} — EXHIBITS',
      instruction: 'Examine every exhibit, then cite the ones grounding the classification (at least 2).',
      exhibit: 'EXHIBIT {num}',
      sealed: '[ SEALED ]\n\nclick to examine',
      cite: 'CITE IN REPORT ▢',
      cited: 'CITED IN REPORT ▣',
      allRevealedToast: 'Exhibits examined. Cite at least 2 exhibits to proceed.',
      proceedButton: 'PROCEED TO CLASSIFICATION ▸',
      backToEvidence: '◂ EXHIBITS'
    },
    decision: {
      step1: 'DECISION 1 OF 2 — CLASSIFICATION',
      step2: 'DECISION 2 OF 2 — CORRECTIVE MEASURE',
      question1: 'How does this system qualify under the AI Act?',
      question2: 'Which measure does the inspectorate order?',
      contextNote:
        'Under the regulation, risk does not depend on the technology alone, but on the context of use, the purpose and the effects on people.',
      recorded: 'Classification recorded: {value}',
      keys5: 'keyboard: keys 1–5 to select',
      keys7: 'keyboard: keys 1–7 to select'
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
      credits: 'CREDITS'
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
    sorveglianza: 'Urban Surveillance Center'
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
        'the flagged families silently disappear from the queues.'
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
        '81%. Nobody notices: there is no log at all.'
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
        'by half the population. It was true.'
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
        'The dashboard reports: "emotional climate: optimal".'
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
        'altogether: they have learned the system does not see them.'
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
        'records it as an "improvement in public order".'
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
      tags: ['prohibition', 'biometrics', 'public space']
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
  }
};

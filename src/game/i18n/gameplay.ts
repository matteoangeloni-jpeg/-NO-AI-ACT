export const gameplayIt = {
  details: 'NORMA E RIFLESSIONE', overview: 'RILIEVO E PROVE',
  guide: 'GUIDA INDAGINE', close: 'TORNA AL FASCICOLO', skip: 'PROSEGUI SENZA GUIDA',
  guideTitle: 'PROTOCOLLO DEL PRIMO FASCICOLO',
  steps: [
    'Consulta: apri un reperto e leggi che cosa documenta, da quale fonte proviene e chi ne subisce gli effetti.',
    'Cita: seleziona di nuovo un reperto aperto per inserirlo nel rapporto. Aprire non equivale a citare. Puoi ritirare una citazione.',
    'Confronta: cita almeno due reperti e apri Confronta nella postazione. Cerca conferme o contraddizioni, non soltanto parole simili.',
    'Decidi: scegli classificazione, misura, responsabile e motivazione. Collega la motivazione ai fatti dei reperti citati.',
    'Firma: rileggi la bozza. Puoi tornare indietro prima di firmare; dopo la firma riceverai rilievi e conseguenze.'
  ],
  evaluation: 'La valutazione considera classificazione, misura, responsabile, motivazione e prove. Un esito corretto non basta se il ragionamento o i reperti non lo sostengono.',
  evidenceLink: 'Verifica che le prove citate sostengano la motivazione scelta. Il confronto resta disponibile nella postazione.',
  changes: 'EFFETTI DEL RAPPORTO', before: 'Prima', after: 'Dopo', delta: 'Variazione',
  review: 'RIPASSA GLI ERRORI', exitReview: 'TORNA ALLA PROGRESSIONE',
  reviewNote: 'Ripasso temporaneo dei casi parziali o errati. Rapporti e progressione originali restano conservati; chiudendo il browser torni alla partita originale.',
  reviewEmpty: 'Nessun caso parziale o errato da ripassare.',
  assistance: { base: 'Aiuti: suggerimenti contestuali e rilievi dettagliati.', standard: 'Aiuti: rilievi dopo la firma; nessun suggerimento mirato.', expert: 'Aiuti: nessun suggerimento mirato, rilievi essenziali.' },
  modes: {
    turno: 'Indaga i fascicoli assegnati, in sequenza. Il turno termina quando chiudi quelli del piano.',
    libera: 'Scegli i fascicoli dalla mappa. I consigli non sono vincoli: decidi tu quando concludere dalla mappa.',
    sorpresa: 'Affronta fascicoli estratti in ordine, con difficoltà esperto iniziale. Concludi chiudendo il piano.',
    ripasso: 'Riesamina i casi parziali o errati del piano. Il ripasso termina al loro completamento, senza sostituire gli originali.'
  },
  timeNote: 'La durata è una stima, non un conto alla rovescia. La difficoltà resta modificabile nelle impostazioni.'
};

export const gameplayEn: typeof gameplayIt = {
  details: 'RULE AND REFLECTION', overview: 'FINDING AND EVIDENCE',
  guide: 'INVESTIGATION GUIDE', close: 'BACK TO THE FILE', skip: 'CONTINUE WITHOUT GUIDE',
  guideTitle: 'FIRST FILE PROTOCOL',
  steps: [
    'Inspect: open an exhibit and read what it documents, who supplied it and who is affected.',
    'Cite: select an opened exhibit again to include it in the report. Opening is not citing. You can withdraw a citation.',
    'Compare: cite at least two exhibits and open Compare at the desk. Look for corroboration or contradictions, not just matching words.',
    'Decide: choose the classification, measure, responsible actor and rationale. Connect your rationale to the facts in your cited exhibits.',
    'Sign: review the draft. You can go back before signing; findings and consequences follow the signature.'
  ],
  evaluation: 'Assessment considers classification, measure, responsible actor, rationale and evidence. A correct outcome is not enough if the reasoning or exhibits do not support it.',
  evidenceLink: 'Check that your cited evidence supports the selected rationale. Comparison remains available at the desk.',
  changes: 'REPORT EFFECTS', before: 'Before', after: 'After', delta: 'Change',
  review: 'REVIEW ERRORS', exitReview: 'RETURN TO PROGRESS',
  reviewNote: 'Temporary review of partial or incorrect cases. Original reports and progress are preserved; closing the browser returns you to the original game.',
  reviewEmpty: 'No partial or incorrect cases to review.',
  assistance: { base: 'Support: contextual hints and detailed findings.', standard: 'Support: findings after signing; no targeted hints.', expert: 'Support: no targeted hints, essential findings.' },
  modes: {
    turno: 'Investigate assigned files in sequence. The shift ends when you close the files in the plan.',
    libera: 'Choose files on the map. Recommendations are not restrictions: decide when to finish from the map.',
    sorpresa: 'Investigate randomly ordered files, initially at expert difficulty. Finish by closing the plan.',
    ripasso: 'Revisit partial or incorrect cases in the plan. Review ends after completing them without replacing the originals.'
  },
  timeNote: 'Duration is an estimate, not a countdown. Difficulty can still be changed in settings.'
};

export const gameplayFr: typeof gameplayIt = {
  details: 'NORME ET RÉFLEXION', overview: 'CONSTAT ET PREUVES',
  guide: "GUIDE D'ENQUÊTE", close: 'REVENIR AU DOSSIER', skip: 'POURSUIVRE SANS GUIDE',
  guideTitle: 'PROTOCOLE DU PREMIER DOSSIER',
  steps: [
    "Consultez : ouvrez une pièce et lisez ce qu'elle documente, sa source et les personnes touchées.",
    "Citez : sélectionnez de nouveau une pièce ouverte pour l'inclure au rapport. Ouvrir ne signifie pas citer. Une citation peut être retirée.",
    'Comparez : citez au moins deux pièces, puis ouvrez Comparer au poste. Cherchez des confirmations ou contradictions, pas seulement des mots semblables.',
    'Décidez : choisissez classification, mesure, responsable et motivation. Reliez la motivation aux faits des pièces citées.',
    'Signez : relisez le brouillon. Vous pouvez revenir en arrière avant de signer ; constats et conséquences suivent la signature.'
  ],
  evaluation: "L'évaluation porte sur classification, mesure, responsable, motivation et preuves. Une conclusion correcte ne suffit pas si le raisonnement ou les pièces ne la soutiennent pas.",
  evidenceLink: 'Vérifiez que les preuves citées soutiennent la motivation choisie. La comparaison reste disponible au poste.',
  changes: 'EFFETS DU RAPPORT', before: 'Avant', after: 'Après', delta: 'Variation',
  review: 'REVOIR LES ERREURS', exitReview: 'REVENIR À LA PROGRESSION',
  reviewNote: 'Révision temporaire des cas partiels ou incorrects. Rapports et progression originaux sont conservés ; fermer le navigateur ramène à la partie originale.',
  reviewEmpty: 'Aucun cas partiel ou incorrect à revoir.',
  assistance: { base: 'Aides : indices contextuels et constats détaillés.', standard: 'Aides : constats après signature ; aucun indice ciblé.', expert: 'Aides : aucun indice ciblé, constats essentiels.' },
  modes: {
    turno: "Enquêtez sur les dossiers attribués, dans l'ordre. Le service se termine après leur clôture.",
    libera: 'Choisissez les dossiers sur la carte. Les conseils ne sont pas des contraintes : terminez depuis la carte quand vous le souhaitez.',
    sorpresa: "Examinez les dossiers tirés au sort, au niveau expert initial. Terminez en clôturant le programme.",
    ripasso: 'Reprenez les cas partiels ou incorrects du programme. La révision se termine après leur clôture, sans remplacer les originaux.'
  },
  timeNote: "La durée est une estimation, pas un compte à rebours. La difficulté reste modifiable dans les paramètres."
};

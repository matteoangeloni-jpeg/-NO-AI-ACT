import type { CaseData, Classification, LocationData, Measure } from './types';

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  vietata: 'Pratica vietata',
  alto_rischio: 'Sistema ad alto rischio',
  trasparenza: 'Obbligo di trasparenza',
  basso_rischio: 'Basso rischio',
  non_rilevante: "Non rilevante per l'AI Act"
};

export const MEASURE_LABELS: Record<Measure, string> = {
  blocco: 'Bloccare il sistema',
  oversight: 'Introdurre human oversight',
  audit: 'Attivare audit e gestione del rischio',
  informare: 'Informare gli utenti',
  etichettare: 'Etichettare i contenuti generati da IA',
  dati_logging: 'Migliorare qualità dei dati e logging',
  nessuna: 'Nessuna misura'
};

export const LOCATIONS: LocationData[] = [
  { id: 'municipio', name: 'Municipio Centrale', x: 0.46, y: 0.36, iconKey: 'icon_townhall', caseId: 'case_scoring' },
  { id: 'lavoro', name: 'Agenzia del Lavoro', x: 0.22, y: 0.55, iconKey: 'icon_work', caseId: 'case_lavoro' },
  { id: 'media', name: 'Media Center Civico', x: 0.68, y: 0.24, iconKey: 'icon_media', caseId: 'case_media' },
  { id: 'scuola', name: 'Scuola delle Emozioni', x: 0.78, y: 0.58, iconKey: 'icon_school', caseId: 'case_scuola' },
  { id: 'ospedale', name: 'Ospedale Predittivo', x: 0.33, y: 0.78, iconKey: 'icon_hospital', caseId: 'case_ospedale' },
  { id: 'sorveglianza', name: 'Centro di Sorveglianza Urbana', x: 0.58, y: 0.74, iconKey: 'icon_eye', caseId: 'case_biometria' }
];

/**
 * Casi investigativi. I primi quattro sono giocabili nella vertical slice;
 * gli ultimi due sono visibili sulla mappa ma marcati come "in arrivo" (v0.2).
 * Contenuto giuridico: versione didattica semplificata dell'AI Act
 * (Regolamento UE 2024/1689). Non è consulenza legale.
 */
export const CASES: CaseData[] = [
  {
    id: 'case_scoring',
    locationId: 'municipio',
    locationName: 'Municipio Centrale',
    title: 'La città dei punteggi',
    fileCode: 'AX-031/2032',
    scenario:
      'Il Comune assegna a ogni cittadino un Indice di Affidabilità Civica. ' +
      'Il punteggio decide priorità di accesso a servizi, contributi, graduatorie ' +
      'e alloggi. Vengono penalizzati: proteste online, debiti pregressi, ' +
      '"frequentazioni a rischio" e comportamenti privi di ogni legame con il ' +
      'servizio richiesto. Tre famiglie hanno perso l\'alloggio popolare questa ' +
      'settimana. Nessuna ha capito perché.',
    clues: [
      {
        id: 'c1',
        title: 'Dati non pertinenti',
        text:
          'Il punteggio per l\'alloggio include cronologia social, multe stradali ' +
          'e contatti telefonici. Nulla di tutto questo riguarda il diritto alla casa.'
      },
      {
        id: 'c2',
        title: 'Penalità che migra',
        text:
          'Una protesta online del 2029 ha abbassato il punteggio sanitario, ' +
          'scolastico e abitativo di un cittadino. La penalizzazione si estende a ' +
          'contesti diversi da quello originario.'
      },
      {
        id: 'c3',
        title: 'Motivazione assente',
        text:
          'La notifica ufficiale recita: "Punteggio insufficiente. Codice E-77". ' +
          'Nessun cittadino ha mai ottenuto una motivazione comprensibile o un ' +
          'canale di contestazione.'
      }
    ],
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['audit', 'oversight'],
    normId: 'norm_social_scoring',
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
      'e verificabili. L\'ufficio reclami riapre: è lento, umano, contestabile.',
    consequenceWrong:
      'L\'Indice di Affidabilità Civica viene esteso ai trasporti e alle mense ' +
      'scolastiche. L\'efficienza amministrativa sale. Le richieste di alloggio ' +
      'delle famiglie segnalate scompaiono silenziosamente dalle code.',
    playable: true
  },
  {
    id: 'case_lavoro',
    locationId: 'lavoro',
    locationName: 'Agenzia del Lavoro',
    title: 'Il colloquio che non esiste',
    fileCode: 'AX-047/2032',
    scenario:
      'Le aziende della città filtrano i candidati con un sistema di IA che ' +
      'analizza CV, video-colloqui, tono di voce, micro-espressioni, pause e ' +
      'percorsi professionali. L\'esito arriva in 40 secondi: "Profilo non ' +
      'compatibile". Un ingegnere con dodici anni di esperienza è stato scartato ' +
      '217 volte. Nessun essere umano ha mai letto il suo curriculum.',
    clues: [
      {
        id: 'c1',
        title: 'Nessuna spiegazione',
        text:
          'La notifica è identica per tutti: "Profilo non compatibile". Nessuna ' +
          'spiegazione individuale significativa, nessun riferimento ai criteri usati.'
      },
      {
        id: 'c2',
        title: 'Percorsi non lineari puniti',
        text:
          'Il modello penalizza pause di carriera, congedi parentali e cambi di ' +
          'settore. Replica le discriminazioni dei dati storici di assunzione.'
      },
      {
        id: 'c3',
        title: 'Supervisione di facciata',
        text:
          'Un addetto "convalida" 1.400 esiti al giorno: 20 secondi a pratica. ' +
          'Il controllo umano esiste sulla carta, non nei fatti.'
      }
    ],
    correctClassification: 'alto_rischio',
    correctMeasures: ['audit', 'oversight', 'dati_logging'],
    partialMeasures: ['informare'],
    normId: 'norm_lavoro_alto_rischio',
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
      'L\'audit rivela bias contro percorsi non lineari. Il sistema viene ' +
      'ricalibrato, i recruiter tornano a leggere i casi limite, i candidati ' +
      'ricevono motivazioni e un canale di ricorso.',
    consequenceWrong:
      'Il filtro viene adottato anche dall\'ente pubblico per i tirocini. ' +
      'Il tasso di "incompatibilità" tra chi ha avuto pause di cura familiare ' +
      'raggiunge l\'81%. Nessuno se ne accorge: non esiste alcun log.',
    playable: true
  },
  {
    id: 'case_media',
    locationId: 'media',
    locationName: 'Media Center Civico',
    title: 'La città sintetica',
    fileCode: 'AX-052/2032',
    scenario:
      'Il Comune produce video, audio e comunicati generati con IA senza ' +
      'dichiararlo. Ieri sera un falso videomessaggio "istituzionale" ha annunciato ' +
      'la contaminazione dell\'acquedotto: panico, supermercati svuotati, tre ' +
      'feriti. La smentita ufficiale è arrivata dopo quattro ore. Era anch\'essa ' +
      'generata. Nessuno le ha creduto.',
    clues: [
      {
        id: 'c1',
        title: 'Nessuna etichetta',
        text:
          'I contenuti sintetici del Comune sono indistinguibili da quelli reali: ' +
          'nessuna etichetta, nessun watermark, nessuna dichiarazione di origine.'
      },
      {
        id: 'c2',
        title: 'Autenticità apparente',
        text:
          'Il falso messaggio usava il formato, la voce sintetica e la grafica ' +
          'ufficiale. La fonte istituzionale appare autentica anche quando il ' +
          'contenuto è manipolato.'
      },
      {
        id: 'c3',
        title: 'Fiducia non ricostruibile',
        text:
          'Sondaggio post-incidente: il 64% dei cittadini dichiara che non crederà ' +
          'più "a nessun comunicato, vero o falso". Le smentite non ricostruiscono ' +
          'la fiducia.'
      }
    ],
    correctClassification: 'trasparenza',
    correctMeasures: ['etichettare', 'informare'],
    partialMeasures: ['audit'],
    normId: 'norm_trasparenza_sintetici',
    noteCorrect:
      'Nota investigativa: il problema non è la generazione in sé, ma ' +
      'l\'impossibilità di distinguere. L\'etichettatura dei contenuti sintetici ' +
      'è la condizione minima della comunicazione pubblica.',
    notePartial:
      'Nota investigativa: senza etichette visibili sui contenuti generati, ' +
      'ogni altra misura lascia i cittadini nell\'indistinguibile.',
    noteWrong:
      'Nota investigativa: il fascicolo resta aperto. La città non sa più ' +
      'che cosa è reale.',
    consequenceCorrect:
      'Ogni contenuto generato o manipolato viene etichettato in modo visibile. ' +
      'I cittadini imparano a riconoscere l\'origine dei messaggi. La fiducia ' +
      'non torna subito, ma torna verificabile.',
    consequenceWrong:
      'Un secondo falso annuncio — stavolta su un\'evacuazione — viene ignorato ' +
      'da metà della popolazione. Era vero.',
    playable: true
  },
  {
    id: 'case_scuola',
    locationId: 'scuola',
    locationName: 'Scuola delle Emozioni',
    title: 'La classe osservata',
    fileCode: 'AX-063/2032',
    scenario:
      'Una rete scolastica usa webcam e IA in ogni aula per inferire stati ' +
      'emotivi e affettivi: stress, noia, aggressività e "predisposizione al ' +
      'fallimento". Gli studenti vengono smistati in gruppi di livello sulla ' +
      'base di queste inferenze. Una tredicenne è stata spostata ' +
      'nel "gruppo di contenimento" perché il sistema legge il suo volto come ' +
      '"ostile". È solo molto timida.',
    clues: [
      {
        id: 'c1',
        title: 'Emozioni inferite dal volto',
        text:
          'Il sistema deduce stati emotivi da volto e postura. La correlazione tra ' +
          'espressione e stato interno è scientificamente fragile e culturalmente ' +
          'variabile.'
      },
      {
        id: 'c2',
        title: 'Nessuna contestazione possibile',
        text:
          'Le classificazioni emotive non sono notificate né contestabili. ' +
          'Gli studenti scoprono il proprio "profilo" solo quando cambiano gruppo.'
      },
      {
        id: 'c3',
        title: 'Penalizzati i più fragili',
        text:
          'Studenti neurodivergenti e introversi finiscono sistematicamente nei ' +
          'gruppi "a rischio". Il sistema scambia la differenza per devianza.'
      }
    ],
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['oversight', 'audit'],
    normId: 'norm_emotion_recognition',
    noteCorrect:
      'Nota investigativa: l\'inferenza emotiva negli istituti educativi è una ' +
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
    playable: true
  },
  {
    id: 'case_ospedale',
    locationId: 'ospedale',
    locationName: 'Ospedale Predittivo',
    title: 'Triage invisibile',
    fileCode: 'AX-071/2032',
    scenario:
      'L\'ospedale assegna le priorità di triage con un modello predittivo ' +
      'addestrato su dati storici distorti: sottostima sistematicamente il ' +
      'rischio per alcune categorie di pazienti. Le performance aggregate ' +
      'sembrano eccellenti. I sottogruppi vulnerabili muoiono in attesa.',
    clues: [
      {
        id: 'c1',
        title: 'Medie eccellenti',
        text: 'Accuratezza aggregata: 94%. Nessuno ha mai disaggregato per sottogruppo.'
      },
      {
        id: 'c2',
        title: 'Errori concentrati',
        text:
          'Gli errori di sottostima si concentrano su anziani soli, pazienti con ' +
          'storia clinica frammentata e categorie poco rappresentate nei dati.'
      },
      {
        id: 'c3',
        title: 'Fiducia cieca',
        text:
          'Il personale segue il punteggio senza conoscerne i limiti. ' +
          '"Se il sistema dice verde, è verde."'
      }
    ],
    correctClassification: 'alto_rischio',
    correctMeasures: ['audit', 'dati_logging', 'oversight'],
    partialMeasures: ['informare'],
    normId: 'norm_alto_rischio_obblighi',
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
      'L\'audit per sottogruppi rivela la distorsione. Il modello viene ' +
      'riaddestrato, il personale formato a metterlo in discussione, ogni ' +
      'decisione tracciata e revisionabile.',
    consequenceWrong:
      'Il modello viene esteso a tre ospedali. Le statistiche aggregate ' +
      'migliorano ancora. Una classe di pazienti smette del tutto di presentarsi ' +
      'al pronto soccorso: ha imparato che il sistema non la vede.',
    playable: false
  },
  {
    id: 'case_biometria',
    locationId: 'sorveglianza',
    locationName: 'Centro di Sorveglianza Urbana',
    title: 'Volti nella folla',
    fileCode: 'AX-088/2032',
    scenario:
      'La rete di telecamere cittadina identifica in tempo reale "soggetti di ' +
      'interesse" negli spazi pubblici. I falsi positivi vengono fermati, ' +
      'schedati, a volte trattenuti. Alcuni quartieri hanno smesso di scendere ' +
      'in piazza.',
    clues: [
      {
        id: 'c1',
        title: 'Fermi inspiegati',
        text: 'Le persone vengono fermate senza sapere perché. "Il sistema l\'ha segnalata."'
      },
      {
        id: 'c2',
        title: 'Tempo reale, spazio pubblico',
        text: 'L\'identificazione biometrica opera in diretta su piazze, stazioni e cortei.'
      },
      {
        id: 'c3',
        title: 'Errori sproporzionati',
        text:
          'I falsi positivi colpiscono in modo sproporzionato alcune categorie ' +
          'di persone. Il tasso d\'errore non è mai stato pubblicato.'
      }
    ],
    correctClassification: 'vietata',
    correctMeasures: ['blocco'],
    partialMeasures: ['audit'],
    normId: 'norm_biometria',
    noteCorrect:
      'Nota investigativa: l\'uso generalizzato va bloccato. Eventuali eccezioni ' +
      'sono tassative e soggette a condizioni e autorizzazioni molto restrittive.',
    notePartial:
      'Nota investigativa: un audit non rende lecita un\'identificazione di ' +
      'massa permanente. L\'uso generalizzato andava fermato.',
    noteWrong:
      'Nota investigativa: il fascicolo resta aperto. La folla ha smesso di ' +
      'essere anonima.',
    consequenceCorrect:
      'L\'identificazione generalizzata viene spenta. I casi eccezionali passano ' +
      'per autorizzazioni specifiche e garanzie. Le piazze tornano a riempirsi.',
    consequenceWrong:
      'Il sistema viene potenziato. Le proteste calano del 70%. Il rapporto ' +
      'annuale lo registra come "miglioramento dell\'ordine pubblico".',
    playable: false
  }
];

export function getCase(id: string): CaseData {
  const c = CASES.find((x) => x.id === id);
  if (!c) throw new Error(`Caso sconosciuto: ${id}`);
  return c;
}

export const PLAYABLE_CASES = CASES.filter((c) => c.playable);
export const CASES_REQUIRED_FOR_FINALE = 4;

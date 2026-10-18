# Ricerca SEO nelle sei lingue

Data: 2026-10-18. 48 gruppi di intento, 96 espressioni
candidate, ciascuna collegata a una pagina esistente.

- [Italiano](it.md): Serious game e laboratorio di educazione civica: partire da casi, prove e discussione in classe, non da corsi di certificazione.
- [English](en.md): An investigative classroom game about the EU AI Act; evidence and debriefing distinguish it from coding tutorials and generic AI tools.
- [Français](fr.md): Jeu sérieux, analyse de preuves et EMI: distinguer la séquence pédagogique sur les décisions automatisées des outils générant les devoirs.
- [Deutsch](de.md): KI-Kompetenz, Unterrichtsmaterial und begründete Fallentscheidungen. EU AI Act und KI-Verordnung verbinden; keine Zertifizierung versprechen.
- [Español](es.md): Situaciones de aprendizaje y alfabetización crítica en IA: explicar el Reglamento con casos, sin presentarlo como formación homologada.
- [Português europeu](pt.md): Literacia em IA, pensamento crítico e cidadania digital. Manter vocabulário europeu e indicar as três línguas disponíveis no jogo.

[Tabella completa](keywords.csv). Questa ricerca approfondisce la precedente
lista di 24 opportunita; non significa che tutte le espressioni siano state
inserite nel sito o abbiano volumi/ranking misurati.

## Metodo e limiti

- Ricerche separate per lingua e confronto di fonti istituzionali, autori e
  risorse didattiche. Nessuna stima di autorita dei domini o promessa di battere
  i risultati istituzionali sulla keyword generica AI Act.
- Priorita alla nicchia: gioco investigativo, alfabetizzazione critica, attivita
  didattiche basate su casi e prove. Le guide giuridiche generiche sono secondarie.
- Search Console disponibile tramite API; riuso della cattura privata del
  18 ottobre, con dati finali fino al 15 ottobre. Non e un risultato post-rilascio.
- Nessun accesso utile ai volumi di Keyword Planner: nessun numero inventato,
  difficolta o CPC. Candidati editoriali ed evidenza osservata restano separati.
- Le differenze tra paesi non equivalgono alle lingue: inglese non significa
  solo Regno Unito; portoghese di questo sito significa pt-PT, non pt-BR.
- Il confronto di risorse concorrenti e adiacenti non implica accordi, citazioni
  ricevute, validazione pedagogica o efficacia superiore del nostro gioco.

## Ordine di esecuzione

1. Conservare il rilascio appena pubblicato e la sua baseline; non riscrivere
   titoli ogni giorno in assenza di nuove prove.
2. Migliorare prima i materiali di facilitazione piu brevi in DE/ES/PT, con
   obiettivi, un esercizio verificabile e discussione finale; mantenere distinte
   le guide sugli usi scolastici dell'IA.
3. Per IT/EN/FR partire dalle risorse esistenti: verificare percorsi verso lezioni,
   materiali e concetti richiesti; usare le query reali per scegliere approfondimenti.
4. Approfondire casi di rischio e trasparenza solo con revisione delle condizioni
   normative e fonti aggiornate, non con duplicati di keyword.
5. Valutare la scoperta e gli URL canonici dopo la scansione di Google; confrontare
   finestre complete di 28 giorni post-rilascio con un periodo equivalente, evitando
   conclusioni forti con pochi clic. Non e stato creato un monitor automatico.

## Riproduzione

- `node scripts/seo/build-keyword-research.mjs --write`: rigenera schede e CSV
  pubblici senza leggere dati privati.
- `node scripts/seo/build-keyword-research.mjs --baseline .seo-cache/no-ai-act/2026-10-18/search-console.json`:
  legge solo la cattura autorizzata e salva il riepilogo privato nella stessa
  cartella ignorata. Non invia dati, non modifica Google o il sito.

# Audit linguistico V5 — 23 novembre 2026

Ramo dedicato `codex/v5-localization-audit`, basato sulla release stabile
V5.2.2, commit di produzione `911d9465bef34cc3d92aa476386204c50168e22a`.
Questo documento descrive modifiche locali **non pubblicate**. Non crea una
beta, una nuova release o una validazione scientifica delle traduzioni.

## Matrice preliminare delle sorgenti

| Lingua | Portale | Gioco | 14 casi | Onboarding V5 | Debrief e rapporti | Risorse | SEO | Stato verificato |
|---|---|---|---|---|---|---|---|---|
| IT | 33 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |
| EN | 37 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |
| FR | 37 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |
| DE | 16 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |
| ES | 16 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |
| PT-PT | 16 URL | Dizionario completo | 14 casi e 14 norme | 62 voci e 14 supporti | Presenti | Attività e lezione | Sitemap e metadati | Sorgenti; flussi browser da eseguire |

Per lingua: 1.609 stringhe foglia nei dizionari di interfaccia, casi, norme,
percorso guidato e informativa del registro. Questo conteggio prova la presenza,
non l'equivalenza semantica o il funzionamento. Il portoghese usa `pt` nella
selezione e nei salvataggi, `pt-PT` nei metadati del sito.

Il dossier scientifico storico e il laboratorio separato Study 02 sono
disponibili soltanto in **IT/EN/FR**, secondo `docs/v5/languages.json`.
DE/ES/PT non hanno un sito di 37 pagine: offrono 16 risorse introduttive,
pratiche e stampa per lingua, con collegamenti espliciti ai materiali inglesi
dove manca una pagina equivalente. Non si presenta questa copertura come
traduzione integrale del portale o del dossier scientifico.

## Incongruenze rilevate e interventi

1. `sync-fr-inventory.mjs` sovrascriveva l'elenco delle lingue del gioco con
   IT/EN/FR. Il comando `site:fr` poteva così far divergere release e runtime.
2. L'elenco del sito, quello delle statistiche e quello delle lingue giocabili
   erano mantenuti separatamente. La configurazione esistente
   `release.config.json` viene estesa con `playableLanguages`,
   `siteLanguages`, `caseLocalizationStatus`, `learningResourcesLanguages`.
   Registrazione dei dizionari e contenuti reali restano verifiche obbligatorie.
3. I principali test browser dei casi, del percorso V5 e dell'accessibilità
   coprivano soltanto IT/EN/FR e riconoscevano pulsanti tramite regex in tre
   lingue. Le verifiche devono leggere le etichette dai dizionari runtime.
4. La descrizione del gameplay del 3 ottobre menzionava una «nuova beta»:
   il riferimento storico va espresso attraverso le versioni del filmato.
   Titolo, URL, data, lingua originale e natura delle sei uscite stampa
   devono essere conservati.

## Terminologia e limiti della revisione

Verifica terminologica sulle versioni ufficiali EUR-Lex del Regolamento
(UE) 2024/1689: [IT](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:02024R1689-20260727),
[EN](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727),
[FR](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02024R1689-20260727),
[DE](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02024R1689-20260727),
[ES](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:02024R1689-20260727),
[PT](https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:02024R1689-20260727).
Non si modificano disposizioni, soluzioni, scoring, ordine delle prove o
salvataggi per risolvere problemi linguistici. La verifica tecnica e
terminologica assistita non è una revisione indipendente da madrelingua o
un parere giuridico. Il nome ufficiale italiano del dottorato nei crediti
è conservato come nome proprio, non classificato come traduzione mancante.

## Verifica riproducibile

Il risultato finale deve indicare separatamente: controlli dei dizionari e
dei placeholder; ricostruzione idempotente del sito; SEO e collegamenti;
84 cicli investigativi e 84 percorsi guidati; selezione e persistenza;
salvataggi v1/v2; tastiera; mobile; screenshot. Le prove devono usare
soltanto localhost e impedire richieste o invii verso servizi esterni.

Le verifiche completate, gli eventuali errori e i file modificati saranno
registrati qui al termine dell'esecuzione. Nessuna pubblicazione autorizzata
da questo audit. La raccolta dati esistente non viene ampliata.

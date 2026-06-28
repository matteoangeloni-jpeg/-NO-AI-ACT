# NO AI ACT — Research data plan (FASE 2, proposta)

> **Status: PROPOSTA da revisionare.** Questo documento NON modifica i form Tally,
> NON implementa telemetry e NON aggiunge tracking. Definisce *come* useremo, in
> futuro, i dati dei questionari per una ricerca scientifica sul serious game,
> in modo privacy-first. Nessuna modifica tecnica parte senza approvazione.

## 1. Obiettivo e principio

Valutare il **potenziale formativo/divulgativo** di NO AI ACT come serious game
sull'AI Act. **Non** vogliamo sorvegliare l'utente: vogliamo misurare profilo dei
partecipanti, aspettative e percezione dell'esperienza, in forma **aggregata e/o
pseudonimizzata**.

**Regola architetturale chiave (non negoziabile):**
non si collegano automaticamente **identità ↔ email ↔ Tally pre-game ↔ gameplay
↔ Tally post-game ↔ risultati di gioco**. I quattro mondi restano separati:

```
Tally PRE-GAME ──┐
                 │   (nessuna chiave di join automatica)
Gameplay ────────┼─── volutamente NON collegati
                 │
Tally POST-GAME ─┘

Email (se fornita) ── trattata a parte, mai nel dataset di ricerca
```

## 2. Cosa abbiamo oggi (baseline)

- **Pre-game**: form Tally nella landing (IT `44ENVA`; EN `https://tally.so/r/5BryXb`).
- **Post-game**: form Tally nel finale del gioco (IT `https://tally.so/r/dWgB5y`;
  EN `https://tally.so/r/ZjWp9A`), aperti come link nudi, senza dati di gameplay.
- **Pagine pubbliche**: Cloudflare Web Analytics aggregato (no cookie, no dati personali).
- **Gioco**: nessun backend; progresso solo in `localStorage`; nessun invio di
  risposte/punteggi/report a server.

Il pre-game è già *off-game* (nella landing): corretto, lo usiamo come
**questionario dichiarativo d'ingresso**, non come tracking.

## 3. Testi di consenso e nota (da inserire NEI FORM — non ancora implementati)

Il consenso è **esplicito e non preselezionato** (checkbox opzionale, default OFF).
Il gioco e i form restano utilizzabili **anche senza** consenso alla ricerca.

### Consenso — IT
> Acconsento all'utilizzo delle mie risposte, in forma aggregata e/o
> pseudonimizzata, per finalità di ricerca scientifica sul serious game, la
> formazione e l'AI Act.

### Nota — IT
> Le risposte saranno usate per analisi aggregate sul profilo dei partecipanti,
> sulle aspettative e sulla percezione dell'esperienza. L'eventuale email, se
> fornita, sarà trattata separatamente e non sarà usata per collegare identità e
> risultati di gioco.

### Consent — EN
> I agree that my answers may be used, in aggregated and/or pseudonymised form,
> for scientific research on serious games, training and the AI Act.

### Note — EN
> Answers will be used for aggregate analysis of participant profiles,
> expectations and perceived learning experience. Any email address, if provided,
> will be processed separately and will not be used to link identity and gameplay
> results.

## 4. Struttura dataset

Due dataset **indipendenti**, senza chiave di join al gameplay né tra loro.

### 4.1 Pre-game (`research_pre_game.csv`)
| Campo | Tipo | Note |
|---|---|---|
| `submission_id` | uuid | id interno del record (non identifica la persona) |
| `submitted_at_month` | YYYY-MM | **solo mese/anno**, non timestamp preciso |
| `language` | it \| en | lingua del form |
| `consent_research` | bool | consenso esplicito (se false → record escluso dal dataset di ricerca) |
| `role` | enum | docente / formatore / studente univ. / PA / professionista / consulente / altro |
| `context_of_use` | enum | scuola / università / formazione / lavoro / personale |
| `ai_act_familiarity` | scala 1–5 | autovalutazione dichiarata |
| `expectation` | enum/categoriale | cosa si aspetta dall'esperienza |
| *(altre domande dichiarative aggregabili)* | categoriale/scala | no testo libero identificante |

### 4.2 Post-game (`research_post_game.csv`)
| Campo | Tipo | Note |
|---|---|---|
| `submission_id` | uuid | id interno del record |
| `submitted_at_month` | YYYY-MM | solo mese/anno |
| `language` | it \| en | |
| `consent_research` | bool | esplicito |
| `completed_at_least_one_case` | bool | dichiarato dall'utente, non da telemetry |
| `perceived_clarity` | scala 1–5 | percezione |
| `perceived_learning` | scala 1–5 | percezione |
| `perceived_usability` | scala 1–5 | percezione |
| `would_recommend` | scala 1–5 | |
| `open_feedback_optional` | testo libero **opzionale** | escluso dal dataset quantitativo; revisione manuale per de-identificazione prima di qualsiasi uso |

> I due dataset si analizzano **separatamente** (pre vs post a livello di gruppo),
> **non** appaiati a livello individuale: è una scelta di privacy, non un limite tecnico.

## 5. Dati INCLUSI (solo questi)
- Profilo dichiarato aggregabile (ruolo, contesto, familiarità).
- Aspettative (pre) e percezioni (post): scale/categorie.
- Lingua del form; mese/anno di compilazione; consenso.

## 6. Dati ESCLUSI (mai nel dataset di ricerca)
- Risposte di gioco, decisioni, classificazioni, motivazioni, reperti citati.
- Report, punteggi individuali, esiti per caso, sequenze complete di gioco.
- Email, nome, scuola/classe, qualsiasi identificatore diretto.
- IP, user agent completo, identificatori persistenti, fingerprinting, session replay, heatmap.
- Geolocalizzazione precisa; dati device granulari.
- Qualsiasi chiave che colleghi Tally ↔ gameplay ↔ identità ↔ email.
- Timestamp ad alta precisione (si conserva solo mese/anno).

## 7. Separazione email / dati di ricerca
- L'email è **opzionale** e raccolta solo per eventuali aggiornamenti, **mai** per
  collegare identità e risultati.
- L'email vive in un **segmento/destinazione separata** (es. lista contatti), **non**
  nel CSV di ricerca; non è esportata insieme alle risposte.
- In export: due flussi distinti — (a) risposte de-identificate per ricerca,
  (b) eventuale email per contatto. Nessun campo comune che permetta il join.

## 8. Pipeline di export proposta (manuale, da approvare)
1. Tally → export CSV per form (pre / post).
2. **Rimozione** colonne escluse (email, timestamp preciso, eventuali metadati IP/UA se presenti).
3. Riduzione timestamp a mese/anno.
4. Filtro `consent_research = true` per il dataset di ricerca.
5. Revisione manuale del testo libero opzionale (de-identificazione) o esclusione.
6. Salvataggio dei due CSV puliti; email instradata a parte.
7. Conservazione e accesso secondo policy definita con il DPO (vedi §10).

## 9. Limiti metodologici da dichiarare
- **Campione autoselezionato** (chi sceglie di compilare): non rappresentativo.
- **Self-report**: percezioni dichiarate, non misure oggettive di apprendimento.
- **Nessun pre/post appaiato individuale** (per scelta privacy): confronto solo a
  livello di gruppo → niente inferenza causale individuale.
- **Nessun gruppo di controllo**: non è un RCT; risultati esplorativi/descrittivi.
- Possibile **desiderabilità sociale** e bias del volontario.
- Dati di gameplay **non** collegati: non si può correlare comportamento e percezione
  a livello individuale (limite voluto).

## 10. Punti da sottoporre a DPO / comitato etico (prima della raccolta)
1. **Base giuridica** del trattamento (consenso) e formulazione dell'informativa completa.
2. **Titolarità/contitolarità** e ruolo di Tally e Cloudflare come responsabili/processori; DPA.
3. **Trasferimenti extra-UE** (sede dei provider) e garanzie.
4. **Periodo di conservazione** e procedura di cancellazione; diritti dell'interessato.
5. **Minori**: se l'uso scolastico coinvolge studenti minorenni, valutare esclusione
   o garanzie specifiche; il pre-game non deve raccogliere dati di minori senza tutele.
6. Adeguatezza di **pseudonimizzazione vs anonimizzazione** ai fini della pubblicazione.
7. Gestione del **testo libero** (rischio re-identificazione).
8. Eventuale **parere etico** dell'istituzione che condurrà la ricerca/pubblicazione.

## 11. Cosa NON è incluso in questa fase
- Nessuna modifica ai form Tally.
- Nessuna telemetry di gioco (vedi FASE 3, solo design).
- Nessun tracker pubblicitario, nessun Google Analytics / Meta Pixel.
- Nessun collegamento automatico tra i mondi descritti in §1.

---

*Documento di proposta. La struttura tecnica è predisposta ma non attivata: ogni
passo (modifica form, export, conservazione) richiede approvazione esplicita e,
dove indicato, confronto con DPO/comitato etico.*

# ANALYTICS — privacy by design

NO AI ACT misura **come viene usato il gioco**, mai **chi lo usa**.
Implementazione: `src/game/systems/AnalyticsSystem.ts` (allowlist rigida,
config iniettabile, test in `tests/analytics.test.ts`).

## Modalità

| Modalità | Quando | Comportamento |
|---|---|---|
| `off` | **default in produzione** | nessun evento lascia il browser |
| `console` | default in `npm run dev` | eventi stampati in console, zero rete |
| `plausible` | solo con configurazione esplicita | invio a Plausible (event API) |
| `umami` | solo con configurazione esplicita | invio a Umami (`/api/send`) |

Il segnale **Do Not Track** del browser forza `off` in ogni caso.
`AnalyticsSystem.disable()` spegne tutto a runtime.

## Eventi tracciati

`game_opened`, `game_started`, `language_selected`, `case_started`,
`evidence_opened`, `clues_selected`, `classification_selected`,
`measure_selected`, `case_completed`, `case_result`, `norm_unlocked`,
`archive_opened`, `ending_reached`, `game_completed`, `credits_opened`,
`reset_game` — più la pageview delle schermate (solo nome scena).

Qualsiasi altro nome evento viene **scartato dal codice**.

## Proprietà ammesse (allowlist)

`language`, `caseId`, `locationId`, `normId`, `result`, `classification`,
`measure`, `selectedClueCount`, `relevantClueCount`, `ending`,
`completedCasesCount`, `unlockedNormsCount`, `musicEnabled`, `reducedMotion`.

Qualsiasi altra chiave viene scartata. I valori stringa vengono scartati se
superano 64 caratteri (free text) o contengono `@` (possibili email).

## Che cosa NON viene raccolto — garanzie

- ❌ nome, email, dati scolastici (scuola/classe) o qualsiasi dato personale;
- ❌ free text: non esiste alcun campo di testo libero nel gioco, e il
  sanitizzatore scarta comunque stringhe lunghe;
- ❌ identificativi persistenti del giocatore: nessun ID utente, nessun cookie,
  nessun localStorage usato per il tracking;
- ❌ fingerprinting, session replay, heatmap;
- ❌ IP e user agent **nel payload**: il gioco non li invia mai. Nota di
  onestà: ogni richiesta HTTP espone IP e user agent a livello di trasporto;
  Plausible e Umami sono scelti proprio perché dichiarano di non conservare
  l'IP e di usarlo solo transitoriamente in forma aggregata/anonimizzata.
  Verificare la configurazione della propria istanza.

## Abilitare Plausible

```bash
# .env.production (o variabili della pipeline di build)
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=tuodominio.example
```
Registrare il dominio su https://plausible.io (o istanza self-hosted: cambiare
l'endpoint in AnalyticsSystem se non si usa plausible.io). Le proprietà degli
eventi appaiono come "custom properties".

## Abilitare Umami

```bash
VITE_ANALYTICS_PROVIDER=umami
VITE_UMAMI_WEBSITE_ID=<website-id>
VITE_UMAMI_SCRIPT_URL=https://tua-istanza.example/script.js
```
L'endpoint `/api/send` viene derivato dallo script URL. Consigliata istanza
self-hosted UE.

## Disattivare tutto

Non impostare alcuna variabile (default produzione = `off`), oppure
`VITE_ANALYTICS_PROVIDER=off`. A runtime: `AnalyticsSystem.disable()`.

## Nota GDPR / privacy

Il sistema è progettato per non trattare dati personali: eventi aggregati di
gameplay, nessun identificativo, nessun cookie → nessun banner necessario.
Se si attiva un provider remoto resta responsabilità del titolare verificare:
(1) che l'istanza non conservi IP/UA; (2) la base giuridica e l'informativa
del sito che ospita il gioco; (3) l'eventuale trasferimento extra-UE
(preferire Plausible EU o Umami self-hosted UE). Questo documento non è un
parere legale.

## Dashboard utili (esempi)

- **Funnel di abbandono**: `game_opened → game_started → case_started →
  case_completed → ending_reached` — dove si perdono i giocatori;
- **Errori per caso**: `case_result` filtrato per `result=wrong`, raggruppato
  per `caseId` — quali casi confondono di più (utile per il bilanciamento);
- **Qualità delle citazioni**: `clues_selected` con `selectedClueCount` vs
  `relevantClueCount`;
- **Distribuzione finali**: `ending_reached` per `ending`;
- **Lingue**: `language_selected` / `game_started` per `language`.

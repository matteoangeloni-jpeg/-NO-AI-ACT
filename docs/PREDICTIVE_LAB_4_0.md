# Player Insights - laboratorio sperimentale

Palette ripresa da src/styles/landing.css: carbon #0a1020, pannelli #111a2e,
testo #e7ecf5, ambra #d9a521, accento #7d9ad0, errore rosso.

Il laboratorio usa esclusivamente i contatori giornalieri disponibili dalla
query corrente, con medesimo periodo e versione. Non effettua nuove raccolte,
chiamate esterne o salvataggi di profili individuali.

Modelli: ultimo valore, media mobile a sette giorni, smoothing esponenziale
con alfa 0,3, regressione lineare sul tempo, ripetizione dell'ultima settimana.
Tutti producono conteggi non negativi. Orizzonti: 1, 7, 14 giorni.

Servono almeno 14 giorni consecutivi con celle disponibili. Le celle assenti
o soppresse non sono zeri. La somma riguarda solo celle rilasciate dal backend:
non ricostruisce eventi soppressi o copertura completa delle versioni.

Confronto MAE con origine mobile sugli ultimi sette giorni: ogni training usa
solo dati precedenti al giorno verificato. Nessuna ricerca degli iperparametri
sul test. Il ranking e descrittivo del campione e non certifica efficacia;
la validazione a un giorno non valida automaticamente previsioni multi-giorno.
Non sono disponibili intervalli di confidenza calibrati. Non si inferiscono
giocatori unici, abbandono individuale, causalita o apprendimento.

Dati locali sintetici: qualsiasi stima e una dimostrazione, non una previsione
operativa. ARIMA/ML complesso e modelli individuali esclusi finche storia,
copertura e granularita non giustifichino un confronto robusto con baseline.

Verifiche: tests/forecast.test.ts copre costanti, trend, stagionalita, floor a
zero, dati mancanti e valutazione temporale. Lo smoke Insights include cinque
viste su sei viewport e login tramite modulo. Risultati/screenshot locali in
scripts/smoke/out/player-insights, non pubblicati.

Accesso locale aggiornato: modulo password e cookie HttpOnly SameSite Strict,
sessione casuale solo in memoria, scadenza un'ora, nessuna modifica ad Access
cloud. Un riavvio richiede un nuovo accesso. Le API e gli asset restano protetti.

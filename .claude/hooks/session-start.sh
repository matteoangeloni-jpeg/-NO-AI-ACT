#!/bin/bash
# Prepara una sessione di Claude Code sul web perché test, cancelli e strumenti
# funzionino senza che nessuno debba ricordarsi tre comandi.
#
# PERCHÉ ESISTE. Il container di una sessione web è effimero: viene riciclato
# dopo un periodo di inattività, e con lui spariscono node_modules, gli
# strumenti installati a mano e le variabili d'ambiente. Ogni sessione nuova
# ripartiva da zero, e tre cose si scoprivano sempre nel modo più lento:
#
#  1. `npm install` mancante — niente test, niente build;
#  2. CHROMIUM_PATH non impostato — `smoke:all` muore con un errore che
#     consiglia `npx playwright install`, che in un ambiente con egress
#     limitato e disco a quota è precisamente la cosa da non fare. Il browser
#     c'è già in /opt/pw-browsers: basta indicarglielo. Questa riga è costata
#     un'ora di diagnosi il 29 settembre 2026;
#  3. graphify assente — lo strumento che mappa il repository in un grafo
#     interrogabile, installato su richiesta del proprietario il 20 ottobre.
#
# È SINCRONO, non asincrono, e di proposito: la sessione parte un po' più
# tardi, ma non parte mai con metà degli strumenti pronti. Un hook asincrono
# introduce una corsa fra chi installa e chi lancia i test.
#
# È IDEMPOTENTE: rilanciarlo non rompe niente e non reinstalla ciò che c'è.
set -euo pipefail

# Solo nelle sessioni remote: su una macchina locale l'ambiente è di chi la usa,
# e un hook che installa strumenti a sua insaputa è un'invadenza.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "[session-start] dipendenze npm"
npm install --no-audit --no-fund

# Il browser per gli smoke test: il percorso, non un nuovo scaricamento.
if [ -x /opt/pw-browsers/chromium ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export CHROMIUM_PATH=/opt/pw-browsers/chromium' >> "$CLAUDE_ENV_FILE"
  echo "[session-start] CHROMIUM_PATH impostato per gli smoke test"
fi

# graphify: strumento di sviluppo, nessun codice del prodotto.
# Se non è installabile la sessione parte comunque — un grafo mancante non
# impedisce di lavorare, e far fallire l'avvio per uno strumento accessorio
# sarebbe sproporzionato.
if command -v graphify >/dev/null 2>&1; then
  echo "[session-start] graphify già presente: $(graphify --version 2>/dev/null || echo ok)"
elif command -v uv >/dev/null 2>&1; then
  echo "[session-start] installo graphify con uv"
  # --force E NON `install` SEMPLICE, per una ragione misurata.
  # Provando questo ramo ho trovato che `uv tool install graphifyy` su uno
  # stato a metà — pacchetto registrato, binario assente — risponde «già
  # installato» e NON ricrea l'eseguibile: il passo dopo fallisce e la
  # sessione resta senza strumento. Con --force la reinstallazione è completa
  # e l'operazione è davvero idempotente.
  #
  # E L'ERRORE SI VEDE. La prima stesura mandava tutto in /dev/null e
  # stampava «non installato» senza dire perché: un guasto diagnosticabile
  # ridotto a una riga muta. Ora l'uscita dell'errore arriva a schermo.
  if uv tool install --force graphifyy >/tmp/graphify-install.log 2>&1 \
     && graphify install >>/tmp/graphify-install.log 2>&1; then
    echo "[session-start] graphify pronto: $(graphify --version 2>/dev/null || echo ok)"
  else
    echo "[session-start] graphify NON installato — non bloccante, si rifà con 'npm run graph:install'"
    echo "[session-start] motivo:"
    tail -5 /tmp/graphify-install.log | sed 's/^/    /'
  fi
else
  echo "[session-start] uv assente: graphify salta (non bloccante: npm run graph:install)"
fi

echo "[session-start] pronto"

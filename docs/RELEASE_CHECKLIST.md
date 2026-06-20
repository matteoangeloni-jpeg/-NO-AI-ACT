# RELEASE CHECKLIST — NO AI ACT v0.4.0

Checklist di rilascio per la diffusione limitata e la successiva presentazione
pubblica. Legenda stato:

- ✅ **fatto** — verificato in questa fase di hardening
- ✋ **da fare manualmente** — richiede un browser/persona reale
- 🔴 **bloccante** — non diffondere il link finché non è verde
- 🟡 **non bloccante** — può seguire dopo la diffusione limitata

| # | Voce | Stato | Bloccante? | Note |
|---|---|---|---|---|
| 1 | Commit `main` allineato a v0.4 (`3971a36` o successivo) | ✅ | 🔴 | base del branch di hardening |
| 2 | `package.json` version = `0.4.0` | ✅ | 🟡 | allineato anche `package-lock.json` |
| 3 | `npm run typecheck` verde | ✅ | 🔴 | 0 errori |
| 4 | `npm test` verde | ✅ | 🔴 | oltre 100 test automatici |
| 5 | `npm run build` verde | ✅ | 🔴 | 1 warning chunk Phaser (atteso) |
| 6 | Deploy GitHub Pages riuscito sul commit di release | ✅ | 🔴 | workflow `deploy.yml` success |
| 7 | **Verifica live manuale dal browser** | ✋ | 🔴 | aprire l'URL pubblico, vedi sotto |
| 8 | Smoke **desktop** | ✋ | 🔴 | vedi `SMOKE_CHECKLIST.md` |
| 9 | Smoke **mobile** (portrait/landscape/tablet) | ✋ | 🟡 | mobile guard in portrait |
| 10 | README aggiornato alla v0.4 | ✅ | 🟡 | stato, casi, lingue, limiti, roadmap, privacy |
| 11 | Privacy / modalità docente chiarite | ✅ | 🟡 | UI + docs + export |
| 12 | `docs/RELEASE_NOTES_v0.4.0.md` pronte | ✅ | 🟡 | testo, non ancora pubblicate |
| 13 | `npm audit --audit-level=moderate` valutato | ✅ | 🟡 | solo dev deps, vedi sotto |
| 14 | **Tag `v0.4.0`** | ⛔ da NON creare ora | — | solo dopo verifica live + autorizzazione |
| 15 | **Release GitHub** | ⛔ da NON creare ora | — | usare le release notes preparate |

## Verifica live manuale (✋ da fare in un browser reale)

L'ambiente di CI/agent **non può raggiungere `github.io`** (richiesta bloccata
dalla network policy: HTTP 403). Il deploy è quindi verificato solo via
artefatto `dist/` costruito dallo stesso commit. La verifica live va eseguita a
mano:

1. Aprire <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/> in Chrome/Firefox.
2. Confermare: title screen → boot/preload → mappa, **senza errori in console**
   (il notice licenze in `console.info` è atteso).
3. Cambiare lingua IT ↔ EN; cambiare difficoltà; scegliere un percorso.
4. Giocare almeno il caso 1 e il caso 7 fino al rapporto ispettivo.
5. Attivare la modalità docente e aprire il debrief a fine partita.
6. Su smartphone in portrait: verificare la comparsa della mobile guard.

## npm audit (stato)

`npm audit --audit-level=moderate` segnala 5 vulnerabilità (3 moderate, 1 high,
1 critical), **tutte transitive in dev dependencies** (esbuild → vite → vitest /
vite-node / @vitest/mocker). Riguardano il **dev server / la UI di test in
locale**, non il bundle statico distribuito su GitHub Pages.

- **Impatto produzione**: nessuno (il sito è statico, senza dev server).
- **Fix disponibile** solo via `npm audit fix --force` → Vite 8 (major, breaking).
- **Decisione**: **non applicare ora** (rischio di rottura build/test). Da
  valutare in v0.4.1 come aggiornamento controllato delle dipendenze di sviluppo.
- Classificazione: 🟡 **non bloccante**.

## Dopo il merge e la verifica live

Solo dopo merge su `main`, verifica live OK e **autorizzazione esplicita del
proprietario**:

```bash
git checkout main && git pull
git tag -a v0.4.0 -m "NO AI ACT v0.4.0"
git push origin v0.4.0
```

Poi creare la release GitHub usando `docs/RELEASE_NOTES_v0.4.0.md`.

# Pubblicazione sul dominio beta

Il progetto Cloudflare Pages `no-ai-act-beta` ha **production branch `beta`**.
`--branch main` crea soltanto una preview e non aggiorna `beta.no-ai-act.eu`.

Dal commit pulito della release, dopo i controlli previsti:

```powershell
$env:BETA_USAGE_COLLECTION='true'
npm run beta:build
npm run beta:publish
```

Il comando esplicito controlla versione, commit, stato dell’artefatto e consenso
separato ai testi prima di pubblicare sul ramo corretto. Non viene eseguito
automaticamente dalla build, dalla CI o dai test. Lo storico di distribuzione
e il manifest online devono confermare l’ambiente **Production**, ramo `beta`.

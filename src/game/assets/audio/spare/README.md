# Campioni non assegnati

File audio presenti nel progetto ma che nessun ruolo musicale e nessun
gesto usa. Stanno qui e non nella cartella sopra perché `import.meta.glob`
raccoglie tutto ciò che trova in `../assets/audio/*.mp3`: un file lasciato
lì verrebbe pubblicato insieme agli altri e scaricato da chi gioca, pur non
suonando mai.

Per usarne uno: spostalo nella cartella superiore con il nome che il
manifesto (`src/game/systems/audioAssets.ts`) si aspetta, oppure aggiungi
un ruolo nuovo al manifesto e chiamalo da una scena.

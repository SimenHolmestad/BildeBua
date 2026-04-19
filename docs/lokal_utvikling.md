[Tilbake til readme](../readme.md#bildebua)

# Lokal utvikling
Under utvikling vil applikasjonen lage bilder som dette når det ikke er noe kamera koblet til:

![Dummy demo circle image](images/dummy_demo_image.png)

# Installering av avhengigheter
Du trenger `gphoto2` for a kunne bruke applikasjonen med speilreflekskamera.
```
brew install gphoto2
```

# Kjøre applikasjon lokalt

Kjør følgende for å starte backend:
```
git clone https://github.com/SimenHolmestad/BildeBua.git
cd BildeBua
python3.13 -m venv .venv
source .venv/bin/activate
pip3 install -r python-requirements.txt
python3 -m scripts.run_backend
```
(neste gang trenger du bare source `.venv/bin/activate && python3 -m scripts.run_backend`)

For å starte frontend, kjør dette i egen terminal.
```
cd BildeBua/frontend
npm install
npm run dev
```

Det er også mulig å kjøre begge deler "i produksjon" lokalt med:
```
source .venv/bin/activate
python3 -m scripts.run_application
```

# Kjøre tester
```
python3 -m pytest backend/tests
```

For å kjøre UI-tester med Playwright:
```
cd frontend
npm install
npx playwright install chromium
npm run test:e2e
```

Playwright-testene starter frontend og en egen backend i dummy-kamera-modus med `config.e2e.json`.
For å oppdatere snapshot-baseliner for visuelle tester:
```
npm run test:e2e:update-snapshots
```

# Kjøre med webkamera
Hvis du vil kjøre applikasjonen med webkameraet på Mac-en, må du ha `ffplay` og `imagesnap` tilgjengelig i PATH. `ffplay` brukes til å vise forhåndsvisning i fullskjerm i 3 sekunder, og `imagesnap` tar selve bildet fra standardkameraet.
```
brew install ffmpeg imagesnap
```

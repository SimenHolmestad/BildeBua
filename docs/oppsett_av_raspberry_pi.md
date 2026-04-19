[Tilbake til readme](../readme.md#bildebua)

# Oppsett av Raspberry PI

Anbefalt fremgangsmåte for oppsett er beskrevet under, men noen av stegene kan gjøres på andre måter. Hvis du allerede har Raspberry PI-en satt opp, kan du hoppe til [installer prosjektavhengigheter](#installer-prosjektavhengigheter).

## 1. Installér Raspberry PI OS på SD-kort
Her er det lettest å bruke raspberry-pi-imager. Følg [denne lenken](https://www.raspberrypi.com/documentation/computers/getting-started.html#raspberry-pi-imager). Sørg for at du husker brukernavnet ditt.

## 2. Koble til Raspberry PI med SSH

For å koble til PI-en med SSH må du først sørge for at PI-en er koblet til nettverket, enten ved kabel eller WiFi.

Når PI-en er på nettverket, se [denne guiden](https://www.raspberrypi.org/documentation/remote-access/README.md) for hvordan du bruker SSH. Basically:
1. Kjør `ping raspberrypi.local` og notér IP-adressen
2. Kjør `ssh <rpi_brukernavn>@<ip_adresse>` og sjekk at du kommer inn.

**Merk:** Raspberry PI-en må være på samme nettverk som enhetene som skal bruke BildeBua.
## 3. Sett opp .ssh-nøkkel mot RPI-en
Kjør følgende:
```
ssh-keygen
ssh-copy-id <rpi_brukernavn>@<ip_adresse>
```
Da slipper du å skrive inn passord senere.

## 4. Installér prosjekt og prosjektavhengigheter
I RPI-terminalen, sørg for at node og npm er installert:
```
sudo apt-get install nodejs npm
```
Deretter, last ned prosjektet og installer Python-avhengigheter:
```
git clone https://github.com/SimenHolmestad/BildeBua.git
cd BildeBua
python3.13 -m venv .venv
source .venv/bin/activate
pip3 install -r python-requirements.txt
```

## 5. Installér gphoto2 (til speilrefleks)
Den enkleste måten å installere gphoto2 på Raspberry PI ser ut til å være følgende kommando:
```
wget https://raw.githubusercontent.com/gonzalo/gphoto2-updater/master/gphoto2-updater.sh && chmod +x gphoto2-updater.sh && sudo ./gphoto2-updater.sh
```

## 6. Deploy via systemctl

For å kjøre BildeBua via systemctl, bruk hjelpescriptet `rpi_deploy`:

```
sudo .venv/bin/python -m scripts.rpi_deploy
```

Dette burde åpne en browser på enheten med applikasjonen kjørende inni. Når dette kjører, gå til `/admin` for å konfigurere BildeBua videre.

## Optional: Deploy med ny kode

For å deploye ny kode (hvis det har kommet nye commits i repoet) kan man bruke hjelpescriptet `rpi_update_and_redeploy`:
```
sudo .venv/bin/python -m scripts.rpi_update_and_redeploy
```

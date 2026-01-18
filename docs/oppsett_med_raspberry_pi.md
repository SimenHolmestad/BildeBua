[Tilbake til lesmeg](../lesmeg.md)

# Oppsett av CameraHub på Raspberry PI

Anbefalt fremgangsmåte for oppsett er beskrevet under, men noen av stegene kan gjøres på andre måter. Hvis du allerede har Raspberry PI-en satt opp, kan du hoppe til [installer prosjektavhengigheter](#installer-prosjektavhengigheter).

## Installere Raspberry PI OS
For å installere et operativsystem på Raspberry PI, gjør følgende:
1. Last ned OS ([Raspberry Pi OS med skrivebord](https://www.raspberrypi.org/software/operating-systems/) anbefales)
2. Skriv OS til Micro SD-kortet med [balena etcher](https://www.balena.io/etcher/)
3. (Valgfritt) Skriv WiFi-informasjon til SD-kortet (se [denne guiden](https://www.raspberrypi.org/documentation/remote-access/README.md))
4. Sett Micro SD-kortet i Raspberry PI

WiFi-informasjon er kun nødvendig hvis du vil koble til PI-en via WiFi (ikke kabel) og ikke vil koble til tastatur og mus.

## Koble til Raspberry PI
Det er mulig å kjøre CameraHub direkte på Raspberry PI med tastatur og mus tilkoblet. Jeg synes det er enklere å koble til via SSH.

For å koble til PI-en med SSH må du først sørge for at PI-en er koblet til nettverket (hvis via WiFi, se [denne guiden](https://www.raspberrypi.org/documentation/configuration/wireless/README.md)). Når PI-en er på nettverket, se [denne guiden](https://www.raspberrypi.org/documentation/remote-access/README.md) for hvordan du bruker SSH.

**Merk:** Raspberry PI-en må være på samme nettverk som enhetene som skal bruke CameraHub.

## Installer prosjektavhengigheter
I RPI-terminalen, sørg for at node og npm er installert:
```
sudo apt-get install nodejs npm
```
Deretter, last ned prosjektet og installer Python-avhengigheter:
```
git clone https://github.com/SimenHolmestad/CameraHub.git
cd CameraHub
python3.13 -m venv .venv
source .venv/bin/activate
pip3 install -r python-requirements.txt
```

Merk at bruk av speilreflekskamera krever [ekstra installasjonssteg](#the-dslr-camera-modules).

# Kjør applikasjonen (ikke deploy!)
Kommandoen for å kjøre applikasjonen på Raspberry PI er:
```
python3 -m scripts
```

For å bruke et faktisk kamera, sett `camera.module` i `configs/config.json` til en av:

- `rpicam` (Raspberry Pi Camera Module)
- `dslr_jpg`
- `dslr_raw`
- `dslr_raw_transfer`
- `dummmy` (standard)

Det er også mulig å kjøre applikasjonen med tilgang til kun ett album. Da setter du `albums.forced_album` i `configs/config.json`.

Når brukerne kun har tilgang til ett album, blir brukergrensesnittet enklere.

Hvis du for eksempel vil kjøre CameraHub med Raspberry PI Camera Module og kun ett album kalt "Halloween", kan configen se slik ut:

```
{
  "albums": {
    "forced_album": "Halloween"
  },
  "camera": {
    "module": "rpicam"
  },
  "qr_codes": {
    "use_center_images": true,
    "wifi": {
      "enabled": false,
      "name": "",
      "protocol": "",
      "password": "",
      "description": ""
    }
  }
}
```

Hvis `configs/config.json` ikke finnes, start med å kopiere `configs/example_config.json`.

# Deploy
Siden vi ønsker at CameraHub skal kjøre kontinuerlig, må det deployes. En måte å gjøre dette på er å bruke systemd, som beskrevet i [dette blogginnlegget](https://blog.miguelgrinberg.com/post/running-a-flask-application-as-a-service-with-systemd). For å gjøre dette enklere finnes et deploy-script. For å deploye, kjør:

```
sudo .venv/bin/python -m scripts.deploy
```

For å redeploye med andre innstillinger, oppdater `configs/config.json` og kjør deploy-kommandoen igjen.

Hvis du vil sjekke status etter deploy, kan du kjøre:
```
sudo systemctl status camerahub
```

# Neste steg
- [Oppsett av ekstra skjermer/monitorer](oppsett_ekstra_skjermer.md)
- [Vis WiFi QR-kode på hovedskjerm](vis_wifi_qr_kode_pa_hovedskjerm.md)
- [Oppsett av speilreflekskamera](oppsett_dslr_kamera.md)
- [Nedlasting av bilder fra Raspberry PI](nedlasting_av_bilder_fra_rpi.md)

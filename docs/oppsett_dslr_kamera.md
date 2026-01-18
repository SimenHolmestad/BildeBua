[Tilbake til lesmeg](../lesmeg.md)

# Forutsetninger
Før du setter opp CameraHub på Raspberry PI med et speilreflekskamera, bør du først lese [guiden for oppsett på Raspberry PI](oppsett_med_raspberry_pi.md).

# Oppsett av CameraHub med speilreflekskamera
For å bruke CameraHub med speilreflekskamera må du bruke en av DSLR-modulene. Disse modulene bruker biblioteket gphoto2. Den enkleste måten å installere gphoto2 på Raspberry PI ser ut til å være følgende kommando:
```
wget https://raw.githubusercontent.com/gonzalo/gphoto2-updater/master/gphoto2-updater.sh && chmod +x gphoto2-updater.sh && sudo ./gphoto2-updater.sh
```
Som finnes på <https://github.com/gonzalo/gphoto2-updater>.

Etter å ha installert gphoto2 må du installere Python-pakken gphoto2:
```
pip3 install gphoto2
```

Når gphoto2 er installert kan du koble til speilreflekskameraet via USB og kjøre applikasjonen som beskrevet i [oppsettguiden for Raspberry PI](oppsett_med_raspberry_pi.md).

# Fordeler og ulemper med DSLR-modulene

CameraHub har tre forskjellige DSLR-moduler med ulike fordeler og ulemper. Modulene, sortert etter hastighet fra raskest til tregest, er:
- `dslr_jpg`
- `dslr_raw`
- `dslr_raw_transfer`

`dslr_raw_transfer` er det beste valget (hvis du ønsker råfiler), men bruker også mest tid.

**Merk**: Kameramodulene fungerer per nå kun med Canon-kameraer. Hvis du vil bruke andre typer kameraer må noe omskriving til.

DSLR-modulene beskrives under:
## dslr_jpg
Hvis du ikke vil lagre råbilder, er dette klart det beste alternativet siden det er raskest (litt under 2 sekunder per bilde på Canon EOS 6D).

Vær oppmerksom på at kameraet må være satt opp til å lagre kun .jpg-bilder for at dette skal fungere.

## dslr_raw
Med `dslr_raw` blir råbildet liggende på SD-kortet i kameraet mens .jpg-bildet overføres til Raspberry PI.

Ved testing på Canon EOS 6D brukte denne modulen rundt 4 sekunder per bilde.

Merk: Når du bruker rå-modulene må DSLR-kameraet være satt til å lagre både .jpg og raw.

## dslr_raw_transfer
Med `dslr_raw_transfer` blir både råbilder og .jpg-bilder overført fra kameraet til Raspberry PI.

Ved testing på Canon EOS 6D brukte denne modulen mellom 5 og 6 sekunder per bilde.

En grunn til å overføre råbildene til Raspberry PI er at bildene da sorteres per album. Dette skjer ikke for `dslr_raw`.

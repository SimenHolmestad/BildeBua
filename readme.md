# BildeBua
BildeBua er en hjemmelaget "Photobooth" der man kan scanne en QR-kode og bruke mobilen til å ta et bilde.

![BildeBua demo gif](docs/images/demo.gif)

Du kan bruke BildeBua både med webkamera på Mac, Raspberry PI Camera Module eller speilreflekskamera. Ideelt sett kjører man på en Raspberry PI med speilrefleks.

BildeBua er ment å kjøres på lokalt WiFi-nett for enkelheten og sikkerhetens skyld. Hvis det er brukere som ikke har WiFi-passordet fra før kan BildeBua vise en WiFi-QR-kode etter man har lagt inn WiFi-navn og passord.

Når du først har fått applikasjonen opp og kjøre, er det ganske lett å endre på instillinger fra admin-siden.

# Kodestruktur

Applikasjonen består av en React-frontend som snakker med en FastAPI-backend over HTTP. Backend bruker en album-tjeneste som lagrer bilder på disk og en kamera-tjeneste som velger riktig kamera-implementasjon basert på konfigurasjonen.

```mermaid
flowchart TB
    subgraph scripts["scripts/"]
        run_app["run_application.py"]
        rpi_deploy["rpi_deploy.py"]
        gen_types["generate_frontend_types.py"]
    end

    subgraph frontend["frontend/ (React + Vite + TypeScript)"]
        pages["pages/<br/>FrontPage, AdminPage, AlbumPage,<br/>QrCodePage, SlideshowPage, ..."]
        components["components/<br/>Header, Footer, QrCode,<br/>LastImage, ..."]
        api_client["api/<br/>(generert fra OpenAPI)"]
        pages --> components
        pages --> api_client
    end

    subgraph backend["backend/ (FastAPI)"]
        app["app.py<br/>(FastAPI-app)"]
        subgraph routers["routers/"]
            albums_router["albums.py"]
            admin_router["admin.py"]
        end
        subgraph album_svc["album_service/"]
            album_service["album_service.py"]
            thumbnails["thumbnail_utils.py"]
            tracker["current_image_tracker.py"]
        end
        subgraph camera_svc["camera_service/"]
            camera_service["camera_service.py"]
            dslr["dslr_capture.py"]
            webcam["webcam_capture.py"]
            rpicam["rpicam_capture.py"]
            dummy["dummy_image_generator.py"]
        end
        subgraph core["core/"]
            config_manager["config_manager.py<br/>(config.json)"]
        end
        app --> routers
        albums_router --> album_service
        admin_router --> album_service
        admin_router --> camera_service
        admin_router --> config_manager
        album_service --> camera_service
        album_service --> thumbnails
        album_service --> tracker
        camera_service --> dslr
        camera_service --> webcam
        camera_service --> rpicam
        camera_service --> dummy
        app --> config_manager
    end

    static[("static/<br/>album-bilder på disk")]

    run_app --> backend
    run_app --> frontend
    gen_types -.OpenAPI-spec.-> api_client
    api_client <-->|HTTP| app
    album_service <--> static
    rpi_deploy -.deployer.-> backend
    rpi_deploy -.deployer.-> frontend
```

# Docs
- [Oppsett for lokal utvikling](docs/lokal_utvikling.md#lokal-utvikling)
- [Oppsett på Raspberry PI fra scratch](docs/oppsett_av_raspberry_pi.md)

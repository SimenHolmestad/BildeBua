import argparse
import os
import uvicorn
from backend.core.config_loader import load_config
from backend.core.config_manager import ConfigManager
from scripts.shared.utils import (
    DEBUG_PORT,
    create_app_with_config,
    find_ip_address_for_device,
    get_url_for_qr_code_page,
)


def get_backend_port() -> int:
    port_override = os.getenv("BILDEBUA_BACKEND_PORT")
    if not port_override:
        return DEBUG_PORT

    try:
        return int(port_override)
    except ValueError:
        return DEBUG_PORT


def _create_app():
    config_file = os.getenv("BILDEBUA_CONFIG_FILE", "config.json")
    config_manager = load_config(config_file)
    port = get_backend_port()
    host_ip = find_ip_address_for_device()
    return create_app_with_config(config_manager, host_ip, port)


# Module-level app instance so uvicorn can import it for reload
app = _create_app()


def run_backend(config_manager: ConfigManager) -> None:
    """This should only need to be done when working on or testing the frontend."""
    print("Running the backend in debug mode. Start the frontend in a separate terminal window")
    port = get_backend_port()

    config = config_manager.config
    host_ip = find_ip_address_for_device()
    qr_code_url = get_url_for_qr_code_page(host_ip, port, config.albums.forced_album)
    print("Url for qr codes (when frontend is running):", qr_code_url)

    print(f"Swagger docs available at: http://localhost:{port}/docs")

    os.environ["BILDEBUA_CONFIG_FILE"] = config_manager._path
    uvicorn.run(
        "scripts.run_backend:app",
        host="localhost",
        port=port,
        log_level="debug",
        reload=True,
        reload_dirs=["backend/routers", "backend/core", "backend/album_service", "backend/camera_service"],
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Run BildeBua backend.")
    parser.add_argument(
        "--config-file",
        dest="config_file",
        default="config.json",
        help="Path to config.json file."
    )
    args = parser.parse_args()
    os.environ["BILDEBUA_CONFIG_FILE"] = args.config_file
    config_manager = load_config(args.config_file)
    run_backend(config_manager)


if __name__ == "__main__":
    main()

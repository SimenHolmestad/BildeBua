import argparse
import os
import uvicorn
from backend.core.config_loader import load_settings
from backend.core.settings import Settings
from scripts.shared.utils import (
    DEBUG_PORT,
    create_app_with_settings,
    find_ip_address_for_device,
    get_url_for_qr_code_page,
)


def run_backend(settings: Settings) -> None:
    """This should only need to be done when working on or testing the frontend."""
    print("Running the backend in debug mode. Start the frontend in a separate terminal window")

    port_override = os.getenv("CAMERAHUB_BACKEND_PORT")
    if port_override:
        try:
            port = int(port_override)
        except ValueError:
            port = DEBUG_PORT
    else:
        port = DEBUG_PORT

    host_ip = find_ip_address_for_device()
    qr_code_url = get_url_for_qr_code_page(host_ip, port, settings.albums.forced_album)
    print("Url for qr codes (when frontend is running):", qr_code_url)

    app = create_app_with_settings(settings, host_ip, port)
    uvicorn.run(app, host="localhost", port=port, log_level="debug")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run CameraHub backend.")
    parser.add_argument(
        "config",
        nargs="?",
        default=os.path.join("configs", "example_config.json"),
        help="Path to a config file."
    )
    args = parser.parse_args()
    settings = load_settings(args.config)
    run_backend(settings)


if __name__ == "__main__":
    main()

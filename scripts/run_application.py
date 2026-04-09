import argparse
import uvicorn
from backend.core.config_loader import load_config
from backend.core.config_manager import ConfigManager
from scripts.shared.utils import (
    PRODUCTION_PORT,
    build_frontend,
    create_app_with_config,
    find_ip_address_for_device,
    frontend_is_built,
    get_url_for_qr_code_page,
    open_webpage_in_device_browser,
)


def run_application(config_manager: ConfigManager, rebuild: bool = False) -> None:
    config = config_manager.config
    if rebuild or not frontend_is_built(config.static_folder_name):
        build_frontend(config.static_folder_name)

    host_ip = find_ip_address_for_device()
    qr_code_url = get_url_for_qr_code_page(host_ip, PRODUCTION_PORT, config.albums.forced_album)
    print("Url for qr codes:", qr_code_url)

    app = create_app_with_config(config_manager, host_ip, PRODUCTION_PORT)

    browser_process = open_webpage_in_device_browser(qr_code_url)
    uvicorn.run(app, host=host_ip, port=PRODUCTION_PORT)

    # Delete browser process if it was created
    if browser_process:
        browser_process.terminate()


def main() -> None:
    parser = argparse.ArgumentParser(description="Run BildeBua application.")
    parser.add_argument(
        "--config-file",
        dest="config_file",
        default="config.json",
        help="Path to config.json file."
    )
    parser.add_argument(
        "--rebuild",
        action="store_true",
        default=False,
        help="Force a rebuild of the frontend even if it is already built."
    )
    args = parser.parse_args()
    config_manager = load_config(args.config_file)
    run_application(config_manager, rebuild=args.rebuild)


if __name__ == '__main__':
    main()

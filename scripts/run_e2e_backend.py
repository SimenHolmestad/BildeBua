import argparse
import uvicorn

from backend.core.config_loader import load_config
from backend.core.config_manager import ConfigManager
from scripts.shared.utils import create_app_with_config


def run_backend(config_manager: ConfigManager) -> None:
    app = create_app_with_config(config_manager, "127.0.0.1", 3100)
    uvicorn.run(app, host="127.0.0.1", port=3100, log_level="warning")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run BildeBua backend for Playwright tests.")
    parser.add_argument(
        "--config-file",
        dest="config_file",
        default="config.e2e.json",
        help="Path to config.json file."
    )
    args = parser.parse_args()
    config_manager = load_config(args.config_file)
    run_backend(config_manager)


if __name__ == "__main__":
    main()

import argparse
import uvicorn

from backend.core.config import Config
from backend.core.config_loader import load_config
from scripts.shared.utils import create_app_with_config


def run_backend(config: Config) -> None:
    app = create_app_with_config(config, "127.0.0.1", 3100)
    uvicorn.run(app, host="127.0.0.1", port=3100, log_level="warning")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run BildeBua backend for Playwright tests.")
    parser.add_argument(
        "--env-file",
        dest="env_file",
        default=".env.e2e",
        help="Path to a .env file."
    )
    args = parser.parse_args()
    config = load_config(args.env_file)
    run_backend(config)


if __name__ == "__main__":
    main()

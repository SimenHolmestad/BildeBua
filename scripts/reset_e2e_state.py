import os
import shutil

from backend.core.config_loader import load_config


def main() -> None:
    config_manager = load_config("config.e2e.json")
    albums_dir = config_manager.config.albums.albums_dir

    if os.path.exists(albums_dir):
        shutil.rmtree(albums_dir)

    os.makedirs(albums_dir, exist_ok=True)


if __name__ == "__main__":
    main()

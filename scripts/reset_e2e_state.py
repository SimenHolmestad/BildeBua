import os
import shutil

from backend.core.config_loader import load_config


def main() -> None:
    config = load_config(".env.e2e")
    albums_dir = config.albums.albums_dir

    if os.path.exists(albums_dir):
        shutil.rmtree(albums_dir)

    os.makedirs(albums_dir, exist_ok=True)


if __name__ == "__main__":
    main()

import os

from backend.album_service.thumbnail_utils import create_thumbnail_for_image
from backend.camera_service.dummy_image_generator import create_dummy_image
from backend.core.config import DummyCameraConfig
from backend.core.config_loader import load_config

ALBUMS = [
    {"name": "Bryllup", "description": "Bryllupsbilder fra den store dagen", "image_count": 8},
    {"name": "Sommerfest", "description": "Minner fra sommerfesten", "image_count": 3},
    {"name": "Portrett", "description": "Portrettfotografering", "image_count": 1},
]


def main() -> None:
    config = load_config(".env.e2e")
    albums_dir = config.albums.albums_dir
    os.makedirs(albums_dir, exist_ok=True)

    seed_counter = 1
    for album in ALBUMS:
        album_path = os.path.join(albums_dir, album["name"])
        images_path = os.path.join(album_path, "images")
        thumbnails_path = os.path.join(album_path, "thumbnails")
        os.makedirs(images_path, exist_ok=True)
        os.makedirs(thumbnails_path, exist_ok=True)

        with open(os.path.join(album_path, "description.txt"), "w") as f:
            f.write(album["description"])

        for i in range(1, album["image_count"] + 1):
            base_name = f"image{i:04d}"
            dummy_config = DummyCameraConfig(seed=seed_counter)
            create_dummy_image(dummy_config, os.path.join(images_path, base_name))
            create_thumbnail_for_image(images_path, thumbnails_path, base_name)
            seed_counter += 1


if __name__ == "__main__":
    main()

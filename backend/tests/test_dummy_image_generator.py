import hashlib
import os
import tempfile
import unittest

from backend.camera_service.dummy_image_generator import create_dummy_image
from backend.core.config import DummyCameraConfig


class TestDummyImageGenerator(unittest.TestCase):
    def test_seeded_dummy_images_are_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as test_dir:
            first_path = os.path.join(test_dir, "image1")
            second_path = os.path.join(test_dir, "image2")
            config = DummyCameraConfig(
                width=120,
                height=80,
                number_of_circles=5,
                min_circle_radius=5,
                max_circle_radius=15,
                seed=42,
            )

            create_dummy_image(config, first_path)
            create_dummy_image(config, second_path)

            with open(first_path + ".png", "rb") as first_file:
                first_hash = hashlib.sha256(first_file.read()).hexdigest()

            with open(second_path + ".png", "rb") as second_file:
                second_hash = hashlib.sha256(second_file.read()).hexdigest()

            self.assertEqual(first_hash, second_hash)

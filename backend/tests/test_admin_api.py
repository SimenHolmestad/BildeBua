import json
import unittest
import tempfile
import os
from fastapi.testclient import TestClient
from backend.app import create_app
from backend.album_service.album_service import AlbumService
from backend.camera_service import CameraService
from backend.core.config_manager import ConfigManager
from scripts.shared import qr_code_utils
from .camera_modules_for_testing import create_fast_dummy_config
from .test_utils import temp_dir_relpath


class AdminApiTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.static_dir = tempfile.TemporaryDirectory(dir="backend/static")
        self.static_dir_name = temp_dir_relpath(self.static_dir)
        self.albums_dir_path = os.path.join(self.static_dir_name, "albums")

        self.config_json_dir = tempfile.TemporaryDirectory()
        self.config_json_path = os.path.join(self.config_json_dir.name, "config.json")

        config = create_fast_dummy_config(self.albums_dir_path)
        with open(self.config_json_path, "w") as f:
            json.dump(config.model_dump(), f)

        self.config_manager = ConfigManager(self.config_json_path)
        config = self.config_manager.config

        self.camera_service = CameraService(config.camera)
        self.album_service = AlbumService(config.albums, self.camera_service)

        qr_code_context = qr_code_utils.create_qr_code_context(self.static_dir_name)
        app = create_app(
            self.static_dir_name,
            self.config_manager,
            qr_code_utils.get_qr_codes(qr_code_context)
        )
        self.test_client = TestClient(app)

    def tearDown(self) -> None:
        self.static_dir.cleanup()
        self.config_json_dir.cleanup()

    def test_get_config_returns_current_settings(self) -> None:
        response = self.test_client.get("/admin/config")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("camera", data)
        self.assertIn("forced_album", data)
        self.assertIn("qr_codes", data)
        self.assertIn("wifi_qr_code", data)
        self.assertEqual(data["camera"]["camera_type"], "dummy")

    def test_update_config_changes_camera_type(self) -> None:
        response = self.test_client.put("/admin/config", json={
            "camera": {
                "camera_type": "webcam",
                "preview_seconds": 3,
                "overlay_image": "smil",
                "dslr_preview_iso": 4000,
                "dslr_capture_iso": 200,
                "verbose_errors": True,
                "dummy_config": {
                    "width": 120,
                    "height": 80,
                    "number_of_circles": 5,
                    "min_circle_radius": 5,
                    "max_circle_radius": 15,
                    "seed": None,
                    "should_fail": False,
                    "error_message": "This is a test error message"
                }
            }
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["camera"]["camera_type"], "webcam")

        # Verify persisted
        get_response = self.test_client.get("/admin/config")
        self.assertEqual(get_response.json()["camera"]["camera_type"], "webcam")

    def test_update_config_sets_forced_album(self) -> None:
        response = self.test_client.put("/admin/config", json={
            "forced_album": "my_album"
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["forced_album"], "my_album")

    def test_update_config_clears_forced_album(self) -> None:
        self.test_client.put("/admin/config", json={"forced_album": "my_album"})
        response = self.test_client.put("/admin/config", json={"forced_album": ""})
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.json()["forced_album"])

    def test_update_config_invalid_camera_type_returns_422(self) -> None:
        response = self.test_client.put("/admin/config", json={
            "camera": {"camera_type": "nonexistent"}
        })
        self.assertEqual(response.status_code, 422)

    def test_delete_image_removes_files(self) -> None:
        self.album_service.get_or_create_album("album1")
        self.album_service.capture_image_to_album("album1")
        self.album_service.capture_image_to_album("album1")

        response = self.test_client.delete("/admin/albums/album1/images/1")
        self.assertEqual(response.status_code, 200)

        images = self.album_service.get_image_names("album1")
        self.assertEqual(len(images), 1)
        self.assertIn("image0002.png", images)

    def test_delete_image_leaves_other_images(self) -> None:
        self.album_service.get_or_create_album("album1")
        self.album_service.capture_image_to_album("album1")
        self.album_service.capture_image_to_album("album1")
        self.album_service.capture_image_to_album("album1")

        self.test_client.delete("/admin/albums/album1/images/2")

        images = self.album_service.get_image_names("album1")
        self.assertEqual(sorted(images), ["image0001.png", "image0003.png"])

    def test_delete_image_nonexistent_returns_404(self) -> None:
        self.album_service.get_or_create_album("album1")
        response = self.test_client.delete("/admin/albums/album1/images/99")
        self.assertEqual(response.status_code, 404)

    def test_delete_image_nonexistent_album_returns_404(self) -> None:
        response = self.test_client.delete("/admin/albums/nonexistent/images/1")
        self.assertEqual(response.status_code, 404)

    def test_delete_album(self) -> None:
        self.album_service.get_or_create_album("album1")
        response = self.test_client.delete("/admin/albums/album1")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.album_service.album_exists("album1"))

    def test_delete_album_nonexistent_returns_404(self) -> None:
        response = self.test_client.delete("/admin/albums/nonexistent")
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()

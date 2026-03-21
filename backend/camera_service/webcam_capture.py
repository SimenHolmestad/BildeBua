import os
import subprocess
import time

from backend.core.config import CameraConfig
from .errors import ImageCaptureError
from .utils import get_common_ffplay_parameters, show_overlay, stop_process
from .utils import get_frontmost_app_on_mac, restore_fullscreen_on_mac


def _start_webcam_preview() -> subprocess.Popen[str]:
    return subprocess.Popen(
        [
            "ffplay",
            "-f",
            "avfoundation",
            "-framerate",
            "30",
            "-video_size",
            "1280x720",
            "-i",
            "0:none",
            *get_common_ffplay_parameters(),
            "-vf",
            "hflip",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )


def capture_webcam_still(base_image_path: str) -> None:
    image_path = base_image_path + ".jpg"
    command_result = subprocess.run(
        ["imagesnap", "-w", "0.5", image_path],
        check=False,
        capture_output=True,
        text=True,
    )

    if command_result.returncode != 0 or not os.path.exists(image_path):
        raise ImageCaptureError("Image was not captured")


def capture_webcam_image(camera_config: CameraConfig, base_image_path: str) -> None:
    overlay_process = None
    frontmost_app_on_mac = get_frontmost_app_on_mac()
    preview_process = _start_webcam_preview()

    try:
        # Webcam takes ~3s to initialize, then runs for preview_seconds.
        # Start the overlay 1s before the preview ends so it loads behind the preview
        # window and is instantly visible when the preview closes.
        time.sleep(camera_config.preview_seconds + 2)

        try:
            overlay_process = show_overlay(camera_config.overlay_image)
        except OSError:
            pass

        time.sleep(1)
        stop_process(preview_process)

        capture_webcam_still(base_image_path)
    except Exception:
        stop_process(preview_process)
        raise
    finally:
        restore_fullscreen_on_mac(frontmost_app_on_mac)
        stop_process(overlay_process)

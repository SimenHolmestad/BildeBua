import os
import subprocess
import time

from backend.core.config import CameraConfig
from .errors import ImageCaptureError
from .utils import get_common_ffplay_parameters, show_overlay, stop_process


def show_webcam_preview(preview_seconds: int) -> None:
    process = subprocess.Popen(
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

    try:
        # Det tar rundt 3 sekunder før ffplay er klar til å vise preview, så vi legger til 3
        time.sleep(preview_seconds + 3)
        stop_process(process)
    except Exception as exc:
        raise ImageCaptureError("Image preview failed") from exc


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
    try:
        overlay_process = show_overlay(camera_config.overlay_image)
    except OSError:
        overlay_process = None

    try:
        show_webcam_preview(camera_config.preview_seconds)
        capture_webcam_still(base_image_path)
    finally:
        stop_process(overlay_process)

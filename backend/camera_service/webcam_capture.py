import os
import subprocess
import time

from .errors import ImageCaptureError
from .utils import get_common_ffplay_parameters, show_overlay, stop_process


def show_webcam_preview() -> None:
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
        time.sleep(6)
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


def capture_webcam_image(base_image_path: str) -> None:
    try:
        overlay_process = show_overlay()
    except OSError:
        overlay_process = None

    try:
        show_webcam_preview()
        capture_webcam_still(base_image_path)
    finally:
        stop_process(overlay_process)

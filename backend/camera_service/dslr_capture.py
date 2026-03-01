import subprocess

from backend.core.config import CameraConfig
from .errors import ImageCaptureError
from .utils import get_common_ffplay_parameters, show_overlay, stop_process


def set_dslr_iso(iso: int) -> None:
    command_result = subprocess.run(
        ["gphoto2", "--set-config", f"iso={iso}"],
        check=False,
        capture_output=True,
        text=True,
    )
    if command_result.returncode != 0:
        raise ImageCaptureError("Image was not captured")


def show_dslr_preview(preview_seconds: int) -> None:
    # Det tar ca. 1 sekunder før det preview dukker opp, så vi legger det til
    gphoto2_command = f"gphoto2 --capture-movie={preview_seconds + 1}s --stdout"
    common_ffplay_parameters = " ".join(get_common_ffplay_parameters())
    ffplay_command = (
        "ffplay -fs -fflags nobuffer -flags low_delay -framedrop -vf setpts=0 "
        f"{common_ffplay_parameters} -f mjpeg -i - -autoexit"
    )

    full_command = f"{gphoto2_command} | {ffplay_command}"
    subprocess.run(
        full_command,
        shell=True,
        check=False,
    )


def configure_dslr_capture_target() -> None:
    # Save captures to the camera card so the raw file remains on the camera.
    command_result = subprocess.run(
        ["gphoto2", "--set-config", "capturetarget=1"],
        check=False,
        capture_output=True,
        text=True,
    )
    if command_result.returncode != 0:
        raise ImageCaptureError("Image was not captured")


def capture_dslr_still(base_image_path: str) -> None:
    # Download the image for the app while keeping the raw file on the camera.
    command_result = subprocess.run(
        ["gphoto2", "--capture-image-and-download", "--filename", f"{base_image_path}.%C", "--keep-raw"],
        check=False,
        capture_output=True,
        text=True,
    )

    if command_result.returncode != 0:
        raise ImageCaptureError("Image was not captured")


def capture_dslr_image(camera_config: CameraConfig, base_image_path: str) -> None:
    try:
        overlay_process = show_overlay(camera_config.overlay_image)
    except OSError:
        overlay_process = None

    try:
        set_dslr_iso(camera_config.dslr_preview_iso)
        show_dslr_preview(camera_config.preview_seconds)
        configure_dslr_capture_target()
        set_dslr_iso(camera_config.dslr_capture_iso)
        capture_dslr_still(base_image_path)
    finally:
        stop_process(overlay_process)

from pathlib import Path
import platform
import subprocess
import pyautogui


def get_display_size() -> tuple[int, int]:
    default_width = 1920
    default_height = 1080

    try:
        width, height = pyautogui.size()

        if width <= 0 or height <= 0:
            return (default_width, default_height)

        return (width, height)
    except Exception:
        return (default_width, default_height)


def get_common_ffplay_parameters() -> list[str]:
    width, height = get_display_size()

    return [
        "-window_title",
        "BildeBua",
        "-noborder",
        "-left",
        "0",
        "-top",
        "0",
        "-x",
        str(width),
        "-y",
        str(height),
        "-loglevel",
        "warning",
        "-probesize",
        "32",
        "-analyzeduration",
        "0",
    ]


def show_overlay(overlay_image: str) -> subprocess.Popen[str]:
    overlay_path = Path(__file__).resolve().parent / "media" / f"{overlay_image}.png"
    width, height = get_display_size()
    centered_overlay_filter = (
        f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2"
    )

    return subprocess.Popen(
        [
            "ffplay",
            *get_common_ffplay_parameters(),
            "-vf",
            centered_overlay_filter,
            "-loop",
            "1",
            str(overlay_path),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )


def stop_process(process: subprocess.Popen[str] | subprocess.Popen[bytes] | None) -> None:
    if process is None:
        return

    try:
        process.terminate()
        process.wait(timeout=2)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=2)
    except Exception:
        process.kill()
        process.wait(timeout=2)


def get_frontmost_app_on_mac() -> str | None:
    """Return the name of the frontmost application, or None if unavailable."""
    if platform.system() != "Darwin":
        return None
    try:
        result = subprocess.run(
            ["osascript", "-e", 'tell application "System Events" to get name of first process whose frontmost is true'],
            capture_output=True,
            text=True,
            timeout=3,
        )
        name = result.stdout.strip()
        return name if name else None
    except Exception:
        return None


def restore_fullscreen_on_mac(app_name: str | None) -> None:
    """Re-activate the given app and toggle fullscreen with Ctrl+Cmd+F."""
    if platform.system() != "Darwin" or not app_name:
        return
    try:
        script = f'''
tell application "{app_name}" to activate
delay 0.5
tell application "System Events"
    keystroke "f" using {{command down, control down}}
end tell
'''
        subprocess.run(
            ["osascript", "-e", script],
            capture_output=True,
            timeout=5,
        )
    except Exception:
        pass


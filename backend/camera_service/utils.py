from pathlib import Path
import subprocess


def get_common_ffplay_parameters() -> list[str]:
    return [
        "-window_title",
        "CameraHub",
        "-noborder",
        "-left",
        "0",
        "-top",
        "0",
        "-x",
        "1920",
        "-y",
        "1080",
        "-loglevel",
        "warning",
        "-probesize",
        "32",
        "-analyzeduration",
        "0",
    ]


def show_overlay() -> subprocess.Popen[str]:
    overlay_path = Path(__file__).resolve().parent / "media" / "smil_for_faen.png"

    return subprocess.Popen(
        [
            "ffplay",
            *get_common_ffplay_parameters(),
            "-loop",
            "1",
            str(overlay_path),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )


def stop_process(process: subprocess.Popen[str] | None) -> None:
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

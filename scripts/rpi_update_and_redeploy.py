import argparse
import os
import subprocess
from backend.core.config_loader import load_config
from scripts.rpi_deploy import (
    create_systemd_config_file_content,
    ensure_static_permissions,
    get_systemd_file_path,
    start_or_restart_systemd_process
)
from scripts.shared.utils import build_frontend


def run_update_and_redeploy(config_file: str, skip_frontend_build: bool) -> None:
    if os.geteuid() != 0:
        print("The update and redploy script must be run as root.")
        print("Run script with \"sudo .venv/bin/python -m scripts.rpi_update_and_redeploy\"")
        return

    subprocess.run("git reset --hard HEAD", shell=True)
    subprocess.run("git pull", shell=True)
    config_manager = load_config(config_file)
    static_folder_name = config_manager.config.static_folder_name
    if not skip_frontend_build:
        build_frontend(static_folder_name)

    systemd_file_path = get_systemd_file_path()
    systemd_file_content = create_systemd_config_file_content(config_file)
    with open(systemd_file_path, "w") as f:
        f.write(systemd_file_content)

    print("--------Systemd file is--------")
    print(systemd_file_content)
    print("-------------------------------")

    ensure_static_permissions(static_folder_name)
    start_or_restart_systemd_process()
    print("System started")
    print("To get system status, run \"sudo systemctl status bildebua\"")
    print("To get last log lines, run \"journalctl --unit=bildebua -n 100 --no-pager\"")
    print("To stop the deployment, run \"sudo systemctl stop bildebua\"")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update repo and redeploy BildeBua.")
    parser.add_argument(
        "--config-file",
        default="config.json",
        help="Path to config.json file to use for the systemd service."
    )
    parser.add_argument(
        "--skip-frontend-build",
        action="store_true",
        help="Skip rebuilding frontend assets."
    )
    args = parser.parse_args()
    run_update_and_redeploy(args.config_file, args.skip_frontend_build)

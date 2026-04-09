import json
import os
from pathlib import Path
from typing import Any

from .config import Config


def deep_merge(base: dict, overrides: dict) -> dict:
    """Recursively merge overrides into base dict. Modifies base in-place and returns it."""
    for key, value in overrides.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            deep_merge(base[key], value)
        else:
            base[key] = value
    return base


class ConfigManager:
    def __init__(self, config_json_path: str = "config.json"):
        self._path = config_json_path
        if not os.path.exists(self._path):
            default_config = Config()
            self._write(default_config.model_dump())
        self._config = self._load()

    @property
    def config(self) -> Config:
        return self._config

    def save_and_reload(self, overrides: dict[str, Any]) -> Config:
        """Deep-merge overrides into config.json, then reload."""
        current = self._read_json()
        deep_merge(current, overrides)
        self._write(current)
        self._config = self._load()
        return self._config

    def _load(self) -> Config:
        data = self._read_json()
        return Config.model_validate(data)

    def _read_json(self) -> dict:
        return json.loads(Path(self._path).read_text())

    def _write(self, data: dict) -> None:
        Path(self._path).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")

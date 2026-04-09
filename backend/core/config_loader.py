from pydantic import ValidationError
from .config_manager import ConfigManager


def load_config(config_json_path: str = "config.json") -> ConfigManager:
    try:
        return ConfigManager(config_json_path)
    except ValidationError as exc:
        raise ValueError(f"Invalid config: {exc}") from exc

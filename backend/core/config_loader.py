import json
import os
from typing import Any, Dict
from pydantic import ValidationError
from .settings import Settings


def load_settings(config_path: str = os.path.join("configs", "config.json")) -> Settings:
    if not os.path.exists(config_path):
        raise FileNotFoundError(
            f"Config file not found at {config_path}. Create it based on configs/example_config.json."
        )
    with open(config_path, "r") as f:
        raw: Dict[str, Any] = json.loads(f.read())

    try:
        return Settings.model_validate(raw)
    except ValidationError as exc:
        raise ValueError(f"Invalid config: {exc}") from exc

import os
import tempfile
from backend.core.config import Config
from backend.core.config_manager import ConfigManager


def temp_dir_relpath(temp_dir: tempfile.TemporaryDirectory) -> str:
    """Return a stable relative path for a TemporaryDirectory."""
    return os.path.relpath(temp_dir.name, ".")


def config_manager_from_config(config: Config) -> ConfigManager:
    """Create a ConfigManager wrapping an existing Config without touching the filesystem."""
    cm = ConfigManager.__new__(ConfigManager)
    cm._config = config
    cm._path = ""
    return cm

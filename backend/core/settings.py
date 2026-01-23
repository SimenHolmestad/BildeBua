from typing import Optional, Dict, Any
import copy
from pydantic import BaseModel, Field, model_validator


class WifiSettings(BaseModel):
    enabled: bool = True
    name: str = ""
    protocol: str = ""
    password: str = ""
    description: str = ""

    @model_validator(mode="after")
    def _validate_wifi_fields(self) -> "WifiSettings":
        if self.enabled:
            missing = [
                key for key, value in (
                    ("name", self.name),
                    ("protocol", self.protocol),
                    ("password", self.password),
                    ("description", self.description),
                )
                if not value
            ]
            if missing:
                raise ValueError(f"Missing wifi config fields: {', '.join(missing)}")
        return self


class QrCodeSettings(BaseModel):
    use_center_images: bool = True
    wifi: WifiSettings = Field(default_factory=WifiSettings)


DEFAULT_CAMERA_MODULES: Dict[str, Dict[str, Any]] = {
    "dummy": {
        "file_extension": ".png",
        "needs_raw_file_transfer": False,
        "raw_file_extension": None
    },
    "rpicam": {
        "file_extension": ".jpg",
        "needs_raw_file_transfer": False,
        "raw_file_extension": None
    },
    "dslr_jpg": {
        "file_extension": ".jpg",
        "needs_raw_file_transfer": False,
        "raw_file_extension": None
    },
    "dslr_raw": {
        "file_extension": ".jpg",
        "needs_raw_file_transfer": False,
        "raw_file_extension": None
    },
    "dslr_raw_transfer": {
        "file_extension": ".jpg",
        "needs_raw_file_transfer": True,
        "raw_file_extension": ".cr2"
    }
}


class CameraSettings(BaseModel):
    module: str = "dummy"
    options: Dict[str, Any] = Field(default_factory=dict)
    modules: Dict[str, Dict[str, Any]] = Field(
        default_factory=lambda: copy.deepcopy(DEFAULT_CAMERA_MODULES)
    )


class AlbumSettings(BaseModel):
    forced_album: Optional[str] = None


class Settings(BaseModel):
    static_folder_name: str = "static"
    albums: AlbumSettings = Field(default_factory=AlbumSettings)
    camera: CameraSettings = Field(default_factory=CameraSettings)
    qr_codes: QrCodeSettings = Field(default_factory=QrCodeSettings)

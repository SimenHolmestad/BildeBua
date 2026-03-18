from typing import Optional, Literal
from pydantic import BaseModel, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class WifiConfig(BaseModel):
    enabled: bool = False
    wifi_name: str = ""
    protocol: str = ""
    password: str = ""
    description: str = ""

    @model_validator(mode="after")
    def _validate_wifi_fields(self) -> "WifiConfig":
        if self.enabled:
            missing = [
                key for key, value in (
                    ("wifi_name", self.wifi_name),
                    ("protocol", self.protocol),
                    ("password", self.password),
                    ("description", self.description),
                )
                if not value
            ]
            if missing:
                raise ValueError(f"Missing wifi config fields: {', '.join(missing)}")
        return self


class QrCodeConfig(BaseModel):
    use_center_images: bool = True


class DummyCameraConfig(BaseModel):
    width: int = 1200
    height: int = 800
    number_of_circles: int = 80
    min_circle_radius: int = 30
    max_circle_radius: int = 80
    seed: Optional[int] = None
    should_fail: bool = False
    error_message: str = "This is a test error message"


class CameraConfig(BaseModel):
    camera_type: Literal["dslr", "rpicam", "webcam", "dummy"] = "dummy"
    preview_seconds: int = Field(default=3, ge=0)
    overlay_image: Literal["smil", "smil_for_faen"] = "smil"
    dslr_preview_iso: int = Field(default=4000, gt=0)
    dslr_capture_iso: int = Field(default=200, gt=0)
    verbose_errors: bool = True
    dummy_config: DummyCameraConfig = Field(default_factory=DummyCameraConfig)


class AlbumConfig(BaseModel):
    forced_album: Optional[str] = None
    albums_dir: str

    @model_validator(mode="after")
    def _validate_albums_dir(self) -> "AlbumConfig":
        normalized_albums_dir = self.albums_dir.replace("\\", "/")
        if not normalized_albums_dir.startswith("backend/static/"):
            raise ValueError("albums_dir must start with 'backend/static/'")
        self.albums_dir = normalized_albums_dir
        return self


class Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="BILDEBUA_",
        env_nested_delimiter="__",
        extra="ignore",
    )
    static_folder_name: str = "static"
    albums: AlbumConfig = Field(default_factory=AlbumConfig)
    camera: CameraConfig = Field(default_factory=CameraConfig)
    qr_codes: QrCodeConfig = Field(default_factory=QrCodeConfig)
    wifi_qr_code: WifiConfig = Field(default_factory=WifiConfig)

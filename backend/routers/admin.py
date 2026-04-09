from typing import Optional
from fastapi import APIRouter, Path, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError
from backend.album_service.album_service import AlbumService, AlbumNotFoundError, ImageNotFoundError
from backend.camera_service import CameraService
from backend.core.config import CameraConfig, QrCodeConfig, WifiConfig
from backend.core.config_manager import ConfigManager
from backend.routers.albums import AlbumInfoResponse, AlbumImageResponse, _albums_url_prefix_from_dir, _relative_url, _image_number_from_filename


class AdminConfigResponse(BaseModel):
    camera: CameraConfig
    forced_album: Optional[str]
    qr_codes: QrCodeConfig
    wifi_qr_code: WifiConfig


class AdminConfigUpdateRequest(BaseModel):
    camera: Optional[CameraConfig] = None
    forced_album: Optional[str] = Field(default=None, description="Set to empty string to clear forced album.")
    qr_codes: Optional[QrCodeConfig] = None
    wifi_qr_code: Optional[WifiConfig] = None


class ErrorResponse(BaseModel):
    error: str = Field(description="Human-readable error message.")


def construct_admin_api_router(
    config_manager: ConfigManager,
    album_service: AlbumService,
    camera_service: CameraService
) -> APIRouter:
    admin_router = APIRouter(tags=["admin"])

    @admin_router.get(
        "/config",
        response_model=AdminConfigResponse,
        operation_id="get_admin_config",
        summary="Get current configuration",
    )
    def get_config() -> AdminConfigResponse:
        config = config_manager.config
        return AdminConfigResponse(
            camera=config.camera,
            forced_album=config.albums.forced_album,
            qr_codes=config.qr_codes,
            wifi_qr_code=config.wifi_qr_code,
        )

    @admin_router.put(
        "/config",
        response_model=AdminConfigResponse,
        operation_id="update_admin_config",
        summary="Update configuration",
        responses={
            status.HTTP_422_UNPROCESSABLE_CONTENT: {
                "model": ErrorResponse,
                "description": "Invalid configuration values."
            }
        }
    )
    def update_config(request_body: AdminConfigUpdateRequest) -> AdminConfigResponse:
        overrides: dict = {}

        if request_body.camera is not None:
            overrides["camera"] = request_body.camera.model_dump()

        if request_body.forced_album is not None:
            forced_value = request_body.forced_album if request_body.forced_album != "" else None
            overrides.setdefault("albums", {})["forced_album"] = forced_value

        if request_body.qr_codes is not None:
            overrides["qr_codes"] = request_body.qr_codes.model_dump()

        if request_body.wifi_qr_code is not None:
            overrides["wifi_qr_code"] = request_body.wifi_qr_code.model_dump()

        try:
            new_config = config_manager.save_and_reload(overrides)
        except (ValidationError, ValueError) as exc:
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                content={"error": str(exc)}
            )

        # Update camera service config for immediate effect
        camera_service.camera_config = new_config.camera

        return AdminConfigResponse(
            camera=new_config.camera,
            forced_album=new_config.albums.forced_album,
            qr_codes=new_config.qr_codes,
            wifi_qr_code=new_config.wifi_qr_code,
        )

    @admin_router.delete(
        "/albums/{album_name}/images/{image_number}",
        operation_id="delete_admin_image",
        summary="Delete an image from an album",
        responses={
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album or image not found."
            }
        }
    )
    def delete_image(
        album_name: str = Path(..., description="Album name."),
        image_number: int = Path(..., description="Image number to delete.")
    ) -> dict:
        try:
            album_service.delete_image(album_name, image_number)
        except AlbumNotFoundError:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": f"Album \"{album_name}\" not found."}
            )
        except ImageNotFoundError:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": f"Image {image_number} not found in album \"{album_name}\"."}
            )

        return {"success": f"Image {image_number} deleted from album \"{album_name}\"."}

    @admin_router.delete(
        "/albums/{album_name}",
        operation_id="delete_admin_album",
        summary="Delete an album",
        responses={
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album not found."
            }
        }
    )
    def delete_album(
        album_name: str = Path(..., description="Album name.")
    ) -> dict:
        try:
            album_service.delete_album(album_name)
        except AlbumNotFoundError:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": f"Album \"{album_name}\" not found."}
            )

        return {"success": f"Album \"{album_name}\" deleted."}

    @admin_router.get(
        "/albums/{album_name}",
        response_model=AlbumInfoResponse,
        operation_id="get_admin_album_info",
        summary="Get album details (admin, bypasses forced album)",
        responses={
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album not found."
            }
        }
    )
    def get_album_info(
        request: Request,
        album_name: str = Path(..., description="Album name.")
    ) -> AlbumInfoResponse | JSONResponse:
        if not album_service.album_exists(album_name):
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"error": f"Album \"{album_name}\" not found."}
            )

        albums_url_prefix = _albums_url_prefix_from_dir(config_manager.config.albums.albums_dir)
        description = album_service.get_album_description(album_name)
        image_names = album_service.get_image_names(album_name)
        thumbnail_names = album_service.get_thumbnail_names(album_name)
        image_names_by_number = {
            num: name for name in image_names
            for num in [_image_number_from_filename(name)] if num is not None
        }
        thumbnail_names_by_number = {
            num: name for name in thumbnail_names
            for num in [_image_number_from_filename(name)] if num is not None
        }
        available_numbers = sorted(set(image_names_by_number) & set(thumbnail_names_by_number))

        def static_url(relative: str) -> str:
            return request.url_for("static", path=relative).path

        return AlbumInfoResponse(
            album_name=album_name,
            description=description,
            images=[
                AlbumImageResponse(
                    image_number=n,
                    image_url=static_url(_relative_url(albums_url_prefix, album_name, "images", image_names_by_number[n])),
                    thumbnail_url=static_url(_relative_url(albums_url_prefix, album_name, "thumbnails", thumbnail_names_by_number[n])),
                )
                for n in available_numbers
            ],
        )

    return admin_router

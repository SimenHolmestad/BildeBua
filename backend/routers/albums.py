import re
from typing import List, Optional
from fastapi import APIRouter, Path, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from backend.camera_service import CameraService, ImageCaptureError
from backend.album_service.album_service import AlbumService
from backend.core.config import Config


class AlbumCreateRequest(BaseModel):
    album_name: str = Field(
        description="Name of the album to create or update.",
        examples=["album1"]
    )
    description: Optional[str] = Field(
        default=None,
        description="Optional album description.",
        examples=["A very nice album indeed"]
    )


class AlbumCreatedResponse(BaseModel):
    album_name: str = Field(description="Created or updated album name.", examples=["album1"])
    album_url: str = Field(description="Relative URL to the album resource.", examples=["/albums/album1"])


class AvailableAlbumsResponse(BaseModel):
    available_albums: List[str] = Field(
        description="All available album names.",
        examples=[["album1", "album2"]]
    )
    forced_album: Optional[str] = Field(
        default=None,
        description="If set, this is the only album allowed for write/read operations.",
        examples=["album1"]
    )


class AlbumImageResponse(BaseModel):
    image_number: int = Field(description="Image number extracted from filename.")
    image_url: str = Field(description="URL of the image.")
    thumbnail_url: str = Field(description="URL of the image thumbnail.")


class AlbumInfoResponse(BaseModel):
    album_name: str = Field(description="Album name.", examples=["album1"])
    description: str = Field(description="Album description.", examples=["A very nice album indeed"])
    images: List[AlbumImageResponse] = Field(
        description="Image and thumbnail URLs grouped in a list with image numbers.",
        examples=[[{
            "image_number": 1,
            "image_url": "/static/albums/album1/images/image0001.png",
            "thumbnail_url": "/static/albums/album1/thumbnails/image0001.jpg"
        }, {
            "image_number": 2,
            "image_url": "/static/albums/album1/images/image0002.png",
            "thumbnail_url": "/static/albums/album1/thumbnails/image0002.jpg"
        }]]
    )


class AlbumCaptureResponse(BaseModel):
    success: str = Field(description="Status message for a successful capture.")
    image_url: str = Field(description="URL of the captured image.")
    thumbnail_url: str = Field(description="URL of the generated image thumbnail.")


class LastImageResponse(BaseModel):
    last_image_url: str = Field(
        description="URL of the latest image in the album.",
        examples=["/static/albums/album1/images/image0001.png"]
    )


class ErrorResponse(BaseModel):
    error: str = Field(description="Human-readable error message.")


def construct_album_api_router(config: Config) -> APIRouter:
    """Construct album-related API routes."""
    album_api_router = APIRouter(tags=["albums"])
    album_service = AlbumService(config.albums, CameraService(config.camera))
    forced_album_name = config.albums.forced_album
    albums_dir = config.albums.albums_dir
    albums_url_prefix = _albums_url_prefix_from_dir(albums_dir)

    @album_api_router.get(
        "/",
        response_model=AvailableAlbumsResponse,
        operation_id="list_albums",
        summary="List available albums",
        description="Return all available albums and the active forced album restriction."
    )
    def available_albums() -> AvailableAlbumsResponse:
        return get_available_albums()

    @album_api_router.post(
        "/",
        response_model=AlbumCreatedResponse,
        operation_id="create_album",
        summary="Create or update album",
        description=(
            "Create the album if it does not exist. "
            "If `description` is provided, update the album description."
        ),
        responses={
            status.HTTP_403_FORBIDDEN: {
                "model": ErrorResponse,
                "description": "Write access is blocked because a forced album is configured."
            }
        }
    )
    def create_album(request_body: AlbumCreateRequest, request: Request) -> AlbumCreatedResponse | JSONResponse:
        return create_or_update_album(request_body, request)

    @album_api_router.get(
        "/{album_name}",
        name="album_info",
        response_model=AlbumInfoResponse,
        operation_id="get_album_info",
        summary="Get album details",
        description="Return album metadata and image/thumbnail URLs as numbered image entries.",
        responses={
            status.HTTP_403_FORBIDDEN: {
                "model": ErrorResponse,
                "description": "Requested album is not accessible due to forced album configuration."
            },
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album does not exist."
            }
        }
    )
    def album_info(
        request: Request,
        album_name: str = Path(..., description="Album name.", examples=["album1"])
    ) -> AlbumInfoResponse | JSONResponse:
        if forced_album_name and album_name != forced_album_name:
            return unaccessible_album_error_message()

        if not album_service.album_exists(album_name):
            return error_response(
                status.HTTP_404_NOT_FOUND,
                f"No album with the name \"{album_name}\" exists"
            )

        return get_album_information(request, album_name)

    @album_api_router.post(
        "/{album_name}",
        response_model=AlbumCaptureResponse,
        operation_id="capture_image_to_album",
        summary="Capture image to album",
        description="Capture one image with the configured camera and add it to the album.",
        responses={
            status.HTTP_403_FORBIDDEN: {
                "model": ErrorResponse,
                "description": "Requested album is not accessible due to forced album configuration."
            },
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album does not exist."
            },
            status.HTTP_500_INTERNAL_SERVER_ERROR: {
                "model": ErrorResponse,
                "description": "Image capture failed."
            }
        }
    )
    def capture_album_image(
        request: Request,
        album_name: str = Path(..., description="Album name.", examples=["album1"])
    ) -> AlbumCaptureResponse | JSONResponse:
        if forced_album_name and album_name != forced_album_name:
            return unaccessible_album_error_message()

        if not album_service.album_exists(album_name):
            return error_response(
                status.HTTP_404_NOT_FOUND,
                f"No album with the name \"{album_name}\" exists"
            )

        return try_capture_image_to_album(request, album_name)

    @album_api_router.get(
        "/{album_name}/last_image",
        response_model=LastImageResponse,
        operation_id="get_album_last_image",
        summary="Get latest album image",
        description="Return the URL for the latest captured image in an album.",
        responses={
            status.HTTP_403_FORBIDDEN: {
                "model": ErrorResponse,
                "description": "Requested album is not accessible due to forced album configuration."
            },
            status.HTTP_404_NOT_FOUND: {
                "model": ErrorResponse,
                "description": "Album does not exist or has no images yet."
            }
        }
    )
    def last_image_for_album(
        request: Request,
        album_name: str = Path(..., description="Album name.", examples=["album1"])
    ) -> LastImageResponse | JSONResponse:
        if forced_album_name and album_name != forced_album_name:
            return unaccessible_album_error_message()

        if not album_service.album_exists(album_name):
            return error_response(
                status.HTTP_404_NOT_FOUND,
                f"No album with the name \"{album_name}\" exists"
            )

        image_name = album_service.get_last_image_name(album_name)
        if not image_name:
            return error_response(status.HTTP_404_NOT_FOUND, "album is empty")

        return LastImageResponse(
            last_image_url=create_static_url(
                request,
                _relative_url(albums_url_prefix, album_name, "images", image_name)
            )
        )

    def create_or_update_album(
        request_body: AlbumCreateRequest,
        request: Request
    ) -> AlbumCreatedResponse | JSONResponse:
        if forced_album_name:
            return unaccessible_album_error_message()

        album_name = request_body.album_name
        album_service.get_or_create_album(album_name)

        if request_body.description is not None:
            album_service.set_album_description(album_name, request_body.description)

        return AlbumCreatedResponse(
            album_name=album_name,
            album_url=request.url_for("album_info", album_name=album_name).path
        )

    def get_available_albums() -> AvailableAlbumsResponse:
        album_names = album_service.get_available_album_names()
        return AvailableAlbumsResponse(available_albums=album_names, forced_album=forced_album_name)

    def try_capture_image_to_album(
        request: Request,
        album_name: str
    ) -> AlbumCaptureResponse | JSONResponse:
        try:
            return capture_image_to_album(request, album_name)
        except ImageCaptureError as e:
            return error_response(status.HTTP_500_INTERNAL_SERVER_ERROR, str(e))

    def capture_image_to_album(request: Request, album_name: str) -> AlbumCaptureResponse:
        album_service.capture_image_to_album(album_name)
        image_name = album_service.get_last_image_name(album_name) or ""
        thumbnail_name = album_service.get_last_thumbnail_name(album_name) or ""

        return AlbumCaptureResponse(
            success="Image successfully captured",
            image_url=create_static_url(
                request,
                _relative_url(albums_url_prefix, album_name, "images", image_name)
            ),
            thumbnail_url=create_static_url(
                request,
                _relative_url(albums_url_prefix, album_name, "thumbnails", thumbnail_name)
            )
        )

    def get_album_information(request: Request, album_name: str) -> AlbumInfoResponse:
        description = album_service.get_album_description(album_name)
        image_names = album_service.get_image_names(album_name)
        thumbnail_names = album_service.get_thumbnail_names(album_name)
        image_names_by_number = {
            image_number: image_name
            for image_name in image_names
            for image_number in [_image_number_from_filename(image_name)]
            if image_number is not None
        }
        thumbnail_names_by_number = {
            image_number: thumbnail_name
            for thumbnail_name in thumbnail_names
            for image_number in [_image_number_from_filename(thumbnail_name)]
            if image_number is not None
        }
        available_numbers = sorted(set(image_names_by_number).intersection(thumbnail_names_by_number))

        return AlbumInfoResponse(
            album_name=album_name,
            images=[
                AlbumImageResponse(
                    image_number=image_number,
                    image_url=create_static_url(
                        request,
                        _relative_url(
                            albums_url_prefix,
                            album_name,
                            "images",
                            image_names_by_number[image_number]
                        )
                    ),
                    thumbnail_url=create_static_url(
                        request,
                        _relative_url(
                            albums_url_prefix,
                            album_name,
                            "thumbnails",
                            thumbnail_names_by_number[image_number]
                        )
                    )
                )
                for image_number in available_numbers
            ],
            description=description,
        )

    def create_static_url(request: Request, relative_url: str) -> str:
        return request.url_for("static", path=relative_url).path

    def unaccessible_album_error_message() -> JSONResponse:
        return error_response(
            status.HTTP_403_FORBIDDEN,
            f"Illegal operation. The only accessible album is {forced_album_name}."
        )

    def error_response(status_code: int, message: str) -> JSONResponse:
        return JSONResponse(status_code=status_code, content={"error": message})

    return album_api_router


def _albums_url_prefix_from_dir(albums_dir: str) -> str:
    normalized = albums_dir.replace("\\", "/").rstrip("/")
    if not normalized:
        return ""
    return normalized.split("/")[-1]


def _relative_url(prefix: str, album_name: str, folder_name: str, filename: str) -> str:
    return "/".join(filter(None, [prefix, album_name, folder_name, filename]))


IMAGE_FILENAME_PATTERN = re.compile(r"^image(\d+)\.[^.]+$")


def _image_number_from_filename(filename: str) -> Optional[int]:
    match = IMAGE_FILENAME_PATTERN.match(filename)
    if not match:
        return None
    return int(match.group(1))

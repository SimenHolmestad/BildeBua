import os
from typing import Any
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse, Response
from backend.routers.albums import construct_album_api_router
from backend.routers.admin import construct_admin_api_router
from backend.album_service.album_service import AlbumService
from backend.camera_service import CameraService
from backend.core.config_manager import ConfigManager


def create_app(
    static_folder_path: str,
    config_manager: ConfigManager,
) -> FastAPI:
    app = FastAPI(
        title="BildeBua API",
        version="1.0.0",
        description="API for managing albums, images, and QR codes."
    )
    if not os.path.exists(static_folder_path):
        raise RuntimeError(f"Static folder path '{static_folder_path}' does not exist")

    config = config_manager.config
    camera_service = CameraService(config.camera)
    album_service = AlbumService(config.albums, camera_service)

    app.include_router(
        construct_album_api_router(config_manager, album_service),
        prefix="/albums"
    )

    app.include_router(
        construct_admin_api_router(config_manager, album_service, camera_service),
        prefix="/admin"
    )

    app.mount(
        "/static",
        StaticFiles(directory=static_folder_path),
        name="static"
    )

    @app.get("/", include_in_schema=False)
    @app.get("/{path:path}", include_in_schema=False)
    def index(path: str) -> Any:
        react_index = os.path.join(static_folder_path, "react", "index.html")
        if os.path.exists(react_index):
            return FileResponse(react_index)
        return Response(status_code=404)

    return app

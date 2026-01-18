import os
from typing import Any, Optional
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse, Response
from backend.api.albums.router import construct_album_api_router
from backend.api.qr_codes.router import construct_qr_code_api_router
from backend.album_service.album_service import DEFAULT_ALBUMS_DIR


def create_app(
    static_folder_name: str,
    camera_module: Any,
    qr_code_handler: Any,
    forced_album_name: Optional[str] = None
) -> FastAPI:
    app = FastAPI(
        title="CameraHub API",
        version="1.0.0",
        description="API for managing albums, images, and QR codes."
    )
    static_folder_path = static_folder_name
    if not os.path.exists(static_folder_path):
        static_folder_path = os.path.join("backend", static_folder_name)

    app.include_router(construct_album_api_router(
        static_folder_path,
        DEFAULT_ALBUMS_DIR,
        camera_module,
        forced_album_name=forced_album_name
    ), prefix="/albums")

    app.include_router(construct_qr_code_api_router(
        qr_code_handler
    ), prefix="/qr_codes")

    app.mount(
        f"/{static_folder_name}",
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

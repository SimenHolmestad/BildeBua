from typing import Any
from fastapi import APIRouter, Request


def construct_qr_code_api_router(qr_code_handler: Any) -> APIRouter:
    """Construct routes related to accessing qr-codes."""
    qr_code_api_router = APIRouter()

    @qr_code_api_router.get("/")
    def get_qr_codes(request: Request) -> Any:
        qr_codes = qr_code_handler.get_qr_codes()
        qr_code_dicts = list(map(
            lambda qr_code: {
                "name": qr_code.get_name(),
                "information": qr_code.get_information_text(),
                "url": request.url_for("static", path=qr_code.get_relative_url()).path
            },
            qr_codes
        ))

        return {
            "qr_codes": qr_code_dicts
        }

    return qr_code_api_router

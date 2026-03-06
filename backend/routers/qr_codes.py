from typing import Any, Iterable, List, Mapping
from fastapi import APIRouter, Request
from pydantic import BaseModel, Field


class QrCodeResponse(BaseModel):
    name: str = Field(description="QR code identifier.", examples=["wifi_qr_code"])
    information: str = Field(
        description="Text displayed alongside the QR code.",
        examples=["Scan this qr code to connect to the wifi!"]
    )
    url: str = Field(description="URL to the QR code image.", examples=["/static/qr_codes/wifi_qr_code.png"])


class QrCodesResponse(BaseModel):
    qr_codes: List[QrCodeResponse] = Field(description="All available QR codes.")


def construct_qr_code_api_router(qr_codes: Iterable[Mapping[str, str]]) -> APIRouter:
    """Construct routes related to accessing qr-codes."""
    qr_code_api_router = APIRouter(tags=["qr_codes"])

    @qr_code_api_router.get(
        "/",
        response_model=QrCodesResponse,
        operation_id="get_qr_codes",
        summary="List QR codes",
        description="Return all generated QR codes with display text and static image URLs."
    )
    def get_qr_codes(request: Request) -> Any:
        qr_code_dicts = [
            {
                "name": qr_code["name"],
                "information": qr_code["information"],
                "url": request.url_for("static", path=qr_code["relative_url"]).path
            }
            for qr_code in qr_codes
        ]

        return {
            "qr_codes": qr_code_dicts
        }

    return qr_code_api_router

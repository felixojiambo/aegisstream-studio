from datetime import datetime, timezone

from fastapi import APIRouter, Request

from app.schemas.contracts import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    settings = request.app.state.settings
    return HealthResponse(
        service=settings.service_name,
        version=settings.service_version,
        environment=settings.environment,
        status="ok",
        timestamp=datetime.now(timezone.utc),
    )

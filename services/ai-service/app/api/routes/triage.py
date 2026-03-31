from fastapi import APIRouter, Request

from app.schemas.contracts import TriageRequest, TriageResponse

router = APIRouter(prefix="/triage", tags=["triage"])


@router.post("/run", response_model=TriageResponse)
async def run_triage(
    payload: TriageRequest,
    request: Request,
) -> TriageResponse:
    service = request.app.state.orchestration
    return await service.run_triage(payload)

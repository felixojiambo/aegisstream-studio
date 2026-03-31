from fastapi import APIRouter, Request

from app.schemas.contracts import RetrieveEvidenceRequest, RetrieveEvidenceResponse

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.post("/retrieve", response_model=RetrieveEvidenceResponse)
async def retrieve_evidence(
    payload: RetrieveEvidenceRequest,
    request: Request,
) -> RetrieveEvidenceResponse:
    service = request.app.state.orchestration
    return await service.retrieve_evidence(payload)

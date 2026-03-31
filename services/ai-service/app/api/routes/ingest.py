from fastapi import APIRouter, Request, status

from app.schemas.contracts import DocumentIngestRequest, DocumentIngestResponse

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/ingest",
    response_model=DocumentIngestResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def ingest_document(
    payload: DocumentIngestRequest,
    request: Request,
) -> DocumentIngestResponse:
    service = request.app.state.orchestration
    return await service.ingest_document(payload)

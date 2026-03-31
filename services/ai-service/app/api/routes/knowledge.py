from uuid import UUID

from fastapi import APIRouter, HTTPException, Request

from app.schemas.contracts import (
    KnowledgeDocumentListResponse,
    SetKnowledgeDocumentStatusRequest,
    SetKnowledgeDocumentStatusResponse,
)

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.get("/documents", response_model=KnowledgeDocumentListResponse)
async def list_knowledge_documents(request: Request) -> KnowledgeDocumentListResponse:
    service = request.app.state.orchestration
    return await service.knowledge_service.list_documents()


@router.patch(
    "/documents/{knowledge_document_id}",
    response_model=SetKnowledgeDocumentStatusResponse,
)
async def set_knowledge_document_status(
    knowledge_document_id: UUID,
    payload: SetKnowledgeDocumentStatusRequest,
    request: Request,
) -> SetKnowledgeDocumentStatusResponse:
    service = request.app.state.orchestration

    try:
        return await service.knowledge_service.set_active(
            knowledge_document_id,
            payload.is_active,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

from uuid import UUID

from fastapi import APIRouter, HTTPException, Request, status

from app.core.db import get_db_connection
from app.schemas.contracts import (
    DocumentIngestRequest,
    DocumentIngestResponse,
    DocumentProcessingJobResponse,
    RetryDocumentRequest,
    RetryDocumentResponse,
)

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


@router.post(
    "/retry",
    response_model=RetryDocumentResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def retry_document(
    payload: RetryDocumentRequest,
    request: Request,
) -> RetryDocumentResponse:
    service = request.app.state.orchestration

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select id, case_id, storage_bucket, storage_path, mime_type
                from public.documents
                where id = %s
                """,
                (payload.document_id,),
            )
            row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Document not found.")

    ingest_payload = DocumentIngestRequest(
        document_id=row[0],
        case_id=row[1],
        storage_bucket=row[2],
        storage_path=row[3],
        mime_type=row[4],
        requested_by=payload.requested_by,
        force_reprocess=True,
        process_inline=True,
        correlation_id=payload.correlation_id,
    )

    return await service.retry_document(ingest_payload)


@router.get(
    "/jobs/{document_id}",
    response_model=DocumentProcessingJobResponse,
)
async def get_document_job(document_id: UUID) -> DocumentProcessingJobResponse:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select
                  id,
                  document_id,
                  status,
                  attempt_count,
                  last_error,
                  started_at,
                  completed_at,
                  created_at,
                  updated_at
                from public.document_processing_jobs
                where document_id = %s
                """,
                (document_id,),
            )
            row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Job not found.")

    return DocumentProcessingJobResponse(
        job_id=row[0],
        document_id=row[1],
        status=row[2],
        attempt_count=row[3],
        last_error=row[4],
        started_at=row[5],
        completed_at=row[6],
        created_at=row[7],
        updated_at=row[8],
    )

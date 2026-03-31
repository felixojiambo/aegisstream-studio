from dataclasses import dataclass
from uuid import UUID

from app.core.config import get_settings
from app.core.db import get_db_connection
from app.core.logging import get_logger
from app.core.supabase_client import get_supabase_client
from app.schemas.contracts import (
    DocumentIngestRequest,
    DocumentIngestResponse,
    RetryDocumentResponse,
    utcnow,
)
from app.services.document_parsers import detect_file_type, extract_text
from app.services.normalization import normalize_text
from app.services.chunking import chunk_text
from app.services.embeddings import DeterministicEmbeddingClient
from app.services.event_publisher import EventPublisher

logger = get_logger(__name__)


@dataclass
class ProcessingResult:
    job_id: UUID
    document_id: UUID
    status: str
    chunk_count: int
    embedding_count: int
    processing_error: str | None = None


class DocumentPipelineService:
    def __init__(self, publisher: EventPublisher) -> None:
        self.publisher = publisher
        self.settings = get_settings()
        self.embedding_client = DeterministicEmbeddingClient(
            dimensions=self.settings.embedding_dimensions
        )

    def _download_file(self, bucket: str, path: str) -> bytes:
        supabase = get_supabase_client()
        return supabase.storage.from_(bucket).download(path)

    def _upsert_processing_job(self, document_id: UUID, requested_by: UUID, force_reprocess: bool) -> UUID:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                if force_reprocess:
                    cur.execute(
                        """
                        delete from public.embeddings
                        where chunk_id in (
                          select id from public.document_chunks where document_id = %s
                        )
                        """,
                        (document_id,),
                    )
                    cur.execute(
                        "delete from public.document_chunks where document_id = %s",
                        (document_id,),
                    )

                cur.execute(
                    """
                    insert into public.document_processing_jobs (
                      document_id,
                      status,
                      attempt_count,
                      requested_by,
                      created_at,
                      updated_at
                    )
                    values (%s, 'PENDING', 0, %s, now(), now())
                    on conflict (document_id)
                    do update set
                      status = 'PENDING',
                      requested_by = excluded.requested_by,
                      last_error = null,
                      completed_at = null,
                      updated_at = now()
                    returning id
                    """,
                    (document_id, requested_by),
                )
                job_id = cur.fetchone()[0]

                cur.execute(
                    """
                    update public.documents
                    set processing_status = 'PROCESSING',
                        processing_error = null,
                        updated_at = now()
                    where id = %s
                    """,
                    (document_id,),
                )
            conn.commit()

        return job_id

    def _mark_job_started(self, job_id: UUID) -> None:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    update public.document_processing_jobs
                    set status = 'RUNNING',
                        attempt_count = attempt_count + 1,
                        started_at = now(),
                        updated_at = now()
                    where id = %s
                    """,
                    (job_id,),
                )
            conn.commit()

    def _mark_job_failed(self, job_id: UUID, document_id: UUID, message: str) -> None:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    update public.document_processing_jobs
                    set status = 'FAILED',
                        last_error = %s,
                        completed_at = now(),
                        updated_at = now()
                    where id = %s
                    """,
                    (message, job_id),
                )
                cur.execute(
                    """
                    update public.documents
                    set processing_status = 'FAILED',
                        processing_error = %s,
                        updated_at = now()
                    where id = %s
                    """,
                    (message, document_id),
                )
            conn.commit()

    def _store_chunks_and_embeddings(
        self,
        document_id: UUID,
        chunks: list[tuple[int, str, int]],
    ) -> tuple[int, int]:
        chunk_count = 0
        embedding_count = 0

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "delete from public.embeddings where chunk_id in (select id from public.document_chunks where document_id = %s)",
                    (document_id,),
                )
                cur.execute(
                    "delete from public.document_chunks where document_id = %s",
                    (document_id,),
                )

                for chunk_index, content, token_count in chunks:
                    cur.execute(
                        """
                        insert into public.document_chunks (
                          document_id,
                          chunk_index,
                          content,
                          token_count,
                          metadata,
                          created_at
                        )
                        values (%s, %s, %s, %s, '{}'::jsonb, now())
                        returning id
                        """,
                        (document_id, chunk_index, content, token_count),
                    )
                    chunk_id = cur.fetchone()[0]
                    chunk_count += 1

                    vector = self.embedding_client.embed_text(content)
                    cur.execute(
                        """
                        insert into public.embeddings (
                          chunk_id,
                          model_name,
                          embedding,
                          created_at
                        )
                        values (%s, %s, %s::vector, now())
                        """,
                        (chunk_id, "deterministic-hash-v1", vector),
                    )
                    embedding_count += 1

                cur.execute(
                    """
                    update public.documents
                    set processing_status = 'READY',
                        processing_error = null,
                        updated_at = now()
                    where id = %s
                    """,
                    (document_id,),
                )
            conn.commit()

        return chunk_count, embedding_count

    def _mark_job_completed(self, job_id: UUID) -> None:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    update public.document_processing_jobs
                    set status = 'COMPLETED',
                        completed_at = now(),
                        updated_at = now()
                    where id = %s
                    """,
                    (job_id,),
                )
            conn.commit()

    async def process_document(self, payload: DocumentIngestRequest) -> ProcessingResult:
        job_id = self._upsert_processing_job(
            payload.document_id,
            payload.requested_by,
            payload.force_reprocess,
        )

        await self.publisher.publish(
            "document.processing.accepted",
            {
                "job_id": str(job_id),
                "document_id": str(payload.document_id),
            },
        )

        try:
            self._mark_job_started(job_id)

            file_bytes = self._download_file(payload.storage_bucket, payload.storage_path)
            file_type = detect_file_type(payload.mime_type, payload.storage_path)
            raw_text, extraction_mode = extract_text(file_type, file_bytes)
            normalized = normalize_text(raw_text)

            if not normalized:
                raise ValueError("No extractable text found in document.")

            chunk_models = chunk_text(
                normalized,
                chunk_size=self.settings.chunk_size_chars,
                overlap=self.settings.chunk_overlap_chars,
            )

            if not chunk_models:
                raise ValueError("Document produced no chunks.")

            chunks = [
                (chunk.index, chunk.content, chunk.token_count)
                for chunk in chunk_models
            ]

            chunk_count, embedding_count = self._store_chunks_and_embeddings(
                payload.document_id,
                chunks,
            )

            self._mark_job_completed(job_id)

            await self.publisher.publish(
                "document.processing.completed",
                {
                    "job_id": str(job_id),
                    "document_id": str(payload.document_id),
                    "chunk_count": chunk_count,
                    "embedding_count": embedding_count,
                    "extraction_mode": extraction_mode,
                },
            )

            return ProcessingResult(
                job_id=job_id,
                document_id=payload.document_id,
                status="READY",
                chunk_count=chunk_count,
                embedding_count=embedding_count,
            )
        except Exception as exc:
            message = str(exc)
            logger.exception("document_processing_failed document_id=%s", payload.document_id)
            self._mark_job_failed(job_id, payload.document_id, message)

            await self.publisher.publish(
                "document.processing.failed",
                {
                    "job_id": str(job_id),
                    "document_id": str(payload.document_id),
                    "error": message,
                },
            )

            return ProcessingResult(
                job_id=job_id,
                document_id=payload.document_id,
                status="FAILED",
                chunk_count=0,
                embedding_count=0,
                processing_error=message,
            )

    async def ingest_document(self, payload: DocumentIngestRequest) -> DocumentIngestResponse:
        result = await self.process_document(payload)

        return DocumentIngestResponse(
            job_id=result.job_id,
            document_id=result.document_id,
            status=result.status,
            accepted_at=utcnow(),
            chunk_count=result.chunk_count,
            embedding_count=result.embedding_count,
            processing_error=result.processing_error,
        )

    async def retry_document(self, payload: DocumentIngestRequest) -> RetryDocumentResponse:
        retry_payload = payload.model_copy(update={"force_reprocess": True})
        result = await self.process_document(retry_payload)

        return RetryDocumentResponse(
            job_id=result.job_id,
            document_id=result.document_id,
            status=result.status,
            retried_at=utcnow(),
            chunk_count=result.chunk_count,
            embedding_count=result.embedding_count,
            processing_error=result.processing_error,
        )

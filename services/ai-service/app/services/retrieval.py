import json
from uuid import UUID

from psycopg.types.json import Jsonb

from app.core.config import get_settings
from app.core.db import get_db_connection
from app.schemas.contracts import (
    EvidenceChunk,
    RetrieveEvidenceRequest,
    RetrieveEvidenceResponse,
    RetrievalScope,
    new_uuid,
)
from app.services.embeddings import DeterministicEmbeddingClient


def vector_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{value:.8f}" for value in values) + "]"


class RetrievalService:
    def __init__(self) -> None:
        settings = get_settings()
        self.embedding_client = DeterministicEmbeddingClient(
            dimensions=settings.embedding_dimensions
        )

    def _record_trace(
        self,
        *,
        case_id: UUID | None,
        scope: RetrievalScope,
        query_text: str,
        top_k: int,
        filters: dict,
        results: list[dict],
    ) -> UUID:
        trace_id = new_uuid()

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    insert into public.retrieval_traces (
                      id,
                      case_id,
                      scope,
                      query_text,
                      top_k,
                      filters,
                      result_count,
                      results,
                      created_at
                    )
                    values (%s, %s, %s, %s, %s, %s, %s, %s, now())
                    """,
                    (
                        trace_id,
                        case_id,
                        scope.value,
                        query_text,
                        top_k,
                        Jsonb(filters),
                        len(results),
                        Jsonb(results),
                    ),
                )
            conn.commit()

        return trace_id

    async def retrieve(self, request: RetrieveEvidenceRequest) -> RetrieveEvidenceResponse:
        query_embedding = self.embedding_client.embed_text(request.query)
        query_embedding_literal = vector_literal(query_embedding)

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    select
                      document_id,
                      chunk_id,
                      content,
                      score,
                      document_kind,
                      case_id,
                      document_title,
                      storage_bucket,
                      storage_path,
                      metadata
                    from public.match_retrieval_chunks(
                      %s::vector,
                      %s,
                      %s::public.retrieval_scope,
                      %s,
                      %s::jsonb
                    )
                    """,
                    (
                        query_embedding_literal,
                        request.top_k,
                        request.scope.value,
                        request.case_id,
                        json.dumps(request.filters),
                    ),
                )
                rows = cur.fetchall()

        evidence = [
            EvidenceChunk(
                document_id=row[0],
                chunk_id=row[1],
                excerpt=row[2],
                score=max(0.0, min(1.0, float(row[3]))),
                document_kind=row[4],
                case_id=row[5],
                document_title=row[6],
                storage_bucket=row[7],
                storage_path=row[8],
                metadata=row[9] or {},
            )
            for row in rows
        ]

        trace_id = self._record_trace(
            case_id=request.case_id,
            scope=request.scope,
            query_text=request.query,
            top_k=request.top_k,
            filters=request.filters,
            results=[item.model_dump(mode="json") for item in evidence],
        )

        return RetrieveEvidenceResponse(
            query=request.query,
            scope=request.scope,
            top_k=request.top_k,
            retrieval_trace_id=trace_id,
            evidence=evidence,
        )

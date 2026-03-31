from uuid import UUID

from app.core.db import get_db_connection
from app.schemas.contracts import (
    KnowledgeDocumentListResponse,
    KnowledgeDocumentRecord,
    SetKnowledgeDocumentStatusResponse,
)


class KnowledgeService:
    async def list_documents(self) -> KnowledgeDocumentListResponse:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    select
                      kd.id,
                      kd.document_id,
                      kd.title,
                      kd.category,
                      kd.is_active,
                      d.processing_status,
                      kd.updated_at
                    from public.knowledge_documents kd
                    join public.documents d
                      on d.id = kd.document_id
                    order by kd.updated_at desc
                    """
                )
                rows = cur.fetchall()

        items = [
            KnowledgeDocumentRecord(
                knowledge_document_id=row[0],
                document_id=row[1],
                title=row[2],
                category=row[3],
                is_active=row[4],
                processing_status=row[5],
                updated_at=row[6],
            )
            for row in rows
        ]

        return KnowledgeDocumentListResponse(items=items)

    async def set_active(
        self, knowledge_document_id: UUID, is_active: bool
    ) -> SetKnowledgeDocumentStatusResponse:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    update public.knowledge_documents
                    set is_active = %s,
                        updated_at = now()
                    where id = %s
                    returning id, document_id, is_active, updated_at
                    """,
                    (is_active, knowledge_document_id),
                )
                row = cur.fetchone()

            conn.commit()

        if not row:
            raise ValueError("Knowledge document not found.")

        return SetKnowledgeDocumentStatusResponse(
            knowledge_document_id=row[0],
            document_id=row[1],
            is_active=row[2],
            updated_at=row[3],
        )

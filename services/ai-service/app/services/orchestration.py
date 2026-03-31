from app.schemas.contracts import (
    AnswerGroundedQuestionRequest,
    AnswerGroundedQuestionResponse,
    DocumentIngestRequest,
    DocumentIngestResponse,
    EvalRunRequest,
    EvalRunResponse,
    ProcessingStatus,
    RetrieveEvidenceRequest,
    RetrieveEvidenceResponse,
    RetryDocumentResponse,
    TriageRequest,
    TriageResponse,
    utcnow,
    new_uuid,
)
from app.services.document_pipeline import DocumentPipelineService
from app.services.event_publisher import EventPublisher
from app.services.knowledge import KnowledgeService
from app.services.retrieval import RetrievalService


class AIOrchestrationService:
    def __init__(self, publisher: EventPublisher) -> None:
        self.publisher = publisher
        self.document_pipeline = DocumentPipelineService(publisher=publisher)
        self.retrieval_service = RetrievalService()
        self.knowledge_service = KnowledgeService()

    async def ingest_document(
        self, request: DocumentIngestRequest
    ) -> DocumentIngestResponse:
        return await self.document_pipeline.ingest_document(request)

    async def retry_document(
        self, request: DocumentIngestRequest
    ) -> RetryDocumentResponse:
        return await self.document_pipeline.retry_document(request)

    async def retrieve_evidence(
        self, request: RetrieveEvidenceRequest
    ) -> RetrieveEvidenceResponse:
        return await self.retrieval_service.retrieve(request)

    async def answer_grounded_question(
        self, request: AnswerGroundedQuestionRequest
    ) -> AnswerGroundedQuestionResponse:
        return AnswerGroundedQuestionResponse(
            answer="Grounded Q&A orchestration is not implemented yet.",
            citations=[],
            confidence=0.0,
            missing_context_questions=[
                "Question-answer orchestration arrives in Phase 8."
            ],
            refusal_reason="IMPLEMENTATION_PENDING",
        )

    async def run_triage(self, request: TriageRequest) -> TriageResponse:
        triage_run_id = new_uuid()

        await self.publisher.publish(
            "triage.run.accepted",
            {
                "triage_run_id": str(triage_run_id),
                "case_id": str(request.case_id),
            },
        )

        return TriageResponse(
            triage_run_id=triage_run_id,
            summary="Structured triage is not implemented yet.",
            extracted_fields={},
            missing_information=["Triage orchestration arrives in Phase 9."],
            classification=None,
            routing_recommendation=None,
            draft_response=None,
            risk_flags=["IMPLEMENTATION_PENDING"],
            confidence=0.0,
            review_required=True,
            evidence_refs=[],
        )

    async def run_eval(self, request: EvalRunRequest) -> EvalRunResponse:
        eval_run_id = new_uuid()

        await self.publisher.publish(
            "eval.run.accepted",
            {
                "eval_run_id": str(eval_run_id),
                "prompt_version_id": str(request.prompt_version_id),
                "dataset_name": request.dataset_name,
                "run_type": request.run_type,
            },
        )

        return EvalRunResponse(
            eval_run_id=eval_run_id,
            status=ProcessingStatus.ACCEPTED,
            accepted_at=utcnow(),
        )

from datetime import datetime, timezone

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
    TriageRequest,
    TriageResponse,
    new_uuid,
)
from app.services.event_publisher import EventPublisher


class AIOrchestrationService:
    def __init__(self, publisher: EventPublisher) -> None:
        self.publisher = publisher

    async def ingest_document(
        self, request: DocumentIngestRequest
    ) -> DocumentIngestResponse:
        response = DocumentIngestResponse(
            job_id=new_uuid(),
            document_id=request.document_id,
            status=ProcessingStatus.ACCEPTED,
            accepted_at=datetime.now(timezone.utc),
        )

        await self.publisher.publish(
            "document.ingest.accepted",
            {
                "job_id": str(response.job_id),
                "document_id": str(request.document_id),
                "case_id": str(request.case_id) if request.case_id else None,
            },
        )
        return response

    async def retrieve_evidence(
        self, request: RetrieveEvidenceRequest
    ) -> RetrieveEvidenceResponse:
        return RetrieveEvidenceResponse(
            query=request.query,
            scope=request.scope,
            top_k=request.top_k,
            evidence=[],
        )

    async def answer_grounded_question(
        self, request: AnswerGroundedQuestionRequest
    ) -> AnswerGroundedQuestionResponse:
        return AnswerGroundedQuestionResponse(
            answer="Grounded Q&A orchestration is not implemented yet.",
            citations=[],
            confidence=0.0,
            missing_context_questions=[
                "Document retrieval and model orchestration are not implemented yet."
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
            missing_information=["Triage extraction pipeline not implemented yet."],
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
            accepted_at=datetime.now(timezone.utc),
        )

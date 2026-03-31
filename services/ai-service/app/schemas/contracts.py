from datetime import datetime, timezone
from enum import Enum
from typing import Any, Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


class RetrievalScope(str, Enum):
    CASE_ONLY = "CASE_ONLY"
    KNOWLEDGE_ONLY = "KNOWLEDGE_ONLY"
    COMBINED = "COMBINED"


class ProcessingStatus(str, Enum):
    ACCEPTED = "ACCEPTED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AppBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HealthResponse(AppBaseModel):
    service: str
    version: str
    environment: str
    status: Literal["ok"]
    timestamp: datetime


class DocumentIngestRequest(AppBaseModel):
    document_id: UUID
    case_id: UUID | None = None
    storage_bucket: str
    storage_path: str
    mime_type: str
    requested_by: UUID
    force_reprocess: bool = False
    process_inline: bool = True
    correlation_id: str | None = None


class DocumentIngestResponse(AppBaseModel):
    job_id: UUID
    document_id: UUID
    status: Literal["UPLOADED", "PROCESSING", "FAILED", "READY"]
    accepted_at: datetime
    chunk_count: int = 0
    embedding_count: int = 0
    processing_error: str | None = None


class RetryDocumentRequest(AppBaseModel):
    document_id: UUID
    requested_by: UUID
    correlation_id: str | None = None


class RetryDocumentResponse(AppBaseModel):
    job_id: UUID
    document_id: UUID
    status: Literal["UPLOADED", "PROCESSING", "FAILED", "READY"]
    retried_at: datetime
    chunk_count: int = 0
    embedding_count: int = 0
    processing_error: str | None = None


class DocumentProcessingJobResponse(AppBaseModel):
    job_id: UUID
    document_id: UUID
    status: str
    attempt_count: int
    last_error: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class EvidenceChunk(AppBaseModel):
    document_id: UUID
    chunk_id: UUID
    score: float = Field(ge=0.0, le=1.0)
    excerpt: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class RetrieveEvidenceRequest(AppBaseModel):
    query: str
    case_id: UUID | None = None
    scope: RetrievalScope
    top_k: int = Field(default=5, ge=1, le=50)
    filters: dict[str, Any] = Field(default_factory=dict)
    correlation_id: str | None = None


class RetrieveEvidenceResponse(AppBaseModel):
    query: str
    scope: RetrievalScope
    top_k: int
    evidence: list[EvidenceChunk]
    implementation_status: Literal["stub"] = "stub"


class Citation(AppBaseModel):
    document_id: UUID
    chunk_id: UUID
    quote: str | None = None
    relevance_reason: str | None = None


class AnswerGroundedQuestionRequest(AppBaseModel):
    question: str
    case_id: UUID | None = None
    scope: RetrievalScope
    top_k: int = Field(default=5, ge=1, le=50)
    prompt_version_id: UUID | None = None
    correlation_id: str | None = None


class AnswerGroundedQuestionResponse(AppBaseModel):
    answer: str
    citations: list[Citation]
    confidence: float = Field(ge=0.0, le=1.0)
    missing_context_questions: list[str]
    refusal_reason: str | None = None
    implementation_status: Literal["stub"] = "stub"


class TriageRequest(AppBaseModel):
    case_id: UUID
    scope: RetrievalScope = RetrievalScope.COMBINED
    prompt_version_id: UUID | None = None
    policy_context: dict[str, Any] = Field(default_factory=dict)
    correlation_id: str | None = None


class TriageResponse(AppBaseModel):
    triage_run_id: UUID
    summary: str
    extracted_fields: dict[str, Any]
    missing_information: list[str]
    classification: str | None = None
    routing_recommendation: str | None = None
    draft_response: str | None = None
    risk_flags: list[str]
    confidence: float = Field(ge=0.0, le=1.0)
    review_required: bool
    evidence_refs: list[dict[str, Any]]
    implementation_status: Literal["stub"] = "stub"


class EvalRunRequest(AppBaseModel):
    prompt_version_id: UUID
    dataset_name: str
    run_type: Literal["GROUNDING", "TRIAGE", "REFUSAL", "SCHEMA", "REGRESSION"]
    sample_size: int | None = Field(default=None, ge=1)
    correlation_id: str | None = None


class EvalRunResponse(AppBaseModel):
    eval_run_id: UUID
    status: ProcessingStatus
    accepted_at: datetime
    implementation_status: Literal["stub"] = "stub"


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def new_uuid() -> UUID:
    return uuid4()

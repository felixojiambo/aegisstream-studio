from fastapi import APIRouter, Request

from app.schemas.contracts import (
    AnswerGroundedQuestionRequest,
    AnswerGroundedQuestionResponse,
)

router = APIRouter(prefix="/qna", tags=["qna"])


@router.post("/answer", response_model=AnswerGroundedQuestionResponse)
async def answer_grounded_question(
    payload: AnswerGroundedQuestionRequest,
    request: Request,
) -> AnswerGroundedQuestionResponse:
    service = request.app.state.orchestration
    return await service.answer_grounded_question(payload)

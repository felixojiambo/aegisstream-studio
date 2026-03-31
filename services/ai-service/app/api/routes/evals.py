from fastapi import APIRouter, Request, status

from app.schemas.contracts import EvalRunRequest, EvalRunResponse

router = APIRouter(prefix="/evals", tags=["evals"])


@router.post(
    "/run",
    response_model=EvalRunResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def run_eval(
    payload: EvalRunRequest,
    request: Request,
) -> EvalRunResponse:
    service = request.app.state.orchestration
    return await service.run_eval(payload)

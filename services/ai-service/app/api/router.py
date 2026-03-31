from fastapi import APIRouter

from app.api.routes import health, ingest, evidence, qna, triage, evals

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(ingest.router)
api_router.include_router(evidence.router)
api_router.include_router(qna.router)
api_router.include_router(triage.router)
api_router.include_router(evals.router)

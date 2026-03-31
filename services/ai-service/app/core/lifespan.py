from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.services.event_publisher import NoopEventPublisher
from app.services.orchestration import AIOrchestrationService


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings.log_level)
    logger = get_logger(__name__)

    publisher = NoopEventPublisher()
    orchestration = AIOrchestrationService(publisher=publisher)

    app.state.settings = settings
    app.state.orchestration = orchestration

    logger.info(
        "service_starting name=%s version=%s env=%s",
        settings.service_name,
        settings.service_version,
        settings.environment,
    )
    yield
    logger.info("service_stopping name=%s", settings.service_name)

from typing import Any, Protocol

from app.core.logging import get_logger

logger = get_logger(__name__)


class EventPublisher(Protocol):
    async def publish(self, topic: str, payload: dict[str, Any]) -> None: ...


class NoopEventPublisher:
    async def publish(self, topic: str, payload: dict[str, Any]) -> None:
        logger.info("noop_event_publish topic=%s payload=%s", topic, payload)

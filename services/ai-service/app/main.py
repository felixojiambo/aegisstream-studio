from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.lifespan import lifespan

settings = get_settings()

app = FastAPI(
    title=settings.service_name,
    version=settings.service_version,
    lifespan=lifespan,
)

app.include_router(api_router, prefix=settings.api_prefix)
register_exception_handlers(app)

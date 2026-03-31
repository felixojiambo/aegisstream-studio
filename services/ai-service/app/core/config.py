from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    service_name: str = "AegisStream AI Service"
    service_version: str = "0.1.0"
    environment: str = "local"
    api_prefix: str = "/v1"
    log_level: str = "INFO"

    host: str = "0.0.0.0"
    port: int = 8000

    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    supabase_db_url: str | None = None

    anthropic_api_key: str | None = None

    default_top_k: int = Field(default=5, ge=1, le=50)
    request_timeout_seconds: int = Field(default=30, ge=1, le=300)

    chunk_size_chars: int = Field(default=1200, ge=200, le=5000)
    chunk_overlap_chars: int = Field(default=200, ge=0, le=1000)
    embedding_dimensions: int = Field(default=1536, ge=32, le=4096)

    kafka_enabled: bool = False
    kafka_bootstrap_servers: str | None = None
    kafka_client_id: str = "aegisstream-ai-service"


@lru_cache
def get_settings() -> Settings:
    return Settings()

import psycopg

from app.core.config import get_settings


def get_db_connection() -> psycopg.Connection:
    settings = get_settings()

    if not settings.supabase_db_url:
        raise RuntimeError("Missing supabase_db_url.")

    return psycopg.connect(settings.supabase_db_url)

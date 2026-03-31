from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.core.config import get_settings


def get_supabase_client() -> Client:
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError("Missing Supabase server credentials.")

    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
        options=ClientOptions(
            auto_refresh_token=False,
            persist_session=False,
            schema="public",
        ),
    )

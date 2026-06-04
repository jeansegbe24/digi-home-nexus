from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List


class Settings(BaseSettings):
    # JWT Security
    SECRET_KEY: str = "9a3fcfb643a6d9633e24bcfde9475cf2a561bd112d8a0c23945ef4c2b9a7102a"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/smarthome"

    # CORS — comma-separated list of allowed frontend origins
    VITE_FRONTEND_URL: str = "http://localhost:8080"
    EXTRA_CORS_ORIGINS: str = ""  # e.g. "https://app.digihome.com,https://www.digihome.com"

    # Cookie security
    COOKIE_SECURE: bool = False     # Set True in production (requires HTTPS)
    COOKIE_SAMESITE: str = "lax"   # "lax" or "none" (none requires Secure=True)

    # App environment
    ENVIRONMENT: str = "development"  # "development" | "production"
    LOG_LEVEL: str = "INFO"

    # Sentry error monitoring (optional — leave empty to disable)
    SENTRY_DSN: str = ""

    @property
    def all_cors_origins(self) -> List[str]:
        """Return the full list of allowed CORS origins."""
        origins = [
            self.VITE_FRONTEND_URL,
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        if self.EXTRA_CORS_ORIGINS:
            for origin in self.EXTRA_CORS_ORIGINS.split(","):
                stripped = origin.strip()
                if stripped:
                    origins.append(stripped)
        return list(set(origins))

    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()

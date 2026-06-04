import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.core.logging import get_logger

logger = get_logger(__name__)

class LoginRateLimitMiddleware(BaseHTTPMiddleware):
    """
    In-memory rate limiting middleware specifically targeting '/auth/login'.
    Limits client IP addresses to 5 requests per minute.
    Adds X-RateLimit-Limit and X-RateLimit-Remaining headers to the response.
    """
    def __init__(self, app, limit: int = 5, window_seconds: int = 60):
        super().__init__(app)
        self.limit = limit
        self.window_seconds = window_seconds
        self.history: Dict[str, List[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # We only rate limit the POST /auth/login endpoint
        if request.url.path == "/auth/login" and request.method == "POST":
            # Identify by client IP
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()

            # Clean up old timestamps outside the time window
            self.history[client_ip] = [
                t for t in self.history[client_ip] 
                if now - t < self.window_seconds
            ]

            current_requests = len(self.history[client_ip])

            if current_requests >= self.limit:
                logger.warning(
                    "rate_limit.exceeded",
                    client_ip=client_ip,
                    path=request.url.path,
                    limit=self.limit
                )
                response = JSONResponse(
                    status_code=429,
                    content={"detail": "Trop de tentatives de connexion. Veuillez réessayer dans une minute."}
                )
                response.headers["X-RateLimit-Limit"] = str(self.limit)
                response.headers["X-RateLimit-Remaining"] = "0"
                response.headers["Retry-After"] = str(int(self.window_seconds - (now - self.history[client_ip][0])))
                return response

            # Record this attempt
            self.history[client_ip].append(now)
            remaining = self.limit - len(self.history[client_ip])

            response = await call_next(request)
            response.headers["X-RateLimit-Limit"] = str(self.limit)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            return response

        return await call_next(request)

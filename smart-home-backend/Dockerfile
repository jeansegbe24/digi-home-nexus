FROM python:3.12-slim AS builder

WORKDIR /build

# Install build dependencies (needed for asyncpg compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Final stage (slim runtime image) ─────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Copy only installed packages from builder
COPY --from=builder /install /usr/local

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy application code
COPY . .

# Ensure the app user owns the working directory
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check for AWS App Runner / ECS
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Production: 2 workers, no reload, JSON logs
CMD ["uvicorn", "main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--log-level", "warning", \
     "--no-access-log"]

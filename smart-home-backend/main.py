import asyncio
import datetime
import random
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import hash_password
from app.core.logging import setup_logging, get_logger

# ── Boot logging immediately ──────────────────────────────────────────────
setup_logging()
logger = get_logger(__name__)

# ── Optional Sentry integration ───────────────────────────────────────────
if settings.SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.2,
        integrations=[FastApiIntegration(), SqlalchemyIntegration()],
    )
    logger.info("sentry.initialized", dsn_set=True)

# ── Import models (must be imported for Base.metadata to be populated) ───
from app.models.user import User
from app.models.access_log import AccessLog
from app.models.light import LightState
from app.models.alert import Alert
from app.models.sensor_data import SensorData
from app.models.door_state import DoorState
from app.models.window_state import WindowState
from app.websocket.manager import manager

# ── Import routers ────────────────────────────────────────────────────────
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.lights import router as lights_router
from app.routers.access import router as access_router
from app.routers.energy import router as energy_router
from app.routers.security import router as security_router
from app.routers.health import router as health_router
from app.routers.sensors import router as sensors_router
from app.routers.doors import router as doors_router
from app.routers.windows import router as windows_router
from app.ws_router import ws_router


# ── Background broadcaster ────────────────────────────────────────────────
async def simulated_sensor_broadcaster():
    """Pushes live sensor/access/energy events over WebSocket every 5 seconds."""
    while True:
        try:
            await asyncio.sleep(5)

            # 1. Ambient sensor update
            await manager.broadcast("sensor", {
                "temperature": round(22.0 + random.uniform(-0.5, 0.8), 1),
                "humidity":    round(48.0 + random.uniform(-2.0, 2.0), 0),
                "aqi":         round(97.0 + random.uniform(-2.0, 1.0), 0),
                "power":       round(3.2  + random.uniform(-0.4, 0.5), 2),
            })

            # 2. Occasional energy chart update
            if random.random() < 0.3:
                await manager.broadcast("energy", {
                    "time":    datetime.datetime.now().strftime("%H:%M"),
                    "conso":   round(1.5 + random.uniform(-0.5, 2.0), 2),
                    "solaire": round(2.0 + random.uniform(-1.0, 1.5), 2),
                })

            # 3. Occasional PIR motion event
            if random.random() < 0.1:
                rooms = ["Jardin", "Garage", "Salon", "Entrée"]
                await manager.broadcast("pir", {
                    "time":   datetime.datetime.now().strftime("%H:%M"),
                    "room":   random.choice(rooms),
                    "motion": True,
                })

            # 4. Occasional RFID / biometric access event
            if random.random() < 0.05:
                names   = ["Jean Dupont", "Marie Dupont", "Grand-père Henri", "Locataire Alice", "Inconnu"]
                methods = ["Badge RFID", "Reconnaissance faciale", "Code PIN"]
                doors   = ["Entrée principale", "Garage", "Porte arrière"]
                who     = random.choice(names)
                ok      = who != "Inconnu"
                method  = random.choice(methods)
                door    = random.choice(doors)
                t_str   = datetime.datetime.now().strftime("%H:%M")

                await manager.broadcast("rfid", {"time": t_str, "who": who, "method": method, "door": door, "ok": ok})

                async with SessionLocal() as db:
                    from sqlalchemy import select as sa_select
                    res = await db.execute(sa_select(User).where(User.nom == who))
                    found_user = res.scalar_one_or_none()

                    log = AccessLog(
                        user_id=found_user.id if found_user else None,
                        t=t_str, who=who, method=method, door=door, ok=ok
                    )
                    db.add(log)
                    await db.commit()

                    await manager.broadcast("activity", {
                        "id":   str(log.id),
                        "time": t_str,
                        "text": f"{who} · {method} · {door}",
                        "icon": "camera" if "faciale" in method.lower() else "key",
                        "ok":   ok,
                    })

                    if not ok:
                        alert = Alert(level="warn", t=t_str, text=f"Tentative d'accès non autorisée · {door}", icon="alerttriangle", read=False)
                        db.add(alert)
                        await db.commit()
                        await manager.broadcast("alert", {"id": str(alert.id), "level": "warn", "time": t_str, "text": alert.text, "icon": "alerttriangle"})

        except Exception as exc:
            logger.error("broadcaster.error", error=str(exc))


# ── Application lifespan ──────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app.startup", environment=settings.ENVIRONMENT)

    # Create all tables (no-op when tables already exist on Supabase)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as exc:
        logger.warning("app.create_all_skipped", error=str(exc))

    # Seed default users if the table is empty
    async with SessionLocal() as db:
        from sqlalchemy import select
        result = await db.execute(select(User))
        if not result.scalars().first():
            seed_users = [
                User(nom="Jean Dupont",       email="jean.dupont@digihome.com",   hashed_password=hash_password("admin123"),    role="proprietaire", langue="fr", biometric_hash="face_jean_hash"),
                User(nom="Marie Dupont",      email="marie.dupont@digihome.com",  hashed_password=hash_password("family123"),   role="famille",      langue="fr", biometric_hash="face_marie_hash"),
                User(nom="Grand-père Henri",  email="henri.dupont@digihome.com",  hashed_password=hash_password("senior123"),   role="senior",       langue="fr", biometric_hash="face_henri_hash"),
                User(nom="Locataire Alice",   email="alice.tenant@digihome.com",  hashed_password=hash_password("tenant123"),   role="locataire",    langue="fr", biometric_hash="face_alice_hash"),
                User(nom="Agent Entretien",   email="agent.cleaning@digihome.com",hashed_password=hash_password("cleaning123"), role="personnel",    langue="fr", biometric_hash="face_agent_hash"),
            ]
            for u in seed_users:
                db.add(u)
            await db.commit()
            logger.info("app.seeded_users", count=len(seed_users))

    broadcaster_task = asyncio.create_task(simulated_sensor_broadcaster())
    logger.info("app.broadcaster_started")

    yield

    broadcaster_task.cancel()
    try:
        await broadcaster_task
    except asyncio.CancelledError:
        pass
    logger.info("app.shutdown")


# ── FastAPI app ───────────────────────────────────────────────────────────
app = FastAPI(
    title="DigiHome Nexus — Smart Home API",
    description="API de domotique intelligente pour le projet DigiHome Nexus",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# ── CORS ──────────────────────────────────────────────────────────────────
from app.core.rate_limit import LoginRateLimitMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoginRateLimitMiddleware)


# ── HTTP request logging middleware ───────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 1)
    logger.info(
        "http.request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=duration_ms,
    )
    return response

# ── Root health endpoint ──────────────────────────────────────────────────
@app.get("/health", tags=["Santé"])
async def root_health():
    return {"status": "healthy", "service": "digihome-nexus-api", "version": "2.0.0", "time": datetime.datetime.now().isoformat()}

# ── HTTP routers ──────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(lights_router)
app.include_router(access_router)
app.include_router(energy_router)
app.include_router(security_router)
app.include_router(health_router)
app.include_router(sensors_router)
app.include_router(doors_router)
app.include_router(windows_router)

# ── WebSocket router ──────────────────────────────────────────────────────
app.include_router(ws_router)

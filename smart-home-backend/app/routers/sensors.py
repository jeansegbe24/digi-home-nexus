from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import datetime
import random

from app.core.database import get_db
from app.models.sensor_data import SensorData
from app.models.user import User
from app.deps import get_current_user
from app.websocket.manager import manager

router = APIRouter(tags=["Capteurs"])

# Default seed values for realistic simulation
_DEFAULTS = {"temperature": 22.0, "humidity": 48.0, "aqi": 97.0, "power": 3.2}


def _simulate_reading() -> dict:
    return {
        "temperature": round(_DEFAULTS["temperature"] + random.uniform(-0.5, 0.8), 1),
        "humidity":    round(_DEFAULTS["humidity"]    + random.uniform(-2.0, 2.0), 0),
        "aqi":         round(_DEFAULTS["aqi"]         + random.uniform(-2.0, 1.0), 0),
        "power":       round(_DEFAULTS["power"]       + random.uniform(-0.4, 0.5), 2),
    }


@router.get(
    "/api/sensors",
    summary="Valeurs actuelles des capteurs",
    description="Retourne les valeurs actuelles des capteurs ambiants (température, humidité, qualité de l'air, puissance).",
)
async def get_sensors(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    reading = _simulate_reading()

    # Persist reading for historical queries
    db.add(SensorData(**reading))
    await db.commit()

    return reading


@router.get(
    "/api/sensors/history",
    summary="Historique des capteurs (24h)",
    description="Retourne les 288 dernières lectures (toutes les 5 minutes sur 24 heures) pour les graphiques.",
)
async def get_sensors_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[dict]:
    result = await db.execute(
        select(SensorData)
        .order_by(desc(SensorData.timestamp))
        .limit(288)
    )
    rows = result.scalars().all()

    return [
        {
            "timestamp": r.timestamp.isoformat() if r.timestamp else None,
            "temperature": r.temperature,
            "humidity":    r.humidity,
            "aqi":         r.aqi,
            "power":       r.power,
        }
        for r in rows
    ]

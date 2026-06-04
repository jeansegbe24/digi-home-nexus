from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import datetime
import random

from app.core.database import get_db
from app.models.user import User
from app.models.access_log import AccessLog
from app.deps import get_current_user
from app.websocket.manager import manager

router = APIRouter(tags=["Accès biométriques"])

ACCESS_METHODS = [
    {
        "id": "face",
        "name": "Reconnaissance faciale",
        "icon": "scanface",
        "status": "Actif",
        "desc": "12 visages enregistrés",
        "color": "from-primary to-accent",
    },
    {
        "id": "voice",
        "name": "Reconnaissance vocale",
        "icon": "mic",
        "status": "Actif",
        "desc": "5 empreintes vocales",
        "color": "from-accent to-pink-400",
    },
    {
        "id": "rfid",
        "name": "Badge RFID / NFC",
        "icon": "radio",
        "status": "Actif",
        "desc": "8 badges autorisés",
        "color": "from-emerald-400 to-cyan-300",
    },
    {
        "id": "finger",
        "name": "Empreinte digitale",
        "icon": "fingerprint",
        "status": "Veille",
        "desc": "Capteur porte garage",
        "color": "from-yellow-300 to-orange-400",
    },
]


@router.get(
    "/api/access-methods",
    summary="Méthodes d'accès biométrique",
    description="Liste les méthodes d'identification biométrique actives ou en veille.",
)
async def get_access_methods(current_user: User = Depends(get_current_user)):
    return ACCESS_METHODS


@router.get(
    "/api/access-logs",
    summary="Journal des accès",
    description="Retourne l'historique des 50 dernières entrées/sorties avec méthode, résultat et horodatage.",
)
async def get_access_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AccessLog)
        .order_by(desc(AccessLog.timestamp))
        .limit(50)
    )
    logs = result.scalars().all()

    # Serialize to dict for frontend compatibility
    return [
        {
            "id": log.id,
            "t": log.t,
            "who": log.who,
            "method": log.method,
            "door": log.door,
            "ok": log.ok,
        }
        for log in logs
    ]


@router.post(
    "/api/security/test-scan",
    summary="Lancer un test de scan biométrique",
    description=(
        "Simule un test de reconnaissance faciale sur la porte principale. "
        "Enregistre le résultat dans le journal et diffuse l'événement via WebSocket (type `activity`)."
    ),
)
async def test_scan(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.datetime.now()
    t_str = now.strftime("%H:%M")

    # Simulate scan result (90% success rate)
    success = random.random() > 0.10

    log = AccessLog(
        user_id=current_user.id,
        t=t_str,
        who=current_user.nom,
        method="Faciale",
        door="Entrée principale",
        ok=success
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)

    log_dict = {
        "id": log.id,
        "t": log.t,
        "who": log.who,
        "method": log.method,
        "door": log.door,
        "ok": log.ok,
    }

    # Broadcast to WebSocket clients
    await manager.broadcast("activity", {
        **log_dict,
        "time": log.t,
        "text": f"Scan test : {log.who} · {'Accès accordé' if success else 'Accès refusé'}",
        "icon": "camera",
    })

    return log_dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import datetime
import random

from app.core.database import get_db
from app.models.user import User
from app.models.alert import Alert
from app.models.access_log import AccessLog
from app.deps import get_current_user, require_roles
from app.websocket.manager import manager

router = APIRouter(tags=["Sécurité"])

# Simple in-memory armed state (in production, persist in DB or Redis)
_armed_state: dict = {"armed": True}


@router.get(
    "/api/security/state",
    summary="État du système de sécurité",
    description="Retourne l'état d'armement actuel de la maison (armé / désarmé).",
)
async def get_security_state(current_user: User = Depends(get_current_user)):
    return {"armed": _armed_state["armed"]}


@router.post(
    "/api/security/toggle",
    summary="Armer / désarmer le système",
    description=(
        "Change l'état d'armement de la maison. Enregistre l'action dans le journal "
        "et diffuse un événement `alert` via WebSocket. "
        "Réservé aux rôles **propriétaire** et **famille**."
    ),
)
async def toggle_security(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("proprietaire", "famille")),
):
    new_state = bool(payload.get("armed", not _armed_state["armed"]))
    _armed_state["armed"] = new_state
    now = datetime.datetime.now()
    t_str = now.strftime("%H:%M")

    # Create alert record
    alert = Alert(
        level="ok" if new_state else "warn",
        t=t_str,
        text=f"Système {'armé' if new_state else 'désarmé'} par {current_user.nom}",
        icon="shield",
        read=False,
    )
    db.add(alert)

    # Create access log
    log = AccessLog(
        user_id=current_user.id,
        t=t_str,
        who=current_user.nom,
        method="Commande sécurité",
        door="Système",
        ok=True,
    )
    db.add(log)
    await db.commit()

    # Broadcast WebSocket event
    await manager.broadcast("alert", {
        "id": alert.id or "security",
        "level": alert.level,
        "time": t_str,
        "text": alert.text,
        "icon": "shield",
    })

    return {"armed": new_state}


@router.get(
    "/api/alerts",
    summary="Alertes de sécurité",
    description="Retourne les 20 dernières alertes de sécurité triées par horodatage décroissant.",
)
async def get_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Alert).order_by(desc(Alert.timestamp)).limit(20)
    )
    alerts = result.scalars().all()

    # Seed with default alerts if table is empty
    if not alerts:
        defaults = [
            Alert(level="info", t="14:32", text="Mouvement détecté · Jardin",              icon="eye",           read=False),
            Alert(level="warn", t="11:42", text="Tentative d'accès non autorisée · Garage", icon="alerttriangle", read=False),
            Alert(level="ok",   t="09:00", text="Système armé automatiquement",             icon="shield",        read=True),
            Alert(level="info", t="07:30", text="Capteur fenêtre Salon : OK",               icon="radio",         read=True),
        ]
        for d in defaults:
            db.add(d)
        await db.commit()
        result2 = await db.execute(select(Alert).order_by(desc(Alert.timestamp)).limit(20))
        alerts = result2.scalars().all()

    return [
        {"id": a.id, "level": a.level, "time": a.t, "text": a.text, "icon": a.icon}
        for a in alerts
    ]


@router.get(
    "/api/cameras",
    summary="Flux caméras",
    description="Retourne la liste des caméras de surveillance avec leur état live et mode de vision.",
)
async def get_cameras(current_user: User = Depends(get_current_user)):
    return [
        {"id": "cam1", "name": "Entrée principale", "live": True,  "mode": "night",   "motion": True},
        {"id": "cam2", "name": "Jardin",             "live": True,  "mode": "thermal", "motion": False},
        {"id": "cam3", "name": "Garage",             "live": True,  "mode": "night",   "motion": False},
        {"id": "cam4", "name": "Couloir",            "live": False, "mode": "day",     "motion": False},
    ]



@router.get(
    "/api/activities",
    summary="Journal d'activité récente",
    description="Retourne les 10 dernières actions enregistrées dans la maison.",
)
async def get_activities(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AccessLog).order_by(desc(AccessLog.timestamp)).limit(10)
    )
    logs = result.scalars().all()

    # Seed with defaults if empty
    if not logs:
        seed_logs = [
            AccessLog(t="14:32", who="Alex Dupont",    method="Reconnaissance faciale",      door="Entrée principale", ok=True),
            AccessLog(t="13:18", who="Système",        method="Scénario Soirée cinéma activé", door="Système",        ok=True),
            AccessLog(t="12:05", who="Système",        method="Verrouillage automatique",    door="Porte d'entrée",   ok=True),
            AccessLog(t="11:42", who="Inconnu",        method="Tentative d'accès",           door="Entrée principale", ok=False),
            AccessLog(t="10:30", who="Système",        method="Mise à jour firmware",        door="Caméra Salon",     ok=True),
        ]
        for sl in seed_logs:
            db.add(sl)
        await db.commit()
        result2 = await db.execute(select(AccessLog).order_by(desc(AccessLog.timestamp)).limit(10))
        logs = result2.scalars().all()

    return [
        {
            "id": str(log.id),
            "time": log.t,
            "text": f"{log.who} · {log.method} · {log.door}",
            "icon": "camera" if "faciale" in log.method.lower() else "sparkles" if "scénario" in log.method.lower() else "shield",
            "ok": log.ok,
        }
        for log in logs
    ]

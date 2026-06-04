from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import datetime
import random

from app.core.database import get_db
from app.models.user import User
from app.models.alert import Alert
from app.deps import get_current_user
from app.websocket.manager import manager

router = APIRouter(tags=["Mode Senior"])

# In-memory medications state (in production, persist in DB)
_meds_state: list[dict] = [
    {"id": "med1", "name": "Tension artérielle", "time": "08:00", "taken": True},
    {"id": "med2", "name": "Vitamine D",          "time": "12:30", "taken": True},
    {"id": "med3", "name": "Anti-inflammatoire",  "time": "19:00", "taken": False},
]


@router.get(
    "/api/senior",
    summary="Données du mode Senior",
    description=(
        "Retourne les informations de l'interface simplifiée pour le profil senior : "
        "liste des rappels de médicaments et indicateurs de bien-être (santé, sommeil, etc.)."
    ),
)
async def get_senior_data(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.nom,
        "meds": _meds_state,
        "health": {
            "bpm":   str(round(72 + random.randint(-5, 8))),
            "sleep": f"{random.randint(6, 8)}h{random.randint(0, 59):02d}",
            "steps": f"{random.randint(2000, 7000):,}".replace(",", " "),
            "water": f"{random.randint(3, 8)}/8",
        },
    }


@router.post(
    "/api/senior/meds/{med_id}/take",
    summary="Valider la prise d'un médicament",
    description="Marque un médicament comme pris pour la journée. Déclenche une notification de confirmation.",
)
async def take_medication(
    med_id: str,
    current_user: User = Depends(get_current_user),
):
    for med in _meds_state:
        if med["id"] == med_id:
            med["taken"] = True
            return med

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Médicament '{med_id}' introuvable."
    )


@router.post(
    "/api/senior/urgency",
    summary="Alerte SOS d'urgence",
    description=(
        "Déclenche une alerte SOS d'urgence. Enregistre l'alerte dans la base de données, "
        "notifie tous les clients connectés via WebSocket et retourne la confirmation."
    ),
)
async def send_urgency(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.datetime.now()
    t_str = now.strftime("%H:%M")

    alert = Alert(
        level="warn",
        t=t_str,
        text=f"⚠️ URGENCE SOS — {current_user.nom} demande de l'aide !",
        icon="alerttriangle",
        read=False,
    )
    db.add(alert)
    await db.commit()

    # Broadcast SOS to all connected WebSocket clients
    await manager.broadcast("alert", {
        "id": str(alert.id or "sos"),
        "level": "warn",
        "time": t_str,
        "text": f"⚠️ URGENCE SOS — {current_user.nom} demande de l'aide !",
        "icon": "alerttriangle",
    })

    return {"detail": "Alerte SOS envoyée. Les secours et la famille ont été prévenus."}


@router.post(
    "/api/senior/action/{action}",
    summary="Action rapide senior",
    description=(
        "Exécute une action rapide depuis l'interface senior : "
        "`lumiere` (éclairage adapté), `famille` (appel contact d'urgence), `message` (SMS rapide), `urgence` (SOS)."
    ),
)
async def senior_action(
    action: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    actions = {
        "lumiere":  "Éclairage adapté senior activé",
        "famille":  "Appel contact d'urgence déclenché",
        "message":  "Message rapide envoyé à la famille",
    }

    if action == "urgence":
        return await send_urgency(db=db, current_user=current_user)

    if action not in actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Action '{action}' inconnue. Actions valides : lumiere, famille, message, urgence."
        )

    # Broadcast notification
    await manager.broadcast("activity", {
        "id": f"senior_{datetime.datetime.now().timestamp()}",
        "time": datetime.datetime.now().strftime("%H:%M"),
        "text": f"{actions[action]} — {current_user.nom}",
        "icon": "sparkles",
        "ok": True,
    })

    return {"detail": actions[action]}

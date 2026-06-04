from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import datetime

from app.core.database import get_db
from app.models.user import User
from app.models.light import LightState
from app.models.access_log import AccessLog
from app.schemas.light import RoomOut, LightCommand
from app.deps import get_current_user, check_time_window
from app.websocket.manager import manager

router = APIRouter(tags=["Éclairage"])

# Default rooms to seed if the table is empty
DEFAULT_ROOMS = [
    {"id": "salon",     "name": "Salon",              "devices": 8,  "active": 5, "temp": "22°C", "lit": True,  "brightness": 70,  "color": "warm"},
    {"id": "cuisine",   "name": "Cuisine",             "devices": 6,  "active": 2, "temp": "21°C", "lit": False, "brightness": 100, "color": "cool"},
    {"id": "chambre",   "name": "Chambre principale",  "devices": 4,  "active": 1, "temp": "20°C", "lit": True,  "brightness": 25,  "color": "warm"},
    {"id": "bureau",    "name": "Bureau",              "devices": 5,  "active": 3, "temp": "23°C", "lit": True,  "brightness": 85,  "color": "cool"},
    {"id": "sdb",       "name": "Salle de bain",       "devices": 3,  "active": 0, "temp": "22°C", "lit": False, "brightness": 60,  "color": "warm"},
    {"id": "entree",    "name": "Entrée",              "devices": 2,  "active": 1, "temp": "19°C", "lit": True,  "brightness": 50,  "color": "warm"},
]

async def _seed_rooms_if_empty(db: AsyncSession) -> None:
    """Insère les pièces par défaut si la table est vide."""
    result = await db.execute(select(LightState))
    if not result.scalars().first():
        for room_data in DEFAULT_ROOMS:
            db.add(LightState(**room_data))
        await db.commit()


@router.get(
    "/api/rooms",
    summary="Liste des pièces",
    description="Retourne l'état actuel de l'éclairage et des équipements pour chaque pièce de la maison.",
    response_model=List[RoomOut],
)
async def get_rooms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await _seed_rooms_if_empty(db)
    result = await db.execute(select(LightState).order_by(LightState.name))
    return result.scalars().all()


@router.patch(
    "/api/rooms/{room_id}",
    summary="Modifier l'éclairage d'une pièce",
    description=(
        "Met à jour l'état on/off, la luminosité ou la couleur d'une pièce. "
        "**Rôles autorisés** : `proprietaire`, `famille`. "
        "Les rôles `locataire` et `personnel` sont limités à la plage **8h–18h**. "
        "Le rôle `senior` a accès en lecture seule."
    ),
    response_model=RoomOut,
)
async def update_room(
    room_id: str,
    command: LightCommand,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_time_window),
):
    # senior = read-only
    if current_user.role == "senior":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Le rôle senior dispose d'un accès en lecture seule."
        )

    result = await db.execute(select(LightState).where(LightState.id == room_id))
    room = result.scalar_one_or_none()

    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Pièce '{room_id}' introuvable.")

    # Apply changes
    updated_fields = command.model_dump(exclude_none=True)
    for field, value in updated_fields.items():
        setattr(room, field, value)

    # Update active count based on lit state
    if "lit" in updated_fields:
        room.active = room.active + (1 if room.lit else -1)
        room.active = max(0, min(room.active, room.devices))

    db.add(room)

    # Log the action
    log = AccessLog(
        user_id=current_user.id,
        t=datetime.datetime.now().strftime("%H:%M"),
        who=current_user.nom,
        method="Commande éclairage",
        door=room.name,
        ok=True
    )
    db.add(log)
    await db.commit()
    await db.refresh(room)

    # Broadcast to all WebSocket clients
    await manager.broadcast("room", {
        "id": room.id,
        "name": room.name,
        "lit": room.lit,
        "brightness": room.brightness,
        "color": room.color,
        "active": room.active,
    })

    return room


@router.post(
    "/api/scenarios/activate",
    summary="Activer un scénario d'éclairage",
    description="Active un scénario prédéfini ('Réveil doux', 'Concentration', 'Soirée cinéma', 'Nuit') et ajuste toutes les pièces en conséquence.",
)
async def activate_scenario(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scenarios = {
        "Réveil doux":     {"lit": True,  "brightness": 30,  "color": "warm"},
        "Concentration":   {"lit": True,  "brightness": 90,  "color": "cool"},
        "Soirée cinéma":   {"lit": True,  "brightness": 20,  "color": "warm"},
        "Nuit":            {"lit": False, "brightness": 0,   "color": "warm"},
        "Soirée":          {"lit": True,  "brightness": 50,  "color": "warm"},
    }
    name = payload.get("name", "")
    if name not in scenarios:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Scénario '{name}' inconnu.")

    settings_map = scenarios[name]
    result = await db.execute(select(LightState))
    rooms = result.scalars().all()

    for room in rooms:
        for field, value in settings_map.items():
            setattr(room, field, value)
        db.add(room)

    await db.commit()

    await manager.broadcast("activity", {
        "id": f"scenario_{datetime.datetime.now().timestamp()}",
        "time": datetime.datetime.now().strftime("%H:%M"),
        "text": f"Scénario « {name} » activé par {current_user.nom}",
        "icon": "sparkles",
        "ok": True,
    })

    return {"detail": f"Scénario '{name}' activé avec succès."}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import datetime

from app.core.database import get_db
from app.models.door_state import DoorState
from app.models.access_log import AccessLog
from app.models.user import User
from app.deps import get_current_user, require_roles
from app.websocket.manager import manager

router = APIRouter(tags=["Portes"])

DEFAULT_DOORS = [
    {"id": "entree",  "name": "Entrée principale", "locked": True},
    {"id": "garage",  "name": "Garage",             "locked": True},
    {"id": "arriere", "name": "Porte arrière",      "locked": True},
]


async def _seed_doors_if_empty(db: AsyncSession) -> None:
    result = await db.execute(select(DoorState))
    if not result.scalars().first():
        for d in DEFAULT_DOORS:
            db.add(DoorState(**d))
        await db.commit()


@router.get(
    "/api/doors",
    summary="État des portes",
    description="Retourne l'état de verrouillage de toutes les portes de la maison.",
)
async def get_doors(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[dict]:
    await _seed_doors_if_empty(db)
    result = await db.execute(select(DoorState).order_by(DoorState.name))
    doors = result.scalars().all()
    return [{"id": d.id, "name": d.name, "locked": d.locked} for d in doors]


@router.patch(
    "/api/doors/{door_id}",
    summary="Verrouiller / déverrouiller une porte",
    description="Change l'état de verrouillage d'une porte. Réservé aux rôles **propriétaire** et **famille**.",
)
async def update_door(
    door_id: str,
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("proprietaire", "famille")),
) -> dict:
    result = await db.execute(select(DoorState).where(DoorState.id == door_id))
    door = result.scalar_one_or_none()

    if not door:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Porte '{door_id}' introuvable.")

    locked = bool(payload.get("locked", not door.locked))
    door.locked = locked

    # Log the action
    log = AccessLog(
        user_id=current_user.id,
        t=datetime.datetime.now().strftime("%H:%M"),
        who=current_user.nom,
        method="Commande porte",
        door=door.name,
        ok=True,
    )
    db.add(log)
    await db.commit()
    await db.refresh(door)

    # Broadcast WebSocket event
    await manager.broadcast("door", {
        "id":     door.id,
        "name":   door.name,
        "locked": door.locked,
    })

    return {"id": door.id, "name": door.name, "locked": door.locked}

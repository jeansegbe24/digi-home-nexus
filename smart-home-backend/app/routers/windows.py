from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import datetime

from app.core.database import get_db
from app.models.window_state import WindowState
from app.models.access_log import AccessLog
from app.models.user import User
from app.deps import get_current_user, require_roles
from app.websocket.manager import manager

router = APIRouter(tags=["Fenêtres"])

DEFAULT_WINDOWS = [
    {"id": "salon",   "name": "Fenêtre Salon",          "open": False},
    {"id": "chambre", "name": "Fenêtre Chambre",         "open": True},
    {"id": "bureau",  "name": "Fenêtre Bureau",          "open": False},
    {"id": "cuisine", "name": "Fenêtre Cuisine",         "open": True},
    {"id": "sdb",     "name": "Fenêtre Salle de bain",   "open": False},
]


async def _seed_windows_if_empty(db: AsyncSession) -> None:
    result = await db.execute(select(WindowState))
    if not result.scalars().first():
        for w in DEFAULT_WINDOWS:
            db.add(WindowState(**w))
        await db.commit()


@router.get(
    "/api/windows",
    summary="État des fenêtres",
    description="Retourne l'état ouvert/fermé de toutes les fenêtres de la maison.",
)
async def get_windows(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[dict]:
    await _seed_windows_if_empty(db)
    result = await db.execute(select(WindowState).order_by(WindowState.name))
    windows = result.scalars().all()
    return [{"id": w.id, "name": w.name, "open": w.open} for w in windows]


@router.patch(
    "/api/windows/{window_id}",
    summary="Ouvrir / fermer une fenêtre",
    description="Change l'état ouvert/fermé d'une fenêtre. Réservé aux rôles **propriétaire** et **famille**.",
)
async def update_window(
    window_id: str,
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("proprietaire", "famille")),
) -> dict:
    result = await db.execute(select(WindowState).where(WindowState.id == window_id))
    window = result.scalar_one_or_none()

    if not window:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fenêtre '{window_id}' introuvable.")

    window.open = bool(payload.get("open", not window.open))

    log = AccessLog(
        user_id=current_user.id,
        t=datetime.datetime.now().strftime("%H:%M"),
        who=current_user.nom,
        method="Commande fenêtre",
        door=window.name,
        ok=True,
    )
    db.add(log)
    await db.commit()
    await db.refresh(window)

    await manager.broadcast("window", {
        "id":   window.id,
        "name": window.name,
        "open": window.open,
    })

    return {"id": window.id, "name": window.name, "open": window.open}

from fastapi import Depends, HTTPException, Cookie, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime
from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.core.logging import get_logger

logger = get_logger(__name__)


async def get_current_user(
    request: Request,
    access_token: Optional[str] = Cookie(default=None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Lit le cookie HTTP-only `access_token`, vérifie le JWT
    et retourne l'utilisateur authentifié.
    """
    if not access_token:
        logger.warning(
            "auth.missing_cookie",
            path=request.url.path,
            origin=request.headers.get("origin"),
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié : cookie access_token manquant."
        )

    payload = verify_token(access_token, expected_type="access")
    if not payload:
        logger.warning("auth.invalid_token", path=request.url.path)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré."
        )

    user_id = int(payload["sub"])
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable."
        )
    return user


def require_roles(*allowed_roles: str):
    """
    Fabrique un dépendance FastAPI qui vérifie que l'utilisateur courant
    possède l'un des rôles autorisés.
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès refusé. Rôles autorisés : {', '.join(allowed_roles)}."
            )
        return current_user
    return role_checker


def check_time_window(current_user: User = Depends(get_current_user)) -> User:
    """
    Pour les rôles 'locataire' et 'personnel', vérifie que l'accès
    se situe dans la plage horaire autorisée (8h–18h).
    """
    restricted_roles = {"locataire", "personnel"}
    if current_user.role in restricted_roles:
        now = datetime.now()
        if not (8 <= now.hour < 18):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé : hors de la plage horaire autorisée (8h–18h)."
            )
    return current_user

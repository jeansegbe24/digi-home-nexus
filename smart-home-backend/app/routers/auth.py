from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, verify_token
from app.core.config import settings
from app.core.logging import get_logger
from app.models.user import User
from app.models.access_log import AccessLog
from app.schemas.auth import LoginRequest
from app.schemas.user import UserOut
from app.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentification"])

logger = get_logger(__name__)

COOKIE_SETTINGS = {
    "httponly": True,
    "samesite": settings.COOKIE_SAMESITE,
    "secure":   settings.COOKIE_SECURE,
}


@router.post(
    "/login",
    summary="Connexion utilisateur",
    description="Authentifie un utilisateur avec email/mot de passe. Dépose deux cookies HTTP-only : `access_token` (30min) et `refresh_token` (7j).",
    response_model=UserOut,
)
async def login(
    credentials: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        logger.warning("auth.login_failed", email=credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect."
        )

    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(
        subject=user.id,
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    response.set_cookie(key="access_token",  value=access_token,  max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, **COOKIE_SETTINGS)
    response.set_cookie(key="refresh_token", value=refresh_token, max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400, **COOKIE_SETTINGS)

    log = AccessLog(
        user_id=user.id,
        t=__import__("datetime").datetime.now().strftime("%H:%M"),
        who=user.nom,
        method="Authentification",
        door="Application",
        ok=True
    )
    db.add(log)
    await db.commit()

    logger.info("auth.login_success", user_id=user.id, email=user.email, role=user.role)
    return user


@router.post(
    "/refresh",
    summary="Rafraîchir le token d'accès",
    description="Utilise le cookie `refresh_token` HTTP-only pour émettre un nouveau `access_token` valable 30 minutes.",
    response_model=UserOut,
)
async def refresh(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cookie refresh_token manquant.")

    payload = verify_token(refresh_token, expected_type="refresh")
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalide ou expiré.")

    user_id = int(payload["sub"])
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable.")

    new_access_token = create_access_token(
        subject=user.id,
        role=user.role,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    response.set_cookie(key="access_token", value=new_access_token, max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, **COOKIE_SETTINGS)
    return user


@router.post(
    "/logout",
    summary="Déconnexion",
    description="Supprime les cookies d'authentification `access_token` et `refresh_token`.",
)
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "Déconnecté avec succès."}


@router.get(
    "/me",
    summary="Session courante",
    description="Retourne les informations de l'utilisateur authentifié en lisant le cookie `access_token`.",
    response_model=UserOut,
)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

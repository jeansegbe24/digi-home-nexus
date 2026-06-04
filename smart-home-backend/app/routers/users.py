from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.deps import get_current_user, require_roles

router = APIRouter(prefix="/api/users", tags=["Utilisateurs"])

PROPRIETAIRE_ONLY = Depends(require_roles("proprietaire"))


@router.get(
    "",
    summary="Liste de tous les utilisateurs",
    description="Retourne la liste de tous les profils enregistrés dans la maison. Accessible à tous les utilisateurs authentifiés.",
    response_model=List[UserOut],
)
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(User).order_by(User.id))
    return result.scalars().all()


@router.post(
    "",
    summary="Créer un utilisateur",
    description="Crée un nouveau profil utilisateur. Réservé au rôle **propriétaire**.",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
    _: User = PROPRIETAIRE_ONLY,
):
    # Check uniqueness
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Un utilisateur avec l'email '{payload.email}' existe déjà."
        )

    user = User(
        nom=payload.nom,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        langue=payload.langue,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.patch(
    "/{user_id}",
    summary="Modifier un utilisateur",
    description="Met à jour les informations d'un profil utilisateur. Réservé au rôle **propriétaire**.",
    response_model=UserOut,
)
async def update_user(
    user_id: int,
    payload: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = PROPRIETAIRE_ONLY,
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")

    update_data = payload.model_dump(exclude_none=True)
    if "password" in update_data:
        user.hashed_password = hash_password(update_data.pop("password"))
    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.delete(
    "/{user_id}",
    summary="Supprimer un utilisateur",
    description="Supprime un profil utilisateur de la base de données. Réservé au rôle **propriétaire**.",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = PROPRIETAIRE_ONLY,
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")

    await db.delete(user)
    await db.commit()

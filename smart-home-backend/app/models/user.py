from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from .access_log import AccessLog

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Famille", nullable=False) # proprietaire, famille, senior, locataire, personnel
    langue = Column(String, default="fr", nullable=False) # fr, en
    biometric_hash = Column(String, nullable=True)

    # Relationships
    logs = relationship("AccessLog", back_populates="user", cascade="all, delete-orphan")

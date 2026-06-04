from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    t = Column(String, nullable=False) # Time string format (e.g. "14:32")
    who = Column(String, nullable=False) # Name or "Inconnu"
    method = Column(String, nullable=False) # Faciale, Vocale, Badge RFID, Empreinte, Code PIN
    door = Column(String, nullable=False) # Entrée principale, Garage, Porte arrière, etc.
    ok = Column(Boolean, default=True, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="logs")

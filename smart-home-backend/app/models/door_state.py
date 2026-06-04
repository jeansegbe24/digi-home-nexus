from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class DoorState(Base):
    """Stores the current lock state of each door in the smart home."""
    __tablename__ = "door_states"

    id     = Column(String, primary_key=True, index=True)  # e.g. "entree", "garage"
    name   = Column(String, nullable=False)                # Human-readable label
    locked = Column(Boolean, default=True, nullable=False)
    last_changed = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    timestamp    = Column(DateTime(timezone=True), server_default=func.now())

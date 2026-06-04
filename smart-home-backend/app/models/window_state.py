from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class WindowState(Base):
    """Stores the current open/closed state of each window in the smart home."""
    __tablename__ = "window_states"

    id     = Column(String, primary_key=True, index=True)  # e.g. "salon", "chambre"
    name   = Column(String, nullable=False)
    open   = Column(Boolean, default=False, nullable=False)
    last_changed = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    timestamp    = Column(DateTime(timezone=True), server_default=func.now())

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    level = Column(String, default="info", nullable=False) # info, warn, ok
    t = Column(String, nullable=False) # Time string format (e.g. "14:32")
    text = Column(String, nullable=False)
    icon = Column(String, default="shield", nullable=False) # shield, alerttriangle, eye, radio
    read = Column(Boolean, default=False, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

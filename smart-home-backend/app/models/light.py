from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class LightState(Base):
    __tablename__ = "light_states"

    id = Column(String, primary_key=True, index=True) # e.g. "salon", "cuisine"
    name = Column(String, nullable=False)
    devices = Column(Integer, default=5, nullable=False)
    active = Column(Integer, default=0, nullable=False)
    temp = Column(String, default="20°C", nullable=False)
    lit = Column(Boolean, default=False, nullable=False)
    brightness = Column(Integer, default=0, nullable=False)
    color = Column(String, default="warm", nullable=False) # warm, cool
    timestamp = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

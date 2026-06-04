from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class SensorData(Base):
    """Stores periodic sensor readings for historical charts and analytics."""
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    temperature = Column(Float, nullable=False)   # Celsius
    humidity    = Column(Float, nullable=False)   # Percentage
    aqi         = Column(Float, nullable=False)   # Air Quality Index (0-100)
    power       = Column(Float, nullable=False)   # Current power draw in kW
    timestamp   = Column(DateTime(timezone=True), server_default=func.now(), index=True)

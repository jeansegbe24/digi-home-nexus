# Import all models here so SQLAlchemy and Alembic can discover them
from app.models.user import User
from app.models.access_log import AccessLog
from app.models.alert import Alert
from app.models.light import LightState
from app.models.sensor_data import SensorData
from app.models.door_state import DoorState
from app.models.window_state import WindowState

__all__ = [
    "User",
    "AccessLog",
    "Alert",
    "LightState",
    "SensorData",
    "DoorState",
    "WindowState",
]

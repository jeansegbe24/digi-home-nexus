from pydantic import BaseModel, Field
from typing import Optional

class RoomOut(BaseModel):
    """État complet d'une pièce retourné au client."""
    id: str
    name: str
    devices: int
    active: int
    temp: str
    lit: bool
    brightness: int = Field(ge=0, le=100)
    color: str  # "warm" | "cool"

    model_config = {"from_attributes": True}

class LightCommand(BaseModel):
    """Commande de modification de l'éclairage d'une pièce."""
    lit: Optional[bool] = None
    brightness: Optional[int] = Field(default=None, ge=0, le=100)
    color: Optional[str] = None  # "warm" | "cool"

    model_config = {
        "json_schema_extra": {
            "example": {
                "lit": True,
                "brightness": 75,
                "color": "warm"
            }
        }
    }

from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    nom: str
    email: str
    password: str
    role: str = "famille"
    langue: str = "fr"

    model_config = {
        "json_schema_extra": {
            "example": {
                "nom": "Marie Dupont",
                "email": "marie@digihome.com",
                "password": "secret123",
                "role": "famille",
                "langue": "fr"
            }
        }
    }

class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    langue: Optional[str] = None
    password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    nom: str
    email: str
    role: str
    langue: str

    model_config = {"from_attributes": True}

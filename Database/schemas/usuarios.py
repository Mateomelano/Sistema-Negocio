from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    
class Usuarios(UserLogin):
    id: int
    nombre: str = Field(min_length=5, max_length=20)
    rol: str = Field(max_length=20)
    @field_validator('rol')
    def validate_rol(cls, roll):
        if roll not in ["Cliente", "Administrador"]:
            raise ValueError('El campo "rol" debe ser "Cliente" o "Administrador"')
        return roll



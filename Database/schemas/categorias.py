from pydantic import BaseModel, Field
from typing import Optional, List

class Categoria(BaseModel):
    id_categoria: int
    nombre: str = Field(min_length=3, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=255)

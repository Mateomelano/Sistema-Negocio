from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class Caja(BaseModel):
    id: int
    fecha: date
    total: float
    estado: str = Field(max_length=50)
    id_venta: int  # Asumiendo que quieres guardar el id de la venta relacionada

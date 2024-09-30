from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class Venta(BaseModel):
    id_venta: int
    id_producto: int
    id_usuario: int  # Relación con el usuario que realiza la venta
    total: float
    cantidad_producto: int
    tipo_pago: str = Field(min_length=3, max_length=50)  # Ej: "efectivo", "tarjeta"
    fecha: date

    class Config:
        orm_mode = True

from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class VentaProducto(BaseModel):
    id_producto: int
    cantidad: int
    subtotal: float
    id_categoria: Optional[int]  # Si quieres agregar el id_categoria

class Venta(BaseModel):
    id_usuario: int
    total: float
    tipo_pago: str
    fecha: date
    productos: List[VentaProducto]  # Asegúrate de que sea una lista de VentaProducto

    class Config:
        orm_mode = True

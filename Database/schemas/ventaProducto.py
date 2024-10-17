from pydantic import BaseModel

class VentaProducto(BaseModel):
    id_venta_producto: Optional[int]  # Puede que quieras hacerlo opcional si es autogenerado
    id_venta: int
    id_producto: int
    cantidad: int
    subtotal: float

    class Config:
        orm_mode = True
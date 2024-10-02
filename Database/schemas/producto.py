from pydantic import BaseModel, Field
from typing import Optional


class Producto(BaseModel):
    id_producto: int
    nombre: str = Field(min_length=1, max_length=100, description="El nombre del producto es obligatorio")  # Nuevo atributo
    cod_barra: str = Field(min_length=5, max_length=50)
    precio_coste: float = Field(ge=0, description="El precio de coste debe ser mayor o igual a 0")
    precio_final: float = Field(ge=0, description="El precio final debe ser mayor o igual a 0")
    peso: float = Field(ge=0, description="El peso debe ser mayor o igual a 0")
    imagen: Optional[str] = Field(default=None, description="URL de la imagen del producto")
    id_categoria: int = Field(ge=1, description="ID de la categoría a la que pertenece el producto")

    class Config:
        orm_mode = True

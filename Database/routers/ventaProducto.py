from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse
from typing import List
from config.database import SessionLocal
from fastapi.encoders import jsonable_encoder
from services.ventaProducto import VentaProductoService  # Asegúrate de importar tu servicio de productos
from schemas.ventas import VentaProducto

venta_productos_router = APIRouter()

# Obtener todos los productos asociados a ventas
@venta_productos_router.get('/venta-productos', tags=['venta_productos'], response_model=List[VentaProducto], status_code=200)
def get_venta_productos() -> List[VentaProducto]:
    db = SessionLocal()
    result = VentaProductoService(db).get_venta_productos()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

# Obtener productos de una venta específica por ID de venta
@venta_productos_router.get('/venta-productos/venta/{id_venta}', tags=['venta_productos'], response_model=List[VentaProducto], status_code=200)
def get_venta_productos_by_venta_id(id_venta: int = Path(ge=1)) -> List[VentaProducto]:
    db = SessionLocal()
    result = VentaProductoService(db).get_venta_productos_by_venta_id(id_venta)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No se encontraron productos para esta venta"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

# Obtener un producto específico de una venta por ID de venta_producto
@venta_productos_router.get('/venta-productos/{id_venta_producto}', tags=['venta_productos'], response_model=VentaProducto, status_code=200)
def get_venta_producto_by_id(id_venta_producto: int = Path(ge=1)) -> VentaProducto:
    db = SessionLocal()
    result = VentaProductoService(db).get_venta_producto_by_id(id_venta_producto)
    if not result:
        return JSONResponse(status_code=404, content={'message': "Producto no encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

# Crear un nuevo producto asociado a una venta
@venta_productos_router.post('/venta-productos', tags=['venta_productos'], response_model=dict, status_code=201)
def create_venta_producto(venta_producto: VentaProducto) -> dict:
    db = SessionLocal()
    VentaProductoService(db).create_venta_producto(venta_producto)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado el producto en la venta"})

# Actualizar un producto asociado a una venta
@venta_productos_router.put('/venta-productos/{id_venta_producto}', tags=['venta_productos'], response_model=dict, status_code=200)
def update_venta_producto(id_venta_producto: int, venta_producto: VentaProducto) -> dict:
    db = SessionLocal()
    result = VentaProductoService(db).get_venta_producto_by_id(id_venta_producto)
    if not result:
        return JSONResponse(status_code=404, content={'message': "Producto no encontrado"})
    
    VentaProductoService(db).update_venta_producto(id_venta_producto, venta_producto)
    return JSONResponse(status_code=200, content={"message": "Se ha actualizado el producto de la venta"})

# Eliminar un producto específico de una venta
@venta_productos_router.delete('/venta-productos/{id_venta_producto}', tags=['venta_productos'], response_model=dict, status_code=200)
def delete_venta_producto(id_venta_producto: int) -> dict:
    db = SessionLocal()
    result = VentaProductoService(db).get_venta_producto_by_id(id_venta_producto)
    if not result:
        return JSONResponse(status_code=404, content={"message": "Producto no encontrado"})
    
    VentaProductoService(db).delete_venta_producto(id_venta_producto)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado el producto de la venta"})

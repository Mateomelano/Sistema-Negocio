from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from config.database import SessionLocal
from models.modelos import Producto as ProductoModel
from fastapi.encoders import jsonable_encoder
from middlewares.jwt_bearer import JWTBearer
from services.producto import ProductoService
from schemas.producto import Producto

producto_router = APIRouter()


@producto_router.get('/productos', tags=['Producto'], response_model=List[Producto], status_code=200)
def get_productos() -> List[Producto]:
    db = SessionLocal()
    result = ProductoService(db).get_productos()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@producto_router.get('/productos/{id}', tags=['Producto'], response_model=Producto, status_code=200)
def get_producto(id: int = Path(ge=1, le=2000)) -> Producto:
    db = SessionLocal()
    result = ProductoService(db).get_producto_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@producto_router.get('/productos/cod_barra/{cod_barra}', tags=['Producto'], response_model=Producto, status_code=200)
def get_producto_by_cod_barra(cod_barra: int = Path(..., ge=1)) -> Producto:
    db = SessionLocal()
    result = ProductoService(db).get_producto_cod_barra(cod_barra)
    if not result:
        return JSONResponse(status_code=404, content={'message': "Producto no encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@producto_router.post('/productos', tags=['Producto'], response_model=dict, status_code=201)
def create_producto(producto: Producto) -> dict:
    db = SessionLocal()
    ProductoService(db).create_producto(producto)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado el Producto"})


@producto_router.put('/productos/{id}', tags=['Producto'], response_model=dict, status_code=200)
def update_producto(id: int, producto: Producto) -> dict:
    db = SessionLocal()
    result = ProductoService(db).get_producto_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})

    ProductoService(db).update_producto(id, producto)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado el Producto"})


@producto_router.delete('/productos/{id}', tags=['Producto'], response_model=dict, status_code=200)
def delete_producto(id: int) -> dict:
    db = SessionLocal()
    result: ProductoModel = db.query(ProductoModel).filter(ProductoModel.id_producto == id).first()
    if not result:
        return JSONResponse(status_code=404, content={"message": "No se encontró"})
    ProductoService(db).delete_producto(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado el Producto"})

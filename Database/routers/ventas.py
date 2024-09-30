from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from config.database import SessionLocal
from models.modelos import Venta as VentaModel
from fastapi.encoders import jsonable_encoder
from middlewares.jwt_bearer import JWTBearer
from services.ventas import VentaService
from schemas.ventas import Venta

ventas_router = APIRouter()


@ventas_router.get('/ventas', tags=['ventas'], response_model=List[Venta], status_code=200)
def get_ventas() -> List[Venta]:
    db = SessionLocal()
    result = VentaService(db).get_ventas()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@ventas_router.get('/ventas/{id}', tags=['ventas'], response_model=Venta, status_code=200)
def get_venta(id: int = Path(ge=1, le=2000)) -> Venta:
    db = SessionLocal()
    result = VentaService(db).get_venta_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@ventas_router.post('/ventas', tags=['ventas'], response_model=dict, status_code=201)
def create_venta(venta: Venta) -> dict:
    db = SessionLocal()
    VentaService(db).create_venta(venta)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado la venta"})


@ventas_router.put('/ventas/{id}', tags=['ventas'], response_model=dict, status_code=200)
def update_venta(id: int, venta: Venta) -> dict:
    db = SessionLocal()
    result = VentaService(db).get_venta_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    
    VentaService(db).update_venta(id, venta)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado la venta"})


@ventas_router.delete('/ventas/{id}', tags=['ventas'], response_model=dict, status_code=200)
def delete_venta(id: int) -> dict:
    db = SessionLocal()
    result: VentaModel = db.query(VentaModel).filter(VentaModel.id_venta == id).first()
    if not result:
        return JSONResponse(status_code=404, content={"message": "No se encontró"})
    VentaService(db).delete_venta(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado la venta"})

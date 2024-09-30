from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from config.database import SessionLocal
from models.modelos import Caja as CajaModel
from fastapi.encoders import jsonable_encoder
from middlewares.jwt_bearer import JWTBearer
from services.caja import CajaService
from schemas.caja import Caja

caja_router = APIRouter()


@caja_router.get('/caja', tags=['Caja'], response_model=List[Caja], status_code=200)
def get_caja() -> List[Caja]:
    db = SessionLocal()
    result = CajaService(db).get_cajas()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@caja_router.get('/caja/{id}', tags=['Caja'], response_model=Caja, status_code=200)
def get_caja(id: int = Path(ge=1, le=2000)) -> Caja:
    db = SessionLocal()
    result = CajaService(db).get_caja_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@caja_router.get('/caja/usuario_id/{id}', tags=['Caja'], response_model=List[Caja], status_code=200)
def get_caja_by_id_usuario(id: int = Path(ge=1, le=2000)) -> List[Caja]:
    db = SessionLocal()
    result = CajaService(db).get_caja_usuario_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@caja_router.post('/caja', tags=['Caja'], response_model=dict, status_code=201)
def create_caja(caja: Caja) -> dict:
    db = SessionLocal()
    CajaService(db).create_caja(caja)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado la caja"})


@caja_router.put('/caja/{id}', tags=['Caja'], response_model=dict, status_code=200)
def update_caja(id: int, caja: Caja) -> dict:
    db = SessionLocal()
    result = CajaService(db).get_caja_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})

    CajaService(db).update_caja(id, caja)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado la caja"})


@caja_router.delete('/caja/{id}', tags=['Caja'], response_model=dict, status_code=200)
def delete_caja(id: int) -> dict:
    db = SessionLocal()
    result: CajaModel = db.query(CajaModel).filter(CajaModel.id == id).first()
    if not result:
        return JSONResponse(status_code=404, content={"message": "No se encontró"})
    CajaService(db).delete_caja(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado la caja"})

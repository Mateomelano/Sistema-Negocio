from fastapi import APIRouter, Depends, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from config.database import SessionLocal
from models.modelos import Categoria as CategoriaModel
from fastapi.encoders import jsonable_encoder
from services.categorias import CategoriaService
from schemas.categorias import Categoria

categoria_router = APIRouter()


@categoria_router.get('/categorias', tags=['Categorias'], response_model=List[Categoria], status_code=200)
def get_categorias() -> List[Categoria]:
    db = SessionLocal()
    result = CategoriaService(db).get_categorias()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@categoria_router.get('/categorias/{id}', tags=['Categorias'], response_model=Categoria, status_code=200)
def get_categoria(id: int = Path(ge=1, le=2000)) -> Categoria:
    db = SessionLocal()
    result = CategoriaService(db).get_categoria_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))


@categoria_router.post('/categorias', tags=['Categorias'], response_model=dict, status_code=201)
def create_categoria(categoria: Categoria) -> dict:
    db = SessionLocal()
    CategoriaService(db).create_categoria(categoria)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado la categoría"})


@categoria_router.put('/categorias/{id}', tags=['Categorias'], response_model=dict, status_code=200)
def update_categoria(id: int, categoria: Categoria) -> dict:
    db = SessionLocal()
    result = CategoriaService(db).get_categoria_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})

    CategoriaService(db).update_categoria(id, categoria)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado la categoría"})


@categoria_router.delete('/categorias/{id}', tags=['Categorias'], response_model=dict, status_code=200)
def delete_categoria(id: int) -> dict:
    db = SessionLocal()
    result: CategoriaModel = db.query(CategoriaModel).filter(CategoriaModel.id == id).first()
    if not result:
        return JSONResponse(status_code=404, content={"message": "No se encontró"})
    CategoriaService(db).delete_categoria(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado la categoría"})

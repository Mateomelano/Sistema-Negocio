from fastapi import APIRouter, Depends, HTTPException, Path, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from config.database import SessionLocal
from models.modelos import Usuarios as UsuarioModel
from fastapi.encoders import jsonable_encoder
from middlewares.jwt_bearer import JWTBearer
from services.usuarios import UsuariosService
from schemas.usuarios import Usuarios, UserLogin
from datetime import datetime, timedelta
import jwt
from utils.jwt_manager import create_token

SECRET_KEY = "your_secret_key"  # Cambia esto por una clave secreta adecuada
ALGORITHM = "HS256"

usuarios_router = APIRouter()

@usuarios_router.post('/token', tags=['Autenticacion'], response_model=dict)
def login_for_access_token(user: UserLogin):
    db: Session = SessionLocal()
    user_db = UsuariosService(db).get_usuarios_by_mail(user.email)
    
    if not user_db or user_db.password != user.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return JSONResponse(status_code=200)

@usuarios_router.get('/usuarios', tags=['Usuarios'], response_model=List[Usuarios], status_code=200)
def get_usuarios() -> List[Usuarios]:
    db = SessionLocal()
    result = UsuariosService(db).get_usuarios()
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@usuarios_router.get('/usuarios/{id}', tags=['Usuarios'], response_model=Usuarios)
def get_usuarios(id: int = Path(ge=1, le=2000)) -> Usuarios:
    db = SessionLocal()
    result = UsuariosService(db).get_usuarios_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@usuarios_router.get('/usuarios/', tags=['Usuarios'], response_model=List[Usuarios])
def get_usuarios_by_mail(email: str = Query(min_length=5, max_length=35)) -> List[Usuarios]:
    db = SessionLocal()
    result = UsuariosService(db).get_usuarios_by_mail(email)
    return JSONResponse(status_code=200, content=jsonable_encoder(result))

@usuarios_router.post('/usuarios', tags=['Usuarios'], response_model=dict, status_code=201)
def create_usuarios(usuario: Usuarios) -> dict:
    db = SessionLocal()
    UsuariosService(db).create_usuarios(usuario)
    return JSONResponse(status_code=201, content={"message": "Se ha registrado el usuario"})

@usuarios_router.put('/usuarios/{id}', tags=['Usuarios'], response_model=dict, status_code=200)
def update_usuarios(id: int, usuario: Usuarios) -> dict:
    db = SessionLocal()
    result = UsuariosService(db).get_usuarios_id(id)
    if not result:
        return JSONResponse(status_code=404, content={'message': "No encontrado"})
    
    UsuariosService(db).update_usuarios(id, usuario)
    return JSONResponse(status_code=200, content={"message": "Se ha modificado el usuario"})

@usuarios_router.delete('/usuarios/{id}', tags=['Usuarios'], response_model=dict, status_code=200)
def delete_usuarios(id: int) -> dict:
    db = SessionLocal()
    result: UsuarioModel = db.query(UsuarioModel).filter(UsuarioModel.id == id).first()
    if not result:
        return JSONResponse(status_code=404, content={"message": "No se encontró"})
    UsuariosService(db).delete_usuarios(id)
    return JSONResponse(status_code=200, content={"message": "Se ha eliminado el usuario"})

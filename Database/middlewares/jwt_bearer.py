from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException
from utils.jwt_manager import validate_token
from config.database import SessionLocal
from models.modelos import Usuarios as UsuarioModel

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        auth = await super().__call__(request)
        token = auth.credentials
        data = validate_token(token)
        db = SessionLocal()
        user = db.query(UsuarioModel).filter(UsuarioModel.email == data.get('sub')).first()
        if not user:
            raise HTTPException(status_code=403, detail="Credenciales son invalidas")
        

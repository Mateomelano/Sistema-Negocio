from typing import Optional
from models.modelos import Usuarios as UsuariosModel
from schemas.usuarios import Usuarios


class UsuariosService:
    
    def __init__(self, db) -> None:
        self.db = db

    def get_usuarios(self) -> list[UsuariosModel]:
        try:
            result = self.db.query(UsuariosModel).all()
            return result
        except Exception as e:
            print(f"Error fetching users: {e}")
            return []

    def get_usuarios_id(self, id: int) -> Optional[UsuariosModel]:
        try:
            result = self.db.query(UsuariosModel).filter(UsuariosModel.id == id).first()
            return result
        except Exception as e:
            print(f"Error fetching user by ID: {e}")
            return None

    def get_usuarios_by_mail(self, email: str) -> Optional[UsuariosModel]:
        try:
            result = self.db.query(UsuariosModel).filter(UsuariosModel.email == email).first()
            return result
        except Exception as e:
            print(f"Error fetching user by email: {e}")
            return None

    def create_usuarios(self, usuario: Usuarios) -> None:
        try:
            new_usuario = UsuariosModel(**usuario.dict())
            self.db.add(new_usuario)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            print(f"Error creating user: {e}")

    def update_usuarios(self, id: int, data: Usuarios) -> Optional[UsuariosModel]:
        try:
            usuario = self.db.query(UsuariosModel).filter(UsuariosModel.id == id).first()
            if usuario:
                usuario.nombre = data.nombre
                usuario.email = data.email
                usuario.password = data.password
                usuario.rol = data.rol
                self.db.commit()
                return usuario
            else:
                print("User not found")
                return None
        except Exception as e:
            self.db.rollback()
            print(f"Error updating user: {e}")
            return None

    def delete_usuarios(self, id: int) -> bool:
        try:
            self.db.query(UsuariosModel).filter(UsuariosModel.id == id).delete()
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            print(f"Error deleting user: {e}")
            return False

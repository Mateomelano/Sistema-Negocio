from models.modelos import Categoria as CategoriaModel
from schemas.categorias import Categoria

print("CATEGORIAS" , Categoria)

class CategoriaService():
    
    def __init__(self, db) -> None:
        self.db = db

    def get_categorias(self):
        result = self.db.query(CategoriaModel).all()
        return result

    def get_categoria_id(self, id):
        result = self.db.query(CategoriaModel).filter(CategoriaModel.id_categoria == id).first()
        return result

    def create_categoria(self, categoria: Categoria):
        new_categoria = CategoriaModel(**categoria.dict())
        self.db.add(new_categoria)
        self.db.commit()
        return

    def update_categoria(self, id: int, data: Categoria):
        categoria = self.db.query(CategoriaModel).filter(CategoriaModel.id_categoria == id).first()
        if categoria:
            categoria.nombre = data.nombre
            categoria.descripcion = data.descripcion
            self.db.commit()
        return
    def delete_categoria(self, id_categoria: int):
        categoria = self.db.query(CategoriaModel).filter(CategoriaModel.id_categoria == id_categoria).first()
        if not categoria:
            raise ValueError("La categoría no existe")
        
        self.db.delete(categoria)
        self.db.commit()

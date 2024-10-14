from models.modelos import Producto as ProductoModel
from schemas.producto import Producto


class ProductoService():
    
    def __init__(self, db) -> None:
        self.db = db

    def get_productos(self):
        result = self.db.query(ProductoModel).all()
        return result

    def get_producto_id(self, id_producto: int):
        result = self.db.query(ProductoModel).filter(ProductoModel.id_producto == id_producto).first()
        return result

    def create_producto(self, producto: Producto):
        # Agregar el nuevo atributo 'nombre' al crear un producto
        new_producto = ProductoModel(**producto.dict())
        self.db.add(new_producto)
        self.db.commit()
        return

    def update_producto(self, id_producto: int, data: Producto):
        producto = self.db.query(ProductoModel).filter(ProductoModel.id_producto == id_producto).first()
        if producto:
            # Actualizar también el campo 'nombre' junto con los otros atributos
            producto.nombre = data.nombre
            producto.cod_barra = data.cod_barra
            producto.descripcion = data.descripcion
            producto.precio_coste = data.precio_coste
            producto.precio_final = data.precio_final
            producto.peso = data.peso
            producto.imagen = data.imagen
            producto.id_categoria = data.id_categoria
            self.db.commit()
        return

    def delete_producto(self, id_producto: int):
       self.db.query(ProductoModel).filter(ProductoModel.id_producto == id_producto).delete()
       self.db.commit()
       return

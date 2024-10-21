from models.modelos import VentaProducto as VentaProductoModel
from schemas.ventas import VentaProducto
from typing import List

class VentaProductoService:
    
    def __init__(self, db) -> None:
        self.db = db

    # Obtener todos los productos de todas las ventas
    def get_venta_productos(self):
        result = self.db.query(VentaProductoModel).all()
        return result

    # Obtener los productos de una venta específica por ID de venta
    def get_venta_productos_by_venta_id(self, id_venta: int):
        result = self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta == id_venta).all()
        return result
    
    # Obtener un producto específico de una venta por ID de venta_producto
    def get_venta_producto_by_id(self, id_venta_producto: int):
        result = self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta_producto == id_venta_producto).first()
        return result
    
    # Crear un nuevo producto asociado a una venta
    def create_venta_producto(self, venta_producto: VentaProducto):
        # Procesar el id_categoria si es necesario, pero no lo guardamos en la base de datos
        if venta_producto.id_categoria:
            print(f"Procesando categoría: {venta_producto.id_categoria}")
        
        # Crear el objeto de la base de datos sin id_categoria
        new_venta_producto = VentaProductoModel(
            id_venta=venta_producto.id_venta,  # Asegúrate de pasar este campo correctamente
            id_producto=venta_producto.id_producto,
            cantidad=venta_producto.cantidad,
            subtotal=venta_producto.subtotal
        )
        self.db.add(new_venta_producto)
        self.db.commit()
        self.db.refresh(new_venta_producto)
        return new_venta_producto

    # Actualizar un producto asociado a una venta
    def update_venta_producto(self, id_venta_producto: int, data: VentaProducto):
        venta_producto = self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta_producto == id_venta_producto).first()
        if not venta_producto:
            return None

        # Actualizar los detalles del producto en la venta
        venta_producto.id_venta = data.id_venta
        venta_producto.id_producto = data.id_producto
        venta_producto.cantidad = data.cantidad
        venta_producto.subtotal = data.subtotal

        self.db.commit()
        return venta_producto

    # Eliminar un producto específico de una venta
    def delete_venta_producto(self, id_venta_producto: int):
        venta_producto = self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta_producto == id_venta_producto).first()
        if not venta_producto:
            return None
        
        self.db.delete(venta_producto)
        self.db.commit()
        return venta_producto

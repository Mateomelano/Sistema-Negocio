from models.modelos import Venta as VentaModel, VentaProducto as VentaProductoModel
from schemas.ventas import Venta, VentaProducto
from typing import List


class VentaService:
    
    def __init__(self, db) -> None:
        self.db = db

    # Obtener todas las ventas
    def get_ventas(self):
        result = self.db.query(VentaModel).all()
        return result

    # Obtener una venta por ID
    def get_venta_id(self, id: int):
        result = self.db.query(VentaModel).filter(VentaModel.id_venta == id).first()
        return result
    
    # Crear una nueva venta junto con los productos asociados
    def create_venta(self, venta: Venta, productos: List[VentaProducto]):
        new_venta = VentaModel(
            id_usuario=venta.id_usuario,
            total=venta.total,
            tipo_pago=venta.tipo_pago,
            fecha=venta.fecha
        )
        self.db.add(new_venta)
        self.db.commit()
        self.db.refresh(new_venta)  # Para obtener el id_venta generado

        # Asociar productos a la venta en la tabla intermedia
        for producto in productos:
            new_venta_producto = VentaProductoModel(
                id_venta=new_venta.id_venta,
                id_producto=producto.id_producto,
                cantidad=producto.cantidad
            )
            self.db.add(new_venta_producto)

        self.db.commit()
        return new_venta

    # Actualizar una venta y sus productos asociados
    def update_venta(self, id: int, data: Venta, productos: List[VentaProducto]):
        venta = self.db.query(VentaModel).filter(VentaModel.id_venta == id).first()
        if not venta:
            return None
        
        # Actualizar los detalles de la venta
        venta.id_usuario = data.id_usuario
        venta.total = data.total
        venta.tipo_pago = data.tipo_pago
        venta.fecha = data.fecha
        self.db.commit()

        # Actualizar los productos en la tabla intermedia
        self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta == id).delete()
        for producto in productos:
            updated_venta_producto = VentaProductoModel(
                id_venta=id,
                id_producto=producto.id_producto,
                cantidad=producto.cantidad
            )
            self.db.add(updated_venta_producto)

        self.db.commit()
        return venta

    # Eliminar una venta y sus productos asociados
    def delete_venta(self, id: int):
        self.db.query(VentaProductoModel).filter(VentaProductoModel.id_venta == id).delete()  # Eliminar productos asociados
        self.db.query(VentaModel).filter(VentaModel.id_venta == id).delete()  # Eliminar la venta
        self.db.commit()
        return
